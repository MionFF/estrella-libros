import { useTranslation } from 'react-i18next'
import RecommendationsList from '../../features/components/RecommendationsList/RecommendationsList'
import './_Recommendations.scss'

export default function Recommendations() {
  const { t } = useTranslation('common')

  return (
    <div className='recommendations-page'>
      <div className='recommendations-hero'>
        <div className='container'>
          <div className='recommendations-hero__content'>
            <h1 className='recommendations-hero__title'>{t('recommendations.title')}</h1>
            <p className='recommendations-hero__subtitle'>{t('recommendations.subtitle')}</p>
            <div className='recommendations-hero__features'>
              <span className='feature-tag'>🎯 {t('recommendations.featureTag1')}</span>
              <span className='feature-tag'>⭐ {t('recommendations.featureTag2')}</span>
              <span className='feature-tag'>🆕 {t('recommendations.featureTag3')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='container'>
        <RecommendationsList />
      </div>
    </div>
  )
}
