(function(){

	var r = Raphael("holder", 1200, 600);
	var connections=[];
	var tempwire={};
	var components=[];
	var wires=[];
	var modes={CONSTRUCTMODE:'constructmode', WIREMODE:'wiremode',SIMMODE:'simmode'};
	var mode=modes.CONSTRUCTMODE;
	var simref,simspeed=100;

	var onstart = function () {
		this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
		this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
		//this.animate({"fill-opacity": .2}, 500);
	};
	
	
	
	var moveTo = function (dx, dy) {		
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
		if(mode == modes.WIREMODE){
			if(!tempwire.node1){
				tempwire.node1=this;		
			}else{
				tempwire.node2=this;		
				createWire(tempwire.node1,tempwire.node2);				
				tempwire={};//reset tempwire;					
			}		
		}
	}
	
	var createWire = function(pin1, pin2){
		var wireConnection = r.connection(pin1, pin2, "#00f");
		connections.push(wireConnection);				
		var w = dlcore.getWire();
		w.ui = wireConnection;
		//connecting 			
		$.each([pin1,pin2],function(i,node){			
			if(node.pinType=='out'){
				node.component.output.push(w);
			}else{
				node.component.inputs.push(w);
			}
		});	
		wires.push(w);
	};

	
	var getPin = function(index){
		return this.ui.group[index||0].node;
	};
	
	
	var createGate = function(gatetype){	
		var component = dlcore.getGate(gatetype);	
		var color = Raphael.getColor();	
		var b={x:0,y:0,w:60,h:50,r:5};
		var p={w:20,h:10,r:0};		
		var pinpositions =[
			{x:-p.w,y:b.h/5,pinType:'in'},
			{x:-p.w,y:3*b.h/5,pinType:'in'},
			{x:b.w,y:2*b.h/5,pinType:'out'}
			];
		if(gatetype=='NOT'){
			pinpositions =[
				{x:-p.w,y:2*b.h/5,pinType:'in'},
				{x:b.w,y:2*b.h/5,pinType:'out'}
			];
		}		
		var group=[];
		$.each(pinpositions,function(i,pos){
			var pin = r.rect(b.x+pos.x, b.y+pos.y, p.w, p.h, p.r);
			group.push({node:pin,p:pos});
			pin.attr({fill: 'black', stroke: 'black', "fill-opacity": 0, "stroke-width": 2, cursor: 'crosshair' });		
			pin.mouseup(mouseuponpin);		
			pin.component=component;	
			pin.pinType=pos.pinType;
			pin.pinIndex = i;
		});	
		var body=r.image("img/"+gatetype+".png", b.x, b.y, b.w, b.h);
		body.group=group;	
		body.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
		body.drag(moveTo, onstart, onend);	onstart.call(body);
		component.ui = body;	
		component.getPin = getPin;
		components.push(component);
		return component;
	};


	var createBulb =function(){
		var component=dlcore.getBulb();	
		var color = Raphael.getColor();	
		var group=[];
		var b={x:0,y:0,w:60,h:50,r:50};
		var p={w:20,h:10,r:0};
		var pos={x:-p.w,y:2*b.h/5,pinType:'in'};
		var pin = r.rect(b.x+pos.x, b.y+pos.y, p.w, p.h, p.r);
			pin.attr({fill: 'black', stroke: 'black', "fill-opacity": 0, "stroke-width": 2, cursor: 'crosshair' });
			pin.mouseup(mouseuponpin);		
			pin.component=component;	
			pin.pinType=pos.pinType;pin.pinIndex = 0;
			group.push({node:pin,p:pos});
		var body=r.rect(b.x, b.y, b.w, b.h, b.r);	
		body.group=group;	
		body.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
		body.drag(moveTo, onstart, onend);	onstart.call(body);
		component.ui = body;	
		component.getPin = getPin;
		components.push(component);
		return component;
	};

	var createSwitch = function(){
		var component=dlcore.getSwitch();	
		var color = Raphael.getColor();	
		var group=[];
		var b={x:0,y:0,w:60,h:50,r:10};
		var p={w:20,h:10,r:0};
		var pos={x:b.w,y:2*b.h/5,pinType:'out'};
		var pin = r.rect(b.x+pos.x, b.y+pos.y, p.w, p.h, p.r);
			pin.attr({fill: 'black', stroke: 'black', "fill-opacity": 0, "stroke-width": 2, cursor: 'crosshair' });
			pin.mouseup(mouseuponpin);		
			pin.component=component;	
			pin.pinType=pos.pinType;pin.pinIndex = 0;
			group.push({node:pin,p:pos});
		//var body=r.rect(b.x, b.y, b.w, b.h, b.r);	
		
		var body=r.image("img/SWITCH_0.png", b.x, b.y, b.w, b.h);	
		
		body.group=group;	
		body.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
		body.drag(moveTo, onstart, onend); onstart.call(body);	
		
		body.node.onclick = function(){		
			component.toggle().state?body.attr({'src': 'img/SWITCH_1.png'}):body.attr({'src': 'img/SWITCH_0.png'});
		};
		component.ui = body;	
		component.getPin = getPin;
		components.push(component);
		return component;
	};

	var componentMap ={
		GATE:createGate,
		BULB:createBulb,
		SWITCH:createSwitch
	};	
	
	var createComponent =function(options){
		var s=$.extend({type:'BULB', x:0, y:0}, options);		
		var component = componentMap[s.type](s.name);
		component.ui.settings = s;	moveTo.call(component.ui,s.x,s.y);		
		return component;
	};
	
	var code = function(uicomponent){
		$.extend(uicomponent.settings,getPosition(uicomponent));
		return ['dl.createComponent(',JSON.stringify(uicomponent.settings),');'].join('');		
	};
	
	
	
	var getCode = function(){
		var str='';
		$.each(components,function(i,c){
			str+=code(c.ui);
		});		
		$.each(wires,function(i,w){
			var from = components.indexOf(w.ui.from.component);	
			var fromPin = w.ui.from.pinIndex;
			var to = components.indexOf(w.ui.to.component);	
			var toPin = w.ui.to.pinIndex;
			str+='dl.createWire(dl.components['+from+'].getPin('+fromPin+'),dl.components['+to+'].getPin('+toPin+'));';
		});		
		return str;
	};
	
	
	var clean = function(){		
		r.clear();
		connections=[];tempwire={};;
		wires=[];dl.wires=wires;
		components=[];dl.components=components;
	};
	
	
	var executeCode = function(code){
		clean();eval(code);		
	};
	
	
	var getPosition = function(rObj){
		return {x:rObj.node.getAttribute('x')*1,y:rObj.node.getAttribute('y')*1};
	};	
	
	var setPosition = function(rObj, dx, dy){
		moveTo.call(rObj,dx,dy);	
	};

	var setMode = function(m){	
		mode = m;
	};

	var setSimSpeed = function(speed){
		simspeed=speed;
	};

	var runSimulation = function(){	
		//console.log('running.....');
		$.each(components,function(i,component){
			component.update();
			$.each(component.output||[],function(j,wire){			
				wire.state = component.state;
			});
			if(component.ui){
				component.state?component.ui.attr({'fill-opacity':1}):component.ui.attr({'fill-opacity':0});
			}
		});
		$.each(wires,function(i,w){
			w.state?w.ui.line.attr({stroke: 'red'}):w.ui.line.attr({stroke: 'blue'});
		});
		simref = setTimeout(runSimulation,simspeed);
	};

	var stopSim = function(){
		clearTimeout(simref);
	};

	window.dl={
		modes:modes,		
		setMode:setMode,
		setSimSpeed:setSimSpeed,
		startSim:runSimulation,
		stopSim:stopSim,
		setPosition:setPosition,
		createComponent:createComponent,
		createWire:createWire,		
		getCode:getCode,
		wires:wires,
		components:components,
		clean:clean,
		executeCode:executeCode
	};

}());