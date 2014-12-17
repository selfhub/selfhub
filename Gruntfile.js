module.exports = function(grunt) {
  var jsFiles = [
    '*/*.js',
    '*.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: jsFiles,
      options: {
        reporter: require('jshint-stylish')
      }
    },
    jscs: {
      src: jsFiles
    }
  });
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['jshint', 'jscs']);
};
