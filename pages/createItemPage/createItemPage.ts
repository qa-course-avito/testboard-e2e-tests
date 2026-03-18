import {BasePage} from "../basePage";
import {Locator} from "@playwright/test";


export class CreateItemPage extends BasePage {
    protected pageName: string;

    protected root(): Locator {
        return undefined;
    }
}