var HouseList={
	_cityWidget:null,
	_districtWidget:null,
	_listWidget:null,
	
	
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
			url:"/hishu/admin/getHouseList.json",
			cels:[{
				textField:"",
				valueField:"houseImg",
				width:"150",
				render:function(value,row){
					var _html='<img src="'+value+'" width="150" height="150">';
					return _html;
				}
			},{
				textField:"",
				valueField:"name",
				render:function(value,row){
					var districtName=row.districtName;
					var merchantName=row.merchantName;
					var _html='<p>'+value+'<span class="c-red"></span></p>'
						+'<p>'+districtName+'</p>'
						+'<p>商户：'+merchantName+'</p>';
						
					return _html;
				}
			},{
				textField:"",
				valueField:"xxx",
				width:"50%",
				function(value,row){
					return '';
				}
			},{
				textField:"",
				valueField:"cccc",
				render:function(value,row){
					var id=row.id;
					var _html='<div>'
						+'<a class="btn btn-success" href="" target="_blank">上线</a>'
						+'</div>'
						+'<p class="bot-txt"><a href="###">浏览</a>|'
						+'<a href="/admin/houseMerchantManager/editHouse.html?houseId='+id+'">编辑</a>'
						+'|<a href="javascript:HouseList.deleteHouse('+id+');">删除</a></p>';
					return _html;
				}
			}],
			completeLoad:function(total,firstRow){
				$("#houseTotalCount").html(total);
				var _city=self._cityWidget.getText();
				var _district=self._districtWidget.getText();
				$("#district_name").html(_district);
				$("#city_name").html(_city);
			}
		});
		
	},
	_bind:function(){
		var self=this;
		
		$("#searchBtn").unbind("click").click(function(){
			var param={};
			var cityId=self._cityWidget.getValue();
			var districtId=self._districtWidget.getValue();
			if(cityId&&cityId!=""){
				param.cityId=cityId;
			}
			if(districtId&&districtId!=""){
				param.districtId=districtId;
			}
			self._listWidget.query(param);
		});
	},
	deleteHouse:function(id){
		var self=this;
		CommonUtils.Msg.confirm("是否删除房源",function(){
			CommonUtils.async({
				url:"/hishu/admin/deleteHouse.json",
				data:{id:id},
				success:function(result){
					if(result.code==0){
						CommonUtils.Msg.info("成功",function(){
							//重新加载table
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
	HouseList.init();
});