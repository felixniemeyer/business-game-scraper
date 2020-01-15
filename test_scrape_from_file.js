const fs = require('fs').promises
const cheerio = require('cheerio')

module.exports = {
  run: (file, scraper) => {
    fs.readFile( file, 'utf8')
      .then(data => {
        let $ = cheerio.load(data)
        let vars = scraper($)
        console.log(vars) 
      })
      .catch(console.error)
  }
}
