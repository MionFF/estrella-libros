import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  createBooksSearchQueryResult,
  type MockBooksSearchQueryResult,
} from '../../../test-utils/bookQueryMocks'

const mockNavigate = jest.fn()
const mockRefetch = jest.fn()

type MockBook = {
  id: string
  title: string
}

// eslint-disable-next-line no-var
var mockUseBooksSearchQuery = jest.fn<
  MockBooksSearchQueryResult,
  [query: string, maxResults?: number]
>(() => createBooksSearchQueryResult())

jest.mock('../../../features/books/bookQueries', () => ({
  useBooksSearchQuery: mockUseBooksSearchQuery,
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

jest.mock('../../../features/components/BookCard/BookCard.tsx', () => ({
  __esModule: true,
  default: ({ book }: { book: MockBook }) => <div data-testid='book-card'>{book.title}</div>,
}))

jest.mock('../../../shared/Loader/Loader.tsx', () => ({
  __esModule: true,
  default: () => <div data-testid='loader'>Loading...</div>,
}))

import NewReleases from './NewReleases'

describe('NewReleases', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseBooksSearchQuery.mockReturnValue(createBooksSearchQueryResult())
  })

  test('renders header section', () => {
    render(<NewReleases />)

    expect(mockUseBooksSearchQuery).toHaveBeenCalledWith('subject:fiction 2024 2025', 40)
    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /home.featuredCollection.newReleases.title/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('home.featuredCollection.newReleases.description')).toBeInTheDocument()
  })

  test('renders loading state', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isLoading: true,
      }),
    )

    render(<NewReleases />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('loading.loadingNewReleases')).toBeInTheDocument()
  })

  test('renders fetching state', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isFetching: true,
      }),
    )

    render(<NewReleases />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('loading.loadingNewReleases')).toBeInTheDocument()
  })

  test('renders error state with buttons', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isError: true,
        error: new Error('Network error'),
      }),
    )

    render(<NewReleases />)

    expect(
      screen.getByRole('heading', { name: 'home.featuredCollection.newReleases.unableToLoad' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.tryAgain' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.backToHome' })).toBeInTheDocument()
  })

  test('renders empty state with buttons', () => {
    render(<NewReleases />)

    expect(
      screen.getByRole('heading', { name: 'home.featuredCollection.newReleases.noBooksFound' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('home.featuredCollection.newReleases.errorDescription'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.tryAgain' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.backToHome' })).toBeInTheDocument()
  })

  test('renders book list with tagline', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        data: [
          { id: '1', title: 'Book 1', authors: [] },
          { id: '2', title: 'Book 2', authors: [] },
        ],
      }),
    )

    render(<NewReleases />)

    expect(screen.getAllByTestId('book-card')).toHaveLength(2)
    expect(screen.getByText('home.featuredCollection.newReleases.tagline')).toBeInTheDocument()
  })

  test('refetches on retry button click', async () => {
    const user = userEvent.setup()

    mockUseBooksSearchQuery.mockReturnValue(createBooksSearchQueryResult({ refetch: mockRefetch }))

    render(<NewReleases />)

    await user.click(screen.getByRole('button', { name: 'common.tryAgain' }))

    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  test('navigates back on back button clicks', async () => {
    const user = userEvent.setup()

    render(<NewReleases />)

    await user.click(screen.getByRole('button', { name: 'Go back' }))
    expect(mockNavigate).toHaveBeenCalledWith(-1)

    mockNavigate.mockClear()

    await user.click(screen.getByRole('button', { name: 'common.backToHome' }))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
