import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Book } from '../../types'

type MockBookDetailsQueryResult = {
  data: Book | undefined
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  error: Error | null
}

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

const createBookDetailsQueryResult = (
  overrides: Partial<MockBookDetailsQueryResult> = {},
): MockBookDetailsQueryResult => ({
  data: undefined,
  isLoading: false,
  isFetching: false,
  isError: false,
  error: null,
  ...overrides,
})

// eslint-disable-next-line no-var
var mockUseBookDetailsQuery = jest.fn<
  MockBookDetailsQueryResult,
  [bookId: string, enabled?: boolean]
>(() => createBookDetailsQueryResult())

jest.mock('../../books/bookQueries', () => ({
  useBookDetailsQuery: mockUseBookDetailsQuery,
}))

jest.mock('../FavoriteButton/FavoriteButton', () => ({
  __esModule: true,
  default: () => <div data-testid='fav-btn'>Favorite Button</div>,
}))

jest.mock('../BookModalSkeleton/BookModalSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid='book-modal-skeleton'>Skeleton</div>,
}))

jest.mock('../../../store/favStore', () => ({
  useIsFavorite: jest.fn(() => false),
}))

import BookModal from './BookDetailsModal'

const mockOnClose = jest.fn()

describe('BookDetailsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.scrollTo = jest.fn()

    mockUseBookDetailsQuery.mockReturnValue(createBookDetailsQueryResult())
  })

  test('does not render when modal is closed', () => {
    render(<BookModal bookId='1' isOpen={false} onClose={mockOnClose} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mockUseBookDetailsQuery).toHaveBeenCalledWith('1', false)
  })

  test('renders loading state', () => {
    mockUseBookDetailsQuery.mockReturnValue(
      createBookDetailsQueryResult({
        isLoading: true,
      }),
    )

    render(<BookModal bookId='1' isOpen onClose={mockOnClose} />)

    expect(screen.getByTestId('book-modal-skeleton')).toBeInTheDocument()
    expect(mockUseBookDetailsQuery).toHaveBeenCalledWith('1', true)
  })

  test('renders fetching state', () => {
    mockUseBookDetailsQuery.mockReturnValue(
      createBookDetailsQueryResult({
        isFetching: true,
      }),
    )

    render(<BookModal bookId='1' isOpen onClose={mockOnClose} />)

    expect(screen.getByTestId('book-modal-skeleton')).toBeInTheDocument()
    expect(mockUseBookDetailsQuery).toHaveBeenCalledWith('1', true)
  })

  test('renders error state', () => {
    mockUseBookDetailsQuery.mockReturnValue(
      createBookDetailsQueryResult({
        isError: true,
        error: new Error('Network error'),
      }),
    )

    render(<BookModal bookId='1' isOpen onClose={mockOnClose} />)

    expect(screen.getByText('bookModal.error: Network error')).toBeInTheDocument()
  })

  test('renders book info', () => {
    mockUseBookDetailsQuery.mockReturnValue(
      createBookDetailsQueryResult({
        data: mockBook,
      }),
    )

    render(<BookModal bookId={mockBook.id} isOpen onClose={mockOnClose} />)

    expect(screen.getByRole('heading', { name: 'The Flying Pigs' })).toBeInTheDocument()
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

  test('closes modal on close button click', async () => {
    const user = userEvent.setup()

    mockUseBookDetailsQuery.mockReturnValue(
      createBookDetailsQueryResult({
        data: mockBook,
      }),
    )

    render(<BookModal bookId={mockBook.id} isOpen onClose={mockOnClose} />)

    await user.click(screen.getByRole('button', { name: 'bookModal.close' }))

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('closes modal on Escape key press', async () => {
    const user = userEvent.setup()

    mockUseBookDetailsQuery.mockReturnValue(
      createBookDetailsQueryResult({
        data: mockBook,
      }),
    )

    render(<BookModal bookId={mockBook.id} isOpen onClose={mockOnClose} />)

    await user.keyboard('{Escape}')

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('closes modal on outside click', () => {
    mockUseBookDetailsQuery.mockReturnValue(
      createBookDetailsQueryResult({
        data: mockBook,
      }),
    )

    render(<BookModal bookId={mockBook.id} isOpen onClose={mockOnClose} />)

    const overlay = document.querySelector('.book-modal__overlay')

    if (!overlay) {
      throw new Error("Element doesn't exist")
    }

    fireEvent.mouseDown(overlay)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
