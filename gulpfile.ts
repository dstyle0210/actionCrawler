import {task} from "gulp";
import {chromium,devices} from "playwright";
const TelegramBot = require('node-telegram-bot-api');
const token = '6168835435:AAEX-jYqum2mD4N2ath6_QihrqjPC5GJ-C4';
const chatId = 6252259316;

task("test",async (done) => {
    const browser = await chromium.launch({headless:true});
    const page = await browser.newPage();

    
    // 나이키 발매정보
    await page.goto("https://www.nike.com/kr/launch?s=upcoming");
    const nikeLaunchList:{name:string,link:string}[] = await page.evaluate(() => {
        var prdList = document.querySelectorAll(".product-card");
        const todayLaunchList:{name:string,link:string}[] = [];
        const date = new Date();
        prdList.forEach((productCard) => {
            const today = (date.getMonth()+1)+"-"+date.getDate();
            const caption = productCard.querySelector(".launch-caption") as HTMLElement;
            let dday:string;
            if(caption){
                dday = caption.innerText.replace(/\s+/gi,"").replace("월","-").replace("일","");
                if(today == dday){
                    const name = productCard.querySelector(".copy-container") as HTMLElement;
                    const link = productCard.querySelector(".card-link") as HTMLAnchorElement;
                    todayLaunchList.push({name:name.innerText,link:link.href})
                }
            };
        });
        return todayLaunchList;
    });

    // 텔레그램봇 시작
    const bot = new TelegramBot(token, {polling: false});
    if(nikeLaunchList.length){
        // 오늘발매 있음
        for(let card of nikeLaunchList){
            bot.sendMessage(chatId, "[SNKRS] "+card.name+"\n"+card.link);
        };
    }else{
        bot.sendMessage(chatId, "[SNKRS] 나이키 오늘 발매없음");
    };
    
    // 뉴발란스(성인) 발매정보
    await page.goto("https://www.nbkorea.com/launchingCalendar/list.action?listStatus=C"); // 뉴발란스(성인)
    const nbLaunchList:{name?:string,link?:string}[] = await page.evaluate(() => {
        const todayLaunchList = [];
        const date = new Date();
        $("#launchingList li").each((idx,item) => {
            const $card = $(item);
            const $dateText = $card.find(".launching_date");
            const today = (date.getMonth()+1)+"-"+date.getDate();
            const monthName = $dateText.find(".lMonth").text();
            const monthNumber = new Date(`${monthName} 1, ${date.getFullYear()}`).getMonth() + 1;
            const dateNumber = Number($dateText.find(".lDay").text());
            if(today==`${monthNumber}-${dateNumber}`){
                todayLaunchList.push({
                    name:`[${$card.find(".launching_time").text()}] ${$card.find(".launching_name").text()}`,
                    link:$card.find("a").get(0).href
                });
            }
        });
        return todayLaunchList;
    });

    if(nbLaunchList.length){
        // 오늘발매 있음
        for(let card of nbLaunchList){
            bot.sendMessage(chatId, "[NB] "+card.name+"\n"+card.link);
        };
    }else{
        bot.sendMessage(chatId, "[NB] 뉴발란스(성인) 오늘 발매없음");
    };

    await new Promise((resolve)=>setTimeout(resolve,660000)); // 11분 후 닫음 (텔레그램은 연결 후 10분 이내 끊을경우 429에러 발생함 , Error: ETELEGRAM: 429 Too Many Requests: retry after 599)
    // await new Promise((resolve)=>setTimeout(resolve,1000)); // 개발용 1초 있다가 닫음 (그냥 에러 나는걸로..)
    await browser.close();
    // bot.sendMessage(chatId, "닫습니다");
    await bot.close();
    done(); 
});


// firebase
/*
import { initializeApp } from 'firebase/app';
import { getDatabase , set , ref ,onValue } from 'firebase/database';
task("test2",(done) => {
    const firebaseConfig = {
        databaseURL: "https://dstyle-action-crawler-default-rtdb.firebaseio.com",
    };
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const dbRef = ref(db, 'users/');

    // read
    onValue(dbRef,(snapshot) => {
        const data = snapshot.val();
        console.log(data);
        done();
        process.exit(0);
    })
    // create , update 
    set(dbRef, {
        username: "asd",
        email: "이메일44",
        profile_picture : "src"
      }).then(()=>{
        done();
      });
})
*/