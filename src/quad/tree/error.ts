/**
 * Reasons `QuadTree.lastError()` gives when `insert()` or `update()` returns
 * null instead of throwing.
 *
 * - `invalid_position`: the locator returned something other than an object
 *   with finite numeric `x` and `y` fields.
 * - `duplicate_not_allowed`: an item already sits at exactly the same
 *   position, and the tree was built with `allowDuplicates: false`.
 * - `node_not_in_tree`: the node passed to `update()` is null or not part of
 *   this tree.
 *
 * @category Quad Tree
 */
export type QuadTreeError = 'invalid_position' | 'duplicate_not_allowed' | 'node_not_in_tree';
