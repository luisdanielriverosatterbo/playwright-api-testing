import {request, expect} from '@playwright/test'
import user from './.auth/user.json'
import fs from 'fs'

async function globalSetup(){

    const authFile = '.auth/user.json'
    const context = await request.newContext()
    
    const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login',{
        data: {
          "user":{"email":"istqbcertified@gmail.com","password":"welcome1"}
        }    
      })
    const responseBody = await responseToken.json()    
    const accessToken = responseBody.user.token    
    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))    
    process.env['ACCESS_TOKEN'] = accessToken
    
    const articleGlobalResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
            data: {
            "article":{
                "title":"This is another GLOBAL LIKE TEST article title",
                "description":"This is another GLOBAL LIKE TEST article about",
                "body":"This is another GLOBAL LIKE TEST article description",
                "tagList":[]}
            },
            headers: {
              Authorization: `Token ${process.env.ACCESS_TOKEN}`
            }
        })
    
    expect(articleGlobalResponse.status()).toEqual(201)
    
    const response = await articleGlobalResponse.json()
    const slugId = response.article.slug
    process.env['SLUGID'] = slugId

}

export default globalSetup;