const createShortUrlsFactory = require('../src/createShortUrls')

jest.mock('request-promise-native', () => (options) => {
  const badRequestResponse = require('./fixtures/rebrandlyResponses/badRequest.json')
  const unauthorizedResponse = require('./fixtures/rebrandlyResponses/unauthorized.json')
  const invalidDomainResponse = require('./fixtures/rebrandlyResponses/invalidDomain.json')
  const invalidUrlResponse = require('./fixtures/rebrandlyResponses/invalidUrl.json')
  const serverErrorResponse = require('./fixtures/rebrandlyResponses/serverError.json')
  const serviceUnavailableResponse = require('./fixtures/rebrandlyResponses/serviceUnavailable.json')
  const successResponse = require('./fixtures/rebrandlyResponses/success.json')

  const body = JSON.parse(options.body)

  const error = new Error()
  if (options.headers.apikey === 'badRequest') {
    error.response = badRequestResponse
    return Promise.reject(error)
  } if (options.headers.apikey === 'invalidApiKey') {
    error.response = unauthorizedResponse
    return Promise.reject(error)
  } else if (options.headers.apikey === 'serverError') {
    error.response = serverErrorResponse
    return Promise.reject(error)
  } else if (options.headers.apikey === 'serviceUnavailable') {
    error.response = serviceUnavailableResponse
    return Promise.reject(error)
  } else if (body.destination === 'invalidUrl') {
    error.response = invalidUrlResponse
    return Promise.reject(error)
  } else if (body.domain && body.domain.fullName === 'invalidDomain') {
    error.response = invalidDomainResponse
    return Promise.reject(error)
  }

  return Promise.resolve(successResponse)
})

test('It should return a function', () => {
  expect(typeof createShortUrlsFactory('someValidApiKey')).toBe('function')
})

test('It should handle badRequest error', () => {
  const csu = createShortUrlsFactory('badRequest')
  expect(csu(['http://example.com'])).resolves.toMatchSnapshot()
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

test('It should handle service unavailable error', () => {
  const csu = createShortUrlsFactory('serviceUnavailable')
  expect(csu(['http://example.com'])).resolves.toMatchSnapshot()
})

test('It should successfully create a shortUrl', () => {
  const csu = createShortUrlsFactory('someValidApiKey')
  expect(csu(['http://example.com'], 'somedomain.com', ['custom'])).resolves.toMatchSnapshot()
})
