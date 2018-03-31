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
		$("#errorMsg").html("");
		
		var account=$("#account").val();
		if(!account||account==""){
			$("#errorMsg").html("账号不能为空");
			return;
		}
		var password=$("#password").val();
		if(!password||password==""){
			$("#errorMsg").html("密码不能为空");
			return;
		}
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
						var user=result.data;
						var account=user.account;
						CommonUtils.Cookie.add(Constant.USER_ACCOUNT_COOKIE_KEY,account,"/");
						//更新用户名缓存
						CommonUtils.Cookie.add(Constant.USER_NAME_COOKIE_KEY,user.name,"/");
						var _role=user.role||{};
						var _modules=_role.modules||[];
						var _auths=_role.auths||[];
						
						var _mStr="";
						for(var i=0,il=_modules.length;i<il;i++){
							var m=_modules[i];
							if(i==0){
								_mStr+=m.code;
							}else{
								_mStr+=","+m.code;
							}
						}
						//更新角色模块缓存
						CommonUtils.Cookie.add(Constant.USER_ACCOUNT_MODULE_COOKIE_KEY,_mStr,"/");
						
						var _aStr="";
						for(var j=0,jl=_auths.length;j<jl;j++){
							var _a=_auths[j];
							if(j==0){
								_aStr+=_a.code;
							}else{
								_aStr+=","+_a.code;
							}
						}
						//更新角色权限缓存
						CommonUtils.Cookie.add(Constant.USER_ACCOUNT_AUTHS_COOKIE_KEY,_aStr,"/");
					},0);
					
					setTimeout(function(){
						location.href="/admin/index.html";
					},500);
				}else{
					$("#errorMsg").html(result.msg);
				}
			},
			error:function(error){
				$("#errorMsg").html(error.msg);
			}
		});
	}
}
$(function(){
	Login.init();
});