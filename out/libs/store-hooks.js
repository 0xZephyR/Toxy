/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import { autorun } from './autorun';
import { getAdm } from './createStore';
import ModelDefinition from './Model';
export function createModel(target) {
    return new ModelDefinition.Model(target);
}
export function useMainDerivation(root) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    var _a = useState(false), _ = _a[0], setFresh = _a[1];
    useEffect(function () {
        root.rootStoreMounted(setFresh);
        return function () {
            if (root.revoke_() === true) {
                getAdm(root.target_).removeProxy();
            }
        };
    }, []);
    return [
        root.isRevoked() ? root.target_ : root.proxy_,
        root.revoke_
    ];
}
export function useNormalDerivation(root) {
    if (!root.hasMainStore()) {
        throw new Error('no root store');
    }
    //if(!Root)
    return root.isRevoked() ? root.target_ : root.proxy_;
}
export var useAutorun = function (fn) {
    useEffect(function () {
        var unsubscribe = autorun(fn);
        return function () { return unsubscribe(); };
    }, []);
};
