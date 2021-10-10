import Reaction from './reaction';
class CurrentObserver {
	current: Reaction | null = null;
	startObserve(reaction: Reaction) {
		this.current = reaction;
	}
	endObserve() {
		this.current = null;
	}
}

export const currentObserver = new CurrentObserver();
export const observerMap = new Map<Reaction, Map<Object, Set<PropertyKey>>>();
export const observableMap = new Map<Object, Map<PropertyKey, Set<Reaction>>>();
export const autorun = (fn: () => void) => {
	const reaction = new Reaction(fn);
	currentObserver.startObserve(reaction);
	fn();
	currentObserver.endObserve();
	return () => {
		const propMap = observerMap.get(reaction);
		propMap?.forEach((value, key) => {
			const keyMap = observableMap.get(key);
			value.forEach((v) => {
				keyMap?.get(v)?.delete(reaction);
			});
		});
		observerMap.delete(reaction);
		//console.log(observerMap);
	};
};

function reportToObserver(current: Reaction, target: any, prop: PropertyKey) {
	if (!observerMap.has(current)) {
		observerMap.set(current, new Map<Object, Set<PropertyKey>>());
	}
	if (!observerMap.get(current)?.has(target)) {
		observerMap.get(current)?.set(target, new Set());
	}
	observerMap.get(current)?.get(target)?.add(prop);
}

function reportToObservable(current: Reaction, target: any, prop: PropertyKey) {
	if (!observableMap.has(target)) {
		observableMap.set(target, new Map<PropertyKey, Set<Reaction>>());
	}
	if (!observableMap.get(target)?.has(prop)) {
		observableMap.get(target)?.set(prop, new Set());
	}
	observableMap.get(target)?.get(prop)?.add(current);
}

export function reportDependence(target: any, prop: PropertyKey) {
	const current = currentObserver.current as Reaction;
	reportToObserver(current, target, prop);
	reportToObservable(current, target, prop);
}
