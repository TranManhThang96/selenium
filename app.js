const {Builder, By, Key, until} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const driver = new Builder().forBrowser('firefox').build();
const fs = require('fs');
const delay = require('await-delay')
var array = [];
var count = 0;

async function example() {
    try {
        await driver.get('http://etsuran.mlit.go.jp/TAKKEN/kensetuKensaku.do');
        await driver.findElement(webdriver.By.css('#choice > option:nth-child(2)')).click();
        await driver.findElement(webdriver.By.css('#kenCode > option:nth-child(4)')).click();
        await driver.findElement(webdriver.By.css('#gyosyuType > option:nth-child(2)')).click();
        await driver.findElement(webdriver.By.css('#sortValue > option:nth-child(1)')).click();
        await driver.findElement(webdriver.By.css('#dispCount > option:nth-child(5)')).click();
        await driver.findElement(webdriver.By.css('#gyosyu > option:nth-child(3)')).click();
        await driver.findElement(webdriver.By.xpath('//*[@id="input"]/div[6]/div[5]')).click();

        for(let i = 0; i < 28; i++) {
            count++;
            if (count != 1) {
                await driver.findElement(webdriver.By.xpath('//*[@id="pageListNo2"]/option['+ count +']')).click();
            }
            await getContent();
            // if (i % 5 == 0) {
            //     let name = 'result' + i +'.txt';
            //     await fs.writeFileSync(name, JSON.stringify(array));
            // }
        }

        fs.writeFileSync('03岩手県.txt',JSON.stringify(array));

    } finally {
        await driver.quit();
    }
}

async function getContent() {
    let rowMax = await driver.executeScript("return document.getElementsByTagName('tr').length")
    for (let row = 2; row <= rowMax; row++) {
        var item = {};
        //await delay(2000);
        await driver.findElement(webdriver.By.xpath('//*[@id="container_cont"]/table/tbody/tr[' + row + ']/td[4]/a')).click();
        for (let i = 1; i < 6; i++) {
            let key = await driver.findElement(webdriver.By.xpath('//*[@id="input"]/div[1]/table/tbody/tr[' + i + ']/th')).getText()
            let value = await driver.findElement(webdriver.By.xpath('//*[@id="input"]/div[1]/table/tbody/tr[' + i + ']/td')).getText()
            item[key] = value;

            if (i < 4) {
                let key2 = await driver.findElement(webdriver.By.xpath('//*[@id="input"]/div[1]/div/table/tbody/tr['+ i +']/th')).getText()
                let value2 = await driver.findElement(webdriver.By.xpath('//*[@id="input"]/div[1]/div/table/tbody/tr[' + i +']/td')).getText()

                let key3 = await driver.findElement(webdriver.By.xpath('//*[@id="input"]/div[1]/div/table/tbody/tr[4]/td[' + i +']')).getText()
                let value3 = await driver.findElement(webdriver.By.xpath('//*[@id="input"]/div[1]/div/table/tbody/tr[5]/td[' + i +']')).getText()
                item[key2] = value2;
                item[key3] = value3;
            }
        }

        array.push(item);
        await driver.navigate().back()
    }
}

example();
