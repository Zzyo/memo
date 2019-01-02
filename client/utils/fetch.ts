import 'babel-polyfill';
import 'whatwg-fetch';

export default function(url: string, data: object = {}, method: string = 'GET') {
  return new Promise((resolve: (value: any) => void, reject) => {
    fetch(url, {
      method,
      body: method === 'GET' ? undefined : JSON.stringify(data),
      headers: method === 'GET' ? undefined : {'Content-Type': 'application/json'},
    }).then((response) => {
      return response.json();
    }).then((res) => {
      if (res.result) {
        resolve(res.data);
      } else {
        reject();
      }
    });
  });
}
