var expect = require("chai").expect;
var should = require("chai").should();
var express = require("express");
var supertest = require("supertest");
var sinon = require("sinon");

var schemaMatcher = require("../../../server/schemas/schemaMatcher");
var schemaModel = require("../../../server/schemas/schemaModel");

var MOCK_SERVER_PORT = 8080;
var MOCK_ERROR_MESSAGE = "mock message";
var MOCK_HEADERS = new Buffer("firstCol,secondCol\n");

describe("schemaMatcher", function() {
  afterEach(function() {
    schemaModel.findSchema.restore();
  });
  it("passes files with matching schemas", function(done) {
    sinon.stub(schemaModel, "findSchema", function(query, stream, storage) {
      stream.emit("templated");
    });
    schemaMatcher.handle(MOCK_HEADERS, function(err, isValid) {
      expect(isValid).to.equal(true);
      should.not.exist(err);
      done();
    });
  });

  it("doesn't pass files without matching schemas", function(done) {
    sinon.stub(schemaModel, "findSchema", function(query, stream, storage) {
      stream.emit("noTemplate");
    });
    schemaMatcher.handle(MOCK_HEADERS, function(err, isValid) {
      should.exist(err);
      expect(isValid).to.equal(false);
      done();
    });
  });
});
