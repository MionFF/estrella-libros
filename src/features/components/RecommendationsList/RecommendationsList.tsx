import { useRecommendations } from '../../../hooks/useRecommendations'
import { useEffect, useState } from 'react'
import BookCard from '../BookCard/BookCard'
import Loader from '../../../shared/Loader/Loader'

export default function RecommendationsList() {
  const { books, loading, error, loadRecommendations } = useRecommendations()
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    loadRecommendations()
    setLastUpdated(
      new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    )
  }, [])

  const handleRefresh = () => {
    loadRecommendations()
    setLastUpdated(
      new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    )
  }

  if (loading)
    return (
      <div className='recommendations-loading'>
        <Loader />
        <p>Discovering amazing books for you...</p>
      </div>
    )

  if (error)
    return (
      <div className='recommendations-error'>
        <div className='recommendations-error__content'>
          <div className='recommendations-error__icon'>😔</div>
          <h3>Unable to Load Recommendations</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className='recommendations-error__button'>
            Try Again
          </button>
        </div>
      </div>
    )

  return (
    <div className='recommendations-content'>
      {/* Header с информацией и кнопкой обновления */}
      <div className='recommendations-header'>
        <div className='recommendations-header__info'>
          <h2>Your Personalized Selection</h2>
          {lastUpdated && (
            <p className='recommendations-header__updated'>Updated on {lastUpdated}</p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className='recommendations-header__refresh'
          disabled={loading}
        >
          <span className='refresh-icon'>🔄</span>
          Refresh
        </button>
      </div>

      {/* Сетка книг */}
      {books.length > 0 ? (
        <div className='books-grid books-grid--recommendations'>
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className='recommendations-empty'>
          <div className='recommendations-empty__icon'>📚</div>
          <h3>No Recommendations Available</h3>
          <p>We're having trouble finding recommendations right now. Please try refreshing.</p>
          <button onClick={handleRefresh} className='recommendations-empty__button'>
            Refresh Recommendations
          </button>
        </div>
      )}

      {/* Информация в футере */}
      <div className='recommendations-footer'>
        <p>
          💡 <strong>Pro Tip:</strong> Recommendations are updated regularly. Check back for new
          discoveries!
        </p>
      </div>
    </div>
  )
}
