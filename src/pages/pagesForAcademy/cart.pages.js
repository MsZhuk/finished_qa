import {BasePage} from './base.pages.js';
import * as allure from "allure-js-commons";

export class CartPage extends BasePage {
constructor (page) {
    super(page);
    this.deleteButton = this.page.locator('.ec_cartitem_delete');
    this.returnButton = this.page.locator('.ec_cart_empty_button_row');

};

async clickDeleteButton () {
    await allure.step("Нажать на кнопку Удалить", async () => {
    await this.deleteButton.click();   
    });
};

async clickReturnButton () {
    await allure.step("Нажать на кнопку вернуться в магазин", async () => {
    await this.returnButton.click();
    });
};

};
