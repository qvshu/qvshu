var HousePrice={
	_cityWidget:null,
	_districtWidget:null,
	_merchantWidget:null,
	
	
	init:function(){
		var self=this;
		self._render();
		self._bind();
		
		self._getHouseListOfBeOverdue();
		self._getHouseListOfWillBeOverdue();
	},
	_render:function(){
		var self=this;
		var now=new Date();
		var _nowStr=TimeUtils.date2String(now,TimeUtils.FORMAT_YYYYMM);
		var _ym=_nowStr.split("-");
		var _year=_ym[0];
		var _month=_ym[1]*1;
		$("#year").html(_year+"年");
		$("#month").html(_month+"月");
		self._renderDateUI(now);
		
		self._merchantWidget=$("#merchantWidget").ComboBoxWidget({
			url:"/hishu/admin/getMerchantList.json?pageSize=1000",
			textField:"name",
			valueField:"id",
			selectTip:"请选择商户"
		});
		self._cityWidget=$("#cityWidget").ComboBoxWidget({
			url:"/hishu/admin/getCityList.json",
			textField:"name",
			valueField:"id",
			selectTip:"请选择城市",
			onClick:function(item){
				var cityId=item.id;
				CommonUtils.async({
					url:"/hishu/admin/getDistrictList.json",
					data:{cityId:cityId},
					success:function(result){
						if(result.code==0){
							var list=result.data.list||[];
							self._districtWidget.loadData(list);
						}
					}
				});
			}
		});
		
		self._districtWidget=$("#districtWidget").ComboBoxWidget({
			textField:"name",
			valueField:"id",
			selectTip:"请选择小区"
		});
		
		//渲染房源列表
		self._listWidget=$("#tableList").TableWidget({
			url:"/hishu/admin/getHouseList.json",
			cels:[{
				textField:"",
				valueField:"name",
				render:function(value,row){
					var _html='<a style="text-decoration:none" href="javascript:HousePrice.getHouseDayPrice('+row.id+');">'
						+'<p class="t-t">'+value+'</p>'
						+'<p class="t-d">'+row.districtName+'</p>'
						+'</a>';
					return _html;
				}
			}],
			showPagination:false
		});
		
		
	},
	_renderDateUI:function(now){
		var self=this;
		//获取当前月1号时间
		var _nowStr=TimeUtils.date2String(now,TimeUtils.FORMAT_YYYYMM);
		var currentMonthFirstDay=TimeUtils.string2Date(_nowStr,TimeUtils.FORMAT_YYYYMMDDHHMMSS);
		
		//console.info(currentMonthFirstDay);
		var wk=TimeUtils.getWeek(currentMonthFirstDay);
		//console.info(wk);
		var daysOfMonth=TimeUtils.getDaysOfMonth(now);
		//console.info(daysOfMonth);
		if(wk==0){
			wk=6;
		}else{
			wk=wk-1;
		}
		//先清除
		$(".date").html("");
		//后填充
		var date=1;
		
		for(var i=wk;i<daysOfMonth+wk;i++){
			var _d=date;
			if(_d<10){
				_d="0"+_d+"";
			}
			var _id=_nowStr+"-"+_d;
			
			var cell="";
			if(i%7==0){
				//第一列
				cell="cell1";
			}else if(i%7==1){
				//第二列
				cell="cell2";
			}else if(i%7==2){
				//第三列
				cell="cell3";
			}else if(i%7==3){
				//第四列
				cell="cell4";
			}else if(i%7==4){
				//第五列
				cell="cell5";
			}else if(i%7==5){
				//第六列
				cell="cell6";
			}else if(i%7==6){
				//第七列
				cell="cell7";
			}
			
			var _html='<p class="date">'+date+'</p>'
                +'<p><span class="label label-danger">'
                +'<input class="dskInput '+cell+'dsk" id="dsk'+_id+'" type="text" style="width:60px;" placeholder="代收款"></span></p>'
                +'<p><span class="label label-success">'
                +'<input class="ddjInput '+cell+'ddj" id="ddj'+_id+'" type="text" style="width:60px;" placeholder="定价单"></span></p>';
			$("#id"+i).html(_html);
			date++;
		}
		
	},
	_bind:function(){
		var self=this;
		$("#searchBtn").unbind("click").click(function(){
			var param={};
			var cityId=self._cityWidget.getValue();
			if(cityId&&cityId!=""){
				param.cityId=cityId;
			}
			var districtId=self._districtWidget.getValue();
			if(districtId&&districtId!=""){
				param.districtId=districtId;
			}
			var merchantId=self._merchantWidget.getValue();
			if(merchantId&&merchantId!=""){
				param.merchantId=merchantId;
			}
			var name=$("#name").val();
			if(name&&name!=""){
				param.likeName=name;
			}
			
			self._listWidget.query(param);
		});
		
		//上一年
		$("#previousYear").unbind("click").click(function(){
			var _year=$("#year").html();
			_year=_year.replace("年","");
			_year=_year*1;
			var _month=$("#month").html();
			_month=_month.replace("月","");
			_month=_month*1;
			if(_month<10){
				_month="0"+_month+"";
			}
			
			var _dateStr=(_year-1)+"-"+_month+"-01 00:00:00";
			var _date=TimeUtils.string2Date(_dateStr);
			
			$("#year").html((_year-1)+"年");
			
			self._renderDateUI(_date);
		});
		//下一年
		$("#nextYear").unbind("click").click(function(){
			var _year=$("#year").html();
			_year=_year.replace("年","");
			_year=_year*1;
			var _month=$("#month").html();
			_month=_month.replace("月","");
			_month=_month*1;
			if(_month<10){
				_month="0"+_month+"";
			}
			
			var _dateStr=(_year+1)+"-"+_month+"-01 00:00:00";
			var _date=TimeUtils.string2Date(_dateStr);
			
			$("#year").html((_year+1)+"年");
			
			self._renderDateUI(_date);
		});
		
		//上个月
		$("#previousMonth").unbind("click").click(function(){
			var _year=$("#year").html();
			_year=_year.replace("年","");
			_year=_year*1;
			var _month=$("#month").html();
			_month=_month.replace("月","");
			_month=_month*1-1;
			if(_month==0){
				_month=12;
				_year=_year-1;
				$("#year").html(_year+"年");
			}
			$("#month").html(_month+"月");
			
			if(_month<10){
				_month="0"+_month+"";
			}
			var _dateStr=_year+"-"+_month+"-01 00:00:00";
			var _date=TimeUtils.string2Date(_dateStr);
			self._renderDateUI(_date);
		});
		//下个月
		$("#nextMonth").unbind("click").click(function(){
			var _year=$("#year").html();
			_year=_year.replace("年","");
			_year=_year*1;
			var _month=$("#month").html();
			_month=_month.replace("月","");
			_month=_month*1+1;
			if(_month==13){
				_month=1;
				_year=_year+1;
				$("#year").html(_year+"年");
			}
			$("#month").html(_month+"月");
			
			if(_month<10){
				_month="0"+_month+"";
			}
			var _dateStr=_year+"-"+_month+"-01 00:00:00";
			var _date=TimeUtils.string2Date(_dateStr);
			self._renderDateUI(_date);
		});
		
		//价格类型
		$("#priceType_collection").click(function(){
			$("#commissionRate").addClass("hide");
			$("#commissionRate").val("");
		});
		//价格类型
		$("#priceType_commission").click(function(){
			$("#commissionRate").removeClass("hide");
		});
		
		//价格输入框回车事件
		$(document).find(".ddjInput").unbind("keypress").bind("keypress",function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$(this).val();
				var _id=$(this).attr("id");
				_id=_id.replace("ddj","");
				if(_value&&_value!=""){
					self._saveOrderAmount(_id,_value);
				}
			}
		});
		//价格输入框回车事件
		$(document).find(".dskInput").unbind("keypress").bind("keypress",function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$(this).val();
				var _id=$(this).attr("id");
				_id=_id.replace("dsk","");
				if(_value&&_value!=""){
					self._saveCollectionAmount(_id,_value);
				}
			}
		});
		
		//自动填充订单价
		/*$("#cell1_ddj").bind('input propertychange',function(){
			var _value=$("#cell1_ddj").val();
			console.info(_value);
		});*/
		$("#cell1_ddj").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell1_ddj").val();
				//自动填充订单价
				$(".cell1ddj").val(_value);
				self._batchSaveOrderAmount("cell1",_value);
			}
		});
		$("#cell1_dsk").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell1_dsk").val();
				//自动填充订单价
				var _dsk=self._calc_dsk(_value);
				$(".cell1dsk").val(_dsk);
				if(_dsk!=""){
					self._batchSaveCollectionAmount("cell1",_dsk);
				}
				
			}
		});
		
		$("#cell2_ddj").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell2_ddj").val();
				//自动填充订单价
				$(".cell2ddj").val(_value);
				self._batchSaveOrderAmount("cell2",_value);
			}
		});
		$("#cell2_dsk").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell2_dsk").val();
				//自动填充订单价
				var _dsk=self._calc_dsk(_value);
				$(".cell2dsk").val(_dsk);
				if(_dsk!=""){
					self._batchSaveCollectionAmount("cell2",_dsk);
				}
			}
		});
		
		$("#cell3_ddj").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell3_ddj").val();
				//自动填充订单价
				$(".cell3ddj").val(_value);
				self._batchSaveOrderAmount("cell3",_value);
			}
		});
		$("#cell3_dsk").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell3_dsk").val();
				//自动填充订单价
				var _dsk=self._calc_dsk(_value);
				$(".cell3dsk").val(_dsk);
				if(_dsk!=""){
					self._batchSaveCollectionAmount("cell3",_dsk);
				}
			}
		});
		
		$("#cell4_ddj").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell4_ddj").val();
				//自动填充订单价
				$(".cell4ddj").val(_value);
				self._batchSaveOrderAmount("cell4",_value);
			}
		});
		$("#cell4_dsk").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell4_dsk").val();
				//自动填充订单价
				var _dsk=self._calc_dsk(_value);
				$(".cell4dsk").val(_dsk);
				if(_dsk!=""){
					self._batchSaveCollectionAmount("cell4",_dsk);
				}
			}
		});
		
		$("#cell5_ddj").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell5_ddj").val();
				//自动填充订单价
				$(".cell5ddj").val(_value);
				self._batchSaveOrderAmount("cell5",_value);
			}
		});
		$("#cell5_dsk").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell5_dsk").val();
				//自动填充订单价
				var _dsk=self._calc_dsk(_value);
				$(".cell5dsk").val(_dsk);
				if(_dsk!=""){
					self._batchSaveCollectionAmount("cell5",_dsk);
				}
			}
		});
		
		$("#cell6_ddj").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell6_ddj").val();
				//自动填充订单价
				$(".cell6ddj").val(_value);
				self._batchSaveOrderAmount("cell6",_value);
			}
		});
		$("#cell6_dsk").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell6_dsk").val();
				//自动填充订单价
				var _dsk=self._calc_dsk(_value);
				$(".cell6dsk").val(_dsk);
				if(_dsk!=""){
					self._batchSaveCollectionAmount("cell6",_dsk);
				}
			}
		});
		
		$("#cell7_ddj").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell7_ddj").val();
				//自动填充订单价
				$(".cell7ddj").val(_value);
				self._batchSaveOrderAmount("cell7",_value);
			}
		});
		$("#cell7_dsk").bind('keypress',function(event){
			if(event.keyCode=="13"&&self._currentHouseId!=null){
				var _value=$("#cell7_dsk").val();
				//自动填充订单价
				var _dsk=self._calc_dsk(_value);
				$(".cell7dsk").val(_dsk);
				if(_dsk!=""){
					self._batchSaveCollectionAmount("cell7",_dsk);
				}
			}
		});
		
		//统计已过期
		$("#beOverdueFilter").click(function(){
			var _html=$("#beOverdue").html();
			//还没加载完成，则不能点击
			if(""==_html){
				return;
			}
			self._listWidget._loadData(self._houseListOfBeOverdue,1,self._houseListOfBeOverdue.length);
		});
		
		//统计即将过期
		$("#willBeOverdueFilter").click(function(){
			var _html=$("#willBeOverdue").html();
			//还没加载完成，则不能点击
			if(""==_html){
				return;
			}
			self._listWidget._loadData(self._houseListOfWillBeOverdue,1,self._houseListOfWillBeOverdue.length);
		});
	},
	_calc_dsk:function(amount){
		var self=this;
		//先看选择中计算类型
		//价格类型（collection-代收款，commission-佣金）
		var priceType=$("input[name='priceType']:checked").val();
		if("commission"==priceType){
			//如果是佣金类型，则需要填佣金比率
			var commissionRate=$("#commissionRate").val();
			if(!commissionRate||commissionRate==""){
				CommonUtils.Msg.alert("请先设置佣金比率");
				return "";
			}
			var _value=(amount*1*commissionRate*1).toFixed(2);
			return _value;
		}else{
			return amount;
		}
	},
	_currentHouseId:null,
	getHouseDayPrice:function(houseId){
		var self=this;
		self._currentHouseId=houseId;
		var _year=$("#year").html();
		_year=_year.replace("年","");
		var _month=$("#month").html();
		_month=_month.replace("月","");
		_month=_month*1;
		if(_month<10){
			_month="0"+_month+"";
		}
		
		var startTime=_year+"-"+_month+"-01 00:00:00";
		var sTime=TimeUtils.string2Date(startTime);
		//计算该时间的月份有多少天
		var dayCount=TimeUtils.getDaysOfMonth(sTime);
		var endTime=_year+"-"+_month+"-"+dayCount+" 23:59:59";
		
		var param={
			houseId:houseId,
			startTime:startTime,
			endTime:endTime
		}
		//console.info(param);
		CommonUtils.async({
			url:"/hishu/admin/getHouseDayPriceList.json",
			data:param,
			success:function(result){
				if(result.code==0){
					var list=result.data.list||[];
					//先清空所有的值
					$(".dskInput").val("");
					$(".ddjInput").val("");
					/*
					collectionAmount:0	代收款
					commissionRate:0	佣金比率
					day:"2018-02-03"
					houseId:25
					id:1
					orderAmount:0		订单价
					priceType:"100"
					 * 
					 * */
					for(var i=0,len=list.length;i<len;i++){
						var dp=list[i];
						var day=dp.day;
						
						$("#dsk"+day).val(dp.collectionAmount);
						$("#ddj"+day).val(dp.orderAmount);
					}
					
				}
			}
		});
	},
	/**
	 * 保存订单价
	 * @param amount
	 */
	_saveOrderAmount:function(day,amount){
		var self=this;
		if(self._currentHouseId==null){
			CommonUtils.Msg.alert("请先选择房源");
			return;
		}
		
		var houseDayPrice={
			houseId:self._currentHouseId,
			orderAmount:amount,
			day:day+" 00:00:00"
		};
		
		//console.info(houseDayPrice);
		CommonUtils.async({
			url:"/hishu/admin/editHouseDayPrice.json",
			data:houseDayPrice,
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功");
				}else{
					CommonUtils.Msg.alert("失败");
				}
			},
			error:function(result){
				CommonUtils.Msg.alert("失败");
			}
		});
	},
	/**
	 * 批量保存订单价
	 */
	_batchSaveOrderAmount:function(cell,amount){
		var self=this;
		
		var _inputList=$("."+cell+"ddj");
		//console.info(_inputList);
		var list=[];
		for(var i=0,len=_inputList.length;i<len;i++){
			var el=_inputList[i];
			var day=$(el).attr("id");
			day=day.replace("ddj","");
			//houseId=15&day=2018-02-02&orderAmount=11&collectionAmount=111
			/*var dp={
				houseId:self._currentHouseId,
				day:day+" 00:00:00",
				orderAmount:amount
			};*/
			var dp="houseId="+self._currentHouseId
				+"&day="+day+" 00:00:00"
				+"&orderAmount="+amount;
			list.push(dp);
		}
		//console.info(list);
		if(list.length==0){
			return;
		}
		CommonUtils.async({
			url:"/hishu/admin/editHouseDayPriceList.json",
			data:{houseDayPrice:list},
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功");
				}else{
					CommonUtils.Msg.alert("失败");
				}
			},
			error:function(result){
				CommonUtils.Msg.alert("失败");
			}
		});
	},
	_saveCollectionAmount:function(day,amount){
		var self=this;
		if(self._currentHouseId==null){
			CommonUtils.Msg.alert("请先选择房源");
			return;
		}
		
		var houseDayPrice={
			houseId:self._currentHouseId,
			collectionAmount:amount,
			day:day+" 00:00:00"
		};
		
		//console.info(houseDayPrice);
		CommonUtils.async({
			url:"/hishu/admin/editHouseDayPrice.json",
			data:houseDayPrice,
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功");
				}else{
					CommonUtils.Msg.alert("失败");
				}
			},
			error:function(result){
				CommonUtils.Msg.alert("失败");
			}
		});
	},
	_batchSaveCollectionAmount:function(cell,amount){
		var self=this;
		
		var _inputList=$("."+cell+"dsk");
		//console.info(_inputList);
		var list=[];
		for(var i=0,len=_inputList.length;i<len;i++){
			var el=_inputList[i];
			var day=$(el).attr("id");
			day=day.replace("dsk","");
			//houseId=15&day=2018-02-02&orderAmount=11&collectionAmount=111
			/*var dp={
				houseId:self._currentHouseId,
				day:day+" 00:00:00",
				orderAmount:amount
			};*/
			var dp="houseId="+self._currentHouseId
				+"&day="+day+" 00:00:00"
				+"&collectionAmount="+amount;
			list.push(dp);
		}
		//console.info(list);
		if(list.length==0){
			return;
		}
		CommonUtils.async({
			url:"/hishu/admin/editHouseDayPriceList.json",
			data:{houseDayPrice:list},
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功");
				}else{
					CommonUtils.Msg.alert("失败");
				}
			},
			error:function(result){
				CommonUtils.Msg.alert("失败");
			}
		});
	},
	/**
	 * 获取已经过期的房源
	 */
	_houseListOfBeOverdue:[],
	_getHouseListOfBeOverdue:function(){
		var self=this;
		
		CommonUtils.async({
			url:"/hishu/admin/getHouseListOfBeOverdue.json",
			data:{},
			success:function(result){
				if(result.code==0){
					self._houseListOfBeOverdue=result.data.list||[];
					var total=result.data.total||0;
					$("#beOverdue").html(total);
				}
			}
		});
	},
	_houseListOfWillBeOverdue:[],
	_getHouseListOfWillBeOverdue:function(){
		var self=this;
		CommonUtils.async({
			url:"/hishu/admin/getHouseListOfWillBeOverdue.json",
			data:{},
			success:function(result){
				if(result.code==0){
					self._houseListOfWillBeOverdue=result.data.list||[];
					var total=result.data.total||0;
					$("#willBeOverdue").html(total);
				}
			}
		});
	}
}
$(function(){
	HousePrice.init();
});