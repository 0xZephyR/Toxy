/* eslint-disable no-underscore-dangle */
import { getAdm } from './createStore';
import Model from './Model';

// 内层handler，实现数据响应
export const observableHandler: any = {
	get(target: any, prop: PropertyKey) {
		const model: Model<any> = this.this_;
		if (!model.current) {
			return getAdm(target).get_(prop);
		}
		// if (!receiver.this_.current) {
		// 	return getAdm(target).get_(prop);
		// }
		model.reportObserver(prop);
		return getAdm(target).get_(prop);
	},
	set(target: any, prop: PropertyKey, value: any, receiver: any) {
		if (Reflect.get(target, prop) === value) {
			return Reflect.set(target, prop, value, receiver);
		}
		Reflect.set(target, prop, value, receiver);
		const model: Model<any> = this.this_;
		getAdm(model.target).run(prop);
		return true;
	}
};

//外层handler, 重渲染组件
export const globalStateHandler: any = {
	get(target: any, prop: any) {
		return target[prop];
	},
	set(target: any, prop: PropertyKey, value: any, receiver: any) {
		setTimeout(() => {
			getAdm(target).doFresh();
		}, 0);
		return Reflect.set(target, prop, value, receiver);
	}
};
