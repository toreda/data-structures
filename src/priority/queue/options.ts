import {type DataStructureOptions} from '../../data/structure/options';

/**
 * Optional config provided to the PriorityQueue constructor. Options are
 * always optional, so nothing here is ever required. Initial elements are the
 * constructor's `data` argument, not an option.
 *
 * The pooling entries from `DataStructureOptions` have no effect: the queue
 * stores items directly in its heap array and allocates no element wrappers.
 *
 * @category Priority Queue
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface PriorityQueueOptions<ItemT> extends DataStructureOptions {}
