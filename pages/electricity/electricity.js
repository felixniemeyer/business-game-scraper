const rp = require('request-promise') 
const querystring = require('querystring') 
const cheerio = require('cheerio')

const default_headers = {
  'Host': 'tum-energy-challenge.de',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1'
}

function getSessionCookieFromResponse(response) {
  return response.headers['set-cookie'][0].split(';')[0]
}

let variables = {}
 
let paramNames = [
  'password', 
  'game_id', 
]
params = {
  password: undefined,
  game_id: 397
}
paramNames.forEach((paramName, i) => {
  params[paramName] = process.argv[2 + i] || params[paramName]
  if(params[paramName] === undefined) {
    console.error(`${paramName} not specified`) 
    console.log('Usage: crawl_merit_order', paramNames.map(n => `<${n}>`).join(" "))
    process.exit()
  }
})

let login_prep_request_options = {
  url: 'http://tum-energy-challenge.de/', 
  headers: default_headers, 
  method: 'GET',
  gzip: true, 
  transform: (body, response) => {
    return { 
      session_cookie: getSessionCookieFromResponse(response),
      token: cheerio.load(body)("input[name='_token']").first().attr('value')
    }
  }
}

rp(login_prep_request_options)
  .then(r => {
    let formData = {
      '_token': r.token,
      'email': 'cristotjahjadi@gmail.com',
      'password': params['password']
    }

      
    let login_request_options = {
      url: 'http://tum-energy-challenge.de/sessions',
      method: 'POST',
      headers: {
        ...default_headers, 
        'Referer': 'http://tum-energy-challenge.de/',
        'Host': 'tum-energy-challenge.de',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:72.0) Gecko/20100101 Firefox/72.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
     //   'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'http://tum-energy-challenge.de',
        'Connection': 'keep-alive',
        'Referer': 'http://tum-energy-challenge.de/',
        'Cookie': r.session_cookie,
        'Upgrade-Insecure-Requests': '1',
      },
      form: formData,
      json: true,
      simple: false, 
      transform: (body, response, resolveWithFullResponse) => {
        return {
          session_cookie: getSessionCookieFromResponse(response)
        }
      }
    }
    rp(login_request_options)
      .then(r => {
        let request_options = {
          url: `http://tum-energy-challenge.de/games/${params['game_id']}/electricity`,
          method: 'GET', 
          headers: {
            ...default_headers,
            'Referer': 'http://tum-energy-challenge.de/games/397/play',
            'Cache-Control': 'max-age=0',
            'Cookie': r.session_cookie, 
          },
          gzip: true, 
        
          transform: (body, response) => { 
            return {
              session_cookie: getSessionCookieFromResponse(response),
              body
            }
          },
        }
        rp(request_options)
          .then(r => {
            let $ = cheerio.load(r.body)
            variables = {
              merit_order: scrape_merit_order($) 
            }
            console.log(r.body)
            process.exit()
            let dataScript = $('h2 :contains(Merit order)').siblings('script').first().text()
            console.log('dataScript', dataScript)
            console.log('test', $('h2:contains(Daily)').siblings('p').first().text())
            console.log('test2', $('h2').first().text())
            console.log('test3', $('h2'))
          })
          .catch(console.error)
      })
      .catch(console.errro)
  }) 
  .catch(console.error)

