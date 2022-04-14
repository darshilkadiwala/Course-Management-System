import PropTypes from 'prop-types';
export function NavBarItems(props) {
	return <div className={props.cssClass}>{ props.children}</div>;
}
NavBarItems.propTypes = {
	cssClass: PropTypes.string.isRequired,
};
