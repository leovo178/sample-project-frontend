import React, { useState } from 'react'

import { Box, Button, TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Search } from '@material-ui/icons'
import { useMutation } from '@apollo/react-hooks'
import { SET_USER_SEARCH_TEXT } from './node_modules/@views/User/query'

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		justifyContent: 'space-between',
		maxWidth: ({ width }) => width,
		width: '100%',
	},
	searchinput: {
		width: '80%',
	},
	searchbutton: {
		color: theme.palette.common.white,
		padding: 0,
	},
	searchbutton__icon: {
		fontSize: '2rem',
	},
}))

const SearchBox = props => {
	const { userSearchValue, width, onSearch } = props
	const [searchValue, setSearchValue] = useState(userSearchValue)
	const classes = useStyles({ width })
	const [setUserSearchValue] = useMutation(SET_USER_SEARCH_TEXT)
	const handleSearchTextChange = text => {
		setUserSearchValue({ variables: { text } })
	}
	return (
		<Box className={classes.root}>
			<TextField
				value={searchValue}
				variant='outlined'
				placeholder='search...'
				className={classes.searchinput}
				onChange={e => {
					setSearchValue(e.target.value)
					handleSearchTextChange(e.target.value)
				}}
				onKeyDown={e => {
					if (e.keyCode === 13) {
						onSearch(searchValue)
					}
				}}
			/>
			<Button
				variant='contained'
				size='large'
				className={classes.searchbutton}
				onClick={() => onSearch(searchValue)}
			>
				<Search className={classes.searchbutton__icon} />
			</Button>
		</Box>
	)
}

export default SearchBox
