/*!
 * More Math JS <https://github.com/smujmaiku/moremath-js>
 * Copyright(c) 2016-2019 Michael Szmadzinski
 * MIT Licensed
 */

const objEntries = obj => Object.keys(obj).map(k => [k, obj[k]]);

/**
 * Evalulates for valid numbers
 * @param {*} val
 * @returns {boolean}
 */
function isNumber(val) {
	return typeof val === 'number' && !isNaN(val) && isFinite(val);
}

/**
 * Processes all nested numbers
 * @param {*} list
 * @param {Function?} fn
 * @returns {*}
 */
function all(list, fn = v => v) {
	if (typeof list === 'number') {
		return fn(list);
	}
	if (list instanceof Array) {
		return list.map(v => all(v, fn));
	}
	if (list instanceof Object) {
		return objEntries(list)
			.map(([k, v]) => [k, all(v, fn)])
			.reduce((o, [k, v]) => Object.assign(o, { [k]: v }), {});
	}
	return NaN;
}

/**
 * Limit value between two endpoints
 * @param {number} val
 * @param {number} low
 * @param {number} high
 * @returns {number}
 */
function limit(val, low = 0, high = 1) {
	return Math.min(Math.max(val, low), high);
}

/**
 * Limit values and wrap overflows
 * @param {number} val
 * @param {number?} low
 * @param {number?} high
 * @param {boolean} inclusiveHigh
 * @returns {number}
 */
function limitWrap(val, low = 0, high = 1, inclusiveHigh = false) {
	const range = high - low;
	const temp = low + ((val - low) % range);
	if (inclusiveHigh && val >= high && temp === low) return high;
	return temp < low ? temp + range : temp;
}

/**
 * Rounds value to an exponent
 * @param {number} val
 * @param {number?} exp
 * @returns {number}
 */
function round(val, exp = 0) {
	const rounded = Math.round(val / Math.pow(10, exp)) * Math.pow(10, exp);
	if (rounded === 0) return 0;
	return rounded;
}

/**
 * Rounds all nested numbers to an exponent
 * @param {*} list
 * @param {number?} exp
 * @returns {*}
 */
function roundAll(list, exp = 0) {
	return all(list, v => round(v, exp));
}

/**
 * Sums all numbers between Arrays
 * @param {Array} a
 * @param {Array} b
 * @returns {Array}
 */
function addVectors(a, b) {
	return a.map((v, i) => v + b[i]);
}

/**
 * Processes the direction of two endpoints
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function getDirection(a, b) {
	if (a < b) return 1;
	if (b < a) return -1;
	return 0;
}

/**
 * fade between to endpoints
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @param {function?} easing
 */
function fade(a, b, t, easing = v => v) {
	return easing(t) * (b - a) + a;
}

/**
 * Processes percentage value is along two endpoints
 * @param {number} val
 * @param {number} a
 * @param {number} b
 */
function getFade(val, a, b) {
	if (val === a) return 0;
	if (val === b) return 1;
	return (val - a) / (b - a);
}

/**
 * Determines if a value is between two endpoints
 * @param {number} val
 * @param {number} a
 * @param {number} b
 */
function isBetween(val, a, b) {
	const progress = getFade(val, a, b);
	return progress >= 0 && progress <= 1;
}

/**
 * Converts Degrees to Radians
 * @param {number} degrees
 * @returns {number}
 */
function toRadians(degrees) {
	return degrees * Math.PI / 180;
}

/**
 * Converts Radians to Degrees
 * @param {number} radians
 * @returns {number}
 */
function toDegrees(radians) {
	return radians * 180 / Math.PI;
}

/**
 * Calculates magnitude of vector from origin
 * @param {Array} vector
 * @param {Array?} origin
 * @returns {number}
 */
function getMagnitude(vector, origin = undefined) {
	if (origin) {
		return getMagnitude(vector.map((v, i) => origin[i] - v));
	}

	return Math.sqrt(vector.reduce((t, v) => t + Math.pow(v, 2), 0));
}

/**
 * Adjusts vector to a specific magnitude
 * @param {Array} vector
 * @param {number?} magnitude
 * @returns {Array}
 */
function fixVectorMagnitude(vector, magnitude = 1) {
	const scale = magnitude / getMagnitude(vector);
	return vector.map(v => v * scale);
}

/**
 * Reduces a box inside a container
 * @param {Array} box
 * @param {Array} container
 * @param {Function?} reducer
 * @returns {Array}
 */
function containBox(box, container, reducer = Math.min) {
	if (container.length < 2) return container;

	const scales = container.map((v, i) => v / box[i]);
	const scale = scales.reduce((a, b) => reducer(a, b));
	return box.map(v => v * scale);
};

/**
 * Concats the following point to each point
 * @param {Array} poly
 * @returns {Array}
 */
function makeLinesFromPoly(poly) {
	return poly.map((v, i) => {
		if (i + 1 === poly.length) return v.concat(poly[0]);
		return v.concat(poly[i + 1]);
	});
}

exports = module.exports = {
	objEntries,
	isNumber,
	all,
	limit,
	limitWrap,
	round,
	roundAll,
	addVectors,
	getDirection,
	fade,
	getFade,
	isBetween,
	toRadians,
	toDegrees,
	getMagnitude,
	fixVectorMagnitude,
	containBox,
	makeLinesFromPoly,
};
