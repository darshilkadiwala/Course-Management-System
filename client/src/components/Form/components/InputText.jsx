import React from 'react';
import PropTypes from 'prop-types';

function InputText(props) {
	return (
		<div className='form-floating mb-3'>
			<input
				type={props.type}
				className='form-control'
				placeholder={props.placeholder}
				id={props.name}
				name={props.name}
				onChange={props.onChange}
				value={props.value}
				required={props.isRequired}
				maxLength={props.maxLength}
				minLength={props.minLength}
				max={props.max}
				min={props.min}
			/>
			<label htmlFor={props.name} className='placeholder'>
				{props.placeholder}
			</label>
		</div>
	);
}

InputText.propTypes = {
	placeholder: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	type: PropTypes.string,
	onChange: PropTypes.func,
	isRequired: PropTypes.bool,
	maxLength: PropTypes.number,
	minLength: PropTypes.number,
	max: PropTypes.number,
	min: PropTypes.number,
};

InputText.defaultProps = {
	isRequired: false,
	type: 'text',
};

export default InputText;
