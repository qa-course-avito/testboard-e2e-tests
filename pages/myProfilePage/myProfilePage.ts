import {BasePage} from "../basePage";
import {expect, Locator, Page} from "@playwright/test";

export class MyProfilePage extends BasePage {
    protected pageName = "Страница Профиль и настройки";

    readonly headerText: Locator;
    readonly birthdayText: Locator;
    readonly emailText: Locator;

    constructor(page: Page) {
        super(page);
        this.headerText = page.getByText("Дима Борщевский")
        this.birthdayText = page.getByText("20.01.2012");
        this.emailText = page.getByText("dorshik@yandex.ru");
    }

    protected root(): Locator {
        return this.headerText;
    }

    async assertParamsItem() {
        await expect(
            this.headerText,)
            .toBeVisible();

        await expect(
            this.birthdayText)
            .toBeVisible();

        await expect(
            this.emailText)
            .toBeVisible();
    }
}