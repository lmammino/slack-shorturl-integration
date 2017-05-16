// @flow

import tokenizer from 'string-tokenizer';
import createUrlRegex from 'url-regex';

const makeArray = (input : Array<String> | String | void) : Array<String> => {
  if (typeof input === 'undefined' || input === null) {
    return [];
  }

  if (Array.isArray(input)) {
    return input;
  }

  return [input];
}

/*::
type ParseMessageResult = {
  urls: Array<String>,
  domain: String|void,
  tags: Array<String>,
};
*/

const parseMessage = (message: string) : ParseMessageResult => {
  const tokens = tokenizer()
    .input(message)
    .token('url', createUrlRegex())
    .token('domain', /(?:@)((?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*\.[a-z\\u00a1-\\uffff]{2,})/, match => match[2])
    .token('tag', /(?:#)(\w{2,})/, match => match[2])
    .resolve()
  ;

  return {
    urls: makeArray(tokens.url),
    domain: tokens.domain,
    tags: makeArray(tokens.tag),
  }
}

export default parseMessage;
