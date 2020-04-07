import React from 'react'

const NavBarItem = props => {
	const { styles, page, pathname, handleOnChangePage } = props

	return (
		<li
			data-cy={`${page}-page`}
			className={styles}
			onClick={() => handleOnChangePage(pathname)}
		>
			{page}
		</li>
	)
}

export default NavBarItem
