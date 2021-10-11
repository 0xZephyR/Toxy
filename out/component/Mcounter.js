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
import { action, autorun, observable } from 'mobx';
import { observer } from 'mobx-react';
import { sleep } from './Counter';
var counter = observable({
    count: 1,
    increment: function () {
        this.count++;
    }
}, { increment: action });
autorun(function () {
    sleep(2);
    console.log(counter.count);
});
export var Mcounter = observer(function () {
    return (_jsxs("div", { children: [counter.count, _jsx("button", __assign({ onClick: function () {
                    counter.increment();
                    console.log('change');
                    counter.increment();
                } }, { children: "add" }), void 0)] }, void 0));
});
