const test_runner = require('../../../test_runner.js')
const scrape_counts = require('./counts.js')

test_runner.run(__dirname + '/' + '../market-plants.html', scrape_counts)
