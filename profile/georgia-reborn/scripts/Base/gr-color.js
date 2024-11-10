/////////////////////////////////////////////////////////////////////////////////
// * Georgia-ReBORN: A Clean - Full Dynamic Color Reborn - Foobar2000 Player * //
// * Description:    Georgia-ReBORN Color Definition                         * //
// * Author:         TT                                                      * //
// * Org. Author:    Mordred                                                 * //
// * Website:        https://github.com/TT-ReBORN/Georgia-ReBORN             * //
// * Version:        3.0-RC3                                                 * //
// * Dev. started:   22-12-2017                                              * //
// * Last change:    10-11-2024                                              * //
/////////////////////////////////////////////////////////////////////////////////


'use strict';


//////////////////////////
// * COLOR DEFINITION * //
//////////////////////////
/**
 * A class that handles a color and provides methods for parsing and manipulating it.
 * The value of the color can be in various formats such as RGB, HEX, HSL, HSV, or INT.
 */
class Color {
	/**
	 * Creates the `Color` instance.
	 * The constructor parses the initial value and sets up the color object.
	 * @param {string|number} value - The initial color value in one of the supported formats:
	 * - RGB: A string like "rgb(255, 0, 0)" or "rgba(255, 0, 0, 1)"
	 * - HEX: A string like "#ff0000" or "ff0000"
	 * - HSL: A string like "hsl(0, 100%, 50%)" or "hsla(0, 100%, 50%, 1)"
	 * - HSV: A string like "hsv(0, 100%, 100%)"
	 * - INT: A number representing the color in integer format (0 - 16777215).
	 */
	constructor(value) {
		// * EVENTS * //
		// #region EVENTS
		/** @private @type {number} 0 - 16777215. */
		this._decimal = 0;
		/** @private @type {string} #000000 - #FFFFFF5. */
		this._hex = '#000000';
		/** @private @type {number} 0 - 255. */
		this._red = 0;
		/** @private @type {number} 0 - 255. */
		this._green = 0;
		/** @private @type {number} 0 - 255. */
		this._blue = 0;
		/** @private @type {number} 0 - 360. */
		this._hue = 0;
		/** @private @type {number} 0 - 100. */
		this._saturation = 0;
		/** @private @type {number} 0 - 100. */
		this._lightness = 0;
		/** @private @type {number} 0 - 100. */
		this._brightness = 0;
		/** @private @type {number} 0 - 255. */
		this._alpha = 255;
		/** @private @type {object} */
		this._listeners = {};
		// #endregion

		// * PATTERNS * //
		// #region PATTERNS
		/**
		 * Regular expression to test for a valid hex color.
		 * @type {RegExp}
		 * @private
		 */
		this.isHex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

		/**
		 * Regular expression to test for a valid HSL(A) color.
		 * @type {RegExp}
		 * @private
		 */
		this.isHSL = /^hsla?\((\d{1,3}?),\s*(\d{1,3}%),\s*(\d{1,3}%)(,\s*[01]?\.?\d*)?\)$/;

		/**
		 * Regular expression to test for a valid RGB(A) color.
		 * @type {RegExp}
		 * @private
		 */
		this.isRGB = /^rgba?\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)(,\s*[01]?\.?\d*)?\)$/;

		/**
		 * Regular expression to test for a value with a percentage.
		 * @type {RegExp}
		 * @private
		 */
		this.isPercent = /^\d+(\.\d+)*%$/;

		/**
		 * Regular expression to match individual hex digits.
		 * @type {RegExp}
		 * @private
		 */
		this.hexBit = /([0-9a-f])/gi;

		/**
		 * Regular expression to match the leading hash symbol in hex colors.
		 * @type {RegExp}
		 * @private
		 */
		this.leadHex = /^#/;

		/**
		 * Regular expression to test and capture groups in HSL(A) strings.
		 * @type {RegExp}
		 * @private
		 */
		this.matchHSL = /^hsla?\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%(,\s*([01]?\.?\d*))?\)$/;

		/**
		 * Regular expression to test and capture groups in RGB(A) strings.
		 * @type {RegExp}
		 * @private
		 */
		this.matchRGB = /^rgba?\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)(,\s*([01]?\.?\d*))?\)$/;
		// #endregion

		// * HELPERS * //
		// #region HELPERS
		/**
		 * Rounds a number to the nearest integer using the "round half up" method.
		 * @param {number} number - The number that will be round to the nearest whole number (integer) using the absolute value method.
		 * @returns {number} The number rounded to the nearest integer.
		 * @private
		 */
		this._absRound = (number) => (0.5 + number) << 0;

		/**
		 * Takes a number as input and returns a string representation of that number with leading zeroes added if necessary.
		 * @param {number} num - The number that we want to pad with zeroes.
		 * @returns {string} The number padded with leading zeroes, resulting in a string of at least 3 characters width.
		 * @private
		 */
		this._padZeroes = (num) => (`   ${num}`).slice(-3);

		/**
		 * Converts a percentage value to a value between 0 and 255.
		 * @param {number} p - The percentage number.
		 * @returns {number} The corresponding value between 0 and 255 if the input is a percentage, otherwise the parsed integer value of the input.
		 * @private
		 */
		this._perToVal = (p) => this.isPercent.test(p) ? this._absRound(parseInt(p) * 2.55) : parseInt(p);
		// #endregion

		// * INITIALIZATION * //
		// #region INITIALIZATION
		this.subscribe(Color.Events.RGB_UPDATED, this._RGBUpdated);
		this.subscribe(Color.Events.HEX_UPDATED, this._HEXUpdated);
		this.subscribe(Color.Events.HSL_UPDATED, this._HSLUpdated);
		this.subscribe(Color.Events.HSV_UPDATED, this._HSVUpdated);
		this.subscribe(Color.Events.INT_UPDATED, this._INTUpdated);
		this.parse(value); // Parse the initial value
		// #endregion
	}

	// * STATIC METHODS * //
	// #region STATIC METHODS
	/**
	 * A static property that provides an enumeration of event names used by the Color class.
	 * This allows for consistent naming of events throughout the application.
	 * @returns {object} An object containing event name constants.
	 * @static
	 * @example
	 * Assuming Color is a class that emits events and has an 'on' method for event listening.
	 * colorInstance.on(Color.Events.RGB_UPDATED, (newColor) => {
	 *   console.log('Color RGB value updated:', newColor);
	 * });
	 */
	static get Events() {
		return {
			RGB_UPDATED: 'RGBUpdated',
			HSL_UPDATED: 'HSLUpdated',
			HSV_UPDATED: 'HSVUpdated',
			HEX_UPDATED: 'HexUpdated',
			INT_UPDATED: 'IntUpdated',
			UPDATED: 'updated',
			PARSED: 'parsed'
		};
	}

	/**
	 * A static method that generates a random color instance.
	 * @returns {Color} A new Color instance with a random color value.
	 * @static
	 * @example
	 * const randomColor = Color.random(); // Creates a Color instance with a random RGB value.
	 */
	static random() {
		return new Color(this.AbsRound(Math.random() * 16777215));
	}
	// #endregion

	// * GETTERS & SETTERS * //
	// #region GETTERS & SETTERS
	/**
	 * Gets the red component value of the color.
	 * @returns {number} The red component value, between 0 and 255.
	 */
	get r() {
		return this._red;
	}

	/**
	 * Gets the green component value of the color.
	 * @returns {number} The green component value, between 0 and 255.
	 */
	get g() {
		return this._green;
	}

	/**
	 * Gets the blue component value of the color.
	 * @returns {number} The blue component value, between 0 and 255.
	 */
	get b() {
		return this._blue;
	}

	/**
	 * Gets the alpha component value of the color.
	 * @returns {number} The alpha component value, between 0 (completely transparent) and 1 (fully opaque).
	 */
	get a() {
		return this._alpha;
	}

	/**
	 * Gets the hue component value of the color.
	 * @returns {number} The hue component value, between 0 and 360 degrees.
	 */
	get hue() {
		return this._hue;
	}

	/**
	 * Gets the saturation component value of the color.
	 * @returns {number} The saturation component value, between 0 (desaturated) and 100 (fully saturated).
	 */
	get saturation() {
		return this._saturation;
	}

	/**
	 * Gets the lightness component value of the color.
	 * @returns {number} The lightness component value, between 0 (black) and 100 (white).
	 */
	get lightness() {
		return this._lightness;
	}

	/**
	 * Calculates and gets the brightness of the color.
	 * @returns {number} The brightness value, based on the perceived luminance of the color, rounded to the nearest integer.
	 */
	get brightness() {
		return Math.round(Math.sqrt(0.299 * this.r * this.r + 0.587 * this.g * this.g + 0.114 * this.b * this.b));
	}

	/**
	 * Checks if the color is grayscale (all RGB values are identical).
	 * @returns {boolean} `true` if the color is grayscale, otherwise `false`.
	 */
	get isGrayscale() {
		return this._red === this._green && this._red === this._blue;
	}

	/**
	 * Checks if a color is almost grayscale by determining if each RGB component is within a
	 * specific threshold from the average RGB value.
	 * @returns {boolean} `true` if the color is close to grayscale, otherwise `false`.
	 * @example
	 * Assuming Color is a class that takes three arguments: red, green, and blue.
	 * const color = new Color(100, 102, 104);
	 * console.log(color.isCloseToGrayscale); // => true
	 *
	 * const color2 = new Color(100, 100, 120);
	 * console.log(color2.isCloseToGrayscale); // => false
	 */
	get isCloseToGrayscale() {
		const threshold = 6;
		const avg = Math.round((this._red + this._green + this._blue) / 3);
		return this.isGrayscale ||
				(Math.abs(this._red - avg) < threshold &&
				Math.abs(this._green - avg) < threshold &&
				Math.abs(this._blue - avg) < threshold);
	}

	/**
	 * Gets the color represented as a decimal value, including the alpha component.
	 * The alpha component is shifted into the highest byte to form an ARGB value.
	 * @returns {number} The decimal ARGB value of the color.
	 */
	get val() {
		return this._decimal | (this._alpha << 24);
	}

	/**
	 * Gets the color represented as a raw decimal value without the alpha component.
	 * @returns {number} The decimal RGB value of the color.
	 */
	get rawVal() {
		return this._decimal;
	}

	/**
	 * Sets the hue component value of the color, updates all other components based on the new hue, and dispatches an event to notify about the update.
	 * @param {number} value - The hue component value to set, in the range of 0 to 360.
	 * @example
	 * const color = new Color();
	 * color.hue = 280; // sets the hue to 280 degrees
	 */
	set hue(value) {
		this._handle('_hue', value, Color.Events.HSL_UPDATED);
	}

	/**
	 * Sets the saturation component value of the color, updates all other components based on the new saturation, and dispatches an event to notify about the update.
	 * @param {number} value - The saturation component value to set, in the range of 0 to 100.
	 * @example
	 * const color = new Color();
	 * color.saturation = 50; // sets the saturation to 50%
	 */
	set saturation(value) {
		this._handle('_saturation', value, Color.Events.HSL_UPDATED);
	}

	/**
	 * Sets the lightness component value of the color, updates all other components based on the new lightness, and dispatches an event to notify about the update.
	 * @param {number} value - The lightness component value to set, in the range of 0 to 100.
	 * @example
	 * const color = new Color();
	 * color.lightness = 80; // sets the lightness to 80%
	 */
	set lightness(value) {
		this._handle('_lightness', value, Color.Events.HSL_UPDATED);
	}
	// #endregion

	// * PRIVATE METHODS * //
	// #region PRIVATE METHODS
	/**
	 * Converts RGB color values to HSL (Hue, Saturation, Lightness) and updates the instance properties.
	 *
	 * Assumes instance properties `_red`, `_green`, and `_blue` are defined and in the range of 0 to 255.
	 * The method calculates HSL values, rounds them using the `AbsRound` method, and then sets the following instance properties:
	 * - `_hue`: The hue of the color, ranging from 0 to 360 degrees.
	 * - `_saturation`: The saturation percentage, ranging from 0 to 100%.
	 * - `_lightness`: The lightness percentage, ranging from 0 to 100%.
	 * - `_brightness`: The brightness percentage, equivalent to lightness in this context, ranging from 0 to 100%.
	 *
	 * This method does not return a value.
	 *
	 * The conversion accounts for cases where the RGB values are equal (achromatic colors), in which case saturation is set to 0,
	 * and hue is set arbitrarily to 0 as it is undefined for achromatic colors.
	 * @property {number} _red - The internal red value used for conversion.
	 * @property {number} _green - The internal green value used for conversion.
	 * @property {number} _blue - The internal blue value used for conversion.
	 * @property {number} _hue - The internal property set to the calculated hue value.
	 * @property {number} _saturation - The internal property set to the calculated saturation value.
	 * @property {number} _lightness - The internal property set to the calculated lightness value.
	 * @property {number} _brightness - The internal property set to the calculated brightness value.
	 * @private
	 * @see _absRound
	 */
	_RGB2HSL() {
		const r = this._red / 255;
		const g = this._green / 255;
		const b = this._blue / 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const l = (max + min) / 2;
		const v = max;

		if (max === min) {
			this._hue = 0;
			this._saturation = 0;
			this._lightness = this._absRound(l * 100);
			this._brightness = this._absRound(v * 100);
			return;
		}

		const d = max - min;
		const s = d / ((l <= 0.5) ? (max + min) : (2 - max - min));
		const h = ((max === r)
			? (g - b) / d + (g < b ? 6 : 0)
			: (max === g)
			? ((b - r) / d + 2)
			: ((r - g) / d + 4)) / 6;

		this._hue = this._absRound(h * 360);
		this._saturation = this._absRound(s * 100);
		this._lightness = this._absRound(l * 100);
		this._brightness = this._absRound(v * 100);
	}

	/**
	 * Converts colors from the HSL (Hue, Saturation, Lightness) color model to the RGB (Red, Green, Blue) color model.
	 * This method calculates RGB values based on the instance's HSL values and sets the `_red`, `_green`, and `_blue` properties.
	 *
	 * Assumes instance properties `_hue`, `_saturation`, and `_lightness` are defined:
	 * - `_hue`: Range of 0 to 360 degrees
	 * - `_saturation` and `_lightness`: Percentage from 0 to 100.
	 *
	 * The RGB values are in the range of 0 to 255.
	 * No value is returned.
	 * @property {number} _hue - The internal hue value used for conversion.
	 * @property {number} _saturation - The internal saturation value used for conversion.
	 * @property {number} _lightness - The internal lightness value used for conversion.
	 * @property {number} _red - The internal property set after conversion to the red color component.
	 * @property {number} _green - The internal property set after conversion to the green color component.
	 * @property {number} _blue - The internal property set after conversion to the blue color component.
	 * @private
	 * @see _HUEtoRGB
	 * @see _absRound
	 */
	_HSL2RGB() {
		const h = this._hue / 360;
		const s = this._saturation / 100;
		const l = this._lightness / 100;
		const q = l < 0.5 ? l * (1 + s) : (l + s - l * s);
		const p = 2 * l - q;
		this._red = this._absRound(this._HUEtoRGB(p, q, h + 1 / 3) * 255);
		this._green = this._absRound(this._HUEtoRGB(p, q, h) * 255);
		this._blue = this._absRound(this._HUEtoRGB(p, q, h - 1 / 3) * 255);
	}

	/**
	 * Converts colors from the HSV (Hue, Saturation, Value/Brightness) color model to the RGB (Red, Green, Blue) color model.
	 * This method calculates RGB values based on the instance's HSV values and sets the `_red`, `_green`, and `_blue` properties.
	 *
	 * Assumes instance properties `_hue`, `_saturation`, and `_brightness` are defined:
	 * - `_hue`: Range of 0 to 360 degrees
	 * - `_saturation` and `_brightness`: Percentage from 0 to 100.
	 *
	 * The RGB values are in the range of 0 to 255.
	 * No value is returned.
	 *
	 * The conversion algorithm is sector-based, typical for HSV to RGB conversion.
	 * @property {number} _hue - Internal hue value used for conversion.
	 * @property {number} _saturation - Internal saturation value used for conversion.
	 * @property {number} _brightness - Internal brightness value used for conversion.
	 * @property {number} _red - Internal property set after conversion to the red color component.
	 * @property {number} _green - Internal property set after conversion to the green color component.
	 * @property {number} _blue - Internal property set after conversion to the blue color component.
	 * @private
	 * @see _absRound
	 * @see {@link http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript|Conversion algorithm}
	 */
	_HSV2RGB() {
		const h = this._hue / 360;
		const s = this._saturation / 100;
		const v = this._brightness / 100;
		let r = 0;
		let g = 0;
		let b = 0;
		const i = Math.floor(h * 6);
		const f = h * 6 - i;
		const p = v * (1 - s);
		const q = v * (1 - f * s);
		const t = v * (1 - (1 - f) * s);
		switch (i % 6) {
			case 0: r = v; g = t; b = p; break;
			case 1: r = q; g = v; b = p; break;
			case 2: r = p; g = v; b = t; break;
			case 3: r = p; g = q; b = v; break;
			case 4: r = t; g = p; b = v; break;
			case 5: r = v; g = p; b = q; break;
		}
		this._red = this._absRound(r * 255);
		this._green = this._absRound(g * 255);
		this._blue = this._absRound(b * 255);
	}

	/**
	 * Converts a hue value to its corresponding RGB value.
	 * Http://www.w3.org/TR/css3-color/#hsl-color.
	 * @param {number} a - The starting value of the color component (e.g., red, green, or blue) in the RGB color model.
	 * @param {number} b - The middle value in the range of colors. It is used to calculate the RGB value based on the given hue value.
	 * @param {number} c - The hue value in the HSL color model. It is a value between 0 and 1, where 0 represents red, 1/3 represents green, and 2/3 represents blue.
	 * @returns {number} The specific value that is returned depends on the value of `c` and follows a series of conditional statements.
	 * @private
	 */
	_HUEtoRGB(a, b, c) {
		if (c < 0) c++;
		if (c > 1) c--;
		if (c < 1 / 6) return a + (b - a) * 6 * c;
		if (c < 1 / 2) return b;
		if (c < 2 / 3) return a + (b - a) * (2 / 3 - c) * 6;
		return a;
	}

	/**
	 * Converts the internal integer (decimal) representation of the color, stored in `_decimal`, to a HEX string.
	 * Updates the `_hex` property with the resulting HEX string prefixed with '#'.
	 * Assumes `_decimal` is a valid integer representing a RGB color.
	 * @private
	 */
	_INT2HEX() {
		let x = this._decimal.toString(16);
		x = '000000'.substring(0, 6 - x.length) + x;
		this._hex = `#${x.toUpperCase()}`;
	}

	/**
	 * Converts the internal integer (decimal) representation of the color to individual RGB components.
	 * @private
	 */
	_INT2RGB() {
		this._red = this._decimal >> 16;
		this._green = (this._decimal >> 8) & 0xFF;
		this._blue = this._decimal & 0xFF;
	}

	/**
	 * Converts a hexadecimal number to an integer value.
	 * @private
	 */
	_HEX2INT() {
		this._decimal = parseInt(this._hex, 16);
	}

	/**
	 * Converts the individual RGB component values to a single integer value.
	 * @private
	 */
	_RGB2INT() {
		this._decimal = (this._red << 16 | (this._green << 8) & 0xffff | this._blue);
	}

	/**
	 * Handles updates when RGB values are changed. It updates the internal integer representation (`_decimal`),
	 * converts it to HSL values, and then to a HEX string.
	 * @private
	 */
	_RGBUpdated() {
		this._RGB2INT(); // populate INT values
		this._RGB2HSL(); // populate HSL values
		this._INT2HEX(); // populate HEX values
	}

	/**
	 * Handles updates when HSL values are changed. It updates the internal RGB values,
	 * integer, and HEX representations of the color.
	 * @private
	 */
	_HSLUpdated() {
		this._HSL2RGB(); // populate RGB values
		this._RGB2INT(); // populate INT values
		this._INT2HEX(); // populate HEX values
	}

	/**
	 * Handles updates when HSV values are changed. It updates the internal RGB values,
	 * integer, and HEX representations of the color.
	 * @private
	 */
	_HSVUpdated() {
		this._HSV2RGB(); // populate RGB values
		this._RGB2INT(); // populate INT values
		this._INT2HEX(); // populate HEX values
	}

	/**
	 * Handles updates when HEX values are changed. It updates the internal integer,
	 * RGB, and HSL representations of the color.
	 * @private
	 */
	_HEXUpdated() {
		this._HEX2INT(); // populate INT values
		this._INT2RGB(); // populate RGB values
		this._RGB2HSL(); // populate HSL values
	}

	/**
	 * Handles updates when internal integer (decimal) values are changed. It updates
	 * the RGB, HSL, and HEX representations of the color.
	 * @private
	 */
	_INTUpdated() {
		this._INT2RGB(); // populate RGB values
		this._RGB2HSL(); // populate HSL values
		this._INT2HEX(); // populate HEX values
	}

	/**
	 * Broadcasts an update event to all subscribers indicating that the color has been updated.
	 * @private
	 */
	_broadcastUpdate() {
		this.broadcast(Color.Events.UPDATED);
	}

	/**
	 * Handles the property update by setting the new value if it differs from the current one.
	 * Triggers a specific event broadcast if the event name is provided and the value has changed.
	 * Always broadcasts an 'updated' event regardless of the change in value.
	 * @param {string} prop - The name of the property to handle.
	 * @param {*} value - The new value to set for the property.
	 * @param {string} [event] - The name of the event to broadcast on change.
	 * @returns {*} The updated value of the property if it was changed, otherwise the original value.
	 * @private
	 */
	_handle(prop, value, event) {
		if (typeof this[prop] != 'undefined' && typeof value != 'undefined') {
			if (value !== this[prop]) {
				this[prop] = value;
				if (event) {
					this.broadcast(event);
				}
			}
			this.broadcast('updated');
		}
		return this[prop];
	}

	/**
	 * Checks if the object has subscribers for a given event type.
	 * @param {string} type - The event type to check for subscribers.
	 * @returns {boolean} True if there are subscribers for the event type, false otherwise.
	 * @private
	 */
	_isSubscribed(type) {
		return this._listeners[type] != null;
	}
	// #endregion

	// * PUBLIC METHODS * //
	// #region PUBLIC METHODS
	/**
	 * Returns a CSS-formatted hex string (e.g., "#FF9900") from the Color's component values.
	 * @returns {string} Hexadecimal color string representing the Color object's current state.
	 */
	getHex() {
		return this._hex;
	}

	/**
	 * Returns a CSS-formatted RGB or RGBA string from the Color's component values.
	 * @param {boolean} [showPrefix] - If true, includes 'rgb' or 'rgba' as prefix in the string.
	 * @param {boolean} [threeDigitColors] - If true, pads the color component values with zeroes to have three digits.
	 * @returns {string} The CSS-formatted RGB or RGBA color string.
	 * @example
	 * Assuming the color instance has _red=255, _green=153, _blue=0, _alpha=0.5
	 * color.getRGB(); // Returns 'rgba(255, 153, 0, 0.5)'
	 * color.getRGB(false); // Returns '(255, 153, 0, 0.5)'
	 * color.getRGB(true, true); // Returns 'rgba(255, 153, 000, 0.5)'
	 */
	getRGB(showPrefix = true, threeDigitColors = false) {
		let components = [];
		let prefix = '';
		if (showPrefix === true) {
			prefix = 'rgb';
			if (this._alpha < 255) {
				prefix += 'a';
			}
		}

		components = threeDigitColors === false ?
			[this._red, this._green, this._blue, this._alpha] :
			[this._padZeroes(this._red), this._padZeroes(this._green), this._padZeroes(this._blue), this._padZeroes(this._alpha)];

		if (this._alpha === 255) {
			components.pop();
		}

		return `${prefix}(${components.join(', ')})`;
	}

	/**
	 * Returns a CSS-formatted HSL string (e.g., "hsl(360, 100%, 100%)") from the Color's component values.
	 * @returns {string} The CSS-formatted HSL color string.
	 */
	getHSL() {
		const components = [
			Math.round(this._hue),
			`${Math.round(this._saturation)}%`,
			`${Math.round(this._lightness)}%`
		];

		return `hsl(${components.join(', ')})`;
	}

	/**
	 * Returns a CSS-formatted HSLA string (e.g., "hsla(360, 100%, 100%, 0.5)") from the Color's component values.
	 * @returns {string} The CSS-formatted HSLA color string.
	 */
	getHSLA() {
		const components = [
			Math.round(this._hue),
			`${Math.round(this._saturation)}%`,
			`${Math.round(this._lightness)}%`,
			this._alpha
		];

		return `hsla(${components.join(', ')})`;
	}

	/**
	 * Sets the hex value of the color, updates all other components, and dispatches Event.HEX_UPDATED.
	 * @param {string} value - The hex value to be set.
	 * @returns {Color} This Color instance for method chaining.
	 * @fires Color#event:HEX_UPDATED When the hex value is updated.
	 * @example
	 * const color = new Color();
	 * color.hex('#FF9900'); // Sets color to orange.
	 * color.hex('#CCC'); // Sets color to light gray.
	 */
	hex(value) {
		return this._handle('_hex', value, Color.Events.HEX_UPDATED);
	}

	/**
	 * Sets the red component value of the color, updates all other components, and dispatches Event.RGB_UPDATED.
	 * @param {number} value - The red component value to set (0 - 255).
	 * @returns {Color} This Color instance for method chaining.
	 * @fires Color#event:RGB_UPDATED When the red component is updated.
	 * @example
	 * const color = new Color();
	 * color.red(125); // Sets red component to 125.
	 */
	red(value) {
		return this._handle('_red', value, Color.Events.RGB_UPDATED);
	}

	/**
	 * Sets the green component value of the color, updates all other components, and dispatches Event.RGB_UPDATED.
	 * @param {number} value - The green component value to set (0 - 255).
	 * @returns {Color} This Color instance for method chaining.
	 * @fires Color#event:RGB_UPDATED When the green component is updated.
	 * @example
	 * const color = new Color();
	 * color.green(125); // Sets green component to 125.
	 */
	green(value) {
		return this._handle('_green', value, Color.Events.RGB_UPDATED);
	}

	/**
	 * Sets the blue component value of the color, updates all other components, and dispatches Event.RGB_UPDATED.
	 * @param {number} value - The blue component value to set (0 - 255).
	 * @returns {Color} This Color instance for method chaining.
	 * @fires Color#event:RGB_UPDATED When the blue component is updated.
	 * @example
	 * const color = new Color();
	 * color.blue(125); // Sets blue component to 125.
	 */
	blue(value) {
		return this._handle('_blue', value, Color.Events.RGB_UPDATED);
	}

	/**
	 * Sets the brightness component value of the color, updates all other components, and dispatches Event.HSV_UPDATED.
	 * @param {number} value - The brightness component value to set (0 - 100).
	 * @returns {Color} This Color instance for method chaining.
	 * @fires Color#event:HSV_UPDATED When the brightness component is updated.
	 * @example
	 * const color = new Color();
	 * color.setBrightness(80); // Sets brightness to 80%.
	 */
	setBrightness(value) {
		return this._handle('_brightness', value, Color.Events.HSV_UPDATED);
	}

	/**
	 * Sets the opacity value of the color, updates all other components, and dispatches Event.UPDATED.
	 * @param {number} [value] - The opacity component value to set (0 - 1). Defaults to 1 if not specified.
	 * @returns {Color} This Color instance for method chaining.
	 * @fires Color#event:UPDATED When the opacity is updated.
	 * @example
	 * const color = new Color();
	 * color.alpha(0.5); // Sets opacity to 50%.
	 */
	alpha(value = undefined) {
		return this._handle('_alpha', value);
	}

	/**
	 * Parses a mixed variable and adopts its properties into the current Color instance. The value can be any CSS color value, a hash of properties, another Color instance, a numeric value, or a named CSS color.
	 * @param {*} value - A CSS color string, object with color properties, another Color instance, or a numeric color value. If undefined, the method will return the current instance without parsing.
	 * @returns {Color} This Color instance for method chaining.
	 * @fires Color#event:PARSED When the color is successfully parsed. The PARSED event is emitted with the new color value.
	 * @example
	 * const color = new Color();
	 * color.parse('#FF9900'); // Parses a hex color string.
	 * color.parse('rgb(255, 153, 0)'); // Parses an RGB color string.
	 * color.parse(123456); // Parses a numeric color value.
	 * color.parse({ red: 255, green: 100, blue: 0 }); // Parses a color object.
	 * color.parse(anotherColorInstance); // Adopts the properties of another Color instance.
	 */
	parse(value) {
		if (typeof value == 'undefined') {
			return this;
		}

		if (isFinite(value)) {
			const a = ((value & 0xff000000) >> 24) & 0xff;
			this._alpha = a || 255;
			this.decimal(value & 0xffffff);
			this.output = Color.INT;
			this.broadcast(Color.Events.PARSED);
		}
		else if (value instanceof Color) {
			this.copy(value);
			this.broadcast(Color.Events.PARSED);
		}
		else if (typeof value === 'object') {
			this.set(value);
			this.broadcast(Color.Events.PARSED);
		}
		else if (typeof value === 'string') {
			if (this.isHex.test(value)) {
				let stripped = value.replace(this.leadHex, '');
				if (stripped.length === 3) {
					stripped = stripped.replace(this.hexBit, '$1$1');
				}
				this.decimal(parseInt(stripped, 16));
				this.broadcast(Color.Events.PARSED);
			}
			else if (this.isRGB.test(value)) {
				const partsRGB = value.match(this.matchRGB);
				this.red(this._perToVal(partsRGB[1]));
				this.green(this._perToVal(partsRGB[2]));
				this.blue(this._perToVal(partsRGB[3]));
				const alphaRGB = parseFloat(partsRGB[5]);
				this.alpha(isNaN(alphaRGB) ? 1 : alphaRGB);
				this.output = (this.isPercent.test(partsRGB[1]) ? 2 : 1) + (partsRGB[5] ? 2 : 0);
				this.broadcast(Color.Events.PARSED);
			}
			else if (this.isHSL.test(value)) {
				const partsHSL = value.match(this.matchHSL);
				this.hue = parseInt(partsHSL[1]);
				this.saturation = parseInt(partsHSL[2]);
				this.lightness = parseInt(partsHSL[3]);
				const alphaHSL = parseFloat(partsHSL[5]);
				this.alpha(isNaN(alphaHSL) ? 1 : alphaHSL);
				this.output = partsHSL[5] ? 6 : 5;
				this.broadcast(Color.Events.PARSED);
			}
		}

		return this;
	}

	/**
	 * Creates a deep clone of the current Color object.
	 * @returns {Color} A new Color object with the same color and alpha values as this object.
	 */
	clone() {
		return new Color(this.decimal()).alpha(this.alpha());
	}

	/**
	 * Copies the color properties from another Color object to this one.
	 * @param {Color} color - The Color object to copy properties from.
	 * @returns {Color} The current Color object after copying the color and alpha values.
	 */
	copy(color) {
		return this.set(color.decimal()).alpha(color.alpha());
	}

	/**
	 * Sets one or more color component values of the current Color object.
	 * If a single numeric value is provided, it sets the decimal color value.
	 * If an object is provided, each key-value pair is applied to the corresponding color component.
	 * If a key and value are provided, it sets the specified component to the given value.
	 * @param {string|object|number} key - The name of the color component to set, a hash of key-value pairs for multiple components, or a single numeric value representing the color.
	 * @param {?string|number} [value] - The value of the color component to be set. This parameter is ignored if key is an object or number.
	 * @returns {Color} The Color instance for method chaining.
	 * @example
	 * const color = new Color();
	 * color.set('red', 255); // set red component
	 * color.set({ green: 128, blue: 64 }); // set green and blue components
	 * color.set(0xabcdef); // set color using a hexadecimal number
	 */
	set(key, value = undefined) {
		if (arguments.length === 1) {
			if (typeof key == 'object') {
				for (const p in key) {
					if (typeof this[p] == 'function') {
					this[p](key[p]);
					}
				}
			} else if (isFinite(key)) {
				this.decimal(key);
			}
		} else if (typeof this[key] == 'function') {
			this[key](value);
		}
		return this;
	}

	/**
	 * Modifies the invoking Color instance by interpolating its component values between the original color and the destination color based on the provided factor.
	 * @param {Color} destination - The Color instance toward which the interpolation occurs.
	 * @param {number} factor - A float between 0 and 1, where 0 is the original Color, 1 is the destination Color, and 0.5 represents the midpoint. This method blends the colors accordingly.
	 * @returns {Color} The Color instance after interpolation, for method chaining.
	 * @example
	 * const orange = new Color('#FF9900');
	 * const white = new Color('#FFFFFF');
	 * orange.interpolate(white, 0.5); // orange is now a blend of orange and white
	 */
	interpolate(destination, factor) {
		if (!(destination instanceof Color)) {
			destination = new Color(destination);
		}
		this._red = this._absRound(+(this._red) + (destination._red - this._red) * factor);
		this._green = this._absRound(+(this._green) + (destination._green - this._green) * factor);
		this._blue = this._absRound(+(this._blue) + (destination._blue - this._blue) * factor);
		this._alpha = this._absRound(+(this._alpha) + (destination._alpha - this._alpha) * factor);
		this.broadcast(Color.Events.RGB_UPDATED);
		this.broadcast(Color.Events.UPDATED);
		return this;
	}

	/**
	 * Sets the decimal (integer) representation of the color, updates all other components, and dispatches the Event.UPDATED event.
	 * @param {number} [value] - An integer from 0 (black) to 16777215 (white), representing the new color value to set.
	 * @returns {number} The new decimal value of the color after it has been set.
	 * @example
	 * const color = new Color();
	 * color.decimal(123456); // sets the color to the decimal equivalent of #01E240
	 */
	decimal(value = undefined) {
		return this._handle('_decimal', value, Color.Events.INT_UPDATED);
	}

	/**
	 * Formats a string by replacing tokens with corresponding color value properties.
	 * Tokens should be formatted as `%token%` within the string, where `token` can be one of the following:
	 * - `r` for red component
	 * - `g` for green component
	 * - `b` for blue component
	 * - `h` for hue component (in HSL)
	 * - `s` for saturation component (in HSL)
	 * - `l` for lightness component (in HSL)
	 * - `v` for brightness component (in HSV)
	 * - `a` for alpha component (transparency)
	 * - `x` for hexadecimal color representation
	 * - `d` for decimal color representation.
	 * @param {string} string - The string with tokens to be replaced by color values.
	 * @returns {string} The formatted string with all tokens replaced by their corresponding values.
	 */
	format(string) {
		const tokens = {
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
		for (const token in tokens) {
			string = string.split(`%${token}%`).join(tokens[token]);
		}
		return string;
	}

	/**
	 * Converts the color value to a string based on the current output format.
	 * @returns {string} The color as a string in the format specified by this.output.
	 */
	toString() {
		switch (this.output) {
			case Color.HEX:  return this.getHex();
			case Color.RGB:  return this.getRGB();
			case Color.HSL:  return this.getHSL();
			case Color.HSLA: return this.getHSLA();
			case Color.INT:  return this._decimal.toString();
		}
		return this.getHex();
	}

	/**
	 * Determines the ideal foreground color (black or white) that provides the best contrast on the invoking Color object when used as a background.
	 * The decision is based on the lightness of the background color; a light background gets a black foreground and vice versa.
	 * @returns {Color} A new Color instance representing the ideal foreground color (black or white).
	 * @example
	 * const bgColor = new Color('#FF9900');
	 * element.style.backgroundColor = bgColor.getRGB();
	 * element.style.color = bgColor.foreground().getRGB(); // sets the text color to black or white based on background color
	 */
	foreground() {
		if (this._lightness > 50) return new Color('black');
		return new Color('white');
	}

	/**
	 * Broadcasts an event to all subscribed listeners with optional parameters.
	 * @param {string} type - The event type to broadcast.
	 * @param {Array} [params] - An array of parameters to pass to each of the event listeners.
	 * @example
	 * Suppose some listeners have been added to 'update' event
	 * color.broadcast('update', [newColorValue]);
	 */
	broadcast(type, params = null) {
		if (!this._isSubscribed(type)) {
			return;
		}
		const stack = this._listeners[type];
		const l = stack.length;
		for (let i = 0; i < l; i++) {
			stack[i].apply(this, params);
		}
	}

	/**
	 * Subscribes a new listener to a specific event type.
	 * @param {string} type - The event type for which to register the listener.
	 * @param {Function} callback - The callback function that will be invoked when the event is broadcasted.
	 * @example
	 * To listen for a color update event
	 * color.subscribe('update', function(updatedColor) {
	 *   console.log('Color updated to', updatedColor);
	 * });
	 */
	subscribe(type, callback) {
		if (!this._isSubscribed(type)) {
			this._listeners[type] = [];
		}
		this._listeners[type].push(callback);
	}

	/**
	 * Unsubscribes a previously registered listener from a specific event type.
	 * If the callback is not found, no action is taken.
	 * @param {string} type - The event type to unsubscribe from.
	 * @param {Function} callback - The callback function to unregister from the event.
	 * @returns {void|this} If the callback is found and removed, the method returns the instance for chaining.
	 * @example
	 * To remove a previously added listener from the 'update' event
	 * color.unsubscribe('update', updateListener);
	 */
	unsubscribe(type, callback) {
		if (!this._isSubscribed(type)) {
			return;
		}
		const stack = this._listeners[type];
		for (let i = 0, l = stack.length; i < l; i++) {
			if (stack[i] === callback) {
				stack.splice(i, 1);
				return this.unsubscribe(type, callback);
			}
		}
	}
	// #endregion
}
