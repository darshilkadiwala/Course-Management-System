import { useState } from "react";
import AlertContext from "./alertContext";

const AlertState = (props) => {
	const [alert, setAlert] = useState({ msg: null, type: null });
	const showAlert = (message, type) => {
		setAlert({
			msg: message,
			type: type
		})
		setTimeout(() => {
			setAlert(null);
		}, 1500);
	}
	return (
		<AlertContext.Provider value={{ alert, showAlert }}>
			{props.children}
		</AlertContext.Provider>
	);
}
export default AlertState;