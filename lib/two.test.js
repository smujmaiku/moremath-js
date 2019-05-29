const {
	roundAll,
} = require('./common');
const {
	rotate,
	rotatePoly,
	rotateLine,
	angleFromVector,
	rayTraceLine,
	rayTracePoly,
	isInsidePoly,
} = require('./two');

describe('utils/poly', () => {
	describe('rotate', () => {
		it('should rotate a point', () => {
			const angle = Math.PI / 2;
			expect(roundAll(rotate([1, 0], angle), -10)).toEqual([0, 1]);
			expect(roundAll(rotate([0, 1], angle), -10)).toEqual([-1, 0]);
			expect(roundAll(rotate([-1, 0], angle), -10)).toEqual([0, -1]);
			expect(roundAll(rotate([0, -1], angle), -10)).toEqual([1, 0]);
		});

		it('should rotate around a center', () => {
			const angle = Math.PI / 2;
			const center = [1, 1];
			expect(roundAll(rotate([1, 0], angle, center), -10)).toEqual([2, 1]);
			expect(roundAll(rotate([0, 1], angle, center), -10)).toEqual([1, 0]);
			expect(roundAll(rotate([-1, 0], angle, center), -10)).toEqual([2, -1]);
			expect(roundAll(rotate([0, -1], angle, center), -10)).toEqual([3, 0]);
		});
	});

	describe('rotatePoly', () => {
		it('should rotate a poly', () => {
			const poly = [[1, 2], [3, 4]];
			const angle = Math.PI / 2;
			const center = [1, 1];
			expect(roundAll(rotatePoly(poly, angle), -10))
				.toEqual([[-2, 1], [-4, 3]]);
			expect(roundAll(rotatePoly(poly, angle, center), -10))
				.toEqual([[0, 1], [-2, 3]]);
		});
	});

	describe('rotateLine', () => {
		it('should rotate a line', () => {
			const line = [1, 2, 3, 4];
			const angle = Math.PI / 2;
			const center = [1, 1];
			expect(roundAll(rotateLine(line, angle), -10))
				.toEqual([-2, 1, -4, 3]);
			expect(roundAll(rotateLine(line, angle, center), -10))
				.toEqual([0, 1, -2, 3]);
		});
	});

	describe('angleFromVector', () => {
		it('should determine angle in radians', () => {
			expect(angleFromVector([1, 0])).toEqual(0);
			expect(angleFromVector([1, 1])).toEqual(Math.PI / 4);
			expect(angleFromVector([0, 1])).toEqual(Math.PI / 2);
			expect(angleFromVector([-1, 1])).toEqual(Math.PI * 3 / 4);
			expect(angleFromVector([-1, 0])).toEqual(Math.PI);
			expect(angleFromVector([-1, -1])).toEqual(Math.PI * 5 / 4);
			expect(angleFromVector([0, -1])).toEqual(Math.PI * 3 / 2);
			expect(angleFromVector([1, -1])).toEqual(Math.PI * 7 / 4);
			expect(angleFromVector([5, 5])).toEqual(Math.PI / 4);
		});

		it('should take an optional origin', () => {
			expect(angleFromVector([2, 1], [1, 1])).toEqual(0);
			expect(angleFromVector([2, 2], [1, 1])).toEqual(Math.PI / 4);
		});
	});

	describe('rayTraceLine', () => {
		it('should detect intersection', () => {
			expect(rayTraceLine([0, 0, 2, 0], [1, -1])).toEqual([1, 0.5, 1]);
			expect(rayTraceLine([0, 0, 2, 0], [-1, -1])).toEqual([NaN, NaN, 1]);
			expect(rayTraceLine([0, 0, 2, 0], [1, 1])).toEqual([NaN, NaN, 1]);
			expect(rayTraceLine([0, 0, 0, 2], [0, 3])).toEqual([NaN, NaN, 0]);
			expect(rayTraceLine([0, 0, 2, 1], [1, 1])).toEqual([NaN, NaN, 1]);
		});

		it('should return distance', () => {
			expect(rayTraceLine([0, -1, 2, 1], [1, -1])).toEqual([1, 0.5, 1]);
			expect(rayTraceLine([0, 0, 2, 1], [1, 0])).toEqual([0.5, 0.5, 1]);
			expect(rayTraceLine([0, 0, 2, 1], [1, -1])).toEqual([1.5, 0.5, 1]);
			expect(rayTraceLine([0, 0, 0, 2], [0, 0])).toEqual([0, 0, 0]);
			expect(rayTraceLine([0, 0, 0, 2], [0, -1])).toEqual([1, 0, 0]);
		});

		it('should return along', () => {
			expect(rayTraceLine([0, 0, 2, 0], [1.5, -1])).toEqual([1, 0.75, 1]);
			expect(rayTraceLine([0, 0, 2, 1], [0.5, -1])).toEqual([1.25, 0.25, 1]);
			expect(rayTraceLine([0, 0, 0, 2], [0, 1])).toEqual([0, 0.5, 0]);
			expect(rayTraceLine([0, 2, 0, 0], [0, 0])).toEqual([0, 1, 0]);
			expect(rayTraceLine([0, 2, 0, 0], [0, -1])).toEqual([1, 1, 0]);
		});

		it('should return direction', () => {
			expect(rayTraceLine([0, 0, 0, 0], [0, -1])).toEqual([1, 0, 0]);
			expect(rayTraceLine([2, 0, 0, 0], [1, -1])).toEqual([1, 0.5, -1]);
		});

		it('should take vector', () => {
			expect(roundAll(rayTraceLine([0, 0, 1, 1], [1, 0], [-1, 1]), -10))
				.toEqual([0.5, 0.5, 1]);
		});
	});

	describe('rayTracePoly', () => {
		it('should detect intersections', () => {
			const poly = [[0, 0], [2, 0], [1, 1], [0, 1]];
			const vector = [-1, 1];
			expect(rayTracePoly(poly, [1, 0])).toEqual([
				[0, 0.5, 1], [1, 1, -1], [1, 0, -1], [NaN, NaN, 0],
			]);
			expect(roundAll(rayTracePoly(poly, [2, -1], vector), -10)).toEqual([
				[1, 0.5, 1], [NaN, NaN, 0], [2, 1, -1], [NaN, NaN, -1],
			]);
		});
	});

	describe('isInsidePoly', () => {
		it('should detect if a point is inside the poly', () => {
			const poly = [[0, 0], [2, 0], [1, 1], [0, 1]];
			expect(isInsidePoly(poly, [0, 0])).toEqual(true);
			expect(isInsidePoly(poly, [1, 0])).toEqual(true);
			expect(isInsidePoly(poly, [1, 0.5])).toEqual(true);
			expect(isInsidePoly(poly, [0, 2])).toEqual(false);
			expect(isInsidePoly(poly, [1, -1])).toEqual(false);
			expect(isInsidePoly(poly, [1, 2])).toEqual(false);
		});
	});
});
