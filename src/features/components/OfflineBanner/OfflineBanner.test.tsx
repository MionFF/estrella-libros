import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import OfflineBanner from './OfflineBanner'

describe('OfflineBanner', () => {
  const originalNavigator = global.navigator

  afterEach(() => {
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    })
  })

  test('does not render when online', () => {
    Object.defineProperty(global.navigator, 'onLine', {
      value: true,
      writable: true,
    })

    render(<OfflineBanner />)

    expect(screen.queryByText('common.offline')).not.toBeInTheDocument()
  })

  test('renders banner when offline', () => {
    Object.defineProperty(global.navigator, 'onLine', {
      value: false,
      writable: true,
    })

    render(<OfflineBanner />)

    expect(screen.getByText('common.offline')).toBeInTheDocument()
  })

  test('shows banner when going offline', () => {
    Object.defineProperty(global.navigator, 'onLine', {
      value: true,
      writable: true,
    })

    render(<OfflineBanner />)

    expect(screen.queryByText('common.offline')).not.toBeInTheDocument()

    Object.defineProperty(global.navigator, 'onLine', {
      value: false,
      writable: true,
    })
    fireEvent(window, new Event('offline'))

    expect(screen.getByText('common.offline')).toBeInTheDocument()
  })

  test('hides banner when going online', () => {
    Object.defineProperty(global.navigator, 'onLine', {
      value: false,
      writable: true,
    })

    render(<OfflineBanner />)

    expect(screen.getByText('common.offline')).toBeInTheDocument()

    Object.defineProperty(global.navigator, 'onLine', {
      value: true,
      writable: true,
    })
    fireEvent(window, new Event('online'))

    expect(screen.queryByText('common.offline')).not.toBeInTheDocument()
  })
})
