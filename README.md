manifold-theta
==============

Phase Modulation using the Web Audio API.

Demo : http://five23.github.com/manifold-theta/


		context = new webkitAudioContext();

		manifold = new Manifold(context);

		osc1Node = new manifold.Oscillator();
		osc2Node = new manifold.Oscillator();
		osc3Node = new manifold.Oscillator();
		osc4Node = new manifold.Oscillator();

		osc1Node.pmNode.connect(osc2Node.pmInput);
		osc2Node.pmNode.connect(osc3Node.pmInput);
		osc3Node.pmNode.connect(osc4Node.pmInput);
		osc4Node.pmNode.connect(osc1Node.pmInput);
