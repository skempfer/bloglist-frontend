import { createElement } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

afterEach(() => {
  cleanup()
})

describe('BlogForm component', () => {
  test('calls the event handler with the right details when a new blog is created', () => {
    const createBlog = vi.fn().mockResolvedValue(undefined)

    render(createElement(BlogForm, { createBlog }))

    const inputs = screen.getAllByRole('textbox')
    fireEvent.change(inputs[0], { target: { value: 'New testing blog' } })
    fireEvent.change(inputs[1], { target: { value: 'Ada Lovelace' } })
    fireEvent.change(inputs[2], {
      target: { value: 'https://example.com/new-testing-blog' }
    })

    fireEvent.click(screen.getByRole('button', { name: 'create' }))

    expect(createBlog).toHaveBeenCalledTimes(1)
    expect(createBlog).toHaveBeenCalledWith({
      title: 'New testing blog',
      author: 'Ada Lovelace',
      url: 'https://example.com/new-testing-blog'
    })
  })
})
