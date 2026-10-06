/**
 * Reasons `SpatialMap.lastError()` gives when `insert()` or `update()`
 * returns null instead of throwing.
 *
 * - `invalid_position`: the locator returned something other than an object
 *   with finite numeric `x`, `y`, and `z` fields, or a position whose cell
 *   coordinate on some axis lies outside the int32 range (see `cellSize`).
 * - `cell_occupied`: another item already holds the target cell, and the map
 *   was built without `overwrite`.
 * - `node_not_in_map`: the element passed to `update()` is null or not part
 *   of this map.
 *
 * @category Spatial Map
 */
export type SpatialMapError = 'invalid_position' | 'cell_occupied' | 'node_not_in_map';
