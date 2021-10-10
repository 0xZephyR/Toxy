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
// eslint-disable-next-line no-use-before-define
import { useState } from 'react';
import './App.css';
import logo from './logo.svg';
function App() {
    var _a = useState(1), count = _a[0], setCount = _a[1];
    return (_jsx("div", __assign({ className: "App" }, { children: _jsxs("header", __assign({ className: "App-header" }, { children: [_jsx("img", { src: logo, className: "App-logo", alt: "logo" }, void 0), _jsxs("p", { children: ["Edit ", _jsx("code", { children: "src/App.tsx" }, void 0), " and save to reload."] }, void 0), _jsx("a", __assign({ className: "App-link", href: "https://reactjs.org", target: "_blank", rel: "noopener noreferrer" }, { children: "Learn React" }), void 0)] }), void 0) }), void 0));
}
export default App;
