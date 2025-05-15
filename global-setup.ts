import {request, expect} from '@playwright/test';
//import user from '../pw-apitest-app/.auth/user.json';
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
    //console.log(responseBody.user.token)
    const accessToken = responseBody.user.token
    
    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))
    
    process.env['GLOBAL_ACCESS_TOKEN'] = accessToken
    
    const articleGlobalResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
            data: {
            "article":{
                "title":"This is another GLOBAL LIKE TEST article title",
                "description":"This is another GLOBAL LIKE TEST article about",
                "body":"This is another GLOBAL LIKE TEST article description",
                "tagList":[]}
            },
            headers: {
              Authorization: `Token ${process.env.GLOBAL_ACCESS_TOKEN}`
            }
        })
    
    expect(articleGlobalResponse.status()).toEqual(201)
    
    const response = await articleGlobalResponse.json()
    const slugGlobalId = response.article.slug
    process.env['GLOBALSLUGID'] = slugGlobalId

}

export default globalSetup;