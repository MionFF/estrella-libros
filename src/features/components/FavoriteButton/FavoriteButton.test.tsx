import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FavoriteButton from './FavoriteButton'
import { useIsFavorite, toggle } from '../../../store/favStore'
import { act } from 'react'

jest.mock('../../../store/favStore', () => ({
  toggle: jest.fn(),
  useIsFavorite: jest.fn(),
}))

describe('FavoriteButton', () => {
  const mockIsFavorite = useIsFavorite as jest.Mock
  const mockToggle = toggle as jest.Mock

  beforeEach(() => {
    mockIsFavorite.mockClear()
    mockToggle.mockClear()
  })

  test('renders button', () => {
    render(<FavoriteButton bookId='1' />)

    expect(screen.getByTestId('favorite-button')).toBeInTheDocument()
  })

  test('aria-label changes when not favorite', async () => {
    mockIsFavorite.mockReturnValue(false)

    render(<FavoriteButton bookId='1' />)

    const favBtn = screen.getByTestId('favorite-button')

    expect(favBtn).toHaveAttribute('aria-label', 'Add to favorites')
  })

  test('aria-label changes when favorite', async () => {
    mockIsFavorite.mockReturnValue(true)

    render(<FavoriteButton bookId='1' />)

    const favBtn = screen.getByRole('button')

    expect(favBtn).toHaveAttribute('aria-label', 'Remove from favorites')
  })

  test('aria-pressed changes when not favorite', () => {
    mockIsFavorite.mockReturnValue(false)

    render(<FavoriteButton bookId='1' />)

    const favBtn = screen.getByRole('button')

    expect(favBtn).toHaveAttribute('aria-pressed', 'false')
  })

  test('aria-pressed changes when favorite', () => {
    mockIsFavorite.mockReturnValue(true)

    render(<FavoriteButton bookId='1' />)

    const favBtn = screen.getByTestId('favorite-button')

    expect(favBtn).toHaveAttribute('aria-pressed', 'true')
  })

  test('calls toggle by click', async () => {
    mockIsFavorite.mockReturnValue(false)

    const user = userEvent.setup()

    render(<FavoriteButton bookId='1' />)

    const favButton = screen.getByRole('button')

    await user.click(favButton)

    expect(mockToggle).toHaveBeenCalledTimes(1)
  })

  test('fav-btn--on class is active while pressed=true', () => {
    mockIsFavorite.mockReturnValue(true)

    render(<FavoriteButton bookId='1' />)

    const favButton = screen.getByRole('button')

    expect(favButton).toHaveClass('fav-btn--on')
  })

  test('animation class appears for 500ms when adding to favorites', async () => {
    jest.useFakeTimers()
    mockIsFavorite.mockReturnValue(false)

    const user = userEvent.setup({ delay: null })
    render(<FavoriteButton bookId='1' />)
    const button = screen.getByRole('button')

    await user.click(button)
    expect(button).toHaveClass('fav-btn--animate')

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(button).not.toHaveClass('fav-btn--activate')
    jest.useRealTimers()
  })
})
