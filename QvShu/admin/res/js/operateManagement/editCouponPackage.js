var EditCouponPackage={
	_id:null,
	
	init:function(){
		var self=this;
		self._id=CommonUtils.getParam("id");
		self._getCouponPackage();
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
	_getCouponPackage:function(){
		var self=this;
		
		CommonUtils.async({
			url:"/hishu/operation/getCouponPackage.json",
			data:{id:self._id},
			success:function(result){
				if(result.code==0){
					//渲染数据
					var couponPackage=result.data;
					$("#name").val(couponPackage.name);
					$("#content").val(couponPackage.content);
				}
			}
		});
	},
	_saveCouponPackage:function(){
		var self=this;
		
		var name=$("#name").val();
		var content=$("#content").val();
		var couponPackage={
			id:self._id,
			name:name,
			content:content,
			type:1
		}
		
		CommonUtils.async({
			url:"/hishu/operation/updateCouponPackage.json",
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
	EditCouponPackage.init();
});