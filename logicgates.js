(function(){
	var WIRE = function(){		
		this.state=false;		
	};
	
	var SWITCH = function(){
		this.output=[];
		this.state=false;
		this.toggle=function(){
			this.state=!this.state;return this;
		}
		this.update = function(){};
	};
	
	var BULB = function(){
		this.inputs=[];//wire
		this.state=false;
		this.update = function(){
			this.state = this.inputs[0].state;
		};
	};
	
	var GATE = function(){		
		this.inputs=[];//1 wire per input
		this.output=[];//wires
		this.state=false;						
	};	
	var inherit = function(child, parent){
		child.prototype = Object.create(parent.prototype);
		child.prototype.constructor = child;
	};
		
	
	var OR = function(){
		GATE.call(this);
		this.update = function(){
			this.state = this.inputs[0].state;
			for(var i=1;i<this.inputs.length;i++){
				this.state=this.state||this.inputs[i].state;
			}				
			return this;
		};
	};	
	inherit(OR, GATE);
	
	
	var AND = function(){
		GATE.call(this);
		this.update = function(){
			this.state = this.inputs[0].state;
			for(var i=1;i<this.inputs.length;i++){
				this.state=this.state&&this.inputs[i].state;
			}			
			return this;
		};
	};		
	inherit(AND, GATE);
	
	
	var NOT = function(){
		GATE.call(this);
		this.update = function(){
			this.state = !this.inputs[0].state;				
			return this;
		};
	};
	inherit(NOT, GATE);
	
	
	var gateMap = {
		'AND':function(){return new AND()},
		'OR':function(){return new OR()},
		'NOT':function(){return new NOT()}
	};
	
	var createGate = function(name){
		return gateMap[name]();
	};	
	
	window.dl = {
		createGate:createGate,	
		createWire:function(){return new WIRE()},
		createSwitch:function(){return new SWITCH()},
		createBulb:function(){return new BULB()}
	};	
}());



