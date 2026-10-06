/**
 * Reasons `Trie.lastError()` gives when `insert()` or `update()` returns null
 * instead of throwing.
 *
 * - `invalid_key`: the key selector returned something other than a string
 *   for the item.
 * - `undefined_item`: the item was undefined and `allowUndefinedItem` is on,
 *   so the call was skipped as a no-op. The key selector is never called for
 *   an undefined item. With the option off, these methods throw instead.
 * - `node_not_in_trie`: the node passed to `update()` is null, holds no item,
 *   or is not part of this trie.
 *
 * @category Trie
 */
export type TrieError = 'invalid_key' | 'undefined_item' | 'node_not_in_trie';
