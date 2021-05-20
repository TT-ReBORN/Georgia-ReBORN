var themeArray = [];

const redTheme = {
	name: 'salmon/brightred',
	colors: {
		primary: rgb(235, 70, 80),
		darkAccent: rgb(170, 26, 42),
		accent: rgb(206, 58, 72),
		lightAccent: rgb(238, 135, 146),
	},
	hint: [rgb(235, 70, 80), rgb(240,230,220)]
};

const blueTheme = {
	name: 'blue',
	colors: {
		primary: rgb(40, 57, 99),
		darkAccent: rgb(21, 36, 74),
		accent: rgb(61, 78, 120),
		lightAccent: rgb(97, 112, 148),
	},
	hint: [rgb(40, 57, 99), rgb(220,230,240)]
};

const midnightBlueTheme = {
	name: 'midnightBlue',
	colors: {
		primary: rgb(0, 0, 48),
		darkAccent: rgb(0, 0, 32),
		accent: rgb(31, 31, 92),
		lightAccent: rgb(64, 64, 116),
	},
	hint: [rgb(0, 0, 48)]
};

const blackTheme = {
	name: 'black',
	colors: {
		primary: rgb(10,10,10),
		darkAccent: rgb(32, 32, 32),
		accent: rgb(56, 56, 56),
		lightAccent: rgb(78, 78, 78),
	},
	hint: [rgb(0, 0, 0)]
};


function setTheme(theme) {
	var themeCol = new Color(theme.primary);
	if (colorDistance(theme.primary, col.bg, true) < (themeCol.isCloseToGreyscale ? 60 : 45)) {
        if (pref.blackTheme) {
            if (settings.showThemeLog) console.log('>>> Theme primary color is too close to bg color. Tinting theme color.');
            theme.primary = tintColor(theme.primary, 5);
            themeCol = new Color(theme.primary);
        } else {
            if (settings.showThemeLog) console.log('>>> Theme primary color is too close to bg color. Shading theme color.');
            theme.primary = shadeColor(theme.primary, 5);
            themeCol = new Color(theme.primary);
        }
	}
	col.primary = theme.primary;

	if (pref.whiteTheme) {
	col.progress_bar = RGB(220, 220, 220);
	} else if (pref.blackTheme) {
	col.progress_bar = RGB(50, 50, 50);
	} else if (pref.blueTheme) {
	col.progress_bar = RGB(10, 130, 220);
	} else if (pref.darkblueTheme) {
	col.progress_bar = RGB(27, 55, 90);
	} else if (pref.redTheme) {
	col.progress_bar = RGB(140, 25, 25);
	} else if (pref.creamTheme) {
	col.progress_bar = RGB(255, 255, 255);
	} else if (pref.nblueTheme || pref.ngreenTheme || pref.nredTheme || pref.ngoldTheme) {
	col.progress_bar = RGB(35, 35, 35);
	}

	if (colorDistance(theme.primary, col.progress_bar, true) < (themeCol.isCloseToGreyscale ? 60 : 45)) {
		// progress fill is too close in color to bg
		if (settings.showThemeLog) console.log('>>> Theme primary color is too close to progress bar. Adjusting progress_bar');
		if (pref.whiteTheme && themeCol.brightness < 125) {
			col.progress_bar = rgb(180, 180, 180);
		} if (pref.blackTheme && themeCol.brightness < 125) {
			col.progress_bar = rgb(100, 100, 100);
		}
	}
	if (str.timeline) {
		str.timeline.setColors(theme.darkAccent, theme.accent, theme.lightAccent);
	}
	col.tl_added = theme.darkAccent;
	col.tl_played = theme.accent;
	col.tl_unplayed = theme.lightAccent;

	col.primary = theme.primary;
	col.extraDarkAccent = shadeColor(theme.primary, 50);
	col.darkAccent = theme.darkAccent;
	col.accent = theme.accent;
	col.lightAccent = theme.lightAccent;
}

/**
 * @param {GdiBitmap} image
 * @param {number} maxColorsToPull
 */
function getThemeColorsJson(image, maxColorsToPull) {
	let selectedColor;
	const minFrequency = 0.015;
	const maxBrightness = pref.blackTheme ? 255 : 212;

	try {
		let colorsWeighted = JSON.parse(image.GetColourSchemeJSON(maxColorsToPull));
		colorsWeighted.map(c => {
			c.col = new Color(c.col);
		});

		if (settings.showThemeLog) console.log('idx      color        bright  freq   weight');
		let maxWeight = 0;
		selectedColor = colorsWeighted[0].col;  // choose first color in case no color selected below
		colorsWeighted.forEach((c, i) => {
			const col = c.col;
			const midBrightness = 127 - Math.abs(127 - col.brightness);   // favors colors with a brightness around 127
			c.weight = c.freq * midBrightness * 10; // multiply by 10 so numbers are easier to compare

			if (c.freq >= minFrequency && !col.isCloseToGreyscale && col.brightness < maxBrightness) {
				if (settings.showThemeLog) console.log(leftPad(i, 2), col.getRGB(true,true), leftPad(col.brightness, 4), ' ', leftPad((c.freq*100).toFixed(2),5) + '%', leftPad(c.weight.toFixed(2), 7));
				if (c.weight > maxWeight) {
					maxWeight = c.weight;
					selectedColor = col;
				}
			} else if (col.isCloseToGreyscale) {
				if (settings.showThemeLog) console.log(' -', col.getRGB(true,true), leftPad(col.brightness, 4), ' ', leftPad((c.freq*100).toFixed(2),5) + '%', '   grey');
			} else {
				if (settings.showThemeLog) console.log(' -', col.getRGB(true,true), leftPad(col.brightness, 4), ' ', leftPad((c.freq*100).toFixed(2),5) + '%',
					(c.freq < minFrequency) ? '   freq' : ' bright');
			}
		});

		if (selectedColor.brightness < 37) {
			if (settings.showThemeLog) console.log(selectedColor.getRGB(true), 'brightness:', selectedColor.brightness, 'too dark -- searching for highlight color');
			let brightest = selectedColor;
			maxWeight = 0;
			colorsWeighted.forEach(c => {
				if (c.col.brightness > selectedColor.brightness &&
					c.col.brightness < 200 &&
					!c.col.isCloseToGreyscale &&
					c.weight > maxWeight &&
					c.freq > .01) {
						maxWeight = c.weight;
						brightest = c.col;
					}
			});
			selectedColor = brightest;
		}
		if (settings.showThemeLog) console.log('Selected Color:', selectedColor.getRGB(true));
		return selectedColor.val;
	} catch (e) {
		console.log('<Error: GetColourSchemeJSON failed.>');
	}
}

