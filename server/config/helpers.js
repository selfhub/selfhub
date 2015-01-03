/**
 * Handle errors by responding with 500 and the error message.
 * @param {Object} error the error object
 * @param {Object} request the http ClientRequest object
 * @param {Object} response the http ServerResponse object
 * @param {Function} next the next function to invoke
 */
var errorHandler = function(error, request, response, next) {
  response.status(500).send({error: error.message});
};

module.exports = {
  /**
   * End form parse by responding with 303, closing connection, and redirecting.
   * @param {Object} response the http ClientRequest object
   */
  endFormParse: function(response) {
    response.writeHead(303, {Connection: "close", Location: "/"});
    response.end();
  },

  /**
   * Log error.
   * @param {Object} error the error object
   * @param {Object} request the http ClientRequest object
   * @param {Object} response the http ServerResponse object
   * @param {Function} next the next function to invoke
   */
  errorLogger: function(error, request, response, next) {
    console.error(error.stack);
    next(error);
  },

  errorHandler: errorHandler,

  /**
   * Get a callback function to handle AWS responses.
   * @param {Object} request the http ClientRequest object
   * @param {Object} response the http ServerResponse object
   * @param {number} successStatusCode the status code to return on success
   * @returns {s3Callback} a callback that handles AWS responses
   */
  getAWSCallbackHandler: function(request, response, successStatusCode) {
    successStatusCode = successStatusCode || 200;
    return function(error, data) {
      if (error) {
        errorHandler(error, request, response);
      } else {
        response.status(successStatusCode).send(data);
      }
    };
  },

  /**
   * Respond with 400 and a message.
   * @param {Object} response the http ServerResponse object
   * @param {string} message the response message
   */
  handleBadRequest: function(response, message) {
    response.status(400).send(message);
  }
};
