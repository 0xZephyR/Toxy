import React from 'react';
import { counter } from '../libs/store';
import { createrRoot, useAutorun, useNormalStore, useRootStore } from '../libs/store-hooks';
const root = createrRoot(counter);
export const Another = ()=>{
	const counterStore = useNormalStore(root);
	useAutorun(()=>console.log(counterStore.count));
	return (
		<span>
			{counterStore.count}
		</span>
	);
};
const rootA = createrRoot(counter);
export const A = () => {
	const counterStore = useRootStore(rootA);
	return (
		<p>
			{counterStore.count}
		</p>
	);
};
export const Counter = (props:{render:Function})=>{
	const counterStore = useRootStore(root);

	return (
		<div>
			{counterStore.count}
			<button onClick={()=>{
				counterStore.count++;
			}}>
				+
			</button>
			<Another/>
		</div>
	);
};