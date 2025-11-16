import { useGoogleBooks } from '../../../hooks/useGoogleBooks'
import BookCard from '../../../features/components/BookCard/BookCard'
import { useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../../shared/Loader/Loader'
import { GENRES } from '../../../constants/genres'
import { useTranslation } from 'react-i18next'

export default function GenreBookPage() {
  const { genreId } = useParams()
  const navigate = useNavigate()
  const { books, loading, error, searchBooks } = useGoogleBooks()
  const { t } = useTranslation('common')

  const localizedGenres = GENRES.map(genre => ({
    ...genre,
    name: t(`genres.${genre.id}.name`),
    description: t(`genres.${genre.id}.description`),
  }))

  const genre = localizedGenres.find(g => g.id === genreId)

  // 🔥 ИСПРАВЛЕНИЕ: используем useCallback для стабильной функции
  const searchGenreBooks = useCallback(() => {
    if (genre) {
      searchBooks(genre.query, 40)
    }
  }, [genre, searchBooks])

  useEffect(() => {
    // 🔥 Добавь проверку, чтобы не запускать при каждом рендере
    if (genre && !loading && books.length === 0) {
      searchBooks(genre.query, 40)
    }
  }, [genre]) // Только при смене жанра

  const handleBack = () => {
    navigate('/genres')
  }

  if (!genre) {
    return (
      <div className='genre-not-found'>
        <h2>{t('genres.bookPage.emptyTitle')}</h2>
        <button onClick={() => navigate('/genres')}>{t('genres.bookPage.backButton')}</button>
      </div>
    )
  }

  return (
    <div className='genre-books-page'>
      <div className='genre-books-header'>
        <button onClick={handleBack} className='genre-books-back-btn'>
          ← {t('genres.bookPage.backButton')}
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
            <p>{t('genres.bookPage.loadingLabel', { genre: genre.name })}</p>
          </div>
        ) : error ? (
          <div className='genre-books-error'>
            <div className='genre-books-error__content'>
              <div className='genre-books-error__icon'>😔</div>
              <h3>{t('genres.bookPage.errorTitle')}</h3>
              <p>{error}</p>
              <button onClick={searchGenreBooks}>{t('common.tryAgain')}</button>
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
