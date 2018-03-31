var EditCoupon={
	_id:null,
	
	init:function(){
		var self=this;
		self._id=CommonUtils.getParam("id");
		self._getCoupon();
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
	_getCoupon:function(){
		var self=this;
		
		CommonUtils.async({
			url:"/hishu/operation/getCoupon.json",
			data:{id:self._id},
			success:function(result){
				if(result.code==0){
					//渲染数据
					var coupon=result.data;
					$("#name").val(coupon.name);
					$("#descript").val(coupon.descript);
					$("#outOfDatetime").val(coupon.outOfDatetime);
				}
			}
		});
	},
	_saveCoupon:function(){
		var self=this;
		
		var name=$("#name").val();
		var descript=$("#descript").val();
		var outOfDatetime=$("#outOfDatetime").val();
		var coupon={
			id:self._id,
			name:name,
			descript:descript,
			outOfDatetime:outOfDatetime
		}
		
		CommonUtils.async({
			url:"/hishu/operation/updateCoupon.json",
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
	EditCoupon.init();
});