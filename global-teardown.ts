import {request, expect} from '@playwright/test';

async function globalTeardown(){

    const context = await request.newContext()

    const deleteGlobalArticleRequest = await context.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.GLOBALSLUGID}`,{
        headers: {
              Authorization: `Token ${process.env.GLOBAL_ACCESS_TOKEN}`
        }
    })
    //console.log(process.env.GLOBALSLUGID)
    expect(deleteGlobalArticleRequest.status()).toEqual(204)
}

export default globalTeardown;