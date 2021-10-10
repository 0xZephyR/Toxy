// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import { Another, Counter } from './component/Counter';
function App() {
	const [count, setCount] = useState(1);
	return (
		<Counter render={()=> <Another/>}/>
	);
}

export default App;
