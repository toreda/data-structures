import type {BinarySearchTree} from '../tree';
import type {BinarySearchTreeElement} from './element';
import {type IterableType} from '../../../iterable/type';
import {type Iterator} from '../../../iterator';

/**
 * Iterates BinarySearchTree items in sorted (in-order) order, smallest first,
 * by following successor links. Holds no stack, so memory use is constant.
 *
 * @remarks
 * `next()` allocates nothing: every call returns the same result object,
 * updated in place. Read `value` / `done` before calling `next()` again, as
 * `for...of` and spread do. Keeping a result object across calls sees it
 * change.
 *
 * @category Binary Search Tree
 */
export class BinarySearchTreeIterator<ItemT> implements Iterator<ItemT> {
	private readonly tree: BinarySearchTree<ItemT>;
	private item: BinarySearchTreeElement<ItemT> | null;
	/** Result returned by every `next()` call, reused to avoid allocation. */
	private readonly result: IterableType<ItemT | undefined>;

	constructor(tree: BinarySearchTree<ItemT>) {
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
