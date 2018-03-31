var HouseStatus={
	_cityWidget:null,
	_districtWidget:null,
	_houseCountWidget:null,
	_liveCountWidget:null,
	_merchantWidget:null,
	_listWidget:null,
	_currentHouseId:null,
	
	init:function(){
		var self=this;
		self._render();
		self._bind();
		//self._getHouseDayStatusList();
	},
	_render:function(){
		var self=this;
		
		var now=new Date();
		var _nowStr=TimeUtils.date2String(now,TimeUtils.FORMAT_YYYYMM);
		$("#yyyyMM").html(_nowStr);
		self._renderDateUI(now);
		
		self._listWidget=$("#tableList").TableWidget({
			url:"/hishu/admin/getHouseList.json",
			pageSize:5,
			cels:[{
				textField:"",
				valueField:"cityName",
				render:function(value,row){
					var _html='<a href="javascript:HouseStatus.getHouseDayStatusList('+row.id+');" style="text-decoration:none">'+value+'</a>';
					return _html;
				}
			},{
				textField:"",
				valueField:"districtName"
			},{
				textField:"",
				valueField:"merchantName"
			},{
				textField:"",
				valueField:"name"
			}]
		});
		
		self._cityWidget=$("#cityWidget").ComboBoxWidget({
			url:"/hishu/admin/getCityList.json",
			textField:"name",
			valueField:"id",
			selectTip:"城市",
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
			selectTip:"小区"
		});
		
		self._merchantWidget=$("#merchantWidget").ComboBoxWidget({
			url:"/hishu/admin/getMerchantList.json?pageSize=1000",
			textField:"name",
			valueField:"id",
			selectTip:"商户"
		});
		
		self._houseCountWidget=$("#houseCountWidget").ComboBoxWidget({
			textField:"name",
			valueField:"value",
			selectTip:"房间数",
			data:[{
				name:"1",
				value:1
			},{
				name:"2",
				value:2
			},{
				name:"3",
				value:3
			},{
				name:"4",
				value:4
			},{
				name:"5",
				value:5
			},{
				name:"6",
				value:6
			},{
				name:"7",
				value:7
			},{
				name:"8",
				value:8
			}]
		});
		
		self._liveCountWidget=$("#liveCountWidget").ComboBoxWidget({
			textField:"name",
			valueField:"value",
			selectTip:"入住人数",
			data:[{
				name:"1",
				value:1
			},{
				name:"2",
				value:2
			},{
				name:"3",
				value:3
			},{
				name:"4",
				value:4
			},{
				name:"5",
				value:5
			},{
				name:"6",
				value:6
			},{
				name:"7",
				value:7
			},{
				name:"8",
				value:8
			}]
		});
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
			var roomCount=self._houseCountWidget.getValue();
			if(roomCount&&roomCount!=""){
				param.layoutRoom=roomCount;
			}
			var liveCount=self._liveCountWidget.getValue();
			if(liveCount&&liveCount!=""){
				param.liveCount=liveCount;
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
		
		//上个月
		$("#previousMonth").unbind("click").click(function(){
			var yyyyMM=$("#yyyyMM").html();
			var items=yyyyMM.split("-");
			_year=items[0];
			_year=_year*1;
			var _month=items[1]*1;
			_month=_month*1-1;
			if(_month==0){
				_month=12;
				_year=_year-1;
			}
			if(_month<10){
				_month="0"+_month+"";
			}
			$("#yyyyMM").html(_year+"-"+_month);
			var _dateStr=_year+"-"+_month+"-01 00:00:00";
			var _date=TimeUtils.string2Date(_dateStr);
			self._renderDateUI(_date);
			if(self._currentHouseId){
				self.getHouseDayStatusList(self._currentHouseId);
			}
		});
		//下个月
		$("#nextMonth").unbind("click").click(function(){
			var yyyyMM=$("#yyyyMM").html();
			var items=yyyyMM.split("-");
			_year=items[0];
			_year=_year*1;
			var _month=items[1]*1;
			_month=_month*1+1;
			if(_month==13){
				_month=1;
				_year=_year+1;
			}
			if(_month<10){
				_month="0"+_month+"";
			}
			$("#yyyyMM").html(_year+"-"+_month);
			var _dateStr=_year+"-"+_month+"-01 00:00:00";
			var _date=TimeUtils.string2Date(_dateStr);
			self._renderDateUI(_date);
			if(self._currentHouseId){
				self.getHouseDayStatusList(self._currentHouseId);
			}
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
			
			var _html='<p>'+date+'</p>'
                +'<p id="date'+_id+'" class="houseStatus"></p>'
                +'<div id="data'+_id+'" class="hide"></div>';
			$("#id"+i).html(_html);
			date++;
		}
		
	},
	getHouseDayStatusList:function(id){
		var self=this;
		self._currentHouseId=id;
		var _nowStr=$("#yyyyMM").html();
		var startTime=_nowStr+"-01 00:00:00";
		var _date=TimeUtils.string2Date(startTime);
		var _dayCount=TimeUtils.getDaysOfMonth(_date);
		var endTime=_nowStr+"-"+_dayCount+" 23:59:59";
		
		//把原来的房态清空
		$(".houseStatus").parent().removeClass("no-room");
		$(".houseStatus").html("");
		
		var param={
			houseId:id,
			startTime:"2018-02-01 00:00:00",
			endTime:"2018-03-02 23:59:59"
		};
		CommonUtils.async({
			url:"/hishu/order/getHouseStatusList.json",
			data:param,
			success:function(result){
				if(result.code==0){
					var list=result.data.list||[];
					for(var i=0,len=list.length;i<len;i++){
						var ds=list[i];
						//setTimeout(function(){
						//房态信息
						//var houseId=ds.houseId;
						//var houseDayStatusId=ds.houseDayStatusId;//房态信息Id，可能有，可能无
						var day=ds.day;
						//var orderAmount=ds.orderAmount||0;
						var status=1;//房态（0-无房，1-有房,2-标记无房）
						if(typeof(ds.status)!="undefined"){
							status=ds.status;
						}
						//订单信息
						//var userId=ds.userId;//自动订单关联的用户Id
						//var bookUserName=ds.bookUserName;//自动下单的用户名称
						//var userName=ds.userName;//手工订单的用户名称
						//var bookLiveTime=ds.bookLiveTime;//入住时间
						//var bookLeaveTime=ds.bookLeaveTime;//退房时间
						//var type=ds.type;//订单类型 订单类型（system-系统订单，manual-手动录入，other-其他）
						
						//手工录入订单的admin用户
						//var offlineOrderOperatorName=ds.offlineOrderOperatorName;//status=0时用
						//var orderId=ds.orderId;//订单信息
						//var orderType=ds.orderType;//订单类型（system-系统订单，manual-手动录入，other-其他）
						
						//手工标记房态的admin用户
						//var statusOperatorName=ds.statusOperatorName;//status=2时用
						
						var jsonStr=JSON.stringify(ds);
						$("#data"+day).html(jsonStr);
						
						if(status==0){
							//无房
							$("#date"+day).html("无房");
							$("#date"+day).parent().addClass("no-room");
							$("#date"+day).unbind("click").click(function(){
								var _id_=$(this).attr("id");
								//console.info(_id_);
								_id_=_id_.replace("date","");
								var _json=$("#data"+_id_).html();
								var _ds=JSON.parse(_json);
								//console.info(_ds);
								
								var _hh='';
								if(!_ds.orderId){
									//无订单，系统同步第三方房态
									_hh='系统同步';
								}else{
									//有订单
									if(_ds.userId){
										//有用户Id,系统自动下单
										_hh=_ds.bookUserName+'预订</br>'+_ds.bookLiveTime+'  '+_ds.bookLeaveTime;
									}else if(_ds.statusOperatorName){
										_hh=_ds.statusOperatorName+'手动录单</br>'+_ds.bookLiveTime+'  '+_ds.bookLeaveTime;
									}
								}
								//console.info(houseDayStatusId+","+day);
								$("#row1").html(_hh);
								$("#row2").html('<a href="javascript:HouseStatus.markHouseDayStatus('+_ds.houseDayStatusId+','+_ds.houseId+',\''+_ds.day+'\',1);">标记有房</a>');
								$('#showRoom').modal({});
							});
						}else if(status==1){
							//有房,显示房源价格
							$("#date"+day).html("￥"+ds.orderAmount);
							$("#date"+day).unbind("click").click(function(){
								var _id_=$(this).attr("id");
								_id_=_id_.replace("date","");
								var _json=$("#data"+_id_).html();
								var _ds=JSON.parse(_json);
								
								$("#row1").html('<a href="javascript:HouseStatus.markHouseDayStatus('+_ds.houseDayStatusId+','+_ds.houseId+',\''+_ds.day+'\',2);">标记无房</a>');
								$("#row2").html('<a href="/admin/orderManagement/addOrder.html?houseId='+_ds.houseId+'&date='+_ds.day+'">录入订单</a>');
								$('#showRoom').modal({});
							});
						}else if(status==2){
							//被手工标记无房,保留
							$("#date"+day).html("无房");
							$("#date"+day).parent().addClass("no-room");
							$("#date"+day).unbind("click").click(function(){
								var _id_=$(this).attr("id");
								_id_=_id_.replace("date","");
								var _json=$("#data"+_id_).html();
								var _ds=JSON.parse(_json);
								
								$("#row1").html(_ds.statusOperatorName+'标记无房');
								$("#row2").html('<a href="javascript:HouseStatus.markHouseDayStatus('+_ds.houseDayStatusId+','+_ds.houseId+',\''+_ds.day+'\',1);">标记有房</a>');
								$('#showRoom').modal({});
							});
							
						}
						//},0);
						
					}
				}
			}
		});
	},
	markHouseDayStatus:function(houseDayStatusId,houseId,date,status){
		var self=this;
		//关闭弹层
		$('#showRoom').modal('hide');
		
		if(houseDayStatusId&&houseDayStatusId!=""){
			//更新
			self._updateHouseDayStatus(houseDayStatusId,status);
		}else{
			//新增
			self._addHouseDayStatus(houseId,date,status);
		}
	},
	_addHouseDayStatus:function(houseId,date,status){
		var self=this;
		var houseDayStatus={
			houseId:houseId,
			date:date+" 00:00:00",
			status:status
		}
		
		CommonUtils.async({
			url:"/hishu/order/addHouseDayStatus.json",
			data:houseDayStatus,
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功",function(){
						//重新加载房态
						self.getHouseDayStatusList(self._currentHouseId);
					});
				}else{
					CommonUtils.Msg.alert("失败");
				}
			},
			error:function(result){
				CommonUtils.Msg.alert("失败");
			}
		});
	},
	_updateHouseDayStatus:function(houseDayStatusId,status){
		var self=this;
		var houseDayStatus={
			id:houseDayStatusId,
			status:status
		}
		
		CommonUtils.async({
			url:"/hishu/order/updateHouseDayStatus.json",
			data:houseDayStatus,
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功",function(){
						//重新加载房态
						self.getHouseDayStatusList(self._currentHouseId);
					});
				}else{
					CommonUtils.Msg.alert("失败");
				}
			},
			error:function(result){
				CommonUtils.Msg.alert("失败");
			}
		});
		
	}
}
$(function(){
	HouseStatus.init();
});