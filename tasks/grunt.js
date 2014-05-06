module.exports = function(grunt) {
	"use strict";

	var io = require("./lib/io.js"),
		fs = require("fs"),
		pathUtil = require("path"),
		_ = require("underscore"),
		pwd = pathUtil.resolve(".");


	var writeFile = function (file, completed, logger, content) {
			logger();
			fs.writeFile(file, content, function (err) {
				if (err) {
					console.error("error writing to " + file, err);
				}
				completed();
			});
		},
		writeLog = function (srcFile, destFile) {
			return function () {
				grunt.log.writeln("[resolve] write resolved file '" + srcFile + "' to " + destFile);
			};
		};

	grunt.registerTask("resolve", "Resolves all 'require' lines to get concatenation order", function() {
		var done = this.async(),
			distRoot = pwd + pathUtil.sep + (grunt.config("resolve.dist") || "dist" ),
			relativeFiles = grunt.config("resolve.files") || [],
			files = _.map(relativeFiles, function (file) {
				return pathUtil.normalize(pwd + pathUtil.sep + file);
			}),
			omits = grunt.config("resolve.exclude") || {},
			completed = _.after(files.length, function () {
				done();
			});

		files.forEach(function (path, idx) {
			io.createDependencyStack(
				pathUtil.dirname(path),
				pathUtil.basename(path),
				"Gruntfile.js",
				function (deps) {
					var destFile = distRoot + "/" + pathUtil.basename(path),
						omit = omits[relativeFiles[idx]];

					var extension = (destFile.match(/\.[\w]*$/) || [''])[0];
					io.concatenate(deps, _.partial(writeFile, destFile, completed, writeLog(path, destFile)), omit, extension);
				}
			);
		});
	});
};
