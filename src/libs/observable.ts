/* eslint-disable no-underscore-dangle */
import { currentObserver, observableMap, observerMap } from './autorun';
import { getAdm } from './createStore';
// 内存handler，实现数据响应
export const observableHandler: ProxyHandler<any> = {
	get(target: any, prop:PropertyKey){
		if (!currentObserver.current){
			return getAdm(target).get_(prop);
		}
		if (!observerMap.get(currentObserver.current)){
			observerMap.set(currentObserver.current, []);
		}
		if (!observerMap.get(currentObserver.current)?.includes(target)){
			observerMap.get(currentObserver.current)?.push(target);
		}
		if (!observableMap.get(target)){
			observableMap.set(target, new Map<PropertyKey, Set<Function> >());
		}
		if (!observableMap.get(target)?.get(prop)){
			observableMap.get(target)?.set(prop, new Set());
		}
		observableMap.get(target)?.get(prop)?.add(currentObserver.current);
		return getAdm(target).get_(prop);
	},
	set(target: object, prop:PropertyKey, value: any,receiver:object){
		setImmediate(()=>{
			observableMap.get(target)?.get(prop)?.forEach(v => v());
		});
		return Reflect.set(target, prop, value,receiver);
	}
};
