import {comparatorFromBoolean} from '../../../src/comparator/from/boolean';

describe('comparatorFromBoolean', () => {
	const before = (a: number, b: number): boolean => a < b;

	it('returns -1, 1, or 0 from a strict boolean comparator', () => {
		const compare = comparatorFromBoolean(before);

		expect(compare(1, 2)).toBe(-1);
		expect(compare(2, 1)).toBe(1);
		expect(compare(2, 2)).toBe(0);
	});

	it('sorts like the boolean comparator orders', () => {
		const items = [5, 1, 9, 3, 7, 3];

		expect([...items].sort(comparatorFromBoolean(before))).toEqual([1, 3, 3, 5, 7, 9]);
	});

	it('calls the boolean comparator once when a comes first', () => {
		const spy = jest.fn(before);
		comparatorFromBoolean(spy)(1, 2);

		expect(spy).toHaveBeenCalledTimes(1);
		expect(spy).toHaveBeenCalledWith(1, 2);
	});

	it('throws when not given a function', () => {
		expect(() => comparatorFromBoolean(null as any)).toThrow();
	});
});
