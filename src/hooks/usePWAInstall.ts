import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  const [userDismissed, setUserDismissed] = useState(
    () => localStorage.getItem('pwa-install-dismissed') === 'true',
  )

  useEffect(() => {
    if (userDismissed) return

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()

      const promptEvent = e as BeforeInstallPromptEvent

      if (typeof promptEvent.prompt !== 'function') {
        return
      }

      setInstallPrompt(promptEvent)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      setIsInstallable(false)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [userDismissed])

  const handleInstall = async () => {
    if (!installPrompt || typeof installPrompt.prompt !== 'function') {
      setIsInstallable(false)
      return
    }

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice

      if (outcome === 'dismissed') {
        localStorage.setItem('pwa-install-dismissed', 'true')
        setUserDismissed(true)
      }

      setInstallPrompt(null)
      setIsInstallable(false)
    } catch (error) {
      console.error('PWA installation error:', error)
      setIsInstallable(false)
    }
  }

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', 'true')
    setUserDismissed(true)
    setIsInstallable(false)
  }

  return {
    isInstallable,
    handleInstall,
    handleDismiss,
  }
}
