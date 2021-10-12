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
import createStore from './createStore';
var c = { age: 20, count: 0 };
var proxy = new Proxy(c, {
    get: function (target, value, receiver) {
        console.log('get');
        return value;
    }
});
var p = __assign({}, proxy);
console.log(p.age);
export var counter = createStore(c);
