# manifold-delta

Phase modulation using the Web Audio API.

Demo : http://five23.github.com/manifold-delta/


    context = new webkitAudioContext();

    manifold = new Manifold(context);

    osc1Node = manifold.createOscillator();
    osc2Node = manifold.createOscillator();
    osc3Node = manifold.createOscillator();
    osc4Node = manifold.createOscillator();
    
    osc1Node.modOutput.connect(osc2Node.modInput);
    osc2Node.modOutput.connect(osc3Node.modInput);
    osc3Node.modOutput.connect(osc4Node.modInput);

The demo uses the awesome XGUI interface library.

Node/Object structure inspired and informed by Tuna.js.
