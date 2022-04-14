import React from 'react';

export default function Alert(props) {
	const capitalize = (word) => {
		const lower = word.toLowerCase();
		return lower.charAt(0).toUpperCase() + lower.slice(1);
	};
	console.log(props.alert);
	return (
		<>
			{props.alert.msg !== null || props.alert.type !== null ? (
				<div
					style={{
						maxHeight: '50px',
						position: 'fixed',
						top: '100px',
						left: '10px',
						justifyContent: 'space-between',
					}}>
					<div className={`alert alert-${props.alert.type} fade show`} role='alert'>
						<button
							type='button'
							className='close'
							data-dismiss='alert'
							aria-label='Close'>
							<span aria-hidden='true'>&times;</span>
							<span className='sr-only'>Close</span>
						</button>
						<strong>{capitalize(props.alert.type)}</strong>: {props.alert.msg}
					</div>
				</div>
			) : (
				<></>
			)}
		</>
	);
}
