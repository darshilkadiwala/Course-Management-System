import PropTypes from "prop-types";
import React from "react";
import FooterLinkGroup from "./FooterLinkGroup";

export function FooterWrapper(props) {
	return (
		<div className="footer-wrapper mx-5 p-4">
			{props.categories.map((category) => (
				<FooterLinkGroup key={category.slug} linkGroup={category} />
			))}
		</div>
	);
}
FooterWrapper.propTypes = {
	categories: PropTypes.array,
};
FooterWrapper.defaultProps = {
	categories: [],
};
