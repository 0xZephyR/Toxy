/* eslint-disable no-underscore-dangle */
import { currentObserver, observableMap, reportDependence } from './autorun';
import { getAdm } from './createStore';
// 内层handler，实现数据响应
export var observableHandler = {
    get: function (target, prop, receiver) {
        //console.log(Reflect.get(receiver, $target));
        if (!currentObserver.current) {
            return getAdm(target).get_(prop);
        }
        reportDependence(target, prop);
        return getAdm(target).get_(prop);
    },
    set: function (target, prop, value, receiver) {
        var _a, _b;
        if (Reflect.get(target, prop) === value) {
            return Reflect.set(target, prop, value, receiver);
        }
        Reflect.set(target, prop, value, receiver);
        (_b = (_a = observableMap
            .get(target)) === null || _a === void 0 ? void 0 : _a.get(prop)) === null || _b === void 0 ? void 0 : _b.forEach(function (v) {
            v.runreaction();
        });
        return true;
    }
};
//外层handler, 重渲染组件
export var globalStateHandler = {
    get: function (target, prop) {
        return target[prop];
    },
    set: function (target, prop, value, receiver) {
        setTimeout(function () {
            getAdm(target).doFresh();
        }, 0);
        return Reflect.set(target, prop, value, receiver);
    }
};
