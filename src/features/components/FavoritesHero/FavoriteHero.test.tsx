import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import FavoritesHero from './FavoritesHero'

describe('FavoriteHero', () => {
  test('renders title and subtitle without count', () => {
    render(<FavoritesHero title='Favorites' subtitle='Your favorite books' />)

    expect(screen.getByRole('heading', { name: 'Favorites' })).toBeInTheDocument()
    expect(screen.getByText('Your favorite books')).toBeInTheDocument()
  })

  test('renders title and count', () => {
    render(<FavoritesHero title='Favorites' subtitle='Your favorite books' count={3} />)

    expect(screen.getByRole('heading', { name: 'Favorites' })).toBeInTheDocument()
    expect(screen.queryByText('Your favorite books')).not.toBeInTheDocument()

    expect(screen.getByText('favorites.hero.subtitleCollectionOf')).toBeInTheDocument()
  })
})
