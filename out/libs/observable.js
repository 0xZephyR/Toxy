/* eslint-disable no-underscore-dangle */
import { currentObserver, observableMap, observerMap } from './autorun';
import { getAdm } from './createStore';
export var observableHandler = {
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
