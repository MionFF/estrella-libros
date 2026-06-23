import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Book } from '../../features/types'

const mockNavigate = jest.fn()
const mockRefetch = jest.fn()

type MockFavoriteBookQueryResult = {
  data: Book | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  refetch: jest.Mock
}

const createFavoriteBookQueryResult = (
  overrides: Partial<MockFavoriteBookQueryResult> = {},
): MockFavoriteBookQueryResult => ({
  data: undefined,
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: mockRefetch,
  ...overrides,
})

// eslint-disable-next-line no-var
var mockUseIds = jest.fn<Set<string>, []>(() => new Set())

// eslint-disable-next-line no-var
var mockUseFavoriteBooksQueries = jest.fn<MockFavoriteBookQueryResult[], [bookIds: string[]]>(
  () => [],
)

// eslint-disable-next-line no-var
var mockUseNavigate = jest.fn<jest.Mock, []>(() => mockNavigate)

jest.mock('../../store/favStore.ts', () => ({
  useIds: mockUseIds,
}))

jest.mock('../../features/books/bookQueries', () => ({
  useFavoriteBooksQueries: mockUseFavoriteBooksQueries,
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: mockUseNavigate,
}))

jest.mock('../../features/components/FavoritesHero/FavoritesHero', () => ({
  __esModule: true,
  default: ({ title, count }: { title: string; count?: number }) => (
    <div data-testid='favorites-hero'>
      {title} {count !== undefined && `(${count})`}
    </div>
  ),
}))

jest.mock('../../features/components/BookCard/BookCard', () => ({
  __esModule: true,
  default: ({ book }: { book: Book }) => <div data-testid='book-card'>{book.title}</div>,
}))

jest.mock('../../shared/Loader/Loader', () => ({
  __esModule: true,
  default: () => <div data-testid='loader'>Loading...</div>,
}))

import FavoritesPage from './FavoritesPage'

describe('FavoritesPage', () => {
  const bookOne: Book = {
    id: '1',
    title: 'Book 1',
    authors: ['Author 1'],
  }

  const bookTwo: Book = {
    id: '2',
    title: 'Book 2',
    authors: ['Author 2'],
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseIds.mockReturnValue(new Set())
    mockUseFavoriteBooksQueries.mockReturnValue([])
    mockUseNavigate.mockReturnValue(mockNavigate)
  })

  test('renders empty state when no favorites', () => {
    render(<FavoritesPage />)

    expect(mockUseFavoriteBooksQueries).toHaveBeenCalledWith([])
    expect(screen.getByRole('heading', { name: 'favorites.emptyTitle' })).toBeInTheDocument()
    expect(screen.getByText('favorites.emptySubtitle')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'search.searchButton' })).toBeInTheDocument()
  })

  test('navigates to search on button click in empty state', async () => {
    const user = userEvent.setup()

    render(<FavoritesPage />)

    await user.click(screen.getByRole('button', { name: 'search.searchButton' }))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/search')
  })

  test('renders loading state while fetching books', () => {
    mockUseIds.mockReturnValue(new Set(['1', '2']))
    mockUseFavoriteBooksQueries.mockReturnValue([
      createFavoriteBookQueryResult({ isLoading: true }),
      createFavoriteBookQueryResult({ isLoading: true }),
    ])

    render(<FavoritesPage />)

    expect(mockUseFavoriteBooksQueries).toHaveBeenCalledWith(['1', '2'])
    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('favorites.loadingLabel')).toBeInTheDocument()
  })

  test('renders book list when books are loaded', () => {
    mockUseIds.mockReturnValue(new Set(['1', '2']))
    mockUseFavoriteBooksQueries.mockReturnValue([
      createFavoriteBookQueryResult({ data: bookOne }),
      createFavoriteBookQueryResult({ data: bookTwo }),
    ])

    render(<FavoritesPage />)

    expect(screen.getAllByTestId('book-card')).toHaveLength(2)
    expect(screen.getByText('Book 1')).toBeInTheDocument()
    expect(screen.getByText('Book 2')).toBeInTheDocument()
    expect(screen.getByTestId('favorites-hero')).toHaveTextContent('(2)')
  })

  test('renders error when all books fail to load', () => {
    mockUseIds.mockReturnValue(new Set(['1', '2']))
    mockUseFavoriteBooksQueries.mockReturnValue([
      createFavoriteBookQueryResult({ isError: true }),
      createFavoriteBookQueryResult({ isError: true }),
    ])

    render(<FavoritesPage />)

    expect(screen.getByRole('heading', { name: 'favorites.errorTitle' })).toBeInTheDocument()
    expect(screen.getByText('favorites.errorSubtitle')).toBeInTheDocument()
  })

  test('renders warning when some books fail to load', () => {
    mockUseIds.mockReturnValue(new Set(['1', '2', '3']))
    mockUseFavoriteBooksQueries.mockReturnValue([
      createFavoriteBookQueryResult({ data: bookOne }),
      createFavoriteBookQueryResult({ data: bookTwo }),
      createFavoriteBookQueryResult({ isError: true }),
    ])

    render(<FavoritesPage />)

    expect(screen.getAllByTestId('book-card')).toHaveLength(2)
    expect(screen.getByText(/1.*favorites.warningLabel/)).toBeInTheDocument()
  })

  test('refetches failed favorite books from error state', async () => {
    const user = userEvent.setup()
    const firstRefetch = jest.fn()
    const secondRefetch = jest.fn()

    mockUseIds.mockReturnValue(new Set(['1', '2']))
    mockUseFavoriteBooksQueries.mockReturnValue([
      createFavoriteBookQueryResult({
        isError: true,
        refetch: firstRefetch,
      }),
      createFavoriteBookQueryResult({
        isError: true,
        refetch: secondRefetch,
      }),
    ])

    render(<FavoritesPage />)

    await user.click(screen.getByRole('button', { name: 'common.tryAgain' }))

    expect(firstRefetch).toHaveBeenCalledTimes(1)
    expect(secondRefetch).toHaveBeenCalledTimes(1)
  })

  test('does not hide already loaded books when another favorite is fetching', () => {
    mockUseIds.mockReturnValue(new Set(['1', '2']))
    mockUseFavoriteBooksQueries.mockReturnValue([
      createFavoriteBookQueryResult({ data: bookOne }),
      createFavoriteBookQueryResult({ isFetching: true }),
    ])

    render(<FavoritesPage />)

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    expect(screen.getByText('Book 1')).toBeInTheDocument()
  })
})
