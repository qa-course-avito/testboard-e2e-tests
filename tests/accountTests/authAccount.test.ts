import {test} from "@playwright/test";
import {LoginPopupPage} from "../../pages/loginPopupPage/loginPopupPage";
import {MainPage} from "../../pages/mainPage/mainPage";
import {MyProfilePage} from "../../pages/myProfilePage/myProfilePage";

test.describe("Проверка авторизации", () => {
    test("Успешная авторизация", async ({page}) => {
        //arrange
        const loginPopup = new LoginPopupPage(page);
        const mainPage = new MainPage(page);
        const myProfilePage = new MyProfilePage(page);
        const email = process.env.E2E_USER_EMAIL!;
        const password = process.env.E2E_USER_PASSWORD!;

        //act
        await mainPage.openMainPage();
        await mainPage.openLoginDesktop();
        await loginPopup.login(email, password);

        // Assert - проверка успешного входа и доступа к разделу "Мои объявления"
        await mainPage.assertUserIsLoggedIn();
        await mainPage.assertMyAds()

        // Assert - проверка "выход" и "мои обьявления" в меню
        await mainPage.openUserMenu();
        await mainPage.assertLogoutButton();
        await mainPage.assertMyAdsDropdownLink();

        // Assert - проверка информации о пользователе в профиле
        await mainPage.openProfileLink();
        await myProfilePage.assertParamsItem()
    });
});
