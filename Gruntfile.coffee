module.exports = (grunt) ->
  grunt.initConfig
    concat:
      main:
        src: [
          'public/js/**/*.js'
        ]
        dest: 'public/js/main.js'

    uglify:
      main:
        files:
          'public/js/main.min.js': '<%= concat.main.dest %>'

    # Run simple server for static
    connect:
      test:
        options:
          port: 8888
          base: '.'
          keepalive: true

    # Compile compass
    compass:
      prod:
        options:
          environment: 'production'
          outputStyle: 'compressed'
      dev:
        options:
          environment: 'development'
          outputStyle: 'expanded'

    # Sass instead of compass, cuz its support sourceMap
    sass:
      prod:
        options:
          compass: true
          style: 'compressed'
        files:
          'css/main.css': 'css/sass/main.scss'
      dev:
        options:
          compass: true
          sourcemap: true
          debugInfo: true
        files:
          'css/main.css': 'css/sass/main.scss'

    # Compile coffeeScript
    coffee:
      prod:
        options:
          join: true
        files:
          'public/js/main.js': 'src/coffee/*.coffee'
      dev:
        options:
          sourceMap: true
          join: true
        files:
          'public/js/main.js': 'src/*.coffee'
      test:
        files:
          'test/tests.js':'test/test.*.coffee'

    # Watch for coffee, sass
    watch:
      scripts:
        files: 'src/coffee/*.coffee'
        tasks: 'coffee:dev'
      styles:
        files: 'src/sass/*.scss'
        tasks: 'compass:dev'

    # Mocha client-side tests
    mocha:
      all: 'test/*.html'

    # Simple mocha
    simplemocha:
      test:
        src: 'test/test.*.js'
        options:
          reporter: 'spec'
          slow: 200
          timeout: 1000

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks)

  grunt.registerTask 'default', ['coffee:dev', 'concat', 'uglify']
  grunt.registerTask 'test', ['coffee:test', 'simplemocha:test']