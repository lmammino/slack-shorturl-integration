const commandParser = require('../src/commandParser')

test('it should parse a message with no urls, domain and slashtags', () => {
  const result = commandParser('This message does not contain urls domains and tags')
  expect(result).toMatchObject({
    urls: undefined,
    domain: undefined,
    slashtags: undefined
  })
})

test('it should parse a message with a single http url', () => {
  const result = commandParser('I would like you to shorten http://example.com as quick as possible')
  expect(result).toMatchObject({
    urls: ['http://example.com'],
    domain: undefined,
    slashtags: undefined
  })
})

test('it should parse a message with a single https url', () => {
  const result = commandParser('I would like you to shorten https://example.com as quick as possible')
  expect(result).toMatchObject({
    urls: ['https://example.com'],
    domain: undefined,
    slashtags: undefined
  })
})

test('it should parse a message with a complex url', () => {
  const complexUrl = 'http://www.google.ps/search?hl=en&client=firefox-a&hs=42F&rls=org.mozilla%3Aen-US%3Aofficial&q=The+type+%27Microsoft.Practices.ObjectBuilder.Locator%27+is+defined+in+an+assembly+that+is+not+referenced.+You+must+add+a+reference+to+assembly+&aq=f&aqi=&aql=&oq=#results'
  const result = commandParser(`I would like you to shorten ${complexUrl} as quick as possible`)
  expect(result).toMatchObject({
    urls: [complexUrl],
    domain: undefined,
    slashtags: undefined
  })
})

test('it should parse a message with multiple urls', () => {
  const result = commandParser('I would like you to shorten https://example.com and http://example.com as quick as possible')
  expect(result).toMatchObject({
    urls: ['https://example.com', 'http://example.com'],
    domain: undefined,
    slashtags: undefined
  })
})

test('it should parse a message an url and a domain', () => {
  const result = commandParser('I would like you to shorten https://example.com using @example.link as quick as possible')
  expect(result).toMatchObject({
    urls: ['https://example.com'],
    domain: 'example.link',
    slashtags: undefined
  })
})

test('it should parse a tag', () => {
  const result = commandParser('I would like you to shorten some url with slashtag ~tech please')
  expect(result).toMatchObject({
    urls: undefined,
    domain: undefined,
    slashtags: ['tech']
  })
})

test('it should parse a tag', () => {
  const result = commandParser('I would like you to shorten some url with slashtags ~tech, ~slack and ~bongo please')
  expect(result).toMatchObject({
    urls: undefined,
    domain: undefined,
    slashtags: ['tech', 'slack', 'bongo']
  })
})

test('it should parse a message with many urls, a domain and multiple slashtags', () => {
  const result = commandParser('I would like you to shorten https://example.com/chip (~chip) and https://example.com/chop (~chop) using @tech.link please')
  expect(result).toMatchObject({
    urls: ['https://example.com/chip', 'https://example.com/chop'],
    domain: 'tech.link',
    slashtags: ['chip', 'chop']
  })
})
