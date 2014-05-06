/*jslint node: true*/
(function (exports) {
	"use strict";

	var fs = require("fs"),
		_ = require("underscore"),
		pathUtil = require("path"),
		parser = require("./parser.js");

	var commentStart = {
		'.coffee': '#',
		'.js': '//'
	};

	var createDependencyStack = function (directory, filename, reference, callback, stack, processedFiles) {
		var path = pathUtil.normalize(directory + "/" + filename);
		var extension = (filename.match(/\.[\w]*$/) || [''])[0];
		var extensionRegexp = new RegExp("\\" + extension + "$");

		stack = stack || [];
		processedFiles = processedFiles || [];

		if (_.contains(processedFiles, path)) {
			// path is already processed; continue
			callback(stack);
			return;
		}
		// processedFiles just holds all files for which processing has been started
		processedFiles.push(path);

		fs.readFile(path, function (err, data) {
			if (err) {
				console.error("file '" + path + "' referenced from " + reference + " not found");
				callback(stack);
				return;
			}
			var deps = parser.parse(data.toString()),
				loopOverDependencies = function () {
					if (deps.length) {
						var dep = deps.shift(), // pop first element of array
							depPath = pathUtil.normalize(directory + "/" + dep);

						if (extension && !depPath.match(extensionRegexp)) {
							depPath += extension;
						}
						createDependencyStack(
							pathUtil.dirname(depPath),
							pathUtil.basename(depPath),
							path,
							loopOverDependencies,
							stack,
							processedFiles
						);
					} else {
						stack.push(path);
						callback(stack);
					}
				};
			// serialize async file access
			loopOverDependencies();
		});
	};

	var filterOmittedFiles = function (stack, omitRegExArr) {
		var expressions = _.map(omitRegExArr, function (expr) {
			return new RegExp(expr);
		});

		return _.filter(stack, function (file) {
			var keepFile = true;
			expressions.forEach(function (expr) {
				if (file.match(expr)) {
					keepFile = false;
				}
			});
			return keepFile;
		});
	};

	var concatenate = function concatenate(stack, callback, omitRegExArr, extension) {
		var output = [],
			completed;

		if (omitRegExArr) {
			// filter files to omit
			stack = _.filter(stack, function (file) {
				var keepFile = true;
				omitRegExArr.forEach(function (expr) {
					if (file.match(expr)) {
						keepFile = false;
					}
				});
				return keepFile;
			});
		}

		completed = _.after(stack.length, function () {
			console.log(output)
			callback(output.join("\n"));
		});

		stack.forEach(function (path, idx) {
			fs.readFile(path, function (err, data) {
				output[idx * 2] = (commentStart[extension] || '//') + " file: " + path;
				output[idx * 2 + 1] = data !== undefined ? data.toString() : '';
				completed();
			});
		});
	};

	var isInsideRootPath = function checkRootPath(stack, rootPath) {
		var valid = true,
			regEx = new RegExp("^" + rootPath);
		stack.forEach(function (path) {
			if (!path.match(regEx)) {
				valid = false;
			}
		});
		return valid;
	};

	exports.createDependencyStack = createDependencyStack;
	exports.concatenate = concatenate;
	exports.isInsideRootPath = isInsideRootPath;
	exports.filterOmittedFiles = filterOmittedFiles;
}(this));
