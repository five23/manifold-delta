/**
* Manifold
* 
* @version Delta
* @author David Scott Kirby (david@ecomatics.net)
* 
* {@link http://github.com/five23}
*/

var π = Math.PI,
	τ = Math.PI * 2.0;

(function(window) {
"use strict";
	var userContext, userInstance, Manifold = function(context) {
		if (!context) {
			context = window.webkitAudioContext && (new window.webkitAudioContext());
		}
		userContext = context;
		userInstance = this;
	},
	version = "Delta",
	Super = Object.create(null, {
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
					if (this.defaults.hasOwnProperty(key)) {
						result[key] = this.defaults[key].value;
					}
				}
				return result;
			}
		}
	});
	
	
	/**
 	* Create Oscillator node
 	* 
 	* @param {Object} properties
 	* @returns {Object}
 	*/
	Manifold.prototype.createOscillator = function(properties) {
		return new userInstance.Oscillator(properties);
	};
	
	
	/**
 	* Oscillator
 	* 
 	* @param {Object} properties
 	* @param {Number} properties.gain
 	* @param {Number} properties.frequency
 	* @param {Number} properties.phase
 	* @param {Number} properties.modIndex
 	*/
	Manifold.prototype.Oscillator = function(properties) {
		
		if (!properties) {
			properties = this.getDefaults();
		}
		
		this.jsNode = userContext.createScriptProcessor(this.bufferSize, 1, 1);
		this.output = userContext.createGainNode();
		this.modOutput = userContext.createGainNode();
		this.modInput  = userContext.createGainNode();
		this.modIndex = properties.modIndex || this.defaults.modIndex.value;	
		this.phase = properties.phase || this.defaults.phase.value;
		this.gain  = properties.gain || this.defaults.gain.value;
		this.frequency = properties.frequency || this.defaults.frequency.value;
		this.activate(true);
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
					value : 0.0,
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
				modIndex : {
					value : 0.0,
					min : 0.0,
					max : 1.0
				}
			}
		},
		gain : {
			get : function() {
				return this._gain;
			},
			set : function(value) {
				this._gain = value;
				this.output.gain.value = this._gain;
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
		modIndex : {
			get : function() {
				return this._modIndex;
			},
			set : function(value) {
				this._modIndex = value;
				this.modInput.gain.value = this._modIndex;
			}
		},
		activate : {
			value : function(doActivate) {
				if (doActivate) {
					this.modInput.connect(this.jsNode);					
					this.jsNode.connect(this.output);
					this.jsNode.connect(this.modOutput);
					this.jsNode.onaudioprocess = this.returnCompute(this);
				} else {
					this.modInput.disconnect();
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
			}
		},
		compute : {
			value : function(event) {
				var that = this;
				var outBuffer = event.outputBuffer.getChannelData(0);
				var modBuffer = event.inputBuffer.getChannelData(0);
				for (var i = 0; i < outBuffer.length; ++i) {
					outBuffer[i] = Math.sin(that.phase + π*modBuffer[i]);
				}
			}
		}
	});

	
	/**
 	* Clamp a value to an interval
 	*
 	* @param {Number} value The value to clamp
 	* @param {Number} min The lower clamp threshold
 	* @param {Number} max The upper clamp threshold
 	* @returns {Number} The clamped value
 	*/
	function clamp(value, min, max) {
		return value < min ? min : value > max ? max : value;
	};


	/**
 	* Normalizes a value from a given range (min, max) into a value between -1.0 and 1.0
 	*
 	* @param {Number} value The value to normalize
 	* @param {Number} min The minimum value of the normalization
 	* @param {Number} max The maximum value of the normalization
 	* @returns {Number} The normalized value
 	*/
	function normalize(value, min, max) {
		return clamp((value - min) / (max - min), -1.0, 1.0);
	};

	
	/**
 	* Re-maps a value from one range to another
 	*
 	* @param {Number} value The value to re-map
 	* @param {Number} min The minimum input value
 	* @param {Number} max The maximum input value
 	* @param {Number} vmin The minimum output value
 	* @param {Number} vmax The maximum output value
 	* @param {Boolean} clamp Results if True
 	* @returns {Number} The re-mapped value
 	*/
	function map(value, min, max, vmin, vmax, clamp) {
		if (Math.abs(min - max) < 1e-15) {
			return vmin;
		}
		else {
			var _value = ((value - min) / (max - min) * (vmax - vmin) + vmin);
			if (clamp) {
				if (vmax < vmin) {
					if 		(_value < vmax) { _value = vmax; }				
					else if (_value > vmin) { _value = vmin; }
				}
				else {
					if 		(_value > vmax) { _value = vmax; }
					else if (_value < vmin) { _value = vmin; }
				}
			}
			return _value;
		}
	};
			
    Manifold.toString = Manifold.prototype.toString = function () {
        return "Manifold " + version;
    };
    
	if (typeof define === "function") {
		define("Manifold", [], function() {
			return Manifold;
		});
	} else {
		window.Manifold = Manifold;
	}

})(this);