import { createElement } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'
import Blog from './Blog'

afterEach(() => {
  cleanup()
})

describe('Blog component', () => {
  test('renders title and author by default, but not URL or likes', () => {
    const blog = {
      title: 'Testing React apps',
      author: 'Ada Lovelace',
      url: 'https://example.com/testing-react',
      likes: 42,
      user: {
        id: 'user-1',
        username: 'ada'
      }
    }

    render(
      createElement(Blog, {
        blog,
        handleLike: () => {},
        handleDelete: () => {},
        currentUser: { id: 'user-1', username: 'ada' }
      })
    )

    expect(screen.getByText('Testing React apps')).toBeInTheDocument()
    expect(screen.getByText('by Ada Lovelace')).toBeInTheDocument()

    expect(screen.queryByText('https://example.com/testing-react')).not.toBeInTheDocument()
    expect(screen.queryByText('likes 42')).not.toBeInTheDocument()
  })

  test('shows URL and likes when view button is clicked', () => {
    const blog = {
      title: 'Testing React apps',
      author: 'Ada Lovelace',
      url: 'https://example.com/testing-react',
      likes: 42,
      user: {
        id: 'user-1',
        username: 'ada'
      }
    }

    render(
      createElement(Blog, {
        blog,
        handleLike: () => {},
        handleDelete: () => {},
        currentUser: { id: 'user-1', username: 'ada' }
      })
    )

    fireEvent.click(screen.getByRole('button', { name: 'view' }))

    expect(screen.getByText('https://example.com/testing-react')).toBeInTheDocument()
    expect(screen.getByText('likes 42')).toBeInTheDocument()
  })
})
