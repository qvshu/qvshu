var HouseListOfDistrict={
	_id:null,
	
	init:function(){
		var self=this;
		self._id=CommonUtils.getQueryString("id");
		
		self._getDistrictDetail(HouseListOfDistrict._id);
		self._getDistrictList();
		self._render();
		self._bind();
	},
	_render:function(){
		
	},
	_bind:function(){
		var self=this;
		
		$("#districtSelector").change(function(){
			var value=$("#districtSelector").val();
			var text=$("#districtSelector").find("option:selected").text();
			$("#selectorText").html(text+">");
			self._getDistrictDetail(value);
		});
		
	},
	_getDistrictList:function(){
		var self=this;
		CommonUtils.async({
			url:"/hiweb/house/getCityDistrictList.json",
			data:{},
			success:function(result){
				if(result.code==0){
					var data=result.data||{};
					var list=data.list||[];
					var _html='';
					for(var i=0,len=list.length;i<len;i++){
						var _item=list[i];
						_html+='<option value="'+_item.districtId+'">'+_item.cityName+'  '+_item.districtName+'</option>';
					}
					$("#districtSelector").html(_html);
				}
			}
		});
	},
	_getDistrictDetail:function(districtId){
		var self=this;
		var district={
			id:districtId
		};
		
		CommonUtils.async({
			url:"/hiweb/house/getDistrictDetail.json",
			data:district,
			success:function(result){
				if(result.code==0){
					var district=result.data.district;
					$("#selectorText").html(district.cityName+'  '+district.name+">");
					var houseList=result.data.houseList||[];
					
					var districtImgs=district.districtImgs||[];
					if(districtImgs.length==0){
						//放一张默认图片
						districtImgs.push({url:'/app/res/img/hotel/hotel.jpg'});
					}
					var _h1='';
					for(var i=0,iLen=districtImgs.length;i<iLen;i++){
						if(i==0){
							_h1+='<div class="swiper-slide fist" style="background-image:url('+districtImgs[i].url+')"></div>';
						}else{
							_h1+='<div class="swiper-slide" style="background-image:url('+districtImgs[i].url+')"></div>';
						}
					}
					$("#banerImgList").html(_h1);
					setTimeout(function(){
						var swiper = new Swiper('.swiper-container', {
						      pagination: '.swiper-pagination',
						      effect: 'coverflow',
						      grabCursor: true,
						      centeredSlides: true,
						      slidesPerView: 'auto',
						      coverflow: {
						          rotate: 50,
						          stretch: 0,
						          depth: 100,
						          modifier: 1,
						          slideShadows : true
						      }
						  });
					},500);
					
					$("#introduce").html(district.introduce);
					
					//房源
					var _h2='';
					for(var j=0,jLen=houseList.length;j<jLen;j++){
						var house=houseList[j];
						var orderAmount=house.orderAmount||0;
						var avgAmount=(orderAmount/(house.liveCount||1)).toFixed(0);
						
						var houseAttributes=house.houseAttributes||"";
						var items=houseAttributes.split(",");
						var _as='';
						if(items&&items.length>0){
							for(var i2=0,i2Len=items.length;i2<i2Len;i2++){
								_as+='<span class="tag">'+items[i2]+'</span>';
							}
						}
						
						_h2+='<li>'
							+'<div class="top-wrap">'
							+'<a class="banner" href="/app/houseDetail.html?id='+house.id+'"><img src="'+(house.houseImg||'/app/res/img/hotel/hotel.jpg')+'" alt=""></a>'
							+'<div class="tag-wrap">'
                            +'<div class="w-l">'
                            +_as
                            +'</div>'
                            +'<div class="w-r">'
                            +'    <span class="tag">领券立减200活动中</span>'
                            +'</div>'
                            +'</div>'
                            +'</div>'
                            +'<div class="min-wrap">'
                            +'<p class="top-group">'
                            +'<span class="w-l">[优选]'+house.name+'</span>'
                            +'<span class="w-r">￥'+orderAmount+'</span>'
                            +'</p>'
                            +'<p class="min-group">'
                            +'<span class="w-l">'+house.layoutRoom+'房'+house.bedCount+'床/宜住'+house.liveCount+'人</span>'
                            +'<span class="w-r">人均：￥'+avgAmount+'</span>'
                            +'</p>'
                            +'</div>'
                            +'</li>';
					}
					$("#houseList").html(_h2);
				}
			}
		});
		
	}
}
$(function(){
	HouseListOfDistrict.init();
});