/*
 *	自定义table控件 
 * 
 */
(function(){
	
	var _table={
		id:null,//控件id
		el:null,//控件容器
		
		conf:{},
		param:{},//查询时的参数
		
		init:function(config){
			var self=this;
			self.conf=config||{};
			
			self._render();
			self._bind();
		},
		_render:function(){
			var self=this;
			var _c=self.conf||{};
			//加上默认class
			if(!self.el.hasClass("panel-body")){
				self.el.addClass("panel-body");
			}
			//table执行横向滚动，所以需要加一个div
			var _tableDiv1='<div id="'+self.id+'_tableC1" class="col-sm-12 " style="overflow-x: scroll;">';
			var _tableDiv2='</div>';
			
			var _table='<table id="'+self.id+'_table1" class="table table-hover">';
			//self.el.append(_table);
			var _theader='<thead><tr class="active">';
			//根据配置加载header
			var _cels=_c.cels||[];
			for(var i=0,il=_cels.length;i<il;i++){
				var _cel=_cels[i];
				var _name=_cel.textField;
				var _width=_cel.width;
				var _w="";
				if(_width){
					_w='width="'+_width+'"';
				}
				_theader+='<th '+_w+'>'+_name+'</th>';
			}
			_theader+='</tr></thead>';
			
			//加上header
			_table+=_theader;
			//加上header
			var _tbody='<tbody id="'+self.id+'_tbody"></tbody>';
			//加上body
			_table+=_tbody;
			_table+='</table>';
			
			var _tableBody=_tableDiv1+_table+_tableDiv2;
			
			self.el.append(_tableBody);
			setTimeout(function(){
				//执行renderReady事件
				if(_c.afterRender){
					_c.afterRender();
				}
			},200);
			
			//分页器
			var _showPagination=_c.showPagination;
			if(typeof(_showPagination)=="undefined"){
				//typeof 返回的是字符串,有六种可能:"number" "String" "boolean" "object" "function" "undefined"
				_showPagination=true;//默认显示分页器
			}
			if(_showPagination){
				var _tfooter='<div class="clearfix">'
					+'<ul id="'+self.id+'_pagination" class="pagination pull-right">'
					+'<li class="firstPage"><a>«</a></li>'//首页
					+'<li id="'+self.id+'_previous" class="previousPage"><a>上一页</a></li>'//上一页
					//动态生成
					/*+'<li class="active"><a>1</a></li>'
					+'<li><a>2</a></li>'
					+'<li><a>3</a></li>'
					+'<li><a>4</a></li>'
					+'<li><a>5</a></li>'*/
					
					+'<li class="nextPage"><a>下一页</a></li>'//下一页
					+'<li class="lastPage" ><a>»</a></li>'//尾页
					+'<div style="float:left;margin-left:5px;height:31px;text-align:center;line-height:33px;font-size:14px;">'
					+'<span style="color:#488662;font-weight:bold;" id="'+self.id+'_currentPage">1</span>/'//当前页
					+'<span id="'+self.id+'_totalPageCount">1</span>'//总页数
					+'</div>'
					+'<li style="margin-left:10px;">'
					//可输入的当前页
					+'<input id="'+self.id+'_inputPage" type="text" class="form-control" style="width:81px;height:30px;display:inline-block;margin-right:5px;" value="1">'
					+'<button id="'+self.id+'_gotoPageBtn" class="btn btn-sm btn-success" style="margin:0;">确定</button>'
					+'</li>'
					+'</ul>'
					//总共有多少条数据
					+'<span class="page-info">共有<span id="'+self.id+'_totalCount" class="c-orange js-total-area">0</span>条数据</span>'
					
					+'</div>';
				//加上footer
				self.el.append(_tfooter);
			}
			if(_c.url&&_c.url!=""){
				//加载数据
				var _pageSize=_c.pageSize||10;
				var _param={pageSize:_pageSize,pageNum:1};
				self._loadUrl(_param);
			}else if(_c.rows){
				var _rows=_c.rows||[];
				//加载数据
				var _pageNum=1;
				var _total=_rows.length||0;
				self._loadData(_rows,_pageNum,_total);
			}
		},
		_bind:function(){
			var self=this;
			
			//页码点击事件
			$("#"+self.id+"_pagination").on("click","li", function(){
			     if($(this).hasClass("pageItem")){
			    	 //如果是页码才生效
			    	 var idata=$(this).attr("idata");
			    	 
			    	 self._gotoPageNum(idata);
			     }else if($(this).hasClass("firstPage")){
			    	 //第一页
			    	 self._gotoPageNum(1);
			     }else if($(this).hasClass("lastPage")){
			    	 //最后一页
			    	 var totalPageCount=$("#"+self.id+"_totalPageCount").text();
			    	 if(!totalPageCount||totalPageCount==""){
			    		 totalPageCount=1;
			    	 }
			    	 self._gotoPageNum(totalPageCount);
			     }else if($(this).hasClass("previousPage")){
			    	 //上一页
			    	 var currentPageNum=$("#"+self.id+"_currentPage").text();
			    	 if(!currentPageNum||currentPageNum==""){
			    		 currentPageNum=1;
			    	 }
			    	 currentPageNum=currentPageNum*1-1;
			    	 if(currentPageNum<1){
			    		 currentPageNum=1;
			    	 }
			    	 self._gotoPageNum(currentPageNum);
			     }else if($(this).hasClass("nextPage")){
			    	 //下一页
			    	 var currentPageNum=$("#"+self.id+"_currentPage").text();
			    	 if(!currentPageNum||currentPageNum==""){
			    		 currentPageNum=1;
			    	 }
			    	 var totalPageCount=$("#"+self.id+"_totalPageCount").text();
			    	 if(!totalPageCount||totalPageCount==""){
			    		 totalPageCount=1;
			    	 }
			    	 currentPageNum=currentPageNum*1+1
			    	 if(currentPageNum>totalPageCount){
			    		 currentPageNum=totalPageCount;
			    	 }
			    	 self._gotoPageNum(currentPageNum);
			     }
			});
			
			//输入页面点击事件
			$("#"+self.id+"_gotoPageBtn").unbind("click").click(function(){
				var _inputPage=$("#"+self.id+"_inputPage").val();
				_inputPage=_inputPage*1;
				var totalPageCount=$("#"+self.id+"_totalPageCount").text();
		    	if(!totalPageCount||totalPageCount==""){
		    		totalPageCount=1;
		    	}
		    	if(_inputPage>=1&&_inputPage<=totalPageCount){
		    		//符合页面才能查询
		    		self._gotoPageNum(_inputPage);
		    	}
			});
			
			
			
			
		},
		_total:0,
		_firstRow:null,
		
		_loadData:function(rows,pageNum,total){
			var self=this;
			var _c=self.conf;
			var cels=_c.cels;
			
			self._total=total;
			
			var _html='';
			for(var i=0,len=rows.length;i<len;i++){
				var row=rows[i];
				if(i==0){
					self._firstRow=row;
				}
				
				_html+='<tr>';
				//根据列头获取值
				for(var j=0,jl=cels.length;j<jl;j++){
					var cel=cels[j];
					var name=cel.valueField;
					
					var _w=cel.width;
					var _wCss="";
					if(_w){
						_wCss='width="'+_w+'"';
					}
					
					//如果是操作列
					if("operation"==name){
						_html+='<td '+_wCss+'>'+cel.render(_value,row)+'</td>';
						continue;
					}
					
					var _value=row[name]||"";
					//如果存在render方法，则执行render转换
					if(cel.render){
						_value=cel.render(_value,row);
					}
					_html+='<td '+_wCss+'>'+(_value||"")+'</td>';
				}
				_html+='</tr>';
			}
			
			$("#"+self.id+"_tbody").html(_html);
			//如果有分页器
			var _showPagination=_c.showPagination;
			if(typeof(_showPagination)=="undefined"){
				//typeof 返回的是字符串,有六种可能:"number" "String" "boolean" "object" "function" "undefined"
				_showPagination=true;//默认显示分页器
			}
			if(_showPagination){
				//设置总条数
				$("#"+self.id+"_totalCount").html(total);
				//计算有多少页
				var pageSize=_c.pageSize||10;
				var totalPageCount=Math.ceil(total/pageSize);//总共有多少页
				
				$("#"+self.id+"_currentPage").html(pageNum);
				$("#"+self.id+"_totalPageCount").html(totalPageCount);
				
				var n=5;
				var m=Math.ceil(n/2);
				
				//如果当前页大于总页数
				if(pageNum>totalPageCount){
					pageNum=totalPageCount;
				}
				
				var pageArr=[];
				if(pageNum<=m){
					//前半页码
					for(var k=1;k<=m;k++){
						if(k>totalPageCount){
							//如果超出了总页数
							continue;
						}
						pageArr.push(k);
					}
					//后半页码
					for(var u=pageArr[pageArr.length-1]+1;u<=n;u++){
						if(u>totalPageCount){
							continue;
						}
						pageArr.push(u);
					}
				}else if(pageNum>=(totalPageCount-m+1)){
					for(var y=(totalPageCount-n+1);y<=totalPageCount;y++){
						if(y<=0){
							continue;
						}
						pageArr.push(y);
					}
					
				}else{
					//前半页码
					for(var t=(pageNum-m+1);t<=pageNum;t++){
						if(t>totalPageCount){
							//如果超出了总页数
							continue;
						}
						pageArr.push(t);
					}
					
					//后半页码
					for(var w=pageArr[pageArr.length-1]+1;w<=(pageNum+m-1);w++){
						if(w>totalPageCount){
							//如果超出了总页数
							continue;
						}
						pageArr.push(w);
					}
				}
				
				//先删除以前的页码
				$("#"+self.id+"_pagination").find(".pageItem").remove();
				
				//渲染页码
				var _pageNumList='';
				for(var i=0,len=pageArr.length;i<len;i++){
					if(pageArr[i]==pageNum){
						_pageNumList+='<li class="pageItem active" idata="'+pageArr[i]+'"><a>'+pageArr[i]+'</a></li>';
					}else{
						_pageNumList+='<li class="pageItem" idata="'+pageArr[i]+'"><a>'+pageArr[i]+'</a></li>';
					}
				}
				//后插
				//$("#beijing").after("<li id='shenzhen'>[shenzhen]</li>");
				$("#"+self.id+"_previous").after(_pageNumList);
				//前插
				//$("#beijing").before($("<li id='shenzhen'>[shenzhen]</li>"));
			}
			
			//加载完数据后，执行completeLoad方法
			self._completeLoad();
		},
		_gotoPageNum:function(pageNum){
			var self=this;
			var _param=self.param;//如果用户有传参数进行再次查询，则页面跳转时，需要附带上上次查询的参数
			_param.pageNum=pageNum;//加上页码
			_param.pageSize=self.conf.pageSize||10;
			self._loadUrl(_param);
		},
		_loadUrl:function(param){
			var self=this;
			var _url=self.conf.url;
			var queryPageNum=param.pageNum;
			
			CommonUtils.async({
				url:_url,
				data:param,
				success:function(result){
					if(result.code==0){
						var ret=result.data;
						var list=ret.list||[];
						var total=ret.total||0;
						self._loadData(list,queryPageNum,total);
					}
				}
			});
		},
		_completeLoad:function(){
			var self=this;
			if(self.conf.completeLoad){
				self.conf.completeLoad(self._total,self._firstRow);
			}
		},
		/**
		 * 提供给外部使用
		 */
		query:function(param){
			var self=this;
			self.param=param||{};
			var _param=self.param;
			//加上页码，默认是1
			_param.pageNum=1;
			
			self._loadUrl(_param);
		},
		reload:function(){
			var self=this;
			self.query();
		}
	}
	
	$.fn.TableWidget=function(options){
		var defualts={};//默认设置
		var _c=$.extend(defualts,options);
		
		var _o=$.extend({},_table);
		
		var uuid=new Date().getTime();
		uuid+=""+parseInt(Math.random()*1000+1);
		
		_o.id=uuid;
		_o.el=this;
		
		_o.init(_c);
		
		return _o;
	}
	
})();

