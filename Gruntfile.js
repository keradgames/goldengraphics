module.exports = function(grunt) {

  var srcFiles = [
    '<%= dirs.source %>/GoldenGraphics_start.js',
    '<%= dirs.source %>/core/Class.js',
    '<%= dirs.source %>/core/Base.js',
    '<%= dirs.source %>/core/Color.js',
    '<%= dirs.source %>/core/Point2D.js',
    '<%= dirs.source %>/render/CanvasRendering.js',
    '<%= dirs.source %>/display/DisplayObjectContainer.js',
    '<%= dirs.source %>/display/Stage.js',
    '<%= dirs.source %>/display/Sprite.js',
    '<%= dirs.source %>/filters/TintFilter.js',
    '<%= dirs.source %>/GoldenGraphics_end.js'
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    dirs: {
      source: "src/<%= pkg.name %>",
      build: "bin"
    },

    files: {
      build: "<%= dirs.build %>/<%= pkg.name %>.js",
      min: "<%= dirs.build %>/<%= pkg.name %>.min.js"
    },

    concat: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: srcFiles,
        dest: '<%= files.build %>'
      }
    },

    uglify: {
      build: {
        src: '<%= files.build %>',
        dest: '<%= files.min %>'
      }
    },

    watch: {
      main : {
        files: ['<%= dirs.source %>/**/*.js'],
        tasks: ['concat', 'uglify']
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-requirejs');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify', 'watch']);

};