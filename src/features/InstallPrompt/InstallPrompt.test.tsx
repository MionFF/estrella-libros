import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InstallPrompt from './InstallPrompt'
import { usePWAInstall } from '../../hooks/usePWAInstall'

const mockHandleInstall = jest.fn()
const mockHandleDismiss = jest.fn()

jest.mock('../../hooks/usePWAInstall.ts', () => ({
  usePWAInstall: jest.fn(),
}))

const mockUsePWAInstall = usePWAInstall as jest.Mock

describe('InstallPrompt', () => {
  beforeEach(() => {
    mockUsePWAInstall.mockClear()
    mockHandleInstall.mockClear()
    mockHandleDismiss.mockClear()

    mockUsePWAInstall.mockReturnValue({
      isInstallable: true,
      handleInstall: mockHandleInstall,
      handleDismiss: mockHandleDismiss,
    })
  })

  test('renders title and subtitle', () => {
    render(<InstallPrompt />)

    expect(screen.getByRole('heading', { name: 'installPrompt.title' })).toBeInTheDocument()
    expect(screen.getByText('installPrompt.subtitle')).toBeInTheDocument()
  })

  test('installs app on install button click', async () => {
    const user = userEvent.setup()

    render(<InstallPrompt />)

    await user.click(screen.getByRole('button', { name: 'installPrompt.installButton' }))

    expect(mockHandleInstall).toHaveBeenCalledTimes(1)
  })

  test('dismisses app installation on button click', async () => {
    const user = userEvent.setup()

    render(<InstallPrompt />)

    await user.click(screen.getByRole('button', { name: 'installPrompt.closeAriaLabel' }))

    expect(mockHandleDismiss).toHaveBeenCalledTimes(1)
  })

  test("doesn't render install prompt when it's uninstallable", () => {
    mockUsePWAInstall.mockReturnValue({
      isInstallable: false,
      handleInstall: mockHandleInstall,
      handleDismiss: mockHandleDismiss,
    })

    render(<InstallPrompt />)

    expect(screen.queryByRole('heading', { name: 'installPrompt.title' })).not.toBeInTheDocument()
    expect(screen.queryByText('installPrompt.subtitle')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'installPrompt.closeAriaLabel' }),
    ).not.toBeInTheDocument()
  })
})
