(function (exports) {
"use strict";
	
/*jslint node: true*/
var fs = require("fs"),
	_ = require("underscore"),
	parser = require("./parser.js"),
	pathUtil = require("path");

var readSourceFile = function (directory, filename, reference, callback, stack, allStack) {
	var path = pathUtil.normalize(directory + "/" + filename);
	
	stack = stack || [];
	allStack = allStack || [];
	
	if (_.contains(allStack, path)) {
		// path is already processed; continue
		callback(stack);
		if (!_.contains(stack, path)) {
			console.warn("circular dependency to '" + path + "' from '" + reference + "'");
		}
		return;
	}
	// allStack just holds all files for which processing has been started
	allStack.push(path);
	
	try {
		var data = fs.readFileSync(path),
			deps = parser.parse(data.toString()),
			afterAllDependenciesAreProcessed = _.after(deps.length, function () {
				stack.push(path);
				callback(stack);
			}); 
	
		deps.forEach(function (dep) {
			var depPath = pathUtil.normalize(directory + "/" + dep);
			readSourceFile(pathUtil.dirname(depPath), pathUtil.basename(depPath), path, afterAllDependenciesAreProcessed, stack, allStack);
		});
	} catch (e) {
		console.error("file '" + path + "' referenced from " + reference + " not found");
		callback(stack);
		return;
	}
	
};

exports.readSourceFile = readSourceFile;
}(this));