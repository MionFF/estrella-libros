import RecommendationsList from '../../features/components/RecommendationsList/RecommendationsList'
import './_Recommendations.scss'

export default function Recommendations() {
  return (
    <div className='recommendations-page'>
      <div className='recommendations-hero'>
        <div className='container'>
          <div className='recommendations-hero__content'>
            <h1 className='recommendations-hero__title'>Curated Recommendations</h1>
            <p className='recommendations-hero__subtitle'>
              Handpicked books just for you. Discover new favorites from our carefully selected
              collections.
            </p>
            <div className='recommendations-hero__features'>
              <span className='feature-tag'>🎯 Personalized</span>
              <span className='feature-tag'>⭐ Highly Rated</span>
              <span className='feature-tag'>🆕 Regularly Updated</span>
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
