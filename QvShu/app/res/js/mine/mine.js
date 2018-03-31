var Mine={
	openId:null,
	
	init:function(){
		var self=this;
		self._render();
		self._bind();
		var _openId=CommonUtils.LocalStorage.getString(Constant.PROJECT_NAME+"_openId");
		if(!_openId||_openId==""){
			self._genQRCode();
		}else{
			self.openId=_openId;
			self._getUser();
		}
	},
	_render:function(){
		var self=this;
		
	},
	_bind:function(){
		var self=this;
		
	},
	_genQRCode:function(){
		var self=this;
		//二维码为固定关注的二维码
		var _url="http://photocdn.sohu.com/20150522/mp16015038_1432256655968_2.jpg";
		CommonUtils.Msg.showQRCode("请先关注公众号",_url);
	},
	_getUser:function(){
		var self=this;
		
		var user={openId:self.openId};
		CommonUtils.async({
			url:"/hiweb/user/getUser.json",
			data:user,
			success:function(result){
				if(result.code==0){
					
				}
			}
		});
	}
}
$(function(){
	Mine.init();
});