function getThemeColors(image) {
	let calculatedColor;
	const val = $('[%THEMECOLOR%]');

	if (val.length) {	// color hardcoded
		var themeRgb = val.match(/\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\)/);
		if (themeRgb) {
			calculatedColor = rgb(parseInt(themeRgb[1]), parseInt(themeRgb[2]), parseInt(themeRgb[3]));
		} else {
			calculatedColor = 0xff000000 | parseInt(val, 16);
		}
	} else {
		calculatedColor = getThemeColorsJson(image, 14);
	}
	if (!isNaN(calculatedColor)) {
		let color = new Color(calculatedColor);
		while (!pref.darkMode && color.brightness > 200) {
			calculatedColor = shadeColor(calculatedColor, 3);
			if (settings.showThemeLog) console.log(' >> Shading: ', colToRgb(calculatedColor), ' - brightness: ', color.brightness);
			color = new Color(calculatedColor);
		}
		while (!color.isGreyscale && color.brightness <= 17) {
			calculatedColor = tintColor(calculatedColor, 3);
			if (settings.showThemeLog) console.log(' >> Tinting: ', colToRgb(calculatedColor), ' - brightness: ', color.brightness);
			color = new Color(calculatedColor);
		}
		const tObj = createThemeColorObject(color)
		setTheme(tObj);
	}
}

function createThemeColorObject(color) {
    const themeObj = {
        primary: color.val,
        darkAccent: shadeColor(color.val, 30),
        accent: shadeColor(color.val, 15),
        lightAccent: tintColor(color.val, 20),
    };
	if (color.brightness < 18) {
		// hard code these values otherwise darkAccent and accent can be very hard to see on background
		themeObj.darkAccent = rgb(32, 32, 32);
		themeObj.accent = rgb(56, 56, 56);
		themeObj.lightAccent = rgb(78, 78, 78);
	} else if (color.brightness < 40) {
        themeObj.darkAccent = shadeColor(color.val, 35);
        themeObj.accent = tintColor(color.val, 10);
        themeObj.lightAccent = tintColor(color.val, 20);
    } else if (color.brightness > 210) {
        themeObj.darkAccent = shadeColor(color.val, 30);
        themeObj.accent = shadeColor(color.val, 20);
        themeObj.lightAccent = shadeColor(color.val, 10);
    }
    return themeObj;
}

function shadeColor(color, percent) {
	const red = getRed(color);
	const green = getGreen(color);
	const blue = getBlue(color);

	return rgba(darkenColorVal(red, percent), darkenColorVal(green, percent), darkenColorVal(blue, percent), getAlpha(color));
}

function tintColor(color, percent) {
	const red = getRed(color);
	const green = getGreen(color);
	const blue = getBlue(color);

	return rgba(lightenColorVal(red, percent), lightenColorVal(green, percent), lightenColorVal(blue, percent), getAlpha(color));
}

function darkenColorVal(color, percent) {
	const shift = Math.max(color * percent / 100, percent / 2);
	const val = Math.round(color - shift);
	return Math.max(val, 0);
}

function lightenColorVal(color, percent) {
	const val = Math.round(color + ((255-color) * (percent / 100)));
	return Math.min(val, 255);
}

/**
 * Calculates the color "distance" between two colors. Currently uses the more naive color weighted
 * calculation from https://en.wikipedia.org/wiki/Color_difference.
 * @param {number} a The first color in numeric form (i.e. rgb(150,250,255))
 * @param {number} b The second color in numeric form (i.e. rgb(150,250,255))
 * @param {boolean=} log Whether to print the distance in the console. Also requires that settings.showThemeLog is true
 */
function colorDistance(a, b, log) {
	const aCol = new Color(a);
	const bCol = new Color(b);

	const rho = (aCol.r + bCol.r) / 2;
	const deltaR = Math.pow(aCol.r - bCol.r, 2);
	const deltaG = Math.pow(aCol.g - bCol.g, 2);
	const deltaB = Math.pow(aCol.b - bCol.b, 2);

	//TODO: Convert this to use "redmean" approximation from above link and then retest colorDistance checks
	const distance = Math.sqrt(2 * deltaR + 4 * deltaG + 3 * deltaB + (rho * (deltaR - deltaB))/256);
	if (log) {
		if (settings.showThemeLog) console.log('distance from:', aCol.getRGB(), 'to:', bCol.getRGB(), '=', distance);
	}
	return distance;
}