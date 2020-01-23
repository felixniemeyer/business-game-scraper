const rp = require('request-promise') 
const querystring = require('querystring') 
const cheerio = require('cheerio')

const default_headers = require('../../default-headers.js')
const getSessionCookieFromResponse = require('../../get-session-cookie-from-response.js') 

const scrape_counts = require('./scrapers/counts.js')

module.exports = {
  scrape: function(game_id, session_cookie, variables) {
    return new Promise((resolve, reject) => {
      let request_options = {
        url: `http://tum-energy-challenge.de/games/${game_id}/market-plants`,
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
          console.log('counts', variables['counts'] = scrape_counts($))
          
          resolve(r.session_cookie)
        })
        .catch(reject)
    })
  }
}
