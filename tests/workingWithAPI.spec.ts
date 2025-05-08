import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async ({page}) =>{

  //Creating a Mock
  //await page.route('https://conduit-api.bondaracademy.com/api/tags', async route =>{
  //After refactoring using wild card.
  await page.route('*/**/api/tags', async route =>{
    /*const tags = {
      "tags": [
        "Test",
        "Bondar Academy",
        "YouTube",
        "More..."        
      ]
    }*/
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

  //Important to remember the * caracter at the end of the end using wildcard.
  await page.route('*/**/api/articles*', async route =>{
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = "This is a test title"
    responseBody.articles[0].description = "This is a test description"
    
    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

  await page.goto('https://conduit.bondaracademy.com/')
  //The next instruction was necesary to make the Mock work properly
  await page.waitForTimeout(1000)
})

test('has title', async ({ page }) => {
 // Expect a title in the Home Web Page
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
  await expect(page.locator('app-article-list h1').first()).toContainText('This is a test title')
  await expect(page.locator('app-article-list p').first()).toContainText('This is a test description')
  await page.waitForTimeout(1000)
});
