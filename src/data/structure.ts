import {type Element} from '../element';
import {type Iterator} from '../iterator';
import {type QueryFilter} from '../query/filter';
import {type QueryOptions} from '../query/options';
import {type QueryResult} from '../query/result';

/**
 * Core interface every collection in this package implements. Byte encoding
 * is not part of this contract: see `ByteDataStructure`, implemented by the byte
 * subclass of each collection.
 *
 * @category Base
 */
export interface DataStructure<ItemT> {
	/**
	 * Iterate the items, so `for...of` and spread work on any collection. Each
	 * collection documents its order.
	 */
	[Symbol.iterator](): Iterator<ItemT>;
	/** Number of items held. For `ObjectPool`, the number of objects in use. */
	size(): number;
	/** True when `size()` is 0. */
	isEmpty(): boolean;
	clearElements(): void;
	reset(): void;
	stringify(): string | null;
	query(
		query: QueryFilter<ItemT> | QueryFilter<ItemT>[],
		options?: QueryOptions
	): QueryResult<ItemT>[] | QueryResult<Element<ItemT>, ItemT>[];
}
