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
import { autorun, createModel, transaction, useMainDerivation, useNormalDerivation } from '../libs/api';
import { counter as counterStore, person } from '../libs/store';
export function sleep(interval) {
    var start = Date.now();
    while (Date.now() - start <= interval * 1000) { }
}
var $counter = createModel(counterStore);
var $person = createModel(person);
autorun(function () {
    console.log($counter.value.count + ' ' + $person.value.child.age);
});
// root.autorun(() => {
// 	console.log(root.value.count);
// });
export var Counter = function () {
    var _a = useMainDerivation($counter), counter = _a[0], freeze = _a[1];
    var _b = useMainDerivation($person), jack = _b[0], presonFreeze = _b[1];
    // const DoubleCounter = useMemo(
    // 	() => 2 * counterStore.count,
    // 	[counterStore.count]
    // );
    return (_jsxs("div", { children: [counter.count, _jsx("button", __assign({ onClick: function () {
                    transaction(function () {
                        transaction(function () {
                            counter.count++;
                            counter.count++;
                        });
                        counter.count++;
                    });
                } }, { children: "+" }), void 0), _jsx("button", __assign({ onClick: function () {
                    jack.child.age++;
                } }, { children: "JackAdd" }), void 0), _jsx(A, {}, void 0)] }, void 0));
};
var A = function () {
    var counter = useNormalDerivation($counter);
    return _jsx("div", { children: counter.count }, void 0);
};
var rootA = createModel(counterStore);
export var Another = function () {
    var _a = useMainDerivation(rootA), counter = _a[0], revoke = _a[1];
    return (_jsxs("div", { children: [counter.count, _jsx("button", __assign({ onClick: function () {
                    for (var i = 0; i < 1; ++i) {
                        counter.count++;
                        //console.log('change');
                    }
                } }, { children: "+" }), void 0), _jsx("button", __assign({ onClick: function () {
                    revoke();
                } }, { children: "revoke" }), void 0)] }, void 0));
};
