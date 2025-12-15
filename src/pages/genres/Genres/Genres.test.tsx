import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Genres from './Genres'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('Genres', () => {
  test('renders title and subtitle', () => {
    render(<Genres />)

    expect(screen.getByRole('heading', { name: '📚 genres.title' })).toBeInTheDocument()
    expect(screen.getByText('genres.subtitle')).toBeInTheDocument()
  })

  test('renders first genre-card', () => {
    render(<Genres />)

    expect(screen.getByText('📖')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'genres.fiction.name' })).toBeInTheDocument()
    expect(screen.getByText('genres.fiction.description')).toBeInTheDocument()
  })

  test('navigates on genre-page on first card click', async () => {
    const user = userEvent.setup()

    render(<Genres />)

    const firstCard = screen
      .getByRole('heading', { name: 'genres.fiction.name' })
      .closest('.genre-card')

    if (!firstCard) {
      throw new Error('Expected genre card to be found')
    }

    await user.click(firstCard)

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/genres/fiction')
  })
})
