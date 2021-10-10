// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { A } from './component/Counter';
ReactDOM.render(
	<React.StrictMode>
		<App />
		<A/>
	</React.StrictMode>,
	document.getElementById('root')
);

