import {test, expect} from '@playwright/test';

test('Like counter global increase', async({page}) =>{
    
    await page.goto('https://conduit.bondaracademy.com/')
    //await page.waitForTimeout(500)
    await page.getByText('Global Feed').click()
    const firstLikeButtonGlobal = page.locator('app-article-preview').first().locator('button')
    await expect(firstLikeButtonGlobal).toContainText('0')
    await firstLikeButtonGlobal.click()
    await expect(firstLikeButtonGlobal).toContainText('1')
    
})