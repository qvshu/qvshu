var AddCouponPackage={
	init:function(){
		var self=this;
		self._render();
		self._bind();
	},
	_render:function(){
		
	},
	_bind:function(){
		var self=this;
		
		$("#saveBtn").unbind("click").click(function(){
			self._saveCouponPackage();
		});
		
		$("#cancelBtn").click(function(){
			location.href="/admin/operateManagement/couponPackageList.html";
		});
	},
	_saveCouponPackage:function(){
		var name=$("#name").val();
		var content=$("#content").val();
		var couponPackage={
			name:name,
			content:content,
			type:1
		}
		
		CommonUtils.async({
			url:"/hishu/operation/addCouponPackage.json",
			data:couponPackage,
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
	}
}
$(function(){
	AddCouponPackage.init();
});