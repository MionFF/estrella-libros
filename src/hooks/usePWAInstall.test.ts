import '@testing-library/jest-dom'
import { renderHook, act } from '@testing-library/react'
import { usePWAInstall } from './usePWAInstall'

describe('usePWAInstall', () => {
  let localStorageMock: { [key: string]: string } = {}

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {}

    Storage.prototype.getItem = jest.fn((key: string) => localStorageMock[key] || null)
    Storage.prototype.setItem = jest.fn((key: string, value: string) => {
      localStorageMock[key] = value
    })
    Storage.prototype.removeItem = jest.fn((key: string) => {
      delete localStorageMock[key]
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('initial state when user has not dismissed', () => {
    const { result } = renderHook(() => usePWAInstall())

    expect(result.current.isInstallable).toBe(false)
  })

  test('initial state when user has dismissed before', () => {
    localStorageMock['pwa-install-dismissed'] = 'true'

    const { result } = renderHook(() => usePWAInstall())

    expect(result.current.isInstallable).toBe(false)
  })

  test('sets installable on beforeinstallprompt event', () => {
    const { result } = renderHook(() => usePWAInstall())

    const mockPrompt = jest.fn().mockResolvedValue(undefined)
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const })

    const event = new Event('beforeinstallprompt')
    Object.assign(event, {
      prompt: mockPrompt,
      userChoice: mockUserChoice,
    })

    act(() => {
      window.dispatchEvent(event)
    })

    expect(result.current.isInstallable).toBe(true)
  })

  test('ignores beforeinstallprompt without valid prompt', () => {
    const { result } = renderHook(() => usePWAInstall())

    const event = new Event('beforeinstallprompt')
    // Не добавляем prompt — имитируем фейковое событие

    act(() => {
      window.dispatchEvent(event)
    })

    expect(result.current.isInstallable).toBe(false)
  })

  test('handleInstall calls prompt and handles accepted', async () => {
    const { result } = renderHook(() => usePWAInstall())

    const mockPrompt = jest.fn().mockResolvedValue(undefined)
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const })

    const event = new Event('beforeinstallprompt')
    Object.assign(event, {
      prompt: mockPrompt,
      userChoice: mockUserChoice,
    })

    act(() => {
      window.dispatchEvent(event)
    })

    expect(result.current.isInstallable).toBe(true)

    await act(async () => {
      await result.current.handleInstall()
    })

    expect(mockPrompt).toHaveBeenCalledTimes(1)
    expect(result.current.isInstallable).toBe(false)
  })

  test('handleInstall saves dismissed to localStorage', async () => {
    const { result } = renderHook(() => usePWAInstall())

    const mockPrompt = jest.fn().mockResolvedValue(undefined)
    const mockUserChoice = Promise.resolve({ outcome: 'dismissed' as const })

    const event = new Event('beforeinstallprompt')
    Object.assign(event, {
      prompt: mockPrompt,
      userChoice: mockUserChoice,
    })

    act(() => {
      window.dispatchEvent(event)
    })

    await act(async () => {
      await result.current.handleInstall()
    })

    expect(localStorage.setItem).toHaveBeenCalledWith('pwa-install-dismissed', 'true')
    expect(result.current.isInstallable).toBe(false)
  })

  test('handleDismiss saves flag to localStorage', () => {
    const { result } = renderHook(() => usePWAInstall())

    act(() => {
      result.current.handleDismiss()
    })

    expect(localStorage.setItem).toHaveBeenCalledWith('pwa-install-dismissed', 'true')
    expect(result.current.isInstallable).toBe(false)
  })

  test('appinstalled event resets state', () => {
    const { result } = renderHook(() => usePWAInstall())

    const mockPrompt = jest.fn().mockResolvedValue(undefined)
    const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const })

    const installEvent = new Event('beforeinstallprompt')
    Object.assign(installEvent, {
      prompt: mockPrompt,
      userChoice: mockUserChoice,
    })

    act(() => {
      window.dispatchEvent(installEvent)
    })

    expect(result.current.isInstallable).toBe(true)

    act(() => {
      window.dispatchEvent(new Event('appinstalled'))
    })

    expect(result.current.isInstallable).toBe(false)
  })

  test('does not react to beforeinstallprompt when user dismissed before', () => {
    localStorageMock['pwa-install-dismissed'] = 'true'

    const { result } = renderHook(() => usePWAInstall())

    const mockPrompt = jest.fn().mockResolvedValue(undefined)
    const event = new Event('beforeinstallprompt')
    Object.assign(event, {
      prompt: mockPrompt,
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    })

    act(() => {
      window.dispatchEvent(event)
    })

    expect(result.current.isInstallable).toBe(false)
  })
})
