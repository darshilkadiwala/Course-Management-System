import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export function NavBarLinkItem(props) {
	return (
		<li>
			{props.toLink && (
				<>
					<Link
						to={props.toLink}
						className={props.cssClass}
						onClick={props.onClick}
					>
						{props.linkText}
					</Link>
					{props.children}
				</>
			)}
			{!props.toLink && (
				<>
					<span className={props.cssClass} onClick={props.onClick}>
						{props.linkText}
					</span>
					{props.children}
				</>
			)}
		</li>
	);
}
NavBarLinkItem.propTypes = {
	toLink: PropTypes.string.isRequired,
	linkText: PropTypes.string.isRequired,
	cssClass: PropTypes.string,
	onClick: PropTypes.object,
};
