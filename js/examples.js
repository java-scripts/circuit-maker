var examples={
	example1:function(){
		//basic flip flop
		console.log('executing example 1');
		dl.createComponent({"type":"GATE","x":354.15625,"y":142.5,"name":"OR"});
		dl.createComponent({"type":"GATE","x":353.15625,"y":236.5,"name":"OR"});
		dl.createComponent({"type":"GATE","x":484.15625,"y":140.5,"name":"NOT"});
		dl.createComponent({"type":"GATE","x":491.15625,"y":233.5,"name":"NOT"});
		dl.createComponent({"type":"BULB","x":647.15625,"y":95.5,"name":"BULB"});
		dl.createComponent({"type":"BULB","x":649.15625,"y":270.5,"name":"BULB"});
		dl.createComponent({"type":"SWITCH","x":164.15625,"y":98.5,"name":"SWITCH"});
		dl.createComponent({"type":"SWITCH","x":152.15625,"y":278.5,"name":"SWITCH"});
		dl.createWire(dl.components[7].getPin(0),dl.components[1].getPin(1));
		dl.createWire(dl.components[6].getPin(0),dl.components[0].getPin(0));
		dl.createWire(dl.components[0].getPin(1),dl.components[3].getPin(1));
		dl.createWire(dl.components[1].getPin(0),dl.components[2].getPin(1));
		dl.createWire(dl.components[0].getPin(2),dl.components[2].getPin(0));
		dl.createWire(dl.components[1].getPin(2),dl.components[3].getPin(0));
		dl.createWire(dl.components[2].getPin(1),dl.components[4].getPin(0));
		dl.createWire(dl.components[3].getPin(1),dl.components[5].getPin(0));
	},
	example2:function(){
		//flip flop with NOR
		console.log('executing example 2');
	},
	example3:function(){
		//flip flop with Nand
		console.log('executing example 3');
	}
	
};
