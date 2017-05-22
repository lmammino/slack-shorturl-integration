const validateCommandInput = (urls, domain, slashtags) => {
  if (!urls) {
    return new Error('No url found in the message')
  }

  if (Array.isArray(domain)) {
    return new Error('Multiple domains found. You can specify at most one domain')
  }

  if (Array.isArray(slashtags) && slashtags.length > urls.length) {
    return new Error('Urls/Slashtags mismatch: you specified more slashtags than urls')
  }

  if (urls.length > 5) {
    return new Error('You cannot shorten more than 5 URLs at the time')
  }
}

module.exports = validateCommandInput
