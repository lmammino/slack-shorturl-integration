// @flow
import request from 'request-promise-native';

const createClient = (apikey : String) => (
  {
    listDomains() {
      return request({
        url: 'https://api.rebrandly.com/v1/domains',
        method: 'GET',
        headers: {
          apikey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: true
        }, null, 2)
      })
      .then(res => {
        const domains = JSON.parse(res).reduce((acc, {fullName, id}) => {
          acc[fullName] = { id, ref: `/domains/${id}` };
          return acc;
        }, {});
        return Promise.resolve(domains);
      });
    },

    createLinks(urls: String[], domain: String|void, tags: String[]) {
      const requests = urls.map(url => request({
        url: 'https://api.rebrandly.com/v1/links',
        method: 'POST',
        headers: {
          apikey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destination: url,
          domain: {fullName: domain},
        }, null, 2)
      }));

      return Promise.all(requests)
        .then((res) => Promise.resolve(res.map(JSON.parse)))
      ;
    }
  }
);

export default createClient;
