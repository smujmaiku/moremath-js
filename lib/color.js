/*!
 * More Math JS <https://github.com/smujmaiku/moremath-js>
 * Copyright(c) 2016-2019 Michael Szmadzinski
 * MIT Licensed
 */

const {
	limitOverflow,
	round,
	roundAll,
	fade,
} = require('./common');

/**
 * Parses color string formats to an RGB Byte Array
 * @param {string} color
 * @returns {Array}
 */
function parseColor(color) {
	// Try rgb() format
	const rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	if (rgb) return roundAll(rgb.slice(1).map(v => parseInt(v)));

	// Try rgba() format
	const rgba = color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
	if (rgba) return roundAll(rgba.slice(1).map(v => parseInt(v)));

	// Try three and four hex format
	if (color.match(/^#[0-9a-f]{3,4}$/i)) {
		const hex = color.replace(/[0-9a-f]/gi, h => `${h}${h}`);
		return parseColor(hex);
	}

	// Try hex format
	if (color.match(/^#[0-9a-f]{6,8}$/i)) {
		return color.slice(1)
			.match(/.{1,2}/g)
			.map(([a, b]) => parseInt(a, 16) * 16 + parseInt(b, 16));
	}

	// Fail to black
	return [0, 0, 0];
}

/**
 * Converts RGB to HSL
 * @param {Array} rgb
 * @returns {Array}
 */
function rgbToHsl(rgb) {
	if (typeof rgb === 'string') return rgbToHsl(parseColor(rgb));

	const [r, g, b] = rgb.map(v => v / 255);
	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const l = (max + min) / 2;

	if (min === max) return [0, 0, l];

	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

	let h;
	switch (max) {
	case r:
		h = (g - b) / d + (g < b ? 6 : 0);
		break;
	case g:
		h = (b - r) / d + 2;
		break;
	case b:
		h = (r - g) / d + 4;
		break;
	}
	return [h / 6, s, l];
}

/**
 * Coverts HSL to RGB
 * @param {Array} hsl
 * @returns {Array}
 */
function hslToRgb(hsl) {
	const [h, s, l] = hsl;

	// Just grey
	if (s <= 0) return roundAll([l * 255, l * 255, l * 255]);

	const lum = (p, q, t) => {
		if (t < 0) t = (t % 1 || -1) + 1;
		if (t > 1) t = t % 1 || 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};

	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	return [1 / 3, 0, -1 / 3]
		.map(r => lum(p, q, h + r))
		.map(v => round(v * 255));
}

/**
 * Fade between colors using hsl conversion
 * @param {Array} colorA
 * @param {Array} colorB
 * @param {number} t
 * @param {function?} easing
 * @returns {Array}
 */
function fadeColor(colorA, colorB, t, easing = v => v) {
	if (t <= 0) return colorA;
	if (t >= 1) return colorB;

	const hslA = rgbToHsl(colorA);
	const hslB = rgbToHsl(colorB);

	// Set desaturated colors to the other's hue
	if (hslA[1] < 0.1) hslA[0] = hslB[0];
	if (hslB[1] < 0.1) hslB[0] = hslA[0];

	// Wrap hue around shortest arc
	let offsetHue = false;
	if (Math.abs(hslA[0] - hslB[0]) > 0.5) {
		hslA[0] = (hslA[0] + 0.5) % 1;
		hslB[0] = (hslB[0] + 0.5) % 1;
		offsetHue = true;
	}

	const hsl = [0, 1, 2].map((i) => fade(hslA[i], hslB[i], t, easing));

	// Fix hue wrap offset
	if (offsetHue) hsl[0] = (hsl[0] + 0.5) % 1;

	return hslToRgb(hsl);
}

exports = module.exports = {
	parseColor,
	rgbToHsl,
	hslToRgb,
	fadeColor,
};
