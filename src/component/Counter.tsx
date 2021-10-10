import React, { useEffect } from 'react';
import { counter } from '../libs/store';
import { createrRoot, useNormalStore, useRootStore } from '../libs/store-hooks';

const root = createrRoot(counter);
export const Another = ()=>{
	const counterStore = useNormalStore(root);
	useEffect(()=>{
		return ()=>{
			console.log('destroyed');
		};
	}, []);
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