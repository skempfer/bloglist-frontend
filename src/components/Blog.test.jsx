import { createElement } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import Blog from './Blog'

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
})
