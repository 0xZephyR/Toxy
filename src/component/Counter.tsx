// eslint-disable-next-line no-use-before-define
import React from 'react';
import {
	autorun,
	createModel,
	transaction,
	useMainDerivation,
	useNormalDerivation
} from '../libs/api';
import { counter as counterStore, person } from '../libs/store';

export function sleep(interval: number) {
	const start = Date.now();
	while (Date.now() - start <= interval * 1000) {}
}

const $counter = createModel(counterStore);
const $person = createModel(person);
autorun(() => {
	console.log($counter.value.count + ' ' + $person.value.child.age);
});

// root.autorun(() => {
// 	console.log(root.value.count);
// });

export const Counter = () => {
	const [counter, freeze] = useMainDerivation($counter);
	const [jack, presonFreeze] = useMainDerivation($person);
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
	const counter = useNormalDerivation($counter);
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
