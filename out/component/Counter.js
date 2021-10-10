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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { autorun } from '../libs/autorun';
import { counter } from '../libs/store';
import { createrRoot, useNormalStore, useRootStore } from '../libs/store-hooks';
var root = createrRoot(counter);
export var Another = function () {
    var counterStore = useNormalStore(root);
    useEffect(function () {
        return function () {
            console.log('destroyed');
        };
    }, []);
    return (_jsx("span", { children: counterStore.count }, void 0));
};
var rootA = createrRoot(counter);
export var A = function () {
    var counterStore = useRootStore(rootA);
    return (_jsx("p", { children: counterStore.count }, void 0));
};
export var Counter = function (props) {
    var counterStore = useRootStore(root);
    useEffect(function () {
        autorun(function () {
            console.log(counterStore.count);
        });
    }, []);
    return (_jsxs("div", { children: [counterStore.count, _jsx("button", __assign({ onClick: function () {
                    counterStore.count++;
                } }, { children: "+" }), void 0), _jsx(Another, {}, void 0)] }, void 0));
};
