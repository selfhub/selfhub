module.exports = function(grunt) {
  var jsFiles = [
    'client/**/*.js',
    'server/**/*.js',
    '*.js'
  ];

  var jsxFiles = [
    'client/**/*.jsx'
  ];

  var jsxAndjsFiles = jsxFiles.concat(jsFiles);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      all: jsxAndjsFiles
    },
    jscs: {
      src: jsFiles
    },
    browserify: {
      options: {
        transform: ['reactify']
      },
      build: {
        src: 'client/app.js',
        dest: 'build/build.js'
      }
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['jshint', 'jscs', 'browserify']);
  grunt.registerTask('build', ['browserify']);
};
