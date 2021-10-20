var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { getAdm } from './createStore';
import { batchQueue, currentObserver } from './globals';
import { observableHandler, toDeepProxy } from './observable';
export var globalDerivation = null;
export var globalAutorun = null;
var Model = /** @class */ (function () {
    function Model(target) {
        var _this = this;
        this._batch = null;
        this._observers = new Map();
        this._observables = new WeakMap();
        this._setFresh = function () { };
        this._hasMainDerivation = false;
        this._isRevoked = false;
        this.target_ = target;
        getAdm(target).addNewModel(this);
        var handler = __assign(__assign({}, observableHandler), { this_: this });
        this.proxy_ = toDeepProxy(this.target_, handler);
        this.freeze = function () {
            getAdm(_this.target_).removeFresh(_this._setFresh);
            setTimeout(function () {
                var f = _this._setFresh;
                _this.clear();
                f(function (v) { return !v; });
            }, 0);
            return true;
        };
    }
    Model.prototype.reportNewObserver = function (prop, target) {
        this.updateObserver(prop, target);
        this.updateObservable(prop, target);
    };
    Model.prototype.updateObserver = function (prop, target) {
        var _a, _b, _c, _d;
        if (this._observers.has(currentObserver.get())) {
            this._observers.set(currentObserver.get(), new Map());
        }
        if (!((_a = this._observers.get(currentObserver.get())) === null || _a === void 0 ? void 0 : _a.has(target))) {
            (_b = this._observers.get(currentObserver.get())) === null || _b === void 0 ? void 0 : _b.set(target, new Set());
        }
        (_d = (_c = this._observers.get(currentObserver.get())) === null || _c === void 0 ? void 0 : _c.get(target)) === null || _d === void 0 ? void 0 : _d.add(prop);
    };
    Model.prototype.updateObservable = function (prop, target) {
        var _a, _b, _c, _d;
        if (!this._observables.has(target)) {
            this._observables.set(target, new Map());
        }
        if (!((_a = this._observables.get(target)) === null || _a === void 0 ? void 0 : _a.has(prop))) {
            (_b = this._observables.get(target)) === null || _b === void 0 ? void 0 : _b.set(prop, new Set());
        }
        (_d = (_c = this._observables.get(target)) === null || _c === void 0 ? void 0 : _c.get(prop)) === null || _d === void 0 ? void 0 : _d.add(currentObserver.get());
    };
    Model.prototype.updateBatch = function (target, prop) {
        var set = this.findReaction(target, prop);
        if (set) {
            set.forEach(function (v) { return batchQueue.addReaction(v); });
        }
        batchQueue.addStore(this.target_);
        batchQueue.run();
    };
    Model.prototype.clear = function () {
        this._hasMainDerivation = false;
        this._isRevoked = true;
        this._setFresh = null;
        this.freeze = function () { return false; };
        this.proxy_ = new Proxy(Object.assign({}, this.target_), {
            set: function () {
                return true;
            }
        });
        this._observers.clear();
        this.target_ = null;
    };
    Model.prototype.isFrozen = function () {
        return this._isRevoked;
    };
    Model.prototype.addFresh = function (setFresh) {
        if (this._hasMainDerivation) {
            throw Error('There is already a main derivation');
        }
        else {
            this._hasMainDerivation = true;
            this._setFresh = setFresh;
            getAdm(this.target_).addFresh(setFresh);
        }
    };
    Model.prototype.runObservers = function (target, prop) {
        var _a, _b;
        (_b = (_a = this._observables
            .get(target)) === null || _a === void 0 ? void 0 : _a.get(prop)) === null || _b === void 0 ? void 0 : _b.forEach(function (value) { return value.runreaction(); });
    };
    Model.prototype.findReaction = function (target, prop) {
        var _a;
        return (_a = this._observables.get(target)) === null || _a === void 0 ? void 0 : _a.get(prop);
    };
    Object.defineProperty(Model.prototype, "value", {
        get: function () {
            return this.proxy_;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "target", {
        get: function () {
            return this.target_;
        },
        enumerable: false,
        configurable: true
    });
    return Model;
}());
export { Model };
export default Model;
