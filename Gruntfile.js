module.exports = function(grunt) {
  var jsFiles = [
    "client/js/**/*.js",
    "server/**/*.js",
    "test/**/*.js",
    "*.js"
  ];

  var jsxFiles = [
    "client/js/**/*.jsx"
  ];

  var jsxAndjsFiles = jsxFiles.concat(jsFiles);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    browserify: {
      options: {
        transform: ["reactify"]
      },
      build: {
        src: "client/js/main.jsx",
        dest: "client/build.js"
      }
    },
    jscs: {
      src: jsFiles
    },
    jsdoc: {
      dist: {
        src: jsFiles
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      all: jsxAndjsFiles
    },
    mochaTest: {
      test: {
        src: ["test/**/*.js"]
      }
    },
    watch: {
      files: jsxAndjsFiles,
      tasks: ["browserify"]
    }
  });

  require("load-grunt-tasks")(grunt);
  grunt.registerTask("default", ["jshint", "jscs", "mochaTest", "browserify"]);
  grunt.registerTask("build", ["browserify"]);
  grunt.registerTask("doc", ["jsdoc"]);
  grunt.registerTask("style", ["jshint", "jscs"]);
  grunt.registerTask("test", ["jshint", "jscs", "mochaTest"]);
};
