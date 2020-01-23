const login = require('./login.js')

//pages
const electricity_page = require('./pages/electricity/page.js')
const financial_page = require('./pages/financial/page.js')
const plants_page = require('./pages/plants/page.js')

const write = require('./write-to-csv.js') 

params = {
  password: undefined,
  game_id: 398,
  email: 'cristotjahjadi@gmail.com'
}
Object.keys(params).forEach((paramName, i) => {
  params[paramName] = process.argv[2 + i] || params[paramName]
  if(params[paramName] === undefined) {
    console.error(`${paramName} not specified`) 
    console.log('Usage: crawl', Object.keys(params).map(n => `<${n}>`).join(" "))
    process.exit()
  }
})

async function run() {
  let variables = {}

  let pages = {
    financial: financial_page, 
    electricity: electricity_page, 
    plants: plants_page
  }

  let session_cookie = await login(params['email'], params['password'])

  for(page in pages) {
    variables[page] = {}
    session_cookie = await pages[page].scrape(
      params['game_id'],
      session_cookie,
      variables[page])
  }

  await write(variables) 
} 

run()


