/**
 * 公共常量
 */
var Constant={
	USER_ACCOUNT_COOKIE_KEY:"hishu_account_",
	USER_NAME_COOKIE_KEY:"hishu_name_",
	USER_ACCOUNT_MODULE_COOKIE_KEY:"hishu_module_",
	USER_ACCOUNT_AUTHS_COOKIE_KEY:"hishu_auth_"
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
		var _contentType=param.contentType||"json";
		if("json"==_contentType){
			_contentType="application/json;charset=UTF-8";//json
		}else{
			_contentType="application/x-www-form-urlencoded;charset=UTF-8";//string
		}
		
		var _success=_param.success;//成功的执行函数
		var _error=_param.error;//失败的执行函数
		
		$.ajax({
			type:_post,
			url:_url,
			dataType:_dataType,
			data:_data,
			async:_async,
			//contentType:_contentType,
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
			//填充消息
			$("#msgInfoContent").html(msg);
			//弹出消息
			$('#msgInfoWidget').modal({});
			//关闭消息
			setTimeout(function(){
				$('#msgInfoWidget').modal('hide');
				if(callback){
					callback();
				}
			},2000);
		},
		alert:function(msg,callback){
			$("#errorInfoContent").html(msg);
			//弹出消息
			$('#errorInfoWidget').modal({});
			//关闭消息
			setTimeout(function(){
				$('#errorInfoWidget').modal('hide');
				if(callback){
					callback();
				}
			},4000);
		},
		confirm:function(msg,yesCallback,noCallback){
			$("#confirmContent").html(msg);
			$('#confirmWidget').modal({});
			$("#confirmWidgetYes").unbind("click").click(function(){
				$('#confirmWidget').modal('hide');
				yesCallback();
			});
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
		del:function(name,path){
			CommonUtils.Cookie.add(name,"",path);
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
	},
	/**
	 * 获取url参数方法
	 * @param str
	 * @param name
	 * @returns
	 */
	getParam:function(name){
		if(!name){
			return null;
		}
		var reg=new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
		var r=location.search.substr(1).match(reg);
		if (r!=null) return (r[2]); return null;
	}
}

/**
 * 时间工具
 */
var TimeUtils={
	FORMAT_YYYYMM:"yyyy-MM",
	FORMAT_YYYYMMDD:"yyyy-MM-dd",
	FORMAT_YYYYMMDDHHMMSS:"yyyy-MM-dd HH:mm:ss",
	YEAR:"year",
	MONTH:"month",
	DAY:"day",
	
	_padleft0:function (obj) {////补齐两位数
		return obj.toString().replace(/^[0-9]{1}$/, "0" + obj);
	},
	string2Date:function(str,format){
		var self=this;
		if(!str||str==""){
			return null;
		}
		format=format||self.FORMAT_YYYYMMDDHHMMSS;
		
		if(self.FORMAT_YYYYMMDDHHMMSS==format){
			return new Date(Date.parse(str.replace(/-/g, "/")));
		}
		return null;
	},
	date2String:function(date,format){
		var self = this;

		var _year = date.getFullYear();
		var _month = self._padleft0((date.getMonth() + 1));
		var _day = self._padleft0(date.getDate());
		var _hour = self._padleft0(date.getHours());
		var _minute = self._padleft0(date.getMinutes());
		var _second = self._padleft0(date.getSeconds());

		//if (_month < 10) {
		//    _month = "0" + _month;
		//}
		//if (_day < 10) {
		//    _day = "0" + _day;
		//}
		var ret="";
		var _format=format||self.FORMAT_YYYYMMDDHHMMSS;//默认格式
		switch(_format){
			case "MM月dd日":{
				ret=_month+"月"+_day+"日";
				break;
			}
			case "yyyy-MM":{
				ret=_year+"-"+_month;
				break;
			}
			case "yyyy-MM-dd":{
				ret=_year+"-"+_month+"-"+_day;
				break;
			}case "yyyy-MM-dd HH":{
				ret=_year+"-"+_month+"-"+_day+" "+_hour;
				break;
			}case "yyyy-MM-dd HH:mm":{
				ret=_year+"-"+_month+"-"+_day+" "+_hour+":"+_minute;
				break;
			}case "yyyy-MM-dd HH:mm:ss":{
				ret=_year+"-"+_month+"-"+_day+" "+_hour+":"+_minute+":"+_second;
				break;
			}
		}
		return ret;
	},
	timeDiff:function(time1,time2){
		if(time1==null||time2==null){
			return 0;
		}
		var iTimes=parseInt(Math.abs(time1-time2)/1000); //把相差的毫秒数转换为秒数
		return iTimes;
	},
	add:function(time,field, amount){
		var self=this;
		if(!time){
			return;
		}
		//先克隆一个时间
		var _timeStr=self.date2String(time,self.FORMAT_YYYYMMDDHHMMSS);
		var _timeClone=self.string2Date(_timeStr,self.FORMAT_YYYYMMDDHHMMSS);
		
		switch(field){
		case self.MONTH:{
			_timeClone.setMonth(_timeClone.getMonth() + amount);
			return _timeClone;
		}
		case self.DAY:{
			var tt=time.setDate(time.getDate()+amount);
			var newTime=new Date(tt);
			return newTime;
		}
		}
	},
	getWeek:function(time){
		//var a=new Array("日", "一", "二", "三", "四", "五", "六");
		var week=time.getDay();
		//return a[week];
		return week;
	},
	/**
	 * 计算指定时间所在月份有多少天
	 */
	getDaysOfMonth:function(time){
		var self=this;
		var str=self.date2String(time,self.FORMAT_YYYYMM);
		var items=str.split("-");
		var year=items[0];
		var month=items[1];
		
		var days=0;
		if (month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12)
			days=31;
		else if (month==4 || month==6 || month==9 || month==11)
			days=30;
		else if (month==2) {
			if (year%4==0){//闰月
				days=29;
			}else {
				days=28;
			}
		}
		return (days);
	}
}

function logout(){
	CommonUtils.async({
		url:"/hishu/common/logout.json",
		data:{},
		success:function(result){
			//清掉缓存
			setTimeout(function(){
				var _account=CommonUtils.Cookie.get(Constant.USER_ACCOUNT_COOKIE_KEY);
				CommonUtils.Cookie.del(Constant.USER_ACCOUNT_COOKIE_KEY,"/");
				CommonUtils.Cookie.del(Constant.USER_NAME_COOKIE_KEY,"/");
				CommonUtils.Cookie.del(Constant.USER_ACCOUNT_MODULE_COOKIE_KEY,"/");
				CommonUtils.Cookie.del(Constant.USER_ACCOUNT_AUTHS_COOKIE_KEY,"/");
			},0);
			//返回登录页
			setTimeout(function(){
				location.href="/admin/login.html";
			},200);
		},
		error:function(error){
			
		}
	});
}
