const puppeteer = require('puppeteer');
const fs = require('fs');
const shuffle = require('shuffle-array');

const tickers = ['0175', '0700', '1099', '1728', '2313', '2318', '2382', '3888'];
const shuffledTickers = shuffle(tickers);
const url = `http://www.aastocks.com/en/stocks/quote/detail-quote.aspx`;

async function stockInfo() {
  const browser = await puppeteer.launch(
    // { headless: false }
  );
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36');

  const data = [];

  await page.goto(url, { waitUntil: 'networkidle2' });
  console.log('url launched');

  // create loop here for scraping other stock tickers

  console.log('Beginning crawl');
  for (let i = 0; i < tickers.length; i++) {
    // urlQuery = url + tickers[i];

    // typing and searching actions
    const inputElement = await page.$('#sb2-txtSymbol-aa');
    await inputElement.type(shuffledTickers[i], { delay: 100 });
    await inputElement.press('Enter');

    // previous logic if first loading directly into ticker detail page
    // if (await page.evaluate(() => document.querySelector('#labelLast') !== null)) {
    //   console.log('selector exists') 
    // } else {
    //   await page.click('#sb2-btnSubmit');
    // }

    // await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitFor(1 * 1000);

    // Scrape

    const info = await page.evaluate(() => { // use page.evaluate() to use built-in DOM selectors to retrieve values

      // Selectors
      let name = document.querySelector('#cp_ucStockBar_litInd_StockName').innerText,
        ticker = document.querySelector('#cp_ucStockBar_lnkInd_Symbol').innerText.replace(/[()]/g, ''),
        price = document.querySelector('#labelLast').innerText.trim(),
        change = document.querySelector('#tbQuote > tbody > tr:nth-child(2) > td.vat.min > div > div.cls.bold.ss3 > span').innerText,
        prevCloseOpen = document.querySelector('#tbQuote > tbody > tr:nth-child(1) > td.vat.colPrevClose > div > div.cls.bold.ss3').innerText,
        updated = document.querySelector('#cp_pLeft > div:nth-child(3) > span > span').innerText;

      return {
        name,
        ticker,
        price,
        change,
        prevCloseOpen,
        updated
      };
    });

    console.log(info);
    data.push(info);

    console.log(i);
  }
  console.log('Closing browser!');
  browser.close();

  return data;
}

// stockInfo().then((value) => {
//   // console.log(value);
//   fs.writeFile(__dirname + `/output/values.json`, JSON.stringify(value, undefined, 2), (err) => {
//     if (err) throw err;
//     console.log('The file has been saved');
//   });
// })

module.exports = stockInfo;