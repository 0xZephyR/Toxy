/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import { autorun } from './autorun';
import { getAdm } from './createStore';
import { observableHandler } from './observable';

interface IRoot<T> {
	proxy_: ProxyConstructor;
	target_: T;
	revoke_: () => void;
}

// 外层handler，用于重新渲染组件
const globalStateHandler: ProxyHandler<any> = {
	get(target, prop, receiver) {
		return target[prop];
	},
	set(target: any, prop: PropertyKey, value: any, receiver: object) {
		setTimeout(() => {
			getAdm(target).doFresh();
		}, 0);
		return Reflect.set(target, prop, value, receiver);
	}
};

// 每个共享状态的组件树的根store
class Root<T> implements IRoot<T> {
	proxy_: ProxyConstructor;
	target_: T;
	revoke_: () => void;
	constructor(target: T) {
		this.target_ = target;
		const innerProxy = Proxy.revocable(target as any, observableHandler);
		const outerProxy = Proxy.revocable(
			innerProxy.proxy,
			globalStateHandler
		);
		this.proxy_ = outerProxy.proxy;
		this.revoke_ = () => {
			outerProxy.revoke();
			innerProxy.revoke();
		};
	}
}
export function createrRoot<T>(target: T) {
	return new Root(target);
}
export function useRootStore<T>(root: Root<T>): T {
	const [_, setFresh] = useState(false);
	useEffect(() => {
		getAdm(root.target_).addProxy();
		getAdm(root.target_).addFresh(setFresh);
		return () => {
			root.revoke_();
			getAdm(root.target_).removeProxy();
		};
	}, []);
	return root.proxy_ as unknown as T;
}

export function useNormalStore<T>(root: Root<T>) {
	if (!root.proxy_) {
		throw new Error('no root store');
	}
	return root.proxy_ as unknown as T;
}

export const useAutorun = (fn: () => void) => {
	useEffect(() => {
		const unsubscribe = autorun(fn);
		return () => unsubscribe();
	}, []);
};
