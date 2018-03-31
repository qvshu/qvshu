var AddOrder={
	_houseId:null,
	_date:null,
	_orderTypeWidget:null,
	_bookPaymentTypeWidget:null,
	_districtWidget:null,
	_houseWidget:null,
	_carryHouse:false,
	
	init:function(){
		var self=this;
		self._houseId=CommonUtils.getParam("houseId");
		self._date=CommonUtils.getParam("date");
		if(!self._houseId||self._houseId==""){
			//显示房源类型
			$("#houseTypeDiv").removeClass("hide");
			//没有带入房源信息，则展示房源选择
			$("#NoHouseInfo").removeClass("hide");
			self._houseWidget=$("#houseWidget").ComboBoxWidget({
				textField:"name",
				valueField:"id",
				onClick:function(item){
					self._houseId=item.id;
					//console.info(self._houseId);
				}
			});
			self._districtWidget=$("#districtWidget").ComboBoxWidget({
				url:"/hishu/admin/getDistrictList.json",
				textField:"name",
				valueField:"id",
				onClick:function(item){
					//加载相应房源
					CommonUtils.async({
						url:"/hishu/admin/getHouseList.json",
						data:{districtId:item.id,pageSize:100},
						success:function(result){
							if(result.code==0){
								var list=result.data.list||[];
								self._houseWidget.loadData(list);
							}
						}
					});
				}
			});
		}else{
			self._carryHouse=true;
			self._loadHouse(self._houseId);
			$("#hadHouseInfo").removeClass("hide");
			$("#bookLiveTime").val(self._date+" 00:00:00");
			$("#bookLeaveTime").val(self._date+" 00:00:00");
			//有房源id则，不能显示房源类型
		}
		
		self._render();
		self._bind();
	},
	_render:function(){
		var self=this;
		//日期选择
		$("#bookTime").datetimepicker({
			language:'zh-CN',
			format: 'yyyy-mm-dd',//显示格式
			todayHighlight: 1,//今天高亮
			minView: "month",//设置只显示到月份
			startView:2,
			forceParse: 0,
			showMeridian: 1,
			autoclose: 1//选择后自动关闭
		});
		$("#bookLiveTime").datetimepicker({
			language:'zh-CN',
			format: 'yyyy-mm-dd',//显示格式
			todayHighlight: 1,//今天高亮
			minView: "month",//设置只显示到月份
			startView:2,
			forceParse: 0,
			showMeridian: 1,
			autoclose: 1//选择后自动关闭
		});
		$("#bookLeaveTime").datetimepicker({
			language:'zh-CN',
			format: 'yyyy-mm-dd',//显示格式
			todayHighlight: 1,//今天高亮
			minView: "month",//设置只显示到月份
			startView:2,
			forceParse: 0,
			showMeridian: 1,
			autoclose: 1//选择后自动关闭
		});
		$("#bookPaymentTime").datetimepicker({
			language:'zh-CN',
			format: 'yyyy-mm-dd',//显示格式
			todayHighlight: 1,//今天高亮
			minView: "month",//设置只显示到月份
			startView:2,
			forceParse: 0,
			showMeridian: 1,
			autoclose: 1//选择后自动关闭
		});
		
		//订单类型（system-系统订单，manual-手动录入，other-其他）
		self._orderTypeWidget=$("#orderTypeWidget").ComboBoxWidget({
			selectTip:"请选择订单来源",
			textField:"name",
			valueField:"value",
			defaultValue:"manual",
			data:[{
				name:"手动录入",
				value:"manual"
			},{
				name:"系统订单",
				value:"system"
			},{
				name:"其他",
				value:"other"
			}]
		});
		
		//收款方式(1-现金，2-在线付款，3-其他)
		self._bookPaymentTypeWidget=$("#bookPaymentTypeWidget").ComboBoxWidget({
			selectTip:"请选择收款方式",
			textField:"name",
			valueField:"value",
			data:[{
				name:"现金",
				value:"1"
			},{
				name:"转账",
				value:"2"
			},{
				name:"其他",
				value:"3"
			}]
		});
	},
	_bind:function(){
		var self=this;
		
		$("#saveBtn").unbind("click").click(function(){
			self._saveOrder();
		});
		
		$("#bookLiveTime").unbind("change").change(function(){
			var bookLiveTime=$("#bookLiveTime").val();
			var bookLeaveTime=$("#bookLeaveTime").val();
			self._getHouseDayStatus(self._houseId,bookLiveTime,bookLeaveTime);
		});
		$("#bookLeaveTime").unbind("change").change(function(){
			var bookLiveTime=$("#bookLiveTime").val();
			var bookLeaveTime=$("#bookLeaveTime").val();
			self._getHouseDayStatus(self._houseId,bookLiveTime,bookLeaveTime);
		});
		
		$("input[name='houseType']").click(function(){
			//var houseType=$("input[name='houseType']:checked").val();
			var _value=$(this).val();
			//alert(_value);
			if("system"==_value){
				//显示系统房源
				$("#NoHouseInfo").removeClass("hide");
				$("#otherSystemHouseInfo").addClass("hide");
			}else if("other"==_value){
				//显示系统外房源
				$("#otherSystemHouseInfo").removeClass("hide");
				$("#NoHouseInfo").addClass("hide");
			}
		});
	},
	_loadHouse:function(houseId){
		var self=this;
		
		CommonUtils.async({
			url:"/hishu/admin/getHouse.json",
			data:{id:houseId},
			success:function(result){
				if(result.code==0){
					//填充信息
					var house=result.data;
					$("#houseName").val(house.name);
				}
			}
			
		});
	},
	_getHouseDayStatus:function(houseId,startTime,endTime){
		if(!houseId||houseId==""
			||!startTime||startTime==""||!endTime||endTime==""){
			return;
		}
		var self=this;
		
		CommonUtils.async({
			url:"/hishu/order/getHouseStatusList.json",
			data:{houseId:houseId,startTime:startTime,endTime:endTime},
			success:function(result){
				if(result.code==0){
					var list=result.data.list||[];
					if(list.length>0){
						var totalAmount=0;
						for(var i=0,len=list.length;i<len;i++){
							var ds=list[i];
							var orderAmount=ds.orderAmount||0;
							totalAmount+=orderAmount;
						}
						$("#bookAmount").val(totalAmount);
						$("#bookCollectionAmount").val(totalAmount);
						$("#bookDiscountAmount").val(totalAmount);
						$("#bookGetAmount").val(totalAmount);
					}
				}
			}
		});
		
	},
	_saveOrder:function(){
		var self=this;
		
		var type=self._orderTypeWidget.getValue();
		var houseType=$("input[name='houseType']:checked").val();
		var houseBookCount=$("#houseBookCount").val();
		var userName=$("#userName").val();
		if(!userName||userName==""){
			CommonUtils.Msg.alert("用户名不能为空");
			return;
		}
		var bookTime=$("#bookTime").val();
		if(bookTime&&bookTime!=""){
			bookTime+=" 00:00:00";
		}else{
			CommonUtils.Msg.alert("下单时间不能为空");
			return;
		}
		var userPhone=$("#userPhone").val();
		if(!userPhone||userPhone==""){
			CommonUtils.Msg.alert("用户电话不能为空");
			return;
		}
		var bookLiveTime=$("#bookLiveTime").val();
		if(!bookLiveTime||bookLiveTime==""){
			CommonUtils.Msg.alert("入住时间不能为空");
			return;
		}else{
			bookLiveTime+=" 00:00:00";
		}
		var bookLeaveTime=$("#bookLeaveTime").val();
		if(!bookLeaveTime||bookLeaveTime==""){
			CommonUtils.Msg.alert("退房时间不能为空");
			return;
		}else{
			bookLeaveTime+=" 00:00:00";
		}
		var bookAmount=$("#bookAmount").val();
		var bookCollectionAmount=$("#bookCollectionAmount").val();
		var bookDiscountAmount=$("#bookDiscountAmount").val();
		var bookType=$("input[name='bookType']:checked").val();
		var bookGetAmount=$("#bookGetAmount").val();
		var bookPaymentType=self._bookPaymentTypeWidget.getValue();
		var bookPaymentTime=$("#bookPaymentTime").val();
		if(bookPaymentTime&&bookPaymentTime!=""){
			bookPaymentTime+=" 00:00:00";
		}
		var remark=$("#remark").val();
		
		var order={
			type:type,
			houseBookCount:houseBookCount,
			userName:userName,
			bookTime:bookTime,
			userPhone:userPhone,
			bookLiveTime:bookLiveTime,
			bookLeaveTime:bookLeaveTime,
			bookAmount:bookAmount,
			bookCollectionAmount:bookCollectionAmount,
			bookDiscountAmount:bookDiscountAmount,
			bookType:bookType,
			bookGetAmount:bookGetAmount,
			bookPaymentType:bookPaymentType,
			bookPaymentTime:bookPaymentTime,
			remark:remark
		}
		//console.info(order);
		//return;
		
		if(self._carryHouse){
			//已经携带houseId，则不用在选择房源，且房源类型，必须是系统房源
			houseType="system";
			order.houseType=houseType;
			order.houseId=self._houseId;
		}else{
			order.houseType=houseType;
			//没有携带房源Id，则要
			if("system"==houseType){
				//要判断是否选择了房源
				if(!self._houseId||self._houseId==""){
					CommonUtils.Msg.alert("请先选择房源");
					return;
				}else{
					order.houseId=self._houseId;
				}
			}else{
				//判断，是否填写了房源名称和房源小区
				var otherSystemHouseDistrict=$("#otherSystemHouseDistrict").val();
				var otherSystemHouseName=$("#otherSystemHouseName").val();
				if(!otherSystemHouseDistrict||otherSystemHouseDistrict==""){
					CommonUtils.Msg.alert("请先填写房源小区");
					return;
				}else{
					order.houseDistrict=otherSystemHouseDistrict;
				}
				if(!otherSystemHouseName||otherSystemHouseName==""){
					CommonUtils.Msg.alert("请先填写房源名称");
					return;
				}else{
					order.houseName=otherSystemHouseName;
				}
				
			}
		}
		
		CommonUtils.async({
			url:"/hishu/order/addOrder.json",
			data:order,
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功",function(){
						location.href="/admin/orderManagement/orderList.html";
					});
				}else if(result.code==100000){
					//有某些天的房态，已入住
					CommonUtils.Msg.info(result.msg+"已无房");
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
	AddOrder.init();
});