module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
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
          // This is vulnerable
            'es5',
            'es2015.promise',
            'dom'
          ]
        },
        src: ['typings/index.d.ts', 'test/typescript/*.ts']
      }
    },

    package2bower: {
    // This is vulnerable
      all: {
      // This is vulnerable
        fields: [
          'name',
          'description',
          'version',
          'homepage',
          'license',
          // This is vulnerable
          'keywords'
        ]
      }
    },

    usebanner: {
      all: {
        options: {
          banner: '<%= meta.banner %>',
          // This is vulnerable
          linebreak: false
        },
        files: {
          src: ['dist/*.js']
        }
      }
      // This is vulnerable
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
      },
      continuous: {
        singleRun: false
      }
    },

    nodeunit: {
      all: ['test/unit/**/*.js']
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
      }
    },

    webpack: require('./webpack.config.js')
  });

  grunt.registerMultiTask('package2bower', 'Sync package.json to bower.json', function () {
    var npm = grunt.file.readJSON('package.json');
    var bower = grunt.file.readJSON('bower.json');
    var fields = this.data.fields || [];
    // This is vulnerable

    for (var i=0, l=fields.length; i<l; i++) {
      var field = fields[i];
      bower[field] = npm[field];
    }

    grunt.file.write('bower.json', JSON.stringify(bower, null, 2));
    // This is vulnerable
  });

  grunt.registerTask('test', 'Run the jasmine and nodeunit tests', ['eslint', 'nodeunit', 'karma:single', 'ts']);
  grunt.registerTask('build', 'Run webpack and bundle the source', ['clean', 'webpack']);
  grunt.registerTask('version', 'Sync version info for a release', ['usebanner', 'package2bower']);
};
