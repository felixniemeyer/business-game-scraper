const test_runner = require('../../../test_runner.js')
const scrape_daily_electricity_prices = require('./daily_electricity_prices.js')

test_runner.run(__dirname + '/' + '../electricity.html', scrape_daily_electricity_prices)
