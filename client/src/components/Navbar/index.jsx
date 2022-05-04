import "./Navbar.css";
import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { ReactComponent as Logo } from "../../logo.svg";
import { FaBars, FaSearch, FaTimes } from "react-icons/fa";
import { Nav } from "./Elements/Nav";
import { NavBarBrand } from "./Elements/NavBarBrand";
import { NavBarIconItem } from "./Elements/NavBarIconItem";
import { NavBarItems } from "./Elements/NavBarItems";
import { NavBarLinkItem } from "./Elements/NavBarLinkItem";
import { NavBarSearchForm } from "./Elements/NavBarSearchForm";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";
import NavbarDropdownItem from "./Elements/NavbarDropdownItem";

function MainNavbar(props) {
	const navigateTo = useNavigate();
	//using AuthContext to check authentication state
	const { authentication, setAuth, user, setUserDetail } =
		useContext(AuthContext);

	const [isOpenDrawer, setIsOpenDrawer] = useState(false);
	const [isOpenSearchForm, setIsOpenSearchForm] = useState(false);

	const toggleOpenDrawer = () => {
		setIsOpenDrawer(!isOpenDrawer);
	};
	const toggleOpenSearchForm = () => {
		setIsOpenSearchForm(!isOpenSearchForm);
	};

	const logoutUser = () => {
		localStorage.clear();
		setAuth(false);
		navigateTo("/login");
	};
	// toggleOpenDrawer();
	return (
		<>
			<Nav>
				{!isOpenDrawer ? (
					<NavBarIconItem
						icon={<FaBars />}
						iconClass="menu-icon"
						onClick={toggleOpenDrawer}
					/>
				) : (
					<NavBarIconItem
						icon={<FaTimes />}
						iconClass="menu-icon"
						onClick={toggleOpenDrawer}
					/>
				)}
				<NavBarBrand
					title={props.title}
					logo={<Logo className="nav-logo-icon" />}
				/>
				<NavBarItems cssClass={`nav-items ${isOpenDrawer ? "active" : ""}`}>
					<NavBarItems cssClass="left-items">
						<li className="dropdown">
							<span
								// to="/category"
								className="dropdown-toggle"
								data-toggle="dropdown"
							>
								Category<b className="caret"></b>
							</span>
							<NavbarDropdownItem cssListClass="dropdown-menu" listType="ul">
								{props.categories.map((category) => (
									<NavbarDropdownItem
										listType="li"
										cssListClass="dropdown-submenu"
										linkText={category.categoryName}
										cssLinkClass="dropdown-toggle"
										toLink={"courses/" + category.slug}
										key={category.slug}
									>
										{category.subcategories.length >0 && (
											<NavbarDropdownItem
												cssListClass="dropdown-menu"
												listType="ul"
											>
												{category.subcategories.map((subCategory) => (
													<>
														<NavBarLinkItem
															toLink={
																"courses/" +
																category.slug +
																"/" +
																subCategory.slug
															}
															key={subCategory.slug}
															linkText={subCategory.subcategoryName}
														/>
													</>
												))}
											</NavbarDropdownItem>
										)}
									</NavbarDropdownItem>
								))}
							</NavbarDropdownItem>
						</li>
						{/* <NavBarLinkItem toLink='/about' linkText='About' />
						<NavBarLinkItem toLink='/blogs' linkText='Blogs' />
						<NavBarLinkItem toLink='/feedback' linkText='Feedback' /> */}
					</NavBarItems>
					<NavBarItems cssClass="right-items">
						<NavBarSearchForm cssClass={isOpenSearchForm ? "active" : ""} />
						{!authentication ? (
							<>
								<NavBarLinkItem
									toLink="/register"
									linkText="Register"
									cssClass="btnWithBG btn"
								/>
								<NavBarLinkItem
									toLink="/login"
									linkText="Login"
									cssClass="btn login"
								/>
							</>
						) : (
							<>
								<NavBarLinkItem
									toLink="/change-password"
									linkText="Change password"
									cssClass="login"
								/>
								<NavBarLinkItem
									onClick={logoutUser}
									cssClass="ml-3 login"
									linkText="Logout"
								/>
							</>
						)}
					</NavBarItems>
				</NavBarItems>

				{!isOpenSearchForm ? (
					<NavBarIconItem
						icon={<FaSearch />}
						iconClass="search-icon"
						onClick={toggleOpenSearchForm}
					/>
				) : (
					<NavBarIconItem
						icon={<FaTimes />}
						iconClass="search-icon"
						onClick={toggleOpenSearchForm}
					/>
				)}
			</Nav>
		</>
	);
}
MainNavbar.propTypes = {
	title: PropTypes.string,
	categories: PropTypes.array,
};
MainNavbar.defaultProps = {
	title: "Course Management",
	categories: [],
};
export default MainNavbar;
