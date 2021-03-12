(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$Main$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $author$project$Highlight$NeutralZone = {$: 'NeutralZone'};
var $author$project$Rte$Break = function (a) {
	return {$: 'Break', a: a};
};
var $author$project$Rte$Char = function (a) {
	return {$: 'Char', a: a};
};
var $author$project$Highlight$OpeningTagEnded = {$: 'OpeningTagEnded'};
var $author$project$Highlight$TagOpened = {$: 'TagOpened'};
var $author$project$Highlight$WithinClosingTag = {$: 'WithinClosingTag'};
var $elm$core$Basics$not = _Basics_not;
var $author$project$Highlight$highlight = F2(
	function (_v0, a) {
		var isCode = _v0.a;
		var elem = _v0.b;
		var red = function (ch) {
			return $author$project$Rte$Char(
				_Utils_update(
					ch,
					{
						highlightStyling: _List_fromArray(
							[
								_Utils_Tuple2('color', 'red')
							])
					}));
		};
		var indent = F2(
			function (x, br) {
				return $author$project$Rte$Break(
					_Utils_update(
						br,
						{indent: x}));
			});
		if (!isCode) {
			return _Utils_update(
				a,
				{
					content: A2($elm$core$List$cons, elem, a.content),
					indent: 0
				});
		} else {
			switch (elem.$) {
				case 'Break':
					var br = elem.a;
					var _v2 = a.scope;
					if (_v2.$ === 'OpeningTagEnded') {
						return _Utils_update(
							a,
							{
								content: A2(
									$elm$core$List$cons,
									A2(indent, a.indent, br),
									a.content),
								indent: a.indent + 1,
								scope: $author$project$Highlight$NeutralZone
							});
					} else {
						return _Utils_update(
							a,
							{
								content: A2(
									$elm$core$List$cons,
									A2(indent, a.indent, br),
									a.content)
							});
					}
				case 'Char':
					var ch = elem.a;
					var _v3 = ch._char;
					switch (_v3) {
						case '<':
							return _Utils_update(
								a,
								{
									content: A2(
										$elm$core$List$cons,
										red(ch),
										a.content),
									scope: $author$project$Highlight$TagOpened
								});
						case '>':
							var _v4 = a.scope;
							switch (_v4.$) {
								case 'NeutralZone':
									return _Utils_update(
										a,
										{
											content: A2($elm$core$List$cons, elem, a.content)
										});
								case 'OpeningTagEnded':
									return _Utils_update(
										a,
										{
											content: A2($elm$core$List$cons, elem, a.content)
										});
								case 'TagOpened':
									return _Utils_update(
										a,
										{
											content: A2(
												$elm$core$List$cons,
												red(ch),
												a.content),
											scope: $author$project$Highlight$OpeningTagEnded
										});
								case 'WithinClosingTag':
									return _Utils_update(
										a,
										{
											content: A2(
												$elm$core$List$cons,
												red(ch),
												a.content),
											scope: $author$project$Highlight$NeutralZone
										});
								default:
									return _Utils_update(
										a,
										{
											content: A2(
												$elm$core$List$cons,
												red(ch),
												a.content),
											scope: $author$project$Highlight$OpeningTagEnded
										});
							}
						case '/':
							var _v5 = a.scope;
							switch (_v5.$) {
								case 'NeutralZone':
									return _Utils_update(
										a,
										{
											content: A2($elm$core$List$cons, elem, a.content)
										});
								case 'OpeningTagEnded':
									return _Utils_update(
										a,
										{
											content: A2($elm$core$List$cons, elem, a.content)
										});
								case 'TagOpened':
									return _Utils_update(
										a,
										{
											content: A2(
												$elm$core$List$cons,
												red(ch),
												a.content),
											indent: a.indent - 1,
											scope: $author$project$Highlight$WithinClosingTag
										});
								case 'WithinClosingTag':
									return _Utils_update(
										a,
										{
											content: A2(
												$elm$core$List$cons,
												red(ch),
												a.content)
										});
								default:
									return _Utils_update(
										a,
										{
											content: A2(
												$elm$core$List$cons,
												red(ch),
												a.content)
										});
							}
						default:
							var _v6 = a.scope;
							switch (_v6.$) {
								case 'NeutralZone':
									return _Utils_update(
										a,
										{
											content: A2($elm$core$List$cons, elem, a.content)
										});
								case 'OpeningTagEnded':
									return _Utils_update(
										a,
										{
											content: A2($elm$core$List$cons, elem, a.content)
										});
								default:
									return _Utils_update(
										a,
										{
											content: A2(
												$elm$core$List$cons,
												red(ch),
												a.content)
										});
							}
					}
				default:
					return _Utils_update(
						a,
						{
							content: A2($elm$core$List$cons, elem, a.content)
						});
			}
		}
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Highlight$markCode = function (content) {
	var f = F2(
		function (elem, _v1) {
			var isCode = _v1.a;
			var xs = _v1.b;
			if (elem.$ === 'Break') {
				var br = elem.a;
				var isCodeNow = A2($elm$core$List$member, 'Code', br.classes);
				return _Utils_Tuple2(
					isCodeNow,
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(isCodeNow, elem),
						xs));
			} else {
				return _Utils_Tuple2(
					isCode,
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(isCode, elem),
						xs));
			}
		});
	return A3(
		$elm$core$List$foldr,
		f,
		_Utils_Tuple2(false, _List_Nil),
		content).b;
};
var $author$project$Highlight$code = function (content) {
	var init = {content: _List_Nil, indent: 0, scope: $author$project$Highlight$NeutralZone};
	return $elm$core$List$reverse(
		A3(
			$elm$core$List$foldl,
			$author$project$Highlight$highlight,
			init,
			$author$project$Highlight$markCode(content)).content);
};
var $author$project$Sample$content = '\n[{\"Constructor\":\"Char\",\"A1\":{\"char\":\"L\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"?\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":\"h1\",\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"C\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"L\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"I\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"x\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"I\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"L\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"4\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"5\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"B\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"C\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"k\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"g\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"v\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"2\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"0\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"0\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"0\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"L\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"I\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"1\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"1\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"0\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"3\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"2\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"1\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"1\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"0\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"3\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"3\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"D\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"F\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"B\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"M\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"(\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"T\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"E\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"x\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"G\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"E\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"v\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\")\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"C\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"w\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"4\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"5\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"B\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"C\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"T\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"k\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"v\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"g\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"R\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"T\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"L\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"I\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"\\\"\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"L\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"\\\"\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"1\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"1\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"0\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"3\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"2\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Embedded\",\"A1\":{\"attributes\":[{\"A1\":\"src\",\"A2\":\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExMVFhUWFRoaGBUYFRUXFhYVFxcXFhgVFxUYHSggGBolHRcVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQFSsdHR0rLS0rKy0tLSstLSstLS0tLS0tLSstLS0rLS0tLS0tLS0rLSstNy0tLS0tNy03LTcrN//AABEIARMAtwMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAEBQMGAAECB//EAD4QAAECBAQDBQYFAwQBBQAAAAEAAgMEESEFEjFBUWFxIoGRofAGEzKxwdFCUmLh8RQjgjNykqKyByQ0Q1P/xAAYAQADAQEAAAAAAAAAAAAAAAABAgMABP/EACIRAQEAAgIDAQADAQEAAAAAAAABAhEhMQMSQVEiMmFxE//aAAwDAQACEQMRAD8AsxChdqiHaKByICK3XS4JXYWZoFdLVFhWFlVy5bWigzlyXT6PcUvnikz6GdgGmq6UTQpCVI7h6iK7eo0BjTyl0xqjYhQUcpcjQI7QrUs663xXMDVJBHhYVoFaKoDh2qxhoVy4rkOutK1LDqeqxY89o9ViXYvV1C4XKlCiOpXbHMmI0XYXETULtZmLCsW3FAXC1VbKimI7WNzPcGt4n1fuWZt6Wz2i4jY/BGmc9GfQmqBj4uH0DGOv+ag8hVRzzx/T441tq2UN71/AeKlhvP46DmBX63U/aH9a6JXD11vYg8wfmNQuYgRYNFQMUo6Ml8YJMjRBxWpfVdFcywSxhoXLiuio3JmcOUDX3opYpQrYl1pWCPd2ysXOrisQ2z1uqjHxLdVyw9pdznTxBou1qJstgVWBtYluIY3Bg9kuzP8AyMua8zo31ZVjE/aSYeaNcITeDPi/5EV+Sll5ccVJhasGLe0MKCSwduINWg2aeDnbHlqqlOzD4z80R5voNA1uwaNh5pcwDNXTzJJuSTxJRsCtdFy5eS59r44TFJAl62Gm/E9TwRsGGG79w+61LQ66omHKnVLINdteKaeRP2UjWs4ePqnksELlWg9AIlkGuxTwoOJKNIrnAI5H9yVFDNDlee+mnMjh0TMS4UUSWvdHli6ZhEcxxFx4oCKnQLoel2nUfOnBDxJIRPgIDvykUB6HitZsCcqOWUsaGWktcCCNioJb6pfrDnFR1W3FRuKO2RxTZLHRLphEKTxD2il2Lv3lCVi4h6rFti9gC4/EtMesB7RXe5REw8AZnGgAJJOwAqSqViHtK6MXMaTDaD8OjnN4lw+SO/8AUGdc2CyC3/7s2Y/oZlq0dS4eCrknJOOQu/ECacWtI3XL587vUW8WM1uuA3I4urXgLWqtOc5xqUdicrlcGjYDxNzXndQw4eq51kENl00l4Y9fdCQIZJzH0BYAJpLM03Rka0XKQeSYw5WgXMvYVRrBXT16urY4p2hmwl3lOn2RWS9l3/TpvUuwYZy8dF3FZsjBCsOvRae0Hl9k2g2Ux4PggXwspqP5CfxIQpzS18OhKGh2FxCS9/Dztu9g/wAqUrfiFU5c37/QVyY8w3Zm7ajiOCCx/DmuHv4dtz+rjX9Q80uWO+R2SKJy7WnKZkDwlMf4im7knmfiKAuWLa4huusQZ6y1y5mJtkNrokQ5WtFSfoBuTwCjhuVc9tJodiFW93uHIAhvfqu3PP1x258cd3RTiuJOm5hrjUNrlhsrZra3P+46n9laYsrliS7eEJ5PTM0eF1VvZ6WL47AONR0DSSf+wVnxKYzvL26AZGni22Y99KrknPNdF44hXiEbNEc6nIDkFGIddtvVVI1l+7vRUKHa6XQsk4OiZSsIaqKAy1tPl3o6AWj9R5fdPjC1KxlbUNPI80cxhCgiOeAKlrB1FfNcMiNLruLrbVI+yrsmhxh8T5hdPIDa5h4hCMewm1a9FKabV8PutttJGvbu4fO67ZlP4h4+SHZMDTITfcj1stxHsOxbXjQ+QR2Gk8WEa6b/ADS2JWvLjvVFs0sad/0UNDcG/NEA8ZgQTxQOYfhcNO5Mnsso/cAnu/daxpVMfDINDqPVVydE7xmRoC7dvmK/wkj1CzSkqBxSeb+Mpw9KpxvaSmgZmqxY3VYgz1CCeKoOJzPvIsR/5nW6aNHTKGhXSbjBkKI8/hY4+VAvPIY7Jvw8hRW8/OoTx/pnIzRhvzN17Tf+Qa37qyn/AExfTfoC0+Li7wVTwluaKwHcinX1RWsuGSnDfagNAe+hP+SnjNw9oOBUF1Ty6KcsBpc9EG6MKc8y1LTdTW1PX2QtY7Y61KE8hv1KKhZ6VJpyFvNAy9CAL9OvyTVmWmUVPQHXmU2PIVLClma7n5dVP7sA0tflwULDludh5KV0TMQQND0PgqSQu04hV26H6UUxZchbhEVAH79FkPtFx5mh702i7cS7a10+q5fDB30UL3Ue9vQjob276qYHaui2m2kZCHo3WRYF6jfZdAjj+y22+l/AolAO1IUsuy/d9KqGM6jtDZTQH9oeHkn7AFiEKxJ0Id/43VOerxOXDe/5lVXF5TI61gamnD9rqXkh8aVPQE0y6YuCCmhdRUhfl7SxdRBdYlFdMdaTKxqa5K9zXBx8gVQWxKg8KE9w9Er0yGARQ3BFCOINiqDiuE/00UQw7NDeKsJ1AzULXceq6PLjxtPx34igxCyKHN5AbkE2HkrnFcPdAjQbcdq9KhUotoy3xB1z5AHwT3FJoDIxpsIbacwWglSl1Dd0HNxL2Wo5LGsI3NxyqKKFnacTtVMHSLnajM3UeNUmOOz26P8ADnVAFyaaAb2Napq2HFpbINxU1PeKKrSk05orQtDaA2pcmgAG50TqT/ujWoqKEk5QeGUWN910YyRLK2pnCN/+sEf8vkg52NMw60cx1BXsg0PfUqywpA0/1AOI92ynyVf9rYwl2ZogAzA5IrAWjOBUMisHxNOlduWqfj8LOa17O+0Pvq5Sc29aVbXZWiXYaWtbgvHMBnHtimKBTObjvXp8nNvNLnTjTlSilPJzo9wTT0cmmUVcKjqCKjwv4pU90UfFEaK/4gd9bpoRc2qSLcSeBP1Qcvg0MEdnO8aueM1N6MabNHPdUpdB4bogI/vMI4ZrJ5JTALT2hY3Io7n3KZkjT8bgeTYdPDKl2JyDycocSSKh4a1j200qW2cORR5heK7mq30udd+9ZBi0c08wVuVkouX+4b8vnRQzIoRyse+32RYwiQDmZQVFdduqrHtL8bB+j60+itj4lMrtjlPfobeKqPtO7+9Tg36lDyf1bDslcgpkXRxKBnHXXMsCjG60untWJTL9BSD2zgVEKIPwucCeFQDTyKeQDZKPbCPkgtd+H3oqeHZOXzXXnN41z4/2IpZw7TfzZT3UNUI6tQDsKDpay1JuDjRpsf8ArU3opnVLz1K48q6JEsjD7661V4w/D4JABYRYfC8t53HBU/DRQ9/grfIvoAK9evPin8eWgym3PtFKsENghNByu7WpIa4UN+PPVZhMo2FRlHZdq0v4I6Aa1J3r5pjLy7aBtaUVZd3admoJhNcaUa0HnU+SQe3suPctD+24k0FOy0Uu6m+ysgiZfXlZVr2jq8l79KUaODfubo+S/wAQw7efyjKOaNrfdejSV2jh3KhxYVL+CueBR6sA5rm8fa+fQ+fBbQg0+lk0koDYjWxGilg0ipNCLboCaFaDn+yJwclhdTvGxH35rrjnpkGkfi8aISKwtcYgNaDTrWx8kxZFDtPPUcqIcwSTc1A0ATUsA/1JNsoB4aoebhVFdkfNQgDzQ8d9qIC4YawmN45vBpqfKiqntFEzPYaXy3KsrIuWH1zj5H6pVjUu/wBy9zmUa1tiSM1ajQbDXVHKbxbG6qrE3QE8/tItzrpbiD1yLuC5aULXLSWi9DgFLfahhMu40qGxGE8hcV8SEfLlbxGFmgR28YT/ABDS4fJd1m8a5p286wtvu3RAbZgMvUGvy+SMEUFxpzolM3OHLpUWPdv0REo+hHMfMLjyls26ZTeQqHeCtWH0NBqqpLa1CfYTM0dzQxCrOINqb/tomci876hLmRrD13ouUjK8JR7wNaKu+0J7LieFutFY2egqZ7Z4mPe+4bsAXHhW9OtFvJxjtseyCNFA7vMp/wCzZNORvoqrORBVoB1VnwN4yj1wXLjvat6PJmJShR8g69tCPBLJk9np5g/uiMEmA05XXDx4Hl9l1434jlDx7RWoU8F1CVAx1d+ncu2xE5HMy3dKJx4obo6ai+uSSzb6kjiVmFYS0Oe3NcDM7voAD4qP2qiAS0Wu9h/yA+6JwvssJ4k1O9B/Kr/ttOgshQhrdzuZrb5psrrFpN1UYhS7EDoj3FL5/Zca6AlYuHaBYlF6HKlGQm1zA6EEHoRT6pfKvR0tqV3Ry15lMSRAiQyKPbUEc9EHJOqwcRY9yvHtlh495DjNsX9lx/UBUHvHyVYiQrNJFK1suXL+O8XTOeUktGsLp5IRbhVsC9E7wZ3FLO2qxxZtw9cU6w2JWnj5Kq4g6kRreI8dlY8FNaV4d26pOyXpZJe6889s8IiCLEjN7QLwXDUgUAPWgV8EXK2u5sNPFKJ25odCnzksLjdV5hjOGxw5roYzMLM4cOtMvXS3NH4BjphgNeKEE1BPdYK6mWbTQU6bKVknCAzOYHHoCt641t2B8NmYk1QCohts5/CpuK6VPBN8MwfJGe50RzmAkQwdRXQnkNFHLzZAa02aDoBSg2smTST9/qnmi3bcIOY4tJtt3op7gQuYsPO0NPxD4TzG3eg/edk8fNGwNsc6qVvFYlOFfkjbhrShSO0T60WZqTmne9dDoQ0CodSxLtqqn4xNe8iudsDlb/tbb7q2zT8sJ5H4mOvwIrRUKtlLy34phPrl5QU8bItBz+igoGaVi5hlYhRXmWemMpEukUGLQI6Ui3K7Ma58oYY5JGNCcxt32czbtN0FeYqO9ecTU1V+Q2Lagg6gtsQQvTmxbjogsfkGxoEWjG+8yVa/K3OSwh4Galb5ad6GeEy5HDLXDz54vX1dNsIFCCksOJUDojsNikeK552tVmxpv9yC7bL9lY8Kh2BG9FX8UvDgv/KaFWHBYgyUB/hWk5TvQiNGJeQDZtuu5KCnH3HrdMpKVq4nWpPmUk9tGZXMbCcW0HaLQMxJOxPw23CPGt0v3SGfxFkIARHEOdowCriP9oug24m/NVjXAH83Z8K/socPkWNvlNTq4lznHmXE1Kf4ZDg7ltt82/G6WZ88Q3r/AKXS2L5jUtLjXfs9aEjVPpDGYbiAasd+R4ymvI6HuKyGyBftMuOI+QWnyzKjsgqmN/wlhxDiB2ijmwC0n83z0KlZDGVoYKAClBsOFPJRTVm3GyeliF/+kwn8v1S+ENev7It7v7LB+n5ndCtFGX0+lalAVWxrFnF74I0aaVrxoT9fFJlzFj53vf8AmcT3E28qLa5MruryajRQM+OyjihpsdkpRL2GgWly7RYhoVmhPsjpOJqlUFyMlnXK6cUqdiPcdEVBjJPmuiYbk+y6U72lkTAmDQf24naZyv2mdQfIhByUbtK64/AbFl4gcLsaXtPBzR9RUFefsdlcD6BUspNnl4egwBnli3hcHv4Kb2bnbZTt68UB7PzQe0t5IURDCiknj6HmmB6PKxco1205pXOyfvHl3rghpTEw8ao6BF256rW/GkRQ8JJsCERCwBp+J3mioJ71M1w23Wn/AALv9Av9n21GV9DzOvJGQpIjnTz7lKam/qigik67/TkU0CjZewvr6ugsSi2pyXcKYNOdPmh39p4ppWvhsnhWYkcrQzcAA9Uk9pZv3cs+mrhlH+Vvumc5FzPPAegq37YOrALtQ1zR31qfIoZdNO1YgKUIOXjNNg6/MfVGFpG3euTTockqCN8JUhKijmxQYqc6yxRRDbvW00jLFAcjpa5S+FZFyjrq2KdNQO13KcIUu7SmBTA7itzNc38zXDxBC89LagHkr3EnobPie0U5qmODavy3bmND+mtvop5/psY7wyZdCdrppzB4p5Hf75tdHCnf0VczXCZyUUaFaZNYyTxF0OIWOqNvNW6Sn8wFKerJDO4Y2M3g4bpTLzUSA/JEqL2OxvqCjoNvUpWKDuD3+aPESg2Jpf8AbkqlheLtcBceP7WTZs80jWp9WqqSEt5PIE03U6fVcTMUG/yVfdPgGn2XTZ4EWB6ndEDAvFQK2t4kX+a7EagLvPgl0KYDjRvj9ESWk0bsNfsmBHUuq42H02QmOy4Ms5h1ylx62P0TaGypp+EXd02HUmnmg8Th5mO/VYcgd/mhRkeS4o/I4ZbcP53UMnizw4Amv1U2LvcXltPhJb4JRMQ6XGynqXg83Iu0vGhxQKUDuBt4FczMg6hDbngbH7JDg7xEc0E0G54U1V4GQMFQa8a3HPwUfW70puKLOSkRgOZjhf8AKVivjGuaKi7T5VvQ8Ctoy6baswXppJyrzfKabK0YbgUOXbUgOPEgeSBmp0uJEMeCf+pJdkc9NOboKEKqT2MRySC8kcP4V3mJA5SXalef44Mr6boYS28m3JAMeZLjqUzwuL/bpzokqY4U/wCJvf8ARV8mM9OE8crcjGI00qpIRNQQe7mjYMEFuihfBObko4qU7kJmopwCZOlmRAQ5oIPEfLmq+yo+EkEBPZKMXNFqFWidDQMGDT2CQOqZQZJ9Ke8HK31TOWl7dFKWNHAJtEJI0nF1zMPdQ+S3CkXF1HP7hUfPZNXuZcVH15XQ8eKBoad6wjpWEIYsiWPvlbck6bpXJykaIbacb0Hfon+HyjIQoDmebF30FfmtGS+6DRl31cfoPIJRirsxDe+nAaD1yTeZdQEm/PifsqrihiuJa0Ur2jEOprajeAHzqhRig+0uFxHRYkWCS8Zu0B8QdS5AGo6KvsmiLOFetivToWFmG0g3JuePq6Q41gjHgmmV/wCbj1CX2nVHV+KnLTbWPzAGh1bxG9OavH9awhrhoam1gWkUFl5/My5Y4tOyYYZihZRrvhAOU0rSuo6fJHPHc3Gl/V2biWWw19fwsVdgTg1zVrpusXParp6DPzz478kOoCOkMOEMc9yucNlBDAA13PFGzkfL2Rd9NOHAlWwxuXNSyuiHG4+UEAVcbAC5XlmMy7hEJcbleqYyYUvDdEiv7Z3J34ALyfE5kxohcBY6D9lW4+pZdgiRsp5B3b6grl8uW3dZagPo9tOK11YPV5XXBnVAFU1/pBsKetVVcOikOA5q6yVHUvrTquXHhXIK+RIvTlQ89Ebh4JpQI18K1NfuppGGGA2vX91aVOwbDhO3IaNrX8FjcMhE1c5xPUC3chYUQFxJNSdxXbYI+WDaW04fMVT7Lpy3CpcfgJ6vdr3FTQZOC01EJtRxv/5Wqp3EbcPDmo23ubDbnyH3RBM55NvtTvXQo3Q1O54cgog872FbAcOu5UjogZrd2w+p5IbHSHECQNKuOjeXE9UtgYW6piRH5jU2vT90XEJLsxO/eppmNQAFKacEeI1DhxHnySqeo65qKeabT96nwHrdKpiXoL6G6jnVMYqWMyrTex+aRTkuBQDUC/VWqfhhzqNHw3PzA6pK+WpEa0nVyGGdhrjNC5GLCYRDc0Z6WJuKUqRyKxBY4aFuWzta78FieeOZTZbbOHrLo2c5IeoFXO2YOfE8AlGK47Dlqth9t+7ifxc9+5IJzGiP/ayfHtvFy92hJPBMMMwuFAb7+Oc7gK30B5Dc7K3tMZqdo632BlvZ6NOO9/MuLWDd2tODW7Ju7DIDGlkBgA3dq404k6ruNMxI+Vzhkhj4YYIHe47nkmhlmsgl9LbDieA5VUucqfqPIMbaTGeaWBoOgQ8vCq4DvT7FZY5y40S2TbcuO6P/AKcG9REs6jgRsrbhMzUKqmFRMsNikabKMpqv8sK0O3BTTMpUWrppVA4TM270/h3Gm1P4VseYnSOXY4G/HxTWGw0rrVSOk+FKerrsuyjgmk0Vggbk93TitOhVOYkCm5Nhy+aCdiFzlbm5u08Bc+KjY10QgvJd5AdALBC5wZhR7p7aEKnTORb/ABafmVkKHS5JJNySdT1WQYCinZlkIcTwqNUN/aOvkZPxgzLmI1pTep0oFBM4i14tp030KRxJ0xIxNbNHcDpTlQIf+qAc4MJJrfcU58FO5/DTE2m49tvuk8N8SMXNb8LbF9LA/lbxd8l1OQ4xjtgRGOY0tqHi7X6dkPHwnzTOZhNgtDWgNHAaDjzuhZaZXMQb7ttKaePMlIJh1Y8MaW8uSf424RK0BA8D3KtzjqTLAKUoKd4S4zk2wuOfGBwb+6xEYzApGe2ulPHKFitjlqQtnK8QJSDIQRUViOsB+JzuXLmgZUOiPzxDUk1yjRp5cTzUcSIYrnTEY0FaMbuG/lHWys2B4eMoLmAOcbNP4RtX5pJvK6heMZutychn03rblvVA4zPZuyA7KBTkmmMYk2E0w2fGRcjb1dVqPEJ1KfPL1nrC4zfJbPgO7IbtqbUSVkClqbp9EfY9ClkK/wBeNeCh8VdslwRQeC7lmFpoVI11KKVhBIrZaVjnDo1KDmDVWmSmVSYLwSQNlYMOmh0VMcy2LG+KPW6VYjNVqAafU8CtTsaosd70/dIJye2zCleu+ibLPgsxOYBJqd9uvFMHzcOEKvdTlue5VA4064Zb9SHdNAUc8kk7alS9pD62sEzjr3mkPst470SmPHqcrTcfFEP4eTRu5DQfeRPhY410a0H/ALOsAEfL4HFdQPc2GDsBmd5W8ytu0dSIJGWMfMxhLYUOmY6kn8oP5jueaYQDDETKGhrG3oPWvNNHy7JeCYcMUa3fUucdSTuSUnlpctoSKlxrfWm2vimuOiy7OJmhDTfT9/KyWz0xnbU3B2+qPxQ+IBHO/wDCVx4BLQBppTeqa3UCK9NxS45RYG2+n0Vfk3e8m2cDFbQcgfsFasThCHDJ3IPdVVLArTcLlECXxzs96Psaw8ujPeNC5YrLiEnVteJWJbtthvZ+A18Ql4rkY0troCTrTRWSPFLQSDQ8fFYsVvAl5O1XjOJcSboWMVixRy7p8ekNLHogYIuf9xWLEDOwbhS1+SxYgyWEbdUwlnmyxYsyTE47rXOiSxjenL6rFiNCOq0bUJt7OS7XAvc0F2Zwqb7bV0WLEk7NTyTdoNrIw6d6xYr49ErWJCpYNjEdUdBZBTP/AMgDb+FixHIInxXRp9fCStthjLpxWLFsmise1g7JVMwQf32ncOB78wW1iGHVPHq2oPcsWLECv//Z\"}],\"classes\":[],\"children\":[],\"nodeType\":\"img\",\"styling\":[],\"text\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[{\"A1\":\"text-align\",\"A2\":\"center\"}]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"C\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":\"https://en.wikipedia.org/wiki/Cicero\"}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":\"https://en.wikipedia.org/wiki/Cicero\"}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":\"https://en.wikipedia.org/wiki/Cicero\"}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":\"https://en.wikipedia.org/wiki/Cicero\"}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":\"https://en.wikipedia.org/wiki/Cicero\"}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":\"https://en.wikipedia.org/wiki/Cicero\"}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"&\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[{\"A1\":\"text-align\",\"A2\":\"center\"}]}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"<\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"v\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"g\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"g\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\">\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[\"Code\"],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"v\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"-\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"k\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"w\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"k\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[\"Code\"],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"<\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"k\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\">\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[\"Code\"],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[\"Code\"],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"<\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"/\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"g\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"k\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\">\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[\"Code\"],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"<\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"/\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"g\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\">\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[\"Code\"],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[]}}]\n';
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $author$project$Rte$Embedded = function (a) {
	return {$: 'Embedded', a: a};
};
var $author$project$Rte$Character = F6(
	function (_char, fontStyle, highlightClasses, highlightStyling, id, link) {
		return {_char: _char, fontStyle: fontStyle, highlightClasses: highlightClasses, highlightStyling: highlightStyling, id: id, link: link};
	});
var $author$project$Rte$FontStyle = F4(
	function (classes, fontFamily, fontSize, styling) {
		return {classes: classes, fontFamily: fontFamily, fontSize: fontSize, styling: styling};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Rte$decodeTuple_String_String_ = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a1, a2) {
			return _Utils_Tuple2(a1, a2);
		}),
	A2($elm$json$Json$Decode$field, 'A1', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'A2', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Rte$decodeStyleTags = $elm$json$Json$Decode$list($author$project$Rte$decodeTuple_String_String_);
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$Rte$decodeFontStyle = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Rte$FontStyle,
	A2(
		$elm$json$Json$Decode$field,
		'classes',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'fontFamily',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'fontSize',
		$elm$json$Json$Decode$maybe($elm$json$Json$Decode$float)),
	A2($elm$json$Json$Decode$field, 'styling', $author$project$Rte$decodeStyleTags));
var $elm$json$Json$Decode$map6 = _Json_map6;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Rte$decodeCharacter = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Rte$Character,
	A2($elm$json$Json$Decode$field, 'char', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'fontStyle', $author$project$Rte$decodeFontStyle),
	$elm$json$Json$Decode$succeed(_List_Nil),
	$elm$json$Json$Decode$succeed(_List_Nil),
	$elm$json$Json$Decode$succeed(-1),
	A2(
		$elm$json$Json$Decode$field,
		'link',
		$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)));
