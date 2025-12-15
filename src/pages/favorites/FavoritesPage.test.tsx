import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FavoritesPage from './FavoritesPage'
import { useGoogleBooks } from '../../hooks/useGoogleBooks'
import { useIds } from '../../store/favStore'
import { useNavigate } from 'react-router-dom'

const mockGetBookById = jest.fn()
const mockNavigate = jest.fn()

jest.mock('../../store/favStore.ts', () => ({
  useIds: jest.fn(),
}))

jest.mock('../../hooks/useGoogleBooks.ts', () => ({
  useGoogleBooks: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}))

jest.mock('../../features/components/FavoritesHero/FavoritesHero', () => ({
  __esModule: true,
  // eslint-disable-next-line
  default: ({ title, count }: any) => (
    <div data-testid='favorites-hero'>
      {title} {count !== undefined && `(${count})`}
    </div>
  ),
}))

jest.mock('../../features/components/BookCard/BookCard', () => ({
  __esModule: true,
  // eslint-disable-next-line
  default: ({ book }: any) => <div data-testid='book-card'>{book.title}</div>,
}))

jest.mock('../../shared/Loader/Loader', () => ({
  __esModule: true,
  default: () => <div data-testid='loader'>Loading...</div>,
}))

const mockUseGoogleBooks = useGoogleBooks as jest.Mock
const mockUseIds = useIds as jest.Mock
const mockUseNavigate = useNavigate as jest.Mock

describe('FavoritesPage', () => {
  // Подавляем console.warn для чистоты вывода
  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    mockUseGoogleBooks.mockClear()
    mockUseIds.mockClear()
    mockUseNavigate.mockClear()
    mockGetBookById.mockClear()

    mockUseGoogleBooks.mockReturnValue({
      getBookById: mockGetBookById,
    })

    mockUseNavigate.mockReturnValue(mockNavigate)
  })

  test('renders empty state when no favorites', () => {
    mockUseIds.mockReturnValue(new Set())

    render(<FavoritesPage />)

    expect(screen.getByRole('heading', { name: 'favorites.emptyTitle' })).toBeInTheDocument()
    expect(screen.getByText('favorites.emptySubtitle')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'search.searchButton' })).toBeInTheDocument()
  })

  test('navigates to search on button click in empty state', async () => {
    const user = userEvent.setup()

    mockUseIds.mockReturnValue(new Set())

    render(<FavoritesPage />)

    await user.click(screen.getByRole('button', { name: 'search.searchButton' }))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/search')
  })

  test('renders loading state while fetching books', async () => {
    mockUseIds.mockReturnValue(new Set(['1', '2']))

    mockGetBookById.mockImplementation((key: string) => {
      if (key === '1') return Promise.resolve({ id: '1', title: 'Book 1' })
      if (key === '2') return Promise.resolve({ id: '2', title: 'Book 2' })
      return Promise.resolve(null)
    })

    render(<FavoritesPage />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('favorites.loadingLabel')).toBeInTheDocument()

    // Ждём завершения загрузки
    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })
  })

  test('renders book list when books are loaded', async () => {
    mockUseIds.mockReturnValue(new Set(['1', '2']))

    mockGetBookById.mockImplementation((id: string) => {
      if (id === '1') return Promise.resolve({ id: '1', title: 'Book 1' })
      if (id === '2') return Promise.resolve({ id: '2', title: 'Book 2' })
      return Promise.resolve(null)
    })

    render(<FavoritesPage />)

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })

    const bookCards = screen.getAllByTestId('book-card')
    expect(bookCards).toHaveLength(2)
  })

  test('renders error when all books fail to load', async () => {
    mockUseIds.mockReturnValue(new Set(['1', '2']))
    mockGetBookById.mockResolvedValue(null)

    render(<FavoritesPage />)

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })

    expect(screen.getByRole('heading', { name: 'favorites.errorTitle' })).toBeInTheDocument()
    expect(screen.getByText('favorites.errorSubtitle')).toBeInTheDocument()
  })

  test('renders warning when some books fail to load', async () => {
    mockUseIds.mockReturnValue(new Set(['1', '2', '3']))

    mockGetBookById.mockImplementation((id: string) => {
      if (id === '1') return Promise.resolve({ id: '1', title: 'Book 1' })
      if (id === '2') return Promise.resolve({ id: '2', title: 'Book 2' })
      return Promise.resolve(null)
    })

    render(<FavoritesPage />)

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })

    expect(screen.getByText(/1.*favorites.warningLabel/)).toBeInTheDocument()
  })
})
