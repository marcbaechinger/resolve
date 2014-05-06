describe("io module:", function ioModuleSuite() {
	var dirname = __dirname

	var io = require("../tasks/lib/io.js"),
		path = require('path'),
		_ = require("underscore");

	var dir = undefined;

	beforeEach(function(){
		dir = path.resolve(dirname, "samples/");
	});

	it("test simple linear dependencies in js files", function (done) {
		var filename = "dep1.js";

		io.createDependencyStack(dir, filename, "root", function (deps) {
			expect(deps.length).toBe(5);
			expect(deps[4]).toBe(dirname + "/samples/dep1.js");
			expect(deps[3]).toBe(dirname + "/samples/dep1-2.js");
			expect(deps[2]).toBe(dirname + "/samples/com/dep1-2-1.js");
			expect(deps[1]).toBe(dirname + "/samples/dep1-1.js");
			expect(deps[0]).toBe(dirname + "/samples/com/dep1-1-1.js");
        	done();
		});
	});

	it("test simple linear dependencies in coffee files", function (done) {
		var filename = "coffee_dep_1.coffee";

		io.createDependencyStack(dir, filename, "root", function (deps) {
			expect(deps.length).toBe(3);
			expect(deps[0]).toBe(dirname + "/samples/com/coffee_dep_2.coffee");
			expect(deps[1]).toBe(dirname + "/samples/coffee_dep_3.coffee");
			expect(deps[2]).toBe(dirname + "/samples/coffee_dep_1.coffee");
					done();
		});
	});

	it("test two dependenecies have the same dependency in common for javascript", function (done) {
		var filename = "dep2.js";

		io.createDependencyStack(dir, filename, "root", function (deps) {
			expect(deps.length).toBe(3);
			expect(deps).toEqual([
				dirname + "/samples/com/dep2-1-1.js",
				dirname + "/samples/dep2-1.js",
				dirname + "/samples/dep2.js"
			]);
			done();
		});
	});

	it("test circular dependenecies are skipped", function (done) {
		var filename = "dep3.js";

		io.createDependencyStack(dir, filename, "root", function (deps) {
			expect(deps.length).toBe(3);
			expect(deps[2]).toBe(dirname + "/samples/dep3.js");
			expect(deps[1]).toBe(dirname + "/samples/dep3-1.js");
			expect(deps[0]).toBe(dirname + "/samples/dep3-1-1.js");
        	done();
		});
	});

	it("test changing directory down and up", function (done) {
		var filename = "dep4.js";

		io.createDependencyStack(dir, filename, "root", function (deps) {
			expect(deps.length).toBe(5);
			expect(deps[4]).toBe(dirname + "/samples/dep4.js");
			expect(deps[3]).toBe(dirname + "/samples/com/dep4-1.js");
			expect(deps[2]).toBe(dirname + "/samples/com/it/dep4-1-1-1.js");
			expect(deps[1]).toBe(dirname + "/samples/dep4-4.js");
			expect(deps[0]).toBe(dirname + "/samples/dep4-1-1.js");
        	done();
		});
	});
//
	it("test multiple common dependencies", function (done) {
		var filename = "dep7.js";

		io.createDependencyStack(dir, filename, "root", function (deps) {
			expect(deps.length).toBe(5);
			expect(deps[0]).toBe(dirname + "/samples/dep7-1.js");
			expect(deps[1]).toBe(dirname + "/samples/dep7-4.js");
			expect(deps[2]).toBe(dirname + "/samples/dep7-2.js");
			expect(deps[3]).toBe(dirname + "/samples/dep7-3.js");
			expect(deps[4]).toBe(dirname + "/samples/dep7.js");
        	done();
		});
	});

	it("test file io exception", function (done) {
		var filename = "dep-io-exception.js";

		io.createDependencyStack(dir, filename, "root", function (deps) {
			expect(deps.length).toBe(1);
			expect(deps[0]).toBe(dir + '/' + filename);
        	done();
		});
	});

	it("test file with no dependency", function (done) {
		var filename = "no-deps.js";

		io.createDependencyStack(dir, filename, "root", function (deps) {
			expect(deps.length).toBe(1);
			expect(deps[0]).toBe(dir + "/" + filename);
        	done();
		});
	});

//
	it("test concatenating some files", function (done) {
		var files = [
			dirname + "/samples/dep7-1.js",
			dirname + "/samples/dep7-2.js",
			dirname + "/samples/dep7-3.js",
			dirname + "/samples/dep7-4.js",
			dirname + "/samples/dep7.js"
		];

		io.concatenate(
			files,
			function (src) {
				var lines = src.split("\n");
				expect(lines[0]).toBe("// file: " + files[0]);
				expect(lines[1]).toBe("// dep7-1.js");
				expect(lines[2]).toBe("// file: " + files[1]);
				expect(lines[3]).toBe("// dep7-2.js");
				expect(lines[5]).toBe("// file: " + files[2]);
				expect(lines[6]).toBe("// dep7-3.js");
				expect(lines[8]).toBe("// file: " + files[3]);
				expect(lines[9]).toBe("// dep7-4.js");
				expect(lines[11]).toBe("// file: " + files[4]);
				expect(lines[12]).toBe("// dep7.js");
				done();
			},
			undefined,
			'.js'
		);
	});

	it("test check for root path", function () {
		var checker = _.partial(io.isInsideRootPath, [
			dirname + "/samples/dep7-1.js",
			dirname + "/samples/dep7-2.js",
			dirname + "/samples/dep7-3.js",
			dirname + "/samples/dep7-4.js",
			dirname + "/samples/dep7.js"
		]);

		expect(checker(dirname + "/samples/")).toBe(true);
		expect(checker(dirname)).toBe(true);
		expect(checker("/Users/")).toBe(true);
		expect(checker("marcbaechinger/")).toBe(false);
		expect(checker("samples/dep7.js")).toBe(false);
		expect(checker("dep7.js")).toBe(false);
		expect(checker("/here")).toBe(false);

	});

	// ommiting files
	it("test filtering files by regular expression array", function () {
		var files = ["/home/some/file1.js", "/home/some/file2.js", "/home/some/file3.js"];
		expect(io.filterOmittedFiles(files, ["2.js$"])).toEqual([files[0], files[2]]);
	});

	it("test filtering files by regular expression array with mulitpile expressions", function () {
		var files = ["/home/some/file1.js", "/home/some/file2.js", "/home/some/file3.js"];
		expect(io.filterOmittedFiles(files, ["1.*js$", "2.*js$"])).toEqual([files[2]]);
	});

	it("test filtering files by regular expression array without expressions", function () {
		var files = ["/home/some/file1.js", "/home/some/file2.js", "/home/some/file3.js"];
		expect(io.filterOmittedFiles(files, [])).toEqual(files);
	});
});
