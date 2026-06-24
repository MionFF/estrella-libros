import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BookCard from '../../../features/components/BookCard/BookCard'
import { useBooksSearchQuery } from '../../../features/books/bookQueries'
import Loader from '../../../shared/Loader/Loader'
import { GENRES } from '../../../constants/genres'

export default function GenreBookPage() {
  const { genreId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const localizedGenres = GENRES.map(genre => ({
    ...genre,
    name: t(`genres.${genre.id}.name`),
    description: t(`genres.${genre.id}.description`),
  }))

  const genre = localizedGenres.find(g => g.id === genreId)
  const genreQuery = genre?.query ?? ''

  const {
    data: books = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useBooksSearchQuery(genreQuery, 40)

  const loading = isLoading || isFetching
  const errorMessage = error instanceof Error ? error.message : null

  const handleBack = () => {
    navigate('/genres')
  }

  const handleRetry = () => {
    refetch()
  }

  if (!genre) {
    return (
      <div className='genre-not-found'>
        <h2>{t('genres.bookPage.emptyTitle')}</h2>
        <button onClick={handleBack}>{t('genres.bookPage.backButton')}</button>
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
        ) : isError && errorMessage ? (
          <div className='genre-books-error'>
            <div className='genre-books-error__content'>
              <div className='genre-books-error__icon'>😔</div>
              <h3>{t('genres.bookPage.errorTitle')}</h3>
              <p>{errorMessage}</p>
              <button onClick={handleRetry}>{t('common.tryAgain')}</button>
            </div>
          </div>
        ) : books.length > 0 ? (
          <div className='genre-books-list'>
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className='genre-books-empty'>
            <div className='genre-books-empty__icon'>📚</div>
            <h3>{t('genres.bookPage.emptyBooksTitle')}</h3>
            <p>{t('genres.bookPage.emptyBooksSubtitle')}</p>
            <button onClick={handleRetry}>{t('common.tryAgain')}</button>
          </div>
        )}
      </div>
    </div>
  )
}
