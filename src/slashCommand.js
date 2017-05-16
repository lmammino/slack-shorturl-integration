import parseMessage from './parseMessage';

const createSlashCommand = (rebrandlyClient, slackToken) => (body) => new Promise((resolve, reject) => {
  if (!body) {
    return reject(new Error('Invalid body'));
  }

  if (slackToken !== body.token) {
    return reject(new Error('Invalid token'));
  }

  const { urls, domain, tags } = parseMessage(body.text);

  // TODO add defensive checks

  rebrandlyClient.createLinks(urls, domain, tags)
    .then((result) => {
      console.log(result);
      return resolve(JSON.stringify(result, null, 2));
    })
  ;
});

export default createSlashCommand;
