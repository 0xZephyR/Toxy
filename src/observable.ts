/* eslint-disable no-underscore-dangle */
let a = {a:1};
class CurrentObserver{
	current:Function | null = null;
	startObserve(fn:Function){
		this.current = fn;
	}
	endObserve(){
		this.current = null;
	}
}
const $mobx = Symbol('mobx administration');
const currentObserver = new CurrentObserver();
const observerMap = new Map<Function, Array<Object>>();
export const observableMap = new Map<Object, Map<PropertyKey, Set<Function> > >();

export const autorun = (fn:Function)=>{
	currentObserver.startObserve(fn);
	fn();
	currentObserver.endObserve();
};

const handler: ProxyHandler<any> = {
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
class Adm{
	proxy_: ProxyConstructor | null = null;
	constructor(
		private target_:any
	){}

	get_(key:PropertyKey){
		return this.target_[key];
	}

	set_(key:PropertyKey, value: any){
		this.target_[key] = value;
		return true;
	}
}
function addAdm(target: Object){
	const adm = new Adm(target);
	Object.defineProperty(target, $mobx, {
		value: adm,
		configurable: true
	});
	return target;
}
function getAdm(target: any){
	return target[$mobx];
}
function createObservable(target:any){
	// eslint-disable-next-line no-param-reassign
	target = addAdm(target);
	return (target[$mobx].proxy_ = target[$mobx].proxy_ ?? new Proxy(target, handler));
}

export default createObservable;
