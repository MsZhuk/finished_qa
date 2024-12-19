import { BasePage } from './base.pages.js';
import * as allure from "allure-js-commons";

export class MainPage extends BasePage {
  constructor(page) {
    super(page);
    this.selectItem = this.page.getByRole('link', { name: 'DNK Yellow Shoes' });
    this.pagination = this.page.locator('.ec_product_page_perpage');
    this.cartIcon = this.page.locator('#ec_add_to_cart_5');
    this.viewCart = this.page.getByTitle('View Cart');
    
  };
   
  async clickItem () {
    await allure.step("Выбрать товар", async () => {
    await this.selectItem.click();
  });
  };


  async clickPagination () {
    await allure.step("Нажать отображать 50 товаров", async () => {
    await this.pagination.click();
    });
  };

  async clickCartIcon () {
    await allure.step("Нажать на иконку Корзина", async () => {
    await this.cartIcon.click();
    });
};

 async clickViewCart () {
  await allure.step("Перейти в Корзину", async () => {
  await this.viewCart.click();
  });
 };
};
