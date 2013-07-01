resolve
=======

Grunt task to resolve require tags in JavaScript files

The following file <code>app.js</code> requires the file <code>controller.js</code> to be prepended:

<pre><code javascript>//= require "controller.js"

var controller = new controller.Controller({
  container: "#page-container"
});</code></pre>

This is <code>controller.js</code> to be prepended to <code>app.js</code>.

<pre><code javascript>(function (global) {
  global.controller = {
    Controller: function Controller(spec) {
        this.container = $(spec.container);
    }
  };
}(this));</code></pre>

In the <code>Gruntfile.js</code> we put now

<pre><code javascript>grunt.initConfig({
	[...]
	resolve: {
		files: [ "src/app.js" ]
	}
});

grunt.loadTasks("tasks"); // TODO: change to npmLoad
</code></pre>

This will create <code>dist/app.js</code> with the concatenated source code. <i>resolve</i> resolves files recursively, normalizes multiple dependencies from and to a given file, skips declared dependencies not found on disk and is robust concerning circular dependencies (does not loop).

# Declaring dependencies

In a JavaScript file one or more <code>require</code> lines can be added:

<pre><code>//= require "dep1.js"
//= require "dep2.js"</code></pre>

All require lines of a file are gathered, hoisted to the top of the file and recursively resolved for transitive dependencies.

Multiple files can be listed separated by commas:

<pre><code>//= require "dep1.js, dep2.js"</code></pre>

Dependencies are relative to the source file containing the require line:

<pre><code>//= require "dep1.js, modules/module-1.js, ../common/extend.js"</code></pre>

# Grunt task config

The complete configuration options are as follows:

<pre><code javascript>grunt.initConfig({
	resolve: {
		files: [ "src/app.js", "modules/google-analytics.js" ],
		dist: "outputdir"
	}
});</code></pre>