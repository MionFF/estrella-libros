import { usePWAInstall } from '../../hooks/usePWAInstall'

export default function InstallPrompt() {
  const { isInstallable, handleInstall, handleDismiss } = usePWAInstall()

  if (!isInstallable) return null

  return (
    <div className='install-prompt-floating'>
      <button
        className='install-prompt-close'
        onClick={handleDismiss}
        aria-label='Close install prompt'
      >
        ×
      </button>

      <div className='install-prompt-content'>
        <div className='install-prompt-icon'>
          <svg width='32' height='32' viewBox='0 0 24 24' fill='none'>
            <path
              d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
            <polyline
              points='7 10 12 15 17 10'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <line
              x1='12'
              y1='15'
              x2='12'
              y2='3'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
        </div>

        <div className='install-prompt-text'>
          <h3>Install Estrella Libros</h3>
          <p>Quick access from your device</p>
        </div>

        <button className='install-prompt-btn' onClick={handleInstall}>
          Install
        </button>
      </div>
    </div>
  )
}
