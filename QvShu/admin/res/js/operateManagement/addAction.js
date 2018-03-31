var AddAction={
	_type:1,//1-立减劵，2-打折劵
	init:function(){
		var self=this;
		
		self._render();
		self._bind();
	},
	_render:function(){
		var self=this;
		
	},
	_bind:function(){
		var self=this;
		//类型选择事件
		$("#type li").unbind("click").click(function(){
			var _value=$(this).attr("item-value");
			$(this).addClass("on").siblings().removeClass("on");
			self._type=_value;
		});
		
		$("#saveBtn").unbind("click").click(function(){
			self._saveAction();
		});
	},
	_saveAction:function(){
		var self=this;
		
		var name=$("#name").val();
		if(!name||name==""){
			CommonUtils.Msg.alert("名称不能为空");
			return;
		}
		var introduce=$("#introduce").val();
		var type=self._type;
		
		var condition=$("#condition").val();
		var conditionValue=$("#conditionValue").val();
		if(!conditionValue||conditionValue==0){
			CommonUtils.Msg.alert("条件值不能为空");
			return;
		}
		
		var discount=$("#discount").val();
		var count=$("#count").val();
		if(!count||count==""||count==0){
			CommonUtils.Msg.alert("数量必填");
			return;
		}
		var startTime=$("#startTime").val();
		if(!startTime||startTime==""){
			CommonUtils.Msg.alert("开始时间不能为空");
			return;
		}
		var endTime=$("#endTime").val();
		if(!endTime||endTime==""){
			CommonUtils.Msg.alert("结束时间不能为空");
			return;
		}
		
		var action={
			name:name,
			type:type,
			houseIds:"",
			content:introduce,
			startTime:startTime,
			endTime:endTime,
			count:count,
			condition:condition,
			conditionValue:conditionValue,
			discount:discount
		};
		
		CommonUtils.async({
			url:"/hishu/admin/addAction.json",
			data:action,
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功",function(){
						location.href="/admin/operateManagement/actionList.html";
					});
				}else{
					CommonUtils.Msg.alert("失败");
				}
			},
			error:function(){
				CommonUtils.Msg.alert("失败");
			}
			
		});
	}
}
$(function(){
	AddAction.init();
});