var EventEmitter = require("events").EventEmitter;
var assign = require("object-assign");
var $ = require("jquery");

var CHANGE_EVENT = "change";
var _searchSchemas = [];
var _displaySchema = false;

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
        console.error("GET request for schema data failed.");
      }
    });
  },

  uploadData: function(filename, file, schemaName) {
    var token = localStorage.getItem("token");
    var formData = new FormData();
    formData.append("File", file, filename);
    $.ajax({
      type: "PUT",
      beforeSend: function(request) {
        request.setRequestHeader("x-jwt", token);
      },
      url: "/api/schema/" + schemaName + "/" + token,
      data: formData,
      processData: false,
      contentType: false,
      success: function(data) {
        console.log(data);
      },
      error: function(error) {
        console.error(error);
      }
    });
  },

  renderSchema: function(schemaName) {
    $.ajax({
      url: "/api/schema/" + schemaName,
      type: "GET",
      beforeSend: function(request) {
        request.setRequestHeader("x-jwt", localStorage.getItem("token"));
      },
      success: function(data) {
        console.log("GET request for schema data successful.", data);
        _displaySchema = data;
        AppStore.emitChange();
      },
      error: function(error) {
        console.error(error);
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
      _searchSchemas: _searchSchemas,
      _displaySchema: _displaySchema
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
