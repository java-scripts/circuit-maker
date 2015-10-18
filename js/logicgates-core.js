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
	
	var NAND = function(){
		GATE.call(this);
		this.update = function(){
			this.state = this.inputs[0].state;
			for(var i=1;i<this.inputs.length;i++){
				this.state=this.state&&this.inputs[i].state;
			}
			this.state = !this.state;//NOT
			return this;
		};	
	};
	inherit(NAND, GATE);
	
	
	var NOR = function(){
		GATE.call(this);
		this.update = function(){
			this.state = this.inputs[0].state;
			for(var i=1;i<this.inputs.length;i++){
				this.state=this.state||this.inputs[i].state;
			}
			this.state = !this.state;//NOT
			return this;
		};
	};	
	inherit(NOR, GATE);	
	
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



