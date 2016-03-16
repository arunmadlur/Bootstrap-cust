'use strict';

module.exports = function(grunt) {
	
	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	var appConfig = {
		app: require('./bower.json').appPath || 'app',
		dist: 'dist'
	};


	grunt.initConfig({
		caldon: appConfig,
		pkg: grunt.file.readJSON('package.json'),
		// Compiles Sass to CSS and generates necessary files if requested
		// Compiles Sass to CSS and generates necessary files if requested
		compass: {
			options: {
				sassDir: '<%= caldon.app %>/styles',
				cssDir: '.tmp/styles',
				generatedImagesDir: '.tmp/images/generated',
				imagesDir: '<%= caldon.app %>/images',
				javascriptsDir: '<%= caldon.app %>/scripts',
				fontsDir: '<%= caldon.app %>/styles/fonts',
				importPath: './bower_components',
				httpImagesPath: '/images',
				httpGeneratedImagesPath: '/images/generated',
				httpFontsPath: '/styles/fonts',
				relativeAssets: false,
				assetCacheBuster: false,
				raw: 'Sass::Script::Number.precision = 10\n'
			},
			dist: {
				options: {
					generatedImagesDir: '<%= caldon.dist %>/images/generated'
				}
			},
			server: {
				options: {
					sourcemap: true,
					sassDir: '<%= caldon.app %>/styles',
					cssDir:'<%= caldon.app %>/styles' ,
					environment: 'development'
				}
			}
		},

		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= caldon.dist %>/{,*/}*',
						'!<%= caldon.dist %>/.git{,*/}*'
					]
				}]
			},
			server: '.tmp'
		},

	  // Renames files for browser caching purposes
	  filerev: {
	    dist: {
	    	src: [
	    		'<%= caldon.dist %>/scripts/{,*/}*.js',
	    		'<%= caldon.dist %>/styles/{,*/}*.css',
	  			'<%= caldon.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
	  			'<%= caldon.dist %>/styles/fonts/*'
	  		]
			}
		},

	  // Reads HTML for usemin blocks to enable smart builds that automatically
	  // concat, minify and revision files. Creates configurations in memory so
	  // additional tasks can operate on them
	  useminPrepare: {
    	html: '<%= caldon.app %>/index.html',
    	options: {
    		dest: '<%= caldon.dist %>',
    		flow: {
    			html: {
    				steps: {
    					js: ['concat', 'uglifyjs'],
    					css: ['cssmin']
    				},
    				post: {}
    			}
    		}
    	}
    },
	  
	  // Performs rewrites based on filerev and the useminPrepare configuration
	  usemin: {
	    html: ['<%= caldon.dist %>/{,*/}*.html'],
	  	css: ['<%= caldon.dist %>/styles/{,*/}*.css'],
	  	options: {
			  	assetsDirs: [
			  	'<%= caldon.dist %>',
			  	'<%= caldon.dist %>/images',
			  	'<%= caldon.dist %>/styles'
			  	]
			  }
			},

	    // The following *-min tasks will produce minified files in the dist folder
	    // By default, your `index.html`'s <!-- Usemin block --> will take care of
	    // minification. These next options are pre-configured if you do not wish
	    // to use the Usemin blocks.
	    cssmin: {
	    	dist: {
	    		files: {
	    			'<%= caldon.dist %>/styles/main.css': [
	    			'.tmp/styles/{,*/}*.css'
	    			]
	    		}
	    	}
	  	},

		  uglify: {
		  	dist: {
		  		files: {
		  			'<%= caldon.dist %>/scripts/scripts.js': [
		  			'<%= caldon.dist %>/scripts/scripts.js'
		  			]
		  		}
		  	}
		  },
		  concat: {
		  	dist: {}
		  },

	    // Run some tasks in parallel to speed up the build process
	    concurrent: {
	    	server: [
	    		'compass:server'
	    	],
	    	dist: [
		    	'compass:dist',
		    	'imagemin',
		    	'svgmin'
	    	]
	    },

	    imagemin: {
	    	dist: {
	    		files: [{
	    			expand: true,
	    			cwd: '<%= caldon.app %>/images',
	    			src: '{,*/}*.{png,jpg,jpeg,gif}',
	    			dest: '<%= caldon.dist %>/images'
	    		}]
	    	}
	  	},
		  svgmin: {
		  	dist: {
		  		files: [{
		  			expand: true,
		  			cwd: '<%= caldon.app %>/images',
		  			src: '{,*/}*.svg',
		  			dest: '<%= caldon.dist %>/images'
		  		}]
		  	}
			},

			htmlmin: {
				dist: {
					options: {
						collapseWhitespace: true,
						conservativeCollapse: true,
						collapseBooleanAttributes: true,
						removeCommentsFromCDATA: true,
						removeOptionalTags: true
					},
					files: [{
						expand: true,
						cwd: '<%= caldon.dist %>',
					src: ['*.html', 'views/{,*/}*.html'],
					dest: '<%= caldon.dist %>'
				}]
			}
		},

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
    	dist: {
    		files: [{
    			expand: true,
    			cwd: '.tmp/concat/scripts',
    			src: '*.js',
    			dest: '.tmp/concat/scripts'
    		}]
    	}
    },

    // Replace Google CDN references
    cdnify: {
    	dist: {
    		html: ['<%= caldon.dist %>/*.html']
    	}
    },

	  // Copies remaining files to places other tasks can use
	  copy: {
	    dist: {
	    	files: [{
	    		expand: true,
	    		dot: true,
	    		cwd: '<%= caldon.app %>',
	    		dest: '<%= caldon.dist %>',
	    		src: [
	    			'*.{ico,png,txt}',
	    			'.htaccess',
	    			'*.html',
	    			'views/{,*/}*.html',
	    			'images/{,*/}*.{webp}',
	    			'styles/fonts/{,*/}*.*'
	    		]
	  		}, {
			  	expand: true,
			  	cwd: '.tmp/images',
			  	dest: '<%= caldon.dist %>/images',
			  	src: ['generated/*']
				  }, {
				  	expand: true,
				  	cwd: '.',
				  	src: 'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
				  	dest: '<%= caldon.dist %>'
				  }]
				},
				styles: {
					expand: true,
					cwd: '<%= caldon.app %>/styles',
					dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},

    // Add vendor prefixed styles
    autoprefixer: {
    	options: {
    		browsers: ['last 1 version']
    	},
    	server: {
    		options: {
    			map: true,
    		},
    		files: [{
    			expand: true,
    			cwd: '.tmp/styles/',
    			src: '{,*/}*.css',
    			dest: '.tmp/styles/'
    		}]
    	},
	    dist: {
	    	files: [{
	    		expand: true,
	    		cwd: '.tmp/styles/',
		    	src: '{,*/}*.css',
		    	dest: '.tmp/styles/'
	    	}]
	  	}
		},
		// Automatically inject Bower components into the app
		wiredep: {
			app: {
				src: ['<%= caldon.app %>/index.html'],
				ignorePath:  /\.\.\//
			},
	      	sass: {
	        	src: ['<%= caldon.app %>/styles/{,*/}*.scss'],
	        	ignorePath: /(\.\.\/){1,2}bower_components\//
	      }
		},
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['wiredep']
			},
			js: {
				files: ['<%= caldon.app %>/scripts/{,*/}*.js'],
				tasks: ['newer:jshint:all']
			},
			compass: {
				files: ['<%= caldon.app %>/styles/{,*/}*.scss','<%= caldon.app %>/styles/sass/{,*/}*.scss'],
				tasks: ['compass:server', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			}
		}
	});
	
	grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
		grunt.task.run([
			'clean:server',
			'wiredep',
			'concurrent:server',
			'autoprefixer:server',
			'watch'
			]);
	});
	grunt.registerTask('build', [
		'clean:dist',
		'wiredep',
		'useminPrepare',
		'concurrent:dist',
		'concat',
		'ngAnnotate',
		'autoprefixer',
		'copy:dist',
		'cdnify',
		'cssmin',
		'uglify',
		'filerev',
		'usemin',
		'htmlmin'
		]);
}