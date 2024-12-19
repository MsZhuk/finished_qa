import { test, expect } from '@playwright/test';
import { faker } from "@faker-js/faker";
import { MainPage, ProductPage, CartPage, MessagePage } from '../src/pages/pagesForAcademy/index.js';
import * as allure from "allure-js-commons";

const url = 'https://academybugs.com/find-bugs/#';
const texterror = 'You found a crash bug, examine the page for';
const error404 = '404 Error';
let newComment;

test.describe('Проверка сервиса Academybugs', () => {
  test.beforeEach(async ({ page }) => {
    newComment = {
      testcomment : faker.lorem.text(),
      testauhor : faker.person.firstName(),
      testemail : faker.internet.email()
    };
  });


    test('Смена валюты', async ({ page }) => {
       const mainPage = new MainPage(page);
       const productPage = new ProductPage(page);
       const messagePage = new MessagePage(page);

       await mainPage.open(url);
       await mainPage.clickItem();
       await productPage.changeCurrency();
       await allure.step("Открытие окна с подробной информацией об ошибке", async () => {
         await expect(await messagePage.message).toContainText(texterror);
       });
    });

    test('Оставить отзыв', async ({ page }) => {
    
      const mainPage = new MainPage(page);
      const productPage = new ProductPage(page);
      const messagePage = new MessagePage(page);

      await mainPage.open(url);
      await mainPage.clickItem();
      await productPage.addComment(newComment.testcomment);
      await productPage.addAuthor(newComment.testauhor);
      await productPage.addEmail(newComment.testemail);
      await productPage.clickSubmit();
      await allure.step("Открытие окна с подробной информацией об ошибке", async () => {
        await expect(await messagePage.message).toContainText(texterror);
      });
   });

   test('Проверка пагинации', async ({ page }) => {
      const mainPage = new MainPage(page);
      const messagePage = new MessagePage(page);

      await mainPage.open(url);
      await mainPage.clickPagination ();
      await allure.step("Открытие окна с подробной информацией об ошибке", async () => {
        await expect(await messagePage.messageanotherlocator).toContainText(texterror);
      });
   });  

    test('Проверка перехода на страницу производителя', async ({ page }) => {
        const mainPage = new MainPage(page);
        const productPage = new ProductPage(page);
        const messagePage = new MessagePage(page);

        await mainPage.open(url);
        await mainPage.clickItem();
        await productPage.clickManufacturer();
        await allure.step("Переход на страницу с ошибкой 404", async () => {
          await expect(await messagePage.message404).toContainText(error404);
        });
     });


     test('Проверка кнопки Return the store', async ({ page }) => {
      const mainPage = new MainPage(page);
      const cartPage = new CartPage(page);
      const messagePage = new MessagePage(page);

      await mainPage.open(url);
      await mainPage.clickCartIcon();
      await mainPage.clickViewCart();
      await cartPage.clickDeleteButton();
      await cartPage.clickReturnButton();
      await allure.step("Открытие окна с подробной информацией об ошибке", async () => {
        await expect(await messagePage.messageModal).toBeVisible();
      });
   });


   });



