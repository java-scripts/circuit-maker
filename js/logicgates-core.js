(function(){

	var util={
		opdateOutputWires:function(output, state){		
			for(var i in output){
				output[i].state = state;
			}
		},
		inherit:function(child, parent){
			child.prototype = Object.create(parent.prototype);
			child.prototype.constructor = child;
		},
		noop:function(){
		},
	};	
	
	// core objects....................................
	var WIRE = function(){		
		this.state=false;		
	};

	var Component = function(name){
		this.name=name;
		this.pins={};//each input holds array of wires		
		this.state=false;
		this.link = function(wire, pinId){			
			if(!this.pins[pinId]){this.pins[pinId]=[]};
			this.pins[pinId].push(wire);			
		};
		this.click = function(){};
	};	
	
	//extended objects ...............................
	
	
	var SWITCH = function(){
		Component.call(this,'SWITCH');
		this.click=function(){
			this.state=!this.state;return this;
		}
		this.update = function(){
			util.opdateOutputWires(this.pins[0], this.state);
			(this.afterUpdate||util.noop)();//should be overriden for ui
		};
	};
	util.inherit(SWITCH, Component);
	
	
	var PULSER = function(period){
		Component.call(this,'PULSER');		
		this.period = 5;		
		var counter = 0;		
		this.update = function(){	
			counter++;					
			if(counter >= this.period){				
				counter=0;
				this.state=!this.state;				
			}	
			util.opdateOutputWires(this.pins[0], this.state);
			(this.afterUpdate||util.noop)();//should be overriden for ui
		};	
	}
	util.inherit(PULSER, Component);
	
	
	var BULB = function(){
		Component.call(this,'BULB');
		this.update = function(){
			this.state = this.pins[0][0].state;
			(this.afterUpdate||util.noop)();//should be overriden for ui
		};
	};
	util.inherit(BULB, Component);	
	
	var GATE = function(name){
		Component.call(this,name);
		this.update = updateMethods[name];
	}
	util.inherit(GATE, Component);	
	
	
	var updateMethods={
		'OR':function(){			
			this.state=this.pins[0][0].state||this.pins[1][0].state;					
			util.opdateOutputWires(this.pins[2], this.state);		
			return this;
		},
		'AND':function(){
			this.state=this.pins[0][0].state&&this.pins[1][0].state;					
			util.opdateOutputWires(this.pins[2], this.state);			
			return this;
		},
		'NAND':function(){
			this.state=!(this.pins[0][0].state&&this.pins[1][0].state);					
			util.opdateOutputWires(this.pins[2], this.state);		
			return this;
		},
		'NOR':function(){
			this.state=!(this.pins[0][0].state||this.pins[1][0].state);					
			util.opdateOutputWires(this.pins[2], this.state);		
			return this;
		},
		'NOT':function(){
			this.state = !this.pins[0][0].state;				
			util.opdateOutputWires(this.pins[1], this.state);		
			return this;
		},
		'RSFF':function(){
			var q1 = this.pins[2];//output node
			var q2 = this.pins[3];//output node
			//clk input is true if not connected
			var clk = this.pins[4]?this.pins[4][0].state:true;
			var s = this.pins[0][0].state;
			var r = this.pins[1][0].state;
			var q = this.state;//current state
			if(clk){q=s||(q&&!r);}//Q(next) = S+QR'		
			this.state=q;//updated state				
			util.opdateOutputWires(q1, q);		
			util.opdateOutputWires(q2, !q);		
			return this;
		},
		'JKFF':function(){
			var q1 = this.pins[2];//output node
			var q2 = this.pins[3];//output node
			//clk input is true if not connected
			var clk = this.pins[4]?this.pins[4][0].state:true;
			var j = this.pins[0][0].state;
			var k = this.pins[1][0].state;
			var q = this.state;//current state
			if(clk){q=(j&&!q)||(!k&&q);}//Q(next) = JQ' + K'Q	
			this.state=q;//updated state				
			util.opdateOutputWires(q1, q);		
			util.opdateOutputWires(q2, !q);
			return this;
		},
		'DFF':function(){////Q(next) = D
			var q1 = this.pins[2];//output node
			var q2 = this.pins[3];//output node
			//clk input is true if not connected
			var clk = this.pins[4]?this.pins[4][0].state:true;			
			var d = this.pins[0][0].state;
			//var r = this.pins[1][0].state;
			var q = this.state;//current state
			if(!this.clk && clk){//raising edge
				this.metaState = d;
			}else if(this.clk && !clk){//falling edge
				q=this.metaState;		
			}
			this.state=q;//updated state
			this.clk =clk;//updating clock
			util.opdateOutputWires(q1, q);		
			util.opdateOutputWires(q2, !q);	
			return this;
		},
		'TFF':function(){//Q(next) = TQ' + T'Q
			var q1 = this.pins[2];//output node
			var q2 = this.pins[3];//output node
			//clk input is true if not connected
			var clk = this.pins[4]?this.pins[4][0].state:true;
			var t = this.pins[0][0].state;
			//var r = this.pins[1][0].state;
			var q = this.state;//current state
			if(!this.clk && clk){//raising edge
				this.metaState = (t&&!q) || (!t&&q);
			}else if(this.clk && !clk){//falling edge
				q=this.metaState;		
			}				
			this.state=q;//updated state
			this.clk =clk;//updating clock			
			util.opdateOutputWires(q1, q);		
			util.opdateOutputWires(q2, !q);	
			return this;
		},
		'4017':function(){
		
		
		}		
	};		
	var componentRegister={
		'WIRE':WIRE,
		'SWITCH':SWITCH,
		'PULSER':PULSER,
		'BULB':BULB,
		'PULSER':PULSER,
		'GATE':GATE
		
	};	
	window.dlcore = {
		createComponent:function(type, name){
			return new componentRegister[type](name);
		}		
	};	
}());
