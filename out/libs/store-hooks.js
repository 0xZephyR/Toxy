/* eslint-disable no-underscore-dangle */
import { useState } from 'react';
import { getAdm } from './createStore';
var handler = {
    set: function (target) {
        setTimeout(function () {
            getAdm(target).doFresh();
        }, 0);
        return true;
    }
};
var Root = /** @class */ (function () {
    function Root(target) {
        this.target_ = target;
        var proxy = Proxy.revocable(target, handler);
        this.proxy_ = proxy.proxy;
        this.revoke_ = proxy.revoke;
    }
    return Root;
}());
export function createrRoot(target) {
    return new Root(target);
}
export function useRootStore(root) {
    var _a = useState(false), fresh = _a[0], setFresh = _a[1];
    getAdm(root.target_).addFresh(function () { return setFresh(function (v) { return !v; }); });
    return root.proxy_;
}
export function useNormalStore(root) {
    return root.proxy_;
}
