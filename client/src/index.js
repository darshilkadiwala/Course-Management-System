import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import AuthState from './context/auth/AuthState';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthState>
				<App />
			</AuthState>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);
