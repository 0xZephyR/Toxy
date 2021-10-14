/* eslint-disable no-underscore-dangle */
import React from 'react';
import Model from './Model';
const adm = Symbol();
class Administration<T> {
	private freshMethods: Set<React.Dispatch<React.SetStateAction<boolean>>> =
		new Set();
	private _derivedModels: Set<Model<T>> = new Set();
	private target_: T;
	constructor(target: T) {
		this.target_ = target;
	}
	addFresh(set: React.Dispatch<React.SetStateAction<boolean>>) {
		this.freshMethods?.add(set);
	}
	removeFresh(set: React.Dispatch<React.SetStateAction<boolean>>) {
		return this.freshMethods.delete(set);
	}
	fresh() {
		this.freshMethods?.forEach((v) => v((value) => !value));
	}
	runObserversInModels<A, B extends keyof A>(prop: B, target: A) {
		this._derivedModels.forEach((v) => {
			v.runObservers(target, prop);
		});
	}
	addNewModel(model: Model<T>) {
		this._derivedModels.add(model);
	}
}

export function getAdm<T>(o: T): Administration<T> {
	return (o as any)[adm];
}
export default function createStore<T>(target: T) {
	Object.defineProperty(target, adm, {
		value: new Administration(target)
	});
	return target;
}
