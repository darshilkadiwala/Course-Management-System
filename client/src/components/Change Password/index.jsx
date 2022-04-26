import { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';
import AuthContext from '../../context/auth/authContext';

export function ChangePassword(props) {
	const { authentication, setAuth } = useContext(AuthContext);
	const navigateTo = useNavigate();
	const [user, setUser] = useState({
		oldPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	});
	const onChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	if (!authentication) {
		navigateTo('/login');
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (user.confirmNewPassword === user.newPassword) {
			try {
				const url = 'http://localhost:5000/api/v1/auth/changePassword';
				const { data: res } = await axios.put(url, user, {
					headers: { Authorization: `Bearer ${localStorage.getItem('loginToken')}` },
				});
				if (res.statusCode === 200) {
					props.alert('Password changed successfully', 'success');
					localStorage.clear();
					setAuth(false);
					navigateTo('/login');
				}
			} catch (error) {
				props.alert(error.response.data.msg, 'danger');
			}
		} else {
			props.alert('Please match confirm password', 'danger');
		}
	};

	return (
		<>
			<div className='py-5 h-100 bg-offWhite'>
				<div className='row justify-content-center align-items-center h-100 me-0'>
					<div className='col-12 col-lg-9 col-xl-7'>
						<div className='card p-3' style={{ borderRadius: '15px' }}>
							<div className='card-body py-2 px-4 px-md-5 py-md-4'>
								<h3 className='mb-4 pb-2 pb-md-0 mb-md-4 fw-bold'>
									Change Password
								</h3>
								<hr />
								<form onSubmit={handleSubmit}>
									<div className='row justify-content-center align-items-center'>
										<div className='col-md-6 mb-2'>
											<div className='form-floating mb-3'>
												<input
													type='password'
													className='form-control'
													placeholder='Old Password'
													id='oldPassword'
													name='oldPassword'
													value={user.oldPassword}
													onChange={(e) => onChange(e)}
													required
												/>
												<label
													htmlFor='oldPassword'
													className='placeholder'>
													Old Password
												</label>
											</div>
										</div>
									</div>

									<div className='row justify-content-center align-items-center'>
										<div className='col-md-6 mb-2'>
											<div className='form-floating mb-3'>
												<input
													type='password'
													className='form-control'
													placeholder='New Password'
													id='newPassword'
													name='newPassword'
													value={user.newPassword}
													onChange={(e) => onChange(e)}
													required
												/>
												<label
													htmlFor='newPassword'
													className='placeholder'>
													New Password
												</label>
											</div>
										</div>
									</div>

									<div className='row justify-content-center align-items-center'>
										<div className='col-md-6 mb-2'>
											<div className='form-floating mb-3'>
												<input
													type='password'
													className='form-control'
													placeholder='Confirm New Password'
													id='confirmNewPassword'
													name='confirmNewPassword'
													value={user.confirmNewPassword}
													onChange={(e) => onChange(e)}
													required
												/>
												<label
													htmlFor='confirmNewPassword'
													className='placeholder'>
													Confirm New Password
												</label>
											</div>
										</div>
									</div>

									<div className='row justify-content-center align-items-center px-3'>
										<input
											className='btn btn-primary btn-lg col-md-6'
											type='submit'
											value='Change Password'
										/>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
