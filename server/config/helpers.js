module.exports = {
  endFormParse: function(response) {
    response.writeHead(303, {Connection: 'close', Location: '/'});
    response.end();
  },
  errorLogger: function(error, request, response, next) {
    console.error(error.stack);
    next(error);
  },
  errorHandler: function(error, request, response, next) {
    response.send(500, {error: error.message});
  },
  handleBadRequest: function(response, message) {
    response.status(400).send(message);
  }
};
