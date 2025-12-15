import { useGoogleBooks } from './useGoogleBooks'

export const useRecommendations = () => {
  const { books, loading, error, searchBooks } = useGoogleBooks()

  const recommendationStrategies = [
    {
      name: 'mysteryThriller',
      query: 'mystery thriller suspense novel',
      description: 'Page-Turning Thrillers',
    },
    {
      name: 'sciFiFantasy',
      query: 'science fiction fantasy epic',
      description: 'Sci-Fi & Fantasy Adventures',
    },
    {
      name: 'romance',
      query: 'romance love story contemporary',
      description: 'Heartwarming Romance',
    },
    {
      name: 'biography',
      query: 'biography memoir autobiography',
      description: 'Inspiring Life Stories',
    },
    {
      name: 'historicalFiction',
      query: 'historical fiction period drama',
      description: 'Historical Journeys',
    },
    {
      name: 'selfDevelopment',
      query: 'self development personal growth',
      description: 'Personal Growth',
    },
    {
      name: 'youngAdult',
      query: 'young adult contemporary YA',
      description: 'Young Adult Favorites',
    },
    {
      name: 'shortStories',
      query: 'short stories collection anthology',
      description: 'Bite-Sized Stories',
    },
    {
      name: 'travelAdventure',
      query: 'travel adventure exploration',
      description: 'Adventure & Travel',
    },
    {
      name: 'philosophy',
      query: 'philosophy thought-provoking',
      description: 'Thought-Provoking Reads',
    },
  ]

  const loadRecommendations = () => {
    // Выбираем 2 случайные стратегии и комбинируем их
    const shuffled = [...recommendationStrategies].sort(() => 0.5 - Math.random())
    const selectedStrategies = shuffled.slice(0, 2)

    // Создаем комбинированный запрос для большего разнообразия
    const combinedQuery = selectedStrategies.map(strategy => strategy.query).join(' ')

    searchBooks(combinedQuery, 25)
  }

  return {
    books,
    loading,
    error,
    loadRecommendations,
  }
}
