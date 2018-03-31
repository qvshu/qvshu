var EditBargainActivity={
	_id:null,
	
	init:function(){
		var self=this;
		self._getBargainActivity();
		self._render();
		self._bind();
	},
	_render:function(){
		
	},
	_bind:function(){
		var self=this;
		
		$("#saveBtn").unbind("click").click(function(){
			alert(22);
			self._saveBargainActivity();
		});
	},
	_getBargainActivity:function(){
		var self=this;
		CommonUtils.async({
			url:"/hishu/operation/getActivity.json",
			data:{type:"bargain"},
			success:function(result){
				if(result.code==0){
					var bargainActivity=result.data;
					self._id=bargainActivity.id;
					$("#name").val(bargainActivity.name);
					$("#remark").val(bargainActivity.remark);
					$("#expiryTime").val(bargainActivity.expiryTime);
				}
			},
			error:function(result){
				
			}
		});
	},
	_saveBargainActivity:function(){
		var self=this;
		var name=$("#name").val();
		var remark=$("#remark").val();
		var expiryTime=$("#expiryTime").val();
		
		var bargainActivity={
			id:self._id,
			name:name,
			remark:remark,
			expiryTime:expiryTime
		};
		
		console.info(bargainActivity);
		
		CommonUtils.async({
			url:"/hishu/operation/updateActivity.json",
			data:bargainActivity,
			success:function(result){
				if(result.code==0){
					if(result.code==0){
						CommonUtils.Msg.info("成功");
					}else{
						CommonUtils.Msg.alert("失败");
					}
				}
			},
			error:function(result){
				CommonUtils.Msg.alert("失败");
			}
		});
		
	}
}
$(function(){
	EditBargainActivity.init();
});