var $author$project$Rte$Child = function (a) {
	return {$: 'Child', a: a};
};
var $author$project$Rte$EmbeddedHtml = F9(
	function (attributes, classes, children, highlightClasses, highlightStyling, id, nodeType, styling, text) {
		return {attributes: attributes, children: children, classes: classes, highlightClasses: highlightClasses, highlightStyling: highlightStyling, id: id, nodeType: nodeType, styling: styling, text: text};
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded = A2($elm$core$Basics$composeR, $elm$json$Json$Decode$succeed, $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom);
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
function $author$project$Rte$cyclic$decodeEmbeddedHtml() {
	var h = F2(
		function (x, ys) {
			h:
			while (true) {
				if (x.$ === 'Err') {
					var err = x.a;
					return $elm$core$Result$Err(err);
				} else {
					var xs = x.a;
					if (!ys.b) {
						return x;
					} else {
						var y = ys.a;
						var rest = ys.b;
						var _v2 = A2(
							$elm$json$Json$Decode$decodeString,
							$author$project$Rte$cyclic$decodeEmbeddedHtml(),
							y);
						if (_v2.$ === 'Ok') {
							var result = _v2.a;
							var $temp$x = $elm$core$Result$Ok(
								A2($elm$core$List$cons, result, xs)),
								$temp$ys = rest;
							x = $temp$x;
							ys = $temp$ys;
							continue h;
						} else {
							var err = _v2.a;
							return $elm$core$Result$Err(err);
						}
					}
				}
			}
		});
	var i = function (_v4) {
		var x = _v4.a;
		var ys = _v4.b;
		var _v3 = A2(
			h,
			$elm$core$Result$Ok(_List_Nil),
			ys);
		if (_v3.$ === 'Ok') {
			var children = _v3.a;
			return $elm$json$Json$Decode$succeed(
				_Utils_update(
					x,
					{
						children: A2($elm$core$List$map, $author$project$Rte$Child, children)
					}));
		} else {
			var err = _v3.a;
			return $elm$json$Json$Decode$fail(
				$elm$json$Json$Decode$errorToString(err));
		}
	};
	var f = A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'text',
		$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'styling',
			$author$project$Rte$decodeStyleTags,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'nodeType',
				$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string),
				A2(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
					-1,
					A2(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
						_List_Nil,
						A2(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
							_List_Nil,
							A2(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded,
								_List_Nil,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'classes',
									$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'attributes',
										$elm$json$Json$Decode$list($author$project$Rte$decodeTuple_String_String_),
										$elm$json$Json$Decode$succeed($author$project$Rte$EmbeddedHtml))))))))));
	var g = A3(
		$elm$json$Json$Decode$map2,
		$elm$core$Tuple$pair,
		f,
		A2(
			$elm$json$Json$Decode$field,
			'children',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
	return A2($elm$json$Json$Decode$andThen, i, g);
}
try {
	var $author$project$Rte$decodeEmbeddedHtml = $author$project$Rte$cyclic$decodeEmbeddedHtml();
	$author$project$Rte$cyclic$decodeEmbeddedHtml = function () {
		return $author$project$Rte$decodeEmbeddedHtml;
	};
} catch ($) {
	throw 'Some top-level definitions from `Rte` are causing infinite recursion:\n\n  ┌─────┐\n  │    decodeEmbeddedHtml\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $author$project$Rte$LineBreak = F8(
	function (classes, highlightClasses, highlightIndent, highlightStyling, id, indent, nodeType, styling) {
		return {classes: classes, highlightClasses: highlightClasses, highlightIndent: highlightIndent, highlightStyling: highlightStyling, id: id, indent: indent, nodeType: nodeType, styling: styling};
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map8 = _Json_map8;
var $author$project$Rte$decodeLineBreak = A9(
	$elm$json$Json$Decode$map8,
	$author$project$Rte$LineBreak,
	A2(
		$elm$json$Json$Decode$field,
		'classes',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	$elm$json$Json$Decode$succeed(_List_Nil),
	$elm$json$Json$Decode$succeed(0),
	$elm$json$Json$Decode$succeed(_List_Nil),
	$elm$json$Json$Decode$succeed(-1),
	A2($elm$json$Json$Decode$field, 'indent', $elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$field,
		'nodeType',
		$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'styling', $author$project$Rte$decodeStyleTags));
var $author$project$Rte$decodeElementHelp = function (constructor) {
	switch (constructor) {
		case 'Break':
			return A2(
				$elm$json$Json$Decode$map,
				$author$project$Rte$Break,
				A2($elm$json$Json$Decode$field, 'A1', $author$project$Rte$decodeLineBreak));
		case 'Char':
			return A2(
				$elm$json$Json$Decode$map,
				$author$project$Rte$Char,
				A2($elm$json$Json$Decode$field, 'A1', $author$project$Rte$decodeCharacter));
		case 'Embedded':
			return A2(
				$elm$json$Json$Decode$map,
				$author$project$Rte$Embedded,
				A2($elm$json$Json$Decode$field, 'A1', $author$project$Rte$decodeEmbeddedHtml));
		default:
			var other = constructor;
			return $elm$json$Json$Decode$fail('Unknown constructor for type Element: ' + other);
	}
};
var $author$project$Rte$decodeElement = A2(
	$elm$json$Json$Decode$andThen,
	$author$project$Rte$decodeElementHelp,
	A2($elm$json$Json$Decode$field, 'Constructor', $elm$json$Json$Decode$string));
var $author$project$Rte$decodeContent = $elm$json$Json$Decode$list($author$project$Rte$decodeElement);
var $author$project$Rte$decode = function (x) {
	var _v0 = A2($elm$json$Json$Decode$decodeString, $author$project$Rte$decodeContent, x);
	if (_v0.$ === 'Ok') {
		var content = _v0.a;
		return $elm$core$Maybe$Just(content);
	} else {
		var err = _v0.a;
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Rte$Idle = {$: 'Idle'};
var $author$project$Rte$NoDrag = {$: 'NoDrag'};
var $author$project$Rte$defaultLineBreak = function (id) {
	return {classes: _List_Nil, highlightClasses: _List_Nil, highlightIndent: 0, highlightStyling: _List_Nil, id: id, indent: 0, nodeType: $elm$core$Maybe$Nothing, styling: _List_Nil};
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Rte$defaultSelectionStyle = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'background', 'hsl(217, 71%, 53%)'),
		A2($elm$html$Html$Attributes$style, 'color', 'white')
	]);
var $elm_community$intdict$IntDict$Empty = {$: 'Empty'};
var $elm_community$intdict$IntDict$empty = $elm_community$intdict$IntDict$Empty;
var $author$project$Rte$emptyFontStyle = {classes: _List_Nil, fontFamily: _List_Nil, fontSize: $elm$core$Maybe$Nothing, styling: _List_Nil};
var $author$project$Rte$null = {height: 0, width: 0, x: 0, y: 0};
var $author$project$Rte$init1 = function (editorID) {
	return {
		active: true,
		box: $author$project$Rte$null,
		clipboard: $elm$core$Maybe$Nothing,
		content: _List_fromArray(
			[
				$author$project$Rte$Break(
				$author$project$Rte$defaultLineBreak(0))
			]),
		ctrlDown: false,
		cursor: 0,
		cursorScreen: $author$project$Rte$null,
		cursorThrottled: false,
		cursorVisible: false,
		drag: $author$project$Rte$NoDrag,
		editorID: editorID,
		fontSizeUnit: $elm$core$Maybe$Nothing,
		fontStyle: $author$project$Rte$emptyFontStyle,
		highlighter: $elm$core$Maybe$Nothing,
		idCounter: 1,
		indentUnit: $elm$core$Maybe$Nothing,
		lastKeyDown: -1,
		lastMouseDown: -1,
		locateBacklog: 0,
		located: $elm_community$intdict$IntDict$empty,
		locating: $author$project$Rte$Idle,
		nextCursorScreen: $elm$core$Maybe$Nothing,
		selection: $elm$core$Maybe$Nothing,
		selectionStyle: $author$project$Rte$defaultSelectionStyle,
		sentry: 0,
		shiftDown: false,
		textContent: '',
		typing: false,
		undo: _List_Nil,
		viewport: {
			scene: {height: 0, width: 0},
			viewport: $author$project$Rte$null
		}
	};
};
var $author$project$Rte$NoOp = {$: 'NoOp'};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2(
					$elm$core$Task$onError,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Err),
					A2(
						$elm$core$Task$andThen,
						A2(
							$elm$core$Basics$composeL,
							A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
							$elm$core$Result$Ok),
						task))));
	});
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $author$project$Rte$focusOnEditor = function (editorID) {
	return A2(
		$elm$core$Task$attempt,
		function (_v0) {
			return $author$project$Rte$NoOp;
		},
		$elm$browser$Browser$Dom$focus(editorID));
};
var $author$project$Rte$initCmd = function (editorID) {
	return $author$project$Rte$focusOnEditor(editorID);
};
var $author$project$Rte$init = function (editorID) {
	return _Utils_Tuple2(
		$author$project$Rte$init1(editorID),
		$author$project$Rte$initCmd(editorID));
};
var $author$project$Rte$addIds = function (content) {
	var maxIdx = $elm$core$List$length(content) - 1;
	var f = F2(
		function (idx, elem) {
			switch (elem.$) {
				case 'Break':
					var br = elem.a;
					return $author$project$Rte$Break(
						_Utils_update(
							br,
							{id: idx}));
				case 'Char':
					var _char = elem.a;
					return $author$project$Rte$Char(
						_Utils_update(
							_char,
							{id: idx}));
				default:
					var html = elem.a;
					return $author$project$Rte$Embedded(
						_Utils_update(
							html,
							{id: idx}));
			}
		});
	var g = F2(
		function (elem, _v0) {
			var idx = _v0.a;
			var xs = _v0.b;
			return _Utils_Tuple2(
				idx - 1,
				A2(
					$elm$core$List$cons,
					A2(f, idx, elem),
					xs));
		});
	return A3(
		$elm$core$List$foldr,
		g,
		_Utils_Tuple2(maxIdx, _List_Nil),
		content).b;
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$Rte$init3 = F3(
	function (editorID, highlighter, selectionStyle) {
		var i = $author$project$Rte$init1(editorID);
		return _Utils_update(
			i,
			{highlighter: highlighter, selectionStyle: selectionStyle});
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Char$fromCode = _Char_fromCode;
var $author$project$Rte$zeroWidthSpace = $elm$core$String$fromChar(
	$elm$core$Char$fromCode(8203));
var $author$project$Rte$toText = function (content) {
	var f = function (x) {
		switch (x.$) {
			case 'Break':
				return '\n';
			case 'Char':
				var ch = x.a;
				return ch._char;
			default:
				var html = x.a;
				return $author$project$Rte$zeroWidthSpace;
		}
	};
	var g = F2(
		function (x, y) {
			return _Utils_ap(
				y,
				f(x));
		});
	return A3($elm$core$List$foldl, g, '', content);
};
var $author$project$Rte$snapshot = function (editor) {
	return {content: editor.content, cursor: editor.cursor, fontStyle: editor.fontStyle, selection: editor.selection};
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Rte$undoMaxDepth = 10;
var $author$project$Rte$undoAddNew = function (e) {
	var clip = function (xs) {
		return A2($elm$core$List$take, $author$project$Rte$undoMaxDepth, xs);
	};
	return _Utils_update(
		e,
		{
			undo: clip(
				A2(
					$elm$core$List$cons,
					$author$project$Rte$snapshot(e),
					e.undo))
		});
};
var $author$project$Rte$loadContent = F2(
	function (raw, e) {
		var i = A3($author$project$Rte$init3, e.editorID, e.highlighter, e.selectionStyle);
		var content = function () {
			var _v0 = A2(
				$elm$core$List$drop,
				$elm$core$List$length(raw) - 1,
				raw);
			if (_v0.b && (_v0.a.$ === 'Break')) {
				return raw;
			} else {
				return _Utils_ap(
					raw,
					_List_fromArray(
						[
							$author$project$Rte$Break(
							$author$project$Rte$defaultLineBreak(0))
						]));
			}
		}();
		return $author$project$Rte$undoAddNew(
			_Utils_update(
				i,
				{
					active: e.active,
					content: $author$project$Rte$addIds(content),
					idCounter: $elm$core$List$length(content),
					textContent: $author$project$Rte$toText(content)
				}));
	});
var $author$project$Rte$initWithContent = F2(
	function (content, id) {
		return _Utils_Tuple2(
			A2(
				$author$project$Rte$loadContent,
				content,
				$author$project$Rte$init1(id)),
			$author$project$Rte$initCmd(id));
	});
var $author$project$Rte$initWith = F2(
	function (encodedContent, id) {
		var _v0 = $author$project$Rte$decode(encodedContent);
		if (_v0.$ === 'Just') {
			var content = _v0.a;
			return A2($author$project$Rte$initWithContent, content, id);
		} else {
			return $author$project$Rte$init(id);
		}
	});
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Main$init = function (_v0) {
	var _v1 = A2($author$project$Rte$initWith, $author$project$Sample$content, 'MyRTE');
	var rte = _v1.a;
	var rteCmd = _v1.b;
	return _Utils_Tuple2(
		{
			inputBox: $elm$core$Maybe$Nothing,
			rte: _Utils_update(
				rte,
				{
					highlighter: $elm$core$Maybe$Just($author$project$Highlight$code)
				})
		},
		A2($elm$core$Platform$Cmd$map, $author$project$Main$Internal, rteCmd));
};
var $elm$core$Platform$Sub$map = _Platform_map;
var $author$project$Rte$Blink = function (a) {
	return {$: 'Blink', a: a};
};
var $author$project$Rte$DetectViewport = {$: 'DetectViewport'};
var $author$project$Rte$KeyDown = F2(
	function (a, b) {
		return {$: 'KeyDown', a: a, b: b};
	});
var $author$project$Rte$KeyUp = function (a) {
	return {$: 'KeyUp', a: a};
};
var $author$project$Rte$MouseMove = F2(
	function (a, b) {
		return {$: 'MouseMove', a: a, b: b};
	});
var $author$project$Rte$MouseUp = {$: 'MouseUp'};
var $author$project$Rte$Paste = function (a) {
	return {$: 'Paste', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$Rte$clipboardText = _Platform_incomingPort('clipboardText', $elm$json$Json$Decode$string);
var $author$project$Rte$decodeKey = function (f) {
	return A2(
		$elm$json$Json$Decode$map,
		f,
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
};
var $author$project$Rte$decodeKeyAndTime = function (f) {
	return A3(
		$elm$json$Json$Decode$map2,
		f,
		A2($elm$json$Json$Decode$field, 'timeStamp', $elm$json$Json$Decode$float),
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
};
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $author$project$Rte$decodeTargetIdAndTime = function (f) {
	return A3(
		$elm$json$Json$Decode$map2,
		f,
		$elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$json$Json$Decode$at,
					_List_fromArray(
						['target', 'id']),
					$elm$json$Json$Decode$string),
					$elm$json$Json$Decode$succeed('')
				])),
		A2($elm$json$Json$Decode$field, 'timeStamp', $elm$json$Json$Decode$float));
};
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 'Every', a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {processes: processes, taggers: taggers};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 'Nothing') {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$time$Time$Name = function (a) {
	return {$: 'Name', a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.processes;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(_Utils_Tuple0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.taggers);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $elm$browser$Browser$Events$Document = {$: 'Document'};
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 'MySub', a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {pids: pids, subs: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (node.$ === 'Document') {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {event: event, key: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (node.$ === 'Document') {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.pids,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.key;
		var event = _v0.event;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.subs);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keydown');
var $elm$browser$Browser$Events$onKeyUp = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'keyup');
var $elm$browser$Browser$Events$onMouseMove = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'mousemove');
var $elm$browser$Browser$Events$onMouseUp = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'mouseup');
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $author$project$Rte$tickPeriod = 500;
var $author$project$Rte$subscriptions = function (e) {
	var mouseMove = $elm$browser$Browser$Events$onMouseMove(
		$author$project$Rte$decodeTargetIdAndTime($author$project$Rte$MouseMove));
	var detectViewport = (!e.typing) ? A2(
		$elm$time$Time$every,
		$author$project$Rte$tickPeriod / 5,
		function (_v1) {
			return $author$project$Rte$DetectViewport;
		}) : $elm$core$Platform$Sub$none;
	var cursorBlink = A2(
		$elm$time$Time$every,
		$author$project$Rte$tickPeriod,
		function (x) {
			return $author$project$Rte$Blink(
				$elm$time$Time$posixToMillis(x));
		});
	var _default = _List_fromArray(
		[
			$elm$browser$Browser$Events$onKeyDown(
			$author$project$Rte$decodeKeyAndTime($author$project$Rte$KeyDown)),
			$elm$browser$Browser$Events$onKeyUp(
			$author$project$Rte$decodeKey($author$project$Rte$KeyUp)),
			$elm$browser$Browser$Events$onMouseUp(
			$elm$json$Json$Decode$succeed($author$project$Rte$MouseUp)),
			$author$project$Rte$clipboardText(
			function (x) {
				return $author$project$Rte$Paste(
					$elm$core$Maybe$Just(x));
			}),
			cursorBlink,
			detectViewport
		]);
	if (e.active) {
		var _v0 = e.drag;
		if (_v0.$ === 'NoDrag') {
			return $elm$core$Platform$Sub$batch(_default);
		} else {
			return $elm$core$Platform$Sub$batch(
				A2($elm$core$List$cons, mouseMove, _default));
		}
	} else {
		return $elm$core$Platform$Sub$none;
	}
};
var $author$project$Main$subscriptions = function (model) {
	return A2(
		$elm$core$Platform$Sub$map,
		$author$project$Main$Internal,
		$author$project$Rte$subscriptions(model.rte));
};
var $author$project$Main$ImageInputBox = function (a) {
	return {$: 'ImageInputBox', a: a};
};
var $author$project$Main$LinkInputBox = function (a) {
	return {$: 'LinkInputBox', a: a};
};
var $author$project$Main$NoOp = {$: 'NoOp'};
var $author$project$Rte$activate = function (e) {
	return _Utils_update(
		e,
		{active: true});
};
var $author$project$Rte$ScrollIfNeeded = {$: 'ScrollIfNeeded'};
var $author$project$Rte$idSet = F2(
	function (id, elem) {
		switch (elem.$) {
			case 'Break':
				var br = elem.a;
				return $author$project$Rte$Break(
					_Utils_update(
						br,
						{id: id}));
			case 'Char':
				var ch = elem.a;
				return $author$project$Rte$Char(
					_Utils_update(
						ch,
						{id: id}));
			default:
				var html = elem.a;
				return $author$project$Rte$Embedded(
					_Utils_update(
						html,
						{id: id}));
		}
	});
var $author$project$Rte$PlaceCursor1_EditorPos = F2(
	function (a, b) {
		return {$: 'PlaceCursor1_EditorPos', a: a, b: b};
	});
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $author$project$Rte$placeCursor = F2(
	function (scroll, editorID) {
		return A2(
			$elm$core$Task$attempt,
			$author$project$Rte$PlaceCursor1_EditorPos(scroll),
			$elm$browser$Browser$Dom$getElement(editorID));
	});
var $author$project$Rte$pasteContent = F2(
	function (copied, e) {
		var i = function (x) {
			return _Utils_eq(x, _List_Nil) ? _List_fromArray(
				[
					$author$project$Rte$Break(
					$author$project$Rte$defaultLineBreak(0))
				]) : x;
		};
		var f = F2(
			function (_v0, input) {
				f:
				while (true) {
					var id = _v0.a;
					var output = _v0.b;
					if (!input.b) {
						return $elm$core$List$reverse(output);
					} else {
						var x = input.a;
						var rest = input.b;
						var $temp$_v0 = _Utils_Tuple2(
							id + 1,
							A2(
								$elm$core$List$cons,
								A2($author$project$Rte$idSet, id, x),
								output)),
							$temp$input = rest;
						_v0 = $temp$_v0;
						input = $temp$input;
						continue f;
					}
				}
			});
		var g = function (xs) {
			return A2(
				f,
				_Utils_Tuple2(e.idCounter, _List_Nil),
				xs);
		};
		var h = F3(
			function (x, y, z) {
				return _Utils_ap(
					A2($elm$core$List$take, x, y),
					_Utils_ap(
						g(copied),
						A2($elm$core$List$drop, z, y)));
			});
		var j = F3(
			function (x, y, z) {
				return i(
					A3(h, x, y, z));
			});
		var _v2 = e.selection;
		if (_v2.$ === 'Nothing') {
			return _Utils_Tuple2(
				_Utils_update(
					e,
					{
						content: A3(j, e.cursor, e.content, e.cursor),
						cursor: e.cursor + $elm$core$List$length(copied),
						idCounter: e.idCounter + $elm$core$List$length(copied),
						textContent: _Utils_ap(
							A2($elm$core$String$left, e.cursor, e.textContent),
							_Utils_ap(
								$author$project$Rte$toText(copied),
								A2($elm$core$String$dropLeft, e.cursor, e.textContent)))
					}),
				A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
		} else {
			var _v3 = _v2.a;
			var beg = _v3.a;
			var end = _v3.b;
			return _Utils_Tuple2(
				_Utils_update(
					e,
					{
						content: A3(j, beg, e.content, end + 1),
						cursor: beg + $elm$core$List$length(copied),
						idCounter: e.idCounter + $elm$core$List$length(copied),
						selection: $elm$core$Maybe$Nothing,
						textContent: _Utils_ap(
							A2($elm$core$String$left, beg, e.textContent),
							_Utils_ap(
								$author$project$Rte$toText(copied),
								A2($elm$core$String$dropLeft, end + 1, e.textContent)))
					}),
				A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
		}
	});
var $author$project$Rte$addContent = F2(
	function (content, e) {
		return A2($author$project$Rte$pasteContent, content, e);
	});
var $author$project$Rte$NoScroll = {$: 'NoScroll'};
var $author$project$Rte$embed = F2(
	function (html, e) {
		var elem = $author$project$Rte$Embedded(
			_Utils_update(
				html,
				{id: e.idCounter}));
		return _Utils_Tuple2(
			_Utils_update(
				e,
				{
					content: _Utils_ap(
						A2($elm$core$List$take, e.cursor, e.content),
						_Utils_ap(
							_List_fromArray(
								[elem]),
							A2($elm$core$List$drop, e.cursor, e.content))),
					cursor: e.cursor + 1,
					idCounter: e.idCounter + 1,
					textContent: A2($elm$core$String$left, e.cursor, e.textContent) + ('\n' + A2($elm$core$String$dropLeft, e.cursor, e.textContent))
				}),
			A2($author$project$Rte$placeCursor, $author$project$Rte$NoScroll, e.editorID));
	});
var $author$project$Rte$addImage = F2(
	function (src, e) {
		var imgNode = {
			attributes: _List_fromArray(
				[
					_Utils_Tuple2('src', src)
				]),
			children: _List_Nil,
			classes: _List_Nil,
			highlightClasses: _List_Nil,
			highlightStyling: _List_Nil,
			id: -1,
			nodeType: $elm$core$Maybe$Just('img'),
			styling: _List_Nil,
			text: $elm$core$Maybe$Nothing
		};
		return A2($author$project$Rte$embed, imgNode, e);
	});
var $author$project$Main$apply = F2(
	function (f, model) {
		var _v0 = f(model.rte);
		var rte = _v0.a;
		var rteCmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{rte: rte}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$Internal, rteCmd));
	});
var $author$project$Rte$get = F2(
	function (idx, content) {
		var _v0 = A2($elm$core$List$drop, idx, content);
		if (!_v0.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var x = _v0.a;
			return $elm$core$Maybe$Just(x);
		}
	});
var $author$project$Rte$nextBreakFrom = F2(
	function (begIdx, content) {
		var maxIdx = $elm$core$List$length(content) - 1;
		var f = F2(
			function (idx, result) {
				if (result.$ === 'Just') {
					return result;
				} else {
					var _v1 = A2($author$project$Rte$get, idx, content);
					if ((_v1.$ === 'Just') && (_v1.a.$ === 'Break')) {
						var br = _v1.a.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(idx, br));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}
			});
		return A3(
			$elm$core$List$foldl,
			f,
			$elm$core$Maybe$Nothing,
			A2($elm$core$List$range, begIdx, maxIdx));
	});
var $author$project$Rte$parasInSelection = function (e) {
	var f = F2(
		function (x, _v6) {
			var y = _v6.a;
			var zs = _v6.b;
			if (x.$ === 'Break') {
				var br = x.a;
				return _Utils_Tuple2(
					y + 1,
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(y, br),
						zs));
			} else {
				return _Utils_Tuple2(y + 1, zs);
			}
		});
	var g = F2(
		function (_v4, x) {
			var beg = _v4.a;
			var end = _v4.b;
			return A3(
				$elm$core$List$foldl,
				f,
				_Utils_Tuple2(beg, _List_Nil),
				A2(
					$elm$core$List$drop,
					beg,
					A2($elm$core$List$take, end + 1, e.content))).b;
		});
	var _v0 = e.selection;
	if (_v0.$ === 'Nothing') {
		var _v1 = A2($author$project$Rte$nextBreakFrom, e.cursor, e.content);
		if (_v1.$ === 'Just') {
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		} else {
			return _List_Nil;
		}
	} else {
		var _v2 = _v0.a;
		var beg = _v2.a;
		var end = _v2.b;
		var _v3 = A2($author$project$Rte$nextBreakFrom, end, e.content);
		if (_v3.$ === 'Just') {
			var x = _v3.a;
			return A2(
				$elm$core$List$cons,
				x,
				A2(
					g,
					_Utils_Tuple2(beg, end),
					e.content));
		} else {
			return A2(
				g,
				_Utils_Tuple2(beg, end),
				e.content);
		}
	}
};
var $author$project$Rte$set = F3(
	function (idx, elem, content) {
		return _Utils_ap(
			A2($elm$core$List$take, idx, content),
			_Utils_ap(
				_List_fromArray(
					[elem]),
				A2($elm$core$List$drop, idx + 1, content)));
	});
var $author$project$Rte$set2 = F3(
	function (idx, elem, editor) {
		var content = editor.content;
		return _Utils_update(
			editor,
			{
				content: A3($author$project$Rte$set, idx, elem, content)
			});
	});
var $author$project$Rte$setPara = F2(
	function (f, e) {
		var g = F2(
			function (_v0, x) {
				var idx = _v0.a;
				var lineBreak = _v0.b;
				return A3(
					$author$project$Rte$set2,
					idx,
					$author$project$Rte$Break(
						f(lineBreak)),
					x);
			});
		var h = F2(
			function (xs, y) {
				return A3($elm$core$List$foldr, g, y, xs);
			});
		return _Utils_Tuple2(
			A2(
				h,
				$author$project$Rte$parasInSelection(e),
				$author$project$Rte$undoAddNew(e)),
			A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
	});
var $author$project$Rte$changeIndent = F2(
	function (amount, editor) {
		var f = function (x) {
			return _Utils_update(
				x,
				{indent: amount + x.indent});
		};
		return A2($author$project$Rte$setPara, f, editor);
	});
var $author$project$Rte$linkAt = F2(
	function (idx, content) {
		var _v0 = A2($author$project$Rte$get, idx, content);
		if ((_v0.$ === 'Just') && (_v0.a.$ === 'Char')) {
			var ch = _v0.a.a;
			return ch.link;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Rte$currentLink = function (e) {
	var _v0 = A2($author$project$Rte$linkAt, e.cursor, e.content);
	if (_v0.$ === 'Just') {
		var x = _v0.a;
		return $elm$core$Maybe$Just(x);
	} else {
		return A2($author$project$Rte$linkAt, e.cursor - 1, e.content);
	}
};
var $author$project$Rte$unicode = function (code) {
	return _List_fromArray(
		[
			$author$project$Rte$Embedded(
			{
				attributes: _List_Nil,
				children: _List_Nil,
				classes: _List_Nil,
				highlightClasses: _List_Nil,
				highlightStyling: _List_Nil,
				id: -1,
				nodeType: $elm$core$Maybe$Nothing,
				styling: _List_Nil,
				text: $elm$core$Maybe$Just(
					$elm$core$String$fromChar(
						$elm$core$Char$fromCode(code)))
			})
		]);
};
var $author$project$Main$emoji = $author$project$Rte$unicode(128537);
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Rte$setFontStyle = F2(
	function (mod, e) {
		var j = function (x) {
			return _Utils_update(
				x,
				{
					fontStyle: mod(e.fontStyle)
				});
		};
		var f = function (elem) {
			if (elem.$ === 'Char') {
				var c = elem.a;
				return $author$project$Rte$Char(
					_Utils_update(
						c,
						{
							fontStyle: mod(c.fontStyle)
						}));
			} else {
				return elem;
			}
		};
		var g = F2(
			function (idx, content) {
				var _v4 = A2($author$project$Rte$get, idx, content);
				if (_v4.$ === 'Just') {
					var elem = _v4.a;
					return A3(
						$author$project$Rte$set,
						idx,
						f(elem),
						content);
				} else {
					return content;
				}
			});
		var h = F2(
			function (_v3, content) {
				var beg = _v3.a;
				var end = _v3.b;
				return A3(
					$elm$core$List$foldl,
					g,
					content,
					A2($elm$core$List$range, beg, end));
			});
		var i = F2(
			function (_v2, x) {
				var beg = _v2.a;
				var end = _v2.b;
				return _Utils_update(
					x,
					{
						content: A2(
							h,
							_Utils_Tuple2(beg, end),
							x.content)
					});
			});
		var _v0 = e.selection;
		if (_v0.$ === 'Nothing') {
			return _Utils_Tuple2(
				j(e),
				$elm$core$Platform$Cmd$none);
		} else {
			var _v1 = _v0.a;
			var beg = _v1.a;
			var end = _v1.b;
			return _Utils_Tuple2(
				j(
					A2(
						i,
						_Utils_Tuple2(beg, end),
						$author$project$Rte$undoAddNew(e))),
				A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
		}
	});
var $author$project$Rte$fontFamily = F2(
	function (xs, e) {
		var mod = function (x) {
			return _Utils_update(
				x,
				{fontFamily: xs});
		};
		return A2($author$project$Rte$setFontStyle, mod, e);
	});
var $author$project$Rte$fontSize = F2(
	function (_float, e) {
		var mod = function (x) {
			return _Utils_update(
				x,
				{
					fontSize: $elm$core$Maybe$Just(_float)
				});
		};
		return A2($author$project$Rte$setFontStyle, mod, e);
	});
var $author$project$Rte$inactivate = function (e) {
	return _Utils_update(
		e,
		{active: false});
};
var $author$project$Rte$changeContent2 = F3(
	function (f, idx, e) {
		var _v0 = A2($author$project$Rte$get, idx, e.content);
		if (_v0.$ === 'Nothing') {
			return e;
		} else {
			var elem = _v0.a;
			return A3(
				$author$project$Rte$set2,
				idx,
				f(elem),
				e);
		}
	});
var $author$project$Rte$currentLinkPos = function (e) {
	var g = F2(
		function (href, idx) {
			g:
			while (true) {
				if (_Utils_eq(
					A2($author$project$Rte$linkAt, idx + 1, e.content),
					$elm$core$Maybe$Just(href))) {
					var $temp$href = href,
						$temp$idx = idx + 1;
					href = $temp$href;
					idx = $temp$idx;
					continue g;
				} else {
					return idx;
				}
			}
		});
	var f = F2(
		function (href, idx) {
			f:
			while (true) {
				if (_Utils_eq(
					A2($author$project$Rte$linkAt, idx - 1, e.content),
					$elm$core$Maybe$Just(href))) {
					var $temp$href = href,
						$temp$idx = idx - 1;
					href = $temp$href;
					idx = $temp$idx;
					continue f;
				} else {
					return idx;
				}
			}
		});
	var end = function (href) {
		return A2(g, href, e.cursor);
	};
	var beg = function (href) {
		return A2(f, href, e.cursor);
	};
	var _v0 = $author$project$Rte$currentLink(e);
	if (_v0.$ === 'Just') {
		var href = _v0.a;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(
				beg(href),
				end(href)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Rte$linkMod = F2(
	function (f, editor) {
		var _v0 = $author$project$Rte$currentLinkPos(editor);
		if (_v0.$ === 'Nothing') {
			return editor;
		} else {
			var _v1 = _v0.a;
			var beg = _v1.a;
			var end = _v1.b;
			return A3(
				$elm$core$List$foldl,
				$author$project$Rte$changeContent2(f),
				editor,
				A2($elm$core$List$range, beg, end));
		}
	});
var $author$project$Rte$link = F2(
	function (href, e) {
		var f = function (elem) {
			if (elem.$ === 'Char') {
				var ch = elem.a;
				return $author$project$Rte$Char(
					_Utils_update(
						ch,
						{
							link: $elm$core$Maybe$Just(href)
						}));
			} else {
				return elem;
			}
		};
		var g = F2(
			function (idx, x) {
				return A3($author$project$Rte$changeContent2, f, idx, x);
			});
		var h = F2(
			function (beg, end) {
				return A3(
					$elm$core$List$foldl,
					g,
					e,
					A2($elm$core$List$range, beg, end));
			});
		var _v0 = e.selection;
		if (_v0.$ === 'Nothing') {
			return A2($author$project$Rte$linkMod, f, e);
		} else {
			var _v1 = _v0.a;
			var beg = _v1.a;
			var end = _v1.b;
			return A2(h, beg, end);
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Rte$textAlign = F2(
	function (alignment, e) {
		var style = function () {
			switch (alignment.$) {
				case 'Center':
					return 'center';
				case 'Justify':
					return 'justify';
				case 'Left':
					return 'left';
				default:
					return 'right';
			}
		}();
		var keep = function (_v0) {
			var x = _v0.a;
			var y = _v0.b;
			return x !== 'text-align';
		};
		var f = function (x) {
			return _Utils_update(
				x,
				{
					styling: A2(
						$elm$core$List$cons,
						_Utils_Tuple2('text-align', style),
						A2($elm$core$List$filter, keep, x.styling))
				});
		};
		return A2($author$project$Rte$setPara, f, e);
	});
var $author$project$Rte$boldStyle = _Utils_Tuple2('font-weight', 'bold');
var $author$project$Rte$is = F2(
	function (attr, editor) {
		return A2($elm$core$List$member, attr, editor.fontStyle.styling);
	});
var $author$project$Rte$isAt = F3(
	function (attr, e, idx) {
		var _v0 = A2($author$project$Rte$get, idx, e.content);
		if ((_v0.$ === 'Just') && (_v0.a.$ === 'Char')) {
			var c = _v0.a.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$member, attr, c.fontStyle.styling));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Rte$isSelection = F2(
	function (attr, e) {
		var _v0 = e.selection;
		if (_v0.$ === 'Nothing') {
			return true;
		} else {
			var _v1 = _v0.a;
			var beg = _v1.a;
			var end = _v1.b;
			return !A2(
				$elm$core$List$member,
				$elm$core$Maybe$Just(false),
				A2(
					$elm$core$List$map,
					A2($author$project$Rte$isAt, attr, e),
					A2($elm$core$List$range, beg, end)));
		}
	});
var $author$project$Rte$setFontStyleTag = F3(
	function (attr, bool, e) {
		var restOf = function (xs) {
			return A2(
				$elm$core$List$filter,
				function (x) {
					return !_Utils_eq(x, attr);
				},
				xs);
		};
		var mod = function (x) {
			return bool ? _Utils_update(
				x,
				{
					styling: A2(
						$elm$core$List$cons,
						attr,
						restOf(x.styling))
				}) : _Utils_update(
				x,
				{
					styling: restOf(x.styling)
				});
		};
		var _v0 = e.selection;
		if (_v0.$ === 'Just') {
			return A2($author$project$Rte$setFontStyle, mod, e);
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					e,
					{
						fontStyle: mod(e.fontStyle)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Rte$toggle = F2(
	function (attr, e) {
		var _v0 = e.selection;
		if (_v0.$ === 'Just') {
			return A3(
				$author$project$Rte$setFontStyleTag,
				attr,
				!A2($author$project$Rte$isSelection, attr, e),
				e);
		} else {
			return A3(
				$author$project$Rte$setFontStyleTag,
				attr,
				!A2($author$project$Rte$is, attr, e),
				e);
		}
	});
var $author$project$Rte$toggleBold = function (e) {
	return A2($author$project$Rte$toggle, $author$project$Rte$boldStyle, e);
};
var $author$project$Rte$italicStyle = _Utils_Tuple2('font-style', 'italic');
var $author$project$Rte$toggleItalic = function (e) {
	return A2($author$project$Rte$toggle, $author$project$Rte$italicStyle, e);
};
var $author$project$Rte$toggleNodeType = F2(
	function (nodeType, e) {
		var f = function (x) {
			return _Utils_eq(
				x.nodeType,
				$elm$core$Maybe$Just(nodeType)) ? _Utils_update(
				x,
				{nodeType: $elm$core$Maybe$Nothing}) : _Utils_update(
				x,
				{
					nodeType: $elm$core$Maybe$Just(nodeType)
				});
		};
		return A2($author$project$Rte$setPara, f, e);
	});
var $author$project$Rte$paraClassAdd = F2(
	function (className, br) {
		var filtered = function (xs) {
			return A2(
				$elm$core$List$filter,
				function (x) {
					return !_Utils_eq(x, className);
				},
				xs);
		};
		return _Utils_update(
			br,
			{
				classes: A2(
					$elm$core$List$cons,
					className,
					filtered(br.classes))
			});
	});
var $author$project$Rte$paraClassRemove = F2(
	function (className, br) {
		var filtered = function (xs) {
			return A2(
				$elm$core$List$filter,
				function (x) {
					return !_Utils_eq(x, className);
				},
				xs);
		};
		return _Utils_update(
			br,
			{
				classes: filtered(br.classes),
				highlightClasses: filtered(br.highlightClasses)
			});
	});
var $author$project$Rte$toggleParaClass = F2(
	function (className, e) {
		var f = function (x) {
			return A2($elm$core$List$member, className, x.classes) ? A2($author$project$Rte$paraClassRemove, className, x) : A2($author$project$Rte$paraClassAdd, className, x);
		};
		return A2($author$project$Rte$setPara, f, e);
	});
var $author$project$Rte$strikeThroughStyle = _Utils_Tuple2('text-decoration', 'line-through');
var $author$project$Rte$underlineStyle = _Utils_Tuple2('text-decoration', 'underline');
var $author$project$Rte$underline = F2(
	function (bool, editor) {
		return A3($author$project$Rte$setFontStyleTag, $author$project$Rte$underlineStyle, bool, editor);
	});
var $author$project$Rte$toggleStrikeThrough = function (e) {
	var removeUnderline = function (x) {
		return A2($author$project$Rte$is, $author$project$Rte$underlineStyle, x) ? A2($author$project$Rte$underline, false, x).a : x;
	};
	return A2(
		$author$project$Rte$toggle,
		$author$project$Rte$strikeThroughStyle,
		removeUnderline(e));
};
var $author$project$Rte$strikeThrough = F2(
	function (bool, editor) {
		return A3($author$project$Rte$setFontStyleTag, $author$project$Rte$strikeThroughStyle, bool, editor);
	});
var $author$project$Rte$toggleUnderline = function (e) {
	var removeStrikeThrough = function (x) {
		return A2($author$project$Rte$is, $author$project$Rte$strikeThroughStyle, x) ? A2($author$project$Rte$strikeThrough, false, x).a : x;
	};
	return A2(
		$author$project$Rte$toggle,
		$author$project$Rte$underlineStyle,
		removeStrikeThrough(e));
};
var $author$project$Rte$UndoAction = {$: 'UndoAction'};
var $author$project$Rte$Copy = {$: 'Copy'};
var $author$project$Rte$Cut = {$: 'Cut'};
var $author$project$Rte$Down = {$: 'Down'};
var $author$project$Rte$LineBoundary = F2(
	function (a, b) {
		return {$: 'LineBoundary', a: a, b: b};
	});
var $author$project$Rte$LineJump = F2(
	function (a, b) {
		return {$: 'LineJump', a: a, b: b};
	});
var $author$project$Rte$Mouse = F3(
	function (a, b, c) {
		return {$: 'Mouse', a: a, b: b, c: c};
	});
var $author$project$Rte$Page = F2(
	function (a, b) {
		return {$: 'Page', a: a, b: b};
	});
var $author$project$Rte$PlaceCursor2_Viewport = F2(
	function (a, b) {
		return {$: 'PlaceCursor2_Viewport', a: a, b: b};
	});
var $author$project$Rte$ScreenElement = F4(
	function (idx, x, y, height) {
		return {height: height, idx: idx, x: x, y: y};
	});
var $author$project$Rte$Scrolled = function (a) {
	return {$: 'Scrolled', a: a};
};
var $author$project$Rte$SelectWord = {$: 'SelectWord'};
var $author$project$Rte$Up = {$: 'Up'};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Rte$copyToClipboard = _Platform_outgoingPort('copyToClipboard', $elm$json$Json$Encode$string);
var $author$project$Rte$copy = function (e) {
	var _v0 = e.selection;
	if (_v0.$ === 'Nothing') {
		return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
	} else {
		var _v1 = _v0.a;
		var beg = _v1.a;
		var end = _v1.b;
		return _Utils_Tuple2(
			_Utils_update(
				e,
				{
					clipboard: $elm$core$Maybe$Just(
						A2(
							$elm$core$List$take,
							(end - beg) + 1,
							A2($elm$core$List$drop, beg, e.content)))
				}),
			$author$project$Rte$copyToClipboard(
				A2(
					$elm$core$String$left,
					(end - beg) + 1,
					A2($elm$core$String$dropLeft, beg, e.textContent))));
	}
};
var $author$project$Rte$lineBreakAt = F2(
	function (idx, content) {
		var _v0 = A2($author$project$Rte$nextBreakFrom, idx, content);
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var lineBreak = _v1.b;
			return $elm$core$Maybe$Just(lineBreak);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Rte$currentParaStyle = F2(
	function (id, editor) {
		var _v0 = A2($author$project$Rte$lineBreakAt, editor.cursor, editor.content);
		if (_v0.$ === 'Just') {
			var lineBreak = _v0.a;
			return _Utils_update(
				lineBreak,
				{id: id});
		} else {
			return $author$project$Rte$defaultLineBreak(id);
		}
	});
var $author$project$Rte$cut = function (e) {
	var _v0 = $author$project$Rte$copy(e);
	var copied = _v0.a;
	var copyCmd = _v0.b;
	var _v1 = e.selection;
	if (_v1.$ === 'Nothing') {
		return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
	} else {
		var _v2 = _v1.a;
		var beg = _v2.a;
		var end = _v2.b;
		return _Utils_Tuple2(
			_Utils_update(
				copied,
				{
					content: _Utils_ap(
						A2($elm$core$List$take, beg, e.content),
						A2(
							$elm$core$List$drop,
							(end - beg) + 1,
							A2($elm$core$List$drop, beg, e.content))),
					cursor: beg,
					selection: $elm$core$Maybe$Nothing,
					textContent: _Utils_ap(
						A2($elm$core$String$left, beg, e.textContent),
						A2(
							$elm$core$String$dropLeft,
							(end - beg) + 1,
							A2($elm$core$String$dropLeft, beg, e.textContent)))
				}),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						copyCmd,
						A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID)
					])));
	}
};
var $author$project$Rte$detectFontStyle = F2(
	function (idx, e) {
		var _v0 = A2($author$project$Rte$get, idx - 1, e.content);
		if ((_v0.$ === 'Just') && (_v0.a.$ === 'Char')) {
			var c = _v0.a.a;
			return _Utils_update(
				e,
				{fontStyle: c.fontStyle});
		} else {
			return e;
		}
	});
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Rte$idOf = function (elem) {
	switch (elem.$) {
		case 'Break':
			var br = elem.a;
			return br.id;
		case 'Char':
			var _char = elem.a;
			return _char.id;
		default:
			var html = elem.a;
			return html.id;
	}
};
var $author$project$Rte$getIdx = F2(
	function (idStr, content) {
		var f = F3(
			function (id, elem, _v2) {
				var x = _v2.a;
				var y = _v2.b;
				if (y.$ === 'Just') {
					return _Utils_Tuple2(x, y);
				} else {
					return _Utils_eq(
						$author$project$Rte$idOf(elem),
						id) ? _Utils_Tuple2(
						x,
						$elm$core$Maybe$Just(x)) : _Utils_Tuple2(x + 1, $elm$core$Maybe$Nothing);
				}
			});
		var _v0 = $elm$core$String$toInt(idStr);
		if (_v0.$ === 'Just') {
			var id = _v0.a;
			return A3(
				$elm$core$List$foldl,
				f(id),
				_Utils_Tuple2(0, $elm$core$Maybe$Nothing),
				content).b;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$browser$Browser$Dom$getViewportOf = _Browser_getViewportOf;
var $author$project$Rte$getViewport = F2(
	function (msg, editorID) {
		return A2(
			$elm$core$Task$attempt,
			msg,
			$elm$browser$Browser$Dom$getViewportOf(editorID));
	});
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm_community$intdict$IntDict$Inner = function (a) {
	return {$: 'Inner', a: a};
};
var $elm_community$intdict$IntDict$size = function (dict) {
	switch (dict.$) {
		case 'Empty':
			return 0;
		case 'Leaf':
			return 1;
		default:
			var i = dict.a;
			return i.size;
	}
};
var $elm_community$intdict$IntDict$inner = F3(
	function (p, l, r) {
		var _v0 = _Utils_Tuple2(l, r);
		if (_v0.a.$ === 'Empty') {
			var _v1 = _v0.a;
			return r;
		} else {
			if (_v0.b.$ === 'Empty') {
				var _v2 = _v0.b;
				return l;
			} else {
				return $elm_community$intdict$IntDict$Inner(
					{
						left: l,
						prefix: p,
						right: r,
						size: $elm_community$intdict$IntDict$size(l) + $elm_community$intdict$IntDict$size(r)
					});
			}
		}
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm_community$intdict$IntDict$highestBitSet = function (n) {
	var shiftOr = F2(
		function (i, shift) {
			return i | (i >>> shift);
		});
	var n1 = A2(shiftOr, n, 1);
	var n2 = A2(shiftOr, n1, 2);
	var n3 = A2(shiftOr, n2, 4);
	var n4 = A2(shiftOr, n3, 8);
	var n5 = A2(shiftOr, n4, 16);
	return n5 & (~(n5 >>> 1));
};
var $elm_community$intdict$IntDict$signBit = $elm_community$intdict$IntDict$highestBitSet(-1);
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm_community$intdict$IntDict$isBranchingBitSet = function (p) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Bitwise$xor($elm_community$intdict$IntDict$signBit),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Bitwise$and(p.branchingBit),
			$elm$core$Basics$neq(0)));
};
var $elm_community$intdict$IntDict$higherBitMask = function (branchingBit) {
	return branchingBit ^ (~(branchingBit - 1));
};
var $elm_community$intdict$IntDict$lcp = F2(
	function (x, y) {
		var branchingBit = $elm_community$intdict$IntDict$highestBitSet(x ^ y);
		var mask = $elm_community$intdict$IntDict$higherBitMask(branchingBit);
		var prefixBits = x & mask;
		return {branchingBit: branchingBit, prefixBits: prefixBits};
	});
var $elm_community$intdict$IntDict$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm_community$intdict$IntDict$leaf = F2(
	function (k, v) {
		return $elm_community$intdict$IntDict$Leaf(
			{key: k, value: v});
	});
var $elm_community$intdict$IntDict$prefixMatches = F2(
	function (p, n) {
		return _Utils_eq(
			n & $elm_community$intdict$IntDict$higherBitMask(p.branchingBit),
			p.prefixBits);
	});
var $elm_community$intdict$IntDict$update = F3(
	function (key, alter, dict) {
		var join = F2(
			function (_v2, _v3) {
				var k1 = _v2.a;
				var l = _v2.b;
				var k2 = _v3.a;
				var r = _v3.b;
				var prefix = A2($elm_community$intdict$IntDict$lcp, k1, k2);
				return A2($elm_community$intdict$IntDict$isBranchingBitSet, prefix, k2) ? A3($elm_community$intdict$IntDict$inner, prefix, l, r) : A3($elm_community$intdict$IntDict$inner, prefix, r, l);
			});
		var alteredNode = function (mv) {
			var _v1 = alter(mv);
			if (_v1.$ === 'Just') {
				var v = _v1.a;
				return A2($elm_community$intdict$IntDict$leaf, key, v);
			} else {
				return $elm_community$intdict$IntDict$empty;
			}
		};
		switch (dict.$) {
			case 'Empty':
				return alteredNode($elm$core$Maybe$Nothing);
			case 'Leaf':
				var l = dict.a;
				return _Utils_eq(l.key, key) ? alteredNode(
					$elm$core$Maybe$Just(l.value)) : A2(
					join,
					_Utils_Tuple2(
						key,
						alteredNode($elm$core$Maybe$Nothing)),
					_Utils_Tuple2(l.key, dict));
			default:
				var i = dict.a;
				return A2($elm_community$intdict$IntDict$prefixMatches, i.prefix, key) ? (A2($elm_community$intdict$IntDict$isBranchingBitSet, i.prefix, key) ? A3(
					$elm_community$intdict$IntDict$inner,
					i.prefix,
					i.left,
					A3($elm_community$intdict$IntDict$update, key, alter, i.right)) : A3(
					$elm_community$intdict$IntDict$inner,
					i.prefix,
					A3($elm_community$intdict$IntDict$update, key, alter, i.left),
					i.right)) : A2(
					join,
					_Utils_Tuple2(
						key,
						alteredNode($elm$core$Maybe$Nothing)),
					_Utils_Tuple2(i.prefix.prefixBits, dict));
		}
	});
var $elm_community$intdict$IntDict$insert = F3(
	function (key, value, dict) {
		return A3(
			$elm_community$intdict$IntDict$update,
			key,
			$elm$core$Basics$always(
				$elm$core$Maybe$Just(value)),
			dict);
	});
var $author$project$Rte$insertBreak = F3(
	function (br, maybeTimeStamp, editor0) {
		var elemTxt = '\n';
		var e = function () {
			if (maybeTimeStamp.$ === 'Just') {
				var timeStamp = maybeTimeStamp.a;
				return _Utils_update(
					editor0,
					{lastKeyDown: timeStamp});
			} else {
				return editor0;
			}
		}();
		var _v0 = e.selection;
		if (_v0.$ === 'Nothing') {
			return _Utils_update(
				e,
				{
					content: _Utils_ap(
						A2($elm$core$List$take, e.cursor, e.content),
						_Utils_ap(
							_List_fromArray(
								[
									$author$project$Rte$Break(br)
								]),
							A2($elm$core$List$drop, e.cursor, e.content))),
					cursor: e.cursor + 1,
					idCounter: e.idCounter + 1,
					textContent: _Utils_ap(
						A2($elm$core$String$left, e.cursor, e.textContent),
						_Utils_ap(
							elemTxt,
							A2($elm$core$String$dropLeft, e.cursor, e.textContent)))
				});
		} else {
			var _v1 = _v0.a;
			var beg = _v1.a;
			var end = _v1.b;
			return _Utils_update(
				e,
				{
					content: _Utils_ap(
						A2($elm$core$List$take, beg, e.content),
						_Utils_ap(
							_List_fromArray(
								[
									$author$project$Rte$Break(br)
								]),
							A2($elm$core$List$drop, end + 1, e.content))),
					cursor: beg + 1,
					idCounter: e.idCounter + 1,
					selection: $elm$core$Maybe$Nothing,
					textContent: _Utils_ap(
						A2($elm$core$String$left, beg, e.textContent),
						_Utils_ap(
							elemTxt,
							A2($elm$core$String$dropLeft, end + 1, e.textContent)))
				});
		}
	});
var $author$project$Rte$jumpSize = 100;
var $elm_community$intdict$IntDict$foldl = F3(
	function (f, acc, dict) {
		foldl:
		while (true) {
			switch (dict.$) {
				case 'Empty':
					return acc;
				case 'Leaf':
					var l = dict.a;
					return A3(f, l.key, l.value, acc);
				default:
					var i = dict.a;
					var $temp$f = f,
						$temp$acc = A3($elm_community$intdict$IntDict$foldl, f, acc, i.left),
						$temp$dict = i.right;
					f = $temp$f;
					acc = $temp$acc;
					dict = $temp$dict;
					continue foldl;
			}
		}
	});
var $elm_community$intdict$IntDict$foldr = F3(
	function (f, acc, dict) {
		foldr:
		while (true) {
			switch (dict.$) {
				case 'Empty':
					return acc;
				case 'Leaf':
					var l = dict.a;
					return A3(f, l.key, l.value, acc);
				default:
					var i = dict.a;
					var $temp$f = f,
						$temp$acc = A3($elm_community$intdict$IntDict$foldr, f, acc, i.right),
						$temp$dict = i.left;
					f = $temp$f;
					acc = $temp$acc;
					dict = $temp$dict;
					continue foldr;
			}
		}
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $author$project$Rte$LocatedChar = F2(
	function (a, b) {
		return {$: 'LocatedChar', a: a, b: b};
	});
var $author$project$Rte$locateCmd = F2(
	function (idx, id) {
		return A2(
			$elm$core$Task$attempt,
			$author$project$Rte$LocatedChar(idx),
			$elm$browser$Browser$Dom$getElement(
				$elm$core$String$fromInt(id)));
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Rte$locateMoreChars = F4(
	function (e, _v0, func, newRegions) {
		var a = _v0.a;
		var b = _v0.b;
		var toList = function (_v5) {
			var x = _v5.a;
			var y = _v5.b;
			return A2($elm$core$List$range, x, y);
		};
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var normalize = function (_v4) {
			var x = _v4.a;
			var y = _v4.b;
			return _Utils_Tuple2(
				A2($elm$core$Basics$max, 0, x),
				A2($elm$core$Basics$min, maxIdx, y));
		};
		var idxs = $elm$core$List$concat(
			A2(
				$elm$core$List$map,
				toList,
				A2($elm$core$List$map, normalize, newRegions)));
		var cmd = F2(
			function (idx, xs) {
				var _v3 = A2(
					$elm$core$Maybe$map,
					$author$project$Rte$idOf,
					A2($author$project$Rte$get, idx, e.content));
				if (_v3.$ === 'Nothing') {
					return xs;
				} else {
					var id = _v3.a;
					return A2(
						$elm$core$List$cons,
						A2($author$project$Rte$locateCmd, idx, id),
						xs);
				}
			});
		var cmds = A3($elm$core$List$foldr, cmd, _List_Nil, idxs);
		var _v1 = normalize(
			_Utils_Tuple2(a, b));
		var beg = _v1.a;
		var end = _v1.b;
		if (!idxs.b) {
			return _Utils_Tuple2(
				_Utils_update(
					e,
					{locateBacklog: 0, located: $elm_community$intdict$IntDict$empty, locating: $author$project$Rte$Idle}),
				$elm$core$Platform$Cmd$none);
		} else {
			var xs = idxs;
			return _Utils_Tuple2(
				_Utils_update(
					e,
					{
						locateBacklog: $elm$core$List$length(cmds),
						locating: func(
							_Utils_Tuple2(beg, end))
					}),
				$elm$core$Platform$Cmd$batch(cmds));
		}
	});
var $author$project$Rte$onSameLine = F2(
	function (a, b) {
		return _Utils_eq(a.y, b.y) || (((_Utils_cmp(a.y, b.y) < 1) && (_Utils_cmp(a.y + a.height, b.y + b.height) > -1)) || ((_Utils_cmp(b.y, a.y) < 1) && (_Utils_cmp(b.y + b.height, a.y + a.height) > -1)));
	});
var $author$project$Rte$selectionMod = F2(
	function (oldCursor, _new) {
		var newCursor = _new.cursor;
		var selection = function () {
			var _v0 = _new.selection;
			if (_v0.$ === 'Just') {
				var _v1 = _v0.a;
				var beg = _v1.a;
				var end = _v1.b;
				return (_Utils_cmp(newCursor, beg) < 0) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(newCursor, end)) : ((_Utils_cmp(newCursor, end) > 0) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(beg, newCursor - 1)) : (_Utils_eq(oldCursor, beg) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(newCursor, end)) : $elm$core$Maybe$Just(
					_Utils_Tuple2(beg, newCursor - 1))));
			} else {
				return (_Utils_cmp(newCursor, oldCursor) < 0) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(newCursor, oldCursor - 1)) : ((_Utils_cmp(newCursor, oldCursor) > 0) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(oldCursor, newCursor - 1)) : $elm$core$Maybe$Nothing);
			}
		}();
		return _new.shiftDown ? _Utils_update(
			_new,
			{selection: selection}) : _Utils_update(
			_new,
			{selection: $elm$core$Maybe$Nothing});
	});
var $author$project$Rte$lineBoundary = F3(
	function (direction, _v0, e) {
		var beg = _v0.a;
		var end = _v0.b;
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var last = function (x) {
			if (direction.$ === 'Down') {
				return _Utils_eq(x.idx, maxIdx);
			} else {
				return !x.idx;
			}
		};
		var fold = function () {
			if (direction.$ === 'Down') {
				return $elm_community$intdict$IntDict$foldl;
			} else {
				return $elm_community$intdict$IntDict$foldr;
			}
		}();
		var cursor = {height: e.cursorScreen.height, idx: e.cursor, x: e.cursorScreen.x, y: e.cursorScreen.y};
		var f = F3(
			function (_v6, a, _v7) {
				var candidate = _v7.a;
				var winner = _v7.b;
				if (winner.$ === 'Just') {
					return _Utils_Tuple2($elm$core$Maybe$Nothing, winner);
				} else {
					return (!A2($author$project$Rte$onSameLine, a, cursor)) ? _Utils_Tuple2($elm$core$Maybe$Nothing, candidate) : (last(a) ? _Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						$elm$core$Maybe$Just(a)) : _Utils_Tuple2(
						$elm$core$Maybe$Just(a),
						$elm$core$Maybe$Nothing));
				}
			});
		var _v1 = A3(
			fold,
			f,
			_Utils_Tuple2($elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing),
			e.located);
		if (_v1.b.$ === 'Just') {
			var a = _v1.b.a;
			return _Utils_Tuple2(
				A2(
					$author$project$Rte$detectFontStyle,
					a.idx,
					A2(
						$author$project$Rte$selectionMod,
						e.cursor,
						_Utils_update(
							e,
							{cursor: a.idx, located: $elm_community$intdict$IntDict$empty, locating: $author$project$Rte$Idle}))),
				A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
		} else {
			if (_v1.a.$ === 'Just') {
				if (direction.$ === 'Down') {
					return A4(
						$author$project$Rte$locateMoreChars,
						e,
						_Utils_Tuple2(e.cursor, end + $author$project$Rte$jumpSize),
						$author$project$Rte$LineBoundary($author$project$Rte$Down),
						_List_fromArray(
							[
								_Utils_Tuple2(end + 1, end + $author$project$Rte$jumpSize)
							]));
				} else {
					return A4(
						$author$project$Rte$locateMoreChars,
						e,
						_Utils_Tuple2(beg - $author$project$Rte$jumpSize, e.cursor),
						$author$project$Rte$LineBoundary($author$project$Rte$Up),
						_List_fromArray(
							[
								_Utils_Tuple2(beg - $author$project$Rte$jumpSize, beg - 1)
							]));
				}
			} else {
				var _v3 = _v1.a;
				var _v4 = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						e,
						{located: $elm_community$intdict$IntDict$empty, locating: $author$project$Rte$Idle}),
					$elm$core$Platform$Cmd$none);
			}
		}
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$Rte$jumpHelp = F4(
	function (isRelevant, direction, _v0, e) {
		var beg = _v0.a;
		var end = _v0.b;
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var last = function (x) {
			if (direction.$ === 'Down') {
				return _Utils_eq(x.idx, maxIdx);
			} else {
				return !x.idx;
			}
		};
		var fold = function () {
			if (direction.$ === 'Down') {
				return $elm_community$intdict$IntDict$foldl;
			} else {
				return $elm_community$intdict$IntDict$foldr;
			}
		}();
		var cursor = {height: e.cursorScreen.height, idx: e.cursor, x: e.cursorScreen.x, y: e.cursorScreen.y};
		var better = F2(
			function (a, b) {
				return _Utils_cmp(
					$elm$core$Basics$abs(a.x - cursor.x),
					$elm$core$Basics$abs(b.x - cursor.x)) < 0;
			});
		var f = F3(
			function (_v5, _new, _v6) {
				var candidate = _v6.a;
				var winner = _v6.b;
				if (!A2(isRelevant, cursor, _new)) {
					return _Utils_Tuple2(candidate, winner);
				} else {
					if (winner.$ === 'Just') {
						return _Utils_Tuple2($elm$core$Maybe$Nothing, winner);
					} else {
						if (candidate.$ === 'Nothing') {
							return last(_new) ? _Utils_Tuple2(
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(_new)) : _Utils_Tuple2(
								$elm$core$Maybe$Just(_new),
								$elm$core$Maybe$Nothing);
						} else {
							var old = candidate.a;
							return ((!A2($author$project$Rte$onSameLine, old, _new)) || A2(better, old, _new)) ? _Utils_Tuple2(
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(old)) : (last(_new) ? _Utils_Tuple2(
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(_new)) : _Utils_Tuple2(
								$elm$core$Maybe$Just(_new),
								$elm$core$Maybe$Nothing));
						}
					}
				}
			});
		var _v1 = A3(
			fold,
			f,
			_Utils_Tuple2($elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing),
			e.located);
		if (_v1.b.$ === 'Just') {
			var winner = _v1.b.a;
			return _Utils_Tuple2(
				$elm$core$Maybe$Nothing,
				$elm$core$Maybe$Just(winner.idx));
		} else {
			var _v2 = _v1.b;
			return _Utils_Tuple2(
				$elm$core$Maybe$Just(
					_Utils_Tuple2(
						_Utils_Tuple2(beg - (($author$project$Rte$jumpSize / 2) | 0), beg - 1),
						_Utils_Tuple2(end + 1, end + (($author$project$Rte$jumpSize / 2) | 0)))),
				$elm$core$Maybe$Nothing);
		}
	});
var $author$project$Rte$jump = F5(
	function (f, isRelevant, direction, _v0, e) {
		var beg = _v0.a;
		var end = _v0.b;
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var g = F2(
			function (idx, x) {
				return _Utils_Tuple2(
					A2(
						$author$project$Rte$detectFontStyle,
						idx,
						A2(
							$author$project$Rte$selectionMod,
							e.cursor,
							_Utils_update(
								x,
								{cursor: idx, located: $elm_community$intdict$IntDict$empty, locating: $author$project$Rte$Idle}))),
					A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
			});
		var fail = function (x) {
			return _Utils_Tuple2(
				_Utils_update(
					x,
					{located: $elm_community$intdict$IntDict$empty, locating: $author$project$Rte$Idle}),
				$elm$core$Platform$Cmd$none);
		};
		var _v1 = A4(
			$author$project$Rte$jumpHelp,
			isRelevant,
			direction,
			_Utils_Tuple2(beg, end),
			e);
		if (_v1.b.$ === 'Just') {
			var idx = _v1.b.a;
			return A2(g, idx, e);
		} else {
			if (_v1.a.$ === 'Nothing') {
				var _v2 = _v1.a;
				var _v3 = _v1.b;
				return fail(e);
			} else {
				var _v4 = _v1.a.a;
				var _v5 = _v4.a;
				var a = _v5.a;
				var b = _v5.b;
				var _v6 = _v4.b;
				var c = _v6.a;
				var d = _v6.b;
				var _v7 = _v1.b;
				return (!beg) ? A2(g, 0, e) : (_Utils_eq(end, maxIdx) ? A2(g, maxIdx, e) : (((beg > 0) || (_Utils_cmp(end, maxIdx) < 0)) ? A4(
					$author$project$Rte$locateMoreChars,
					e,
					_Utils_Tuple2(a, d),
					f(direction),
					_List_fromArray(
						[
							_Utils_Tuple2(a, b),
							_Utils_Tuple2(c, d)
						])) : fail(e)));
			}
		}
	});
var $author$project$Rte$lineJump = F3(
	function (direction, _v0, editor) {
		var beg = _v0.a;
		var end = _v0.b;
		var f = F2(
			function (cursor, pos) {
				if (direction.$ === 'Down') {
					return _Utils_cmp(pos.y, cursor.y) > 0;
				} else {
					return _Utils_cmp(pos.y, cursor.y) < 0;
				}
			});
		return A5(
			$author$project$Rte$jump,
			$author$project$Rte$LineJump,
			f,
			direction,
			_Utils_Tuple2(beg, end),
			editor);
	});
var $author$project$Rte$locateChars = F3(
	function (e, _v0, func) {
		var a = _v0.a;
		var b = _v0.b;
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var cmd = F2(
			function (idx, xs) {
				var _v2 = A2(
					$elm$core$Maybe$map,
					$author$project$Rte$idOf,
					A2($author$project$Rte$get, idx, e.content));
				if (_v2.$ === 'Nothing') {
					return xs;
				} else {
					var id = _v2.a;
					return A2(
						$elm$core$List$cons,
						A2($author$project$Rte$locateCmd, idx, id),
						xs);
				}
			});
		var _v1 = _Utils_Tuple2(
			A2($elm$core$Basics$max, 0, a),
			A2($elm$core$Basics$min, maxIdx, b));
		var beg = _v1.a;
		var end = _v1.b;
		var cmds = A3(
			$elm$core$List$foldr,
			cmd,
			_List_Nil,
			A2($elm$core$List$range, beg, end));
		return _Utils_Tuple2(
			_Utils_update(
				e,
				{
					cursorVisible: false,
					locateBacklog: $elm$core$List$length(cmds),
					located: $elm_community$intdict$IntDict$empty,
					locating: func(
						_Utils_Tuple2(beg, end))
				}),
			$elm$core$Platform$Cmd$batch(
				A2(
					$elm$core$List$cons,
					$author$project$Rte$focusOnEditor(e.editorID),
					cmds)));
	});
var $author$project$Rte$PlaceCursor3_CursorParent = F2(
	function (a, b) {
		return {$: 'PlaceCursor3_CursorParent', a: a, b: b};
	});
var $author$project$Rte$locateCursorParent = F2(
	function (e, scroll) {
		var id = A2(
			$elm$core$Maybe$map,
			$author$project$Rte$idOf,
			A2($author$project$Rte$get, e.cursor, e.content));
		if (id.$ === 'Just') {
			var x = id.a;
			return _Utils_Tuple2(
				e,
				A2(
					$elm$core$Task$attempt,
					$author$project$Rte$PlaceCursor3_CursorParent(scroll),
					$elm$browser$Browser$Dom$getElement(
						$elm$core$String$fromInt(x))));
		} else {
			return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Rte$DragFrom = function (a) {
	return {$: 'DragFrom', a: a};
};
var $author$project$Rte$DragInit = {$: 'DragInit'};
var $author$project$Rte$next = F3(
	function (f, idx, content) {
		var maxIdx = $elm$core$List$length(content) - 1;
		var idxs = A2($elm$core$List$range, idx + 1, maxIdx);
		var g = F2(
			function (x, y) {
				if (y.$ === 'Just') {
					return y;
				} else {
					return A2(f, x, content) ? $elm$core$Maybe$Just(x) : $elm$core$Maybe$Nothing;
				}
			});
		return A3($elm$core$List$foldl, g, $elm$core$Maybe$Nothing, idxs);
	});
var $author$project$Rte$diacritical = function (_char) {
	return A2(
		$elm$core$List$member,
		_char,
		_List_fromArray(
			[
				_Utils_chr('À'),
				_Utils_chr('Á'),
				_Utils_chr('Â'),
				_Utils_chr('Ã'),
				_Utils_chr('Ä'),
				_Utils_chr('Å'),
				_Utils_chr('Æ'),
				_Utils_chr('Ç'),
				_Utils_chr('È'),
				_Utils_chr('É'),
				_Utils_chr('Ê'),
				_Utils_chr('Ë'),
				_Utils_chr('Ì'),
				_Utils_chr('Í'),
				_Utils_chr('Î'),
				_Utils_chr('Ï'),
				_Utils_chr('Ð'),
				_Utils_chr('Ñ'),
				_Utils_chr('Ò'),
				_Utils_chr('Ó'),
				_Utils_chr('Ô'),
				_Utils_chr('Õ'),
				_Utils_chr('Ö'),
				_Utils_chr('Ø'),
				_Utils_chr('Ù'),
				_Utils_chr('Ú'),
				_Utils_chr('Û'),
				_Utils_chr('Ü'),
				_Utils_chr('Ý'),
				_Utils_chr('Þ'),
				_Utils_chr('ß'),
				_Utils_chr('à'),
				_Utils_chr('á'),
				_Utils_chr('â'),
				_Utils_chr('ã'),
				_Utils_chr('ä'),
				_Utils_chr('å'),
				_Utils_chr('æ'),
				_Utils_chr('ç'),
				_Utils_chr('è'),
				_Utils_chr('é'),
				_Utils_chr('ê'),
				_Utils_chr('ë'),
				_Utils_chr('ì'),
				_Utils_chr('í'),
				_Utils_chr('î'),
				_Utils_chr('ï'),
				_Utils_chr('ð'),
				_Utils_chr('ñ'),
				_Utils_chr('ò'),
				_Utils_chr('ó'),
				_Utils_chr('ô'),
				_Utils_chr('õ'),
				_Utils_chr('ö'),
				_Utils_chr('ø'),
				_Utils_chr('ù'),
				_Utils_chr('ú'),
				_Utils_chr('û'),
				_Utils_chr('ü'),
				_Utils_chr('ý'),
				_Utils_chr('þ'),
				_Utils_chr('ÿ'),
				_Utils_chr('Ő'),
				_Utils_chr('ő'),
				_Utils_chr('Ű'),
				_Utils_chr('ű')
			]));
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Rte$alphaNumAt = F2(
	function (idx, content) {
		var _v0 = A2($author$project$Rte$get, idx, content);
		if ((_v0.$ === 'Just') && (_v0.a.$ === 'Char')) {
			var ch = _v0.a.a;
			var _v1 = $elm$core$String$toList(ch._char);
			if (_v1.b && (!_v1.b.b)) {
				var _char = _v1.a;
				return $elm$core$Char$isAlphaNum(_char) || $author$project$Rte$diacritical(_char);
			} else {
				return false;
			}
		} else {
			return false;
		}
	});
var $author$project$Rte$nonAlphaNumAt = F2(
	function (idx, content) {
		return !A2($author$project$Rte$alphaNumAt, idx, content);
	});
var $author$project$Rte$previous = F3(
	function (f, idx, content) {
		var idxs = A2($elm$core$List$range, 0, idx - 1);
		var g = F2(
			function (x, y) {
				if (y.$ === 'Just') {
					return y;
				} else {
					return A2(f, x, content) ? $elm$core$Maybe$Just(x) : $elm$core$Maybe$Nothing;
				}
			});
		return A3($elm$core$List$foldr, g, $elm$core$Maybe$Nothing, idxs);
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Rte$previousWordBoundary = function (e) {
	return A2($author$project$Rte$alphaNumAt, e.cursor - 1, e.content) ? A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$core$Maybe$map,
			function (x) {
				return x + 1;
			},
			A3($author$project$Rte$previous, $author$project$Rte$nonAlphaNumAt, e.cursor, e.content))) : A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$core$Maybe$map,
			function (x) {
				return x + 1;
			},
			A3($author$project$Rte$previous, $author$project$Rte$alphaNumAt, e.cursor, e.content)));
};
var $author$project$Rte$currentWord = function (e) {
	var beg = $author$project$Rte$previousWordBoundary(e);
	var _v0 = A3($author$project$Rte$next, $author$project$Rte$nonAlphaNumAt, e.cursor, e.content);
	if (_v0.$ === 'Just') {
		var x = _v0.a;
		return _Utils_Tuple2(beg, x - 1);
	} else {
		return _Utils_Tuple2(
			beg,
			$elm$core$List$length(e.content) - 1);
	}
};
var $author$project$Rte$selectCurrentWord = function (editor) {
	var _v0 = $author$project$Rte$currentWord(editor);
	var beg = _v0.a;
	var end = _v0.b;
	return _Utils_update(
		editor,
		{
			cursor: A2(
				$elm$core$Basics$min,
				end + 1,
				$elm$core$List$length(editor.content) - 1),
			selection: $elm$core$Maybe$Just(
				_Utils_Tuple2(beg, end))
		});
};
var $author$project$Rte$locateMouse = F4(
	function (s, _v0, _v1, e) {
		var mouseX = _v0.a;
		var mouseY = _v0.b;
		var beg = _v1.a;
		var end = _v1.b;
		var start = {previous: $elm$core$Maybe$Nothing, winner: $elm$core$Maybe$Nothing};
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var g = F4(
			function (a, _v14, b, x) {
				if (x.$ === 'Just') {
					return x;
				} else {
					return (_Utils_cmp(b.idx, a.idx) > 0) ? $elm$core$Maybe$Nothing : (((!A2($author$project$Rte$onSameLine, a, b)) || (!b.idx)) ? $elm$core$Maybe$Just(b.idx + 1) : $elm$core$Maybe$Nothing);
				}
			});
		var getBounds = function (a) {
			var _v12 = A3(
				$elm_community$intdict$IntDict$foldr,
				g(a),
				$elm$core$Maybe$Nothing,
				e.located);
			if (_v12.$ === 'Just') {
				var begIdx = _v12.a;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(begIdx, a.idx));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var diff = function (a) {
			return a.y - mouseY;
		};
		var flips = F2(
			function (a, b) {
				return (diff(a) > 0) && (diff(b) <= 0);
			});
		var f = F3(
			function (_v11, _new, m) {
				if (_Utils_eq(_new.idx, maxIdx) && (diff(_new) <= 0)) {
					return _Utils_update(
						m,
						{
							winner: $elm$core$Maybe$Just(_new)
						});
				} else {
					var _v9 = m.winner;
					if (_v9.$ === 'Just') {
						return m;
					} else {
						var _v10 = m.previous;
						if (_v10.$ === 'Nothing') {
							return (!_new.idx) ? _Utils_update(
								m,
								{
									winner: $elm$core$Maybe$Just(_new)
								}) : _Utils_update(
								m,
								{
									previous: $elm$core$Maybe$Just(_new)
								});
						} else {
							var old = _v10.a;
							return (A2(flips, old, _new) || (!_new.idx)) ? _Utils_update(
								m,
								{
									winner: $elm$core$Maybe$Just(_new)
								}) : _Utils_update(
								m,
								{
									previous: $elm$core$Maybe$Just(_new)
								});
						}
					}
				}
			});
		var mouseLocator = A3($elm_community$intdict$IntDict$foldr, f, start, e.located);
		var targetLine = function () {
			var _v8 = mouseLocator.winner;
			if (_v8.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var pos = _v8.a;
				return getBounds(pos);
			}
		}();
		var _continue = function (x) {
			return ((beg < 1) && (_Utils_cmp(end, maxIdx) > -1)) ? _Utils_Tuple2(
				_Utils_update(
					x,
					{locateBacklog: 0, located: $elm_community$intdict$IntDict$empty, locating: $author$project$Rte$Idle}),
				$elm$core$Platform$Cmd$none) : A4(
				$author$project$Rte$locateMoreChars,
				x,
				_Utils_Tuple2(beg - $author$project$Rte$jumpSize, end + $author$project$Rte$jumpSize),
				A2(
					$author$project$Rte$Mouse,
					s,
					_Utils_Tuple2(mouseX, mouseY)),
				_List_fromArray(
					[
						_Utils_Tuple2(beg - $author$project$Rte$jumpSize, beg - 1),
						_Utils_Tuple2(end + 1, end + $author$project$Rte$jumpSize)
					]));
		};
		if (targetLine.$ === 'Nothing') {
			return _continue(e);
		} else {
			var _v3 = targetLine.a;
			var lineBeg = _v3.a;
			var lineEnd = _v3.b;
			var maybeSelectWord = function (_v7) {
				var a = _v7.a;
				var b = _v7.b;
				if (s.$ === 'SelectNone') {
					return _Utils_Tuple2(a, b);
				} else {
					return _Utils_Tuple2(
						$author$project$Rte$selectCurrentWord(a),
						b);
				}
			};
			var better = F2(
				function (a, b) {
					return _Utils_cmp(
						$elm$core$Basics$abs(mouseX - a.x),
						$elm$core$Basics$abs(mouseX - b.x)) < 0;
				});
			var h = F3(
				function (idx, _new, old) {
					if ((_Utils_cmp(idx, lineBeg) < 0) || (_Utils_cmp(idx, lineEnd) > 0)) {
						return old;
					} else {
						if (old.$ === 'Nothing') {
							return $elm$core$Maybe$Just(_new);
						} else {
							var a = old.a;
							return A2(better, _new, a) ? $elm$core$Maybe$Just(_new) : $elm$core$Maybe$Just(a);
						}
					}
				});
			var _v4 = A3($elm_community$intdict$IntDict$foldl, h, $elm$core$Maybe$Nothing, e.located);
			if (_v4.$ === 'Just') {
				var closest = _v4.a;
				return maybeSelectWord(
					_Utils_Tuple2(
						A2(
							$author$project$Rte$detectFontStyle,
							closest.idx,
							_Utils_update(
								e,
								{
									cursor: closest.idx,
									drag: _Utils_eq(e.drag, $author$project$Rte$DragInit) ? $author$project$Rte$DragFrom(closest.idx) : e.drag,
									located: $elm_community$intdict$IntDict$empty,
									locating: $author$project$Rte$Idle
								})),
						A2($author$project$Rte$placeCursor, $author$project$Rte$NoScroll, e.editorID)));
			} else {
				return _continue(e);
			}
		}
	});
var $author$project$Rte$SelectNone = {$: 'SelectNone'};
var $elm$core$Basics$round = _Basics_round;
var $author$project$Rte$mouseDown = F3(
	function (_v0, timeStamp, e) {
		var mouseX = _v0.a;
		var mouseY = _v0.b;
		var viewport = e.viewport.viewport;
		var sceneHeight = e.viewport.scene.height;
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var f = F2(
			function (x, y) {
				return _Utils_update(
					x,
					{drag: y, lastMouseDown: timeStamp});
			});
		var _v1 = _Utils_Tuple2(viewport.x, viewport.y);
		var vX = _v1.a;
		var vY = _v1.b;
		var _v2 = _Utils_Tuple2(e.box.x, e.box.y);
		var pX = _v2.a;
		var pY = _v2.b;
		var guess = $elm$core$Basics$round((maxIdx * ((mouseY - pY) + vY)) / sceneHeight);
		var bounds = _Utils_Tuple2(guess - $author$project$Rte$jumpSize, guess + $author$project$Rte$jumpSize);
		return A3(
			$author$project$Rte$locateChars,
			A2(
				f,
				_Utils_update(
					e,
					{selection: $elm$core$Maybe$Nothing}),
				$author$project$Rte$DragInit),
			bounds,
			A2(
				$author$project$Rte$Mouse,
				$author$project$Rte$SelectNone,
				_Utils_Tuple2(mouseX, mouseY)));
	});
var $author$project$Rte$nextWordBoundary = function (e) {
	return A2($author$project$Rte$alphaNumAt, e.cursor, e.content) ? A2(
		$elm$core$Maybe$withDefault,
		$elm$core$List$length(e.content) - 1,
		A3($author$project$Rte$next, $author$project$Rte$nonAlphaNumAt, e.cursor, e.content)) : A2(
		$elm$core$Maybe$withDefault,
		$elm$core$List$length(e.content) - 1,
		A3($author$project$Rte$next, $author$project$Rte$alphaNumAt, e.cursor, e.content));
};
var $author$project$Rte$page = F3(
	function (direction, _v0, e) {
		var beg = _v0.a;
		var end = _v0.b;
		var f = F2(
			function (cursor, idx) {
				if (direction.$ === 'Down') {
					return _Utils_cmp(idx.y, cursor.y + e.box.height) > -1;
				} else {
					return _Utils_cmp(idx.y, cursor.y - e.box.height) < 1;
				}
			});
		return A5(
			$author$project$Rte$jump,
			$author$project$Rte$Page,
			f,
			direction,
			_Utils_Tuple2(beg, end),
			e);
	});
var $author$project$Rte$pageEstimate = F4(
	function (direction, maxIdx, cursor, viewport) {
		var v = viewport.viewport;
		var scene = viewport.scene;
		var pageSizeGuess = $elm$core$Basics$round(((maxIdx + 1) * v.height) / scene.height);
		var cursorGuess = function () {
			if (direction.$ === 'Down') {
				return A2($elm$core$Basics$min, maxIdx, cursor + pageSizeGuess);
			} else {
				return A2($elm$core$Basics$max, 0, cursor - pageSizeGuess);
			}
		}();
		return _Utils_Tuple2(cursorGuess - $author$project$Rte$jumpSize, cursorGuess + $author$project$Rte$jumpSize);
	});
var $elm$browser$Browser$Dom$setViewportOf = _Browser_setViewportOf;
var $author$project$Rte$scrollTo = F2(
	function (editorID, y) {
		return A2(
			$elm$core$Task$attempt,
			function (_v0) {
				return $author$project$Rte$NoOp;
			},
			A3($elm$browser$Browser$Dom$setViewportOf, editorID, 0, y));
	});
var $author$project$Rte$scrollIfNeeded = F4(
	function (cursor, box, viewport, editorID) {
		var viewY = viewport.viewport.y;
		if (_Utils_cmp(cursor.y, box.y) < 0) {
			var yDelta = (-box.y) + cursor.y;
			return A2($author$project$Rte$scrollTo, editorID, viewY + yDelta);
		} else {
			if (_Utils_cmp(cursor.y + cursor.height, box.y + box.height) > 0) {
				var yDelta = ((cursor.y + cursor.height) - box.y) - box.height;
				return A2($author$project$Rte$scrollTo, editorID, viewY + yDelta);
			} else {
				return A2(
					$elm$core$Task$perform,
					$elm$core$Basics$identity,
					$elm$core$Task$succeed(
						$author$project$Rte$Scrolled($elm$core$Maybe$Nothing)));
			}
		}
	});
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $author$project$Rte$typed = F3(
	function (txt, editor0, maybeTimeStamp) {
		var txtLength = $elm$core$String$length(txt);
		var e = function () {
			if (maybeTimeStamp.$ === 'Just') {
				var timeStamp = maybeTimeStamp.a;
				return _Utils_update(
					editor0,
					{
						lastKeyDown: timeStamp,
						typing: _Utils_cmp(timeStamp - editor0.lastKeyDown, $author$project$Rte$tickPeriod) < 1
					});
			} else {
				return editor0;
			}
		}();
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var newIdCounter = e.idCounter + txtLength;
		var activeLink = $author$project$Rte$currentLink(e);
		var f = F2(
			function (id, ch) {
				return $author$project$Rte$Char(
					{_char: ch, fontStyle: e.fontStyle, highlightClasses: _List_Nil, highlightStyling: _List_Nil, id: id, link: activeLink});
			});
		var g = F2(
			function (x, _v0) {
				g:
				while (true) {
					var id = _v0.a;
					var ys = _v0.b;
					if (x === '') {
						return _Utils_Tuple2(id, ys);
					} else {
						var $temp$x = A2($elm$core$String$dropRight, 1, x),
							$temp$_v0 = _Utils_Tuple2(
							id - 1,
							A2(
								$elm$core$List$cons,
								A2(
									f,
									id,
									A2($elm$core$String$right, 1, x)),
								ys));
						x = $temp$x;
						_v0 = $temp$_v0;
						continue g;
					}
				}
			});
		var newContent = A2(
			g,
			txt,
			_Utils_Tuple2(newIdCounter - 1, _List_Nil)).b;
		var newClipboard = function () {
			if (maybeTimeStamp.$ === 'Just') {
				return e.clipboard;
			} else {
				return $elm$core$Maybe$Just(newContent);
			}
		}();
		var _v2 = e.selection;
		if (_v2.$ === 'Nothing') {
			return _Utils_Tuple2(
				_Utils_update(
					e,
					{
						clipboard: newClipboard,
						content: _Utils_ap(
							A2($elm$core$List$take, e.cursor, e.content),
							_Utils_ap(
								newContent,
								A2($elm$core$List$drop, e.cursor, e.content))),
						cursor: e.cursor + txtLength,
						idCounter: newIdCounter,
						textContent: _Utils_ap(
							A2($elm$core$String$left, e.cursor, e.textContent),
							_Utils_ap(
								txt,
								A2($elm$core$String$dropLeft, e.cursor, e.textContent)))
					}),
				A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
		} else {
			var _v3 = _v2.a;
			var beg = _v3.a;
			var x = _v3.b;
			var end = _Utils_eq(x, maxIdx) ? (maxIdx - 1) : x;
			return _Utils_Tuple2(
				_Utils_update(
					e,
					{
						clipboard: newClipboard,
						content: _Utils_ap(
							A2($elm$core$List$take, beg, e.content),
							_Utils_ap(
								newContent,
								A2($elm$core$List$drop, end + 1, e.content))),
						cursor: beg + 1,
						idCounter: newIdCounter,
						selection: $elm$core$Maybe$Nothing,
						textContent: _Utils_ap(
							A2($elm$core$String$left, beg, e.textContent),
							_Utils_ap(
								txt,
								A2($elm$core$String$dropLeft, end + 1, e.textContent)))
					}),
				A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
		}
	});
var $author$project$Rte$restore = F2(
	function (x, editor) {
		return _Utils_update(
			editor,
			{
				content: x.content,
				cursor: x.cursor,
				fontStyle: x.fontStyle,
				selection: x.selection,
				textContent: $author$project$Rte$toText(x.content)
			});
	});
var $author$project$Rte$undoAction = function (e) {
	var _v0 = e.undo;
	if (!_v0.b) {
		return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
	} else {
		if (!_v0.b.b) {
			var x = _v0.a;
			return _Utils_Tuple2(
				A2(
					$author$project$Rte$restore,
					x,
					_Utils_update(
						e,
						{
							undo: _List_fromArray(
								[x])
						})),
				A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
		} else {
			var x = _v0.a;
			var rest = _v0.b;
			return _Utils_Tuple2(
				A2(
					$author$project$Rte$restore,
					x,
					_Utils_update(
						e,
						{undo: rest})),
				A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
		}
	}
};
var $author$project$Rte$undoRefreshHead = function (e) {
	var current = $author$project$Rte$snapshot(e);
	var _v0 = e.undo;
	if (!_v0.b) {
		return e;
	} else {
		var rest = _v0.b;
		return _Utils_update(
			e,
			{
				undo: A2($elm$core$List$cons, current, rest)
			});
	}
};
var $author$project$Rte$updateUndo = F2(
	function (msg, e) {
		var maxIdx = $elm$core$List$length(e.content) - 1;
		if (msg.$ === 'KeyDown') {
			var timeStamp = msg.a;
			var str = msg.b;
			var like = function (x) {
				return A2(
					$author$project$Rte$updateUndo,
					A2($author$project$Rte$KeyDown, timeStamp, x),
					e);
			};
			var contentMod = ((timeStamp - e.lastKeyDown) < 1000) ? $author$project$Rte$undoRefreshHead(e) : $author$project$Rte$undoAddNew(e);
			if ($elm$core$String$length(str) === 1) {
				if (!e.ctrlDown) {
					return contentMod;
				} else {
					switch (str) {
						case '0':
							return contentMod;
						case '1':
							return contentMod;
						case 'x':
							return (!_Utils_eq(e.selection, $elm$core$Maybe$Nothing)) ? $author$project$Rte$undoAddNew(e) : e;
						case 'X':
							return like('x');
						case 'v':
							return (!_Utils_eq(e.clipboard, $elm$core$Maybe$Nothing)) ? $author$project$Rte$undoAddNew(e) : e;
						case 'V':
							return like('v');
						default:
							return e;
					}
				}
			} else {
				switch (str) {
					case 'Backspace':
						var _v3 = e.selection;
						if (_v3.$ === 'Nothing') {
							return (e.cursor > 0) ? contentMod : e;
						} else {
							return contentMod;
						}
					case 'Delete':
						var _v4 = e.selection;
						if (_v4.$ === 'Nothing') {
							return (_Utils_cmp(e.cursor, maxIdx) < 0) ? contentMod : e;
						} else {
							return contentMod;
						}
					case 'Enter':
						return contentMod;
					default:
						return e;
				}
			}
		} else {
			return e;
		}
	});
var $author$project$Rte$keydownUpdate = F3(
	function (timeStamp, str, e) {
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var like = function (x) {
			return A2(
				$author$project$Rte$update,
				A2($author$project$Rte$KeyDown, timeStamp, x),
				e);
		};
		if ($elm$core$String$length(str) === 1) {
			if (!e.ctrlDown) {
				return A3(
					$author$project$Rte$typed,
					str,
					e,
					$elm$core$Maybe$Just(timeStamp));
			} else {
				switch (str) {
					case '0':
						return A3(
							$author$project$Rte$typed,
							'–',
							e,
							$elm$core$Maybe$Just(timeStamp));
					case '1':
						return A3(
							$author$project$Rte$typed,
							'—',
							e,
							$elm$core$Maybe$Just(timeStamp));
					case 'a':
						return _Utils_Tuple2(
							_Utils_update(
								e,
								{
									selection: $elm$core$Maybe$Just(
										_Utils_Tuple2(0, maxIdx))
								}),
							$elm$core$Platform$Cmd$none);
					case 'A':
						return like('a');
					case 'c':
						return A2($author$project$Rte$update, $author$project$Rte$Copy, e);
					case 'C':
						return like('c');
					case 'v':
						return A2(
							$author$project$Rte$update,
							$author$project$Rte$Paste($elm$core$Maybe$Nothing),
							e);
					case 'V':
						return like('v');
					case 'x':
						return A2($author$project$Rte$update, $author$project$Rte$Cut, e);
					case 'X':
						return like('x');
					case 'z':
						return _Utils_Tuple2(
							e,
							A2(
								$elm$core$Task$perform,
								$elm$core$Basics$identity,
								$elm$core$Task$succeed($author$project$Rte$UndoAction)));
					case 'Z':
						return like('z');
					default:
						return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				}
			}
		} else {
			switch (str) {
				case 'ArrowDown':
					return _Utils_eq(e.cursor, maxIdx) ? _Utils_Tuple2(e, $elm$core$Platform$Cmd$none) : A3(
						$author$project$Rte$locateChars,
						e,
						_Utils_Tuple2(e.cursor + 1, e.cursor + $author$project$Rte$jumpSize),
						$author$project$Rte$LineJump($author$project$Rte$Down));
				case 'ArrowLeft':
					if (e.cursor < 1) {
						return (!e.shiftDown) ? _Utils_Tuple2(
							_Utils_update(
								e,
								{cursor: 0, selection: $elm$core$Maybe$Nothing}),
							$elm$core$Platform$Cmd$none) : _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
					} else {
						if (e.ctrlDown) {
							var newCursor = $author$project$Rte$previousWordBoundary(e);
							return _Utils_Tuple2(
								A2(
									$author$project$Rte$detectFontStyle,
									newCursor,
									A2(
										$author$project$Rte$selectionMod,
										e.cursor,
										_Utils_update(
											e,
											{cursor: newCursor}))),
								A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
						} else {
							var f = function (x) {
								return A2($elm$core$Basics$max, 0, x);
							};
							var newCursor = function () {
								if (e.shiftDown) {
									return f(e.cursor - 1);
								} else {
									var _v18 = e.selection;
									if (_v18.$ === 'Nothing') {
										return f(e.cursor - 1);
									} else {
										var _v19 = _v18.a;
										var beg = _v19.a;
										return beg;
									}
								}
							}();
							return _Utils_Tuple2(
								A2(
									$author$project$Rte$detectFontStyle,
									newCursor,
									A2(
										$author$project$Rte$selectionMod,
										e.cursor,
										_Utils_update(
											e,
											{cursor: newCursor}))),
								A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
						}
					}
				case 'ArrowRight':
					if (_Utils_cmp(e.cursor, maxIdx) > -1) {
						return _Utils_Tuple2(
							_Utils_update(
								e,
								{selection: $elm$core$Maybe$Nothing}),
							$elm$core$Platform$Cmd$none);
					} else {
						if ((!e.shiftDown) && _Utils_eq(
							e.selection,
							$elm$core$Maybe$Just(
								_Utils_Tuple2(0, maxIdx)))) {
							return _Utils_Tuple2(
								A2(
									$author$project$Rte$detectFontStyle,
									maxIdx,
									_Utils_update(
										e,
										{cursor: maxIdx, selection: $elm$core$Maybe$Nothing})),
								A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
						} else {
							if (e.ctrlDown) {
								var newCursor = $author$project$Rte$nextWordBoundary(e);
								return _Utils_Tuple2(
									A2(
										$author$project$Rte$detectFontStyle,
										newCursor,
										A2(
											$author$project$Rte$selectionMod,
											e.cursor,
											_Utils_update(
												e,
												{cursor: newCursor}))),
									A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
							} else {
								var f = function (x) {
									return A2($elm$core$Basics$min, x, maxIdx);
								};
								var newCursor = function () {
									if (e.shiftDown) {
										return f(e.cursor + 1);
									} else {
										var _v20 = e.selection;
										if (_v20.$ === 'Nothing') {
											return f(e.cursor + 1);
										} else {
											var _v21 = _v20.a;
											var end = _v21.b;
											return f(end + 1);
										}
									}
								}();
								return _Utils_Tuple2(
									A2(
										$author$project$Rte$detectFontStyle,
										newCursor,
										A2(
											$author$project$Rte$selectionMod,
											e.cursor,
											_Utils_update(
												e,
												{cursor: newCursor}))),
									A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
							}
						}
					}
				case 'ArrowUp':
					return (!e.cursor) ? _Utils_Tuple2(e, $elm$core$Platform$Cmd$none) : A3(
						$author$project$Rte$locateChars,
						e,
						_Utils_Tuple2(e.cursor - $author$project$Rte$jumpSize, e.cursor - 1),
						$author$project$Rte$LineJump($author$project$Rte$Up));
				case 'Backspace':
					var _v22 = e.selection;
					if (_v22.$ === 'Nothing') {
						return (e.cursor > 0) ? _Utils_Tuple2(
							A2(
								$author$project$Rte$detectFontStyle,
								e.cursor - 1,
								_Utils_update(
									e,
									{
										content: _Utils_ap(
											A2($elm$core$List$take, e.cursor - 1, e.content),
											A2($elm$core$List$drop, e.cursor, e.content)),
										cursor: e.cursor - 1,
										textContent: _Utils_ap(
											A2($elm$core$String$left, e.cursor - 1, e.textContent),
											A2($elm$core$String$dropLeft, e.cursor, e.textContent))
									})),
							A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID)) : _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
					} else {
						var _v23 = _v22.a;
						var beg = _v23.a;
						var end = _v23.b;
						return _Utils_Tuple2(
							A2(
								$author$project$Rte$detectFontStyle,
								beg,
								_Utils_update(
									e,
									{
										content: _Utils_ap(
											A2($elm$core$List$take, beg, e.content),
											A2($elm$core$List$drop, end + 1, e.content)),
										cursor: beg,
										selection: $elm$core$Maybe$Nothing,
										textContent: _Utils_ap(
											A2($elm$core$String$left, beg, e.textContent),
											A2($elm$core$String$dropLeft, end + 1, e.textContent))
									})),
							A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
					}
				case 'Control':
					return _Utils_Tuple2(
						_Utils_update(
							e,
							{ctrlDown: true}),
						$elm$core$Platform$Cmd$none);
				case 'Delete':
					var g = function (x) {
						return _Utils_eq(x, _List_Nil) ? _List_fromArray(
							[
								$author$project$Rte$Break(
								$author$project$Rte$defaultLineBreak(0))
							]) : x;
					};
					var f = F3(
						function (x, y, z) {
							return _Utils_ap(
								A2($elm$core$List$take, x, z),
								A2($elm$core$List$drop, y, z));
						});
					var h = F3(
						function (x, y, z) {
							return g(
								A3(f, x, y, z));
						});
					var _v24 = e.selection;
					if (_v24.$ === 'Nothing') {
						return (_Utils_cmp(e.cursor, maxIdx) < 0) ? _Utils_Tuple2(
							_Utils_update(
								e,
								{
									content: A3(h, e.cursor, e.cursor + 1, e.content),
									textContent: _Utils_ap(
										A2($elm$core$String$left, e.cursor, e.textContent),
										A2($elm$core$String$dropLeft, e.cursor + 1, e.textContent))
								}),
							A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID)) : _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
					} else {
						var _v25 = _v24.a;
						var beg = _v25.a;
						var end = _v25.b;
						return _Utils_Tuple2(
							A2(
								$author$project$Rte$detectFontStyle,
								beg,
								_Utils_update(
									e,
									{
										content: A3(h, beg, end + 1, e.content),
										cursor: beg,
										selection: $elm$core$Maybe$Nothing,
										textContent: _Utils_ap(
											A2($elm$core$String$left, beg, e.textContent),
											A2($elm$core$String$dropLeft, end + 1, e.textContent))
									})),
							A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
					}
				case 'End':
					return e.ctrlDown ? _Utils_Tuple2(
						A2(
							$author$project$Rte$detectFontStyle,
							maxIdx,
							A2(
								$author$project$Rte$selectionMod,
								e.cursor,
								_Utils_update(
									e,
									{cursor: maxIdx}))),
						A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID)) : (e.shiftDown ? A3(
						$author$project$Rte$locateChars,
						e,
						_Utils_Tuple2(e.cursor + 1, e.cursor + $author$project$Rte$jumpSize),
						$author$project$Rte$LineBoundary($author$project$Rte$Down)) : A3(
						$author$project$Rte$locateChars,
						_Utils_update(
							e,
							{selection: $elm$core$Maybe$Nothing}),
						_Utils_Tuple2(e.cursor + 1, e.cursor + $author$project$Rte$jumpSize),
						$author$project$Rte$LineBoundary($author$project$Rte$Down)));
				case 'Enter':
					return e.shiftDown ? A2(
						$author$project$Rte$update,
						A2($author$project$Rte$KeyDown, timeStamp, '\n'),
						e) : _Utils_Tuple2(
						A3(
							$author$project$Rte$insertBreak,
							A2($author$project$Rte$currentParaStyle, e.idCounter, e),
							$elm$core$Maybe$Just(timeStamp),
							e),
						A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID));
				case 'Home':
					return e.ctrlDown ? _Utils_Tuple2(
						A2(
							$author$project$Rte$detectFontStyle,
							0,
							A2(
								$author$project$Rte$selectionMod,
								e.cursor,
								_Utils_update(
									e,
									{cursor: 0}))),
						A2($author$project$Rte$placeCursor, $author$project$Rte$ScrollIfNeeded, e.editorID)) : (e.shiftDown ? A3(
						$author$project$Rte$locateChars,
						e,
						_Utils_Tuple2(e.cursor - $author$project$Rte$jumpSize, e.cursor - 1),
						$author$project$Rte$LineBoundary($author$project$Rte$Up)) : A3(
						$author$project$Rte$locateChars,
						_Utils_update(
							e,
							{selection: $elm$core$Maybe$Nothing}),
						_Utils_Tuple2(e.cursor - $author$project$Rte$jumpSize, e.cursor - 1),
						$author$project$Rte$LineBoundary($author$project$Rte$Up)));
				case 'PageDown':
					return _Utils_eq(e.cursor, maxIdx) ? _Utils_Tuple2(e, $elm$core$Platform$Cmd$none) : A3(
						$author$project$Rte$locateChars,
						e,
						A4($author$project$Rte$pageEstimate, $author$project$Rte$Down, maxIdx, e.cursor, e.viewport),
						$author$project$Rte$Page($author$project$Rte$Down));
				case 'PageUp':
					return (!e.cursor) ? _Utils_Tuple2(e, $elm$core$Platform$Cmd$none) : A3(
						$author$project$Rte$locateChars,
						e,
						A4($author$project$Rte$pageEstimate, $author$project$Rte$Up, maxIdx, e.cursor, e.viewport),
						$author$project$Rte$Page($author$project$Rte$Up));
				case 'Shift':
					return _Utils_Tuple2(
						_Utils_update(
							e,
							{shiftDown: true}),
						$elm$core$Platform$Cmd$none);
				default:
					return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
			}
		}
	});
var $author$project$Rte$update = F2(
	function (msg, e) {
		var throttleCursor = function (x) {
			if (msg.$ === 'KeyDown') {
				var key = msg.b;
				return A2($elm$core$String$startsWith, 'Arrow', key) ? _Utils_update(
					x,
					{cursorThrottled: true, cursorVisible: true}) : _Utils_update(
					x,
					{cursorThrottled: true, cursorVisible: false});
			} else {
				return x;
			}
		};
		return A2(
			$author$project$Rte$updateRest,
			msg,
			A2(
				$author$project$Rte$updateUndo,
				msg,
				throttleCursor(e)));
	});
var $author$project$Rte$updateRest = F2(
	function (msg, e) {
		var maxIdx = $elm$core$List$length(e.content) - 1;
		switch (msg.$) {
			case 'AddText':
				var txt = msg.a;
				return A3($author$project$Rte$typed, txt, e, $elm$core$Maybe$Nothing);
			case 'Blink':
				var time = msg.a;
				var typing = (_Utils_cmp(e.lastKeyDown, time - $author$project$Rte$tickPeriod) < 1) ? false : e.typing;
				var cursorVisible = e.cursorThrottled ? true : (!e.cursorVisible);
				return _Utils_Tuple2(
					_Utils_update(
						e,
						{cursorThrottled: typing, cursorVisible: cursorVisible, typing: typing}),
					$elm$core$Platform$Cmd$none);
			case 'Copy':
				return $author$project$Rte$copy(e);
			case 'Cut':
				return $author$project$Rte$cut(e);
			case 'DetectViewport':
				return _Utils_Tuple2(
					e,
					A2($author$project$Rte$placeCursor, $author$project$Rte$NoScroll, e.editorID));
			case 'KeyDown':
				var timeStamp = msg.a;
				var str = msg.b;
				return A3($author$project$Rte$keydownUpdate, timeStamp, str, e);
			case 'KeyUp':
				var str = msg.a;
				switch (str) {
					case 'Control':
						return _Utils_Tuple2(
							_Utils_update(
								e,
								{ctrlDown: false}),
							$elm$core$Platform$Cmd$none);
					case 'Shift':
						return _Utils_Tuple2(
							_Utils_update(
								e,
								{shiftDown: false}),
							$elm$core$Platform$Cmd$none);
					default:
						return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				}
			case 'LocatedChar':
				if (msg.b.$ === 'Ok') {
					var idx = msg.a;
					var data = msg.b.a;
					var locateBacklog = e.locateBacklog - 1;
					var elem = data.element;
					var located = A3(
						$elm_community$intdict$IntDict$insert,
						idx,
						A4($author$project$Rte$ScreenElement, idx, elem.x, elem.y, elem.height),
						e.located);
					var f = function (x) {
						return _Utils_update(
							x,
							{locateBacklog: locateBacklog, located: located});
					};
					if (locateBacklog > 0) {
						return (!_Utils_eq(e.locating, $author$project$Rte$Idle)) ? _Utils_Tuple2(
							f(e),
							$elm$core$Platform$Cmd$none) : _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
					} else {
						var _v2 = e.locating;
						switch (_v2.$) {
							case 'Idle':
								return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
							case 'LineBoundary':
								var a = _v2.a;
								var b = _v2.b;
								return A3(
									$author$project$Rte$lineBoundary,
									a,
									b,
									f(e));
							case 'LineJump':
								var a = _v2.a;
								var b = _v2.b;
								return A3(
									$author$project$Rte$lineJump,
									a,
									b,
									f(e));
							case 'Mouse':
								var a = _v2.a;
								var b = _v2.b;
								var c = _v2.c;
								return A4(
									$author$project$Rte$locateMouse,
									a,
									b,
									c,
									f(e));
							default:
								var a = _v2.a;
								var b = _v2.b;
								return A3(
									$author$project$Rte$page,
									a,
									b,
									f(e));
						}
					}
				} else {
					var err = msg.b.a;
					return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				}
			case 'MouseDown':
				var _v3 = msg.a;
				var x = _v3.a;
				var y = _v3.b;
				var timeStamp = msg.b;
				if ((timeStamp - e.lastMouseDown) <= 500) {
					var _v4 = e.locating;
					switch (_v4.$) {
						case 'Idle':
							return _Utils_Tuple2(
								$author$project$Rte$selectCurrentWord(e),
								$elm$core$Platform$Cmd$none);
						case 'Mouse':
							var a = _v4.a;
							var b = _v4.b;
							var c = _v4.c;
							return _Utils_Tuple2(
								_Utils_update(
									e,
									{
										locating: A3($author$project$Rte$Mouse, $author$project$Rte$SelectWord, b, c)
									}),
								$elm$core$Platform$Cmd$none);
						default:
							return A3(
								$author$project$Rte$mouseDown,
								_Utils_Tuple2(x, y),
								timeStamp,
								e);
					}
				} else {
					return A3(
						$author$project$Rte$mouseDown,
						_Utils_Tuple2(x, y),
						timeStamp,
						e);
				}
			case 'MouseMove':
				var targetId = msg.a;
				var timeStamp = msg.b;
				if ((timeStamp - e.lastMouseDown) < 200) {
					return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				} else {
					var _v5 = _Utils_Tuple2(
						e.drag,
						A2($author$project$Rte$getIdx, targetId, e.content));
					if ((_v5.a.$ === 'DragFrom') && (_v5.b.$ === 'Just')) {
						var startIdx = _v5.a.a;
						var currentIdx = _v5.b.a;
						var _v6 = (_Utils_cmp(startIdx, currentIdx) < 0) ? _Utils_Tuple2(
							_Utils_Tuple2(startIdx, currentIdx),
							A2($elm$core$Basics$min, maxIdx, currentIdx + 1)) : _Utils_Tuple2(
							_Utils_Tuple2(currentIdx, startIdx),
							currentIdx);
						var _v7 = _v6.a;
						var beg = _v7.a;
						var end = _v7.b;
						var newCursor = _v6.b;
						return _Utils_Tuple2(
							_Utils_update(
								e,
								{
									cursor: newCursor,
									selection: $elm$core$Maybe$Just(
										_Utils_Tuple2(beg, end))
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
					}
				}
			case 'MouseUp':
				return _Utils_Tuple2(
					_Utils_update(
						e,
						{
							drag: $author$project$Rte$NoDrag,
							selection: function () {
								var _v8 = e.selection;
								if (_v8.$ === 'Nothing') {
									return $elm$core$Maybe$Nothing;
								} else {
									var _v9 = _v8.a;
									var beg = _v9.a;
									var end = _v9.b;
									return ((_Utils_cmp(e.cursor, beg - 1) < 0) || (_Utils_cmp(e.cursor, end + 1) > 0)) ? $elm$core$Maybe$Nothing : e.selection;
								}
							}()
						}),
					$elm$core$Platform$Cmd$none);
			case 'NoOp':
				return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
			case 'Paste':
				var _this = msg.a;
				if (_this.$ === 'Nothing') {
					var _v11 = e.clipboard;
					if (_v11.$ === 'Nothing') {
						return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
					} else {
						var copied = _v11.a;
						return A2($author$project$Rte$pasteContent, copied, e);
					}
				} else {
					var txt = _this.a;
					return A3(
						$author$project$Rte$typed,
						txt,
						_Utils_update(
							e,
							{clipboard: $elm$core$Maybe$Nothing}),
						$elm$core$Maybe$Nothing);
				}
			case 'PlaceCursor1_EditorPos':
				if (msg.b.$ === 'Ok') {
					var scroll = msg.a;
					var data = msg.b.a;
					return _Utils_Tuple2(
						_Utils_update(
							e,
							{box: data.element}),
						A2(
							$author$project$Rte$getViewport,
							$author$project$Rte$PlaceCursor2_Viewport(scroll),
							e.editorID));
				} else {
					var err = msg.b.a;
					return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				}
			case 'PlaceCursor2_Viewport':
				if (msg.b.$ === 'Ok') {
					var scroll = msg.a;
					var data = msg.b.a;
					return A2(
						$author$project$Rte$locateCursorParent,
						_Utils_update(
							e,
							{viewport: data}),
						scroll);
				} else {
					var err = msg.b.a;
					return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				}
			case 'PlaceCursor3_CursorParent':
				if (msg.b.$ === 'Ok') {
					var scroll = msg.a;
					var data = msg.b.a;
					var f = function (x) {
						return _Utils_update(
							x,
							{
								nextCursorScreen: $elm$core$Maybe$Just(data.element)
							});
					};
					if (scroll.$ === 'ScrollIfNeeded') {
						return _Utils_Tuple2(
							f(e),
							A4($author$project$Rte$scrollIfNeeded, data.element, e.box, e.viewport, e.editorID));
					} else {
						return A2(
							$author$project$Rte$update,
							$author$project$Rte$Scrolled($elm$core$Maybe$Nothing),
							f(e));
					}
				} else {
					var err = msg.b.a;
					return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				}
			case 'Scrolled':
				var maybeFloat = msg.a;
				var f = function (x) {
					var _v14 = x.nextCursorScreen;
					if (_v14.$ === 'Nothing') {
						return x;
					} else {
						var y = _v14.a;
						return _Utils_update(
							x,
							{cursorScreen: y, nextCursorScreen: $elm$core$Maybe$Nothing});
					}
				};
				if (maybeFloat.$ === 'Nothing') {
					return _Utils_Tuple2(
						f(e),
						$elm$core$Platform$Cmd$none);
				} else {
					var scrollTop = maybeFloat.a;
					var g = function (x) {
						var vp0 = x.viewport;
						var vp1 = vp0.viewport;
						var yDelta = vp1.y - scrollTop;
						var cursorScreen = x.cursorScreen;
						return _Utils_update(
							x,
							{
								cursorScreen: _Utils_update(
									cursorScreen,
									{y: x.cursorScreen.y + yDelta}),
								sentry: x.sentry + 1,
								viewport: _Utils_update(
									vp0,
									{
										viewport: _Utils_update(
											vp1,
											{y: scrollTop})
									})
							});
					};
					return _Utils_Tuple2(
						g(
							f(e)),
						$elm$core$Platform$Cmd$none);
				}
			default:
				return $author$project$Rte$undoAction(e);
		}
	});
var $author$project$Rte$undo = function (e) {
	return A2($author$project$Rte$update, $author$project$Rte$UndoAction, e);
};
var $author$project$Rte$unlink = function (editor) {
	var f = function (elem) {
		if (elem.$ === 'Char') {
			var ch = elem.a;
			return $author$project$Rte$Char(
				_Utils_update(
					ch,
					{link: $elm$core$Maybe$Nothing}));
		} else {
			return elem;
		}
	};
	return A2($author$project$Rte$linkMod, f, editor);
};
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'Bold':
				return A2($author$project$Main$apply, $author$project$Rte$toggleBold, model);
			case 'Code':
				return A2(
					$author$project$Main$apply,
					$author$project$Rte$toggleParaClass('Code'),
					model);
			case 'Emoji':
				return A2(
					$author$project$Main$apply,
					$author$project$Rte$addContent($author$project$Main$emoji),
					model);
			case 'Font':
				var family = msg.a;
				return A2(
					$author$project$Main$apply,
					$author$project$Rte$fontFamily(family),
					model);
			case 'FontSize':
				var _float = msg.a;
				return A2(
					$author$project$Main$apply,
					$author$project$Rte$fontSize(_float),
					model);
			case 'Heading':
				return A2(
					$author$project$Main$apply,
					$author$project$Rte$toggleNodeType('h1'),
					model);
			case 'ImageAdd':
				var str = msg.a;
				if (str === '') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{inputBox: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none);
				} else {
					var _v1 = A2(
						$author$project$Rte$addImage,
						str,
						$author$project$Rte$activate(model.rte));
					var rte = _v1.a;
					var rteCmd = _v1.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{inputBox: $elm$core$Maybe$Nothing, rte: rte}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$Internal, rteCmd));
				}
			case 'ImageInput':
				var str = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							inputBox: $elm$core$Maybe$Just(
								$author$project$Main$ImageInputBox(str))
						}),
					$elm$core$Platform$Cmd$none);
			case 'Indent':
				return A2(
					$author$project$Main$apply,
					$author$project$Rte$changeIndent(1),
					model);
			case 'Internal':
				var rteMsg = msg.a;
				return A2(
					$author$project$Main$apply,
					$author$project$Rte$update(rteMsg),
					model);
			case 'Italic':
				return A2($author$project$Main$apply, $author$project$Rte$toggleItalic, model);
			case 'LinkAdd':
				var href = msg.a;
				return (href === '') ? _Utils_Tuple2(
					_Utils_update(
						model,
						{inputBox: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							inputBox: $elm$core$Maybe$Nothing,
							rte: A2(
								$author$project$Rte$link,
								href,
								$author$project$Rte$activate(model.rte))
						}),
					$elm$core$Platform$Cmd$none);
			case 'LinkInput':
				var str = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							inputBox: $elm$core$Maybe$Just(
								$author$project$Main$LinkInputBox(str))
						}),
					$elm$core$Platform$Cmd$none);
			case 'NoOp':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'StrikeThrough':
				return A2($author$project$Main$apply, $author$project$Rte$toggleStrikeThrough, model);
			case 'TextAlign':
				var alignment = msg.a;
				return A2(
					$author$project$Main$apply,
					$author$project$Rte$textAlign(alignment),
					model);
			case 'ToggleImageBox':
				var _v2 = model.inputBox;
				if ((_v2.$ === 'Just') && (_v2.a.$ === 'ImageInputBox')) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								inputBox: $elm$core$Maybe$Nothing,
								rte: $author$project$Rte$activate(model.rte)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								inputBox: $elm$core$Maybe$Just(
									$author$project$Main$ImageInputBox('')),
								rte: $author$project$Rte$inactivate(model.rte)
							}),
						A2(
							$elm$core$Task$attempt,
							function (_v3) {
								return $author$project$Main$NoOp;
							},
							$elm$browser$Browser$Dom$focus('InputBox')));
				}
			case 'ToggleLinkBox':
				var _v4 = model.inputBox;
				if ((_v4.$ === 'Just') && (_v4.a.$ === 'LinkInputBox')) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								inputBox: $elm$core$Maybe$Nothing,
								rte: $author$project$Rte$activate(model.rte)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var currentLink = A2(
						$elm$core$Maybe$withDefault,
						'',
						$author$project$Rte$currentLink(model.rte));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								inputBox: $elm$core$Maybe$Just(
									$author$project$Main$LinkInputBox(currentLink)),
								rte: $author$project$Rte$inactivate(model.rte)
							}),
						A2(
							$elm$core$Task$attempt,
							function (_v5) {
								return $author$project$Main$NoOp;
							},
							$elm$browser$Browser$Dom$focus('InputBox')));
				}
			case 'Underline':
				return A2($author$project$Main$apply, $author$project$Rte$toggleUnderline, model);
			case 'Undo':
				return A2($author$project$Main$apply, $author$project$Rte$undo, model);
			case 'Unindent':
				return A2(
					$author$project$Main$apply,
					$author$project$Rte$changeIndent(-1),
					model);
			default:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							rte: $author$project$Rte$unlink(model.rte)
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$html$Html$input = _VirtualDom_node('input');
var $author$project$Main$ImageAdd = function (a) {
	return {$: 'ImageAdd', a: a};
};
var $author$project$Main$ImageInput = function (a) {
	return {$: 'ImageInput', a: a};
};
var $author$project$Main$LinkAdd = function (a) {
	return {$: 'LinkAdd', a: a};
};
var $author$project$Main$LinkInput = function (a) {
	return {$: 'LinkInput', a: a};
};
var $author$project$Main$inputBoxProps = function (x) {
	if (x.$ === 'ImageInputBox') {
		var str = x.a;
		return {content: str, inputMsg: $author$project$Main$ImageInput, okMsg: $author$project$Main$ImageAdd, placeholder: 'Image url'};
	} else {
		var str = x.a;
		return {content: str, inputMsg: $author$project$Main$LinkInput, okMsg: $author$project$Main$LinkAdd, placeholder: 'Link url'};
	}
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$inputBox = function (state) {
	var _v0 = A2($elm$core$Maybe$map, $author$project$Main$inputBoxProps, state);
	if (_v0.$ === 'Just') {
		var props = _v0.a;
		var value = (props.content === '') ? $elm$html$Html$Attributes$placeholder(props.placeholder) : $elm$html$Html$Attributes$value(props.content);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('InputBox')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							value,
							$elm$html$Html$Attributes$type_('text'),
							$elm$html$Html$Events$onInput(props.inputMsg),
							$elm$html$Html$Attributes$id('InputBox')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							props.okMsg(props.content))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Ok')
						]))
				]));
	} else {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('InputBox'),
					A2($elm$html$Html$Attributes$style, 'visibility', 'hidden')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('text')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$button,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Ok')
						]))
				]));
	}
};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $author$project$Main$Bold = {$: 'Bold'};
var $author$project$Rte$Center = {$: 'Center'};
var $author$project$Main$Code = {$: 'Code'};
var $author$project$Main$Emoji = {$: 'Emoji'};
var $author$project$Main$Heading = {$: 'Heading'};
var $author$project$Main$Indent = {$: 'Indent'};
var $author$project$Main$Italic = {$: 'Italic'};
var $author$project$Rte$Left = {$: 'Left'};
var $author$project$Rte$Right = {$: 'Right'};
var $author$project$Main$StrikeThrough = {$: 'StrikeThrough'};
var $author$project$Main$TextAlign = function (a) {
	return {$: 'TextAlign', a: a};
};
var $author$project$Main$ToggleImageBox = {$: 'ToggleImageBox'};
var $author$project$Main$ToggleLinkBox = {$: 'ToggleLinkBox'};
var $author$project$Main$Underline = {$: 'Underline'};
var $author$project$Main$Undo = {$: 'Undo'};
var $author$project$Main$Unindent = {$: 'Unindent'};
var $author$project$Main$Unlink = {$: 'Unlink'};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Main$icon = F2(
	function (img, msg) {
		return A2(
			$elm$html$Html$img,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$src('/rte/icon/' + (img + '.svg')),
					$elm$html$Html$Attributes$class('Icon'),
					$elm$html$Html$Events$onClick(msg)
				]),
			_List_Nil);
	});
var $author$project$Main$Font = function (a) {
	return {$: 'Font', a: a};
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $author$project$Main$selectDecode = function (check) {
	var f = function (x) {
		var _v0 = check(x);
		if (_v0.$ === 'Just') {
			var msg = _v0.a;
			return $elm$json$Json$Decode$succeed(msg);
		} else {
			return $elm$json$Json$Decode$fail('bad value');
		}
	};
	return A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['target', 'value']),
		A2($elm$json$Json$Decode$andThen, f, $elm$json$Json$Decode$string));
};
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$Main$selectFont = function (maybeFontName) {
	var selected = function (x) {
		if (maybeFontName.$ === 'Nothing') {
			return false;
		} else {
			var y = maybeFontName.a;
			return _Utils_eq(x, y);
		}
	};
	var placeholder = A2(
		$elm$html$Html$option,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$disabled(true),
				$elm$html$Html$Attributes$selected(
				_Utils_eq(maybeFontName, $elm$core$Maybe$Nothing))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('font')
			]));
	var o = function (_v3) {
		var x = _v3.a;
		var y = _v3.b;
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value(x),
					$elm$html$Html$Attributes$selected(
					selected(x))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(x)
				]));
	};
	var fonts = _List_fromArray(
		[
			_Utils_Tuple2('Oswald', 'sans-serif'),
			_Utils_Tuple2('Playfair Display', 'serif'),
			_Utils_Tuple2('Ubuntu Mono', 'monospace')
		]);
	var toMsg = function (x) {
		var _v0 = A2(
			$elm$core$List$filter,
			function (_v1) {
				var a = _v1.a;
				var b = _v1.b;
				return _Utils_eq(a, x);
			},
			fonts);
		if (_v0.b) {
			var _v2 = _v0.a;
			var y = _v2.b;
			return $elm$core$Maybe$Just(
				$author$project$Main$Font(
					_List_fromArray(
						[x, y])));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	return A2(
		$elm$html$Html$select,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$Events$on,
				'change',
				$author$project$Main$selectDecode(toMsg))
			]),
		A2(
			$elm$core$List$cons,
			placeholder,
			A2($elm$core$List$map, o, fonts)));
};
var $author$project$Main$FontSize = function (a) {
	return {$: 'FontSize', a: a};
};
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Main$selectFontSize = function (maybeSize) {
	var toMsg = function (x) {
		return A2(
			$elm$core$Maybe$map,
			$author$project$Main$FontSize,
			$elm$core$String$toFloat(x));
	};
	var selected = function (x) {
		if (maybeSize.$ === 'Nothing') {
			return false;
		} else {
			var y = maybeSize.a;
			return _Utils_eq(x, y);
		}
	};
	var range = F2(
		function (x, y) {
			return A2(
				$elm$core$List$map,
				function (a) {
					return a + x;
				},
				A2(
					$elm$core$List$map,
					function (a) {
						return 2 * a;
					},
					A2($elm$core$List$range, 0, ((y - x) / 2) | 0)));
		});
	var placeholder = A2(
		$elm$html$Html$option,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$disabled(true),
				$elm$html$Html$Attributes$selected(
				_Utils_eq(maybeSize, $elm$core$Maybe$Nothing))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('size')
			]));
	var o = function (x) {
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value(
					$elm$core$String$fromInt(x)),
					$elm$html$Html$Attributes$selected(
					selected(x))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$elm$core$String$fromInt(x))
				]));
	};
	return A2(
		$elm$html$Html$select,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$Events$on,
				'change',
				$author$project$Main$selectDecode(toMsg))
			]),
		A2(
			$elm$core$List$cons,
			placeholder,
			A2(
				$elm$core$List$map,
				o,
				A2(range, 6, 30))));
};
var $author$project$Main$toolbar = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('Toolbar')
			]),
		_List_fromArray(
			[
				A2($author$project$Main$icon, 'Bold', $author$project$Main$Bold),
				A2($author$project$Main$icon, 'Italic', $author$project$Main$Italic),
				A2($author$project$Main$icon, 'Underline', $author$project$Main$Underline),
				A2($author$project$Main$icon, 'Strikethrough', $author$project$Main$StrikeThrough),
				A2($author$project$Main$icon, 'Undo', $author$project$Main$Undo),
				A2(
				$author$project$Main$icon,
				'Left',
				$author$project$Main$TextAlign($author$project$Rte$Left)),
				A2(
				$author$project$Main$icon,
				'Center',
				$author$project$Main$TextAlign($author$project$Rte$Center)),
				A2(
				$author$project$Main$icon,
				'Right',
				$author$project$Main$TextAlign($author$project$Rte$Right)),
				A2($author$project$Main$icon, 'Unindent', $author$project$Main$Unindent),
				A2($author$project$Main$icon, 'Indent', $author$project$Main$Indent),
				A2($author$project$Main$icon, 'Heading', $author$project$Main$Heading),
				A2($author$project$Main$icon, 'Coding', $author$project$Main$Code),
				A2($author$project$Main$icon, 'Emoji', $author$project$Main$Emoji),
				A2($author$project$Main$icon, 'Link', $author$project$Main$ToggleLinkBox),
				A2($author$project$Main$icon, 'Unlink', $author$project$Main$Unlink),
				A2($author$project$Main$icon, 'Picture', $author$project$Main$ToggleImageBox),
				$author$project$Main$selectFontSize(model.rte.fontStyle.fontSize),
				$author$project$Main$selectFont(
				$elm$core$List$head(model.rte.fontStyle.fontFamily))
			]));
};
var $author$project$Rte$cursorColor = A2($elm$html$Html$Attributes$style, 'border-color', 'black');
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Rte$px = function (x) {
	return $elm$core$String$fromFloat(x) + 'px';
};
var $author$project$Rte$cursorHtml = F6(
	function (cursor, box, visible, typing, selection, idx) {
		if (typing || (!visible)) {
			return A2($elm$html$Html$div, _List_Nil, _List_Nil);
		} else {
			var cHeight = cursor.height;
			var onScreen = (_Utils_cmp(cursor.y + cHeight, box.y) > -1) && ((_Utils_cmp(cursor.y, box.y + box.height) < 1) && ((_Utils_cmp(cursor.x, box.x) > -1) && (_Utils_cmp(cursor.x, box.x + box.width) < 1)));
			return (!onScreen) ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'border-left', '3px solid'),
						$author$project$Rte$cursorColor,
						A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
						A2(
						$elm$html$Html$Attributes$style,
						'height',
						$author$project$Rte$px(cHeight)),
						A2(
						$elm$html$Html$Attributes$style,
						'left',
						$author$project$Rte$px(cursor.x)),
						A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
						A2(
						$elm$html$Html$Attributes$style,
						'top',
						$author$project$Rte$px(cursor.y))
					]),
				_List_Nil);
		}
	});
