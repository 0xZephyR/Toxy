/* eslint-disable no-underscore-dangle */
import { getAdm } from './createStore';
import Model from './Model';
import { globalCurrent } from './store-hooks';

export const observableHandler: any = {
	get(target: any, prop: PropertyKey) {
		const model: Model<any> = this.this_;
		if (!globalCurrent) {
			return Reflect.get(target, prop);
		}
		// if (!receiver.this_.current) {
		// 	return getAdm(target).get_(prop);
		// }
		model.reportObserver(prop, target);
		return Reflect.get(target, prop);
	},
	set(target: any, prop: PropertyKey, value: any, receiver: any) {
		if (Reflect.get(target, prop) === value) {
			return Reflect.set(target, prop, value, receiver);
		}
		Reflect.set(target, prop, value, receiver);
		const model: Model<any> = this.this_;
		getAdm(model.target).run(prop, target);
		setTimeout(() => {
			getAdm(this.this_.target_).doFresh();
		}, 0);
		return true;
	}
};

export function toDeepProxy(object_: any, handler_: any) {
	if (!isPureObject(object_)) {
		addSubProxy(object_, handler_);
	}
	return new Proxy(object_, handler_);

	//这是一个递归函数，目的是遍历object的所有属性，如果不是pure object,那么就继续遍历object的属性的属性，如果是pure object那么就加上proxy
	function addSubProxy(object: any, handler: any) {
		for (let prop in object) {
			if (typeof object[prop] == 'object') {
				if (!isPureObject(object[prop])) {
					addSubProxy(object[prop], handler);
				}
				object[prop] = new Proxy(object[prop], handler);
			}
		}
		// eslint-disable-next-line no-param-reassign
	}

	//是不是一个pure object,意思就是object里面没有再嵌套object了
	function isPureObject(object: any) {
		if (typeof object !== 'object') {
			return false;
		}
		for (let prop in object) {
			if (typeof object[prop] == 'object') {
				return false;
			}
		}

		return true;
	}
}
