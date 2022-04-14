import { useState } from "react";
import AuthContext from "./authContext";

const AuthState = (props) => {
	const [authentication, setAuthentication] = useState(false);
	const [user, setUser] = useState({ name: '' });

	const setAuth = (status = false) => {
		setAuthentication(status);
		console.log("Log from AuthState (authentication) :", authentication);
	}

	const setUserDetail = (userDetails) => {
		setUser(userDetails);
		console.log("Log from AuthState (user):", user);
	}
	return (
		<AuthContext.Provider value={{ authentication, setAuth, user, setUserDetail }}>
			{props.children}
		</AuthContext.Provider>
	);
}
export default AuthState;
