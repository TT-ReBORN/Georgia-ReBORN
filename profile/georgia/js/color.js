var Color = (function() {

	var Events = {
		RGB_UPDATED: 'RGBUpdated',
		HSL_UPDATED: 'HSLUpdated',
		HSV_UPDATED: 'HSVUpdated',
		HEX_UPDATED: 'HexUpdated',
		INT_UPDATED: 'IntUpdated',
		UPDATED: 'updated',
		PARSED: 'parsed'
	};

	// helpers
	var absround = function(number) {
		return (0.5 + number) << 0;
	};

	var padZeroes = function(num) {
		return ('   ' + num).substr(-3,3);
	};

	var hue2rgb = function(a, b, c) {  // http://www.w3.org/TR/css3-color/#hsl-color
		if(c < 0) c += 1;
		if(c > 1) c -= 1;
		if(c < 1/6) return a + (b - a) * 6 * c;
		if(c < 1/2) return b;
		if(c < 2/3) return a + (b - a) * (2/3 - c) * 6;
		return a;
	};

	var p2v = function(p) {
		return isPercent.test(p) ? absround(parseInt(p) * 2.55): parseInt(p);
	};

	// patterns
	var isHex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;
	var isHSL = /^hsla?\((\d{1,3}?),\s*(\d{1,3}%),\s*(\d{1,3}%)(,\s*[01]?\.?\d*)?\)$/;
	var isRGB = /^rgba?\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)(,\s*[01]?\.?\d*)?\)$/;
	var isPercent = /^\d+(\.\d+)*%$/;

	var hexBit = /([0-9a-f])/gi;
	var leadHex = /^#/;

	var matchHSL = /^hsla?\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%(,\s*([01]?\.?\d*))?\)$/;
	var matchRGB = /^rgba?\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)(,\s*([01]?\.?\d*))?\)$/;

	/**
	* Color instance - get, update and output a Color between structures.
	* @constructor
	* @param {*} value Accepts any valid CSS color value e.g., #FF9900, rgb(255, 153, 0), rgba(100%, 40%, 0%, 0.8);
	* a hash with properties mapped to the Color instance e.g., red, green, saturation, brightness;
	* another Color instance; a numeric color value; a named CSS color
	* @class Instances of the Color class serve as abstract reprentations of the color itself, and don't need to be
	* transformed from one format to another.  A single Color instance can have any component (red, green, blue, hue, saturation, lightness, brightness,
	* alpha) updated regardless of the source.  Further, all other components will be normalized automatically.  If a Color is instanced using a hex value,
	* it can have it's lightness component updated directly despite lightness being a HSL component.  Further, the same color instance can output it's
	* component values in any format without any extra conversions.  Conversion methods (getRGB, getHex) are provided just as helpers, and don't perform any
	* actual transformations.  They are not required for use or translation.  The standard component parts are available as instance methods - passing a value
	* argument to set, and each return the value as well (with or without setter arguments).  These components perform transformations and dispatch events, and
	* can be used without any sugar to manage the Color instance.
	* Component methods include:
	* .red()
	* .green()
	* .blue()
	* .hue()
	* .saturation()
	* .lightness()
	* .brightness()
	* .hex()
	* .decimal()
	* </ul>
	* @example
	* // instancing...
	* new Color();
	* new Color('#FF9900');
	* new Color(element.style.color);
	* new Color('pink');
	* new Color(123456);
	* new Color({ red: 255, green: 100, blue: 0 });
	* new Color(colorInstance);
	* // usage...
	* var color = new Color('#FF9900');
	* color.brightness(20);
	* element.style.backgroundColor = color;
	* console.log(color.getRGB());
	* console.log(color.saturation());
	*/
	function Color(value) {

		this._listeners = {};

		this.subscribe(Events.RGB_UPDATED, this._RGBUpdated);
		this.subscribe(Events.HEX_UPDATED, this._HEXUpdated);
		this.subscribe(Events.HSL_UPDATED, this._HSLUpdated);
		this.subscribe(Events.HSV_UPDATED, this._HSVUpdated);
		this.subscribe(Events.INT_UPDATED, this._INTUpdated);

		this.parse(value);

	};

	Color.prototype = {
		_decimal: 0,		// 0 - 16777215
		_hex: '#000000',	// #000000 - #FFFFFF
		_red: 0,			// 0 - 255
		_green: 0,			// 0 - 255
		_blue: 0,			// 0 - 255
		_hue: 0,			// 0 - 360
		_saturation: 0,		// 0 - 100
		_lightness: 0,		// 0 - 100
		_brightness: 0,		// 0 - 100
		_alpha: 255,		// 0 - 255
		get r() {
			return this._red;
		},
		get g() {
			return this._green;
		},
		get b() {
			return this._blue;
		},
		get a() {
			return this._alpha;
        },
        get hue() {
            return this._hue;
        },
        get saturation() {
            return this._saturation;
        },
        get lightness() {
            return this._lightness;
        },
		get brightness() {
			return Math.round(Math.sqrt( 0.299*this.r*this.r + 0.587*this.g*this.g + 0.114*this.b*this.b ));
		},
		/**
		 * If all 3 RGB values are identical, returns true
		 * @returns boolean
		 */
		get isGreyscale() {
			return this._red === this._green && this._red === this._blue;
		},
		get val() {
			return this._decimal | (this._alpha << 24);
        },
        get rawVal() {
            return this._decimal;
		},
		/**
		 * Checks if a color value is almost greyscale. Finds the average of the RGB values, and then compares
		 * each color to see if it is more than +/- 6 away from the average. If not, returns true;
		 * @returns boolean
		 * @example
		 * var color = new Color(100,102,104);
		 * color.isCloseToGreyscale() => true
		 *
		 * var color2 = new Color(100,100,120);
		 * color.isCloseToGreyscale() => false
		 */
		get isCloseToGreyscale() {
			var threshold = 6;
            const avg = Math.round((this._red + this._green + this._blue) / 3);
            if (this.isGreyscale ||
                (Math.abs(this._red - avg) < threshold &&
                 Math.abs(this._green - avg) < threshold &&
                 Math.abs(this._blue - avg) < threshold))
				return true;
			else
				return false;
		},

		/**
		* Set the hue component value of the color, updates all other components, and dispatches Event.UPDATED
		* @param {number} value 0 - 360 hue component value to set
		* @returns Number
		* @example
		* var color = new Color();
		* color.hue = 280;
		*/
		set hue(value) {
			this._handle('_hue', value, Events.HSL_UPDATED);
		},
		/**
		* Set the saturation component value of the color, updates all other components, and dispatches Event.UPDATED
		* @param {number} value 0 - 100 saturation component value to set
		* @returns Number
		* @example
		* var color = new Color();
		* color.saturation = 280;
		*/
		set saturation(value) {
			this._handle('_saturation', value, Events.HSL_UPDATED);
		},
		/**
		* Set the lightness component value of the color, updates all other components, and dispatches Event.UPDATED
		* @param {number} value 0 - 100 lightness component value to set
		* @returns Number
		* @example
		* var color = new Color();
		* color.lightness = 80;
		*/
		set lightness(value) {
			this._handle('_lightness', value, Events.HSL_UPDATED);
		},
	};


	/**
	* Convert mixed variable to Color component properties, and adopt those properties.
	* @function
	* @param {*} value Accepts any valid CSS color value e.g., #FF9900, rgb(255, 153, 0), rgba(100%, 40%, 0%, 0.8);
	* a hash with properties mapped to the Color instance e.g., red, green, saturation, brightness;
	* another Color instance; a numeric color value; a named CSS color
	* @returns this
	* @example
	* var color = new Color();
	* color.parse();
	* color.parse('#FF9900');
	* color.parse(element.style.color);
	* color.parse(123456);
	* color.parse({ red: 255, green: 100, blue: 0 });
	* color.parse(colorInstance);
	*/
	Color.prototype.parse = function(value) {
		if (typeof value == 'undefined') {
			return this;
		};
		switch (true) {
			case isFinite(value):
				var a = ((value & 0xff000000) >> 24) & 0xff;
				this._alpha = a ? a : 255;
				this.decimal(value & 0xffffff);
				this.output = Color.INT;
				this.broadcast(Events.PARSED);
				return this;
			case (value instanceof Color):
				this.copy(value);
				this.broadcast(Events.PARSED);
				return this;
			default:
				switch(typeof value) {
					case 'object':
						this.set(value);
						this.broadcast(Events.PARSED);
						return this;
					case 'string':
						switch (true) {
							case isHex.test(value):
								var stripped = value.replace(leadHex, '');
								if(stripped.length == 3) {
									stripped = stripped.replace(hexBit, '$1$1');
								};
								this.decimal(parseInt(stripped, 16));
								this.broadcast(Events.PARSED);
								return this;
							case isRGB.test(value):
								var parts = value.match(matchRGB);
								this.red(p2v(parts[1]));
								this.green(p2v(parts[2]));
								this.blue(p2v(parts[3]));
								var alpha = parseFloat(parts[5]);
								if (isNaN(alpha)) alpha = 1;
								this.alpha(alpha);
								this.output = (isPercent.test(parts[1]) ? 2: 1) + (parts[5] ? 2: 0);
								this.broadcast(Events.PARSED);
								return this;
							case isHSL.test(value):
								var parts = value.match(matchHSL);
								this.hue = parseInt(parts[1]);
								this.saturation = parseInt(parts[2]);
								this.lightness = parseInt(parts[3]);
								var alpha = parseFloat(parts[5]);
								if (isNaN(alpha)) alpha = 1;
								this.alpha(alpha);
								this.output = parts[5] ? 6: 5;
								this.broadcast(Events.PARSED);
								return this;
						};
				};

		};
		return this;
	};

	/**
	* Create a duplicate of this Color instance
	* @function
	* @returns Color
	*/
	Color.prototype.clone = function() {
		return new Color(this.decimal()).alpha(this.alpha());
	};

	/**
	* Copy values from another Color instance
	* @function
	* @param {Color} color Color instance to copy values from
	* @returns this
	*/
	Color.prototype.copy = function(color) {
		return this.set(color.decimal()).alpha(color.alpha());
	};

	/**
	* Set a color component value
	* @function
	* @param {string|object|number} key Name of the color component to defined, or a hash of key:value pairs, or a single numeric value
	* @param {?string|number} value - Value of the color component to be set
	* @returns this
	* @example
	* var color = new Color();
	* color.set('lightness', 100);
	* color.set({ red: 255, green: 100 });
	* color.set(123456);
	*/
	Color.prototype.set = function(key, value = undefined) {
		if(arguments.length == 1) {
			if(typeof key == 'object') {
				for(var p in key) {
					if(typeof this[p] == 'function') {
						this[p](key[p]);
					};
				};
			} else if(isFinite(key)) {
				this.decimal(key);
			}
		} else if(typeof this[key] == 'function') {
			this[key](value);
		};
		return this;
	};

	/**
	* sets the invoking Color instance component values to a point between the original value and the destination Color instance component value, multiplied by the factor
	* @function
	* @param {Color} destination Color instance to serve as the termination of the interpolation
	* @param {number} factor 0-1, where 0 is the origin Color and 1 is the destination Color, and 0.5 is halfway between.  This method will "blend" the colors.
	* @returns this
	* @example
	* var orange = new Color('#FF9900');
	* var white = new Color('#FFFFFF');
	* orange.interpolate(white, 0.5);
	*/
	Color.prototype.interpolate = function(destination, factor) {
		if(!(destination instanceof Color)) {
			destination = new Color(destination);
		};
		this._red = absround( +(this._red) + (destination._red - this._red) * factor );
		this._green = absround( +(this._green) + (destination._green - this._green) * factor );
		this._blue = absround( +(this._blue) + (destination._blue - this._blue) * factor );
		this._alpha = absround( +(this._alpha) + (destination._alpha - this._alpha) * factor );
		this.broadcast(Events.RGB_UPDATED);
		this.broadcast(Events.UPDATED);
		return this;
	};

	Color.prototype._RGB2HSL = function() {

		var r = this._red / 255;
		var g = this._green / 255;
		var b = this._blue / 255;

		var max = Math.max(r, g, b);
		var min = Math.min(r, g, b);
		var l = (max + min) / 2;
		var v = max;

		if(max == min) {
			this._hue = 0;
			this._saturation = 0;
			this._lightness = absround(l * 100);
			this._brightness = absround(v * 100);
			return;
		};

		var d = max - min;
		var s = d / ( ( l <= 0.5) ? (max + min): (2 - max - min) );
		var h = ((max == r)
			? (g - b) / d + (g < b ? 6: 0)
			: (max == g)
			 ? ((b - r) / d + 2)
			: ((r - g) / d + 4)) / 6;

		this._hue = absround(h * 360);
		this._saturation = absround(s * 100);
		this._lightness = absround(l * 100);
		this._brightness = absround(v * 100);
	};
	Color.prototype._HSL2RGB = function() {
		var h = this._hue / 360;
		var s = this._saturation / 100;
		var l = this._lightness / 100;
		var q = l < 0.5	? l * (1 + s): (l + s - l * s);
		var p = 2 * l - q;
		this._red = absround(hue2rgb(p, q, h + 1/3) * 255);
		this._green = absround(hue2rgb(p, q, h) * 255);
		this._blue = absround(hue2rgb(p, q, h - 1/3) * 255);
	};
	Color.prototype._HSV2RGB = function() {  // http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
		var h = this._hue / 360;
		var s = this._saturation / 100;
		var v = this._brightness / 100;
		var r = 0;
		var g = 0;
		var b = 0;
		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);
		switch(i % 6) {
			case 0:
				r = v, g = t, b = p;
				break;
			case 1:
				r = q, g = v, b = p;
				break;
			case 2:
				r = p, g = v, b = t;
				break;
			case 3:
				r = p, g = q, b = v;
				break;
			case 4:
				r = t, g = p, b = v
				break;
			case 5:
				r = v, g = p, b = q;
				break;
		}
		this._red = absround(r * 255);
		this._green = absround(g * 255);
		this._blue = absround(b * 255);
	};
	Color.prototype._INT2HEX = function() {
		var x = this._decimal.toString(16);
		x = '000000'.substr(0, 6 - x.length) + x;
		this._hex = '#' + x.toUpperCase();
	};
	Color.prototype._INT2RGB = function() {
		this._red = this._decimal >> 16;
		this._green = (this._decimal >> 8) & 0xFF;
		this._blue = this._decimal & 0xFF;
	};
	Color.prototype._HEX2INT = function() {
		this._decimal = parseInt(this._hex, 16);
	};
	Color.prototype._RGB2INT = function() {
		this._decimal = (this._red << 16 | (this._green << 8) & 0xffff | this._blue);
	};


	Color.prototype._RGBUpdated = function() {
		this._RGB2INT();  // populate INT values
		this._RGB2HSL();  // populate HSL values
		this._INT2HEX();  // populate HEX values
	};
	Color.prototype._HSLUpdated = function() {
		this._HSL2RGB();  // populate RGB values
		this._RGB2INT();  // populate INT values
		this._INT2HEX();  // populate HEX values
	};
	Color.prototype._HSVUpdated = function() {
		this._HSV2RGB();  // populate RGB values
		this._RGB2INT();  // populate INT values
		this._INT2HEX();  // populate HEX values
	};
	Color.prototype._HEXUpdated = function() {
		this._HEX2INT();  // populate INT values
		this._INT2RGB();  // populate RGB values
		this._RGB2HSL();  // populate HSL values
	};
	Color.prototype._INTUpdated = function() {
		this._INT2RGB();  // populate RGB values
		this._RGB2HSL();  // populate HSL values
		this._INT2HEX();  // populate HEX values
	};

	Color.prototype._broadcastUpdate = function() {
		this.broadcast(Events.UPDATED);
	};

	/**
	* Set the decimal value of the color, updates all other components, and dispatches Event.UPDATED
	* @function
	* @param {?number} value 0 (black) to 16777215 (white) - the decimal value to set
	* @returns Number
	* @example
	* var color = new Color();
	* color.decimal(123456);
	*/
	Color.prototype.decimal = function(value = undefined) {
		return this._handle('_decimal', value, Events.INT_UPDATED);
	};

	/**
	* Set the hex value of the color, updates all other components, and dispatches Event.UPDATED
	* @function
	* @param {string} value Hex value to be set
	* @returns String
	* @example
	* var color = new Color();
	* color.hex('#FF9900');
	* color.hex('#CCC');
	*/
	Color.prototype.hex = function(value) {
		return this._handle('_hex', value, Events.HEX_UPDATED);
	};

	/**
	* Set the red component value of the color, updates all other components, and dispatches Event.UPDATED
	* @function
	* @param {number} value 0 - 255 red component value to set
	* @returns Number
	* @example
	* var color = new Color();
	* color.red(125);
	*/
	Color.prototype.red = function(value) {
		return this._handle('_red', value, Events.RGB_UPDATED);
	};

	/**
	* Set the green component value of the color, updates all other components, and dispatches Event.UPDATED
	* @function
	* @param {number} value 0 - 255 green component value to set
	* @returns Number
	* @example
	* var color = new Color();
	* color.green(125);
	*/
	Color.prototype.green = function(value) {
		return this._handle('_green', value, Events.RGB_UPDATED);
	};
	/**
	* Set the blue component value of the color, updates all other components, and dispatches Event.UPDATED
	* @function
	* @param {number} value 0 - 255 blue component value to set
	* @returns Number
	* @example
	* var color = new Color();
	* color.blue(125);
	*/
	Color.prototype.blue = function(value) {
		return this._handle('_blue', value, Events.RGB_UPDATED);
	};

	/**
	* Set the brightness component value of the color, updates all other components, and dispatches Event.UPDATED
	* @function
	* @param {number} value 0 - 100 brightness component value to set
	* @returns Number
	* @example
	* var color = new Color();
	* color.brightness(80);
	*/
	// Color.prototype.brightness = function(value) {
	// 	return this._handle('_brightness', value, Events.HSV_UPDATED);
	// };

	/**
	* Set the opacity value of the color, updates all other components, and dispatches Event.UPDATED
	* @function
	* @param {?number} value 0 - 1 opacity component value to set
	* @returns Number
	* @example
	* var color = new Color();
	* color.alpha(0.5);
	*/
	Color.prototype.alpha = function(value = undefined) {
		return this._handle('_alpha', value);
	};


	Color.prototype._handle = function(prop, value, event) {
		if(typeof this[prop] != 'undefined') {
			if(typeof value != 'undefined') {
				if(value != this[prop]) {
					this[prop] = value;
					if(event) {
						this.broadcast(event);
					};
				};
				this.broadcast(Events.UPDATED);
			};
		};
		return this[prop];
	};

	/**
	* Returns a CSS-formatted hex string [e.g., #FF9900] from the Color's component values
	* @function
	* @returns String
	* @example
	* var color = new Color();
	* element.style.backgroundColor = color.getHex();
	*/
	Color.prototype.getHex = function() {
		return this._hex;
	};
	/**
	 * Returns a CSS-formatted RGB string [e.g., rgb(255, 153, 0)] from the Color's component values
	 * @param {?boolean} showPrefix should the return string start with "rgb"
	 * @param {?boolean} threeDigitColors should color values be left padded with zeroes? e.g. "004"
	 * @returns {String}
	 * @example
	 * var color = new Color();
	 * element.style.backgroundColor = color.getRGB();
	 */
	Color.prototype.getRGB = function(showPrefix = true, threeDigitColors = false) {
		var components = [];
		var prefix = '';
		if (typeof showPrefix === 'undefined' || showPrefix === true) {
			prefix = 'rgb';
			if (this._alpha < 255) {
				prefix += 'a';
			}
		}
		if (typeof threeDigitColors === 'undefined' || threeDigitColors === false) {
			components = [this._red, this._green, this._blue, this._alpha];
		} else {
			components = [padZeroes(this._red), padZeroes(this._green), padZeroes(this._blue), padZeroes(this._alpha)];
		}
		if (this._alpha === 255) {
			components.pop();
		}
		return prefix + '(' + components.join(', ') + ')';
	};
	/**
	* Returns a CSS-formatted HSL string [e.g., hsl(360, 100%, 100%)] from the Color's component values
	* @function
	* @returns String
	* @example
	* var color = new Color();
	* element.style.backgroundColor = color.getHSL();
	*/
	Color.prototype.getHSL = function() {
		var components = [absround(this._hue), absround(this._saturation) + '%', absround(this._lightness) + '%'];
		return 'hsl(' + components.join(', ') + ')';
	};
	/**
	* Returns a CSS-formatted HSLA string [e.g., hsl(360, 100%, 100%, 0.5)] from the Color's component values
	* @function
	* @returns String
	* @example
	* var color = new Color();
	* element.style.backgroundColor = color.getHSLA();
	*/
	Color.prototype.getHSLA = function() {
		var components = [absround(this._hue), absround(this._saturation) + '%', absround(this._lightness) + '%', this._alpha];
		return 'hsla(' + components.join(', ') + ')';
	};

	/**
	* Returns a tokenized string from the Color's component values
	* @function
	* @param {string} string The string to return, with tokens expressed as %token% that are replaced with component values.  Tokens are as follows:
	* r: red
	* g: green
	* b: blue
	* h: hue
	* s: saturation
	* l: lightness
	* v: brightness
	* a: alpha
	* x: hex
	* i: value
	* @returns String
	* @example
	* var color = new Color('#FF9900');
	* console.log(color.format('red=%r%, green=%g%, blue=%b%));
	*/
	Color.prototype.format = function(string) {
		var tokens = {
			r: this._red,
			g: this._green,
			b: this._blue,
			h: this._hue,
			s: this._saturation,
			l: this._lightness,
			v: this._brightness,
			a: this._alpha,
			x: this._hex,
			d: this._decimal
		};
		for(var token in tokens) {
			string = string.split('%' + token + '%').join(tokens[token]);
		};
		return string;
	};

	/**
	* Sets the format used by the native toString method
	* Color.HEX outputs #FF9900
	* Color.RGB outputs rgb(255, 153, 0)
	* Color.PRGB outputs rgb(100%, 50%, 0)
	* Color.RGBA outputs rgba(255, 153, 0, 0.5)
	* Color.PRGBA outputs rgba(100%, 50%, 0, 0.5)
	* Color.HSL outputs hsl(360, 100%, 80%)
	* Color.HSLA outputs hsla(360, 100%, 80%, 0.5)
	* @example
	* var color = new Color('#FF9900');
	* color.format = Color.RGB;
	* element.style.backgroundColor = color;
	* element.style.color = color;
	*/
	Color.prototype.output = 0;

	Color.HEX = 0;  // toString returns hex: #ABC123
	Color.RGB = 1;  // toString returns rgb: rgb(0, 100, 255)
	Color.HSL = 5;  // toString returns hsl: hsl(360, 50%, 50%)
	Color.HSLA = 6;  // toString returns hsla: hsla(360, 50%, 50%, 0.5)
	Color.INT = 7;  // toString returns decimal value

	Color.prototype.toString = function() {
		switch(this.output) {
			case 0:  // Color.HEX
				return this.getHex();
			case 1:  // Color.RGB
				return this.getRGB();
			case 5:  // Color.HSL
				return this.getHSL();
			case 6:  // Color.HSLA
				return this.getHSLA();
			case 7:  // Color.INT
				return this._decimal.toString();
		};
		return this.getHex();
	};

	/**
	* Returns the ideal foreground color (black or white) for text with the Color as background
	* @function
	* @returns Color
	* @example
	* var color = new Color();
	* element.style.backgroundColor = color.getRGB();
	* element.style.color = color.foreground().getRGB();
	*/
	Color.prototype.foreground = function() {
		if(this._lightness>50) return new Color("black");
		return new Color("white");
	};

	// Event Management
	Color.prototype._listeners = null;
	Color.prototype._isSubscribed = function(type) {
		return this._listeners[type] != null;
	};
	/**
	* @function
	* @param {string} type Event type to listen for
	* @param {function} callback listener to register to the event
	* @example
	* var color = new Color();
	* color.subscribe(Color.Event.UPDATED, function() {
	*   alert('this color has been updated');
	* });
	* color.red(255);
	*/
	Color.prototype.subscribe = function(type, callback) {
		if(!this._isSubscribed(type)) {
			this._listeners[type] = [];
		};
		this._listeners[type].push(callback);
	};

	/**
	* @function
	* @param {string} type Event type to remove the listener from
	* @param {function} callback listener to unregister from the event
	* @example
	* var color = new Color();
	* var handler = function() {
	*   console.log('this color has been updated');
	* });
	* color.subscribe(Color.Event.UPDATED, handler);
	* color.red(255);
	* color.unsubscribe(Color.Event.UPDATED, handler);
	* color.red(0);
	*/
	Color.prototype.unsubscribe = function(type, callback) {
		if(!this._isSubscribed(type)) {
			return;
		};
		var stack = this._listeners[type];
		for(var i = 0, l = stack.length; i < l; i++) {
			if(stack[i] === callback) {
				stack.splice(i, 1);
				return this.unsubscribe(type, callback);
			};
		};
	};

	/**
	* @function
	* @param {string} type Event type to dispatch
	* @param {array} params Array of arguments to pass to listener
	* @example
	* var color = new Color();
	* var handler = function(a, b) {
	*   console.log('a=' + a, 'b=' + b);
	* });
	* color.subscribe('arbitraryEvent', handler);
	* color.broadcast('arbitraryEvent', ['A', 'B']);
	*/
	Color.prototype.broadcast = function(type, params = null) {
		if(!this._isSubscribed(type)) {
			return;
		}
		var stack = this._listeners[type];
		var l = stack.length;
		for(let i = 0; i < l; i++) {
			stack[i].apply(this, params);
		}
	};

	/**
	* [static] Returns a Color instance of a random color
	* @function
	* @returns Color
	* @example
	* var gray = Color.interpolate('#FFFFFF', '#000000', 0.5);
	*/
	Color.random = function() {
		return new Color(absround(Math.random() * 16777215));
	};


	Color.Events = Events;

	// used for require.js
	// if (typeof define === 'function') {
	// 	define('Color', [], function() {
	// 		return Color;
	// 	});
	// };

	return Color;

})();
