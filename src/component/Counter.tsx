// eslint-disable-next-line no-use-before-define
import React from 'react';
import { counter } from '../libs/store';
import { createModel, useMainDerivation } from '../libs/store-hooks';

export function sleep(interval: number) {
	const start = Date.now();
	while (Date.now() - start <= interval * 1000) {}
}
const root = createModel(counter);
root.autorun(() => {
	console.log(root.value.count);
});
// root.autorun(() => {
// 	console.log(root.value.count);
// });
export const Counter = () => {
	const [counterStore, revoke] = useMainDerivation(root);
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

const rootA = createModel(counter);
export const Another = () => {
	const [counterStore, revoke] = useMainDerivation(rootA);
	return (
		<div>
			{counterStore.count}
			<button
				onClick={() => {
					for (let i = 0; i < 1; ++i) {
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
