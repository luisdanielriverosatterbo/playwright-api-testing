import { test as setup } from '@playwright/test';

const authFile = '.auth/user.json'

setup('Authentication', async({page}) =>{
    await page.goto('https://conduit.bondaracademy.com/')
    await page.waitForTimeout(500)
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', {name: "Email"}).fill('istqbcertified@gmail.com')
    await page.getByRole('textbox', {name: "Password"}).fill('welcome1')
    await page.getByRole('button').click()
    //To make sure the application is loaded.
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')
    
    //To save the context
    await page.context().storageState({path: authFile})
})