import { useTranslation } from 'react-i18next'
import type { Book } from '../../types'
import FavoriteButton from '../FavoriteButton/FavoriteButton'

interface RecommendationsBookCardProps {
  book: Book
}

export default function BookCard({ book }: RecommendationsBookCardProps) {
  const { t } = useTranslation('common')

  return (
    <article className='book-card'>
      {/* Обложка книги */}
      <div className='book-card__image'>
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} className='book-card__img' loading='lazy' />
        ) : (
          <div className='book-card__no-image'>{t('bookCard.noCover')}</div>
        )}
      </div>

      {/* Информация о книге */}
      <div className='book-card__body'>
        {/* Заголовок и кнопка избранного в одной строке */}
        <div className='book-card__header'>
          <h3 className='book-card__title'>{book.title}</h3>
          <FavoriteButton bookId={book.id} size='md' />
        </div>

        {/* Авторы */}
        <p className='book-card__authors'>by {book.authors.join(', ')}</p>

        {/* Год издания */}
        {book.publishedYear && (
          <p className='book-card__year'>
            {t('bookCard.published')}: {book.publishedYear}
          </p>
        )}

        {/* Издатель */}
        {book.publisher && (
          <p className='book-card__publisher'>
            {t('bookCard.publisher')}: {book.publisher}
          </p>
        )}

        {/* Рейтинг */}
        {book.averageRating && (
          <div className='book-card__rating'>
            ⭐ {book.averageRating}/5
            {book.ratingsCount && ` (${book.ratingsCount} reviews)`}
          </div>
        )}

        {/* Страницы */}
        {book.pageCount && (
          <p className='book-card__pages'>
            {book.pageCount} {t('bookCard.pages')}
          </p>
        )}

        {/* Жанры/категории */}
        {book.categories && book.categories.length > 0 && (
          <div className='book-card__categories'>
            <strong>{t('bookCard.genres')}:</strong>
            <div className='book-card__tags'>
              {book.categories.slice(0, 3).map((category, index) => (
                <span key={index} className='book-card__tag'>
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Описание */}
        {book.description && (
          <div className='book-card__description'>
            <p>
              {book.description.length > 150
                ? `${book.description.substring(0, 150)}...`
                : book.description}
            </p>
          </div>
        )}

        {/* Ссылки */}
        <div className='book-card__links'>
          {book.previewLink && (
            <a href={book.previewLink} target='_blank' rel='noopener noreferrer'>
              {t('bookCard.preview')}
            </a>
          )}
          {book.infoLink && (
            <a href={book.infoLink} target='_blank' rel='noopener noreferrer'>
              {t('bookCard.moreInfo')}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
