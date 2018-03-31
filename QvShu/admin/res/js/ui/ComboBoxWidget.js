/*
 *	自定义combox 
 * 
 **/
(function(){
	
	var _comboBox={
		id:null,
		el:null,
		
		conf:{},
		param:{},
		_textField:"name",
		_valueField:"value",
		
		/**
		 * 点击事件
		 */
		onClick:function(item,callback){
			
		},
		
		init:function(c){
			var self=this;
			var _c=c||{};
			
			self.conf=_c;
			if(_c.param){
				self.param=_c.param;
			}
			if(_c.onClick){
				self.onClick=_c.onClick;
			}
			if(_c.textField){
				self._textField=_c.textField;
			}
			if(_c.valueField){
				self._valueField=_c.valueField;
			}
			
			self._render();
			self._bind();
		},
		_render:function(){
			var self=this;
			//加上样式
			if(!$(self.el).hasClass("col-sm-2")){
				$(self.el).addClass("col-sm-2");
			}
			
			var _selectTip=self.conf.selectTip||"请选择";
			
			var _html='<select class="form-control" id="'+self.id+'"><option value="">'+_selectTip+'</option></<select>';
			$(self.el).html(_html);
			var _url=self.conf.url||"";
			if(_url!=""){
				self.loadUrl(_url);
			}else if(self.conf.data){
				self.loadData(self.conf.data);
			}
			
			self._bind();
		},
		_bind:function(){
			var self=this;
			
			//绑定事件
			$(self.el).find("#"+self.id).unbind("change").bind("change",function(){
			    var value=$(this).val();
			    if(""==value){
			    	return;
			    }
			    var text=$(this).find("option:selected").text();
			    var s="{"+self._textField+":'"+text+"',"+self._valueField+":'"+value+"'}";
			    eval("var item="+s);
			    self.onClick(item);
			});
			
		},
		loadUrl:function(url){
			var self=this;
			
			CommonUtils.async({
				url:url,
				data:self.param,
				success:function(result){
					if(result.code==0){
						//填充数据
						var list=result.data.list||[];
						self.loadData(list);
					}
				}
			});
		},
		loadData:function(data){
			var self=this;
			var _selectTip=self.conf.selectTip||"请选择";
			var _html='<option value="">'+_selectTip+'</option>';
			for(var i=0,len=data.length;i<len;i++){
				var item=data[i];
				var selected='';
				if(self.conf.defaultValue&&self.conf.defaultValue==item[self._valueField]){
					selected='selected="selected"';
				}
				
				_html+='<option class="comboxItem" '+selected+' value="'+item[self._valueField]+'">'+item[self._textField]+'</option>';
			}
			$("#"+self.id).html(_html);
			if(self.conf.onLoad){
				self.conf.onLoad(data);
			}
		},
		getValue:function(){
			var self=this;
			var v=$("#"+self.id).val();
			
			return v;
		},
		setValue:function(value){
			var self=this;
			$("#"+self.id).val(value);
		},
		getText:function(){
			var self=this;
			var text=$("#"+self.id).find("option:selected").text();
			if(text==self.conf.selectTip){
				return "";
			}
			return text;
		},
		setText:function(text){
			var self=this;
			//$("#deptlistbak option:contains('天津本部')").prop('selected',true);
			$("#"+self.id+" option:contains('"+text+"')").prop('selected',true);
		}
	}
	
	//通过jquery生成控件
	$.fn.ComboBoxWidget=function(options){
		var defualts={};//默认设置
		var _c=$.extend(defualts,options);
		
		var _o=$.extend({},_comboBox);
		
		var uuid=new Date().getTime();
		uuid+=""+parseInt(Math.random()*1000+1);
		
		_o.id="cobx"+uuid;
		_o.el=this;
		
		_o.init(_c);
		
		return _o;
	}
})();