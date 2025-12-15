import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import GenreBookPage from './GenreBookPage'
import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import userEvent from '@testing-library/user-event'
import { useNavigate, useParams } from 'react-router-dom'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}))

jest.mock('../../../hooks/useGoogleBooks.ts', () => ({
  useGoogleBooks: jest.fn(),
}))

const mockUseParams = useParams as jest.Mock
const mockUseNavigate = useNavigate as jest.Mock
const mockNavigate = jest.fn()
const mockUseGoogleBooks = useGoogleBooks as jest.Mock

mockUseParams.mockReturnValue({ genreId: 'fiction' })
mockUseNavigate.mockReturnValue(mockNavigate)

jest.mock('../../../shared/Loader/Loader.tsx', () => ({
  __esModule: true,
  default: () => <div data-testid={'loader'}>Loading...</div>,
}))

jest.mock('../../../features/components/BookCard/BookCard.tsx', () => ({
  __esModule: true,
  // eslint-disable-next-line
  default: ({ book }: any) => <div data-testid={'book-card'}>{book.title}</div>,
}))

describe('GenreBookPage', () => {
  const mockSearchBooks = jest.fn()

  beforeEach(() => {
    mockNavigate.mockClear()
    mockSearchBooks.mockClear()
    mockUseGoogleBooks.mockClear()

    // Сбрасываем useParams на дефолтное значение
    jest.mocked(useParams).mockReturnValue({ genreId: 'fiction' })
  })

  test('renders loading state', () => {
    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: true,
      error: null,
      searchBooks: mockSearchBooks,
    })

    render(<GenreBookPage />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('genres.bookPage.loadingLabel')).toBeInTheDocument()
  })

  test('renders error state', () => {
    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: false,
      error: 'Network error',
      searchBooks: mockSearchBooks,
    })

    render(<GenreBookPage />)

    expect(screen.getByRole('heading', { name: 'genres.bookPage.errorTitle' })).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  test('renders book list', () => {
    mockUseGoogleBooks.mockReturnValue({
      books: [
        { id: '1', title: 'Mr. Mercedes' },
        { id: '2', title: 'Holly' },
      ],
      loading: false,
      error: null,
      searchBooks: mockSearchBooks,
    })

    render(<GenreBookPage />)

    expect(screen.getAllByTestId('book-card')).toHaveLength(2)
  })

  test('renders empty book list state', () => {
    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: false,
      error: null,
      searchBooks: mockSearchBooks,
    })

    render(<GenreBookPage />)

    expect(
      screen.getByRole('heading', { name: 'genres.bookPage.emptyBooksTitle' }),
    ).toBeInTheDocument()
    expect(screen.getByText('genres.bookPage.emptyBooksSubtitle')).toBeInTheDocument()
  })

  test('navigates back to /genres on back button click', async () => {
    const user = userEvent.setup()

    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: false,
      error: null,
      searchBooks: mockSearchBooks,
    })

    render(<GenreBookPage />)

    const backBtn = screen.getByRole('button', { name: /genres.bookPage.backButton/i })

    await user.click(backBtn)

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/genres')
  })

  test('retries on retry button click', async () => {
    const user = userEvent.setup()

    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: false,
      error: 'Network error',
      searchBooks: mockSearchBooks,
    })

    render(<GenreBookPage />)

    const retryBtn = screen.getByRole('button', { name: 'common.tryAgain' })

    await user.click(retryBtn)

    expect(mockSearchBooks).toHaveBeenCalledTimes(1)
  })

  test('renders genre not found message when genreId is invalid', () => {
    mockUseParams.mockReturnValue({ genreId: 'unknown-genre' })

    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: false,
      error: null,
      serchBooks: mockSearchBooks,
    })

    render(<GenreBookPage />)

    expect(screen.getByRole('heading', { name: 'genres.bookPage.emptyTitle' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'genres.bookPage.backButton' })).toBeInTheDocument()
  })
})
