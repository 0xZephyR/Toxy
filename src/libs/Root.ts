/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import { getAdm } from './createStore';
import { globalStateHandler, observableHandler } from './observable';
//export const $target = Symbol('target pointed to root');
namespace RootSpace {
	interface IRoot<T> {
		proxy_: ProxyConstructor | null;
		target_: T | null;
		revoke_: (
			setFresh: React.Dispatch<React.SetStateAction<boolean>>
		) => void;
	}

	// 每个共享状态的组件树的根store
	export class Root<T> implements IRoot<T> {
		proxy_: ProxyConstructor | null;
		target_: T;
		revoke_: () => boolean;
		private _observers: (() => void)[] = [];
		private _hasRootStore: boolean = false;
		private _setFresh: React.Dispatch<
			React.SetStateAction<boolean>
		> | null = () => {};
		private _isRevoked: boolean = false;
		constructor(target: T) {
			this.target_ = target;
			const innerProxy = Proxy.revocable(
				target as any,
				observableHandler
			);

			const outerProxy = Proxy.revocable(
				innerProxy.proxy,
				globalStateHandler
			);
			this.proxy_ = outerProxy.proxy;
			//Object(this.proxy_, '')
			this.revoke_ = () => {
				outerProxy.revoke();
				innerProxy.revoke();
				this.proxy_ = Proxy.revocable(
					{ ...this.target_ } as any,
					{}
				).proxy;
				getAdm(this.target_).removeFresh(this._setFresh!);
				setTimeout(() => {
					const f = this._setFresh;
					this.destroy();
					f!((v) => !v);
				}, 0);
				return true;
			};
		}

		autorun(fn: () => void): void {
			fn.apply(this);
		}
		get() {
			return this.proxy_ as unknown as T;
		}
		destroy() {
			this._hasRootStore = false;
			this._isRevoked = true;
			this._setFresh = null;
			this.revoke_ = () => false;
			this.target_ = { ...this.target_ };
		}
		isRevoked() {
			return this._isRevoked;
		}
		hasRootStore() {
			return this._hasRootStore;
		}

		rootStoreMounted(
			setFresh: React.Dispatch<React.SetStateAction<boolean>>
		) {
			if (this._hasRootStore) {
				throw Error('There is already a root store');
			} else {
				this._hasRootStore = true;
				this._setFresh = setFresh;
				getAdm(this.target_).addProxy();
				getAdm(this.target_).addFresh(setFresh);
			}
		}
	}
}

export default RootSpace;
