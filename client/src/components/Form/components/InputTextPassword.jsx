import React from 'react';
import PropTypes from 'prop-types';

function InputTextPassword(props) {
	return (
		<div className='form-floating mb-3'>
			<input
				type={props.showPassword ? 'text' : 'password'}
				className='form-control'
				placeholder={props.placeholder}
				id={props.name}
				name={props.name}
				onChange={props.onChange}
				value={props.value}
				required={props.isRequired}
			/>
			<label htmlFor={props.name} className='placeholder'>
				{props.placeholder}
			</label>
		</div>
	);
}
InputTextPassword.propTypes = {
	placeholder: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	isRequired: PropTypes.bool,
};
InputTextPassword.defaultProps = {
	isRequired: false,
	showPassword: false,
};

export default InputTextPassword;
