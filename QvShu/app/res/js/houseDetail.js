var HouseDetail={
	_id:null,
	
	init:function(){
		var self=this;
		self._id=CommonUtils.getQueryString("id");
		self._getHouse();
		self._render();
		self._bind();
	},
	_render:function(){
		var self=this;
		
	},
	_bind:function(){
		var self=this;
		$("#bookBtn").attr("href","/app/pay/pay1.html?id="+self._id);
	},
	_getHouse:function(){
		var self=this;
		if(!self._id){
			return;
		}
		CommonUtils.async({
			url:"/hiweb/house/getHouse.json",
			data:{id:self._id},
			success:function(result){
				if(result.code==0){
					var house=result.data;
					var houseImgs=house.houseImgs||[];
					var houseReceptions=house.houseReceptions||[];
					var houseFacilities=house.houseFacilities||[];
					var districtImgList=house.districtImgList||[];
					var commentList=house.commentList||[];
					
					//取3张图片做头部轮播
					if(houseImgs.length>1){
						$("#contentImg1").attr("src",houseImgs[houseImgs.length-1].url);
						$("#contentImg2").attr("src",houseImgs[houseImgs.length-2].url);
					}else if(houseImgs.length>0){
						$("#contentImg1").attr("src",houseImgs[houseImgs.length-1].url);
						$("#contentImg2").attr("src","/app/res/img/hotel/hotel.jpg");
					}else{
						$("#contentImg1").attr("src","/app/res/img/hotel/hotel.jpg");
						$("#contentImg2").attr("src","/app/res/img/hotel/hotel.jpg");
					}
					
					var _h0='';
					for(var i0=0,i0Len=houseImgs.length;i0<i0Len;i0++){
						_h0+='<div class="swiper-slide hotel-img"><img width="100%" src="'+houseImgs[i0].url+'" alt="" /></div>';
					}
					$("#banerList").html(_h0);
					if(houseImgs.length>0){
						var swiper = new Swiper('.swiper-container-one', {
						    pagination: '.swiper-pagination',
						    paginationType: 'fraction'
						});
					}
					
					$("#houseName").html(house.name);
					var isSpotCheck=house.isSpotCheck||0;
					if(isSpotCheck==1){
						$("#isSpotCheck").removeClass("hide");
					}
					if(houseImgs.length>0){
						$("#houseIcon").attr("src",houseImgs[0].url);
					}else{
						//用默认图片
						$("#houseIcon").attr("src","/app/res/img/hotel/hotel.jpg");
					}
					
					$("#houseRoom").html((house.layoutRoom||1)+"间房 / "+(house.BedCount||0)+"张床 / 宜住"+(house.liveCount||"--")+"人");
					
					var webDescription=house.webDescription||"";
					//webDescription+='一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十';
					var webDescriptionLength=webDescription.length;
					//console.info("webDescriptionLength="+webDescriptionLength);
					//每50个字换一行
					var temp=webDescription;
					if(webDescription.length>50){
						var _html='';
						var s=0;
						var e=0;
						while(true){
							e=s+50;
							if(e>=webDescriptionLength){
								e=webDescriptionLength;
							}
							
							//截取前面的
							var _s=webDescription.substring(s,e-1);
							_html+='<li><p class="txt">'+_s+'</p></li>';
							
							s=e;
							if(s>=webDescriptionLength){
								break;
							}
							
						}
						$("#detailDescription").html(_html);
					}else{
						$("#detailDescription").html('<li><p class="txt">'+webDescription+'</p></li>');
					}
					
					//房源设施
					var _h1='';
					for(var i1=0,i1Len=houseFacilities.length;i1<i1Len;i1++){
						var facility=houseFacilities[i1];
						_h1+='<li><img src="/app/res/img/hotel/hotel.jpg" alt="">'
							+'<p class="fy-txt">'+facility.name+'</p>'
							+'</li>';
					}
					$("#houseFacilityList").html(_h1);
					
					var _h2='';
					for(var i2=0,i2Len=commentList.length;i2<i2Len;i2++){
						var comment=commentList[i2];
						var commentImgList=comment.commentImgList||[];
						var _h2Imgs='';
						for(var i3=0,i3Len=commentImgList.length;i3<i3Len;i3++){
							_h2Imgs+='<li><img src="'+commentImgList[i3].url+'" alt=""></li>';
						}
						
						_h2+='<div class="user-list">'
							+'<div class="user-wrap">'
							+'<img class="user-img" src="'+(comment.userHeadImg||'/app/res/img/hotel/hotel.jpg')+'" alt="">'
							+'<div class="user-name">'
							+'<p class="title">'+comment.userName+'</p>'
							+'</div>'
							+'</div>'
							
							+'<p class="users-write">'+comment.content+'</p>'
							+'<ul class="users-photo">'
			         		+_h2Imgs
			         		+'</ul>'
			         		+'</div>';
					}
					$("#commentList").append(_h2);
					
					var _h4='';
					for(var i4=0,i4Len=districtImgList.length;i4<i4Len;i4++){
						if(i4==0){
							_h4+='<div class="swiper-slide fist" style="background-image:url('+districtImgList[i4].url+')"></div>';
						}else{
							_h4+='<div class="swiper-slide" style="background-image:url('+districtImgList[i4].url+')"></div>';
						}
					}
					$("#districtImgList").html(_h4);
					if(districtImgList.length>0){
						var swiper = new Swiper('.swiper-container-two', {
						    effect: 'coverflow',
						    // grabCursor: true,
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
					}
					
					$("#checkInTime").html("入住时间："+(house.checkInTime||""));
					$("#checkOutTime").html("退房时间："+(house.checkOutTime||""));
					$("#receptionTime").html("接待时间："+(house.receptionTime||""));
					$("#deposit").html("入住押金：到店后前台支付押金"+(house.deposit||""));
					
					var _h5='';
					for(var i5=0,i5Len=houseReceptions.length;i5<i5Len;i5++){
						_h5+='<label for="'+(i5++)+'"><input class="check-box" type="checkbox"> '+houseReceptions[i5].name+'</label>';
					}
					$("#receptionList").html(_h5);
					
				}
			}
		});
	}
}
$(function(){
	HouseDetail.init();
});