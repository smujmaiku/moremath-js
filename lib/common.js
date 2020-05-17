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
 * Subtract all numbers between Arrays
 * @param {Array} a
 * @param {Array} b
 * @returns {Array}
 */
function subtractVectors(a, b) {
	return a.map((v, i) => v - b[i]);
}

/**
 * Get vector distance
 * @param {Array} target
 * @param {Array?} origin
 * @returns {number}
 */
function getVectorDistance(target, origin = undefined) {
	if (origin) return getVectorDistance(subtractVectors(target, origin));
	return target.reduce((t, v) => Math.sqrt(t * t + v * v), 0);
}

/**
 * Get maximun distance of a point
 * @param {Array} list
 * @param {Array?} origin
 * @returns {number}
 */
function getVectorDistanceLazy(target, origin = undefined) {
	if (origin) return getVectorDistanceLazy(subtractVectors(target, origin));
	return target
		.map((v) => Math.abs(v))
		.reduce((t, v) => Math.max(t, v), 0);
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
 * fade between two endpoints
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @param {function?} easing
 */
function fade(a, b, t, easing = v => v) {
	return easing(t) * (b - a) + a;
}

/**
 * fade between two vectors
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @param {function?} easing
 */
function fadeVector(a, b, t, easing = v => v) {
	return a.map((v, i) => fade(v, b[i], t, easing));
}

/**
 * Get a vector by distance between two vectors
 * @param {Array} origin
 * @param {Array} target
 * @param {number} distance
 * @param {function?} easing
 * @returns {Array}
 */
function fadeVectorByDistance(origin, target, distance, easing = v => v) {
	const actualDistance = getVectorDistance(subtractVectors(origin, target));
	const ratio = distance / actualDistance;
	if (ratio <= 0) return origin;
	if (ratio >= 1) return target;
	return fadeVector(origin, target, ratio, easing);
}

/**
 * Get a vector by largest item distance between two vectors
 * @param {Array} origin
 * @param {Array} target
 * @param {number} distance
 * @param {function?} easing
 * @returns {Array}
 */
function fadeVectorByDistanceLazy(origin, target, distance, easing = v => v) {
	const lazyDistance = getVectorDistanceLazy(target, origin);
	const ratio = distance / lazyDistance;
	if (ratio <= 0) return origin;
	if (ratio >= 1) return target;
	return fadeVector(origin, target, ratio, easing);
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

/**
 * Average list of values with weights
 * @param {Array} list
 * @param {Function?} reducer [value, weight]
 * @returns {Array} [average, sum]
 */
function averageWithWeight(list, reducer = ([v, w]) => ([v, w])) {
	const array = list.map(reducer);
	const sum = array.reduce((t, [v, w]) => t + v * w, 0);
	const count = array.reduce((t, [, w]) => t + w, 0);
	return [sum / count, sum];
}

/**
 * Group list neighbors
 * @param {Array} list
 * @param {number?} limit
 * @param {Function?} reducer
 * @returns {Array(Array)}
 */
function groupNeighbors(list, limit = 1, reducer = v => v) {
	return list.reduce((res, value, index, array) => {
		if (index && Math.abs(reducer(value) - reducer(array[index - 1])) <= limit) {
			res[res.length - 1].push(value);
		} else {
			res.push([value]);
		}
		return res;
	}, []);
};

exports = module.exports = {
	objEntries,
	isNumber,
	all,
	limit,
	limitWrap,
	round,
	roundAll,
	addVectors,
	subtractVectors,
	getVectorDistance,
	getVectorDistanceLazy,
	fadeVectorByDistance,
	fadeVectorByDistanceLazy,
	getDirection,
	fade,
	fadeVector,
	getFade,
	isBetween,
	toRadians,
	toDegrees,
	getMagnitude,
	fixVectorMagnitude,
	containBox,
	makeLinesFromPoly,
	averageWithWeight,
	groupNeighbors,
};
