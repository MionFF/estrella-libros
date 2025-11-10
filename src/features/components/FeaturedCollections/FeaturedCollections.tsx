import { useNavigate } from 'react-router-dom'

const collections = [
  {
    title: 'Featured Books',
    description: 'Handpicked selection of remarkable literary works',
    icon: '📖',
    count: 'Curated collection',
    path: 'featured-books',
  },
  {
    title: 'New Releases',
    description: 'Fresh books from contemporary authors and publishers',
    icon: '🆕',
    count: 'Latest additions',
    path: 'new-releases',
  },
  {
    title: 'Award Winners',
    description: 'Critically acclaimed and prize-winning literature',
    icon: '⭐',
    count: 'Prize collection',
    path: 'award-winners',
  },
]

export default function FeaturedCollections() {
  const navigate = useNavigate()

  return (
    <div className='featured-collections'>
      <h2>Featured Collections</h2>
      <p className='featured-collections__subtitle'>Curated book selections for every taste</p>

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
