import PropTypes from "prop-types";
import React from "react";
import { FooterNav } from "./Elements/FooterNav";
import FooterStrip from "./Elements/FooterStrip";
import { FooterWrapper } from "./Elements/FooterWrapper";

function Footer(props) {
	return (
		<>
			<FooterNav>
				<FooterWrapper categories={props.categories} />
				<FooterStrip title="CMS" />
			</FooterNav>
		</>
	);
}
Footer.propTypes = {
	categories: PropTypes.array,
};
Footer.defaultProps = {
	categories: [],
};
export default Footer;
