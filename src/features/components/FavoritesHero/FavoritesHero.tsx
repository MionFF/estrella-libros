interface FavoritesHeroProps {
  title?: string
  subtitle?: string
  count?: number
}

export default function FavoritesHero({
  title = '⭐ Your Favorites',
  subtitle = "Books you've loved and saved for later",
  count,
}: FavoritesHeroProps) {
  return (
    <div className='favorites-hero'>
      <h1>{title}</h1>
      <p>{count !== undefined ? `Your personal collection of ${count} beloved books` : subtitle}</p>
    </div>
  )
}
