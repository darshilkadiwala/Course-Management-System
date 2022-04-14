import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<AlertState>
				<AuthState>
					<App />
				</AuthState>
			</AlertState>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);
