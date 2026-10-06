/**
 * Three-way comparison used to order a `PriorityQueue`, following the
 * `Array.prototype.sort` convention and the same shape as the tree
 * comparators: negative when a is closer to the front than b, positive when a
 * is further back, zero when they have equal priority. `(a, b) => a - b` makes
 * a min-heap and `(a, b) => b - a` a max-heap. Must be consistent: the same
 * pair always compares the same way while both are in the queue.
 *
 * A boolean "a comes first" function from older versions can be converted
 * with `comparatorFromBoolean()`.
 *
 * @category Priority Queue
 */
export interface PriorityQueueComparator<ItemT> {
	(a: ItemT, b: ItemT): number;
}
