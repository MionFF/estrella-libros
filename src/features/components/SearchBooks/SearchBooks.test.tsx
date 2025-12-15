import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BooksList from './SearchBooks'
import { useGoogleBooks } from '../../../hooks/useGoogleBooks'

// Мокируем хук
jest.mock('../../../hooks/useGoogleBooks')

describe('SearchBooks', () => {
  const mockSearchBooks = jest.fn()
  const mockClearBooks = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Настраиваем мок перед каждым тестом
    ;(useGoogleBooks as jest.Mock).mockReturnValue({
      books: [],
      loading: false,
      error: null,
      searchBooks: mockSearchBooks, // ← передаём в мок
      clearBooks: mockClearBooks, // ← передаём в мок
      hasMore: true,
    })
  })

  test('renders search input and buttons', () => {
    render(<BooksList />)

    const input = screen.getByPlaceholderText('search.inputPlaceholder')
    expect(input).toBeInTheDocument()

    const searchButton = screen.getByRole('button', { name: 'search.searchButton' })
    expect(searchButton).toBeInTheDocument()

    const clearButton = screen.getByRole('button', { name: 'search.clearButton' })
    expect(clearButton).toBeInTheDocument()
  })

  test('calls searchBooks when search button is clicked', async () => {
    const user = userEvent.setup()
    render(<BooksList />)

    const input = screen.getByPlaceholderText('search.inputPlaceholder')
    await user.type(input, 'Pigs')

    const searchButton = screen.getByRole('button', { name: 'search.searchButton' })
    await user.click(searchButton)

    expect(mockSearchBooks).toHaveBeenCalledWith('Pigs', 20)
  })

  test('calls clearBooks when clear button is clicked', async () => {
    const user = userEvent.setup()
    render(<BooksList />)

    const input = screen.getByPlaceholderText('search.inputPlaceholder')
    await user.type(input, 'Pigs')

    const clearButton = screen.getByRole('button', { name: 'search.clearButton' })
    await user.click(clearButton)

    expect(mockClearBooks).toHaveBeenCalled()
    expect(input).toHaveValue('')
  })

  test('shows loading state', () => {
    ;(useGoogleBooks as jest.Mock).mockReturnValue({
      books: [],
      loading: true,
      error: null,
      searchBooks: jest.fn(),
      clearBooks: jest.fn(),
    })

    render(<BooksList />)

    expect(screen.getByText('search.loadingLabel')).toBeInTheDocument()
  })

  test('shows error message', () => {
    ;(useGoogleBooks as jest.Mock).mockReturnValue({
      books: [],
      loading: false,
      error: 'Network error',
      searchBooks: jest.fn(),
      clearBooks: jest.fn(),
    })

    render(<BooksList />)

    expect(screen.getByText('search.errorMessage')).toBeInTheDocument()
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  test('renders books when search returns results', () => {
    const mockBooks = [
      { id: '1', title: 'Book 1', authors: ['Author 1'] },
      { id: '2', title: 'Book 2', authors: ['Author 2'] },
    ]

    ;(useGoogleBooks as jest.Mock).mockReturnValue({
      books: mockBooks,
      loading: false,
      error: null,
      searchBooks: jest.fn(),
      clearBooks: jest.fn(),
    })

    render(<BooksList />)

    expect(screen.getByText('Book 1')).toBeInTheDocument()
    expect(screen.getByText('Book 2')).toBeInTheDocument()
  })
})
