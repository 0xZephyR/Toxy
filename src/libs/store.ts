import { createStore } from './createStore';
export const arrayStore = createStore([1, 2, 3]);
const a = createStore.box(1);
export const counter = createStore({ age: 20, count: 0 });
export const personStore = createStore({
	name: 'Mike',
	age: 30,
	child: {
		name: 'John',
		age: 18
	},
	increment() {
		this.child.age++;
	}
});

// export const numStore = createStore.box()
// const handler = {
// 	get(target: any, prop: any) {
// 		console.log('prop:' + prop);
// 		return target[prop];
// 	}
// };
