/**
 * 公共常量
 */
var Constant={
	USER_NAME_COOKIE_KEY:"hishu_acc_name_",
	USER_ACCOUNT_MODULE_COOKIE_KEY:"hishu_acc_module_",
	USER_ACCOUNT_AUTHS_COOKIE_KEY:"hishu_acc_auth_"
}

var CommonUtils={
	/**
	 * 统一ajax调用方法
	 * @param param
	 */
	async:function(param){
		var _param=param||{};
		
		var _url=param.url;
		//如果url不存在，则退出
		if(!_url||_url==""){
			return;
		}
		
		var _dataType=_param.dataType||"json";//默认是json
		var _post=_param.type||"POST";//默认是post
		var _data=_param.data||{};
		var _async=param.async;
		if(typeof(_async)=="undefined"){
			_async=true;
		}
		
		var _success=_param.success;//成功的执行函数
		var _error=_param.error;//失败的执行函数
		
		$.ajax({
			type:_post,
			url:_url,
			dataType:_dataType,
			data:_data,
			async:_async,
			success:function(result) {
				//console.info(result);
				//统一处理返回的错误结果
				if(!result || result ==""){
					CommonUtils.Msg.alert("没有结果返回");
					return;
				}else if(result.code==1010){
					//未登录
					location.href="/admin/login.html";
				}else if(result.code==1009){
					//没有权限
					location.href="/admin/login.html";
				}else{
					if(typeof _success === 'function'){
						_success(result);
					}
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){
				if(typeof _error === 'function'){
					_error(XMLHttpRequest);
				}
			}
		});
	},
	/**
	 * 上传文件
	 * 依赖 jquery.form.min.js
	 * @param param
	 */
	uploadFile:function(param){
		var _param=param||{};
		
		var _url=param.url;
		if(!_url||_url==""){
			return;
		}
		var uuid=(new Date()).getTime()+""+Math.random();
		uuid=uuid.replace(".","");
		//新生成一个form表单
		var _formId='_form_'+uuid;
		var _form=$('<form id="'+_formId+'" method="post" enctype="multipart/form-data"></form>').appendTo($("body"));
		//如果有其他参数，则加进去
		var _data=_param.data||{};
		
		for(var k in _data){
			$('<input name="'+k+'" type="hidden" value="'+_data[k]+'">').appendTo(_form);
		}
		
		//如果有文件files:[{id:fileElId,name:fileName}]
		var _files=_param.files||[];
		for(var i=0,len=_files.length;i<len;i++){
			var file=_files[i];
			//克隆原始对象
			var cloneEl=$("#"+file.id).clone();
			//改变克隆对象的Id和name
			var _id=Math.random()+"";
			_id=_id.replace(".","");
			$(cloneEl).attr('id', _id);
			$(cloneEl).attr('name', file.name);
			//克隆对象添加到form表单
			$(cloneEl).appendTo(_form);
			//$('<input name="'+file.name+'" type="file" value="'+file.value+'" />').appendTo(_form);
		}
		
		var _cache=_param.cache||false;
		var _dataType=_param.dataType||"json";
		
		var _success=_param.success;//成功的执行函数
		var _error=_param.error;//失败的执行函数
		
		$('#'+_formId).ajaxSubmit({
			url:_url,
			async:false,
		    cache:_cache,
		    dataType:_dataType,
		    success: function(result) {
		    	if(result.code==1010){
					//未登录
					location.href="/admin/login.html";
				}else if(result.code==1009){
					//没有权限
					location.href="/admin/login.html";
				}else{
					if(typeof _success==='function'){
						_success(result);
					}
				}
		    	//执行完后，删除form表单
		    	$("#"+_formId).remove();
		    },
		    error:function(XMLHttpRequest, textStatus, errorThrown){
		    	if(typeof _error === 'function'){
					_error(XMLHttpRequest);
				}
		    	//执行完后，删除form表单
		    	$("#"+_formId).remove();
		    }
		});
	},
	
	/**
	 * 消息提示
	 */
	Msg:{
		info:function(msg,callback){
			alert(msg);
			if(callback){
				setTimeout(function(){
					callback();
				},5000);
			}
		},
		alert:function(msg,callback){
			alert(msg);
			if(callback){
				setTimeout(function(){
					callback();
				},2000);
			}
		}
	},
	/**
	 * Cookie工具类
	 */
	Cookie:{
		add:function(name, value,path,expires,domain,secure){
			var _name=name;
			var _value=value||"";
			var _expires=expires||"";
			if(_expires!=""){
				_expires=";expires="+expires.toGMTString();
			}
			var _path=path||"";
			if(_path!=""){
				_path=";path="+path;
			}
			var _domain=domain||"";
			if(_domain!=""){
				_domain=";domain="+_domain;
			}
			var _secure=secure||"";
			if(_secure!=""){
				_secure=";secure="+_secure;
			}
			document.cookie=name+"="+escape(value)
				+_expires
				+_path
				+_domain
				+_secure;
		},
		del:function(name){
			CommonUtils.Cookie.add(name,"");
		},
		get:function(cname){
			var name=cname+"=";
		    var ca=document.cookie.split(';');
		    for(var i=0,len=ca.length;i<len;i++) {
		        var c=ca[i];
		        while (c.charAt(0)==' ') c=c.substring(1);
		        if(c.indexOf(name) != -1) return c.substring(name.length, c.length);
		    }
		    return "";
		}
	}
}
