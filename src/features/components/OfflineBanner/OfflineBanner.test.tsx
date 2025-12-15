import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import OfflineBanner from './OfflineBanner'

describe('OfflineBanner', () => {
  // Сохраняем оригинальное значение
  const originalNavigator = global.navigator

  afterEach(() => {
    // Восстанавливаем после каждого теста
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    })
  })

  test('does not render when online', () => {
    // Мокаем navigator.onLine = true
    Object.defineProperty(global.navigator, 'onLine', {
      value: true,
      writable: true,
    })

    render(<OfflineBanner />)

    expect(screen.queryByText('common.offline')).not.toBeInTheDocument()
  })

  test('renders banner when offline', () => {
    // Мокаем navigator.onLine = false
    Object.defineProperty(global.navigator, 'onLine', {
      value: false,
      writable: true,
    })

    render(<OfflineBanner />)

    expect(screen.getByText('common.offline')).toBeInTheDocument()
  })

  test('shows banner when going offline', () => {
    // Начинаем с online
    Object.defineProperty(global.navigator, 'onLine', {
      value: true,
      writable: true,
    })

    render(<OfflineBanner />)

    // Баннера нет
    expect(screen.queryByText('common.offline')).not.toBeInTheDocument()

    // Эмулируем событие offline
    Object.defineProperty(global.navigator, 'onLine', {
      value: false,
      writable: true,
    })
    fireEvent(window, new Event('offline'))

    // Баннер появился
    expect(screen.getByText('common.offline')).toBeInTheDocument()
  })

  test('hides banner when going online', () => {
    // Начинаем с offline
    Object.defineProperty(global.navigator, 'onLine', {
      value: false,
      writable: true,
    })

    render(<OfflineBanner />)

    // Баннер есть
    expect(screen.getByText('common.offline')).toBeInTheDocument()

    // Эмулируем событие online
    Object.defineProperty(global.navigator, 'onLine', {
      value: true,
      writable: true,
    })
    fireEvent(window, new Event('online'))

    // Баннер исчез
    expect(screen.queryByText('common.offline')).not.toBeInTheDocument()
  })
})
