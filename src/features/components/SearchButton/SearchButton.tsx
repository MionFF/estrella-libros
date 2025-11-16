import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function SearchButton() {
  const navigate = useNavigate()

  function handleClick() {
    navigate('/search')
  }

  const { t } = useTranslation('common')
  const homeSearchButton = t('home.homeSearchButton')

  return (
    <button className='search-button' onClick={handleClick} aria-label='Перейти к поиску книг'>
      <span className='search-button__icon'>🔍</span>
      <span className='search-button__text'>{homeSearchButton}</span>
      <span className='search-button__arrow'>→</span>
    </button>
  )
}
