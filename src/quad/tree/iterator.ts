import type {QuadTree} from '../tree';
import type {QuadTreeElement} from './element';
import {type IterableType} from '../../iterable/type';
import {type Iterator} from '../../iterator';

/**
 * Iterates QuadTree items in pre-order, each node before its quadrants, by
 * following parent and child links. Holds no stack, so memory use is constant,
 * and `next()` allocates nothing: it returns the same result object each call,
 * so read `value` before calling `next()` again.
 *
 * @remarks
 * Not safe under mutation. Removal relinks whole subtrees, so removing or
 * moving items during iteration can skip or repeat items. The next node is
 * found ahead of time; when it has been removed (or recycled for another
 * item) by the time `next()` runs, iteration ends instead of yielding it. Use
 * `QuadTree.forEach()` to change the tree while walking it.
 *
 * @category Quad Tree
 */
export class QuadTreeIterator<ItemT> implements Iterator<ItemT> {
	private readonly tree: QuadTree<ItemT>;
	private item: QuadTreeElement<ItemT> | null;
	/** Link id item had when it was found, so a recycled node is caught. */
	private linkId: number;
	/** Returned by every `next()` call, so iterating allocates nothing. */
	private readonly result: IterableType<ItemT | undefined>;

	constructor(tree: QuadTree<ItemT>) {
		this.tree = tree;
		this.item = tree.root();
		this.linkId = this.item !== null ? this.item._linkId : 0;
		this.result = {value: undefined, done: false};
	}

	public next(): IteratorResult<ItemT, undefined> {
		const item = this.item;
		const result = this.result;

		if (!item || item._tree !== this.tree || item._linkId !== this.linkId) {
			this.item = null;
			result.value = undefined;
			result.done = true;

			return result as IteratorResult<ItemT, undefined>;
		}

		const next = this.tree.preOrderNext(item);
		this.item = next;
		this.linkId = next !== null ? next._linkId : 0;

		result.value = item._value as ItemT;
		result.done = false;

		return result as IteratorResult<ItemT, undefined>;
	}
}
