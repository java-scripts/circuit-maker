


$('.create-gate').click(function(){	
	dl.createComponent({type:'GATE',name:$(this).attr('gatetype'),x:0,y:0});	
});
$('.bulb').click(function(){
	dl.createComponent({type:'BULB',x:0,y:0});	
});
$('.switch').click(function(){	
	dl.createComponent({type:'SWITCH',x:0,y:0});	
});
$('.wire').click(function(){
	dl.setMode(dl.modes.WIREMODE);
});
$('#simspeed').change(function(){	
	dl.setSimSpeed(1000-$(this).val())
});





$('.stop').click(dl.stopSim);
$('.run').click(dl.startSim);



var writeComponents = function(){
	var str='';
	$.each(components,function(i,c){
		str+='\n'+dl.write(c);
	});
	console.log(str);
};






