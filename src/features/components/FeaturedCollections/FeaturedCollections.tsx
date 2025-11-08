const collections = [
  {
    title: 'Bestsellers',
    description: 'Most popular books this month',
    icon: '🔥',
    count: '2.4K+ books',
  },
  {
    title: 'New Releases',
    description: 'Fresh from the publishers',
    icon: '🆕',
    count: '500+ books',
  },
  {
    title: 'Award Winners',
    description: 'Critically acclaimed literature',
    icon: '⭐',
    count: '800+ books',
  },
  // {
  //   title: "Editor's Picks",
  //   description: 'Handpicked by our team',
  //   icon: '🎯',
  //   count: '300+ books',
  // },
]

export default function FeaturedCollections() {
  return (
    <div className='featured-collections'>
      <h2>Featured Collections</h2>
      <p className='featured-collections__subtitle'>Curated book selections for every taste</p>

      <div className='collections-grid'>
        {collections.map((collection, index) => (
          <div key={index} className='collection-card'>
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
