import createStore from './createStore';
const handler: ProxyHandler<any> = {
	get(target: any, prop: any) {
		console.log(prop);
		return target[prop];
	},
	set(target: any, prop: any, newValue: any, receiver: any) {
		console.log(prop);
		return Reflect.set(target, prop, newValue, receiver);
	}
};
const a = new Proxy({ name: 'Jack' }, handler);
const c = { value: 10, proxy: a };
const cp = new Proxy(c, handler);
console.log(cp);
export const counter = createStore({ age: 20, count: 0 });
export const person = createStore({ name: 'Mike', age: 18 });
