import {LoginPopupPage} from "../../pages/loginPopupPage/loginPopupPage";
import {MainPage} from "../../pages/mainPage/mainPage";
import { test } from "../../fixtures/auth.fixture";
import {AdvertisementsPage} from "../../pages/advertisementsPage/advertisementsPage";
import {MyAdsPage} from "../../pages/myAdsPage/myAdsPage";

test.describe("Создание объявления", () => {
    test("Успешное создание объявления и отображение в поиске", async ({ authedPage }) => {
        //arrange
        const advertisementsPage = new AdvertisementsPage(authedPage);
        const mainPage = new MainPage(authedPage);
        const myAdsPage = new MyAdsPage(authedPage);
        const title = `TestTitle-${Date.now()}`
        const description = `TestDescription-${Date.now()}`

        //act
        await mainPage.openMainPage();
        await mainPage.createItemClick()
        await advertisementsPage.publicationAdWithRequiredParameters(title, description)

        // Assert - проверка в "Мои объявлениях"
        await myAdsPage.assertItemMyAds(title);
        await myAdsPage.clickAndAssertItem(title);

        // Assert - проверка в "Поиске"
        await mainPage.openMainPage();
        await mainPage.fillSearchInput(title);
        await mainPage.assertItemAds(title);
    });
})