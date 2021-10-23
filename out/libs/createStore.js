var adm = Symbol();
var Administration = /** @class */ (function () {
    function Administration(target) {
        this.freshMethods = new Set();
        this._derivedModels = new Set();
        this.target_ = target;
    }
    Administration.prototype.addFresh = function (set) {
        var _a;
        (_a = this.freshMethods) === null || _a === void 0 ? void 0 : _a.add(set);
    };
    Administration.prototype.removeFresh = function (set) {
        return this.freshMethods.delete(set);
    };
    Administration.prototype.fresh = function () {
        var _a;
        (_a = this.freshMethods) === null || _a === void 0 ? void 0 : _a.forEach(function (v) { return v(function (value) { return !value; }); });
    };
    Administration.prototype.runObserversInModels = function (prop, target) {
        this._derivedModels.forEach(function (v) {
            v.runObservers(target, prop);
        });
    };
    Administration.prototype.addNewModel = function (model) {
        this._derivedModels.add(model);
    };
    return Administration;
}());
export function getAdm(o) {
    return o[adm];
}
export function create(target) {
    Object.defineProperty(target, adm, {
        value: new Administration(target)
    });
    return target;
}
var factory = {
    box: function (target) {
        var o = {
            value: target,
            get: function () {
                return target;
            },
            set: function (newValue) {
                this.value = newValue;
            }
        };
        return create(o);
    },
    array: function (target) {
        return create(target);
    }
};
export var createStore = Object.assign(create, factory);
