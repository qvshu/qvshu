var Index={
	position:null,
	openId:null,
	
	init:function(){
		var self=this;
		var _openId=CommonUtils.getQueryString("openId");
		if(_openId&&_openId!=""){
			self.openId=_openId;
			//并缓存于store
			CommonUtils.LocalStorage.addString(Constant.PROJECT_NAME+"_openId",self.openId);
			//console.info(CommonUtils.LocalStorage.getString(Constant.PROJECT_NAME+"_openId"));
		}
		self._getHouseListOfHot();
		self._getCityListOfHot();
		self._getHouseListOfRecommended();
		self._render();
		self._bind();
	},
	_render:function(){
		var self=this;
		
		//初始化地图控件
		var map = new BMap.Map("map");
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				//var mk = new BMap.Marker(r.point);
				//map.addOverlay(mk);
				//map.panTo(r.point);
				//alert('您的位置：'+r.point.lng+','+r.point.lat);
				self.position={lng:r.point.lng,lat:r.point.lat};
				//console.info("111   "+self.position);
			}
			else {
				//alert('failed'+this.getStatus());
			}        
		},{enableHighAccuracy: true});
		
		
	},
	_bind:function(){
		var self=this;
		
	},
	_getHouseListOfHot:function(){
		var self=this;
		CommonUtils.async({
			url:"/hiweb/common/getHouseListOfHot.json",
			data:{},
			success:function(result){
				if(result.code==0){
					var list=result.data||[];
					for(var i=0,len=list.length;i<len;i++){
						var _h=list[i];
						if(i==0){
							$("#hotHouse1").attr("src",_h.houseImg);
						}
						if(i==1){
							$("#hotHouse2").attr("src",_h.houseImg);
						}
						if(i==2){
							$("#hotHouse3").attr("src",_h.houseImg);
						}
						if(i==3){
							$("#hotHouse4").attr("src",_h.houseImg);
						}
						if(i==4){
							$("#hotHouse5").attr("src",_h.houseImg);
						}
					}
					
				}
			},
			error:function(result){
				
			}
		});
	},
	_getCityListOfHot:function(){
		var self=this;
		
		CommonUtils.async({
			url:"/hiweb/common/getCityListOfHot.json",
			data:{pageSize:5},
			success:function(result){
				if(result.code==0){
					var ret=result.data;
					var cityList=ret.cityList||[];
					var districtList=ret.districtList||[];
					//渲染热门城市 
					var _html='';
					for(var i=0,len=cityList.length;i<len;i++){
						var city=cityList[i];
						if(i==0){
							_html+='<li id="city'+city.id+'" class="on cityItem"><a href="javascript:Index.getDistrictListOfCity('+city.id+');">'+city.name+'</a></li>';
						}else{
							_html+='<li id="city'+city.id+'" class="cityItem"><a href="javascript:Index.getDistrictListOfCity('+city.id+');">'+city.name+'</a></li>';
						}
					}
					_html+='<li><a href="/app/moreCity.html">更多...</a></li>';
					$("#hotCityList").html(_html);
					//热门城市的房源
					self._renderDistrictListOfCity(districtList);
				}
			}
		});
	},
	_getHouseListOfRecommended:function(){
		var self=this;
		
		CommonUtils.async({
			url:"/hiweb/common/getHouseListOfRecommended.json",
			data:{},
			success:function(result){
				if(result.code==0){
					var houseList=result.data||[];
					var _html='';
					for(var i=0,len=houseList.length;i<len;i++){
						var house=houseList[i];
						var houseAttributes=house.houseAttributes||"";
						var items=houseAttributes.split(",");
						var _houseAttrs='';
						if(items&&items.length>0){
							for(var j=0,jlen=items.length;j<jlen;j++){
								_houseAttrs+='<span class="tag">'+items[j]+'</span>'
							}
						}
						var orderAmount=house.orderAmount||0;
						var bedCount=house.bedCount||1;
						var _avgPrice=(orderAmount/bedCount).toFixed(0);
						
						_html+='<li>'
							+'<div class="top-wrap">'
							+'<a class="banner" href=""><img src="'+house.houseImg+'" alt=""></a>'
							+'<div class="tag-wrap">'
                            +'<div class="w-l">'
                            +_houseAttrs
                            +'</div>'
                            +'<div class="w-r">'
                            +'<span class="tag">领券立减200活动中</span>'
                            +'</div>'
                            +'</div>'
                            +'</div>'

                            +'<div class="min-wrap">'
                            +'<p class="top-group">'
                            +'<span class="w-l">'
                            +'[优选]'+house.name
                            +'</span>'
                            +'<span class="w-r">￥'+(house.orderAmount||'--')+'</span>'
                            +'</p>'
                            +'<p class="min-group">'
                            +'<span class="w-l">'+house.layoutRoom+'房'+(house.bedCount||'--')+'床/宜住'+(house.bedCount||'--')+'人</span>'
                            +'<span class="w-r">人均：￥'+_avgPrice+'</span>'
                            +'</p>'
                            +'</div>'
                    
                            +'</li>';
					}
					
					$("#houseListOfRecommended").html(_html);
				}
			}
		});
	},
	_distanceList:[],
	_rad:function(d){
		return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式
	},
	_getDistance:function(lat2,lng2,j){
		var self=this;
		//console.info(self.position);
		if(self.position==null){
			if(j){
				self._distanceList.push({id:j,lon:lng2,lat:lat2});
			}
			return "--";
		}
		if(!lat2||!lng2){
			return "--";
		}
		
		var lng1=self.position.lng;
		var lat1=self.position.lat;
		var radLat1 = self._rad(lat1);
        var radLat2 = self._rad(lat2);
        var a = radLat1 - radLat2;
        var  b = self._rad(lng1) - self._rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s *6378.137 ;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000; //输出为公里
        s=s.toFixed(0);
        return s;
	},
	_renderDistrictListOfCity:function(districtList){
		var self=this;
		var _districtHtml='';
		for(var j=0,jlen=districtList.length;j<jlen;j++){
			var district=districtList[j];
			var lng=district.latitude;
			var lat=district.latitude;
			//根据经纬度计算距离
			var s=self._getDistance(lat,lng,j);
			
			_districtHtml+='<li class="banner-warp"><a href="/app/houseListOfDistrict.html?id='+district.id+'">'
				+'<img class="banner" src="'+(district.districtImg||'/app/res/img/hotel/hotel.jpg')+'" alt="">'
                +'<div class="banner-txt">'
                +'<p class="banner-title">'+district.name+'</p>'
                //+'<p class="banner-des">'+(house.layoutRoom||1)+'房'+_houseAttrs+'，'+house.districtName+'</p>'
                +'<p id="distance_'+j+'" class="long">距离：'+s+'km</p>'
                +'</div></a>'
                +'</li>';
		}
		$("#districtList").html(_districtHtml);
		if(self._distanceList.length>0){
			setTimeout(function(){
				//console.info(self.position);
				for(var ii=0,iiLen=self._distanceList.length;ii<iiLen;ii++){
					var _d=self._distanceList[ii];
					var s=self._getDistance(_d.lat,_d.lon);
					//console.info(self.position);
					$("#distance_"+_d.id).html("距离："+s+"km");
				}
				self._distanceList=[];
			},6000);
		}
	},
	getDistrictListOfCity:function(cityId){
		var self=this;
		$(".cityItem").removeClass("on");
		$("#city"+cityId).addClass("on");
		
		CommonUtils.async({
			url:"/hiweb/house/getDistrictListOfCity.json",
			data:{cityId:cityId},
			success:function(result){
				if(result.code==0){
					var ret=result.data;
					var list=ret.list||[];
					self._renderDistrictListOfCity(list);
				}
			}
		});
	}
}
$(function(){
	Index.init();
});