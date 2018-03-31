var EditDistrict={
	_id:null,
	_cityWidget:null,
	_map:null,
	
	_file1:null,
	_file2:null,
	_file3:null,
	_file4:null,
	_file5:null,
	
	_peripheralImg1:null,
	_peripheralImg2:null,
	_peripheralImg3:null,
	_peripheralImg4:null,
	_peripheralImg5:null,
	
	init:function(){
		var self=this;
		self._id=CommonUtils.getParam("districtId");
		self._render();
		self._bind();
		self._getDistrict();
	},
	_render:function(){
		var self=this;
		
		self._cityWidget=$("#cityWidget").ComboBoxWidget({
			url:"/hishu/admin/getCityList.json",
			selectTip:"选择城市",
			textField:"name",
			valueField:"id"
		});
		
		//上传图片控件
		self._file1=$("#img1").FileWidget({});
		self._file2=$("#img2").FileWidget({});
		self._file3=$("#img3").FileWidget({});
		self._file4=$("#img4").FileWidget({});
		self._file5=$("#img5").FileWidget({});
		
		self._peripheralImg1=$("#peripheralImg1").FileWidget({});
		self._peripheralImg2=$("#peripheralImg2").FileWidget({});
		self._peripheralImg3=$("#peripheralImg3").FileWidget({});
		self._peripheralImg4=$("#peripheralImg4").FileWidget({});
		self._peripheralImg5=$("#peripheralImg5").FileWidget({});
	},
	_renderMap:function(){
		var self=this;
		self._map = new BMap.Map("map");    // 创建Map实例
		map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
		//添加地图类型控件
		map.addControl(new BMap.MapTypeControl({
			mapTypes:[
	            BMAP_NORMAL_MAP,
	            BMAP_HYBRID_MAP
	        ]}));	  
		map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
		map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
	},
	_bind:function(){
		var self=this;
		$("#saveBtn").unbind("click").click(function(){
			self._saveDistrict();
		});
	},
	_getDistrict:function(){
		var self=this;
		
		CommonUtils.async({
			url:"/hishu/admin/getDistrict.json",
			data:{id:self._id},
			success:function(result){
				if(result.code==0){
					//填充数据
					var district=result.data;
					
					$("#seoTitle").val(district.seoTitle);
					$("#tagWords").val(district.tagWords);
					$("#keyWords").val(district.keyWords);
					self._cityWidget.setValue(district.cityId);
					$("#name").val(district.name);
					var lonlat=district.longitude+","+district.latitude;
					$("#lonlat").val(lonlat);
					//地图画点
					//console.info(document.getElementById('mapIFrame').contentWindow);
					document.getElementById('mapIFrame').contentWindow.addPoint();
					$("#introduce").val(district.introduce);
					$("#peripheral").val(district.peripheral);
					
					var districtImgs=district.districtImgs||[];
					var c1=0;
					var c2=0;
					for(var i=0,len=districtImgs.length;i<len;i++){
						var img=districtImgs[i];
						if("common"==img.type){
							//普通
							switch(c1){
							case 0:{
								self._file1.setValue(img.url);
								self._file1.setOnDeleteImg(function(){
									self._deleteDistrictImg(img.id);
								});
								break;
							}
							case 1:{
								self._file2.setValue(img.url);
								self._file2.setOnDeleteImg(function(){
									self._deleteDistrictImg(img.id);
								});
								break;
							}
							case 2:{
								self._file3.setValue(img.url);
								self._file3.setOnDeleteImg(function(){
									self._deleteDistrictImg(img.id);
								});
								break;
							}
							case 3:{
								self._file4.setValue(img.url);
								self._file4.setOnDeleteImg(function(){
									self._deleteDistrictImg(img.id);
								});
								break;
							}
							case 4:{
								self._file5.setValue(img.url);
								self._file5.setOnDeleteImg(function(){
									self._deleteDistrictImg(img.id);
								});
								break;
							}
							}
							c1++;
						}else if("peripheral"==img.type){
							//周边
							switch(c2){
							case 0:{
								self._peripheralImg1.setValue(img.url);
								self._peripheralImg1.setOnDeleteImg(function(){
									self._deleteDistrictImg(img.id);
								});
								break;
							}
							case 1:{
								self._peripheralImg2.setValue(img.url);
								self._peripheralImg2.setOnDeleteImg(function(){
									self._deleteDistrictImg(img.id);
								});
								break;
							}
							case 2:{
								self._peripheralImg3.setValue(img.url);
								self._peripheralImg3.setOnDeleteImg(function(){
									self._deleteDistrictImg(img.id);
								});
								break;
							}
							case 3:{
								self._peripheralImg4.setValue(img.url);
								self._peripheralImg4.setOnDeleteImg(function(){
									self._deleteDistrictImg(img.id);
								});
								break;
							}
							case 4:{
								self._peripheralImg5.setValue(img.url);
								self._peripheralImg5.setOnDeleteImg(function(){
									self._deleteDistrictImg(img.id);
								});
								break;
							}
							}
							c2++;
						}
					}
					
				}
			}
		});
	},
	_saveDistrict:function(){
		var self=this;
		
		var seoTitle=$("#seoTitle").val();
		var tagWords=$("#tagWords").val();
		var keyWords=$("#keyWords").val();
		var cityId=self._cityWidget.getValue();
		var name=$("#name").val();
		var lonlat=$("#lonlat").val()||"";
		var items=lonlat.split(",");
		var longitude=items[0];
		var latitude=items[1];
		var introduce=$("#introduce").val();
		var peripheral=$("#peripheral").val();
		
		var district={
			id:self._id,
			seoTitle:seoTitle,
			tagWords:tagWords,
			keyWords:keyWords,
			cityId:cityId,
			name:name,
			longitude:longitude,
			latitude:latitude,
			introduce:introduce,
			peripheral:peripheral
		};
		var files=[];
		var img1=self._file1.getValue();
		if(img1&&img1!=""){
			files.push({id:self._file1.getFileElId(),name:"img1",value:img1});
		}
		var img2=self._file2.getValue();
		if(img2&&img2!=""){
			files.push({id:self._file2.getFileElId(),name:"img2",value:img2});
		}
		var img3=self._file3.getValue();
		if(img3&&img3!=""){
			files.push({id:self._file3.getFileElId(),name:"img3",value:img3});
		}
		var img4=self._file4.getValue();
		if(img4&&img4!=""){
			files.push({id:self._file4.getFileElId(),name:"img4",value:img4});
		}
		var img5=self._file5.getValue();
		if(img5&&img5!=""){
			files.push({id:self._file5.getFileElId(),name:"img5",value:img5});
		}
		
		var peripheralImg1=self._peripheralImg1.getValue();
		if(peripheralImg1&&peripheralImg1!=""){
			files.push({id:self._peripheralImg1.getFileElId(),name:"peripheralImg1",value:peripheralImg1});
		}
		var peripheralImg2=self._peripheralImg2.getValue();
		if(peripheralImg2&&peripheralImg2!=""){
			files.push({id:self._peripheralImg2.getFileElId(),name:"peripheralImg2",value:peripheralImg2});
		}
		var peripheralImg3=self._peripheralImg3.getValue();
		if(peripheralImg3&&peripheralImg3!=""){
			files.push({id:self._peripheralImg4.getFileElId(),name:"peripheralImg3",value:peripheralImg3});
		}
		var peripheralImg4=self._peripheralImg4.getValue();
		if(peripheralImg4&&peripheralImg4!=""){
			files.push({id:self._peripheralImg4.getFileElId(),name:"peripheralImg4",value:peripheralImg4});
		}
		var peripheralImg5=self._peripheralImg5.getValue();
		if(peripheralImg5&&peripheralImg5!=""){
			files.push({id:self._peripheralImg5.getFileElId(),name:"peripheralImg5",value:peripheralImg5});
		}
		
		CommonUtils.uploadFile({
			url:"/hishu/admin/updateDistrict.json",
			data:district,
			files:files,
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功",function(){
						//跳转到列表页面
						location.href="/admin/houseMerchantManager/houseList.html";
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
	_deleteDistrictImg:function(id){
		var self=this;
		CommonUtils.async({
			url:"/hishu/admin/deleteDistrictImg.json",
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
	EditDistrict.init();
});