var expect = require("chai").expect;
var sinon = require("sinon");
var _ = require("lodash");

var s3Cache = require("../../../server/db/s3Cache");
var s3 = require("../../../server/db/s3");
var isEntryMetadataCacheValid = s3Cache._testObject.isEntryMetadataCacheValid;
var isSchemaNamesCacheValid = s3Cache._testObject.isSchemaNamesCacheValid;

var MOCK_CALLBACK = function(error, data) {
  return error ? "error" : "data";
};

var MOCK_DATA = "data data";
var MOCK_DATE = _.now();
var MOCK_ERROR = new Error("mock error");
var MOCK_SCHEMA_NAME = "mock-schema";
var MOCK_SIZE = 1337;
var MOCK_USERID = "user123";
var MOCK_ENTRY_METADATA = {
  userID: MOCK_USERID,
  size: MOCK_SIZE,
  lastModified: MOCK_DATE
};

describe("S3 cache operations", function() {
  describe("create operations", function() {
    describe("createSchema on success", function() {
      it("caches schema name", function(done) {
        sinon.stub(s3, "createSchema", function(schemaName, callback) {
          callback();
        });
        sinon.stub(s3, "getSchemaNames", function(callback) {
          callback(null, []);
        });
        expect(isSchemaNamesCacheValid()).to.be.false();
        s3Cache.getSchemaNames(function() {
          expect(isSchemaNamesCacheValid()).to.be.true();
          s3Cache.createSchema(MOCK_SCHEMA_NAME, function() {
            expect(isSchemaNamesCacheValid()).to.be.true();
            s3Cache.getSchemaNames(function(error, data) {
              expect(error).to.be.null();
              expect(data).to.deep.equal([MOCK_SCHEMA_NAME]);
              done();
            });
          });
        });
      });
      afterEach(function() {
        s3.createSchema.restore();
        s3.getSchemaNames.restore();
      });
    });

    describe("createSchema on error", function() {
      beforeEach(function() {
        sinon.stub(s3, "getSchemaNames", function(callback) {
          callback(null, [MOCK_SCHEMA_NAME]);
        });
      });
      it("invalidates schema names cache", function(done) {
        sinon.stub(s3, "createSchema", function(schemaName, callback) {
          callback(MOCK_ERROR);
        });
        s3Cache.getSchemaNames(function() {
          expect(isSchemaNamesCacheValid()).to.be.true();
          s3Cache.createSchema(MOCK_SCHEMA_NAME, function() {
            expect(isSchemaNamesCacheValid()).to.be.false();
            done();
          });
        });
      });
      afterEach(function() {
        s3.createSchema.restore();
        s3.getSchemaNames.restore();
      });
    });

    describe("createEntry", function() {
      beforeEach(function() {
        sinon.stub(s3, "getEntriesMetadataForSchema", function(schemaName, callback) {
          callback(null, MOCK_ENTRY_METADATA);
        });
      });
      it("invalidates schema's metadata cache", function(done) {
        sinon.stub(s3, "createEntry", function(schemaName, userID, data, callback) {
          callback();
        });
        s3Cache.getEntriesMetadataForSchema(MOCK_SCHEMA_NAME, function() {
          expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.true();
          s3Cache.createEntry(MOCK_SCHEMA_NAME, MOCK_USERID, MOCK_DATA, function() {
            expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.false();
            done();
          });
        });
      });
      afterEach(function() {
        s3.createEntry.restore();
        s3.getEntriesMetadataForSchema.restore();
      });
    });
  });

  describe("read operations", function() {
    describe("getSchemaNames", function() {
      it("doesn't cache on error", function(done) {
        sinon.stub(s3, "getSchemaNames", function(callback) {
          callback(MOCK_ERROR);
        });
        expect(isSchemaNamesCacheValid()).to.be.false();
        s3Cache.getSchemaNames(function(error) {
          expect(isSchemaNamesCacheValid()).to.be.false();
          expect(error).to.deep.equal(MOCK_ERROR);
          done();
        });
      });
      it("calls back with validated cached data", function(done) {
        sinon.stub(s3, "getSchemaNames", function(callback) {
          callback(null, [MOCK_SCHEMA_NAME]);
        });
        expect(isSchemaNamesCacheValid()).to.be.false();
        s3Cache.getSchemaNames(function(error, data) {
          expect(isSchemaNamesCacheValid()).to.be.true();
          expect(data).to.deep.equal([MOCK_SCHEMA_NAME]);
          s3Cache.getSchemaNames(function(error, data) {
            expect(isSchemaNamesCacheValid()).to.be.true();
            expect(data).to.deep.equal([MOCK_SCHEMA_NAME]);
            sinon.assert.calledOnce(s3.getSchemaNames);
            done();
          });
        });
      });
      afterEach(function() {
        s3.getSchemaNames.restore();
      });
    });

    describe("getData", function() {
      it("forwards to s3", function() {
        sinon.stub(s3, "getData", function(schemaName, userId, response) {
          // do nothing
        });
        s3Cache.getData(MOCK_SCHEMA_NAME, MOCK_USERID, MOCK_CALLBACK);
        sinon.assert.calledWithMatch(s3.getData, MOCK_SCHEMA_NAME, MOCK_USERID, MOCK_CALLBACK);
      });
      afterEach(function() {
        s3.getData.restore();
      });
    });

    describe("getEntriesMetadataForSchema", function() {
      it("doesn't cache on error", function(done) {
        sinon.stub(s3, "getEntriesMetadataForSchema", function(schemaName, callback) {
          callback(MOCK_ERROR);
        });
        expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.false();
        s3Cache.getEntriesMetadataForSchema(MOCK_SCHEMA_NAME, function(error) {
          expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.false();
          expect(error).to.deep.equal(error);
          done();
        });
      });
      it("caches and calls back with validated cached data", function(done) {
        sinon.stub(s3, "getEntriesMetadataForSchema", function(schemaName, callback) {
          callback(null, MOCK_ENTRY_METADATA);
        });
        sinon.stub(s3, "deleteSchema", function(schemaName, callback) {
          callback();
        });
        expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.false();
        s3Cache.getEntriesMetadataForSchema(MOCK_SCHEMA_NAME, function(error, data) {
          expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.true();
          expect(data).to.deep.equal(MOCK_ENTRY_METADATA);
          s3Cache.getEntriesMetadataForSchema(MOCK_SCHEMA_NAME, function(error, data) {
            expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.true();
            expect(data).to.deep.equal(MOCK_ENTRY_METADATA);
            sinon.assert.calledOnce(s3.getEntriesMetadataForSchema);
            // cleanup
            s3Cache.deleteSchema(MOCK_SCHEMA_NAME, function(error, data) {
              done();
            });
          });
        });
      });
      afterEach(function() {
        s3.getEntriesMetadataForSchema.restore();
      });
      after(function() {
        s3.deleteSchema.restore();
      });
    });
  });

  describe("update operations", function() {
    describe("appendEntry", function() {
      it("invalidates schema's entry's metadata cache", function(done) {
        sinon.stub(s3, "appendEntry", function(schemaName, userID, data, callback) {
          callback(null, MOCK_DATA);
        });
        sinon.stub(s3, "getEntriesMetadataForSchema", function(schemaName, callback) {
          callback(null, MOCK_ENTRY_METADATA);
        });
        expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.false();
        s3Cache.getEntriesMetadataForSchema(MOCK_SCHEMA_NAME, function(error, data) {
          expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.true();
          s3Cache.appendEntry(MOCK_SCHEMA_NAME, MOCK_USERID, MOCK_USERID, function() {
            expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.false();
            done();
          });
        });
      });
      afterEach(function() {
        s3.appendEntry.restore();
        s3.getEntriesMetadataForSchema.restore();
      });
    });
  });

  describe("delete operations", function() {
    beforeEach(function() {
      sinon.stub(s3, "createSchema", function(schemaName, callback) {
        callback();
      });
      sinon.stub(s3, "getSchemaNames", function(callback) {
        callback(null, [MOCK_SCHEMA_NAME]);
      });
      sinon.stub(s3, "getEntriesMetadataForSchema", function(schemaName, callback) {
        callback(null, MOCK_ENTRY_METADATA);
      });
    });
    describe("deleteSchema", function() {
      it("invalidates schemaNames cache and schemaName's metadata cache on error", function(done) {
        sinon.stub(s3, "deleteSchema", function(schemaName, callback) {
          callback(MOCK_ERROR);
        });
        s3Cache.createSchema(MOCK_SCHEMA_NAME, function() {
          s3Cache.getSchemaNames(function() {
            expect(isSchemaNamesCacheValid()).to.be.true();
            s3Cache.getEntriesMetadataForSchema(MOCK_SCHEMA_NAME, function() {
              expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.true();
              s3Cache.deleteSchema(MOCK_SCHEMA_NAME, function() {
                expect(isSchemaNamesCacheValid()).to.be.false();
                expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.false();
                done();
              });
            });
          });
        });
      });
      it("removes schemaName's metadata on success", function(done) {
        sinon.stub(s3, "deleteSchema", function(schemaName, callback) {
          callback();
        });
        s3Cache.createSchema(MOCK_SCHEMA_NAME, function() {
          s3Cache.getSchemaNames(function() {
            expect(isSchemaNamesCacheValid()).to.be.true();
            s3Cache.getEntriesMetadataForSchema(MOCK_SCHEMA_NAME, function() {
              expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.true();
              s3Cache.deleteSchema(MOCK_SCHEMA_NAME, function() {
                expect(isSchemaNamesCacheValid()).to.be.true();
                expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.false();
                done();
              });
            });
          });
        });
      });
      afterEach(function() {
        s3.deleteSchema.restore();
      });
    });

    describe("deleteEntry", function() {
      it("invalidates schema's entry metadata cache", function(done) {
        sinon.stub(s3, "deleteEntry", function(schemaName, userID, callback) {
          callback();
        });
        s3Cache.createSchema(MOCK_SCHEMA_NAME, function() {
          s3Cache.getSchemaNames(function() {
            expect(isSchemaNamesCacheValid()).to.be.true();
            s3Cache.getEntriesMetadataForSchema(MOCK_SCHEMA_NAME, function() {
              expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.true();
              s3Cache.deleteEntry(MOCK_SCHEMA_NAME, MOCK_USERID, function() {
                expect(isSchemaNamesCacheValid()).to.be.true();
                expect(isEntryMetadataCacheValid(MOCK_SCHEMA_NAME)).to.be.false();
                done();
              });
            });
          });
        });
      });
      afterEach(function() {
        s3.deleteEntry.restore();
      });
    });
    afterEach(function() {
      s3.createSchema.restore();
      s3.getSchemaNames.restore();
      s3.getEntriesMetadataForSchema.restore();
    });
  });
});
