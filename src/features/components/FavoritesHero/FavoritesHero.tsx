import { useTranslation } from 'react-i18next'

interface FavoritesHeroProps {
  title: string
  subtitle: string
  count?: number
}

export default function FavoritesHero({ title, subtitle, count }: FavoritesHeroProps) {
  const { t } = useTranslation('common')

  return (
    <div className='favorites-hero'>
      <h1>{title}</h1>
      <p>
        {count !== undefined
          ? t('favorites.hero.subtitleCollectionOf', { count: count })
          : subtitle}
      </p>
    </div>
  )
}
