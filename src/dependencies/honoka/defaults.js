import { forEach } from './utils';

// honoka default options
const defaults = {
  timeout: 0,
  baseURL: '',
  method: 'get',
  headers: {}
};

// set the default content-type of request methods
forEach(['delete', 'get', 'head'], method => {
  defaults.headers[method] = {};
});

forEach(['post', 'put', 'patch'], method => {
  defaults.headers[method] = {
    'Content-Type': 'application/json'
  };
});

export default defaults;
