const rp = require('request-promise') 
const querystring = require('querystring') 
const cheerio = require('cheerio')

const default_headers = require('../../default-headers.js')
const getSessionCookieFromResponse = require('../../get-session-cookie-from-response.js') 

const scrape_merit_order = require('./scrapers/merit_order.js')

module.exports = {
  scrape: function(game_id, session_cookie, variables) {
    return new Promise((resolve, reject) => {
      let request_options = {
        url: `http://tum-energy-challenge.de/games/${game_id}/electricity`,
        method: 'GET', 
        headers: {
          ...default_headers,
          'Referer': `http://tum-energy-challenge.de/games/${game_id}/play`, //could probably be ...de/
          'Cache-Control': 'max-age=0',
          'Cookie': session_cookie, 
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
          variables['merit_order'] = scrape_merit_order($) 
          resolve(r.session_cookie)
        })
        .catch(reject)
    })
  }
}
