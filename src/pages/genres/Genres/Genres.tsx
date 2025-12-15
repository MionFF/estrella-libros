import { useNavigate } from 'react-router-dom'
import { GENRES } from '../../../constants/genres'
import { useTranslation } from 'react-i18next'

export default function Genres() {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const handleGenreClick = (genreId: string) => {
    navigate(`/genres/${genreId}`)
  }

  const localizedGenres = GENRES.map(genre => ({
    ...genre,
    name: t(`genres.${genre.id}.name`),
    description: t(`genres.${genre.id}.description`),
  }))

  return (
    <div className='genres-page'>
      <div className='genres-page--header'>
        <h1>📚 {t('genres.title')}</h1>
        <p>{t('genres.subtitle')}</p>
      </div>

      <div className='genres-page-grid'>
        {localizedGenres.map(genre => (
          <div onClick={() => handleGenreClick(genre.id)} key={genre.id} className='genre-card'>
            <div className='genre-card__emoji'>{genre.emoji}</div>
            <h3 className='genre-card__name'>{genre.name}</h3>
            <p className='genre-card__description'>{genre.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
