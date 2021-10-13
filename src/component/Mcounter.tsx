import { action, autorun, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
const counter = observable(
	{
		count: 1,
		person: {
			name: 'Jack',
			age: 18
		},
		increment() {
			this.person.age++;
		},
		change() {
			this.person = { ...this.person, name: 'John' };
		}
	},
	{ increment: action }
);
autorun(() => {
	console.log(counter.person.age);
});
export const Mcounter = observer(() => {
	return (
		<div>
			{counter.count}
			<button
				onClick={() => {
					counter.change();
				}}
			>
				change
			</button>
		</div>
	);
});
