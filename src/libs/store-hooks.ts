/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import { autorun } from './autorun';
import { getAdm, StoreObject } from './createStore';
import { observableHandler } from './observable';

interface IRoot{
	proxy_: ProxyConstructor;
	target_: StoreObject;
	revoke_ : ()=>void;
}

// 外层handler，用于重新渲染组件
const globalStateHandler: ProxyHandler<any> = {
	get(target, prop, receiver){
		return target[prop];
	},
	set(target: StoreObject,prop:PropertyKey, value: any,receiver:object){
		setTimeout(()=>{
			getAdm(target).doFresh();
		}, 0);
		return Reflect.set(target, prop, value,receiver);
	}
};

// 每个共享状态的组件树的根store
class Root implements IRoot{
	proxy_: ProxyConstructor;
	target_: StoreObject;
	revoke_ : ()=>void;
	constructor(
		target: StoreObject
	){
		this.target_ = target;
		const innerProxy = Proxy.revocable(target as any, observableHandler);
		const outerProxy = Proxy.revocable(innerProxy.proxy, globalStateHandler);
		this.proxy_ = outerProxy.proxy;
		this.revoke_ = ()=>{
			outerProxy.revoke();
			innerProxy.revoke();
		};
	}
}
export function createrRoot(target: StoreObject){
	return new Root(target);
}
export function useRootStore(root: Root):any{
	const [_, setFresh] = useState(false);
	useEffect(()=>{
		getAdm(root.target_).addProxy();
		getAdm(root.target_).addFresh(setFresh);
		return ()=>{
			root.revoke_();
			getAdm(root.target_).removeProxy();
		};
	}, []);
	return root.proxy_;
}

export function useNormalStore(root: Root){
	if (!root.proxy_){
		throw new Error('no root store');
	}
	return root.proxy_ as any;
}

export const useAutorun = (fn: Function) => {
	useEffect(()=>{
		autorun(fn);
	}, []);
};