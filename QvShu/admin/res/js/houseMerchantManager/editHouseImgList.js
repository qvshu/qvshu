var EditHouseImgList={
	_id:null,
	_imgId:0,
	_imgWidgetList:[],
	
	init:function(){
		var self=this;
		self._id=CommonUtils.getParam("houseId");
		self._render();
		self._bind();
		
		//加载数据
		self._getHouse();
	},
	_render:function(){
		var self=this;
		
	},
	_bind:function(){
		var self=this;
		
		$("#appendBtn").unbind("click").click(function(){
			//生存容器
			setTimeout(function(){
				var i=self._imgWidgetList.length;
				var _html='<li><div id="img'+i+'"></div></li>';
				$("#upload_list").append(_html);
			},0);
			//渲染控件
			setTimeout(function(){
				var imgw=$("#img"+self._imgWidgetList.length).FileWidget({});
				self._imgWidgetList.push(imgw);
			},200);
		});
		
		$("#saveBtn").unbind("click").click(function(){
			self._uplaodImg();
		});
	},
	_getHouse:function(){
		var self=this;
		CommonUtils.async({
			url:"/hishu/admin/getHouse.json",
			data:{id:self._id},
			success:function(result){
				if(result.code==0){
					var house=result.data;
					//渲染数据
					var name=house.name;
					$("#name").html(name);
					var districtName=house.districtName;
					$("#districtName").val(districtName);
					
					var houseImgList=house.houseImgList||[];
					//houseImgList.push({id:0,url:"http://localhost/admin/file/house4/e9f95f935def453fa396db550a733a52.jpg"});
					
					//先生存容器
					setTimeout(function(){
						var _html='';
						for(var i=0,len=houseImgList.length;i<len;i++){
							_html+='<li><div id="img'+self._imgId+'"></div></li>';
							self._imgId++;
						}
						$("#upload_list").html(_html);
					},0);
					
					//生成控件
					setTimeout(function(){
						var _ii=0;
						for(var i=0,len=houseImgList.length;i<len;i++){
							var img=houseImgList[i];
							var url=img.url;
							var imgw=$("#img"+_ii).FileWidget({url:url,onDeleteImg:function(){
								//删除图片事件
								self._deleteHouseImg(img.id);
							}});
							self._imgWidgetList.push(imgw);
							_ii++;
						}
					},500);
					
					
				}
			}
		});
		
	},
	_uplaodImg:function(){
		var self=this;
		var param={id:self._id,imgCount:self._imgWidgetList.length};
		
		var files=[];
		for(var i=0,len=self._imgWidgetList.length;i<len;i++){
			var img=self._imgWidgetList[i].getValue();
			if(img&&img!=""){
				files.push({id:self._imgWidgetList[i].getFileElId(),name:"img"+i,value:img});
			}
		}
		
		CommonUtils.uploadFile({
			url:"/hishu/admin/uploadHouseImgs.json",
			data:param,
			files:files,
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功",function(){
						//跳转到列表页面
						location.href="/admin/houseMerchantManager/houseList2.html";
					});
				}else{
					CommonUtils.Msg.alert("失败");
				}
			},
			error:function(result){
				CommonUtils.Msg.alert("失败");
			}
		});
	},
	_deleteHouseImg:function(id){
		CommonUtils.async({
			url:"/hishu/admin/deleteHouseImg.json",
			data:{id:id},
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功");
				}else{
					CommonUtils.Msg.alert("失败");
				}
			},
			error:function(result){
				CommonUtils.Msg.alert("失败");
			}
		});
	}
}
$(function(){
	EditHouseImgList.init();
});