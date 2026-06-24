import { useState } from 'react'
import { useBooksSearchQuery } from '../features/books/bookQueries'

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

function createRecommendationsQuery() {
  const shuffled = [...recommendationStrategies].sort(() => 0.5 - Math.random())
  const selectedStrategies = shuffled.slice(0, 2)

  return selectedStrategies.map(strategy => strategy.query).join(' ')
}

export const useRecommendations = () => {
  const [recommendationsQuery, setRecommendationsQuery] = useState('')

  const {
    data: books = [],
    isLoading,
    isFetching,
    isError,
    error,
  } = useBooksSearchQuery(recommendationsQuery, 25)

  const loading = isLoading || isFetching
  const errorMessage = error instanceof Error ? error.message : null

  const loadRecommendations = () => {
    setRecommendationsQuery(createRecommendationsQuery())
  }

  return {
    books,
    loading,
    error: isError ? errorMessage : null,
    loadRecommendations,
  }
}
