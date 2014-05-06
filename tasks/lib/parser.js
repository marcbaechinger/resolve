/*jslint node: true*/
var fs = require("fs"),
	_ = require("underscore");

var lineSeparator = function(data) {
		return data.indexOf("\r\n") > -1 ? "\r\n" : "\n";
	},
	lineTokenizer = function(data) {
		return data.split(lineSeparator(data));
	},
	trim = function (token) {
		return token.trim();
	},
	extractDeps = function (line) {
		var startPos = line.indexOf("\"") + 1,
			endPos = line.lastIndexOf("\"");
		return line.substring(startPos, endPos).split(",");
	},
	requireLineFilter = function(line) {
		return !!(line.match(/=\s*require/));
	},
	requireLineTokenizer = function(line) {
		return _.map(
			extractDeps(line),
			trim
		);
	},
	parseSourceCode = function (src) {
		return _.flatten(
			_.map(
				_.filter(
					lineTokenizer(src),
					requireLineFilter
				),
				requireLineTokenizer
			)
		);
	};

this.lineTokenizer = lineTokenizer;
this.lineSeparator = lineSeparator;
this.parse = parseSourceCode;
