// Обязательная обёртка
module.exports = function(grunt) {

    // Задачи
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Склеиваем
        concat: {
            options: {
                separator: ';',
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'

            },
            vendor: {
                src: [
                    'public/vendor/jquery.js',
                    'public/vendor/json2.js',
                    'public/vendor/underscore.js',
                    'public/vendor/backbone.js',
                    'public/vendor/backbone.marionette.js',
                    'public/vendor/bootstrap3/js/bootstrap.js'
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
        // Сжимаем
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
        }
    });

    // Загрузка плагинов, установленных с помощью npm install
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Задача по умолчанию
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};