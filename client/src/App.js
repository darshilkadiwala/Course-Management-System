import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/';
import Navbar from './components/Navbar';
import AuthContext from './context/auth/authContext';
import { useContext, useState } from 'react';
import axios from 'axios';
import Alert from './components/Alert';
import AlertContext from './context/alert/alertContext';
import { ChangePassword } from './components/Change Password';

export default function App() {
	const { setAuth, setUserDetail } = useContext(AuthContext);
	const { alert, showAlert } = useContext(AlertContext);
	let user;
	const setAlert = () => { showAlert("Dark mode has been enabled", "success"); }
	const getLoggedInUser = async () => {
		const token = localStorage.getItem("loginToken");
		try {
			const url = 'http://localhost:5000/api/v1/auth/me';
			const { data: res } = await axios.get(url, { token });
			console.table(res);
		} catch (error) {
			console.table(error);
			if (error.response && error.response.status >= 400 && error.response.status <= 500) {
				// setError(error.response.data.msg);
			}
		}
	}
	if (localStorage.getItem('loginToken')) {
		setAuth(true);
	}
	if (localStorage.getItem('loginToken') && localStorage.getItem('loggedUser')) {
		// setUserDetail(JSON.parse(localStorage.getItem('loggedUser')));
		user = JSON.parse(localStorage.getItem('loggedUser'));
	}
	return (
		<>
			<Navbar />
			<Alert alert={alert} />
			<Routes>
				<Route path="/register" element={<Register alert={showAlert} />} />
				<Route path="/change-password" element={<ChangePassword alert={showAlert} />} />
				{/* <Route path="/about" element={<div className='container'>About</div>} /> */}
				{/* <Route path="/" element={<Login setUserLoginStatus={authentication} />} /> */}
				<Route exact path="/login" element={<Login alert={showAlert} />} />
				<Route
					path="/"
					element={
						<div className="jumbotron jumbotron-fluid mt-4">
							<div className="container">
								<h1 className="display-3">Course Management System</h1>
								<p className="lead">Home</p>
								<hr className="my-2" />
								{user && <div>
									<strong>First Name: </strong> {user.firstName}<br />
									<strong>Last Name: </strong> {user.lastName}<br />
									<img src={"http://localhost:5000/uploads/user/profile/" + user.profilePicture} alt="profilePicture" className='profilePicture' />
								</div>}
							</div>
						</div>
					}
				/>
				<Route
					path="*"
					element={
						<main main style={{ padding: "1rem" }}>
							<p>There's nothing here!</p>
						</main >
					}
				/>
			</Routes >
		</>
	);
}
