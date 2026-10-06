/** Remove the entry at index, shifting later entries down. Unlike `splice`, allocates no result array. */
export function arrayRemoveAt<T>(arr: T[], index: number): void {
	for (let i = index + 1; i < arr.length; i++) {
		arr[i - 1] = arr[i];
	}

	arr.pop();
}
