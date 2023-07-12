import {task} from "gulp";
import {chromium,devices} from "playwright";
const TelegramBot = require('node-telegram-bot-api');
const token = '6168835435:AAEX-jYqum2mD4N2ath6_QihrqjPC5GJ-C4';
const bot = new TelegramBot(token, {polling: true});
const chatId = 6252259316;

task("test",async (done) => {
    const browser = await chromium.launch({headless:true});
    const page = await browser.newPage();
    await page.goto("https://news.naver.com/");

    const document = {querySelectorAll:(name:string) => [{innerHTML:"test"}]}; // github action 용 회피타입

    const title = await page.evaluate(() => {
        return document.querySelectorAll(".cjs_t")[0].innerHTML
    });

    bot.sendMessage(chatId, title);
    console.log(title);
    await browser.close();
    done();
});