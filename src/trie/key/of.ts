import type {TrieElement} from '../element';

/** Pick for `collect()` reading the node's key, as `keysWithPrefix()` returns. */
export function trieKeyOf<T>(node: TrieElement<T>): string {
	return node._key as string;
}
