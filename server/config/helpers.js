var errorHandler = function(error, request, response, next) {
  response.status(500).send({error: error.message});
};

module.exports = {
  endFormParse: function(response) {
    response.writeHead(303, {Connection: 'close', Location: '/'});
    response.end();
  },
  errorLogger: function(error, request, response, next) {
    console.error(error.stack);
    next(error);
  },
  errorHandler: errorHandler,
  getAWSCallbackHandler: function(request, response) {
    return function(error, data) {
      if (error) {
        errorHandler(error, request, response);
      } else {
        response.status(201).send(data);
      }
    };
  },
  handleBadRequest: function(response, message) {
    response.status(400).send(message);
  }
};
