/**
 * Reasons `SpatialHash.lastError()` gives when `insert()` or `update()`
 * returns null instead of throwing.
 *
 * - `invalid_position`: the locator returned something other than an object
 *   with finite numeric `x`, `y`, and `z` fields, or a position whose cell
 *   coordinate on some axis lies outside the int32 range (see `cellSize`).
 * - `node_not_in_hash`: the element passed to `update()` is null or not part
 *   of this hash.
 *
 * @category Spatial Hash
 */
export type SpatialHashError = 'invalid_position' | 'node_not_in_hash';
