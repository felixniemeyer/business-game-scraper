module.exports = function daily_electricity_prices($) {
  let dataScript = $('h2:contains(Daily electricity prices)').siblings('script')[0].children[0].data

  let variables = {}

  let data = JSON.parse(dataScript
    .slice(dataScript.indexOf('{'), dataScript.lastIndexOf('}') + 1))

  for(key of Object.keys(data)) {
    variables[key] = {}
    let i = 0
    for(price of data[key]) {
      variables[key][i++] = price
    }
  }
  return variables
}
