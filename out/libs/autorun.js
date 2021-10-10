var CurrentObserver = /** @class */ (function () {
	function CurrentObserver() {
		this.current = null;
	}
	CurrentObserver.prototype.startObserve = function (fn) {
		this.current = fn;
	};
	CurrentObserver.prototype.endObserve = function () {
		this.current = null;
	};
	return CurrentObserver;
})();
export var currentObserver = new CurrentObserver();
export var observerMap = new Map();
export var observableMap = new Map();
export var autorun = function (fn) {
	currentObserver.startObserve(fn);
	fn();
	currentObserver.endObserve();
};
