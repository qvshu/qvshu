var CouponPackageList={
	_listWidget:null,
	
	init:function(){
		var self=this;
		self._render();
		self._bind();
	},
	_render:function(){
		var self=this;
		
		self._listWidget=$("#tableList").TableWidget({
			url:"/hishu/operation/getCouponPackageList.json",
			cels:[{
				textField:"套餐名称",
				valueField:"name"
			},{
				textField:"关联房源",
				valueField:"houseIds",
				render:function(value,row){
					var _houseIds=value;
					var _houseCount=0;
					if(_houseIds&&_houseIds!=""){
						var items=_houseIds.split(",");
						if(items){
							_houseCount=items.length;
						}
					}
					var _html='关联房源:'+_houseCount;
					return _html;
				}
			},{
				textField:"操作",
				valueField:"operation",
				render:function(value,row){
					var id=row.id;
					
					var _html='<a href="javascript:CouponPackageList.editCouponPackage('+id+');" data-toggle="modal" data-target="#myModal">修改</a>'
						+'<a href="javascript:CouponPackageList.deleteCouponPackage('+id+');" class="" data-id="" data-type="">删除</a>';
					return _html;
				}
			}]
		});
	},
	_bind:function(){
		
	},
	editCouponPackage:function(id){
		location.href="/admin/operateManagement/editCouponPackage.html?id="+id;
	},
	deleteCouponPackage:function(id){
		CommonUtils.Msg.confirm("是否删除优惠套餐",function(){
			CommonUtils.async({
				url:"/hishu/operation/deleteCouponPackage.json",
				data:{id:id},
				success:function(result){
					if(result.code==0){
						CommonUtils.Msg.info("成功",function(){
							location.href="/admin/operateManagement/couponPackageList.html";
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
	CouponPackageList.init();
});