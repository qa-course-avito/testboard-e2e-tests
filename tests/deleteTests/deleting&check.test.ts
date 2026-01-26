import { test} from "@playwright/test";
import { LoginPopupPage } from "../../pages/loginPopupPage/loginPopupPage";
import { MainPage } from "../../pages/mainPage/mainPage";
import { MyAdsPage } from "../../pages/myAdsPage/myAdsPage";


test.describe("Удаление объявления", () => {
    let mainPage: MainPage;
    let loginPopupPage: LoginPopupPage;
    let myAdsPage: MyAdsPage;
    let email: string;
    let password: string;
    let adId: string;
    let adData: { title: string; description: string; price: string };

    test.beforeEach(async ({ page }) => {
        // Инициализация
        mainPage = new MainPage(page);
        loginPopupPage = new LoginPopupPage(page);
        myAdsPage = new MyAdsPage(page);
        
        email = process.env.E2E_USER_EMAIL!;
        password = process.env.E2E_USER_PASSWORD!;

        // Тестовые данные
        adData = {
            title: "E2E test - удаление пэпэ шнейна",
            description: "Тестовое объявление для пэпэ удаления",
            price: "9999",
        };

        // Авторизация
        await mainPage.openMainPageWithLoginPopup();
        await loginPopupPage.waitForOpen();
        await loginPopupPage.login(email, password);
        await mainPage.assertUserIsLoggedIn();

        // Создание объявления
        adId = await myAdsPage.createAndPublishAd(adData);
        console.log(`Создано объявление с ID: ${adId}`);
    });

    test("Удаление объявления — отсутствует на главной и в профиле", async () => {
        //arrange
        // Проверка наличия объявления в профиле
        await myAdsPage.assertAdExists(adId);

        //act
        // Удаление объявления
        await myAdsPage.deleteAdById(adId);
        console.log(`Объявление ${adId} удалено`);

        //assert
        // Проверка отсутствия в профиле
        await myAdsPage.assertAdNotExists(adId);

        // Проверка отсутствия на главной странице
        await mainPage.openMainPage();
        await mainPage.assertAdNotVisible(adId);
    });
});
