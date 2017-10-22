// honoka interceptors injections
const interceptorContainer = [];

export default {
  register: interceptor => {
    interceptorContainer.push(interceptor);
    return () => {
      const index = interceptorContainer.indexOf(interceptor);
      if (index >= 0) {
        interceptorContainer.splice(index, 1);
      }
    };
  },
  clear: () => {
    interceptorContainer.length = 0;
  },
  get: () => interceptorContainer
};
