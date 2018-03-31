/*
 *	自定义文件上传预览控件
 * 
 **/
(function(){
	
	var _file={
		id:null,
		el:null,
		
		conf:{},
		
		/**
		 * 点击事件
		 */
		onClick:function(item){
			
		},
		
		init:function(c){
			var self=this;
			var _c=c||{};
			
			self.conf=_c;
			
			self._render();
			self._bind();
		},
		_render:function(){
			var self=this;
			
			var _html='<span id="btn'+self.id+'" class="upload-text">'
				+'<a href="javascript:void(0);" id="btn_upload_'+self.id+'">照片/视频名称</a>'
				+'</span>'
				+'<input class="hide" type="file" id="file'+self.id+'" multiple="multiple" />'
				+'<img id="img'+self.id+'" class="hide" src="" style="width:100%;height:100%;" />'
				+'<a id="imgDeleteBtn'+self.id+'" href="javascript:void(0);" class="delete hide"><span class="glyphicon glyphicon-trash"></span></a>';
			
			$(self.el).html(_html);
			if(self.conf.url&&self.conf.url!=""){
				setTimeout(function(){
					self.setValue(self.conf.url);
				},200);
			}
		},
		_bind:function(){
			var self=this;
			
			$(self.el).find("#btn_upload_"+self.id).unbind("click").bind("click",function(){
			    $("#file"+self.id).click();
			});
			
			$(self.el).find("#file"+self.id).unbind("change").bind("change",function(){
				$("#btn"+self.id).addClass("hide");
				$("#img"+self.id).removeClass("hide");
				$("#imgDeleteBtn"+self.id).removeClass("hide");
				
				// getObjectURL是自定义的函数，见下面  
				// this.files[0]代表的是选择的文件资源的第一个，因为上面写了 multiple="multiple" 就表示上传文件可能不止一个  
				// ，但是这里只读取第一个
				var objUrl = self._getObjectURL(this.files[0]) ;  
				// 这句代码没什么作用，删掉也可以  
				// console.log("objUrl = "+objUrl) ;  
				if (objUrl) {  
				// 在这里修改图片的地址属性  
					$("#img"+self.id).attr("src", objUrl) ;  
				}  
			});
			
			$(self.el).find("#imgDeleteBtn"+self.id).unbind("click").bind("click",function(){
				CommonUtils.Msg.confirm("是否要删除？",function(){
					//确定删除
					$("#btn"+self.id).removeClass("hide");
					$("#img"+self.id).addClass("hide");
					$("#imgDeleteBtn"+self.id).addClass("hide");
					$("#img"+self.id).attr("src", "");
					//清空file的value
					$("#file"+self.id).val("");
					if(self.conf.onDeleteImg){
						self.conf.onDeleteImg();
					}
				});
			});
			
		},
		_getObjectURL:function(file){
			var url = null ;   
			// 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已  
			if (window.createObjectURL!=undefined) { // basic  
				url = window.createObjectURL(file) ;  
			} else if (window.URL!=undefined) { // mozilla(firefox)  
				url = window.URL.createObjectURL(file) ;  
			} else if (window.webkitURL!=undefined) { // webkit or chrome  
			    url = window.webkitURL.createObjectURL(file) ;  
			}  
			return url ;  
		},
		getValue:function(){
			var self=this;
			var _value=$("#file"+self.id).val();
			
			return _value;
		},
		getFileElId:function(){
			var self=this;
			return "file"+self.id;
		},
		setValue:function(url){
			var self=this;
			$("#btn"+self.id).addClass("hide");
			$("#img"+self.id).removeClass("hide");
			$("#imgDeleteBtn"+self.id).removeClass("hide");
			$("#img"+self.id).attr("src", url);
		},
		setOnDeleteImg:function(fn){
			var self=this;
			self.conf.onDeleteImg=fn;
		}
	}
	
	//通过jquery生成控件
	$.fn.FileWidget=function(options){
		var defualts={};//默认设置
		var _c=$.extend(defualts,options);
		
		var _o=$.extend({},_file);
		
		var uuid=new Date().getTime();
		uuid+=""+parseInt(Math.random()*1000+1);
		
		_o.id="file"+uuid;
		_o.el=this;
		
		_o.init(_c);
		
		return _o;
	}
})();