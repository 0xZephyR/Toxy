// eslint-disable-next-line no-use-before-define
import React from 'react';
import { counter as counterStore, person } from '../libs/store';
import {
	autorun,
	createModel,
	transaction,
	useMainDerivation,
	useNormalDerivation
} from '../libs/store-hooks';

export function sleep(interval: number) {
	const start = Date.now();
	while (Date.now() - start <= interval * 1000) {}
}

const counterModel = createModel(counterStore);
const Jack = createModel(person);
autorun(() => {
	console.log(counterModel.value.count + ' ' + Jack.value.child.age);
});

// root.autorun(() => {
// 	console.log(root.value.count);
// });

export const Counter = () => {
	const [counter, freeze] = useMainDerivation(counterModel);
	const [jack, presonFreeze] = useMainDerivation(Jack);
	// const DoubleCounter = useMemo(
	// 	() => 2 * counterStore.count,
	// 	[counterStore.count]
	// );

	return (
		<div>
			{counter.count}
			<button
				onClick={() => {
					transaction(() => {
						transaction(() => {
							counter.count++;
							counter.count++;
						});
						counter.count++;
					});
				}}
			>
				+
			</button>
			<button
				onClick={() => {
					jack.child.age++;
				}}
			>
				JackAdd
			</button>
			<A />
		</div>
	);
};
const A = () => {
	const counter = useNormalDerivation(counterModel);
	return <div>{counter.count}</div>;
};
const rootA = createModel(counterStore);
export const Another = () => {
	const [counter, revoke] = useMainDerivation(rootA);
	return (
		<div>
			{counter.count}
			<button
				onClick={() => {
					for (let i = 0; i < 1; ++i) {
						counter.count++;
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
