describe("parser module:", function parseModuleSuite() {
	"use strict";

	var parser = require("../tasks/lib/parser.js");

	it("test availability of parser module and it public functions", function testModuleAvailability() {
		expect(typeof parser).toBe("object");
		expect(typeof parser.lineSeparator).toBe("function");
		expect(typeof parser.lineTokenizer).toBe("function");
	});


	it("test determining separators", function () {
		var text = "line-1\nline-2\nline-3",
			textWindows = "line-1\r\nline-2\r\nline-3";

		expect(parser.lineSeparator(text)).toBe("\n");
		expect(parser.lineSeparator(textWindows)).toBe("\r\n");
	});

	it("test spliting a source code file into lines with \\n", function () {
		var text = "line-1\nline-2\nline-3";

		var lines = parser.lineTokenizer(text);

		expect(lines.length).toBe(3);
		expect(lines[0]).toBe("line-1");
		expect(lines[1]).toBe("line-2");
		expect(lines[2]).toBe("line-3");
	});

	it("test spliting a source code file into lines with \\r\\n", function () {
		var text = "line-1\r\nline-2\r\nline-3";

		var lines = parser.lineTokenizer(text);

		expect(lines.length).toBe(3);
		expect(lines[0]).toBe("line-1");
		expect(lines[1]).toBe("line-2");
		expect(lines[2]).toBe("line-3");
	});
});
