import React from 'react';
import PropTypes from 'prop-types';

function SelectDropdown(props) {
	return (
		<div className='form-floating'>
			<select
				className='form-select'
				id={props.name}
				name={props.name}
				onChange={props.onChange}
				required={props.isRequired}>
				{Object.keys(props.options).map((key) => (
					<option key={key} value={key}>
						{props.options[key]}
					</option>
				))}
			</select>
			<label htmlFor={props.name}>{props.placeholder}</label>
		</div>
	);
}

SelectDropdown.propTypes = {
	placeholder: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	isRequired: PropTypes.bool,
};

SelectDropdown.defaultProps = {
	isRequired: false,
};

export default SelectDropdown;
