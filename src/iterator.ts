/**
 * Base contract for data structures which return Iterators. Data structures may also
 * extend this contract to add implementation-specific data.
 *
 * @remarks
 * `next()` yields only items, so `for...of` and spread are typed as `ItemT`.
 * The final result is `{value: undefined, done: true}`, as for built-in
 * iterators.
 *
 * @category Base
 */
export interface Iterator<ItemT> {
	next: () => IteratorResult<ItemT, undefined>;
}
