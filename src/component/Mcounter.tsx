import { action, autorun, observable, transaction } from 'mobx';
import { observer } from 'mobx-react';
// eslint-disable-next-line no-use-before-define
import React from 'react';
const Jack = observable(
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
const counter = observable(
	{
		count: 0,
		increment() {
			this.count++;
		}
	},
	{ increment: action }
);
autorun(() => {
	console.log(Jack.count + '-' + counter.count);
});
export const Mcounter = observer(() => {
	return (
		<div>
			{Jack.count}
			<button
				onClick={() => {
					transaction(() => {
						transaction(() => {
							counter.increment();
							counter.increment();
						});
						counter.increment();
					});
				}}
			>
				change
			</button>
		</div>
	);
});
