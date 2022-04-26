import { useState } from "react";
import AuthContext from "./authContext";

const AuthState = (props) => {
	const [authentication, setAuthentication] = useState(false);
	const [user, setUser] = useState({ role: '', lastName: '', firstName: '', profilePicture: '' });

	const setAuth = (status = false) => {
		setAuthentication(status);
	}

	const setUserDetail = (userDetails) => {
		setUser(userDetails);
	}
	return (
		<AuthContext.Provider value={{ authentication, setAuth, user, setUserDetail }}>
			{props.children}
		</AuthContext.Provider>
	);
}
export default AuthState;
