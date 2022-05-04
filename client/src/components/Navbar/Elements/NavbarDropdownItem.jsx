import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function NavbarDropdownItem(props) {
	return (
		<props.listType className={props.cssListClass}>
			{props.toLink && (
				<Link
					to={props.toLink}
					className={props.cssLinkClass}
					data-toggle="dropdown"
				>
					{props.linkText}
				</Link>
			)}
			{props.children}
		</props.listType>
	);
}

NavbarDropdownItem.propTypes = {
	toLink: PropTypes.string,
	linkText: PropTypes.string || PropTypes.element,
	cssLinkClass: PropTypes.string,
	cssListClass: PropTypes.string,
	listType: PropTypes.string.isRequired,
};

export default NavbarDropdownItem;
