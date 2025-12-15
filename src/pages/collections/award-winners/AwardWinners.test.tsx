import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AwardWinners from './AwardWinners'
import { useGoogleBooks } from '../../../hooks/useGoogleBooks'

const mockNavigate = jest.fn()
const mockSearchBooks = jest.fn()

jest.mock('../../../hooks/useGoogleBooks.ts', () => ({
  useGoogleBooks: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

jest.mock('../../../features/components/BookCard/BookCard.tsx', () => ({
  __esModule: true,
  // eslint-disable-next-line
  default: ({ book }: any) => <div data-testid={'book-card'}>{book.title}</div>,
}))

jest.mock('../../../shared/Loader/Loader.tsx', () => ({
  __esModule: true,
  default: () => <div data-testid={'loader'}>Loading...</div>,
}))

const mockUseGoogleBooks = useGoogleBooks as jest.Mock

describe('AwardWinners', () => {
  beforeEach(() => {
    mockUseGoogleBooks.mockClear()
    mockNavigate.mockClear()
    mockSearchBooks.mockClear()
  })

  test('renders header section', () => {
    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: false,
      error: null,
      searchBooks: mockSearchBooks,
    })

    render(<AwardWinners />)

    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /home.featuredCollection.awardWinners.title/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('home.featuredCollection.awardWinners.description')).toBeInTheDocument()
  })

  test('renders loading state', () => {
    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: true,
      error: null,
      searchBooks: mockSearchBooks,
    })

    render(<AwardWinners />)

    expect(screen.getByTestId('loader')).toBeInTheDocument()
    expect(screen.getByText('loading.loadingAwardWinners')).toBeInTheDocument()
  })

  test('renders error state with buttons', () => {
    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: false,
      error: 'Network error',
      searchBooks: mockSearchBooks,
    })

    render(<AwardWinners />)

    expect(
      screen.getByRole('heading', { name: 'home.featuredCollection.awardWinners.unableToLoad' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.tryAgain' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.backToHome' })).toBeInTheDocument()
  })

  test('renders empty state with buttons', () => {
    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: false,
      error: null,
      searchBooks: mockSearchBooks,
    })

    render(<AwardWinners />)

    expect(
      screen.getByRole('heading', { name: 'home.featuredCollection.awardWinners.noBooksFound' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('home.featuredCollection.awardWinners.errorDescription'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.tryAgain' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.backToHome' })).toBeInTheDocument()
  })

  test('renders book list with tagline', () => {
    mockUseGoogleBooks.mockReturnValue({
      books: [
        { id: '1', title: 'Book 1' },
        { id: '2', title: 'Book 2' },
      ],
      loading: false,
      error: null,
      searchBooks: mockSearchBooks,
    })

    render(<AwardWinners />)

    expect(screen.getAllByTestId('book-card')).toHaveLength(2)
    expect(screen.getByText('home.featuredCollection.awardWinners.tagline')).toBeInTheDocument()
  })

  test('retries on retry button click', async () => {
    const user = userEvent.setup()

    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: false,
      error: null,
      searchBooks: mockSearchBooks,
    })

    render(<AwardWinners />)

    mockSearchBooks.mockClear()

    await user.click(screen.getByRole('button', { name: 'common.tryAgain' }))

    expect(mockSearchBooks).toHaveBeenCalledTimes(1)
  })

  test('navigates back on back button clicks', async () => {
    const user = userEvent.setup()

    mockUseGoogleBooks.mockReturnValue({
      books: [],
      loading: false,
      error: null,
      searchBooks: mockSearchBooks,
    })

    render(<AwardWinners />)

    await user.click(screen.getByRole('button', { name: 'Go back' }))
    expect(mockNavigate).toHaveBeenCalledWith(-1)

    mockNavigate.mockClear()

    await user.click(screen.getByRole('button', { name: 'common.backToHome' }))
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
