import { test as setup } from '@playwright/test';
import user from '../.auth/user.json';
import fs from 'fs'

const authFile = '.auth/user.json'

setup('Authentication', async({request}) =>{
    /* await page.goto('https://conduit.bondaracademy.com/')
    await page.waitForTimeout(500)
    await page.getByText('Sign in').click()
    await page.getByRole('textbox', {name: "Email"}).fill('istqbcertified@gmail.com')
    await page.getByRole('textbox', {name: "Password"}).fill('welcome1')
    await page.getByRole('button').click()
    //To make sure the application is loaded.
    await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')
    
    //To save the context
    await page.context().storageState({path: authFile}) */

    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login',{
        data: {
          "user":{"email":"istqbcertified@gmail.com","password":"welcome1"}
        }    
      })
    const responseBody = await response.json()    
    //console.log(responseBody.user.token)
    const accessToken = responseBody.user.token
    
    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))
    
    process.env['ACCESS_TOKEN'] = accessToken
    

})