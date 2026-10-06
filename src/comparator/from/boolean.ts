/**
 * Convert a boolean "a comes first" function, the `PriorityQueue` comparator
 * shape of earlier versions, into the three-way comparator every ordered
 * collection takes.
 *
 * @remarks
 * The result calls `before` up to twice per comparison: `before(a, b)` and,
 * when that is false, `before(b, a)` to tell "after" from "equal". `before`
 * must be strict (`a < b`, not `a <= b`), or equal items compare as ordered.
 * For hot paths, write the three-way comparator directly.
 *
 * @param before	Returns true when a must come strictly before b.
 * @returns			Comparator returning -1 when a comes first, 1 when b does,
 * 					and 0 when neither does.
 * @throws			When before is not a function.
 *
 * @category Base
 */
export function comparatorFromBoolean<ItemT>(
	before: (a: ItemT, b: ItemT) => boolean
): (a: ItemT, b: ItemT) => number {
	if (typeof before !== 'function') {
		throw new Error('comparatorFromBoolean requires a function');
	}

	return (a: ItemT, b: ItemT): number => {
		if (before(a, b)) {
			return -1;
		}

		return before(b, a) ? 1 : 0;
	};
}
