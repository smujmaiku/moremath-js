/*!
 * More Math JS <https://github.com/smujmaiku/moremath-js>
 * Copyright(c) 2016-2019 Michael Szmadzinski
 * MIT Licensed
 */

/**
 * make an easing in function
 * @param {number} exp
 * @return {function}
 */
function makeIn(exp) {
	return t => Math.pow(t, exp);
}

/**
 * make an easing out function
 * @param {number} exp
 * @return {function}
 */
function makeOut(exp) {
	return t => (1 - Math.abs(Math.pow(t - 1, exp)));
}

/**
 * make a two way easing function
 * @param {number} exp
 * @return {function}
 */
function makeBoth(exp) {
	return t => t < 0.5 ? makeIn(exp)(t * 2) / 2 : makeOut(exp)(t * 2 - 1) / 2 + 0.5;
}

exports = module.exports = {
	makeIn,
	makeOut,
	makeBoth,
	quad: makeBoth(2),
	quadIn: makeIn(2),
	quadOut: makeOut(2),
	cubic: makeBoth(3),
	cubicIn: makeIn(3),
	cubicOut: makeOut(3),
};
