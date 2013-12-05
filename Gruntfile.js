module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {
                options: {
                    targetDir: './public/vendor',
                    layout: 'byType',
                    install: true,
                    verbose: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'

            },
            vendor: {
                src: [
                    'public/vendor/jquery/jquery.js',
                    'public/vendor/json2/json2.js',
                    'public/vendor/underscore/underscore.js',
                    'public/vendor/backbone/backbone.js',
                    'public/vendor/marionette/backbone.marionette.js',
                    'public/vendor/bootstrap/bootstrap.js'
                ],
                dest: 'public/build/vendor.js'
            },
            main: {
                src: [
                    'public/js/**/*.js'
                ],
                dest: 'public/build/scripts.js'
            }
        },
        uglify: {
            vendor: {
                files: {
                    'public/build/vendor.min.js': '<%= concat.vendor.dest %>'
                }
            },
            main: {
                files: {
                    'public/build/scripts.min.js': '<%= concat.main.dest %>'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            files: 'public/js/**/*.js'
        },
        cssmin: {
            combine: {
                files: {
                    'public/build/vendor.css': ['public/vendor/bootstrap/bootstrap.css']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['bower', 'jshint', 'concat', 'uglify', 'cssmin']);
};