module.exports = function getSessionCookieFromResponse(response) {
  return response.headers['set-cookie'][0].split(';')[0]
}
