/**
 * Buffer utility functions
 * @module server/utils/buffer
 * @type {{indexOf: Function}}
 */
module.exports = {
  /**
   * Get the index of the first instance of the element in the buffer. Return
   * -1 if the buffer does not contain the character code.
   * @param {Object} buffer the buffer
   * @param {number} element the element
   * @returns {!number} index of the first instance of the element in the
   * buffer, or -1
   */
  indexOf: function(buffer, element) {
    var bufferLength = buffer.length;
    for (var i = 0; i < bufferLength; i++) {
      if (buffer[i] === element) {
        return i;
      }
    }
    return -1;
  }
};
