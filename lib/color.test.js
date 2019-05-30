const {
	parseColor,
	rgbToHsl,
	hslToRgb,
	fadeColor,
} = require('./color');

const colorTests = [
	['#FF0000', [255, 0, 0], [0, 1, 0.5]], // Red
	['#00FF00', [0, 255, 0], [0.3333, 1, 0.5]], // Green
	['#0000FF', [0, 0, 255], [0.6667, 1, 0.5]], // Blue
	['#F44336', [244, 67, 54], [0.0114, 0.8962, 0.5843]], // Material Red
	['#E91E63', [233, 30, 99], [0.9433, 0.8219, 0.5157]], // Material Pink
	['#FFC107', [255, 193, 7], [0.125, 1, 0.5137]], // Material Amber
	['#8BC34A', [139, 195, 74], [0.2438, 0.5021, 0.5275]], // Material LightGreen
	['#4CAF50', [76, 175, 80], [0.3401, 0.3944, 0.4922]], // Material Green
	['#2196F3', [33, 150, 243], [0.5738, 0.8974, 0.5412]], // Material Blue
	['#9C27B0', [156, 39, 176], [0.809, 0.6372, 0.4216]], // Material Purple
	['#CCCCCC', [204, 204, 204], [0, 0, 0.8]],	// Material LightGrey
];

describe('color', () => {
	describe('parseColor', () => {
		it('should take rgb() format', () => {
			expect(parseColor('rgb(1,2,3)')).toEqual([1, 2, 3]);
			expect(parseColor('rgb(4, 5, 6)')).toEqual([4, 5, 6]);
		});

		it('should take rgba() format', () => {
			expect(parseColor('rgba(1,2,3,4)')).toEqual([1, 2, 3, 4]);
			expect(parseColor('rgba(4, 5, 6, 7)')).toEqual([4, 5, 6, 7]);
		});

		it('should take hex format', () => {
			expect(parseColor('#123')).toEqual([17, 34, 51]);
			expect(parseColor('#abc')).toEqual([170, 187, 204]);
			expect(parseColor('#abcf')).toEqual([170, 187, 204, 255]);
			expect(parseColor('#123456')).toEqual([18, 52, 86]);
			expect(parseColor('#1234cdef')).toEqual([18, 52, 205, 239]);
			colorTests.forEach(([hex, rgb]) => {
				expect(parseColor(hex)).toEqual(rgb);
			});
		});

		it('should fail to black', () => {
			expect(parseColor('')).toEqual([0, 0, 0]);
			expect(parseColor('123')).toEqual([0, 0, 0]);
		});
	});

	describe('rgbToHsl', () => {
		it('should convert to hsl', () => {
			colorTests.forEach(([hex, rgb, hsl]) => {
				expect(rgbToHsl(rgb).map(v => v.toFixed(4)))
					.toEqual(hsl.map(v => v.toFixed(4)));
				expect(rgbToHsl(hex).map(v => v.toFixed(3)))
					.toEqual(hsl.map(v => v.toFixed(3)));
			});
		});
	});

	describe('hslToRgb', () => {
		it('should convert to rgb', () => {
			colorTests.forEach(([hex, rgb, hsl]) => {
				expect(hslToRgb(hsl)).toEqual(rgb);
			});
		});

		it('should fix overflow hues', () => {
			expect(hslToRgb([-1, 1, 0.5])).toEqual([255, 0, 0]);
			expect(hslToRgb([2, 1, 0.5])).toEqual([255, 0, 0]);
		});
	});

	describe('fadeColor', () => {
		const red = [255, 0, 0];
		const green = [0, 255, 0];
		const blue = [0, 0, 255];
		const redGrey = [140, 115, 115];

		it('should fade to color using hsl', () => {
			expect(fadeColor(red, green, 0)).toEqual(red);
			expect(fadeColor(red, green, 0.5)).toEqual([255, 255, 0]);
			expect(fadeColor(red, green, 1)).toEqual(green);
			expect(fadeColor(blue, green, 0.5)).toEqual([0, 255, 255]);
			expect(fadeColor(red, blue, 0.5)).toEqual([255, 0, 255]);
			expect(fadeColor(redGrey, blue, 0.5)).toEqual([57, 57, 198]);
			expect(fadeColor(green, redGrey, 0.5)).toEqual([57, 198, 57]);
		});

		it('should take easing', () => {
			expect(fadeColor(red, green, 0.5, v => v / 2)).toEqual([255, 128, 0]);
		});
	});
});
