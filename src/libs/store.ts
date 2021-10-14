import createStore from './createStore';

export const counter = createStore({ age: 20, count: 0 });
export const person = createStore({
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
