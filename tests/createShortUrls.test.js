const createShortUrlsFactory = require('../src/createShortUrls')

jest.mock('request-promise-native', () => (options) => {
  const unauthorizedResponse = require('./fixtures/rebrandlyResponses/unauthorized.json')
  const invalidDomainResponse = require('./fixtures/rebrandlyResponses/invalidDomain.json')
  const invalidUrlResponse = require('./fixtures/rebrandlyResponses/invalidUrl.json')
  const successResponse = require('./fixtures/rebrandlyResponses/success.json')

  const body = JSON.parse(options.body)

  if (options.headers.apikey === 'invalidApiKey') {
    const invalidApiKeyError = new Error()
    invalidApiKeyError.response = unauthorizedResponse
    return Promise.reject(invalidApiKeyError)
  } else if (options.headers.apikey === 'serverError') {
    const serverError = new Error('Some Server error happened')
    serverError.response = { statusCode: 500 }
    return Promise.reject(serverError)
  } else if (body.destination === 'invalidUrl') {
    return Promise.resolve(invalidUrlResponse)
  } else if (body.domain && body.domain.fullName === 'invalidDomain') {
    return Promise.resolve(invalidDomainResponse)
  }

  return Promise.resolve(successResponse)
})

test('It should return a function', () => {
  expect(typeof createShortUrlsFactory('someValidApiKey')).toBe('function')
})

test('It should handle invalid error because of an invalid apikey', () => {
  const csu = createShortUrlsFactory('invalidApiKey')
  expect(csu(['http://example.com'])).resolves.toMatchSnapshot()
})

test('It should handle error because of invalid url', () => {
  const csu = createShortUrlsFactory('someValidApiKey')
  expect(csu(['invalidUrl'])).resolves.toMatchSnapshot()
})

test('It should handle error because of invalid domain', () => {
  const csu = createShortUrlsFactory('someValidApiKey')
  expect(csu(['http://example.com'], 'invalidDomain')).resolves.toMatchSnapshot()
})

test('It should handle a generic server error', () => {
  const csu = createShortUrlsFactory('serverError')
  expect(csu(['http://example.com'])).resolves.toMatchSnapshot()
})

test('It should successfully create a shortUrl', () => {
  const csu = createShortUrlsFactory('someValidApiKey')
  expect(csu(['http://example.com'], 'somedomain.com', ['custom'])).resolves.toMatchSnapshot()
})
