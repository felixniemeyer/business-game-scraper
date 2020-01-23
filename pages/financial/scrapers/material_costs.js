module.exports = function scrape_material_prices($) {
  let dataScripts = $('h2:contains(Development of resource prices)').siblings('script')

  let variables = {}
  for(let i = 0; i < dataScripts.length; i++) {
    let dataScript = dataScripts[i].children[0].data
    let string = dataScript.slice(0, dataScript.indexOf("]") + 1)
    let begin = "window.material_"
    string = string.slice(string.indexOf(begin) + begin.length)
    let [material, valueString] = string.split(" = ")
    if(valueString !== undefined) {
      let values = JSON.parse(valueString) 
      variables[material] = {}
      for(let round = 0; round < values.length; round++){
        variables[material]["round-"+round] = values[round]
      }
    }
  }
  return variables
}
