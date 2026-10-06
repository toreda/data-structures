import type {RedBlackTree} from '../tree';
import type {RedBlackTreeElement} from './element';
import {type IterableType} from '../../../iterable/type';
import {type Iterator} from '../../../iterator';

/**
 * Iterates RedBlackTree items in sorted (in-order) order, smallest first, by
 * following successor links. Holds no stack, so memory use is constant.
 *
 * @remarks
 * Every `next()` call returns the same result object, updated in place, so
 * stepping allocates nothing. `for...of` and spread read each result before
 * the next step, so they are unaffected. Code calling `next()` by hand must
 * copy `value` before calling it again. The iterator itself is still one
 * allocation per loop; `RedBlackTree.forEach()` allocates nothing.
 *
 * @category Red Black Tree
 */
export class RedBlackTreeIterator<ItemT> implements Iterator<ItemT> {
	private readonly tree: RedBlackTree<ItemT>;
	private item: RedBlackTreeElement<ItemT> | null;
	/** Returned by every `next()` call, updated in place. */
	private readonly result: IterableType<ItemT | undefined>;

	constructor(tree: RedBlackTree<ItemT>) {
		this.tree = tree;
		this.item = tree.min();
		this.result = {value: undefined, done: false};
	}

	public next(): IteratorResult<ItemT, undefined> {
		const result = this.result;

		if (!this.item) {
			result.value = undefined;
			result.done = true;
			return result as IteratorResult<ItemT, undefined>;
		}

		result.value = this.item._value as ItemT;
		result.done = false;
		this.item = this.tree.successor(this.item);

		return result as IteratorResult<ItemT, undefined>;
	}
}
