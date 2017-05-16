import Express from 'express';
import bodyParser from 'body-parser';
import createClient from './rebrandlyClient';
import createSlashCommand from './slashCommand';

const app = new Express();
app.use(bodyParser.urlencoded({extended: true}));

const {SLACK_TOKEN: slackToken, REBRANDLY_APIKEY: apiKey} = process.env;

if (!slackToken || !apiKey) {
  console.error('missing environment variables SLACK_TOKEN and/or REBRANDLY_APIKEY');
  process.exit(1);
}

const rebrandlyClient = createClient(process.env.REBRANDLY_APIKEY);
const slashCommand = createSlashCommand(rebrandlyClient, process.env.SLACK_TOKEN)

app.post('/', async (req, res) => {
  console.log(req.body);
  const response = await slashCommand(req.body);
  res.send(response);
});

app.listen(3000, console.log);
