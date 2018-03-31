var DropDown={
	_id:null,
	position:null,
	
	init:function(){
		var self=this;
		var self=this;
		self._render();
		DropDown._id=CommonUtils.getQueryString("id");
		self._getHotCityList();
		self.getDistrictListOfCity(DropDown._id);
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
				
				//console.info(self.position);
			}
			else {
				//alert('failed'+this.getStatus());
			}        
		},{enableHighAccuracy: true});
	},
	_bind:function(){
		
	},
	_getHotCityList:function(){
		var self=this;
		
		CommonUtils.async({
			url:"/hiweb/common/getCityListOfHot.json",
			data:{pageSize:5},
			success:function(result){
				if(result.code==0){
					var ret=result.data;
					var cityList=ret.cityList||[];
					
					var _html='';
					for(var i=0,len=cityList.length;i<len;i++){
						var city=cityList[i];
						var _css='';
						if(self._id==city.id){
							_css='on';
						}
						_html+='<li id="city_'+city.id+'" class="cityItem '+_css+'"><a href="javascript:DropDown.getDistrictListOfCity('+city.id+');">'+city.name+'</a></li>';
					}
					_html+='<li><a href="/app/moreCity.html">更多...</a></li>';
					_html+='<li class="search"><a href="javascript:void(0);">搜索</a></li>';
					$("#hotCityList").html(_html);
				}
			}
		});
	},
	getDistrictListOfCity:function(cityId){
		var self=this;
		$(".cityItem").removeClass("on");
		$("#city_"+cityId).addClass("on");
		
		CommonUtils.async({
			url:"/hiweb/house/getDistrictListOfCity.json",
			data:{cityId:cityId},
			success:function(result){
				if(result.code==0){
					var ret=result.data;
					var list=ret.list||[];
					
					var _html='';
					for(var i=0,len=list.length;i<len;i++){
						var district=list[i];
						var lng=district.latitude;
						var lat=district.latitude;
						//根据经纬度计算距离
						var s=self._getDistance(lat,lng,i);
						
						_html+='<li class="banner-warp">'
							+'<img class="banner" src="'+(district.districtImg||'/app/res/img/hotel/hotel.jpg')+'" alt="">'
							+'<div class="banner-txt">'
	                        +'<p class="banner-title">'+district.name+'</p>'
	                        //+'<p class="banner-des">'+house.layoutRoom+'房 '+house.houseAttributes+'</p>'
	                        +'<p id="distance_'+i+'" class="long">距离：'+s+'km</p>'
	                        +'</div>'
	                        +'</li>';
					}
					$("#districtList").html(_html);
					
					if(self._distanceList.length>0){
						setTimeout(function(){
							for(var ii=0,iiLen=self._distanceList.length;ii<iiLen;ii++){
								var _d=self._distanceList[ii];
								var s=self._getDistance(_d.lat,_d.lon);
								//console.info(self.position);
								$("#distance_"+_d.id).html("距离："+s+"km");
							}
							self._distanceList=[];
						},1000);
					}
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
	}
}
$(function(){
	DropDown.init();
});