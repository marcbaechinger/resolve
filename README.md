resolve
=======

Grunt task to resolve require tags in JavaScript files

<code javascript>
//= require "controller.js"

var controller = new controller.Controller({
  container: "#page-container"
});
</code>


<code javascript>
(function (global) {
  global.controller = {
    Controller: function Controller(spec) {
        this.container = $(spec.container);
    }
  };
}(this));
</code>
