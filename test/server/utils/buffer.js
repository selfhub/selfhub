var expect = require("chai").expect;
var bufferUtils = require("../../../server/utils/buffer");

describe("buffer utils", function() {
  describe("indexOf", function() {
    it("finds index of character code", function() {
      var char = "\n";
      var string = "asdf" + char + "qwer";
      var index = string.indexOf(char);
      var charCode = string.charCodeAt(index);
      var buffer = new Buffer(string);
      var bufferIndex = bufferUtils.indexOf(buffer, charCode);
      expect(bufferIndex).to.equal(index);
    });

    it("returns -1 when character code is not in buffer", function() {
      var string = "asdfqwer";
      var charCode = "z".charCodeAt(0);
      var buffer = new Buffer(string);
      var bufferIndex = bufferUtils.indexOf(buffer, charCode);
      expect(bufferIndex).to.equal(-1);
    });
  });
});
