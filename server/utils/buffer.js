module.exports = {
  indexOf: function(buffer, charCode) {
    var bufferLength = buffer.length;
    var i;
    for (i = 0; i < bufferLength; i++) {
      if (buffer[i] === charCode) {
        return i;
      }
    }
    return -1;
  }
};
