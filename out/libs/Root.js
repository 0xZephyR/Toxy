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
import { globalStateHandler, observableHandler } from './observable';
//export const $target = Symbol('target pointed to root');
var RootSpace;
(function (RootSpace) {
    // 每个共享状态的组件树的根store
    var Root = /** @class */ (function () {
        function Root(target) {
            var _this = this;
            this._observers = [];
            this._hasRootStore = false;
            this._setFresh = function () { };
            this._isRevoked = false;
            this.target_ = target;
            var innerProxy = Proxy.revocable(target, observableHandler);
            var outerProxy = Proxy.revocable(innerProxy.proxy, globalStateHandler);
            Object.defineProperty(innerProxy.proxy, '$target', {
                value: this,
                configurable: false,
                writable: false,
                enumerable: false
            });
            this.proxy_ = outerProxy.proxy;
            //Object(this.proxy_, '')
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
        Root.prototype.autorun = function (fn) {
            fn.apply(this);
        };
        Root.prototype.get = function () {
            return this.proxy_;
        };
        Root.prototype.destroy = function () {
            this._hasRootStore = false;
            this._isRevoked = true;
            this._setFresh = null;
            this.revoke_ = function () { return false; };
            this.target_ = __assign({}, this.target_);
        };
        Root.prototype.isRevoked = function () {
            return this._isRevoked;
        };
        Root.prototype.hasRootStore = function () {
            return this._hasRootStore;
        };
        Root.prototype.rootStoreMounted = function (setFresh) {
            if (this._hasRootStore) {
                throw Error('There is already a root store');
            }
            else {
                this._hasRootStore = true;
                this._setFresh = setFresh;
                getAdm(this.target_).addProxy();
                getAdm(this.target_).addFresh(setFresh);
            }
        };
        return Root;
    }());
    RootSpace.Root = Root;
})(RootSpace || (RootSpace = {}));
export default RootSpace;
