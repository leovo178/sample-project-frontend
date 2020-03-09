import React, { useState } from 'react'
import {
	makeStyles,
	createMuiTheme,
	ThemeProvider,
} from '@material-ui/core/styles'
import teal from '@material-ui/core/colors/teal'

import { Box, Button, TextField, Typography } from '@material-ui/core'

const useStyles = makeStyles({
	root: {
		width: 381,
		margin: '20px auto',
		padding: 16,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	form_title: {
		color: teal[600],
		fontWeight: 600,
	},
	form_input: {
		width: '100%',
		marginTop: '18px',
	},
	form_content: {
		padding: 0,
	},
	form_buttons: {
		display: 'flex',
		flexDirection: 'column',
		padding: 0,
		width: '100%',
		'&>button': {
			marginTop: 16,
			marginLeft: 0,
			'&:not(:first-child)': {
				marginLeft: 0,
			},
		},
	},
	form_button: {
		color: '#ffffff',
		fontWeight: 600,
		textTransform: 'capitalize',
		padding: '18px 0',
	},
})

const theme = createMuiTheme({
	palette: {
		primary: {
			main: teal[600],
		},
	},
})

const FormEditor = ({ selectedItem }) => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const classes = useStyles()

	return (
		<ThemeProvider theme={theme}>
			<Box className={classes.root}>
				<Typography variant='h5' className={classes.form_title}>
					{selectedItem ? 'Modify' : 'Sign up'}
				</Typography>
				<div className={classes.form_content}>
					<TextField
						value={email}
						label='EMAIL'
						variant='outlined'
						type='email'
						onChange={e => setEmail(e.target.value)}
						className={classes.form_input}
					/>
					<TextField
						value={password}
						label='NAME'
						variant='outlined'
						type='text'
						autoComplete='true'
						onChange={e => setPassword(e.target.value)}
						className={classes.form_input}
					/>
					<TextField
						value={password}
						label='PASSWORD'
						variant='outlined'
						type='password'
						autoComplete='true'
						onChange={e => setPassword(e.target.value)}
						className={classes.form_input}
					/>
					<TextField
						value={password}
						label='PASSWORD CONFIRM'
						variant='outlined'
						type='password'
						autoComplete='true'
						onChange={e => setPassword(e.target.value)}
						className={classes.form_input}
					/>
				</div>
				<div className={classes.form_buttons}>
					<Button
						variant='contained'
						color='primary'
						size='large'
						fullWidth
						className={classes.form_button}
					>
						{selectedItem ? 'Save' : 'Register'}
					</Button>
					{selectedItem ? (
						<Button
							variant='contained'
							size='large'
							fullWidth
							className={classes.form_button}
						>
							Delete
						</Button>
					) : null}
					<Button
						variant='contained'
						size='large'
						fullWidth
						className={classes.form_button}
					>
						Cancel
					</Button>
				</div>
			</Box>
		</ThemeProvider>
	)
}

export default FormEditor