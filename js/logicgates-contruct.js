(function(){

	var r = Raphael("holder", '100%', '100%');
	var connections=[];
	var tempwire={};
	var components=[];
	var wires=[];
	var modes={CONSTRUCTMODE:'constructmode', WIREMODE:'wiremode',SIMMODE:'simmode'};
	var mode=modes.CONSTRUCTMODE;
	var simref,simspeed=50;

	
	var deleteAt = function(list, index){
		if(index>-1){
			list.splice(index,1);
		}	
	};
	
	var deleteItem = function(list, item){
		deleteAt(list,list.indexOf(item));		
	};
	
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
		var wirenode = wireConnection.line.node;
		wirenode.setAttribute('class','wire');
		$(wirenode).data({remove:function(){
			stopSim();$('.stop').hide();$('.run').show();			
			deleteWire(w);					
			executeCode(getCode());
		}});
		
	};
	
	var deleteWire = function(wire){
		var from = wire.ui.from;var to = wire.ui.to;					
		delete from.component.pins[from.pinId];//wire links
		delete to.component.pins[to.pinId];//wire links								
		wire.ui.line.remove();//wire ui
		deleteItem(connections,wire.ui);//wire connection	
		deleteItem(wires,wire);//delete wire core	
	};

	
	var getPin = function(index){
		return this.ui.group[index||0].node;
	};
	
	var pp={
		inputPin:function(b,p){
			return [{x:-p.w,y:2*b.h/5,pinType:'in',pinId:0}];
		},
		outputPin:function(b,p){
			return [{x:b.w,y:2*b.h/5,pinType:'out',pinId:0}];	
		},		
		pins2x1:function(b,p){
			return [
				{x:-p.w,y:b.h/5,pinType:'in',pinId:0},
				{x:-p.w,y:3*b.h/5,pinType:'in',pinId:1},
				{x:b.w,y:2*b.h/5,pinType:'out',pinId:2}
			];	
		},
		pins1x1:function(b,p){
			return [
				{x:-p.w,y:2*b.h/5,pinType:'in',pinId:0},
				{x:b.w,y:2*b.h/5,pinType:'out',pinId:1}
			];
		},		
		pin2x2x1:function(b,p){
			return [
				{x:-p.w,y:0.1*b.h/5,pinType:'in',pinId:0},
				{x:-p.w,y:3.9*b.h/5,pinType:'in',pinId:1},
				{x:b.w,y:0.1*b.h/5,pinType:'out',pinId:2},
				{x:b.w,y:3.9*b.h/5,pinType:'out',pinId:3},
				{x:-p.w,y:2*b.h/5,pinType:'clk',pinId:4}
			];
		},	
		pin10x3x1:function(b,p){
			return [
				{x:-p.w+b.w*0.1,y:-p.h,pinType:'out',pinId:0},
				{x:-p.w+b.w*0.2,y:-p.h,pinType:'out',pinId:1},
				{x:-p.w+b.w*0.3,y:-p.h,pinType:'out',pinId:2},
				{x:-p.w+b.w*0.4,y:-p.h,pinType:'out',pinId:3},
				{x:-p.w+b.w*0.5,y:-p.h,pinType:'out',pinId:4},
				{x:-p.w+b.w*0.6,y:-p.h,pinType:'out',pinId:5},
				{x:-p.w+b.w*0.7,y:-p.h,pinType:'out',pinId:6},
				{x:-p.w+b.w*0.8,y:-p.h,pinType:'out',pinId:7},
				{x:-p.w+b.w*0.9,y:-p.h,pinType:'out',pinId:8},
				{x:-p.w+b.w*1.0,y:-p.h,pinType:'out',pinId:9},
				{x:-p.w,y:b.h/2-p.h/2,pinType:'in',pinId:10},//clk
				{x:-p.w+b.w*0.1,y:b.h,pinType:'out',pinId:11},//enable
				{x:-p.w+b.w*0.3,y:b.h,pinType:'out',pinId:12},//reset
				{x:-p.w+b.w*0.6,y:b.h,pinType:'out',pinId:13}//carryout				
			];	
		},
		pin7x7x1:function(b,p){
			return [
				{x:-p.w,y:b.h/2-p.h/2,pinType:'in',pinId:0},//clk
				{x:-p.w+b.w*1/7,y:-p.h,pinType:'out',pinId:1},
				{x:-p.w+b.w*2/7,y:-p.h,pinType:'out',pinId:2},
				{x:-p.w+b.w*3/7,y:-p.h,pinType:'out',pinId:3},
				{x:-p.w+b.w*4/7,y:-p.h,pinType:'out',pinId:4},
				{x:-p.w+b.w*5/7,y:-p.h,pinType:'out',pinId:5},
				{x:-p.w+b.w*6/7,y:-p.h,pinType:'out',pinId:6},
				{x:-p.w+b.w*7/7,y:-p.h,pinType:'out',pinId:7},				
				{x:-p.w+b.w*1/7,y:b.h,pinType:'out',pinId:8},
				{x:-p.w+b.w*2/7,y:b.h,pinType:'out',pinId:9},
				{x:-p.w+b.w*3/7,y:b.h,pinType:'out',pinId:10},
				{x:-p.w+b.w*4/7,y:b.h,pinType:'out',pinId:11},
				{x:-p.w+b.w*5/7,y:b.h,pinType:'out',pinId:12},
				{x:-p.w+b.w*6/7,y:b.h,pinType:'out',pinId:13},
				{x:-p.w+b.w*7/7,y:b.h,pinType:'out',pinId:14},
				
			];	
		}
	};	
	
	var getPinConfig = function(gateType){	
		
		var b={x:0,y:0,w:60,h:60,r:5};
		var p={w:20,h:10,r:0};	
		var ffp={w:10,h:10,r:0};
		var icb={x:0,y:0,w:120,h:60,r:5};
		var config={
			'BULB':{pins:pp.inputPin,p:p,b:b},
			'SWITCH':{pins:pp.outputPin,p:p,b:b},
			'PULSER':{pins:pp.outputPin,p:p,b:b},
			'AND':{pins:pp.pins2x1,p:p,b:b},
			'OR':{pins:pp.pins2x1,p:p,b:b},
			'NAND':{pins:pp.pins2x1,p:p,b:b},
			'NOR':{pins:pp.pins2x1,p:p,b:b},
			'NOT':{pins:pp.pins1x1,p:p,b:b},
			'RSFF':{pins:pp.pin2x2x1,p:ffp,b:b},
			'JKFF':{pins:pp.pin2x2x1,p:ffp,b:b},
			'DFF':{pins:pp.pin2x2x1,p:ffp,b:b},
			'TFF':{pins:pp.pin2x2x1,p:ffp,b:b},
			'4017':{pins:pp.pin10x3x1,p:ffp,b:icb},
			'4543':{pins:pp.pin7x7x1,p:ffp,b:icb},
			'4520':{pins:pp.pin7x7x1,p:ffp,b:icb}
		};
		
		var c = config[gateType];	c.pins = c.pins(c.b,c.p);
		return c;		
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
			pin.attr({fill: 'black', stroke: 'black', "fill-opacity": 0, "stroke-width": 1, cursor: 'crosshair' });		
			pin.mouseup(mouseuponpin);		
			pin.component=component;	
			pin.pinType=pos.pinType;
			pin.pinId = pos.pinId;
		});	
		var body=r.image("img/"+name+".png", b.x, b.y, b.w, b.h);		
		body.group=group;	
		body.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
		body.drag(moveTo, onstart, onend);	onstart.call(body);		
		body.node.setAttribute('class','component');
		body.node.onclick = function(){		
			component.click();
		};
		$(body.node).data({remove:function(){
			stopSim();$('.stop').hide();$('.run').show();			
			$.each(component.pins,function(i, pin){
				$.each(pin,function(j,wire){
					deleteWire(wire);				
				});
			});			
			deleteItem(components,component);//delete component core;			
			$.each(group,function(i,pin){//delete component ui pins
				pin.node.remove();
			});			
			body.remove();//delete component ui pins body	
			executeCode(getCode());
		}});
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
		simspeed=100-speed;
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

	
	/*re arranging components, so that components with same name, doest not adjacent 
	*/
	var reOrderComponents = function(){
		for(var i=0;i<components.length-1;i++){
			var c1 = components[i],c2,k=i+1;
			for(var j=i+1;j<components.length;j++){
				c2 = components[j];
				if(c1.name !== c2.name){k=j;break;}
			}			
			swap(components,i+1,k);	
		}
	};

	
	var swap = function(list, i, j){
		var temp = list[i];list[i]=list[j];list[j]=temp;
	};	
	
	
	var startSim = function(){				
		runSimulation();
	};
	
	var stopSim = function(){
		clearTimeout(simref);
	};

	window.dl={
		modes:modes,		
		setMode:setMode,
		setSimSpeed:setSimSpeed,
		startSim:startSim,
		stopSim:stopSim,
		setPosition:setPosition,
		createComponent:createComponent,
		createWire:createWire,		
		getCode:getCode,
		wires:wires,
		components:components,
		clean:clean,
		executeCode:executeCode,
		reOrderComponents:reOrderComponents
	};

}());
