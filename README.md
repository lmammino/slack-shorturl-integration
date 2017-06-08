# slack-shorturl-integration

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![Build Status](https://travis-ci.org/lmammino/slack-shorturl-integration.svg?branch=master)](https://travis-ci.org/lmammino/slack-shorturl-integration)
[![Coverage Status](https://coveralls.io/repos/github/lmammino/slack-shorturl-integration/badge.svg?branch=master)](https://coveralls.io/github/lmammino/slack-shorturl-integration?branch=master)


## Create short URLs without leaving Slack!

This repo implements a simple [Slack](https://slack.com/) slash command server to shorten URLs using [Rebrandly](https://www.rebrandly.com) API.

![Slack testing custom url shortener slash command input](https://cdn.scotch.io/22/phIHzpMPSiipHKu8RYh1_test01-slack-url-shortener-slash-command.jpg)

![Slack testing custom url shortener slash command output](https://cdn.scotch.io/22/jx1gxYPlRoaSCZRb1p5j_test02-slack-url-shortener-slash-command-response.jpg)


## Installation

This project requires Node.js version 6.0.0 or higher. In order to install this integration in your Slack organization you will need to create a custom Slack app and activate a new "slash command". You will also need to have a Rebrandly account and a valid apikey.
It should be simple enough to have them, but a dedicated tutorial will be published in the following weeks.

### Run the slash command server on Heroku

#### 1. Clone this repository:

```bash
git clone https://github.com/lmammino/slack-shorturl-integration.git
```

#### 2. Create a new Heroku app:

```bash
cd slack-shorturl-integration
heroku create slack-shorturl-integration
```

Beware that you might need to replace `slack-shorturl-integration` with a unique name for an Heroku app (I might have taken this one 😇)!

#### 3. Configure the app:

```bash
heroku config:set --app slack-shorturl-integration SLACK_TOKEN=<YOUR_SLACK_TOKEN> REBRANDLY_APIKEY=<YOUR_REBRANDLY_APIKEY>
```

Be sure to replace `<YOUR_SLACK_TOKEN>` and `<YOUR_REBRANDLY_APIKEY>` with your actual configuration values

#### 4. Deploy the app:

```bash
git fetch --all
git push heroku master
```

This will produce a long output. At the end of it you should see the URL of the app on Heroku. Copy it and paste it as *Request URL* in the slash command config on your Slack app.

Now your server should be up and running on Heroku. Enjoy it!


## Run the slash command locally (or in a VPS)

#### 1. Clone this repository and install the dependencies:

```bash
git clone https://github.com/lmammino/slack-shorturl-integration.git
cd slack-shorturl-integration
npm i
```

### 2. Configure the app

The app will need to have some environment variable properly set.

To do so, you can copy the file `.env~sample` in `.env` and edit it to provide the correct values for `SLACK_TOKEN` and `REBRANDLY_APIKEY`. You can also specify `PORT` to run the web server in a port of your own choice (by default `80`).

Alternatively you can simply export these variables in your current shell.

### 3. Start the server

Just run:

```bash
npm run start:local
```

or, if you already have the configuration environment variable exported in the current session, you can simply run:

```bash
npm start
```

### 4. Get a public url with Ngrok

The server will now be available in `localhost`. In order for Slack to reach it you will need a publicly available URL.

If you are in a development machine, you can easily get a temporary one using [ngrok](https://ngrok.com/) by running:

```bash
ngrok http 80
```

Change `80` with the number of your port if you are using a custom one.

This command will print a public https URL. You can copy this into your Slack slash command *Request URL*.

That's it! :)


## Bugs and improvements

If you find a bug or have an idea about how to improve the NorrisBot you can [open an issue](https://github.com/lmammino/slack-shorturl-integration/issues) or [submit a pull request](https://github.com/lmammino/slack-shorturl-integration/pulls), it will definitely make you a better person! :P


## The Making of

This code was actually written as part of [a complete tutorial published on Scotch.io](https://scotch.io/tutorials/create-a-custom-slack-slash-command-with-nodejs-and-express). This tutorial explains how to build your own custom Slack slash command using Node.js and Express. That's the reason why I tried to keep the code super simple and avoid additional complexity such as *Babel* and *ES201X*.

[![Create a custim slack slash command article cover image](https://cdn.scotch.io/1/VGjj7n91QtKd76TK49Ej_create-a-custom-slack-slash-command-with-node.png.jpg)](https://scotch.io/tutorials/create-a-custom-slack-slash-command-with-nodejs-and-express)


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
