var EditMerchant={
	_id:null,
	init:function(){
		var self=this;
		
		self._id=CommonUtils.getParam("id");
		self._render();
		self._bind();
		self._getMerchant();
	},
	_render:function(){
		var self=this;
		self._bankProviceWidget=$("#bankProviceWidget").ComboBoxWidget({
			textField:"name",
			valueField:"id"
		});
		
		self._proviceWidget=$("#proviceWidget").ComboBoxWidget({
			url:"/hishu/admin/getProviceList.json",
			textField:"name",
			valueField:"id",
			onClick:function(item){
				var provinceId=item.id;
				CommonUtils.async({
					url:"/hishu/admin/getCityList.json",
					data:{provinceId:provinceId},
					success:function(result){
						if(result.code==0){
							var list=result.data.list||[];
							self._cityWidget.loadData(list);
						}
					}
				});
			},
			onLoad:function(data){
				self._proviceList=data;
				self._bankProviceWidget.loadData(self._proviceList);
			}
		});
		
		self._cityWidget=$("#cityWidget").ComboBoxWidget({
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
			valueField:"id",
			onLoad:function(data){
				self._districtList=data;
				self._auto_renderHomeKeeperDistrict();
			}
		});
		
		/*
		 * 结算方式（1:下单-周结算，2:下单-月结算，3:入住后 - 全款结算，4:定金+尾款结算，5:入住前 - 全款结算，6:入住 - 周结算，7:入住 - 月结算）
		 * */
		self._bankSettlementWidget=$("#bankSettlementWidget").ComboBoxWidget({
			textField:"name",
			valueField:"value",
			data:[{
				name:"下单-周结算",
				value:1
			},{
				name:"下单-月结算",
				value:2
			},{
				name:"入住后-全款结算",
				value:3
			},{
				name:"定金+尾款结算",
				value:4
			},{
				name:"入住前-全款结算",
				value:5
			},{
				name:"入住-周结算",
				value:6
			},{
				name:"入住-月结算）",
				value:7
			}]
		});
		/*
		 * 退改政策（1:不支持退改，2:支持随时退改，3:有条件退改）
		 * */
		self._cancelBookTypeWidget=$("#cancelBookTypeWidget").ComboBoxWidget({
			textField:"name",
			valueField:"value",
			data:[{
				name:"不支持退改",
				value:1
			},{
				name:"支持随时退改",
				value:2
			},{
				name:"有条件退改",
				value:3
			}]
		});
	},
	_auto_renderHomeKeeperDistrict:function(){
		var self=this;
		var _html='<option value="">请选择小区</option>';
		for(var i=0,len=self._districtList.length;i<len;i++){
			var _d=self._districtList[i];
			_html+='<option value="'+_d.id+'">'+_d.name+'</option>';
		}
		$(".homeKeeperDistrict").html(_html);
	},
	_bind:function(){
		var self=this;
		
		$("#saveBtn").unbind("click").click(function(){
			self._saveMerchant();
		});
		
		$("#cancelBtn").click(function(){
			location.href="/admin/houseMerchantManager/merchantList.html";
		});
		
		
	},
	_getMerchant:function(){
		var self=this;
		
		CommonUtils.async({
			url:"/hishu/admin/getMerchant.json",
			data:{id:self._id},
			success:function(result){
				if(result.code==0){
					var merchant=result.data;
					//渲染数据
					$("#name").val(merchant.name);
					$("#account").val(merchant.account);
					setTimeout(function(){
						self._proviceWidget.setValue(merchant.provinceId);
					},200);
					//加载城市
					CommonUtils.async({
						url:"/hishu/admin/getCityList.json",
						data:{provinceId:merchant.provinceId},
						success:function(result){
							if(result.code==0){
								var list=result.data.list||[];
								self._cityWidget.loadData(list);
								setTimeout(function(){
									self._cityWidget.setValue(merchant.cityId);
								},200);
							}
						}
					});
					//加载小区
					CommonUtils.async({
						url:"/hishu/admin/getDistrictList.json",
						data:{cityId:merchant.cityId},
						success:function(result){
							if(result.code==0){
								var list=result.data.list||[];
								self._districtWidget.loadData(list);
								setTimeout(function(){
									self._districtWidget.setValue(merchant.districtId);
								},200);
							}
						}
					});
					
					$("#account").val(merchant.account);
					$("#name").val(merchant.name);
					var sex=$("#sexMale").is(':checked')?1:0;
					if(merchant.sex==1){
						$("#sexMale").attr("checked", "checked");
					}else{
						$("#sexFemale").attr("checked", "checked");
					}
					
					$("#bankName").val(merchant.bankName);
					$("#bankPhone").val(merchant.bankPhone);
					setTimeout(function(){
						self._bankProviceWidget.setText(merchant.bankProvince);
					},200);
					$("#bankSubBank").val(merchant.bankSubBank);
					$("#bankAccount").val(merchant.bankAccount);
					self._bankSettlementWidget.setValue(merchant.bankSettlement);
					$("#bankRemark").val(merchant.bankRemark);
					$("#bookInstruction").val(merchant.bookInstruction);
					self._cancelBookTypeWidget.setValue(merchant.cancelBookType);
					$("#cancelBookDes").val(merchant.cancelBookDes);
					
					//联系人 商户联系人类型（1-主负责人，2-辅负责人，3-管家）
					var subChargeIndex=0;
					var homeKeeperIndex=0;
					var merchantContacts=merchant.merchantContacts||[];
					for(var i=0,len=merchantContacts.length;i<len;i++){
						var mc=merchantContacts[i];
						var _name=mc.name;
						var _phone=mc.phone;
						var _districtId=mc.districtId;
						
						if("1"==mc.type){
							$("#mainChargeMan_name").val(_name);
							$("#mainChargeMan_phone").val(_phone);
						}else if("2"==mc.type){
							if(subChargeIndex==0){
								//首个辅联系人
								$("#subChargeMan1_name").val(_name);
								$("#subChargeMan1_phone").val(_phone);
							}else{
								addSubChargeMan(subChargeManIdList[subChargeManIdList.length-1],mc);
							}
							subChargeIndex++;
						}else if("3"==mc.type){
							if(homeKeeperIndex==0){
								$("#homeKeeper1_name").val(_name);
								$("#homeKeeper1_phone").val(_phone);
								var _temp=_districtId+"";
								setTimeout(function(){
									$("#homeKeeper1_district").val(_temp);
								},200);
							}else{
								setTimeout(function(){
									addHousekeeper(homeKeeperIdList[homeKeeperIdList.length-1],mc);
								},200);
							}
							homeKeeperIndex++;
						}
						
					}
					
					
					
				}
			}
		});
	},
	_saveMerchant:function(){
		var self=this;
		var merchant={
			id:self._id
		};
		
		var provinceId=self._proviceWidget.getValue();
		merchant.provinceId=provinceId;
		var cityId=self._cityWidget.getValue();
		merchant.cityId=cityId;
		var districtId=self._districtWidget.getValue();
		merchant.districtId=districtId;
		var account=$("#account").val();
		merchant.account=account;
		var name=$("#name").val();
		merchant.name=name;
		var sex=$("#sexMale").is(':checked')?1:0;
		merchant.sex=sex;
		
		//商户联系人类型（1-主负责人，2-辅负责人，3-管家）
		//商家联系人 type,name,phone,district
		var mainChargeMan_name=$("#mainChargeMan_name").val();
		var mainChargeMan_phone=$("#mainChargeMan_phone").val();
		var merchantContactList="1,"+mainChargeMan_name+","+mainChargeMan_phone+",;";
		//获取辅负责人
		for(var i=0,len=subChargeManIdList.length;i<len;i++){
			var _id=subChargeManIdList[i];
			var _name=$("#"+_id+"_name").val();
			var _phone=$("#"+_id+"_phone").val();
			if(!_name||_name==""){
				continue;
			}
			merchantContactList+="2,"+_name+","+_phone+",;";
		}
		//管家
		for(var i=0,len=homeKeeperIdList.length;i<len;i++){
			var _id=homeKeeperIdList[i];
			var _name=$("#"+_id+"_name").val();
			var _phone=$("#"+_id+"_phone").val();
			var _district=$("#"+_id+"_district").val();
			if(!_name||_name==""){
				continue;
			}
			merchantContactList+="3,"+_name+","+_phone+","+_district+";";
		}
		//去掉最后的一个分号
		merchantContactList=merchantContactList.substring(0,merchantContactList.length);
		merchant.merchantContactList=merchantContactList;
		
		var bankName=$("#bankName").val();
		merchant.bankName=bankName;
		var bankPhone=$("#bankPhone").val();
		merchant.bankPhone=bankPhone;
		var bankProvince=self._bankProviceWidget.getText();
		merchant.bankProvince=bankProvince;
		var bankSubBank=$("#bankSubBank").val();
		merchant.bankSubBank=bankSubBank;
		var bankAccount=$("#bankAccount").val();
		merchant.bankAccount=bankAccount;
		var bankSettlement=self._bankSettlementWidget.getValue();
		merchant.bankSettlement=bankSettlement;
		var bankRemark=$("#bankRemark").val();
		merchant.bankRemark=bankRemark;
		var bookInstruction=$("#bookInstruction").val();
		merchant.bookInstruction=bookInstruction;
		var cancelBookType=self._cancelBookTypeWidget.getValue();
		merchant.cancelBookType=cancelBookType;
		var cancelBookDes=$("#cancelBookDes").val();
		merchant.cancelBookDes=cancelBookDes;
		
		//console.info(merchant);
		//return;
		
		CommonUtils.async({
			url:"/hishu/admin/updateMerchant.json",
			data:merchant,
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功",function(){
						location.href="/admin/houseMerchantManager/merchantList.html";
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
	EditMerchant.init();
});




var subChargeManIdList=['subChargeMan1'];

function addSubChargeMan(elId,mc){
	$("#"+elId).addClass("hide");
	var uuid=new Date().getTime();
	uuid+=""+parseInt(Math.random()*1000+1)+"sbc";
	subChargeManIdList.push(uuid);
	
	var _name="";
	var _phone="";
	if(mc){
		_name=mc.name;
		_phone=mc.phone;
	}
	
	var _html='<div class="form-group">'
        +'<label class="col-sm-1 control-label">辅负责人：</label>'
        +'<div class="col-sm-2">'
        +'    <input id="'+uuid+'_name" class="form-control" placeholder="" value="'+_name+'">'
        +'</div>'
        +'<label class="col-sm-1 control-label ">联系电话：</label>'
        +'<div class="col-sm-2">'
        +'    <input id="'+uuid+'_phone" class="form-control" placeholder="" value="'+_phone+'">'
        +'</div>'
        +'<a id="'+uuid+'" class="btn btn-success" href="javascript:addSubChargeMan(\''+uuid+'\');">添加</a>'
        +'</div>';
	
	$("#"+elId).parent().after(_html);
}

var homeKeeperIdList=['homeKeeper1'];

function addHousekeeper(elId,mc){
	$("#"+elId).addClass("hide");
	var uuid=new Date().getTime();
	uuid+=""+parseInt(Math.random()*1000+1)+"hkp";
	homeKeeperIdList.push(uuid);
	
	var _name="";
	var _phone="";
	var _districtId="";
	if(mc){
		_name=mc.name;
		_phone=mc.phone;
		_districtId=mc.districtId;
	}
	
	var _district='';
	var _district='<option value="">请选择小区</option>';
	for(var i=0,len=EditMerchant._districtList.length;i<len;i++){
		var _d=EditMerchant._districtList[i];
		var selected='';
		//console.info(_districtId+"==="+_d.id);
		if(_districtId==_d.id){
			selected='selected="selected"';
		}
		_district+='<option value="'+_d.id+'" '+selected+'>'+_d.name+'</option>';
	}
	
	var _html='<div class="form-group">'
        +'<label class="col-sm-1 control-label">管家：</label>'
        +'<div class="col-sm-2">'
        +'    <input id="'+uuid+'_name" class="form-control" placeholder="" value="'+_name+'">'
        +'</div>'
        +'<label class="col-sm-1 control-label ">联系电话：</label>'
        +'<div class="col-sm-2">'
        +'    <input id="'+uuid+'_phone" class="form-control" placeholder="" value="'+_phone+'">'
        +'</div>'
        +'<div class="col-sm-2">'
        +'    <select id="'+uuid+'_district" class="form-control homeKeeperDistrict">'
        +'    '+_district
        +'    </select>'
        +'</div>'
        +'<a id="'+uuid+'" class="btn btn-success" href="javascript:addHousekeeper(\''+uuid+'\');">添加</a>'
        +'</div>';
	
	$("#"+elId).parent().after(_html);
}