import React from 'react'
import clsx from 'clsx'
import { Box, Grid, makeStyles, Typography } from '@material-ui/core'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { FETCH_USER_LIST } from '@views/User/gql/query'

import { Loading, LargeTable } from '@views_components'
import { SearchUserBox } from '@views/User/components'
import { ListMessageOfUser } from './components'

import { GET_USER_SEARCH_TEXT, GET_SELECTED_USER_OF_MAIN } from './gql/query'
import { SET_USER_SEARCH_TEXT, SET_SELECTED_USER_OF_MAIN } from './gql/mutation'

import { NETWORK_STATUS_FETCH_MORE, PAGE_LIMIT } from '@src/configs.local'

const useStyle = makeStyles(theme => ({
	root: {
		width: '100%',
		height: '100vh',
		position: 'relative',
	},
	fullheight: {
		height: '100%',
	},
	container: {
		padding: theme.spacing(3),
	},
	container__searchbox__largetable: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		border: `1px solid ${theme.palette.common.border}`,
		marginRight: theme.spacing(1.5),
	},
	searchbox__title: {
		fontWeight: 600,
		marginBottom: theme.spacing(2),
	},
	searchbox: {
		padding: theme.spacing(3),
	},
	overlay: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		background: theme.palette.common.black,
		height: '100%',
		marginLeft: theme.spacing(1.5),
	},
}))

const Main = () => {
	const classes = useStyle()

	const {
		data: { userSearchValueOfMain },
	} = useQuery(GET_USER_SEARCH_TEXT)

	const {
		data: { selectedUserOfMain },
	} = useQuery(GET_SELECTED_USER_OF_MAIN)

	const { loading, data, fetchMore, networkStatus } = useQuery(
		FETCH_USER_LIST,
		{
			variables: { query: { limit: PAGE_LIMIT } },
			notifyOnNetworkStatusChange: true,
			onError: err => alert(err),
		}
	)

	const [setSearchValue] = useMutation(SET_USER_SEARCH_TEXT)
	const [setSelectedUser] = useMutation(SET_SELECTED_USER_OF_MAIN)

	const handleChoseImage = object => {
		setSelectedUser({
			variables: {
				selectedUser: {
					...object,
					__typename: 'UserOfMain',
				},
			},
		})
	}

	const columns = [
		{ headerLabel: 'EMAIL', xs: 6, headerVariable: 'email' },
		{ headerLabel: 'NAME', xs: 6, headerVariable: 'name' },
	]

	const handleSearch = inputVal => {
		setSearchValue({ variables: { searchValue: inputVal } })
		if (inputVal === userSearchValueOfMain) {
			return false
		} else {
			try {
				fetchMore({
					variables: {
						query: { searchText: inputVal, limit: PAGE_LIMIT },
					},
					updateQuery: (prev, { fetchMoreResult }) => {
						if (!fetchMoreResult) {
							return prev
						} else {
							const fetchedUserList = fetchMoreResult.userList
							let cacheUserList = prev.userList
							const hasNext = fetchedUserList.hasNext

							return {
								userList: {
									...cacheUserList,
									items: fetchedUserList.items,
									hasNext,
								},
							}
						}
					},
				})
			} catch (error) {
				alert(error.message)
			}
			setSelectedUser({
				variables: {
					selectedUser: {
						id: '',
						name: '',
						email: '',
						__typename: 'UserOfMain',
					},
				},
			})
		}
	}

	const loadNextUserPage = () => {
		try {
			fetchMore({
				variables: {
					query: {
						limit: PAGE_LIMIT,
						skip: data.userList.items.length,
						searchText: userSearchValueOfMain,
					},
				},
				updateQuery: (prev, { fetchMoreResult }) => {
					if (!fetchMoreResult) return prev
					const fetchedUserList = fetchMoreResult.userList
					let cacheUserList = prev.userList
					const items = [...cacheUserList.items, ...fetchedUserList.items]
					const hasNext = fetchedUserList.hasNext
					return {
						userList: {
							...cacheUserList,
							items,
							hasNext,
						},
					}
				},
			})
		} catch (error) {
			alert(error.message)
		}
	}

	return (
		<Box className={classes.root}>
			<Grid container className={clsx(classes.fullheight, classes.container)}>
				<Grid item xs={4}>
					<Box
						className={clsx(
							classes.container__searchbox__largetable,
							classes.fullheight
						)}
					>
						<Box className={classes.searchbox}>
							<SearchUserBox
								width={328}
								placeholder='search...'
								type='search'
								defaultValue={userSearchValueOfMain}
								onSubmit={handleSearch}
							/>
						</Box>
						{loading && networkStatus !== NETWORK_STATUS_FETCH_MORE ? (
							<Loading open={true} msg={'Loading...'} />
						) : (
							<LargeTable
								items={data.userList.items}
								onClickRow={handleChoseImage}
								selectedRow={selectedUserOfMain}
								columns={columns}
								loadingMore={networkStatus === NETWORK_STATUS_FETCH_MORE}
								isIconClose={false}
								loadNextPage={loadNextUserPage}
								hasNextPage={data.userList.hasNext}
							/>
						)}
					</Box>
				</Grid>
				<Grid item xs={8} className={classes.item__messagelist}>
					{selectedUserOfMain && selectedUserOfMain.id ? (
						<ListMessageOfUser selectedUser={selectedUserOfMain} />
					) : (
						<Box className={classes.overlay}>
							<Typography variant='subtitle2' color='primary' gutterBottom>
								Select an item on the left.
							</Typography>
						</Box>
					)}
				</Grid>
			</Grid>
		</Box>
	)
}

export default Main
