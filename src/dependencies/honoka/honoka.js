import {
  trimStart,
  trimEnd,
  isAbsoluteURL,
  buildURL,
  normalizeHeaders,
  isObject,
  isArray,
  isString,
  forEach,
  reduce
} from './utils';
import defaults from './defaults';
import methods from './methods';
import interceptors from './interceptors';

function honoka(url, options = {}) {
  options = {
    ...defaults,
    ...options
  };

  options.method = options.method.toLowerCase();

  if (typeof url !== 'string') {
    throw new TypeError(`Argument 1 expected string but got ${typeof url}`);
  }

  if (!isAbsoluteURL(url)) {
    url = trimEnd(options.baseURL, '/') + '/' + trimStart(url, '/');
  }

  if (options.method === 'get' && isObject(options.data)) {
    url = buildURL(url, options.data);
  }

  normalizeHeaders(options.headers);

  // Set default headers for specified methods
  const methodDefaultHeaders = defaults.headers[options.method];
  if (isObject(methodDefaultHeaders)) {
    options.headers = {
      ...methodDefaultHeaders,
      ...options.headers
    };
  }

  forEach(methods, method => {
    delete options.headers[method];
  });

  if (options.headers['Content-Type'] === 'application/json') {
    options.body = JSON.stringify(options.data);
  } else if (
    isString(options.headers['Content-Type']) &&
    options.headers['Content-Type'].indexOf(
      'application/x-www-form-urlencoded'
    ) > -1
  ) {
    const searchParams = new URLSearchParams(options.data);
    options.body = searchParams;
  } else if (
    options.data &&
    (options.method !== 'get' && options.method !== 'head')
  ) {
    options.body = options.data;
  }

  if (options.headers['Content-Type'] === 'multipart/form-data') {
    delete options.headers['Content-Type'];
  }

  // parse interceptors
  const reversedInterceptors = reduce(
    interceptors.get(),
    (array, interceptor) => [interceptor, ...array],
    []
  );

  forEach(reversedInterceptors, interceptor => {
    if (interceptor.request) {
      const interceptedOptions = interceptor.request(options);
      if (isObject(interceptedOptions)) {
        options = interceptedOptions;
      } else {
        throw new Error(
          'Apply request interceptor failed, please check your interceptor'
        );
      }
    }
  });

  return new Promise((resolve, reject) => {
    if (options.timeout > 0) {
      setTimeout(() => {
        reject(new Error('Request timeout'));
      }, options.timeout);
    }

    fetch(url, options)
      .then(response => {
        honoka.response = response;

        response
          .clone()
          .text()
          .then(responseData => {
            const ct = response.headers.get('Content-Type');
            if (ct && ct.match(/application\/json/i)) {
              responseData = JSON.parse(responseData);
            }

            forEach(reversedInterceptors, interceptor => {
              if (interceptor.response) {
                const interceptedResponse = interceptor.response(
                  responseData,
                  response
                );
                if (
                  isArray(interceptedResponse) &&
                  interceptedResponse.length === 2
                ) {
                  responseData = interceptedResponse[0];
                  honoka.response = response = interceptedResponse[1];
                } else {
                  reject(
                    new Error(
                      'Apply response interceptor failed, please check your interceptor'
                    )
                  );
                }
              }
            });

            if (response.status >= 200 && response.status < 400) {
              resolve(responseData);
            } else {
              reject(new Error('Not expected status code', response.status));
            }
          });
      })
      .catch(e => {
        reject(e);
      });
  });
}

honoka.defaults = defaults;
honoka.interceptors = interceptors;
// Let's export the library version
honoka.version = process.env.HONOKA_VERSION;

// Provide aliases for supported request methods
forEach(methods, method => {
  honoka[method] = (url, options) => {
    return honoka(url, {
      method,
      ...options
    });
  };
});

export default honoka;