var $elm$virtual_dom$VirtualDom$lazy = _VirtualDom_lazy;
var $elm$html$Html$Lazy$lazy = $elm$virtual_dom$VirtualDom$lazy;
var $author$project$Rte$MouseDown = F2(
	function (a, b) {
		return {$: 'MouseDown', a: a, b: b};
	});
var $author$project$Rte$Paragraph = F3(
	function (idx, children, lineBreak) {
		return {children: children, idx: idx, lineBreak: lineBreak};
	});
var $author$project$Rte$breakIntoParas = function (content) {
	var maxIdx = $elm$core$List$length(content) - 1;
	var f = F2(
		function (elem, _v2) {
			var idx = _v2.a;
			var ys = _v2.b;
			if (elem.$ === 'Break') {
				var br = elem.a;
				return _Utils_Tuple2(
					idx - 1,
					A2(
						$elm$core$List$cons,
						A3($author$project$Rte$Paragraph, idx, _List_Nil, br),
						ys));
			} else {
				if (!ys.b) {
					return _Utils_Tuple2(idx - 1, _List_Nil);
				} else {
					var x = ys.a;
					var rest = ys.b;
					return _Utils_Tuple2(
						idx - 1,
						A2(
							$elm$core$List$cons,
							_Utils_update(
								x,
								{
									children: A2(
										$elm$core$List$cons,
										_Utils_Tuple2(idx, elem),
										x.children)
								}),
							rest));
				}
			}
		});
	return A3(
		$elm$core$List$foldr,
		f,
		_Utils_Tuple2(maxIdx, _List_Nil),
		content).b;
};
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Rte$decodeMouse = function (toMsg) {
	var tagger = F3(
		function (x, y, z) {
			return A2(
				toMsg,
				_Utils_Tuple2(x, y),
				z);
		});
	return A4(
		$elm$json$Json$Decode$map3,
		tagger,
		A2($elm$json$Json$Decode$field, 'clientX', $elm$json$Json$Decode$float),
		A2($elm$json$Json$Decode$field, 'clientY', $elm$json$Json$Decode$float),
		A2($elm$json$Json$Decode$field, 'timeStamp', $elm$json$Json$Decode$float));
};
var $author$project$Rte$dehighlight = function (elem) {
	switch (elem.$) {
		case 'Break':
			var br = elem.a;
			return $author$project$Rte$Break(
				_Utils_update(
					br,
					{highlightClasses: _List_Nil, highlightIndent: 0, highlightStyling: _List_Nil}));
		case 'Char':
			var ch = elem.a;
			return $author$project$Rte$Char(
				_Utils_update(
					ch,
					{highlightClasses: _List_Nil, highlightStyling: _List_Nil}));
		default:
			var html = elem.a;
			return $author$project$Rte$Embedded(
				_Utils_update(
					html,
					{highlightClasses: _List_Nil, highlightStyling: _List_Nil}));
	}
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $author$project$Rte$defaultCharacter = F2(
	function (_char, id) {
		return {_char: _char, fontStyle: $author$project$Rte$emptyFontStyle, highlightClasses: _List_Nil, highlightStyling: _List_Nil, id: id, link: $elm$core$Maybe$Nothing};
	});
var $author$project$Rte$attributes = function (elem) {
	var g = function (_v1) {
		var x = _v1.a;
		var y = _v1.b;
		return A2($elm$html$Html$Attributes$style, x, y);
	};
	var f = function (x) {
		return $elm$html$Html$Attributes$class(x);
	};
	var h = function (x) {
		return _Utils_ap(
			A2(
				$elm$core$List$map,
				f,
				_Utils_ap(x.classes, x.highlightClasses)),
			A2(
				$elm$core$List$map,
				g,
				_Utils_ap(x.styling, x.highlightStyling)));
	};
	switch (elem.$) {
		case 'Break':
			var b = elem.a;
			return h(b);
		case 'Char':
			var c = elem.a;
			return _Utils_ap(
				A2(
					$elm$core$List$map,
					f,
					_Utils_ap(c.fontStyle.classes, c.highlightClasses)),
				A2(
					$elm$core$List$map,
					g,
					_Utils_ap(c.fontStyle.styling, c.highlightStyling)));
		default:
			var html = elem.a;
			return h(html);
	}
};
var $author$project$Rte$cursorHtml2 = F3(
	function (cursor, selection, idx) {
		var cHeight = cursor.height;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'border-left', '3px solid'),
					$author$project$Rte$cursorColor,
					A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
					A2(
					$elm$html$Html$Attributes$style,
					'height',
					$author$project$Rte$px(cHeight)),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'position', 'absolute'),
					A2($elm$html$Html$Attributes$style, 'top', '0')
				]),
			_List_Nil);
	});
