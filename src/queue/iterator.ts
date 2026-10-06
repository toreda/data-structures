import type {Queue} from '../queue';
import type {IterableType} from '../iterable/type';
import type {Iterator} from '../iterator';

/**
 * Iterates Queue items from front to rear.
 *
 * @remarks
 * Every `next()` call returns the same result object, updated in place, so
 * iteration allocates only the iterator itself. Read `value` and `done`
 * before the next call; a stored result changes when iteration continues.
 * `Queue.forEach` allocates nothing at all and is the preferred walk on a hot
 * path.
 *
 * @category Queue
 */
export class QueueIterator<ItemT> implements Iterator<ItemT> {
	/** Position from the front of the next item to visit. */
	public curr: number;
	public readonly queue: Queue<ItemT>;
	/** Result object reused by every `next()` call. */
	private readonly result: IterableType<ItemT | undefined>;

	constructor(queue: Queue<ItemT>) {
		this.queue = queue;
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

		result.value = this.queue.at(this.curr) as ItemT;
		result.done = false;
		this.curr++;

		return result as IteratorResult<ItemT, undefined>;
	}
}
