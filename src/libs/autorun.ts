
class CurrentObserver{
	current:Function | null = null;
	startObserve(fn:Function){
		this.current = fn;
	}
	endObserve(){
		this.current = null;
	}
}

export const currentObserver = new CurrentObserver();
export const observerMap = new Map<Function, Array<Object>>();
export const observableMap = new Map<Object, Map<PropertyKey, Set<Function> > >();
export const autorun = (fn:Function)=>{
	currentObserver.startObserve(fn);
	fn();
	currentObserver.endObserve();
};

