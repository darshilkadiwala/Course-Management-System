import React from 'react';
import PropTypes from 'prop-types';

function CheckBox(props) {
	return (
		<div className='form-check'>
			<input
				className='form-check-input'
				type='checkbox'
				onChange={props.onChange}
				id={props.name}
				name={props.name}
				checked={props.isChecked}
				required={props.isRequired}
			/>
			<label className='form-check-label' htmlFor={props.name}>
				{props.placeholder}
			</label>
		</div>
	);
}
CheckBox.propTypes = {
	placeholder: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	isChecked: PropTypes.bool,
	onChange: PropTypes.func,
	isRequired: PropTypes.bool,
};
CheckBox.defaultProps = {
	isRequired: false,
	isChecked: false,
};

export default CheckBox;
