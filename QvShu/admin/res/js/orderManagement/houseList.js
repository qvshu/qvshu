var HouseList={
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
				textField:"酒店小区",
				valueField:"districtName"
			},{
				textField:"酒店名字",
				valueField:"name"
			},{
				textField:"酒店经理",
				valueField:"merchantName"
			},{
				textField:"操作",
				valueField:"operation",
				render:function(value,row){
					var id=row.id;
					
					var _html='<a href="javascript:HouseList.editHouseStatus('+id+');" data-toggle="modal" data-target="#myModal">编辑房态</a>';
					return _html;
				}
			}]
		});
		
		
		
	},
	_bind:function(){
		
	},
	editHouseStatus:function(id){
		//弹出编辑房态窗口
		alert(id);
	}
	
}
$(function(){
	HouseList.init();
});