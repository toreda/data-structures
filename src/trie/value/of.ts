import type {TrieElement} from '../element';

/** Pick for `collect()` reading the node's item, as `values()` returns. */
export function trieValueOf<T>(node: TrieElement<T>): T {
	return node._value as T;
}
