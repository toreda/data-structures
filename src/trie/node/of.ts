import type {TrieElement} from '../element';

/** Pick for `collect()` keeping the node itself, as `withPrefix()` returns. */
export function trieNodeOf<T>(node: TrieElement<T>): TrieElement<T> {
	return node;
}