var $elm$core$String$trim = _String_trim;
var $author$project$Rte$singleQuote = function (x) {
	var trimmed = $elm$core$String$trim(x);
	var reserved = _List_fromArray(
		['monospace', 'serif', 'sans-serif']);
	return A2($elm$core$List$member, trimmed, reserved) ? trimmed : ('\'' + (trimmed + '\''));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Rte$showChar = F9(
	function (editing, selection, selectionStyle, cursor, cursorScreen, typing, idx, fontSizeUnit, ch) {
		var unit = A2($elm$core$Maybe$withDefault, 'px', fontSizeUnit);
		var size = function () {
			var _v3 = ch.fontStyle.fontSize;
			if (_v3.$ === 'Nothing') {
				return _List_Nil;
			} else {
				var x = _v3.a;
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$Attributes$style,
						'font-size',
						_Utils_ap(
							$elm$core$String$fromFloat(x),
							unit))
					]);
			}
		}();
		var select = function () {
			if (selection.$ === 'Just') {
				var _v2 = selection.a;
				var beg = _v2.a;
				var end = _v2.b;
				return ((_Utils_cmp(idx, beg) > -1) && (_Utils_cmp(idx, end) < 1)) ? selectionStyle : _List_Nil;
			} else {
				return _List_Nil;
			}
		}();
		var position = (typing && _Utils_eq(idx, cursor)) ? _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'relative')
			]) : _List_Nil;
		var linked = function (x) {
			var _v0 = ch.link;
			if (_v0.$ === 'Nothing') {
				return x;
			} else {
				var href = _v0.a;
				return A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(href)
						]),
					_List_fromArray(
						[x]));
			}
		};
		var id = $elm$core$String$fromInt(ch.id);
		var fontFamilyAttr = _Utils_eq(ch.fontStyle.fontFamily, _List_Nil) ? _List_Nil : _List_fromArray(
			[
				A2(
				$elm$html$Html$Attributes$style,
				'font-family',
				A2(
					$elm$core$String$join,
					',',
					A2($elm$core$List$map, $author$project$Rte$singleQuote, ch.fontStyle.fontFamily)))
			]);
		var child = (typing && _Utils_eq(idx, cursor)) ? _List_fromArray(
			[
				linked(
				$elm$html$Html$text(ch._char)),
				A3($author$project$Rte$cursorHtml2, cursorScreen, selection, cursor)
			]) : _List_fromArray(
			[
				linked(
				$elm$html$Html$text(ch._char))
			]);
		return _Utils_Tuple2(
			id,
			A2(
				$elm$html$Html$span,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$id(id),
					_Utils_ap(
						$author$project$Rte$attributes(
							$author$project$Rte$Char(ch)),
						_Utils_ap(
							fontFamilyAttr,
							_Utils_ap(
								position,
								_Utils_ap(select, size))))),
				child));
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $author$project$Rte$showEmbedded = function (html) {
	var textChild = function () {
		var _v4 = html.text;
		if (_v4.$ === 'Nothing') {
			return _List_Nil;
		} else {
			var txt = _v4.a;
			return _List_fromArray(
				[
					$elm$html$Html$text(txt)
				]);
		}
	}();
	var g = function (_v3) {
		var x = _v3.a;
		var y = _v3.b;
		return A2($elm$html$Html$Attributes$attribute, x, y);
	};
	var f = function (x) {
		var y = x.a;
		return $author$project$Rte$showEmbedded(y);
	};
	var attrs = _Utils_ap(
		$author$project$Rte$attributes(
			$author$project$Rte$Embedded(html)),
		A2($elm$core$List$map, g, html.attributes));
	var _v0 = html.nodeType;
	if (_v0.$ === 'Nothing') {
		if (!textChild.b) {
			return A2($elm$html$Html$div, _List_Nil, _List_Nil);
		} else {
			var x = textChild.a;
			return x;
		}
	} else {
		var x = _v0.a;
		return A3(
			$elm$html$Html$node,
			x,
			attrs,
			_Utils_ap(
				textChild,
				A2($elm$core$List$map, f, html.children)));
	}
};
var $author$project$Rte$wrap = F2(
	function (_v0, l) {
		var amount = _v0.a;
		var unit = _v0.b;
		var str = F2(
			function (x, y) {
				return _Utils_ap(
					$elm$core$String$fromInt(x),
					y);
			});
		var indentation = l.indent + l.highlightIndent;
		var indentStr = _Utils_ap(
			$elm$core$String$fromFloat(indentation * amount),
			unit);
		var indentAttr = (indentation > 0) ? _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'padding-left', indentStr),
				A2($elm$html$Html$Attributes$style, 'padding-right', indentStr)
			]) : _List_Nil;
		var addId = F3(
			function (x, func, ys) {
				return _Utils_Tuple2(
					x,
					func(ys));
			});
		var _v1 = l.nodeType;
		if (_v1.$ === 'Nothing') {
			return A2(
				addId,
				A2(str, l.id, 'wrap'),
				A2(
					$elm$html$Html$Keyed$node,
					'div',
					_Utils_ap(
						indentAttr,
						$author$project$Rte$attributes(
							$author$project$Rte$Break(l)))));
		} else {
			var nodeType = _v1.a;
			return A2(
				addId,
				A2(str, l.id, 'wrap'),
				A2(
					$elm$html$Html$Keyed$node,
					nodeType,
					_Utils_ap(
						indentAttr,
						$author$project$Rte$attributes(
							$author$project$Rte$Break(l)))));
		}
	});
