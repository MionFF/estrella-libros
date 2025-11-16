import { useTranslation } from 'react-i18next'

export default function HomeHero() {
  const { t } = useTranslation('common')

  const badge = t('home.homeHero.badge')
  const title = t('home.homeHero.title')
  const subtitle = t('home.homeHero.subtitle')
  const statLabel1 = t('home.homeHero.statLabel1')
  const statLabel2 = t('home.homeHero.statLabel2')
  const statLabel3 = t('home.homeHero.statLabel3')

  return (
    <section className='home-hero'>
      <div className='home-hero__overlay' />
      <div className='home-hero__background-pattern' />
      <div className='container'>
        <div className='home-hero__content'>
          <div className='home-hero__badge'>✨ {badge}</div>
          <h1 className='home-hero__title'>{title}</h1>
          <p className='home-hero__subtitle'>{subtitle}</p>
          <div className='home-hero__stats'>
            <div className='stat'>
              <span className='stat__number'>1M+</span>
              <span className='stat__label'>{statLabel1}</span>
            </div>
            <div className='stat'>
              <span className='stat__number'>50K+</span>
              <span className='stat__label'>{statLabel2}</span>
            </div>
            <div className='stat'>
              <span className='stat__number'>24/7</span>
              <span className='stat__label'>{statLabel3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className='home-hero__decoration home-hero__decoration--1'>📖</div>
      <div className='home-hero__decoration home-hero__decoration--2'>⭐</div>
      <div className='home-hero__decoration home-hero__decoration--3'>🎯</div>
    </section>
  )
}
