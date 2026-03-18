import {Locator, Page, expect} from "@playwright/test";
import {BasePage} from "../basePage";

export class MyAdsPage extends BasePage {
    protected pageName = "Мои объявления";

    readonly myAdsTitle: Locator;
    readonly titleMyItem: Locator;
    readonly descriptionMyItem: Locator;
    readonly advertisementCard: Locator;
    readonly logoLink: Locator;

    constructor(page: Page) {
        super(page);
        this.myAdsTitle = page.locator("[data-marker=\"my-ads-title\"]");
        this.titleMyItem = page.locator("[data-marker=\"ad-title\"]");
        this.descriptionMyItem = page.locator("[data-marker=\"ad-description\"]");
        this.advertisementCard = page.locator("[data-marker=\"my-ad-card\"]")
        this.logoLink = page.locator("[data-marker=\"logo-link\"]")
    }

    protected root(): Locator {
        return this.myAdsTitle;
    }

    async assertItemMyAds(value) {
        await expect(
            this.advertisementCard.filter({
                hasText: value
            })).toBeVisible()
    }

    async clickAndAssertItem(value) {
        await this.advertisementCard.filter({
            hasText: value
        }).click()
        await expect(
            this.titleMyItem)
            .toBeVisible();
        await expect(
            this.descriptionMyItem,)
            .toBeVisible();
    }
}
