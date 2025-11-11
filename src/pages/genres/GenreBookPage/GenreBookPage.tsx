import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import BookCard from '../../../features/components/BookCard/BookCard'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../../shared/Loader/Loader'
import { GENRES } from '../../../constants/genres'

export default function GenreBookPage() {
  const { genreId } = useParams()
  const navigate = useNavigate()
  const { books, loading, error, searchBooks } = useGoogleBooks()

  const genre = GENRES.find(g => g.id === genreId)

  useEffect(() => {
    if (genre) {
      searchBooks(genre.query, 40)
    }
  }, [genre])

  const handleBack = () => {
    navigate('/genres')
  }

  if (!genre) {
    return (
      <div className='genre-not-found'>
        <h2>Genre not found</h2>
        <button onClick={() => navigate('/genres')}>Back to Genres</button>
      </div>
    )
  }

  return (
    <div className='genre-books-page'>
      <div className='genre-books-header'>
        <button onClick={handleBack} className='genre-books-back-btn'>
          ← Back to Genres
        </button>
        <div className='genre-books-header__content'>
          <h1>
            {genre.emoji} {genre.name}
          </h1>
          <p>{genre.description}</p>
        </div>
      </div>

      <div className='genre-books-container'>
        {loading ? (
          <div className='genre-books-loading'>
            <Loader />
            <p>Loading {genre.name} books...</p>
          </div>
        ) : error ? (
          <div className='genre-books-error'>
            <div className='genre-books-error__content'>
              <div className='genre-books-error__icon'>😔</div>
              <h3>Unable to Load Books</h3>
              <p>{error}</p>
              <button onClick={() => searchBooks(genre.query, 40)}>Try Again</button>
            </div>
          </div>
        ) : (
          <div className='genre-books-list'>
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
