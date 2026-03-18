import {test} from "@playwright/test";
import {MainPage} from "../../pages/mainPage/mainPage";


test.describe("Поле поиска", () => {
    test("Отображение заглушки при пустой выдаче в поиске", async ({page}) => {
        //arrange
        const mainPage = new MainPage(page);

        //act
        await mainPage.openMainPage();
        await mainPage.fillSearchInput(`Test-${Date.now()}`)

        //assert
        await mainPage.assertEmptyResultStubIsVisible();
    })
})