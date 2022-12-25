/*!
  NoDash.js - a terse utility library based on ES5+ features
  https://squizzle.me/js/nodash | Public domain/Unlicense
*/

;(function (factory) {
  var deps = ''
  var me = 'NoDash'
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
    var old = root._
    root._ = root[me[0]] = factory.apply(this, deps)
    root._.noConflict = function () {
      root._ = old
      return root[me[0]]
    }
  }
}).call(this, function () {
  "use strict";

  function objectNotSupported(func) {
    return function () {
      throw new TypeError(func + '() does not support object value.')
    }
  }

  // Calls func with a copy of the array given to the returned function. Exists
  // for sort() and reverse() that change the value in-place.
  function cloner(func) {
    return function () {
      return func.apply(ap.slice.call(this), arguments)
    }
  }

  function transform(value, args, skipArgs, arrayFunc, objectFunc) {
    if ((obj = args[args.length - 1] === fo) || !NoDash.isArrayLike(value)) {
      obj && args.length--
      var obj = args.forceObject = fo
    }
    if (skipArgs) {
      args = ap.slice.call(args, skipArgs)
    }
    return !obj || !objectFunc
      ? arrayFunc.apply(value, args)
      : objectFunc.apply(value, args)
  }

  // forceObject is not supported for obvious reasons.
  function slice(value, from, length, single) {
    if (NoDash.isArrayLike(value)) {
      var res = (typeof value == 'string' ? value.substr : ap.slice).call(value, from, length)
      if (single) { res = res[0] }    // from can be negative
    } else {
      var res = NoDash.entries(value).slice(from, length)
      res = single ? res.length ? res[0][1] : undefined : NoDash.fromEntries(res)
    }
    return res
  }

  function tagAndSort(value, func, cx) {
    func = bind(func, arguments, 2)
    value = NoDash.map(value, function (item, key) {
      return [key, item, func.apply(undefined, arguments)]
    })
    return NoDash.toArray(value).sort(function (a, b) {
      return a[2] > b[2] ? +1 : (a[2] < b[2] || a[0] > b[0]) ? -1 : 0
    })
  }

  function bind(func, args, skipArgs, noContext) {
    if (func instanceof Function) {
      func = [func].concat(noContext ? [undefined] : [],
                           ap.slice.call(args || [], skipArgs))
    }
    if (!func) {
      return func
    } else if (func[1] === undefined) {   // "partial" application, keep context
      return function () {
        return func[0].apply(this, func.slice(2).concat(ap.slice.call(arguments)))
      }
    } else {
      return Function.prototype.bind.apply(func.shift(), func)
    }
  }

  function pickerFunction(func, args) {
    if (!(func instanceof Function)) {
      // concat() unwraps keys when pick(value, keys[]) is used.
      var keys = NoDash.object(ap.concat.apply([], args))
      func = function picker_(item, key) { return NoDash.has(keys, key) }
    }
    return func
  }

  function trim(left, right, value, blank, noBlank) {
    if (typeof value != 'string') {
      for (var begin = 0;
           left && begin < value.length &&
           (noBlank ? !value[begin] : value[begin] === blank);
           begin++) ;
      for (var end = value.length - 1;
           right && end > begin &&
           (noBlank ? !value[end] : value[end] === blank);
           end--) ;
      return value.slice(begin, end + 1)
    } else if (noBlank && left && right) {
      return value.trim()
    } else {
      var flags = 'g'
      blank = noBlank ? '\\s+'
        : (blank instanceof RegExp)
          ? (flags += blank.flags, '(' + blank.source + ')+')
          : '[' + NoDash.escapeRegExp(blank) + ']+'
      var re = RegExp('^' + (left ? blank : '') + '|' + (right ? blank : '') + '$', flags)
      return value.replace(re, '')
    }
  }

  var ap = Array.prototype
  var unset = {}    // unique value marker
  var fo = {}

  //! +cl=NoDash
  //
  // ` `*NoDash.js`* is a terse utility library based on ES5+ features.
  //
  // NoDash differs from already established utility libraries (such as
  // Underscore.js' `@un:`@ and LoDash's `@lo:`@):
  //* Built-in ECMAScript 5 functions are used where possible, like
  //  `@o:Array/forEach`@().
  //* Virtually every function is deliberately isolated, small (7 lines on
  //  average) and intuitive without too much focus on optimization (that is
  //  left up to the browser).
  //* It has only and exactly the functions you need in day-to-day development
  //  without resorting to other libraries. For example, it includes `#ajax()
  //  that is part of jQuery (and you can't really go without it), and `#trim()
  //  that is part of `*Underscore.string`* (and missing in IE), but omits a
  //  plethora of `'is...() functions that are just aliases for `'instanceof and
  //  `[===`].
  //* Most functions work uniformly with various data types. For example,
  //  `#indexOf() accepts an array, object or string while Underscore's
  //  `@un:indexOf`@() - array only. Same for `#map() that also works over
  //  objects (and returns objects).
  //* Even then, it's 14K minified - compare with Underscore (17K) and LoDash
  //  (core 12K, full 71K).
  //* And as a bonus, its license is the post permissive possible - public
  //  domain (technically, `@http://Unlicense.org`@).
  //
  // NoDash was written from scratch for Sqimitive (`@sq@`@) as a replacement
  // for Underscore. Usually you can just swap it in place of Underscore or
  // LoDash but do check `#COMPATIBILITY for nuances.
  //
  // `<img src="data:image/gif;base64,R0lGODlhKQAQAIAAAP///8s5OCH5BAAAAAAALAAAAAApABAAAAJOjI+py+0Po5wK2GsP3np7kHygIY5BiYUXaaZst55jhri0fOf2bLK0roP9eKqhsCMkyopKnCf5WtZiwKfPKJW4KNxr97v9OkUMlPlcPosKADs" alt="npm"`> `*npm install squizzle-nodash`*
  //
  //* Download for development:
  //  `@https://github.com/ProgerXP/NoDash/archive/master.zip`@
  //* Download for production (minified):
  //  `@https://raw.githubusercontent.com/ProgerXP/NoDash/master/nodash.min.js`@
  //* Report issues: `@https://github.com/ProgerXP/NoDash/issues`@
  //* Get the code on GitHub: `@https://github.com/ProgerXP/NoDash`@
  //
  // NoDash works with any module system: Node, AMD or "window". In the latter,
  // it assumes two global objects: `'NoDash and `'_ (see `#noConflict()).
  //
  //# Basic conventions
  //* Result is of the same type as the `'value argument except for
  //  `#isArrayLike objects returned as arrays as explained below.
  //* If a function handles some array-like type differently (e.g. a string)
  //  then it usually returns this type (e.g. `#chunk()). Other functions that
  //  indicate that they accept an `'array type actually accept any
  //  `#isArrayLike object (string, `'Arguments, jQuery collection, etc.) but
  //  return a regular array. For example, `#shuffle`[('abc')`] returns
  //  `[['b', 'c', 'a']`].
  //* Original values are never modified. This is unlike some standard methods
  //  that mutate the input, like `@o:Array/sort`@().
  //* Argument named `'cx is optional and specifies "calling ConteXt" for a
  //  callback function (usually named `'func). If omitted, equals to the global
  //  context (`'window or other).
  //* Commonly used aliases like `'contains() for `#includes() exist but
  //  unaliased names match those defined in ECMAScript. Removing them saves 1K
  //  (minified).
  var NoDash = {
    // Version of the library in use.
    //?`[
    //    if (_.NODASH) { ... }
    // `]
    NODASH: '0.10',

    // Special `'{} value that can be given to NoDash's `#forEach() and others
    // to make them treat an `#isArrayLike value like an object.
    forceObject: fo,

    //! +fn=noConflict
    // When NoDash is used outside of a module, restores old value of global `'_
    // and returns the `'NoDash object.

    // Originally Array functions.

    // Calls `'func for every own member of `'value.
    //= undefined
    //#fe
    //> value array`, object
    //> func `- receives member's value, its key and the entire `'value
    //#
    // ECMAScript equivalent: `@o:Array/forEach`@. See also `#invoke().
    //?`[
    //    var o = {}
    //    _.forEach('abc', (char, index) => o.char = index)
    //      // o is {a: 0, b: 1, c: 2}
    // `]
    //#fo
    // Warning: `#isArrayLike `'object is treated as `'array:
    //[
    //   _.forEach({a: 2, 0: {b: 3}, length: '1'}, v => log(v))
    //      // logs 2 (key 'a'), {b: 3} (key '0') and '1' (key 'length')
    //   _.forEach({a: 2, 0: {b: 3}, length: 1}, v => log(v))
    //      // logs only {b: 3} (key '0')
    //   _.pick({a: 2, 0: {b: 3}, length: 1}, 'a')  //=> []
    //]
    // Give `#forceObject as the last argument to treat `'value as an object:
    //[
    //   _.forEach({a: 2, 0: {b: 3}, length: 1}, v => log(v), _.forceObject)
    //      // logs 'a', '0', 'length'
    //   _.pick({a: 2, 0: {b: 3}, length: 1}, 'a', _.forceObject)   //=> {a: 2}
    //]
    forEach: function (value, func, cx) {
      return transform(value, arguments, 1, ap.forEach, function () {
        Object.keys(value).forEach(function (key) {
          func.call(cx, value[key], key, value)
        })
      })
    },
    // Returns a copy of `'value with values replaced by results of calling
    // `'func for each member.
    //= array`, object
    //#-fe
    // ECMAScript equivalent: `@o:Array/map`@. See also `#pluck().
    //?`[
    //    _.map([1, 2], v => v * 2)               //=> [2, 4]
    //    _.map({a: 1, b: 2}, v => v * 2)         //=> {a: 2, b: 4}
    //    _.map('\1\2\3', v => v.charCodeAt(0))   //=> [1, 2, 3]
    // `]
    //#-fo
    map: function (value, func, cx) {
      return transform(value, arguments, 1, ap.map, function () {
        var res = {}
        NoDash.forEach(value, function (v, k) {
          res[k] = func.apply(cx, arguments)
        }, fo)
        return res
      })
    },
    //! `, +fna=function ( value, func [, initial )
    // Calls `'func for every member of `'value, returning result of the last
    // call.
    //
    //#rd
    //= mixed as returned by `'func, or `'initial if given and `'value is empty
    //> value array`, object
    //> func `- receives result of the previous `'func call, member's value, its
    //  key and the entire `'value
    //> initial omitted`, mixed `- if omitted, `'func is not called for the
    //  first time; instead, that member's value is used as if it was returned
    //  by `'func; will throw if omitted and `'value is empty
    //#
    // ECMAScript equivalent: `@o:Array/reduce`@. See also `#sum() and
    // `#reduceRight() that iterates from the end of `'value.
    //
    //#unordered
    // Attention: be wary about object `'value - JavaScript objects are
    // unordered.
    //
    //#
    // ` `#reduce() visits members of object `'value in arbitrary order.
    //?`[
    //    _.reduce([1, 2, 3], (memo, v) => memo + v)      //=> 1 + 2 + 3 = 6
    //    _.reduce([1, 2, 3], (memo, v) => memo + v, '')  //=> '' + 1 + 2 + 3 = '123'
    // `]
    //
    //#-fo
    reduce: function (value, func, initial) {
      return transform(value, arguments, 1, ap.reduce, function () {
        arguments[0] = function (memo, item) {
          return func(memo, item[1], item[0], value)
        }
        return ap.reduce.apply(NoDash.entries(value), arguments)
      })
    },
    //! `, +fna=function ( value, func [, initial )
    // Calls `'func for every member of `'value starting from the last member,
    // returning result of the last call.
    //
    //#-rd
    // ECMAScript equivalent: `@o:Array/reduceRight`@. See also `#reduce() that
    // iterates from the start of `'value.
    //
    // ` `#reduceRight() does not support object `'value.
    reduceRight: function (value, func, initial) {
      return transform(value, arguments, 1, ap.reduceRight, objectNotSupported('reduceRight'))
    },
    // Returns key of the first member of `'value for which `'func has returned
    // truthyness.
    //= int for array `'value (-1 if not found)`, scalar for object (`'undefined
    //  if not found)
    //#-fe
    // ECMAScript equivalent: `@o:Array/findIndex`@ (not in IE).
    // See also `#find() that returns the value.
    //
    //#-unordered
    // ` `#findIndex() returns a key, not index for object `'value, and it
    // returns an arbitrary match if there are multiple matching object members.
    //?`[
    //    _.findIndex(['a', 'b', 'c'], v => v == 'b')   //=> 1
    //    _.findIndex({a: 1, b: 2}, v => v == 2)        //=> 'b'
    // `]
    //#-fo
    findIndex: function (value, func, cx) {
      function iterator(item, key) {
        if (func.apply(cx, arguments)) {
          res = key
          return true
        }
      }
      var res = -1
      var args = [iterator, arguments[arguments.length - 1] /*forceObject*/]
      transform(value, args, 0, ap.some, function () {
        res = undefined
        // findIndex() is used by some() so it cannot call the latter.
        Object.keys(value).some(function (key) {
          return iterator(value[key], key, value)
        })
      })
      return res
    },
    // Returns first member for which `'func has returned truthyness.
    //= mixed`, undefined if not found
    //#-fe
    // ECMAScript equivalent: `@o:Array/find`@ (not in IE).
    // See also `#findIndex() that returns the key.
    //
    //#-unordered
    // ` `#find() returns an arbitrary match if there are multiple matching
    // object members.
    //?`[
    //    _.find(['a', 'bb', 'ccc'], v => v.length < 2)   //=> 'a'
    //    _.find({a: 1, b: 2}, v => v < 2)        //=> 1
    // `]
    //#-fo
    find: function (value, func, cx) {
      var index = NoDash.findIndex.apply(undefined, arguments)
      // -1 can't occur for object, and if -1 then it's an array and so will
      // return undefined unless value has something at -1 index (unlikely).
      if (index !== undefined) { return value[index] }
    },
    // Returns a copy of `'value without members for which `'func has returned
    // falsyness.
    //= array`, object
    //#-fe
    // ECMAScript equivalent: `@o:Array/filter`@. See also `#reject(),
    // `#compact(), `#partition().
    //?`[
    //    _.filter([1, 2, 3], v => v > 1)       //=> [2, 3]
    //    _.filter({a: 1, b: 2}, v => v > 1)    //=> {b: 2}
    //    _.filter('a-_@', v => /\w/.test(v))   //=> ['a', '_']
    // `]
    //#-fo
    filter: function (value, func, cx) {
      return transform(value, arguments, 1, ap.filter, function () {
        var res = {}
        Object.keys(value).forEach(function (key) {
          var item = value[key]
          if (func.call(cx, item, key, value)) {
            res[key] = item
          }
        })
        return res
      })
    },
    // Returns `'true if `'func returned truthyness for every member of `'value.
    //
    //#-fe
    // ECMAScript equivalent: `@o:Array/every`@. See also `#some().
    //?`[
    //    _.every([1, 2, 3], v => v > 1)      //=> false
    //    _.every({a: 1, b: 2}, v => v < 1)   //=> true
    //    _.every('a-_@', v => /w/.test(v))   //=> false
    // `]
    //#-fo
    every: function (value, func, cx) {
      return transform(value, arguments, 1, ap.every, function () {
        return NoDash.findIndex(value, NoDash.negate(func), cx, fo) === undefined
      })
    },
    // Returns `'true if `'func returned truthyness for any member of `'value.
    //
    //#-fe
    // ECMAScript equivalent: `@o:Array/some`@. See also `#every().
    //?`[
    //    _.some([1, 2, 3], v => v > 1)      //=> true
    //    _.some({a: 1, b: 2}, v => v < 1)   //=> false
    //    _.some('a-_@', v => /w/.test(v))   //=> true
    // `]
    //#-fo
    some: function (value, func, cx) {
      return transform(value, arguments, 1, ap.some, function () {
        return NoDash.findIndex(value, func, cx, fo) !== undefined
      })
    },
    // Returns a copy of `'value with members sorted according to `'func.
    //= array `- even for object `'value
    //> value array`, object
    //> func `- receives `[av, bv, ak, bk`] and should return a positive value
    //  if `'av must appear after `'bv, negative if before, or zero if they may
    //  appear in any order (makes sorting unstable); `'ak and `'bk are their
    //  keys within `'value and are only not given for object `'value
    // ECMAScript equivalent: `@o:Array/sort`@. See also `#sortBy().
    //?`[
    //    _.sort([5, 1, 3], (a, b) => a - b)      //=> [1, 3, 5]
    //    _.sort({a: 5, b: 2}, (a, b) => a - b)   //=> [2, 5]
    // `]
    //#-fo
    sort: function (value, func) {
      return transform(value, arguments, 1, cloner(ap.sort), function () {
        return NoDash.entries(value, fo)
          .sort(function (a, b) {
            return func.call(undefined, a[1], b[1], a[0], b[0])
          })
          .map(function (item) { return item[1] })
      })
    },
    //! `, +fna=function ( value, member [, fromIndex] )
    // Returns `'true if `'value contains `'member.
    //
    //#in
    //> value array`, object`, string
    //> fromIndex omitted = 0`, int `- if negative, counts from the end; for
    //  string `'value this differs from ECMAScript where 0 is assumed
    //  (`@o:String/indexOf`@)
    //#
    // ECMAScript equivalent: `@o:Array/includes`@ (not in IE).
    // See also `#indexOf().
    //?`[
    //    _.includes([5, 1, 3], 5)      //=> true
    //    _.includes([5, 1, 3], 5, 1)   //=> false
    //    _.includes([5, 1, 3], 3, -1)  //=> true
    //    _.includes({a: 1, b: 2}, 2)   //=> true
    //    _.includes('abc', 'bc', 1)    //=> true
    // `]
    //#-fo
    // ` `#forceObject is ignored if given a string `'value.
    includes: function (value, member, fromIndex) {
      var index = NoDash.indexOf.apply(undefined, arguments)
      return index !== -1 /* remember: -1 == '-1' */ && index !== undefined
    },
    //! `, +fna=function ( value, member [, fromIndex] )
    // Returns key of the first `'member appearance in `'value (`[===`]), or
    // `'-1 (array/string `'value) or `'undefined (object `'value).
    //
    //#-in
    // ECMAScript equivalent: `@o:Array/indexOf`@. See also `#includes(),
    // `#lastIndexOf().
    //
    //#-unordered
    // ` `#indexOf() returns key of arbitrary `'member's occurrence and does not
    // support `'fromIndex.
    //?`[
    //    _.indexOf([5, 1, 3], 5)      //=> 0
    //    _.indexOf([5, 1, 3], 5, 1)   //=> -1
    //    _.indexOf([5, 1, 3], 3, -1)  //=> 2
    //    _.indexOf({a: 1, b: 2}, 2)   //=> 'b'
    //    _.indexOf({a: 1, b: 2}, 9)   //=> undefined
    //    _.indexOf('abc', 'bc', 1)    //=> 1
    // `]
    // If `'member exists, result is always a number (array/string `'value) or
    // string (object `'value). The `['-1'`] string indicates a found `'member
    // for object `'value so use `'=== to test `#indexOf()'s result if `'value
    // may be of the either type:
    //[
    //    _.indexOf([], 0) ==  _.indexOf({'-1': 0}, 0)   //=> true: -1 == '-1'
    //    _.indexOf([], 0) === _.indexOf({'-1': 0}, 0)   //=> false
    //]
    //#-fo
    // ` `#forceObject is ignored if given a string `'value.
    indexOf: function (value, member, fromIndex) {
      // ap.indexOf.call('foo') works but only on substrings of 1 character.
      if (typeof value == 'string') {
        fromIndex < 0 && (fromIndex += value.length)
        return value.indexOf(member, fromIndex)
      }
      return transform(value, arguments, 1, ap.indexOf, function (member, fromIndex) {
        if (fromIndex != null) {
          throw new TypeError('indexOf() does not support fromIndex for object value.')
        }
        return NoDash.findIndex(value, function (m) { return m === member }, fo)
      })
    },
    //! `, +fna=function ( value, member [, fromIndex] )
    // Returns key of the last `'member appearance in `'value (`[===`]), or
    // `'-1.
    //
    //#-in
    // ECMAScript equivalent: `@o:Array/lastIndexOf`@. See also `#indexOf().
    //
    // ` `#lastIndexOf() does not support object `'value.
    //?`[
    //    _.lastIndexOf([1, 2, 1], 1)     //=> 2
    //    _.lastIndexOf([1, 2, 1], 2, 0)  //=> -1
    //    _.lastIndexOf([1, 2, 1], 2, 2)  //=> 1
    //    _.lastIndexOf('baba', 'ba')     //=> 2
    //    _.indexOf({a: 1, b: 1}, 2)      //=> 'b'
    //    _.indexOf('baba', 'ba', 1)      //=> 2
    // `]
    lastIndexOf: function (value, member, fromIndex) {
      if (typeof value == 'string') {
        fromIndex < 0 && (fromIndex += value.length)
        return value.lastIndexOf(member, fromIndex)
      }
      return transform(value, arguments, 1, ap.lastIndexOf, objectNotSupported('lastIndexOf'))
    },
    //! `, +fna=function ( value [, begin [, end]] )
    // Returns a portion of `'value.
    //= array`, object
    //> value array`, object
    //#slbe
    //> begin int`, omitted = 0 `- starting index
    //> end int`, omitted = `'length `- index of the member `*after last`*
    //  included in the result; if negative set to `[length - end`] (hence give
    //  `'-1 to omit last member)
    //#
    // ECMAScript equivalent: `@o:Array/slice`@.
    //
    //#slend
    // Attention: `#slice(), `@o:String/substring`@() and `#fill() accept `'end
    // as an index (exclusive!) while `@o:Array/splice`@() and
    // `@o:String/substr`@() - as a length. Also, `#fill()'s `'end cannot be
    // negative.
    //
    //#-unordered
    // ` `#slice() returns arbitrary members for object `'value.
    //?`[
    //    _.slice('abc', 0, 2)          //=> 'ab'
    //    _.slice([1, 2, 3], 1)         //=> [2, 3]
    //    _.slice({a: 1, b: 2}, 0, 1)   //=> {a: 1}
    // `]
    //#-fo
    slice: function (value, begin, end) {
      return transform(value, arguments, 1, ap.slice, function (begin, end) {
        return NoDash.fromEntries(NoDash.entries(value, fo).slice(begin, end))
      })
    },
    // Returns the copy of `'values with members in reverse order.
    //= array
    //> value array
    // ECMAScript equivalent: `@o:Array/reverse`@.
    //
    //?`[
    //    _.reverse([5, 1, 3])      //=> [3, 1, 5]
    // `]
    reverse: function (value) {
      return transform(value, [], 0, cloner(ap.reverse), objectNotSupported('reverse'))
    },
    // Returns a string consisting of stringified members of `'value separated
    // by `'glue.
    //= str
    //> value array`, object `- `'null and `'undefined members are seen as blank
    //  strings
    //> glue str`, undefined = `',
    // ECMAScript equivalent: `@o:Array/join`@.
    //
    //#-unordered
    // ` `#join() combines object `'value's members in arbitrary order.
    //?`[
    //    _.join([1, null, 3])        //=> 1,,3
    //    _.join({a: 1, b: 2}, '-')   //=> 1-2
    // `]
    //#-fo
    join: function (value, glue) {
      return transform(value, arguments, 1, ap.join, function (glue) {
        return Object.keys(value)
          .map(function (key) {
            var item = value[key]
            return item == null ? '' : item
          })
          .join(glue === undefined ? ',' : glue)
      })
    },
    //! `, +fna=function ( value [, depth] )
    // "Unwraps" nested arrays or objects in `'value.
    //= array with sparse slots removed`, object with duplicate keys keeping
    //  arbitrary value
    //> value array`, object `- nested members of the same type are flattened:
    //  arrays in array (in original positions), objects in object
    //> depth int`, omitted = 1 `- number of nesting levels to flatten; use
    //  `'Infinity to flatten all
    // ECMAScript equivalent: `@o:Array/flat`@ (not in IE).
    //?`[
    //    _.flat([[[1]], {b: 2}, 3])            //=> [[1], {b: 2}, 3]
    //    _.flat([[[1]], {b: 2}, 3], 2)         //=> [1, {b: 2}, 3]
    //    _.flat({a: [1], b: {c: 3}, d: [2]})   //=> {0: 1, c: 3} or {0: 2, c: 3}
    // `]
    //#-unordered
    // ` `#flat() keeps value of the arbitrary key of duplicate object keys (see
    // last example).
    flat: function (value, depth) {
      depth = depth || 1
      if (!NoDash.isArrayLike(value)) {
        value = NoDash.entries(value)
        while (--depth >= 0) {
          var changed = false
          for (var i = value.length - 1; i >= 0; i--) {
            var item = value[i][1]
            if (item instanceof Object) {
              changed = value.splice.apply(value, [i, 1].concat(NoDash.entries(item)))
            }
          }
          if (!changed) {
            break
          }
        }
        return NoDash.fromEntries(value)
      } else if (ap.flat) {
        return ap.flat.call(value, depth)
      } else {
        while (--depth >= 0) {
          value = ap.concat.apply([], value.filter(function () { return true }))
          // It's deemed faster to iterate over specific depths (which is
          // typically 1) even without changing value than checking every member
          // for array-likeness.
          if (depth == Infinity && !value.some(NoDash.isArrayLike)) {
            break
          }
        }
        return value
      }
    },
    //! `, +fna=function ( value [, filler [, begin [, end]]] )
    // Returns a copy of `'value with values of members in the given range
    // changed to `'filler.
    //= array`, object
    //> value array`, object
    //> filler mixed
    //> begin int`, omitted = 0 `- starting index
    //> end int`, omitted = `'length `- index of the member `*after last`*
    //  included in the result
    // ECMAScript equivalent: `@o:Array/fill`@ (not in IE).
    // See also `#repeat(), `#object().
    //
    //#-slend
    //#-unordered
    // ` `#fill() affects arbitrary keys if `'being or `'end is used.
    //?`[
    //    _.fill([1, 2, 3], 'a', 0, -1)   //=> ['a', 'a', 3]
    //    _.fill({a: 1, b: 2}, 'a')       //=> {a: 'a', b: 'a'}
    // `]
    //? `'Array's constructor accepts new array's length and creates a sparse
    //  `'Array where members are sort of `'undefined but can't be iterated over
    //  `*except`* by some methods (e.g. `@o:Array/find`@). `#fill() can
    //  "un-sparse" it by assigning `'undefined till array's `'length:
    //  `[
    //    Array(3)                //=> [<3 empty slots>]
    //    _.fill(Array(3))        //=> [undefined, undefined, undefined]
    //    _.fill(Array(3), 'a')   //=> ['a', 'a', 'a']
    //
    //    Array(3).map(i => alert(i))
    //      // no alerts
    //    Array(3).find(i => alert(i))
    //      // 3 alerts
    //    _.fill(Array(3), 'a'),map(i => alert(i))
    //      // 3 alerts
    //  `]
    fill: function (value, filler, begin, end) {
      if (NoDash.isArrayLike(value) && ap.fill) {
        return ap.slice.call(value).fill(filler, begin, end)
      } else {
        var isArray = NoDash.isArrayLike(value)
        value = NoDash.entries(value)
        begin = begin || 0
        if (arguments.length < 4) { end = Infinity }
        for (; begin < end && begin < value.length; begin++) {
          value[begin][1] = filler
        }
        return isArray
          ? value.map(function (item) { return item[1] })
          : NoDash.fromEntries(value)
      }
    },

    // Originally Object functions.

    // Returns an array of arrays with key-value pairs for each member of
    // `'value.
    //= array `- 0th members (keys) are always strings (object `'value) or
    //  numbers (other)
    //> value array`, object`, string
    // ECMAScript equivalent: `@o:Object/entries`@ (not in IE).
    // See also `#fromEntries().
    //
    //#-unordered
    // ` `#entries() returns object `'value's pairs in arbitrary order.
    //?`[
    //    _.entries(['a', 'b'])     //=> [[0, 'a'], [1, 'b']]
    //    _.entries({a: 1, b: 2})   //=> [['a', 1], ['b', 2]]
    //    _.entries('ab')           //=> [[0, 'a'], [1, 'b']]
    // `]
    //#-fo
    entries: function (value) {
      return transform(value, arguments, 0,
        function () {
          return NoDash.map(value, function (item, key) {
            return [key, item]
          })
        },
        Object.entries || function () {
          return Object.keys(value).map(function (key) {
            return [key, value[key]]
          })
        }
      )
    },
    // Returns an object constructed from arrays of key-value pairs.
    //= object
    //> value array`, object
    // See also `#entries().
    //
    //#-unordered
    // "Order" of returned object's keys won't match order of pairs in `'value.
    //?`[
    //    _.entries([['a', 1], ['b', 2]])   //=> {a: 1, b: 2}
    //    _.entries([[0, 'a'], [1, 'b']])   //=> {0: 'a', 1: 'b'}
    // `]
    //? Get an array or string result (their members will be in arbitrary order
    //  so you might want to `#sort() it):
    //  `[
    //    _.toArray(_.fromEntries([[0, 'a'], [1, 'b']]))  //=> ['a', 'b']
    //    _.toArray(_.fromEntries(...)).join('')          //=> 'ab'
    //  `]
    fromEntries: function (value) {
      var obj = {}
      NoDash.forEach(value, function (item) {
        obj[item[0]] = item[1]
      })
      return obj
    },
    // Returns keys of members in `'value.
    //= array
    //> value array`, object
    // ECMAScript equivalent: `@o:Object/keys`@. See also `#values().
    //?`[
    //    _.keys([1, 2])        //=> [0, 1]
    //    _.keys(Array(3))      //=> [0, 1, 2]
    //    _.keys({a: 1, b: 2})  //=> ['a', 'b']
    //    _.keys('abc')         //=> [0, 1, 2]
    // `]
    //#-fo
    keys: function (value) {
      return transform(value, arguments, 0, function () {
        return NoDash.range(value.length)
      }, Object.keys)
    },
    // Returns values of members in `'value.
    //= array with `#has() properties
    //> value array`, object `- in all cases returns a shallow copy
    // ECMAScript equivalent: `@o:Array/slice`@, `@o:Object/values`@
    // (not in IE). See also `#toArray(), `#keys().
    //?`[
    //    _.values([1, 2])        //=> [1, 2]
    //    _.values(Array(3))      //=> [<3 empty slots>]
    //    _.values({a: 1, b: 2})  //=> [1, 2]
    //    _.values('abc')         //=> ['a', 'b', 'c']
    // `]
    //#-fo
    values: function (value) {
      // ap.slice() splits a string, ap.concat() doesn't.
      return transform(value, arguments, 1, ap.slice, function () {
        return Object.values
          ? Object.values(value)
          : Object.keys(value).map(function (key) { return value[key] })
      })
    },
    //! +ig +fn=assign:...objects
    // Merges members of given objects into the first argument, overwriting keys
    // of earlier arguments with later ones.
    //= object first of given arguments
    //> objects `- only object-type arguments
    // ECMAScript equivalent: `@o:Object/assign`@ (not in IE).
    // See also `#union(), `#intersection().
    //
    // ` `*Warning: `#assign() mutates the first argument (and returns it).`*
    //?`[
    //    _.assign({})              //=> the argument unchanged
    //    _.assign({}, {a: 1})      //=> first argument changed to {a: 1}
    //    _.assign({b: 3}, {b: 4})  //=> first argument changed to {b: 4}
    // `]
    //#a2o
    //? Converting an object with numeric keys to an (ordered) array and back
    //  (`#assign, `#flip):
    //  `[
    //    _.assign([], {2: 'a', 0: 'b'})  //=> ['b', , 'a']
    //    _.flip(['b', , 'a'])            //=> {0: 'b', 1: undefined, 2: 'a'}
    //  `]
    //
    //#
    // Only own properties are considered (`#has()):
    //[
    //    _.assign({toString: f}, {})
    //      //=> first argument unchanged, even though: 'toString' in {}
    //]
    assign: Object.assign || function () {
      // If the environment (line above) is capable of assign() then it can
      // handle Symbol-s as well. If it isn't, then it doesn't support Symbol
      // and we can iterate over objects normally.
      var cur = arguments[0]
      var keys = {}
      for (var i = arguments.length - 1; i >= 1; i--) {
        Object.keys(arguments[i]).forEach(function (item, key) {
          if (!NoDash.has(keys, key)) {
            keys[key] = null
            cur[key] = item
          }
        })
      }
      return cur
    },
    // Returns `'true if `'value has defined `'property.
    //> value `- any object type - `'Array, `'Function, etc.
    // ECMAScript equivalent: `@o:Object/hasOwnProperty`@.
    // See also `#allKeys(), `#values().
    //?`[
    //    'toString' in {}
    //      //=> true (coming from Object.prototype)
    //    _.has({}, 'toString')              //=> false
    //    _.has({toString: f}, 'toString')   //=> true
    //
    //    'length' in []                     //=> true
    //    _.has([], 'length')                //=> false
    // `]
    has: function (value, property) {
      return Object.prototype.hasOwnProperty.call(value, property)
    },

    // Originally String functions.

    //! `, +fna=function ( value, sub [, startIndex] )
    // Returns `'true if `'value has `'sub at `'startIndex (or 0).
    //
    //#sw
    //> value array`, string
    //> sub `- same type as `'value; if empty, always returns `'true
    //#
    //> startIndex omitted = 0`, int `- negative set to 0
    // ECMAScript equivalent: `@o:String/startsWith`@ (not in IE).
    // See also `#endsWith().
    //
    //?`[
    //    _.startsWith('abc', 'ab')                 //=> true
    //    _.startsWith('abc', 'bc', 1)              //=> true
    //    _.startsWith(['ab', 'cd'], ['ab'])        //=> true
    //    _.startsWith(['ab', 'cd'], ['ab', 'cd'])  //=> true
    //    _.startsWith([{}], [{}])                  //=> false ({} !== {})
    // `]
    startsWith: function (value, sub, startIndex) {
      startIndex > 0 /*not undefined/NaN/etc.*/ || (startIndex = 0)
      if (typeof value == 'string') {
        return value.substr(startIndex, sub.length) == sub
      }
      var part = NoDash.slice(value, startIndex, startIndex + sub.length)
      return part.length == sub.length &&
        part.every(function (item, index) { return item === sub[index] })
    },
    //! `, +fna=function ( value, sub [, endIndex] )
    // Returns `'true if `'value has `'sub ending at `'endIndex (or `'length).
    //
    //#-sw
    //> endIndex omitted = `'length`, int `- negative set to 0 (will match only
    //  for empty `'sub)
    // ECMAScript equivalent: `@o:String/endsWith`@ (not in IE).
    // See also `#startsWith().
    //
    //?`[
    //    _.endsWith('abc', 'bc')                 //=> true
    //    _.endsWith('abc', 'ab', 2)              //=> true
    //    _.endsWith(['ab', 'cd'], ['cd'])        //=> true
    //    _.endsWith(['ab', 'cd'], ['ab', 'cd'])  //=> true
    // `]
    endsWith: function (value, sub, endIndex) {
      var i = arguments.length < 3 ? value.length : endIndex > 0 ? endIndex : 0
      return NoDash.startsWith(value, sub, i - sub.length)
    },
    //! `, +fna=function ( value, length [, pad] )
    // Returns a copy of `'value, with prepended `'pad if its `'length was too
    // short.
    //
    //#ps
    //= array`, string `- always shallow-copied, even if `'value was long enough
    //> value array`, string
    //> length int `- desired returned value's length
    //> pad mixed for array `'value`, string for string `'value`,
    //  omitted = `'undefined or `[' '`]
    //#
    // ECMAScript equivalent: `@o:String/padStart`@ (not in IE).
    // See also `#padEnd().
    //?`[
    //    _.padStart('abc', 5)        //=> '  abc'
    //    _.padStart('abcdef', 5)     //=> 'abcdef'
    //    _.padStart('abc', 5, 'z')   //=> 'zzabc'
    //    _.padStart([], 3)           //=> [undefined, undefined, undefined]
    //    _.padStart(['a'], 3, 'z')   //=> ['z', 'z', 'a']
    // `]
    padStart: function (value, length, pad, end) {
      if (!Array.isArray(value)) { value += '' }  // Number, etc.
      var add = Math.max(0, length - NoDash.size(value))
      if (typeof value == 'string') {
        if (arguments.length < 3) { pad = ' ' }
        pad = Array(add + 1).join(pad).substr(0, add)
      } else {
        pad = NoDash.fill(Array(add), pad)
      }
      return end === unset ? value.concat(pad) : pad.concat(value)
    },
    //! `, +fna=function ( value, length [, pad] )
    // Returns a copy of `'value, with appended `'pad if its `'length was too
    // short.
    //
    //#-ps
    // ECMAScript equivalent: `@o:String/padEnd`@ (not in IE).
    // See also `#padStart().
    //?`[
    //    _.padEnd('abc', 5)        //=> 'abc  '
    //    _.padEnd('abcdef', 5)     //=> 'abcdef'
    //    _.padEnd('abc', 5, 'z')   //=> 'abczz'
    //    _.padEnd([], 3)           //=> [undefined, undefined, undefined]
    //    _.padEnd(['a'], 3, 'z')   //=> ['a', 'z', 'z']
    // `]
    padEnd: function (value, length, pad) {
      if (arguments.length < 3 && !Array.isArray(value)) { pad = ' ' }
      return NoDash.padStart(value, length, pad, unset)
    },
    // Returns copies of `'value duplicated `'count times.
    //= array`, string
    //> value array`, string
    // ECMAScript equivalent: `@o:String/repeat`@ (not in IE).
    // See also `#fill().
    //?`[
    //    _.repeat('ab', 3)             //=> 'ababab'
    //    _.repeat(['ab', 'cd'], 3)     //=> ['ab', 'cd', 'ab', 'cd', 'ab', 'cd']
    //    _.repeat([['ab', 'cd']], 2)   //=> [['ab', 'cd'], ['ab', 'cd']]
    // `]
    repeat: function (value, count) {
      return typeof value == 'string' && value.repeat ? value.repeat(count)
        : value.concat.apply(value.constructor(), NoDash.fill(Array(count), value))
    },
    //! `, +fna=function ( value [, blank] )
    // Returns a copy of `'value with certain "blanks" in start and end removed.
    //
    //#tr
    //= array`, string
    //> value array`, string
    //> blank mixed for array `'value`, string character list`,
    //  RegExp without `'/g flag`,
    //  omitted = falsy for array, whitespace (`[/\s/`]) for string
    //?`[
    //    _.trim(' abca ')            //=> 'abca'
    //    _.trim('abca ', 'ba')       //=> 'ca '
    //    _.trim('.ab.c.', /\w\W/)    //=> '.a'
    //    _.trim(['ab', 'cd'], 'ab')  //=> ['cd']
    //    _.trim(Array(5))            //=> []
    // `]
    //#
    // ECMAScript equivalent: `@o:String/trim`@. See also `#trimStart(),
    // `#trimEnd().
    trim: function (value, blank) {
      return trim(true, true, value, blank, arguments.length < 2)
    },
    //! `, +fna=function ( value [, blank] )
    // Returns a copy of `'value with certain leading "blanks" removed.
    //
    //#-tr
    // ECMAScript equivalent: `@o:String/trimStart`@ (not in IE).
    // See also `#trim(), `#trimEnd().
    trimStart: function (value, blank) {
      return trim(true, false, value, blank, arguments.length < 2)
    },
    //! `, +fna=function ( value [, blank] )
    // Returns a copy of `'value with certain trailing "blanks" removed.
    //
    //#-tr
    // ECMAScript equivalent: `@o:String/trimEnd`@ (not in IE).
    // See also `#trim(), `#trimStart().
    trimEnd: function (value, blank) {
      return trim(false, true, value, blank, arguments.length < 2)
    },
    // Replaces `[& < " '`] in `'value with equivalent HTML entitites.
    //= array`, object`, string
    //> value array/object members escaped recursively (on `#isArrayLike basis,
    //  `'forceObject not supported)`,
    //  string`, null/undefined as empty string`, other treat as string
    // The `'> is not escaped since it's not special unless your markup is
    // already broken (e.g. not using quotes for attributes). See
    // `@https://mathiasbynens.be/notes/ambiguous-ampersands`@ (thanks LoDash,
    // `@lo:escape`@()).
    //?`[
    //    _.escape(' & < " \' > ')    //=> ' &amp; &lt; &quot; &#39; > '
    //    _.escape(['a&b', '<c>d'])   //=> ['a&amp;b', '&lt;c>d']
    //    _.escape({a: '"b\''})       //=> {a: '&quot;b&#39;'}
    //    _.escape([{a: '"b\''}])     //=> [{a: '&quot;b&#39;'}]
    //    _.escape(null)              //=> ''
    // `]
    //* With jQuery you'd escape like so: `[$('<p>').text(value).html()`].
    //* Not to be confused with standard `@o:escape`@() used for URL encoding.
    //# Escaping content of `[<script>`], `[<template>`] and `[<style>`]
    // Do not use `#escape() to generate content that will be inserted into
    // these tags! Not only `'value's semantics will be different when parsed,
    // there is also no guarantee that `'value doesn't break out of its tag
    // (read, XSS).
    //
    // Sadly, there is no universal rule for these three tags because escaping
    // style depends on the parsing context (expression, string content, etc.)
    // and even the document's HTML version.
    //
    // In HTML prior to 5, the SGML spec
    // (`@https://www.w3.org/TR/html4/types.html#type-cdata`@) tells that only
    // the sequence `'</ terminates `'script and `'style (HTML 4 has no
    // `'template). But in HTML 5 for "legacy reasons" the rules are more
    // involved and the spec
    // (`@https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements`@)
    // suggests to escape `[<!--`], `[<script`] and `[</script`] (both
    // case-insensitive). In this example (HTML 5) the last line actually does
    // not close the tag which continues until the next `[</script>`] (do note
    // that JavaScript context is irrelevant to these tokens):
    //[
    //   <script>
    //     const example = 'Consider this string: <!-- <script>';
    //   </script>
    //]
    // But it works if `'< is replaced with `'\x3C inside the string:
    //[
    //     const example = 'Consider this string: \x3C!-- \x3Cscript>';
    //]
    // However, it does not work with expressions where string escape sequences
    // are taken literally. Such places may be rewritten, for example by
    // inserting an insignificant whitespace after `[<`]:
    //[
    //     if (x<!--y) { ... }
    //     if ( player<script ) { ... }
    //     if ( player<// comment...
    //
    //     if (x\x3C!--y) { ... }   // wrong
    //     if (x< !--y) { ... }     // correct
    //     if (!--y > x) { ... }    // correct
    //]
    // All this equally applies to `'template as it does to `'script.
    //
    // This means you cannot just take an arbitrary JavaScript snippet, escape
    // it without parsing and insert into a `'script tag. But you can use this
    // to escape JSON expressions placed inside `'script or `'template (since in
    // valid JSON `'< may only appear within strings and they support `'\x3C):
    //[
    //   function escapeJSON(value) {
    //     return JSON.stringify(value).replace(/<(!--|\/?script)/ig, '\\x3C$1')
    //   }
    //
    //   var html = '<template>'
    //   html += 'var data = ' + escapeJSON(['<!--', '</template>'])
    //   html += '</template>'
    //]
    // Many popular frameworks (Flask, Django, Rails, etc.) wrongly provide the
    // one-size-fits-all escape function which even if prevents XSS inevitably
    // results in a mangled value (at best) when parsed. For example, PHP's
    // `'json_encode() converts `'/ to `'\/ by default but it has no effect on
    // `'< so the following string results in an unclosed `'script tag, eating
    // `[</script>`] and the rest of the document:
    //[
    //   <script>var s = <?=json_encode('<!--<script>')?></script>
    //]
    //
    // In HTML 5 `'style, `'<!-- has no special meaning and it's enough to
    // simply replace all `[</style>`] (case-insensitive) with something like
    // `[<\/style>`] (`'\x3C is unsupported but `'\/ equals literal `[/`]). I
    // cannot think of a valid CSS where `[</style>`] can appear as part of an
    // expression, not a string or a comment so I assume this rule is
    // context-free.
    //[
    //   function escapeStyle(value) {
    //     return (value + '').replace(/<\/(style>)/ig, '<\\/$1')
    //   }
    //
    //   var html = '<style>'
    //   html += 'body { background: url(' + escapeStyle('</style>.png') + '); }')
    //   html += '</style>'
    //]
    // Thankfully, this all does not concern HTML attributes - as long as they
    // are quoted, `#escape() will ensure the content does not break out:
    //[
    //   var html = '<a onclick="alert(\'' + _.escape('</a>') + '\'">'
    //     //=> <a onclick="alert('&lt;/a&gt;')">
    //     // When clicked, alerts: </a>
    //]
    // The described scheme is only for encoding HTML. Different tags' DOM
    // interfaces act yet differently from that:
    //[
    //   <script>var x='&lt;<'</script>
    //     <!-- innerHTML and textContent are: var x='&lt;<' -->
    //   <template>var x='&lt;<'</template>
    //     <!-- innerHTML is: var x='&lt;&lt;' -->
    //     <!-- textContent is blank -->
    //   <style>var x='&lt;<'</style>
    //     <!-- innerHTML and textContent are the same as of <script> -->
    //   <div>var x='&lt;<'</div>
    //     <!-- innerHTML is: var x='&lt;&lt;' -->
    //     <!-- textContent is: var x='<<' -->
    //]
    escape: function (value) {
      if (value == null) {
        return ''
      } else if (typeof value == 'object') {
        return NoDash.map(value, NoDash.escape)
      } else {
        var to = {'&': 'amp', '<': 'lt', '"': 'quot', "'": '#39'}
        return (value + '')
          .replace(/[&<"']/g, function (m) { return '&' + to[m] + ';' })
      }
    },
    // Returns a string with all chararcters special within `'RegExp delimiters
    // prepended with a backslash.
    //?`[
    //    _.escapeRegExp('a.c*d-e')         //=> 'a\\.c\\*d\\-e'
    //    new RegExp(_.escapeRegExp('*'))   //=> /\*/
    // `]
    escapeRegExp: function (str) {
      // '-' in case escaping for a [character class], e.g. in trim*().
      return str.replace(/[-^$.*+?{}()[\]|\\]/g, '\\$&')
    },

    // Utilities not part of any ES standard, for this reason supporting array
    // callbacks (`#bind()).

    // Returns `'true if `'value is an array-like object.
    //
    // ` `#isArrayLike() is using the same criteria as ECMAScript's
    // `@o:Array/from`@, that is: a numeric `'length property.
    //
    // See also `#isArray, `#toArray(), `#size(), `#forceObject.
    //?`[
    //    _.isArrayLike(null)           //=> false
    //    _.isArrayLike([])             //=> true
    //    _.isArrayLike('')             //=> true
    //    _.isArrayLike(arguments)      //=> true
    //    _.isArrayLike({})             //=> false
    //    _.isArrayLike({length: 'z'})  //=> false
    //    _.isArrayLike({length: -1})   //=> true
    // `]
    isArrayLike: function (value) {
      return value != null && typeof value.length == 'number'
    },
    // Returns `'true if `'value is the special `'Arguments object available
    // inside functions.
    //?`[
    //    var f = function () { return _.isArguments(arguments) }
    //    f()   //=> true
    // `]
    isArguments: function (value) {
      return Object.prototype.toString.call(value) == '[object Arguments]'
    },
    // Returns `'true if `'value is falsy or has zero length or no keys (for
    // non-`#isArrayLike objects).
    //> value array`, object`, string`, falsy returns `'true
    //?`[
    //    _.isEmpty([])           //=> true
    //    _.isEmpty('')           //=> true
    //    _.isEmpty({})           //=> true
    //    _.isEmpty({length: 0})  //=> true
    //    _.isEmpty({a: 1})       //=> false
    // `]
    isEmpty: function (value) {
      return !value || (NoDash.isArrayLike(value) ? value : Object.keys(value)).length < 1
    },
    // Returns `'true if `'value is a native DOM `'Element.
    // See `@mdn:API/Node/nodeType`@.
    //?`[
    //    _.isElement(null)                           //=> false
    //    _.isElement($('p'))                         //=> false
    //    _.isElement(document.body)                  //=> true
    //    _.isElement(document.createTextNode('z'))   //=> false
    //    _.isElement(document)                       //=> false
    //    _.isElement(window)                         //=> false
    // `]
    isElement: function (value) {
      return value && value.nodeType === 1
    },
    //! `, +fna=function ( func [, numeric] )
    // Returns a function that calls `'func and inverts its result.
    //> func `- subject to `#bind()
    //> numeric `- if truthy, changes sign of `'func's result, else treats it as
    //  bool
    //?`[
    //    _.negate(() => true)      //=> will return false
    //    _.negate(() => -1, true)  //=> will return +1
    // `]
    negate: function (func, numeric) {
      func = bind(func)
      return function negate_() {
        var res = func.apply(this, arguments)
        return numeric ? -res : !res
      }
    },
    // Returns a copy of `'value without members for which `'func has returned
    // truthyness.
    //= array`, object
    //#-fe
    // See also `#filter(), `#compact(), `#partition().
    //
    // Since `#reject() is non-standard, its `'func is subject to `#bind() but
    // it's better not to rely on this for symmetry and in case it gets
    // standardized.
    reject: function (value, func, cx) {
      return NoDash.filter(value, NoDash.negate(func), cx)
    },
    //! `, +fna=function ( value [, length] )
    // Returns at most first `'length members of `'value.
    //
    //#fr
    //= mixed if `'length is omitted, `'undefined on empty `'value`,
    //  type of `'value
    //> value array`, object`, string
    //> length omitted return the value of one member`, int return a `#slice of
    //  `'value
    //##-unordered
    // This function returns arbitrary members for object `'value.
    //
    //#
    // See also `#last(), `#initial(), `#rest().
    //?`[
    //    _.first(['ab', 'cd'])       //=> 'ab'
    //    _.first(['ab', 'cd'], 1)    //=> ['ab']
    //    _.first(['ab', 'cd'], 2)    //=> ['ab', 'cd']
    //    _.first({a: 1, b: 2})       //=> 1
    //    _.first('abcdef')           //=> 'a'
    //    _.first('abcdef', 2)        //=> 'ab'
    // `]
    first: function (value, length) {
      return slice(value, 0, arguments.length > 1 ? length : 1, arguments.length <= 1)
    },
    //! `, +fna=function ( value [, length] )
    // Returns at most last `'length members of `'value.
    //
    //#-fr
    // See also `#first(), `#initial(), `#rest().
    //?`[
    //    _.last(['ab', 'cd'])       //=> 'cd'
    //    _.last(['ab', 'cd'], 1)    //=> ['cd']
    //    _.last(['ab', 'cd'], 2)    //=> ['ab', 'cd']
    //    _.last({a: 1, b: 2})       //=> 2
    //    _.last('abcdef')           //=> 'f'
    //    _.last('abcdef', 2)        //=> 'ef'
    // `]
    last: function (value, length) {
      return slice(value, arguments.length > 1 ? -length : -1, undefined, arguments.length <= 1)
    },
    //! `, +fna=function ( value [, length] )
    // Returns all members of `'value except for last `'length.
    //
    //#ini
    //= type of `'value
    //> value array`, object`, string
    //> length omitted = 1`, int
    //##-unordered
    //#
    // See also `#last(), `#first(), `#rest().
    //?`[
    //    _.initial(['a', 'b', 'c'])      //=> ['a', 'b']
    //    _.initial(['a', 'b', 'c'], 2)   //=> ['a']
    //    _.initial({a: 1, b: 2, c: 3})   //=> {a: 1, b: 2}
    //    _.initial('abcdef')             //=> 'abcde'
    //    _.initial('abcdef', 2)          //=> 'abcd'
    // `]
    initial: function (value, length) {
      var i = typeof value == 'string' && value.length
      return slice(value, 0, i + (arguments.length > 1 ? -length : -1))
    },
    //! `, +fna=function ( value [, length] )
    // Returns all members of `'value except for first `'length.
    //
    //#-ini
    // See also `#first(), `#last(), `#initial().
    //?`[
    //    _.rest(['a', 'b', 'c'])      //=> ['b', 'c']
    //    _.rest(['a', 'b', 'c'], 2)   //=> ['c']
    //    _.rest({a: 1, b: 2, c: 3})   //=> {b: 2, c: 3}
    //    _.rest('abcdef')             //=> 'bcdef'
    //    _.rest('abcdef', 2)          //=> 'cdef'
    // `]
    rest: function (value, length) {
      return slice(value, arguments.length > 1 ? length : 1)
    },
    //! `, +fna=function ( value, method [, ...args] )
    // Treats every member of `'value as an object and calls `'method on it,
    // returning results of all such calls.
    //= array`, object
    //> value array`, object
    //> method str
    //> args `- arguments that `'method receives, none by default
    // See also `#forEach().
    //?`[
    //    _.invoke([' a', 'b '], 'trim')            //=> ['a', 'b']
    //    _.invoke({a: 11, b: 29}, 'toString', 16)  //=> {a: 'b', b: '1d'}
    // `]
    //#-fo
    invoke: function (value, method) {
      var args = arguments
      return transform(value, args, 2, function () {
        var funcArgs = arguments
        var invoke_ = function (item) { return item[method].apply(item, funcArgs) }
        return NoDash.map(value, invoke_, args.forceObject)
      })
    },
    // Treats every member of `'value as an object and collects their
    // `'property.
    //= array`, object
    //> value array`, object
    // See also `#map(), `#pick(), `#unzip().
    //?`[
    //    _.pluck(['ab', 'ccdd'], 'length')         //=> [2, 4]
    //    _.pluck({a: 'ab', b: 'ccdd'}, 'length')   //=> {a: 2, b: 4}
    // `]
    //#-fo
    pluck: function (value, property) {
      arguments[1] = function (obj) { return obj[property] }
      return NoDash.map.apply(undefined, arguments)
    },
    //! `, +fna=function ( value [, func [, cx]] )
    // Returns the "maximum" member as ranked by `'func.
    //= mixed`, -Infinity if `'value is empty
    //#mx
    //> value array`, object
    //> func omitted take the member's value as its rank`,
    //  function `- subject to `#bind(); receives member's value, its key and
    //  the entire `'value
    // `'func must produce numbers or cast-able strings. Without `'func, this
    // condition applies to `'value's members.
    //
    //#
    // ECMAScript equivalent: `@o:Math/max`@. See also `#min().
    //?`[
    //    _.max([1, 2, 3])            //=> 3
    //    _.max({a: 1, b: 2})         //=> 2
    //    _.max([1, 2, 3], v => -v)   //=> 1 (ranked as -1, others as -2, -3)
    // `]
    max: function (value, func, cx) {
      if (!func && NoDash.isArrayLike(value)) {
        return Math.max.apply(undefined, value)
      } else {    // if func or (!func and non-array)
        var max = -Infinity
        var maxItem = -Infinity
        func = bind(func, arguments, 2)
        NoDash.forEach(value, function (item) {
          var num = +(func ? func.apply(undefined, arguments) : item)
          if (num > max) {
            max = num
            maxItem = item
          }
        })
        return maxItem
      }
    },
    //! `, +fna=function ( value [, func [, cx]] )
    // Returns the "minimum" member as ranked by `'func.
    //= mixed`, +Infinity if `'value is empty
    //#-mx
    // ECMAScript equivalent: `@o:Math/min`@. See also `#max().
    min: function (value, func, cx) {
      func = bind(func, arguments, 2)
      var res = NoDash.max(value, function (value) {
        return -(func ? func.apply(undefined, arguments) : value)
      })
      return res == -Infinity ? Infinity : res
    },
    // Returns the sum of all members of `'value.
    //= null if `'value is empty (conveniently, `'+null = `'0)`, int`, NaN if
    //  any member couldn't be cast to integer
    //> value array`, object
    // See also `#reduce().
    //?`[
    //    _.sum([1, 2, 3])              //=> 6
    //    _.sum({a: 1, b: 2, c: 3})     //=> 6
    //    _.sum(['1', 2, 3])            //=> 6
    //    _.sum(['1z', 2, 3])           //=> NaN
    // `]
    //#-fo
    sum: function (value) {
      ap.splice.call(arguments, 1, 0, function (m, n) { return m + +n }, null)
      return NoDash.reduce.apply(undefined, arguments)
    },
    // Returns a copy of `'value with members sorted according to `'func.
    //= array `- even for object `'value
    //> value array`, object
    //> func `- subject to `#bind(); receives member's value, its key and the
    //  entire `'value; returns a comparable (number or string); members with
    //  identical ranks are sorted by their keys
    // See also `#sort().
    //?`[
    //    _.sortBy([5, 1, 3], v => v)               //=> [1, 3, 5]
    //    _.sortBy({a: 5, b: 2}, (v, k) => k)       //=> [5, 2]
    // `]
    sortBy: function (value, func, cx) {
      var entries = tagAndSort(value, func, cx)
      return entries.map(function (item) { return item[1] })
    },
    // Puts every member of `'value under its group determined by `'func.
    //= object `- members are arrays or objects depending on `'value's type
    //> value array`, object
    //> func `- subject to `#bind(); receives member's value, its key and the
    //  entire `'value; returns a scalar (member's group)
    // See also `#indexBy().
    //?`[
    //    _.groupBy([-1, 1, -2, 2], v => v > 0)
    //      //=> {false: [-1, -2], true: [1, 2]}
    //    _.groupBy({x: 'ash', y: 'bosh'}, (v, k) => k[0])
    //      //=> {a: {x: 'ash'}, b: {y: 'bosh'}}
    // `]
    groupBy: function (value, func, cx) {
      var isArray = NoDash.isArrayLike(value)
      func = bind(func, arguments, 2)
      var res = {}
      NoDash.forEach(value, function (item, key) {
        var group = func.apply(undefined, arguments)
        if (isArray) {
          ;(res[group] = res[group] || []).push(item)
        } else {
          ;(res[group] = res[group] || {})[key] = item
        }
      })
      return res
    },
    // Changes keys of `'value members to ones determined by `'func.
    //= array`, object
    //> value array`, object
    //> func `- subject to `#bind(); receives member's value, its key and the
    //  entire `'value; returns a scalar (member's new key); of duplicate keys
    //  only the last occurrence is kept (arbitrary for object `'value)
    // See also `#groupBy().
    //?`[
    //    _.indexBy([-1, 1, -2, 2], v => v > 0)
    //      //=> {false: -2, true: 2}
    //    _.indexBy({x: 'ash', y: 'bosh'}, v => v[0])
    //      //=> {a: 'ash', b: 'bosh'}
    // `]
    indexBy: function (value, func, cx) {
      func = bind(func, arguments, 2)
      var res = value.constructor()
      NoDash.forEach(value, function (item) {
        res[func.apply(undefined, arguments)] = item
      })
      return res
    },
    // Calls `'func for every member of `'value, counting the number of times
    // each result was returned.
    //= object
    //> value array`, object
    //> func `- subject to `#bind(); receives member's value, its key and the
    //  entire `'value; returns a scalar
    //?`[
    //    _.countBy([-1, 1, 0, -2, 2], v => v > 0)
    //      //=> {false: 3, true: 2}
    //    _.countBy({'0': 1, 0: 2, 1: 3}, (v, k) => k)
    //      //=> {'0': 1, 0: 1, 1: 1}
    //    _.countBy({'0': 1, 0: 2, 1: 3}, (v, k) => +k)
    //      //=> {0: 2, 1: 1}
    // `]
    countBy: function (value, func, cx) {
      func = bind(func, arguments, 2)
      var res = {}
      NoDash.forEach(value, function () {
        var group = func.apply(undefined, arguments)
        res[group] = res[group] || 0
        res[group]++
      }, cx)
      return res
    },
    //! `, +fna=function ( value [, length] )
    // Returns a copy of `'value with at most `'length random members.
    //= array`, object of random members of `'value
    //> value array`, object
    //> length omitted = `'length`, int
    //##-unordered
    // If `'length is >= `'value's `#size(), returned object is just a copy.
    //
    // See also `#random() and `#sample() that returns a single item.
    //?`[
    //    _.shuffle([1, 2, 3])              //=> [3, 1, 2]
    //    _.shuffle([1, 2, 3], 1)           //=> [2]
    //    _.shuffle([1, 2, 3], 2)           //=> [2, 1]
    //    _.shuffle({a: 1, b: 2, c: 3}, 1)  //=> {b: 2}
    //    _.shuffle({a: 1, b: 2, c: 3}, 2)  //=> {a: 1, c: 3}
    // `]
    shuffle: function (value, length) {
      if (arguments.length < 2) { length = value.length }
      var sized = NoDash.size(value)
      var isArray = NoDash.isArrayLike(value)
      value = isArray ? ap.slice.call(value) : NoDash.entries(value)
      for (var i = 0; i < sized && i < length; i++) {
        var j = NoDash.random(sized - 1)
        var temp = value[i]
        value[i] = value[j]
        value[j] = temp
      }
      value.splice(length)
      return isArray ? value : NoDash.fromEntries(value)
    },
    //! `, +fna=function ( value [, n] )
    // Returns a random member of `'value, or `'undefined.
    //> value array`, object
    //> n int`, omitted `- exists for compatibility with Underscore's
    //  `@un:sample`@() and LoDash's `@lo:sample`@(); if given, `#sample() works
    //  just like `#shuffle() in NoDash
    // See also `#random() and `#shuffle() that returns several random members
    // of `'value.
    //?`[
    //    _.sample([1, 2, 3])               //=> 3
    //    _.sample({a: 1, b: 2})            //=> 2
    //    _.sample(_.keys({a: 1, b: 2}))    //=> 'a' (random member's key)
    //
    //    // Pulling a random member:
    //    var a = [1, 2, 3]
    //    var k = _.sample(_.keys(a))       //=> 0
    //    var v = a.splice(k, 1)[0]         // v = 1, a = [2, 3]
    // `]
    sample: function (value, n) {
      if (arguments.length > 1) {
        return NoDash.shuffle(v, n)
      } else {
        return NoDash.first(NoDash.shuffle(value, 1))
      }
    },
    //! `, +fna=function ( [[min,] max] )
    // Returns a random number.
    //> () `- returns a float between 0 (inclusive) and 1 (exclusive)
    //> max `- returns an int between 0 and `'max (inclusive) or `'max and 0 if
    //  `'max is < 0
    //> min_max `- returns an int between `'min and `'max (inclusive)
    // ECMAScript equivalent: `@o:Math/random`@.
    // See also `#shuffle(), `#sample().
    //
    // Replace this method to make other NoDash functions use another PRNG.
    // Nice reference: `@https://stackoverflow.com/questions/521295/`@.
    random: function (min, max) {
      switch (arguments.length) {
        case 0:
          return Math.random()
        case 1:
          min > 0 ? (max = min, min = 0) : (max = 0)
        default:
          return +min + Math.floor(NoDash.random() * (max - min + 1))
      }
    },
    // Converts `'value to a regular `'Array.
    //= array
    //> value array shallow-copied via `#slice()`, object `#values returned`,
    //  other (null and `'typeof not `'object) returned as `[[value]`]
    // See also `#isArrayLike(), `#values().
    //?`[
    //    _.toArray('abc')                    //=> ['abc']
    //    _.toArray(123)                      //=> [123]
    //    _.toArray()                         //=> [undefined]
    //    _.toArray(['a', 'b'])               //=> copy of the argument
    //    _.toArray({a: 1, b: 2})             //=> [1, 2]
    //    _.toArray({a: 1, b: 2, length: 0})  //=> []
    // `]
    toArray: function (value) {
      if (typeof value != 'object' || value == null) {
        return [value]
      } else if (!NoDash.isArrayLike(value)) {
        return NoDash.values(value)
      } else {
        // Array.prototype.concat.call(arguments) returns [arguments].
        return ap.slice.call(value)
      }
    },
    //! `, +fna=function (value)
    // Returns number of members in `'value, excluding "empty" slots in sparse
    // array.
    //> value array`, object`, string
    // See also `#isArrayLike().
    //?`[
    //    _.size('abc')                     //=> 3
    //    _.size(['a', 'b'])                //=> 2
    //    _.size(['a', , , 'b'])            //=> 2
    //    ['a', , , 'b'].length             //=> 4
    //    _.size({a: 1, b: 2})              //=> 2
    //    _.size({a: 1, b: 2, length: 5})   //=> 5
    // `]
    //#-fo
    size: function (value, forceObject) {
      if (forceObject !== fo && NoDash.isArrayLike(value)) {
        return Array.isArray(value)
          // reduce() relies on native forEach() to skip empty slots.
          ? NoDash.reduce(value, function (c) { return c + 1 }, 0)
          : value.length    // faster
      } else {
        return Object.keys(value).length
      }
    },
    // Splits members of `'value into two groups determined by `'func.
    //= array of `[matching, mismatching`] where each member is either an array
    //  or object depending on `'value's type
    //> value array`, object
    //> func `- subject to `#bind(); receives member's value, its key and the
    //  entire `'value; result converted to bool
    // See also `#filter(), `#reject(), `#compact().
    //?`[
    //    _.partition([-1, 1, -2, 2], v => v > 0)
    //      //=> [[1, 2], [-1, -2]]
    //    _.partition({a: -1, b: 2}, v => v > 0)
    //      //=> [{b: 2}, {a: -1}]
    // `]
    partition: function (value, func, cx) {
      func = bind(func, arguments, 2)
      var isArray = NoDash.isArrayLike(value)
      var mismatching = isArray ? [] : {}
      var matching = NoDash.filter(value, function (item, key) {
        if (func.apply(cx, arguments)) {
          return true
        } else {
          isArray ? mismatching.push(item) : (mismatching[key] = item)
        }
      })
      return [matching, mismatching]
    },
    //! `, +fna=function (value)
    // Returns a copy of `'value without falsy members.
    //= array`, object
    //> value array`, object
    // See also `#filter(), `#reject(), `#partition().
    //?`[
    //    _.compact([null, '0', false])       //=> ['0']
    //    _.compact({a: null, b: '', c: 1})   //=> {c: 1}
    // `]
    //#-fo
    compact: function (value, forceObject) {
      return NoDash.filter(value, function (item) { return item }, forceObject)
    },
    //! `, +fna=function ( value, ...members )
    // Returns a copy of `'values without `'members given as other arguments.
    //= array`, object
    //> value array`, object
    // See also `#difference().
    //?`[
    //    _.without([1, 2, 3], 2, 1)      //=> [3]
    //    _.without({a: 1: b: 4}, 2, 1)   //=> {b: 4}
    // `]
    without: function (value) {
      var values = ap.slice.call(arguments, 1)
      return NoDash.filter(value, function (item) {
        return values.indexOf(item) == -1
      })
    },
    //! `, +fna=function ( ...values )
    // Returns a combination of members of all arguments without duplicates
    // (unless they exist in the first argument).
    //= array`, object
    //> values array`, object unlike with `#assign(), on duplicate key the first
    //  member's value is kept
    // ECMAScript equivalent: `@o:Array/concat`@.
    // See also `#assign(), `#intersection().
    //?`[
    //    _.union([1, 2], [1, 3])               //=> [1, 2, 3]
    //    _.union({a: 1, b: 2}, {a: 3, c: 4})   //=> {a: 1, b: 2, c: 4}
    // `]
    union: function () {
      var res = arguments[0] || []
      var isArray = NoDash.isArrayLike(res)
      for (var i = 1; i < arguments.length; i++) {
        NoDash.forEach(arguments[i], function (item, key) {
          if (!NoDash.includes(res, item)) {
            isArray ? res.push(item) : (res[key] = item)
          }
        })
      }
      return res
    },
    //! `, +fna=function ( ...values )
    // Returns only members present in all given arguments.
    //= array in order of first argument`, object with keys of first argument
    //> values array`, object `- can be of different types
    // See also `#difference(), `#union(), `#assign().
    //?`[
    //    _.intersection([1, 2, 5], [5, 1, 3])         //=> [1, 5]
    //    _.intersection({a: 1, b: 2}, {c: 1, b: 4})   //=> {a: 1}
    // `]
    intersection: function (value) {
      var args = NoDash.sortBy(ap.slice.call(arguments, 1), NoDash.size)
      return NoDash.filter(value, function (item) {
        return NoDash.every(args, function (a) {
          return NoDash.includes(a, item)
        })
      })
    },
    //! `, +fna=function ( ...values )
    // Returns members of the first argument that are not listed in any other
    // argument.
    //= array`, object
    //> values array`, object `- can be of different types
    // See also `#without(), `#intersection().
    //?`[
    //    _.difference([1, 2], [1, 3])               //=> [2]
    //    _.difference({a: 1, b: 2}, {c: 1, b: 4})   //=> {b: 2}
    // `]
    difference: function (value) {
      var args = NoDash.sortBy(ap.slice.call(arguments, 1), NoDash.negate(NoDash.size, true))
      return NoDash.filter(value, function (item) {
        return !NoDash.some(args, function (a) {
          return NoDash.includes(a, item)
        })
      })
    },
    //! `, +fna=function ( value [, func [, cx]] )
    // Returns a sorted copy of `'value without identical (`[===`]) members.
    //= array`, object
    //> value array`, object
    //> func function subject to `#bind(); ranking members of `'value as if by
    //  `#groupBy()`, omitted to sort by member's string value
    //?`[
    //    _.unique([2, 1, 2])             //=> [1, 2]
    //    _.unique([2, 1, 2], v => -v)    //=> [2, 1] (ranked as -2, -1)
    //    _.unique({a: 1, b: 1})          //=> {a: 1} or {b: 1}
    // `]
    //#-unordered
    // ` `#unique() keeps arbitrary key of identical object members (see last
    // example).
    unique: function (value, func, cx) {
      var prev = unset
      function filterer(item) {
        if (prev !== item) {
          prev = item
          return true
        }
      }
      if (arguments.length < 2 && NoDash.isArrayLike(value)) {
        return NoDash.sort(value).filter(filterer)
      } else {
        func = func || function (item) { return item + '' }
        var entries = tagAndSort(value, func, cx)
          .filter(function (item) { return filterer(item[2]) })
        return NoDash.isArrayLike(value)
          ? entries.map(function (item) { return item[1] })
          : NoDash.fromEntries(entries)
      }
    },
    //! `, +fna=function ( ...values )
    // Puts member of every argument into that argument's position in the
    // unified returned collection.
    //= array of arrays`, array of objects (of duplicate keys last is used)
    //> values arrays of arrays`, objects with array properties
    // See also `#unzip() that does the reverse.
    //?`[
    //    _.zip()   //=> []
    //
    //    _.zip(['a', 'b', 'c'], [1, undefined, 3], {0: true, 1: false})
    //      //=> [ ['a', 1, true], ['b', undefined, false], ['c', 3, undefined] ]
    //
    //    _.zip({a: ['a', 'b', 'c'], b: [1, undefined, 3]}, {c: {0: true, 1: false}})
    //      //=> [ {a: 'a', b: 1, c: true}, {a: 'b', b: undefined, c: false},
    //      //     {a: 'c', b: 3, c: undefined} ]
    //
    //    _.zip({a: [ignored...]}, {a: [1, 2, 3]})
    //    // Same as:
    //    _.zip(                   {a: [1, 2, 3]})
    // `]
    zip: function () {
      var args = ap.slice.call(arguments)
      if (!NoDash.isArrayLike(args[0])) {
        args = args.length
          ? NoDash.assign.apply(undefined, [{}].concat(args)) : [[]]
      }
      return NoDash.max(args, function (a) { return a.length })
        .map(function (item, index) {
          return NoDash.map(args, function (a) { return a[index] })
        })
    },
    // Splits members of `'value into multiple collections, each containing all
    // members' values for a particular property.
    //= array of arrays`, object
    //> value arrays of arrays`, array of objects
    // See also `#zip() that does the reverse, and `#pluck() that returns a
    // single non-own property.
    //?`[
    //    _.unzip([])   //=> []
    //
    //    _.unzip([ ['a', 1, true], ['b', undefined, false], ['c', 3, undefined] ])
    //      //=> [ ['a', 'b', 'c'], [1, undefined, 3], ['c', 3, undefined] ]
    //
    //    _.unzip([ {a: 'a', b: 1, c: true}, {a: 'b', c: false}, {a: 'c', b: 3} ])
    //      //=> {a: ['a', 'b', 'c'], b: [1, undefined, 3], c: [true, false]})
    // `]
    unzip: function (value) {
      if (NoDash.isArrayLike(value)) {
        var list = NoDash.max(value, function (item) { return item.length })
      } else {
        var list = value.length
          ? NoDash.assign.apply(undefined, [{}].concat(value)) : [[]]
      }
      return NoDash.map(list, function (item, key) {
        return NoDash.map(value, function (o) { return o[key] })
      })
    },
    //! `, +fna=function ( keys [, values] )
    // Returns an object constructed from given keys and values as separate
    // lists.
    //= object
    //> keys array`, object
    //> values same type as `'keys`, omitted `- missing member for `'keys
    //  assumes `'undefined, extra member is unused
    // If `'keys/`'values are objects, their existing keys are ignored.
    //
    // See also `#fill(), `#repeat().
    //?`[
    //    _.object(['a', 'b'])          //=> {a: undefined, b: undefined}
    //    _.object(['a', 'b'], ['z'])   //=> {a: 'z', b: undefined}
    //    _.object(['a', 'b'], ['z', 'y', 'x'])   //=> {a: 'z', b: 'y'}
    //    _.object({a: 1, b: 2}, {c: 3, d: 4})    //=> {1: 3, 2: 4}
    // `]
    object: function (keys, values) {
      if (NoDash.isArrayLike(keys)) {
        var zipped = NoDash.zip(keys, values || [])
      } else {
        values = values || {}
        var zipped = Object.keys(NoDash.assign.apply(undefined, arguments))
          .map(function (key) { return [keys[key], values[key]] })
      }
      return NoDash.fromEntries(zipped)
    },
    // Returns a copy of `'value with keys being former values and values being
    // former keys.
    //= object
    //> value object
    //?`[
    //    _.flip({a: 1, b: 2})  //=> {1: 'a', 2: 'b'}
    //    _.flip(['a', 'b'])    //=> {a: 0, b: 1}
    // `]
    //#-a2o
    flip: function (value) {
      var unzipped = NoDash.unzip(NoDash.entries(value))
      return NoDash.object(unzipped[1], unzipped[0])
    },
    //! `, +fna=function ( value [, length] )
    // Splits `'value into chunks, all except last being `'length in size.
    //= array of arrays/objects/strings `- empty if `'length is not positive
    //> value array`, object`, string
    //> length omitted = 1`, int
    //#-unordered
    // ` `#chunk() groups keys in arbitrary order.
    //?`[
    //    _.chunk('abcde')                //=> ['a', 'b', 'c', 'd', 'e']
    //      // same as 'abcde'.split('')
    //    _.chunk('abcde', 2)             //=> ['ab', 'cd', 'e']
    //    _.chunk([1, 2, 3, 4, 5], 2)     //=> [[1, 2], [3, 4], [5]]
    //    _.chunk([1, 2, 3, 4, 5], 10)    //=> [[1, 2, 3, 4, 5]] (copy)
    //    _.chunk([1, 2, 3, 4, 5], 0)     //=> []
    //    _.chunk({a: 1, b: 2, c: 3}, 2)  //=> [{a: 1, c: 3}, {b: 2}]
    // `]
    chunk: function (value, length) {
      var entries = NoDash.entries(value)
      var res = []
      if (length == null || length >= 1) {
        while (entries.length) {
          res.push(entries.splice(0, length || 1))
        }
      }
      if (!NoDash.isArrayLike(value)) {
        return res.map(NoDash.fromEntries)
      } else if (typeof value == 'string') {
        return res.map(function (a) { return NoDash.pluck(a, 1).join('') })
      } else {
        return res.map(function (a) { return NoDash.pluck(a, 1) })
      }
    },
    //! `, +fna=function ( [begin,] end [, step] )
    // Returns an array of numbers, each different by `'step.
    //> end `- if negative, returns a series from `'end (exclusive) to 0
    //  (inclusive), else from 0 (inclusive) to `'end (exclusive)
    //> begin_end `- returns a series from `'begin (inclusive) to `'end
    //  (exclusive)
    //> ...step int non-zero `- defaults to -1 or +1 depending on `'begin and
    //  `'end
    // See also `#times().
    //?`[
    //    _.range(0)        //=> []
    //    _.range(3)        //=> [0, 1, 2]
    //    _.range(-3)       //=> [-2, -1, 0]
    //    _.range(2, 5)     //=> [2, 3, 4]
    //    _.range(5, 2)     //=> [5, 4, 3]
    //    _.range(2, 5, 2)  //=> [2, 4]
    // `]
    range: function (begin, end, step) {
      switch (arguments.length) {
        case 1:
          return begin > 0 ? NoDash.range(0, begin) : NoDash.range(begin, 1)
        case 2:
          step = begin > end ? -1 : +1
        default:
          return NoDash.fill(Array(Math.floor((end - begin) / step) || 0))
            .map(function () {
              return (begin += step) - step
            })
      }
    },
    // Returns an array of all keys of `'value, including non-own.
    //> value object
    // See also `#has(), `#values().
    // Warning: uses `[for..in`] that is terribly slow for objects with
    // prototype chains (not just plain `[{}`]).
    //
    //#-unordered
    // ` `#allKeys() returns keys in arbitrary order.
    //?`[
    //    function Class() { this.own = 1 }
    //    Class.prototype.inherited = 2
    //
    //    _.has(new Class, 'inherited')       //=> false
    //    _.allKeys(new Class)                //=> ['own', 'inherited']
    //    _.values(new Class)                 //=> [1]
    // `]
    allKeys: function (value) {
      var res = []
      for (var key in value) { res.push(key) }
      return res
    },
    //! `, +fna=function ( value, func [, cx] | value, keys | value, ...keys )
    // Returns own members of `'value with matching keys.
    //
    //#pk
    //[
    //  function (value, func[, cx])        // matching each member by callback
    //  function (value, keys)              // keys given as an array
    //  function (value, key[, key, ...])   // keys given directly as arguments
    //]
    //= array`, object
    //> value array`, object
    //> func `- given to `#filter(); this call form exists for compatibility
    //  with Underscore's `@un:pick`@() where `#filter() cannot work on objects
    //##-fo
    //
    //#
    //
    // See also `#omit() that returns mismatching keys, and `#pluck() that
    // returns a single non-own property.
    //?`[
    //    _.pick({a: 1, b: 2, c: 3}, v => v < 2)    //=> {a: 1}
    //    _.pick({a: 1, b: 2, c: 3}, ['a', 'c'])    //=> {a: 1, c: 3}
    //    _.pick({a: 1, b: 2, c: 3}, 'a', 'c')      //=> {a: 1, c: 3}
    //    _.pick(['a', 'b', 'c'], 1, 3)             //=> ['a', 'c']
    // `]
    //
    // Do not be misled by the name: `#pick() iterates over `'value rather than
    // reading `'keys directly and will never return non-enumerable properties:
    //[
    //    var obj = {enum: 1}
    //    Object.defineProperty(obj, 'nonEnum', {value: 2, enumerable: false})
    //    _.pick(obj, 'enum', 'nonEnum')            //=> {enum: 1}
    //    for (var k in obj) { console.log(k) }     //=> 'enum' only
    //]
    pick: function (value, func, cx) {
      var args = arguments
      return transform(value, args, 1, function () {
        func = pickerFunction(func, arguments)
        return NoDash.filter(value, func, cx, args.forceObject)
      })
    },
    //! `, +fna=function ( value, func [, cx] | value, keys | value, ...keys )
    // Returns own members of `'value with mismatching keys.
    //
    //#-pk
    // See also `#pick() that returns matching keys.
    //?`[
    //    _.omit({a: 1, b: 2, c: 3}, v => v < 2)    //=> {b: 2, c: 3}
    //    _.omit({a: 1, b: 2, c: 3}, ['a', 'c'])    //=> {b: 2}
    //    _.omit({a: 1, b: 2, c: 3}, 'a', 'c')      //=> {b: 2}
    //    _.omit(['a', 'b', 'c'], 1, 3)             //=> ['b']
    // `]
    omit: function (value, func, cx) {
      var args = arguments
      return transform(value, args, 1, function () {
        func = pickerFunction(func, arguments)
        return NoDash.reject(value, func, cx, args.forceObject)
      })
    },
    //! `, +fna=function ( func, ms [, ...args] )
    // Calls `'func after a delay of `'ms, giving it `'args.
    //
    //#dl
    //> func `- subject to `#bind()
    //> ms int
    //= result of `'setTimeout()
    //#
    // ECMAScript equivalent: `@mdn:API/WindowOrWorkerGlobalScope/setTimeout`@.
    // See also `#defer().
    delay: function (func, ms) {
      return setTimeout(bind(func, arguments, 2, true), ms)
    },
    //! `, +fna=function ( func, ms [, ...args] )
    // Calls `'func outside of the current call stack, giving it `'args.
    //
    //#-dl
    // Calls `#delay() (`@mdn:API/WindowOrWorkerGlobalScope/setTimeout`@) with 0
    // delay.
    //
    // Don't rely on `#defer() to update a DOM node's visual properties because
    // modern browsers batch such changes and may even ignore them. Use
    // `#redraw() instead, or `#delay() with a large timeout (>= 20 ms, less
    // preferable).
    defer: function () {
      var args = ap.slice.call(arguments)
      args.splice(1, 0, 0)
      return NoDash.delay.apply(undefined, args)
    },
    //! `, +fna=function ( node [, class] )
    // Attempts to force redraw of the given DOM `'node.
    //> node `'Element
    //> class omitted`, str remove from `'classList and re-add (even if wasn't
    //  present)
    //= node
    //
    // Use `#redraw() instead of `#defer() to update DOM state immediately
    // (dimensions, animation, etc.). For example, if `'.foo class creates an
    // animation and you want to restart it (and don't want to use
    // `@mdn:API/Animation`@), depending on your browser you may not see any
    // changes to `'node if you simply remove and add that class - animation may
    // continue playing:
    //[
    //    node.classList.remove('foo')
    //    _.defer(function () {           // = setTimeout(func, 0)
    //      node.classList.add('foo')
    //    })
    //]
    // Do this instead:
    //[
    //    node.classList.remove('foo')
    //    _.redraw(node)
    //    node.classList.add('foo')
    //]
    // Or, the same:
    //[
    //    _.redraw(node, 'foo')
    //]
    // Another example: because `[animation-delay`] counts from the time the
    // animation has originally started playing (see
    // `@mdn:CSS/animation-delay#time`@), after changing it the animation will
    // usually be at some random frame unless restarted:
    //[
    //    node.style.animationName = 'none'
    //    _.redraw(node)
    //    node.style.animationName = animation
    //    node.style.animationDelay = -frame * interval + 'ms'
    //]
    // Note: `#redraw() doesn't accept jQuery and other kinds of wrapped nodes:
    //[
    //    _.redraw($('body'))       // will not work
    //    _.redraw($('body')[0])    // will work
    //]
    redraw: function (node, cls) {
      cls == null || node.classList.remove(cls)
      void node.offsetHeight
      cls == null || node.classList.add(cls)
      return node
    },
    // Returns a function that invokes `'func not more often than once per `'ms.
    //> func `- subject to `#bind()
    //> ms int
    //> options object
    // Possible `'options keys:
    //> leading bool`, omitted `'true
    //> trailing bool`, omitted `'true
    // See also `#debounce().
    //
    //#tcan
    // Call `'cancel() on the returned function to stop currently pending
    // invocation, if any.
    //
    //#
    //
    // Consider this diagram (given `'ms of 50, `'- standing for 10 ms, `'> for
    // time the returned function (RT) was first and last called):
    //[
    //     c    c     c     c   func invocations
    //    >L----TL----TL-->-T   leading = trailing = true
    //     ^^^^^ ^^^^^ ^^^^^    throttle periods (50 ms)
    //    >L---- L---- L-->     leading = true,  trailing = false
    //    > ----T ----T -->-T   leading = false, trailing = true
    //]
    //* Calling RT at any point during the throttle period extends the period.
    //* `'L tells when `'func is invoked if `'leading is set, `'T - if
    //  `'trailing is set.
    //* `'trailing invokes `'func after the end of the last period (even when RT
    //  is no longer called).
    //* Disabling both `'leading and `'trailing is useless.
    //* When both are enabled, `'T and `'L in the beginning of the 2nd and
    //  subsequent periods are "merged", resulting in only one `'func
    //  invocation.
    throttle: function (func, ms, options) {
      func = bind(func)
      options = NoDash.assign({leading: true, trailing: true}, options)
      var last = 0
      var timer
      function throttle_() {
        var args = [this, arguments]
        if (!timer) {
          if (Date.now() - last >= ms && options.leading) {
            func.apply(args[0], args[1])
            last = Date.now()
          }
          timer = setTimeout(function () {
            if (options.trailing) {
              func.apply(args[0], args[1])
              last = Date.now()
            }
            timer = null
          }, ms)
        }
      }
      throttle_.cancel = function () { timer = clearTimeout(timer) }
      return throttle_
    },
    //! `, +fna=function ( func, ms [, immediate] )
    // Returns a function that invokes `'func after `'ms after the last calling
    // attempt.
    //> func `- subject to `#bind()
    //> ms int
    //> immediate `- if truthy, calls `'func immediately when called for the
    //  first time and then never calls for the subsequent `'ms
    // See also `#throttle().
    //
    //#-tcan
    //? If `'ms is 100 and `'immediate is `'false, if the function is called,
    //  then called again after 50 ms, then again after 200 ms - `'func is
    //  called twice: after 100 ms after the 2nd call and after 100 ms after the
    //  3rd call. If `'immediate is `'true, `'func is called right on the first
    //  call, then right on the 3rd.
    debounce: function (func, ms, immediate) {
      func = bind(func)
      var timer
      if (immediate) {
        var res = function debounce_() {
          if (!timer) {
            timer = setTimeout(function () { timer = null }, ms)
            return func.apply(this, arguments)
          }
        }
      } else {
        var res = function debounce_() {
          var args = [this, arguments]
          clearTimeout(timer)
          timer = setTimeout(function () {
            func.apply(args[0], args[1])
          }, ms)
        }
      }
      res.cancel = function () { timer = clearTimeout(timer) }
      return res
    },
    // Returns a function that invokes `'func once, remembers its return value
    // and returns it for subsequent calls without invoking `'func again.
    //> func `- subject to `#bind(); if throws, future calls return `'undefined
    // ` `#once() can be used for memoization, i.e. caching result of a heavy
    // operation.
    //?`[
    //    var f = _.once(() => Math.random())
    //    f()   //=> 0.2446989
    //    f()   //=> 0.2446989
    // `]
    once: function (func) {
      var res = unset
      return function once_() {
        if (res === unset) {
          res = undefined   // in case func throws
          res = bind(func).apply(this, arguments)
        }
        return res
      }
    },
    //! `, +fna=function ( path, default )
    // Returns a function accepting an object and returning value of its
    // property or of its sub-objects.
    //
    // ` `#property() calls `#at() on the inside.
    //?`[
    //    var objects = [{a: 'abc'}, {a: 'def'}]
    //    _.map(objects, _.property(['a', 1]))    //=> ['b', 'e']
    // `]
    property: function (path, def) {
      if (arguments.length < 2) { def = unset }
      return function property_(value) { return NoDash.at(value, path, def) }
    },
    //! `, +fna=function ( value, path, default )
    // Returns value of `'value's property or of its sub-objects.
    //> value array`, object
    //> path array`, scalar assume `[[path]`] `- each member is a key; resolving
    //  stops on `'null or `'undefined
    //> default mixed returned if property not found`, omitted returns the last
    //  found `'undefined or `'null
    // Without `'default, it's not possible to determine if `'path has resolved
    // to a property with `'undefined or `'null or if it ended prematurely on
    // such a property with more components left in `'path.
    //
    // See also `#property() that returns a callback suitable for `#map().
    //?`[
    //    _.at('abc', 2)                          //=> 'c'
    //    _.at('abc', -1)                         //=> 'c'
    //    _.at(['a', 'b'], 1)                     //=> 'b'
    //    _.at(['a', 'b'], [1])                   //=> 'b'
    //    _.at({a: 1, b: 2}, 'b')                 //=> 2
    //    _.at({a: 1, b: 2}, ['b'])               //=> 2
    //
    //    _.at(null, 0)                           //=> null
    //    _.at(undefined, 0)                      //=> undefined
    //    _.at(false, 0)                          //=> undefined = false[0]
    //    _.at(false, 0, 'def')                   //=> 'def'
    //
    //    _.at([null], 0)                         //=> null
    //    _.at([null], 0, 'def')                  //=> null
    //    _.at([null], [0, 1])                    //=> null
    //    _.at([null], [0, 1], 'def')             //=> 'def'
    //    _.at([null], [1, 0])                    //=> undefined
    //    _.at([null], [1, 0], 'def')             //=> 'def'
    //
    //    _.at({a: [{c: 123}]}}, ['a', 0, 'c'])   //=> 123
    //    _.at({a: null}, ['a', 'b'])             //=> null
    //    _.at({a: 123}, ['a', 'b'])              //=> undefined
    //    _.at({}, ['a', 'b'])                    //=> undefined
    //    _.at({a: undefined}, ['a'])             //=> undefined
    //    _.at({a: undefined}, ['a'], 'def')      //=> undefined
    //    _.at({}, ['a'], 'def')                  //=> 'def'
    // `]
    //? Resolving dotted path notation (for example, used in `#template()):
    //  `[
    //    _.at({prop: [{sub: true}]}, 'prop.0.sub'.split('.'))  //=> true
    //  `]
    //? Since objects are unique, use a marker object for reliably determining
    //  lack of target property:
    //  `[
    //    var notFound = {}
    //    var value = _.at(obj, path, notFound)
    //    if (value === notFound) { throw 'Property not found.' }
    //  `]
    at: function (value, path, def) {
      if (typeof path == 'string' || !NoDash.isArrayLike(path)) { path = [path] }
      for (var i = 0; i < path.length; i++) {
        if (value == null) {
          return arguments.length > 2 && def !== unset ? def : value
        }
        value = value[path[i]]
      }
      return value
    },
    // Calls `'func several `'times, returning results of all calls.
    //= array
    //> times int `- non-negative
    //> func `- subject to `#bind(); receives a number from 0 to `[times - 1`]
    // See also `#range().
    //?`[
    //    _.times(3, i => -i)   //=> [-0, -1, -2]
    //    _.times(0, i => -i)   //=> []
    // `]
    times: function (times, func, cx) {
      func = bind(func, arguments, 2)
      return NoDash.fill(Array(times)).map(function (aNull, index) {
        return func.call(undefined, index)
      })
    },
    //! `, +fna=function ( func [, cx [, ...args]] )
    // Returns a version of `'func with added arguments and/or forced context.
    //= function`, falsy if `'func or `[func[0]`] is falsy
    //> func function (`'args are prepended)`, array of `[func[, cx[,
    //  ...hereArgs]]`] (`'cx and `'args arguments are ignored)
    //> cx object override the caller-specified context for `'func (its
    //  `'this)`, undefined keep the caller-specified context
    //> args `- argument(s) pushed in front of the caller's arguments to `'func
    // ECMAScript equivalent: `@o:Function/bind`@.
    //
    // ` `#bind() is used for non-ES utilities like `#sortBy() to normalize the
    // callback format for compatibility with Underscore, where some functions
    // accept `'cx (`@un:findIndex`@), some accept arguments (`@un:defer`@),
    // some accept nothing (e.g. `@un:throttle`@).
    //
    // If your code depends strictly on NoDash then we recommend using a uniform
    // way of specifying `'func as a single array value and forego
    // function-specific `'cx/`'args.
    //
    // If the context set by array `'func's 1st member or, in absence of such,
    // by `'cx is `'undefined then returned function preserves the
    // caller-specified context (aka "partial" application without context
    // binding).
    //
    //?`[
    //    _.bind(function () { ... }, window, 'a').call(cx, 'b')
    //      // the function receives ('a', 'b') and its this = window
    //    _.partial(function () { ... }, 'a').call(cx, 'b')
    //      // the function receive ('a', 'b') and its this = cx
    //    // partial() is an alias, same as:
    //    _.bind(function () { ... }, undefined, 'a').call(cx, 'b')
    //
    //    _.bind(f, cx, 'a2')('a1')
    //      //= f.call(cx, 'a2', 'a1')
    //    _.bind([f], cx, 'a2')('a1')
    //      //= f.call(undefined, 'a1') - cx and 'a2' ignored
    //    _.bind([f, window], cx, 'a2')('a1')
    //      //= f.call(window, 'a1') - here too
    //    _.bind([f, window, 'a3'], cx, 'a2')('a1')
    //      //= f.call(window, 'a3', 'a1') - here too
    //    _.bind([f, undefined, 'a3'], cx, 'a2')('a1')
    //      //= f('a3', 'a1') - preserving caller's context
    // `]
    bind: function (func) {
      return bind(func, arguments, 1)
    },

    // Underscore/LoDash
    isArray: Array.isArray,

    // ECMAScript (not in IE)
    sign: Math.sign || function (n) {
      return n > 0 ? +1 : (n < 0 ? -1 : 0)
    },

    // Determines if two values of arbitrary types are "equal".
    //= bool
    // Exists for compatibility with Underscore `@un:isEqual`@() and LoDash
    // `@lo:isEqual`@() that have them very elaborate. For example, two
    // different `'Date objects may be "equal" if they reference exactly the
    // same timestamp.
    //
    // NoDash's `#isEqual() simply defers the task to JavaScript's `'== operator
    // which is sufficient in most cases. Just keep in mind that if one argument
    // is a boolean or number, `'== converts the other to number:
    //[
    //    '123' == 123            //=> true
    //    true == 1               //=> true
    //    NaN == NaN              //=> false (!)
    //    [] == false             //=> true  (!)
    //    [] == 0                 //=> true  (!)
    //    new Date > 0            //=> true
    //    {} > 0                  //=> true
    //    {} == '[object Object]' //=> true  (!)
    //    null == undefined       //=> true
    //]
    // Details: `@mdn:JavaScript/Reference/Operators/Equality`@.
    isEqual: function (a, b) { return a == b },

    // LoDash
    //> value array`, object
    flattenDeep: function (value) {
      return NoDash.flat(value, Infinity)
    },

    //! `, +fna=function ( func [, ...args] )
    // Underscore/LoDash
    partial: function (func) {
      var args = [func, undefined].concat(NoDash.rest(arguments))
      return NoDash.bind.apply(undefined, args)
    },
  }

  //! +cl=Aliases
  // This is not a class but an index of function aliases available on the main
  // `#NoDash class.
  //
  // Aliases improve `#COMPATIBILITY with standard ECMAScript, Underscore and
  // LoDash API.
  //
  // Use `*Show code`* to see the function targeted by an alias.
  var aliases = {
    each:           'forEach',              // Underscore/LoDash
    all:            'every',                // Underscore
    any:            'some',                 // Underscore
    contains:       'includes',             // Underscore
    uniq:           'unique',               // Underscore/LoDash
    extend:         'assign',               // Underscore/LoDash
    trimLeft:       'trimStart',            // ECMAScript alias
    trimRight:      'trimEnd',              // ECMAScript alias
    drop:           'rest',                 // Underscore/LoDash
    tail:           'rest',                 // Underscore/LoDash
    dropRight:      'initial',              // LoDash
    flatten:        'flat',                 // Underscore/LoDash
    flattenDepth:   'flat',                 // LoDash
    fromPairs:      'fromEntries',          // LoDash
    head:           'first',                // Underscore/LoDash
    take:           'first',                // Underscore/LoDash
    takeRight:      'last',                 // LoDash
    remove:         'reject',               // LoDash
    zipObject:      'object',               // LoDash
    keyBy:          'indexBy',              // LoDash
    sampleSize:     'shuffle',              // LoDash
    maxBy:          'max',                  // LoDash
    minBy:          'min',                  // LoDash
    findKey:        'findIndex',            // Underscore/LoDash
    forOwn:         'forEach',              // LoDash
    invert:         'flip',                 // Underscore/LoDash
    mapValues:      'map',                  // LoDash
    toPairs:        'entries',              // LoDash
    pairs:          'entries',              // Underscore
    transform:      'reduce',               // LoDash
    nth:            'at',                   // LoDash
  }

  NoDash.forEach(aliases, function (func, alias) {
    // Calling the original function allows correct behaviour in case it's
    // replaced, unlike with NoDash.alias = NoDash.original. This is slower
    // though, so use non-aliased functions if possible.
    NoDash[alias] = function () {
      return NoDash[func].apply(undefined, arguments)
    }
  })

  return NoDash
});