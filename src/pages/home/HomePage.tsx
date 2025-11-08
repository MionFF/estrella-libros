import HomeHero from '../../features/components/HomeHero/HomeHero'
import SearchButton from '../../features/components/SearchButton/SearchButton'
import FeaturedCollections from '../../features/components/FeaturedCollections/FeaturedCollections'

export default function HomePage() {
  return (
    <div className='home-page'>
      <HomeHero />
      <div className='home-page__content'>
        <div className='container'>
          <div className='home-page__cta'>
            <h2>Begin Your Literary Journey</h2>
            <p>Discover millions of books at your fingertips</p>
            <SearchButton />
          </div>
          <FeaturedCollections />
        </div>
      </div>
    </div>
  )
}
