import createStore from './createStore';
export var counter = createStore({ age: 20, count: 0 });
export var person = createStore({
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
