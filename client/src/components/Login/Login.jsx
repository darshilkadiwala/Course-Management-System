import { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import AuthContext from '../../context/auth/authContext';

export function Login(props) {
	const { authentication, setAuth } = useContext(AuthContext);
	const navigateTo = useNavigate();
	const [error, setError] = useState('');
	const [username, setUsername] = useState('admin123');
	const [password, setPassword] = useState('Admin@123');

	if (authentication) {
		navigateTo('/');
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = 'http://localhost:5000/api/v1/auth/login';
			const { data: res } = await axios.post(url, { username, password });
			setError('');
			console.table(res.token);
			localStorage.setItem('loginToken', res.token);
			console.log(res);
			setAuth(true);
			console.log('Log from login page :', authentication);
			navigateTo('/');
		} catch (error) {
			console.log(error);
			if (error.response && error.response.status >= 400 && error.response.status <= 500) {
				setError(error.response.data.msg);
			}
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login to Your Account</h1>
						<input
							type='text'
							placeholder='Username'
							name='username'
							onChange={(e) => setUsername(e.target.value)}
							value={username}
							required
							className={styles.input}
						/>
						<input
							type='password'
							placeholder='Password'
							name='password'
							onChange={(e) => setPassword(e.target.value)}
							value={password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type='submit' className={styles.green_btn}>
							Login
						</button>
					</form>
				</div>
				<div className={styles.right}>
					<h1>New Here ?</h1>
					<Link to='/signup'>
						<button type='button' className={styles.white_btn}>
							Sing Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}
