describe("io module:", function ioModuleSuite() {
	
	var io = require("../src/lib/io.js"),
		_ = require("underscore");
	
	it("test simple linear dependencies", function (done) {
		var dir = "/Users/marcbaechinger/repositories/concat/specs/samples/",
			filename = "dep1.js";
		
		io.createDependencyStack(dir, filename, "root", function (deps) {
//			console.log("deps:", deps);
			expect(deps.length).toBe(5);
			expect(deps[4]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep1.js");
			expect(deps[3]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep1-2.js");
			expect(deps[2]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/com/dep1-2-1.js");
			expect(deps[1]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep1-1.js");
			expect(deps[0]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/com/dep1-1-1.js");
        	done();
		});
	});
	it("test two dependenecies have the same dependency in common", function (done) {
		var dir = "/Users/marcbaechinger/repositories/concat/specs/samples/",
			filename = "dep2.js";
		
		io.createDependencyStack(dir, filename, "root", function (deps) {
//			console.log("deps:", deps);
			expect(deps.length).toBe(3);
			expect(deps).toEqual([
				"/Users/marcbaechinger/repositories/concat/specs/samples/com/dep2-1-1.js",
				"/Users/marcbaechinger/repositories/concat/specs/samples/dep2-1.js",
				"/Users/marcbaechinger/repositories/concat/specs/samples/dep2.js"
			]);
			
        	done();
		});
	});

	it("test circular dependenecies are skipped", function (done) {
		var dir = "/Users/marcbaechinger/repositories/concat/specs/samples/",
			filename = "dep3.js";
		
		io.createDependencyStack(dir, filename, "root", function (deps) {
//			console.log("deps:", deps);
			expect(deps.length).toBe(3);
			expect(deps[2]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep3.js");
			expect(deps[1]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep3-1.js");
			expect(deps[0]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep3-1-1.js");
        	done();
		});
	});

	it("test changing directory down and up", function (done) {
		var dir = "/Users/marcbaechinger/repositories/concat/specs/samples/",
			filename = "dep4.js";
		
		io.createDependencyStack(dir, filename, "root", function (deps) {
//			console.log("deps:", deps);
			expect(deps.length).toBe(5);
			expect(deps[4]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep4.js");
			expect(deps[3]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/com/dep4-1.js");
			expect(deps[2]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/com/it/dep4-1-1-1.js");
			expect(deps[1]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep4-4.js");
			expect(deps[0]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep4-1-1.js");
        	done();
		});
	});

	it("test multiple common dependencies", function (done) {
		var dir = "/Users/marcbaechinger/repositories/concat/specs/samples/",
			filename = "dep7.js";
		
		io.createDependencyStack(dir, filename, "root", function (deps) {
			console.log("deps:", deps);
			expect(deps.length).toBe(5);
			expect(deps[0]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep7-1.js");
			expect(deps[1]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep7-4.js");
			expect(deps[2]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep7-2.js");
			expect(deps[3]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep7-3.js");
			expect(deps[4]).toBe("/Users/marcbaechinger/repositories/concat/specs/samples/dep7.js");
        	done();
		});
	});
	
	it("test file io exception", function (done) {
		var dir = "/Users/marcbaechinger/repositories/concat/specs/samples/",
			filename = "dep-io-exception.js";
		
		io.createDependencyStack(dir, filename, "root", function (deps) {
			expect(deps.length).toBe(1);
			expect(deps[0]).toBe(dir + filename);
        	done();
		});
	});
	
	it("test file with no dependency", function (done) {
		var dir = "/Users/marcbaechinger/repositories/concat/specs/samples/",
			filename = "no-deps.js";
		
		io.createDependencyStack(dir, filename, "root", function (deps) {
			expect(deps.length).toBe(1);
			expect(deps[0]).toBe(dir + filename);
        	done();
		});
	});
	
	it("test concatenating some files", function (done) {
		var files = [
			"/Users/marcbaechinger/repositories/concat/specs/samples/dep7-1.js",
			"/Users/marcbaechinger/repositories/concat/specs/samples/dep7-2.js",
			"/Users/marcbaechinger/repositories/concat/specs/samples/dep7-3.js",
			"/Users/marcbaechinger/repositories/concat/specs/samples/dep7-4.js",
			"/Users/marcbaechinger/repositories/concat/specs/samples/dep7.js"
		];
		
		io.concatenate(
			files, 
			function (src) {
				//console.log(src);
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
			}
		);
	});
	
	it("test check for root path", function () {
		var checker = _.partial(io.isInsideRootPath, [
			"/Users/marcbaechinger/repositories/concat/specs/samples/dep7-1.js",
			"/Users/marcbaechinger/repositories/concat/specs/samples/dep7-2.js",
			"/Users/marcbaechinger/repositories/concat/specs/samples/dep7-3.js",
			"/Users/marcbaechinger/repositories/concat/specs/samples/dep7-4.js",
			"/Users/marcbaechinger/repositories/concat/specs/samples/dep7.js"
		]);
		
		expect(checker("/Users/marcbaechinger/repositories/concat/specs/samples/")).toBe(true);
		expect(checker("/Users/marcbaechinger/repositories/")).toBe(true);
		expect(checker("/Users/")).toBe(true);
		expect(checker("marcbaechinger/")).toBe(false);
		expect(checker("samples/dep7.js")).toBe(false);
		expect(checker("dep7.js")).toBe(false);
		expect(checker("/here")).toBe(false);
		
	});
});
