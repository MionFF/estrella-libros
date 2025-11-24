import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const { t } = useTranslation('common')

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className='offline-banner'>
      <div className='offline-banner-content'>
        <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
          <path
            d='M23.64 7c-.45-.34-4.93-4-11.64-4-1.5 0-2.89.19-4.15.48L18.18 13.8 23.64 7zm-6.6 8.22L3.27 1.44 2 2.72l2.05 2.06C1.91 5.76.59 6.82.36 7l11.63 14.49.01.01.01-.01 3.9-4.86 3.32 3.32 1.27-1.27-3.46-3.46z'
            fill='currentColor'
          />
        </svg>
        <span>{t('common.offline')}</span>
      </div>
    </div>
  )
}
