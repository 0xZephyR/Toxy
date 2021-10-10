import { jsx as _jsx } from "react/jsx-runtime";
// eslint-disable-next-line no-use-before-define
import { useState } from 'react';
import { Another, Counter } from './component/Counter';
function App() {
    var _a = useState(1), count = _a[0], setCount = _a[1];
    return (_jsx(Counter, { render: function () { return _jsx(Another, {}, void 0); } }, void 0));
}
export default App;
