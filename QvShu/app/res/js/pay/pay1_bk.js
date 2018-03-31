var Pay1={
	id:null,
	userId:null,
	districtId:null,
	loadHouse:false,
	
	init:function(){
		//CommonUtils.Msg.info("你好");
		//CommonUtils.Msg.alert("错误");
		//CommonUtils.Msg.showQRCode("请先关注公众号","http://photocdn.sohu.com/20150522/mp16015038_1432256655968_2.jpg");
		
		CommonUtils.LocalStorage.del(Constant.PROJECT_NAME+"_openId");
		var self=this;
		self.id=CommonUtils.getQueryString("id");
		var openId=CommonUtils.getQueryString("openId");
		if(openId&&openId!=""){
			//并缓存于store
			CommonUtils.LocalStorage.addString(Constant.PROJECT_NAME+"_openId",self.openId);
		}
		self._render();
		self._bind();
		self._getHouseStatus();
	},
	_render:function(){
		var self=this;
		//获取当前日期
		var now=new Date();
		var nowStr=TimeUtils.date2String(now,TimeUtils.FORMAT_YYYYMMDD);
		var nextMonth=TimeUtils.add(now,TimeUtils.MONTH,1);
		var nextMonthStr=TimeUtils.date2String(nextMonth,TimeUtils.FORMAT_YYYYMM);
		self._renderCalender("calendar1", nowStr);
		self._renderCalender("calendar2", nextMonthStr+"-01");
		
	},
	_bind:function(){
		var self=this;
		
		/*
		$(document).on('click','.selected',function(){
			//*需要注意的就是事件里边的$(this)指的就是被点击的元素而不是$(document)
			if(self._selectDate1!=null&&self._selectDate2!=null){
				$(".selected").removeClass("selected").removeClass("on");
			}
		});
		*/
		$("#bookBtn").unbind("click").click(function(){
			self._book();
		});
		
		$("#submitOrderBtn").unbind("click").click(function(){
			self._submitOrder();
		});
		
		$("#genOrderBtn").unbind("click").click(function(){
			self._genOrder();
		});
		
	},
	/**
	 * eid    uuid
	 * currentDate  2018-02-13
	 */
	_renderCalender:function(eid,currentDate){
		var self=this;
		
		var yyyyMMdd=currentDate.split("-");
		var yyyy=yyyyMMdd[0]*1;
		var MM=yyyyMMdd[1]*1;
		var dd=yyyyMMdd[2]*1;
		
		//月份的第一天
		var firstDate=yyyy+"-"+yyyyMMdd[1]+"-01 00:00:00";
		var fdate=TimeUtils.string2Date(firstDate);
		//计算第一天是星期几
		var fdateWeek=TimeUtils.getWeek(fdate);
		fdateWeek=fdateWeek==0?7:fdateWeek;
		
		//计算这个月有多少天
		var days=0;
		if (MM==1 || MM==3 || MM==5 || MM==7 || MM==8 || MM==10 || MM==12)
			days=31;
		else if (MM==4 || MM==6 || MM==9 || MM==11)
			days=30;
		else if (MM==2) {
			if (yyyy%4==0){//闰月
				days=29;
			}else {
				days=28;
			}
		}
		
		var _html='<p class="date-title">选择入住日期</p>'
				+'<p class="date-title">'+yyyy+'年 '+MM+'月</p>'
				+'<table class="chouse-date" cellspacing="0">'
				+'<tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr>';
		
		
		//第一行
		var date=1;
		var r1='<tr>';
		for(var i1=1;i1<=7;i1++){
			if(i1<fdateWeek){
				r1+='<td class="gray"></td>';
			}else{
				if(date<dd){
					//比当前日期小，则变灰色
					r1+='<td class="gray">'+date+'</td>';
				}else{
					var _id=yyyyMMdd[0]+'-'+yyyyMMdd[1]+'-'+(date<10?"0"+date:date);
					r1+='<td class=""><p>'+date+'</p><p id="'+_id+'">￥--</p></td>';
				}
				date++;
			}
		}
		r1+='</tr>';
		
		_html+=r1;
		
		//计算还需要多少行
		var rCount=Math.ceil((days-(date-1))/7);
		//console.info(days+"    "+date);
		var _h2='';
		for(var i2=0;i2<rCount;i2++){
			_h2+='<tr>';
			//生成每行的列
			for(var j=0;j<7;j++){
				if(date<dd){
					//比当前日期小，则变灰
					_h2+='<td class="gray">'+date+'</td>';
				}else{
					if(date>days){
						_h2+='<td class=""></td>';
					}else{
						var _id=yyyyMMdd[0]+'-'+yyyyMMdd[1]+'-'+(date<10?"0"+date:date);
						_h2+='<td class=""><p>'+date+'</p><p id="'+_id+'">￥--</p></td>';
					}
				}
				date++;
			}
			_h2+='</tr>';
		}
		_html+=_h2;
		
		_html+='</table>';
		
		$("#"+eid).html(_html);
	},
	_getHouseStatus:function(){
		var self=this;
		
		CommonUtils.async({
			url:"/hiweb/house/getHouseStatus.json",
			data:{id:self.id},
			success:function(result){
				if(result.code==0){
					var data=result.data;
					var house=data.house;
					self.districtId=house.districtId;
					self._getThirdPartyProductList();
					var houseStatusList=data.houseStatusList||[];
					
					$(".houseImg").attr("src",(house.houseImg||"/app/res/img/hotel/hotel.jpg"));
					$(".houseName").html(house.name);
					$(".roomCount").html(house.layoutRoom+"房 | "+(house.bedCount||"--")+"床 | 宜住"+house.liveCount+"人");
					$(".cityDistrict").html(house.cityName+"."+(house.districtName||""));
					
					var houseAttributes=house.houseAttributes||"";
					var items=houseAttributes.split(",");
					var _as='';
					for(var i=0,len=items.length;i<len;i++){
						_as+='<span>'+items[i]+'</span>';
					}
					$(".houseAttributes").html(_as);
					
					//填充房态信息
					for(var i=0,len=houseStatusList.length;i<len;i++){
						var hs=houseStatusList[i];
						
						var date=hs.date;
						var status=hs.status;//房态（0-无房，1-有房,2-标记无房）
						var orderAmount=hs.orderAmount||0;
						
						if(status==1){
							$("#"+date).html("￥"+(orderAmount||"--"));
							//设置点击事件
							$("#"+date).parent().unbind("click").click(function(){
								self._clik(this);
							});
						}else{
							//标记无房
							$("#"+date).parent().addClass("gray");
							$("#"+date).html("满房");
							$("#"+date).parent().unbind("click").click(function(){
								self._clik(this);
							});
						}
						
					}
					
					self.loadHouse=true;
				}
			}
		});
	},
	_selectDate1:null,
	_selectDate2:null,
	_clik:function(el){
		var self=this;
		if(!self.loadHouse){
			return;
		}
		var children=$(el).children();
		var dateEl=children[0];
		var amountEl=children[1];
		
		//var date=$(dateEl).text();
		var amount=$(amountEl).text();
		var date=$(amountEl).attr("id");
		//alert(date+"   "+amount);
		
		//console.info("_selectDate1:"+self._selectDate1);
		//console.info("_selectDate1:"+self._selectDate2);
		self._calc(false);
		
		if(self._selectDate1==null){
			self._selectDate1=date;
			//变换class
			$(el).addClass("on");
			$(el).addClass("selected");
		}else if(self._selectDate1==date){
			//第二次点击这个日期，则视为取消
			$(el).removeClass("on");
			$(el).removeClass("selected");
			self._selectDate1=null;
			
			self._calc(true);
		}else if(self._selectDate2==null){
			self._selectDate2=date;
			//变换class
			$(el).addClass("on");
			$(el).addClass("selected");
			var time1=null;
			var time2=null;
			//如果间隔还有日期，则也自动选上
			if(self._selectDate1>self._selectDate2){
				time1=TimeUtils.string2Date(self._selectDate2+" 00:00:00");
				time2=TimeUtils.string2Date(self._selectDate1+" 00:00:00");
			}else{
				time1=TimeUtils.string2Date(self._selectDate1+" 00:00:00");
				time2=TimeUtils.string2Date(self._selectDate2+" 00:00:00");
			}
			//计算两个时间，差多少天
			var diff=TimeUtils.timeDiff(time2,time1)/(60*60*24);
			diff=Math.ceil(diff);
			//alert(diff);
			if(diff!=1){
				var time=time1;
				//相差超过一天，则其他连续的天，自动选上
				for(var i=0;i<diff-1;i++){//最后一天已经选上了
					time=TimeUtils.add(time,TimeUtils.DAY,1);
					var timeStr=TimeUtils.date2String(time,"yyyy-MM-dd");
					//console.info(timeStr);
					//如果中间有满房的，则提示有满房，不能选择
					var noHouse=$("#"+timeStr).text();
					if("满房"==noHouse){
						self._selectDate1=null;
						self._selectDate2=null;
						//变换class
						$(".selected").removeClass("on");
						$(".selected").removeClass("selected");
						CommonUtils.Msg.alert("中间已有满房");
						//alert("中间已有满房");
						return;
					}else{
						//自动选上
						$("#"+timeStr).parent().addClass("on").addClass("selected");
					}
					
				}
			}
			
			self._calc(true);
		}else if(self._selectDate2==date){
			//第二次点击这个日期，则视为取消
			$(el).removeClass("on");
			$(el).removeClass("selected");
			self._selectDate2=null;
			
			self._calc(true);
		}else if($(el).hasClass("selected")){
			self._selectDate1=null;
			self._selectDate2=null;
			$(".selected").removeClass("on").removeClass("selected");
		}
	},
	_calc:function(f){
		var self=this;
		if(f){
			var items=$(".selected");
			if(items&&items.length>1){
				var date1="";
				var date2="";
				var totalAmount=0;
				for(var i=0,len=items.length;i<len;i++){
					var el=items[i];
					var children=$(el).children();
					//最后一个为退房日期，不计算金额
					if(i!=len-1){
						var amount=$(children[1]).text();
						amount=amount.replace("￥","");
						amount=amount*1;
						totalAmount+=amount;
					}
					
					if(i==0){
						date1=$(children[1]).attr("id");
					}
					if(i==(len-1)){
						date2=$(children[1]).attr("id");
					}
				}
				
				//console.info(date1+"  "+date2+"   "+totalAmount);
				var t1s=date1.split("-");
				var t1m=t1s[1]*1;
				var t1d=t1s[2]*1;
				
				var t2s=date2.split("-");
				var t2m=t2s[1]*1;
				var t2d=t2s[2]*1;
				
				$("#liveOrderAmoun").html("￥"+totalAmount);
				$("#liveDate").html(t1m+"-"+t1d+"入住，"+t2m+"-"+t2d+"退房");
				$("#liveDate").val(date1);
				$("#leaveDate").val(date2);
			}
		}else{
			//不计算
			$("#liveOrderAmoun").html("");
			$("#liveDate").html("");
			$("#liveDate").val("");
			$("#leaveDate").val("");
		}
		
	},
	_book:function(){
		var self=this;
		var startTime=$("#liveDate").val();
		var endTime=$("#leaveDate").val();
		
		//console.info(startTime+"   "+endTime);
		if(!self.id||self.id==""){
			return;
		}
		if(startTime==""){
			return;
		}
		if(endTime==""){
			return;
		}
		//location.href="/app/pay/pay2.html?id="+self.id+"&startTime="+startTime+"&endTime="+endTime;
		var totalAmount=$("#liveOrderAmoun").html();
		totalAmount=totalAmount.replace("￥","");
		totalAmount=totalAmount*1;
		$("#totalAmount").html("实付款：￥"+totalAmount);
		$("#orderAmount").html("实付款：￥"+totalAmount);//第三页用
		
		$("#pay1").addClass("hide");
		$("#pay2").removeClass("hide");
		
	},
	_submitOrder:function(){
		var self=this;
		var userName=$("#userName").val();
		if(!userName||userName==""){
			CommonUtils.Msg.alert("请先填写用户名");
			//alert("请先填写用户名");
			return;
		}
		var userPhone=$("#userPhone").val();
		if(!userPhone||userPhone==""){
			//alert("请先填写用户手机号");
			CommonUtils.Msg.alert("请先填写用户手机号");
			return;
		}
		var openId=CommonUtils.LocalStorage.getString(Constant.PROJECT_NAME+"_openId");
		if(!openId||openId==""){
			var url=location.href;
			var items=url.split("?");
			url=items[0];
			url+="?id="+self.id+"&openId=OPEN_ID";
			var p={
				action:"createOrderUser",
				content:encodeURIComponent("欢迎预定别墅，<a href='"+url+"'>继续预定</a>")
			};
			//没有openId，弹出二维码
			CommonUtils.async({
				url:"/hiweb/wx/createQrCode.json",
				data:p,
				success:function(result){
					if(result.code==0){
						CommonUtils.Msg.showQRCode("请先关注公众号",result.data);
						//alert(result.data);
					}
				}
			});
			
			return;
		}
		
		var param={
			openId:openId,
			userName:userName,
			userPhone:userPhone
		};
		//到后台生成用户
		CommonUtils.async({
			url:"/hiweb/order/createUser.json",
			data:param,
			success:function(result){
				if(result.code==0){
					var user=result.data;
					self.userId=user.id;
					$("#userName2").val(userName);
					$("#userPhone2").val(userPhone);
					
					$("#pay2").addClass("hide");
					$("#pay3").removeClass("hide");
				}else{
					CommonUtils.Msg.alert("生成用户失败");
					//alert("生成用户失败");
				}
			},
			error:function(result){
				//alert("生成用户失败");
				CommonUtils.Msg.alert("生成用户失败");
			}
		});
	},
	_getThirdPartyProductList:function(){
		var self=this;
		CommonUtils.async({
			url:"/hiweb/house/getThirdPartyProductList.json",
			data:{districtId:self.districtId},
			success:function(result){
				if(result.code==0){
					var list=result.data||[];
					var _html='';
					for(var i=0,len=list.length;i<len;i++){
						var product=list[i];
						_html+='<p class="cofiom-price">'
							+'<span class="w-l">'+product.name+'</span>'
			                +'<span class="w-r"><span class="tips-txt">介绍</span>'
			                +'<a href="javascript:Pay1.reduce('+product.id+','+product.singlePrice+')"> - </a>'
			                +'<span class="tpproduct" id="product_'+product.id+'">0</span>'
			                +'<a href="javascript:Pay1.plus('+product.id+','+product.singlePrice+')"> + </a></span>'
			                +'</p>';
					}
					if(list.length>0){
						_html+='<p class="cofiom-price">'
							+'<span class="w-l">实付金额：</span>'
			                +'<span id="productTotalAmount" class="w-r">￥0</span>'
			                +'</p>';
					}
					
					$("#thirdPatyProductList").after(_html);
				}
			}
		});
	},
	plus:function(productId,amount){
		var self=this;
		var c=$("#product_"+productId).text();
		c=c*1
		c++;
		if(c<0){
			c=0;
			$("#product_"+productId).html(c);
			return;
		}
		$("#product_"+productId).html(c);
		if(amount){
			var total=$("#productTotalAmount").text();
			total=total.replace("￥","");
			total=total*1
			total+=amount*1;
			$("#productTotalAmount").html("￥"+total);
			//往总金额加
			var orderAmount=$("#orderAmount").text();
			orderAmount=orderAmount.replace("实付款：￥","");
			orderAmount=orderAmount*1;
			
			orderAmount+=amount;
			$("#orderAmount").html("实付款：￥"+orderAmount);
		}
	},
	reduce:function(productId,amount){
		var self=this;
		var c=$("#product_"+productId).text();
		c=c*1
		c--;
		if(c<0){
			return;
		}
		$("#product_"+productId).html(c);
		if(amount){
			var total=$("#productTotalAmount").text();
			total=total.replace("￥","");
			total=total*1
			total=total-(amount*1);
			$("#productTotalAmount").html("￥"+total);
			
			var orderAmount=$("#orderAmount").text();
			orderAmount=orderAmount.replace("实付款：￥","");
			orderAmount=orderAmount*1;
			
			orderAmount=orderAmount-(amount*1);
			$("#orderAmount").html("实付款：￥"+orderAmount);
		}
	},
	_genOrder:function(){
		var self=this;
		
		var liveDate=$("#liveDate").val();
		var leaveDate=$("#leaveDate").val();
		if(!liveDate||liveDate==""){
			//alert("请先选择入住日期");
			CommonUtils.Msg.alert("请先选择入住日期");
			return;
		}
		if(!leaveDate||leaveDate==""){
			//alert("请先选择退房日期");
			CommonUtils.Msg.alert("请先选择退房日期");
			return;
		}
		
		var userName=$("#userName2").val();
		var userPhone=$("#userPhone2").val();
		if(!userName||userName==""){
			//alert("请先填写用户名");
			CommonUtils.Msg.alert("请先填写用户名");
			return;
		}
		if(!userPhone||userPhone==""){
			//alert("请先填写用户手机号");
			CommonUtils.Msg.alert("请先填写用户手机号");
			return;
		}
		//选购的第三方产品
		var thirdPartyProductList=[];
		var items=$(".tpproduct");
		if(items&&items.length>0){
			//看他们的熟练是否为0
			for(var i=0,len=items.length;i<len;i++){
				var pc=$(items[i]).text();
				pc=pc*1;
				if(pc>0){
					var pid=$(items[i]).attr("id");
					pid=pid.replace("product_","");
					thirdPartyProductList.push(pid+"-"+pc);
				}
			}
		}
		
		var openId=CommonUtils.LocalStorage.getString(Constant.PROJECT_NAME+"_openId");
		if(!openId||openId==""){
			//alert("请先关注公众号");
			CommonUtils.Msg.alert("请先关注公众号");
			return;
		}
		
		var orderAmount=$("#orderAmount").html();
		orderAmount=orderAmount.replace("实付款：￥","");
		if(!orderAmount||orderAmount==""){
			//alert("订单金额错误");
			CommonUtils.Msg.alert("订单金额错误");
			return;
		}
		
		var order={
			openId:openId,
			userId:self.userId,
			houseId:self.id,
			liveDate:liveDate,
			leaveDate:leaveDate,
			userName:userName,
			userPhone:userPhone,
			orderAmount:orderAmount,
			thirdPartyProduct:thirdPartyProductList
		};
		
		//console.info(order);
		CommonUtils.async({
			url:"/hiweb/order/bookHouse.json",
			data:order,
			success:function(result){
				if(result.code==0){
					//alert("预定成功");
					$("#userName3").html(userName);
					$("#userPhone3").html(userPhone);
					$("#orderAmount3").html("￥"+orderAmount);
					$("#totalAmount3").html("￥"+orderAmount);
					$("#payAmount3").html("￥"+orderAmount);
					$("#liveleaveTime").html(liveDate+" "+leaveDate);
					
					$("#pay3").addClass("hide");
					$("#pay4").removeClass("hide");
				}else{
					CommonUtils.Msg.alert(result.msg);
					//alert("预定失败");
				}
			},
			error:function(result){
				//alert("预定失败");
				CommonUtils.Msg.alert("预定失败");
			}
		});
	}
}
$(function(){
	Pay1.init();
});