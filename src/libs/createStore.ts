/* eslint-disable no-underscore-dangle */
import React from 'react';
import Model from './Model';
const adm = Symbol();
export interface StoreObject {}
class Administration<T, K extends keyof T> {
	private freshMethods: Set<React.Dispatch<React.SetStateAction<boolean>>> =
		new Set();
	private _derivedModels: Set<Model<T>> = new Set();
	constructor(private target_: T) {}
	addFresh(set: React.Dispatch<React.SetStateAction<boolean>>) {
		this.freshMethods?.add(set);
	}
	removeFresh(set: React.Dispatch<React.SetStateAction<boolean>>) {
		return this.freshMethods.delete(set);
	}
	doFresh() {
		this.freshMethods?.forEach((v) => v((value) => !value));
	}
	run<A, B extends keyof A>(prop: B, target: A) {
		this._derivedModels.forEach((v) => {
			v.observable
				.get(target)
				?.get(prop)
				?.forEach((value) => value.runreaction());
		});
	}
	//TODO store代理数量清零后重置store状态
	newModel(model: Model<T>) {
		this._derivedModels.add(model);
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
