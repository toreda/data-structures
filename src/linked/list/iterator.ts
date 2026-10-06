import {LinkedList} from '../list';
import {LinkedListElement} from './element';
import {type IterableType} from '../../iterable/type';
import {type Iterator} from '../../iterator';

/**
 * Iterates LinkedList values head to tail.
 *
 * @remarks
 * `next()` allocates nothing: every call returns the same result object,
 * updated in place. Read `value` / `done` before calling `next()` again, as
 * `for...of` and spread do. Keeping a result object across calls sees it
 * change.
 *
 * @category Linked List
 */
export class LinkedListIterator<ItemT> implements Iterator<ItemT> {
	private item: LinkedListElement<ItemT> | null;
	/** Result returned by every `next()` call, reused to avoid allocation. */
	private readonly result: IterableType<ItemT | undefined>;

	constructor(linkedList: LinkedList<ItemT>) {
		this.item = linkedList.head();
		this.result = {value: undefined, done: false};
	}

	public next(): IteratorResult<ItemT, undefined> {
		const result = this.result;

		if (!this.item) {
			result.value = undefined;
			result.done = true;
			return result as IteratorResult<ItemT, undefined>;
		}

		result.value = this.item.value() as ItemT;
		result.done = false;
		this.item = this.item.next();

		return result as IteratorResult<ItemT, undefined>;
	}
}
