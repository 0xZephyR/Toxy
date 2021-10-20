/* eslint-disable no-underscore-dangle */
import React from 'react';
import Model from './Model';
const adm = Symbol();
interface IBox<T> {
	get: () => T;
	set: (v: T) => void;
}

interface IFactory {
	<T>(target: T): T;
	box: <T>(target: T) => IBox<T>;
	array: <T>(target: T) => T;
}
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
export function create<T>(target: T) {
	Object.defineProperty(target, adm, {
		value: new Administration(target)
	});
	return target;
}

const factory = {
	box: function <T>(target: T) {
		const o = {
			value: target,
			get() {
				return target;
			},
			set(newValue: T) {
				this.value = newValue;
			}
		};
		return create(o as IBox<T>);
	},
	array: function <T>(target: T) {
		return create(target);
	}
};
export const createStore: IFactory = Object.assign(create, factory);
