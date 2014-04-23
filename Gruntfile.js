'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //JS
        concat: {
            options: {
                stripBanners: true
            },
            dist: {
                src: ['lib/js/src/messages.js',
                    'lib/js/src/event.js',
                    'lib/js/src/util.js',
                    'lib/js/src/room.js',
                    'lib/js/src/user.js',
                    'lib/js/src/data-object.js',
                    'lib/js/src/structure.js',
                    'lib/js/src/client.js',
                    'lib/js/src/connection.js',
                    'lib/js/src/protocol.js' ],
                dest: 'lib/js/dist/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/* Gordon JS Client <%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'lib/js/dist/<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        yuidoc: {

            client: {
                'name': 'Gordon JS Client',
                'version': '<%= pkg.version %>',
                options: {
                    paths: 'lib/js/src/',
                    themedir: 'build/theme/',
                    outdir: 'docs/js/'
                }
            }
        },

        //AS3
        asdoc: {
            build: {
                options: {
                    output: 'docs/as3/',
                    rawConfig: '-source-path lib/as3/src/'
                },
                src:['lib/as3/src']
            }
        },
        compc: {
            build:{
                options:{
                    'source-path': ['lib/as3/src']
                },
                src:['lib/as3/src/**/*.as'],
                dest:['lib/as3/dist/<%= pkg.name %>-<%= pkg.version %>.swc']
            }
        }
    });

    //javascript
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    //as3
    grunt.loadNpmTasks('grunt-compc');
    grunt.loadNpmTasks('grunt-asdoc');

    grunt.registerTask('default', ['yuidoc', 'concat', 'uglify', 'asdoc', 'compc']);
    grunt.registerTask('js', ['yuidoc', 'concat', 'uglify']);
    grunt.registerTask('as3', ['asdoc', 'compc']);
};