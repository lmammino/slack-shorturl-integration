const commandParser = require('./commandParser')
const validateCommandInput = require('./validateCommandInput')

const slashCommandFactory = (createShortUrls, slackToken) => (body) => new Promise((resolve, reject) => {
  if (!body) {
    return reject(new Error('Invalid body'))
  }

  if (slackToken !== body.token) {
    return reject(new Error('Invalid token'))
  }

  const { urls, domain, slashtags } = commandParser(body.text)

  let error
  if ((error = validateCommandInput)) {
    // TODO manage error
    console.error(error)
  }

  createShortUrls(urls, domain, slashtags)
    .then((result) => {
      console.log(result)
      // TODO format the response as a slack slash command response
      return resolve(JSON.stringify(result, null, 2))
    })
})

module.exports = slashCommandFactory
