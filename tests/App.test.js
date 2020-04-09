import React from 'react'

import { createMockClient } from 'mock-apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from '@apollo/react-hooks'

import { Route } from 'react-router-dom'

import { App } from '../src/App'

import { renderWithRouter } from '@tests/shares/utils'
import { initialState, resolvers } from '@src/client'

describe('<App/>', () => {
	const cache = new InMemoryCache()
	cache.writeData({
		data: initialState,
	})
	const mockClient = createMockClient({
		cache,
		resolvers,
	})

	it('should match snapshot', () => {
		const { container } = renderWithRouter(
			<ApolloProvider client={mockClient}>
				<Route component={App} />
			</ApolloProvider>
		)
		expect(container).toMatchSnapshot()
	})
})
