/* eslint-disable @typescript-eslint/no-unused-vars */

import { test, expect } from "@playwright/test";
import { SearchPage } from "../../pages/SearchPage/searchPage";

test.describe("Поиск и результаты", () => {
    test("Поиск несуществующего товара — отображение пустого результата", async ({ page }) => {
        //arrange
        const searchPage = new SearchPage(page);

        //act
        await searchPage.openSearchPage();
        await searchPage.search("zaglushka");

        //assert
        await searchPage.expectEmptyResults();
    });
});
