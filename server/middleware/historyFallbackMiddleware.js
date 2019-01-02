module.exports = () => (ctx, next) => {
  const { headers, method } = ctx;
  const { accept } = headers;
  if (method === 'GET' && headers && accept.indexOf('application/json') === -1
    && accept.indexOf('text/html') !== -1 && accept.indexOf('*/*') !== -1) {
    ctx.url = '/';
  }
  return next();
};
