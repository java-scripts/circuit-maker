var r = Raphael("holder", 1200, 600);
var connections=[];
var wire={};
var devices=[];
var wires=[];

var onstart = function () {
	this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
	this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
	//this.animate({"fill-opacity": .2}, 500);
};
var onmove = function (dx, dy) {
	var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
	this.attr(att);
	for(var i in this.group){
		var item = this.group[i];
		item.node.attr({x: this.ox + dx + item.p.x, y: this.oy + dy + item.p.y});
	}	
	for (var i = connections.length; i--;) {
		r.connection(connections[i]);
	}
	r.safari();
};
var onend = function () {
   // this.animate({"fill-opacity": 0}, 500);
};

var mouseuponpin = function(){
	
	if(isWireOpened){
		if(!wire.node1){
			wire.node1=this;		
		}else{
			wire.node2=this;			
			isWireOpened=false;
			var wireConnection = r.connection(wire.node1, wire.node2, "#00f");
			connections.push(wireConnection);			
			
			//creating wire object
			var w = dl.createWire();
			w.ui = wireConnection;
			//connecting 
			
			$.each([wire.node1,wire.node2],function(i,node){			
				if(node.pinType=='out'){
					node.device.output.push(w);
				}else{
					node.device.inputs.push(w);
				}
			});			
			wire={};//reset wire;	
			wires.push(w);
		}		
	}
}



$('.and-gate').click(function(){	
	var device = dl.createGate('AND');	
	var color = Raphael.getColor();	
	var b={x:20,y:10,w:60,h:50,r:5};
	var p={w:20,h:10,r:0};
	var pinpositions=[
		{x:-p.w,y:b.h/5,pinType:'in'},
		{x:-p.w,y:3*b.h/5,pinType:'in'},
		{x:b.w,y:2*b.h/5,pinType:'out'}];
	var group=[];
	$.each(pinpositions,function(i,pos){
		var pin = r.rect(b.x+pos.x, b.y+pos.y, p.w, p.h, p.r);
		group.push({node:pin,p:pos});
		pin.attr({fill: 'black', stroke: 'black', "fill-opacity": 0, "stroke-width": 2});
		pin.mouseup(mouseuponpin);		
		pin.device=device;	
		pin.pinType=pos.pinType;		
	});	
	var body=r.rect(b.x, b.y, b.w, b.h, b.r);	
	body.group=group;	
    body.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
	body.drag(onmove, onstart, onend);	
	devices.push(device);
});



$('.or-gate').click(function(){	
	var device = dl.createGate('OR');	
	var color = Raphael.getColor();	
	var b={x:20,y:10,w:60,h:50,r:30};
	var p={w:20,h:10,r:0};
	var pinpositions=[
		{x:-p.w,y:b.h/5,pinType:'in'},
		{x:-p.w,y:3*b.h/5,pinType:'in'},
		{x:b.w,y:2*b.h/5,pinType:'out'}];
	var group=[];
	$.each(pinpositions,function(i,pos){
		var pin = r.rect(b.x+pos.x, b.y+pos.y, p.w, p.h, p.r);
		group.push({node:pin,p:pos});
		pin.attr({fill: 'black', stroke: 'black', "fill-opacity": 0, "stroke-width": 2});
		pin.mouseup(mouseuponpin);		
		pin.device=device;	
		pin.pinType=pos.pinType;		
	});	
	var body=r.rect(b.x, b.y, b.w, b.h, b.r);	
	body.group=group;	
    body.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
	body.drag(onmove, onstart, onend);	
	devices.push(device);
});

$('.not-gate').click(function(){	
	var device = dl.createGate('NOT');	
	var color = Raphael.getColor();	
	var b={x:20,y:10,w:60,h:50,r:30};
	var p={w:20,h:10,r:0};
	var pinpositions=[
		{x:-p.w,y:2*b.h/5,pinType:'in'},		
		{x:b.w,y:2*b.h/5,pinType:'out'}];
	var group=[];
	$.each(pinpositions,function(i,pos){
		var pin = r.rect(b.x+pos.x, b.y+pos.y, p.w, p.h, p.r);
		group.push({node:pin,p:pos});
		pin.attr({fill: 'black', stroke: 'black', "fill-opacity": 0, "stroke-width": 2});
		pin.mouseup(mouseuponpin);		
		pin.device=device;	
		pin.pinType=pos.pinType;		
	});	
	var body=r.rect(b.x, b.y, b.w, b.h, b.r);	
	body.group=group;	
    body.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
	body.drag(onmove, onstart, onend);	
	devices.push(device);
});






var isWireOpened=false;

$('.wire').click(function(){
	isWireOpened=true;	
});






$('.switch').click(function(){	
	var device=dl.createSwitch();	
	var color = Raphael.getColor();	
	var b={x:20,y:80,w:60,h:50,r:10};
	var body=r.rect(b.x, b.y, b.w, b.h, b.r);		
    body.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
	body.drag(onmove, onstart, onend);		
	body.mouseup(mouseuponpin);	
	body.node.onclick = function(){
		device.toggle().state?body.animate({"fill-opacity": 1}, 100):body.animate({"fill-opacity": 0}, 100);
	};
	body.device=device;	
	body.pinType='out';
	devices.push(device);
});





$('.bulb').click(function(){
	var device=dl.createBulb();	
	var color = Raphael.getColor();	
	var b={x:20,y:150,w:60,h:50,r:50};
	var body=r.rect(b.x, b.y, b.w, b.h, b.r);		
    body.attr({fill: 'white', stroke: color, "fill-opacity": 1, "stroke-width": 2, cursor: "move"});
	body.drag(onmove, onstart, onend);		
	body.mouseup(mouseuponpin);		
	body.device=device;
	device.ui = body;
	body.pinType='in';
	devices.push(device);
});


$('.switch,.bulb').click();

var simref;
var runSimulation = function(){	
	$.each(devices,function(i,device){
		device.update();
		$.each(device.output||[],function(j,wire){			
			wire.state = device.state;
		});
		if(device.ui){
			device.state?device.ui.attr({fill:'red'}):device.ui.attr({fill:'white'});
		}
	});

	$.each(wires,function(i,w){
		w.state?w.ui.line.attr({stroke: 'red'}):w.ui.line.attr({stroke: 'blue'});
	});
	simref = setTimeout(runSimulation,100);
};
//runSimulation();

$('.run').click(runSimulation);
$('.stop').click(function(){
	clearTimeout(simref);
});
