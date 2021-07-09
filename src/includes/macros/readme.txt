https://mozilla.github.io/nunjucks/templating.html#macro

Use macros if you need to pass parameters.
Macros have to be included in the template that will use them.

---

https://mozilla.github.io/nunjucks/templating.html#function-calls

function exclaim = function(content) {
  return content + ' !!!!';
};

...and I'm able to use it like this {{ content.title | exclaim }}
