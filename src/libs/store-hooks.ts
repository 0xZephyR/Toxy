/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import globals, { currentObserver } from './globals';
import Model, { ModelMask } from './Model';
import Reaction from './reaction';

type MaskedModel<T> = Model<T> | ModelMask<T>; // 屏蔽无需暴露给用户的属性与方法

export function createModel<T>(target: T) {
	return new Model(target) as MaskedModel<T>;
}
export function useMainDerivation<T>(
	root_: MaskedModel<T>
): [T, () => boolean] {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setFresh] = useState(false);
	const root = root_ as Model<T>;
	useEffect(() => {
		root.mountMainDerivation(setFresh);
		return () => {
			root.freeze();
		};
	}, []);
	return [root.proxy_ as unknown as T, root.freeze];
}

export function useNormalDerivation<T>(root_: MaskedModel<T>) {
	const root = root_ as Model<T>;
	// if (!root.hasMainStore()) {
	// 	throw new Error('no main derivation');
	// }
	return root.proxy_ as unknown as T;
}

export function autorun(fn: () => void) {
	const reaction = new Reaction(fn);
	const prev = currentObserver.get();
	currentObserver.set(reaction);
	fn();
	currentObserver.set(prev);
}

export function transaction(fn: () => void) {
	globals.Batch++;
	fn();
	globals.Batch--;
}
