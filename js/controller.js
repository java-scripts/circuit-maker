var r = Raphael("holder", 1200, 600);
var connections=[];
var tempwire={};
var devices=[];
var wires=[];

var onstart = function () {
	this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
	this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
	//this.animate({"fill-opacity": .2}, 500);
};
var onmove = function (dx, dy) {	
	this.attr({x: this.ox + dx, y: this.oy + dy, cx: this.ox + dx, cy: this.oy + dy});
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
		if(!tempwire.node1){
			tempwire.node1=this;		
		}else{
			tempwire.node2=this;			
			isWireOpened=false;
			var wireConnection = r.connection(tempwire.node1, tempwire.node2, "#00f");
			connections.push(wireConnection);			
			
			//creating tempwire object
			var w = dl.createWire();
			w.ui = wireConnection;
			//connecting 			
			$.each([tempwire.node1,tempwire.node2],function(i,node){			
				if(node.pinType=='out'){
					node.device.output.push(w);
				}else{
					node.device.inputs.push(w);
				}
			});			
			tempwire={};//reset tempwire;	
			wires.push(w);
		}		
	}
}
var isWireOpened=false;
$('.wire').click(function(){
	isWireOpened=true;	
});



$('.create-gate').click(function(){
	var gatetype = $(this).attr('gatetype');	
	var device = dl.createGate(gatetype);	
	var color = Raphael.getColor();	
	var b={x:20,y:10,w:60,h:50,r:5};
	var p={w:20,h:10,r:0};
	console.log(gatetype)
	var pinpositions = gatetype=='NOT'?[{x:-p.w,y:2*b.h/5,pinType:'in'},{x:b.w,y:2*b.h/5,pinType:'out'}]:[{x:-p.w,y:b.h/5,pinType:'in'},{x:-p.w,y:3*b.h/5,pinType:'in'},{x:b.w,y:2*b.h/5,pinType:'out'}];	
	var group=[];
	$.each(pinpositions,function(i,pos){
		var pin = r.rect(b.x+pos.x, b.y+pos.y, p.w, p.h, p.r);
		group.push({node:pin,p:pos});
		pin.attr({fill: 'black', stroke: 'black', "fill-opacity": 0, "stroke-width": 2});
		pin.mouseup(mouseuponpin);		
		pin.device=device;	
		pin.pinType=pos.pinType;		
	});	
	var body=r.image("img/"+gatetype+".png", b.x, b.y, b.w, b.h);
	body.group=group;	
    body.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
	body.drag(onmove, onstart, onend);		
	devices.push(device);
});


$('.bulb').click(function(){
	var device=dl.createBulb();	
	var color = Raphael.getColor();	
	var group=[];
	var b={x:20,y:150,w:60,h:50,r:50};
	var p={w:20,h:10,r:0};
	var pos={x:-p.w,y:2*b.h/5,pinType:'in'};
	var pin = r.rect(b.x+pos.x, b.y+pos.y, p.w, p.h, p.r);
		pin.attr({fill: 'black', stroke: 'black', "fill-opacity": 0, "stroke-width": 2});
		pin.mouseup(mouseuponpin);		
		pin.device=device;	
		pin.pinType=pos.pinType;
		group.push({node:pin,p:pos});
	var body=r.rect(b.x, b.y, b.w, b.h, b.r);	
	body.group=group;	
    body.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
	body.drag(onmove, onstart, onend);		
	device.ui = body;	
	devices.push(device);
});




$('.switch').click(function(){	
	var device=dl.createSwitch();	
	var color = Raphael.getColor();	
	var group=[];
	var b={x:20,y:10,w:60,h:50,r:10};
	var p={w:20,h:10,r:0};
	var pos={x:b.w,y:2*b.h/5,pinType:'out'};
	var pin = r.rect(b.x+pos.x, b.y+pos.y, p.w, p.h, p.r);
		pin.attr({fill: 'black', stroke: 'black', "fill-opacity": 0, "stroke-width": 2});
		pin.mouseup(mouseuponpin);		
		pin.device=device;	
		pin.pinType=pos.pinType;
		group.push({node:pin,p:pos});
	//var body=r.rect(b.x, b.y, b.w, b.h, b.r);	
	
	var body=r.image("img/SWITCH_0.png", b.x, b.y, b.w, b.h);	
	
	body.group=group;	
    body.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
	body.drag(onmove, onstart, onend);		
	
	body.node.onclick = function(){		
		device.toggle().state?body.attr({'src': 'img/SWITCH_1.png'}):body.attr({'src': 'img/SWITCH_0.png'});
	};	
	devices.push(device);
});








//$('.switch,.bulb').click();

var simref;
var runSimulation = function(){	
	$.each(devices,function(i,device){
		device.update();
		$.each(device.output||[],function(j,wire){			
			wire.state = device.state;
		});
		if(device.ui){
			device.state?device.ui.attr({'fill-opacity':1}):device.ui.attr({'fill-opacity':0});
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
