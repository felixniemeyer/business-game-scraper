const login = require('./login.js')

//pages
const electricity_page = require('./pages/electricity/page.js')

const write = require('./write-to-csv.js') 

params = {
  password: undefined,
  game_id: 397,
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
  let variables = {
    electricity: {}
  }

  let session_cookie = await login(params['email'], params['password'])

  session_cookie = await electricity_page.scrape(
    params['game_id'], 
    session_cookie, 
    variables.electricity)

  await write(variables) 
} 

run()


