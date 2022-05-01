import { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import AuthContext from '../../context/auth/authContext';
import InputText from '../Form/components/InputText';
import InputTextPassword from '../Form/components/InputTextPassword';
import CheckBox from '../Form/components/CheckBox';
import SelectDropdown from '../Form/components/SelectDropdown';

export function Register(props) {
	const { authentication } = useContext(AuthContext);
	const navigateTo = useNavigate();
	const [user, setUser] = useState({
		firstName: '',
		lastName: '',
		contactNumber: '',
		emailId: '',
		username: '',
		password: '',
		confirmPassword: '',
		gender: '',
	});
	const genderList = {
		male: 'Male',
		female: 'Female',
		other: 'Other',
	};
	const [showPassword, setShowPassword] = useState(false);
	const viewPassword = (checked) => {
		setShowPassword(checked);
	};
	const onChange = (e) => {
		console.log(user);
		setUser({ ...user, [e.target.name]: e.target.value });
	};
	const setGender = (gender) => {
		setUser({ ...user, gender });
	};

	if (authentication) {
		navigateTo('/');
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (user.confirmPassword === user.password) {
			try {
				const url = 'http://localhost:5000/api/v1/auth/register';
				// const { data: res } = await axios.post(url, user);
				// if (res.statusCode === 201) {
				props.alert('Registration done successfully', 'success');
				navigateTo('/login');
				// }
			} catch (error) {
				const validatorError = error.response.data.error.ValidatorError;
				if (validatorError) {
					Object.keys(validatorError).foreach((key) => console.log(validatorError[key]));
				}
				if (
					error.response &&
					error.response.status >= 400 &&
					error.response.status <= 500
				) {
					setError(error.response.data.msg);
				}
			}
		} else {
			props.alert('Please confirm password', 'danger');
		}
	};

	return (
		<>
			<div className='login_container'>
				<div className='login_form_container col-10'>
					<div className='left'>
						<h3>Already have an account ?</h3>
						<Link to='/login'>
							<button type='button' className='white_btn mt-2'>
								Login
							</button>
						</Link>
					</div>
					<div className='right py-4'>
						<form onSubmit={handleSubmit}>
							<h1 className='mb-4 pb-2 pb-md-0 mb-md-4 fw-bold text-center'>
								Registration Form
							</h1>
							<div className='row'>
								<div className='col-6 mb-2'>
									<InputText
										name='firstName'
										placeholder='First name'
										value={user.firstName}
										onChange={(e) => onChange(e)}
										isRequired={true}
									/>
								</div>
								<div className='col-6 mb-2'>
									<InputText
										name='lastName'
										placeholder='Last name'
										value={user.lastName}
										onChange={(e) => onChange(e)}
										isRequired={true}
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col-6 mb-2'>
									<SelectDropdown
										placeholder='Gender'
										name='gender'
										onChange={(e) => setGender(e.target.selected)}
										options={genderList}
									/>
								</div>
								<div className='col-6 mb-2'>
									<InputText
										name='contactNumber'
										type='number'
										placeholder='Contact Number'
										value={user.contactNumber}
										onChange={(e) => onChange(e)}
										maxLength={10}
										minLength={10}
										max={9999999999}
										min={1111111111}
										isRequired={true}
									/>
								</div>
							</div>

							<div className='row'>
								<div className='col-6 mb-2'>
									<InputText
										name='emailId'
										type='email'
										placeholder='Email address'
										value={user.emailId}
										onChange={(e) => onChange(e)}
										isRequired={true}
									/>
								</div>

								<div className='col-6 mb-2'>
									<InputText
										name='username'
										placeholder='Username'
										value={user.username}
										onChange={(e) => onChange(e)}
										isRequired={true}
									/>
								</div>
							</div>
							<div className='row'>
								<div className='col-6 mb-2'>
									<InputTextPassword
										name='password'
										placeholder='Password'
										value={user.password}
										showPassword={showPassword}
										onChange={(e) => onChange(e)}
										isRequired={true}
									/>
								</div>
								<div className='col-6 mb-2'>
									<InputTextPassword
										name='confirmPassword'
										placeholder='Confirm Password'
										value={user.confirmPassword}
										showPassword={showPassword}
										onChange={(e) => onChange(e)}
										isRequired={true}
									/>
								</div>
							</div>
							<div className='row'>
								<div className='ms-0 mb-2'>
									<CheckBox
										name='chkShowPassword'
										onChange={(e) => viewPassword(e.target.checked)}
										isChecked={showPassword}
										placeholder='Show passwords'
									/>
								</div>
							</div>
							<div className='row px-3 justify-content-center'>
								<input className='button dark_btn' type='submit' value='Register' />
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
