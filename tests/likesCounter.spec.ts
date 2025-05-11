import {test, expect} from '@playwright/test';

test('Like counter increase', async({page}) =>{
    
    await page.goto('https://conduit.bondaracademy.com/')     
    await page.waitForTimeout(1000)
    await page.getByText('Global Feed').click()
    const firstLikeButtonLocal = page.locator('app-article-preview').first().locator('button')
    await expect(firstLikeButtonLocal).toContainText('0')
    await firstLikeButtonLocal.click()
    await expect(firstLikeButtonLocal).toContainText('1')
    
})

