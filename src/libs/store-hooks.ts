/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import { autorun } from './autorun';
import { getAdm } from './createStore';
import RootSpace from './Root';

export function createRoot<T>(target: T) {
	return new RootSpace.Root(target);
}
export function useRootStore<T>(root: RootSpace.Root<T>): [T, () => boolean] {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, setFresh] = useState(false);
	useEffect(() => {
		root.rootStoreMounted(setFresh);
		return () => {
			if (root.revoke_() === true) {
				getAdm(root.target_).removeProxy();
			}
		};
	}, []);
	return [
		root.isRevoked() ? root.target_ : (root.proxy_ as unknown as T),
		root.revoke_
	];
}

export function useNormalStore<T>(root: RootSpace.Root<T>) {
	if (!root.hasRootStore()) {
		throw new Error('no root store');
	}
	//if(!Root)
	return root.isRevoked() ? root.target_ : (root.proxy_ as unknown as T);
}

export const useAutorun = (fn: () => void) => {
	useEffect(() => {
		const unsubscribe = autorun(fn);
		return () => unsubscribe();
	}, []);
};
