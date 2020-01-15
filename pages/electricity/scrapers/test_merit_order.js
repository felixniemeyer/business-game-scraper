const test_runner = require('../../../test_scrape_from_file.js')
const scrape_merit_order = require('./merit_order.js')

test_runner.run(__dirname + '/' + '../electricity.html', scrape_merit_order)
