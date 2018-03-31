var Pay1={
	id:null,
	userId:null,
	districtId:null,
	loadHouse:false,
	
	init:function(){
		//CommonUtils.Msg.info("你好");
		//CommonUtils.Msg.alert("错误");
		//CommonUtils.Msg.showQRCode("请先关注公众号","http://photocdn.sohu.com/20150522/mp16015038_1432256655968_2.jpg");
		
		//CommonUtils.LocalStorage.del(Constant.PROJECT_NAME+"_openId");
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
		
		var ua=navigator.userAgent.toLowerCase();
		var isWeixin=ua.indexOf('micromessenger') != -1;
		if(isWeixin){
		   　　 $(document).on('click touchend','.validate',function(){
				//*需要注意的就是事件里边的$(this)指的就是被点击的元素而不是$(document)
				self._click(this);
			});
		}else{
			$(document).on('click','.validate',function(){
				//*需要注意的就是事件里边的$(this)指的就是被点击的元素而不是$(document)
				self._click(this);
			});
		}
		
		
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
					r1+='<td class="validate"><p>'+date+'</p><p id="'+_id+'">￥--</p></td>';
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
						_h2+='<td class="validate"></td>';
					}else{
						var _id=yyyyMMdd[0]+'-'+yyyyMMdd[1]+'-'+(date<10?"0"+date:date);
						_h2+='<td class="validate"><p>'+date+'</p><p id="'+_id+'">￥--</p></td>';
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
						}else{
							//标记无房
							$("#"+date).parent().addClass("gray");
							$("#"+date).html("满房");
						}
						
					}
					
					self.loadHouse=true;
				}
			}
		});
	},
	_click:function(el){
		var self=this;
		if(!self.loadHouse){
			return;
		}
		/*
		 * 
		 * 点击没被选中的
		 * 	找出还有没被选中的/
		 * 		有，则计算他们之间有没“满房”的
		 * 			有满房的，则全部取消
		 * 			无满房的，则选中连续的天
		 * 		无，则选中自己
		 * 
		 * 点击已经被选中的
		 * 如果自己是中间的天
		 * 	则取消全部选中的，再选中自己
		 * 	如果是开始的天，结束的天，则只取消自己的选中状态
		 * 
		 * */
		//td
		var selected=$(".selected");
		if(selected.length<1){
			//还没有任何日期被选中
			var _c=$(el).children();
			var _p2=_c[1];
			if("满房"==$(_p2).text()){
				//入住日期不能为满房
				CommonUtils.Msg.alert("入住日期不能为满房");
			}else{
				$(el).addClass("selected").addClass("on");
			}
		}else{
			//有日期被选中了
			if($(el).hasClass("selected")){
				//对选中的，进行点击，则取消
				$(el).removeClass("selected").removeClass("on");
				
				var selected=$(".selected");
				var selectedLen=selected.length;
				if(selectedLen>1){
					var selected1=selected[0];
					var selected2=el;
					$(".selected").removeClass("on").removeClass("selected");
					//再重新从selected1到selected2全部选中
					var _items1=$(selected1).children();
					var _p1=_items1[1];
					var _time1=$(_p1).attr("id");
					var _t1=TimeUtils.string2Date(_time1+" 00:00:00");
					//console.info(_time1);
					
					var _items2=$(selected2).children();
					var _p2=_items2[1];
					var _time2=$(_p2).attr("id");
					var _t2=TimeUtils.string2Date(_time2+" 00:00:00");
					//console.info(_time2);
					var _tt=TimeUtils.timeDiff(_t2,_t1)/(60*60*24);
					//console.info(_tt);
					var _time=_t1;
					for(var h=0;h<=_tt;h++){
						var timeStr=TimeUtils.date2String(_time,"yyyy-MM-dd");
						$("#"+timeStr).parent().addClass("selected").addClass("on");
						_time=TimeUtils.add(_time,TimeUtils.DAY,1);
					}
					
				}
				self._calc();
			}else{
				//点击了另外一个日期
				//则计算这两个日期之间的日期，是否有满房状态
				
				//拿到第一个日期(日期靠前的，在数组前面)
				var selected_1=selected[0];
				var items1=$(selected_1).children();
				var date1=$(items1[1]).attr("id");
				var time1=TimeUtils.string2Date(date1+" 00:00:00");
				//console.info(date1);
				
				//拿到第二日期(点击本身)
				var items2=$(el).children();
				var date2=$(items2[1]).attr("id");
				var time2=TimeUtils.string2Date(date2+" 00:00:00");
				//console.info(date2);
				//计算两个时间，差多少天
				var diff=TimeUtils.timeDiff(time2,time1)/(60*60*24);
				diff=Math.ceil(diff);
				//console.info(diff);
				if(diff<1){
					//往前面的日期选
					var time=time1;
					var len=diff*-1;
					for(var i=0;i<len;i++){
						time=TimeUtils.add(time,TimeUtils.DAY,-1);
						var timeStr=TimeUtils.date2String(time,"yyyy-MM-dd");
						var _text=$("#"+timeStr).text();
						if("满房"==_text){
							CommonUtils.Msg.alert("选中入住日期有满房的");
							break;
						}else{
							$("#"+timeStr).parent().addClass("selected").addClass("on");
						}
					}
					self._calc();
				}else if(diff==1){
					//选中了相邻的下一天
					$(el).addClass("selected").addClass("on");
					self._calc();
				}else{
					//选中的后面的几天（不是相邻的）
					var time=time1;
					var len=diff*1;
					for(var i=0;i<len;i++){
						time=TimeUtils.add(time,TimeUtils.DAY,1);
						var timeStr=TimeUtils.date2String(time,"yyyy-MM-dd");
						//先选中
						$("#"+timeStr).parent().addClass("selected").addClass("on");
						var _text=$("#"+timeStr).text();
						if("满房"==_text&&i!=(len-1)){
							CommonUtils.Msg.alert("选中入住日期有满房的");
							break;
						}
					}
					self._calc();
				}
			}
		}
	},
	_calc:function(f){
		var self=this;
		var items=$(".selected");
		if(items.length<=1){
			//清空，不计算
			//不计算
			$("#liveOrderAmoun").html("");
			$("#liveDate").html("");
			$("#liveDate").val("");
			$("#leaveDate").val("");
		}else{
			var len=items.length;
			var date1=items[0];
			var t1s=$(date1).children();
			var time1=$(t1s[1]).attr("id");
			var t1s=time1.split("-");
			var t1m=t1s[1]*1;
			var t1d=t1s[2]*1;
			
			//console.info(time1);
			var date2=items[len-1];
			var t2s=$(date2).children();
			var time2=$(t2s[1]).attr("id");
			var t2s=time2.split("-");
			var t2m=t2s[1]*1;
			var t2d=t2s[2]*1;
			//console.info(time2);
			
			var totalOrderAmount=0;
			
			for(var i=0;i<len-1;i++){//最后一天为退房日期，不计算金额
				var els=$(items[i]).children();
				var orderAmount=$(els[1]).text();
				orderAmount=orderAmount.replace("￥","");
				orderAmount=orderAmount*1;
				totalOrderAmount+=orderAmount;
			}
			//console.info(totalOrderAmount);
			
			$("#liveOrderAmoun").html("￥"+totalOrderAmount);
			$("#liveDate").html(t1m+"-"+t1d+"入住，"+t2m+"-"+t2d+"退房");
			$("#liveDate").val(time1);
			$("#leaveDate").val(time2);
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