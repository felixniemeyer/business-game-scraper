const test_runner = require('../../../test_runner.js')
const scrape_material_costs = require('./material_costs.js')

test_runner.run(__dirname + '/' + '../financial.html', scrape_material_costs)
