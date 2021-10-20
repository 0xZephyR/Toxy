// eslint-disable-next-line no-use-before-define
import React from 'react';
import {
	arrayStore,
	counter as counterStore,
	personStore
} from '../libs/store';
import {
	autorun,
	createModel,
	transaction,
	useMainDerivation,
	useNormalDerivation
} from '../libs/store-api';

export function sleep(interval: number) {
	const start = Date.now();
	while (Date.now() - start <= interval * 1000) {}
}
const $array = createModel(arrayStore);
const $counter = createModel(counterStore);
const $person = createModel(personStore);
autorun(() => {
	console.log($counter.value.count + ' ' + $person.value.child.age);
});
autorun(() => {
	console.log($person.value.name);
});
export const Counter = () => {
	const [counter, freeze] = useMainDerivation($counter);
	const [person, personFreeze] = useMainDerivation($person);
	//const componentA = useCallback(() => () => <A />, [person.child]);
	// const DoubleCounter = useMemo(
	// 	() => 2 * counterStore.count,
	// 	[counterStore.count]
	// );
	return (
		<>
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
			<input
				onChange={(e) => {
					transaction(() => {
						person.name = e.currentTarget.value;
					}, 200);
				}}
			/>
			<A />
		</>
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
