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
