var AddCoupon={
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
			self._saveCoupon();
		});
		
		$("#cancelBtn").click(function(){
			location.href="/admin/operateManagement/couponList.html";
		});
	},
	_saveCoupon:function(){
		var name=$("#name").val();
		var descript=$("#descript").val();
		var outOfDatetime=$("#outOfDatetime").val();
		var coupon={
			name:name,
			descript:descript,
			outOfDatetime:outOfDatetime
		}
		
		CommonUtils.async({
			url:"/hishu/operation/addCoupon.json",
			data:coupon,
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
	AddCoupon.init();
});