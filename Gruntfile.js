var browserSync = require('browser-sync');

// 包装函数
module.exports = function(grunt) {

    // 任务配置,所有插件的配置信息
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //清空dist目录;
        clean: {
            clear: ['dist/*']
        },
        
        //编译html文件
        includereplace: {
            dist: {
                //模板全局变量，在模板中使用@@调用
                options: {
                    globals: {
                        name: 'Test',
                        var2: 'two',
                        var3: 'three'
                    }
                },
                
                // src-dest的3种格式
                expand: true,//跟cwd组合使用，指定cwd后不指定 expand为true，会找不到文件
                cwd: 'dist/',//指定相对目录
                src: ['**/*.html', '!inc/*.html'],
                dest: 'dist/',
                
                //无法指定相对目录cwd 
                // files:{
                //     'dist/': ['**/*.html', '!build/*.html']
                // }, 
                
                //无法排除部分文件
                // files: [
                //     {src: '**/*.html', dest: 'dist/',expand: true, cwd: 'src/'},
                // ]
            }
        },
        htmlmin: {                                     // Task 
            // inc: {
            //     options: {                                 // Target options 
            //         removeComments: true,
            //         collapseWhitespace: true,
            //         minifyCSS: true,
            //         minifyJS: true
            //     },
            //     files:[
            //         {src: '**/*.html', dest: 'dist/', expand: true, cwd: 'src/inc'}
            //     ]
            // },
            dist: {                                      // Target 
                options: {                                 // Target options 
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true 
                },
                files:[
                    {src: '**/*.html', dest: 'dist/', expand: true, cwd: 'src/'}
                ]
            }
        },
        //编译scss文件
        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/scss',
                    src: ['*.scss'],
                    dest: 'dist/css',
                    ext: '.css'
                }]
            }
        },

        //编译less文件
        less: {
            dist: {
                options: {
                    modifyVars: {
                        imgPath: '"http://www.so.com/"',
                        bgColor: 'red'
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'src/less',
                    src: ['*.less'],
                    dest: 'dist/css',
                    ext: '.css'
                }]
            }
        },
        
        //压缩css
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/css',
                    ext: '.min.css'
                }]
            }
        },

        //图片压缩
        imagemin: {                          // Task
            static: {                          // Target
                options: {                       // Target options
                    optimizationLevel: 3
                    // svgoPlugins: [{ removeViewBox: false }],
                    // use: [mozjpeg()]
                },
                files: [{
                    expand: true,                  // Enable dynamic expansion
                    cwd: 'src/',                   // Src matches are relative to this path
                    src: ['img/**/*.{png,jpg,gif}'],   // Actual patterns to match
                    dest: 'dist/'                  // Destination path prefix
                }]
            },
        },
        
        //图片合并
        sprite:{
            all: {
                src: 'dist/img/*.*',
                dest: 'dist/img/spritesheet.png',
                destCss: 'dist/css/sprites.scss'
            }
        },
        //js压缩; 
        uglify: {
            options: {
                banner: '/*! This is uglify test - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */',
                //beautify: true,//是否压缩
                mangle: false, //不混淆变量名
                compress:true,//打开或关闭使用默认选项源压缩。
            },
            app_task: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: ['**/*.js'],
                    dest: 'dist/js',
                    ext: '.js',
                    extDot: 'last'
                }]
            }
        },

        //修改文件名称为md5值
        rev: {
            options: {
                algorithm: 'md5',
                length: 8
            },
            assets: {
                files: [{
                    src: [
                        'dist/**/*.{js,css}'
                    ]
                }]
            }
        },


        //css、js文件添加版本号
        file_version: {
            default: {
                options: {
                },
                files: {
                    'dist/index.html': ['dist/css/**/*.css', 'dist/js/**/*.js', 'dist/img/**/*.{png,jpg,gif}'],
                },
            }
        },

        // watch插件的配置信息
        watch: {
            html: {
                files: ['src/*.html'],
                tasks: ['includereplace', 'file_version'],
                options: {
                    //reload: true
                }
            },
            css: {
                files: ['src/scss/*.scss'],
                tasks: ['sass'],
                options: {
                    // Start another live reload server on port 1337
                    //reload: true
                }
            }
        },


        browserSync: {
            dev: {
                bsFiles: {
                    src: ['dist/**/*.*']
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: 'dist'
                    }
                }
            }
        }



    });
    
    
    grunt.event.on('watch', function(action, filepath, target) {
        browserSync.reload();
    });
    
    
    // 告诉grunt我们将使用插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-rev');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-file-version');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');


    // 告诉grunt当我们在终端中输入grunt时需要做些什么
    //grunt.registerTask('default', ['uglify', 'watch', 'browserSync']);
    //grunt.registerTask('default', ['browserSync', 'includereplace']);
grunt.registerTask('default', ['clean', 'htmlmin', 'includereplace', 'sass', 'less', 'cssmin', 'imagemin', 'uglify', 'file_version', 'browserSync', 'watch']);

};
