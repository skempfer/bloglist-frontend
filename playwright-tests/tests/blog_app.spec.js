const { test, expect, beforeEach, describe } = require('@playwright/test')

const backendUrl = 'http://localhost:3003'

const loginWith = async (page, username, password) => {
  await page.locator('input').first().fill(username)
  await page.locator('input[type="password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlogWith = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: 'create new' }).click()

  const inputs = page.getByRole('textbox')
  await inputs.nth(0).fill(title)
  await inputs.nth(1).fill(author)
  await inputs.nth(2).fill(url)

  await page.getByRole('button', { name: 'create' }).click()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post(`${backendUrl}/api/testing/reset`)
    await request.post(`${backendUrl}/api/users`, {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Bloglist' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'log in' })).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong-password')

      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(
        page.getByText('Matti Luukkainen logged in')
      ).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlogWith(page, {
        title: 'Playwright Blog Creation',
        author: 'Matti Luukkainen',
        url: 'https://example.com/playwright-blog'
      })

      await expect(
        page.getByText('a new blog Playwright Blog Creation added')
      ).toBeVisible()
      await expect(
        page.getByRole('heading', { name: 'Playwright Blog Creation' }).first()
      ).toBeVisible()
      await expect(page.getByText('by Matti Luukkainen').first()).toBeVisible()
    })

    test('a blog can be liked', async ({ page, request }) => {
      const loginResponse = await request.post(`${backendUrl}/api/login`, {
        data: {
          username: 'mluukkai',
          password: 'salainen'
        }
      })
      const { token } = await loginResponse.json()

      await request.post(`${backendUrl}/api/blogs`, {
        data: {
          title: 'Playwright Blog Like',
          author: 'Matti Luukkainen',
          url: 'https://example.com/playwright-like',
          likes: 0
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      await page.reload()

      const blogItem = page
        .locator('.blog-item', {
          has: page.getByRole('heading', { name: 'Playwright Blog Like' })
        })
        .first()

      await blogItem.getByRole('button', { name: 'view' }).click()
      const likesLabel = blogItem.locator('.blog-likes-row span')
      await expect(likesLabel).toBeVisible()
      const likesBefore = await likesLabel.textContent()

      await blogItem.getByRole('button', { name: 'like' }).click()

      await expect
        .poll(async () => likesLabel.textContent())
        .not.toBe(likesBefore)
    })

    test('the user who added a blog can delete it', async ({ page }) => {
      await createBlogWith(page, {
        title: 'Playwright Blog Delete',
        author: 'Matti Luukkainen',
        url: 'https://example.com/playwright-delete'
      })

      const blogItem = page
        .locator('.blog-item', {
          has: page.getByRole('heading', { name: 'Playwright Blog Delete' })
        })
        .first()

      await blogItem.getByRole('button', { name: 'view' }).click()
      await expect(
        blogItem.getByRole('button', { name: 'delete' })
      ).toBeVisible()

      page.once('dialog', async (dialog) => {
        await dialog.accept()
      })

      await blogItem.getByRole('button', { name: 'delete' }).click()

      await expect(
        page.getByRole('heading', { name: 'Playwright Blog Delete' })
      ).toHaveCount(0)
    })

    test('only the user who added the blog sees the delete button', async ({
      page,
      request
    }) => {
      await request.post(`${backendUrl}/api/users`, {
        data: {
          name: 'Other User',
          username: 'otheruser',
          password: 'salainen2'
        }
      })

      await createBlogWith(page, {
        title: 'Playwright Blog Ownership',
        author: 'Matti Luukkainen',
        url: 'https://example.com/playwright-ownership'
      })

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'otheruser', 'salainen2')

      const blogItem = page
        .locator('.blog-item', {
          has: page.getByRole('heading', { name: 'Playwright Blog Ownership' })
        })
        .first()

      await blogItem.getByRole('button', { name: 'view' }).click()

      await expect(
        blogItem.getByRole('button', { name: 'delete' })
      ).toHaveCount(0)
    })

    test('blogs are ordered by likes with most likes first', async ({
      page,
      request
    }) => {
      const loginResponse = await request.post(`${backendUrl}/api/login`, {
        data: {
          username: 'mluukkai',
          password: 'salainen'
        }
      })
      const { token } = await loginResponse.json()

      await request.post(`${backendUrl}/api/blogs`, {
        data: {
          title: 'Least liked blog',
          author: 'Matti Luukkainen',
          url: 'https://example.com/least-liked',
          likes: 1
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      await request.post(`${backendUrl}/api/blogs`, {
        data: {
          title: 'Most liked blog',
          author: 'Matti Luukkainen',
          url: 'https://example.com/most-liked',
          likes: 12
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      await request.post(`${backendUrl}/api/blogs`, {
        data: {
          title: 'Medium liked blog',
          author: 'Matti Luukkainen',
          url: 'https://example.com/medium-liked',
          likes: 5
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      await page.reload()

      await expect(
        page.getByRole('heading', { name: 'Most liked blog' }).first()
      ).toBeVisible()
      await expect(
        page.getByRole('heading', { name: 'Medium liked blog' }).first()
      ).toBeVisible()
      await expect(
        page.getByRole('heading', { name: 'Least liked blog' }).first()
      ).toBeVisible()

      const titles = await page
        .locator('.blog-item .blog-title')
        .allTextContents()
      const mostLikedIndex = titles.indexOf('Most liked blog')
      const mediumLikedIndex = titles.indexOf('Medium liked blog')
      const leastLikedIndex = titles.indexOf('Least liked blog')

      expect(mostLikedIndex).toBeGreaterThan(-1)
      expect(mediumLikedIndex).toBeGreaterThan(-1)
      expect(leastLikedIndex).toBeGreaterThan(-1)

      expect(mostLikedIndex).toBeLessThan(mediumLikedIndex)
      expect(mediumLikedIndex).toBeLessThan(leastLikedIndex)
    })
  })
})
