const {
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
	getDirection,
	fade,
	fadeVector,
	fadeVectorByDistance,
	fadeVectorByDistanceLazy,
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
} = require('./common');

describe('common', () => {
	describe('isNumber', () => {
		it('should detect valid numbers', () => {
			expect(isNumber(0)).toBe(true);
			expect(isNumber(1)).toBe(true);
			expect(isNumber(0.1)).toBe(true);
			expect(isNumber(-1)).toBe(true);
			expect(isNumber(-0)).toBe(true);
			expect(isNumber(NaN)).toBe(false);
			expect(isNumber(Infinity)).toBe(false);
			expect(isNumber('1')).toBe(false);
			expect(isNumber({ a: 1 })).toBe(false);
			expect(isNumber([1])).toBe(false);
			expect(isNumber(() => 1)).toBe(false);
		});
	});

	describe('all', () => {
		it('should perform the function on numbers', () => {
			const fn = jest.fn(v => v * 2);
			expect(all(1, fn)).toEqual(2);
			expect(fn).toBeCalledTimes(1);
		});

		it('should map Arrays', () => {
			const fn = jest.fn(v => v * 3);
			expect(all([1, 2], fn)).toEqual([3, 6]);
			expect(fn).toBeCalledTimes(2);
		});

		it('should map Objects', () => {
			const fn = jest.fn(v => v * -1);
			expect(all({ a: 3, b: 4 }, fn)).toEqual({ a: -3, b: -4 });
			expect(fn).toBeCalledTimes(2);
		});

		it('should deep dive', () => {
			const fn = jest.fn(v => v.toFixed());
			expect(all({ a: 1, b: [2, 3] }, fn))
				.toEqual({ a: '1', b: ['2', '3'] });
			expect(fn).toBeCalledTimes(3);
		});

		it('should return NaN on all garbage', () => {
			expect(all({ a: 1, b: { c: '', d: ['', null] } }))
				.toEqual({ a: 1, b: { c: NaN, d: [NaN, NaN] } });
		});
	});

	describe('limit', () => {
		it('should limit between two endpoints', () => {
			expect(limit(-1)).toEqual(0);
			expect(limit(2)).toEqual(1);
			expect(limit(0, 1, 3)).toEqual(1);
			expect(limit(1, 1, 3)).toEqual(1);
			expect(limit(2, 1, 3)).toEqual(2);
			expect(limit(3, 1, 3)).toEqual(3);
			expect(limit(4, 1, 3)).toEqual(3);
		});
	});

	describe('limitWrap', () => {
		it('should wrap between two endpoints', () => {
			expect(limitWrap(1.5)).toEqual(0.5);
			expect(limitWrap(2)).toEqual(0);
			expect(limitWrap(-1, 1, 4)).toEqual(2);
			expect(limitWrap(0, 1, 4)).toEqual(3);
			expect(limitWrap(1, 1, 4)).toEqual(1);
			expect(limitWrap(2, 1, 4)).toEqual(2);
			expect(limitWrap(3, 1, 4)).toEqual(3);
			expect(limitWrap(3.9, 1, 4)).toEqual(3.9);
			expect(limitWrap(4, 1, 4)).toEqual(1);
		});

		it('should allow inclusive high', () => {
			expect(limitWrap(-1, 1, 4, true)).toEqual(2);
			expect(limitWrap(0, 1, 4, true)).toEqual(3);
			expect(limitWrap(1, 1, 4, true)).toEqual(1);
			expect(limitWrap(2, 1, 4, true)).toEqual(2);
			expect(limitWrap(3, 1, 4, true)).toEqual(3);
			expect(limitWrap(3.9, 1, 4, true)).toEqual(3.9);
			expect(limitWrap(4, 1, 4, true)).toEqual(4);
			expect(limitWrap(5, 1, 4, true)).toEqual(2);
			expect(limitWrap(7, 1, 4, true)).toEqual(4);
		});
	});

	describe('round', () => {
		it('should round numbers', () => {
			expect(round(1)).toEqual(1);
			expect(round(1.49)).toEqual(1);
			expect(round(1.5)).toEqual(2);
			expect(round(2)).toEqual(2);
			expect(round(-1.5)).toEqual(-1);
		});

		it('should round by exponent', () => {
			expect(round(10, 1)).toEqual(10);
			expect(round(14.9, 1)).toEqual(10);
			expect(round(15, 1)).toEqual(20);
			expect(round(20, 1)).toEqual(20);
			expect(round(-15, 1)).toEqual(-10);
			expect(round(0.149, -1)).toEqual(0.1);
		});
	});

	describe('roundAll', () => {
		it('should round numbers', () => {
			expect(roundAll(1.49)).toEqual(1);
			expect(roundAll([10, 14.9, 15, 20, -15], 1)).toEqual([10, 10, 20, 20, -10]);
			expect(roundAll({ a: 0.1, b: 0.149, c: 0.151, d: 0.2, e: -0.15 }, -1)).toEqual({ a: 0.1, b: 0.1, c: 0.2, d: 0.2, e: -0.1 });
			expect(roundAll('a')).toEqual(NaN);
		});
	});

	describe('addVectors', () => {
		it('should add vectors', () => {
			expect(addVectors([1], [1])).toEqual([2]);
			expect(addVectors([1, 2], [3, 4])).toEqual([4, 6]);
		});
	});

	describe('subtractVectors', () => {
		it('should subtract vectors', () => {
			expect(subtractVectors([1], [2])).toEqual([-1]);
			expect(subtractVectors([4, 3], [2])).toEqual([2, NaN]);
			expect(subtractVectors([4, 3], [2, 0])).toEqual([2, 3]);
		});
	});

	describe('getVectorDistance', () => {
		it('should get vector distances', () => {
			expect(getVectorDistance([3, 4])).toEqual(5);
			expect(getVectorDistance([2, -2, 4, -5])).toEqual(7);
			expect(getVectorDistance([5, 4], [2, 0])).toEqual(5);
		});
	});

	describe('getVectorDistanceLazy', () => {
		it('should get vector distances', () => {
			expect(getVectorDistanceLazy([3, 4])).toEqual(4);
			expect(getVectorDistanceLazy([2, -2, 4, -5])).toEqual(5);
			expect(getVectorDistanceLazy([5, 4], [2, 0])).toEqual(4);
		});
	});

	describe('getDirection', () => {
		it('should detect direction', () => {
			expect(getDirection(1, 2)).toEqual(1);
			expect(getDirection(2, 2)).toEqual(0);
			expect(getDirection(2, 1)).toEqual(-1);
		});
	});

	describe('fade', () => {
		it('should fade between two endpoints', () => {
			expect(fade(1, 3, 0)).toEqual(1);
			expect(fade(1, 3, 0.5)).toEqual(2);
			expect(fade(1, 3, 1)).toEqual(3);
		});

		it('should take an easing function', () => {
			const easingFn = v => v / 2;
			expect(fade(1, 3, 0, easingFn)).toEqual(1);
			expect(fade(1, 3, 0.5, easingFn)).toEqual(1.5);
			expect(fade(1, 3, 1, easingFn)).toEqual(2);
		});
	});

	describe('fadeVector', () => {
		it('should fade between two vector', () => {
			expect(fadeVector([1], [3], 0)).toEqual([1]);
			expect(fadeVector([1, 2], [3, 5], 0.5)).toEqual([2, 3.5]);
			expect(fadeVector([1], [3], 1)).toEqual([3]);
		});

		it('should take an easing function', () => {
			const easingFn = v => v / 2;
			expect(fadeVector([1], [3], 0, easingFn)).toEqual([1]);
			expect(fadeVector([1, 2], [3, 5], 0.5, easingFn)).toEqual([1.5, 2.75]);
			expect(fadeVector([1], [3], 1, easingFn)).toEqual([2]);
		});
	});

	describe('fadeVectorByDistance', () => {
		it('should pick between vectors', () => {
			expect(fadeVectorByDistance([1], [5], 1)).toEqual([2]);
			expect(fadeVectorByDistance([1], [5], -1)).toEqual([1]);
			expect(fadeVectorByDistance([1], [5], 10)).toEqual([5]);
			expect(fadeVectorByDistance([1, 2], [7, 10], 5)).toEqual([4, 6]);
		});

		it('should take an easing function', () => {
			const easingFn = v => v / 2;
			expect(fadeVectorByDistance([1], [5], 1, easingFn)).toEqual([1.5]);
			expect(fadeVectorByDistance([1], [5], -1, easingFn)).toEqual([1]);
			expect(fadeVectorByDistance([1], [5], 10, easingFn)).toEqual([5]);
			expect(fadeVectorByDistance([1, 2], [7, 10], 5, easingFn)).toEqual([2.5, 4]);
		});
	});

	describe('fadeVectorByDistanceLazy', () => {
		it('should pick between vectors', () => {
			expect(fadeVectorByDistanceLazy([1], [5], 1)).toEqual([2]);
			expect(fadeVectorByDistanceLazy([1], [5], -1)).toEqual([1]);
			expect(fadeVectorByDistanceLazy([1], [5], 10)).toEqual([5]);
			expect(fadeVectorByDistanceLazy([1, 2], [7, 10], 4)).toEqual([4, 6]);
		});

		it('should take an easing function', () => {
			const easingFn = v => v / 2;
			expect(fadeVectorByDistanceLazy([1], [5], 1, easingFn)).toEqual([1.5]);
			expect(fadeVectorByDistanceLazy([1], [5], -1, easingFn)).toEqual([1]);
			expect(fadeVectorByDistanceLazy([1], [5], 10, easingFn)).toEqual([5]);
			expect(fadeVectorByDistanceLazy([1, 2], [7, 10], 4, easingFn)).toEqual([2.5, 4]);
		});
	});

	describe('getFade', () => {
		it('should return progress along a line', () => {
			expect(getFade(2, 1, 3)).toEqual(0.5);
			expect(getFade(1, 1, 3)).toEqual(0);
			expect(getFade(1, 2, 3)).toEqual(-1);
			expect(getFade(0, 0, 0)).toEqual(0);
			expect(getFade(1, 0, 1)).toEqual(1);
			expect(getFade(NaN, 2, 3)).toEqual(NaN);
			expect(getFade(1, NaN, 3)).toEqual(NaN);
		});
	});

	describe('isBetween', () => {
		it('should check if value is between endpoints', () => {
			expect(isBetween(2, 1, 3)).toEqual(true);
			expect(isBetween(1, 1, 3)).toEqual(true);
			expect(isBetween(1, 2, 3)).toEqual(false);
			expect(isBetween(0, 0, 0)).toEqual(true);
			expect(isBetween(1, 0, 1)).toEqual(true);
			expect(isBetween(NaN, 2, 3)).toEqual(false);
			expect(isBetween(1, NaN, 3)).toEqual(false);
		});
	});

	describe('toRadians', () => {
		it('should convert to radians', () => {
			expect(toRadians(0)).toEqual(0);
			expect(toRadians(90)).toEqual(Math.PI / 2);
			expect(toRadians(360)).toEqual(2 * Math.PI);
		});
	});

	describe('toDegrees', () => {
		it('should convert to degrees', () => {
			expect(toDegrees(0)).toEqual(0);
			expect(toDegrees(Math.PI / 2)).toEqual(90);
			expect(toDegrees(2 * Math.PI)).toEqual(360);
		});
	});

	describe('getMagnitude', () => {
		it('should return a magnitude of a vector', () => {
			expect(getMagnitude([1])).toEqual(1);
			expect(getMagnitude([3, 4])).toEqual(5);
			expect(getMagnitude([2, 3, 6])).toEqual(7);
			expect(getMagnitude([-1])).toEqual(1);
			expect(getMagnitude([0])).toEqual(0);
			expect(getMagnitude([NaN])).toEqual(NaN);
		});

		it('should allow an optional origin', () => {
			expect(getMagnitude([2], [1])).toEqual(1);
			expect(getMagnitude([4, 5], [1, 1])).toEqual(5);
			expect(getMagnitude([3, 4, 7], [1, 1, 1])).toEqual(7);
			expect(getMagnitude([-1], [2])).toEqual(3);
			expect(getMagnitude([3], [3])).toEqual(0);
		});
	});

	describe('fixVectorMagnitude', () => {
		it('should fix a vector to match given magnitude', () => {
			expect(fixVectorMagnitude([3, 4], 10)).toEqual([6, 8]);
			expect(fixVectorMagnitude([3, 4], -10)).toEqual([-6, -8]);
			expect(fixVectorMagnitude([0, 10])).toEqual([0, 1]);
		});
	});

	describe('containBox', () => {
		it('should return a scaled size', () => {
			expect(containBox([10, 10], [10, 10])).toEqual([10, 10]);
			expect(containBox([20, 10], [10, 20])).toEqual([10, 5]);
			expect(containBox([20, 10], [10, 20])).toEqual([10, 5]);
			expect(containBox([10, 10], [10, 20])).toEqual([10, 10]);
		});

		it('should take other dimensions', () => {
			expect(containBox([20], [10])).toEqual([10]);
			expect(containBox([20, 10, 30], [10, 20, 30])).toEqual([10, 5, 15]);
		});

		it('should allow an optional reducer', () => {
			const reducer = Math.max;
			expect(containBox([10, 10], [10, 10], reducer)).toEqual([10, 10]);
			expect(containBox([20, 10], [10, 20], reducer)).toEqual([40, 20]);
			expect(containBox([20, 10], [10, 20], reducer)).toEqual([40, 20]);
			expect(containBox([10, 10], [10, 20], reducer)).toEqual([20, 20]);
		});
	});

	describe('makeLinesFromPoly', () => {
		describe('makeLinesFromPoly', () => {
			it('should resolve lines from poly', () => {
				expect(makeLinesFromPoly([
					[1, 2],
					[3, 4],
					[5, 6],
				])).toEqual([
					[1, 2, 3, 4],
					[3, 4, 5, 6],
					[5, 6, 1, 2],
				]);
			});

			it('should take other dimensions', () => {
				expect(makeLinesFromPoly([
					[1], [3], [5],
				])).toEqual([
					[1, 3], [3, 5], [5, 1],
				]);
				expect(makeLinesFromPoly([
					[1, 2, 3],
					[3, 4, 5],
					[5, 6, 7],
				])).toEqual([
					[1, 2, 3, 3, 4, 5],
					[3, 4, 5, 5, 6, 7],
					[5, 6, 7, 1, 2, 3],
				]);
			});
		});
	});

	describe('averageWithWeight', () => {
		it('should average with weighted values', () => {
			expect(averageWithWeight(
				[[1, 2], [2, 3]],
			)).toEqual([1.6, 8]);
			expect(averageWithWeight(
				[{ a: 2, b: 3 }, { a: 4, b: 5 }],
				({ a, b }) => [a, b],
			)).toEqual([3.25, 26]);
		});
	});

	describe('groupNeighbors', () => {
		it('should group numbers into arrays', () => {
			expect(groupNeighbors([1, 2, 4, 5]))
				.toEqual([[1, 2], [4, 5]]);
			expect(groupNeighbors([2, 3, 2, 0, 1]))
				.toEqual([[2, 3, 2], [0, 1]]);
			expect(groupNeighbors([1, 2, 4, 7], 2))
				.toEqual([[1, 2, 4], [7]]);
			expect(groupNeighbors([1, 2, 4, 7], 4, v => v * 2))
				.toEqual([[1, 2, 4], [7]]);
			expect(groupNeighbors([]))
				.toEqual([]);
		});
	});
});
