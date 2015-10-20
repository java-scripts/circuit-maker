(function(){

	var util={
		updateAllWiresAtOutput:function(output, state){		
			for(var i in output){
				output[i].state = state;
			}
		},
		inherit:function(child, parent){
			child.prototype = Object.create(parent.prototype);
			child.prototype.constructor = child;
		}
	};
	
	
	var WIRE = function(){		
		this.state=false;		
	};	
	
	var Component = function(){		
		this.pins={};//each input holds array of wires		
		this.state=false;
		this.link = function(wire, pinId){			
			if(!this.pins[pinId]){this.pins[pinId]=[]};
			this.pins[pinId].push(wire);			
		}
	};	
	
	var SWITCH = function(){
		Component.call(this);
		this.toggle=function(){
			this.state=!this.state;return this;
		}
		this.update = function(){
			util.updateAllWiresAtOutput(this.pins[0], this.state);			
		};
	};
	util.inherit(SWITCH, Component);
	
	var BULB = function(){
		Component.call(this);
		this.update = function(){
			this.state = this.pins[0][0].state;
		};
	};
	util.inherit(BULB, Component);	
	
	var OR = function(){
		Component.call(this);
		this.update = function(){			
			this.state=this.pins[0][0].state||this.pins[1][0].state;					
			util.updateAllWiresAtOutput(this.pins[2], this.state);		
			return this;
		};
	};	
	util.inherit(OR, Component);	
	
	var AND = function(){
		Component.call(this);
		this.update = function(){
			this.state=this.pins[0][0].state&&this.pins[1][0].state;					
			util.updateAllWiresAtOutput(this.pins[2], this.state);			
			return this;
		};
	};		
	util.inherit(AND, Component);
	
	var NAND = function(){
		Component.call(this);
		this.update = function(){
			this.state=!(this.pins[0][0].state&&this.pins[1][0].state);					
			util.updateAllWiresAtOutput(this.pins[2], this.state);		
			return this;
		};	
	};
	util.inherit(NAND, Component);
	
	
	var NOR = function(){
		Component.call(this);
		this.update = function(){
			this.state=!(this.pins[0][0].state||this.pins[1][0].state);					
			util.updateAllWiresAtOutput(this.pins[2], this.state);		
			return this;
		};
	};	
	util.inherit(NOR, Component);	
	
	var NOT = function(){
		Component.call(this);
		this.update = function(){
			this.state = !this.pins[0][0].state;				
			util.updateAllWiresAtOutput(this.pins[1], this.state);		
			return this;
		};
	};
	util.inherit(NOT, Component);
	
	
	var gateMap = {
		'AND':function(){return new AND()},
		'OR':function(){return new OR()},
		'NOT':function(){return new NOT()},
		'NAND':function(){return new NAND()},
		'NOR':function(){return new NOR()}
	};
	
	var getGate = function(name){
		return gateMap[name]();
	};	
	
	window.dlcore = {
		getGate:getGate,	
		getWire:function(){return new WIRE()},
		getSwitch:function(){return new SWITCH()},
		getBulb:function(){return new BULB()}
	};	
}());



