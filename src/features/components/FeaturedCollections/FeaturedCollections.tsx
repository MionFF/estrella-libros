import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export default function FeaturedCollections() {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const collections = [
    {
      title: t('home.featuredCollection.featuredBooks.title'),
      description: t('home.featuredCollection.featuredBooks.description'),
      icon: '📖',
      count: t('home.featuredCollection.featuredBooks.count'),
      path: 'featured-books',
    },
    {
      title: t('home.featuredCollection.newReleases.title'),
      description: t('home.featuredCollection.newReleases.description'),
      icon: '🆕',
      count: t('home.featuredCollection.newReleases.count'),
      path: 'new-releases',
    },
    {
      title: t('home.featuredCollection.awardWinners.title'),
      description: t('home.featuredCollection.awardWinners.description'),
      icon: '⭐',
      count: t('home.featuredCollection.awardWinners.count'),
      path: 'award-winners',
    },
  ]

  return (
    <div className='featured-collections'>
      <h2>{t('home.featuredCollection.title')}</h2>
      <p className='featured-collections__subtitle'>{t('home.featuredCollection.subtitle')}</p>

      <div className='collections-grid'>
        {collections.map((collection, index) => (
          <div
            onClick={() => navigate(`/${collection.path}`)}
            key={index}
            className='collection-card'
          >
            <div className='collection-card__icon'>{collection.icon}</div>
            <h3 className='collection-card__title'>{collection.title}</h3>
            <p className='collection-card__description'>{collection.description}</p>
            <span className='collection-card__count'>{collection.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
