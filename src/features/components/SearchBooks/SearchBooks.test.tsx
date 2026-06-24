import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {
  createBooksSearchQueryResult,
  type MockBooksSearchQueryResult,
} from '../../../test-utils/bookQueryMocks'

// Mock child components to keep this test focused on SearchBooks query states
jest.mock('../BookCard/BookCard', () => ({
  __esModule: true,
  default: ({ book }: { book: { title?: string } }) =>
    React.createElement('div', { 'data-testid': 'book-card' }, book.title ?? ''),
}))

// eslint-disable-next-line no-var
var mockUseBooksSearchQuery = jest.fn<
  MockBooksSearchQueryResult,
  [query: string, maxResults?: number]
>(() => createBooksSearchQueryResult())

jest.mock('../../books/bookQueries', () => ({
  useBooksSearchQuery: mockUseBooksSearchQuery,
}))

// This import is safe because jest.mock hoisting ensures bookQueries and BookCard are mocked first
import BooksList from './SearchBooks'

describe('SearchBooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockUseBooksSearchQuery.mockReturnValue(createBooksSearchQueryResult())
  })

  test('renders search input and buttons', () => {
    render(<BooksList />)

    expect(screen.getByPlaceholderText('search.inputPlaceholder')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'search.searchButton' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'search.clearButton' })).toBeInTheDocument()
  })

  test('updates submitted query when search button is clicked', async () => {
    const user = userEvent.setup()

    render(<BooksList />)

    const input = screen.getByPlaceholderText('search.inputPlaceholder')
    await user.type(input, 'Pigs')

    const searchButton = screen.getByRole('button', { name: 'search.searchButton' })
    await user.click(searchButton)

    expect(mockUseBooksSearchQuery).toHaveBeenLastCalledWith('Pigs', 20)
  })

  test('updates submitted query when Enter is pressed', async () => {
    const user = userEvent.setup()

    render(<BooksList />)

    const input = screen.getByPlaceholderText('search.inputPlaceholder')
    await user.type(input, 'Pigs{Enter}')

    expect(mockUseBooksSearchQuery).toHaveBeenLastCalledWith('Pigs', 20)
  })

  test('clears input and resets submitted query when clear button is clicked', async () => {
    const user = userEvent.setup()

    render(<BooksList />)

    const input = screen.getByPlaceholderText('search.inputPlaceholder')
    await user.type(input, 'Pigs')

    const searchButton = screen.getByRole('button', { name: 'search.searchButton' })
    await user.click(searchButton)

    const clearButton = screen.getByRole('button', { name: 'search.clearButton' })
    await user.click(clearButton)

    expect(input).toHaveValue('')
    expect(mockUseBooksSearchQuery).toHaveBeenLastCalledWith('', 20)
  })

  test('shows loading state', () => {
    mockUseBooksSearchQuery.mockReturnValue(createBooksSearchQueryResult({ isLoading: true }))

    render(<BooksList />)

    expect(screen.getByText('search.loadingLabel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'search.searchingButton' })).toBeDisabled()
  })

  test('shows fetching state', () => {
    mockUseBooksSearchQuery.mockReturnValue(createBooksSearchQueryResult({ isFetching: true }))

    render(<BooksList />)

    expect(screen.getByText('search.loadingLabel')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'search.searchingButton' })).toBeDisabled()
  })

  test('shows error message', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isError: true,
        error: new Error('Network error'),
      }),
    )

    render(<BooksList />)

    expect(screen.getByText('search.errorMessage')).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  test('renders books when search returns results', async () => {
    const user = userEvent.setup()

    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        data: [
          { id: '1', title: 'Book 1', authors: ['Author 1'] },
          { id: '2', title: 'Book 2', authors: ['Author 2'] },
        ],
      }),
    )

    render(<BooksList />)

    const input = screen.getByPlaceholderText('search.inputPlaceholder')
    await user.type(input, 'Pigs')

    const searchButton = screen.getByRole('button', { name: 'search.searchButton' })
    await user.click(searchButton)

    expect(screen.getByText('Book 1')).toBeInTheDocument()
    expect(screen.getByText('Book 2')).toBeInTheDocument()
  })

  test('shows empty state after submitted search returns no books', async () => {
    const user = userEvent.setup()

    render(<BooksList />)

    const input = screen.getByPlaceholderText('search.inputPlaceholder')
    await user.type(input, 'Unknown Book')

    const searchButton = screen.getByRole('button', { name: 'search.searchButton' })
    await user.click(searchButton)

    expect(screen.getByText('search.noBooksFound')).toBeInTheDocument()
    expect(screen.getByText('search.emptyTitle')).toBeInTheDocument()
    expect(screen.getByText('search.emptySubtitle')).toBeInTheDocument()
  })
})
