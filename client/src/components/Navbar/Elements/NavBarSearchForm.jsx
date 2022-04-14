import PropTypes from 'prop-types';
export function NavBarSearchForm(props) {
	return (
		<>
			<form action='#' className={props.cssClass}>
				<input type='search' className='search-data' placeholder='Search' />
				<button type='submit' className='fas fa-search' />
			</form>
		</>
	);
}
NavBarSearchForm.propTypes = {
	cssClass: PropTypes.string,
};
