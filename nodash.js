/*!
  NoDash.js - a terse utility library based on ES5 features
  http://squizzle.me/js/nodash | Public domain/Unlicense
*/

;(function (factory) {
  var deps = {}
  var me = 'NoDash'
  // --- cut here ---

  if (typeof exports != 'undefined' && !exports.nodeType) {
    // CommonJS/Node.js.
    deps = Object.keys(deps).map(function (dep) { return require(dep) })
    if (typeof module != 'undefined' && module.exports) {
      module.exports = factory.apply(this, deps)
    } else {
      exports = factory.apply(this, deps)
    }
  } else if (typeof define == 'function' && define.amd) {
    // AMD/Require.js.
    define(Object.keys(deps), factory)
  } else {
    // In-browser. self = window or web worker scope.
    var root = typeof self == 'object' ? self
             : typeof global == 'object' ? global
             : (this || {})
    var by = function (obj, path) {
      path = path.split(/\./g)
      while (obj && path.length) { obj = obj[path.shift()] }
      return obj
    }
    // No Object.values() in IE.
    deps = Object.keys(deps).map(function (dep) {
      var res = by(root, deps[dep])
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

  function transform(value, args, skipArgs, arrayFunc, objectFunc) {
    args = ap.slice.call(args || [], skipArgs)
    return NoDash.isArrayLike(value)
      ? arrayFunc.apply(value, args)
      : objectFunc.apply(value, args)
  }

  function slice(value, from, length, single) {
    if (NoDash.isArrayLike(value)) {
      var res = ap.slice.call(value, from, length)
      if (single) { res = res[0] }
    } else {
      var res = NoDash.fromEntries(NoDash.entries(value).slice(from, length))
      if (single) { res = res[ Object.keys(res)[0] ] }
    }
    return res
  }

  function tagAndSort(value, func, cx) {
    func = bind(func, arguments, 2)
    value = NoDash.map(value, function (item, key) {
      return [key, item, func.apply(undefined, arguments)]
    })
    return NoDash.toArray(value).sort(function (a, b) {
      return a[2] > b[2] ? +1 : ((a[2] < b[2] || a[0] > b[0]) ? -1 : 0)
    })
  }

  function bind(func, args, skipArgs, noContext) {
    if (func instanceof Function) {
      func = [func].concat(noContext ? [undefined] : [],
                           ap.slice.call(args || [], skipArgs))
    }
    if (!func) {
      return func
    } else if (func[1] === undefined) {   // "partial" application.
      return function () {
        return func[0].apply(this, func.slice(2).concat(ap.slice.call(arguments)))
      }
    } else {
      return Function.prototype.bind.apply(func.shift(), func)
    }
  }

  function pickerFunction(func, args, skipArgs) {
    if (!(func instanceof Function)) {
      var keys = NoDash.object(ap.concat.apply([], ap.slice.call(args, skipArgs)))
      func = function (item, key) { return NoDash.hasOwn(keys, key) }
    }
    return func
  }

  function trim(left, right, value, blank, noBlank) {
    if (typeof value != 'string') {
      var entries = NoDash.entries(value)
      for (var begin = 0;
           left && begin < entries.length &&
           (noBlank ? !entries[begin] : (entries[begin] === blank));
           begin++) ;
      for (var end = entries.length - 1;
           right && end > begin &&
           (noBlank ? !entries[end] : (entries[end] === blank));
           end++) ;
      entries = entries.slice(begin, end + 1)
      return NoDash.isArrayLike(value)
        ? entries.map(function (item) { return item[1] })
        : NoDash.fromEntries(entries)
    } else if (noBlank && left && right) {
      return value.trim()
    } else {
      blank = noBlank ? '\\s+' : '[' + NoDash.escapeRegExp(blank) + ']+'
      var re = RegExp('^' + (left ? blank : '') + '|' + (right ? blank : '') + '$', 'g')
      return value.replace(re, '')
    }
  }

  var ap = Array.prototype
  var unset = {}    // unique value marker.

  //! +cl=NoDash
  //
  // ` `*NoDash.js`* is a terse utility library based on ES5 features.
  //
  // NoDash differs from already established utility libraries (such as
  // Underscore.js `@un:`@ and LoDash `@lo:`@):
  //* Built-in ECMAScript 5 functions are used where possible, like
  //  `@o:Array/forEach`@().
  //* Virtually every function is deliberately isolated, small (7 lines on
  //  average) and intuitive without too much focus on optimization (that is
  //  left up to the browser).
  //* It has only and exactly the functions you need in day-to-day development
  //  without resorting to other libraries. For example, it includes `#ajax()
  //  that is part of jQuery (and you can't really go without it), and `#trim()
  //  that is part of `*Underscore.string`* (and missing in IE), but omits a
  //  plethora of `'is...() functions that are just aliases for `'instanceof
  //  and `[===`].
  //* Most functions work uniformly with various data types. For example,
  //  `#indexOf() accepts an array, object or string while Underscore's
  //  `@un:indexOf`@() - array only. Same for `#map() that also works over
  //  objects (and returns objects).
  //* Even then, it's 16K minified - compare with Underscore (17K) and LoDash
  //  (core 12K, full 71K).
  //* And as a bonus, its license is the post permissive possible - public
  //  domain (technically, `@http://Unlicense.org`@).
  //
  // NoDash was written from scratch for Sqimitive (`@sq@`@) as a replacement
  // for Underscore. Usually you can just swap it in place of Underscore or
  // LoDash but do check `#COMPATIBILITY for nuances.
  //
  // `<img src="data:image/gif;base64,R0lGODlhKQAQAIAAAP///8s5OCH5BAAAAAAALAAAAAApABAAAAJOjI+py+0Po5wK2GsP3np7kHygIY5BiYUXaaZst55jhri0fOf2bLK0roP9eKqhsCMkyopKnCf5WtZiwKfPKJW4KNxr97v9OkUMlPlcPosKADs" alt="npm"`> `*npm install nodash`*
  //
  //* Download for development:
  //  `@https://github.com/ProgerXP/NoDash/blob/master/nodash.js`@
  //* Download for production (minified):
  //  `@https://github.com/ProgerXP/NoDash/blob/master/nodash.min.js`@
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
  //  then it usually returns this type (e.g. `#chunk()). Other functions
  //  that indicate that they accept an `'array type actually accept any
  //  `#isArrayLike object (string, `'Arguments, jQuery collection, etc.)
  //  but return a regular array. For example, `#shuffle`[('abc')`] returns
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
    NODASH: '0.9',

    //! +fn=noConflict
    // When NoDash is used outside of a module, restores old value of global `'_
    // and returns the `'NoDash object.

    // Originally Array functions.

    // Calls `'func for every member of `'value.
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
    forEach: function (value, func, cx) {
      return transform(value, arguments, 1, ap.forEach, function () {
        Object.keys(value).forEach(function (key) {
          func.call(this, value[key], key, value)
        }, cx)
      })
    },
    // Returns a copy of `'value with values replaced by results of calling
    // `'func's for each member.
    //= array`, object
    //#-fe
    // ECMAScript equivalent: `@o:Array/map`@. See also `#pluck().
    //?`[
    //    _.map([1, 2], v => v * 2)               //=> [2, 4]
    //    _.map({a: 1, b: 2}, v => v * 2)         //=> {a: 2, b: 4}
    //    _.map('\1\2\3', v => v.charCodeAt(0))   //=> [1, 2, 3]
    // `]
    map: function (value, func, cx) {
      return transform(value, arguments, 1, ap.map, function () {
        var res = {}
        NoDash.forEach(value, function (v, k) {
          res[k] = func.apply(this, arguments)
        }, cx)
        return res
      })
    },
    //! `, +fna=function ( value, func [, initial )
    // Calls `'func for every member of `'value, returning result of the last call.
    //
    //#rd
    //= mixed as returned by `'func
    //> value array`, object
    //> func `- receives result of the previous `'func call, member's value, its
    //  key and the entire `'value
    //> initial omitted`, mixed `- if omitted, `'func is not called for the first
    //  time; instead, that member's value is used as if it was returned by `'func
    //#
    // ECMAScript equivalent: `@o:Array/reduce`@. See also `#reduceRight()
    // that iterates from the end of `'value.
    //?`[
    //    _.reduce([1, 2, 3], (memo, v) => memo + v)      //=> 1 + 2 + 3
    //    _.reduce([1, 2, 3], (memo, v) => memo + v, -1)  //=> -1 + 1 + 2 + 3
    // `]
    reduce: function (value, func, initial) {
      var setInitial = arguments.length < 3
      return transform(value, arguments, 1, ap.reduce, function () {
        var memo = initial
        NoDash.forEach(value, function (v, k) {
          if (setInitial) {
            memo = v
            setInitial = false
          } else {
            memo = func.call(undefined, memo, v, k, value)
          }
        })
        return memo
      })
    },
    //! `, +fna=function ( value, func [, initial )
    // Calls `'func for every member of `'value starting from the last member,
    // returning result of the last call.
    //
    //#-rd
    // ECMAScript equivalent: `@o:Array/reduceRight`@. See also `#reduce()
    // that iterates from the start of `'value.
    //
    //#unordered
    // Attention: be wary about object `'value - JavaScript objects are unordered.
    //
    //#
    // ` `#reduceRight() goes over `'value in any order just like `#reduce().
    reduceRight: function (value, func, initial) {
      return transform(value, arguments, 1, ap.reduceRight, function () {
        return NoDash.reduce(NoDash.reverse(value), func, initial)
      })
    },
    // Returns key of the first member of `'value for which `'func has
    // returned truthyness.
    //= int for array `'value (-1 if not found)`, scalar for object (`'undefined
    //  if not found)
    //#-fe
    // ECMAScript equivalent: `@o:Array/findIndex`@ (not in IE).
    // See also `#find() that returns the value.
    //
    //#-unordered
    // ` `#findIndex() returns a key, not index for object `'value, and
    // it returns an arbitrary match if there are multiple matching
    // object members.
    //?`[
    //    _.findIndex(['a', 'b', 'c'], v => v == 'b')   //=> 1
    //    _.findIndex({a: 1, b: 2}, v => v == 2)        //=> 'b'
    // `]
    findIndex: function (value, func, cx) {
      var res = -1
      var iterator = function (item, key) {
        if (func.apply(this, arguments)) {
          res = key
          return true
        }
      }
      transform(value, [iterator, cx], 0, ap.some, function () {
        res = undefined
        // findIndex() is used by some() so it cannot call the latter.
        Object.keys(value).some(function (key) {
          return iterator.call(this, value[key], key, value)
        }, cx)
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
    filter: function (value, func, cx) {
      return transform(value, arguments, 1, ap.filter, function () {
        var res = {}
        Object.keys(value).forEach(function (key) {
          var item = value[key]
          if (func.call(this, item, key, value)) {
            res[key] = item
          }
        }, cx)
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
    every: function (value, func, cx) {
      return transform(value, arguments, 1, ap.every, function () {
        return NoDash.findIndex(value, NoDash.negate(func), cx) === undefined
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
    some: function (value, func, cx) {
      return transform(value, arguments, 1, ap.some, function () {
        return NoDash.findIndex(value, func, cx) !== undefined
      })
    },
    // Returns a copy of `'value with members sorted according to `'func.
    //= array `- even for object `'value
    //> value array`, object
    //> func `- receives `[av, bv, ak, bk`] and should return a positive value
    //  if `'av must appear after `'bv, negative if before, or zero if they may
    //  appear in any order (makes sorting unstable); `'ak and `'bk are their
    //  keys within `'value and are only not given for object `'value
    // ECMAScript equivalent: `@o:Array/sort`@. See also `#sortBy()
    //?`[
    //    _.sort([5, 1, 3], (a, b) => a - b)      //=> [1, 3, 5]
    //    _.sort({a: 5, b: 2}, (a, b) => a - b)   //=> [2, 5]
    // `]
    sort: function (value, func) {
      return transform(value, arguments, 1, ap.sort, function () {
        return NoDash.entries(value)
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
    //> fromIndex omitted = 0`, int `- if negative, searches from the end
    //#
    // ECMAScript equivalent: `@o:Array/includes`@. See also `#indexOf().
    //?`[
    //    _.includes([5, 1, 3], 5)      //=> true
    //    _.includes([5, 1, 3], 5, 1)   //=> false
    //    _.includes([5, 1, 3], 3, -1)  //=> true
    //    _.includes({a: 1, b: 2}, 2)   //=> true
    //    _.includes('abc', 'bc', 1)     //=> true
    // `]
    includes: function (value, member, fromIndex) {
      return NoDash.indexOf.apply(undefined, arguments) != -1
    },
    //! `, +fna=function ( value, member [, fromIndex] )
    // Returns the key of first `'member appearing under `'value, or `'-1.
    //
    //#-in
    // ECMAScript equivalent: `@o:Array/indexOf`@. See also `#includes(),
    // `#lastIndexOf().
    //?`[
    //    _.indexOf([5, 1, 3], 5)      //=> 0
    //    _.indexOf([5, 1, 3], 5, 1)   //=> -1
    //    _.indexOf([5, 1, 3], 3, -1)  //=> 2
    //    _.indexOf({a: 1, b: 2}, 2)   //=> 'b'
    //    _.indexOf('abc', 'bc', 1)     //=> 1
    // `]
    indexOf: function (value, member, fromIndex) {
      return transform(value, arguments, 1, ap.indexOf, function () {
        if (fromIndex < 0) {
          return NoDash.values(value).indexOf(member, fromIndex)
        } else {
          // Small optimization that avoids iterating/copying the entire
          // object as with values() when fromIndex is positive or not given
          // (object size is not required to be calculated beforehand).
          var index = NoDash.findIndex(value, function (item) {
            if (fromIndex === undefined || --fromIndex < 0) {
              return item === member
            }
          })
          return index === undefined ? -1 : index
        }
      })
    },
    //! `, +fna=function ( value, member [, fromIndex] )
    // Returns the key of last `'member appearing under `'value, or `'-1.
    //
    //#-in
    // ECMAScript equivalent: `@o:Array/lastIndexOf`@. See also `#indexOf().
    //
    //#-unordered
    // ` `#lastIndexOf() returns key of arbitrary `'member's occurrence just
    // like `#indexOf().
    //
    //?`[
    //    _.lastIndexOf([1, 2, 1], 1)     //=> 2
    //    _.lastIndexOf([1, 2, 1], 2, 2)  //=> -1
    //    _.indexOf({a: 1, b: 1}, 2)      //=> 'b'
    //    _.indexOf('bba', 'ba', 1)       //=> 1
    // `]
    lastIndexOf: function (value, member, fromIndex) {
      return transform(value, arguments, 1, ap.lastIndexOf, function () {
        return NoDash.values(value).lastIndexOf(member, fromIndex)
      })
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
    slice: function (value, begin, end) {
      return transform(value, arguments, 1, ap.slice, function () {
        return NoDash.fromEntries(NoDash.entries(value).slice(begin, end))
      })
    },
    // Returns the copy of `'values with members in reverse order.
    //= array`, object
    //> value array`, object
    // ECMAScript equivalent: `@o:Array/reverse`@.
    //
    //#-unordered
    // It probably makes no sense to use `#reverse() on an object `'value.
    //?`[
    //    _.reverse([5, 1, 3])      //=> [3, 1, 5]
    //    _.reverse({a: 1, b: 2})   //=> {b: 2, a: 1}
    // `]
    reverse: function (value) {
      return transform(value, [], 0, ap.reverse, function () {
        var res = {}
        Object.keys(value).reverse().forEach(function (key) {
          res[key] = value[key]
        })
        return res
      })
    },
    // Returns a string consisting of stringified members of `'value separated
    // by `'glue.
    //= str
    //> value array`, object `- `'null and `'undefined members are seen as
    //  blank strings
    //> glue str`, undefined = `',
    // ECMAScript equivalent: `@o:Array/join`@.
    //
    //#-unordered
    // ` `#join() combines object `'value's members in arbitrary order.
    //?`[
    //    _.join([1, null, 3])        //=> 1,,3
    //    _.join({a: 1, b: 2}, '-')   //=> 1-2
    // `]
    join: function (value, glue) {
      return transform(value, arguments, 1, ap.join, function () {
        return Object.keys(value).map(function (key) {
          var item = value[key]
          return item == null ? '' : item
        })
          .join(glue === undefined ? ',' : glue)
      })
    },
    //! `, +fna=function ( value [, depth] )
    // "Unwraps" nested arrays or objects in `'value.
    //= array`, object with duplicate keys keeping arbitrary value
    //> value array`, object `- nested members of the same type are flattened:
    //  arrays in array, objects in object
    //> depth int`, omitted = 1 `- number of nesting levels to flatten;
    //  use `'Infinity to flatten all
    // ECMAScript equivalent: `@o:Array/flat`@ (not in IE).
    //?`[
    //    _.flat([[[1]], {b: 2}, 3])      //=> [[1], {b: 2}, 3]
    //    _.flat([[[1]], {b: 2}, 3], 2)   //=> [1, {b: 2}, 3]
    //    _.flat({a: [1], b: {c: 3}})     //=> {a: [1], c: 3}
    // `]
    flat: function (value, depth) {
      depth = depth || 1
      if (NoDash.isArrayLike(value)) {
        while (--depth >= 0) {
          value = ap.concat.apply([], value)
          // It's deemed faster to iterate over specific depths (which is
          // typically 1) even without changing value than checking every
          // member for array-likeness.
          if (depth == Infinity && !value.some(NoDash.isArrayLike)) {
            break
          }
        }
        return value
      } else {
        value = NoDash.entries(value)
        while (--depth >= 0) {
          var changed = false
          for (var i = value.length - 1; i >= 0; i--) {
            if (value[i][1] instanceof Object) {
              changed = value.splice(i, 1, NoDash.entries(value[i][1]))
            }
          }
          if (!changed) {
            break
          }
        }
        return NoDash.fromEntries(value)
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
    // ECMAScript equivalent: `@o:Array/fill`@. See also `#repeat(), `#object().
    //
    //#-slend
    //?`[
    //    _.fill([1, 2, 3], 'a', 0, -1)   //=> ['a', 'a', 3]
    //    _.fill({a: 1, b: 2}, 'a')       //=> {a: 'a', b: 'a'}
    // `]
    //? `'Array's constructor accepts new array's length and creates a sparse
    //  `'Array where members are sort of `'undefined but can't be iterated
    //  over `*except`* by some methods (e.g. `@o:Array/find`@). `#fill() can
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
        return ap.fill.call(value, filler, begin, end)
      } else {
        var isArray = NoDash.isArrayLike(value)
        value = NoDash.entries(value)
        begin = begin || 0
        if (arguments.length < 4) { end = Infinity }
        for (; begin < end && begin < value.length; ++begin) {
          value[begin][1] = filler
        }
        return isArray
          ? value.map(function (item) { return item[1] })
          : NoDash.fromEntries(value)
      }
    },

    // Originally Object functions.

    // Returns an array of arrays with key-value pairs for each member of `'value.
    //= array
    //> value array`, object`, string
    // ECMAScript equivalent: `@o:Object/entries`@ (not in IE).
    // See also `#fromEntries().
    //
    //#unordgen
    // Attention: JavaScript objects are unordered.
    //
    //#
    // ` `#entries() returns object `'value's pairs in arbitrary order.
    //?`[
    //    _.entries(['a', 'b'])     //=> [[0, 'a'], [1, 'b']]
    //    _.entries({a: 1, b: 2})   //=> [['a', 1], ['b', 2]]
    //    _.entries('ab')           //=> [[0, 'a'], [1, 'b']]
    // `]
    entries: function (value) {
      if (NoDash.isArrayLike(value)) {
        return NoDash.map(value, function (item, key) {
          return [key, item]
        })
      } else {
        return Object.keys(value).map(function (key) {
          return [key, value[key]]
        })
      }
    },
    // Returns an object constructed from arrays of key-value pairs.
    //= object
    //> value array`, object
    // See also `#entries().
    //
    //#-unordgen
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
    keys: function (value) {
      return transform(value, arguments, 0, function () {
        return NoDash.range(value.length)
      }, Object.keys)
    },
    // Returns values of members in `'value.
    //= array with `#hasOwn() properties
    //> value array`, object `- in all cases returns a shallow copy
    // ECMAScript equivalent: `@o:Array/slice`@, `@o:Object/values`@.
    // See also `#toArray(), `#keys().
    //?`[
    //    _.values([1, 2])        //=> [1, 2]
    //    _.values(Array(3))      //=> [<3 empty slots>]
    //    _.values({a: 1, b: 2})  //=> [1, 2]
    //    _.values('abc')         //=> ['a', 'b', 'c']
    // `]
    values: function (value) {
      // ap.slice() splits a string, ap.concat() doesn't.
      return transform(value, [], 0, ap.slice, function () {
        return Object.keys(value).map(function (key) {
          return value[key]
        })
      })
    },
    // Merges members of given objects into the first argument, overwriting
    // keys of earlier arguments with later ones.
    //= object `'obj1
    //> objects `- only object-type arguments
    // ECMAScript equivalent: `@o:Object/assign`@. See also `#union(),
    // `#intersection().
    //
    // ` `*Warning: `#assign() mutates the first argument (and returns it).`*
    //?`[
    //    _.assign({})              //=> the argument unchanged
    //    _.assign({}, {a: 1})      //=> first argument changed to {a: 1}
    //    _.assign({b: 3}, {b: 4})  //=> first argument changed to {b: 4}
    // `]
    // Only own properties are considered (`#hasOwn()):
    //[
    //    _.assign({toString: f}, {})
    //      //=> first argument unchanged, even though: 'toString' in {}
    //]
    assign: function (/* ...objects */) {
      if (Object.assign) {
        // If the environment is capable of assign() then it can handle
        // symbols as well. If it isn't, then it doesn't support symbols
        // and we can iterate over objects manually.
        return Object.assign.apply(undefined, arguments)
      } else {
        var cur = arguments[0]
        var keys = {}
        for (var i = arguments.length - 1; i >= 1; i--) {
          Object.keys(arguments[i]).forEach(function (item, key) {
            if (!NoDash.hasOwn(keys, key)) {
              keys[key] = null
              cur[key] = item
            }
          })
        }
        return cur
      }
    },
    // Returns `'true if `'value has defined `'property.
    //> value `- any object type - `'Array, `'Function, etc.
    // ECMAScript equivalent: `@o:Object/hasOwnProperty`@.
    // See also `#allKeys(), `#values().
    //?`[
    //    'toString' in {}
    //      //=> true (coming from Object.prototype)
    //    _.hasOwn({}, 'toString')              //=> false
    //    _.hasOwn({toString: f}, 'toString')   //=> true
    //
    //    'length' in []                        //=> true
    //    _.hasOwn([], 'length')                //=> false
    // `]
    hasOwn: function (value, property) {
      return Object.prototype.hasOwnProperty.call(value, property)
    },

    // Originally String functions.

    //! `, +fna=function ( value, sub [, startIndex] )
    // Returns `'true if `'value begins with `'sub.
    //
    //#sw
    //> value array`, object`, string
    //> sub same type as `'value `- object keys are ignored; if empty, always
    //  returns `'true
    //#
    //> startIndex omitted = 0`, int
    // ECMAScript equivalent: `@o:String/startsWith`@ (not in IE).
    // See also `#endsWith().
    //
    //#swuo
    //##-unordered
    // Even though object can be given, doing so invokes undefined behaviour.
    //
    //#
    //?`[
    //    _.startsWith('abc', 'ab')                 //=> true
    //    _.startsWith('abc', 'bc', 1)              //=> true
    //    _.startsWith(['ab', 'cd'], ['ab'])        //=> true
    //    _.startsWith(['ab', 'cd'], ['ab', 'cd'])  //=> true
    //    _.startsWith([{}], [{}])                  //=> false ({} !== {})
    //    _.startsWith({a: 1, b: 2}, {c: 1})        //=> true
    //    _.startsWith({a: 1, b: 2}, {a: 3})        //=> false
    // `]
    startsWith: function (value, sub, startIndex, ends) {
      if (!NoDash.isArrayLike(value)) { sub = NoDash.values(sub) }
      var length = sub.length
      var part = ends === unset
        ? NoDash.slice(value, startIndex - length, startIndex)
        : NoDash.slice(value, startIndex, startIndex + length)
      return NoDash.size(part) == length &&
        NoDash.every(NoDash.values(part), function (item, index) {
          return item === sub[index]
        })
    },
    //! `, +fna=function ( value, sub [, endIndex] )
    // Returns `'true if `'value ends with `'sub.
    //
    //#-sw
    //> endIndex omitted = `'length`, int
    // ECMAScript equivalent: `@o:String/endsWith`@ (not in IE).
    // See also `#startsWith().
    //
    //#-swuo
    //?`[
    //    _.endsWith('abc', 'bc')                 //=> true
    //    _.endsWith('abc', 'ab', 2)              //=> true
    //    _.endsWith(['ab', 'cd'], ['cd'])        //=> true
    //    _.endsWith(['ab', 'cd'], ['ab', 'cd'])  //=> true
    //    _.endsWith({a: 1, b: 2}, {c: 2})        //=> true
    //    _.endsWith({a: 1, b: 2}, {b: 3})        //=> false
    // `]
    endsWith: function (value, sub, endIndex) {
      return NoDash.startsWith(value, sub, endIndex, unset)
    },
    //! `, +fna=function ( value, length [, pad] )
    // Returns a copy of `'value, with prepended `'pad if its `'length was
    // too short.
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
    // Returns a copy of `'value, with appended `'pad if its `'length was
    // too short.
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
      return value.concat.apply(value.constructor(), NoDash.fill(Array(count), value))
    },
    //! `, +fna=function ( value [, blank] )
    // Returns a copy of `'value with certain "blanks" in start and end removed.
    //
    //#tr
    //= array`, object`, string
    //> value array`, object`, string
    //> blank mixed for array/object `'value`, string`,
    //  omitted = falsy for array/object, whitespace `[/\s/`] for string
    //##-unordered
    // For object `'value this function sees arbitrary members as "start"/"end".
    //?`[
    //    _.trim(' abca ')            //=> 'abca'
    //    _.trim('abca ', 'ba')       //=> 'ca '
    //    _.trim('.ab.', '.*')        //=> 'ab' (blank is raw, not a RegExp)
    //    _.trim(['ab', 'cd'], 'ab')  //=> ['cd']
    //    _.trim(Array(5))            //=> []
    //    _.trim({a: null, b: 1, c: false})   //=> {b: 1}
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
    //> value array`, object`, string
    // The `'> is not escaped since it's not special unless your markup is
    // already broken (e.g. not using quotes for attributes). See
    // `@https://mathiasbynens.be/notes/ambiguous-ampersands`@ (thanks LoDash,
    // `@lo:escape`@()).
    //?`[
    //    _.escape(' & < " \' > ')    //=> ' &amp; &lt; &quot; &#39; > '
    //    _.escape(['a&b', '<c>d'])   //=> ['a&amp;b', '&lt;c>d']
    //    _.escape({a: '"b\''})       //=> {a: '&quot;b&#39;'}
    // `]
    //* With jQuery you'd escape like so: `[$('<p>').text(value).html()`].
    //* Not to be confused with standard `@o:escape`@() used for URL encoding.
    escape: function (value) {
      if (typeof value == 'string') {
        var to = {'&': 'amp', '<': 'lt', '"': 'quot', "'": '#39'}
        return value.replace(/&<"'/g, function (m) { return '&' + to[m] + ';' })
      } else {
        return NoDash.map(value, NoDash.escape)
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
    // See also `#isArray, `#toArray(), `#size().
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
      return value && typeof value.length == 'number'
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
    // Returns `'true if `'value has zero length or no keys (for
    // non-`#isArrayLike objects).
    //> value array`, object
    //?`[
    //    _.isEmpty([])           //=> true
    //    _.isEmpty('')           //=> true
    //    _.isEmpty({})           //=> true
    //    _.isEmpty({length: 0})  //=> true
    //    _.isEmpty({a: 1})       //=> false
    // `]
    isEmpty: function (value) {
      return (NoDash.isArrayLike(value) ? value : Object.keys(value)).length < 1
    },
    // Returns `'true if `'value is a native DOM `'Element.
    // See `@mdn:Node/nodeType`@.
    //?`[
    //    _.isElement(null)                           //=> false
    //    _.isElement($('p'))                         //=> false
    //    _.isElement(document.body)                  //=> true
    //    _.isElement(document.createTextNode('z'))   //=> false
    // `]
    isElement: function (value) {
      return value && value.nodeType === 1
    },
    //! `, +fna=function ( func [, numeric] )
    // Returns a function that calls `'func and inverts its result.
    //> func `- subject to `#bind()
    //> numeric `- if truthy, changes sign of `'func's result, else treats it
    //  as bool
    //?`[
    //    _.negate(() => true)      //=> will return false
    //    _.negate(() => -1, true)  //=> will return +1
    // `]
    negate: function (func, numeric) {
      func = bind(func)
      return function () {
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
    // Since `#reject() is non-standard, its `'func is subject to `#bind()
    // but it's better not to rely on this for symmetry and in case it gets
    // standardized.
    reject: function (value, func, cx) {
      return NoDash.filter(value, NoDash.negate(func), cx)
    },
    //! `, +fna=function ( value [, length] )
    // Returns at most first `'length members of `'value.
    //
    //#fr
    //= mixed if `'length is omitted`, array`, object
    //> value array`, object
    //> length omitted return one member`, int return a `#slice of `'value
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
    // `]
    last: function (value, length) {
      return slice(value, arguments.length > 1 ? -length : -1, undefined, arguments.length <= 1)
    },
    //! `, +fna=function ( value [, length] )
    // Returns all members of `'value except for last `'length.
    //
    //#ini
    //= array`, object
    //> value array`, object
    //> length omitted = 1`, int
    //##-unordered
    //#
    // See also `#last(), `#first(), `#rest().
    //?`[
    //    _.initial(['a', 'b', 'c'])      //=> ['a', 'b']
    //    _.initial(['a', 'b', 'c'], 2)   //=> ['a']
    //    _.initial({a: 1, b: 2, c: 3})   //=> {a: 1, b: 2}
    // `]
    initial: function (value, length) {
      return slice(value, 0, arguments.length > 1 ? -length : -1, false)
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
    // `]
    rest: function (value, length) {
      return slice(value, arguments.length > 1 ? length : 1, undefined, false)
    },
    // Treats every member of `'value as an object and calls `'method on it,
    // returning results of all such calls.
    //= array`, object
    //> value array`, object
    //> method str
    //> args `- arguments that `'method's receive, none by default
    // See also `#forEach().
    //?`[
    //    _.invoke([' a', 'b '], 'trim')            //=> ['a', 'b']
    //    _.invoke({a: 11, b: 29}, 'toString', 16)  //=> {a: 'b', b: '1d'}
    // `]
    invoke: function (value, method /* , ...args */) {
      var args = ap.slice.call(arguments, 2)
      return NoDash.map(value, function (item) {
        return item[method].apply(item, args)
      })
    },
    // Treats every emmber of `'value as an object and collects their `'property.
    //= array`, object
    //> value array`, object
    // See also `#map().
    //?`[
    //    _.pluck(['ab', 'ccdd'], 'length')         //=> [2, 4]
    //    _.pluck({a: 'ab', b: 'ccdd'}, 'length')   //=> {a: 2, b: 4}
    // `]
    pluck: function (value, property) {
      return NoDash.map(value, function (obj) {
        return obj[property]
      })
    },
    //! `, +fna=function ( value [, func [, cx]] )
    // Returns the "maximum" member as ranked by `'func.
    //= mixed`, -Infinity if `'value is empty
    //#mx
    //> value array`, object
    //> func omitted take the member's value as its rank`,
    //  function `- subject to `#bind(); receives member's value, its key and
    //  the entire `'value; returns a comparable (number or string)
    //
    //#
    // ECMAScript equivalent: `@o:Math/max`@. See also `#min(),
    //?`[
    //    _.max([1, 2, 3])            //=> 3
    //    _.max({a: 1, b: 2})         //=> 2
    //    _.max([1, 2, 3], v => -v)   //=> 1 (ranked as -1, others as -2, -3)
    // `]
    max: function (value, func, cx) {
      if (!func && NoDash.isArrayLike(value)) {
        return Math.max.apply(undefined, value)
      } else {    // if func or (!func and non-array).
        var max = -Infinity
        var maxItem = -Infinity
        func = bind(func, arguments, 2)
        NoDash.forEach(value, function (item) {
          var num = func ? func.apply(this, arguments) : item
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
    // ECMAScript equivalent: `@o:Math/min`@. See also `#max(),
    min: function (value, func, cx) {
      func = bind(func, arguments, 2)
      var res = NoDash.max(value, function (value) {
        return -(func ? func.apply(undefined, arguments) : value)
      })
      return res === -Infinity ? Infinity : res
    },
    // Returns a copy of `'value with members sorted according to `'func.
    //= array `- even for object `'value
    //> value array`, object
    //> func `- subject to `#bind(); receives member's value, its key and
    //  the entire `'value; returns a comparable (number or string); members
    //  with identical ranks are sorted by their keys
    // See also `#sort()
    //?`[
    //    _.sort([5, 1, 3], v => v)               //=> [1, 3, 5]
    //    _.sort({a: 5, b: 2}, (v, k) => k)       //=> {a: 5, b: 2}
    // `]
    sortBy: function (value, func, cx) {
      var entries = tagAndSort(value, func, cx)
      return entries.map(function (item) { return item[1] })
    },
    // Puts every member of `'value under its group determined by `'func.
    //= object `- members are arrays or objects depending on `'value's type
    //> value array`, object
    //> func `- subject to `#bind(); receives member's value, its key and
    //  the entire `'value; returns a scalar (member's group)
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
    //> func `- subject to `#bind(); receives member's value, its key and
    //  the entire `'value; returns a scalar (member's new key); of duplicate
    //  keys only the last occurrence is kept (arbitrary for object `'value)
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
    //> func `- subject to `#bind(); receives member's value, its key and
    //  the entire `'value; returns a scalar
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
    //= array`, object
    //> value array`, object
    //> length omitted = `'length`, int
    // See also `#sample() that returns a single item.
    //?`[
    //    _.shuffle([1, 2, 3])              //=> [3, 1, 2]
    //    _.shuffle([1, 2, 3], 1)           //=> [2]
    //    _.shuffle([1, 2, 3], 2)           //=> [2, 1]
    //    _.shuffle({a: 1, b: 2, c: 3}, 2)  //=> {b: 2, a: 1}
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
    //! `, +fna=function ( [[min,] max] )
    // Returns a random number.
    //> () `- returns a float between 0 (inclusive) and 1 (exclusive)
    //> max `- returns an int between 0 and `'max (inclusive)
    //> min_max `- returns an int between `'min and `'max (inclusive)
    // ECMAScript equivalent: `@o:Math/random`@.
    random: function (min, max) {
      switch (arguments.length) {
        case 0:
          return Math.random()
        case 1:
          return NoDash.random(0, min)
        default:
          return min + Math.floor(Math.random() * (max - min + 1))
      }
    },
    // Converts `'value to a regular `'Array.
    //= array
    //> value array shallow-copied`, object `#values returned`, string returned
    //  as `[[value]`]`, other array-like returned `#slice()'d`, other errored
    // See also `#isArrayLike(), `#values().
    //?`[
    //    _.toArray('abc')                    //=> ['abc']
    //    _.toArray(['a', 'b'])               //=> copy of the argument
    //    _.toArray({a: 1, b: 2})             //=> [1, 2]
    //    _.toArray({a: 1, b: 2, length: 0})  //=> []
    // `]
    toArray: function (value) {
      if (!NoDash.isArrayLike(value)) {
        return Object.keys(value).map(function (key) {
          return value[key]
        })
      } else if (typeof value == 'string') {
        return [value]
      } else {
        // Array.prototype.concat.call(arguments) returns [arguments].
        return ap.slice.call(value)
      }
    },
    // Returns number of members in `'value.
    //> value array`, object`, string
    // See also `#isArrayLike().
    //?`[
    //    _.size('abc')                     //=> 3
    //    _.size(['a', 'b'])                //=> 2
    //    _.size({a: 1, b: 2})              //=> 2
    //    _.size({a: 1, b: 2, length: 5})   //=> 5
    // `]
    size: function (value) {
      if (NoDash.isArrayLike(value)) {
        return value.length
      } else {
        return Object.keys(value).length
      }
    },
    // Splits members of `'value into two groups determined by `'func.
    //= array of `[matching, mismatching`] where each member is either an
    //  array or object depending on `'value's type
    //> value array`, object
    //> func `- subject to `#bind(); receives member's value, its key and
    //  the entire `'value; result converted to bool
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
        if (func.apply(this, arguments)) {
          return true
        } else {
          isArray ? mismatching.push(item) : (mismatching[key] = item)
        }
      })
      return [matching, mismatching]
    },
    // Returns a copy of `'value without falsy members.
    //= array`, object
    //> value array`, object
    // See also `#filter(), `#reject(), `#partition().
    //?`[
    //    _.compact([null, '0', false])       //=> ['0']
    //    _.compact({a: null, b: '', c: 1})   //=> {c: 1}
    // `]
    compact: function (value) {
      return NoDash.filter(value, function (item) { return item })
    },
    // Returns a copy of `'values without `'members given as other arguments.
    //= array`, object
    //> value array`, object
    // See also `#difference().
    //?`[
    //    _.without([1, 2, 3], 2, 1)      //=> [3]
    //    _.without({a: 1: b: 4}, 2, 1)   //=> {b: 4}
    // `]
    without: function (value /* , ...members */) {
      var values = ap.slice.call(arguments, 1)
      return NoDash.filter(value, function (item) {
        return values.indexOf(item) == -1
      })
    },
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
    union: function (/* ...values */) {
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
    // Returns only members present in all given arguments.
    //= array`, object
    //> values array`, object first member's value is kept
    // See also `#union(), `#assign().
    //?`[
    //    _.intersection([1, 2], [1, 3])               //=> [1]
    //    _.intersection({a: 1, b: 2}, {a: 3, c: 4})   //=> {a: 1}
    // `]
    intersection: function (/* ...values */) {
      var args = NoDash.sortBy(arguments, NoDash.size)
      return NoDash.filter(args.shift(), function (item) {
        return NoDash.every(args, function (a) {
          return a.includes(item)
        })
      })
    },
    // Returns members of the first argument that are not listed in other
    // arguments.
    //= array`, object
    //> values array`, object first member's value is kept
    //?`[
    //    _.difference([1, 2], [1, 3])               //=> [2]
    //    _.difference({a: 1, b: 2}, {a: 3, c: 4})   //=> {b: 2}
    // `]
    difference: function (value /* , ...values */) {
      var args = NoDash.sortBy(ap.slice.call(arguments, 1), NoDash.negate(NoDash.size, true))
      return NoDash.filter(value, function (item) {
        return !NoDash.some(args, function (a) {
          return a.includes(item)
        })
      })
    },
    //! `, +fna=function ( value [, func [, cx]] )
    // Returns a sorted copy of `'value without identical (`[===`]) members.
    //= array`, object
    //> value array`, object first member's value is kept
    //> func function ranking members of `'value as if by `#groupBy()`,
    //  omitted to sort by member's value
    //?`[
    //    _.unique([2, 1, 2])             //=> [1, 2]
    //    _.unique([2, 1, 2], v => -v)    //=> [2, 1] (ranked as -2, -1)
    //    _.unique({a: 1, b: 1})          //=> {a: 1}
    // `]
    unique: function (value, func, cx) {
      var prev = unset
      if (arguments.length < 2) {
        return NoDash.filter(NoDash.sort(value), function (item) {
          return prev !== item
        })
      } else {
        var entries = tagAndSort(value, func, cx)
          .filter(function (item) { return prev !== item[2] })
        return NoDash.isArrayLike(value)
          ? entries.map(function (item) { return item[1] })
          : NoDash.fromEntries(entries)
      }
    },
    // Puts member of every argument into that argument's position in the unified
    // returned collection.
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
    zip: function (/* ...values */) {
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
    // Splits members of `'value into multiple collections, each containing
    // all members' values for a particular property.
    //= array of arrays`, object
    //> value arrays of arrays`, array of objects
    // See also `#zip() that does the reverse.
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
      if (NoDash.isArrayLike(args[0])) {
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
    // Returns an object constructed from given keys and values as separate lists.
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
    flip: function (value) {
      var unzipped = NoDash.unzip(NoDash.entries(value))
      return NoDash.object(unzipped[1], unzipped[0])
    },
    //! `, +fna=function ( value [, length] )
    // Splits `'value into chunks, all except last being `'length in size.
    //= array of arrays/objects/strings
    //> value array`, object`, string
    //> length omitted = 1`, int
    //?`[
    //    _.chunk('abcde')                //=> ['a', 'b', 'c', 'd', 'e']
    //      // same as 'abcde'.split('')
    //    _.chunk('abcde', 2)             //=> ['ab', 'cd', 'e']
    //    _.chunk([1, 2, 3, 4, 5], 2)     //=> [[1, 2], [3, 4], [5]]
    //    _.chunk({a: 1, b: 2, c: 3}, 2)  //=> [{a: 1, b: 2}, {c: 3}]
    // `]
    chunk: function (value, length) {
      value = NoDash.entries(value)
      var res = []
      while (value.length) {
        res.push(value.splice(0, length || 1))
      }
      if (NoDash.isArrayLike(value)) {
        res = NoDash.unzip(res)[1]
        return typeof value == 'string' ? res.join('') : res
      } else {
        return NoDash.fromEntries(res)
      }
    },
    //! `, +fna=function ( [begin,] end [, step] )
    // Returns an array of numbers, each different by `'step.
    //> end `- if negative, returns a series from `'end (exclusive) to 0
    //  (inclusive), else from 0 (inclusive) to `'end (exclusive)
    //> begin_end `- returns a series from `'begin (inclusive) to `'end
    //  (exclusive)
    //> ...step int non-zero `- defaults to -1 or +1 depending on `'begin and `'end
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
          return NoDash.fill(Array(Math.floor((end - begin - 1) / step) || 0))
            .map(function () {
              return (begin += step) - step
            })
      }
    },
    // Returns an array of all keys of `'value, including non-own.
    //> value object
    // See also `#hasOwn(), `#values().
    // Warning: uses `[for..in`] that is terribly slow for objects with
    // prototype chains (not just `[{}`]).
    //
    //#-unordgen
    // ` `#allKeys() returns keys in arbitrary order.
    //?`[
    //    function Class() { this.own = 1 }
    //    Class.prototype.inherited = 2
    //
    //    _.hasOwn(new Class, 'inherited')    //=> false
    //    _.allKeys(new Class)                //=> ['own', 'inherited']
    //    _.values(new Class)                 //=> [1]
    // `]
    allKeys: function (value) {
      var res = []
      for (var key in value) { res.push(key) }
      return res
    },
    //! `, +fna=function ( value, func [, cx] | value, keys | value, ...keys )
    // Returns members of `'value with matching keys.
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
    //#
    // See also `#omit() that returns mismatching keys.
    //?`[
    //    _.pick({a: 1, b: 2, c: 3}, v => v < 2)    //=> {a: 1}
    //    _.pick({a: 1, b: 2, c: 3}, ['a', 'c'])    //=> {a: 1, c: 3}
    //    _.pick({a: 1, b: 2, c: 3}, 'a', 'c')      //=> {a: 1, c: 3}
    //    _.pick(['a', 'b', 'c'], 1, 3)             //=> ['a', 'c']
    // `]
    pick: function (value, func, cx) {
      return NoDash.filter(value, pickerFunction(func, arguments, 1), cx)
    },
    //! `, +fna=function ( value, func [, cx] | value, keys | value, ...keys )
    // Returns members of `'value with mismatching keys.
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
      return NoDash.reject(value, pickerFunction(func, arguments, 1), cx)
    },
    // Calls `'func after a delay of `'ms, giving it `'args.
    //
    //#dl
    //> func `- subject to `#bind()
    //> ms int
    //#
    // ECMAScript equivalent: `@mdn:WindowOrWorkerGlobalScope/setTimeout`@.
    // See also `#defer().
    delay: function (func, ms /* , ...args */) {
      return setTimeout(bind(func, arguments, 2, true), ms)
    },
    // Calls `'func outside of the current call stack, giving it `'args.
    //
    //#-dl
    // Calls `#delay() (`@mdn:WindowOrWorkerGlobalScope/setTimeout`@) with 0 delay.
    //
    // Attention: the delay of 0 is not sufficient for certain operations,
    // e.g. changes to a DOM node's visual properties may be batched even
    // across many `#defer()s unless a larger timeout (>= 20) is used.
    defer: function (func /* , ...args */) {
      var args = ap.slice.call(arguments)
      args.splice(1, 0, 0)
      return NoDash.delay.apply(undefined, args)
    },
    // Returns a function that invokes `'func not moroe often than once per `'ms.
    //> func `- subject to `#bind()
    //> ms int
    // See `#debounce().
    //? If `'ms is 100 and the function is called, then again called after
    //  200 ms - `'func is only called once.
    throttle: function (func, ms) {
      func = bind(func)
      var last = 0
      return function () {
        if (Date.now() - last >= ms) {
          last = Date.now()
          func.apply(this, arguments)
        }
      }
    },
    //! `, +fna=function ( func, ms [, immediate] )
    // Returns a function that invokes `'func after `'ms after the last calling
    // attempt.
    //> func `- subject to `#bind()
    //> ms int
    //> immediate `- if truthy, calls `'func immediately when called for the
    //  first time and then never calls for the subsequent `'ms
    // See also `#throttle().
    //? If `'ms is 100 and `'immediate is `'false, if the function is called,
    //  then called again after 50 ms, then again after 200 ms - `'func is
    //  called twice: after 100 ms after the 2nd call and after 100 ms after
    //  the 3rd call. If `'immediate is `'true, `'func is called right on the
    //  first call, then right on the 3rd.
    debounce: function (func, ms, immediate) {
      func = bind(func)
      var timer
      if (immediate) {
        return function () {
          if (!timer) {
            timer = setTimeout(function () { timer = null }, ms)
            return func.apply(this, arguments)
          }
        }
      } else {
        return function () {
          var args = [this, arguments]
          clearTimeout(timer)
          timer = setTimeout(function () {
            func.apply(args[0], args[1])
          }, ms)
        }
      }
    },
    // Returns a function that invokes `'func once, remembers its return value
    // and returns it for subsequent calls without invoking `'func again.
    //> func `- subject to `#bind()
    // ` `#once() can be used for memoization, i.e. caching result of a heavy
    // operation.
    //?`[
    //    var f = _.once(() => Math.random())
    //    f()   //=> 0.2446989
    //    f()   //=> 0.2446989
    // `]
    once: function (func) {
      var res = unset
      return function () {
        if (res === unset) {
          res = bind(func).apply(this, arguments)
        }
        return res
      }
    },
    // Returns a function accepting an object and returning value of its property
    // or of its sub-objects.
    //
    // ` `#property() calls `#at() on the inside.
    //?`[
    //    var objects = [{a: 'abc'}, {a: 'def'}]
    //    _.map(objects, _.property(['a', 1]))    //=> ['b', 'e']
    // `]
    property: function (path, def) {
      if (arguments.length < 2) { def = unset }
      return function (value) { return NoDash.at(value, path, def) }
    },
    // Returns value of `'value's property or of its sub-objects.
    //> value array`, object
    //> path array`, scalar assume `[[path]`] `- each member is a key;
    //  resolving stops on `'null or `'undefined
    //> def mixed returned if property not found`, omitted returns the last
    //  found `'undefined or `'null
    // Without `'def, it's not possible to determine if `'path has resolved
    // to a property with `'undefined and `'null or if it ended prematurely
    // on such a property with more components left in `'path.
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
          return (arguments.length > 2 && def !== unset) ? def : value
        }
        value = value[path[i]]
      }
      return value
    },
    // Calls `'func several `'times, returning results of all call.
    //= array
    //> times int
    //> func `- subject to `#bind(); receives a number from 0 to `[times - 1`]
    // See also `#range().
    //?`[
    //    _.times(3, i => -i)   //=> [-0, -1, -2]
    // `]
    times: function (times, func, cx) {
      func = bind(func, arguments, 2)
      return NoDash.fill(Array(times)).map(function (aNull, index) {
        return func.call(undefined, index)
      })
    },
    // Returns a version of `'func with added arguments and/or forced context.
    //= function`, falsy if `'func or `[func[0]`] is falsy
    //> func function (`'args are appended)`,
    //  array of `[func[, cx[, ...hereArgs]]`] (`'cx and `'args arguments
    //  are ignored)
    //> cx object override the caller-specified context for `'func (its `'this)`,
    //  undefined keep the caller-specified context
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
    // caller-specified context (aka "partial" application).
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
    bind: function (func, cx /* , ...args */) {
      return bind(func, arguments, 1)
    },
    // Performs a remote request using `'XMLHttpRequest and a subset of jQuery's
    // `'ajax() API.
    //= XMLHttpRequest `- the `'xhr
    //> options object
    // Possible `'options keys:
    //> url str
    //> type str `- `'GET by default
    //> data str`, FormData, Blob, URLSearchParams (not in IE), etc.
    //  `- request data for `'POST, etc.
    //> dataType str `- type of `[xhr.response`], from standard
    //  `@mdn:XMLHttpRequestResponseType`@; `'text by default; other useful types
    //  are `'document (for HTML and XML) and `'json
    //> context object `- calling context for below callbacks
    //> beforeSend function `- called before `[xhr.open()`]; receives `'xhr
    //  and `'options (mutable, affects internal copy, not given `'options);
    //  if returns `[=== false`] then the request is not performed and `'error
    //  is called without giving `'e (imitates `'abort())
    //> success function `- called when response has arrived; receives `'xhr
    //  and `'e
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
    //> timeout int milliseconds `- if exceeded, request `'error's with the
    //  `'status of 0
    //> headers object `- members can be strings or arrays; by default has
    //  `[X-Requested-With: XMLHttpRequest`] and, if `'type is not
    //  `'GET, `[Content-Type: application/x-www-form-urlencoded`]
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
    // ECMAScript equivalents: `@mdn:XMLHttpRequest`@, `@mdn:Fetch_API`@.
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
    //      timeout:      5000,  // 5 seconds.
    //      headers:      {},    // remove X-Requested-With.
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

      if (o.type != 'GET' && !o.headers['Content-Type']) {
        o.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }

      var xhr = new XMLHttpRequest
      var queue = []

      var finish = function () {
        // Delayed processing to let all other events (errors) pass through.
        queue.length || NoDash.defer(function () {
          // No pop() - queue.length must be non-0 to prevent late XHR events
          // from re-triggering this.
          var args = [xhr].concat(ap.slice.call(queue[queue.length - 1]))
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
          var args = [xhr].concat(ap.slice.call(arguments))
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
    // Converts a template `'str to a function that accepts variables and
    // returns a formatted string.
    //= function accepting `[vars, opts`] `- see below
    //> str string`,
    //  function take the contents of the first `[/**/`] comment`,
    //  Node take `'textContent `- the template
    //> options object`, omitted `- compilation options
    // Possible `'options keys:
    //> prepare object defaults for formatting variables and/or options (under
    //  `'o)`, function receives caller-given `[vars, opt`] (as `'{} if falsy)
    //  and returns an object with complete variables and options (may be
    //  mutated)`, omitted
    //> with bool`, null enable only if there exists a code `'ref `- if set,
    //  members of `'vars can be referenced directly, not through `'v; such
    //  templates are slower due to using JavaScript's `[with { }`]; non-code
    //  `'ref work regardless of this (`'v is added automatically)
    //> laxRef bool`, omitted = `'true `- if set, non-code `'ref
    //  are resolved with `#property(), meaning they return the non-object
    //  value immediately, even if there are more path components (that triggers
    //  an error without `'laxRef, but is faster)
    //> eval bool`, omitted = `'true `- if unset, fails to compile if there are
    //  constructs allowing arbitrary code execution; in such case it should
    //  be safe to pass `'str from untrusted input since it can only operate
    //  on values given to the compiled function (unless there are custom
    //  `'blocks)
    //> blocks object`, omitted = default `'if/`'for/etc. `- new `'custom or
    //  overridden standard `'if/`'for/etc.; key is the block's name
    //  (alphanumeric), value is a function receiving `[param, value, c`]:
    //  `> param false if no `[:...`] given`, str `- part after `':; `'false
    //     conveniently is `''' for cases when `[block`] and `[block:`] are
    //     identical
    //  `> value false no space given`, str `- part after space; on conflict
    //     with non-code `'echo the latter wins so add a colon for unambiguity:
    //     `[{{echo}}`] but `[{{block:}}`]
    //  `> c obj `- current compiler's state; keys:
    //     `> options obj `- an internal copy of `'options given to
    //        `#template(), with filled defaults
    //     `> ref function `- receives a raw string, returns a JavaScript
    //        code snippet evaluating to string
    //     `> stack `- current chain of blocks, first being last opened
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
    // Template syntax loosely resembles that of Mustache.js/Handlebars.js -
    // all substitutions are performed within `[{{...}}`]:
    //[
    //    escaped       = \[\\...]{{
    //    echo          = {{ [=] ref }}
    //    conditional   = {{ [else]if[:not] ref }}
    //                  | {{ else[:] }}
    //    loop          = {{ for[:[pf]] ref }}
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
    //  periods). Without `'= the result is post-processed by `[o.escaper`]
    //  (e.g. HTML-escaped). If `'ref is falsy, emits nothing.
    //* `'conditional: emits the enclosed block only if `'ref is truthy (falsy
    //  with `':not).
    //* `'loop: emits the enclosed block once for every iteration. `'ref is
    //  given to `#forEach(). Optional `'pf specifies prefix for variables
    //  inside the block that are by default `'v (value), `'k (key), `'i (index,
    //  same as `'k if `'ref `#isArrayLike), `'vv (the `'ref).
    //
    //  Only `'i exists outside of the block and is `'undefined prior to the first
    //  `'loop with that `'pf; after a `'loop it holds index of the last
    //  iterated member, or -1 if `'ref was empty - this is what `'loop's
    //  enclosed `'elseif/`'else test (they also change `'for's `'block_end from
    //  `'/for to `'/if). Without `[:`] or with `[:-`], last `'for (its `'pf) is
    //  checked: `[{{elseif}} {{elseif:-}} {{elseif:-:not}}`] - but here last
    //  `'for with empty `'pf is checked: `[{{elseif:}} {{elseif::not}}`].
    //* `'block_end: give the expected block's type (not simply `[{{/}}`])
    //  for extra syntax safety: `[
    //      {{if ...}} {{for ...}} {{/}} {{/}}        - works
    //      {{if ...}} {{for ...}} {{/for}} {{/if}}   - works
    //      {{if ...}} {{for ...}} {{/if}} {{/for}}   - fails to compile
    //  `]
    //* Nesting `'{{ `'}} is not supported but you can use string escapes:
    //  `[{{'}}'}}`] fails but `[{{'\x7d}'}}`] works.
    //
    // The returned compiled template function accepts these arguments:
    //> v object`, falsy = `'{} `- variables for access by `'ref
    //> o object`, falsy = `'{} `- formatting options; standard keys:
    //  `> escaper function`, omitted return as is `- `'echo without `'= runs
    //     the value through this; in HTML context you'd set it to `#escape()
    //
    // These variables exist within the returned function:
    //> _ `- reference to NoDash regardless of the global `'_
    //> v `- variables as given by the caller
    //> o `- options as given by the caller
    //> * `- members of `'v, if `[options.with`] is set
    //
    //?`[
    //    _.template('{{a.b.c}}')({})                   //=> ''
    //    _.template('{{a.b.c}}', {laxRef: false})      // Error
    //    _.template('{{Math.random()}}')()             //=> 0.2446989
    //
    //    _.template('{{if Math.random() > 0.5}}win!{{/}}')()
    //      //=> 'win!' or ''
    //    _.template('{{if Math.random > 0.5}}win!{{/}}')()
    //      // Error (laxRef only affects non-code ref)
    //    _.template('{{if Math.random > 0.5}}win!{{/}}')({
    //      Math: {random: 9000},
    //    })
    //      //=> 'win!'
    //
    //    _.template('{{if Math.random}}win!{{/}}')({}, {laxRef: false})
    //      // Error
    //    _.template('{{if Math.random}}win!{{/}}')()
    //      //=> ''
    //    _.template('{{if:not Math.random}}win!{{/}}')()
    //      //=> 'win!'
    //    _.template('{{if Math.random}}win!{{/}}')({
    //      Math: {random: 0},
    //    })
    //      //=> ''
    //    _.template('{{if Math.random}}win!{{/}}')({
    //      Math: {random: -451},
    //    })
    //      //=> 'win!'
    //
    //    _.template('{{document.title}}')()            //=> ''
    //    _.template('{{document.title}}')({
    //      document: {title: 'foo'},
    //    })
    //      //=> 'foo'
    //    _.template('{{document.title}}')({
    //      document: {title: 'foo'},
    //    }, {with: false})
    //      //=> 'foo'
    //    _.template('{{document['title']}}')()
    //      //=> 'bar' (window.document.title)
    //    _.template('{{document['title']}}')({
    //      document: {title: 'foo'},
    //    })
    //      //=> 'foo'
    //    _.template('{{document['title']}}')({
    //      document: {title: 'foo'},
    //    }, {with: false})
    //      //=> 'bar'
    // `]
    //
    //?`[
    //    var tpl = function () { /*
    //      {{if homepage}}<a href="{{homepage}}">Homepage</a>{{/}}
    //    */ }
    //    _.template(tpl)({homepage: 'https://squizzle.me'})
    //      //=> <a href="https://squizzle.me">Homepage</a>
    // `]
    //
    //? Given this node somewhere in DOM (`[<template>`] is unsupported in IE):
    //  `[
    //    <script type="text/template" id="menuTemplate">
    //      <ul>
    //        {{for menu}}
    //          <li>
    //            {{i+1}}. <a href="{{v.url}}">{{v.caption}}</a>
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
    //    var w = function (v, o) {
    //      _.assign({}, v, {a: '&'})
    //      _.assign({}, o, {escaper: _.escape})
    //      return f(v, o)
    //    }
    //    w({a: '<'}, {escaper: null})    //=> '&amp;'
    //  `]
    //  Function form of `'prepare is useful if the template is compiled
    //  early but the defaults it should use change over time:
    //  `[
    //    var f = _.template('{{r}}', {prepare: {r: Math.random(), o: {}}})
    //    f()         //=> 0.2446989
    //    f()         //=> 0.2446989
    //    f({r: -1})  //=> -1
    //
    //    var f = _.template('{{r}}', {prepare: function (v, o) {
    //      return {r: Math.random(), o: o}
    //        // ignores all caller-given variables, keeps its options
    //      return _.assign({}, v, {r: Math.random(), o: o})
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
    //      {{if i == -1 && v.b}}
    //        b
    //      {{elseif i == -1}}
    //        c
    //      {{/if}}
    //    ``)
    //
    //    f()                 //=> 'c'
    //    f({b: true})        //=> 1
    //    f({a: [1, 2, 3]})   //=> 'aaa'
    //  `]
    //
    //? `'loop's variables shadow global ones by the same name; globals are
    //  still accessible only with enabled `[options.with`].
    //  In any case, use `':pf to avoid shadowing.
    //  `[
    //      {{v.x}}                         // x of the global object
    //      {{for v.y}} {{v.x}} {{/for}}    // x of the member being looped over
    //      {{for v.y}} {{x}} {{/for}}
    //        // if options.with is enabled, x is of the global object, else
    //        // it's an error (lexRef = false) or ''
    //      {{for:f v.y}} {{v.x}} {{fv.x}} {{/for}}
    //  `]
    //
    //? Custom block:
    //  `[
    //    var sample = function (param, value, c) {
    //      return {start: '_.sample(' + c.ref(value) + ')'}
    //    }
    //    _.template('{{sample items}}', {blocks: {sample}})
    //      ({items: ['a', 'b', 'c']})
    //        //=> 'a' or 'b' or 'c'
    //  `]
    template: function (str, options) {
      options = NoDash.assign({}, options, {with: null, laxRef: true,
                                            code: true, blocks: {}})

      options.blocks = NoDash.assign({
        if: function (param, value, c) {
          if (param == 'not') {
            param = '!'
          } else if (param) {
            throw new Error('template: bad "if:' + param + '".')
          }
          return {start: '(' + param + c.ref(value) + '?""', end: ':"")'}
        },
        elseif: function (param, value, c) {
          if ((c.stack[0] || {}).type == 'for') {
            param = (param === false ? '-' : param).match(/^(\w*|-)(:(.*))?$/)
            var ref = function (s) {
              return (param[1] == '-' ? c._lastFor : param[1]) + 'i==-1&&' + c.ref(s)
            }
            var res = object.blocks.if(param[3], value, {ref: ref})
            res.start = c.stack.shift().end + '+' + res.start
            res.type = 'if'
            return res
          } else if ((c.stack[0] || {}).type != 'if' || c.stack[0]._else) {
            throw new Error('template: elseif: no preceding if or for.')
          } else {
            var res = object.blocks.if.apply(this, arguments)
            c.stack[0].end = res.end + stack[0].end
            return {start: ':' + res.start}
          }
        },
        else: function (param, value, c) {
          if ((param && ((c.stack[0] || {}).type != 'for')) || value) {
            throw new Error('template: else takes no arguments.')
          } else {
            var ce = NoDash.assign({}, c, {ref: function () { return 1 }})
            return NoDash.assign(object.blocks.elseif(param, '', ce), {_else: true})
          }
        },
        for: function (pf, value, c) {
          if (!/^\w*$/.test(pf)) {
            throw new Error('template: bad "for:' + pf + '".')
          }
          c._lastFor = pf
          return {
            head: 'var ' + pf + 'i=-1;',
            start: '(' + pf + 'i=0,' +
                   '_.map(' + c.ref(value) + ',' +
                   'function(' + pf + 'v,' + pf + 'k,' + pf + 'vv){' +
                   pf + 'i++;return"',
            end: '""}).join("")',
          }
        },
      }, options.blocks)

      var dotted = function (s, delim) {
        return '["' + s.replace(/\./g, '"' + delim + '"') + '"]'
      }

      var c = {
        options: options,
        stack: [],
        _lastFor: null,

        ref: function (s) {
          if (!s || !/\S/.test(s)) { throw new Error('template: blank ref.') }
          if (/^[\w.]+$/.test(s)) {
            s = options.laxRef
              ? '_.at(v, ' + dotted(s, ',') + ')' : 'v' + dotted(s, '][')
          } else if (!options.code) {
            throw new Error('template: code refs prohibited.')
          } else {
            haveCode = s = '(' + s + ')'
          }
          return s
        },
      }

      var haveCode = false
      var blocks = NoDash.keys(options.blocks).join('|')
      var blockStart  = new RegExp('^(' + blocks + ')(:\w*)?(\s+(.*))?$')
      var blockEnd    = new RegExp('^\\/\s*(' + blocks + ')?\s*$')

      if (str instanceof Function) {
        // RegExp /.../s flag is not supported in FF.
        str = NoDash.trim(str.toString().match(/\/\*([\s\S]*)\*\//)[1])
      } else if (NoDash.isElement(str)) {
        str = str.textContent
      }

      str =
        'return"' +
        str.replace(/(\\(\\\\)*)\{\{|(\\\\)*\{\{\s*(.*?)\}\}|(["\\])/g, function (m) {
          if (m[1]) {
            var res = m[0].substr(1)
          } else if (m[5]) {    // " or \.
            var res = '\\' + m[0]
          } else {
            var res = m[3] + '"+'
            var inside = m[4]
            if (inside[0] == '=') {
              res += '(' + c.ref(inside.substr(1)) + '||"")'
            } else if (m = inside.match(blockStart)) {
              var block = options.blocks[m[1]](m[2] ? m[2].substr(1) : false,
                                               m[3] ? m[4] : false, c)
              str += block.head || ''
              res += block.start || ''
              block.type = block.type || m[1]
              block.end && c.stack.unshift(block)
            } else if (m = inside.match(blockEnd)) {
              if (!c.stack.length || (m[1] && c.stack[0].type != m[1])) {
                var stack = c.stack.length ? '{{/' + c.stack[0].type + '}}' : 'no block'
                throw new Error('template: ' + m[0] + ' expected, ' + stack + ' found.')
              }
              res += c.stack.shift().end
            } else {
              res += '(o.escaper?o.escaper(' + c.ref(inside) + '||""):' +
                     c.ref(inside) + '||"")'
            }
            res += '+"'
          }
          return res
        }) +
        '"'

      if (c.stack.length) {
        var stack = NoDash.pick(c.stack, 'type').join('}} {{/')
        throw new Error('template: unclosed {{/' + stack + '}}.')
      }

      if (options.with == null ? haveCode : options.with) {
        str = 'with(v){' + str + '}'  // str may contain "var".
      }

      if (!options.defaults) {
        var prepare = function (v, o) { return v.o = o, v }
      } else if (typeof options.defaults != 'function') {
        var prepare = function (v, o) {
          return NoDash.assign({}, options.defaults, v,
                               {o: NoDash.assign({}, options.defaults.o, o)})
        }
      } else {
        var prepare = options.defaults
      }

      // It appears that strict mode isn't applied to such functions even
      // though it applies to eval, neither when they're created nor called.
      // But unlike eval such functions have access to the global scope only.
      return (new Function('p, _, v, o', 'v=p(v||{},o||{});o=v.o;' + str))
        .bind(undefined, prepare, NoDash)
    },
  }

  //! +cl=Aliases
  // This isn't a class but an index of function aliases available on the main
  // `#NoDash class.
  //
  // Aliases improve `#COMPATIBILITY with standard ECMAScript, Underscore and
  // LoDash API.
  //
  // Use `*Show code`* to see the function targeted by an alias.
  var aliases = {
    each:           NoDash.forEach,         // Underscore. LoDash.
    all:            NoDash.every,           // Underscore.
    any:            NoDash.some,            // Underscore.
    contains:       NoDash.includes,        // Underscore.
    uniq:           NoDash.unique,          // Underscore. LoDash.
    extend:         NoDash.assign,          // Underscore. LoDash.
    isArray:        Array.isArray,          // Underscore. LoDash.
    isEqual:        function (a, b) { return a == b },  // Underscore. LoDash.
    trimLeft:       NoDash.trimStart,       // Standard.
    trimRight:      NoDash.trimEnd,         // Standard.
    drop:           NoDash.rest,            // Underscore. LoDash.
    tail:           NoDash.rest,            // Underscore. LoDash.
    dropRight:      NoDash.initial,         // LoDash.
    flatten:        NoDash.flat,            // Standard. Underscore. LoDash.
    flattenDepth:   NoDash.flat,            // LoDash.
    fromPairs:      NoDash.fromEntries,     // LoDash.
    head:           NoDash.first,           // Underscore. LoDash.
    take:           NoDash.first,           // Underscore. LoDash.
    takeRight:      NoDash.last,            // LoDash.
    remove:         NoDash.reject,          // LoDash.
    zipObject:      NoDash.object,          // LoDash.
    keyBy:          NoDash.indexBy,         // LoDash.
    //! `, +fna=function ( value [, n] )
    // Returns a random member of `'value.
    //> value array`, object
    //> n int`, omitted `- exists for compatibility with Underscore's
    //  `@un:sample`@() and LoDash's `@lo:sample`@(); if given, `#sample()
    //  works just like `#shuffle() in NoDash
    // See also `#shuffle() that returns several random members of `'value.
    //?`[
    //    _.sample([1, 2, 3])               //=> 3
    //    _.sample({a: 1, b: 2})            //=> {b: 2}
    //    _.keys(_.sample({a: 1, b: 2}))    //=> 'a' (random member's key)
    // `]
    sample:         function (value, n) {
      if (arguments.length > 1) {
        return NoDash.shuffle(v, n)
      } else {
        return NoDash.first(NoDash.shuffle(value, 1))
      }
    },
    sampleSize:     NoDash.shuffle,         // LoDash.
    maxBy:          NoDash.max,             // LoDash.
    minBy:          NoDash.min,             // LoDash.
    findKey:        NoDash.findIndex,       // Underscore. LoDash.
    has:            NoDash.hasOwn,          // Underscore. LoDash.
    forOwn:         NoDash.forEach,         // LoDash.
    invert:         NoDash.flip,            // Underscore. LoDash.
    mapValues:      NoDash.map,             // LoDash.
    toPairs:        NoDash.entries,         // LoDash.
    pairs:          NoDash.entries,         // Underscore.
    transform:      NoDash.reduce,          // LoDash.
    nth:            NoDash.at,              // LoDash.
    // LoDash.
    //> value array`, object
    flattenDeep:    function (value) { return NoDash.flat(value, Infinity) },
    // Underscore. LoDash.
    partial:        function (func /* , ...args */) {
      var args = [func, undefined].concat(NoDash.rest(arguments))
      return NoDash.bind.apply(undefined, args)
    },
  }

  Object.keys(aliases).forEach(function (alias) {
    NoDash[alias] = function () {
      // Calling the original function allows correct behaviour in case it's
      // replaced, unlike with NoDash.alias = NoDash.original.
      return aliases[alias].apply(undefined, arguments)
    }
  })

  return NoDash
});