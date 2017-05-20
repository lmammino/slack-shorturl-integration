const commandParser = require('./commandParser')
const validateCommandInput = require('./validateCommandInput')

const createErrorAttachment = (error) => ({
  color: 'danger',
  text: `*Error*:\n${error.message}`,
  mrkdwn_in: ['text']
})

const createSuccessAttachment = (link) => ({
  color: 'good',
  text: `*<http://${link.shortUrl}|${link.shortUrl}>* (<https://www.rebrandly.com/links/${link.id}|edit>):\n${link.destination}`,
  mrkdwn_in: ['text']
})

const createAttachment = (result) => {
  if (result.constructor === Error) {
    return createErrorAttachment(result)
  }

  return createSuccessAttachment(result)
}

const slashCommandFactory = (createShortUrls, slackToken) => (body) => new Promise((resolve, reject) => {
  if (!body) {
    return resolve({
      text: '',
      attachments: [createErrorAttachment(new Error('Invalid body'))]
    })
  }

  if (slackToken !== body.token) {
    return resolve({
      text: '',
      attachments: [createErrorAttachment(new Error('Invalid token'))]
    })
  }

  const { urls, domain, slashtags } = commandParser(body.text)

  let error
  if ((error = validateCommandInput(urls, domain, slashtags))) {
    return resolve({
      text: '',
      attachments: [createErrorAttachment(error)]
    })
  }

  createShortUrls(urls, domain, slashtags)
    .then((result) => {
      return resolve({
        text: `${result.length} link(s) processed`,
        attachments: result.map(createAttachment)
      })
    })
})

module.exports = slashCommandFactory
