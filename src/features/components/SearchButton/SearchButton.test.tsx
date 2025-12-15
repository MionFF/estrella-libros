import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import SearchButton from './SearchButton'

// Мокируем useNavigate
const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('SearchButton', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders search button', () => {
    render(
      <BrowserRouter>
        <SearchButton />
      </BrowserRouter>,
    )

    const button = screen.getByRole('button', { name: /Перейти к поиску книг/i })
    expect(button).toBeInTheDocument()
    expect(screen.getByText('home.homeSearchButton')).toBeInTheDocument()
  })

  test('navigates to /search on click', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <SearchButton />
      </BrowserRouter>,
    )

    const button = screen.getByRole('button', { name: /Перейти к поиску книг/i })
    await user.click(button)

    expect(mockNavigate).toHaveBeenCalledWith('/search')
  })
})
