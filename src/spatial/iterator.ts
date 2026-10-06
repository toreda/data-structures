import type {SpatialElement} from './element';
import type {SpatialGrid} from './grid';
import {type IterableType} from '../iterable/type';
import {type Iterator} from '../iterator';

/**
 * Iterates the items of a `SpatialHash` or `SpatialMap` in insertion order,
 * by following the links between elements. Holds no stack, and `next()`
 * allocates nothing: it returns the same result object each call, so read
 * `value` before calling `next()` again.
 *
 * @remarks
 * Removing the item just returned is safe, since the next element is found
 * before an item is returned. When that next element has been removed (or
 * recycled for another item) by the time `next()` runs, iteration ends
 * instead of yielding it. Items inserted during iteration join the end of
 * insertion order, and are visited only when the iterator has not yet
 * returned the item that was last before them. Use the data structure's `forEach()` to change it
 * freely while walking it.
 *
 * @category Spatial
 */
export class SpatialIterator<ItemT> implements Iterator<ItemT> {
	private readonly grid: SpatialGrid<ItemT>;
	private item: SpatialElement<ItemT> | null;
	/** Link id item had when it was found, so a recycled element is caught. */
	private linkId: number;
	/** Returned by every `next()` call, so iterating allocates nothing. */
	private readonly result: IterableType<ItemT | undefined>;

	constructor(grid: SpatialGrid<ItemT>) {
		this.grid = grid;
		this.item = grid.first();
		this.linkId = this.item !== null ? this.item._linkId : 0;
		this.result = {value: undefined, done: false};
	}

	public next(): IteratorResult<ItemT, undefined> {
		const item = this.item;
		const result = this.result;

		if (!item || item._grid !== this.grid || item._linkId !== this.linkId) {
			this.item = null;
			result.value = undefined;
			result.done = true;

			return result as IteratorResult<ItemT, undefined>;
		}

		const next = item._next;
		this.item = next;
		this.linkId = next !== null ? next._linkId : 0;

		result.value = item._value as ItemT;
		result.done = false;

		return result as IteratorResult<ItemT, undefined>;
	}
}
