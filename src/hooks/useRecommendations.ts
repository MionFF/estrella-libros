// hooks/useRecommendations.ts
import { useGoogleBooks } from './useGoogleBooks'

export const useRecommendations = () => {
  const { books, loading, error, searchBooks } = useGoogleBooks()

  const recommendationStrategies = [
    {
      name: 'bestsellers',
      query: 'bestseller 2024',
      description: 'Popular Books This Year',
    },
    {
      name: 'awardWinners',
      query: 'award winning book',
      description: 'Award Winning Literature',
    },
    {
      name: 'classics',
      query: 'classic literature',
      description: 'Timeless Classics',
    },
    {
      name: 'newReleases',
      query: `published:${new Date().getFullYear()}`,
      description: 'New Releases',
    },
    {
      name: 'highlyRated',
      query: 'highly recommended books',
      description: 'Reader Favorites',
    },
  ]

  const loadRecommendations = () => {
    // Выбираем случайную стратегию для разнообразия
    const randomStrategy =
      recommendationStrategies[Math.floor(Math.random() * recommendationStrategies.length)]

    console.log(`Loading: ${randomStrategy.description}`)
    searchBooks(randomStrategy.query, 20)
  }

  return {
    books,
    loading,
    error,
    loadRecommendations,
  }
}
