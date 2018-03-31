var AddMerchant={
	_proviceWidget:null,
	_cityWidget:null,
	_districtWidget:null,
	_bankProviceWidget:null,
	_bankSettlementWidget:null,
	_cancelBookTypeWidget:null,
	
	_proviceList:[],
	_districtList:[],
	
	init:function(){
		var self=this;
		self._render();
		self._bind();
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
	_bind:function(){
		var self=this;
		
		$("#saveBtn").unbind("click").click(function(){
			self._saveMerchant();
		});
		
		$("#cancelBtn").click(function(){
			location.href="/admin/houseMerchantManager/merchantList.html";
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
	_saveMerchant:function(){
		var self=this;
		var merchant={};
		var provinceId=self._proviceWidget.getValue();
		if(!provinceId||provinceId==""){
			CommonUtils.Msg.alert("省份不能为空");
			return;
		}
		merchant.provinceId=provinceId;
		
		var cityId=self._cityWidget.getValue();
		if(!cityId||cityId==""){
			CommonUtis.Msg.alert("城市不能为空");
			return;
		}
		merchant.cityId=cityId;
		var districtId=self._districtWidget.getValue();
		if(!districtId||districtId==""){
			CommonUtils.Msg.alert("小区不能为空");
			return;
		}
		merchant.districtId=districtId;
		var account=$("#account").val();
		if(!account||account==""){
			CommonUtils.Msg.alert("商户名称不能为空");
			return;
		}
		merchant.account=account;
		var name=$("#name").val();
		if(!name||name==""){
			CommonUtils.Msg.alert("商户姓名不能空");
			return;
		}
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
		merchant.bankRemar=bankRemark;
		var bookInstruction=$("#bookInstruction").val();
		merchant.bookInstruction=bookInstruction;
		var cancelBookType=self._cancelBookTypeWidget.getValue();
		merchant.cancelBookType=cancelBookType;
		var cancelBookDes=$("#cancelBookDes").val();
		merchant.cancelBookDes=cancelBookDes;
		//console.info(merchant);
		//return;
		
		CommonUtils.async({
			url:"/hishu/admin/addMerchant.json",
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
	AddMerchant.init();
});

var subChargeManIdList=['subChargeMan1'];

function addSubChargeMan(elId){
	$("#"+elId).addClass("hide");
	var uuid=new Date().getTime();
	uuid+=""+parseInt(Math.random()*1000+1)+"sbc";
	subChargeManIdList.push(uuid);
	var _html='<div class="form-group">'
        +'<label class="col-sm-1 control-label">辅负责人：</label>'
        +'<div class="col-sm-2">'
        +'    <input id="'+uuid+'_name" class="form-control" placeholder="">'
        +'</div>'
        +'<label class="col-sm-1 control-label ">联系电话：</label>'
        +'<div class="col-sm-2">'
        +'    <input id="'+uuid+'_phone" class="form-control" placeholder="">'
        +'</div>'
        +'<a id="'+uuid+'" class="btn btn-success" href="javascript:addSubChargeMan(\''+uuid+'\');">添加</a>'
        +'</div>';
	
	$("#"+elId).parent().after(_html);
}

var homeKeeperIdList=['homeKeeper1'];

function addHousekeeper(elId){
	$("#"+elId).addClass("hide");
	var uuid=new Date().getTime();
	uuid+=""+parseInt(Math.random()*1000+1)+"hkp";
	homeKeeperIdList.push(uuid);
	
	var _district='';
	var _district='<option value="">请选择小区</option>';
	for(var i=0,len=AddMerchant._districtList.length;i<len;i++){
		var _d=AddMerchant._districtList[i];
		_district+='<option value="'+_d.id+'">'+_d.name+'</option>';
	}
	
	var _html='<div class="form-group">'
        +'<label class="col-sm-1 control-label">管家：</label>'
        +'<div class="col-sm-2">'
        +'    <input id="'+uuid+'_name" class="form-control" placeholder="">'
        +'</div>'
        +'<label class="col-sm-1 control-label ">联系电话：</label>'
        +'<div class="col-sm-2">'
        +'    <input id="'+uuid+'_phone" class="form-control" placeholder="">'
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



