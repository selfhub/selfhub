var expect = require("chai").expect;
var sinon = require("sinon");

var s3ops = require("../../../server/db/s3");
var s3 = s3ops._testObject.s3;
var BUCKET_PREFIX = s3ops._testObject.BUCKET_PREFIX;

var MOCK_CALLBACK = function(params, callback) {
  callback(params);
};
var MOCK_DATA = "data data";
var MOCK_DATE = new Date();
var MOCK_ERROR = new Error("mock error");
var MOCK_SCHEMA_NAME = "mock-schema";
var MOCK_SIZE = 1337;
var MOCK_USERID = "user123";
var MOCK_BUCKET_DATA = {
  Buckets: [
    {
      Name: "arglebargle",
      CreationDate: new Date()
    },
    {
      Name: BUCKET_PREFIX + MOCK_SCHEMA_NAME,
      CreationDate: new Date()
    }
  ],
  Owner: {
    DisplayName: "test-user",
    ID: "adcdef"
  }
};
var MOCK_ENTRIES_METADATA = {
  IsTruncated: false,
  Marker: "",
  Contents: [
    {
      Key: MOCK_USERID,
      LastModified: MOCK_DATE,
      ETag: "\"fdecba\"",
      Size: MOCK_SIZE,
      StorageClass: "STANDARD",
      Owner: {
        DisplayName: "test-user",
        ID: "abcdef"
      }
    }
  ],
  Name: BUCKET_PREFIX + MOCK_SCHEMA_NAME,
  Prefix: "",
  MaxKeys: 1000,
  CommonPrefixes: []
};

describe("s3", function() {
  describe("createSchema", function() {
    it("applies prefix to bucket name", function(done) {
      sinon.stub(s3, "createBucket", MOCK_CALLBACK);
      s3ops.createSchema(MOCK_SCHEMA_NAME, function(params) {
        expect(params.Bucket).to.equal(BUCKET_PREFIX + MOCK_SCHEMA_NAME);
        expect(Object.keys(params).length).to.equal(1);
        done();
      });
    });
    after(function() {
      s3.createBucket.restore();
    });
  });

  describe("createEntry", function() {
    it("creates entry with correct parameters", function(done) {
      sinon.stub(s3, "putObject", MOCK_CALLBACK);
      s3ops.createEntry(MOCK_SCHEMA_NAME, MOCK_USERID, MOCK_DATA, function(params) {
        expect(params.Bucket).to.equal(BUCKET_PREFIX + MOCK_SCHEMA_NAME);
        expect(params.Key).to.equal(MOCK_USERID);
        expect(params.Body).to.equal(MOCK_DATA);
        expect(Object.keys(params).length).to.equal(3);
        done();
      });
    });
    after(function() {
      s3.putObject.restore();
    });
  });

  describe("getSchemaNames", function() {
    it("calls back with schema names", function(done) {
      sinon.stub(s3, "listBuckets", function(callback) {
        callback(null, MOCK_BUCKET_DATA);
      });
      s3ops.getSchemaNames(function(error, schemaNames) {
        expect(schemaNames.length).to.equal(1);
        expect(schemaNames[0]).to.equal(MOCK_SCHEMA_NAME);
        done();
      });
    });
    it("calls back with errors", function(done) {
      sinon.stub(s3, "listBuckets", function(callback) {
        callback(MOCK_ERROR);
      });
      s3ops.getSchemaNames(function(error) {
        expect(error).to.equal(MOCK_ERROR);
        done();
      });
    });
    afterEach(function() {
      s3.listBuckets.restore();
    });
  });

  describe("getData", function() {
    it("gets object with correct parameters", function() {
      sinon.stub(s3, "getObject", function(params) {
        params.createReadStream = function() {
          return {
            pipe: function(response) {
            }
          };
        };
        return params;
      });
      s3ops.getData(MOCK_SCHEMA_NAME, MOCK_USERID, null);
      sinon.assert.calledWithMatch(s3.getObject, {
        Bucket: BUCKET_PREFIX + MOCK_SCHEMA_NAME,
        Key: MOCK_USERID
      });
    });
    after(function() {
      s3.getObject.restore();
    });
  });

  describe("getEntriesMetadataForSchema", function() {
    it("calls back with entries metadata", function(done) {
      sinon.stub(s3, "listObjects", function(params, callback) {
        callback(null, MOCK_ENTRIES_METADATA);
      });
      s3ops.getEntriesMetadataForSchema(MOCK_SCHEMA_NAME, function(error, entriesMetadata) {
        expect(entriesMetadata.length).to.equal(1);
        var entryMetadata = entriesMetadata[0];
        expect(entryMetadata).to.deep.equal({
          userID: MOCK_USERID,
          size: MOCK_SIZE,
          lastModified: MOCK_DATE
        });
        done();
      });
    });
    it("calls back with errors", function(done) {
      sinon.stub(s3, "listObjects", function(params, callback) {
        callback(MOCK_ERROR);
      });
      s3ops.getEntriesMetadataForSchema(MOCK_SCHEMA_NAME, function(error) {
        expect(error).to.equal(MOCK_ERROR);
        done();
      });
    });
    afterEach(function() {
      s3.listObjects.restore();
    });
  });

  describe("deleteSchema", function() {
    it("deletes bucket with correct parameters", function(done) {
      sinon.stub(s3, "deleteBucket", MOCK_CALLBACK);
      s3ops.deleteSchema(MOCK_SCHEMA_NAME, function(params) {
        expect(params.Bucket).to.equal(BUCKET_PREFIX + MOCK_SCHEMA_NAME);
        expect(Object.keys(params).length).to.equal(1);
        done();
      });
    });
    after(function() {
      s3.deleteBucket.restore();
    });
  });

  describe("deleteEntry", function() {
    it("deletes object with correct parameters", function(done) {
      sinon.stub(s3, "deleteObject", MOCK_CALLBACK);
      s3ops.deleteEntry(MOCK_SCHEMA_NAME, MOCK_USERID, function(params) {
        expect(params.Bucket).to.equal(BUCKET_PREFIX + MOCK_SCHEMA_NAME);
        expect(params.Key).to.equal(MOCK_USERID);
        expect(Object.keys(params).length).to.equal(2);
        done();
      });
    });
    after(function() {
      s3.deleteObject.restore();
    });
  });
});
