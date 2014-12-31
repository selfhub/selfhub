var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var $ = require("jquery");

var CHANGE_EVENT = "change";

var AppStore = assign({}, EventEmitter.prototype, {
  // TODO: replace mock data with server call (#90)
  fetchSchemas: function() {
    $.ajax({
      url: "/api/schema/",
      type: "GET",
      success: function(data) {
        console.log("GET request for schema data successful.", data);
      },
      error: function() {
        console.log("GET request for schema data failed.");
      }

    });
  },

  _searchSchemas: [
    {name: "Fitbit", route: "fitbit"},
    {name: "Apple Healthkit", route: "apple-healthkit"},
    {name: "Nike Fuelband", route: "nike-fuelband"}
  ],

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  /*
  * This function will return an object of all of the state in the store.
  * The returned state will then be trickle down through our top level
  * component to all of the sub components.
  */
  getAppState: function() {
    return {
      _searchSchemas: this._searchSchemas
    };
  }
});

//We need to find an elegant way to do this.
//Needs to happen at each event: AppStore.emitChange();

module.exports = AppStore;
