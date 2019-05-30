const { round } = require('./common');
const {
	makeIn,
	makeOut,
	makeBoth,
} = require('./ease');

describe('ease', () => {
	describe('makeIn', () => {
		it('should make quadratic function', () => {
			const easeFn = makeIn(2);
			expect(easeFn(0)).toEqual(0);
			expect(round(easeFn(0.1), -10)).toEqual(0.01);
			expect(round(easeFn(0.5), -10)).toEqual(0.25);
			expect(round(easeFn(0.9), -10)).toEqual(0.81);
			expect(easeFn(1)).toEqual(1);
		});

		it('should make cubic function', () => {
			const easeFn = makeIn(3);
			expect(easeFn(0)).toEqual(0);
			expect(round(easeFn(0.1), -10)).toEqual(0.001);
			expect(round(easeFn(0.5), -10)).toEqual(0.125);
			expect(round(easeFn(0.9), -10)).toEqual(0.729);
			expect(easeFn(1)).toEqual(1);
		});
	});
	describe('makeOut', () => {
		it('should make quadratic function', () => {
			const easeFn = makeOut(2);
			expect(easeFn(0)).toEqual(0);
			expect(round(easeFn(0.1), -10)).toEqual(0.19);
			expect(round(easeFn(0.5), -10)).toEqual(0.75);
			expect(round(easeFn(0.9), -10)).toEqual(0.99);
			expect(easeFn(1)).toEqual(1);
		});

		it('should make cubic function', () => {
			const easeFn = makeOut(3);
			expect(easeFn(0)).toEqual(0);
			expect(round(easeFn(0.1), -10)).toEqual(0.271);
			expect(round(easeFn(0.5), -10)).toEqual(0.875);
			expect(round(easeFn(0.9), -10)).toEqual(0.999);
			expect(easeFn(1)).toEqual(1);
		});
	});
	describe('makeBoth', () => {
		it('should make quadratic function', () => {
			const easeFn = makeBoth(2);
			expect(easeFn(0)).toEqual(0);
			expect(round(easeFn(0.1), -10)).toEqual(0.02);
			expect(round(easeFn(0.5), -10)).toEqual(0.5);
			expect(round(easeFn(0.9), -10)).toEqual(0.98);
			expect(easeFn(1)).toEqual(1);
		});

		it('should make cubic function', () => {
			const easeFn = makeBoth(3);
			expect(easeFn(0)).toEqual(0);
			expect(round(easeFn(0.1), -10)).toEqual(0.004);
			expect(round(easeFn(0.5), -10)).toEqual(0.5);
			expect(round(easeFn(0.9), -10)).toEqual(0.996);
			expect(easeFn(1)).toEqual(1);
		});
	});
});
