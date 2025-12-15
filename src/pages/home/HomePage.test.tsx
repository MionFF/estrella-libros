import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomePage from './HomePage'

const mockSearchButtonClick = jest.fn()

jest.mock('../../features/components/HomeHero/HomeHero.tsx', () => ({
  __esModule: true,
  default: () => <div data-testid={'home-hero'}>Home hero</div>,
}))

jest.mock('../../features/components/SearchButton/SearchButton.tsx', () => ({
  __esModule: true,
  default: () => (
    <button data-testid={'search-btn'} onClick={mockSearchButtonClick}>
      Search
    </button>
  ),
}))

jest.mock('../../features/components/FeaturedCollections/FeaturedCollections.tsx', () => ({
  __esModule: true,
  default: () => <div data-testid={'feat-collections'}>Featured Collections</div>,
}))

describe('HomePage', () => {
  beforeEach(() => {
    mockSearchButtonClick.mockClear()
  })

  test('renders title and subtitle', () => {
    render(<HomePage />)

    expect(screen.getByRole('heading', { name: 'home.title' })).toBeInTheDocument()
    expect(screen.getByText('home.subtitle')).toBeInTheDocument()
  })

  test('calls search button handler on click', async () => {
    const user = userEvent.setup()

    render(<HomePage />)

    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(mockSearchButtonClick).toHaveBeenCalledTimes(1)
  })

  test('renders all main components', () => {
    render(<HomePage />)

    expect(screen.getByTestId('home-hero')).toBeInTheDocument()
    expect(screen.getByTestId('search-btn')).toBeInTheDocument()
    expect(screen.getByTestId('feat-collections')).toBeInTheDocument()
  })
})
