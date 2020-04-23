import React from 'react'
import { Box, makeStyles } from '@material-ui/core'
import MessageCard from '../MessageCard/MessageCard'

ViewMessage.propTypes = {}

const useStyles = makeStyles(() => ({
	root: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		width: '100%',
		overflow: 'auto',
		padding: '26px 16px',
	},
}))

const dataExample = [
	1,
	`	Lorem Ipsum is simply dummy text of the printing and typesetting
	industry. Lorem Ipsum has been the industry's standard dummy text ever
	since the 1500s, when an unknown printer took a galley of type and
	scrambled it to make a type specimen book. It has survived not only
	five centuries, but also the leap into electronic typesetting,
	remaining essentially unchanged. It was popularised in the 1960s with
	the release of Letraset sheets containing Lorem Ipsum passages, and
	more recently with desktop publishing software like Aldus PageMaker
	including versions of Lorem Ipsum.`,
	1,
	1,
	1,
	`	Lorem Ipsum is simply dummy text of the printing and typesetting
	industry. Lorem Ipsum has been the industry's standard dummy text ever
	since the 1500s, when an unknown printer took a galley of type and
	scrambled it to make a type specimen book. It has survived not only
	five centuries, but also the leap into electronic typesetting,
	remaining essentially unchanged. It was popularised in the 1960s with
	the release of Letraset sheets containing Lorem Ipsum passages, and
	more recently with desktop publishing software like Aldus PageMaker
	including versions of Lorem Ipsum.`,
	1,
	`ry. Lorem Ipsum has been the industry's standard dummy text ever
	since the 1500s, when an unknown printer took a galley of type and
	scrambled it to make a type specimen book. It has survived not only
	five centuries, but also the leap into electronic typesetting,
	remaining essentially `,
	1,
	1,
	1,
	1,
	"ry. Lorem Ipsum has been the industry's s",
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
]
export default function ViewMessage() {
	const classes = useStyles()
	return (
		<Box className={classes.root}>
			{dataExample.map((item, index) => (
				<MessageCard message={item} index={index} />
			))}
		</Box>
	)
}
