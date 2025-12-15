import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageMenu from './LanguageMenu'

const mockChangeLanguage = jest.fn()

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: mockChangeLanguage,
    },
  }),
}))

describe('LanguageMenu', () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear()
  })

  test('renders language button', () => {
    render(<LanguageMenu />)

    expect(screen.getByRole('button', { name: 'Change language' })).toBeInTheDocument()
  })

  test('opens language menu on button click', async () => {
    const user = userEvent.setup()

    render(<LanguageMenu />)

    const button = screen.getByRole('button', { name: 'Change language' })

    await user.click(button)

    expect(screen.getByRole('menu')).toBeVisible()
    expect(screen.getByText('English')).toBeInTheDocument()
    expect(screen.getByText('Русский')).toBeInTheDocument()
    expect(screen.getByText('Español')).toBeInTheDocument()
  })

  test('changes language on menu item click', async () => {
    const user = userEvent.setup()

    render(<LanguageMenu />)

    await user.click(screen.getByRole('button', { name: 'Change language' }))
    await user.click(screen.getByText('Русский'))

    expect(mockChangeLanguage).toHaveBeenCalledWith('ru')
  })

  test('closes menu on escape press', async () => {
    const user = userEvent.setup()

    render(<LanguageMenu />)

    await user.click(screen.getByRole('button', { name: 'Change language' }))

    expect(screen.getByRole('menu')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  test('closes menu on outside click', async () => {
    const user = userEvent.setup()

    render(<LanguageMenu />)

    await user.click(screen.getByRole('button', { name: 'Change language' }))

    expect(screen.getByRole('menu')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  test('navigates menu items with ArrowDown', async () => {
    const user = userEvent.setup()

    render(<LanguageMenu />)

    await user.click(screen.getByRole('button', { name: 'Change language' }))

    const menuItems = screen.getAllByRole('menuitemradio')

    expect(menuItems[0]).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(menuItems[1]).toHaveFocus()
  })

  test('navigates menu items with ArrowUp', async () => {
    const user = userEvent.setup()

    render(<LanguageMenu />)

    await user.click(screen.getByRole('button', { name: 'Change language' }))

    const menuItems = screen.getAllByRole('menuitemradio')

    expect(menuItems[0]).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(menuItems[2]).toHaveFocus()
  })

  test('navigates menu items with Home key', async () => {
    const user = userEvent.setup()

    render(<LanguageMenu />)

    await user.click(screen.getByRole('button', { name: 'Change language' }))

    const menuItems = screen.getAllByRole('menuitemradio')

    expect(menuItems[0]).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(menuItems[1]).toHaveFocus()

    await user.keyboard('{Home}')
    expect(menuItems[0]).toHaveFocus()
  })

  test('navigates menu items with End key', async () => {
    const user = userEvent.setup()

    render(<LanguageMenu />)

    await user.click(screen.getByRole('button', { name: 'Change language' }))

    const menuItems = screen.getAllByRole('menuitemradio')

    expect(menuItems[0]).toHaveFocus()

    await user.keyboard('{End}')
    expect(menuItems[2]).toHaveFocus()
  })
})