var $author$project$Rte$showPara = F9(
	function (editing, cursor, cursorScreen, maybeIndentUnit, selection, selectionStyle, typing, fontSizeUnit, p) {
		var show = F2(
			function (idx, ch) {
				return A9($author$project$Rte$showChar, editing, selection, selectionStyle, cursor, cursorScreen, typing, idx, fontSizeUnit, ch);
			});
		var zeroSpace = F2(
			function (idx, id) {
				return A2(
					show,
					idx,
					A2($author$project$Rte$defaultCharacter, $author$project$Rte$zeroWidthSpace, id));
			});
		var indentUnit = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(50, 'px'),
			maybeIndentUnit);
		var f = function (html) {
			return _Utils_Tuple2(
				$elm$core$String$fromInt(html.id) + 'embed',
				$author$project$Rte$showEmbedded(html));
		};
		var g = F2(
			function (_v1, ys) {
				var idx = _v1.a;
				var elem = _v1.b;
				switch (elem.$) {
					case 'Break':
						var br = elem.a;
						return ys;
					case 'Char':
						var ch = elem.a;
						return A2(
							$elm$core$List$cons,
							A2(show, idx, ch),
							ys);
					default:
						var html = elem.a;
						return A2(
							$elm$core$List$cons,
							A2(zeroSpace, idx, html.id),
							A2(
								$elm$core$List$cons,
								f(html),
								ys));
				}
			});
		return A2($author$project$Rte$wrap, indentUnit, p.lineBreak)(
			A3(
				$elm$core$List$foldr,
				g,
				_List_fromArray(
					[
						A2(zeroSpace, p.idx, p.lineBreak.id)
					]),
				p.children));
	});
