module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		resolve: {
			files: ["specs/samples/dep1.js", "specs/samples/dep2.js", "specs/samples/dep7.js"],
			exclude: {
				"specs/samples/dep2.js": ["2-1*\\.js$"]
			}
		},

		jasmine_node: {
			options: {
				extensions: 'js',
		    specNameMatcher: 'Spec'
			},
			all: ['specs/']
		}
	});


	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-jasmine-node');

	grunt.loadTasks("tasks");

	// Default task(s).
	grunt.registerTask('default', ['concat']);

};
