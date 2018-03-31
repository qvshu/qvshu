var Login={
	init:function(){
		var self=this;
		
		self._render();
		self._bind();
	},
	_render:function(){
		
	},
	_bind:function(){
		var self=this;
		
		$("#loginBtn").unbind("click").click(function(){
			self._login();
		});
	},
	_login:function(){
		var account=$("#account").val();
		var password=$("#password").val();
		var data={
			account:account,
			password:password
		};
		CommonUtils.async({
			url:"/hishu/common/login.json",
			data:data,
			success:function(result){
				if(result.code==0){
					setTimeout(function(){
						//保存用户的信息
						var account=user.account;
						//更新用户名缓存
						console.info(account);
						CommonUtils.Cookie.add(Constant.USER_NAME_COOKIE_KEY+account,user.name,"/");
						var _role=user.role||{};
						var _modules=_role.modules||[];
						var _auths=_role.auths||[];
						
						var _mStr="";
						for(var i=0,il=_modules.length;i<il;i++){
							var m=_modules[i];
							if(i==0){
								_mStr=m.name;
							}else{
								_mStr=","+m.name;
							}
						}
						//更新角色模块缓存
						console.info(_mStr);
						CommonUtils.Cookie.add(Constant.USER_ACCOUNT_MODULE_COOKIE_KEY+account,_mStr,"/");
						
						var _aStr="";
						for(var j=0,jl=_auths.length;j<jl;j++){
							var _a=_auths[j];
							if(j==0){
								_aStr=+_a.code;
							}else{
								_aStr+=","+_a.code;
							}
						}
						//更新角色权限缓存
						console.info(_aStr);
						CommonUtils.Cookie.add(Constant.USER_ACCOUNT_AUTHS_COOKIE_KEY+account,_aStr,"/");
					},0);
					
					setTimeout(function(){
						location.href="/admin/index.html";
					},500);
				}
			},
			error:function(error){
				
			}
		});
	}
}
$(function(){
	Login.init();
});