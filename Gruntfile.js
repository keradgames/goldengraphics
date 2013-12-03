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
    }
    // requirejs: {
    //   compile: {
    //     options: {
    //       name: "GoldenGraphics",
    //       baseUrl: "<%= dirs.source %>",
    //       mainConfigFil: "<%= dirs.source %>/config.js",
    //       out: "<%= dirs.build %>/<%= pkg.name %>.js"
    //     }
    //   }
    // }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Load require plugin
  grunt.loadNpmTasks('grunt-requirejs');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);

};