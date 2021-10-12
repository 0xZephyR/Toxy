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
import { currentObserver } from './autorun';
import { getAdm } from './createStore';
import { globalStateHandler, observableHandler } from './observable';
import Reaction from './reaction';
export var globalDerivation = null;
export var globalAutorun = null;
var ModelDefinition;
(function (ModelDefinition) {
    // 每个共享状态的组件树的根store
    var Model = /** @class */ (function () {
        function Model(target) {
            var _this = this;
            this.this_ = null;
            this._observers = [];
            this._observables = new Map();
            this._hasMainDerivation = false;
            this._setFresh = function () { };
            this._isRevoked = false;
            this.target_ = target;
            this.this_ = this;
            //内层proxy
            var innerProxy = Proxy.revocable(target, observableHandler);
            //外层proxy
            var outerProxy = Proxy.revocable(innerProxy.proxy, globalStateHandler);
            this.proxy_ = outerProxy.proxy;
            this.revoke_ = function () {
                outerProxy.revoke();
                innerProxy.revoke();
                _this.proxy_ = Proxy.revocable(__assign({}, _this.target_), {}).proxy;
                getAdm(_this.target_).removeFresh(_this._setFresh);
                setTimeout(function () {
                    var f = _this._setFresh;
                    _this.destroy();
                    f(function (v) { return !v; });
                }, 0);
                return true;
            };
        }
        Model.prototype.autorun = function (fn) {
            var prev = globalDerivation;
            globalDerivation = this.this_;
            var reaction = new Reaction(fn);
            currentObserver.startObserve(reaction);
            fn();
            currentObserver.endObserve();
            globalDerivation = prev;
        };
        Object.defineProperty(Model.prototype, "value", {
            get: function () {
                return this.proxy_;
            },
            enumerable: false,
            configurable: true
        });
        Model.prototype.addObserver = function (reaction) {
            this._observers.push(reaction);
        };
        Model.prototype.destroy = function () {
            this._hasMainDerivation = false;
            this._isRevoked = true;
            this._setFresh = null;
            this.revoke_ = function () { return false; };
            this.target_ = __assign({}, this.target_);
        };
        Model.prototype.isRevoked = function () {
            return this._isRevoked;
        };
        Model.prototype.hasMainStore = function () {
            return this._hasMainDerivation;
        };
        Model.prototype.rootStoreMounted = function (setFresh) {
            if (this._hasMainDerivation) {
                throw Error('There is already a main derivation');
            }
            else {
                this._hasMainDerivation = true;
                this._setFresh = setFresh;
                getAdm(this.target_).addProxy();
                getAdm(this.target_).addFresh(setFresh);
            }
        };
        return Model;
    }());
    ModelDefinition.Model = Model;
})(ModelDefinition || (ModelDefinition = {}));
export default ModelDefinition;
