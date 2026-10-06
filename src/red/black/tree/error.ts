/**
 * Reasons `RedBlackTree.lastError()` gives when `insert()` or `update()`
 * returns null instead of throwing.
 *
 * - `duplicate_not_allowed`: the item compares equal to one already in the
 *   tree, and the tree was built with `allowDuplicates: false`.
 * - `undefined_item`: the item is `undefined`, which is never stored. Only
 *   returned while `allowUndefinedItem` is on; when it is `false`, the insert
 *   throws instead.
 * - `node_not_in_tree`: the node passed to `update()` is null or not part of
 *   this tree.
 *
 * @category Red Black Tree
 */
export type RedBlackTreeError = 'duplicate_not_allowed' | 'undefined_item' | 'node_not_in_tree';
