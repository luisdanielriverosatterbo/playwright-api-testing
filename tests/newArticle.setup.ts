import { test as setup, expect } from '@playwright/test';


setup('Create new article', async({request}) =>{
    
    const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
        "article":{
            "title":"This is another LIKE TEST article title",
            "description":"This is another LIKE TEST article about",
            "body":"This is another LIKE TEST article description",
            "tagList":[]}
        },
        /* headers: {
        'authorization': `Token ${accessToken}`
        } */
    })

    expect(articleResponse.status()).toEqual(201)

    const response = await articleResponse.json()
    const slugId = response.article.slug
    process.env['SLUGID'] = slugId

})