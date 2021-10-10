/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import { getAdm, StoreObject } from './createStore';

interface IRoot{
	proxy_: ProxyConstructor;
	target_: StoreObject;
	revoke_ : ()=>void;
}
const handler: ProxyHandler<any> = {
	set(target: StoreObject,prop:PropertyKey, value: any,receiver:object){
		setTimeout(()=>{
			getAdm(target).doFresh();
		}, 0);
		return Reflect.set(target, prop, value,receiver);
	}
};
class Root implements IRoot{
	proxy_: ProxyConstructor;
	target_: StoreObject;
	revoke_ : ()=>void;
	constructor(
		target: StoreObject
	){
		this.target_ = target;
		const proxy = Proxy.revocable(target as any, handler);
		this.proxy_ = proxy.proxy;
		this.revoke_ = proxy.revoke;
	}

}
export function createrRoot(target: StoreObject){
	return new Root(target);
}

export function useRootStore(root: Root):any{
	const [fresh, setFresh] = useState(false);
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