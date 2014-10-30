module.exports = (grunt)->
    grunt.initConfig
        pkg: grunt.file.readJSON('package.json')

        jshint:
            options:
                jshintrc: '.jshintrc'
            uses_defaults: ['Gruntfile.js', 'observable*.js']

        wiredep:
            task:
                src: 'karma.conf.js'
                options:
                # https://github.com/taptapship/wiredep#configuration
                    fileTypes:
                        js:
                            block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi
                            detect:
                                js: /'(.*\.js)'/gi
                            replace:
                                js: '\'{{filePath}}\','
        karma:
            ci:
                configFile: 'karma.conf.js'
                browsers: ['PhantomJS']
                singleRun: true

        release:
            options:
                file: 'bower.json'
                push: false
                pushTags: false
                npm: false


    grunt.loadNpmTasks 'grunt-karma'
    grunt.loadNpmTasks 'grunt-wiredep'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-release'

    grunt.registerTask 'default', ['jshint', 'wiredep']
    grunt.registerTask 'test', ['default', 'karma:ci']