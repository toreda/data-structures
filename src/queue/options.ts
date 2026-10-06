import {type DataStructureOptions} from '../data/structure/options';

/**
 * Optional config provided to the Queue constructor. Options are always
 * optional: every entry falls back to its default when missing or invalid, and
 * invalid values never throw. Initial items are the constructor's `data`
 * argument, not an option.
 *
 * The pooling entries from `DataStructureOptions` have no effect: the queue
 * stores items directly in its ring buffer and allocates no element wrappers.
 *
 * @category Queue
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface QueueOptions<ItemT> extends DataStructureOptions {}
