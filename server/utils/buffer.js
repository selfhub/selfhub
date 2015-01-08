module.exports = {
  /**
   * Get the index of the first instance of the character code in the buffer. Return -1 if the
   * buffer does not contain the character code.
   * @param {Object} buffer the buffer
   * @param {number} charCode the character code
   * @returns {!number} index of the first instance of the character code in the buffer, or -1
   */
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
