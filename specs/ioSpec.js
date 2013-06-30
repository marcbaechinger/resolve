describe("io module:", function ioModuleSuite() {
	
	var io = require("../src/io.js");
	
	it("test simple linear dependencies", function (done) {
		var dir = "/Users/marcbaechinger/repositories/concat/specs/samples/",
			filename = "dep1.js";
		
		io.readSourceFile(dir, filename, "root", function (deps) {
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
		
		io.readSourceFile(dir, filename, "root", function (deps) {
			console.log("deps:", deps);
			expect(deps.length).toBe(3);
			expect(deps).toEqual([
				"/Users/marcbaechinger/repositories/concat/specs/samples/com/dep2-1-1.js",
				"/Users/marcbaechinger/repositories/concat/specs/samples/dep2-1.js",
				"/Users/marcbaechinger/repositories/concat/specs/samples/dep2.js"
			]);
			
        	done();
		});
	});

	it("test circular dependenecies are skipped and reported appropriatly", function (done) {
		var dir = "/Users/marcbaechinger/repositories/concat/specs/samples/",
			filename = "dep3.js";
		
		io.readSourceFile(dir, filename, "root", function (deps) {
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
		
		io.readSourceFile(dir, filename, "root", function (deps) {
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
	
	it("test file io exception", function (done) {
		var dir = "/Users/marcbaechinger/repositories/concat/specs/samples/",
			filename = "dep-io-exception.js";
		
		io.readSourceFile(dir, filename, "root", function (deps) {
			expect(deps.length).toBe(1);
			expect(deps[0]).toBe(dir + filename);
        	done();
		});
	});
	
	it("test file with no dependency", function (done) {
		var dir = "/Users/marcbaechinger/repositories/concat/specs/samples/",
			filename = "no-deps.js";
		
		io.readSourceFile(dir, filename, "root", function (deps) {
			expect(deps.length).toBe(1);
			expect(deps[0]).toBe(dir + filename);
        	done();
		});
	});
});
