import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { Book } from '../../types'

const mockPrefetchQuery = jest.fn()

const mockBookDetailsQueryOptions = jest.fn((bookId: string) => ({
  queryKey: ['books', 'details', bookId],
}))

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    prefetchQuery: mockPrefetchQuery,
  }),
}))

jest.mock('../../books/bookQueries', () => ({
  bookDetailsQueryOptions: mockBookDetailsQueryOptions,
}))

jest.mock('../FavoriteButton/FavoriteButton', () => ({
  __esModule: true,
  default: () => <div>FavoriteButton</div>,
}))

jest.mock('../BookDetailsModal/BookDetailsModal', () => ({
  __esModule: true,
  default: ({ bookId }: { bookId: string }) => <div data-testid='book-modal'>{bookId}</div>,
}))

import BookCard from './BookCard'

describe('BookCard', () => {
  const mockBook: Book = {
    id: '1',
    title: "Harry Potter and the Philosopher's Stone",
    authors: ['J.K. Rowling'],
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders book title and authors', () => {
    render(<BookCard book={mockBook} />)

    expect(screen.getByText("Harry Potter and the Philosopher's Stone")).toBeInTheDocument()
    expect(screen.getByText(/J.K. Rowling/i)).toBeInTheDocument()
  })

  test('renders cover image when coverUrl exists', () => {
    const bookWithCover: Book = {
      ...mockBook,
      coverUrl: 'https://example.com/cover.jpg',
    }

    render(<BookCard book={bookWithCover} />)

    const img = screen.getByAltText("Harry Potter and the Philosopher's Stone")
    expect(img).toHaveAttribute('src', 'https://example.com/cover.jpg')
  })

  test('shows "No cover" when coverUrl is missing', () => {
    render(<BookCard book={mockBook} />)

    expect(screen.getByText('bookCard.noCover')).toBeInTheDocument()
  })

  test('renders published year when provided', () => {
    const bookWithYear: Book = {
      ...mockBook,
      publishedYear: '1997',
    }

    render(<BookCard book={bookWithYear} />)

    expect(screen.getByText(/1997/i)).toBeInTheDocument()
  })

  test('does not render published year when missing', () => {
    render(<BookCard book={mockBook} />)

    expect(screen.queryByText(/bookCard.published/i)).not.toBeInTheDocument()
  })

  test('opens modal when "Details" button is clicked', async () => {
    const user = userEvent.setup()

    render(<BookCard book={mockBook} />)

    const detailsButton = screen.getByRole('button', { name: /bookCard.details/i })
    await user.click(detailsButton)

    expect(screen.getByTestId('book-modal')).toBeInTheDocument()
    expect(screen.getByTestId('book-modal')).toHaveTextContent('1')
  })

  test('prefetches book details on details button hover', async () => {
    const user = userEvent.setup()

    render(<BookCard book={mockBook} />)

    const detailsButton = screen.getByRole('button', { name: /bookCard.details/i })
    await user.hover(detailsButton)

    expect(mockBookDetailsQueryOptions).toHaveBeenCalledWith('1')
    expect(mockPrefetchQuery).toHaveBeenCalledWith({
      queryKey: ['books', 'details', '1'],
    })
  })

  test('prefetches book details on details button focus', async () => {
    const user = userEvent.setup()

    render(<BookCard book={mockBook} />)

    const detailsButton = screen.getByRole('button', { name: /bookCard.details/i })
    await user.tab()

    expect(detailsButton).toHaveFocus()
    expect(mockBookDetailsQueryOptions).toHaveBeenCalledWith('1')
    expect(mockPrefetchQuery).toHaveBeenCalledWith({
      queryKey: ['books', 'details', '1'],
    })
  })

  test('does not prefetch when book id is missing', async () => {
    const user = userEvent.setup()

    const bookWithoutId: Book = {
      ...mockBook,
      id: '',
    }

    render(<BookCard book={bookWithoutId} />)

    const detailsButton = screen.getByRole('button', { name: /bookCard.details/i })
    await user.hover(detailsButton)

    expect(mockBookDetailsQueryOptions).not.toHaveBeenCalled()
    expect(mockPrefetchQuery).not.toHaveBeenCalled()
  })
})
