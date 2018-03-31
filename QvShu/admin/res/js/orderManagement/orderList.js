var OrderList={
	_listWidget:null,
	
	init:function(){
		var self=this;
		
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
		
		self._listWidget=$("#listWidget").TableWidget({
			url:"/hishu/order/getOrderList.json",
			cels:[{
				textField:"订单状态",
				valueField:"paymentStatus",
				render:function(value,row){
					var _html='';
					//付款状态（0-未支付，1-支付超时，2-支付失败，3-支付完成-确认中，4-支付成功）
					switch(value){
					case 0:{
						_html='未支付';
						break;
					}
					case 1:{
						_html='支付超时';
						break;
					}
					case 2:{
						_html='支付失败';
						break;
					}
					case 3:{
						_html='支付完成-确认中';
						break;
					}
					case 4:{
						_html='支付成功';
						break;
					}
					}
					
					return _html;
				}
			},{
				textField:"财务状态",
				valueField:"financialStatus",
				render:function(value,row){
					var _html='';
					//财务状态（0-未处理，已处理）
					switch(value){
					case 0:{
						_html='未处理';
						break;
					}
					case 1:{
						_html='已处理';
						break;
					}
					}
					return _html;
				}
			},{
				textField:"跟单人",
				valueField:"operatorName"
			},{
				textField:"客户账号",
				valueField:"userAccount",
				render:function(value,row){
					var _html='';
					var _account=value||"";
					if(_account==""){
						_account=row.userAccount2||"";//启用手工单输入的客户名称
					}
					_html=_account;
					return _html;
				}
			},{
				textField:"用户姓名",
				valueField:"userName",
				render:function(value,row){
					var _html='';
					var _name=value||"";
					if(_name==""){
						_name=row.userName2||"";//启用手工单输入的客户名称
					}
					_html=_name;
					return _html;
				}
			},{
				textField:"订单号",
				valueField:"orderNo"
			},{
				textField:"客户电话",
				valueField:"userPhone",
				render:function(value,row){
					var _html='';
					var _phone=value||"";
					if(_phone==""){
						_phone=row.userPhone2||"";//启用手工单输入的客户名称
					}
					_html=_phone;
					return _html;
				}
			},{
				textField:"下单时间",
				valueField:"bookTime"
			},{
				textField:"房源名称",
				valueField:"houseName",
				render:function(value,row){
					var _html=value;
					if(!value||value==""){
						//系统外的房源，用录入的房源名称
						_html=row.houseName2;
					}
					return _html;
				}
			},{
				textField:"订单价",
				valueField:"bookAmount"
			},{
				textField:"支付价",
				valueField:"bookGetAmount"
			},{
				textField:"优惠价",
				valueField:"bookDiscountAmount"
			},{
				textField:"线下房号",
				valueField:"offlineNo"
			},{
				textField:"预定栋数",
				valueField:"houseBookCount"
			},{
				textField:"入住时间",
				valueField:"bookLiveTime"
			},{
				textField:"退房时间",
				valueField:"bookLeaveTime"
			},{
				textField:"订单来源",
				valueField:"type",
				render:function(value,row){
					var _html='';
					//订单类型（wechat-系统订单，zhifubao-支付宝，manual-手动录入，other-其他）
					switch(value){
					case 'wechat':{
						_html='微信';
						break;
					}
					case 'zhifubao':{
						_html='支付宝';
						break;
					}
					case 'manual':{
						_html='手动录入';
						break;
					}
					case 'other':{
						_html='其他';
						break;
					}
					}
					return _html;
				}
			},{
				textField:"支付方式",
				valueField:"bookPaymentType",
				render:function(value,row){
					var _html='';
					//收款方式(1-现金，2-在线付款，3-其他)
					switch(value){
					case 1:{
						_html='现金';
						break;
					}
					case 2:{
						_html='在线付款';
						break;
					}
					case 3:{
						_html='其他';
						break;
					}
					}
					return _html;
				}
			},{
				textField:"商户名称",
				valueField:"merchantName"
			},{
				textField:"结算方式",
				valueField:"bankSettlement",
				render:function(value,row){
					var _html='';
					//结算方式（1:下单-周结算，2:下单-月结算，3:入住后-全款结算，4:定金+尾款结算，5:入住前-全款结算，6:入住-周结算，7:入住-月结算）
					switch(value){
					case 1:{
						_html='下单-周结算';
						break;
					}
					case 2:{
						_html='下单-月结算';
						break;
					}
					case 3:{
						_html='入住后-全款结算';
						break;
					}
					case 4:{
						_html='定金+尾款结算';
						break;
					}
					case 5:{
						_html='入住前-全款结算';
						break;
					}
					case 6:{
						_html='入住-周结算';
						break;
					}
					case 7:{
						_html='入住-月结算';
						break;
					}
					case 1:{
						_html='下单-周结算';
						break;
					}
					case 1:{
						_html='下单-周结算';
						break;
					}
					}
					return _html;
				}
			}],
			afterRender:function(){
				var _id=self._listWidget.id;
				//console.info(_id);
				// $("p").css("color","red");
				$("#"+_id+"_tableC1").css("min-width","1200px");
				$("#"+_id+"_table1").css("width","2500px");
			}
		});
	},
	_bind:function(){
		var self=this;
		
		$("#queryBtn").unbind("click").click(function(){
			var param={};
			var orderNo=$("#orderNo").val();
			if(orderNo&&orderNo!=""){
				param.orderNo=orderNo;
			}
			var operatorName=$("#operatorName").val();
			if(operatorName&&operatorName!=""){
				param.operatorName=operatorName;
			}
			var userName=$("#userName").val();
			if(userName&&userName!=""){
				param.userName=userName;
			}
			var houseName=$("#houseName").val();
			if(houseName&&houseName!=""){
				param.houseName=houseName;
			}
			var merchantName=$("#merchantName").val();
			if(merchantName&&merchantName!=""){
				param.merchantName=merchantName;
			}
			var userPhone=$("#userPhone").val();
			if(userPhone&&userPhone!=""){
				param.userPhone=userPhone;
			}
			var districtName=$("#districtName").val();
			if(districtName&&districtName!=""){
				param.districtName=districtName;
			}
			var bookTime=$("#bookTime").val();
			if(bookTime&&bookTime!=""){
				param.bookTime=bookTime+" 00:00:00";
			}
			var bookLiveTime=$("#bookLiveTime").val();
			if(bookLiveTime&&bookLiveTime!=""){
				param.bookLiveTime=bookLiveTime+" 00:00:00";
			}
			//付款状态（0-未支付，1-支付超时，2-支付失败，3-支付完成-确认中，4-支付成功）
			var paymentStatus=[];
			if($("#paymentStatus_unpaid").is(':checked')){
				paymentStatus.push(0);
			}
			if($("#paymentStatus_pay_timeout").is(':checked')){
				paymentStatus.push(1);
			}
			if($("#paymentStatus_pay_fail").is(':checked')){
				paymentStatus.push(2);
			}
			if($("#paymentStatus_paid_check").is(':checked')){
				paymentStatus.push(3);
			}
			if(paymentStatus.length>0){
				param.paymentStatus=paymentStatus;
			}
			////0-有效，1-预定失败，2-已取消，3-等待退款，4-退款失败，5-已删除
			var orderStatus=[];
			if($("#orderStatus_reserve_fail").is(':checked')){
				orderStatus.push(1);
			}
			if($("#orderStatus_cancel").is(':checked')){
				orderStatus.push(2);
			}
			if($("#orderStatus_wait_refund").is(':checked')){
				orderStatus.push(3);
			}
			if($("#orderStatus_refund_fail").is(':checked')){
				orderStatus.push(4);
			}
			if(orderStatus.length>0){
				param.orderStatus=orderStatus;
			}
			//入住状态（0-待入住，1-已入住，2-已退房）
			var liveStatus=[];
			if($("#liveStatus_wait_for_live").is(':checked')){
				liveStatus.push(0);
			}
			if($("#liveStatus_live").is(':checked')){
				liveStatus.push(1);
			}
			if($("#liveStatus_leave").is(':checked')){
				liveStatus.push(2);
			}
			if(liveStatus.length>0){
				param.liveStatus=liveStatus;
			}
			self._listWidget.query(param);
		});
	}
}
$(function(){
	OrderList.init();
});