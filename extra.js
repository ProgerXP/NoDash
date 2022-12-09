/*!
  NoDash.js - extra, longer, useful functions (pick any three)
  https://squizzle.me/js/nodash | Public domain/Unlicense
*/

;(function (factory) {
  var deps = 'nodash?main:_'
  var me = '_'
  // --- Universal Module (squizzle.me) - CommonJS - AMD - window --- IE9+ ---

  if (typeof exports != 'undefined' && !exports.nodeType) {
    // CommonJS/Node.js.
    deps = (deps.replace(/\?[^:]*/g, '').match(/\S+(?=:)/g) || []).map(require)
    if (typeof module != 'undefined' && module.exports) {
      module.exports = factory.apply(this, deps)
    } else {
      exports = factory.apply(this, deps)
    }
  } else if (typeof define == 'function' && define.amd) {
    // AMD/Require.js.
    define(deps.replace(/\?/g, '/').match(/\S+(?=:)/g) || [], factory)
  } else {
    // In-browser. self = window or web worker scope.
    var root = typeof self == 'object' ? self
             : typeof global == 'object' ? global
             : (this || {})
    var by = function (obj, path) {
      path = path.split('.')
      while (obj && path.length) { obj = obj[path.shift()] }
      return obj
    }
    // No lookbehind in IE.
    deps = (deps.match(/:\S+/g) || []).map(function (dep) {
      var res = by(root, dep = dep.substr(1))
      if (!res) { throw me + ': missing dependency: ' + dep }
      return res
    })
    me = me.split(/\.([^.]+)$/)
    if (me.length > 1) { root = by(root, me.shift()) }
    Object.assign(root[me[0]], factory.apply(this, deps))
  }
}).call(this, function (NoDash) {
  "use strict";

  //! +cl=Extra
  // These functions are provided by `[nodash/extra`]. In browser context they are part of the main `'_/`'NoDash object.
  //
  // This module depends on NoDash by default but it can also work with Underscore
  // or LoDash. See `@sq@start#deps`@ on how to override this dependency (except  the NPM's `'override method won't work because `'extra uses a dependency on self). An example for Require.js:
  //[
  //  requirejs.config({
  //    map: {
  //      'nodash/extra': {
  //        'nodash/main': 'lodash'
  //      }
  //    }
  //  })
  //]
  return {
    // Performs a remote request using `'XMLHttpRequest, offering a subset of jQuery's
    // `'ajax() API.
    //= XMLHttpRequest `- the `'xhr
    //> options object
    // Possible `'options keys:
    //> url str
    //> type str `- `'GET by default
    //> data str`, object `- request data for `'POST, etc.; useful object types are
    //  `@mdn:API/FormData`@, `@mdn:API/Blob`@ and `@mdn:API/URLSearchParams`@
    //  (not in IE)
    //> dataType str `- type of `[xhr.response`], from standard
    //  `@mdn:API/XMLHttpRequestResponseType`@; `'text by default; other useful types
    //  are `'document (for HTML and XML), `'json, `'arraybuffer and `'blob
    //> context object `- calling context for below callbacks
    //> beforeSend function `- called before `[xhr.open()`]; receives `'xhr
    //  and `'options (mutable, affects internal copy, not given `'options);
    //  if returns `[=== false`] then the request is not performed and `'error
    //  is called without giving `'e (imitates `'abort())
    //> success function `- called when response has arrived; receives `'xhr
    //  and `'e
    //
    //  Warning: if `'dataType is `'json, responses being empty or the string
    //  "null" trigger `'success with `'response set to `'null.
    //> error function `- called on a request or response error, and also
    //  on `'beforeSend and `[xhr.abort()`]; receives `'xhr (always) and `'e
    //  (only if not on `'beforeSend)
    //> complete function `- called after completion, successful or not;
    //  receives `'xhr and `'e
    //> progress function `- called during response transmission; receives
    //  `'xhr and `'e where useful `'e properties are:
    //  `> lengthComputable bool
    //  `> loaded int bytes
    //  `> total int bytes `- or 0
    //> timeout int milliseconds `- if exceeded, request `'error-s with the
    //  `'status of 0
    //> headers object `- members can be strings or arrays; if missing, assumed
    //  `[X-Requested-With: XMLHttpRequest`] (for compatibility with jQuery's `'ajax())
    //
    //  `[Content-Type: application/x-www-form-urlencoded`] is added if `'type
    //  is not `'GET and `'data is not an object (browsers set the correct `[Content-Type`] automatically if it's an object).
    //
    //  For CORS, custom headers like `[X-Requested-With`] (but not
    //  `[Content-Type`]) mandate the preflight request. Give `'headers of `'{}
    //  to avoid it. Details:
    //  `@https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests`@.
    //> username str `- for HTTP Basic Authentication
    //> password str `- for HTTP Basic Authentication
    // It is guaranteed that, per given `#ajax() call:
    //* exactly one of `[success or error`] and one `[complete`] is called
    //* `[success`] is called on a 200-299 `'status and `'responseType matching
    //  `'dataType (the latter is browser-dependent and not very reliable)
    //* `[complete`] is called after `[success or error`], even if the latter
    //  has thrown an exception (it's re-thrown after `'complete provided it
    //  didn't throw another one)
    //* `[progress`] is never called after calling `[success or error`]
    // ECMAScript equivalents: `@mdn:API/XMLHttpRequest`@, `@mdn:API/Fetch_API`@.
    //?`[
    //    _.ajax({
    //      url: 'form.php',
    //      type: 'POST',
    //      data: new FormData(document.querySelector('form')),
    //    })
    //
    //    _.ajax({
    //      url:          'some.json',
    //      dataType:     'json',
    //      timeout:      5000,  // 5 seconds
    //      headers:      {},    // remove X-Requested-With
    //      beforeSend:   () => $('#loading').show()
    //      complete:     () => $('#loading').hide()
    //      success:      xhr => alert(xhr.response),
    //      error:        (xhr, e) => alert(xhr.statusText),
    //      progress:     (xhr, e) => $('progress').attr({
    //        max: e.total,
    //        value: e.lengthComputable && e.total
    //      }),
    //    })
    // `]
    ajax: function (options) {
      var o = NoDash.assign({}, {
        url: location.href,
        type: 'GET',
        data: undefined,
        dataType: 'text',
        context: undefined,
        beforeSend: new Function,
        success: new Function,
        error: new Function,
        complete: new Function,
        progress: new Function,
        timeout: 0,
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        username: undefined,
        password: undefined,
      }, options)

      if (!o.headers['Content-Type'] && o.type != 'GET' && typeof o.data != 'object') {
        o.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }

      var xhr = new XMLHttpRequest
      var queue = []

      function finish() {
        // Delayed processing to let all other events (errors) pass through.
        queue.length || NoDash.defer(function () {
          // No pop() - queue.length must be non-0 to prevent late XHR events
          // from re-triggering this.
          var args = [xhr].concat(Array.prototype.slice.call(queue[queue.length - 1]))

          var ok = xhr.status >= 200 && xhr.status < 300 &&
                   // This check isn't very reliable as at least Firefox leaves
                   // 'json' as is even if response is 'text/html'.
                   xhr.responseType == o.dataType

          try {
            NoDash.bind(ok ? o.success : o.error).apply(o.context, args)
          } catch (e) {
            var ex = e
          }

          NoDash.bind(o.complete).apply(o.context, args)
          if (ex) { throw ex }
        })

        queue.push(arguments)
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          finish.apply(undefined, arguments)
        }
      }

      // ontimeout is fired after onreadystatechange.
      xhr.ontimeout = finish

      xhr.upload.onprogress = function () {
        if (!queue.length) {
          var args = [xhr].concat(Array.prototype.slice.call(arguments))
          NoDash.bind(o.progress).apply(o.context, args)
        }
      }

      if (NoDash.bind(o.beforeSend).call(o.context, xhr, o) === false) {
        NoDash.bind(o.error).call(o.context, xhr)
      } else {
        xhr.open(o.type, o.url, true, o.username, o.password)
        xhr.timeout = o.timeout
        xhr.responseType = o.dataType

        NoDash.forEach(o.headers, function (value, name) {
          NoDash.toArray(value).forEach(function (item) {
            xhr.setRequestHeader(name, item)
          })
        })

        xhr.send(o.data)
      }

      return xhr
    },

    //! `, +fna=function ( str [, options] )
    // Converts a template `'str to a function that accepts variables and
    // returns a formatted string.
    //= function accepting `'vars`, string if `[options.source`]
    //> str string`,
    //  function take the contents of the first `[/**/`] comment`,
    //  Node take `'textContent `- the template
    //> options object`, omitted `- compilation options
    // ` `#template() can be used outside of web browser environment.
    //
    // See also `#format().
    //
    // Possible `'options keys:
    //> prepare omitted`, object defaults for formatting variables and/or options (under
    //  `'o)`, function `- function receives caller-given `'vars (`'{} if not given) and options under `'o (may be `'undefined)
    //  and returns an object with complete variables
    //  and options (may be mutated)
    //> source bool`, omitted `- if set, returns a JavaScript string - code of the
    //  function to be compiled
    //> with bool`, omitted = `'true `- if set, members of `'vars can be
    //  referenced directly, not through `'v; such templates are slower due to
    //  using JavaScript's `[with { }`]
    //> laxRef bool`, omitted = `'true `- if set, non-code `'ref
    //  are resolved with `#at(), meaning they return the non-object
    //  value immediately, even if there are more path components (that triggers
    //  an error without `'laxRef, but is faster)
    //> code bool`, omitted = `'true `- if unset, fails to compile if there are
    //  constructs allowing arbitrary code execution; in such case it should
    //  be safe to pass `'str from untrusted input since it can only read
    //  values given to the compiled function and from global `'window
    //  (unless there are custom `'blocks)
    //> backslash bool`, omitted = `'false `- if set, preprocesses `'str by removing backslashes placed before a line break together with all the following whitespace and line breaks; useful for splitting long lines that can't normally be split, wrapping `'{{ `'}} or getting rid of unwanted spaces inside `[<u>`]
    //> blocks object`, omitted = default `'if/`'for/etc. `- new `'custom or
    //  overridden standard `'if/`'for/etc.; key is the block's name
    //  (alphanumeric), value is a function receiving `[param, value, c`]:
    //  `> param null if no `':... given`, str `- part after `': (may be blank)
    //  `> value null no space given`, str `- part after space; on conflict
    //     with non-code `'echo the latter wins so add a colon for unambiguity:
    //     `[{{echo}}`] but `[{{block:}}`]
    //  `> c object `- current compiler's state; keys:
    //     `> options object `- an internal copy of `'options given to
    //        `#template(), with filled defaults
    //     `> ref function `- resolves a reference (see `'ref below); receives
    //        a raw string, returns a JavaScript code snippet evaluating to string
    //     `> stack `- current chain of blocks, first being last opened
    //     `> extra object `- for passing non-serializable data to the compiled
    //        function; available under `'_x variable
    //     `> * `- other keys can be used for storing custom state data
    //     Attention: be mindful of operator precedence: returning code like
    //     `[a || b`] will prevent the template from running; instead, return
    //     `[(a || b)`]. Brackets are not added automatically because
    //     `'( may appear in `'start and a matching `') appears in `'end.
    //  Function must return an object with keys:
    //  `> start omitted`, str `- JavaScript code evaluating to string
    //  `> end omitted`, str `- JavaScript code evaluating to string at the
    //     time block's end is met (`[{{/}}`]); if `'null then the block
    //     isn't opened and needs not be closed (alike to `[<input>`] in HTML)
    //  `> type omitted`, str `- used together with `'end; sets matching
    //     `'block_end's type; defaults for the block's key
    //  `> head omitted`, str `- JavaScript code added to the beginning of
    //     the compiled function; useful for declaring `[var`]iables
    //  Code snippets can use context variables like `'v (see below).
    //  Use `[JSON.stringify()`] to properly escape a string.
    // Template syntax loosely resembles that of Mustache.js/Handlebars.js -
    // all substitutions are performed within `[{{...}}`]:
    //[
    //    escaped       = \[\\...]{{
    //    echo          = {{ [=] ref }}
    //    conditional   = {{ [else]if[:not] ref }}
    //                  | {{ else[:] }}
    //    loop          = {{ for[:[*][pf]] ref }}
    //                  | {{ elseif[:pf|-[:not]] ref }}
    //                  | {{ else[:pf|-] }}
    //    block_end     = {{ / [if|for] }}
    //    custom        = {{ key[:[param]][ value] }}
    //                  | {{ / [key] }}
    //
    //    ref           = var[.prop...] | code
    //]
    //* `'escaped: a pair of `'{ prefixed with odd number of `'\ becomes raw `'{{
    //  prefixed with half that number of `[\`]; even number of `'\ doesn't
    //  escape `'{{ but is still emitted "halved": `[
    //      \{{ = {{    \\\{{ = \{    \\\\\{{ = \\{{
    //      \\{{...}} = \ + result    \\\\{{...}} = \\ + result
    //  `]
    //* `'echo: emits value of a variable/property (not of global like `'window)
    //  or result of executing arbitrary code (if `'ref is not alphanumeric with
    //  periods). Without `'= the result is post-processed by `[v.o.escaper`]
    //  (e.g. HTML-escaped). If `'ref is `'null or `'undefined, emits nothing.
    //* `'conditional: emits the enclosed block only if `'ref is truthy (or falsy
    //  with `':not).
    //* `'loop: emits the enclosed block once for every iteration. `'ref is
    //  given to `#forEach(), with `#forceObject if asterisk (`[*`]) is present. Optional `'pf specifies prefix for variables
    //  inside the block that are by default `'m ("m"ember's value), `'k
    //  ("k"ey), `'i ("i"ndex, same as `'k if `'ref `#isArrayLike), `'a ("a"ll,
    //  the `'ref). In object mode, iterations are seamlessly ordered by comparing keys as strings (`[for:array`] iterates in different order than `[for:*array`]: `[2 < 10`] but `['2' > '10'`]).
    //
    //  Only `'i exists outside of the block and is `'undefined prior to the first
    //  `'loop with that `'pf; after a `'loop it holds index of the last
    //  iterated member, or `'-1 if `'ref was empty (or `'undefined/`'null/`'false) - this is what `'loop's
    //  enclosed `'elseif/`'else test (they also change `'for's `'block_end from
    //  `'/for to `'/if). Without `': or with `[:-`], last `'for (its `'pf) is
    //  checked: `[{{elseif}} {{elseif:-}} {{elseif:-:not}}`] - but here last
    //  `'for with empty `'pf is checked: `[{{elseif:}} {{elseif::not}}`].
    //* `'block_end: give the expected block's type (not simply `[{{/}}`])
    //  for extra syntax safety: `[
    //      {{if ...}} {{for ...}} {{/}} {{/}}        - works
    //      {{if ...}} {{for ...}} {{/for}} {{/if}}   - works
    //      {{if ...}} {{for ...}} {{/if}} {{/for}}   - fails to compile
    //  `]
    //* Nested and multi-line `'{{ `'}} are not supported but you can use string
    //  `'backslash or escapes: `[{{'}}\n'}}`] fails but `[{{'\\x7d\\n}'}}`] works.
    //
    // The returned compiled template function accepts these arguments:
    //> v object`, falsy = `'{} `- variables for access by `'ref; the `'o key
    //  contains formatting options; standard `'o subkeys:
    //  `> escaper function`, omitted return as is `- `'echo without `'= runs
    //     the value through this; in HTML context you'd set it to `#escape()
    //
    // These variables exist within the returned function:
    //> _ `- reference to NoDash regardless of the global `'_
    //> v `- variables given by the caller (`[v.o`] = options, or `[{}`])
    //> _x `- the `[c.extra`] object (see the `'blocks option)
    //> * `- members of `'v, if `[options.with`] is set
    //
    //?`[
    //    _.template('{{a.b.c}}')({})                   //=> ''
    //    _.template('{{a.b.c}}', {laxRef: false})()    // Error
    //    _.template('{{a}}', {laxRef: false})()        // Error
    //    _.template('{{v["a"]}}', {laxRef: false})()
    //      //=> '' (v is always present)
    //    _.template('{{a["b"]}}')()
    //      // Error (laxRef only affects non-code ref)
    //    _.template('{{Math.random()}}')()             //=> 0.2446989
    //
    //    _.template('{{if Math.random() > 0.5}}win!{{/}}')()
    //      //=> 'win!' or ''
    //    _.template('{{if Math.random > 1}}win!{{/}}')({
    //      Math: {random: 9000},
    //    })
    //      //=> 'win!'
    //
    //    _.template('{{if Math.random}}win!{{/}}', {laxRef: false, with: false})({})
    //      //=> 'win!'
    //    _.template('{{if:not Math.random}}win!{{/}}')()
    //      //=> ''
    //    _.template('{{if Math.random}}win!{{/}}')({Math: {random: 0}})  //=> ''
    //    _.template('{{Math.random}}')({Math: {random: -451}})     //=> '-451'
    //
    //    _.template('{{document.title}}')()
    //      //=> 'bar' (window.document.title)
    //    _.template('{{document.title}}')({
    //      document: {title: 'foo'},
    //    })
    //      //=> 'foo'
    //    _.template('{{v.document.title}}')({
    //      document: {title: 'foo'},
    //    })
    //      //=> 'foo'
    //    _.template('{{document.title}}', {with: false})()
    //      //=> 'bar'
    //    _.template('{{document.title}}', {with: false})({
    //      document: {title: 'foo'},
    //    })
    //      //=> 'bar'
    //    _.template('{{v.document.title}}', {with: false})({
    //      document: {title: 'foo'},
    //    })
    //      //=> 'foo'
    //
    //    _.template('{{document["title"]}}')()
    //      //=> 'bar'
    //    _.template('{{document["title"]}}')({
    //      document: {title: 'foo'},
    //    })
    //      //=> 'foo'
    //    _.template('{{document["title"]}}', {with: false})({
    //      document: {title: 'foo'},
    //    })
    //      //=> 'bar'
    //    _.template('{{v.document["title"]}}', {with: false})({
    //      document: {title: 'foo'},
    //    })
    //      //=> 'foo'
    // `]
    //
    //?`[
    //    var tpl = function () { /*
    //      {{if homepage}}<a href="{{homepage}}">Homepage</a>{{/}}
    //    */ }
    //    _.template(tpl)({homepage: 'https://squizzle.me'})
    //      //=> <a href="https://squizzle.me">Homepage</a>
    //
    //    var tpl = function () { /*
    //      https://very.long/\
    //      string?with=lotta&\
    //      query=params#!and-stuff
    //    */ }
    //    _.template(tpl, {backslash: true})()
    //      //=> https://very.long/string?with=lotta&query=params#!and-stuff
    // `]
    // Other examples where `'backslash is useful:
    // `[
    //    {{if foo... && \        becomes {{if foo... && bar... }}
    //         bar... \           without spaces before \ would be:
    //    }}                              {{if foo...&& bar...}}
    //
    //    <u ...>\                becomes <u ...>text</u> rather than
    //      text\                 <u ...> text </u>, removing underline of the
    //    </u>                    whitespace after "text" when viewed in browser
    // `]
    //
    //? Given this node somewhere in DOM (`[<template>`] is unsupported in IE):
    //  `[
    //    <script type="text/template" id="menuTemplate">
    //      <ul>
    //        {{for menu}}
    //          <li>
    //            {{i+1}}. <a href="{{m.url}}">{{m.caption}}</a>
    //          </li>
    //        {{/for}}
    //      </ul>
    //    </script>
    //  `]
    //  This call:
    //  `[
    //    var func = _.template(document.getElementById('menuTemplate'))
    //    func({
    //      menu: [
    //        {url: '//squizzle.me', caption: "Squizzle's home"},
    //        {url: '//squizzle.me/js/sqimitive', caption: "Sqimitive.js"},
    //      ],
    //    }, {escaper: _.escape})
    //  `]
    //  ...will produce:
    //  `[
    //    <ul>
    //      <li>
    //        1. <a href="//squizzle.me">Squizzle&39;s home</a>
    //      </li>
    //      <li>
    //        2. <a href="//squizzle.me/js/sqimitive">Sqimitive.js</a>
    //      </li>
    //    </ul>
    //  `]
    //? Using `'prepare:
    //  `[
    //    var f = _.template('{{a}}', {prepare: {a: '&', o: {escaper: _.escape}}})
    //    f()                             //=> '&amp;'
    //    f({a: '<'})                     //=> '&lt;'
    //    f({}, {escaper: null})          //=> '&'
    //    f({a: '<'}, {escaper: null})    //=> '<'
    //  `]
    //  To force certain variables and/or options wrap the returned function:
    //  `[
    //    var f = _.template('{{a}}')
    //    var w = function (v) {
    //      var o = _.assign({}, v.o, {escaper: _.escape})
    //      return f(_.assign({}, v, {a: '&', o: o}))
    //    }
    //    w({a: '<'}, {escaper: null})    //=> '&amp;'
    //  `]
    //  Function form of `'prepare is useful if the template is compiled
    //  early but the defaults it should use change over time:
    //  `[
    //    var f = _.template('{{r}}', {prepare: {r: Math.random()}})
    //    f()         //=> 0.2446989
    //    f()         //=> 0.2446989
    //    f({r: -1})  //=> -1
    //
    //    var f = _.template('{{r}}', {prepare: function (v) {
    //      return {r: Math.random(), o: v.o}
    //        // ignores all caller-given variables, keeps its options
    //      return _.assign({}, v, {r: Math.random(), o: v.o})
    //        // overrides r's value, keeps other variables and all options
    //    }})
    //    f()         //=> 0.0682551
    //    f()         //=> 0.4187164
    //    f({r: -1})  //=> 0.1058262
    //  `]
    //? `[
    //    var f = _.template(``
    //      {{for a}}
    //        a
    //      {{elseif b}}
    //        b
    //      {{else}}
    //        c
    //      {{/if}}
    //    ``)
    //    // Equivalent to:
    //    var f = _.template(``
    //      {{for a}}
    //        a
    //      {{/for}}
    //      {{if i == -1 && b}}
    //        b
    //      {{elseif i == -1}}
    //        c
    //      {{/if}}
    //    ``)
    //
    //    f()                 //=> 'c'
    //    f({b: true})        //=> 'b'
    //    f({a: [1, 2, 3]})   //=> 'a a a'
    //  `]
    //
    //? With enabled `[options.with`], `'loop's variables shadow global ones with
    //  the same name but globals are still accessible through `[v.`].
    //  Use `':pf to avoid shadowing. Assuming enabled `'with:
    //  `[
    //      {{a}} {{v.a}}               // .a of the global variables object
    //      {{v.v.a}}                   // .a property of a global variable .v
    //      {{for y}} {{a}} {{v.a}} {{m.a}} {{v.m.a}} {{/for}}
    //        // loop's .a (!), global .a variable, member's .a,
    //        // .a property of a global variable .m
    //      {{for:f y}} {{a}} {{fa}} {{m.a}} {{fm.a}} {{/for}}
    //        // global .a variable, loop's .a, global .m's .a, member's .a
    //  `]
    //
    //? Custom blocks:
    //  `[
    //    var sample = function (param, value, c) {
    //      return {start: '_.sample(' + c.ref(value) + ')'}
    //    }
    //    _.template('{{sample items}}', {blocks: {sample}})
    //      ({items: ['a', 'b', 'c']})
    //        //=> 'a' or 'b' or 'c'
    //  `]
    //  Removing whitespace outside of HTML tags (`[< >`]):
    //  `[
    //    var ws = function () {
    //      return {start: '(""', end: '"").replace(/\\s(?=<|$)/g, "")'}
    //    }
    //    _.template('{{ws}} <abbr title="Oh"> {{/ws}} </abbr>', {blocks: {ws}})()
    //        //=> '<abbr title="Oh"> </abbr>'
    //
    //    _.template(..., {..., source: true})
    //    // Compiled to code (cleaned):
    //    return (" <abbr title=\"Oh\"> ").replace(/\s(?=<|$)/g, "") + " </abbr>"
    //  `]
    template: function (str, options) {
      options = NoDash.assign({with: true, laxRef: true, code: true}, options)

      options.blocks = NoDash.assign({
        if: function (param, value, c, ref) {
          if (param && param != 'not') {
            throw new Error('template: bad "if:' + param + '".')
          }
          return {start: '(' + (param ? '!' : '') + (ref || c.ref)(value) + '?""',
                  end: '"":"")'}
        },

        elseif: function (param, value, c, ref) {
          var prev = c.stack[0] && !c.stack[0]._else && c.stack[0].type
          if (prev == 'for') {
            param = (param == null ? '-' : param).match(/^(\w*|-)(:(.*))?$/)
            if (param[1] == '-') { param[1] = c._lastFor }
            var res = options.blocks.if(param[3], value, c, function (s) {
              return '(' + param[1] + 'i==-1&&' + (ref || c.ref)(s) + ')'
            })
            return NoDash.assign(res, {start: c.stack.shift().end + '+' + res.start,
                                       type: 'if', _for: param[1]})
          } else if (prev != 'if') {
            throw new Error('template: elseif: no preceding if or for.')
          } else {
            if (c.stack[0]._for != null) {
              arguments[3] = function (s) {
                return '(' + c.stack[0]._for + 'i==-1&&' + (ref || c.ref)(s) + ')'
              }
              arguments.length++
            }
            var res = options.blocks.if.apply(this, arguments)
            c.stack[0].end += ')'
            return {start: '"":' + res.start}
          }
        },

        else: function (param, value, c) {
          if ((param && ((c.stack[0] || {}).type != 'for')) || value) {
            throw new Error('template: else takes no arguments.')
          } else {
            var res = options.blocks.elseif(param, '', c, function () { return 1 })
            c.stack[0]._else = true   // may have been shift()'ed
            return res
          }
        },

        for: function (pf, value, c) {
          var match = (pf || '').match(/^(\*)?(\w*)()$/)
          if (!match) {
            throw new Error('template: bad "for:' + pf + '".')
          }
          pf = c._lastFor = match[2]
          return {
            head:  'var ' + pf + 'i;',
            start: '(' + pf + 'i=-1,' +
                   '_x.for(' + c.ref(value) + ',' + !!match[1] + ',' +
                   'function(' + pf + 'm,' + pf + 'k,' + pf + 'a){' +
                   pf + 'i++;return""',
            end:   '""}))',
          }
        },
      }, options.blocks)

      var c = {
        options: options,
        stack: [],
        _lastFor: null,

        extra: {
          for: function (value, forceObject, func) {
            if (value == null || value === false) {
              return ''
            } else if (forceObject || !NoDash.isArrayLike(value)) {
              return NoDash.entries(value)
                .sort(function (a, b) {
                  // Keys may be numbers if forceObject && isArrayLike.
                  return (a[0] += '') > (b[0] += '') ? +1 : -1
                })
                .map(function (entry) { return func(entry[1], entry[0], value) })
                .join('')
            } else {
              return NoDash.map(value, func).join('')
            }
          },
        },

        ref: function (s) {
          if (!(s = s.trim())) { throw new Error('template: blank ref.') }
          var m
          if (m = s.match(/^(\w+)((\.\w+)*)$/)) {
            s = '["' + m[2].substr(1).replace(/\./g,
                    (options.laxRef ? '","' : '"]["')) + '"]'
            if (options.laxRef) {
              s = '(typeof ' + m[1] + '=="undefined"?undefined:' +
                  (m[2] ? '_.at(' + m[1] + ',' + s + ')' : m[1]) + ')'
            } else {
              s = m[1] + (m[2] ? s : '')
            }
          } else if (!options.code) {
            throw new Error('template: code refs prohibited.')
          } else {
            s = '(' + s + ')'
          }
          return s
        },
      }

      var head = ''
      var blocks = NoDash.keys(options.blocks).join('|')
      var blockStart = new RegExp('^(' + blocks + ')(:\\S*)?(\\s+(.*))?$')
      var blockEnd = new RegExp('^\\/\\s*(' + blocks + ')?\\s*$')

      if (str instanceof Function) {
        // RegExp /s flag (dotAll) is not supported in IE and older FF.
        str = str.toString().match(/\/\*([\s\S]*)\*\//)[1].trim()
      } else if (NoDash.isElement(str)) {
        str = str.textContent
      }

      if (options.backslash) {
        str = str.replace(/\\[\r\n]\s*/g, '')
      }

      str = str.replace(/(\\(\\\\)*)\{\{|((?:\\\\)*)\{\{\s*(.*?)\}\}|(["\\\0-\x1F])/g, function () {
        var m = arguments
        if (m[1]) {
          var res = m[0].substr(1)
        } else if (m[5]) {    // \ or " or non-printable
          var code = m[0].charCodeAt(0)
          var res = '\\x' + (code < 16 ? '0' : '') + code.toString(16)
        } else {
          var res = m[3] + '"+'
          var inside = m[4]
          if (m = inside.match(blockStart)) {
            var block = options.blocks[m[1]](m[2] ? m[2].substr(1) : null,
                                             m[3] ? m[4] : null, c)
            head += block.head || ''
            res += block.start || ''
            block.type = block.type || m[1]
            block.end && c.stack.unshift(block)
          } else if (m = inside.match(blockEnd)) {
            if (!c.stack.length || (m[1] && c.stack[0].type != m[1])) {
              throw new Error('template: /' + c.stack[0].type + ' expected, {{' + m[0] + '}} found.')
            }
            res += c.stack.shift().end
          } else {
            res += '((T=' + c.ref(inside.substr(inside[0] == '=')) + ')==null?"":' +
                   (inside[0] == '=' ? 'T' : 'E(T)') + ')'
          }
          res += '+"'
        }
        return res
      })

      if (c.stack.length) {
        str = NoDash.pluck(c.stack, 'type').join('}} <- {{')
        throw new Error('template: unclosed {{' + str + '}}.')
      }

      str = head + 'return"' + str + '"'
      // str (head) may contain "var".
      if (options.with) { str = 'with(v){' + str + '}' }

      if (!options.source) {
        var def = options.prepare
        if (def && (typeof def != 'function')) {
          options.prepare = function (v) {
            return NoDash.assign({}, def, v, {o: NoDash.assign({}, def.o, v.o)})
          }
        }

        // It appears that strict mode isn't applied to such functions even
        // though it applies to eval, neither when they're created nor called.
        // But unlike eval they have access to the global scope only.
        str = 'v=v||{};v=_p?_p(v):v;v.o=v.o||{};' +
              'var T,E=v.o.escaper||function(s){return s};' + str
        str = (new Function('_p,_,_x,v', str))
          .bind(undefined, options.prepare, NoDash, c.extra)
      }

      return str
    },

    //! `, +fna=function ( [options,] str [, arg [, ...]] )
    // Interpolates `'arg'uments into `'str'ing according to format
    // specifiers inspired by `'printf() of C, or returns a function doing so.
    //= string formatted `'str`, string function's source code`,
    //  function accepting `'arg'uments `- result depends on `[options.return`]
    //> options object`, omitted
    // See also `#template().
    //
    // Specifiers in `'str start with `[%`]. Special `'%% is output as is while
    // others have this format (unsupported specifier triggers an error):
    //[
    //   % [[+|-][n]$] [+[ ]] [[-|=][0|``c]d] [.[-][p]] (s|c|d|f|x|X|b|o|H|I|S|Y|M|D|K|T)
    //   n     - takes 1-based n'th arg; causes next $-less % to take n+1, etc.
    //   +-n   - ...relative: %+1$ = %+$ skip over next, %-2$ go back by two
    //   +     - prefix positive number with '+' or ' '
    //   d     - number of symbols to pad to, using spaces on the left unless...
    //   -     - ...pads on the right
    //   =     - ...pads on both sides (centers)
    //   0     - ...pads with zeros
    //   c     - ...pads with that symbol
    //   p     - %f: rounds to this number of decimal places (without .p = 6),
    //           padding with zeros on the right if no '-'; %s %c: cuts if
    //           longer, from the right if no '-'; '.' alone = defaultPrecision
    //   %s    - treats arg as a string
    //   %c    - treats arg as one or many (if array) String.fromCharCode()-s
    //   %d    - treats arg as an integer, discarding fractional part
    //   %f    - treats arg as a fractional number; mantissa is exempted from d
    //   %x    - treats arg as an integer, output in hexadecimal lower case
    //   %X    - as %x but in upper case
    //   %b    - as %x but in binary
    //   %o    - as %x but in octal
    //   %H    - treats arg as a Date instance, outputs local hours (1-24)
    //   %I    - as %H but outputs minutes (0-59)
    //   %S    - as %H but outputs seconds (0-59)
    //   %Y    - as %H but outputs full year (like 2022)
    //   %M    - as %H but outputs month number (1-12)
    //   %D    - as %H but outputs day number (1-31)
    //   %K    - as %H but outputs week day number (1-7, 1 for Monday)
    //]
    // Possible `'options keys:
    //> return int`, omitted = `'2 `- if `'2, `#format() returns the formatted string;
    //  if `'1, returns a function that can be used to format the same `'str
    //  using different set of `'arg'uments; if `'0, returns its source code
    //> silent bool`, omitted `- if set, doesn't throw on insufficient number of `'arg-s and other warnings
    //> ellipsis str`, null/omitted = `''...' `- terminator used when `'.p'recision outputs
    //  a longer `'%s/`'%c string; use `''' to cut without one
    //> defaultPrecision object`, omitted `- `'p value when no number follows the dot; unset `'%s/`'%c default to 100
    //> specifiers object`, omitted `- non-standard or overridden specifiers (`[%...`]);
    //  key is a single `'\w character, value is a function receiving
    //  `[params, c`]:
    //  `> params array `- specifier string parameters; useful keys (all but first and last can be empty):
    //     `> 0 `- full specifier string without leading `'%
    //     `> 2 `- if `'$ used: `'arg index wrapped in `'"
    //     `> 3 `- sign: `'+ or `'+ + space
    //     `> 5 `- padding side: `'- or `'=
    //     `> 6 `- padding symbol: `'0 or `[```] + character
    //     `> 7 `- padding length (numeric)
    //     `> 9 `- precision padding: `'-
    //     `> 10 `- precision (numeric), empty if only `'. used
    //     `> 11 `- the specifier character
    //     Note: sign and padding are handled by `#format(), not this function.
    //  `> c object `- current state; keys:
    //     `> args array `- only when formatting; `'arg'uments for interpolation
    //     `> arg int `- only when formatting; index of current `'arg'ument
    //     `> head str `- only when compiling; JavaScript code added to the beginning of
    //        the compiled function; useful for declaring `[var`]iables
    //     `> options object `- `'options given to `#format()
    //     `> e function `- throws an `'Error unless `[options.silent`]; receives `'msg, returns `'true
    //     `> next function `- only call when formatting; returns current `'arg and advances the index; receives `'null or a 1-based number: `['c.next(' + params[2] + ')'`]
    //     `> * `- other keys can be used for storing custom state data
    //  Function must return a JavaScript code string (will be wrapped in `[( )`]) which can use context
    //  variables like `'a (see below).
    //  Use `[JSON.stringify()`] to properly escape a string.
    //
    // These variables exist within the returned function:
    //> _ `- reference to NoDash regardless of the global `'_
    //> c `- current formatter's state (see above), shallow-copied for every new
    //  call of the returned function (still sharing `'options and others)
    //> a `- temporary variable for use by the specifier formatter while it transforms the current `'arg
    //
    // For pretty formatting visible to user consider using standard `'Intl classes, such as:
    //* `@mdn:JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat`@
    //* `@mdn:JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat`@
    //* `@mdn:JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat/RelativeTimeFormat`@
    //  (this one is not in IE)
    //?`[
    //    _.format('from char codes: %c', [97, 98, 99])
    //      //=> 'from char codes: abc'
    //    _.format('from char codes: %s', [97, 98, 99])
    //      //=> 'from char codes: 97,98,99'
    //    _.format('|%=``+10s|', 'head')
    //      //=> '|+++head+++|'
    //    _.format('%.5s %1$.-5s %02.5f %2$02.-5f', 'abcdef', 3.14)
    //      //=> 'ab... ...ef 03.14000 03.14'
    //    _.format('%Y-%1$02M-%1$02D', new Date)
    //      //=> '2022-11-01'
    //    _.format('%f(ms) %1$d(s) %1$.f(rounded)', new Date / 1000)
    //      //=> '1667314562.619000(ms) 1667314562(s) 1667314563(rounded)'
    //
    //    // Ensure %s is exactly 5 chars, padding and cutting as necessary:
    //    var fmt = _.format({return: 1}, '%5.5s')
    //      //=> function (arg, arg, ...)
    //    fmt('abc')        //=> '  abc'
    //    fmt('abcdef')     //=> 'ab...'
    // `]
    //? Custom specifiers:
    //  `[
    //    var escaper = function (params) {
    //      return '_.escape(c.next(' + params[2] + '))'
    //    }
    //    var s = '<pre>%20h</pre>'
    //    var fmt = _.format({return: 1, specifiers: {h: escaper}}, s)
    //      //=> function (arg, ...) {
    //      //     return _.padStart(_.escape(c.next(undefined)), 20, ' ')
    //      //   }
    //    fmt('</SCRiPT>&')
    //      //=> <pre>   &lt;/SCRiPT>&amp;</pre>
    //  `]
    format: function (options, str) {
      function noPrecision(c, params) {
        if (params[8]) {
          c.e('%' + params[11] + ' is incompatible with precision (' + params[8] + ')')
        }
      }

      if (!(options instanceof Object)) {
        str = options
        options = {}
      }

      var args = NoDash.rest(arguments, 1 + (options == arguments[0]))

      options.defaultPrecision = NoDash.assign({
        s: 100,
        c: 100,
      }, options.defaultPrecision)

      options.specifiers = NoDash.assign({
        s: function (params, c, res) {
          res = res || 'c.next(' + params[2] + ')'
          if (params[8]) {
            res = 'c.ellipsize(' + res + ',' + (params[10] || params[7] || options.defaultPrecision[params[11]] || 0) + ',' + !!params[9] + ')'
          }
          return res
        },

        c: function (params, c) {
          var res = 'a=c.next(' + params[2] + '),String.fromCharCode.apply(undefined,_.isArrayLike(a)?a:[a])'
          return options.specifiers.s(params, c, res)
        },

        d: function (params, c) {
          noPrecision(c, params)
          return 'Math.trunc(c.next(' + params[2] + '))'
        },

        f: function (params) {
          var p = params[8] ? +params[10] || options.defaultPrecision[params[11]] || 0 : 6
          var m = NoDash.repeat('0', p)
          var variableWidth = params[9] /*'-' p*/ || !p /*no '.' p or '.0'*/
          // If number is below 0, its string form will be shorter than p:
          // %.2f: 0.012 * 100 = '1', not '01' and we won't know the length of
          // mantissa.
          var res = 'Math.round((c.next(' + params[2] + ')' + (variableWidth ? '' : '+1') + ')' + (m && '*1' + m) + ')'
          if (variableWidth) {
            return 'a=' + res + (m && '/1' + m) + '+"",al-=a.length-Math.max(0,a.indexOf(".")),a'
          } else {
            return 'al-=' + (p + 1 /*dot*/) + ',a=' + res + '+"",a.substr(0,a.length-' + p + ')-1+"."+a.substr(-' + p + ')'
          }
        },

        x: function (params, c, base) {
          noPrecision(c, params)
          return '(+c.next(' + params[2] + ')).toString(' + (base || 16) + ')'
        },

        X: function (params, c) {
          return options.specifiers.x(params, c) + '.toUpperCase()'
        },

        b: function (params, c) {
          return options.specifiers.x(params, c, 2)
        },

        o: function (params, c) {
          return options.specifiers.x(params, c, 8)
        },

        H: function (params, c, func) {
          noPrecision(c, params)
          return 'c.next(' + params[2] + ').' + (func || 'getHours') + '()'
        },

        I: function (params, c) {
          return options.specifiers.H(params, c, 'getMinutes')
        },

        S: function (params, c) {
          return options.specifiers.H(params, c, 'getSeconds')
        },

        Y: function (params, c) {
          return options.specifiers.H(params, c, 'getFullYear')
        },

        M: function (params, c) {
          return options.specifiers.H(params, c, 'getMonth') + '+1'
        },

        D: function (params, c) {
          return options.specifiers.H(params, c, 'getDate')
        },

        K: function (params, c) {
          return options.specifiers.H(params, c, 'getDay')
        },
      }, options.specifiers)

      var c = {
        //! +ig
        //args: null,   // format-time
        //arg: 0,       // format-time
        head: 'var a,al,c=_.assign({arg:0,args:_.rest(arguments,2)},_c);',
        options: options,

        e: function (msg) {
          if (!this.options.silent) {
            throw new Error('format: ' + msg + '.')
          }
          return true
        },

        //! +ig
        next: function (param) {    // [+-][n]
          if (param) {
            isNaN(param[0]) ? this.arg += +param : this.arg = param - 1
          }
          if (++this.arg > this.args.length) {
            this.e('too few arguments')
            return ''
          } else {
            return this.args[this.arg - 1]
          }
        },

        ellipsize: function (s, max, left) {
          s += ''
          if (s.length > max) {
            var ell = options.ellipsis == null ? '...' : options.ellipsis
            s = max <= ell.length
                ? left ? s.substr(-max) : s.substr(0, max)
                : left
                  ? ell + s.substr(-(max - ell.length))
                  : s.substr(0, max - ell.length) + ell
          }
          return s
        },
      }

      // Since specifier format looks the same when stringify()'ed, can call the
      // latter once on the entire string rather than on every parts.shift().
      var parts = JSON.stringify(str)
        // Note: update doc comment above and splice() below if changing ( )s.
        .split(/%(%|(([+-]\d*|\d+)\$)?(\+ ?)?(([-=])?(0|`.)?(\d+))?(\.(-)?(\d*))?(\w))/)
        //       0  12                3      45      6      7      8  9   10     11

      var code = ''

      while (true) {
        code += parts.shift()           // A%sB%dC = [A] [%s] [B] [%d] [C]
        if (!parts.length) { break }    //           ^shift   ^shift   ^shift

        //  0   part after initial '%': '%' or full specifier
        //  1   n + '$'
        //  2   [+|-] [n]
        //  3   '+' or '+ '
        //  4   [[-|=][0|`c]d]
        //  5   '-' or '='
        //  6   '0' or '`' + c
        //  7   d
        //  8   [.[-][p]]
        //  9   '-'
        // 10   p
        // 11   specifier symbol
        var params = parts.splice(0, 12)  // 12 = number of ( )s above

        if (params[0] == '%') {
          code += '%'
          continue
        }

        var func = options.specifiers[params[11]]
        if (!func) {
          c.e('unsupported specifier %' + params[11] + ': %' + params[0])
          continue
        }

        if (params[2] == '+' || params[2] == '-') { params[2] += '1' }
        params[2] = params[2] ? '"' + params[2] + '"' : ''

        code += '"+(al=0,a=(' + func(params, c) + '),'
        if (params[3]) {
          code += '(a>0?"' + params[3].substr(-1) + '":"")+'
        }
        if (!params[4]) {
          code += 'a'
        } else {
          var n = params[7]
          var p = JSON.stringify(NoDash.repeat((params[6] || ' ').substr(-1), +n))
          if (params[5] == '=') {
            code += '(a+="",a=' + p + '.substr(0,(' + n + '-a.length+al)/2)+a)+' + p + '.substr(a.length)'
          } else {
            p += '.substr(a.length+al)'
            code += '(a+="",' + (params[5] ? 'a+' + p : p + '+a') + ')'
          }
        }
        code += ')+"'
      }

      code = c.head + 'a=' + code + ';c.arg==c.args.length||c.e("too many arguments");return a'

      if (options.return != 0) {
        code = (new Function('_c,_', code)).bind(undefined, c, NoDash)
        if (options.return != 1) {
          return code.apply(undefined, args)
        }
      }

      if (args.length) {
        c.e("have both format arg-s and options.return < 2")
      }

      return code
    },
  }
});