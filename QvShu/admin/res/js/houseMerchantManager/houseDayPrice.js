var HouseDayPrice={
	_listWidget:null,//房源列表
	
	init:function(){
		var self=this;
		self._render();
		self._bind();
	},
	_render:function(){
		var self=this;
		
		//渲染房源列表
		self._listWidget=$("#tableList").TableWidget({
			url:"/hishu/admin/getHouseList.json",
			cels:[{
				textField:"酒店名字",
				valueField:"name",
				render:function(value,row){
					var _html='<div><a href="javascript:HouseDayPrice.getHouseDayPrice('+row.id+')">'
						+'<p>'+value+'<p>'
						+'<p>'+row.districtName+'<p>'
						+'</a></div>';
					return _html;
				}
			}]
		});
	},
	_bind:function(){
		
	},
	getHouseDayPrice:function(id){
		var startTime="2018-01-01 00:00:00";
		var endTime="2018-02-28 00:00:00";
		
		var param={
			houseId:id,
			startTime:startTime,
			endTime:endTime
		};
		
		CommonUtils.async({
			url:"/hishu/admin/getHouseDayPriceList.json",
			data:param,
			success:function(result){
				
			},
			error:function(result){
				
			}
		});
	}
}
$(function(){
	HouseDayPrice.init();
});