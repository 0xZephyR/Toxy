/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import { useEffect, useState } from 'react';
import { createStore } from './createStore';
import { Batch, currentObserver } from './globals';
import Model from './Model';
import Reaction from './reaction';
/**
 * !暴露给用户的API
 */
export function createModel(target) {
    return new Model(target);
}
export function autorun(fn) {
    var reaction = new Reaction(fn);
    var prev = currentObserver.get();
    currentObserver.set(reaction);
    fn();
    currentObserver.set(prev);
}
export function transaction(fn, delay) {
    Batch.level++;
    var prev = Batch.delay;
    Batch.delay = delay !== null && delay !== void 0 ? delay : 0;
    fn();
    Batch.delay = prev;
    Batch.level--;
}
export function useMainDerivation(root_) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // if (!root_.isMounted()) {
    // 	throw Error('Main derivation has not mounted');
    // }
    var _a = useState(false), setFresh = _a[1];
    var root = root_;
    useEffect(function () {
        // if (!root_.isMounted()) {
        // 	throw Error('Main derivation has not mounted');
        // }
        root.addFresh(setFresh);
        return function () {
            root.freeze();
        };
    }, []);
    return [root.proxy_, root.freeze];
}
export function useNormalDerivation(root_) {
    var root = root_;
    // if (!root.isMounted()) {
    // 	throw new Error('no main derivation');
    // }
    return root.proxy_;
}
export default createStore;
