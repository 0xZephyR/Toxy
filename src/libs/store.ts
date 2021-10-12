import createStore from './createStore';

const c = { age: 20, count: 0 };
const a = {
	value: 0,
	person: {
		name: 'Jack',
		age: 18
	}
};
const proxy = new Proxy(a, {
	get(target: any, prop: any) {
		console.log(prop);
		return target[prop];
	}
});
const vvv = proxy.person;
export const counter = createStore(c);
