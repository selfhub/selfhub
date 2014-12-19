var Dispatcher = require('flux').Dispatcher;
var merge = require('../../node_modules/react/lib/merge');

var AppDispatcher = merge(Dispatcher.prototype, {
  handleServerAction: function(action) {
    this.dispatch({
      source: PayloadSources.SERVER_ACTION,
      action: action
    });
  },
  handleViewAction: function(action) {
    this.dispatch({
      source: PayloadSources.VIEW_ACTION,
      action: action
    });
  }
});

module.exports = AppDispatcher;
