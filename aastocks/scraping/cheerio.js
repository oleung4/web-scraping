//Scraping static webpage using request-promise and cheerio.js

const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');
const url = 'http://www.aastocks.com/en/stocks/market/top-rank/stock';

function top(url) { 
  rp(url)
  .then(function(html){
    //success!
    // console.log(html);
    console.log($('table#tbTS > tbody > tr', html).length);
    // console.log($('table#tbTS > tbody > tr', html));

    let data = [];

    $('table#tbTS > tbody > tr', html).each(function(i, element) {

      // Selectors
      const NAME_SELECTOR = 'td:nth-child(1) > div:nth-child(1) > div > span:nth-child(1)';
      const TICKER_SELECTOR = 'td:nth-child(1) > div:nth-child(2) > div > span.float_l > a';

      const stock = $(NAME_SELECTOR, element).text(),
           ticker = $(TICKER_SELECTOR, element).text(),
            price = $(element).children().eq(2).text(),
           change = $(element).children().eq(4).text(),
           volume = $(element).children().eq(5).text(),
         turnover = $(element).children().eq(6).text(),
               pe = $(element).children().eq(7).text(),
            yield = $(element).children().eq(9).text(),
        marketCap = $(element).children().eq(10).text();

      // console.log(stock);

      data.push({
        stock: stock + ' / ' +ticker,
        price,
        change,
        volume,
        turnover,
        pe,
        yield,
        marketCap,
      });
    })

    return data;
    
  })
  .then(function(topStocks){
    console.log(topStocks);
    fs.writeFile(__dirname + '/output/TopStocks.json', JSON.stringify(topStocks, undefined, 2), (err) => {
      if (err) throw err;
      console.log('The file has been saved');
    });
  })
  .catch(function(err){
    //handle error
    console.log(err);
  });
}

module.exports = top;