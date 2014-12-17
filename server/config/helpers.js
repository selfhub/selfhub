module.exports = {
  errorLogger: function(error, req, res, next) {
    console.error(error.stack);
    next(error);
  },
  errorHandler: function(error, req, res, next) {
    res.send(500, {error: error.message});
  }
};
