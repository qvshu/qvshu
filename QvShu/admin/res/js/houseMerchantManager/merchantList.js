var MerchantList={
	_listWidget:null,//商户列表
	_cityWidget:null,
	_districtWidget:null,
	
	init:function(){
		var self=this;
		
		self._render();
		self._bind();
	},
	_render:function(){
		var self=this;
		
		self._listWidget=$("#tableList").TableWidget({
			url:"/hishu/admin/getMerchantList.json",
			cels:[{
				textField:"城市",
				valueField:"cityName"
			},{
				textField:"小区",
				valueField:"districtName"
			},{
				textField:"商户名字",
				valueField:"name"
			},{
				textField:"结算方式",
				valueField:"bankSettlement",
				render:function(value,row){
					var _html='';
					/*结算方式（1:下单-周结算，2:下单-月结算，3:入住后-全款结算，
					 * 4:定金+尾款结算，5:入住前-全款结算，6:入住-周结算，7:入住-月结算）*/
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
					}
					
					return _html;
				}
			},{
				textField:"收款人",
				valueField:"bankName"
			},{
				textField:"通知电话",
				valueField:"bankPhone"
			},{
				textField:"操作",
				valueField:"operation",
				render:function(value,row){
					var id=row.id;
					
					var _html='<a href="javascript:MerchantList.editMerchant('+id+');">修改</a>'
						+'<a href="javascript:MerchantList.deleteMerchant('+id+')" class="">删除</a>';
					return _html;
				}
			}]
		});
		
		self._cityWidget=$("#cityWidget").ComboBoxWidget({
			url:"/hishu/admin/getCityList.json",
			selectTip:"请选择城市",
			textField:"name",
			valueField:"id",
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
			selectTip:"请选择小区",
			textField:"name",
			valueField:"id"
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
			self._listWidget.query(param);
		});
	},
	editMerchant:function(id){
		//跳转编辑页面
		location.href="/admin/houseMerchantManager/editMerchant.html?id="+id;
	},
	deleteMerchant:function(id){
		//弹出提示，是否删除
		CommonUtils.Msg.confirm("是否删除商户",function(){
			CommonUtils.async({
				url:"/hishu/admin/deleteMerchant.json",
				data:{id:id},
				success:function(result){
					if(result.code==0){
						//刷新页面
						CommonUtils.Msg.info("成功",function(){
							self._listWidget.reload();
						});
					}else{
						CommonUtils.Msg.alert("失败");
					}
				},
				error:function(result){
					CommonUtils.Msg.alert("失败");
				}
			});
		});
		
	}
}
$(function(){
	MerchantList.init();
});