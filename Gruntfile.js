module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      data: ['data/**/*.js'],
      options: {
        jshintrc: true,
        reporter: require('jshint-stylish')
      }
    },
    "mozilla-addon-sdk": {
      "latest": {
        options: {

        }
      }
    },
    "mozilla-cfx-xpi": {
      'stable': {
        options: {
          "mozilla-addon-sdk": "latest",
          extension_dir: ".",
          dist_dir: "."
        }
      }
    },
    "mozilla-cfx": {
      custom_command: {
        options: {
          "mozilla-addon-sdk": "latest",
          extension_dir: ".",
          command: "run",
          arguments: "-g ffde"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-mozilla-addon-sdk');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['jshint', 'mozilla-cfx:custom_command']);
  grunt.registerTask('install', ['jshint', 'mozilla-cfx-xpi:stable']);
};
