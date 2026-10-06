/**
 * Optional config provided to the ObjectPool constructor. Options are always
 * optional: every entry falls back to its default when missing or invalid,
 * and invalid values never throw.
 *
 * @category Object Pool
 */
export interface ObjectPoolOptions {
	/**
	 * Whether the pool constructs more objects when it runs low, up to
	 * `maxSize`. Defaults to `true`. With `false`, `allocate()` returns null
	 * once the objects built so far are all in use.
	 */
	autoIncrease?: boolean;
	/**
	 * Share of objects in use, from 0 to 1, past which the pool grows when
	 * `autoIncrease` is on. Defaults to `1`: grow only when no free object is
	 * left.
	 */
	increaseBreakPoint?: number;
	/** Multiplier applied to the object count on each growth, greater than 1. Defaults to `2`. */
	increaseFactor?: number;
	/** Arguments passed to the class constructor for every object. Defaults to none. */
	instanceArgs?: unknown[];
	/** Most objects the pool ever constructs, an integer of 1 or more. Defaults to `1000`. */
	maxSize?: number;
	/** Objects constructed up front, an integer of 0 or more. Defaults to `1`. */
	startSize?: number;
}
