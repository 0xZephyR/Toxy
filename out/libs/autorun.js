import Reaction from './reaction';
var CurrentObserver = /** @class */ (function () {
    function CurrentObserver() {
        this.current = null;
    }
    CurrentObserver.prototype.startObserve = function (reaction) {
        this.current = reaction;
    };
    CurrentObserver.prototype.endObserve = function () {
        this.current = null;
    };
    return CurrentObserver;
}());
export var currentObserver = new CurrentObserver();
export var observerMap = new Map();
export var observableMap = new Map();
export var autorun = function (fn) {
    var reaction = new Reaction(fn);
    currentObserver.startObserve(reaction);
    fn();
    currentObserver.endObserve();
    return function () {
        var propMap = observerMap.get(reaction);
        propMap === null || propMap === void 0 ? void 0 : propMap.forEach(function (value, key) {
            var keyMap = observableMap.get(key);
            value.forEach(function (v) {
                var _a;
                (_a = keyMap === null || keyMap === void 0 ? void 0 : keyMap.get(v)) === null || _a === void 0 ? void 0 : _a.delete(reaction);
            });
        });
        observerMap.delete(reaction);
        //console.log(observerMap);
    };
};
function reportToObserver(current, target, prop) {
    var _a, _b, _c, _d;
    if (!observerMap.has(current)) {
        observerMap.set(current, new Map());
    }
    if (!((_a = observerMap.get(current)) === null || _a === void 0 ? void 0 : _a.has(target))) {
        (_b = observerMap.get(current)) === null || _b === void 0 ? void 0 : _b.set(target, new Set());
    }
    (_d = (_c = observerMap.get(current)) === null || _c === void 0 ? void 0 : _c.get(target)) === null || _d === void 0 ? void 0 : _d.add(prop);
}
function reportToObservable(current, target, prop) {
    var _a, _b, _c, _d;
    if (!observableMap.has(target)) {
        observableMap.set(target, new Map());
    }
    if (!((_a = observableMap.get(target)) === null || _a === void 0 ? void 0 : _a.has(prop))) {
        (_b = observableMap.get(target)) === null || _b === void 0 ? void 0 : _b.set(prop, new Set());
    }
    (_d = (_c = observableMap.get(target)) === null || _c === void 0 ? void 0 : _c.get(prop)) === null || _d === void 0 ? void 0 : _d.add(current);
}
export function reportDependence(target, prop) {
    var current = currentObserver.current;
    reportToObserver(current, target, prop);
    reportToObservable(current, target, prop);
}
