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
	
		
	var RSFF = function(){
		Component.call(this);
		this.update = function(){
			var q1 = this.pins[2];//output node
			var q2 = this.pins[3];//output node
			//clk input is true if not connected
			var clk = this.pins[4]?this.pins[4][0].state:true;
			var s = this.pins[0][0].state;
			var r = this.pins[1][0].state;
			var q = this.state;//current state
			if(clk){q=s||(q&&!r);}//Q(next) = S+QR'		
			this.state=q;//updated state				
			util.updateAllWiresAtOutput(q1, q);		
			util.updateAllWiresAtOutput(q2, !q);		
			return this;
		};	
	};
	util.inherit(RSFF, Component);
	
	var JKFF = function(){
		Component.call(this);
		this.update = function(){
			var q1 = this.pins[2];//output node
			var q2 = this.pins[3];//output node
			//clk input is true if not connected
			var clk = this.pins[4]?this.pins[4][0].state:true;
			var j = this.pins[0][0].state;
			var k = this.pins[1][0].state;
			var q = this.state;//current state
			if(clk){q=(j&&!q)||(!k&&q);}//Q(next) = JQ' + K'Q	
			this.state=q;//updated state				
			util.updateAllWiresAtOutput(q1, q);		
			util.updateAllWiresAtOutput(q2, !q);
			return this;
		};	
	};
	util.inherit(JKFF, Component);
	
	var DFF = function(){
		Component.call(this);
		this.update = function(){
			var q1 = this.pins[2];//output node
			var q2 = this.pins[3];//output node
			//clk input is true if not connected
			var clk = this.pins[4]?this.pins[4][0].state:true;			
			var d = this.pins[0][0].state;
			//var r = this.pins[1][0].state;
			var q = this.state;//current state
			if(this.clk && !clk){q=d;}//Q(next) = D	on falling edge		
			this.state=q;//updated state
			this.clk =clk;//updating clock
			util.updateAllWiresAtOutput(q1, q);		
			util.updateAllWiresAtOutput(q2, !q);	
			return this;
		};	
	};
	util.inherit(DFF, Component);
	
	
	var TFF = function(){
		Component.call(this);
		this.update = function(){
			var q1 = this.pins[2];//output node
			var q2 = this.pins[3];//output node
			//clk input is true if not connected
			var clk = this.pins[4]?this.pins[4][0].state:true;
			var t = this.pins[0][0].state;
			//var r = this.pins[1][0].state;
			var q = this.state;//current state
			if(clk){q=(t&&!q)||(!t&&q);}//Q(next) = TQ' + T'Q
			this.state=q;//updated state				
			util.updateAllWiresAtOutput(q1, q);		
			util.updateAllWiresAtOutput(q2, !q);	
			return this;
		};	
	};
	util.inherit(TFF, Component);
	
	
	var gateMap = {
		'AND':function(){return new AND()},
		'OR':function(){return new OR()},
		'NOT':function(){return new NOT()},
		'NAND':function(){return new NAND()},
		'NOR':function(){return new NOR()},
		'RSFF':function(){return new RSFF()},
		'JKFF':function(){return new JKFF()},
		'DFF':function(){return new DFF()},
		'TFF':function(){return new TFF()}
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



