module.exports = (grunt) ->

    grunt.initConfig

        coffee:
            compile:
                files:
                    'backbone.tastycollections.js': 'backbone.tastycollections.coffee'

    grunt.loadNpmTasks 'grunt-contrib-coffee'
