module.exports = function(grunt) {
	
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				// define a string to put between each file in the concatenated output
				separator: ';'
			},
			dist: {
				// the files to concatenate
				src: ['src/**/*.js'],
				// the location of the resulting JS file
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		resolve: {
			files: ["specs/samples/dep1.js", "specs/samples/dep2.js", "specs/samples/dep7.js"]
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'dist/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.min.js'
			}
		},
		jasmine: {
			pivotal: {
				src: 'src/**/*.js',
				options: {
					specs: 'specs/*Spec.js',
					helpers: 'specs/*Helper.js'
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.loadTasks("src");

	// Default task(s).
	grunt.registerTask('default', ['concat']);
	
};
	