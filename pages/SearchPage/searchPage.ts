import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from "../basePage";


export class SearchPage extends BasePage {

    protected pageName = "Страница поиска и результатов";

    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly emptyState: Locator;
    readonly adCards: Locator;
    readonly adCardTitles: Locator;
    readonly adCardPrices: Locator;
    readonly sortSelect: Locator;
    readonly sortOptionCheaper: Locator;
    readonly sortOptionExpensive: Locator;
    readonly resultsSection: Locator;

    constructor(page: Page) {
        super(page);

        // Элементы поиска
        this.searchInput = page.locator(
            "input[placeholder*='поиск'], input[data-marker*='input'], [data-marker='search-bar'] input"
        );

        this.searchButton = page.locator(
            "button[data-marker*='search'], button[type='submit']"
        );

        // Секция результатов
        this.resultsSection = page.locator("section");

        // Заглушка "Ничего не найдено"
        this.emptyState = page.locator(
            "h3.text-xl.font-semibold.text-gray-900:has-text('Ничего не найдено')"
        );

        // Карточки объявлений
        this.adCards = page.locator("a[data-marker='advertisement-card']");

        // Заголовки карточек
        this.adCardTitles = page.locator("h3[data-marker='ad-card-title']");

        // Цены карточек
        this.adCardPrices = page.locator("span[data-marker='ad-card-price']");

        // Элементы сортировки
        this.sortSelect = page.locator("[data-marker='sort-dropdown']");

        this.sortOptionCheaper = page.locator(
            "[data-marker='sort-option-cheapest']"
        );

        this.sortOptionExpensive = page.locator(
            "[data-marker='sort-option-most-expensive']"
        );
    }

    protected root(): Locator {
        return this.resultsSection;
    }

    /**
     * Открывает главную страницу и инициализирует поиск
     */
    async openSearchPage(): Promise<void> {
        await this.page.goto("/");
        await this.waitForOpen();
    }

    /**
     * Выполняет поиск по запросу
     * @param query Поисковый запрос
     */
    async search(query: string): Promise<void> {
        await this.expectVisible(this.searchInput);
        await this.fill(this.searchInput, query);

        // Нажимаем кнопку поиска, если есть, иначе используем Enter
        if (await this.searchButton.isVisible()) {
            await this.click(this.searchButton);
        } else {
            await this.searchInput.press("Enter");
        }

        await this.page.waitForLoadState("networkidle");
        // Задержка для загрузки результатов
        await this.page.waitForTimeout(1000);
    }

    /**
     * Проверяет отображение заглушки "Ничего не найдено"
     */
    async expectEmptyResults(): Promise<void> {
        // Ожидание
        await this.emptyState.waitFor({ state: "visible", timeout: 5000 });

        // Проверяем текст
        const text = await this.emptyState.textContent();
        expect(text?.toLowerCase()).toContain("ничего не найдено");

        // Проверяем что объявлений нет
        expect(await this.adCards.count()).toBe(0);
    }

    /**
     * Проверяет что есть результаты поиска
     */
    async expectHasResults(): Promise<void> {
        // Ожидание
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(2000);
    
        // Проверяем наличие карточек
        const count = await this.adCards.count();
        console.log(`Found ${count} cards`);
    
        expect(count).toBeGreaterThan(0);
    }

    /**
     * Проверяет, что все результаты содержат нужный текст
     * @param text Текст для проверки
     */
    async expectAllResultsContainText(text: string): Promise<void> {
        const count = await this.adCards.count();
        for (let i = 0; i < count; i++) {
            const card = this.adCards.nth(i);
            const cardText = await card.textContent();
            expect(cardText?.toLowerCase()).toContain(text.toLowerCase());
        }
    }

    /**
     * Применяет сортировку "дешевле" - нажатие на dropdown
     */
    async sortByPriceAsc(): Promise<void> {
        // Кликаем на dropdown
        await this.sortSelect.click();
        // Кликаем на опцию "дешевле"
        await this.sortOptionCheaper.click();
        // Ожидание
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(500);
    }

    /**
     * Применяет сортировку "дороже" - нажатие на dropdown
     */
    async sortByPriceDesc(): Promise<void> {
        // Кликаем на dropdown
        await this.sortSelect.click();
        // Кликаем на опцию "дороже"
        await this.sortOptionExpensive.click();
        // Ожидание
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForTimeout(500);
    }

    /**
     * Проверяет, что цены отсортированы по возрастанию
     */
    async expectPricesSortedAsc(): Promise<void> {
        const prices: number[] = [];
        const count = await this.adCardPrices.count();
        for (let i = 0; i < count; i++) {
            const priceText = await this.adCardPrices.nth(i).textContent();
            const price = parseInt(priceText?.replace(/\D/g, "") || "0");
            prices.push(price);
        }

        for (let i = 1; i < prices.length; i++) {
            expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
        }
    }

    /**
     * Проверяет, что цены отсортированы по убыванию
     */
    async expectPricesSortedDesc(): Promise<void> {
        const prices: number[] = [];
        const count = await this.adCardPrices.count();
        for (let i = 0; i < count; i++) {
            const priceText = await this.adCardPrices.nth(i).textContent();
            const price = parseInt(priceText?.replace(/\D/g, "") || "0");
            prices.push(price);
        }

        for (let i = 1; i < prices.length; i++) {
            expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
        }
    }

    /**
     * Возвращает количество найденных объявлений
     */
    async getResultsCount(): Promise<number> {
        return await this.adCards.count();
    }

    /**
     * Возвращает текст заглушки "Ничего не найдено"
     */
    async getEmptyStateText(): Promise<string> {
        return await this.emptyState.textContent() || "";
    }

    /**
     * Получает ID первого объявления в результатах поиска
     */
    async getFirstAdId(): Promise<string> {
        const firstAd = this.adCards.first();

        const dataAdId = await firstAd.getAttribute("data-ad-id");
        if (dataAdId) return dataAdId;

        const idAttr = await firstAd.getAttribute("id");
        if (idAttr) return idAttr;

        const hrefAttr = await firstAd.getAttribute("href");
        if (hrefAttr) {
            // Извлекаем ID из URL
            const match = hrefAttr.match(/\/item\/(\d+)/);
            if (match) return match[1];
        }
        return "";
    }
}

