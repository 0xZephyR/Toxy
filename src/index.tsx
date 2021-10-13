// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom';
import { Another, Counter } from './component/Counter';
import { Mcounter } from './component/Mcounter';
ReactDOM.render(
	<React.StrictMode>
		<Counter />
		<Another />
		<Mcounter />
	</React.StrictMode>,
	document.getElementById('root')
);
