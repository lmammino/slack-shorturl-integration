const slashCommandFactory = require('../src/slashCommand')

jest.mock('../src/commandParser', () => (text) => {
  if (!text) {
    return {
      urls: undefined,
      domain: undefined,
      slashtags: undefined
    }
  }

  return {
    urls: ['http://example.com'],
    domain: 'somedomain.co',
    slashtags: 'test'
  }
})

test('It should return a function', () => {
  const createShortUrls = jest.fn()
  expect(typeof slashCommandFactory(createShortUrls, 'someSlackToken')).toBe('function')
})

test('It should reject if no body is provided', () => {
  const createShortUrls = jest.fn()
  const slashCommand = slashCommandFactory(createShortUrls, 'someSlackToken')
  expect(slashCommand()).resolves.toMatchSnapshot()
})

test('It should reject if the wrong token is provided', () => {
  const createShortUrls = jest.fn()
  const slashCommand = slashCommandFactory(createShortUrls, 'someSlackToken')
  expect(slashCommand({token: 'wrongToken'})).resolves.toMatchSnapshot()
})

test('It should reject if the command input is not valid', () => {
  const createShortUrls = jest.fn()
  const slashCommand = slashCommandFactory(createShortUrls, 'someSlackToken')
  expect(slashCommand({token: 'someSlackToken'})).resolves.toMatchSnapshot()
})

test('It should create a proper slack response for short urls', () => {
  const sampleResult = require('./fixtures/sampleShortUrlsResult')
  const createShortUrls = jest.fn().mockReturnValueOnce(Promise.resolve(sampleResult))
  const slashCommand = slashCommandFactory(createShortUrls, 'someSlackToken')
  expect(slashCommand({token: 'someSlackToken', text: 'https://facebook.github.io/jest/docs/expect.html'})).resolves.toMatchSnapshot()
})
