import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'

import { useQuery, useMutation } from '@apollo/react-hooks'

import { Box, Button, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { DeleteDialog } from '@views_components'

import {
	CREATE_USER,
	UPDATE_USER,
	DELETE_USER,
	FETCH_USER_LIST,
	GET_USER_SEARCH_TEXT,
	GET_SELECTED_USER,
	SET_SELECTED_USER,
} from '@views/User/query'
import { useCreateAUser, useDeleteAUser } from './useMutations'

import { getToken } from '@src/shares/utils'
import { LIMIT } from '@src/configs.local'

const useStyles = makeStyles(theme => ({
	root: {
		width: 381,
		margin: '20px auto',
		padding: theme.spacing(2),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	formtitle: {
		color: theme.palette.primary.main,
		fontWeight: 600,
	},
	forminput: {
		width: '100%',
		marginTop: 18,
	},
	formcontent: {
		padding: 0,
	},
	formbuttons: {
		display: 'flex',
		flexDirection: 'column',
		padding: 0,
		width: '100%',
		'&>button': {
			marginTop: theme.spacing(2),
			marginLeft: 0,
			'&:not(:first-child)': {
				marginLeft: 0,
			},
		},
	},
	formbutton: {
		color: theme.palette.common.white,
		fontWeight: 600,
		textTransform: 'capitalize',
		padding: '18px 0',
	},
}))

const FormEditor = ({ history }) => {
	const authToken = getToken()

	const {
		data: { userSearchValue },
	} = useQuery(GET_USER_SEARCH_TEXT)
	const {
		data: { selectedUser },
	} = useQuery(GET_SELECTED_USER)
	const [setSelectedUser] = useMutation(SET_SELECTED_USER, {
		onError: err => {
			alert(err)
		},
	})
	const [updateUser] = useMutation(UPDATE_USER, {
		onError: err => {
			alert(err)
		},
	})
	const [createNewUser] = useCreateAUser(
		CREATE_USER,
		FETCH_USER_LIST,
		{
			query: { searchText: userSearchValue, limit: LIMIT },
		},
		authToken
	)
	const [deleteUser] = useDeleteAUser(DELETE_USER, FETCH_USER_LIST, {
		query: { searchText: userSearchValue, limit: LIMIT },
	})

	const [userId, setUserId] = useState('')
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false)

	useEffect(() => {
		setUserId(selectedUser.id)
		setEmail(selectedUser.email)
		setName(selectedUser.name)
	}, [selectedUser])

	const classes = useStyles()

	const onCancel = () => {
		if (!authToken) {
			history.push('/sign-in')
			return
		}
		setSelectedUser({
			variables: {
				selectedUser: {
					id: userId + '_reset',
					name: '',
					email: '',
					__typename: 'User',
				},
			},
		})
		setPassword('')
		setConfirmPassword('')
	}

	const validateForm = () => {
		const emailRegex = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/gm
		const isValidEmail = email.match(emailRegex)

		if (isValidEmail === null || password !== confirmPassword) {
			return false
		}
		return true
	}

	const shouldUseRefetchQueries = () => {
		return userSearchValue
			? [
					{
						query: FETCH_USER_LIST,
						variables: {
							query: { searchText: userSearchValue, limit: LIMIT },
						},
					},
			  ]
			: []
	}

	const updateUserInfo = () => {
		let userInfo = { id: userId, email, name }
		if (password) userInfo = { ...userInfo, password }
		updateUser({
			variables: { user: userInfo },
		})
			.then(() => {
				onCancel()
			})
			.catch(error => {
				alert(error.message)
				console.error(error)
			})
	}

	const createAUser = () => {
		createNewUser({
			variables: { user: { email, name, password } },
			refetchQueries: shouldUseRefetchQueries(),
			awaitRefetchQueries: !!userSearchValue,
		})
			.then(() => {
				onCancel()
			})
			.catch(error => {
				alert(error.message)
				console.error(error)
			})
	}

	const onSubmit = () => {
		const isValid = validateForm()

		if (isValid) {
			if (selectedUser.id && selectedUser.name && selectedUser.email) {
				updateUserInfo()
			} else {
				createAUser()
			}
		} else {
			alert('Not valid!!!!')
		}
	}

	const onAgreeDeleteAnUser = () => {
		deleteUser({ variables: { id: userId } })
			.then(() => {
				setSelectedUser({
					variables: {
						selectedUser: {
							id: userId + '_reset',
							name: '',
							email: '',
							__typename: 'User',
						},
					},
				})
				setOpenConfirmDeleteDialog(false)
			})
			.catch(error => console.error(error))
	}

	return (
		<Box className={classes.root}>
			<Typography variant='h5' className={classes.formtitle}>
				{selectedUser.id && selectedUser.name && selectedUser.email
					? 'Modify'
					: 'Sign up'}
			</Typography>
			<Box className={classes.formcontent}>
				<TextField
					value={email}
					label='EMAIL'
					variant='outlined'
					type='email'
					className={classes.forminput}
					onChange={e => setEmail(e.target.value.toLowerCase())}
				/>
				<TextField
					value={name}
					label='NAME'
					variant='outlined'
					type='text'
					autoComplete='true'
					className={classes.forminput}
					onChange={e => setName(e.target.value)}
				/>
				<TextField
					value={password}
					label='PASSWORD'
					variant='outlined'
					type='password'
					autoComplete='true'
					className={classes.forminput}
					onChange={e => setPassword(e.target.value)}
				/>
				<TextField
					value={confirmPassword}
					label='PASSWORD CONFIRM'
					variant='outlined'
					type='password'
					autoComplete='true'
					className={classes.forminput}
					onChange={e => setConfirmPassword(e.target.value)}
				/>
			</Box>
			<Box className={classes.formbuttons}>
				<Button
					variant='contained'
					color='primary'
					size='large'
					fullWidth
					className={classes.formbutton}
					onClick={onSubmit}
				>
					{selectedUser.id && selectedUser.name && selectedUser.email
						? 'Save'
						: 'Register'}
				</Button>
				{selectedUser.id && selectedUser.name && selectedUser.email ? (
					<Button
						variant='contained'
						size='large'
						fullWidth
						className={classes.formbutton}
						onClick={() => {
							setOpenConfirmDeleteDialog(true)
						}}
					>
						Delete
					</Button>
				) : null}
				<Button
					variant='contained'
					size='large'
					fullWidth
					className={classes.formbutton}
					onClick={onCancel}
				>
					Cancel
				</Button>
			</Box>
			<DeleteDialog
				open={openConfirmDeleteDialog}
				onClose={() => {
					setOpenConfirmDeleteDialog(false)
				}}
				onAgree={onAgreeDeleteAnUser}
				onDisagree={() => {
					setOpenConfirmDeleteDialog(false)
				}}
			/>
		</Box>
	)
}

export default withRouter(FormEditor)
