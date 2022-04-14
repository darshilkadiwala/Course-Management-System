import PropTypes from 'prop-types';
export function NavBarIconItem(props) {
	return (
		<>
			<div className={props.iconClass} onClick={props.onClick}>
				{props.icon}
			</div>
		</>
	);
}
NavBarIconItem.propTypes = {
	iconClass: PropTypes.string,
};
