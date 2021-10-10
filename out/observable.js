/* eslint-disable no-underscore-dangle */
var a = { a: 1 };
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
}());
var $mobx = Symbol('mobx administration');
var currentObserver = new CurrentObserver();
var observerMap = new Map();
export var observableMap = new Map();
export var autorun = function (fn) {
    currentObserver.startObserve(fn);
    fn();
    currentObserver.endObserve();
};
var handler = {
    get: function (target, prop) {
        var _a, _b, _c, _d, _e, _f;
        if (!currentObserver.current) {
            return getAdm(target).get_(prop);
        }
        if (!observerMap.get(currentObserver.current)) {
            observerMap.set(currentObserver.current, []);
        }
        if (!((_a = observerMap.get(currentObserver.current)) === null || _a === void 0 ? void 0 : _a.includes(target))) {
            (_b = observerMap.get(currentObserver.current)) === null || _b === void 0 ? void 0 : _b.push(target);
        }
        if (!observableMap.get(target)) {
            observableMap.set(target, new Map());
        }
        if (!((_c = observableMap.get(target)) === null || _c === void 0 ? void 0 : _c.get(prop))) {
            (_d = observableMap.get(target)) === null || _d === void 0 ? void 0 : _d.set(prop, new Set());
        }
        (_f = (_e = observableMap.get(target)) === null || _e === void 0 ? void 0 : _e.get(prop)) === null || _f === void 0 ? void 0 : _f.add(currentObserver.current);
        return getAdm(target).get_(prop);
    },
    set: function (target, prop, value, receiver) {
        setImmediate(function () {
            var _a, _b;
            (_b = (_a = observableMap.get(target)) === null || _a === void 0 ? void 0 : _a.get(prop)) === null || _b === void 0 ? void 0 : _b.forEach(function (v) { return v(); });
        });
        return Reflect.set(target, prop, value, receiver);
    }
};
var Adm = /** @class */ (function () {
    function Adm(target_) {
        this.target_ = target_;
        this.proxy_ = null;
    }
    Adm.prototype.get_ = function (key) {
        return this.target_[key];
    };
    Adm.prototype.set_ = function (key, value) {
        this.target_[key] = value;
        return true;
    };
    return Adm;
}());
function addAdm(target) {
    var adm = new Adm(target);
    Object.defineProperty(target, $mobx, {
        value: adm,
        configurable: true
    });
    return target;
}
function getAdm(target) {
    return target[$mobx];
}
function createObservable(target) {
    var _a;
    // eslint-disable-next-line no-param-reassign
    target = addAdm(target);
    return (target[$mobx].proxy_ = (_a = target[$mobx].proxy_) !== null && _a !== void 0 ? _a : new Proxy(target, handler));
}
export default createObservable;
