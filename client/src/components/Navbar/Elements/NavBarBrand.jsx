import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
export function NavBarBrand(props) {
	return (
		<>
			<div className='navbar-brand'>
				{props.logo}
				<Link className='nav-logo-text' to='/'>
					{props.title}
				</Link>
			</div>
		</>
	);
}

NavBarBrand.propTypes = {
	title: PropTypes.string.isRequired,
	logo: PropTypes.any.isRequired,
};
