module.exports = function(grunt) {
	
	var pathUtil = require("path");
		
	
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
			options: {
				root: "/Users/marcbaechinger/repositories/concat/specs/samples/",
				files: ["dep1.js", "dep2.js"],
				dist: "/Users/marcbaechinger/repositories/concat/dist"
			}
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

	grunt.registerTask('resolve', 'Resolves all require tags to get concatenation order', function() {
		var io = require("./src/io.js"),
			fs = require("fs"),
			_ = require("underscore"),
			done = this.async(),
			srcRoot = grunt.config("resolve.options.root"),
			distRoot = grunt.config("resolve.options.dist"),
			files = _.map(grunt.config("resolve.options.files"), function (file) {
				return pathUtil.normalize(srcRoot + "/" + file);
			}),
			completed = _.after(files.length, function () {
				done();
			});
		
		grunt.log.writeln("concatenate files ... ", files);
	
		files.forEach(function (path) {
			io.createDependencyStack(
				pathUtil.dirname(path), 
				pathUtil.basename(path), 
				"Gruntfile.js", 
				function (deps) {
					io.concatenate(deps, function (src) {
						grunt.log.writeln(src);
						fs.writeFile(distRoot + "/" + pathUtil.basename(path), src, function (err) {
							completed();
						});
					});
				}
			);
		});
	});
	

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jasmine');


	// Default task(s).
	grunt.registerTask('default', ['concat']);
	
};
	