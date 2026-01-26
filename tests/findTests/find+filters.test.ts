import { test, expect } from "@playwright/test";
import { SearchPage } from "../../pages/SearchPage/searchPage";

test.describe("Поиск и фильтры", () => {
    test("Поиск iphone и сортировка 'дешевле' — корректные результаты", async ({ page }) => {
        //arrange
        const searchPage = new SearchPage(page);
        const searchQuery = "iphone";
        
        // Открываем страницу поиска
        await searchPage.openSearchPage();

        //act
        // Ищем
        await searchPage.search(searchQuery);
        // Сортируем по цене (дешевле)
        await searchPage.sortByPriceAsc();

        //assert
        // Проверяем, что есть результаты
        await searchPage.expectHasResults();
        // Проверяем релевантность
        const firstTitle = await searchPage.adCardTitles.first().textContent();
        expect(firstTitle?.toLowerCase()).toContain("iphone");
        // Проверяем сортировкy
        await searchPage.expectPricesSortedAsc();
    });
});
