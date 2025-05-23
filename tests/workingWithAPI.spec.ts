import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'

test.describe.configure({mode: 'serial'})

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
  //await page.route('*/**/api/articles*', async route =>{
  //  const response = await route.fetch()
  //  const responseBody = await response.json()
  //  responseBody.articles[0].title = "This is a test title"
  //  responseBody.articles[0].description = "This is a test description"
  //  
  //  await route.fulfill({
  //    body: JSON.stringify(responseBody)
  //  })
  //})

  await page.goto('https://conduit.bondaracademy.com/')
  //await page.waitForTimeout(1000)
  //await page.getByText('Sign in').click()
  //await page.getByRole('textbox', {name: "Email"}).fill('istqbcertified@gmail.com')
  //await page.getByRole('textbox', {name: "Password"}).fill('welcome1')
  //await page.getByRole('button').click()

})

test('Trying First Steps', async ({ page }) => {

  await page.route('*/**/api/articles*', async route =>{
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = "This is a test title"
    responseBody.articles[0].description = "This is a test description"
        
    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })

   // Expect a title in the Home Web Page
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
  await expect(page.locator('app-article-list h1').first()).toContainText('This is a test title')
  await expect(page.locator('app-article-list p').first()).toContainText('This is a test description')
  await page.waitForTimeout(1000)
});

test('Performe API Request', async ({ page }) => {
  //Important to remember the * caracter at the end of the end using wildcard.
  await page.route('*/**/api/articles*', async route =>{
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = "This is a MOCK test title"
    responseBody.articles[0].description = "This is a MOCK test description"
    
    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  }) 

  await page.getByText('Global Feed').click()
  // Expect a title in the Home Web Page
   await expect(page.locator('.navbar-brand')).toHaveText('conduit')
   await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title')
   await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK test description')
   await page.waitForTimeout(1000)

 })

 test('Creating An Article With API And Deleting An Article With UI', async({page, request}) =>{
  
  /* const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login',{
    data: {
      "user":{"email":"istqbcertified@gmail.com","password":"welcome1"}
    }    
  })
  const responseBody = await response.json()    
  //console.log(responseBody.user.token)
  const accessToken = responseBody.user.token */

  const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":"This is another article title","description":"This is another article about","body":"This is another article description","tagList":[]}
    },
    /* headers: {
      'authorization': `Token ${accessToken}`
    } */
  })

  expect(articleResponse.status()).toEqual(201)

  await page.waitForTimeout(1000)
  await page.locator('.nav-link').getByText('Home').click()
  await page.getByText('Global Feed').click()
  await page.waitForTimeout(1000)
  await page.getByText('This is another article title').click()
  //await page.locator('app-article-list h1').getByText('This is another article title3').click()
  await page.waitForTimeout(1000)
  await page.getByRole('button',{name: "Delete Article"}).first().click()
  //await page.locator('[class="btn btn-sm btn-outline-danger"]').getByText('Delete Article').first().click()
  
  await page.getByText('Global Feed').click()
  
  await expect(page.locator('app-article-list h1').first()).not.toContainText('This is another article title')

  await page.getByText('Settings').click()
  await page.getByText('Or click here to logout.').click()

 })

 test('Creating An Article With UI And Deleting With API End Point', async({page, request}) =>{

    await page.getByText('New Article').click()
    await page.getByPlaceholder('Article Title').fill('Playwright is awesome for testers')
    await page.getByPlaceholder("What's this article about?").fill('How to master Playwright With AI')
    await page.getByPlaceholder("Write your article (in markdown)").fill('You must follow the steps and repeat them eveyday...')
    await page.getByRole('button', {name: "Publish Article"}).click()

    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleResponseBody = await articleResponse.json()
    const slugId  = articleResponseBody.article.slug
    //console.log(slugId)

    await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome for testers')

    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()
    await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome for testers')

   /*  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login',{
      data: {
        "user":{"email":"istqbcertified@gmail.com","password":"welcome1"}
      }    
    })
    const responseBody = await response.json()    
    //console.log(responseBody.user.token)
    const accessToken = responseBody.user.token */

    const deleteArticleRequest= await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)

    expect(deleteArticleRequest.status()).toEqual(204)

    //Just to logout.
    await page.getByText('Settings').click()
    await page.getByText('Or click here to logout.').click()

 })