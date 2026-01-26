import { test, expect } from "@playwright/test";
import {LoginPopupPage} from "../../pages/loginPopupPage/loginPopupPage";
import {MainPage} from "../../pages/mainPage/mainPage";

test.describe("Проверки попапа с авторизацией", () => {
    let mainPage: MainPage;
    let loginPopupPage: LoginPopupPage;
    
    test.beforeEach(async ({ page }) => {
        //arrange
        // Инициализация
        mainPage = new MainPage(page);
        loginPopupPage = new LoginPopupPage(page);
    });

    test("Успешная авторизация", async () => {
        //arrange
        const email = process.env.E2E_USER_EMAIL!;
        const password = process.env.E2E_USER_PASSWORD!;

        //act
        await mainPage.openMainPageWithLoginPopup();
        await loginPopupPage.fillLogin(email);
        await loginPopupPage.fillPassword(password);
        await loginPopupPage.clickLoginBtn();

        //assert
        await mainPage.assertUserIsLoggedIn();
    });

    test("Переход на регистрацию по кнопке", async ({ page }) => {
        //act
        await mainPage.openMainPageWithLoginPopup();
        await loginPopupPage.clickRegisterBtn();

        //assert
        await expect(page).toHaveURL("/auth/register");
    });

    test("Логин с пустыми полями не должен увести на главную", async () => {
        //act
        await mainPage.openMainPageWithLoginPopup();
        await loginPopupPage.clickLoginBtn();

        //assert
        await loginPopupPage.assertEmailErrorIsVisible();
        await loginPopupPage.assertPasswordErrorIsVisible();
    });
});
