import React from "react";
import PropTypes from "prop-types";
import { FooterLinkItem } from "./FooterLinkItem";

function FooterLinkGroup(props) {
	return (
		<>
			<div className="footer-link-group" id={props.linkGroup.slug}>
				<div className="footer-link-group-header">
					<FooterLinkItem
						toLink={"category/" + props.linkGroup.slug}
						linkText={props.linkGroup.categoryName}
						cssClass="footer-link"
					/>
				</div>
				{props.linkGroup.subcategories.map((subcategory) => (
					<FooterLinkItem
						key={subcategory.slug}
						toLink={
							"category/" +
							props.linkGroup.slug +
							"/subcategory/" +
							subcategory.slug
						}
						linkText={subcategory.subcategoryName}
						cssClass="footer-link"
					/>
				))}
			</div>
		</>
	);
}

FooterLinkGroup.propTypes = { linkGroup: PropTypes.object };

export default FooterLinkGroup;
