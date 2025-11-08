export default function HomeHero() {
  return (
    <section className='home-hero'>
      <div className='home-hero__overlay' />
      <div className='home-hero__background-pattern' />
      <div className='container'>
        <div className='home-hero__content'>
          <div className='home-hero__badge'>✨ New & Improved</div>
          <h1 className='home-hero__title'>Welcome to Estrella Libros!</h1>
          <p className='home-hero__subtitle'>
            Your gateway to a universe of stories. Discover, explore, and fall in love with books.
          </p>
          <div className='home-hero__stats'>
            <div className='stat'>
              <span className='stat__number'>1M+</span>
              <span className='stat__label'>Books Available</span>
            </div>
            <div className='stat'>
              <span className='stat__number'>50K+</span>
              <span className='stat__label'>Happy Readers</span>
            </div>
            <div className='stat'>
              <span className='stat__number'>24/7</span>
              <span className='stat__label'>Access</span>
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
