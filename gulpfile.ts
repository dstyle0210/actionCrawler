import {task} from "gulp";
import {chromium,devices} from "playwright";
import fs from "fs";
const TelegramBot = require('node-telegram-bot-api');
const token = '6168835435:AAEX-jYqum2mD4N2ath6_QihrqjPC5GJ-C4';
const chatId = 6252259316;

task("test",async (done) => {
    const browser = await chromium.launch({headless:true});
    const page = await browser.newPage();
    await page.goto("https://news.naver.com/");

    const document = {querySelectorAll:(name:string) => [{innerHTML:"test"}]}; // github action 용 회피타입

    const title = await page.evaluate(() => {
        return document.querySelectorAll(".cjs_t")[0].innerHTML
    });

    // TOOD : firebase에 데이터 저장시키고.. 뭘 저장하지?

    const bot = new TelegramBot(token, {polling: false});
    bot.sendMessage(chatId, "매일경제 https://media.naver.com/press/009/newspaper"); // 매일경제 신문보기 화면
    
    await new Promise((resolve)=>setTimeout(resolve,660000)); // 11분 후 닫음 (텔레그램은 연결 후 10분 이내 끊을경우 429에러 발생함 , Error: ETELEGRAM: 429 Too Many Requests: retry after 599)
    // await new Promise((resolve)=>setTimeout(resolve,1000)); // 개발용 1초 있다가 닫음 (그냥 에러 나는걸로..)
    await browser.close();
    bot.sendMessage(chatId, "닫습니다.");
    await bot.close();
    done();
});