var HouseStatus={
	_cityWidget:null,
	_districtWidget:null,
	_houseCountWidget:null,
	_liveCountWidget:null,
	_merchantWidget:null,
	
	
	init:function(){
		var self=this;
		self._getHouseStatusList();
		self._render();
		self._bind();
	},
	_render:function(){
		var self=this;
		//生成右边的日期
		self._genDateHeader();
		
		self._cityWidget=$("#cityWidget").ComboBoxWidget({
			url:"/hishu/admin/getCityList.json",
			textField:"name",
			valueField:"id",
			selectTip:"城市",
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
			selectTip:"小区"
		});
		
		self._merchantWidget=$("#merchantWidget").ComboBoxWidget({
			url:"/hishu/admin/getMerchantList.json?pageSize=1000",
			textField:"name",
			valueField:"id",
			selectTip:"商户"
		});
		
		self._houseCountWidget=$("#houseCountWidget").ComboBoxWidget({
			textField:"name",
			valueField:"value",
			selectTip:"房间数",
			data:[{
				name:"1",
				value:1
			},{
				name:"2",
				value:2
			},{
				name:"3",
				value:3
			},{
				name:"4",
				value:4
			},{
				name:"5",
				value:5
			},{
				name:"6",
				value:6
			},{
				name:"7",
				value:7
			},{
				name:"8",
				value:8
			}]
		});
		
		self._liveCountWidget=$("#liveCountWidget").ComboBoxWidget({
			textField:"name",
			valueField:"value",
			selectTip:"入住人数",
			data:[{
				name:"1",
				value:1
			},{
				name:"2",
				value:2
			},{
				name:"3",
				value:3
			},{
				name:"4",
				value:4
			},{
				name:"5",
				value:5
			},{
				name:"6",
				value:6
			},{
				name:"7",
				value:7
			},{
				name:"8",
				value:8
			}]
		});
	},
	_bind:function(){
		var self=this;
		
		$("#searchBtn").unbind("click").click(function(){
			self._getHouseStatusList(true);
		});
		
		
	},
	_tpl:"",
	_headerRow:"",
	_genDateHeader:function(){
		var self=this;
		//获取当天是周几
		var now=new Date();
		var _dateStr=TimeUtils.date2String(now,"yyyy-MM-dd");
		var items=_dateStr.split("-");
		var _y=items[0]*1;
		var _m=items[1]*1;
		var _d=items[2]*1;
		
		//console.info(_y);
		//console.info(_m);
		//console.info(_d);
		
		var w=TimeUtils.getWeek(now);
		var a=new Array("日", "一", "二", "三", "四", "五", "六");
		var _html='<tr>';
		self._tpl='<tr>';
		for(var i=0;i<30;i++){
			var _css='';
			if(w==5){
				_css='friday-title';
			}else if(w==6){
				_css='setday-title';
			}
			_html+='<th class="'+_css+'">'+a[w]+'</th>';
			
			var _dateStr=_m+"月"+_d+"日";
			var _id=_y+"-"+(_m<10?"0"+_m:_m)+"-"+(_d<10?"0"+_d:_d);
			self._tpl+='<td class="'+_css+' {'+_id+'status}">'
				+'<a style="text-decoration:none" href="javascript:HouseStatus.clickStatus($houseId,\''+_id+'\',{'+_id+'state});">'
				+'<p style="width:55px;">'+_dateStr+'</p><p>{'+_id+'amount}</p></a></td>';
			_d++;
			if(_m==2&&_y%4==0&&_d==30){
				//闰月 29天
				_d=1;
				_m++;
				if(_m==13){
					_m=1;
					_y++;
				}
			}else if(_m==2&&_y%4!=0&&_d==29){
				//不是闰月 28天
				_d=1;
				_m++;
				if(_m==13){
					_m=1;
					_y++;
				}
			}else if((_m==1 || _m==3 || _m==5 || _m==7 || _m==8 || _m==10 || _m==12)&&_d==32){
				_d=1;
				_m++;
				if(_m==13){
					_m=1;
					_y++;
				}
			}else if((_m==4 || _m==6 || _m==9 || _m==11)&&_d==31){
				_d=1;
				_m++;
				if(_m==13){
					_m=1;
					_y++;
				}
			}
			
			
			w++;
			if(w==7){
				w=0;
			}
		}
		_html+='</tr>';
		self._tpl+='</tr>';
		//console.info(self._tpl);
		$("#houseStatusList").html(_html);
		self._headerRow=_html;
	},
	_getHouseStatusList:function(reload){
		var self=this;
		//时间是当前时间和30天后的时间
		var now=new Date();
		var _startTimeStr=TimeUtils.date2String(now,TimeUtils.FORMAT_YYYYMMDD);
		
		/*var tmp="2018-02-01 00:00:00";
		var tmpD=TimeUtils.string2Date(tmp);
		var tt=tmpD.setDate(tmpD.getDate()+31);
		tt=new Date(tt);
		console.info(tt);
		var tts=TimeUtils.date2String(tt,TimeUtils.FORMAT_YYYYMMDD);
		console.info(tts);*/
		
		var endTime=TimeUtils.add(now,TimeUtils.DAY,30);
		var _endTimeStr=TimeUtils.date2String(endTime,TimeUtils.FORMAT_YYYYMMDD);
		
		var param={startTime:_startTimeStr+" 00:00:00",endTime:_endTimeStr+" 23:59:59"};
		if(self._cityWidget){
			var cityId=self._cityWidget.getValue();
			if(cityId&&cityId!=""){
				param.cityId=cityId;
			}
		}
		if(self._districtWidget){
			var districtId=self._districtWidget.getValue();
			if(districtId&&districtId!=""){
				param.districtId=districtId;
			}
		}
		if(self._houseCountWidget){
			var roomCount=self._houseCountWidget.getValue();
			if(roomCount&&roomCount!=""){
				param.layoutRoom=roomCount;
			}
		}
		if(self._liveCountWidget){
			var liveCount=self._liveCountWidget.getValue();
			if(liveCount&&liveCount!=""){
				param.liveCount=liveCount;
			}
		}
		if(self._merchantWidget){
			var merchantId=self._merchantWidget.getValue();
			if(merchantId&&merchantId!=""){
				param.merchantId=merchantId;
			}
		}
		
		var name=$("#name").val();
		if(name&&name!=""){
			param.likeName=name;
		}
		
		CommonUtils.async({
			url:"/hishu/order/getHouseStatusList.json",
			data:param,
			success:function(result){
				if(result.code==0){
					var list=result.data.list||[];
					self._renderList(list,reload);
				}
			},
			error:function(result){
				
			}
		});
		
		
	},
	_renderList:function(list,reload){
		var self=this;
		var _html='';
		var _shtml='';
		
		if(reload){
			//先删掉以前的行
			$("#houseStatusList").html(self._headerRow);
		}
		
		for(var i=0,len=list.length;i<len;i++){
			var h=list[i];
			_html+='<tr>'
                +'<td>'+h.cityName+'</td>'
                +'<td>'+h.districtName+'</td>'
                +'<td>'+h.merchantName+'</td>'
                +'<td>'+h.name+'</td>'
                +'</tr>';
			
			//生成另外一个table的行列
			var statusList=h.statusList||[];
			_shtml+=self._genStatus(h.id,statusList);
		}
		$("#houseList").html(_html);
		$("#houseStatusList").append(_shtml);
		
	},
	_genStatus:function(houseId,statusList){
		var self=this;
		var _tpl=self._tpl;
		for(var i=0,len=statusList.length;i<len;i++){
			var s=statusList[i];
			var date=s.date;
			var status=s.status*1;
			var orderAmount=s.orderAmount||0;
			var _statusCss="";
			if(status==0||status==2){
				_statusCss='no-room';
			}
			_tpl=_tpl.replace("{"+date+"amount"+"}","￥"+orderAmount);
			_tpl=_tpl.replace("{"+date+"status"+"}",_statusCss);
			_tpl=_tpl.replace("{"+date+"state"+"}",status);
		}
		if(_tpl.indexOf("amount}")>-1){
			//没替换完，则用正则，全部替换
			var regObj=new RegExp("(\{[0-9\-]+amount\})","g");
			_tpl=_tpl.replace(regObj, "");
		}
		if(_tpl.indexOf("status}")>-1){
			//没替换完，则用正则，全部替换
			var regObj=new RegExp("(\{[0-9\-]+status\})","g");
			_tpl=_tpl.replace(regObj, "");
		}
		if(_tpl.indexOf("state}")>-1){
			//没替换完，则用正则，全部替换
			var regObj=new RegExp("(\{[0-9\-]+state\})","g");
			_tpl=_tpl.replace(regObj, "null");
		}
		var regObj=new RegExp("\\$houseId","g");
		_tpl=_tpl.replace(regObj, houseId);
		
		return _tpl;
	},
	clickStatus:function(houseId,date,status){
		var self=this;
		if(houseId==null||date==null){
			return;
		}
		CommonUtils.async({
			url:"/hishu/order/getHouseDayStatusMap.json",
			data:{houseId:houseId,date:date+" 00:00:00"},
			success:function(result){
				if(result.code==0){
					//弹窗
					var map=result.data;
					
					var status=map.status;//房态（0-无房，1-有房,2-标记无房）
					var houseDayStatusOperatorName=map.houseDayStatusOperatorName||"";//谁标记有房
					var orderId=map.orderId;
					
					if(status==0){
						//无房
						if(orderId){
							//有订单
							var userName=map.userName;//线上下单的用户名
							var orderOperatorName=map.orderOperatorName;//手动录单的系统用户名称
							var bookLiveTime=map.bookLiveTime;
							var bookLeaveTime=map.bookLeaveTime;
							if(userName){
								//线上下单
								var _hh=userName+'预订</br>'+bookLiveTime+'  '+bookLeaveTime;
								$("#row1").html(_hh);
							}else{
								//手动录单
								var _hh=orderOperatorName+'手动录单</br>'+bookLiveTime+'  '+bookLeaveTime;
								$("#row1").html(_hh);
							}
						}else{
							//无订单，则是系统同步
							$("#row1").html("系统同步");
						}
						$("#row2").html('<a href="javascript:HouseStatus.markHouseDayStatus('+houseId+',\''+date+'\',1);">标记有房</a>');
						$('#showRoom').modal({});
					}else if(status==1){
						//有房
						$("#row1").html('<a href="javascript:HouseStatus.markHouseDayStatus('+houseId+',\''+date+'\',2);">标记无房</a>');
						$("#row2").html('<a href="/admin/orderManagement/addOrder.html?houseId='+houseId+'&date='+date+'">录入订单</a>');
						$('#showRoom').modal({});
					}else if(status==2){
						//已经标记有房
						$("#row1").html(houseDayStatusOperatorName+'标记无房');
						$("#row2").html('<a href="javascript:HouseStatus.markHouseDayStatus('+houseId+',\''+date+'\',1);">标记有房</a>');
						$('#showRoom').modal({});
					}
				}
			}
		});
	},
	markHouseDayStatus:function(houseId,date,status){
		var self=this;
		//关闭弹层
		$('#showRoom').modal('hide');
		
		self._updateHouseDayStatus(houseId,date,status);
	},
	_updateHouseDayStatus:function(houseId,date,status){
		var self=this;
		var houseDayStatus={
			houseId:houseId,
			date:date+" 00:00:00",
			status:status
		}
		//console.info(houseDayStatus);
		//return ;
		CommonUtils.async({
			url:"/hishu/order/updateHouseDayStatus.json",
			data:houseDayStatus,
			success:function(result){
				if(result.code==0){
					CommonUtils.Msg.info("成功",function(){
						//重新加载房态
						//self.getHouseDayStatusList(self._currentHouseId);
						self._getHouseStatusList(true);//true表示重新加载
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
	HouseStatus.init();
});