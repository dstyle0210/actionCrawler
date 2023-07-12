import {task} from "gulp";
import {chromium,devices} from "playwright";

task("test",async (done) => {
    const browser = await chromium.launch({headless:true});
    const page = await browser.newPage();
    await page.goto("https://www.naver.com");
    const title = await page.evaluate(() => {
        return document.getElementsByTagName("title")[0].innerHTML;
    });
    console.log(title);
    await browser.close();
    done();
});