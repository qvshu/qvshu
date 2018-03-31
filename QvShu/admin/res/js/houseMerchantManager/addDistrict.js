var AddDistrict={
	_cityWidget:null,
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
		
		self._render();
		self._bind();
		self._initMap();
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
	_bind:function(){
		var self=this;
		$("#saveBtn").unbind("click").click(function(){
			self._saveDistrict();
		});
	},
	_initMap:function(){
		var map = new BMap.Map("map");    // 创建Map实例
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
	_saveDistrict:function(){
		var self=this;
		var seoTitle=$("#seoTitle").val();
		var tagWords=$("#tagWords").val();
		var keyWords=$("#keyWords").val();
		var cityId=self._cityWidget.getValue();
		if(!cityId||cityId==""){
			CommonUtils.Msg.alert("请先选择城市");
			return;
		}
		var name=$("#name").val();
		var lonlat=$("#lonlat").val();
		if(!lonlat||lonlat==""){
			CommonUtils.Msg.alert("请先设置经纬度");
			return;
		}
		var items=lonlat.split(",");
		var lon=items[0];
		var lat=items[1];
		
		var introduce=$("#introduce").val();
		var peripheral=$("#peripheral").val();
		
		var district={
			cityId:cityId,
			name:name,
			longitude:lon,
			latitude:lat,
			introduce:introduce,
			peripheral:peripheral,
			keyWords:keyWords,
			tagWords:tagWords,
			seoTitle:seoTitle
		}
		
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
			url:"/hishu/admin/addDistrict.json",
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
	}
}
$(function(){
	AddDistrict.init();
});