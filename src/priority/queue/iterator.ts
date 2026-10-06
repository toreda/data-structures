import type {PriorityQueue} from '../queue';
import type {IterableType} from '../../iterable/type';
import type {Iterator} from '../../iterator';

/**
 * Iterates PriorityQueue items in heap array order, the order `values()` and
 * `forEach()` use. This is not priority order: only the first item is
 * guaranteed to be the front. Pop the queue to visit items by priority.
 *
 * @remarks
 * Every `next()` call returns the same result object, updated in place, so
 * iteration allocates only the iterator itself. Read `value` and `done`
 * before the next call; a stored result changes when iteration continues.
 * `PriorityQueue.forEach` allocates nothing at all and is the preferred walk
 * on a hot path. Don't push, pop, or delete while iterating.
 *
 * @category Priority Queue
 */
export class PriorityQueueIterator<ItemT> implements Iterator<ItemT> {
	/** Heap array index of the next item to visit. */
	private curr: number;
	private readonly queue: PriorityQueue<ItemT>;
	/** The queue's backing array. Never replaced, so holding it stays valid. */
	private readonly elements: readonly (ItemT | undefined)[];
	/** Result object reused by every `next()` call. */
	private readonly result: IterableType<ItemT | undefined>;

	/**
	 * @param queue		Queue to iterate.
	 * @param elements	The queue's backing array, in heap order. Only slots
	 * 					below `queue.size()` are read.
	 */
	constructor(queue: PriorityQueue<ItemT>, elements: readonly (ItemT | undefined)[]) {
		this.queue = queue;
		this.elements = elements;
		this.curr = 0;
		this.result = {value: undefined, done: false};
	}

	public next(): IteratorResult<ItemT, undefined> {
		const result = this.result;

		if (this.curr >= this.queue.size()) {
			result.value = undefined;
			result.done = true;
			return result as IteratorResult<ItemT, undefined>;
		}

		result.value = this.elements[this.curr] as ItemT;
		result.done = false;
		this.curr++;

		return result as IteratorResult<ItemT, undefined>;
	}
}
