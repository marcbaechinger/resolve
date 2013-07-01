
console.error("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

module.exports = function(grunt) {
	console.error("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
	
	grunt.registerTask('resolve', 'Resolves all require tags to get concatenation order', function() {
		var io = require("./src/io.js"),
			_ = require("underscore"),
			done = this.async(),
			srcRoot = grunt.config("resolve.options.root"),
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
						completed();
					});
				}
			);
		});
	});
};