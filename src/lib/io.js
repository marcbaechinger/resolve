/*jslint node: true*/
(function (exports) {
	"use strict";
	
	var fs = require("fs"),
		_ = require("underscore"),
		pathUtil = require("path"),
		parser = require("./parser.js");

	var createDependencyStack = function (directory, filename, reference, callback, stack, processedFiles) {
		var path = pathUtil.normalize(directory + "/" + filename);
	
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

						if (!depPath.match(/\.js/)) {
							depPath += ".js";
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
	
	var concatenate = function concatenate(stack, callback) {
		var output = [],
			completed = _.after(stack.length, function () {
				callback(output.join("\n"));
			});
			
		stack.forEach(function (path, idx) {
			fs.readFile(path, function (err, data) {
				output[idx * 2] = "// file: " + path;
				output[idx * 2 + 1] = data.toString();
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
}(this));