// eslint-disable-next-line no-use-before-define
import React, { useEffect } from 'react';
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
	useEffect(() => {
		const handleHash = ()=>console.log('hashchange');
		window.addEventListener('hashchange', handleHash);
		return () => {
			window.removeEventListener('hashchange', handleHash);
		};
	}, []);
	//const componentA = useCallback(() => () => <A />, [person.child]);
	// const DoubleCounter = useMemo(
	// 	() => 2 * counterStore.count,
	// 	[counterStore.count]
	// );
	return (
		<>
			<a href='#test'>hash</a>
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
				value={person.name}
				onChange={(e) => {
					transaction(() => {
						person.name = e.currentTarget.value;
					}, 0);
				}}
			/>
			<A />
		</>
	);
};
const A = () => {
	const counter = useNormalDerivation($counter);
	const person = useNormalDerivation($person);
	return (
		<div>
			{counter.count}
			<input value={person.name} onChange={(e) => {
				transaction(() => {
					person.name = e.currentTarget.value;
				}, 0);
			}}/>
		</div>
	);
};

const rootA = createModel(counterStore);
const $personA = createModel(personStore);
export const Another = () => {
	const [counter, revoke] = useMainDerivation(rootA);
	const [person, personFreeze] = useMainDerivation($personA);
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
			<div>
				<input value={person.name} />
			</div>
		</div>
	);
};
