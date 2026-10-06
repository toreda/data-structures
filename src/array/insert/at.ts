/** Insert value at index, shifting later entries up. Unlike `splice`, allocates no result array. */
export function arrayInsertAt<T>(arr: T[], index: number, value: T): void {
	for (let i = arr.length; i > index; i--) {
		arr[i] = arr[i - 1];
	}

	arr[index] = value;
}
