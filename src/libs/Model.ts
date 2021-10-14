/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { getAdm } from './createStore';
import { batchQueue, currentObserver } from './globals';
import { observableHandler, toDeepProxy } from './observable';
import Reaction from './reaction';
interface IModel {
	proxy_: ProxyConstructor | null;
	freeze: (setFresh: React.Dispatch<React.SetStateAction<boolean>>) => void;
}
export let globalDerivation: any = null;
export let globalAutorun: (() => void) | null = null;
export interface ModelMask<T> {
	value: T;
	isMounted: () => boolean;
}
// 每个共享状态的组件树的根store

type Derivation = ProxyConstructor | null;

export class Model<T> implements IModel {
	proxy_: Derivation;
	_batch: any = null;
	private _hasMounted: boolean = false;
	private target_: T | null;
	freeze: () => boolean;
	private _observers: Map<Reaction, WeakMap<Object, Set<PropertyKey>>> =
		new Map();
	private _observables: WeakMap<Object, Map<PropertyKey, Set<Reaction>>> =
		new WeakMap();
	private _hasMainDerivation: boolean = false;
	private _setFresh: React.Dispatch<React.SetStateAction<boolean>> | null =
		() => {};
	private _isRevoked: boolean = false;
	constructor(target: T) {
		this.target_ = target;
		getAdm(target).addNewModel(this);
		const handler = { ...observableHandler, this_: this } as any;
		this.proxy_ = toDeepProxy(this.target_, handler);
		this.freeze = () => {
			getAdm(this.target_).removeFresh(this._setFresh!);
			setTimeout(() => {
				const f = this._setFresh;
				this.clear();
				f!((v) => !v);
			}, 0);
			return true;
		};
	}
	reportNewObserver(prop: PropertyKey, target: Object) {
		this.updateObserver(prop, target);
		this.updateObservable(prop, target);
	}
	updateObserver(prop: PropertyKey, target: Object) {
		if (this._observers.has(currentObserver.get()!)) {
			this._observers.set(currentObserver.get()!, new Map());
		}
		if (!this._observers.get(currentObserver.get()!)?.has(target)) {
			this._observers.get(currentObserver.get()!)?.set(target, new Set());
		}
		this._observers.get(currentObserver.get()!)?.get(target)?.add(prop);
	}
	updateObservable(prop: PropertyKey, target: Object) {
		if (!this._observables.has(target)) {
			this._observables.set(target, new Map());
		}
		if (!this._observables.get(target)?.has(prop)) {
			this._observables.get(target)?.set(prop, new Set());
		}
		this._observables.get(target)?.get(prop)?.add(currentObserver.get()!);
	}

	updateBatch(target: any, prop: PropertyKey) {
		const set = this.findReaction(target, prop);
		if (set) {
			set.forEach((v) => batchQueue.addReaction(v));
		}
		batchQueue.addStore(this.target_);
		batchQueue.run();
	}
	private clear() {
		this._hasMainDerivation = false;
		this._isRevoked = true;
		this._setFresh = null;
		this.freeze = () => false;
		this.proxy_ = new Proxy(Object.assign({}, this.target_ as any), {
			set() {
				return true;
			}
		});
		this._observers.clear();
		this.target_ = null;
	}
	isFrozen() {
		return this._isRevoked;
	}
	isMounted(): boolean {
		return Boolean(this._hasMounted);
	}

	addFresh(setFresh: React.Dispatch<React.SetStateAction<boolean>>) {
		if (this._hasMainDerivation) {
			throw Error('There is already a main derivation');
		} else {
			this._hasMainDerivation = true;
			this._setFresh = setFresh;
			getAdm(this.target_).addFresh(setFresh);
		}
	}
	runObservers(target: any, prop: any) {
		this._observables
			.get(target)
			?.get(prop)
			?.forEach((value) => value.runreaction());
	}
	findReaction(target: any, prop: any) {
		return this._observables.get(target)?.get(prop);
	}
	get value() {
		return this.proxy_ as unknown as T;
	}

	get target() {
		return this.target_;
	}
}

export default Model;
