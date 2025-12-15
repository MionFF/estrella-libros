import HomeHero from '../../features/components/HomeHero/HomeHero'
import SearchButton from '../../features/components/SearchButton/SearchButton'
import FeaturedCollections from '../../features/components/FeaturedCollections/FeaturedCollections'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
  const { t } = useTranslation('common')

  return (
    <div className='home-page'>
      <HomeHero />
      <div className='home-page__content'>
        <div className='container'>
          <div className='home-page__cta'>
            <h2>{t('home.title')}</h2>
            <p>{t('home.subtitle')}</p>
            <SearchButton />
          </div>
          <FeaturedCollections />
        </div>
      </div>
    </div>
  )
}
