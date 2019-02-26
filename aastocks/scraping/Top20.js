const puppeteer = require('puppeteer');

const url = `http://www.aastocks.com/en/stocks/market/top-rank/stock`;

async function topStocks() {
  const browser = await puppeteer.launch(
    // { headless: false }
  );
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36');

  await page.goto(url, { waitUntil: 'networkidle2' });
  console.log('url launched');

  await page.waitFor(3*1000);

  const result = await page.evaluate(() => {
    let data = [];
    let elements = document.querySelectorAll('table#tbTS > tbody > tr');

    // Selectors
    const NAME_SELECTOR = 'td:nth-child(1) > div:nth-child(1) > div > span:nth-child(1)';
    const TICKER_SELECTOR = 'td:nth-child(1) > div:nth-child(2) > div > span.float_l > a';

    // add our for loop for each top 20 stock
    elements.forEach(element => {
      const name = element.querySelector(NAME_SELECTOR).innerText,
          ticker = element.querySelector(TICKER_SELECTOR).innerText,
           price = element.children[2].innerText,
          volume = element.children[5].innerText,
        turnover = element.children[6].innerText,
              pe = element.children[7].innerText;

      data.push({
        stock: name + ' / ' + ticker, 
        price,
        volume,
        turnover,
        PE: pe,
      });
    });
  // return something
    return data;
  });
  browser.close();
  return result;
}

topStocks().then((value) => {
  console.log(value); // Success!
});