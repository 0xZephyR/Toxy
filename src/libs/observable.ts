/* eslint-disable no-underscore-dangle */
import { currentObserver, observableMap, reportDependence } from './autorun';
import { getAdm } from './createStore';

// 内层handler，实现数据响应
export const observableHandler: ProxyHandler<any> = {
	get(target: any, prop: PropertyKey) {
		if (!currentObserver.current) {
			return getAdm(target).get_(prop);
		}
		reportDependence(target, prop);
		return getAdm(target).get_(prop);
	},
	set(target: any, prop: PropertyKey, value: any, receiver: object) {
		if (currentObserver.current) {
			return false;
		}
		if (Reflect.get(target, prop) === value) {
			return Reflect.set(target, prop, value, receiver);
		}
		Reflect.set(target, prop, value, receiver);
		observableMap
			.get(target)
			?.get(prop)
			?.forEach((v) => {
				v.runreaction();
			});
		return true;
	}
};
