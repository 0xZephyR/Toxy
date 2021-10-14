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
import { action, autorun, observable, transaction } from 'mobx';
import { observer } from 'mobx-react';
var Jack = observable({
    count: 1,
    person: {
        name: 'Jack',
        age: 18
    },
    increment: function () {
        this.person.age++;
    },
    change: function () {
        this.person = __assign(__assign({}, this.person), { name: 'John' });
    }
}, { increment: action });
var counter = observable({
    count: 0,
    increment: function () {
        this.count++;
    }
}, { increment: action });
autorun(function () {
    console.log(Jack.count + '-' + counter.count);
});
export var Mcounter = observer(function () {
    return (_jsxs("div", { children: [Jack.count, _jsx("button", __assign({ onClick: function () {
                    transaction(function () {
                        transaction(function () {
                            counter.increment();
                            counter.increment();
                        });
                        counter.increment();
                    });
                } }, { children: "change" }), void 0)] }, void 0));
});
