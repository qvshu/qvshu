function loadSideNav(url){
	//$("div").load('demo_ajax_load.txt');
}
$(function(){
	//退出系统
	$("#exitBtn").unbind("click").click(function(){
		logout();
	});
	//获取用户名
	var _account=CommonUtils.Cookie.get(Constant.USER_ACCOUNT_COOKIE_KEY);
	
	var _name=CommonUtils.Cookie.get(Constant.USER_NAME_COOKIE_KEY);
	$("#headerUserName").html(unescape(_name));
	
	var _current_menu=CommonUtils.getParam("c_m");//一级菜单
	if(_current_menu&&_current_menu!=""){
		//选中一级菜单
		$("#"+_current_menu).addClass("on");
	}
	var _current_sub_menu=CommonUtils.getParam("c_subm");//二级菜单
	if(_current_sub_menu&&_current_sub_menu!=""){
		//选中二级菜单
		$("#"+_current_sub_menu).addClass("on");
	}
	
	var _modules=CommonUtils.Cookie.get(Constant.USER_ACCOUNT_MODULE_COOKIE_KEY).split("%2C");
	for(var i=0,il=_modules.length;i<il;i++){
		var _m=_modules[i];
		$("#"+_m).removeClass("hide");
	}
	var _auths=CommonUtils.Cookie.get(Constant.USER_ACCOUNT_AUTHS_COOKIE_KEY).split("%2C");
	
	
});
