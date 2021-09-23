# manifold-delta

Phase modulation using the Web Audio API.

While frequency modulation (ie, FM synthesis) is straight-forward using the Web Audio API, 
I found phase modulation to be far less intuitive, so this project is my attempt at creating a simple
modular environment so I can tinker with phase distortion synthesis, feedback, and all that good stuff.

    context = new webkitAudioContext();
    
    manifold = new Manifold(context);

    osc1Node = manifold.createOscillator();
    osc2Node = manifold.createOscillator();
    osc3Node = manifold.createOscillator();
    osc4Node = manifold.createOscillator();
    
    osc1Node.modOutput.connect(osc2Node.modInput); // osc1=>osc2
    osc2Node.modOutput.connect(osc3Node.modInput); // osc2=>osc3
    osc3Node.modOutput.connect(osc4Node.modInput); // osc3=>osc4


Demo : https://five23.github.io/manifold-delta/

The demo uses the awesome XGUI interface library.

Node/Object structure inspired and informed by Tuna.js.

*** TODO: need to update this to work w/ modern browsers ***
