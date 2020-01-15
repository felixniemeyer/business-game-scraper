const rp = require('request-promise') 
const querystring = require('querystring') 
const cheerio = require('cheerio')
const getSessionCookieFromResponse = require('./get-session-cookie-from-response.js')
const default_headers = require('./default-headers.js')

module.exports = function(email, password) {
  return new Promise((resolve, reject) => {
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
          'email': email,
          'password': password
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
            resolve(r.session_cookie)
          })
          .catch(reject)
      }) 
      .catch(reject)
  })
}
