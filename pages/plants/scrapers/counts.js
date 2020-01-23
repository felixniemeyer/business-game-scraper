module.exports = function scrape_counts($) {
  
  let plants = []

  $('#plants-list tbody tr').each(function() {
    let type = $(this).children(".type").text()
    type = type.slice(type.indexOf(')') + 2)
    type = type.slice(0, type.indexOf('(') - 1)
    let owner = $(this).children(".owner").text()
    let active = $(this).children(".status").text() === 'active'
    plants.push({
      type, 
      owner, 
      active
    })
  })

  let variables = {}

  plants.forEach(plant => {
    if(variables[plant.type] === undefined) {
      variables[plant.type] = {
        total: 0, 
        total_active: 0, 
        ours: 0, 
        ours_active: 0
      }
    }
    let entry = variables[plant.type]
    entry.total++
    if(plant.active) entry.total_active++
    if(plant.owner === 'Group X') {
      entry.ours++
      if(plant.active) entry.ours_active++
    }
  })
  
  return variables
}
