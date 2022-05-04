import PropsType from "prop-types";
import React from "react";
import { ReactComponent as Logo } from "../../../logo.svg";
import { NavBarBrand } from "../../Navbar/Elements/NavBarBrand";
import FooterSocialMediaIcon from "./FooterSocialMediaIcon";

function FooterStrip(props) {
	return (
		<div className="footer-strip text-center text-white p-1 px-5">
			<NavBarBrand
				title={props.title}
				logo={<Logo className="nav-logo-icon" />}
			/>
			<div className="footer-social-icon-group">
				<FooterSocialMediaIcon iconClass="fab fa-facebook" />
				<FooterSocialMediaIcon iconClass="fab fa-twitter" />
				<FooterSocialMediaIcon iconClass="fab fa-google" />
				<FooterSocialMediaIcon iconClass="fab fa-instagram" />
				<FooterSocialMediaIcon iconClass="fab fa-linkedin-in" />
				<FooterSocialMediaIcon iconClass="fab fa-github" />
			</div>
		</div>
	);
}
FooterStrip.propTypes = {
	title: PropsType.string.isRequired,
};

export default FooterStrip;
