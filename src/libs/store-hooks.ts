/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import Model, { ModelMask } from './Model';
import Reaction from './reaction';

type MaskedModel<T> = Model<T> | ModelMask<T>; // 屏蔽无需暴露给用户的属性与方法
export let globalCurrent: Reaction | null = null;
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
		root.rootStoreMounted(setFresh);
		return () => {
			root.revoke_();
		};
	}, []);
	return [root.proxy_ as unknown as T, root.revoke_];
}

export function useNormalDerivation<T>(root_: MaskedModel<T>) {
	const root = root_ as Model<T>;
	if (!root.hasMainStore()) {
		throw new Error('no root store');
	}
	//if(!Root)
	return root.proxy_ as unknown as T;
}

export function autorun(fn: () => void) {
	const reaction = new Reaction(fn);
	const prev = globalCurrent;
	globalCurrent = reaction;
	fn();
	globalCurrent = prev;
}
