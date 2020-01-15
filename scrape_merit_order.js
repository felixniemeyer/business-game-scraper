const rp = require('request-promise') 
const cheerio = require('cheerio')

let paramNames = [
  'game_id', 
  'session_id'
]
params = {}



paramNames.forEach((paramName, i) => {
  params[paramName] = process.argv[2 + i]
  if(params[paramName] === undefined) {
    console.error(`${paramName} not specified`) 
    console.log(`Usage: crawl_merit_order <game_id> <session_id>`)
  }
})

let request_options = {
  url: `http://tum-energy-challenge.de/games/${params['game_id']}/electricity`,
  headers: {
    'Cookies': `laravel_session=${params['session_id']}`,
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0'
  },
  transform: body => { return cheerio.load(body); }
}

rp(request_options)
  .then($ => {
    console.log("request successfull")
  })
  .catch(console.error)
