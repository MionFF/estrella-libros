import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookCard from './BookCard'
import type { Book } from '../../types'

jest.mock('../FavoriteButton/FavoriteButton', () => ({
  __esModule: true,
  default: () => <div>FavoriteButton</div>,
}))

jest.mock('../BookDetailsModal/BookDetailsModal', () => ({
  __esModule: true,
  default: () => <div data-testid='book-modal'>BookModal</div>,
}))

describe('BookCard', () => {
  const mockBook: Book = {
    id: '1',
    title: "Harry Potter and the Philosopher's Stone",
    authors: ['J.K. Rowling'],
  }

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

    const detailsBtn = screen.getByRole('button', { name: /bookCard.details/i })
    await user.click(detailsBtn)

    expect(screen.getByTestId('book-modal')).toBeInTheDocument()
  })
})
