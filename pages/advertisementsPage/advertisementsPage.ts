import {BasePage} from "../basePage";
import {Locator, Page} from "@playwright/test";


export class AdvertisementsPage extends BasePage {
    protected pageName = "Новое объявление";

    readonly titleInputItem: Locator
    readonly descriptionInputItem: Locator
    readonly addPhotoButtonItem: Locator
    readonly submitButton: Locator

    constructor(page: Page) {
        super(page);
        this.titleInputItem = page.locator("[data-marker=\"title-input\"]");
        this.descriptionInputItem = page.locator("[data-marker=\"description-input\"]");
        this.addPhotoButtonItem = page.locator("[data-marker=\"add-photo-button\"]");
        this.addPhotoButtonItem = page.locator("[data-marker=\"add-photo-button\"]");
        this.submitButton = page.locator("[data-marker=\"submit-button\"]");
    }

    protected root(): Locator {
        return this.titleInputItem;
    }


    async publicationAdWithRequiredParameters(title, description) {
        await this.titleInputItem.fill(title)
        await this.descriptionInputItem.fill(description)
        await this.addPhotoButtonItem.setInputFiles('fixtures/images/images.jpeg')
        await this.submitButton.click()
    }

}
