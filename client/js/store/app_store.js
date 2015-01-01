var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var $ = require("jquery");

var CHANGE_EVENT = "change";
var _searchSchemas = [];

var AppStore = assign({}, EventEmitter.prototype, {
  fetchSchemas: function() {
    $.ajax({
      url: "/api/schema/",
      type: "GET",
      beforeSend: function(request) {
        request.setRequestHeader("x-jwt", localStorage.getItem("token"));
      },
      success: function(data) {
        console.log("GET request for schema data successful.", data);
        _searchSchemas = AppStore.removeBucketPrefix(data);
        AppStore.emitChange();
      },
      error: function() {
        console.log("GET request for schema data failed.");
      }
    });
  },

  removeBucketPrefix: function(bucketArray) {
    var buckets = [];
    bucketArray.forEach(function(schema) {
      schema = schema.substr(schema.indexOf("-") + 1);
      buckets.push({
        name: AppStore.formatSearchStringResult(schema),
        route: schema
      });
    });
    return buckets;
  },

  formatSearchStringResult: function(string) {
    return string.split("-").map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(" ");
  },

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
      _searchSchemas: _searchSchemas
    };
  },

  getFormData: function(arrayOfFormKeys, refs) {
    var data = {};
    arrayOfFormKeys.forEach(function(key) {
      data[key] = refs[key].getDOMNode().value;
    });
    return data;
  }
});

//We need to find an elegant way to do this.
//Needs to happen at each event: AppStore.emitChange();

module.exports = AppStore;
