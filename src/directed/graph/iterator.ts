import type {DirectedGraphVertex} from './vertex';
import {type IterableType} from '../../iterable/type';
import {type Iterator} from '../../iterator';

/**
 * Iterates DirectedGraph items in vertex insertion order. Reads the graph's
 * vertex set as it goes, so no copy of the vertices is made.
 *
 * @remarks
 * Every `next()` call returns the same result object, updated in place, so
 * read `value` before calling `next()` again (`for...of` and spread already
 * do). The underlying `Set` iterator is still created per loop, and the engine
 * may allocate its own step results. `DirectedGraph.forEach()` is the
 * non-allocating way to visit every vertex.
 *
 * @category Directed Graph
 */
export class DirectedGraphIterator<ItemT> implements Iterator<ItemT> {
	private readonly source: Iterator<DirectedGraphVertex<ItemT>>;
	/** Result object reused by every `next()` call. */
	private readonly result: IterableType<ItemT | undefined>;

	/**
	 * @param source	Iterator over the graph's vertices, in insertion order.
	 */
	constructor(source: Iterator<DirectedGraphVertex<ItemT>>) {
		this.source = source;
		this.result = {value: undefined, done: false};
	}

	public next(): IteratorResult<ItemT, undefined> {
		const step = this.source.next();

		if (step.done) {
			this.result.value = undefined;
			this.result.done = true;
		} else {
			this.result.value = step.value._value as ItemT;
			this.result.done = false;
		}

		return this.result as IteratorResult<ItemT, undefined>;
	}
}
