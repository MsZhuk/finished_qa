import {BasePage} from './base.pages.js';

export class MessagePage extends BasePage {
constructor (page) {
    super(page);
this.message = this.page.locator('.academy-bug-info-overlay');
this.messageanotherlocator = this.page.locator('.academy-bug-overlay');
this.message404 = this.page.locator('.sq-main-title');
this.messageModal = this.page.locator('#popmake-4406');
};

};