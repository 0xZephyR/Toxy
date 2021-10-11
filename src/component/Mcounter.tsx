import { action, autorun, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { sleep } from './Counter';
const counter = observable(
	{
		count: 1,
		increment() {
			this.count++;
		}
	},
	{ increment: action }
);
autorun(() => {
	sleep(2);
	console.log(counter.count);
});
export const Mcounter = observer(() => {
	return (
		<div>
			{counter.count}
			<button
				onClick={() => {
					counter.increment();
					console.log('change');
					counter.increment();
				}}
			>
				add
			</button>
		</div>
	);
});
