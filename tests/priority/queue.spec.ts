import {PriorityQueue} from '../../src/priority/queue';
import {PriorityQueueIterator} from '../../src/priority/queue/iterator';
import {comparatorFromBoolean} from '../../src/comparator/from/boolean';
import {type PriorityQueueOptions} from '../../src/priority/queue/options';

const repeat = (n: number, f: (n: number) => unknown) => {
	while (n-- > 0) {
		f(n);
	}
};

const INIT_VALUES = [90, 70, 50, 30, 10, 80, 60, 40, 20];
const loadQueue = (queue: PriorityQueue<any>) => repeat(9, (n: number) => queue.push(INIT_VALUES[8 - n]));

const comparator = function (a: number, b: number): number {
	if (typeof a !== 'number' || typeof b !== 'number') {
		return 0;
	}

	return a - b;
};

describe('PriorityQueue', () => {
	let instance: PriorityQueue<any>;

	beforeAll(() => {
		instance = new PriorityQueue(comparator);
	});

	beforeEach(() => {
		instance.reset();
		expect(instance.size()).toBe(0);
	});

	describe('INSTANTIATION', () => {
		it('default params', () => {
			const result = new PriorityQueue(comparator);
			expect(result).toBeInstanceOf(PriorityQueue);
			expect(result.size()).toBe(0);
		});

		it('with data and options', () => {
			const options: PriorityQueueOptions<any> = {allowUndefinedItem: true};
			const result = new PriorityQueue(comparator, [3, 1, 2], options);
			expect(result).toBeInstanceOf(PriorityQueue);
			expect(result.size()).toBe(3);
			expect(result.peek()).toBe(1);
		});

		it('ignores the removed elements option', () => {
			const result = new PriorityQueue(comparator, null, {elements: [1, 2, 3]} as any);
			expect(result.size()).toBe(0);
		});

		it('stringify queue', () => {
			instance.push(2).push(1);
			expect(instance.stringify()).toBe('{"type":"PriorityQueue","elements":[1,2]}');
		});

		it('stringify returns null instead of throwing', () => {
			const circular: any = {};
			circular.self = circular;
			const result = new PriorityQueue<any>(() => 0, [circular]);
			expect(() => result.stringify()).not.toThrow();
			expect(result.stringify()).toBeNull();

			result.reset();
			result.push(BigInt(1));
			expect(result.stringify()).toBeNull();
		});

		it('ignores the removed serializedState option', () => {
			const result = new PriorityQueue(comparator, null, {
				serializedState: '{"type":"PriorityQueue","elements":[4]}'
			} as any);
			expect(result.size()).toBe(0);
		});

		it('has no toBinary stub', () => {
			expect((new PriorityQueue(comparator) as any).toBinary).toBeUndefined();
		});

		it('invalid', () => {
			expect(() => {
				const result = new PriorityQueue(null as any);
				console.log(result);
			}).toThrow();
		});

		it('ignores non-array data instead of throwing', () => {
			expect(new PriorityQueue(comparator, 'adsf' as any).size()).toBe(0);
			expect(new PriorityQueue(comparator, {elements: [4]} as any).size()).toBe(0);
			expect(new PriorityQueue(comparator, null).size()).toBe(0);
		});
	});

	describe('HEAP INVARIANT', () => {
		const drain = (queue: PriorityQueue<number>): number[] => {
			const popped: number[] = [];
			while (!queue.isEmpty()) {
				popped.push(queue.pop() as number);
			}
			return popped;
		};

		it('heapifies small unsorted element sets on construction', () => {
			const result = new PriorityQueue<number>(comparator, [5, 1, 3]);
			expect(drain(result)).toEqual([1, 3, 5]);
		});

		it('heapifies larger unsorted element sets on construction', () => {
			const elements = [9, 4, 7, 1, 8, 2, 6, 3, 5, 0];
			const result = new PriorityQueue<number>(comparator, elements);
			expect(drain(result)).toEqual([...elements].sort((a, b) => a - b));
		});

		it('preserves heap order after query delete requiring sift up', () => {
			const elements = [0, 50, 1, 60, 70, 2, 3, 61, 62, 71, 72, 2.5];
			const result = new PriorityQueue<number>(comparator, elements);
			result.query((n) => n === 60)[0].delete();
			expect(drain(result)).toEqual(elements.filter((n) => n !== 60).sort((a, b) => a - b));
		});

		it('preserves heap order after query delete requiring sift down', () => {
			const elements = [1, 2, 10, 3, 4, 11, 12];
			const result = new PriorityQueue<number>(comparator, elements);
			result.query((n) => n === 2)[0].delete();
			expect(drain(result)).toEqual(elements.filter((n) => n !== 2).sort((a, b) => a - b));
		});

		it('preserves heap order after query delete of last element and root', () => {
			const result = new PriorityQueue<number>(comparator, [1, 2, 3]);
			result.query((n) => n === 3)[0].delete();
			result.query((n) => n === 1)[0].delete();
			expect(drain(result)).toEqual([2]);
		});
	});

	describe('EQUAL PRIORITIES', () => {
		const strict = (a: number, b: number): number => a - b;

		it('a heap of equal keys is already a heap', () => {
			const elements = [5, 5, 5, 5, 5, 5, 5];
			const spy = jest.fn(strict);
			const result = new PriorityQueue<number>(spy, elements);
			// isHeap passes with one comparison per non-root element; no heapify.
			expect(spy).toHaveBeenCalledTimes(elements.length - 1);
			expect(result.size()).toBe(elements.length);
		});

		it('pushing an equal key does not swap it upward', () => {
			const tagged = [
				{p: 1, id: 'a'},
				{p: 1, id: 'b'},
				{p: 1, id: 'c'}
			];
			const result = new PriorityQueue<{p: number; id: string}>((a, b) => a.p - b.p);
			tagged.forEach((t) => result.push(t));
			expect(result.peek()?.id).toBe('a');

			const order: string[] = [];
			result.forEach((t) => order.push(t.id));
			expect(order).toEqual(['a', 'b', 'c']);
		});

		it('pop does not sift an equal key down', () => {
			const result = new PriorityQueue<number>(strict, [1, 2, 2, 2, 2]);
			expect(result.pop()).toBe(1);
			const order: number[] = [];
			result.forEach((n) => order.push(n));
			// The last 2 moves to the root and stays there.
			expect(order).toEqual([2, 2, 2, 2]);
		});

		it('drains in priority order with many duplicates', () => {
			let seed = 7;
			const rand = (): number => {
				seed = (seed * 1103515245 + 12345) % 2147483648;
				return seed % 10;
			};
			const values: number[] = [];
			for (let i = 0; i < 200; i++) {
				values.push(rand());
			}

			const result = new PriorityQueue<number>(strict, values.slice(0, 100));
			values.slice(100).forEach((v) => result.push(v));
			result.query((v) => v === 3).forEach((r) => r.delete());

			const drained: number[] = [];
			while (!result.isEmpty()) {
				drained.push(result.pop() as number);
			}

			expect(drained).toEqual(values.filter((v) => v !== 3).sort((a, b) => a - b));
		});

		it('filter result is a heap with duplicates', () => {
			const result = new PriorityQueue<number>(strict, [4, 1, 3, 1, 2, 4, 3]);
			const filtered = result.filter((v) => v !== 2);
			const drained: number[] = [];
			while (!filtered.isEmpty()) {
				drained.push(filtered.pop() as number);
			}
			expect(drained).toEqual([1, 1, 3, 3, 4, 4]);
			expect(result.size()).toBe(7);
		});
	});

	describe('NULL ELEMENTS', () => {
		it('passes null to the comparator, which decides its rank', () => {
			const nullLast = (a: number | null, b: number | null): number => {
				if (a === null) return b === null ? 0 : 1;
				if (b === null) return -1;
				return a - b;
			};
			const result = new PriorityQueue<number | null>(nullLast, [null, 5, null, 2, 8]);
			result.push(null).push(1);

			const drained: (number | null)[] = [];
			while (!result.isEmpty()) {
				drained.push(result.pop());
			}
			expect(drained).toEqual([1, 2, 5, 8, null, null, null]);
		});
	});

	describe('NO HIDDEN ALLOCATION', () => {
		it('push and pop build no child index objects', () => {
			const strict = (a: number, b: number): number => a - b;
			const result = new PriorityQueue<number>(strict, [9, 8, 7, 6, 5, 4, 3, 2, 1]);
			const proto = Object.getPrototypeOf(result);
			expect(proto.getChildren).toBeUndefined();
			expect(proto.getNext).toBeUndefined();
			expect(result.pop()).toBe(1);
			expect(result.pop()).toBe(2);
		});

		it('clearElements keeps the backing array', () => {
			loadQueue(instance);
			const backing: unknown = (instance as any)._elements;

			instance.clearElements();
			expect(instance.size()).toBe(0);
			instance.push(4);

			expect((instance as any)._elements).toBe(backing);
			expect(instance.peek()).toBe(4);
		});

		it('forEach passes the queue itself as the third argument', () => {
			loadQueue(instance);
			const thirds: unknown[] = [];
			instance.forEach((_e, _i, queue) => {
				thirds.push(queue);
			});

			expect(thirds.length).toBe(instance.size());
			for (const third of thirds) {
				expect(third).toBe(instance);
			}
		});

		it('filter passes the queue itself as the third argument', () => {
			loadQueue(instance);
			const thirds: unknown[] = [];
			const indexes: number[] = [];
			instance.filter((_e, i, queue) => {
				thirds.push(queue);
				indexes.push(i);
				return true;
			});

			expect(thirds.length).toBe(instance.size());
			expect(indexes).toEqual(thirds.map((_t, i) => i));
			for (const third of thirds) {
				expect(third).toBe(instance);
			}
		});

		it('forEach third argument never exposes spare backing slots', () => {
			const queue = new PriorityQueue<number>((a, b) => a - b, [5, 4, 3, 2, 1]);
			queue.pop();
			queue.pop();

			const seen: PriorityQueue<number>[] = [];
			queue.forEach((v, _i, q) => {
				seen.push(q);
				expect(v).not.toBeUndefined();
				expect(q.size()).toBe(3);
			});

			expect(seen).toEqual([queue, queue, queue]);
		});

		it('forEach and filter use thisArg as passed, undefined when omitted', () => {
			const queue = new PriorityQueue<number>((a, b) => a - b, [2, 1]);
			const context = {};
			const seen: unknown[] = [];
			const record = function (this: unknown): boolean {
				seen.push(this);
				return true;
			};

			queue.forEach(record);
			queue.filter(record);
			expect(seen).toEqual([undefined, undefined, undefined, undefined]);

			seen.length = 0;
			queue.forEach(record, context);
			queue.filter(record, 0);
			expect(seen).toEqual([context, context, 0, 0]);
		});

		it('forEach does not call Array.prototype.forEach', () => {
			loadQueue(instance);
			const spy = jest.spyOn(Array.prototype, 'forEach');
			try {
				let count = 0;
				instance.forEach(() => {
					count++;
				});
				expect(count).toBe(9);
				expect(spy).not.toHaveBeenCalled();
			} finally {
				spy.mockRestore();
			}
		});
	});

	describe('CAPACITY', () => {
		const strict = (a: number, b: number): number => a - b;
		const backingOf = <T>(queue: PriorityQueue<T>): (T | undefined)[] => (queue as any)._elements;

		it('pop keeps the backing array at its high-water length', () => {
			const queue = new PriorityQueue<number>(strict);
			repeat(1000, (n) => queue.push(n));

			for (let i = 0; i < 990; i++) {
				expect(queue.pop()).toBe(i);
			}

			expect(queue.size()).toBe(10);
			expect(backingOf(queue).length).toBe(1000);
		});

		it('clearElements and reset keep the high-water length', () => {
			const queue = new PriorityQueue<number>(strict);
			repeat(500, (n) => queue.push(n));

			queue.clearElements();
			expect(queue.size()).toBe(0);
			expect(backingOf(queue).length).toBe(500);

			repeat(200, (n) => queue.push(n));
			queue.reset();
			expect(backingOf(queue).length).toBe(500);
		});

		it('drops references to popped, deleted, and cleared elements', () => {
			type Item = {p: number};
			const byP = (a: Item, b: Item): number => a.p - b.p;
			const items: Item[] = [{p: 1}, {p: 2}, {p: 3}, {p: 4}];
			const queue = new PriorityQueue<Item>(byP, items);

			expect(queue.pop()).toBe(items[0]);
			expect(backingOf(queue)).not.toContain(items[0]);
			expect(backingOf(queue)[3]).toBeUndefined();

			expect(queue.query((v) => v === items[2])[0].delete()).toBe(items[2]);
			expect(backingOf(queue)).not.toContain(items[2]);
			expect(backingOf(queue).length).toBe(4);
			expect(queue.size()).toBe(2);

			queue.clearElements();
			expect(backingOf(queue).every((slot) => slot === undefined)).toBe(true);
		});

		it('ignores spare slots in every read', () => {
			const queue = new PriorityQueue<number>(strict, [5, 1, 4, 2, 3]);
			queue.pop();
			queue.pop();

			expect(queue.size()).toBe(3);
			expect(queue.peek()).toBe(3);
			expect([...queue.values()].sort()).toEqual([3, 4, 5]);
			expect(queue.stringify()).toBe(
				`{"type":"PriorityQueue","elements":${JSON.stringify(queue.values())}}`
			);

			let count = 0;
			queue.forEach((v) => {
				expect(v).not.toBeUndefined();
				count++;
			});
			expect(count).toBe(3);
			expect(queue.filter(() => true).size()).toBe(3);
			expect(queue.query(() => true).length).toBe(3);
			expect(queue.query((v) => v === undefined).length).toBe(0);
		});

		it('gives correct results over repeated fill and drain cycles', () => {
			const queue = new PriorityQueue<number>(strict);

			for (let cycle = 0; cycle < 6; cycle++) {
				const count = cycle % 2 === 0 ? 64 : 17;
				const values: number[] = [];

				for (let i = 0; i < count; i++) {
					values.push((i * 37 + cycle * 11) % 101);
				}

				values.forEach((v) => queue.push(v));
				expect(queue.size()).toBe(count);

				const out: number[] = [];
				while (!queue.isEmpty()) {
					out.push(queue.pop() as number);
				}

				expect(out).toEqual(values.sort((a, b) => a - b));
				expect(queue.pop()).toBeNull();
				expect(backingOf(queue).length).toBe(64);
			}
		});

		it('heapifies only the live elements after a drain', () => {
			const queue = new PriorityQueue<number>(strict);
			repeat(20, (n) => queue.push(n));
			repeat(15, () => queue.pop());

			// Spare slots hold undefined; heapify and filter must never compare them.
			const seen = jest.fn(strict);
			const guarded = new PriorityQueue<number>(seen);
			repeat(20, (n) => guarded.push(n));
			repeat(15, () => guarded.pop());
			seen.mockClear();
			guarded.heapify();
			guarded.filter(() => true);
			for (const [a, b] of seen.mock.calls) {
				expect(a).not.toBeUndefined();
				expect(b).not.toBeUndefined();
			}
			expect(queue.values().sort((a, b) => a - b)).toEqual([15, 16, 17, 18, 19]);
		});
	});

	describe('PUSH/POP', () => {
		it('maintain heap', () => {
			expect(instance.peek()).toBeNull();

			([null, 95, 73, 84, null, 62, 40, 51, null, 99] as any).forEach((v, i, a) => {
				const smallestL = a.slice(0, i + 1).sort((a, b) => {
					if (b == null) return a;
					if (a == null) return b;
					return a - b;
				});
				const smallest = smallestL[0];
				instance.push(v);
				expect(instance.peek()).toBe(smallest);
			});

			let gettingBigger = instance.peek();

			while (!instance.isEmpty()) {
				if (instance.peek()) {
					expect(instance.peek()).toBeGreaterThanOrEqual(gettingBigger);
				}
				instance.pop();
				gettingBigger = instance.peek();
			}

			instance.pop();

			[50, null, 99, null].forEach((v) => {
				instance.push(v);
				expect(instance.peek()).toBe(50);
			});

			instance.pop();
		});
	});

	describe('ARRAY LIKE USAGE', () => {
		let lowToHigh: number[];

		beforeAll(() => {
			lowToHigh = [];
		});
		beforeEach(() => {
			loadQueue(instance);
		});

		it('forEach', () => {
			instance.forEach((e) => {
				lowToHigh.push(e);
			}, instance);

			lowToHigh.sort((a, b) => a - b);

			lowToHigh.forEach((e) => {
				expect(e).toBe(instance.peek());
				instance.pop();
			});
		});

		it('filter', () => {
			repeat(5, () => instance.push('random string - ' + Math.random().toString()));

			const strings = instance.filter((e) => typeof e === 'string', instance);
			const numbers = instance.filter((e) => typeof e === 'number');

			expect(strings.size()).toBe(5);
			expect(numbers.size()).toBe(9);

			strings.forEach((e) => {
				expect(e).toContain('random string - ');
			});
		});
	});

	describe('QUERY', () => {
		beforeEach(() => {
			loadQueue(instance);
		});

		it('array of matches', () => {
			instance.push(null);
			const above = instance.query((value) => (value as number) > 55);
			const below = instance.query((value) => (value as number) < 55);

			expect(above.length + below.length).toBe(instance.size());

			expect(
				above.every((res) => {
					const value = res.element as number;
					return value > 55;
				})
			).toBe(true);

			expect(
				below.every((res) => {
					const value = res.element as number;
					return value < 55;
				})
			).toBe(true);
		});

		it('stops visiting elements once the limit is reached', () => {
			const filter = jest.fn(() => true);
			const results = instance.query(filter, {limit: 2});
			expect(results.length).toBe(2);
			expect(filter).toHaveBeenCalledTimes(2);
		});

		it('an empty filter array matches nothing', () => {
			expect(instance.query([])).toEqual([]);
		});

		it('array filters stop at the first failing filter', () => {
			const second = jest.fn(() => true);
			expect(instance.query([() => false, second])).toEqual([]);
			expect(second).not.toHaveBeenCalled();
		});

		it('results share one key function', () => {
			const results = instance.query(() => true, {limit: 2});
			expect(results[0].key).toBe(results[1].key);
		});

		it('using queries', () => {
			instance.push(null);
			const queryLimit = 1;
			const queries = instance.query([(v) => typeof v === 'number', (v) => !!v], {limit: queryLimit});
			const queryLength = queries.length;
			const instanceSize = instance.size();
			expect(queries.length).toBe(Math.min(instanceSize, queryLimit));

			const queryToDelete = queries[0];
			expect(queryToDelete.key()).toBeNull();
			expect(queryToDelete.index()).not.toBeNull();
			queryToDelete.delete();
			expect(queries.length).toBe(queryLength);
			expect(instance.size()).toBe(instanceSize - 1);
			queryToDelete.delete();

			instance.reset();
			instance.push(30);
			instance.query((v) => v === 30)[0].delete();
			expect(instance.size()).toBe(0);
		});
	});

	describe('COMPARATOR', () => {
		const drainAll = <T>(queue: PriorityQueue<T>): T[] => {
			const popped: T[] = [];
			while (!queue.isEmpty()) {
				popped.push(queue.pop() as T);
			}
			return popped;
		};

		it('pops in Array.prototype.sort order for the same comparator', () => {
			const items = [5, 1, 9, 3, 7, 3, 0, 8];
			const byNumber = (a: number, b: number): number => a - b;

			expect(drainAll(new PriorityQueue<number>(byNumber, items))).toEqual([...items].sort(byNumber));
		});

		it('makes a max-heap with a reversed comparator', () => {
			const queue = new PriorityQueue<number>((a, b) => b - a, [5, 1, 9, 3]);

			expect(drainAll(queue)).toEqual([9, 5, 3, 1]);
		});

		it('accepts a boolean comparator through comparatorFromBoolean', () => {
			const minFirst = comparatorFromBoolean((a: number, b: number) => a < b);
			const queue = new PriorityQueue<number>(minFirst, [5, 1, 9, 3]);

			expect(drainAll(queue)).toEqual([1, 3, 5, 9]);
		});
	});

	describe('ITERATOR', () => {
		const byNumber = (a: number, b: number): number => a - b;

		it('visits every item in heap array order with for of and spread', () => {
			const queue = new PriorityQueue<number>(byNumber, [5, 1, 4, 2, 3]);
			const visited: number[] = [];

			for (const item of queue) {
				visited.push(item);
			}

			expect(visited).toEqual(queue.values());
			expect([...queue]).toEqual(queue.values());
			expect(visited[0]).toBe(1);
		});

		it('matches forEach order', () => {
			const queue = new PriorityQueue<number>(byNumber, [8, 3, 6, 1, 7]);
			const order: number[] = [];
			queue.forEach((item) => order.push(item));

			expect([...queue]).toEqual(order);
		});

		it('ends with an undefined value and reuses one result object', () => {
			const queue = new PriorityQueue<number>(byNumber, [2]);
			const iterator = queue[Symbol.iterator]();

			expect(iterator).toBeInstanceOf(PriorityQueueIterator);
			const first = iterator.next();
			expect(first).toEqual({value: 2, done: false});
			const end = iterator.next();
			expect(end).toBe(first);
			expect(end).toEqual({value: undefined, done: true});
		});

		it('visits nothing for an empty or drained queue', () => {
			const queue = new PriorityQueue<number>(byNumber, [3, 1, 2]);
			queue.pop();
			queue.pop();
			queue.pop();

			expect([...queue]).toEqual([]);
			expect([...new PriorityQueue<number>(byNumber)]).toEqual([]);
		});

		it('skips spare slots left by pops', () => {
			const queue = new PriorityQueue<number>(byNumber, [4, 3, 2, 1]);
			queue.pop();

			expect([...queue].sort(byNumber)).toEqual([2, 3, 4]);
		});
	});
});
