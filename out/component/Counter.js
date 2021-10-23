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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// eslint-disable-next-line no-use-before-define
import { useEffect } from 'react';
import { arrayStore, counter as counterStore, personStore } from '../libs/store';
import { autorun, createModel, transaction, useMainDerivation, useNormalDerivation } from '../libs/store-api';
var $array = createModel(arrayStore);
var $counter = createModel(counterStore);
var $person = createModel(personStore);
autorun(function () {
    console.log($counter.value.count + ' ' + $person.value.child.age);
});
autorun(function () {
    console.log($person.value.name);
});
export var Counter = function () {
    var _a = useMainDerivation($counter), counter = _a[0], freeze = _a[1];
    var _b = useMainDerivation($person), person = _b[0], personFreeze = _b[1];
    useEffect(function () {
        var handleHash = function () { return console.log('hashchange'); };
        window.addEventListener('hashchange', handleHash);
        return function () {
            window.removeEventListener('hashchange', handleHash);
        };
    }, []);
    //const componentA = useCallback(() => () => <A />, [person.child]);
    // const DoubleCounter = useMemo(
    // 	() => 2 * counterStore.count,
    // 	[counterStore.count]
    // );
    return (_jsxs(_Fragment, { children: [_jsx("a", __assign({ href: '#test' }, { children: "hash" }), void 0), counter.count, _jsx("button", __assign({ onClick: function () {
                    transaction(function () {
                        transaction(function () {
                            counter.count++;
                            counter.count++;
                        });
                        counter.count++;
                    });
                } }, { children: "+" }), void 0), _jsx("input", { value: person.name, onChange: function (e) {
                    transaction(function () {
                        person.name = e.currentTarget.value;
                    }, 0);
                } }, void 0), _jsx(A, {}, void 0)] }, void 0));
};
var A = function () {
    var counter = useNormalDerivation($counter);
    var person = useNormalDerivation($person);
    return (_jsxs("div", { children: [counter.count, _jsx("input", { value: person.name, onChange: function (e) {
                    transaction(function () {
                        person.name = e.currentTarget.value;
                    }, 0);
                } }, void 0)] }, void 0));
};
var rootA = createModel(counterStore);
var $personA = createModel(personStore);
export var Another = function () {
    var _a = useMainDerivation(rootA), counter = _a[0], revoke = _a[1];
    var _b = useMainDerivation($personA), person = _b[0], personFreeze = _b[1];
    return (_jsxs("div", { children: [counter.count, _jsx("button", __assign({ onClick: function () {
                    for (var i = 0; i < 1; ++i) {
                        counter.count++;
                        //console.log('change');
                    }
                } }, { children: "+" }), void 0), _jsx("div", { children: _jsx("input", { value: person.name }, void 0) }, void 0)] }, void 0));
};
