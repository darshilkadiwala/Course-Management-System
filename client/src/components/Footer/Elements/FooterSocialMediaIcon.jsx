import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
function FooterSocialMediaIcon(props) {
	return (
		<Link
			className="btn btn-lg text-light m-1 footer-social-icon"
			to="#"
			data-mdb-ripple-color="light"
		
		>
			<i className={props.iconClass} />
		</Link>
	);
}

FooterSocialMediaIcon.propTypes = {
	iconClass: PropTypes.string.isRequired,
};

export default FooterSocialMediaIcon;
