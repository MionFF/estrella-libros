import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
import ScrollTopButton from './ScrollTopButton'
import { act } from 'react'
import userEvent from '@testing-library/user-event'

describe('ScrollTopButton', () => {
  test("doesn't render scroll top button initially", () => {
    render(<ScrollTopButton threshold={300} />)

    const button = screen.queryByRole('button', { name: 'Scroll to top' })

    expect(button).not.toHaveClass('scroll-top--visible')
  })

  test('shows button when scrolled past threshold', () => {
    render(<ScrollTopButton threshold={300} />)

    const button = screen.queryByRole('button', { name: 'Scroll to top' })

    expect(button).not.toHaveClass('scroll-top--visible')

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
    fireEvent.scroll(window)

    expect(button).toHaveClass('scroll-top--visible')
  })

  test('hides button when scrolled above threshold', () => {
    render(<ScrollTopButton threshold={300} />)

    const button = screen.queryByRole('button', { name: 'Scroll to top' })

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
    fireEvent.scroll(window)
    expect(button).toHaveClass('scroll-top--visible')

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
    fireEvent.scroll(window)
    expect(button).not.toHaveClass('scroll-top--visible')
  })

  test('auto-hides after delay when scroll stops', async () => {
    jest.useFakeTimers()

    render(<ScrollTopButton threshold={300} autoHideDelay={2000} />)

    const button = screen.queryByRole('button', { name: 'Scroll to top' })

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
    fireEvent.scroll(window)

    expect(button).toHaveClass('scroll-top--visible')
    expect(button).not.toHaveClass('scroll-top--auto-hidden')

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(button).toHaveClass('scroll-top--auto-hidden')

    jest.useRealTimers()
  })

  test('resets auto-hide timer on new scroll', () => {
    jest.useFakeTimers()

    render(<ScrollTopButton threshold={300} autoHideDelay={2000} />)

    const button = screen.getByRole('button', { name: 'Scroll to top' })

    // Первый скролл
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
    fireEvent.scroll(window)

    // Проходит 1.5 секунды (не хватает до автоскрытия)
    act(() => {
      jest.advanceTimersByTime(1500)
    })
    expect(button).not.toHaveClass('scroll-top--auto-hidden')

    // Второй скролл (сбрасывает таймер)
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true })
    fireEvent.scroll(window)

    // Ещё 1.5 секунды (суммарно 3 секунды с первого скролла, но таймер сброшен)
    act(() => {
      jest.advanceTimersByTime(1500)
    })
    expect(button).not.toHaveClass('scroll-top--auto-hidden')

    // Ещё 0.5 секунды (теперь 2 секунды с последнего скролла)
    act(() => {
      jest.advanceTimersByTime(500)
    })
    expect(button).toHaveClass('scroll-top--auto-hidden')

    jest.useRealTimers()
  })

  test('scrolls to top on button click', async () => {
    const scrollToMock = jest.fn()
    window.scrollTo = scrollToMock

    const user = userEvent.setup()

    render(<ScrollTopButton threshold={300} autoHideDelay={2000} />)

    Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
    fireEvent.scroll(window)

    const button = screen.getByRole('button', { name: 'Scroll to top' })

    await user.click(button)

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
