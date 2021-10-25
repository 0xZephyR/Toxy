/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import { createStore } from './createStore';
import { Batch, currentObserver } from './globals';
import Model from './Model';
import Reaction from './reaction';
import { MaskedModel } from './types';
/**
 * !暴露给用户的API
 */
export function createModel<T>(target: T) {
	return new Model(target).model;
}

export function autorun(fn: () => void) {
	const reaction = new Reaction(fn);
	const prev = currentObserver.get();
	currentObserver.set(reaction);
	fn();
	currentObserver.set(prev);
}

export function transaction(fn: () => void, delay?: number) {
	Batch.level++;
	let prev = Batch.delay;
	Batch.delay = delay ?? 0;
	fn();
	Batch.delay = prev;
	Batch.level--;
}

export function useMainDerivation<T>(
	root_: MaskedModel<T>
): [T, () => boolean] {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// if (!root_.isMounted()) {
	// 	throw Error('Main derivation has not mounted');
	// }
	const [, setFresh] = useState(false);
	const root = (root_ as any).target_;
	useEffect(() => {
		// if (!root_.isMounted()) {
		// 	throw Error('Main derivation has not mounted');
		// }
		root.addFresh(setFresh);
		return () => {
			root.freeze();
		};
	}, []);
	return [root.proxy_ as unknown as T, root.freeze];
}

export function useNormalDerivation<T>(root_: MaskedModel<T>) {
	const root = (root_ as any).target_;
	// if (!root.isMounted()) {
	// 	throw new Error('no main derivation');
	// }
	return root.proxy_ as unknown as T;
}

export default createStore;
