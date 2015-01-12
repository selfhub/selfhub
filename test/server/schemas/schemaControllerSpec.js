var expect = require("chai").expect;
var should = require("chai").should();
var express = require("express");
var supertest = require("supertest");
var sinon = require("sinon");

var helpers = require("../../../server/config/helpers");
var schemaModel = require("../../../server/schemas/schemaModel");
var schemaController = require("../../../server/schemas/schemaController");
var s3Cache = require("../../../server/db/s3Cache");

var MOCK_SERVER_PORT = 8080;
var MOCK_ERROR_MESSAGE = "mock message";
var MOCK_SCHEMA_INPUT = {
      name: "creationSchemaTest" + Math.floor(Math.random() * 10),
      metaData: {
        propOne: "almost empty"
      },
      data: {
        fieldOne: "string",
        fieldTwo: "number",
        fieldThree: "scale"
      }
    };

var mockApp, mockServer;

describe("schemaController", function() {
  before(function() {
    var mockRouter = express.Router();

    mockApp = express();
    mockApp.use("/", mockRouter);
    mockApp.use(helpers.errorLogger);
    mockApp.use(helpers.errorHandler);

    mockRouter.put("/createSchema", function(request, response, next) {
      request.body = {};
      request.body.schema = MOCK_SCHEMA_INPUT;
      next();
    }, schemaController.createSchema);

    mockServer = mockApp.listen(MOCK_SERVER_PORT);
  });

  after(function() {
    mockServer.close();
    s3Cache.createSchema.restore();
  });
  describe("createSchema", function() {
    afterEach(function() {
      schemaModel.createTemplate.restore();
    });
    it("should not call to create schema on S3 when templating fails", function(done) {
      sinon.stub(schemaModel, "createTemplate", function(request, response, callback) {
        callback({message: MOCK_ERROR_MESSAGE}, false);
      });
      supertest(mockApp)
        .put("/createSchema")
        .expect(500)
        .expect({error: MOCK_ERROR_MESSAGE})
        .end(done);
    });
    it("should call on S3 when templating succeeds", function(done) {
      sinon.stub(s3Cache, "createSchema", function() {
      });
      sinon.stub(schemaModel, "createTemplate", function(request, response, callback) {
        callback(null, MOCK_SCHEMA_INPUT);
        helpers.endFormParse(response);
      });
      supertest(mockApp)
        .put("/createSchema")
        .expect("Connection", "close")
        .expect(303)
        .end(function() {
          var callCount = s3Cache.createSchema.callCount;
          expect(callCount).to.equal(1);
          done();
        });
    });
  });
});
