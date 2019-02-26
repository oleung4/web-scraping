const express = require('express');
const exphbs = require('express-handlebars');
const fs = require('fs');

const values = require('./scraping/output/values.json');
// const values = require('./scraping/output/TopStocks.json');

// scraping functions
const stockInfo = require('./scraping/index.js');
const top = require('./scraping/cheerio.js');

const url = 'http://www.aastocks.com/en/stocks/market/top-rank/stock';

// express application
const app = express();
app.use(express.static("public"));

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

// homepage
app.get('/', function (req, res) {
  res.render('home', {
    stocks: values
  });
});

app.get('/updated', function (req, res) {
  res.render('success');
});

// gets our updated values
app.get('/api/update', function (req, res) {
  // res.send('updating stock info');
  // res.json(values)
  // top(url)
  stockInfo()

  .then((value) => {
    fs.writeFile(__dirname + `/scraping/output/values.json`, JSON.stringify(value, undefined, 2), (err) => {
      if (err) throw err;
      console.log('The file has been saved');
    })
  })

  // does not refresh page with new data - async issue
  .then(() => {
    console.log('finished');
    res.redirect('/updated');
  })
})

app.listen(3000);