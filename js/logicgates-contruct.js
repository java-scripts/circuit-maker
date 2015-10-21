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
		var w = dlcore.createComponent('WIRE');
		w.ui = wireConnection;
		//connecting 			
		$.each([pin1,pin2],function(i,node){
			node.component.link(w, node.pinId);			
		});	
		wires.push(w);
	};

	
	var getPin = function(index){
		return this.ui.group[index||0].node;
	};
	
	
	var getPinConfig = function(gateType){	
		var b={x:0,y:0,w:60,h:60,r:5};
		var p={w:20,h:10,r:0};		
		
		var inputPin =[{x:-p.w,y:2*b.h/5,pinType:'in',pinId:0}];
		var outputPin = [{x:b.w,y:2*b.h/5,pinType:'out',pinId:0}];			
		var pins2x1 =  [
			{x:-p.w,y:b.h/5,pinType:'in',pinId:0},
			{x:-p.w,y:3*b.h/5,pinType:'in',pinId:1},
			{x:b.w,y:2*b.h/5,pinType:'out',pinId:2}
			];			
		var pins1x1 = [
				{x:-p.w,y:2*b.h/5,pinType:'in',pinId:0},
				{x:b.w,y:2*b.h/5,pinType:'out',pinId:1}
			];			
		var pin2x2x1 = [
			{x:-p.w,y:0.1*b.h/5,pinType:'in',pinId:0},
			{x:-p.w,y:3.9*b.h/5,pinType:'in',pinId:1},
			{x:b.w,y:0.1*b.h/5,pinType:'out',pinId:2},
			{x:b.w,y:3.9*b.h/5,pinType:'out',pinId:3},
			{x:-p.w,y:2*b.h/5,pinType:'clk',pinId:4}
		];		
		var pin10x3x1 = [
			//{x:-p.w,y:0,pinType:'out',pinId:0}		
		];		
		var config={
			'BULB':{pins:inputPin,p:p,b:b},
			'SWITCH':{pins:outputPin,p:p,b:b},
			'PULSER':{pins:outputPin,p:p,b:b},
			'AND':{pins:pins2x1,p:p,b:b},
			'OR':{pins:pins2x1,p:p,b:b},
			'NAND':{pins:pins2x1,p:p,b:b},
			'NOR':{pins:pins2x1,p:p,b:b},
			'NOT':{pins:pins1x1,p:p,b:b},
			'RSFF':{pins:pin2x2x1,p:p,b:b},
			'JKFF':{pins:pin2x2x1,p:p,b:b},
			'DFF':{pins:pin2x2x1,p:p,b:b},
			'TFF':{pins:pin2x2x1,p:p,b:b},
			'4017':{pins:pin10x3x1,p:{w:10,h:20,r:0},b:{x:0,y:0,w:120,h:60,r:5}}
		};		
		return config[gateType];		
	};
	
	
	var constructComponent = function(type, name){
		var component = dlcore.createComponent(type,name);
		var color = Raphael.getColor();			
		var pinConfig =getPinConfig(name);		
		var p=pinConfig.p;
		var b=pinConfig.b;
		var group=[];		
		$.each(pinConfig.pins,function(i,pos){
			var pin = r.rect(b.x+pos.x, b.y+pos.y, p.w, p.h, p.r);
			group.push({node:pin,p:pos});
			pin.attr({fill: 'black', stroke: 'black', "fill-opacity": 0, "stroke-width": 2, cursor: 'crosshair' });		
			pin.mouseup(mouseuponpin);		
			pin.component=component;	
			pin.pinType=pos.pinType;
			pin.pinId = pos.pinId;
		});	
		var body=r.image("img/"+name+".png", b.x, b.y, b.w, b.h);		
		body.group=group;	
		body.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
		body.drag(moveTo, onstart, onend);	onstart.call(body);		
		body.node.onclick = function(){		
			component.click();
		};				
		component.afterUpdate=function(){				
			component.state?body.attr({'src': 'img/'+name+'_1.png'}):body.attr({'src': 'img/'+name+'.png'});
		};		
		component.ui = body;	
		component.getPin = getPin;
		components.push(component);
		return component;
	};	
	
	var createComponent =function(options){
		var s=$.extend({type:'BULB', x:0, y:0}, options);		
		var component = constructComponent(s.type,s.name);
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
			var fromPin = w.ui.from.pinId;
			var to = components.indexOf(w.ui.to.component);	
			var toPin = w.ui.to.pinId;
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
			//if component has a ui, update its ui
			if(component.ui){
				component.state?component.ui.attr({'fill-opacity':1}):component.ui.attr({'fill-opacity':0});
			}
		});
		
		//update wire ui
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
