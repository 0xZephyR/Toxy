import { createStore } from './createStore';
export var arrayStore = createStore([1, 2, 3]);
var a = createStore.box(1);
export var counter = createStore({ age: 20, count: 0 });
export var personStore = createStore({
    name: 'Mike',
    age: 30,
    child: {
        name: 'John',
        age: 18
    },
    increment: function () {
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
