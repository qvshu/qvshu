/*
 * 全局静态变量
 * */
var Constant={
	PROJECT_NAME:"qbs"
}

/*
 * 微信分享
 * */
var WechatUtils={
	init:function(){
		var u=location.href.split('#')[0];
		var host=CommonUtils.getHost();
		var url="http://"+host+"/hiweb/wx/getWechatConfig.json"
		CommonUtils.async({
			url:url,
			data:{url:u},
			success:function(result){
				if(result.code!=0){
					return;
				}
				var data=result.data;
				var appId=data.appId;
				var noncestr=data.noncestr;
				var timestamp=data.timestamp;
				var signature=data.signature;
				
				//初始化微信的config
				wx.config({
				    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				    appId: appId, // 必填，公众号的唯一标识
				    timestamp: timestamp, // 必填，生成签名的时间戳
				    nonceStr: noncestr, // 必填，生成签名的随机串
				    signature: signature,// 必填，签名，见附录1
				    jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
				});
			}
		});
		
		
		/*var url=location.href;
		//解析出appId,timestamp,nonceStr,signature
		var items=url.split("#");
		var str=items[1];
		var ss=str.split("_");
		var appId=ss[0];
		var timestamp=ss[1];
		var nonceStr=ss[2];
		var signature=ss[3];*/
	}
}

/*
 * 公共方法
 * */
var CommonUtils={
	getHost:function(){
		var serverPath=window.location.host;
		return serverPath;
	},
	getQueryString:function(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);
	    if(r!=null)return  unescape(r[2]); return null;
	},
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
				//统一处理返回的错误结果
				if(!result || result ==""){
					return;
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
	 * 消息类
	 */
	Msg:{
		info:function(msg,callback,delayed){
			var uuid=new Date().getTime();
			var _delayed=delayed||3;
			var _html='<div id="msg'+uuid+'" class="msg-mode js-mode">'+msg+'</div>';
			$("body").append(_html);
			setTimeout(function(){
				$("#msg"+uuid).addClass("hide").remove();
				if(callback){
					callback();
				}
			},_delayed*1000);
		},
		alert:function(msg,callback,delayed){
			var uuid=new Date().getTime();
			var _delayed=delayed||3;
			var _html='<div id="msg'+uuid+'" class="msg-mode js-mode">'+msg+'</div>';
			$("body").append(_html);
			setTimeout(function(){
				$("#msg"+uuid).addClass("hide").remove();
				if(callback){
					callback();
				}
			},_delayed*1000);
		},
		showQRCode:function(msg,url,callback){
			var self=this;
			var _html='<div class="mask js-dcode-mask">'
				+'<div class="tip-box">'
	            +'	<div class="user-wrap">'
	            +'		<img src="" alt="">'    
	            +'	</div>'
	            +'	<div class="tip-title">住别墅找趣墅</div>'
	            +'	<div class="tip-text">'+msg+'</div>'
	            +'	<div class="dcode-wrap">'
	            +'		<img src="'+url+'" alt="">'    
	            +'	</div>'
	            +'	<div class="tip-text"></div>'
	            +'	<div class="tip-btn ">'
	            +'		<a href="javascript:void(0);" class="tip-btn-item js-center-close">长按图片下载</a>'
	            +'	</div>'
	            +'</div>'
	            +'</div>';
			$("body").append(_html);
		}
	},
	/**
	 * 获取浏览器的当前的经纬度
	 */
	Location:{
		getLonLat:function(callback){
			/*
			 * function (position) {  
			            var longitude = position.coords.longitude;  
			            var latitude = position.coords.latitude;  
			            console.log(longitude)
			            console.log(latitude)
			            }
			 * */
			
			navigator.geolocation.getCurrentPosition(function(position){
				var longitude = position.coords.longitude;  
	            var latitude = position.coords.latitude;
	            callback({
	            	longitude:longitude,
	            	latitude:latitude
	            });
			},function(e){
				var msg = e.code;
				var dd = e.message;
				console.log(msg);
				console.log(dd);
			});
		}
	},
	LocalStorage:{
		addString:function(key,value){
			localStorage.setItem(key, value);
		},
		getString:function(key){
			var value=localStorage.getItem(key);
			if(value&&value!=""){
				return value;
			}else{
				return "";
			}
		},
		addJson:function(key,obj){
			 localStorage.setItem(key, JSON.stringify(obj));
		},
		getJson:function(key){
			var value=localStorage.getItem(key);
			if(value&&value!=""){
				var data=JSON.parse(value);
				return data;
			}else{
				return null;
			}
		},
		del:function(key){
			localStorage.removeItem(key);
		}
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
		var iTimes=parseInt(Math.ceil(time1-time2)/1000); //把相差的毫秒数转换为秒数
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

//公共的设置Swiper
function initPageSwiper(){
	var swiper=new Swiper('.swiper-container',{
       pagination:'.swiper-pagination',
       paginationType:'fraction'
   });
}
