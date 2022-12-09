NoDash.js - a terse utility library based on ES5+ features
==========================================================

NoDash is yet another variant of Underscore.js and LoDash.js but with focus on:

  * Native ES5+ features - say "No" to reinventing the wheel
  * Minimum code - isolated, easy to understand functions (6 lines on average)
  * Completeness - with ajax()*, trim() and others for day-to-day development
  * Universality - work on arrays, objects (map()) and strings (first()) alike

With NoDash, you might not need another utility library and yet your bundle's
size will keep fit as NoDash is smaller than Underscore and LoDash.

Size: 14K minified, 4K gzipped. Functions: 85 + 3*.

(*) Large functions: ajax(), template() and format() are part of nodash-extra.js
    (8K minified). Included in nodash.min.js. Usable with Underscore/LoDash too.


Dependencies
============

None.


Documentation
=============

Functions reference:
https://squizzle.me/js/nodash/

Compatibility table for migrating from Underscore and LoDash:
https://squizzle.me/js/nodash/map.html#COMPATIBILITY


Ways to Install
===============

$ npm install squizzle-nodash


License
=======

Public domain.
http://unlicense.org


Quick list of goodness
======================

Originally Array functions
--------------------------

every           function ( value, func, cx )
fill            function ( value [, filler [, begin [, end]]] )
filter          function ( value, func, cx )
find            function ( value, func, cx )
findIndex       function ( value, func, cx )
flat            function ( value [, depth] )
forEach         function ( value, func, cx )
includes        function ( value, member [, fromIndex] )
indexOf         function ( value, member [, fromIndex] )
join            function ( value, glue )
lastIndexOf     function ( value, member [, fromIndex] )
map             function ( value, func, cx )
reduce          function ( value, func [, initial )
reduceRight     function ( value, func [, initial )
reverse         function ( value )
slice           function ( value [, begin [, end]] )
some            function ( value, func, cx )
sort            function ( value, func )

Originally Object functions
---------------------------

assign          function ( ...objects )
entries         function ( value )
fromEntries     function ( value )
has             function ( value, property )
keys            function ( value )
values          function ( value )

Originally String functions
---------------------------

endsWith        function ( value, sub [, endIndex] )
escape          function ( value )
escapeRegExp    function ( str )
padEnd          function ( value, length [, pad] )
padStart        function ( value, length [, pad] )
repeat          function ( value, count )
startsWith      function ( value, sub [, startIndex] )
trim            function ( value [, blank] )
trimEnd         function ( value [, blank] )
trimStart       function ( value [, blank] )

Utilities not part of any ES standard
-------------------------------------

allKeys         function ( value )
at              function ( value, path, default )
bind            function ( func, cx, ...args )
chunk           function ( value [, length] )
compact         function ( value )
countBy         function ( value, func, cx )
debounce        function ( func, ms [, immediate] )
defer           function ( func, ...args )
delay           function ( func, ms, ...args )
difference      function ( value, ...values )
first           function ( value [, length] )
flip            function ( value )
groupBy         function ( value, func, cx )
indexBy         function ( value, func, cx )
initial         function ( value [, length] )
intersection    function ( value, ...values )
invoke          function ( value, method, ...args )
isArguments     function ( value )
isArrayLike     function ( value )
isElement       function ( value )
isEmpty         function ( value )
last            function ( value [, length] )
max             function ( value [, func [, cx]] )
min             function ( value [, func [, cx]] )
negate          function ( func [, numeric] )
object          function ( keys [, values] )
omit            function ( value, func [, cx] | value, keys | value, ...keys )
once            function ( func )
partition       function ( value, func, cx )
pick            function ( value, func [, cx] | value, keys | value, ...keys )
pluck           function ( value, property )
property        function ( path, default )
random          function ( [[min,] max] )
range           function ( [begin,] end [, step] )
redraw          function ( node [, class] )
reject          function ( value, func, cx )
rest            function ( value [, length] )
sample          function ( value [, n] )
shuffle         function ( value [, length] )
size            function ( value )
sortBy          function ( value, func, cx )
sum             function ( value )
throttle        function ( func, ms, options )
times           function ( times, func, cx )
toArray         function ( value )
union           function ( ...values )
unique          function ( value [, func [, cx]] )
unzip           function ( value )
without         function ( value, ...members )
zip             function ( ...values )

Aliases
-------

all             → every
any             → some
contains        → includes
drop            → rest
dropRight       → initial
each            → forEach
extend          → assign
findKey         → findIndex
flatten         → flat
flattenDeep     function ( value )
flattenDepth    → flat
forOwn          → forEach
fromPairs       → fromEntries
head            → first
invert          → flip
isArray         function ( value )
isEqual         function ( a, b )
keyBy           → indexBy
mapValues       → map
maxBy           → max
minBy           → min
nth             → at
pairs           → entries
partial         function ( func, ...args )
remove          → reject
sampleSize      → shuffle
sign            function ( value )
tail            → rest
take            → first
takeRight       → last
toPairs         → entries
transform       → reduce
trimLeft        → trimStart
trimRight       → trimEnd
uniq            → unique
zipObject       → object

extra.js
--------

ajax            function ( options )
format          function ( [options,] str [, arg [, ...]] )
template        function ( str [, options] )


---
Squizzle ♥ it
https://squizzle.me
