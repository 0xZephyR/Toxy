/* eslint-disable no-underscore-dangle */
import React from 'react';
const adm = Symbol();
export interface StoreObject {}
class Administration {
	private _freshId: number = 0;
	freshMethod: Set<React.Dispatch<React.SetStateAction<boolean>>> = new Set();
	currentAmountOfProxy: number = 0;
	constructor(private target_: any) {}
	addFresh(set: React.Dispatch<React.SetStateAction<boolean>>) {
		this.freshMethod?.add(set);
	}
	removeFresh(set: React.Dispatch<React.SetStateAction<boolean>>) {
		return this.freshMethod.delete(set);
	}
	doFresh() {
		this.freshMethod?.forEach((v) => v((value) => !value));
	}
	//TODO store代理数量清零后重置store状态
	addProxy() {
		++this.currentAmountOfProxy;
	}
	removeProxy() {
		--this.currentAmountOfProxy;
	}
	get_(key: PropertyKey) {
		return this.target_[key];
	}
}

export function getAdm(o: any): Administration {
	return o[adm];
}
export default function createStore<T>(target: T) {
	Object.defineProperty(target, adm, {
		value: new Administration(target)
	});
	return target;
}
