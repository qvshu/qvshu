var HouseList={
	_listWidget:null,//房源列表
	_cityWidget:null,
	_districtWidget:null,
	
	init:function(){
		var self=this;
		
		self._render();
		self._bind();
	},
	_render:function(){
		var self=this;
		//城市选择组件
		self._cityWidget=$("#cityWidget").ComboBoxWidget({
			url:"/hishu/admin/getCityList.json",
			selectTip:"选择城市",
			textField:"name",
			valueField:"id",
			onClick:function(item){
				var id=item.id;
				//加载小区
				CommonUtils.async({
					url:"/hishu/admin/getDistrictList.json",
					data:{cityId:id},
					success:function(result){
						if(result.code==0){
							var list=result.data.list||[];
							self._districtWidget.loadData(list);
						}
					}
				});
				
			}
		});
		//小区选择组件
		self._districtWidget=$("#districtWidget").ComboBoxWidget({
			selectTip:"选择小区",
			textField:"name",
			valueField:"id"
		});
		
		//渲染房源列表
		self._listWidget=$("#tableList").TableWidget({
			url:"/hishu/admin/getDistrictHouseList.json",
			cels:[{
				textField:"小区名称",
				valueField:"districtName",
				width:"20%"
			},{
				textField:"房源数",
				valueField:"houseCount"
			},{
				textField:"城市名称",
				valueField:"cityName"
			},{
				textField:"操作",
				valueField:"operation",
				render:function(value,row){
					var id=row.id;
					
					var _html='<a href="/admin/houseMerchantManager/addHouse.html?districtId='+row.districtId+'" class="mr15">新增房源</a>'
						+'<a href="/admin/houseMerchantManager/houseList2.html?districtId='+row.districtId+'" class="mr15">查看房源</a>'
						+'<a href="/admin/houseMerchantManager/editDistrict.html?districtId='+row.districtId+'" class="">编辑小区</a>';
					return _html;
				}
			}]
		});
		
		
		
	},
	_bind:function(){
		var self=this;
		
		//搜索事件
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
	editHouse:function(id){
		//跳转编辑页面
		location.href="/admin/houseMerchantManager/editHouse.html?id="+id;
	},
	deleteHouse:function(id){
		//弹出提示，是否删除
		CommonUtils.async({
			url:"/hishu/admin/deleteHouse.json",
			data:{id:id},
			success:function(result){
				if(result.code==0){
					//刷新页面
					CommonUtils.Msg.info("成功",function(){
						location.href="/admin/houseMerchantManager/houseList.html";
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
	HouseList.init();
});