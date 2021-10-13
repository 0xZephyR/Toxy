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

export const counter = createStore({ age: 20, count: 0 });
export const person = createStore({
	name: 'Mike',
	age: 30,
	child: {
		name: 'John',
		age: 18
	}
});

function change(o: any) {
	// eslint-disable-next-line no-param-reassign
	o = new Proxy(o, {});
	console.log(o);
}

let v = { age: 0 };
change(v);
console.log(v);
