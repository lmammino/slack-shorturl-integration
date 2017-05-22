const validateCommandInput = require('../src/validateCommandInput')

test('It should return void if the validation pass', () => {
  expect(validateCommandInput(['url1', 'url2'], 'somedomain', ['slashtag1'])).toBeUndefined()
})

test('It should return an error if no url is specified', () => {
  expect(validateCommandInput()).toMatchSnapshot()
})

test('It should return an error if multiple domains are provided', () => {
  expect(validateCommandInput(['url1', 'url2'], ['domain1'])).toMatchSnapshot()
})

test('It should return an error if there are more slashtags than urls', () => {
  expect(validateCommandInput(['url1', 'url2'], 'somedomain', ['slashtag1', 'slashtag2', 'slashtag3'])).toMatchSnapshot()
})

test('It should return an error if there are more than 5 urls', () => {
  expect(validateCommandInput([
    'http://fstack.link/10',
    'http://fstack.link/11',
    'http://fstack.link/12',
    'http://fstack.link/13',
    'http://fstack.link/14',
    'http://fstack.link/15'
  ])).toMatchSnapshot()
})
