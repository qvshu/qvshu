var AddHouse={
	_thirdPartHouseWidget:null,
	_merchantWidget:null,
	_houseTypeWidget:null,
	_cityWidget:null,
	_districtWidget:null,
	_manageTypeWidget:null,
	
	_bedWidget1:null,
	_bedWidget2:null,
	_bedWidget3:null,
	_bedWidget4:null,
	
	_shareImgWidget:null,
	
	_lawnChangeWidget:null,
	
	init:function(){
		var self=this;
		
		self._render();
		self._renderHouseAttributeList();
		self._renderHouseFacilityList();
		self._renderHouseReceptionList();
		self._bind();
	},
	_render:function(){
		var self=this;
		
		self._thirdPartHouseWidget=$("#thirdPartHouse").ComboBoxWidget({
			url:"/hishu/admin/getThirdPartHouseList.json",
			textField:"name",
			valueField:"thirdPartId",
			onClick:function(item){
				console.info(item.name+"  "+item.thirdPartId);
			}
		});
		
		self._merchantWidget=$("#merchantWidget").ComboBoxWidget({
			url:"/hishu/admin/getMerchantList.json?pageSize=1000",
			textField:"name",
			valueField:"id"
		});
		
		//(villa-别墅，homeparty-轰趴，dormitory-民宿)
		self._houseTypeWidget=$("#houseTypeWidget").ComboBoxWidget({
			textField:"name",
			valueField:"type",
			data:[{
				name:"别墅",
				type:"villa"
			},{
				name:"轰趴",
				type:"homeparty"
			},{
				name:"民宿",
				type:"dormitory"
			}]
		});
		
		self._cityWidget=$("#cityWidget").ComboBoxWidget({
			url:"/hishu/admin/getCityList.json",
			textField:"name",
			valueField:"id",
			onClick:function(item){
				var cityId=item.id;
				CommonUtils.async({
					url:"/hishu/admin/getDistrictList.json",
					data:{cityId:cityId},
					success:function(result){
						if(result.code==0){
							var list=result.data.list||[];
							self._districtWidget.loadData(list);
						}
					}
				});
			}
		});
		
		self._districtWidget=$("#districtWidget").ComboBoxWidget({
			textField:"name",
			valueField:"id"
		});
		
		//房源管理类型(hotel-酒店，housekeeper-管家，auto-自动)
		self._manageTypeWidget=$("#manageTypeWidget").ComboBoxWidget({
			textField:"name",
			valueField:"type",
			data:[{
				name:"酒店",
				type:"hotel"
			},{
				name:"管家",
				type:"housekeeper"
			},{
				name:"自动",
				type:"auto"
			}]
		});
		
		self._bedWidget1=$("#bedWidget1").ComboBoxWidget({
			textField:"name",
			valueField:"type",
			data:[{
				name:"席梦思",
				type:"ximengsi"
			},{
				name:"雅思",
				type:"yasi"
			}]
		});
		self._bedWidget2=$("#bedWidget2").ComboBoxWidget({
			textField:"name",
			valueField:"type",
			data:[{
				name:"席梦思",
				type:"ximengsi"
			},{
				name:"雅思",
				type:"yasi"
			}]
		});
		self._bedWidget3=$("#bedWidget3").ComboBoxWidget({
			textField:"name",
			valueField:"type",
			data:[{
				name:"席梦思",
				type:"ximengsi"
			},{
				name:"雅思",
				type:"yasi"
			}]
		});
		self._bedWidget4=$("#bedWidget4").ComboBoxWidget({
			textField:"name",
			valueField:"type",
			data:[{
				name:"席梦思",
				type:"ximengsi"
			},{
				name:"雅思",
				type:"yasi"
			}]
		});
		
		self._shareImgWidget=$("#shareImgWidget").FileWidget({});
		
		//草铺更换(daily-每天更换,check_out-退房更换)
		self._lawnChangeWidget=$("#lawnChangeWidget").ComboBoxWidget({
			textField:"name",
			valueField:"type",
			data:[{
				name:"退房更换",
				type:"check_out"
			},{
				name:"每日一换",
				type:"daily"
			}]
		});
	},
	_houseAttributeList:[],
	_renderHouseAttributeList:function(){
		var self=this;
		CommonUtils.async({
			url:"/hishu/admin/getHouseAttributeList.json",
			data:{},
			success:function(result){
				if(result.code==0){
					var list=result.data.list||[];
					self._houseAttributeList=list;
					//attribute,crowd
					var _attributeHtml='';
					var _crowdHtml='';
					for(var i=0,ilen=list.length;i<ilen;i++){
						var _a=list[i];
						if("attribute"==_a.type){
							_attributeHtml+='<label class="control-label fl mr10">'
								+'<input id="attr_'+_a.id+'" class="ml10" type="checkbox" value="'+_a.id+'">&nbsp;'+_a.name+'</label>';
						}else if("crowd"==_a.type){
							_crowdHtml+='<label class="control-label fl mr10">'
								+'<input id="attr_'+_a.id+'" class="ml10" type="checkbox" value="'+_a.id+'">&nbsp;'+_a.name+'</label>';
						}
					}
					$("#attribute_attr").append(_attributeHtml);
					$("#attribute_crowd").append(_crowdHtml);
				}
			}
		});
	},
	_houseFacilityList:[],
	_renderHouseFacilityList:function(){
		var self=this;
		CommonUtils.async({
			url:"/hishu/admin/getHouseFacilityList.json",
			data:{},
			success:function(result){
				if(result.code==0){
					var list=result.data.list||[];
					self._houseFacilityList=list;
					//设施类型（entertainment-娱乐,outdoor-室外,indoor-室内,kitchen-厨房,clean-清洁）
					var _entertainment='';
					var _outdoor='';
					var _indoor='';
					var _kitchen='';
					var _clean='';
					
					for(var i=0,ilen=list.length;i<ilen;i++){
						var _a=list[i];
						if("entertainment"==_a.type){
							_entertainment+='<label class="control-label fl mr10">'
								+'<input id="facility_'+_a.id+'" class="ml10" type="checkbox" value="'+_a.id+'">&nbsp;'+_a.name+'</label>';
						}else if("outdoor"==_a.type){
							_outdoor+='<label class="control-label fl mr10">'
								+'<input id="facility_'+_a.id+'" class="ml10" type="checkbox" value="'+_a.id+'">&nbsp;'+_a.name+'</label>';
						}else if("indoor"==_a.type){
							_indoor+='<label class="control-label fl mr10">'
								+'<input id="facility_'+_a.id+'" class="ml10" type="checkbox" value="'+_a.id+'">&nbsp;'+_a.name+'</label>';
						}else if("kitchen"==_a.type){
							_kitchen+='<label class="control-label fl mr10">'
								+'<input id="facility_'+_a.id+'" class="ml10" type="checkbox" value="'+_a.id+'">&nbsp;'+_a.name+'</label>';
						}else if("clean"==_a.type){
							_clean+='<label class="control-label fl mr10">'
								+'<input id="facility_'+_a.id+'" class="ml10" type="checkbox" value="'+_a.id+'">&nbsp;'+_a.name+'</label>';
						}
					}
					$("#facility_entertainment").append(_entertainment);
					$("#facility_outdoor").append(_outdoor);
					$("#facility_indoor").append(_indoor);
					$("#facility_kitchen").append(_kitchen);
					$("#facility_clean").append(_clean);
				}
			}
		});
	},
	_houseReceptionList:[],
	_renderHouseReceptionList:function(){
		var self=this;
		CommonUtils.async({
			url:"/hishu/admin/getHouseReceptionList.json",
			data:{},
			success:function(result){
				if(result.code==0){
					var list=result.data.list||[];
					self._houseReceptionList=list;
					var _reception='';
					
					for(var i=0,ilen=list.length;i<ilen;i++){
						var _a=list[i];
						_reception+='<label class="control-label fl mr10">'
							+'<input id="reception_'+_a.id+'" class="ml10" type="checkbox" value="'+_a.id+'">&nbsp;'+_a.name+'</label>';
					}
					$("#house_reception").append(_reception);
				}
			}
		});
	},
	
	
	_bind:function(){
		var self=this;
		
		$("#saveBtn").unbind("click").click(function(){
			self._saveHouse();
		});
		
		$("#cancelBtn").click(function(){
			location.href="/admin/houseMerchantManager/houseList.html";
		});
		
		
	},
	/**
	 * 新增房源
	 */
	_saveHouse:function(){
		var self=this;
		
		var seoTitle=$("#seoTitle").val();
		var tagWords=$("#tagWords").val();
		var keyWords=$("#keyWords").val();
		var webDescription=$("#webDescription").val();
		
		var name=$("#name").val();
		var thirdPartId=self._thirdPartHouseWidget.getValue();
		var merchantId=self._merchantWidget.getValue();
		var type=self._houseTypeWidget.getValue();
		
		var cityId=self._cityWidget.getValue();
		var districtId=self._districtWidget.getValue();
		
		var offlineNo=$("#offlineNo").val();
		var subIntroduction=$("#subIntroduction").val();
		
		var manageType=self._manageTypeWidget.getValue();
		
		var isSpotCheck=$("#isSpotCheck").is(':checked')?1:0;
		
		//停车场类型（null-没有停车场，free-免费，rechargeable-收费的）
		var parking=null;
		var parkingExist=$("#parkingExist").is(':checked');
		var parkingFee=$("#parkingFee").is(':checked');
		if(parkingExist){
			if(parkingFee){
				parking="free";
			}else{
				parking="parking";
			}
		}
		
		var lawnChange=self._lawnChangeWidget.getValue();
		var similarHouseCount=$("#similarHouseCount").val();
		
		var area=$("#area").val();
		var floorCount=$("#floorCount").val();
		var layoutOffice=$("#layoutOffice").val();
		var layoutRoom=$("#layoutRoom").val();
		var layoutKitchen=$("#layoutKitchen").val();
		var layoutBalcony=$("#layoutBalcony").val();
		var toiletIndependen=$("#toiletIndependen").val();
		var toiletCommon=$("#toiletCommon").val();
		
		var liveCount=$("#liveCount").val();
		var funCount=$("#funCount").val();
		
		//床铺
		var bed1_width=$("#bed1_width").val();
		var bed1_length=$("#bed1_length").val();
		var bed1_count=$("#bed1_count").val();
		var bed1_type=self._bedWidget1.getValue();
		var bed1="";
		if(bed1_width&&bed1_width>0){
			bed1=bed1_width+","+bed1_length+","+bed1_count+","+bed1_type;
		}
		
		var bed2_width=$("#bed2_width").val();
		var bed2_length=$("#bed2_length").val();
		var bed2_count=$("#bed2_count").val();
		var bed2_type=self._bedWidget2.getValue();
		var bed2="";
		if(bed2_width&&bed2_width>0){
			bed2=bed2_width+","+bed2_length+","+bed2_count+","+bed2_type;
		}

		var bed3_width=$("#bed3_width").val();
		var bed3_length=$("#bed3_length").val();
		var bed3_count=$("#bed3_count").val();
		var bed3_type=self._bedWidget3.getValue();
		var bed3="";
		if(bed3_width&&bed3_width>0){
			bed3=bed3_width+","+bed3_length+","+bed3_count+","+bed3_type;
		}
		
		var bed4_width=$("#bed4_width").val();
		var bed4_length=$("#bed4_length").val();
		var bed4_count=$("#bed4_count").val();
		var bed4_type=self._bedWidget4.getValue();
		var bed4="";
		if(bed4_width&&bed4_width>0){
			bed4=bed4_width+","+bed4_length+","+bed4_count+","+bed4_type;
		}
		var houseBeds=bed1+";"+bed2+";"+bed3+";"+bed4;
		
		//房源属性
		var houseAttributeList=[];
		for(var i=0,len=self._houseAttributeList.length;i<len;i++){
			//$("#parkingFee").is(':checked');
			var _a=self._houseAttributeList[i];
			if($("#attr_"+_a.id).is(':checked')){
				houseAttributeList.push(_a.id);
			}
			
		}
		//房源设施
		var houseFacilityList=[];
		for(var i=0,len=self._houseFacilityList.length;i<len;i++){
			var _a=self._houseFacilityList[i];
			if($("#facility_"+_a.id).is(':checked')){
				houseFacilityList.push(_a.id);
			}
		}
		//房源接待
		var houseReceptionList=[];
		for(var i=0,len=self._houseReceptionList.length;i<len;i++){
			var _a=self._houseReceptionList[i];
			if($("#reception_"+_a.id).is(':checked')){
				houseReceptionList.push(_a.id);
			}
		}
		
		var shareTitle=$("#shareTitle").val();
		var shareContent=$("#shareContent").val();
		var files=[];
		var shareImg=self._shareImgWidget.getValue();
		if(shareImg&&shareImg!=""){
			files.push({id:self._shareImgWidget.getFileElId(),name:"shareImg",value:shareImg});
		}
		
		var introduction=$("#introduction").val();
		
		var checkInTime=$("#checkInTime").val();
		var checkOutTime=$("#checkOutTime").val();
		var receptionTime=$("#receptionTime").val();
		var deposit=$("#deposit").val();
		var remark=$("#remark").val();
		
		/*
		
		 * 
		 * */
		var house={
			seoTitle:seoTitle,
			tagWords:tagWords,
			keyWords:keyWords,
			webDescription:webDescription,
			name:name,
			thirdPartId:thirdPartId,
			merchantId:merchantId,
			type:type,
			cityId:cityId,
			districtId:districtId,
			offlineNo:offlineNo,
			subIntroduction:subIntroduction,
			manageType:manageType,
			isSpotCheck:isSpotCheck,
			parking:parking,
			lawnChange:lawnChange,
			similarHouseCount:similarHouseCount,
			area:area,
			floorCount:floorCount,
			layoutOffice:layoutOffice,
			layoutRoom:layoutRoom,
			layoutKitchen:layoutKitchen,
			layoutBalcony:layoutBalcony,
			toiletIndependen:toiletIndependen,
			toiletCommon:toiletCommon,
			liveCount:liveCount,
			funCount:funCount,
			houseBeds:houseBeds,
			houseAttributes:houseAttributeList.join(","),
			houseFacilities:houseFacilityList.join(","),
			houseReceptions:houseReceptionList.join(","),
			shareTitle:shareTitle,
			shareContent:shareContent,
			introduction:introduction,
			checkInTime:checkInTime,
			checkOutTime:checkOutTime,
			receptionTime:receptionTime,
			deposit:deposit,
			remark:remark
		}
		
		//console.info(house);
		//console.info(files);
		
		CommonUtils.uploadFile({
			url:"/hishu/admin/addHouse.json",
			data:house,
			files:files,
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功",function(){
						//跳转到列表页面
						//location.href="/admin/houseMerchantManager/houseList2.html";
						var _h=result.data;
						var _id=_h.id;
						if(_id&&_id!=""){
							//跳转至新增图片页面
							location.href="/admin/houseMerchantManager/editHouseImgList.html?houseId="+_id;
						}
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
	AddHouse.init();
});