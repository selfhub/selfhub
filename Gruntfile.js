module.exports = function(grunt) {
  var jsFiles = [
    'client/js/**/*.js',
    'server/**/*.js',
    '*.js'
  ];

  var jsxFiles = [
    'client/js/**/*.jsx'
  ];

  var jsxAndjsFiles = jsxFiles.concat(jsFiles);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      options: {
        transform: ['reactify']
      },
      build: {
        src: 'client/js/main.jsx',
        dest: 'client/build.js'
      }
    },
    jscs: {
      src: jsFiles
    },
    jshint: {
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      },
      all: jsxAndjsFiles
    },
    watch: {
      files: jsxAndjsFiles,
      tasks: ['jshint', 'jscs', 'browserify']
    }
  });

  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['jshint', 'jscs', 'browserify']);
  grunt.registerTask('build', ['browserify']);
};
