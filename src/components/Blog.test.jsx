import { createElement } from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

afterEach(() => {
  cleanup()
})

describe('Blog component', () => {
  test('renders title link and author, but not URL or likes', () => {
    const blog = {
      id: 'blog-1',
      title: 'Testing React apps',
      author: 'Ada Lovelace',
      url: 'https://example.com/testing-react',
      likes: 42,
      user: {
        id: 'user-1',
        username: 'ada'
      }
    }

    render(createElement(MemoryRouter, null, createElement(Blog, { blog })))

    expect(
      screen.getByRole('link', { name: 'Testing React apps' })
    ).toBeInTheDocument()
    expect(screen.getByText('by Ada Lovelace')).toBeInTheDocument()

    expect(
      screen.queryByText('https://example.com/testing-react')
    ).not.toBeInTheDocument()
    expect(screen.queryByText('likes 42')).not.toBeInTheDocument()
  })

  test('title links to the blog details route', () => {
    const blog = {
      id: 'blog-1',
      title: 'Testing React apps',
      author: 'Ada Lovelace',
      url: 'https://example.com/testing-react',
      likes: 42,
      user: {
        id: 'user-1',
        username: 'ada'
      }
    }

    render(createElement(MemoryRouter, null, createElement(Blog, { blog })))

    const titleLink = screen.getByRole('link', { name: 'Testing React apps' })
    expect(titleLink).toHaveAttribute('href', '/blogs/blog-1')
  })

  test('does not render view toggle button anymore', () => {
    const blog = {
      id: 'blog-1',
      title: 'Testing React apps',
      author: 'Ada Lovelace',
      url: 'https://example.com/testing-react',
      likes: 42,
      user: {
        id: 'user-1',
        username: 'ada'
      }
    }

    render(createElement(MemoryRouter, null, createElement(Blog, { blog })))

    expect(screen.queryByRole('button', { name: 'view' })).not.toBeInTheDocument()
  })
})
