import { Locator, Page } from "@playwright/test";
import { BasePage } from "../basePage";
import path from "path";

/**
 * Страница создания объявления
 * Отвечает за заполнение формы и публикацию объявления
 */
export class CreateAdPage extends BasePage {
    protected pageName = "Страница создания объявления";

    readonly createAdButton: Locator;
    readonly titleInput: Locator;
    readonly descriptionInput: Locator;
    readonly priceInput: Locator;
    readonly photoInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        super(page);

        this.createAdButton = page.locator(
            "[data-marker=\"create-ad-button-desktop\"]"
        );
        this.titleInput = page.locator("[data-marker=\"title-input\"]");
        this.descriptionInput = page.locator(
            "[data-marker=\"description-input\"]"
        );
        this.priceInput = page.locator("[data-marker=\"price-input\"]");
        this.photoInput = page.locator("[data-marker=\"photo-input\"]");
        this.submitButton = page.locator("[data-marker=\"submit-button\"]");
    }

    protected root(): Locator {
        return this.page.locator("main");
    }

    /**
   * Открывает форму создания объявления
   * Нажимает кнопку "Разместить объявление"
   */
    async openCreateAdForm(): Promise<void> {
        await this.createAdButton.click();
        await this.page.waitForLoadState("networkidle");
    }

    /**
   * Заполняет форму создания объявления
   * @param adData - объект с данными объявления
   */
    async fillAdForm(adData: {
    title: string;
    description: string;
    price: string;
  }): Promise<void> {
        await this.expectVisible(this.titleInput);
        await this.fill(this.titleInput, adData.title);
        await this.fill(this.descriptionInput, adData.description);
        await this.fill(this.priceInput, adData.price);
    }

    /**
   * Загружаем фото для объявления
   * @param imagePath - путь к файлу изображения
   */
    async uploadPhoto(
        imagePath: string = path.join(
            __dirname,
            "..",
            "..",
            "fixtures",
            "testimage.jpg.jpg"
        )
    ): Promise<void> {
        await this.photoInput.setInputFiles(imagePath);
    
    }

    /**
   * Нажатие на кнопку "Опубликовать"
   */
    async publishAd(): Promise<void> {
        await this.click(this.submitButton);
    
    }
}
