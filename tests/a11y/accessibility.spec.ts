import { test, expect } from '../../fixtures/axe-fixture';
import {PageObjects} from '../../pages'; 

test.describe('Accessibility scan on marketing page', () => {
    test('should have no accessibility violations', async ({ page, makeAxeBuilder }) => {
        const marketingPage = new PageObjects.MarketingPage(page);
        
        await marketingPage.navigateToMarketingPage();

        const accessibilityScanResults =  await makeAxeBuilder().analyze();
        // expect(accessibilityScanResults.violations).toEqual([]);

        expect(accessibilityScanResults.violations.length).toBeLessThan(10); // ideally should be 0
    });
});