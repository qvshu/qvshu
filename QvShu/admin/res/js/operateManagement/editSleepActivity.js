var EditSleepActivity={
	_id:null,
	
	init:function(){
		var self=this;
		self._getSleepActivity();
		self._render();
		self._bind();
	},
	_render:function(){
		
	},
	_bind:function(){
		var self=this;
		
		$("#saveBtn").unbind("click").click(function(){
			self._saveSleepActivity();
		});
	},
	_getSleepActivity:function(){
		var self=this;
		CommonUtils.async({
			url:"/hishu/operation/getActivity.json",
			data:{type:"sleep"},
			success:function(result){
				if(result.code==0){
					var sleepActivity=result.data;
					self._id=sleepActivity.id;
					$("#name").val(sleepActivity.name);
					$("#remark").val(sleepActivity.remark);
					$("#expiryTime").val(sleepActivity.expiryTime);
				}
			},
			error:function(result){
				
			}
		});
	},
	_saveSleepActivity:function(){
		var self=this;
		var name=$("#name").val();
		var remark=$("#remark").val();
		var expiryTime=$("#expiryTime").val();
		
		var sleepActivity={
			id:self._id,
			name:name,
			remark:remark,
			expiryTime:expiryTime
		}
		CommonUtils.async({
			url:"/hishu/operation/updateActivity.json",
			data:sleepActivity,
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功");
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
	EditSleepActivity.init();
});