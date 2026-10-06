import type {QueryResult} from '../../query/result';
import type {Trie} from '../../trie';
import type {TrieElement} from '../element';

/**
 * Single `query()` match. One shared class, so each match allocates one
 * object and no bound functions: `key`, `index`, and `delete` are prototype
 * methods, so call them on the result rather than detaching them.
 */
export class TrieQueryResult<ItemT> implements QueryResult<TrieElement<ItemT>, ItemT> {
	public readonly element: TrieElement<ItemT>;
	private readonly trie: Trie<ItemT>;
	/** Link id of the matched item when it matched. */
	private readonly linkId: number;
	/** Key of the matched item, kept after the item is removed or replaced. */
	private readonly matchedKey: string | null;

	constructor(trie: Trie<ItemT>, element: TrieElement<ItemT>) {
		this.trie = trie;
		this.element = element;
		this.linkId = element._linkId;
		this.matchedKey = element._key;
	}

	/** Key of the matched item, even after it is removed. */
	public key(): string | null {
		return this.matchedKey;
	}

	/** Always null: a trie orders items by key, not by index. */
	public index(): number | null {
		return null;
	}

	/**
	 * Remove the matched item, but only while the element still holds it.
	 * Removing or replacing the item changes its link id, so a stale result
	 * deletes nothing instead of a later item.
	 */
	public delete(): ItemT | null {
		if (this.element._linkId !== this.linkId) {
			return null;
		}

		return this.trie.removeNode(this.element);
	}
}
