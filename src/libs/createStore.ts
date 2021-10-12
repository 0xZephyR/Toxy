/* eslint-disable no-underscore-dangle */
import React from 'react';
import Model from './Model';
const adm = Symbol();
export interface StoreObject {}
class Administration<T, K extends keyof T> {
	private _freshId: number = 0;
	private freshMethod: Set<React.Dispatch<React.SetStateAction<boolean>>> =
		new Set();
	private _derivedModels: Set<Model<T>> = new Set();
	constructor(private target_: T) {}
	addFresh(set: React.Dispatch<React.SetStateAction<boolean>>) {
		this.freshMethod?.add(set);
	}
	removeFresh(set: React.Dispatch<React.SetStateAction<boolean>>) {
		return this.freshMethod.delete(set);
	}
	doFresh() {
		this.freshMethod?.forEach((v) => v((value) => !value));
	}
	run(prop: K) {
		this._derivedModels.forEach((v) => {
			v.observable.get(prop)?.forEach((r) => r.runreaction());
		});
	}
	//TODO store代理数量清零后重置store状态
	newModel(model: Model<T>) {
		this._derivedModels.add(model);
	}
	get_(key: K) {
		return this.target_[key];
	}
}

export function getAdm(o: any): Administration<any, any> {
	return o[adm];
}
export default function createStore<T>(target: T) {
	Object.defineProperty(target, adm, {
		value: new Administration(target)
	});
	return target;
}
