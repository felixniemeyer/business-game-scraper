const login = require('./login.js')

//pages
const electricity_page = require('./pages/electricity/electricity.js')

const write = require('./write-to-csv.js') 

let variables = {}

//login
session_cookie = login()

electricity.scrape(session_cookie, variables)

write(variables) 
