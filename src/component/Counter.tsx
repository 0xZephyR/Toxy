import React from 'react';
import { counter } from '../libs/store';
import {
	createRoot,
	useAutorun,
	useNormalStore,
	useRootStore
} from '../libs/store-hooks';
const root = createRoot(counter);
export function sleep(interval: number) {
	const start = Date.now();
	while (Date.now() - start <= interval * 1000) {}
}
export const Another = () => {
	const counterStore = useNormalStore(root);
	return <span>{counterStore.count}</span>;
};
const rootA = createRoot(counter);
export const A = () => {
	const counterStore = useRootStore(rootA);
	return <p>{counterStore.count}</p>;
};
export const Counter = () => {
	const counterStore = useRootStore(root);
	// const DoubleCounter = useMemo(
	// 	() => 2 * counterStore.count,
	// 	[counterStore.count]
	// );
	useAutorun(() => {
		console.log(counterStore.count);
	});
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
			<Another />
		</div>
	);
};
