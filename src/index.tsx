// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom';
import { Another, Counter } from './component/Counter';
ReactDOM.render(
	<React.StrictMode>
		<Counter />
		<Another />
	</React.StrictMode>,
	document.getElementById('root')
);
