var adm = Symbol();
var Administration = /** @class */ (function () {
    function Administration(target_) {
        this.target_ = target_;
        this._freshId = 0;
        this.freshMethod = new Set();
        this.currentAmountOfProxy = 0;
    }
    Administration.prototype.addFresh = function (set) {
        var _a;
        (_a = this.freshMethod) === null || _a === void 0 ? void 0 : _a.add(set);
    };
    Administration.prototype.removeFresh = function (set) {
        return this.freshMethod.delete(set);
    };
    Administration.prototype.doFresh = function () {
        var _a;
        (_a = this.freshMethod) === null || _a === void 0 ? void 0 : _a.forEach(function (v) { return v(function (value) { return !value; }); });
    };
    //TODO store代理数量清零后重置store状态
    Administration.prototype.addProxy = function () {
        ++this.currentAmountOfProxy;
    };
    Administration.prototype.removeProxy = function () {
        --this.currentAmountOfProxy;
    };
    Administration.prototype.get_ = function (key) {
        return this.target_[key];
    };
    return Administration;
}());
export function getAdm(o) {
    return o[adm];
}
export default function createStore(target) {
    Object.defineProperty(target, adm, {
        value: new Administration(target)
    });
    return target;
}
