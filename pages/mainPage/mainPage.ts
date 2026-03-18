import {Locator, Page, expect} from "@playwright/test";
import {BasePage} from "../basePage";

export class MainPage extends BasePage {
    protected pageName = "Главная страница";

    readonly header: Locator;
    readonly mobileMenuButton: Locator;
    readonly loginButtonDesktop: Locator;
    readonly loginButtonMobile: Locator;
    readonly myAdsBtn: Locator;
    readonly userMenuBtn: Locator;
    readonly loginModal: Locator;
    readonly searchInput: Locator
    readonly logoutButton: Locator
    readonly profileLink: Locator
    readonly emptyResultStub: Locator
    readonly createItem: Locator
    readonly titleInputItem: Locator
    readonly descriptionInputItem: Locator
    readonly addPhotoButtonItem: Locator
    readonly advertisementCard: Locator
    readonly myAdsDropdownLink: Locator

    constructor(page: Page) {
        super(page);
        this.header = page.locator("header");
        this.mobileMenuButton = page.locator("[data-marker=\"mobile-menu-button\"]");
        this.loginButtonDesktop = page.locator("[data-marker=\"login-button-desktop\"]");
        this.loginButtonMobile = page.locator("[data-marker=\"login-button-mobile\"]");
        this.myAdsBtn = page.locator("[data-marker=\"my-ads-link\"]");
        this.userMenuBtn = page.locator("[data-marker=\"user-menu-button\"]");
        this.loginModal = page.locator("[data-marker=\"login-modal-content\"]");
        this.searchInput = page.locator("[data-marker=\"search-input\"]");
        this.logoutButton = page.locator("[data-marker=\"logout-button\"]");
        this.myAdsDropdownLink = page.locator("[data-marker=\"my-ads-dropdown-link\"]");
        this.profileLink = page.locator("[data-marker=\"profile-link\"]");
        this.createItem = page.locator("[data-marker=\"create-ad-button-desktop\"]");
        this.titleInputItem = page.locator("[data-marker=\"title-input\"]");
        this.descriptionInputItem = page.locator("[data-marker=\"description-input\"]");
        this.addPhotoButtonItem = page.locator("[data-marker=\"add-photo-button\"]");
        this.emptyResultStub = page.locator("//*[@src=\"/not-found.png\"]");
        this.advertisementCard = page.locator("[data-marker=\"advertisement-card\"]")
    }

    protected root(): Locator {
        return this.header;
    }

    async openMainPage() {
        await this.page.goto("/");
        await this.waitForOpen();
    }

    async openMyAdsPage() {
        await this.myAdsBtn.click();
    }

    async assertMyAds() {
        await expect(
            this.myAdsBtn).toBeVisible();
    }

    async openLoginDesktop() {
        await this.loginButtonDesktop.click();
    }

    async openUserMenu() {
        await this.userMenuBtn.click();
    }

    async openProfileLink() {
        await this.profileLink.click();
    }

    async openLoginMobile() {
        await this.loginButtonMobile.click();
    }

    async fillSearchInput(value) {
        await this.searchInput.fill(value)
    }

    async createItemClick() {
        await this.createItem.click()
    }

    async assertUserIsLoggedIn() {
        await expect(
            this.userMenuBtn,
            "Пользователь не авторизован")
            .toBeVisible();
    }

    async assertLogoutButton() {
        await expect(
            this.logoutButton,
            "Пользователь не авторизован")
            .toBeVisible();
    }

    async assertMyAdsDropdownLink() {
        await expect(
            this.myAdsDropdownLink,
            "Пользователь не авторизован")
            .toBeVisible();
    }

    async assertItemAds(value) {
        await expect(
            this.advertisementCard.filter({
                hasText: value
            })).toBeVisible()
    }
    async assertEmptyResultStubIsVisible() {
        await this.waitForOpen();
        expect(
            await this.emptyResultStub.isVisible(),
            "Отсутствует заглушка пустого результата поиска"
        );
        await expect(
            this.page.locator("text=Ничего не найдено"),
            "Заголовок пустого результата поиска не отображается"
        ).toBeVisible();
        await expect(
            this.page.locator("text=Задайте запрос по-другому или установите более мягкие ограничения."),
            "Описание пустого результата поиска не отображается"
        ).toBeVisible();
    }

}
