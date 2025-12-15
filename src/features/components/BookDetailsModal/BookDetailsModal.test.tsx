import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookModal from './BookDetailsModal'
import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import type { Book } from '../../../features/types'

const mockOnClose = jest.fn()
const mockGetBookById = jest.fn()

jest.mock('../../../hooks/useGoogleBooks.ts', () => ({
  useGoogleBooks: jest.fn(),
}))

jest.mock('../../../features/components/FavoriteButton/FavoriteButton.tsx', () => ({
  __esModule: true,
  default: () => <div data-testid='fav-btn'>Favorite Button</div>,
}))

jest.mock('../../../features/components/BookModalSkeleton/BookModalSkeleton.tsx', () => ({
  __esModule: true,
  default: () => <div data-testid='book-modal-skeleton'>Skeleton</div>,
}))

jest.mock('../../../store/favStore', () => ({
  useIsFavorite: jest.fn(() => false),
}))

const mockUseGoogleBooks = useGoogleBooks as jest.Mock

describe('BookDetailsModal', () => {
  beforeEach(() => {
    mockGetBookById.mockClear()
    mockUseGoogleBooks.mockClear()
    mockOnClose.mockClear()

    window.scrollTo = jest.fn()
  })

  test('renders loading state', async () => {
    mockUseGoogleBooks.mockReturnValue({
      loading: true,
      error: null,
      getBookById: mockGetBookById,
    })

    render(<BookModal bookId='1' isOpen onClose={mockOnClose} />)

    expect(await screen.findByTestId('book-modal-skeleton')).toBeInTheDocument()
  })

  test('renders error state', async () => {
    mockUseGoogleBooks.mockReturnValue({
      loading: false,
      error: 'Network error',
      getBookById: mockGetBookById,
    })

    render(<BookModal bookId='1' isOpen onClose={mockOnClose} />)

    expect(await screen.findByText('bookModal.error: Network error')).toBeInTheDocument()
  })

  test('renres book info', async () => {
    const mockBook: Book = {
      id: '1',
      title: 'The Flying Pigs',
      authors: ['Elizabeth James'],
      description: 'Amazing fiction novel about best animals in the world - pigs!',
      coverUrl: 'https://example.com/TheFlyingPigs.jpg',
      publishedYear: '2011',
      publisher: 'Henry Winston',
      pageCount: 341,
      averageRating: 5,
      ratingsCount: 5,
      categories: ['Fiction', 'Fantasy', 'Science'],
      language: 'English',
    }

    mockGetBookById.mockResolvedValue(mockBook)

    mockUseGoogleBooks.mockReturnValue({
      loading: false,
      error: null,
      getBookById: mockGetBookById,
    })

    render(<BookModal bookId={mockBook.id} isOpen onClose={mockOnClose} />)

    expect(await screen.findByRole('heading', { name: 'The Flying Pigs' })).toBeInTheDocument()
    expect(screen.getByText('by Elizabeth James')).toBeInTheDocument()
    expect(screen.getByTestId('fav-btn')).toBeInTheDocument()
    expect(screen.getByAltText('The Flying Pigs')).toBeInTheDocument()
    expect(screen.getByText('bookCard.published: 2011')).toBeInTheDocument()
    expect(screen.getByText('bookCard.publisher: Henry Winston')).toBeInTheDocument()
    expect(screen.getByText('341 bookCard.pages')).toBeInTheDocument()
    expect(screen.getByText(/5\/5/)).toBeInTheDocument()
    expect(
      screen.getByText('Amazing fiction novel about best animals in the world - pigs!'),
    ).toBeInTheDocument()
    expect(screen.getByText('Fiction')).toBeInTheDocument()
    expect(screen.getByText('Fantasy')).toBeInTheDocument()
    expect(screen.getByText('Science')).toBeInTheDocument()
  })

  test('closes modal on click', async () => {
    const user = userEvent.setup()

    const mockBook: Book = {
      id: '1',
      title: 'The Flying Pigs',
      authors: ['Elizabeth James'],
    }

    mockGetBookById.mockResolvedValue(mockBook)

    mockUseGoogleBooks.mockReturnValue({
      loading: false,
      error: null,
      getBookById: mockGetBookById,
    })

    render(<BookModal bookId={mockBook.id} isOpen onClose={mockOnClose} />)

    // Waiting for book loading
    await screen.findByRole('heading', { name: 'The Flying Pigs' })

    await user.click(screen.getByRole('button', { name: 'bookModal.close' }))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('closes modal on Espace key press', async () => {
    const user = userEvent.setup()

    const mockBook: Book = {
      id: '1',
      title: 'The Flying Pigs',
      authors: ['Elizabeth James'],
    }

    mockGetBookById.mockResolvedValue(mockBook)

    mockUseGoogleBooks.mockReturnValue({
      loading: false,
      error: null,
      getBookById: mockGetBookById,
    })

    render(<BookModal bookId={mockBook.id} isOpen onClose={mockOnClose} />)

    // Waiting for book loading
    await screen.findByRole('heading', { name: 'The Flying Pigs' })

    await user.keyboard('{Escape}')
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('closes modal on outside click', async () => {
    const mockBook: Book = {
      id: '1',
      title: 'The Flying Pigs',
      authors: ['Elizabeth James'],
    }

    mockGetBookById.mockResolvedValue(mockBook)

    mockUseGoogleBooks.mockReturnValue({
      loading: false,
      error: null,
      getBookById: mockGetBookById,
    })

    render(<BookModal bookId={mockBook.id} isOpen onClose={mockOnClose} />)

    // Waiting for book loading
    await screen.findByRole('heading', { name: 'The Flying Pigs' })

    const overlay = document.querySelector('.book-modal__overlay')

    if (!overlay) {
      throw new Error("Element doesn't exist")
    }

    fireEvent.mouseDown(overlay)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
