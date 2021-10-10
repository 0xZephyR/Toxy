var adm = Symbol();
var Administration = /** @class */ (function () {
    function Administration(target_) {
        this.target_ = target_;
        this.freshMethod = null;
    }
    Administration.prototype.addFresh = function (set) {
        var _a;
        (_a = this.freshMethod) === null || _a === void 0 ? void 0 : _a.push(set);
    };
    Administration.prototype.doFresh = function () {
        var _a;
        (_a = this.freshMethod) === null || _a === void 0 ? void 0 : _a.forEach(function (v) { return v(); });
    };
    return Administration;
}());
export function getAdm(o) {
    return o[adm];
}
export default function createStore(target) {
    Object.defineProperty(target, adm, {
        value: new Administration(target),
        configurable: true
    });
    return target;
}
