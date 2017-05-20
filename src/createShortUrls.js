const request = require('request-promise-native')

const createShortUrlFactory = (apikey) => (options) => new Promise((resolve, reject) => {
  const body = { destination: options.url }

  if (options.domain) {
    body.domain = { fullName: options.domain }
  }

  if (options.slashtag) {
    body.slashtag = options.slashtag
  }

  const req = request({
    url: 'https://api.rebrandly.com/v1/links',
    method: 'POST',
    headers: {
      apikey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body, null, 2)
  })

  req
    .then((response) => resolve(JSON.parse(response)))
    .catch((err) => {
      // TODO: manage 403 (existing slashtag) and 404 (unexistent domain) errors
      console.log(err)
      resolve(new Error(`Cannot create shortUrl for "${options.url}": ${err.message}`))
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
