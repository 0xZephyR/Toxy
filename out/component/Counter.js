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
import { counter } from '../libs/store';
import { createRoot, useRootStore } from '../libs/store-hooks';
export function sleep(interval) {
    var start = Date.now();
    while (Date.now() - start <= interval * 1000) { }
}
var root = createRoot(counter);
root.autorun(function () {
    console.log(root.get().count);
});
export var Counter = function () {
    var _a = useRootStore(root), counterStore = _a[0], revoke = _a[1];
    // const DoubleCounter = useMemo(
    // 	() => 2 * counterStore.count,
    // 	[counterStore.count]
    // );
    return (_jsxs("div", { children: [counterStore.count, _jsx("button", __assign({ onClick: function () {
                    for (var i = 0; i < 2; ++i) {
                        counterStore.count++;
                        //console.log('change');
                    }
                } }, { children: "+" }), void 0), _jsx("button", __assign({ onClick: function () {
                    revoke();
                } }, { children: "revoke" }), void 0)] }, void 0));
};
var rootA = createRoot(counter);
export var Another = function () {
    var _a = useRootStore(rootA), counterStore = _a[0], revoke = _a[1];
    // useAutorun(() => {
    // 	console.log(counterStore.count);
    // });
    return (_jsxs("div", { children: [counterStore.count, _jsx("button", __assign({ onClick: function () {
                    for (var i = 0; i < 2; ++i) {
                        counterStore.count++;
                        //console.log('change');
                    }
                } }, { children: "+" }), void 0), _jsx("button", __assign({ onClick: function () {
                    revoke();
                } }, { children: "revoke" }), void 0)] }, void 0));
};
