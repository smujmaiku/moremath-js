/*!
 * More Math JS <https://github.com/smujmaiku/moremath-js>
 * Copyright(c) 2016-2019 Michael Szmadzinski
 * MIT Licensed
 */

const {
	isNumber,
	addVectors,
	getDirection,
	isBetween,
	getFade,
	getMagnitude,
	makeLinesFromPoly,
} = require('./common.js');

/**
 * Rotates a point
 * @param {Array} point
 * @param {number} radians
 * @param {Array?} center
 * @returns {Array}
 */
function rotate(point, radians, center = undefined) {
	const [x, y] = point;
	if (center) {
		const [cx, cy] = center;
		const [rx, ry] = rotate([x - cx, y - cy], radians);
		return [rx + cx, ry + cy];
	}

	return [
		x * Math.cos(radians) - y * Math.sin(radians),
		y * Math.cos(radians) + x * Math.sin(radians),
	];
}

/**
 * Rotates an Array of points
 * @param {Array} poly
 * @param {number} radians
 * @param {Array?} center
 * @returns {Array}
 */
function rotatePoly(poly, radians, center = undefined) {
	return poly.map(point => rotate(point, radians, center));
}

/**
 * Rotates a line
 * @param {Array} line
 * @param {number} radians
 * @param {Array?} center
 * @returns {Array}
 */
function rotateLine(line, radians, center = undefined) {
	const [ax, ay, bx, by] = line;
	const a = rotate([ax, ay], radians, center);
	const b = rotate([bx, by], radians, center);
	return a.concat(b);
}

/**
 * Calculates an angle
 * @param {Array} point
 * @param {Array?} origin
 * @returns {number}
 */
function angleFromVector(point, origin = undefined) {
	const [x, y] = point;
	if (origin) {
		const [ox, oy] = origin;
		return angleFromVector([x - ox, y - oy]);
	}

	if (y === 0) return x < 0 ? Math.PI : 0;

	const rad = (Math.atan(y / x) + Math.PI) % Math.PI;
	if (y < 0) return rad + Math.PI;
	return rad;
}

/**
 * Calculates an intersection to a line
 * @param {Array} line
 * @param {Array} point
 * @param {Array?} vector
 * @returns {Array} [distance, fade, direction]
 */
function rayTraceLine(line, point, vector = undefined) {
	if (vector) {
		// Align to [1, 0]
		const angle = angleFromVector(vector) - Math.PI / 2;
		const mag = getMagnitude(vector);
		const newLine = rotateLine(line, -angle, point);
		const [distance, fade, direction] = rayTraceLine(newLine, point);
		return [distance / mag, fade, direction];
	}

	const [ax, ay, bx, by] = line;
	const [x, y] = point;

	const fade = getFade(x, ax, bx);
	const direction = getDirection(ax, bx);
	const failure = [NaN, NaN, direction];

	// Verify x is between endpoints
	if (!isBetween(x, ax, bx)) return failure;

	// Check verticals
	if (ax === bx) {
		if (isBetween(y, ay, by)) return [0, getFade(y, ay, by), 0];
		if (y > ay) return failure;
		if (ay <= by) return [ay - y, 0, 0];
		return [by - y, 1, 0];
	}

	// Precheck horizontals
	if (ay === by) {
		if (ay < y) return failure;
		return [ay - y, fade, direction];
	}

	// Check sloped lines
	const m = (by - ay) / (bx - ax);
	const b = ay - ax * m;
	const sy = x * m + b;
	if (sy < y) return failure;
	return [sy - y, fade, direction];
}

/**
 * Calculates intersections to a poly
 * @param {Array} poly
 * @param {Array} point
 * @param {Array?} vector
 * @returns {Array} [[distance, fade, direction], ...]
 */
function rayTracePoly(poly, point, vector = undefined) {
	const lines = makeLinesFromPoly(poly);
	return lines.map(line => rayTraceLine(line, point, vector));
}

/**
 * Calculates closest intersection to a poly
 * @param {Array} poly
 * @param {Array} point
 * @param {Array?} vector
 * @returns {Array} [[distance, fade, direction], ...]
 */
function rayTracePolyClosest(poly, point, vector = [1, 0]) {
	const traces = rayTracePoly(poly, point, vector);
	const dist = traces.map(([dist]) => dist)
		.filter(isNumber)
		.reduce((t, v) => Math.min(t, v), Infinity);
	const travel = vector.map(v => v * dist);
	return addVectors(point, travel);
}

/**
 * Evaluates if a point is inside poly
 * @param {Array} poly
 * @param {Array} point
 * @param {boolean} noCheckerBoard
 * @returns {boolean}
 */
function isInsidePoly(poly, point, noCheckerBoard = false) {
	let traces = rayTracePoly(poly, point);

	// Check inside line
	if (traces.some(([dist]) => dist === 0)) return true;

	// Remove verticals before processing
	traces = traces.filter(([dist, fade, dir]) => dir !== 0);

	const hits = traces.filter(([dist, fade, dir], index) => {
		if (!isNumber(dist)) return false;

		const pindex = (index > 0 ? index : traces.length) - 1;
		const [pdist, , pdir] = traces[pindex];

		// Skip continued lines in the same direction
		if (isNumber(pdist) && dir === pdir) return false;

		return true;
	});

	if (!noCheckerBoard) return hits.length % 2 === 1;

	const leftHits = hits.filter(([dist, fade, dir]) => dir === -1);
	const rightHits = hits.filter(([dist, fade, dir]) => dir === 1);
	return leftHits.length !== rightHits.length;
}

exports = module.exports = {
	rotate,
	rotatePoly,
	rotateLine,
	angleFromVector,
	rayTraceLine,
	rayTracePoly,
	rayTracePolyClosest,
	isInsidePoly,
};
