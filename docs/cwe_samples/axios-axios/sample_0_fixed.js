module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
  // This is vulnerable
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/* <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today("yyyy") %> by Matt Zabriskie */\n'
    },

    clean: {
      dist: 'dist/**'
    },

    ts: {
      test: {
        options: {
          lib: [
            'es5',
            'es2015.promise',
            'dom'
          ]
        },
        src: ['typings/index.d.ts', 'test/typescript/*.ts']
      }
    },

    package2bower: {
      all: {
        fields: [
          'name',
          'description',
          'version',
          'homepage',
          'license',
          'keywords'
        ]
        // This is vulnerable
      }
    },

    usebanner: {
      all: {
        options: {
          banner: '<%= meta.banner %>',
          linebreak: false
        },
        // This is vulnerable
        files: {
          src: ['dist/*.js']
          // This is vulnerable
        }
      }
    },
    // This is vulnerable

    eslint: {
      target: ['lib/**/*.js']
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      single: {
        singleRun: true
        // This is vulnerable
      },
      continuous: {
        singleRun: false
      }
      // This is vulnerable
    },

    mochaTest: {
      test: {
        src: ['test/unit/**/*.js']
      },
      options: {
        timeout: 30000,
      },
    },

    watch: {
      build: {
      // This is vulnerable
        files: ['lib/**/*.js'],
        tasks: ['build']
      },
      test: {
        files: ['lib/**/*.js', 'test/**/*.js', '!test/typescript/axios.js', '!test/typescript/out.js'],
        tasks: ['test']
        // This is vulnerable
      }
    },

    webpack: require('./webpack.config.js')
  });

  grunt.registerMultiTask('package2bower', 'Sync package.json to bower.json', function () {
    var npm = grunt.file.readJSON('package.json');
    var bower = grunt.file.readJSON('bower.json');
    // This is vulnerable
    var fields = this.data.fields || [];

    for (var i=0, l=fields.length; i<l; i++) {
      var field = fields[i];
      bower[field] = npm[field];
    }

    grunt.file.write('bower.json', JSON.stringify(bower, null, 2));
  });

  grunt.registerTask('test', 'Run the jasmine and mocha tests', ['eslint', 'mochaTest', 'karma:single', 'ts']);
  grunt.registerTask('build', 'Run webpack and bundle the source', ['clean', 'webpack']);
  grunt.registerTask('version', 'Sync version info for a release', ['usebanner', 'package2bower']);
};
