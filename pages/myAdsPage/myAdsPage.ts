import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../basePage";
import { CreateAdPage } from "../createAdPage/createAdPage";

/**
 * Страница "Мои объявления" (профиль пользователя)
 * Управление личными объявлениями: создание, удаление, поиск
 */
export class MyAdsPage extends BasePage {
    protected pageName = "Мои объявления";

    readonly adCardLocator: string = "[data-marker=\"my-ad-card\"]";
    private createAdPage: CreateAdPage;

    constructor(page: Page) {
        super(page);
        this.createAdPage = new CreateAdPage(page);
    }

    protected root(): Locator {
        return this.page.locator("main");
    }

    /**
   * Создаёт и публикует новое объявление
   * @param adData - объект с данными (title, description, price)
   */
    async createAndPublishAd(adData: {
    title: string;
    description: string;
    price: string;
  }): Promise<string> {
        await this.createAdPage.openCreateAdForm();
        await this.createAdPage.fillAdForm(adData);
        await this.createAdPage.uploadPhoto();
        await this.createAdPage.publishAd();

        // Получаем ID объявления
        const adId = await this.getNewestAdId();
        return adId;
    }

    /**
   * Получает ID самого нового объявления в профиле
   * @returns ID объявления
   * @private
   */
    private async getNewestAdId(): Promise<string> {
        const newestCard = this.page.locator(this.adCardLocator).first();
        const hrefAttr = await newestCard
            .locator("a[href*=\"/advertisements/\"]")
            .getAttribute("href");

        const adId = hrefAttr?.split("/").pop() || "";
        if (!adId) {
            throw new Error("Не удалось получить ID объявления");
        }

        return adId;
    }

    /**
   * Проверяет наличие объявления в профиле
   * @param adId - ID объявления
   * @example
   * await myAdsPage.assertAdExists("123456");
   */
    async assertAdExists(adId: string): Promise<void> {
        const adCard = this.getAdCardByIdLocator(adId);
        await expect(adCard).toBeVisible();
    }

    /**
   * Проверяет отсутствие объявления в профиле
   * @param adId - ID объявления
   * @example
   * await myAdsPage.assertAdNotExists("123456");
   */
    async assertAdNotExists(adId: string): Promise<void> {
        const adCard = this.getAdCardByIdLocator(adId);
        await expect(adCard).toHaveCount(0);
    }

    /**
   * Удаляет объявление по ID
   * @param adId - ID объявления
   * @example
   * await myAdsPage.deleteAdById("123456");
   */
    async deleteAdById(adId: string): Promise<void> {
        const adCard = this.getAdCardByIdLocator(adId);

        // Открываем меню действий
        const menuButton = adCard.locator(
            "button[data-marker*=\"ad-menu\"]"
        );
        await menuButton.click();

        // Нажимаем кнопку удаления
        const deleteButton = adCard.locator(
            "[data-marker=\"ad-delete-button\"]"
        );
        await deleteButton.click();

        // Подтверждаем удаление
        await this.confirmDelete();
    }

    /**
   * Подтверждает удаление в модальном окне
   * @private
   */
    private async confirmDelete(): Promise<void> {
        const confirmBtn = this.page.locator(
            "[data-marker=\"delete-modal-confirm\"]"
        );

        try {
            if (await confirmBtn.isVisible({ timeout: 2000 })) {
                await confirmBtn.click();
                await this.page.waitForLoadState("networkidle");
            }
        } catch {
            console.warn(
                "Модальное окно подтверждения не найдено или уже закрыто"
            );
        }
    }

    /**
   * Получает локатор карточки объявления по ID
   * @param adId - ID объявления
   * @returns Locator карточки объявления
   * @private
   */
    private getAdCardByIdLocator(adId: string): Locator {
        return this.page.locator(
            `${this.adCardLocator}:has(a[href*="${adId}"])`
        );
    }
}
