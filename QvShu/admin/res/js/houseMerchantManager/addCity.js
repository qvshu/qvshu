var AddCity={
	_provinceWidget:null,
	
	init:function(){
		var self=this;
		self._render();
		self._bind();
	},
	_render:function(){
		var self=this;
		self._provinceWidget=$("#provinceWidget").ComboBoxWidget({
			url:"/hishu/admin/getProviceList.json",
			selectTip:"请选择省份",
			textField:"name",
			valueField:"id"
		});
	},
	_bind:function(){
		var self=this;
		$("#saveBtn").unbind("click").click(function(){
			self._saveCity();
		});
	},
	_saveCity:function(){
		var self=this;
		var provinceId=self._provinceWidget.getValue();
		if(!provinceId||provinceId==""){
			CommonUtils.Msg.alert("请先选择省份");
			return;
		}
		var name=$("#name").val();
		if(!name||name==""){
			CommonUtils.Msg.alert("城市名不能为空");
			return;
		}
		var code=$("#code").val();
		if(!code||code==""){
			CommonUtils.Msg.alert("城市编码不能为空");
		}
		
		var city={
			name:name,
			code:code,
			provinceId:provinceId
		};
		
		CommonUtils.async({
			url:"/hishu/admin/addCity.json",
			data:city,
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
	AddCity.init();
});
