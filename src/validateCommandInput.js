const validateCommandInput = (urls, domain, slashtags) => {
  if (!urls) {
    return new Error('No url found in the message')
  }

  // TODO add more validation checks
}

module.exports = validateCommandInput
