var HouseStatus={
	_timePanel:null,
	
	init:function(){
		var self=this;
		self._render();
		self._getHouseDayStatusList();
		self._bind();
	},
	_render:function(){
		var self=this;
		
		self._renderPanel();
	},
	_bind:function(){
		
	},
	_renderPanel:function(){
		var self=this;
		
		//var tt=TimeUtils.string2Date("2018-02-01 00:00:00",TimeUtils.FORMAT_YYYYMMDDHHMMSS);
		//console.info(TimeUtils.getDaysOfMonth(tt));
		
		var now=new Date();
		var tody=now.getDate();
		//获取当前月1号时间
		var _nowStr=TimeUtils.date2String(now,TimeUtils.FORMAT_YYYYMM);
		var currentMonthFirstDay=TimeUtils.string2Date(_nowStr,TimeUtils.FORMAT_YYYYMMDDHHMMSS);
		//获取上个月1号
		var lastMonthFirstDay=TimeUtils.add(currentMonthFirstDay,TimeUtils.MONTH,-1);
		//获取下1个月1号
		var nextMonthFirstDay=TimeUtils.add(currentMonthFirstDay,TimeUtils.MONTH,1);
		
		//计算每个月之间的天数
		var lastToCurrent=TimeUtils.getDaysOfMonth(lastMonthFirstDay);
		var currentToNext1=TimeUtils.getDaysOfMonth(currentMonthFirstDay);
		var next1ToNext2=TimeUtils.getDaysOfMonth(nextMonthFirstDay);
		
		//console.info(lastToCurrent);
		//console.info(currentToNext1);
		//console.info(next1ToNext2);
		
		var month1Group=self._genMonthDayGroup(currentMonthFirstDay,lastToCurrent,currentToNext1);
		//console.info(month1Group);
		var month2Group=self._genMonthDayGroup(nextMonthFirstDay,currentToNext1,next1ToNext2);
		//console.info(month2Group);
		
		var month1=TimeUtils.date2String(currentMonthFirstDay,TimeUtils.FORMAT_YYYYMM);
		$("#month1Name").html(month1);
		self._renderMonthWidget(tody,month1,month1Group,"month1");
		var month2=TimeUtils.date2String(nextMonthFirstDay,TimeUtils.FORMAT_YYYYMM);
		$("#month2Name").html(month2);
		self._renderMonthWidget(null,month2,month2Group,"month2");
		
	},
	_genMonthDayGroup:function(firstDayOfMonth,lastToCurrent,currentToNext){
		//计算今天是星期几
		var week=TimeUtils.getWeek(firstDayOfMonth);
		//第一组
		var _group1=[];
		var _temp=[];
		for(i=0;i<week;i++){
			_temp.push(lastToCurrent);
			lastToCurrent--;
		}
		for(var i=_temp.length;i>0;i--){
			_group1.push(_temp[i-1]);
		}
		
		var step=1;
		for(var i1=_group1.length;i1<7;i1++){
			_group1.push(step);
			step++;
		}
		//第二组
		var _group2=[];
		for(var i2=0;i2<7;i2++){
			_group2.push(step);
			step++;
		}
		
		//第三组
		var _group3=[];
		for(var i3=0;i3<7;i3++){
			_group3.push(step);
			step++;
		}
		
		//第四组
		var _group4=[];
		for(var i4=0;i4<7;i4++){
			_group4.push(step);
			step++;
		}
		
		//第五组
		var _group5=[];
		for(var i5=0;i5<7;i5++){
			_group5.push(step);
			step++;
			if(step>currentToNext){
				step=1;
			}
		}
		
		var _monthDaysGroup=[_group1,_group2,_group3,_group4,_group5];
		
		return _monthDaysGroup;
	},
	_renderMonthWidget:function(today,yyyyMM,monthGroup,elId){
		var _html1='';
		for(var m1=0,m1l=monthGroup.length;m1<m1l;m1++){
			var g=monthGroup[m1];
			_html1+='<tr>';
			var tody="";
			for(var gi=0,gil=g.length;gi<gil;gi++){
				if(today&&today==g[gi]){
					tody=" today";
				}
				if(m1==0){
					//第一组
					if(g[gi]>10){
						//不是自己月份的
						_html1+='<td class="">'+g[gi]+'</td>';
					}else{
						//是自己月份的
						var _id=yyyyMM+"-"+(g[gi]>9?g[gi]:0+""+g[gi]);
						_html1+='<td id="'+_id+'" class="effective'+tody+'">'+g[gi]+'</td>';
					}
				}else if(m1==4){
					//第五组
					if(g[gi]<10){
						//不是自己月份的
						_html1+='<td class="">'+g[gi]+'</td>';
					}else{
						//是自己月份的
						var _id=yyyyMM+"-"+(g[gi]>9?g[gi]:0+""+g[gi]);
						_html1+='<td id="'+_id+'" class="effective'+tody+'">'+g[gi]+'</td>';
					}
				}else{
					var _id=yyyyMM+"-"+(g[gi]>9?g[gi]:0+""+g[gi]);
					_html1+='<td id="'+_id+'" class="effective'+tody+'">'+g[gi]+'</td>';
				}
			}
			
			_html1+='</tr>';
		}
		
		$("#"+elId).html(_html1);
	},
	_getHouseDayStatusList:function(){
		var self=this;
		var startTime="2018-01-01 00:00:00";
		var endTime="2018-02-28 23:59:59";
		
		var param={
			houseId:1,
			startTime:startTime,
			endTime:endTime
		};
		CommonUtils.async({
			url:"/hishu/order/getHouseDayStatusList.json",
			data:param,
			success:function(result){
				if(result.code==0){
					var list=result.data.list||[];
					for(var i=0,len=list.length;i<len;i++){
						var houseDayStatus=list[i];
						var date=houseDayStatus.date;//2018-01-01
						$("#"+date).addClass("idle");
					}
				}
			}
		});
	}
}
$(function(){
	HouseStatus.init();
});