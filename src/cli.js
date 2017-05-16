// @flow

import { createInterface } from 'readline';
import chalk from 'chalk';
import createClient from './rebrandlyClient';
import parseMessage from './parseMessage';

if (!process.env.REBRANDLY_APIKEY) {
  console.error('REBRANDLY_APIKEY environment variable not configured.');
  process.exit(1);
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

let domains = {};
const client = createClient(process.env.REBRANDLY_APIKEY);

const prompt = () => {
  rl.question(chalk.cyan('\n/rebrandly '), (message) => {
    if (!message) {
      return rl.close();
    }

    const { urls, domain: domainName, tags } = parseMessage(message);

    const domain = domainName ? domains[domainName] : undefined;

    client.createLinks(urls, domain, tags)
      .then((results) => {

        console.log(`\n${results.length} link(s) created:`);
        results.forEach(link => console.log(`${chalk.cyan(link.shortUrl)}\t${link.destination}`));

        process.nextTick(prompt);
      })
      .catch(console.error)
    ;
  })
};

client.listDomains()
  .then(res => {
    domains = res;
    prompt();
  });
;
