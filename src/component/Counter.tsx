import React from 'react';
import { counter } from '../libs/store';
import { createRoot, useRootStore } from '../libs/store-hooks';

export function sleep(interval: number) {
	const start = Date.now();
	while (Date.now() - start <= interval * 1000) {}
}

const root = createRoot(counter);
root.autorun(() => {
	console.log(root.get().count);
});
export const Counter = () => {
	const [counterStore, revoke] = useRootStore(root);
	// const DoubleCounter = useMemo(
	// 	() => 2 * counterStore.count,
	// 	[counterStore.count]
	// );

	return (
		<div>
			{counterStore.count}
			<button
				onClick={() => {
					for (let i = 0; i < 2; ++i) {
						counterStore.count++;
						//console.log('change');
					}
				}}
			>
				+
			</button>
			<button
				onClick={() => {
					revoke();
				}}
			>
				revoke
			</button>
		</div>
	);
};

const rootA = createRoot(counter);
export const Another = () => {
	const [counterStore, revoke] = useRootStore(rootA);
	// useAutorun(() => {
	// 	console.log(counterStore.count);
	// });
	return (
		<div>
			{counterStore.count}
			<button
				onClick={() => {
					for (let i = 0; i < 2; ++i) {
						counterStore.count++;
						//console.log('change');
					}
				}}
			>
				+
			</button>
			<button
				onClick={() => {
					revoke();
				}}
			>
				revoke
			</button>
		</div>
	);
};
