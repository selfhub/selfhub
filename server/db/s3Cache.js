var _ = require("lodash");
var s3 = require("./s3");

/**
 * cache lifetime, in milliseconds
 * @constant
 * @default
 * @type {number}
 */
var CACHE_LIFETIME_MS = Number.POSITIVE_INFINITY;

/**
 * a cache of schema names
 * @type {{time: number, schemas: Object}}
 */
var schemaNamesCache = {
  time: 0,
  schemas: {}
};

/**
 * a cache which maps schema names to metadata of entries
 * @type {Object}
 */
var schemasToEntryMetadataCaches = {};

/**
 * Get whether the schema names cache is valid.
 * @returns {!boolean} whether the schemas names cache is valid
 */
var isSchemaNamesCacheValid = function() {
  return Boolean(schemaNamesCache.time && (_.now() - schemaNamesCache.time) < CACHE_LIFETIME_MS);
};

/**
 * Get whether the schema's entry metadata cache is valid.
 * @param {string} schemaName the schema name
 * @returns {!boolean} whether the schema's entry metadata cache is valid
 */
var isEntryMetadataCacheValid = function(schemaName) {
  var schemaNameCache = schemasToEntryMetadataCaches[schemaName];
  return Boolean(schemaNameCache && (_.now() - schemaNameCache.time) < CACHE_LIFETIME_MS);
};

/**
 * The AWS S3 callback
 * @callback s3Callback
 * @param {Object} error the error response
 * @param {Object} data the data response
 */

/**
 * AWS S3 caching CRUD operations
 * @module server/db/s3Cache
 * @type {{createSchema: Function, createEntry: Function, getSchemaNames: Function,
 *   getData: Function, getEntriesMetadataForSchema: Function, deleteSchema: Function,
 *   deleteEntry: Function}}
 */
module.exports = {
  _testObject: {
    isEntryMetadataCacheValid: isEntryMetadataCacheValid,
    isSchemaNamesCacheValid: isSchemaNamesCacheValid
  },

  /* CREATE operations */

  /**
   * Forward to s3. On error, invalidate the schema names cache. On success, cache the schema name.
   * @param {string} schemaName the schema name
   * @param {s3Callback} callback the callback that handles the AWS response
   */
  createSchema: function(schemaName, callback) {
    s3.createSchema(schemaName, function(error, data) {
      if (error) {
        schemaNamesCache.time = 0;
        callback(error);
      } else {
        schemaNamesCache.schemas[schemaName] = true;
        callback(error, data);
      }
    });
  },

  /**
   * Forward to s3. On callback, invalidate schema's entry metadata cache.
   * @param {string} schemaName the schema name
   * @param {string} userID the userID
   * @param {string} data the entry data
   * @param {s3Callback} callback the callback that handles the AWS response
   */
  createEntry: function(schemaName, userID, data, callback) {
    s3.createEntry(schemaName, userID, data, function(error, data) {
      delete schemasToEntryMetadataCaches[schemaName];
      callback(error, data);
    });
  },

  /* READ operations */

  /**
   * Call back with validated cached data, or forward to s3 and cache the result.
   * @param {s3Callback} callback the callback that handles the AWS response
   */
  getSchemaNames: function(callback) {
    if (isSchemaNamesCacheValid()) {
      callback(null, Object.keys(schemaNamesCache.schemas));
    } else {
      s3.getSchemaNames(function(error, data) {
        if (error) {
          callback(error);
        } else {
          var schemaNames = _.transform(data, function(result, schemaName) {
            result[schemaName] = true;
          }, {});
          schemaNamesCache = {
            schemas: schemaNames,
            time: _.now()
          };
          callback(error, data);
        }
      });
    }
  },

  /**
   * Forward to s3.
   * @param {string} schemaName the schema name
   * @param {string} userID the userID
   * @param {Object} response the http ServerResponse to pipe the entry data
   */
  getData: function(schemaName, userID, response) {
    s3.getData(schemaName, userID, response);
  },

  /**
   * Call back with validated cached data, or forward to s3 and cache the result.
   * @param {string} schemaName the schema name
   * @param {s3Callback} callback the callback that handles the AWS response
   */
  getEntriesMetadataForSchema: function(schemaName, callback) {
    if (isEntryMetadataCacheValid(schemaName)) {
      callback(null, schemasToEntryMetadataCaches[schemaName].entryMetadata);
    } else {
      s3.getEntriesMetadataForSchema(schemaName, function(error, data) {
        if (error) {
          callback(error);
        } else {
          schemasToEntryMetadataCaches[schemaName] = {
            entryMetadata: data,
            time: _.now()
          };
          callback(error, data);
        }
      });
    }
  },

  /* UPDATE operations */

  /**
   * Forward to s3. On callback, invalidate schema's entry's metadata cache.
   * @param {string} schemaName the schema name
   * @param {string} userID the userID
   * @param {data} data the data to append
   * @param {s3callback} callback the callback that handles the AWS response
   */
  appendEntry: function(schemaName, userID, data, callback) {
    s3.appendEntry(schemaName, userID, data, function(error, data) {
      delete schemasToEntryMetadataCaches[schemaName];
      callback(error, data);
    });
  },

  /* DELETE operations */

  /**
   * Forward to s3. On callback, invalidate schema's entry metadata cache. On error, invalidate
   * schema names cache. On success, remove schema name from schema names cache.
   * @param {string} schemaName the schema name
   * @param {s3Callback} callback the callback that handles the AWS response
   */
  deleteSchema: function(schemaName, callback) {
    s3.deleteSchema(schemaName, function(error, data) {
      delete schemasToEntryMetadataCaches[schemaName];
      if (error) {
        schemaNamesCache.time = 0;
        callback(error);
      } else {
        delete schemaNamesCache.schemas[schemaName];
        callback(error, data);
      }
    });
  },

  /**
   * Forward to s3. On callback, invalidate schema's entry metadata cache.
   * @param {string} schemaName the schema name
   * @param {string} userID the userID
   * @param {s3Callback} callback the callback that handles the AWS response
   */
  deleteEntry: function(schemaName, userID, callback) {
    s3.deleteEntry(schemaName, userID, function(error, data) {
      delete schemasToEntryMetadataCaches[schemaName];
      callback(error, data);
    });
  }
};
