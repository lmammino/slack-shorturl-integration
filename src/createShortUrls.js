const request = require('request-promise-native')

const createError = (sourceUrl, message, sourceField) => new Error(`Cannot create short URL for "${sourceUrl}": ${message} (${sourceField})`)

const createShortUrlFactory = (apikey) => (options) => new Promise((resolve, reject) => {
  const body = {
    destination: options.url,
    domain: options.domain ? { fullName: options.domain } : undefined,
    slashtag: options.slashtag ? options.slashtag : undefined
  }

  const req = request({
    url: 'https://api.rebrandly.com/v1/links',
    method: 'POST',
    headers: {
      apikey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body, null, 2),
    resolveWithFullResponse: true
  })

  req
    .then((response) => {
      const result = JSON.parse(response.body)
      if (result.httpCode === 404) {
        resolve(createError(options.url, result.message, result.source))
      } else {
        resolve(result)
      }
    })
    .catch((err) => {
      if (err.response.statusCode === 401) {
        return resolve(new Error('Unauthorized. Verify that you are using a valid Rebrandly apikey'))
      }

      const serverErr = err.message
      resolve(createError(options.url, serverErr, ''))
    })
})

const createShortUrlsFactory = (apikey) => (urls, domain, slashtags) => {
  const structuredUrls = urls.map(url => ({url, domain, slashtag: undefined}))
  if (Array.isArray(slashtags)) {
    slashtags.forEach((slashtag, i) => (structuredUrls[i].slashtag = slashtag))
  }

  const requestsPromise = structuredUrls.map(createShortUrlFactory(apikey))
  return Promise.all(requestsPromise)
}

module.exports = createShortUrlsFactory
