import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FeaturedCollections from './FeaturedCollections'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('FeaturedCollection', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  test('renders title and subtitle', () => {
    render(<FeaturedCollections />)

    expect(
      screen.getByRole('heading', { name: 'home.featuredCollection.title' }),
    ).toBeInTheDocument()
    expect(screen.getByText('home.featuredCollection.subtitle')).toBeInTheDocument()
  })

  test('renders all collection titles', () => {
    render(<FeaturedCollections />)

    expect(
      screen.getByRole('heading', { name: 'home.featuredCollection.featuredBooks.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'home.featuredCollection.newReleases.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'home.featuredCollection.awardWinners.title' }),
    ).toBeInTheDocument()
  })

  test('navigates to featured-books on first card click', async () => {
    const user = userEvent.setup()

    render(<FeaturedCollections />)

    const firstCard = screen
      .getByText('home.featuredCollection.featuredBooks.title')
      .closest('.collection-card')

    if (!firstCard) {
      throw new Error('Expected collection card to be found')
    }

    await user.click(firstCard)

    expect(mockNavigate).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/featured-books')
  })
})
