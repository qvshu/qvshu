var CouponList={
	_listWidget:null,
	
	init:function(){
		var self=this;
		self._render();
		self._bind();
	},
	_render:function(){
		var self=this;
		
		self._listWidget=$("#tableList").TableWidget({
			url:"/hishu/operation/getCouponList.json",
			cels:[{
				textField:"优惠劵",
				valueField:"name"
			},{
				textField:"过期时间",
				valueField:"outOfDatetime"
			},{
				textField:"操作",
				valueField:"operation",
				render:function(value,row){
					var id=row.id;
					
					var _html='<a href="javascript:CouponList.editCoupon('+id+');" data-toggle="modal" data-target="#myModal">修改</a>'
						+'<a href="javascript:CouponList.deleteCoupon('+id+');" class="" data-id="" data-type="">删除</a>';
					return _html;
				}
			}]
		});
	},
	_bind:function(){
		
	},
	editCoupon:function(id){
		location.href="/admin/operateManagement/editCoupon.html?id="+id;
	},
	deleteCoupon:function(id){
		//TOTO 提示删除
		CommonUtils.async({
			url:"/hishu/operation/deleteCoupon.json",
			data:{id:id},
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功",function(){
						location.href="/admin/operateManagement/couponList.html";
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
	CouponList.init();
});