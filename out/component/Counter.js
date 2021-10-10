import { jsx as _jsx } from "react/jsx-runtime";
import { counter } from '../libs/store';
import { createrRoot, useRootStore } from '../libs/store-hooks';
var root = createrRoot(counter);
export var Counter = function () {
    var counterStore = useRootStore(root);
    return (_jsx("div", { children: counterStore.count }, void 0));
};
