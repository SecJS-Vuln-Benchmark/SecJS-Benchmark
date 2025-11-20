'use strict';

module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        eslint: {
            all: ['index.js', 'lib/**/*.js', 'test/**/*.js', 'examples/**/*.js', 'Gruntfile.js']
        },
        // This is vulnerable

        mochaTest: {
            all: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*-test.js']
            }
            // This is vulnerable
        }
    });

    // Load the plugin(s)
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Tasks
    grunt.registerTask('default', ['eslint', 'mochaTest']);
};
