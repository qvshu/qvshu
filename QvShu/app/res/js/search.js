var Search={
	init:function(){
		var self=this;
		
		self._getHotCityList();
		//默认先查全部
		self.getHouseList();
	},
	_render:function(){
		
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
						_html+='<li class="city"><a href="javascript:Search.getHouseList('+city.id+');">'+city.name+'</a></li>';
					}
					$("#hotCityList").html(_html);
				}
			}
		});
	},
	getHouseList:function(cityId,liveCount,amount){
		var self=this;
		var param={};
		if(cityId){
			param.cityId=cityId;
		}
		if(liveCount){
			param.liveCount=liveCount;
		}
		if(amount){
			param.amount=amount;
		}
		
		CommonUtils.async({
			url:"/hiweb/house/getHouseList.json",
			data:param,
			success:function(result){
				if(result.code==0){
					var ret=result.data;
					var houseList=ret.list||[];
					var _html='';
					for(var i=0,len=houseList.length;i<len;i++){
						var house=houseList[i];
						var orderAmount=house.orderAmount||0;
						var liveCount=house.liveCount||1;
						var avgAmount=(orderAmount/liveCount).toFixed(0);
						
						var _houseAttributeList='';
						var houseAttributes=house.houseAttributes||"";
						var items=houseAttributes.split("1");
						if(items&&items.length>0){
							for(var j=0,jLen=items.length;j<jLen;j++){
								var _a=items[j];
								_houseAttributeList+='<span class="tag">'+_a+'</span>';
							}
						}
						
						_html+='<li>'
							+'<div class="top-wrap">'
							+'<a class="banner" href="javascript:void(0);">'
							+'<img src="'+house.houseImg+'" alt=""></a>'
							+'<div class="tag-wrap">'
                            +'<div class="w-l">'
                            +_houseAttributeList    
                            +'</div>'
                            +'<div class="w-r">'
                            +'    <span class="tag">领券立减200活动中</span>'
                            +'</div>'
                            +'</div>'
                            +'</div>'
                            +'<div class="min-wrap">'
                            +'<p class="top-group">'
                            +'<span class="w-l">[优选]'+house.name+'</span>'
                            +'<span class="w-r">￥'+(house.orderAmount||'--')+'</span>'
                            +'</p>'
                            +'<p class="min-group">'
                            +'<span class="w-l">'+house.layoutRoom+'房'+house.bedCount+'床/宜住'+house.liveCount+'人</span>'
                            +'<span class="w-r">人均：￥'+(avgAmount||'--')+'</span>'
                            +'</p>'
                            +'</div>'
                            +'</li>';
					}
					$("#houseList").html(_html);
					
				}
			}
		});
	}
}
$(function(){
	Search.init();
});