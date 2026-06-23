import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockNavigate = jest.fn()
const mockRefetch = jest.fn()

type MockBook = {
  id: string
  title: string
}

type MockBooksSearchQueryResult = {
  data: MockBook[]
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
  refetch: jest.Mock
}

const createBooksSearchQueryResult = (
  overrides: Partial<MockBooksSearchQueryResult> = {},
): MockBooksSearchQueryResult => ({
  data: [],
  isLoading: false,
  isFetching: false,
  isError: false,
  error: null,
  refetch: mockRefetch,
  ...overrides,
})

// eslint-disable-next-line no-var
var mockUseBooksSearchQuery = jest.fn<
  MockBooksSearchQueryResult,
  [query: string, maxResults?: number]
>(() => createBooksSearchQueryResult())

const mockUseParams = jest.fn(() => ({ genreId: 'fiction' }))

jest.mock('../../../features/books/bookQueries', () => ({
  useBooksSearchQuery: mockUseBooksSearchQuery,
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => mockUseParams(),
  useNavigate: () => mockNavigate,
}))

jest.mock('../../../shared/Loader/Loader.tsx', () => ({
  __esModule: true,
  default: () => <div data-testid='loader'>Loading...</div>,
}))

jest.mock('../../../features/components/BookCard/BookCard.tsx', () => ({
  __esModule: true,
  default: ({ book }: { book: MockBook }) => <div data-testid='book-card'>{book.title}</div>,
}))

import GenreBookPage from './GenreBookPage'

describe('GenreBookPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseParams.mockReturnValue({ genreId: 'fiction' })
    mockUseBooksSearchQuery.mockReturnValue(createBooksSearchQueryResult())
  })

  test('calls query hook with genre query from route params', () => {
    render(<GenreBookPage />)

    expect(mockUseBooksSearchQuery).toHaveBeenCalledWith(expect.any(String), 40)
    expect(mockUseBooksSearchQuery.mock.calls[0][0]).not.toBe('')
  })

  test('renders loading state', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isLoading: true,
      }),
    )

    render(<GenreBookPage />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('genres.bookPage.loadingLabel')).toBeInTheDocument()
  })

  test('renders fetching state', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isFetching: true,
      }),
    )

    render(<GenreBookPage />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('genres.bookPage.loadingLabel')).toBeInTheDocument()
  })

  test('renders error state', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isError: true,
        error: new Error('Network error'),
      }),
    )

    render(<GenreBookPage />)

    expect(screen.getByRole('heading', { name: 'genres.bookPage.errorTitle' })).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  test('renders book list', () => {
    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        data: [
          { id: '1', title: 'Mr. Mercedes' },
          { id: '2', title: 'Holly' },
        ],
      }),
    )

    render(<GenreBookPage />)

    expect(screen.getAllByTestId('book-card')).toHaveLength(2)
    expect(screen.getByText('Mr. Mercedes')).toBeInTheDocument()
    expect(screen.getByText('Holly')).toBeInTheDocument()
  })

  test('renders empty book list state', () => {
    render(<GenreBookPage />)

    expect(
      screen.getByRole('heading', { name: 'genres.bookPage.emptyBooksTitle' }),
    ).toBeInTheDocument()
    expect(screen.getByText('genres.bookPage.emptyBooksSubtitle')).toBeInTheDocument()
  })

  test('navigates back to /genres on back button click', async () => {
    const user = userEvent.setup()

    render(<GenreBookPage />)

    const backButton = screen.getByRole('button', { name: /genres.bookPage.backButton/i })
    await user.click(backButton)

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/genres')
  })

  test('refetches on retry button click', async () => {
    const user = userEvent.setup()

    mockUseBooksSearchQuery.mockReturnValue(
      createBooksSearchQueryResult({
        isError: true,
        error: new Error('Network error'),
      }),
    )

    render(<GenreBookPage />)

    await user.click(screen.getByRole('button', { name: 'common.tryAgain' }))

    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  test('renders genre not found message when genreId is invalid', () => {
    mockUseParams.mockReturnValue({ genreId: 'unknown-genre' })

    render(<GenreBookPage />)

    expect(screen.getByRole('heading', { name: 'genres.bookPage.emptyTitle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'genres.bookPage.backButton' })).toBeInTheDocument()
    expect(mockUseBooksSearchQuery).toHaveBeenCalledWith('', 40)
  })

  test('navigates back from genre not found state', async () => {
    const user = userEvent.setup()

    mockUseParams.mockReturnValue({ genreId: 'unknown-genre' })

    render(<GenreBookPage />)

    await user.click(screen.getByRole('button', { name: 'genres.bookPage.backButton' }))

    expect(mockNavigate).toHaveBeenCalledWith('/genres')
  })
})
