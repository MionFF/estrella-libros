import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from './Header'

describe('Header', () => {
  test('renders logo and children in both desktop and mobile nav', () => {
    render(
      <Header>
        <a href='/'>Home</a>
        <a href='/search'>Search</a>
      </Header>,
    )

    expect(screen.getByText('📚')).toBeInTheDocument()
    expect(screen.getByText('Estrella Libros')).toBeInTheDocument()

    const desktopNav = screen.getByTestId('desktop-nav')
    expect(within(desktopNav).getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(within(desktopNav).getByRole('link', { name: 'Search' })).toBeInTheDocument()

    const mobileNav = screen.getByTestId('mobile-nav')
    expect(within(mobileNav).getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(within(mobileNav).getByRole('link', { name: 'Search' })).toBeInTheDocument()
  })

  test('menu toggle button exists', () => {
    render(
      <Header>
        <a href='/'>Home</a>
      </Header>,
    )

    expect(screen.getByRole('button', { name: 'Toggle menu' })).toHaveAttribute(
      'aria-label',
      'Toggle menu',
    )
  })

  test('opens mobile menu on toggle button click', async () => {
    const user = userEvent.setup()

    render(
      <Header>
        <a href='/'>Home</a>
      </Header>,
    )

    const button = screen.getByRole('button', { name: 'Toggle menu' })
    const mobileNav = screen.getByTestId('mobile-nav').parentElement // .header__mobile-nav
    const overlay = screen.getByTestId('overlay')

    expect(mobileNav).not.toHaveClass('header__mobile-nav--open')
    expect(overlay).not.toHaveClass('header__overlay--visible')

    await user.click(button)

    expect(mobileNav).toHaveClass('header__mobile-nav--open')
    expect(overlay).toHaveClass('header__overlay--visible')
    expect(button).toHaveClass('header__menu-toggle--active')
  })

  test('closes mobile menu on toggle button click', async () => {
    const user = userEvent.setup()

    render(
      <Header>
        <a href='/'>Home</a>
      </Header>,
    )

    const button = screen.getByRole('button', { name: 'Toggle menu' })
    const mobileNav = screen.getByTestId('mobile-nav').parentElement
    const overlay = screen.getByTestId('overlay')

    await user.click(button)
    expect(mobileNav).toHaveClass('header__mobile-nav--open')

    await user.click(overlay)

    expect(mobileNav).not.toHaveClass('header__mobile-nav--open')
    expect(overlay).not.toHaveClass('header__overlay--visible')
  })

  test('renders mobileNavbarExtra when provided', () => {
    render(
      <Header mobileNavbarExtra={<button>Language</button>}>
        <a href='/'>Home</a>
      </Header>,
    )

    const mobileExtra = screen.getByTestId('mobile-nav-extra')
    expect(mobileExtra).toBeInTheDocument()
    expect(within(mobileExtra).getByRole('button', { name: 'Language' })).toBeInTheDocument()
  })

  test('does not render mobileNavbarExtra when not provided', () => {
    render(
      <Header>
        <a href='/'>Home</a>
      </Header>,
    )

    expect(screen.queryByTestId('mobile-nav-extra')).not.toBeInTheDocument()
  })

  test('closes mobile menu on mobile link click', async () => {
    const user = userEvent.setup()

    render(
      <Header>
        <a href='/'>Home</a>
      </Header>,
    )

    const button = screen.getByRole('button', { name: 'Toggle menu' })
    const mobileNav = screen.getByTestId('mobile-nav').parentElement

    await user.click(button)
    expect(mobileNav).toHaveClass('header__mobile-nav--open')

    const mobileLink = within(screen.getByTestId('mobile-nav')).getByRole('link', { name: 'Home' })
    await user.click(mobileLink)

    expect(mobileNav).not.toHaveClass('header__mobile-nav--open')
  })
})
