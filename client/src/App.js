import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Login/Login';
import Navbar from './components/Navbar';
import AuthContext from './context/auth/authContext';
import { useContext } from 'react';

export default function App() {
	const { setAuth } = useContext(AuthContext);
	if (localStorage.getItem('loginToken')) {
		setAuth(true);
	}
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/about" element={<div className='container'>About</div>} />
				{/* <Route path="/" element={<Login setUserLoginStatus={authentication} />} /> */}
				<Route exact path="/login" element={<Login />} />
				<Route
					path="/"
					element={
						<div className="jumbotron jumbotron-fluid">
							<div className="container">
								<h1 className="display-3">Fluid jumbo heading</h1>
								<p className="lead">Jumbo helper text</p>
								<hr className="my-2" />
								<p>More info</p>
								<p className="lead">
									<a className="btn btn-primary btn-lg" href="/" role="button">Jumbo action name</a>
								</p>
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

// const getLoggedInUser = async () => {
// 	const token = localStorage.getItem("token");
// 	try {
// 		const url = 'http://localhost:5000/api/v1/auth/me';
// 		const { data: res } = await axios.get(url, { token });
// 		console.table(res);
// 	} catch (error) {
// 		console.table(error);
// 		// if (error.response && error.response.status >= 400 && error.response.status <= 500) {
// 		// 	setError(error.response.data.msg);
// 		// }
// 	}
// }