(function(window) {

	var userContext, userInstance, Manifold = function(context) {
		if (!context) {
			console.log("Missing audio context! Creating a new context for you.");
			context = window.webkitAudioContext && (new window.webkitAudioContext());
		}
		userContext = context;
		userInstance = this;
	}, 
	
	Super = Object.create(null, {
		activate : {
			writable : true,
			value : function(doActivate) {
				if (doActivate) {
					this.input.disconnect();
					this.input.connect(this.activateNode);
				} else {
					this.input.disconnect();
					this.input.connect(this.output);
				}
			}
		},
		bypass : {
			get : function() {
				return this._bypass;
			},
			set : function(value) {
				this._bypass = value;
				this.activate(!value);
			}
		},
		connect : {
			value : function(target) {
				this.output.connect(target);
			}
		},
		disconnect : {
			value : function(target) {
				this.output.disconnect(target);
			}
		},
		getDefaults : {
			value : function() {
				var result = {};
				for (var key in this.defaults) {
					result[key] = this.defaults[key].value;
				}
				return result;
			}
		}
	}), π = Math.PI, τ = 2.0 * π;

	Manifold.prototype.Oscillator = function(properties) {
		if (!properties) {
			properties = this.getDefaults();
		}
		this.jsNode = userContext.createScriptProcessor(this.bufferSize, 1, 1);
		this.output = userContext.createGainNode();
		this.phase = properties.phase || this.defaults.phase.value;
		this.gain = properties.gain || this.defaults.gain.value;
		this.pmInput = userContext.createGainNode();
		this.pmNode = userContext.createGainNode();
		this.pmIndex = properties.pmIndex || this.defaults.pmIndex.value;
		this.frequency = properties.frequency || this.defaults.frequency.value;
	    this.bypass = properties.bypass || false;
	};

	Manifold.prototype.Oscillator.prototype = Object.create(Super, {
		name : {
			value : "Oscillator"
		},
		bufferSize : {
			value : 1024
		},
		sampleRate : {
			value : 44100
		},
		defaults : {
			value : {
				gain : {
					value : 0.25,
					min : 0.0,
					max : 1.0
				},
				frequency : {
					value : 220.0,
					min : 0.0,
					max : 22050.0
				},
				phase : {
					value : 0.0,
					min : -τ,
					max : τ
				},
				pmIndex : {
					value : 0.0,
					min : 0.0,
					max : 1.0
				},
			},
		},
		gain : {
			get : function() {
				return this.output.gain;
			},
			set : function(value) {
				this.output.gain.value = value;
			}
		},
		frequency : {
			get : function() {
				return this._frequency;
			},
			set : function(value) {
				this._frequency = value;
				this._phaseInc = τ * this._frequency / this.sampleRate;
			}
		},
		phase : {
			get : function() {
				this._phase += this._phaseInc;
				return this._phase;
			},
			set : function(value) {
				this._phase = value;
			}
		},
		pmIndex : {
			get : function() {
				return this.pmInput.gain;
			},
			set : function(value) {
				this.pmInput.gain.value = value;
			}
		},
		activate : {
			value : function(doActivate) {
				this.activated = doActivate;
				if (doActivate) {
					this.pmInput.connect(this.jsNode);
					this.jsNode.connect(this.output);
					this.jsNode.connect(this.pmNode);
					this.jsNode.onaudioprocess = this.returnCompute(this);
				} else {
					this.jsNode.disconnect();
					this.jsNode.onaudioprocess = null;
				}
			}
		},
		returnCompute : {
			value : function(instance) {
				return function(event) {
					if (this._phase >= τ) {
						this._phase -= τ;
					}
					instance.compute(event);
				};
			},
		},
		compute : {
			value : function(event) {
				var that = this;				
				var outBuffer = event.outputBuffer.getChannelData(0);
				var pmBuffer  = event.inputBuffer.getChannelData(0);
				for (var i = 0; i < that.bufferSize; ++i) {
					outBuffer[i] = Math.sin(that.phase + π * pmBuffer[i]);
				}
			},
		},
	});

	if ( typeof define === "function") {
		define("Manifold", [], function() {
			return Manifold;
		});
	} else {
		window.Manifold = Manifold;
	}

})(this);