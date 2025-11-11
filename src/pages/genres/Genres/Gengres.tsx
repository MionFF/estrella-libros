import { useNavigate } from 'react-router-dom'
import { GENRES } from '../../../constants/genres'

export default function Genres() {
  const navigate = useNavigate()

  const handleGenreClick = (genreId: string) => {
    navigate(`/genres/${genreId}`)
  }

  return (
    <div className='genres-page'>
      <div className='genres-page--header'>
        <h1>📚 Explore Genres</h1>
        <p>Discover books by your favorite categories</p>
      </div>

      <div className='genres-page-grid'>
        {GENRES.map(genre => (
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
