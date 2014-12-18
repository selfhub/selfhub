module.exports = function(grunt) {
  var jsFiles = [
    'client/**/*.js',
    'server/**/*.js',
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
    },
    browserify: {
      build: {
        src: 'client/app.js',
        dest: 'output/output.js'  
      },
      options: {
        transform: ['reactify']
      }
    }
  });
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['jshint', 'jscs','browserify']);
};
