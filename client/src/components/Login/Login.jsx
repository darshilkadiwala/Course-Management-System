import { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import AuthContext from '../../context/auth/authContext';
import InputText from '../Form/components/InputText';
import InputTextPassword from '../Form/components/InputTextPassword';
import CheckBox from '../Form/components/CheckBox';

export function Login(props) {
	const { authentication, setAuth, setUserDetail } = useContext(AuthContext);
	const navigateTo = useNavigate();
	const [error, setError] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const viewPassword = (checked) => {
		setShowPassword(checked);
	};
	if (authentication) {
		navigateTo('/');
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = 'http://localhost:5000/api/v1/auth/login';
			const { data: res } = await axios.post(url, { username, password });
			if (res.statusCode === 200 && res.success === true) {
				localStorage.setItem('loginToken', res.token);
				localStorage.setItem('loggedUser', JSON.stringify(res.data));
				setUserDetail(res.data);
				setAuth(true);
				navigateTo('/');
			}
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
						<h1>Login to your account</h1>
						<div className='row mt-5'>
							<div className='mb-2'>
								<InputText
									name='username'
									placeholder='Username'
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									isRequired={true}
								/>
							</div>
						</div>
						<div className='row'>
							<div className='mb-2'>
								<InputTextPassword
									name='password'
									placeholder='Password'
									value={password}
									showPassword={showPassword}
									onChange={(e) => setPassword(e.target.value)}
									isRequired={true}
								/>
							</div>
						</div>
						<div className='row'>
							<div className='ms-0'>
								<CheckBox
									name='chkShowPassword'
									onChange={(e) => viewPassword(e.target.checked)}
									isChecked={showPassword}
									placeholder='Show password'
								/>
							</div>
						</div>
						{error && <div className={styles.error_msg}>{error}</div>}
						<div className='row d-flex justify-content-center'>
							<button type='submit' className={`button ${styles.green_btn}`}>
								Login
							</button>
						</div>
					</form>
				</div>
				<div className={styles.right}>
					<h3>New Here ?</h3>
					<Link to='/register'>
						<button type='button' className={styles.white_btn}>
							Register
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}