var $author$project$Rte$showContent = F2(
	function (userDefinedStyles, e) {
		var highlight = function () {
			var _v0 = e.highlighter;
			if (_v0.$ === 'Just') {
				var f = _v0.a;
				return A2(
					$elm$core$Basics$composeL,
					f,
					$elm$core$List$map($author$project$Rte$dehighlight));
			} else {
				return $elm$core$Basics$identity;
			}
		}();
		var paragraphs = A2(
			$elm$core$List$map,
			A8($author$project$Rte$showPara, e.active, e.cursor, e.cursorScreen, e.indentUnit, e.selection, e.selectionStyle, e.typing, e.fontSizeUnit),
			$author$project$Rte$breakIntoParas(
				highlight(e.content)));
		var attrs = _Utils_ap(
			userDefinedStyles,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'cursor', 'text'),
					A2($elm$html$Html$Attributes$style, 'overflow', 'auto'),
					A2($elm$html$Html$Attributes$style, 'user-select', 'none'),
					A2($elm$html$Html$Attributes$style, 'white-space', 'pre-wrap'),
					A2($elm$html$Html$Attributes$style, 'word-break', 'break-word'),
					$elm$html$Html$Attributes$id(e.editorID),
					A2(
					$elm$html$Html$Events$on,
					'mousedown',
					$author$project$Rte$decodeMouse($author$project$Rte$MouseDown)),
					A2(
					$elm$html$Html$Events$on,
					'scroll',
					A2(
						$elm$json$Json$Decode$map,
						A2($elm$core$Basics$composeL, $author$project$Rte$Scrolled, $elm$core$Maybe$Just),
						A2(
							$elm$json$Json$Decode$at,
							_List_fromArray(
								['target', 'scrollTop']),
							$elm$json$Json$Decode$float)))
				]));
		return A3($elm$html$Html$Keyed$node, 'div', attrs, paragraphs);
	});
var $author$project$Rte$view = F2(
	function (userDefinedStyles, e) {
		var g = function (_v1) {
			return A6($author$project$Rte$cursorHtml, e.cursorScreen, e.box, e.cursorVisible, e.typing, e.selection, e.cursor);
		};
		var f = function (_v0) {
			return A2($author$project$Rte$showContent, userDefinedStyles, e);
		};
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$Lazy$lazy(f)(e.sentry),
					$elm$html$Html$Lazy$lazy(g)(e.sentry)
				]));
	});
var $author$project$Main$view = function (model) {
	var rteCss = _List_fromArray(
		[
			$elm$html$Html$Attributes$class('RTE')
		]);
	return {
		body: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('Wrap')
					]),
				_List_fromArray(
					[
						$author$project$Main$toolbar(model),
						$author$project$Main$inputBox(model.inputBox),
						A2(
						$elm$html$Html$map,
						$author$project$Main$Internal,
						A2($author$project$Rte$view, rteCss, model.rte)),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://github.com/dkodaj/rte'),
								$elm$html$Html$Attributes$class('Source')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Source')
							]))
					]))
			]),
		title: 'RTE demo'
	};
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));