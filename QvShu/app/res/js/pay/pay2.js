var Pay2={
	id:null,
	startTime:null,
	endTime:null,
	
	init:function(){
		var self=this;
		self.id=CommonUtils.getQueryString("id");
		self.startTime=CommonUtils.getQueryString("startTime");
		self.endTime=CommonUtils.getQueryString("endTime");
		
		self._render();
		self._bind();
		
	},
	_render:function(){
		var self=this;
		
	},
	_bind:function(){
		var self=this;
		
		
	}
	
	
}
$(function(){
	Pay2.init();
});