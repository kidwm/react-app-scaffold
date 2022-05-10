import PropTypes from 'prop-types';

import styles from './Icon.css';

const Icon = ({ className, as, name }) => {
	const Element = typeof as === 'string' ? as : 'span';
	return (
		<Element
			className={[styles.icon, className].filter(Boolean).join(' ')}
			role="img"
			aria-hidden="true"
		>
			{ name }
		</Element>
	)
}

Icon.propTypes = {
    className: PropTypes.string,
	as: PropTypes.string,
    name: PropTypes.string.isRequired,
}

export default Icon;
