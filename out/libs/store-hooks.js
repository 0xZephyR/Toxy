/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import { getAdm } from './createStore';
import { observableHandler } from './observable';
var globalStateHandler = {
    set: function (target, prop, value, receiver) {
        setTimeout(function () {
            getAdm(target).doFresh();
        }, 0);
        return Reflect.set(target, prop, value, receiver);
    }
};
var Root = /** @class */ (function () {
    function Root(target) {
        this.target_ = target;
        var innerProxy = Proxy.revocable(target, observableHandler);
        var outerProxy = Proxy.revocable(innerProxy, globalStateHandler);
        this.proxy_ = outerProxy.proxy;
        this.revoke_ = function () {
            outerProxy.revoke();
            innerProxy.revoke();
        };
    }
    return Root;
}());
export function createrRoot(target) {
    return new Root(target);
}
export function useRootStore(root) {
    var _a = useState(false), _ = _a[0], setFresh = _a[1];
    useEffect(function () {
        getAdm(root.target_).addProxy();
        getAdm(root.target_).addFresh(setFresh);
        return function () {
            root.revoke_();
            getAdm(root.target_).removeProxy();
        };
    }, []);
    return root.proxy_;
}
export function useNormalStore(root) {
    if (!root.proxy_) {
        throw new Error('no root store');
    }
    return root.proxy_;
}
