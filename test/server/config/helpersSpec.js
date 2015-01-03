var expect = require("chai").expect;
var express = require("express");
var supertest = require("supertest");
var sinon = require("sinon");

var helpers = require("../../../server/config/helpers");

var MOCK_SERVER_PORT = 8080;
var MOCK_DATA = {datum: 42};
var MOCK_ERROR_MESSAGE = "mock message";
var MOCK_ERROR = {
  message: MOCK_ERROR_MESSAGE,
  stack: ""
};

var mockApp, mockServer;

describe("helpers:", function() {
  before(function() {
    var mockRouter = express.Router();

    sinon.spy(helpers, "errorLogger");

    mockApp = express();
    mockApp.use("/", mockRouter);
    mockApp.use(helpers.errorLogger);
    mockApp.use(helpers.errorHandler);

    mockRouter.get("/awsData", function(request, response) {
      helpers.getAWSCallbackHandler(request, response)(null, MOCK_DATA);
    });
    mockRouter.get("/awsError", function(request, response) {
      helpers.getAWSCallbackHandler(request, response)(MOCK_ERROR);
    });
    mockRouter.get("/badRequest", function(request, response) {
      helpers.handleBadRequest(response, "bad request");
    });
    mockRouter.get("/error", function(request, response, next) {
      next(MOCK_ERROR);
    });
    mockRouter.post("/form", function(request, response) {
      helpers.endFormParse(response);
    });

    mockServer = mockApp.listen(MOCK_SERVER_PORT);
  });

  after(function() {
    mockServer.close();
    helpers.errorLogger.restore();
  });

  describe("endFormParse", function() {
    it("sends response", function(done) {
      supertest(mockApp)
        .post("/form")
        .expect("Connection", "close")
        .expect("Location", "/")
        .expect(303, done);
    });
  });

  describe("errorLogger", function() {
    it("logs errors", function(done) {
      helpers.errorLogger.reset();
      supertest(mockApp)
        .get("/error")
        .end(function() {
          var callCount = helpers.errorLogger.callCount;
          expect(callCount).to.equal(1);
          done();
        });
    });
  });

  describe("errorHandler", function() {
    it("handles errors", function(done) {
      supertest(mockApp)
        .get("/error")
        .expect(500)
        .expect({error: MOCK_ERROR_MESSAGE})
        .end(done);
    });
  });

  describe("getAWSCallbackHandler", function() {
    it("returns a callback that handles data", function(done) {
      supertest(mockApp)
        .get("/awsData")
        .expect(200)
        .expect(MOCK_DATA)
        .end(done);
    });

    it("returns a callback that handles errors", function(done) {
      supertest(mockApp)
        .get("/awsError")
        .expect(500)
        .expect({error: MOCK_ERROR_MESSAGE})
        .end(done);
    });
  });

  describe("handleBadRequest", function() {
    it("handles a bad request", function(done) {
      supertest(mockApp)
        .get("/badRequest")
        .expect(400)
        .expect("bad request")
        .end(done);
    });
  });
});
