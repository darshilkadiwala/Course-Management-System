import React from 'react';

export default function Alert(props) {
	return (
		<>
			{props.alert !== null && props.alert.msg !== null && props.alert.type !== null ? (
				<div
					style={{
						maxHeight: '50px',
						position: 'fixed',
						top: '100px',
						left: '10px',
						justifyContent: 'space-between',
					}}>
					<div className={`alert alert-${props.alert.type} fade show`} role='alert'>
						<strong>{props.alert.msg}</strong>
					</div>
				</div>
			) : (
				<></>
			)}
		</>
	);
}
