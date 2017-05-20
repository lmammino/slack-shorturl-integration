const tokenizer = require('string-tokenizer')
const createUrlRegex = require('url-regex')

const arrayOrUndefined = (data) => {
  if (typeof data === 'undefined' || Array.isArray(data)) {
    return data
  }

  return [data]
}

const commandParser = (commandText) => {
  const tokens = tokenizer()
    .input(commandText)
    .token('url', createUrlRegex())
    .token('domain', /(?:@)((?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*\.[a-z\\u00a1-\\uffff]{2,})/, match => match[2])
    .token('slashtag', /(?:~)(\w{2,})/, match => match[2])
    .resolve()

  return {
    urls: arrayOrUndefined(tokens.url),
    domain: tokens.domain,
    slashtags: arrayOrUndefined(tokens.slashtag)
  }
}

module.exports = commandParser
