module.exports = function(grunt) {
	
	
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		resolve: {
			files: ["specs/samples/dep1.js", "specs/samples/dep2.js", "specs/samples/dep7.js"]
		}
	});


	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.loadTasks("src");

	// Default task(s).
	grunt.registerTask('default', ['concat']);
	
};
	