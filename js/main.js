(function(window) {

	var context, manifold, osc1Node, osc2Node, osc3Node, osc4Node, mainOutput, compressor, gui;
	
	function init() {

		if ( typeof AudioContext === "function") {
			context = new AudioContext();
		} else if ( typeof webkitAudioContext === "function") {
			context = new webkitAudioContext();
		} else {
			alert("Web Audio API not supported!");
		}

		manifold = new Manifold(context);

		osc1Node = new manifold.Oscillator();
		osc2Node = new manifold.Oscillator();
		osc3Node = new manifold.Oscillator();
		osc4Node = new manifold.Oscillator();

		osc1Node.pmNode.connect(osc2Node.pmInput);
		osc2Node.pmNode.connect(osc3Node.pmInput);
		osc3Node.pmNode.connect(osc4Node.pmInput);
		osc4Node.pmNode.connect(osc1Node.pmInput);

		compressor = context.createDynamicsCompressor();

		osc1Node.connect(compressor);
		osc2Node.connect(compressor);
		osc3Node.connect(compressor);
		osc4Node.connect(compressor);

		compressor.connect(context.destination);
	}


	function initGui() {
	
		gui = new xgui({
			width : 1280,
			height : 720
		});

		document.body.appendChild(gui.getDomElement());

		var osc1FreqLabel = new gui.Label({
			x : 135,
			y : 105,
			text : "OSC1"
		});
		var osc2FreqLabel = new gui.Label({
			x : 135,
			y : 190,
			text : "OSC2"
		});
		var osc3FreqLabel = new gui.Label({
			x : 135,
			y : 275,
			text : "OSC3"
		});
		var osc4FreqLabel = new gui.Label({
			x : 135,
			y : 360,
			text : "OSC4"
		});

		var osc1Freq = new gui.HSlider({
			x : 180,
			y : 80,
			value : 220,
			min : 0,
			max : 8000,
			width : 750,
			height : 65
		}).value.bind(osc1Node, "frequency");

		var osc2Freq = new gui.HSlider({
			x : 180,
			y : 165,
			value : 220,
			min : 0,
			max : 8000,
			width : 750,
			height : 65
		}).value.bind(osc2Node, "frequency");

		var osc3Freq = new gui.HSlider({
			x : 180,
			y : 250,
			value : 220,
			min : 0,
			max : 8000,
			width : 750,
			height : 65
		}).value.bind(osc3Node, "frequency");

		var osc4Freq = new gui.HSlider({
			x : 180,
			y : 335,
			value : 220,
			min : 0,
			max : 8000,
			width : 750,
			height : 65
		}).value.bind(osc4Node, "frequency");

		var osc1Gain = new gui.Knob({
			x : 60,
			y : 80,
			radius : 30,
			value : 0.25,
			min : 0,
			max : 0.5
		}).value.bind(osc1Node, "gain");

		var osc2Gain = new gui.Knob({
			x : 60,
			y : 165,
			radius : 30,
			value : 0.25,
			min : 0,
			max : 0.5
		}).value.bind(osc2Node, "gain");

		var osc3Gain = new gui.Knob({
			x : 60,
			y : 250,
			radius : 30,
			value : 0.25,
			min : 0,
			max : 0.5
		}).value.bind(osc3Node, "gain");

		var osc4Gain = new gui.Knob({
			x : 60,
			y : 335,
			radius : 30,
			value : 0.25,
			min : 0,
			max : 0.5
		}).value.bind(osc4Node, "gain");

		var osc1PmIndex = new gui.Knob({
			x : 960,
			y : 80,
			radius : 30,
			value : 0.0,
			min : 0,
			max : 1.0
		}).value.bind(osc1Node, "pmIndex");

		var osc2PmIndex = new gui.Knob({
			x : 960,
			y : 165,
			radius : 30,
			value : 0.0,
			min : 0,
			max : 1.0
		}).value.bind(osc2Node, "pmIndex");

		var osc3PmIndex = new gui.Knob({
			x : 960,
			y : 250,
			radius : 30,
			value : 0.0,
			min : 0,
			max : 1.0
		}).value.bind(osc3Node, "pmIndex");

		var osc4PmIndex = new gui.Knob({
			x : 960,
			y : 335,
			radius : 30,
			value : 0.0,
			min : 0,
			max : 1.0
		}).value.bind(osc4Node, "pmIndex");
	}

	init();
	initGui();

})(this);
