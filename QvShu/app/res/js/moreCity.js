var MoreCity={
	init:function(){
		var self=this;
		self._getCityListOfHot();
		self._getProvinceList();
	},
	_render:function(){
		
	},
	_bind:function(){
		
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
					//渲染热门城市 
					var _html='';
					for(var i=0,len=cityList.length;i<len;i++){
						var city=cityList[i];
						_html+='<li class="city"><a href="/app/dropDown.html?id='+city.id+'">'+city.name+'</a></li>';
					}
					$("#hotCityList").html(_html);
				}
			}
		});
	},
	_getProvinceList:function(){
		var self=this;
		CommonUtils.async({
			url:"/app/res/js/provinceList.json",
			type:"GET",
			data:{},
			success:function(result){
				if(result.code==0){
					var list=result.data||[];
					var _html='';
					for(var i=0,len=list.length;i<len;i++){
						var _province=list[i];
						var _cityList=_province.cityList||[];
						_html+='<div class="city-list-title">'+_province.name+'</div>';
						
						_html+='<ul class="city-list">';
						for(var j=0,jlen=_cityList.length;j<jlen;j++){
							var _city=_cityList[j];
							_html+='<li class="city"><a href="/app/dropDown.html?id='+_city.id+'">'+_city.name+'</a></li>';
						}
						_html+='</ul>';
					}
					
					$("#provinceList").html(_html);
				}
			},
			error:function(result){
				
			}
		});
	}
}
$(function(){
	MoreCity.init();
});