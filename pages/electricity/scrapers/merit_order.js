function scrape_merit_order($) {
  let dataScript = $('h2:contains(Merit order)').siblings('script')[0].children[0].data

  let variables = {}
  

  let i = 0

  dataScript
    .slice(0, dataScript.lastIndexOf('}') + 1)
    .split('datasets.push(dataset')
    .map(fragment => fragment.slice(fragment.indexOf('{'), fragment.lastIndexOf('}') + 1))
    .forEach(datasetString => {
      datasetString = datasetString.replace(/'/g, '"')
      datasetString = datasetString.replace(/([^ :]*):/g, '"$1":')
      console.log(i++, datasetString) 
      let dataset = JSON.parse(datasetString)
      variables[dataset.label] = {
        capacity_MW: dataset.data[1].x - dataset.data[0].x,
        marginal_cost_EUR_per_MWh: dataset.data[0].y
      }
    })

  console.log(variables) 
}

module.exports = scrape_merit_order
