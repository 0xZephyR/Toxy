/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { getAdm } from './createStore';
import { observableHandler, toDeepProxy } from './observable';
import Reaction from './reaction';
import { globalCurrent as currentObserver } from './store-hooks';
interface IModel<T> {
	proxy_: ProxyConstructor | null;
	revoke_: (setFresh: React.Dispatch<React.SetStateAction<boolean>>) => void;
}
export let globalDerivation: any = null;
export let globalAutorun: (() => void) | null = null;
export interface ModelMask<T> {
	value: T;
}
// 每个共享状态的组件树的根store
export class Model<T> implements IModel<T> {
	proxy_: ProxyConstructor | null;
	private target_: T | null;
	private readonly this_: Model<T> | null = null;
	private _current: Reaction | null = null;
	revoke_: () => boolean;
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
		getAdm(target).newModel(this);
		this.this_ = this;
		const handler = { ...observableHandler, this_: this } as any;
		//内层proxy
		this.proxy_ = toDeepProxy(this.target_, handler);
		this.revoke_ = () => {
			getAdm(this.target_).removeFresh(this._setFresh!);
			setTimeout(() => {
				const f = this._setFresh;
				this.destroy();
				f!((v) => !v);
			}, 0);
			return true;
		};
	}
	proxify(target: any, handlers: any[]) {
		const proxy = new Proxy(
			new Proxy(target as any, handlers[0]),
			handlers[1]
		);

		return proxy as ProxyConstructor;
	}
	reportObserver(prop: PropertyKey, target: Object) {
		// if (target){
		// 	if (!this._ob.has(target)){
		// 		this._ob.set(target, new Map());
		// 	}
		// 	if (!this._ob.get(target)?.has(prop)){
		// 		this._ob.get(target)?.set(prop, new Set());
		// 	}
		// 	this._ob.get(target)?.get(prop)?.add(currentObserver!);
		// }
		this._observers.set(currentObserver!, new Map());
		if (!this._observers.get(currentObserver!)?.has(target)) {
			this._observers.get(currentObserver!)?.set(target, new Set());
		}
		this._observers.get(currentObserver!)?.get(target)?.add(prop);
		if (!this._observables.has(target)) {
			this._observables.set(target, new Map());
		}
		if (!this._observables.get(target)?.has(prop)) {
			this._observables.get(target)?.set(prop, new Set());
		}
		this._observables.get(target)?.get(prop)?.add(currentObserver!);
	}
	private destroy() {
		this._hasMainDerivation = false;
		this._isRevoked = true;
		this._setFresh = null;
		this.revoke_ = () => false;
		this.proxy_ = new Proxy(Object.assign({}, this.target_ as any), {
			set() {
				return true;
			}
		});
		this._observers.clear();
		this.target_ = null;
	}
	isRevoked() {
		return this._isRevoked;
	}
	hasMainStore() {
		return this._hasMainDerivation;
	}

	rootStoreMounted(setFresh: React.Dispatch<React.SetStateAction<boolean>>) {
		if (this._hasMainDerivation) {
			throw Error('There is already a main derivation');
		} else {
			this._hasMainDerivation = true;
			this._setFresh = setFresh;
			getAdm(this.target_).addFresh(setFresh);
		}
	}

	log() {
		console.log(this);
	}
	get value() {
		return this.proxy_ as unknown as T;
	}
	get current() {
		return this._current;
	}

	get observable() {
		return this._observables;
	}

	get target() {
		return this.target_;
	}
}

export default Model;
