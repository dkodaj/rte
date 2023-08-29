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
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
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



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}



// BYTES

function _Bytes_width(bytes)
{
	return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function(le, be)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be));
	});
});


// ENCODERS

function _Bytes_encode(encoder)
{
	var mutableBytes = new DataView(new ArrayBuffer($elm$bytes$Bytes$Encode$getWidth(encoder)));
	$elm$bytes$Bytes$Encode$write(encoder)(mutableBytes)(0);
	return mutableBytes;
}


// SIGNED INTEGERS

var _Bytes_write_i8  = F3(function(mb, i, n) { mb.setInt8(i, n); return i + 1; });
var _Bytes_write_i16 = F4(function(mb, i, n, isLE) { mb.setInt16(i, n, isLE); return i + 2; });
var _Bytes_write_i32 = F4(function(mb, i, n, isLE) { mb.setInt32(i, n, isLE); return i + 4; });


// UNSIGNED INTEGERS

var _Bytes_write_u8  = F3(function(mb, i, n) { mb.setUint8(i, n); return i + 1 ;});
var _Bytes_write_u16 = F4(function(mb, i, n, isLE) { mb.setUint16(i, n, isLE); return i + 2; });
var _Bytes_write_u32 = F4(function(mb, i, n, isLE) { mb.setUint32(i, n, isLE); return i + 4; });


// FLOATS

var _Bytes_write_f32 = F4(function(mb, i, n, isLE) { mb.setFloat32(i, n, isLE); return i + 4; });
var _Bytes_write_f64 = F4(function(mb, i, n, isLE) { mb.setFloat64(i, n, isLE); return i + 8; });


// BYTES

var _Bytes_write_bytes = F3(function(mb, offset, bytes)
{
	for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4)
	{
		mb.setUint32(offset + i, bytes.getUint32(i));
	}
	for (; i < len; i++)
	{
		mb.setUint8(offset + i, bytes.getUint8(i));
	}
	return offset + len;
});


// STRINGS

function _Bytes_getStringWidth(string)
{
	for (var width = 0, i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		width +=
			(code < 0x80) ? 1 :
			(code < 0x800) ? 2 :
			(code < 0xD800 || 0xDBFF < code) ? 3 : (i++, 4);
	}
	return width;
}

var _Bytes_write_string = F3(function(mb, offset, string)
{
	for (var i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		offset +=
			(code < 0x80)
				? (mb.setUint8(offset, code)
				, 1
				)
				:
			(code < 0x800)
				? (mb.setUint16(offset, 0xC080 /* 0b1100000010000000 */
					| (code >>> 6 & 0x1F /* 0b00011111 */) << 8
					| code & 0x3F /* 0b00111111 */)
				, 2
				)
				:
			(code < 0xD800 || 0xDBFF < code)
				? (mb.setUint16(offset, 0xE080 /* 0b1110000010000000 */
					| (code >>> 12 & 0xF /* 0b00001111 */) << 8
					| code >>> 6 & 0x3F /* 0b00111111 */)
				, mb.setUint8(offset + 2, 0x80 /* 0b10000000 */
					| code & 0x3F /* 0b00111111 */)
				, 3
				)
				:
			(code = (code - 0xD800) * 0x400 + string.charCodeAt(++i) - 0xDC00 + 0x10000
			, mb.setUint32(offset, 0xF0808080 /* 0b11110000100000001000000010000000 */
				| (code >>> 18 & 0x7 /* 0b00000111 */) << 24
				| (code >>> 12 & 0x3F /* 0b00111111 */) << 16
				| (code >>> 6 & 0x3F /* 0b00111111 */) << 8
				| code & 0x3F /* 0b00111111 */)
			, 4
			);
	}
	return offset;
});


// DECODER

var _Bytes_decode = F2(function(decoder, bytes)
{
	try {
		return $elm$core$Maybe$Just(A2(decoder, bytes, 0).b);
	} catch(e) {
		return $elm$core$Maybe$Nothing;
	}
});

var _Bytes_read_i8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getInt8(offset)); });
var _Bytes_read_i16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getInt16(offset, isLE)); });
var _Bytes_read_i32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getInt32(offset, isLE)); });
var _Bytes_read_u8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getUint8(offset)); });
var _Bytes_read_u16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getUint16(offset, isLE)); });
var _Bytes_read_u32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getUint32(offset, isLE)); });
var _Bytes_read_f32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getFloat32(offset, isLE)); });
var _Bytes_read_f64 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 8, bytes.getFloat64(offset, isLE)); });

var _Bytes_read_bytes = F3(function(len, bytes, offset)
{
	return _Utils_Tuple2(offset + len, new DataView(bytes.buffer, bytes.byteOffset + offset, len));
});

var _Bytes_read_string = F3(function(len, bytes, offset)
{
	var string = '';
	var end = offset + len;
	for (; offset < end;)
	{
		var byte = bytes.getUint8(offset++);
		string +=
			(byte < 128)
				? String.fromCharCode(byte)
				:
			((byte & 0xE0 /* 0b11100000 */) === 0xC0 /* 0b11000000 */)
				? String.fromCharCode((byte & 0x1F /* 0b00011111 */) << 6 | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */)
				:
			((byte & 0xF0 /* 0b11110000 */) === 0xE0 /* 0b11100000 */)
				? String.fromCharCode(
					(byte & 0xF /* 0b00001111 */) << 12
					| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
					| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
				)
				:
				(byte =
					((byte & 0x7 /* 0b00000111 */) << 18
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 12
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
						| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
					) - 0x10000
				, String.fromCharCode(Math.floor(byte / 0x400) + 0xD800, byte % 0x400 + 0xDC00)
				);
	}
	return _Utils_Tuple2(offset, string);
});

var _Bytes_decodeFailure = F2(function() { throw 0; });
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
var $author$project$Main$Rte = function (a) {
	return {$: 'Rte', a: a};
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $dkodaj$rte$MiniRte$Types$Break = function (a) {
	return {$: 'Break', a: a};
};
var $dkodaj$rte$MiniRte$Types$Char = function (a) {
	return {$: 'Char', a: a};
};
var $dkodaj$rte$MiniRte$Types$Embedded = function (a) {
	return {$: 'Embedded', a: a};
};
var $dkodaj$rte$MiniRte$Types$Character = F6(
	function (_char, fontStyle, highlightClasses, highlightStyling, id, link) {
		return {_char: _char, fontStyle: fontStyle, highlightClasses: highlightClasses, highlightStyling: highlightStyling, id: id, link: link};
	});
var $dkodaj$rte$MiniRte$Types$FontStyle = F4(
	function (classes, fontFamily, fontSize, styling) {
		return {classes: classes, fontFamily: fontFamily, fontSize: fontSize, styling: styling};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $dkodaj$rte$MiniRte$Core$decodeTuple_String_String_ = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a1, a2) {
			return _Utils_Tuple2(a1, a2);
		}),
	A2($elm$json$Json$Decode$field, 'A1', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'A2', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $dkodaj$rte$MiniRte$Core$decodeStyleTags = $elm$json$Json$Decode$list($dkodaj$rte$MiniRte$Core$decodeTuple_String_String_);
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
var $dkodaj$rte$MiniRte$Core$decodeFontStyle = A5(
	$elm$json$Json$Decode$map4,
	$dkodaj$rte$MiniRte$Types$FontStyle,
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
	A2($elm$json$Json$Decode$field, 'styling', $dkodaj$rte$MiniRte$Core$decodeStyleTags));
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$map6 = _Json_map6;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $dkodaj$rte$MiniRte$Core$decodeCharacter = function () {
	var toChar = function (x) {
		var _v0 = $elm$core$String$uncons(x);
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var _char = _v1.a;
			return $elm$json$Json$Decode$succeed(_char);
		} else {
			return $elm$json$Json$Decode$fail('Not convertible into a Char: ' + x);
		}
	};
	return A7(
		$elm$json$Json$Decode$map6,
		$dkodaj$rte$MiniRte$Types$Character,
		A2(
			$elm$json$Json$Decode$field,
			'char',
			A2($elm$json$Json$Decode$andThen, toChar, $elm$json$Json$Decode$string)),
		A2($elm$json$Json$Decode$field, 'fontStyle', $dkodaj$rte$MiniRte$Core$decodeFontStyle),
		$elm$json$Json$Decode$succeed(_List_Nil),
		$elm$json$Json$Decode$succeed(_List_Nil),
		$elm$json$Json$Decode$succeed(-1),
		A2(
			$elm$json$Json$Decode$field,
			'link',
			$elm$json$Json$Decode$maybe($elm$json$Json$Decode$string)));
}();
var $dkodaj$rte$MiniRte$Types$Child = function (a) {
	return {$: 'Child', a: a};
};
var $dkodaj$rte$MiniRte$Types$EmbeddedHtml = F9(
	function (attributes, classes, children, highlightClasses, highlightStyling, id, nodeType, styling, text) {
		return {attributes: attributes, children: children, classes: classes, highlightClasses: highlightClasses, highlightStyling: highlightStyling, id: id, nodeType: nodeType, styling: styling, text: text};
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$hardcoded = A2($elm$core$Basics$composeR, $elm$json$Json$Decode$succeed, $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom);
var $elm$json$Json$Decode$map3 = _Json_map3;
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
function $dkodaj$rte$MiniRte$Core$cyclic$decodeEmbeddedHtml() {
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
							$dkodaj$rte$MiniRte$Core$cyclic$decodeEmbeddedHtml(),
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
						children: A2($elm$core$List$map, $dkodaj$rte$MiniRte$Types$Child, children)
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
			$dkodaj$rte$MiniRte$Core$decodeStyleTags,
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
										$elm$json$Json$Decode$list($dkodaj$rte$MiniRte$Core$decodeTuple_String_String_),
										$elm$json$Json$Decode$succeed($dkodaj$rte$MiniRte$Types$EmbeddedHtml))))))))));
	var g = A3(
		$elm$json$Json$Decode$map2,
		$elm$core$Tuple$pair,
		f,
		A2(
			$elm$json$Json$Decode$field,
			'children',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
	var decodeListener = A4(
		$elm$json$Json$Decode$map3,
		F3(
			function (x, y, z) {
				return {at: z, on: x, tag: y};
			}),
		A2($elm$json$Json$Decode$field, 'on', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'tag', $elm$json$Json$Decode$string),
		A2(
			$elm$json$Json$Decode$field,
			'at',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
	return A2($elm$json$Json$Decode$andThen, i, g);
}
try {
	var $dkodaj$rte$MiniRte$Core$decodeEmbeddedHtml = $dkodaj$rte$MiniRte$Core$cyclic$decodeEmbeddedHtml();
	$dkodaj$rte$MiniRte$Core$cyclic$decodeEmbeddedHtml = function () {
		return $dkodaj$rte$MiniRte$Core$decodeEmbeddedHtml;
	};
} catch ($) {
	throw 'Some top-level definitions from `MiniRte.Core` are causing infinite recursion:\n\n  ┌─────┐\n  │    decodeEmbeddedHtml\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $dkodaj$rte$MiniRte$Types$LineBreak = F8(
	function (classes, highlightClasses, highlightIndent, highlightStyling, id, indent, nodeType, styling) {
		return {classes: classes, highlightClasses: highlightClasses, highlightIndent: highlightIndent, highlightStyling: highlightStyling, id: id, indent: indent, nodeType: nodeType, styling: styling};
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map8 = _Json_map8;
var $dkodaj$rte$MiniRte$Core$decodeLineBreak = A9(
	$elm$json$Json$Decode$map8,
	$dkodaj$rte$MiniRte$Types$LineBreak,
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
	A2($elm$json$Json$Decode$field, 'styling', $dkodaj$rte$MiniRte$Core$decodeStyleTags));
var $dkodaj$rte$MiniRte$Core$decodeElementHelp = function (constructor) {
	switch (constructor) {
		case 'Break':
			return A2(
				$elm$json$Json$Decode$map,
				$dkodaj$rte$MiniRte$Types$Break,
				A2($elm$json$Json$Decode$field, 'A1', $dkodaj$rte$MiniRte$Core$decodeLineBreak));
		case 'Char':
			return A2(
				$elm$json$Json$Decode$map,
				$dkodaj$rte$MiniRte$Types$Char,
				A2($elm$json$Json$Decode$field, 'A1', $dkodaj$rte$MiniRte$Core$decodeCharacter));
		case 'Embedded':
			return A2(
				$elm$json$Json$Decode$map,
				$dkodaj$rte$MiniRte$Types$Embedded,
				A2($elm$json$Json$Decode$field, 'A1', $dkodaj$rte$MiniRte$Core$decodeEmbeddedHtml));
		default:
			var other = constructor;
			return $elm$json$Json$Decode$fail('Unknown constructor for type Element: ' + other);
	}
};
var $dkodaj$rte$MiniRte$Core$decodeElement = A2(
	$elm$json$Json$Decode$andThen,
	$dkodaj$rte$MiniRte$Core$decodeElementHelp,
	A2($elm$json$Json$Decode$field, 'Constructor', $elm$json$Json$Decode$string));
var $dkodaj$rte$MiniRte$Core$decodeContent = $elm$json$Json$Decode$list($dkodaj$rte$MiniRte$Core$decodeElement);
var $dkodaj$rte$MiniRte$Core$decodeErrorToString = function (err) {
	decodeErrorToString:
	while (true) {
		switch (err.$) {
			case 'Field':
				var x = err.b;
				var $temp$err = x;
				err = $temp$err;
				continue decodeErrorToString;
			case 'Index':
				var x = err.b;
				var $temp$err = x;
				err = $temp$err;
				continue decodeErrorToString;
			case 'OneOf':
				var list = err.a;
				return A2(
					$elm$core$String$join,
					'; ',
					A2($elm$core$List$map, $dkodaj$rte$MiniRte$Core$decodeErrorToString, list));
			default:
				var x = err.a;
				return x;
		}
	}
};
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $dkodaj$rte$MiniRte$Core$decodeContentString = function (str) {
	return A2(
		$elm$core$Result$mapError,
		$dkodaj$rte$MiniRte$Core$decodeErrorToString,
		A2($elm$json$Json$Decode$decodeString, $dkodaj$rte$MiniRte$Core$decodeContent, str));
};
var $dkodaj$rte$MiniRte$decodeContentString = $dkodaj$rte$MiniRte$Core$decodeContentString;
var $author$project$Highlighter$NeutralZone = {$: 'NeutralZone'};
var $author$project$Highlighter$OpeningTagEnded = {$: 'OpeningTagEnded'};
var $author$project$Highlighter$TagOpened = {$: 'TagOpened'};
var $author$project$Highlighter$WithinClosingTag = {$: 'WithinClosingTag'};
var $elm$core$Basics$not = _Basics_not;
var $author$project$Highlighter$highlight = F2(
	function (_v0, a) {
		var isCode = _v0.a;
		var elem = _v0.b;
		var red = function (ch) {
			return $dkodaj$rte$MiniRte$Types$Char(
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
				return $dkodaj$rte$MiniRte$Types$Break(
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
								scope: $author$project$Highlighter$NeutralZone
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
					switch (_v3.valueOf()) {
						case '<':
							return _Utils_update(
								a,
								{
									content: A2(
										$elm$core$List$cons,
										red(ch),
										a.content),
									scope: $author$project$Highlighter$TagOpened
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
											scope: $author$project$Highlighter$OpeningTagEnded
										});
								case 'WithinClosingTag':
									return _Utils_update(
										a,
										{
											content: A2(
												$elm$core$List$cons,
												red(ch),
												a.content),
											scope: $author$project$Highlighter$NeutralZone
										});
								default:
									return _Utils_update(
										a,
										{
											content: A2(
												$elm$core$List$cons,
												red(ch),
												a.content),
											scope: $author$project$Highlighter$OpeningTagEnded
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
											scope: $author$project$Highlighter$WithinClosingTag
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
var $author$project$Highlighter$markCode = function (content) {
	var f = F2(
		function (elem, _v1) {
			var isCode = _v1.a;
			var xs = _v1.b;
			if (elem.$ === 'Break') {
				var br = elem.a;
				var isCodeNow = A2($elm$core$List$member, 'code', br.classes);
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
var $author$project$Highlighter$highlighter = function (content) {
	var init = {content: _List_Nil, indent: 0, scope: $author$project$Highlighter$NeutralZone};
	return $elm$core$List$reverse(
		A3(
			$elm$core$List$foldl,
			$author$project$Highlighter$highlight,
			init,
			$author$project$Highlighter$markCode(content)).content);
};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit = {$: 'Edit'};
var $dkodaj$rte$MiniRte$Core$Idle = {$: 'Idle'};
var $dkodaj$rte$MiniRte$Core$NoDrag = {$: 'NoDrag'};
var $dkodaj$rte$MiniRte$Core$defaultLineBreak = function (id) {
	return {classes: _List_Nil, highlightClasses: _List_Nil, highlightIndent: 0, highlightStyling: _List_Nil, id: id, indent: 0, nodeType: $elm$core$Maybe$Nothing, styling: _List_Nil};
};
var $rtfeldman$elm_css$Css$Preprocess$AppendProperty = function (a) {
	return {$: 'AppendProperty', a: a};
};
var $rtfeldman$elm_css$Css$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$backgroundColor = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'background-color', c.value);
};
var $rtfeldman$elm_css$Css$color = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'color', c.value);
};
var $rtfeldman$elm_css$VirtualDom$Styled$Attribute = F3(
	function (a, b, c) {
		return {$: 'Attribute', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence = function (a) {
	return {$: 'UniversalSelectorSequence', a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
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
var $elm$core$Basics$compare = _Utils_compare;
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
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $rtfeldman$elm_css$Css$Structure$compactHelp = F2(
	function (declaration, _v0) {
		var keyframesByName = _v0.a;
		var declarations = _v0.b;
		switch (declaration.$) {
			case 'StyleBlockDeclaration':
				var _v2 = declaration.a;
				var properties = _v2.c;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'MediaRule':
				var styleBlocks = declaration.b;
				return A2(
					$elm$core$List$all,
					function (_v3) {
						var properties = _v3.c;
						return $elm$core$List$isEmpty(properties);
					},
					styleBlocks) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'SupportsRule':
				var otherDeclarations = declaration.b;
				return $elm$core$List$isEmpty(otherDeclarations) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'DocumentRule':
				return _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'PageRule':
				var properties = declaration.b;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'FontFace':
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'Keyframes':
				var record = declaration.a;
				return $elm$core$String$isEmpty(record.declaration) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					A3($elm$core$Dict$insert, record.name, record.declaration, keyframesByName),
					declarations);
			case 'Viewport':
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 'CounterStyle':
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			default:
				var tuples = declaration.a;
				return A2(
					$elm$core$List$all,
					function (_v4) {
						var properties = _v4.b;
						return $elm$core$List$isEmpty(properties);
					},
					tuples) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
		}
	});
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $rtfeldman$elm_css$Css$Structure$Keyframes = function (a) {
	return {$: 'Keyframes', a: a};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations = F2(
	function (keyframesByName, compactedDeclarations) {
		return A2(
			$elm$core$List$append,
			A2(
				$elm$core$List$map,
				function (_v0) {
					var name = _v0.a;
					var decl = _v0.b;
					return $rtfeldman$elm_css$Css$Structure$Keyframes(
						{declaration: decl, name: name});
				},
				$elm$core$Dict$toList(keyframesByName)),
			compactedDeclarations);
	});
var $rtfeldman$elm_css$Css$Structure$compactStylesheet = function (_v0) {
	var charset = _v0.charset;
	var imports = _v0.imports;
	var namespaces = _v0.namespaces;
	var declarations = _v0.declarations;
	var _v1 = A3(
		$elm$core$List$foldr,
		$rtfeldman$elm_css$Css$Structure$compactHelp,
		_Utils_Tuple2($elm$core$Dict$empty, _List_Nil),
		declarations);
	var keyframesByName = _v1.a;
	var compactedDeclarations = _v1.b;
	var finalDeclarations = A2($rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations, keyframesByName, compactedDeclarations);
	return {charset: charset, declarations: finalDeclarations, imports: imports, namespaces: namespaces};
};
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
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $rtfeldman$elm_css$Css$Structure$Output$charsetToString = function (charset) {
	return A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			function (str) {
				return '@charset \"' + (str + '\"');
			},
			charset));
};
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
var $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString = function (expression) {
	return '(' + (expression.feature + (A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			$elm$core$Basics$append(': '),
			expression.value)) + ')'));
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString = function (mediaType) {
	switch (mediaType.$) {
		case 'Print':
			return 'print';
		case 'Screen':
			return 'screen';
		default:
			return 'speech';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString = function (mediaQuery) {
	var prefixWith = F3(
		function (str, mediaType, expressions) {
			return str + (' ' + A2(
				$elm$core$String$join,
				' and ',
				A2(
					$elm$core$List$cons,
					$rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString(mediaType),
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions))));
		});
	switch (mediaQuery.$) {
		case 'AllQuery':
			var expressions = mediaQuery.a;
			return A2(
				$elm$core$String$join,
				' and ',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions));
		case 'OnlyQuery':
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'only', mediaType, expressions);
		case 'NotQuery':
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'not', mediaType, expressions);
		default:
			var str = mediaQuery.a;
			return str;
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString = F2(
	function (name, mediaQuery) {
		return '@import \"' + (name + ($rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString(mediaQuery) + '\"'));
	});
var $rtfeldman$elm_css$Css$Structure$Output$importToString = function (_v0) {
	var name = _v0.a;
	var mediaQueries = _v0.b;
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			$rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString(name),
			mediaQueries));
};
var $rtfeldman$elm_css$Css$Structure$Output$namespaceToString = function (_v0) {
	var prefix = _v0.a;
	var str = _v0.b;
	return '@namespace ' + (prefix + ('\"' + (str + '\"')));
};
var $rtfeldman$elm_css$Css$Structure$Output$spaceIndent = '    ';
var $rtfeldman$elm_css$Css$Structure$Output$indent = function (str) {
	return _Utils_ap($rtfeldman$elm_css$Css$Structure$Output$spaceIndent, str);
};
var $rtfeldman$elm_css$Css$Structure$Output$noIndent = '';
var $rtfeldman$elm_css$Css$Structure$Output$emitProperty = function (str) {
	return str + ';';
};
var $rtfeldman$elm_css$Css$Structure$Output$emitProperties = function (properties) {
	return A2(
		$elm$core$String$join,
		'\n',
		A2(
			$elm$core$List$map,
			A2($elm$core$Basics$composeL, $rtfeldman$elm_css$Css$Structure$Output$indent, $rtfeldman$elm_css$Css$Structure$Output$emitProperty),
			properties));
};
var $elm$core$String$append = _String_append;
var $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString = function (_v0) {
	var str = _v0.a;
	return '::' + str;
};
var $rtfeldman$elm_css$Css$Structure$Output$combinatorToString = function (combinator) {
	switch (combinator.$) {
		case 'AdjacentSibling':
			return '+';
		case 'GeneralSibling':
			return '~';
		case 'Child':
			return '>';
		default:
			return '';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString = function (repeatableSimpleSelector) {
	switch (repeatableSimpleSelector.$) {
		case 'ClassSelector':
			var str = repeatableSimpleSelector.a;
			return '.' + str;
		case 'IdSelector':
			var str = repeatableSimpleSelector.a;
			return '#' + str;
		case 'PseudoClassSelector':
			var str = repeatableSimpleSelector.a;
			return ':' + str;
		default:
			var str = repeatableSimpleSelector.a;
			return '[' + (str + ']');
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString = function (simpleSelectorSequence) {
	switch (simpleSelectorSequence.$) {
		case 'TypeSelectorSequence':
			var str = simpleSelectorSequence.a.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
		case 'UniversalSelectorSequence':
			var repeatableSimpleSelectors = simpleSelectorSequence.a;
			return $elm$core$List$isEmpty(repeatableSimpleSelectors) ? '*' : A2(
				$elm$core$String$join,
				'',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors));
		default:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				$elm$core$String$join,
				'',
				A2(
					$elm$core$List$cons,
					str,
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString = function (_v0) {
	var combinator = _v0.a;
	var sequence = _v0.b;
	return A2(
		$elm$core$String$join,
		' ',
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$Output$combinatorToString(combinator),
				$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(sequence)
			]));
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorToString = function (_v0) {
	var simpleSelectorSequence = _v0.a;
	var chain = _v0.b;
	var pseudoElement = _v0.c;
	var segments = A2(
		$elm$core$List$cons,
		$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(simpleSelectorSequence),
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString, chain));
	var pseudoElementsString = A2(
		$elm$core$String$join,
		'',
		_List_fromArray(
			[
				A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString, pseudoElement))
			]));
	return A2(
		$elm$core$String$append,
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$filter,
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
				segments)),
		pseudoElementsString);
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock = F2(
	function (indentLevel, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		var selectorStr = A2(
			$elm$core$String$join,
			', ',
			A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Structure$Output$selectorToString,
				A2($elm$core$List$cons, firstSelector, otherSelectors)));
		return A2(
			$elm$core$String$join,
			'',
			_List_fromArray(
				[
					selectorStr,
					' {\n',
					indentLevel,
					$rtfeldman$elm_css$Css$Structure$Output$emitProperties(properties),
					'\n',
					indentLevel,
					'}'
				]));
	});
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration = function (decl) {
	switch (decl.$) {
		case 'StyleBlockDeclaration':
			var styleBlock = decl.a;
			return A2($rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock, $rtfeldman$elm_css$Css$Structure$Output$noIndent, styleBlock);
		case 'MediaRule':
			var mediaQueries = decl.a;
			var styleBlocks = decl.b;
			var query = A2(
				$elm$core$String$join,
				',\n',
				A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString, mediaQueries));
			var blocks = A2(
				$elm$core$String$join,
				'\n\n',
				A2(
					$elm$core$List$map,
					A2(
						$elm$core$Basics$composeL,
						$rtfeldman$elm_css$Css$Structure$Output$indent,
						$rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock($rtfeldman$elm_css$Css$Structure$Output$spaceIndent)),
					styleBlocks));
			return '@media ' + (query + (' {\n' + (blocks + '\n}')));
		case 'SupportsRule':
			return 'TODO';
		case 'DocumentRule':
			return 'TODO';
		case 'PageRule':
			return 'TODO';
		case 'FontFace':
			return 'TODO';
		case 'Keyframes':
			var name = decl.a.name;
			var declaration = decl.a.declaration;
			return '@keyframes ' + (name + (' {\n' + (declaration + '\n}')));
		case 'Viewport':
			return 'TODO';
		case 'CounterStyle':
			return 'TODO';
		default:
			return 'TODO';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrint = function (_v0) {
	var charset = _v0.charset;
	var imports = _v0.imports;
	var namespaces = _v0.namespaces;
	var declarations = _v0.declarations;
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Output$charsetToString(charset),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$importToString, imports)),
					A2(
					$elm$core$String$join,
					'\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$namespaceToString, namespaces)),
					A2(
					$elm$core$String$join,
					'\n\n',
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration, declarations))
				])));
};
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $rtfeldman$elm_css$Css$Structure$CounterStyle = function (a) {
	return {$: 'CounterStyle', a: a};
};
var $rtfeldman$elm_css$Css$Structure$FontFace = function (a) {
	return {$: 'FontFace', a: a};
};
var $rtfeldman$elm_css$Css$Structure$PageRule = F2(
	function (a, b) {
		return {$: 'PageRule', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Selector = F3(
	function (a, b, c) {
		return {$: 'Selector', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlock = F3(
	function (a, b, c) {
		return {$: 'StyleBlock', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration = function (a) {
	return {$: 'StyleBlockDeclaration', a: a};
};
var $rtfeldman$elm_css$Css$Structure$SupportsRule = F2(
	function (a, b) {
		return {$: 'SupportsRule', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Viewport = function (a) {
	return {$: 'Viewport', a: a};
};
var $rtfeldman$elm_css$Css$Structure$MediaRule = F2(
	function (a, b) {
		return {$: 'MediaRule', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$mapLast = F2(
	function (update, list) {
		if (!list.b) {
			return list;
		} else {
			if (!list.b.b) {
				var only = list.a;
				return _List_fromArray(
					[
						update(only)
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$mapLast, update, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$withPropertyAppended = F2(
	function (property, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		return A3(
			$rtfeldman$elm_css$Css$Structure$StyleBlock,
			firstSelector,
			otherSelectors,
			_Utils_ap(
				properties,
				_List_fromArray(
					[property])));
	});
var $rtfeldman$elm_css$Css$Structure$appendProperty = F2(
	function (property, declarations) {
		if (!declarations.b) {
			return declarations;
		} else {
			if (!declarations.b.b) {
				switch (declarations.a.$) {
					case 'StyleBlockDeclaration':
						var styleBlock = declarations.a.a;
						return _List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
								A2($rtfeldman$elm_css$Css$Structure$withPropertyAppended, property, styleBlock))
							]);
					case 'MediaRule':
						var _v1 = declarations.a;
						var mediaQueries = _v1.a;
						var styleBlocks = _v1.b;
						return _List_fromArray(
							[
								A2(
								$rtfeldman$elm_css$Css$Structure$MediaRule,
								mediaQueries,
								A2(
									$rtfeldman$elm_css$Css$Structure$mapLast,
									$rtfeldman$elm_css$Css$Structure$withPropertyAppended(property),
									styleBlocks))
							]);
					default:
						return declarations;
				}
			} else {
				var first = declarations.a;
				var rest = declarations.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendToLastSelector = F2(
	function (f, styleBlock) {
		if (!styleBlock.b.b) {
			var only = styleBlock.a;
			var properties = styleBlock.c;
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, only, _List_Nil, properties),
					A3(
					$rtfeldman$elm_css$Css$Structure$StyleBlock,
					f(only),
					_List_Nil,
					_List_Nil)
				]);
		} else {
			var first = styleBlock.a;
			var rest = styleBlock.b;
			var properties = styleBlock.c;
			var newRest = A2($elm$core$List$map, f, rest);
			var newFirst = f(first);
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, rest, properties),
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, newFirst, newRest, _List_Nil)
				]);
		}
	});
var $rtfeldman$elm_css$Css$Structure$applyPseudoElement = F2(
	function (pseudo, _v0) {
		var sequence = _v0.a;
		var selectors = _v0.b;
		return A3(
			$rtfeldman$elm_css$Css$Structure$Selector,
			sequence,
			selectors,
			$elm$core$Maybe$Just(pseudo));
	});
var $rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector = F2(
	function (pseudo, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$applyPseudoElement(pseudo),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Structure$CustomSelector = F2(
	function (a, b) {
		return {$: 'CustomSelector', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$TypeSelectorSequence = F2(
	function (a, b) {
		return {$: 'TypeSelectorSequence', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatable = F2(
	function (selector, sequence) {
		switch (sequence.$) {
			case 'TypeSelectorSequence':
				var typeSelector = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$TypeSelectorSequence,
					typeSelector,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			case 'UniversalSelectorSequence':
				var list = sequence.a;
				return $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			default:
				var str = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$CustomSelector,
					str,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator = F2(
	function (selector, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			if (!list.b.b) {
				var _v1 = list.a;
				var combinator = _v1.a;
				var sequence = _v1.b;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						combinator,
						A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, selector, sequence))
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, selector, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableSelector = F2(
	function (repeatableSimpleSelector, selector) {
		if (!selector.b.b) {
			var sequence = selector.a;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, repeatableSimpleSelector, sequence),
				_List_Nil,
				pseudoElement);
		} else {
			var firstSelector = selector.a;
			var tuples = selector.b;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				firstSelector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, repeatableSimpleSelector, tuples),
				pseudoElement);
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector = F2(
	function (selector, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$appendRepeatableSelector(selector),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors = function (declarations) {
	collectSelectors:
	while (true) {
		if (!declarations.b) {
			return _List_Nil;
		} else {
			if (declarations.a.$ === 'StyleBlockDeclaration') {
				var _v1 = declarations.a.a;
				var firstSelector = _v1.a;
				var otherSelectors = _v1.b;
				var rest = declarations.b;
				return _Utils_ap(
					A2($elm$core$List$cons, firstSelector, otherSelectors),
					$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(rest));
			} else {
				var rest = declarations.b;
				var $temp$declarations = rest;
				declarations = $temp$declarations;
				continue collectSelectors;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$DocumentRule = F5(
	function (a, b, c, d, e) {
		return {$: 'DocumentRule', a: a, b: b, c: c, d: d, e: e};
	});
var $rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock = F2(
	function (update, declarations) {
		_v0$12:
		while (true) {
			if (!declarations.b) {
				return declarations;
			} else {
				if (!declarations.b.b) {
					switch (declarations.a.$) {
						case 'StyleBlockDeclaration':
							var styleBlock = declarations.a.a;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration,
								update(styleBlock));
						case 'MediaRule':
							if (declarations.a.b.b) {
								if (!declarations.a.b.b.b) {
									var _v1 = declarations.a;
									var mediaQueries = _v1.a;
									var _v2 = _v1.b;
									var styleBlock = _v2.a;
									return _List_fromArray(
										[
											A2(
											$rtfeldman$elm_css$Css$Structure$MediaRule,
											mediaQueries,
											update(styleBlock))
										]);
								} else {
									var _v3 = declarations.a;
									var mediaQueries = _v3.a;
									var _v4 = _v3.b;
									var first = _v4.a;
									var rest = _v4.b;
									var _v5 = A2(
										$rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock,
										update,
										_List_fromArray(
											[
												A2($rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, rest)
											]));
									if ((_v5.b && (_v5.a.$ === 'MediaRule')) && (!_v5.b.b)) {
										var _v6 = _v5.a;
										var newMediaQueries = _v6.a;
										var newStyleBlocks = _v6.b;
										return _List_fromArray(
											[
												A2(
												$rtfeldman$elm_css$Css$Structure$MediaRule,
												newMediaQueries,
												A2($elm$core$List$cons, first, newStyleBlocks))
											]);
									} else {
										var newDeclarations = _v5;
										return newDeclarations;
									}
								}
							} else {
								break _v0$12;
							}
						case 'SupportsRule':
							var _v7 = declarations.a;
							var str = _v7.a;
							var nestedDeclarations = _v7.b;
							return _List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$Structure$SupportsRule,
									str,
									A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, nestedDeclarations))
								]);
						case 'DocumentRule':
							var _v8 = declarations.a;
							var str1 = _v8.a;
							var str2 = _v8.b;
							var str3 = _v8.c;
							var str4 = _v8.d;
							var styleBlock = _v8.e;
							return A2(
								$elm$core$List$map,
								A4($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4),
								update(styleBlock));
						case 'PageRule':
							var _v9 = declarations.a;
							return declarations;
						case 'FontFace':
							return declarations;
						case 'Keyframes':
							return declarations;
						case 'Viewport':
							return declarations;
						case 'CounterStyle':
							return declarations;
						default:
							return declarations;
					}
				} else {
					break _v0$12;
				}
			}
		}
		var first = declarations.a;
		var rest = declarations.b;
		return A2(
			$elm$core$List$cons,
			first,
			A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, rest));
	});
var $elm$core$String$cons = _String_cons;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$HashData = F4(
	function (shift, seed, hash, charsProcessed) {
		return {charsProcessed: charsProcessed, hash: hash, seed: seed, shift: shift};
	});
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$c1 = 3432918353;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$c2 = 461845907;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy = F2(
	function (b, a) {
		return ((a & 65535) * b) + ((((a >>> 16) * b) & 65535) << 16);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Bitwise$or = _Bitwise_or;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy = F2(
	function (b, a) {
		return (a << b) | (a >>> (32 - b));
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$finalize = function (data) {
	var acc = (!(!data.hash)) ? (data.seed ^ A2(
		$rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy,
		$rtfeldman$elm_css$ElmCssVendor$Murmur3$c2,
		A2(
			$rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy,
			15,
			A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, $rtfeldman$elm_css$ElmCssVendor$Murmur3$c1, data.hash)))) : data.seed;
	var h0 = acc ^ data.charsProcessed;
	var h1 = A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, 2246822507, h0 ^ (h0 >>> 16));
	var h2 = A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, 3266489909, h1 ^ (h1 >>> 13));
	return (h2 ^ (h2 >>> 16)) >>> 0;
};
var $elm$core$String$foldl = _String_foldl;
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$mix = F2(
	function (h1, k1) {
		return A2(
			$rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy,
			5,
			A2(
				$rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy,
				13,
				h1 ^ A2(
					$rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy,
					$rtfeldman$elm_css$ElmCssVendor$Murmur3$c2,
					A2(
						$rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy,
						15,
						A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, $rtfeldman$elm_css$ElmCssVendor$Murmur3$c1, k1))))) + 3864292196;
	});
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$hashFold = F2(
	function (c, data) {
		var res = data.hash | ((255 & $elm$core$Char$toCode(c)) << data.shift);
		var _v0 = data.shift;
		if (_v0 === 24) {
			return {
				charsProcessed: data.charsProcessed + 1,
				hash: 0,
				seed: A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$mix, data.seed, res),
				shift: 0
			};
		} else {
			return {charsProcessed: data.charsProcessed + 1, hash: res, seed: data.seed, shift: data.shift + 8};
		}
	});
var $rtfeldman$elm_css$ElmCssVendor$Murmur3$hashString = F2(
	function (seed, str) {
		return $rtfeldman$elm_css$ElmCssVendor$Murmur3$finalize(
			A3(
				$elm$core$String$foldl,
				$rtfeldman$elm_css$ElmCssVendor$Murmur3$hashFold,
				A4($rtfeldman$elm_css$ElmCssVendor$Murmur3$HashData, 0, seed, 0, 0),
				str));
	});
var $rtfeldman$elm_css$Hash$murmurSeed = 15739;
var $elm$core$String$fromList = _String_fromList;
var $elm$core$Basics$modBy = _Basics_modBy;
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return _Utils_chr('0');
			case 1:
				return _Utils_chr('1');
			case 2:
				return _Utils_chr('2');
			case 3:
				return _Utils_chr('3');
			case 4:
				return _Utils_chr('4');
			case 5:
				return _Utils_chr('5');
			case 6:
				return _Utils_chr('6');
			case 7:
				return _Utils_chr('7');
			case 8:
				return _Utils_chr('8');
			case 9:
				return _Utils_chr('9');
			case 10:
				return _Utils_chr('a');
			case 11:
				return _Utils_chr('b');
			case 12:
				return _Utils_chr('c');
			case 13:
				return _Utils_chr('d');
			case 14:
				return _Utils_chr('e');
			case 15:
				return _Utils_chr('f');
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			_Utils_chr('-'),
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $rtfeldman$elm_css$Hash$fromString = function (str) {
	return A2(
		$elm$core$String$cons,
		_Utils_chr('_'),
		$rtfeldman$elm_hex$Hex$toString(
			A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$hashString, $rtfeldman$elm_css$Hash$murmurSeed, str)));
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$last = function (list) {
	last:
	while (true) {
		if (!list.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!list.b.b) {
				var singleton = list.a;
				return $elm$core$Maybe$Just(singleton);
			} else {
				var rest = list.b;
				var $temp$list = rest;
				list = $temp$list;
				continue last;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration = function (declarations) {
	lastDeclaration:
	while (true) {
		if (!declarations.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!declarations.b.b) {
				var x = declarations.a;
				return $elm$core$Maybe$Just(
					_List_fromArray(
						[x]));
			} else {
				var xs = declarations.b;
				var $temp$declarations = xs;
				declarations = $temp$declarations;
				continue lastDeclaration;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf = function (maybes) {
	oneOf:
	while (true) {
		if (!maybes.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var maybe = maybes.a;
			var rest = maybes.b;
			if (maybe.$ === 'Nothing') {
				var $temp$maybes = rest;
				maybes = $temp$maybes;
				continue oneOf;
			} else {
				return maybe;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$FontFeatureValues = function (a) {
	return {$: 'FontFeatureValues', a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues = function (tuples) {
	var expandTuples = function (tuplesToExpand) {
		if (!tuplesToExpand.b) {
			return _List_Nil;
		} else {
			var properties = tuplesToExpand.a;
			var rest = tuplesToExpand.b;
			return A2(
				$elm$core$List$cons,
				properties,
				expandTuples(rest));
		}
	};
	var newTuples = expandTuples(tuples);
	return _List_fromArray(
		[
			$rtfeldman$elm_css$Css$Structure$FontFeatureValues(newTuples)
		]);
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule = F2(
	function (mediaQueries, declaration) {
		if (declaration.$ === 'StyleBlockDeclaration') {
			var styleBlock = declaration.a;
			return A2(
				$rtfeldman$elm_css$Css$Structure$MediaRule,
				mediaQueries,
				_List_fromArray(
					[styleBlock]));
		} else {
			return declaration;
		}
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
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
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule = F5(
	function (str1, str2, str3, str4, declaration) {
		if (declaration.$ === 'StyleBlockDeclaration') {
			var structureStyleBlock = declaration.a;
			return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
		} else {
			return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule = F2(
	function (mediaQueries, declaration) {
		switch (declaration.$) {
			case 'StyleBlockDeclaration':
				var structureStyleBlock = declaration.a;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					mediaQueries,
					_List_fromArray(
						[structureStyleBlock]));
			case 'MediaRule':
				var newMediaQueries = declaration.a;
				var structureStyleBlocks = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					_Utils_ap(mediaQueries, newMediaQueries),
					structureStyleBlocks);
			case 'SupportsRule':
				var str = declaration.a;
				var declarations = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$SupportsRule,
					str,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
						declarations));
			case 'DocumentRule':
				var str1 = declaration.a;
				var str2 = declaration.b;
				var str3 = declaration.c;
				var str4 = declaration.d;
				var structureStyleBlock = declaration.e;
				return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
			case 'PageRule':
				return declaration;
			case 'FontFace':
				return declaration;
			case 'Keyframes':
				return declaration;
			case 'Viewport':
				return declaration;
			case 'CounterStyle':
				return declaration;
			default:
				return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet = function (_v0) {
	var declarations = _v0.a;
	return declarations;
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast = F4(
	function (nestedStyles, rest, f, declarations) {
		var withoutParent = function (decls) {
			return A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$tail(decls));
		};
		var nextResult = A2(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
			rest,
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		var newDeclarations = function () {
			var _v14 = _Utils_Tuple2(
				$elm$core$List$head(nextResult),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$last(declarations));
			if ((_v14.a.$ === 'Just') && (_v14.b.$ === 'Just')) {
				var nextResultParent = _v14.a.a;
				var originalParent = _v14.b.a;
				return _Utils_ap(
					A2(
						$elm$core$List$take,
						$elm$core$List$length(declarations) - 1,
						declarations),
					_List_fromArray(
						[
							(!_Utils_eq(originalParent, nextResultParent)) ? nextResultParent : originalParent
						]));
			} else {
				return declarations;
			}
		}();
		var insertStylesToNestedDecl = function (lastDecl) {
			return $elm$core$List$concat(
				A2(
					$rtfeldman$elm_css$Css$Structure$mapLast,
					$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles(nestedStyles),
					A2(
						$elm$core$List$map,
						$elm$core$List$singleton,
						A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, f, lastDecl))));
		};
		var initialResult = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				insertStylesToNestedDecl,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		return _Utils_ap(
			newDeclarations,
			_Utils_ap(
				withoutParent(initialResult),
				withoutParent(nextResult)));
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles = F2(
	function (styles, declarations) {
		if (!styles.b) {
			return declarations;
		} else {
			switch (styles.a.$) {
				case 'AppendProperty':
					var property = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, declarations));
				case 'ExtendSelector':
					var _v4 = styles.a;
					var selector = _v4.a;
					var nestedStyles = _v4.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector(selector),
						declarations);
				case 'NestSnippet':
					var _v5 = styles.a;
					var selectorCombinator = _v5.a;
					var snippets = _v5.b;
					var rest = styles.b;
					var chain = F2(
						function (_v9, _v10) {
							var originalSequence = _v9.a;
							var originalTuples = _v9.b;
							var originalPseudoElement = _v9.c;
							var newSequence = _v10.a;
							var newTuples = _v10.b;
							var newPseudoElement = _v10.c;
							return A3(
								$rtfeldman$elm_css$Css$Structure$Selector,
								originalSequence,
								_Utils_ap(
									originalTuples,
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(selectorCombinator, newSequence),
										newTuples)),
								$rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf(
									_List_fromArray(
										[newPseudoElement, originalPseudoElement])));
						});
					var expandDeclaration = function (declaration) {
						switch (declaration.$) {
							case 'StyleBlockDeclaration':
								var _v7 = declaration.a;
								var firstSelector = _v7.a;
								var otherSelectors = _v7.b;
								var nestedStyles = _v7.c;
								var newSelectors = A2(
									$elm$core$List$concatMap,
									function (originalSelector) {
										return A2(
											$elm$core$List$map,
											chain(originalSelector),
											A2($elm$core$List$cons, firstSelector, otherSelectors));
									},
									$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations));
								var newDeclarations = function () {
									if (!newSelectors.b) {
										return _List_Nil;
									} else {
										var first = newSelectors.a;
										var remainder = newSelectors.b;
										return _List_fromArray(
											[
												$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
												A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, remainder, _List_Nil))
											]);
									}
								}();
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, nestedStyles, newDeclarations);
							case 'MediaRule':
								var mediaQueries = declaration.a;
								var styleBlocks = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
							case 'SupportsRule':
								var str = declaration.a;
								var otherSnippets = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, otherSnippets);
							case 'DocumentRule':
								var str1 = declaration.a;
								var str2 = declaration.b;
								var str3 = declaration.c;
								var str4 = declaration.d;
								var styleBlock = declaration.e;
								return A2(
									$elm$core$List$map,
									A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
									$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
							case 'PageRule':
								var str = declaration.a;
								var properties = declaration.b;
								return _List_fromArray(
									[
										A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
									]);
							case 'FontFace':
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$FontFace(properties)
									]);
							case 'Viewport':
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$Viewport(properties)
									]);
							case 'CounterStyle':
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
									]);
							default:
								var tuples = declaration.a;
								return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
						}
					};
					return $elm$core$List$concat(
						_Utils_ap(
							_List_fromArray(
								[
									A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations)
								]),
							A2(
								$elm$core$List$map,
								expandDeclaration,
								A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets))));
				case 'WithPseudoElement':
					var _v11 = styles.a;
					var pseudoElement = _v11.a;
					var nestedStyles = _v11.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector(pseudoElement),
						declarations);
				case 'WithKeyframes':
					var str = styles.a.a;
					var rest = styles.b;
					var name = $rtfeldman$elm_css$Hash$fromString(str);
					var newProperty = 'animation-name:' + name;
					var newDeclarations = A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, newProperty, declarations));
					return A2(
						$elm$core$List$append,
						newDeclarations,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$Keyframes(
								{declaration: str, name: name})
							]));
				case 'WithMedia':
					var _v12 = styles.a;
					var mediaQueries = _v12.a;
					var nestedStyles = _v12.b;
					var rest = styles.b;
					var extraDeclarations = function () {
						var _v13 = $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations);
						if (!_v13.b) {
							return _List_Nil;
						} else {
							var firstSelector = _v13.a;
							var otherSelectors = _v13.b;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule(mediaQueries),
								A2(
									$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
									nestedStyles,
									$elm$core$List$singleton(
										$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
											A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil)))));
						}
					}();
					return _Utils_ap(
						A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations),
						extraDeclarations);
				default:
					var otherStyles = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						_Utils_ap(otherStyles, rest),
						declarations);
			}
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock = function (_v2) {
	var firstSelector = _v2.a;
	var otherSelectors = _v2.b;
	var styles = _v2.c;
	return A2(
		$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
		styles,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil))
			]));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$extract = function (snippetDeclarations) {
	if (!snippetDeclarations.b) {
		return _List_Nil;
	} else {
		var first = snippetDeclarations.a;
		var rest = snippetDeclarations.b;
		return _Utils_ap(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations(first),
			$rtfeldman$elm_css$Css$Preprocess$Resolve$extract(rest));
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule = F2(
	function (mediaQueries, styleBlocks) {
		var handleStyleBlock = function (styleBlock) {
			return A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		};
		return A2($elm$core$List$concatMap, handleStyleBlock, styleBlocks);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule = F2(
	function (str, snippets) {
		var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
			A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
		return _List_fromArray(
			[
				A2($rtfeldman$elm_css$Css$Structure$SupportsRule, str, declarations)
			]);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations = function (snippetDeclaration) {
	switch (snippetDeclaration.$) {
		case 'StyleBlockDeclaration':
			var styleBlock = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock);
		case 'MediaRule':
			var mediaQueries = snippetDeclaration.a;
			var styleBlocks = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
		case 'SupportsRule':
			var str = snippetDeclaration.a;
			var snippets = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, snippets);
		case 'DocumentRule':
			var str1 = snippetDeclaration.a;
			var str2 = snippetDeclaration.b;
			var str3 = snippetDeclaration.c;
			var str4 = snippetDeclaration.d;
			var styleBlock = snippetDeclaration.e;
			return A2(
				$elm$core$List$map,
				A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		case 'PageRule':
			var str = snippetDeclaration.a;
			var properties = snippetDeclaration.b;
			return _List_fromArray(
				[
					A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
				]);
		case 'FontFace':
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$FontFace(properties)
				]);
		case 'Viewport':
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Viewport(properties)
				]);
		case 'CounterStyle':
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
				]);
		default:
			var tuples = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure = function (_v0) {
	var charset = _v0.charset;
	var imports = _v0.imports;
	var namespaces = _v0.namespaces;
	var snippets = _v0.snippets;
	var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
		A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
	return {charset: charset, declarations: declarations, imports: imports, namespaces: namespaces};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp = function (sheet) {
	return $rtfeldman$elm_css$Css$Structure$Output$prettyPrint(
		$rtfeldman$elm_css$Css$Structure$compactStylesheet(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure(sheet)));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compile = function (styles) {
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp, styles));
};
var $rtfeldman$elm_css$Css$Preprocess$Snippet = function (a) {
	return {$: 'Snippet', a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$StyleBlock = F3(
	function (a, b, c) {
		return {$: 'StyleBlock', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration = function (a) {
	return {$: 'StyleBlockDeclaration', a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$makeSnippet = F2(
	function (styles, sequence) {
		var selector = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return $rtfeldman$elm_css$Css$Preprocess$Snippet(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
					A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, selector, _List_Nil, styles))
				]));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$murmurSeed = 15739;
var $rtfeldman$elm_css$Css$Preprocess$stylesheet = function (snippets) {
	return {charset: $elm$core$Maybe$Nothing, imports: _List_Nil, namespaces: _List_Nil, snippets: snippets};
};
var $rtfeldman$elm_css$VirtualDom$Styled$getClassname = function (styles) {
	return $elm$core$List$isEmpty(styles) ? 'unstyled' : A2(
		$elm$core$String$cons,
		_Utils_chr('_'),
		$rtfeldman$elm_hex$Hex$toString(
			A2(
				$rtfeldman$elm_css$ElmCssVendor$Murmur3$hashString,
				$rtfeldman$elm_css$VirtualDom$Styled$murmurSeed,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
					$elm$core$List$singleton(
						$rtfeldman$elm_css$Css$Preprocess$stylesheet(
							$elm$core$List$singleton(
								A2(
									$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
									styles,
									$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(_List_Nil)))))))));
};
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlJson(value));
	});
var $rtfeldman$elm_css$Html$Styled$Internal$css = function (styles) {
	var classname = $rtfeldman$elm_css$VirtualDom$Styled$getClassname(styles);
	var classProperty = A2(
		$elm$virtual_dom$VirtualDom$property,
		'className',
		$elm$json$Json$Encode$string(classname));
	return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, classProperty, styles, classname);
};
var $rtfeldman$elm_css$Html$Styled$Attributes$css = $rtfeldman$elm_css$Html$Styled$Internal$css;
var $rtfeldman$elm_css$Css$cssFunction = F2(
	function (funcName, args) {
		return funcName + ('(' + (A2($elm$core$String$join, ', ', args) + ')'));
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $rtfeldman$elm_css$Css$Structure$Compatible = {$: 'Compatible'};
var $elm$core$Basics$pi = _Basics_pi;
var $rtfeldman$elm_css$Css$degreesToRadians = function (degrees) {
	return (degrees * 180) / $elm$core$Basics$pi;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Basics$degrees = function (angleInDegrees) {
	return (angleInDegrees * $elm$core$Basics$pi) / 180;
};
var $rtfeldman$elm_css$Css$fmod = F2(
	function (f, n) {
		var integer = $elm$core$Basics$floor(f);
		return (A2($elm$core$Basics$modBy, n, integer) + f) - integer;
	});
var $rtfeldman$elm_css$Css$hslToRgb = F3(
	function (hueVal, saturationVal, lightness) {
		var normHue = hueVal / $elm$core$Basics$degrees(60);
		var chroma = (1 - $elm$core$Basics$abs((2 * lightness) - 1)) * saturationVal;
		var m = lightness - (chroma / 2);
		var x = chroma * (1 - $elm$core$Basics$abs(
			A2($rtfeldman$elm_css$Css$fmod, normHue, 2) - 1));
		var _v0 = (normHue < 0) ? _Utils_Tuple3(0, 0, 0) : ((normHue < 1) ? _Utils_Tuple3(chroma, x, 0) : ((normHue < 2) ? _Utils_Tuple3(x, chroma, 0) : ((normHue < 3) ? _Utils_Tuple3(0, chroma, x) : ((normHue < 4) ? _Utils_Tuple3(0, x, chroma) : ((normHue < 5) ? _Utils_Tuple3(x, 0, chroma) : ((normHue < 6) ? _Utils_Tuple3(chroma, 0, x) : _Utils_Tuple3(0, 0, 0)))))));
		var r = _v0.a;
		var g = _v0.b;
		var b = _v0.c;
		return _Utils_Tuple3(r + m, g + m, b + m);
	});
var $rtfeldman$elm_css$Css$hslaToRgba = F5(
	function (value, hueVal, saturationVal, lightness, hslAlpha) {
		var _v0 = A3(
			$rtfeldman$elm_css$Css$hslToRgb,
			$rtfeldman$elm_css$Css$degreesToRadians(hueVal),
			saturationVal,
			lightness);
		var red = _v0.a;
		var green = _v0.b;
		var blue = _v0.c;
		return {
			alpha: hslAlpha,
			blue: $elm$core$Basics$floor(blue),
			color: $rtfeldman$elm_css$Css$Structure$Compatible,
			green: $elm$core$Basics$floor(green),
			red: $elm$core$Basics$floor(red),
			value: value
		};
	});
var $rtfeldman$elm_css$Css$numericalPercentageToString = function (value) {
	return $elm$core$String$fromFloat(value * 100) + '%';
};
var $rtfeldman$elm_css$Css$hsl = F3(
	function (hueVal, saturationVal, lightnessVal) {
		var valuesList = _List_fromArray(
			[
				$elm$core$String$fromFloat(hueVal),
				$rtfeldman$elm_css$Css$numericalPercentageToString(saturationVal),
				$rtfeldman$elm_css$Css$numericalPercentageToString(lightnessVal)
			]);
		var value = A2($rtfeldman$elm_css$Css$cssFunction, 'hsl', valuesList);
		return A5($rtfeldman$elm_css$Css$hslaToRgba, value, hueVal, saturationVal, lightnessVal, 1);
	});
var $dkodaj$rte$MiniRte$Core$defaultSelectionStyle = _List_fromArray(
	[
		$rtfeldman$elm_css$Html$Styled$Attributes$css(
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$backgroundColor(
				A3($rtfeldman$elm_css$Css$hsl, 217, 0.71, 0.53)),
				$rtfeldman$elm_css$Css$color(
				A3($rtfeldman$elm_css$Css$hsl, 0, 0, 1))
			]))
	]);
var $elm_community$intdict$IntDict$Empty = {$: 'Empty'};
var $elm_community$intdict$IntDict$empty = $elm_community$intdict$IntDict$Empty;
var $dkodaj$rte$MiniRte$Core$emptyFontStyle = {classes: _List_Nil, fontFamily: _List_Nil, fontSize: $elm$core$Maybe$Nothing, styling: _List_Nil};
var $dkodaj$rte$MiniRte$Core$nullBox = {height: 0, width: 0, x: 0, y: 0};
var $dkodaj$rte$MiniRte$Core$nullElement = {
	element: $dkodaj$rte$MiniRte$Core$nullBox,
	scene: {height: 0, width: 0},
	viewport: $dkodaj$rte$MiniRte$Core$nullBox
};
var $dkodaj$rte$MiniRte$Core$nullViewport = {
	scene: {height: 0, width: 0},
	viewport: $dkodaj$rte$MiniRte$Core$nullBox
};
var $dkodaj$rte$MiniRte$Core$init1 = function (editorID) {
	return {
		clipboard: $elm$core$Maybe$Nothing,
		compositionStart: _List_Nil,
		compositionUpdate: '',
		content: _List_fromArray(
			[
				$dkodaj$rte$MiniRte$Types$Break(
				$dkodaj$rte$MiniRte$Core$defaultLineBreak(0))
			]),
		ctrlDown: false,
		cursor: 0,
		cursorElement: $dkodaj$rte$MiniRte$Core$nullElement,
		drag: $dkodaj$rte$MiniRte$Core$NoDrag,
		editorElement: $dkodaj$rte$MiniRte$Core$nullElement,
		editorID: editorID,
		fontSizeUnit: $elm$core$Maybe$Nothing,
		fontStyle: $dkodaj$rte$MiniRte$Core$emptyFontStyle,
		highlighter: $elm$core$Maybe$Nothing,
		idCounter: 1,
		indentUnit: $elm$core$Maybe$Nothing,
		lastKeyDown: -1,
		lastMouseDown: -1,
		locateBacklog: 0,
		locateNext: _List_Nil,
		located: $elm_community$intdict$IntDict$empty,
		locating: $dkodaj$rte$MiniRte$Core$Idle,
		pasteImageLinksAsImages: false,
		pasteLinksAsLinks: false,
		selection: $elm$core$Maybe$Nothing,
		selectionStyle: $dkodaj$rte$MiniRte$Core$defaultSelectionStyle,
		shiftDown: false,
		state: $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit,
		typing: false,
		undo: _List_Nil,
		viewport: $dkodaj$rte$MiniRte$Core$nullViewport
	};
};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded = {$: 'ScrollIfNeeded'};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $dkodaj$rte$MiniRte$Types$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$PlaceCursor1_EditorViewport = F2(
	function (a, b) {
		return {$: 'PlaceCursor1_EditorViewport', a: a, b: b};
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
var $elm$browser$Browser$Dom$getViewportOf = _Browser_getViewportOf;
var $dkodaj$rte$MiniRte$Core$placeCursorCmd = F2(
	function (scroll, editorID) {
		return A2(
			$elm$core$Task$attempt,
			A2(
				$elm$core$Basics$composeL,
				$dkodaj$rte$MiniRte$Types$Internal,
				$dkodaj$rte$MiniRte$TypesThatAreNotPublic$PlaceCursor1_EditorViewport(scroll)),
			$elm$browser$Browser$Dom$getViewportOf(editorID));
	});
var $dkodaj$rte$MiniRte$Core$initCmd = function (editorID) {
	return $elm$core$Platform$Cmd$batch(
		_List_fromArray(
			[
				A2($dkodaj$rte$MiniRte$Core$placeCursorCmd, $dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded, editorID)
			]));
};
var $dkodaj$rte$MiniRte$Core$addIds = function (content) {
	var maxIdx = $elm$core$List$length(content) - 1;
	var f = F2(
		function (idx, elem) {
			switch (elem.$) {
				case 'Break':
					var br = elem.a;
					return $dkodaj$rte$MiniRte$Types$Break(
						_Utils_update(
							br,
							{id: idx}));
				case 'Char':
					var _char = elem.a;
					return $dkodaj$rte$MiniRte$Types$Char(
						_Utils_update(
							_char,
							{id: idx}));
				default:
					var html = elem.a;
					return $dkodaj$rte$MiniRte$Types$Embedded(
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
var $dkodaj$rte$MiniRte$Core$init3 = F3(
	function (editorID, highlighter, selectionStyle) {
		var i = $dkodaj$rte$MiniRte$Core$init1(editorID);
		return _Utils_update(
			i,
			{highlighter: highlighter, selectionStyle: selectionStyle});
	});
var $dkodaj$rte$MiniRte$Core$snapshot = function (editor) {
	return {content: editor.content, cursor: editor.cursor, fontStyle: editor.fontStyle, selection: editor.selection};
};
var $dkodaj$rte$MiniRte$Core$undoMaxDepth = 300;
var $dkodaj$rte$MiniRte$Core$undoAddNew = function (e) {
	var clip = function (xs) {
		return A2($elm$core$List$take, $dkodaj$rte$MiniRte$Core$undoMaxDepth, xs);
	};
	return _Utils_update(
		e,
		{
			undo: clip(
				A2(
					$elm$core$List$cons,
					$dkodaj$rte$MiniRte$Core$snapshot(e),
					e.undo))
		});
};
var $dkodaj$rte$MiniRte$Core$loadContent = F2(
	function (raw, e) {
		var i = A3($dkodaj$rte$MiniRte$Core$init3, e.editorID, e.highlighter, e.selectionStyle);
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
							$dkodaj$rte$MiniRte$Types$Break(
							$dkodaj$rte$MiniRte$Core$defaultLineBreak(0))
						]));
			}
		}();
		return $dkodaj$rte$MiniRte$Core$undoAddNew(
			_Utils_update(
				i,
				{
					content: $dkodaj$rte$MiniRte$Core$addIds(content),
					idCounter: $elm$core$List$length(content),
					state: $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit
				}));
	});
var $dkodaj$rte$MiniRte$Core$initWithContent = F2(
	function (content, id) {
		return _Utils_Tuple2(
			A2(
				$dkodaj$rte$MiniRte$Core$loadContent,
				content,
				$dkodaj$rte$MiniRte$Core$init1(id)),
			$dkodaj$rte$MiniRte$Core$initCmd(id));
	});
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $rtfeldman$elm_css$VirtualDom$Styled$style = F2(
	function (key, val) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$style, key, val),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$style = $rtfeldman$elm_css$VirtualDom$Styled$style;
var $dkodaj$rte$MiniRte$Common$init = function (params) {
	var style = function (_v1) {
		var x = _v1.a;
		var y = _v1.b;
		return A2($rtfeldman$elm_css$Html$Styled$Attributes$style, x, y);
	};
	var _v0 = A2($dkodaj$rte$MiniRte$Core$initWithContent, params.content, params.id);
	var editor = _v0.a;
	var cmd = _v0.b;
	return _Utils_Tuple2(
		{
			emojiBox: false,
			inputBox: $elm$core$Maybe$Nothing,
			styling: {active: params.styling.active, inactive: params.styling.inactive},
			tagger: params.tagger,
			textarea: _Utils_update(
				editor,
				{
					fontSizeUnit: params.fontSizeUnit,
					highlighter: params.highlighter,
					pasteImageLinksAsImages: params.pasteImageLinksAsImages,
					pasteLinksAsLinks: params.pasteLinksAsLinks,
					selectionStyle: _Utils_eq(params.selectionStyle, _List_Nil) ? editor.selectionStyle : A2($elm$core$List$map, style, params.selectionStyle)
				})
		},
		A2($elm$core$Platform$Cmd$map, params.tagger, cmd));
};
var $dkodaj$rte$MiniRte$init = $dkodaj$rte$MiniRte$Common$init;
var $author$project$Content$json = '\n[{\"Constructor\":\"Char\",\"A1\":{\"char\":\"L\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"?\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":\"h1\",\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"C\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"L\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"I\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"x\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"I\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"L\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"4\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"5\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"B\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"C\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"k\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"g\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"v\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"2\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"0\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"0\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"0\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"L\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"I\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"1\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"1\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"0\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"3\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"2\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"1\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"1\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"0\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"3\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"3\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"D\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"F\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"B\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"M\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-style\",\"A2\":\"italic\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"(\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"T\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"E\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"x\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"G\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"E\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"v\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\")\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"C\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"w\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"4\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"5\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"B\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"C\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"T\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"k\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"v\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"g\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"R\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"T\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"L\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"I\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"\\\"\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"L\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"\\\"\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"f\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"1\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"1\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"0\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"3\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"2\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[{\"A1\":\"font-weight\",\"A2\":\"bold\"}]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\".\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Embedded\",\"A1\":{\"attributes\":[{\"A1\":\"src\",\"A2\":\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUSExMVFhUWFRoaGBUYFRUXFhYVFxcXFhgVFxUYHSggGBolHRcVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQFSsdHR0rLS0rKy0tLSstLSstLS0tLS0tLSstLS0rLS0tLS0tLS0rLSstNy0tLS0tNy03LTcrN//AABEIARMAtwMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAEBQMGAAECB//EAD4QAAECBAQDBQYFAwQBBQAAAAEAAgMEESEFEjFBUWFxIoGRofAGEzKxwdFCUmLh8RQjgjNykqKyByQ0Q1P/xAAYAQADAQEAAAAAAAAAAAAAAAABAgMABP/EACIRAQEAAgIDAQADAQEAAAAAAAABAhEhMQMSQVEiMmFxE//aAAwDAQACEQMRAD8AsxChdqiHaKByICK3XS4JXYWZoFdLVFhWFlVy5bWigzlyXT6PcUvnikz6GdgGmq6UTQpCVI7h6iK7eo0BjTyl0xqjYhQUcpcjQI7QrUs663xXMDVJBHhYVoFaKoDh2qxhoVy4rkOutK1LDqeqxY89o9ViXYvV1C4XKlCiOpXbHMmI0XYXETULtZmLCsW3FAXC1VbKimI7WNzPcGt4n1fuWZt6Wz2i4jY/BGmc9GfQmqBj4uH0DGOv+ag8hVRzzx/T441tq2UN71/AeKlhvP46DmBX63U/aH9a6JXD11vYg8wfmNQuYgRYNFQMUo6Ml8YJMjRBxWpfVdFcywSxhoXLiuio3JmcOUDX3opYpQrYl1pWCPd2ysXOrisQ2z1uqjHxLdVyw9pdznTxBou1qJstgVWBtYluIY3Bg9kuzP8AyMua8zo31ZVjE/aSYeaNcITeDPi/5EV+Sll5ccVJhasGLe0MKCSwduINWg2aeDnbHlqqlOzD4z80R5voNA1uwaNh5pcwDNXTzJJuSTxJRsCtdFy5eS59r44TFJAl62Gm/E9TwRsGGG79w+61LQ66omHKnVLINdteKaeRP2UjWs4ePqnksELlWg9AIlkGuxTwoOJKNIrnAI5H9yVFDNDlee+mnMjh0TMS4UUSWvdHli6ZhEcxxFx4oCKnQLoel2nUfOnBDxJIRPgIDvykUB6HitZsCcqOWUsaGWktcCCNioJb6pfrDnFR1W3FRuKO2RxTZLHRLphEKTxD2il2Lv3lCVi4h6rFti9gC4/EtMesB7RXe5REw8AZnGgAJJOwAqSqViHtK6MXMaTDaD8OjnN4lw+SO/8AUGdc2CyC3/7s2Y/oZlq0dS4eCrknJOOQu/ECacWtI3XL587vUW8WM1uuA3I4urXgLWqtOc5xqUdicrlcGjYDxNzXndQw4eq51kENl00l4Y9fdCQIZJzH0BYAJpLM03Rka0XKQeSYw5WgXMvYVRrBXT16urY4p2hmwl3lOn2RWS9l3/TpvUuwYZy8dF3FZsjBCsOvRae0Hl9k2g2Ux4PggXwspqP5CfxIQpzS18OhKGh2FxCS9/Dztu9g/wAqUrfiFU5c37/QVyY8w3Zm7ajiOCCx/DmuHv4dtz+rjX9Q80uWO+R2SKJy7WnKZkDwlMf4im7knmfiKAuWLa4huusQZ6y1y5mJtkNrokQ5WtFSfoBuTwCjhuVc9tJodiFW93uHIAhvfqu3PP1x258cd3RTiuJOm5hrjUNrlhsrZra3P+46n9laYsrliS7eEJ5PTM0eF1VvZ6WL47AONR0DSSf+wVnxKYzvL26AZGni22Y99KrknPNdF44hXiEbNEc6nIDkFGIddtvVVI1l+7vRUKHa6XQsk4OiZSsIaqKAy1tPl3o6AWj9R5fdPjC1KxlbUNPI80cxhCgiOeAKlrB1FfNcMiNLruLrbVI+yrsmhxh8T5hdPIDa5h4hCMewm1a9FKabV8PutttJGvbu4fO67ZlP4h4+SHZMDTITfcj1stxHsOxbXjQ+QR2Gk8WEa6b/ADS2JWvLjvVFs0sad/0UNDcG/NEA8ZgQTxQOYfhcNO5Mnsso/cAnu/daxpVMfDINDqPVVydE7xmRoC7dvmK/wkj1CzSkqBxSeb+Mpw9KpxvaSmgZmqxY3VYgz1CCeKoOJzPvIsR/5nW6aNHTKGhXSbjBkKI8/hY4+VAvPIY7Jvw8hRW8/OoTx/pnIzRhvzN17Tf+Qa37qyn/AExfTfoC0+Li7wVTwluaKwHcinX1RWsuGSnDfagNAe+hP+SnjNw9oOBUF1Ty6KcsBpc9EG6MKc8y1LTdTW1PX2QtY7Y61KE8hv1KKhZ6VJpyFvNAy9CAL9OvyTVmWmUVPQHXmU2PIVLClma7n5dVP7sA0tflwULDludh5KV0TMQQND0PgqSQu04hV26H6UUxZchbhEVAH79FkPtFx5mh702i7cS7a10+q5fDB30UL3Ue9vQjob276qYHaui2m2kZCHo3WRYF6jfZdAjj+y22+l/AolAO1IUsuy/d9KqGM6jtDZTQH9oeHkn7AFiEKxJ0Id/43VOerxOXDe/5lVXF5TI61gamnD9rqXkh8aVPQE0y6YuCCmhdRUhfl7SxdRBdYlFdMdaTKxqa5K9zXBx8gVQWxKg8KE9w9Er0yGARQ3BFCOINiqDiuE/00UQw7NDeKsJ1AzULXceq6PLjxtPx34igxCyKHN5AbkE2HkrnFcPdAjQbcdq9KhUotoy3xB1z5AHwT3FJoDIxpsIbacwWglSl1Dd0HNxL2Wo5LGsI3NxyqKKFnacTtVMHSLnajM3UeNUmOOz26P8ADnVAFyaaAb2Napq2HFpbINxU1PeKKrSk05orQtDaA2pcmgAG50TqT/ujWoqKEk5QeGUWN910YyRLK2pnCN/+sEf8vkg52NMw60cx1BXsg0PfUqywpA0/1AOI92ynyVf9rYwl2ZogAzA5IrAWjOBUMisHxNOlduWqfj8LOa17O+0Pvq5Sc29aVbXZWiXYaWtbgvHMBnHtimKBTObjvXp8nNvNLnTjTlSilPJzo9wTT0cmmUVcKjqCKjwv4pU90UfFEaK/4gd9bpoRc2qSLcSeBP1Qcvg0MEdnO8aueM1N6MabNHPdUpdB4bogI/vMI4ZrJ5JTALT2hY3Io7n3KZkjT8bgeTYdPDKl2JyDycocSSKh4a1j200qW2cORR5heK7mq30udd+9ZBi0c08wVuVkouX+4b8vnRQzIoRyse+32RYwiQDmZQVFdduqrHtL8bB+j60+itj4lMrtjlPfobeKqPtO7+9Tg36lDyf1bDslcgpkXRxKBnHXXMsCjG60untWJTL9BSD2zgVEKIPwucCeFQDTyKeQDZKPbCPkgtd+H3oqeHZOXzXXnN41z4/2IpZw7TfzZT3UNUI6tQDsKDpay1JuDjRpsf8ArU3opnVLz1K48q6JEsjD7661V4w/D4JABYRYfC8t53HBU/DRQ9/grfIvoAK9evPin8eWgym3PtFKsENghNByu7WpIa4UN+PPVZhMo2FRlHZdq0v4I6Aa1J3r5pjLy7aBtaUVZd3admoJhNcaUa0HnU+SQe3suPctD+24k0FOy0Uu6m+ysgiZfXlZVr2jq8l79KUaODfubo+S/wAQw7efyjKOaNrfdejSV2jh3KhxYVL+CueBR6sA5rm8fa+fQ+fBbQg0+lk0koDYjWxGilg0ipNCLboCaFaDn+yJwclhdTvGxH35rrjnpkGkfi8aISKwtcYgNaDTrWx8kxZFDtPPUcqIcwSTc1A0ATUsA/1JNsoB4aoebhVFdkfNQgDzQ8d9qIC4YawmN45vBpqfKiqntFEzPYaXy3KsrIuWH1zj5H6pVjUu/wBy9zmUa1tiSM1ajQbDXVHKbxbG6qrE3QE8/tItzrpbiD1yLuC5aULXLSWi9DgFLfahhMu40qGxGE8hcV8SEfLlbxGFmgR28YT/ABDS4fJd1m8a5p286wtvu3RAbZgMvUGvy+SMEUFxpzolM3OHLpUWPdv0REo+hHMfMLjyls26ZTeQqHeCtWH0NBqqpLa1CfYTM0dzQxCrOINqb/tomci876hLmRrD13ouUjK8JR7wNaKu+0J7LieFutFY2egqZ7Z4mPe+4bsAXHhW9OtFvJxjtseyCNFA7vMp/wCzZNORvoqrORBVoB1VnwN4yj1wXLjvat6PJmJShR8g69tCPBLJk9np5g/uiMEmA05XXDx4Hl9l1434jlDx7RWoU8F1CVAx1d+ncu2xE5HMy3dKJx4obo6ai+uSSzb6kjiVmFYS0Oe3NcDM7voAD4qP2qiAS0Wu9h/yA+6JwvssJ4k1O9B/Kr/ttOgshQhrdzuZrb5psrrFpN1UYhS7EDoj3FL5/Zca6AlYuHaBYlF6HKlGQm1zA6EEHoRT6pfKvR0tqV3Ry15lMSRAiQyKPbUEc9EHJOqwcRY9yvHtlh495DjNsX9lx/UBUHvHyVYiQrNJFK1suXL+O8XTOeUktGsLp5IRbhVsC9E7wZ3FLO2qxxZtw9cU6w2JWnj5Kq4g6kRreI8dlY8FNaV4d26pOyXpZJe6889s8IiCLEjN7QLwXDUgUAPWgV8EXK2u5sNPFKJ25odCnzksLjdV5hjOGxw5roYzMLM4cOtMvXS3NH4BjphgNeKEE1BPdYK6mWbTQU6bKVknCAzOYHHoCt641t2B8NmYk1QCohts5/CpuK6VPBN8MwfJGe50RzmAkQwdRXQnkNFHLzZAa02aDoBSg2smTST9/qnmi3bcIOY4tJtt3op7gQuYsPO0NPxD4TzG3eg/edk8fNGwNsc6qVvFYlOFfkjbhrShSO0T60WZqTmne9dDoQ0CodSxLtqqn4xNe8iudsDlb/tbb7q2zT8sJ5H4mOvwIrRUKtlLy34phPrl5QU8bItBz+igoGaVi5hlYhRXmWemMpEukUGLQI6Ui3K7Ma58oYY5JGNCcxt32czbtN0FeYqO9ecTU1V+Q2Lagg6gtsQQvTmxbjogsfkGxoEWjG+8yVa/K3OSwh4Galb5ad6GeEy5HDLXDz54vX1dNsIFCCksOJUDojsNikeK552tVmxpv9yC7bL9lY8Kh2BG9FX8UvDgv/KaFWHBYgyUB/hWk5TvQiNGJeQDZtuu5KCnH3HrdMpKVq4nWpPmUk9tGZXMbCcW0HaLQMxJOxPw23CPGt0v3SGfxFkIARHEOdowCriP9oug24m/NVjXAH83Z8K/socPkWNvlNTq4lznHmXE1Kf4ZDg7ltt82/G6WZ88Q3r/AKXS2L5jUtLjXfs9aEjVPpDGYbiAasd+R4ymvI6HuKyGyBftMuOI+QWnyzKjsgqmN/wlhxDiB2ijmwC0n83z0KlZDGVoYKAClBsOFPJRTVm3GyeliF/+kwn8v1S+ENev7It7v7LB+n5ndCtFGX0+lalAVWxrFnF74I0aaVrxoT9fFJlzFj53vf8AmcT3E28qLa5MruryajRQM+OyjihpsdkpRL2GgWly7RYhoVmhPsjpOJqlUFyMlnXK6cUqdiPcdEVBjJPmuiYbk+y6U72lkTAmDQf24naZyv2mdQfIhByUbtK64/AbFl4gcLsaXtPBzR9RUFefsdlcD6BUspNnl4egwBnli3hcHv4Kb2bnbZTt68UB7PzQe0t5IURDCiknj6HmmB6PKxco1205pXOyfvHl3rghpTEw8ao6BF256rW/GkRQ8JJsCERCwBp+J3mioJ71M1w23Wn/AALv9Av9n21GV9DzOvJGQpIjnTz7lKam/qigik67/TkU0CjZewvr6ugsSi2pyXcKYNOdPmh39p4ppWvhsnhWYkcrQzcAA9Uk9pZv3cs+mrhlH+Vvumc5FzPPAegq37YOrALtQ1zR31qfIoZdNO1YgKUIOXjNNg6/MfVGFpG3euTTockqCN8JUhKijmxQYqc6yxRRDbvW00jLFAcjpa5S+FZFyjrq2KdNQO13KcIUu7SmBTA7itzNc38zXDxBC89LagHkr3EnobPie0U5qmODavy3bmND+mtvop5/psY7wyZdCdrppzB4p5Hf75tdHCnf0VczXCZyUUaFaZNYyTxF0OIWOqNvNW6Sn8wFKerJDO4Y2M3g4bpTLzUSA/JEqL2OxvqCjoNvUpWKDuD3+aPESg2Jpf8AbkqlheLtcBceP7WTZs80jWp9WqqSEt5PIE03U6fVcTMUG/yVfdPgGn2XTZ4EWB6ndEDAvFQK2t4kX+a7EagLvPgl0KYDjRvj9ESWk0bsNfsmBHUuq42H02QmOy4Ms5h1ylx62P0TaGypp+EXd02HUmnmg8Th5mO/VYcgd/mhRkeS4o/I4ZbcP53UMnizw4Amv1U2LvcXltPhJb4JRMQ6XGynqXg83Iu0vGhxQKUDuBt4FczMg6hDbngbH7JDg7xEc0E0G54U1V4GQMFQa8a3HPwUfW70puKLOSkRgOZjhf8AKVivjGuaKi7T5VvQ8Ctoy6baswXppJyrzfKabK0YbgUOXbUgOPEgeSBmp0uJEMeCf+pJdkc9NOboKEKqT2MRySC8kcP4V3mJA5SXalef44Mr6boYS28m3JAMeZLjqUzwuL/bpzokqY4U/wCJvf8ARV8mM9OE8crcjGI00qpIRNQQe7mjYMEFuihfBObko4qU7kJmopwCZOlmRAQ5oIPEfLmq+yo+EkEBPZKMXNFqFWidDQMGDT2CQOqZQZJ9Ke8HK31TOWl7dFKWNHAJtEJI0nF1zMPdQ+S3CkXF1HP7hUfPZNXuZcVH15XQ8eKBoad6wjpWEIYsiWPvlbck6bpXJykaIbacb0Hfon+HyjIQoDmebF30FfmtGS+6DRl31cfoPIJRirsxDe+nAaD1yTeZdQEm/PifsqrihiuJa0Ur2jEOprajeAHzqhRig+0uFxHRYkWCS8Zu0B8QdS5AGo6KvsmiLOFetivToWFmG0g3JuePq6Q41gjHgmmV/wCbj1CX2nVHV+KnLTbWPzAGh1bxG9OavH9awhrhoam1gWkUFl5/My5Y4tOyYYZihZRrvhAOU0rSuo6fJHPHc3Gl/V2biWWw19fwsVdgTg1zVrpusXParp6DPzz478kOoCOkMOEMc9yucNlBDAA13PFGzkfL2Rd9NOHAlWwxuXNSyuiHG4+UEAVcbAC5XlmMy7hEJcbleqYyYUvDdEiv7Z3J34ALyfE5kxohcBY6D9lW4+pZdgiRsp5B3b6grl8uW3dZagPo9tOK11YPV5XXBnVAFU1/pBsKetVVcOikOA5q6yVHUvrTquXHhXIK+RIvTlQ89Ebh4JpQI18K1NfuppGGGA2vX91aVOwbDhO3IaNrX8FjcMhE1c5xPUC3chYUQFxJNSdxXbYI+WDaW04fMVT7Lpy3CpcfgJ6vdr3FTQZOC01EJtRxv/5Wqp3EbcPDmo23ubDbnyH3RBM55NvtTvXQo3Q1O54cgog872FbAcOu5UjogZrd2w+p5IbHSHECQNKuOjeXE9UtgYW6piRH5jU2vT90XEJLsxO/eppmNQAFKacEeI1DhxHnySqeo65qKeabT96nwHrdKpiXoL6G6jnVMYqWMyrTex+aRTkuBQDUC/VWqfhhzqNHw3PzA6pK+WpEa0nVyGGdhrjNC5GLCYRDc0Z6WJuKUqRyKxBY4aFuWzta78FieeOZTZbbOHrLo2c5IeoFXO2YOfE8AlGK47Dlqth9t+7ifxc9+5IJzGiP/ayfHtvFy92hJPBMMMwuFAb7+Oc7gK30B5Dc7K3tMZqdo632BlvZ6NOO9/MuLWDd2tODW7Ju7DIDGlkBgA3dq404k6ruNMxI+Vzhkhj4YYIHe47nkmhlmsgl9LbDieA5VUucqfqPIMbaTGeaWBoOgQ8vCq4DvT7FZY5y40S2TbcuO6P/AKcG9REs6jgRsrbhMzUKqmFRMsNikabKMpqv8sK0O3BTTMpUWrppVA4TM270/h3Gm1P4VseYnSOXY4G/HxTWGw0rrVSOk+FKerrsuyjgmk0Vggbk93TitOhVOYkCm5Nhy+aCdiFzlbm5u08Bc+KjY10QgvJd5AdALBC5wZhR7p7aEKnTORb/ABafmVkKHS5JJNySdT1WQYCinZlkIcTwqNUN/aOvkZPxgzLmI1pTep0oFBM4i14tp030KRxJ0xIxNbNHcDpTlQIf+qAc4MJJrfcU58FO5/DTE2m49tvuk8N8SMXNb8LbF9LA/lbxd8l1OQ4xjtgRGOY0tqHi7X6dkPHwnzTOZhNgtDWgNHAaDjzuhZaZXMQb7ttKaePMlIJh1Y8MaW8uSf424RK0BA8D3KtzjqTLAKUoKd4S4zk2wuOfGBwb+6xEYzApGe2ulPHKFitjlqQtnK8QJSDIQRUViOsB+JzuXLmgZUOiPzxDUk1yjRp5cTzUcSIYrnTEY0FaMbuG/lHWys2B4eMoLmAOcbNP4RtX5pJvK6heMZutychn03rblvVA4zPZuyA7KBTkmmMYk2E0w2fGRcjb1dVqPEJ1KfPL1nrC4zfJbPgO7IbtqbUSVkClqbp9EfY9ClkK/wBeNeCh8VdslwRQeC7lmFpoVI11KKVhBIrZaVjnDo1KDmDVWmSmVSYLwSQNlYMOmh0VMcy2LG+KPW6VYjNVqAafU8CtTsaosd70/dIJye2zCleu+ibLPgsxOYBJqd9uvFMHzcOEKvdTlue5VA4064Zb9SHdNAUc8kk7alS9pD62sEzjr3mkPst470SmPHqcrTcfFEP4eTRu5DQfeRPhY410a0H/ALOsAEfL4HFdQPc2GDsBmd5W8ytu0dSIJGWMfMxhLYUOmY6kn8oP5jueaYQDDETKGhrG3oPWvNNHy7JeCYcMUa3fUucdSTuSUnlpctoSKlxrfWm2vimuOiy7OJmhDTfT9/KyWz0xnbU3B2+qPxQ+IBHO/wDCVx4BLQBppTeqa3UCK9NxS45RYG2+n0Vfk3e8m2cDFbQcgfsFasThCHDJ3IPdVVLArTcLlECXxzs96Psaw8ujPeNC5YrLiEnVteJWJbtthvZ+A18Ql4rkY0troCTrTRWSPFLQSDQ8fFYsVvAl5O1XjOJcSboWMVixRy7p8ekNLHogYIuf9xWLEDOwbhS1+SxYgyWEbdUwlnmyxYsyTE47rXOiSxjenL6rFiNCOq0bUJt7OS7XAvc0F2Zwqb7bV0WLEk7NTyTdoNrIw6d6xYr49ErWJCpYNjEdUdBZBTP/AMgDb+FixHIInxXRp9fCStthjLpxWLFsmise1g7JVMwQf32ncOB78wW1iGHVPHq2oPcsWLECv//Z\"}],\"classes\":[],\"children\":[],\"nodeType\":\"img\",\"styling\":[],\"text\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[{\"A1\":\"text-align\",\"A2\":\"center\"}]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"C\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":\"https://en.wikipedia.org/wiki/Cicero\"}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":\"https://en.wikipedia.org/wiki/Cicero\"}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":\"https://en.wikipedia.org/wiki/Cicero\"}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":\"https://en.wikipedia.org/wiki/Cicero\"}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":\"https://en.wikipedia.org/wiki/Cicero\"}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":\"https://en.wikipedia.org/wiki/Cicero\"}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\",\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"&\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[{\"A1\":\"text-align\",\"A2\":\"center\"}]}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"<\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"v\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"g\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"g\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"h\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\">\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[\"code\"],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"v\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"p\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"y\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"-\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"r\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"k\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"w\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"k\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[\"code\"],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"<\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"k\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\">\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[\"code\"],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"u\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[\"code\"],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"<\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"/\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"g\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"t\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"e\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"d\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"b\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"k\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\">\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[\"code\"],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"<\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"/\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"c\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"l\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"o\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"s\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"g\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\" \",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"m\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"a\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"i\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\"n\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Char\",\"A1\":{\"char\":\">\",\"fontStyle\":{\"classes\":[],\"fontFamily\":[],\"fontSize\":null,\"styling\":[]},\"link\":null}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[\"code\"],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[]}},{\"Constructor\":\"Break\",\"A1\":{\"classes\":[],\"indent\":0,\"nodeType\":null,\"styling\":[]}}]\n';
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (result.$ === 'Ok') {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Main$init = function (_v0) {
	var content = A2(
		$elm$core$Result$withDefault,
		_List_Nil,
		$dkodaj$rte$MiniRte$decodeContentString($author$project$Content$json));
	var parameters = {
		content: content,
		fontSizeUnit: $elm$core$Maybe$Nothing,
		highlighter: $elm$core$Maybe$Just($author$project$Highlighter$highlighter),
		id: 'MyRTE',
		indentUnit: $elm$core$Maybe$Nothing,
		pasteImageLinksAsImages: true,
		pasteLinksAsLinks: true,
		selectionStyle: _List_Nil,
		styling: {
			active: _List_fromArray(
				[
					$elm$html$Html$Attributes$class('rte-wrap')
				]),
			inactive: _List_fromArray(
				[
					$elm$html$Html$Attributes$class('blogpost')
				])
		},
		tagger: $author$project$Main$Rte
	};
	var _v1 = $dkodaj$rte$MiniRte$init(parameters);
	var rte = _v1.a;
	var cmd = _v1.b;
	return _Utils_Tuple2(
		{rte: rte},
		cmd);
};
var $dkodaj$rte$MiniRte$Types$FromBrowserClipboard = function (a) {
	return {$: 'FromBrowserClipboard', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$Main$fromBrowserClipboard = _Platform_incomingPort('fromBrowserClipboard', $elm$json$Json$Decode$string);
var $elm$core$Platform$Sub$map = _Platform_map;
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$FocusOnEditor = {$: 'FocusOnEditor'};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$KeyDown = function (a) {
	return {$: 'KeyDown', a: a};
};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$KeyUp = function (a) {
	return {$: 'KeyUp', a: a};
};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$MouseUp = {$: 'MouseUp'};
var $dkodaj$rte$MiniRte$Core$decodeKey = function (f) {
	return A2(
		$elm$json$Json$Decode$map,
		f,
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
};
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 'Every', a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {processes: processes, taggers: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
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
var $elm$browser$Browser$Events$onMouseUp = A2($elm$browser$Browser$Events$on, $elm$browser$Browser$Events$Document, 'mouseup');
var $dkodaj$rte$MiniRte$Core$subscriptions = function (e) {
	var _v0 = e.state;
	switch (_v0.$) {
		case 'Display':
			return $elm$core$Platform$Sub$none;
		case 'Edit':
			return $elm$core$Platform$Sub$batch(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$Sub$map($dkodaj$rte$MiniRte$Types$Internal),
					_List_fromArray(
						[
							$elm$browser$Browser$Events$onKeyDown(
							$dkodaj$rte$MiniRte$Core$decodeKey($dkodaj$rte$MiniRte$TypesThatAreNotPublic$KeyDown)),
							$elm$browser$Browser$Events$onKeyUp(
							$dkodaj$rte$MiniRte$Core$decodeKey($dkodaj$rte$MiniRte$TypesThatAreNotPublic$KeyUp)),
							$elm$browser$Browser$Events$onMouseUp(
							$elm$json$Json$Decode$succeed($dkodaj$rte$MiniRte$TypesThatAreNotPublic$MouseUp)),
							A2(
							$elm$time$Time$every,
							200,
							function (_v1) {
								return $dkodaj$rte$MiniRte$TypesThatAreNotPublic$FocusOnEditor;
							})
						])));
		default:
			return $elm$core$Platform$Sub$none;
	}
};
var $dkodaj$rte$MiniRte$Common$subscriptions = function (model) {
	return A2(
		$elm$core$Platform$Sub$map,
		model.tagger,
		$dkodaj$rte$MiniRte$Core$subscriptions(model.textarea));
};
var $dkodaj$rte$MiniRte$subscriptions = $dkodaj$rte$MiniRte$Common$subscriptions;
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$dkodaj$rte$MiniRte$subscriptions(model.rte),
				$author$project$Main$fromBrowserClipboard(
				A2($elm$core$Basics$composeL, $author$project$Main$Rte, $dkodaj$rte$MiniRte$Types$FromBrowserClipboard))
			]));
};
var $author$project$Main$DownloadContentEnd = function (a) {
	return {$: 'DownloadContentEnd', a: a};
};
var $author$project$Main$FileDecoded = function (a) {
	return {$: 'FileDecoded', a: a};
};
var $author$project$Main$FileSelected = function (a) {
	return {$: 'FileSelected', a: a};
};
var $dkodaj$rte$MiniRte$Types$LoadContent = function (a) {
	return {$: 'LoadContent', a: a};
};
var $dkodaj$rte$MiniRte$Types$LoadText = function (a) {
	return {$: 'LoadText', a: a};
};
var $elm$file$File$Download$bytes = F3(
	function (name, mime, content) {
		return A2(
			$elm$core$Task$perform,
			$elm$core$Basics$never,
			A3(
				_File_download,
				name,
				mime,
				_File_makeBytesSafeForInternetExplorer(content)));
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$bytes$Bytes$Encode$getWidth = function (builder) {
	switch (builder.$) {
		case 'I8':
			return 1;
		case 'I16':
			return 2;
		case 'I32':
			return 4;
		case 'U8':
			return 1;
		case 'U16':
			return 2;
		case 'U32':
			return 4;
		case 'F32':
			return 4;
		case 'F64':
			return 8;
		case 'Seq':
			var w = builder.a;
			return w;
		case 'Utf8':
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_width(bs);
	}
};
var $elm$bytes$Bytes$LE = {$: 'LE'};
var $elm$bytes$Bytes$Encode$write = F3(
	function (builder, mb, offset) {
		switch (builder.$) {
			case 'I8':
				var n = builder.a;
				return A3(_Bytes_write_i8, mb, offset, n);
			case 'I16':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_i16,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'I32':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_i32,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'U8':
				var n = builder.a;
				return A3(_Bytes_write_u8, mb, offset, n);
			case 'U16':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_u16,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'U32':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_u32,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'F32':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_f32,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'F64':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_f64,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'Seq':
				var bs = builder.b;
				return A3($elm$bytes$Bytes$Encode$writeSequence, bs, mb, offset);
			case 'Utf8':
				var s = builder.b;
				return A3(_Bytes_write_string, mb, offset, s);
			default:
				var bs = builder.a;
				return A3(_Bytes_write_bytes, mb, offset, bs);
		}
	});
var $elm$bytes$Bytes$Encode$writeSequence = F3(
	function (builders, mb, offset) {
		writeSequence:
		while (true) {
			if (!builders.b) {
				return offset;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$builders = bs,
					$temp$mb = mb,
					$temp$offset = A3($elm$bytes$Bytes$Encode$write, b, mb, offset);
				builders = $temp$builders;
				mb = $temp$mb;
				offset = $temp$offset;
				continue writeSequence;
			}
		}
	});
var $elm$bytes$Bytes$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0.a;
		return A2(_Bytes_decode, decoder, bs);
	});
var $elm$bytes$Bytes$Decode$Decoder = function (a) {
	return {$: 'Decoder', a: a};
};
var $elm$bytes$Bytes$Decode$map2 = F3(
	function (func, _v0, _v1) {
		var decodeA = _v0.a;
		var decodeB = _v1.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v2 = A2(decodeA, bites, offset);
					var aOffset = _v2.a;
					var a = _v2.b;
					var _v3 = A2(decodeB, bites, aOffset);
					var bOffset = _v3.a;
					var b = _v3.b;
					return _Utils_Tuple2(
						bOffset,
						A2(func, a, b));
				}));
	});
var $folkertdev$elm_flate$Inflate$GZip$andMap = F2(
	function (argument, _function) {
		return A3($elm$bytes$Bytes$Decode$map2, $elm$core$Basics$apL, _function, argument);
	});
var $elm$bytes$Bytes$Decode$andThen = F2(
	function (callback, _v0) {
		var decodeA = _v0.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v1 = A2(decodeA, bites, offset);
					var newOffset = _v1.a;
					var a = _v1.b;
					var _v2 = callback(a);
					var decodeB = _v2.a;
					return A2(decodeB, bites, newOffset);
				}));
	});
var $elm$bytes$Bytes$Decode$bytes = function (n) {
	return $elm$bytes$Bytes$Decode$Decoder(
		_Bytes_read_bytes(n));
};
var $elm$bytes$Bytes$BE = {$: 'BE'};
var $elm$bytes$Bytes$Decode$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$bytes$Bytes$Decode$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$core$Basics$ge = _Utils_ge;
var $elm$bytes$Bytes$Decode$map = F2(
	function (func, _v0) {
		var decodeA = _v0.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v1 = A2(decodeA, bites, offset);
					var aOffset = _v1.a;
					var a = _v1.b;
					return _Utils_Tuple2(
						aOffset,
						func(a));
				}));
	});
var $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32case = function (i) {
	switch (i) {
		case 0:
			return 0;
		case 1:
			return 498536548;
		case 2:
			return 997073096;
		case 3:
			return 651767980;
		case 4:
			return 1994146192;
		case 5:
			return 1802195444;
		case 6:
			return 1303535960;
		case 7:
			return 1342533948;
		case 8:
			return 3988292384;
		case 9:
			return 4027552580;
		case 10:
			return 3604390888;
		case 11:
			return 3412177804;
		case 12:
			return 2607071920;
		case 13:
			return 2262029012;
		case 14:
			return 2685067896;
		default:
			return 3183342108;
	}
};
var $folkertdev$elm_flate$Checksum$Crc32$step = F2(
	function (_byte, crc) {
		var a = (crc ^ _byte) >>> 0;
		var b = ((a >>> 4) ^ $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32case(a & 15)) >>> 0;
		var c = (b >>> 4) ^ $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32case(b & 15);
		return c;
	});
var $elm$bytes$Bytes$Decode$succeed = function (a) {
	return $elm$bytes$Bytes$Decode$Decoder(
		F2(
			function (_v0, offset) {
				return _Utils_Tuple2(offset, a);
			}));
};
var $elm$bytes$Bytes$Decode$unsignedInt32 = function (endianness) {
	return $elm$bytes$Bytes$Decode$Decoder(
		_Bytes_read_u32(
			_Utils_eq(endianness, $elm$bytes$Bytes$LE)));
};
var $elm$bytes$Bytes$Decode$unsignedInt8 = $elm$bytes$Bytes$Decode$Decoder(_Bytes_read_u8);
var $folkertdev$elm_flate$Checksum$Crc32$crc32Help = function (_v0) {
	var remaining = _v0.remaining;
	var crc = _v0.crc;
	return (remaining >= 8) ? A3(
		$elm$bytes$Bytes$Decode$map2,
		F2(
			function (word1, word2) {
				var byte8 = 255 & word2;
				var byte7 = 255 & (word2 >>> 8);
				var byte6 = 255 & (word2 >>> 16);
				var byte5 = 255 & (word2 >>> 24);
				var byte4 = 255 & word1;
				var byte3 = 255 & (word1 >>> 8);
				var byte2 = 255 & (word1 >>> 16);
				var byte1 = 255 & (word1 >>> 24);
				return $elm$bytes$Bytes$Decode$Loop(
					{
						crc: A2(
							$folkertdev$elm_flate$Checksum$Crc32$step,
							byte8,
							A2(
								$folkertdev$elm_flate$Checksum$Crc32$step,
								byte7,
								A2(
									$folkertdev$elm_flate$Checksum$Crc32$step,
									byte6,
									A2(
										$folkertdev$elm_flate$Checksum$Crc32$step,
										byte5,
										A2(
											$folkertdev$elm_flate$Checksum$Crc32$step,
											byte4,
											A2(
												$folkertdev$elm_flate$Checksum$Crc32$step,
												byte3,
												A2(
													$folkertdev$elm_flate$Checksum$Crc32$step,
													byte2,
													A2($folkertdev$elm_flate$Checksum$Crc32$step, byte1, crc)))))))),
						remaining: remaining - 8
					});
			}),
		$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
		$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE)) : ((remaining > 0) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_byte) {
			return $elm$bytes$Bytes$Decode$Loop(
				{
					crc: A2($folkertdev$elm_flate$Checksum$Crc32$step, _byte, crc),
					remaining: remaining - 1
				});
		},
		$elm$bytes$Bytes$Decode$unsignedInt8) : $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done((crc ^ 4294967295) >>> 0)));
};
var $elm$bytes$Bytes$Decode$loopHelp = F4(
	function (state, callback, bites, offset) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var decoder = _v0.a;
			var _v1 = A2(decoder, bites, offset);
			var newOffset = _v1.a;
			var step = _v1.b;
			if (step.$ === 'Loop') {
				var newState = step.a;
				var $temp$state = newState,
					$temp$callback = callback,
					$temp$bites = bites,
					$temp$offset = newOffset;
				state = $temp$state;
				callback = $temp$callback;
				bites = $temp$bites;
				offset = $temp$offset;
				continue loopHelp;
			} else {
				var result = step.a;
				return _Utils_Tuple2(newOffset, result);
			}
		}
	});
var $elm$bytes$Bytes$Decode$loop = F2(
	function (state, callback) {
		return $elm$bytes$Bytes$Decode$Decoder(
			A2($elm$bytes$Bytes$Decode$loopHelp, state, callback));
	});
var $elm$bytes$Bytes$width = _Bytes_width;
var $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32 = function (buffer) {
	var length = $elm$bytes$Bytes$width(buffer);
	var initialCrc = 4294967295;
	return (!length) ? 0 : A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$bytes$Bytes$Decode$decode,
			A2(
				$elm$bytes$Bytes$Decode$loop,
				{crc: initialCrc, remaining: length},
				$folkertdev$elm_flate$Checksum$Crc32$crc32Help),
			buffer));
};
var $folkertdev$elm_flate$Checksum$Crc32$crc32 = $folkertdev$elm_flate$Checksum$Crc32$tinf_crc32;
var $elm$bytes$Bytes$Decode$fail = $elm$bytes$Bytes$Decode$Decoder(_Bytes_decodeFailure);
var $folkertdev$elm_flate$Inflate$GZip$flags = {comment: 16, crc: 2, extra: 4, name: 8, text: 1};
var $folkertdev$elm_flate$Inflate$GZip$skipUntilZero = function () {
	var go = function (n) {
		return A2(
			$elm$bytes$Bytes$Decode$map,
			function (_byte) {
				return (!_byte) ? $elm$bytes$Bytes$Decode$Done(n + 1) : $elm$bytes$Bytes$Decode$Loop(n + 1);
			},
			$elm$bytes$Bytes$Decode$unsignedInt8);
	};
	return A2($elm$bytes$Bytes$Decode$loop, 0, go);
}();
var $elm$bytes$Bytes$Decode$unsignedInt16 = function (endianness) {
	return $elm$bytes$Bytes$Decode$Decoder(
		_Bytes_read_u16(
			_Utils_eq(endianness, $elm$bytes$Bytes$LE)));
};
var $folkertdev$elm_flate$Inflate$GZip$gzipFindBuffer = function (sliced) {
	if ((sliced.id1 !== 31) || (sliced.id2 !== 139)) {
		return $elm$core$Maybe$Nothing;
	} else {
		if (sliced.method !== 8) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!(!(sliced.flg & 224))) {
				return $elm$core$Maybe$Nothing;
			} else {
				var headerSize = 10;
				var flagSet = function (flag) {
					return !(!(sliced.flg & flag));
				};
				var skipExtra = flagSet($folkertdev$elm_flate$Inflate$GZip$flags.extra) ? A2(
					$elm$bytes$Bytes$Decode$andThen,
					function (extraSize) {
						return A2(
							$elm$bytes$Bytes$Decode$map,
							function (_v1) {
								return extraSize + 2;
							},
							$elm$bytes$Bytes$Decode$bytes(extraSize));
					},
					$elm$bytes$Bytes$Decode$unsignedInt16($elm$bytes$Bytes$LE)) : $elm$bytes$Bytes$Decode$succeed(0);
				var skipFileComment = flagSet($folkertdev$elm_flate$Inflate$GZip$flags.comment) ? $folkertdev$elm_flate$Inflate$GZip$skipUntilZero : $elm$bytes$Bytes$Decode$succeed(0);
				var skipFileName = flagSet($folkertdev$elm_flate$Inflate$GZip$flags.name) ? $folkertdev$elm_flate$Inflate$GZip$skipUntilZero : $elm$bytes$Bytes$Decode$succeed(0);
				var skipAll = A2(
					$folkertdev$elm_flate$Inflate$GZip$andMap,
					skipFileComment,
					A2(
						$folkertdev$elm_flate$Inflate$GZip$andMap,
						skipFileName,
						A2(
							$folkertdev$elm_flate$Inflate$GZip$andMap,
							skipExtra,
							$elm$bytes$Bytes$Decode$succeed(
								F3(
									function (a, b, c) {
										return (a + b) + c;
									})))));
				var checkHeaderCrc = function (bytesRead) {
					return flagSet($folkertdev$elm_flate$Inflate$GZip$flags.crc) ? A2(
						$elm$bytes$Bytes$Decode$andThen,
						function (checksum) {
							var _v0 = A2(
								$elm$bytes$Bytes$Decode$decode,
								$elm$bytes$Bytes$Decode$bytes(bytesRead),
								sliced.orig);
							if (_v0.$ === 'Just') {
								var header = _v0.a;
								return (!_Utils_eq(
									checksum,
									$folkertdev$elm_flate$Checksum$Crc32$crc32(header) & 65535)) ? $elm$bytes$Bytes$Decode$fail : $elm$bytes$Bytes$Decode$succeed(2);
							} else {
								return $elm$bytes$Bytes$Decode$fail;
							}
						},
						$elm$bytes$Bytes$Decode$unsignedInt16($elm$bytes$Bytes$LE)) : $elm$bytes$Bytes$Decode$succeed(0);
				};
				var decoder = A2(
					$elm$bytes$Bytes$Decode$andThen,
					function (skipped0) {
						return A2(
							$elm$bytes$Bytes$Decode$andThen,
							function (skipped1) {
								var skipped = skipped0 + skipped1;
								return $elm$bytes$Bytes$Decode$bytes(
									$elm$bytes$Bytes$width(sliced.buffer) - skipped);
							},
							checkHeaderCrc(skipped0 + headerSize));
					},
					skipAll);
				return A2($elm$bytes$Bytes$Decode$decode, decoder, sliced.buffer);
			}
		}
	}
};
var $folkertdev$elm_flate$Inflate$GZip$GzipSlice = F9(
	function (orig, id1, id2, method, flg, restOfHeader, buffer, crc32, decompressedLength) {
		return {buffer: buffer, crc32: crc32, decompressedLength: decompressedLength, flg: flg, id1: id1, id2: id2, method: method, orig: orig, restOfHeader: restOfHeader};
	});
var $folkertdev$elm_flate$Inflate$GZip$gzipSlice = function (buffer) {
	var decoder = A2(
		$folkertdev$elm_flate$Inflate$GZip$andMap,
		$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$LE),
		A2(
			$folkertdev$elm_flate$Inflate$GZip$andMap,
			$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$LE),
			A2(
				$folkertdev$elm_flate$Inflate$GZip$andMap,
				$elm$bytes$Bytes$Decode$bytes(
					(($elm$bytes$Bytes$width(buffer) - 10) - 4) - 4),
				A2(
					$folkertdev$elm_flate$Inflate$GZip$andMap,
					$elm$bytes$Bytes$Decode$bytes(6),
					A2(
						$folkertdev$elm_flate$Inflate$GZip$andMap,
						$elm$bytes$Bytes$Decode$unsignedInt8,
						A2(
							$folkertdev$elm_flate$Inflate$GZip$andMap,
							$elm$bytes$Bytes$Decode$unsignedInt8,
							A2(
								$folkertdev$elm_flate$Inflate$GZip$andMap,
								$elm$bytes$Bytes$Decode$unsignedInt8,
								A2(
									$folkertdev$elm_flate$Inflate$GZip$andMap,
									$elm$bytes$Bytes$Decode$unsignedInt8,
									$elm$bytes$Bytes$Decode$succeed(
										$folkertdev$elm_flate$Inflate$GZip$GzipSlice(buffer))))))))));
	return A2($elm$bytes$Bytes$Decode$decode, decoder, buffer);
};
var $elm$bytes$Bytes$Encode$Bytes = function (a) {
	return {$: 'Bytes', a: a};
};
var $elm$bytes$Bytes$Encode$bytes = $elm$bytes$Bytes$Encode$Bytes;
var $folkertdev$elm_flate$Inflate$BitReader$decode = F2(
	function (bytes, _v0) {
		var reader = _v0.a;
		var initialState = {bitsAvailable: 0, buffer: bytes, reserve: 0, reserveAvailable: 0, tag: 0};
		var _v1 = reader(initialState);
		if (_v1.$ === 'Ok') {
			var _v2 = _v1.a;
			var value = _v2.a;
			return $elm$core$Result$Ok(value);
		} else {
			var e = _v1.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$bytes$Bytes$Encode$encode = _Bytes_encode;
var $elm$bytes$Bytes$Encode$Seq = F2(
	function (a, b) {
		return {$: 'Seq', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$getWidths = F2(
	function (width, builders) {
		getWidths:
		while (true) {
			if (!builders.b) {
				return width;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$width = width + $elm$bytes$Bytes$Encode$getWidth(b),
					$temp$builders = bs;
				width = $temp$width;
				builders = $temp$builders;
				continue getWidths;
			}
		}
	});
var $elm$bytes$Bytes$Encode$sequence = function (builders) {
	return A2(
		$elm$bytes$Bytes$Encode$Seq,
		A2($elm$bytes$Bytes$Encode$getWidths, 0, builders),
		builders);
};
var $folkertdev$elm_flate$Experimental$ByteArray$ByteArray = F3(
	function (a, b, c) {
		return {$: 'ByteArray', a: a, b: b, c: c};
	});
var $folkertdev$elm_flate$Experimental$ByteArray$empty = A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, $elm$core$Array$empty, 0, 0);
var $folkertdev$elm_flate$Inflate$BitReader$BitReader = function (a) {
	return {$: 'BitReader', a: a};
};
var $folkertdev$elm_flate$Inflate$BitReader$loopHelp = F3(
	function (accum, callback, state) {
		loopHelp:
		while (true) {
			var _v0 = callback(accum);
			var decoder = _v0.a;
			var _v1 = decoder(state);
			if (_v1.$ === 'Err') {
				var e = _v1.a;
				return $elm$core$Result$Err(e);
			} else {
				if (_v1.a.a.$ === 'Loop') {
					var _v2 = _v1.a;
					var newAccum = _v2.a.a;
					var newState = _v2.b;
					var $temp$accum = newAccum,
						$temp$callback = callback,
						$temp$state = newState;
					accum = $temp$accum;
					callback = $temp$callback;
					state = $temp$state;
					continue loopHelp;
				} else {
					var _v3 = _v1.a;
					var result = _v3.a.a;
					var newState = _v3.b;
					return $elm$core$Result$Ok(
						_Utils_Tuple2(result, newState));
				}
			}
		}
	});
var $folkertdev$elm_flate$Inflate$BitReader$loop = F2(
	function (state, callback) {
		return $folkertdev$elm_flate$Inflate$BitReader$BitReader(
			A2($folkertdev$elm_flate$Inflate$BitReader$loopHelp, state, callback));
	});
var $folkertdev$elm_flate$Inflate$BitReader$map = F2(
	function (f, _v0) {
		var g = _v0.a;
		return $folkertdev$elm_flate$Inflate$BitReader$BitReader(
			function (s) {
				var _v1 = g(s);
				if (_v1.$ === 'Ok') {
					var _v2 = _v1.a;
					var value = _v2.a;
					var newState = _v2.b;
					return $elm$core$Result$Ok(
						_Utils_Tuple2(
							f(value),
							newState));
				} else {
					var e = _v1.a;
					return $elm$core$Result$Err(e);
				}
			});
	});
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$bytes$Bytes$Encode$U16 = F2(
	function (a, b) {
		return {$: 'U16', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt16 = $elm$bytes$Bytes$Encode$U16;
var $elm$bytes$Bytes$Encode$U32 = F2(
	function (a, b) {
		return {$: 'U32', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt32 = $elm$bytes$Bytes$Encode$U32;
var $elm$bytes$Bytes$Encode$U8 = function (a) {
	return {$: 'U8', a: a};
};
var $elm$bytes$Bytes$Encode$unsignedInt8 = $elm$bytes$Bytes$Encode$U8;
var $folkertdev$elm_flate$Experimental$ByteArray$toBytes = function (_v0) {
	var array = _v0.a;
	var finalSize = _v0.b;
	var finalBytes = _v0.c;
	var initial = function () {
		var finalInt32 = finalBytes >>> ((4 - finalSize) * 8);
		switch (finalSize) {
			case 4:
				return _List_fromArray(
					[
						A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$BE, finalBytes)
					]);
			case 1:
				return _List_fromArray(
					[
						$elm$bytes$Bytes$Encode$unsignedInt8(finalInt32)
					]);
			case 2:
				return _List_fromArray(
					[
						A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$BE, finalInt32)
					]);
			case 3:
				return _List_fromArray(
					[
						A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$BE, finalInt32 >> 8),
						$elm$bytes$Bytes$Encode$unsignedInt8(255 & finalInt32)
					]);
			default:
				return _List_Nil;
		}
	}();
	var folder = F2(
		function (element, accum) {
			return A2(
				$elm$core$List$cons,
				A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$BE, element),
				accum);
		});
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			A3($elm$core$Array$foldr, folder, initial, array)));
};
var $folkertdev$elm_flate$Inflate$BitReader$andThen = F2(
	function (f, _v0) {
		var g = _v0.a;
		return $folkertdev$elm_flate$Inflate$BitReader$BitReader(
			function (s) {
				var _v1 = g(s);
				if (_v1.$ === 'Ok') {
					var _v2 = _v1.a;
					var value = _v2.a;
					var newState = _v2.b;
					var _v3 = f(value);
					var h = _v3.a;
					return h(newState);
				} else {
					var e = _v1.a;
					return $elm$core$Result$Err(e);
				}
			});
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $folkertdev$elm_flate$Experimental$ByteArray$push = F2(
	function (value, input) {
		var array = input.a;
		var finalSize = input.b;
		var finalBytes = input.c;
		if (finalSize === 4) {
			return A3(
				$folkertdev$elm_flate$Experimental$ByteArray$ByteArray,
				A2($elm$core$Array$push, finalBytes, array),
				1,
				value << 24);
		} else {
			if (!finalSize) {
				return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, 1, value << 24);
			} else {
				var offset = finalSize;
				var internalIndex = $elm$core$Array$length(array) - 1;
				var _new = ((255 & value) << ((3 - offset) * 8)) | finalBytes;
				var mask = 4278190080 >>> (offset * 8);
				return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize + 1, _new);
			}
		}
	});
var $folkertdev$elm_flate$Experimental$ByteArray$pushMany = F3(
	function (nbytes, value_, input) {
		var array = input.a;
		var finalSize = input.b;
		var finalBytes = input.c;
		var value = (nbytes === 4) ? value_ : (((1 << (nbytes * 8)) - 1) & value_);
		if (!nbytes) {
			return input;
		} else {
			if (finalSize === 4) {
				return A3(
					$folkertdev$elm_flate$Experimental$ByteArray$ByteArray,
					A2($elm$core$Array$push, finalBytes, array),
					nbytes,
					value << ((4 - nbytes) * 8));
			} else {
				if (!finalSize) {
					return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, nbytes, value << ((4 - nbytes) * 8));
				} else {
					var freeSpace = 4 - finalSize;
					if (_Utils_cmp(nbytes, freeSpace) > 0) {
						var bytesLeftOver = (finalSize + nbytes) - 4;
						var forFinal = value >>> (bytesLeftOver * 8);
						var newFinal = finalBytes | forFinal;
						var amount = ((8 - finalSize) - nbytes) * 8;
						var forNextFinal = (((1 << (bytesLeftOver * 8)) - 1) & value) << amount;
						return A3(
							$folkertdev$elm_flate$Experimental$ByteArray$ByteArray,
							A2($elm$core$Array$push, newFinal, array),
							nbytes - freeSpace,
							forNextFinal);
					} else {
						var amount = (4 - (finalSize + nbytes)) * 8;
						var forFinal = value << amount;
						var newFinal = finalBytes | forFinal;
						return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize + nbytes, newFinal);
					}
				}
			}
		}
	});
var $folkertdev$elm_flate$Experimental$ByteArray$appendBytesHelp = function (_v0) {
	var remaining = _v0.a;
	var bytearray = _v0.b;
	var array = bytearray.a;
	var finalSize = bytearray.b;
	var finalBytes = bytearray.c;
	return (remaining >= 4) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_new) {
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(
					remaining - 4,
					A3($folkertdev$elm_flate$Experimental$ByteArray$pushMany, 4, _new, bytearray)));
		},
		$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE)) : ((remaining >= 1) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_new) {
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(
					remaining - 1,
					A2($folkertdev$elm_flate$Experimental$ByteArray$push, _new, bytearray)));
		},
		$elm$bytes$Bytes$Decode$unsignedInt8) : $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done(bytearray)));
};
var $folkertdev$elm_flate$Experimental$ByteArray$appendBytes = F2(
	function (bytes, barray) {
		var array = barray.a;
		var finalSize = barray.b;
		var finalBytes = barray.c;
		var decoder = A2(
			$elm$bytes$Bytes$Decode$loop,
			_Utils_Tuple2(
				$elm$bytes$Bytes$width(bytes),
				barray),
			$folkertdev$elm_flate$Experimental$ByteArray$appendBytesHelp);
		var _v0 = A2($elm$bytes$Bytes$Decode$decode, decoder, bytes);
		if (_v0.$ === 'Just') {
			var v = _v0.a;
			return v;
		} else {
			return barray;
		}
	});
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (_v0.$ === 'SubTree') {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
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
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $folkertdev$elm_flate$Inflate$Internal$buildTree = F3(
	function (lengths, offset, num) {
		var tableDict = function () {
			var updater = function (maybeValue) {
				if (maybeValue.$ === 'Nothing') {
					return $elm$core$Maybe$Just(1);
				} else {
					var v = maybeValue.a;
					return $elm$core$Maybe$Just(v + 1);
				}
			};
			var folder = F3(
				function (key, value, accum) {
					return ((_Utils_cmp(key, offset) > -1) && (_Utils_cmp(key, num + offset) < 0)) ? A3($elm$core$Dict$update, value, updater, accum) : accum;
				});
			return A3($elm$core$Dict$foldl, folder, $elm$core$Dict$empty, lengths);
		}();
		var offsetsDict = A3(
			$elm$core$Dict$foldl,
			F3(
				function (key, value, _v4) {
					var sum = _v4.a;
					var dict = _v4.b;
					return _Utils_Tuple2(
						sum + value,
						A3($elm$core$Dict$insert, key, sum, dict));
				}),
			_Utils_Tuple2(0, $elm$core$Dict$empty),
			tableDict);
		var newTable = function () {
			var helper = F4(
				function (key, value, i, array) {
					helper:
					while (true) {
						if (_Utils_cmp(i, key) > 0) {
							var $temp$key = key,
								$temp$value = value,
								$temp$i = i - 1,
								$temp$array = A2($elm$core$List$cons, 0, array);
							key = $temp$key;
							value = $temp$value;
							i = $temp$i;
							array = $temp$array;
							continue helper;
						} else {
							return A2($elm$core$List$cons, value, array);
						}
					}
				});
			var foldHelp = F3(
				function (key, value, _v3) {
					var i = _v3.a;
					var array = _v3.b;
					return _Utils_Tuple2(
						key - 1,
						A4(helper, key, value, i, array));
				});
			var anotherGo = F2(
				function (i, array) {
					anotherGo:
					while (true) {
						if (i >= 0) {
							var $temp$i = i - 1,
								$temp$array = A2($elm$core$List$cons, 0, array);
							i = $temp$i;
							array = $temp$array;
							continue anotherGo;
						} else {
							return array;
						}
					}
				});
			return function (_v2) {
				var a = _v2.a;
				var b = _v2.b;
				return A2(anotherGo, a, b);
			}(
				A3(
					$elm$core$Dict$foldr,
					foldHelp,
					_Utils_Tuple2(15, _List_Nil),
					tableDict));
		}();
		var go2 = F3(
			function (i, currentTranslation, currentOffsets) {
				go2:
				while (true) {
					if ((i - num) < 0) {
						var _v0 = A2($elm$core$Dict$get, offset + i, lengths);
						if (_v0.$ === 'Nothing') {
							var $temp$i = i + 1,
								$temp$currentTranslation = currentTranslation,
								$temp$currentOffsets = currentOffsets;
							i = $temp$i;
							currentTranslation = $temp$currentTranslation;
							currentOffsets = $temp$currentOffsets;
							continue go2;
						} else {
							var v = _v0.a;
							if (!(!v)) {
								var _v1 = A2($elm$core$Dict$get, v, currentOffsets);
								if (_v1.$ === 'Nothing') {
									return currentTranslation;
								} else {
									var w = _v1.a;
									var $temp$i = i + 1,
										$temp$currentTranslation = A3($elm$core$Array$set, w, i, currentTranslation),
										$temp$currentOffsets = A3($elm$core$Dict$insert, v, w + 1, currentOffsets);
									i = $temp$i;
									currentTranslation = $temp$currentTranslation;
									currentOffsets = $temp$currentOffsets;
									continue go2;
								}
							} else {
								var $temp$i = i + 1,
									$temp$currentTranslation = currentTranslation,
									$temp$currentOffsets = currentOffsets;
								i = $temp$i;
								currentTranslation = $temp$currentTranslation;
								currentOffsets = $temp$currentOffsets;
								continue go2;
							}
						}
					} else {
						return currentTranslation;
					}
				}
			});
		var translation2 = A3(
			go2,
			0,
			A2($elm$core$Array$repeat, num, 0),
			offsetsDict.b);
		return {table: newTable, trans: translation2};
	});
var $folkertdev$elm_flate$Inflate$Internal$clcIndices = _List_fromArray(
	[16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var $folkertdev$elm_flate$Inflate$BitSet$BitSet320 = function (a) {
	return function (b) {
		return function (c) {
			return function (d) {
				return function (e) {
					return function (f) {
						return function (g) {
							return function (h) {
								return function (i) {
									return function (j) {
										return {$: 'BitSet320', a: a, b: b, c: c, d: d, e: e, f: f, g: g, h: h, i: i, j: j};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $folkertdev$elm_flate$Inflate$BitSet$insert = F2(
	function (n, input) {
		var b1 = input.a;
		var b2 = input.b;
		var b3 = input.c;
		var b4 = input.d;
		var b5 = input.e;
		var b6 = input.f;
		var b7 = input.g;
		var b8 = input.h;
		var b9 = input.i;
		var b10 = input.j;
		if (n >= 320) {
			return input;
		} else {
			var bit = 1 << (n % 32);
			var _v0 = (n / 32) | 0;
			switch (_v0) {
				case 0:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(bit | b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 1:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(bit | b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 2:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(bit | b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 3:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(bit | b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 4:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(bit | b5)(b6)(b7)(b8)(b9)(b10);
				case 5:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(bit | b6)(b7)(b8)(b9)(b10);
				case 6:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(bit | b7)(b8)(b9)(b10);
				case 7:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(b7)(bit | b8)(b9)(b10);
				case 8:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(bit | b9)(b10);
				case 9:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(bit | b10);
				default:
					return input;
			}
		}
	});
var $folkertdev$elm_flate$Inflate$BitSet$member = F2(
	function (n, input) {
		var b1 = input.a;
		var b2 = input.b;
		var b3 = input.c;
		var b4 = input.d;
		var b5 = input.e;
		var b6 = input.f;
		var b7 = input.g;
		var b8 = input.h;
		var b9 = input.i;
		var b10 = input.j;
		if (n >= 320) {
			return false;
		} else {
			var bit = 1 << (n % 32);
			var _v0 = (n / 32) | 0;
			switch (_v0) {
				case 0:
					return (bit & b1) > 0;
				case 1:
					return (bit & b2) > 0;
				case 2:
					return (bit & b3) > 0;
				case 3:
					return (bit & b4) > 0;
				case 4:
					return (bit & b5) > 0;
				case 5:
					return (bit & b6) > 0;
				case 6:
					return (bit & b7) > 0;
				case 7:
					return (bit & b8) > 0;
				case 8:
					return (bit & b9) > 0;
				case 9:
					return (bit & b10) > 0;
				default:
					return false;
			}
		}
	});
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $folkertdev$elm_flate$Inflate$BitSet$remove = F2(
	function (n, input) {
		var b1 = input.a;
		var b2 = input.b;
		var b3 = input.c;
		var b4 = input.d;
		var b5 = input.e;
		var b6 = input.f;
		var b7 = input.g;
		var b8 = input.h;
		var b9 = input.i;
		var b10 = input.j;
		if (n >= 320) {
			return input;
		} else {
			var bit = ~(1 << (n % 32));
			var _v0 = (n / 32) | 0;
			switch (_v0) {
				case 0:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(bit & b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 1:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(bit & b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 2:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(bit & b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 3:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(bit & b4)(b5)(b6)(b7)(b8)(b9)(b10);
				case 4:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(bit & b5)(b6)(b7)(b8)(b9)(b10);
				case 5:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(bit & b6)(b7)(b8)(b9)(b10);
				case 6:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(bit & b7)(b8)(b9)(b10);
				case 7:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(b7)(bit & b8)(b9)(b10);
				case 8:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(bit & b9)(b10);
				case 9:
					return $folkertdev$elm_flate$Inflate$BitSet$BitSet320(b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(bit & b10);
				default:
					return input;
			}
		}
	});
var $folkertdev$elm_flate$Inflate$Internal$copySegment = F5(
	function (i, value, bitset, lengths, length) {
		var end = i + length;
		var go = F3(
			function (j, currentBitSet, accum) {
				go:
				while (true) {
					if ((j - end) < 0) {
						if (!(!value)) {
							var $temp$j = j + 1,
								$temp$currentBitSet = A2($folkertdev$elm_flate$Inflate$BitSet$insert, j, currentBitSet),
								$temp$accum = A3($elm$core$Dict$insert, j, value, accum);
							j = $temp$j;
							currentBitSet = $temp$currentBitSet;
							accum = $temp$accum;
							continue go;
						} else {
							if (A2($folkertdev$elm_flate$Inflate$BitSet$member, j, currentBitSet)) {
								var $temp$j = j + 1,
									$temp$currentBitSet = A2($folkertdev$elm_flate$Inflate$BitSet$remove, j, currentBitSet),
									$temp$accum = A2($elm$core$Dict$remove, j, accum);
								j = $temp$j;
								currentBitSet = $temp$currentBitSet;
								accum = $temp$accum;
								continue go;
							} else {
								var $temp$j = j + 1,
									$temp$currentBitSet = currentBitSet,
									$temp$accum = accum;
								j = $temp$j;
								currentBitSet = $temp$currentBitSet;
								accum = $temp$accum;
								continue go;
							}
						}
					} else {
						return _Utils_Tuple2(currentBitSet, accum);
					}
				}
			});
		var _v0 = A3(go, i, bitset, lengths);
		var newBitSet = _v0.a;
		var newLengths = _v0.b;
		return _Utils_Tuple3(i + length, newBitSet, newLengths);
	});
var $folkertdev$elm_flate$Inflate$Internal$decodeSymbolInnerLoop = F5(
	function (table, cur, tag, bitsAvailable, sum) {
		decodeSymbolInnerLoop:
		while (true) {
			var newTag = tag >>> 1;
			if (!table.b) {
				return {bitsAvailable: bitsAvailable, cur: cur, sum: sum, tag: tag};
			} else {
				var value = table.a;
				var rest = table.b;
				var newerCur = ((cur << 1) + (tag & 1)) - value;
				var newSum = sum + value;
				if (newerCur >= 0) {
					var $temp$table = rest,
						$temp$cur = newerCur,
						$temp$tag = newTag,
						$temp$bitsAvailable = bitsAvailable - 1,
						$temp$sum = newSum;
					table = $temp$table;
					cur = $temp$cur;
					tag = $temp$tag;
					bitsAvailable = $temp$bitsAvailable;
					sum = $temp$sum;
					continue decodeSymbolInnerLoop;
				} else {
					return {bitsAvailable: bitsAvailable - 1, cur: newerCur, sum: newSum, tag: newTag};
				}
			}
		}
	});
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $folkertdev$elm_flate$Inflate$BitReader$moveFromReserve = F2(
	function (nbits, state) {
		var masked = (nbits === 32) ? (state.reserve << state.bitsAvailable) : ((((1 << nbits) - 1) & state.reserve) << state.bitsAvailable);
		return {bitsAvailable: state.bitsAvailable + nbits, buffer: state.buffer, reserve: state.reserve >>> nbits, reserveAvailable: state.reserveAvailable - nbits, tag: masked | state.tag};
	});
var $folkertdev$elm_flate$Inflate$BitReader$runDecoder = F3(
	function (width, valueDecoder, state) {
		var decoder = A3(
			$elm$bytes$Bytes$Decode$map2,
			$elm$core$Tuple$pair,
			valueDecoder,
			$elm$bytes$Bytes$Decode$bytes(
				$elm$bytes$Bytes$width(state.buffer) - width));
		var _v0 = A2($elm$bytes$Bytes$Decode$decode, decoder, state.buffer);
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return $elm$core$Result$Ok(value);
		} else {
			return $elm$core$Result$Err('BitReader.runDecoder: Unexpected end of Bytes');
		}
	});
var $folkertdev$elm_flate$Inflate$BitReader$unsignedInt24 = function (endianness) {
	if (endianness.$ === 'LE') {
		return A3(
			$elm$bytes$Bytes$Decode$map2,
			F2(
				function (b2, b1) {
					return (b1 << 16) | b2;
				}),
			$elm$bytes$Bytes$Decode$unsignedInt16(endianness),
			$elm$bytes$Bytes$Decode$unsignedInt8);
	} else {
		return A3(
			$elm$bytes$Bytes$Decode$map2,
			F2(
				function (b1, b2) {
					return (b1 << 16) | b2;
				}),
			$elm$bytes$Bytes$Decode$unsignedInt16(endianness),
			$elm$bytes$Bytes$Decode$unsignedInt8);
	}
};
var $folkertdev$elm_flate$Inflate$BitReader$readMoreBits = function (state) {
	readMoreBits:
	while (true) {
		var freeSpaceOnTag = 32 - state.bitsAvailable;
		if ((_Utils_cmp(freeSpaceOnTag, state.reserveAvailable) < 1) && (state.reserveAvailable > 0)) {
			return $elm$core$Result$Ok(
				A2($folkertdev$elm_flate$Inflate$BitReader$moveFromReserve, freeSpaceOnTag, state));
		} else {
			if (!$elm$bytes$Bytes$width(state.buffer)) {
				return $elm$core$Result$Ok(
					A2($folkertdev$elm_flate$Inflate$BitReader$moveFromReserve, state.reserveAvailable, state));
			} else {
				var state1 = A2($folkertdev$elm_flate$Inflate$BitReader$moveFromReserve, state.reserveAvailable, state);
				var _v0 = function () {
					var _v1 = $elm$bytes$Bytes$width(state.buffer);
					switch (_v1) {
						case 0:
							return _Utils_Tuple3(
								0,
								0,
								$elm$bytes$Bytes$Decode$succeed(0));
						case 1:
							return _Utils_Tuple3(1, 8, $elm$bytes$Bytes$Decode$unsignedInt8);
						case 2:
							return _Utils_Tuple3(
								2,
								16,
								$elm$bytes$Bytes$Decode$unsignedInt16($elm$bytes$Bytes$LE));
						case 3:
							return _Utils_Tuple3(
								3,
								24,
								$folkertdev$elm_flate$Inflate$BitReader$unsignedInt24($elm$bytes$Bytes$LE));
						default:
							return _Utils_Tuple3(
								4,
								32,
								$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$LE));
					}
				}();
				var width = _v0.a;
				var additionallyAvailable = _v0.b;
				var decoder = _v0.c;
				var _v2 = A3($folkertdev$elm_flate$Inflate$BitReader$runDecoder, width, decoder, state1);
				if (_v2.$ === 'Err') {
					var e = _v2.a;
					return $elm$core$Result$Err(e);
				} else {
					var _v3 = _v2.a;
					var newReserve = _v3.a;
					var newBuffer = _v3.b;
					var $temp$state = {bitsAvailable: state1.bitsAvailable, buffer: newBuffer, reserve: newReserve, reserveAvailable: additionallyAvailable, tag: state1.tag};
					state = $temp$state;
					continue readMoreBits;
				}
			}
		}
	}
};
var $folkertdev$elm_flate$Inflate$Internal$decodeSymbol = F2(
	function (table, tree) {
		return $folkertdev$elm_flate$Inflate$BitReader$BitReader(
			function (state) {
				var _v0 = (state.bitsAvailable < 16) ? $folkertdev$elm_flate$Inflate$BitReader$readMoreBits(state) : $elm$core$Result$Ok(state);
				if (_v0.$ === 'Err') {
					var e = _v0.a;
					return $elm$core$Result$Err(e);
				} else {
					var d = _v0.a;
					var _v1 = A5($folkertdev$elm_flate$Inflate$Internal$decodeSymbolInnerLoop, table, 0, d.tag, d.bitsAvailable, 0);
					var cur = _v1.cur;
					var tag = _v1.tag;
					var bitsAvailable = _v1.bitsAvailable;
					var sum = _v1.sum;
					var _v2 = A2($elm$core$Array$get, sum + cur, tree.trans);
					if (_v2.$ === 'Nothing') {
						return $elm$core$Result$Err('Index into trans tree out of bounds');
					} else {
						var result = _v2.a;
						return $elm$core$Result$Ok(
							_Utils_Tuple2(
								result,
								{bitsAvailable: bitsAvailable, buffer: d.buffer, reserve: d.reserve, reserveAvailable: d.reserveAvailable, tag: tag}));
					}
				}
			});
	});
var $folkertdev$elm_flate$Inflate$BitReader$readBits = F2(
	function (numberOfBits, base) {
		return $folkertdev$elm_flate$Inflate$BitReader$BitReader(
			function (state) {
				if (!numberOfBits) {
					return $elm$core$Result$Ok(
						_Utils_Tuple2(base, state));
				} else {
					var _v0 = (_Utils_cmp(state.bitsAvailable, numberOfBits) < 0) ? $folkertdev$elm_flate$Inflate$BitReader$readMoreBits(state) : $elm$core$Result$Ok(state);
					if (_v0.$ === 'Err') {
						var e = _v0.a;
						return $elm$core$Result$Err(e);
					} else {
						var d = _v0.a;
						var val = d.tag & (65535 >>> (16 - numberOfBits));
						var newTag = d.tag >>> numberOfBits;
						return $elm$core$Result$Ok(
							_Utils_Tuple2(
								val + base,
								{bitsAvailable: d.bitsAvailable - numberOfBits, buffer: d.buffer, reserve: d.reserve, reserveAvailable: d.reserveAvailable, tag: newTag}));
					}
				}
			});
	});
var $folkertdev$elm_flate$Inflate$BitReader$succeed = function (x) {
	return $folkertdev$elm_flate$Inflate$BitReader$BitReader(
		function (s) {
			return $elm$core$Result$Ok(
				_Utils_Tuple2(x, s));
		});
};
var $folkertdev$elm_flate$Inflate$Internal$decodeDynamicTreeLength = F4(
	function (codeTree, hlit, hdist, _v0) {
		var i = _v0.a;
		var bitset = _v0.b;
		var lengths = _v0.c;
		if (_Utils_cmp(i, hlit + hdist) < 0) {
			var table = A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$tail(codeTree.table));
			return A2(
				$folkertdev$elm_flate$Inflate$BitReader$andThen,
				function (sym) {
					switch (sym) {
						case 16:
							var prev = A2(
								$elm$core$Maybe$withDefault,
								0,
								A2($elm$core$Dict$get, i - 1, lengths));
							return A2(
								$folkertdev$elm_flate$Inflate$BitReader$map,
								A2(
									$elm$core$Basics$composeR,
									A4($folkertdev$elm_flate$Inflate$Internal$copySegment, i, prev, bitset, lengths),
									$elm$bytes$Bytes$Decode$Loop),
								A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 2, 3));
						case 17:
							return A2(
								$folkertdev$elm_flate$Inflate$BitReader$map,
								A2(
									$elm$core$Basics$composeR,
									A4($folkertdev$elm_flate$Inflate$Internal$copySegment, i, 0, bitset, lengths),
									$elm$bytes$Bytes$Decode$Loop),
								A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 3, 3));
						case 18:
							return A2(
								$folkertdev$elm_flate$Inflate$BitReader$map,
								A2(
									$elm$core$Basics$composeR,
									A4($folkertdev$elm_flate$Inflate$Internal$copySegment, i, 0, bitset, lengths),
									$elm$bytes$Bytes$Decode$Loop),
								A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 7, 11));
						case 0:
							return A2($folkertdev$elm_flate$Inflate$BitSet$member, i, bitset) ? $folkertdev$elm_flate$Inflate$BitReader$succeed(
								$elm$bytes$Bytes$Decode$Loop(
									_Utils_Tuple3(
										i + 1,
										bitset,
										A2($elm$core$Dict$remove, i, lengths)))) : $folkertdev$elm_flate$Inflate$BitReader$succeed(
								$elm$bytes$Bytes$Decode$Loop(
									_Utils_Tuple3(i + 1, bitset, lengths)));
						default:
							return $folkertdev$elm_flate$Inflate$BitReader$succeed(
								$elm$bytes$Bytes$Decode$Loop(
									_Utils_Tuple3(
										i + 1,
										A2($folkertdev$elm_flate$Inflate$BitSet$insert, i, bitset),
										A3($elm$core$Dict$insert, i, sym, lengths))));
					}
				},
				A2($folkertdev$elm_flate$Inflate$Internal$decodeSymbol, table, codeTree));
		} else {
			return $folkertdev$elm_flate$Inflate$BitReader$succeed(
				$elm$bytes$Bytes$Decode$Done(lengths));
		}
	});
var $folkertdev$elm_flate$Inflate$BitSet$empty = $folkertdev$elm_flate$Inflate$BitSet$BitSet320(0)(0)(0)(0)(0)(0)(0)(0)(0)(0);
var $folkertdev$elm_flate$Inflate$Internal$decodeTreeLengths = F4(
	function (hlit, hdist, hclen, codeLengths) {
		var clcs = A2($elm$core$List$take, hclen, $folkertdev$elm_flate$Inflate$Internal$clcIndices);
		var initialLengths = function () {
			var go = F3(
				function (xs, ys, accum) {
					go:
					while (true) {
						if (!xs.b) {
							return accum;
						} else {
							var index = xs.a;
							var restIndex = xs.b;
							if (!ys.b) {
								return accum;
							} else {
								var codeLength = ys.a;
								var restCodeLength = ys.b;
								if (!(!codeLength)) {
									var $temp$xs = restIndex,
										$temp$ys = restCodeLength,
										$temp$accum = A3($elm$core$Dict$insert, index, codeLength, accum);
									xs = $temp$xs;
									ys = $temp$ys;
									accum = $temp$accum;
									continue go;
								} else {
									var $temp$xs = restIndex,
										$temp$ys = restCodeLength,
										$temp$accum = accum;
									xs = $temp$xs;
									ys = $temp$ys;
									accum = $temp$accum;
									continue go;
								}
							}
						}
					}
				});
			return A3(go, clcs, codeLengths, $elm$core$Dict$empty);
		}();
		var codeTree = A3($folkertdev$elm_flate$Inflate$Internal$buildTree, initialLengths, 0, 19);
		var initialBitSet = A3(
			$elm$core$Dict$foldl,
			F2(
				function (i, _v0) {
					return $folkertdev$elm_flate$Inflate$BitSet$insert(i);
				}),
			$folkertdev$elm_flate$Inflate$BitSet$empty,
			initialLengths);
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$loop,
			_Utils_Tuple3(0, initialBitSet, initialLengths),
			A3($folkertdev$elm_flate$Inflate$Internal$decodeDynamicTreeLength, codeTree, hlit, hdist));
	});
var $folkertdev$elm_flate$Inflate$BitReader$exactly = F2(
	function (tableCount, decoder) {
		var helper = function (_v0) {
			var n = _v0.a;
			var xs = _v0.b;
			return (n <= 0) ? $folkertdev$elm_flate$Inflate$BitReader$succeed(
				$elm$bytes$Bytes$Decode$Done(
					$elm$core$List$reverse(xs))) : A2(
				$folkertdev$elm_flate$Inflate$BitReader$map,
				function (x) {
					return $elm$bytes$Bytes$Decode$Loop(
						_Utils_Tuple2(
							n - 1,
							A2($elm$core$List$cons, x, xs)));
				},
				decoder);
		};
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$loop,
			_Utils_Tuple2(tableCount, _List_Nil),
			helper);
	});
var $folkertdev$elm_flate$Inflate$Internal$cont = F3(
	function (hlit, hdist, hclen) {
		var buildTrees = function (lengths) {
			return _Utils_Tuple2(
				A3($folkertdev$elm_flate$Inflate$Internal$buildTree, lengths, 0, hlit),
				A3($folkertdev$elm_flate$Inflate$Internal$buildTree, lengths, hlit, hdist));
		};
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$map,
			buildTrees,
			A2(
				$folkertdev$elm_flate$Inflate$BitReader$andThen,
				A3($folkertdev$elm_flate$Inflate$Internal$decodeTreeLengths, hlit, hdist, hclen),
				A2(
					$folkertdev$elm_flate$Inflate$BitReader$exactly,
					hclen,
					A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 3, 0))));
	});
var $folkertdev$elm_flate$Inflate$BitReader$map2 = F3(
	function (f, _v0, _v1) {
		var fa = _v0.a;
		var fb = _v1.a;
		return $folkertdev$elm_flate$Inflate$BitReader$BitReader(
			function (state) {
				var _v2 = fa(state);
				if (_v2.$ === 'Err') {
					var e = _v2.a;
					return $elm$core$Result$Err(e);
				} else {
					var _v3 = _v2.a;
					var a = _v3.a;
					var newState = _v3.b;
					var _v4 = fb(newState);
					if (_v4.$ === 'Err') {
						var e = _v4.a;
						return $elm$core$Result$Err(e);
					} else {
						var _v5 = _v4.a;
						var b = _v5.a;
						var newerState = _v5.b;
						return $elm$core$Result$Ok(
							_Utils_Tuple2(
								A2(f, a, b),
								newerState));
					}
				}
			});
	});
var $folkertdev$elm_flate$Inflate$BitReader$andMap = F2(
	function (a, f) {
		return A3($folkertdev$elm_flate$Inflate$BitReader$map2, $elm$core$Basics$apL, f, a);
	});
var $folkertdev$elm_flate$Inflate$BitReader$map3 = F4(
	function (f, a, b, c) {
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$andMap,
			c,
			A2(
				$folkertdev$elm_flate$Inflate$BitReader$andMap,
				b,
				A2(
					$folkertdev$elm_flate$Inflate$BitReader$andMap,
					a,
					$folkertdev$elm_flate$Inflate$BitReader$succeed(f))));
	});
var $folkertdev$elm_flate$Inflate$Internal$decodeTrees = A2(
	$folkertdev$elm_flate$Inflate$BitReader$andThen,
	$elm$core$Basics$identity,
	A4(
		$folkertdev$elm_flate$Inflate$BitReader$map3,
		$folkertdev$elm_flate$Inflate$Internal$cont,
		A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 5, 257),
		A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 5, 1),
		A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 4, 4)));
var $folkertdev$elm_flate$Inflate$BitReader$error = function (e) {
	return $folkertdev$elm_flate$Inflate$BitReader$BitReader(
		function (s) {
			return $elm$core$Result$Err(e);
		});
};
var $folkertdev$elm_flate$Inflate$BitReader$getBit = A2($folkertdev$elm_flate$Inflate$BitReader$readBits, 1, 0);
var $folkertdev$elm_flate$Experimental$ByteArray$get = F2(
	function (index, _v0) {
		var array = _v0.a;
		var finalSize = _v0.b;
		var finalBytes = _v0.c;
		var offset = index % 4;
		if (_Utils_cmp(
			index,
			($elm$core$Array$length(array) * 4) + finalSize) > -1) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (_Utils_cmp(
				index,
				$elm$core$Array$length(array) * 4) > -1) {
				return $elm$core$Maybe$Just(255 & (finalBytes >>> (8 * (3 - offset))));
			} else {
				var internalIndex = (index / 4) | 0;
				var _v1 = A2($elm$core$Array$get, internalIndex, array);
				if (_v1.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var int32 = _v1.a;
					return $elm$core$Maybe$Just(255 & (int32 >>> (8 * (3 - offset))));
				}
			}
		}
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $folkertdev$elm_flate$Experimental$ByteArray$copyToBackInternal = F5(
	function (startIndex, size, array, finalSize, finalBytes) {
		copyToBackInternal:
		while (true) {
			var offset = startIndex % 4;
			var internalIndex = (startIndex / 4) | 0;
			if (size <= 0) {
				return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes);
			} else {
				if (_Utils_cmp(
					startIndex + 4,
					(($elm$core$Array$length(array) - 1) * 4) + finalSize) > -1) {
					var _v0 = A2(
						$folkertdev$elm_flate$Experimental$ByteArray$get,
						startIndex,
						A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes));
					if (_v0.$ === 'Nothing') {
						return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes);
					} else {
						var value = _v0.a;
						var _v1 = A2(
							$folkertdev$elm_flate$Experimental$ByteArray$push,
							value,
							A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes));
						var newArray = _v1.a;
						var newFinalSize = _v1.b;
						var newFinalBytes = _v1.c;
						var $temp$startIndex = startIndex + 1,
							$temp$size = size - 1,
							$temp$array = newArray,
							$temp$finalSize = newFinalSize,
							$temp$finalBytes = newFinalBytes;
						startIndex = $temp$startIndex;
						size = $temp$size;
						array = $temp$array;
						finalSize = $temp$finalSize;
						finalBytes = $temp$finalBytes;
						continue copyToBackInternal;
					}
				} else {
					var _v2 = A2($elm$core$Array$get, internalIndex, array);
					if (_v2.$ === 'Nothing') {
						return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes);
					} else {
						var value = _v2.a;
						var written = A2($elm$core$Basics$min, 4 - offset, size);
						var maskedFront = value << (8 * offset);
						var maskedBack = function () {
							if (_Utils_cmp(4 - offset, size) > 0) {
								var bytesWeNeedToRemove = 4 - size;
								var bytesWeHave = (3 - offset) + 1;
								return maskedFront >> (bytesWeNeedToRemove * 8);
							} else {
								return maskedFront >> (offset * 8);
							}
						}();
						var _v3 = A3(
							$folkertdev$elm_flate$Experimental$ByteArray$pushMany,
							written,
							maskedBack,
							A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes));
						var x = _v3.a;
						var y = _v3.b;
						var z = _v3.c;
						var $temp$startIndex = startIndex + written,
							$temp$size = size - written,
							$temp$array = x,
							$temp$finalSize = y,
							$temp$finalBytes = z;
						startIndex = $temp$startIndex;
						size = $temp$size;
						array = $temp$array;
						finalSize = $temp$finalSize;
						finalBytes = $temp$finalBytes;
						continue copyToBackInternal;
					}
				}
			}
		}
	});
var $folkertdev$elm_flate$Experimental$ByteArray$copyToBack = F3(
	function (startIndex, size, _v0) {
		var array = _v0.a;
		var finalSize = _v0.b;
		var finalBytes = _v0.c;
		return A5($folkertdev$elm_flate$Experimental$ByteArray$copyToBackInternal, startIndex, size, array, finalSize, finalBytes);
	});
var $folkertdev$elm_flate$Inflate$Internal$HuffmanTable = function (a) {
	return {$: 'HuffmanTable', a: a};
};
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $folkertdev$elm_flate$Inflate$Internal$buildBitsBase = F2(
	function (delta, first) {
		var initializer = function (i) {
			return (_Utils_cmp(i, delta) < 0) ? 0 : (((i - delta) / delta) | 0);
		};
		var folder = F2(
			function (bit, _v0) {
				var sum = _v0.a;
				var accum = _v0.b;
				return _Utils_Tuple2(
					sum + (1 << bit),
					A2(
						$elm$core$Array$push,
						{base: sum, bits: bit},
						accum));
			});
		var bits = A2($elm$core$Array$initialize, 30, initializer);
		var base = A3(
			$elm$core$Array$foldl,
			folder,
			_Utils_Tuple2(first, $elm$core$Array$empty),
			bits).b;
		return $folkertdev$elm_flate$Inflate$Internal$HuffmanTable(base);
	});
var $folkertdev$elm_flate$Inflate$Internal$hardcodedDistanceTable = A2($folkertdev$elm_flate$Inflate$Internal$buildBitsBase, 2, 1);
var $folkertdev$elm_flate$Inflate$Internal$hardcodedLengthTable = function (_v0) {
	var array = _v0.a;
	return $folkertdev$elm_flate$Inflate$Internal$HuffmanTable(
		A3(
			$elm$core$Array$set,
			28,
			{base: 258, bits: 0},
			array));
}(
	A2($folkertdev$elm_flate$Inflate$Internal$buildBitsBase, 4, 3));
var $folkertdev$elm_flate$Inflate$Internal$readHuffmanTable = F2(
	function (index, _v0) {
		var table = _v0.a;
		return A2($elm$core$Array$get, index, table);
	});
var $folkertdev$elm_flate$Inflate$Internal$decodeLength = function (symbol) {
	var _v0 = A2($folkertdev$elm_flate$Inflate$Internal$readHuffmanTable, symbol - 257, $folkertdev$elm_flate$Inflate$Internal$hardcodedLengthTable);
	if (_v0.$ === 'Nothing') {
		return $folkertdev$elm_flate$Inflate$BitReader$error(
			function () {
				var _v1 = $folkertdev$elm_flate$Inflate$Internal$hardcodedDistanceTable;
				var internal = _v1.a;
				return 'index out of bounds in hardcodedLengthTable: requested index ' + ($elm$core$String$fromInt(symbol - 257) + ('but hardcodedLengthTable has length ' + $elm$core$String$fromInt(
					$elm$core$Array$length(internal))));
			}());
	} else {
		var entry = _v0.a;
		return A2($folkertdev$elm_flate$Inflate$BitReader$readBits, entry.bits, entry.base);
	}
};
var $folkertdev$elm_flate$Inflate$Internal$decodeOffset = F2(
	function (outputLength, dt) {
		var table_ = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$tail(dt.table));
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$andThen,
			function (distance) {
				var _v0 = A2($folkertdev$elm_flate$Inflate$Internal$readHuffmanTable, distance, $folkertdev$elm_flate$Inflate$Internal$hardcodedDistanceTable);
				if (_v0.$ === 'Nothing') {
					return $folkertdev$elm_flate$Inflate$BitReader$error(
						function () {
							var _v1 = $folkertdev$elm_flate$Inflate$Internal$hardcodedDistanceTable;
							var internal = _v1.a;
							return 'index out of bounds in hardcodedDistanceTable: requested index ' + ($elm$core$String$fromInt(distance) + ('but hardcodedLengthTable has length ' + $elm$core$String$fromInt(
								$elm$core$Array$length(internal))));
						}());
				} else {
					var entry = _v0.a;
					return A2(
						$folkertdev$elm_flate$Inflate$BitReader$map,
						function (v) {
							return outputLength - v;
						},
						A2($folkertdev$elm_flate$Inflate$BitReader$readBits, entry.bits, entry.base));
				}
			},
			A2($folkertdev$elm_flate$Inflate$Internal$decodeSymbol, table_, dt));
	});
var $folkertdev$elm_flate$Inflate$Internal$inflateBlockDataHelp = F2(
	function (trees, _v0) {
		var outputLength = _v0.a;
		var output = _v0.b;
		var table = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$tail(trees.literal.table));
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$andThen,
			function (symbol) {
				return (symbol === 256) ? $folkertdev$elm_flate$Inflate$BitReader$succeed(
					$elm$bytes$Bytes$Decode$Done(output)) : ((symbol < 256) ? $folkertdev$elm_flate$Inflate$BitReader$succeed(
					$elm$bytes$Bytes$Decode$Loop(
						_Utils_Tuple2(
							outputLength + 1,
							A2($folkertdev$elm_flate$Experimental$ByteArray$push, symbol, output)))) : A3(
					$folkertdev$elm_flate$Inflate$BitReader$map2,
					F2(
						function (length, offset) {
							return $elm$bytes$Bytes$Decode$Loop(
								_Utils_Tuple2(
									outputLength + length,
									A3($folkertdev$elm_flate$Experimental$ByteArray$copyToBack, offset, length, output)));
						}),
					$folkertdev$elm_flate$Inflate$Internal$decodeLength(symbol),
					A2($folkertdev$elm_flate$Inflate$Internal$decodeOffset, outputLength, trees.distance)));
			},
			A2($folkertdev$elm_flate$Inflate$Internal$decodeSymbol, table, trees.literal));
	});
var $folkertdev$elm_flate$Inflate$Internal$inflateBlockData = F3(
	function (trees, outputLength, output) {
		return A2(
			$folkertdev$elm_flate$Inflate$BitReader$loop,
			_Utils_Tuple2(outputLength, output),
			$folkertdev$elm_flate$Inflate$Internal$inflateBlockDataHelp(trees));
	});
var $folkertdev$elm_flate$Inflate$Internal$uncompressedBlockDecoder = function (bufferWidth) {
	var decodeLengths = A3(
		$elm$bytes$Bytes$Decode$map2,
		$elm$core$Tuple$pair,
		$elm$bytes$Bytes$Decode$unsignedInt16($elm$bytes$Bytes$LE),
		$elm$bytes$Bytes$Decode$unsignedInt16($elm$bytes$Bytes$LE));
	return A2(
		$elm$bytes$Bytes$Decode$andThen,
		function (_v0) {
			var length = _v0.a;
			var invlength = _v0.b;
			if (!_Utils_eq(length, (~invlength) & 65535)) {
				return $elm$bytes$Bytes$Decode$fail;
			} else {
				var remainingSize = (bufferWidth - 4) - length;
				return A3(
					$elm$bytes$Bytes$Decode$map2,
					$elm$core$Tuple$pair,
					$elm$bytes$Bytes$Decode$bytes(length),
					$elm$bytes$Bytes$Decode$bytes(remainingSize));
			}
		},
		decodeLengths);
};
var $folkertdev$elm_flate$Inflate$Internal$inflateUncompressedBlock = $folkertdev$elm_flate$Inflate$BitReader$BitReader(
	function (state) {
		var _v0 = A2(
			$elm$bytes$Bytes$Decode$decode,
			$folkertdev$elm_flate$Inflate$Internal$uncompressedBlockDecoder(
				$elm$bytes$Bytes$width(state.buffer)),
			state.buffer);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Result$Err('inflateUncompressedBlock: ran out of bounds');
		} else {
			var _v1 = _v0.a;
			var block = _v1.a;
			var newBuffer = _v1.b;
			return $elm$core$Result$Ok(
				_Utils_Tuple2(
					block,
					_Utils_update(
						state,
						{buffer: newBuffer})));
		}
	});
var $folkertdev$elm_flate$Experimental$ByteArray$length = function (_v0) {
	var array = _v0.a;
	var finalSize = _v0.b;
	var finalBytes = _v0.c;
	var _v1 = $elm$core$Array$length(array) * 4;
	if (!_v1) {
		return finalSize;
	} else {
		var l = _v1;
		return l + finalSize;
	}
};
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		nodeList: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		nodeListSize: (len / $elm$core$Array$branchFactor) | 0,
		tail: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $folkertdev$elm_flate$Inflate$Internal$sdtree = {
	table: _List_fromArray(
		[0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
	trans: A2(
		$elm$core$Array$append,
		$elm$core$Array$fromList(
			_List_fromArray(
				[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31])),
		A2($elm$core$Array$repeat, 288 - 32, 0))
};
var $folkertdev$elm_flate$Inflate$BitReader$flushHelp = function (state0) {
	var availableSpace = 32 - state0.bitsAvailable;
	var state = A2(
		$folkertdev$elm_flate$Inflate$BitReader$moveFromReserve,
		A2($elm$core$Basics$min, availableSpace, state0.reserveAvailable),
		state0);
	var reserveEncoder = (state.reserveAvailable > 24) ? _List_fromArray(
		[
			A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$LE, state.reserve)
		]) : ((state.reserveAvailable > 16) ? _List_fromArray(
		[
			A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$LE, state.reserve),
			$elm$bytes$Bytes$Encode$unsignedInt8(state.reserve >> 16)
		]) : ((state.reserveAvailable > 8) ? _List_fromArray(
		[
			A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$LE, state.reserve)
		]) : ((state.reserveAvailable > 1) ? _List_fromArray(
		[
			$elm$bytes$Bytes$Encode$unsignedInt8(state.reserve)
		]) : _List_Nil)));
	var tagEncoder = (state.bitsAvailable > 24) ? _List_fromArray(
		[
			A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$LE, state.tag)
		]) : ((state.bitsAvailable > 16) ? _List_fromArray(
		[
			A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$LE, state.tag),
			$elm$bytes$Bytes$Encode$unsignedInt8(state.tag >> 16)
		]) : ((state.bitsAvailable > 8) ? _List_fromArray(
		[
			A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$LE, state.tag)
		]) : ((state.bitsAvailable > 1) ? _List_fromArray(
		[
			$elm$bytes$Bytes$Encode$unsignedInt8(state.tag)
		]) : _List_Nil)));
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			_Utils_ap(
				tagEncoder,
				_Utils_ap(
					reserveEncoder,
					_List_fromArray(
						[
							$elm$bytes$Bytes$Encode$bytes(state.buffer)
						])))));
};
var $folkertdev$elm_flate$Inflate$BitReader$flush = function (state) {
	return {
		bitsAvailable: 0,
		buffer: $folkertdev$elm_flate$Inflate$BitReader$flushHelp(state),
		reserve: 0,
		reserveAvailable: 0,
		tag: 0
	};
};
var $folkertdev$elm_flate$Inflate$BitReader$skipToByteBoundary = $folkertdev$elm_flate$Inflate$BitReader$BitReader(
	function (s) {
		var available = s.bitsAvailable + s.reserveAvailable;
		var untilBoundary = A2($elm$core$Basics$modBy, 8, available);
		var _v0 = A2($folkertdev$elm_flate$Inflate$BitReader$readBits, untilBoundary, 0);
		var step = _v0.a;
		var _v1 = step(s);
		if (_v1.$ === 'Err') {
			var e = _v1.a;
			return $elm$core$Result$Err(e);
		} else {
			var _v2 = _v1.a;
			var newState = _v2.b;
			var _v3 = $folkertdev$elm_flate$Inflate$BitReader$readMoreBits(newState);
			if (_v3.$ === 'Err') {
				var e = _v3.a;
				return $elm$core$Result$Err(e);
			} else {
				var newerState = _v3.a;
				return $elm$core$Result$Ok(
					_Utils_Tuple2(
						_Utils_Tuple0,
						$folkertdev$elm_flate$Inflate$BitReader$flush(newerState)));
			}
		}
	});
var $folkertdev$elm_flate$Inflate$Internal$sltree = {
	table: _List_fromArray(
		[0, 0, 0, 0, 0, 0, 0, 24, 152, 112, 0, 0, 0, 0, 0, 0]),
	trans: $elm$core$Array$fromList(
		_List_fromArray(
			[256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 280, 281, 282, 283, 284, 285, 286, 287, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255]))
};
var $folkertdev$elm_flate$Inflate$Internal$uncompressHelp = function (output) {
	var uncompressBlock = function (btype) {
		switch (btype) {
			case 0:
				return A2(
					$folkertdev$elm_flate$Inflate$BitReader$map,
					function (bytes) {
						return A2($folkertdev$elm_flate$Experimental$ByteArray$appendBytes, bytes, output);
					},
					A2(
						$folkertdev$elm_flate$Inflate$BitReader$andThen,
						function (_v1) {
							return $folkertdev$elm_flate$Inflate$Internal$inflateUncompressedBlock;
						},
						$folkertdev$elm_flate$Inflate$BitReader$skipToByteBoundary));
			case 1:
				return A3(
					$folkertdev$elm_flate$Inflate$Internal$inflateBlockData,
					{distance: $folkertdev$elm_flate$Inflate$Internal$sdtree, literal: $folkertdev$elm_flate$Inflate$Internal$sltree},
					$folkertdev$elm_flate$Experimental$ByteArray$length(output),
					output);
			case 2:
				return A2(
					$folkertdev$elm_flate$Inflate$BitReader$andThen,
					function (_v2) {
						var ltree = _v2.a;
						var dtree = _v2.b;
						return A3(
							$folkertdev$elm_flate$Inflate$Internal$inflateBlockData,
							{distance: dtree, literal: ltree},
							$folkertdev$elm_flate$Experimental$ByteArray$length(output),
							output);
					},
					$folkertdev$elm_flate$Inflate$Internal$decodeTrees);
			default:
				return $folkertdev$elm_flate$Inflate$BitReader$error(
					'invalid block type: ' + ($elm$core$String$fromInt(btype) + ' (only 0, 1 and 2 are valid block types)'));
		}
	};
	var readTwoBits = A3(
		$folkertdev$elm_flate$Inflate$BitReader$map2,
		F2(
			function (b1, b2) {
				return b1 + (2 * b2);
			}),
		$folkertdev$elm_flate$Inflate$BitReader$getBit,
		$folkertdev$elm_flate$Inflate$BitReader$getBit);
	var go = F2(
		function (isFinal, blockType) {
			return (!(!isFinal)) ? A2(
				$folkertdev$elm_flate$Inflate$BitReader$map,
				$elm$bytes$Bytes$Decode$Done,
				uncompressBlock(blockType)) : A2(
				$folkertdev$elm_flate$Inflate$BitReader$map,
				$elm$bytes$Bytes$Decode$Loop,
				uncompressBlock(blockType));
		});
	return A2(
		$folkertdev$elm_flate$Inflate$BitReader$andThen,
		$elm$core$Basics$identity,
		A3($folkertdev$elm_flate$Inflate$BitReader$map2, go, $folkertdev$elm_flate$Inflate$BitReader$getBit, readTwoBits));
};
var $folkertdev$elm_flate$Inflate$Internal$uncompress = A2(
	$folkertdev$elm_flate$Inflate$BitReader$map,
	A2($elm$core$Basics$composeR, $folkertdev$elm_flate$Experimental$ByteArray$toBytes, $elm$core$List$singleton),
	A2($folkertdev$elm_flate$Inflate$BitReader$loop, $folkertdev$elm_flate$Experimental$ByteArray$empty, $folkertdev$elm_flate$Inflate$Internal$uncompressHelp));
var $folkertdev$elm_flate$Inflate$Internal$inflate = function (buffer) {
	var _v0 = A2($folkertdev$elm_flate$Inflate$BitReader$decode, buffer, $folkertdev$elm_flate$Inflate$Internal$uncompress);
	if (_v0.$ === 'Err') {
		var e = _v0.a;
		return $elm$core$Result$Err(e);
	} else {
		var values = _v0.a;
		return $elm$core$Result$Ok(
			$elm$bytes$Bytes$Encode$encode(
				$elm$bytes$Bytes$Encode$sequence(
					A2($elm$core$List$map, $elm$bytes$Bytes$Encode$bytes, values))));
	}
};
var $elm$core$Result$toMaybe = function (result) {
	if (result.$ === 'Ok') {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $folkertdev$elm_flate$Inflate$GZip$inflate = function (buffer) {
	return A2(
		$elm$core$Maybe$andThen,
		A2($elm$core$Basics$composeR, $folkertdev$elm_flate$Inflate$Internal$inflate, $elm$core$Result$toMaybe),
		A2(
			$elm$core$Maybe$andThen,
			$folkertdev$elm_flate$Inflate$GZip$gzipFindBuffer,
			$folkertdev$elm_flate$Inflate$GZip$gzipSlice(buffer)));
};
var $folkertdev$elm_flate$Inflate$Inflate$inflateGZip = $folkertdev$elm_flate$Inflate$GZip$inflate;
var $folkertdev$elm_flate$Flate$inflateGZip = $folkertdev$elm_flate$Inflate$Inflate$inflateGZip;
var $elm$bytes$Bytes$Decode$string = function (n) {
	return $elm$bytes$Bytes$Decode$Decoder(
		_Bytes_read_string(n));
};
var $dkodaj$rte$MiniRte$Core$decodeContentGZip = function (bytes) {
	var decodeAsString = function (buffer) {
		var decoder = $elm$bytes$Bytes$Decode$string(
			$elm$bytes$Bytes$width(buffer));
		return A2($elm$bytes$Bytes$Decode$decode, decoder, buffer);
	};
	return A2(
		$elm$core$Maybe$withDefault,
		$elm$core$Result$Err('Not a gzip archive.'),
		A2(
			$elm$core$Maybe$map,
			$dkodaj$rte$MiniRte$Core$decodeContentString,
			A2(
				$elm$core$Maybe$andThen,
				decodeAsString,
				$folkertdev$elm_flate$Flate$inflateGZip(bytes))));
};
var $dkodaj$rte$MiniRte$decodeContentGZip = $dkodaj$rte$MiniRte$Core$decodeContentGZip;
var $folkertdev$elm_flate$Flate$Dynamic = function (a) {
	return {$: 'Dynamic', a: a};
};
var $folkertdev$elm_flate$Flate$WithWindowSize = function (a) {
	return {$: 'WithWindowSize', a: a};
};
var $folkertdev$elm_flate$Deflate$Internal$chunksHelp = F2(
	function (chunkSize, _v0) {
		var sizeRemaining = _v0.a;
		var accum = _v0.b;
		return (!sizeRemaining) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(_List_Nil)) : ((_Utils_cmp(chunkSize, sizeRemaining) > -1) ? A2(
			$elm$bytes$Bytes$Decode$map,
			function (_new) {
				return $elm$bytes$Bytes$Decode$Done(
					$elm$core$List$reverse(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(true, _new),
							accum)));
			},
			$elm$bytes$Bytes$Decode$bytes(sizeRemaining)) : A2(
			$elm$bytes$Bytes$Decode$map,
			function (_new) {
				return $elm$bytes$Bytes$Decode$Loop(
					_Utils_Tuple2(
						sizeRemaining - chunkSize,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(false, _new),
							accum)));
			},
			$elm$bytes$Bytes$Decode$bytes(chunkSize)));
	});
var $folkertdev$elm_flate$Deflate$Internal$chunks = F2(
	function (chunkSize, buffer) {
		var _v0 = A2(
			$elm$bytes$Bytes$Decode$decode,
			A2(
				$elm$bytes$Bytes$Decode$loop,
				_Utils_Tuple2(
					$elm$bytes$Bytes$width(buffer),
					_List_Nil),
				$folkertdev$elm_flate$Deflate$Internal$chunksHelp(chunkSize)),
			buffer);
		if (_v0.$ === 'Nothing') {
			return _List_fromArray(
				[
					_Utils_Tuple2(
					true,
					$elm$bytes$Bytes$Encode$encode(
						$elm$bytes$Bytes$Encode$sequence(_List_Nil)))
				]);
		} else {
			if (!_v0.a.b) {
				return _List_fromArray(
					[
						_Utils_Tuple2(
						true,
						$elm$bytes$Bytes$Encode$encode(
							$elm$bytes$Bytes$Encode$sequence(_List_Nil)))
					]);
			} else {
				var value = _v0.a;
				return value;
			}
		}
	});
var $folkertdev$elm_flate$Deflate$Internal$default_block_size = 1024 * 1024;
var $folkertdev$elm_flate$Deflate$BitWriter$empty = {bitsWritten: 0, encoders: _List_Nil, tag: 0};
var $folkertdev$elm_flate$Deflate$Symbol$code = function (symbol) {
	switch (symbol.$) {
		case 'Literal':
			var _byte = symbol.a;
			return _byte;
		case 'EndOfBlock':
			return 256;
		default:
			var length = symbol.a;
			return ((length >= 3) && (length <= 10)) ? ((257 + length) - 3) : (((length >= 11) && (length <= 18)) ? (265 + (((length - 11) / 2) | 0)) : (((length >= 19) && (length <= 34)) ? (269 + (((length - 19) / 4) | 0)) : (((length >= 35) && (length <= 66)) ? (273 + (((length - 35) / 8) | 0)) : (((length >= 67) && (length <= 130)) ? (277 + (((length - 67) / 16) | 0)) : (((length >= 131) && (length <= 257)) ? (281 + (((length - 131) / 32) | 0)) : ((length === 258) ? 285 : (-1)))))));
	}
};
var $folkertdev$elm_flate$Deflate$Symbol$distance = function (symbol) {
	if (symbol.$ === 'Share') {
		var distance_ = symbol.b;
		if (distance_ <= 4) {
			return $elm$core$Maybe$Just(
				_Utils_Tuple3(distance_ - 1, 0, 0));
		} else {
			var go = F3(
				function (extraBits, code_, base) {
					go:
					while (true) {
						if (_Utils_cmp(base * 2, distance_) < 0) {
							var $temp$extraBits = extraBits + 1,
								$temp$code_ = code_ + 2,
								$temp$base = base * 2;
							extraBits = $temp$extraBits;
							code_ = $temp$code_;
							base = $temp$base;
							continue go;
						} else {
							return _Utils_Tuple3(extraBits, code_, base);
						}
					}
				});
			var _v1 = A3(go, 1, 4, 4);
			var extraBits = _v1.a;
			var code_ = _v1.b;
			var base = _v1.c;
			var delta = (distance_ - base) - 1;
			var half = (base / 2) | 0;
			return (_Utils_cmp(distance_, base + half) < 1) ? $elm$core$Maybe$Just(
				_Utils_Tuple3(
					code_,
					extraBits,
					A2($elm$core$Basics$modBy, half, delta))) : $elm$core$Maybe$Just(
				_Utils_Tuple3(
					code_ + 1,
					extraBits,
					A2($elm$core$Basics$modBy, half, delta)));
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $folkertdev$elm_flate$Deflate$Symbol$update = F3(
	function (index, tagger, array) {
		var _v0 = A2($elm$core$Array$get, index, array);
		if (_v0.$ === 'Nothing') {
			return array;
		} else {
			var value = _v0.a;
			return A3(
				$elm$core$Array$set,
				index,
				tagger(value),
				array);
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$dynamicFindFrequencies = F2(
	function (symbol, _v0) {
		var literalCounts = _v0.a;
		var distanceCounts = _v0.b;
		var emptyDistanceCount = _v0.c;
		var _v1 = $folkertdev$elm_flate$Deflate$Symbol$distance(symbol);
		if (_v1.$ === 'Nothing') {
			return _Utils_Tuple3(
				A3(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					$folkertdev$elm_flate$Deflate$Symbol$code(symbol),
					function (v) {
						return v + 1;
					},
					literalCounts),
				distanceCounts,
				emptyDistanceCount);
		} else {
			var _v2 = _v1.a;
			var d = _v2.a;
			return _Utils_Tuple3(
				A3(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					$folkertdev$elm_flate$Deflate$Symbol$code(symbol),
					function (v) {
						return v + 1;
					},
					literalCounts),
				A3(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					d,
					function (v) {
						return v + 1;
					},
					distanceCounts),
				false);
		}
	});
var $elm$core$List$sortWith = _List_sortWith;
var $folkertdev$elm_flate$Huffman$calcOptimalMaxBitWidth = function (frequencies) {
	var heapModificationLoop = function (heap) {
		heapModificationLoop:
		while (true) {
			if (!heap.b) {
				return 0;
			} else {
				if (!heap.b.b) {
					var _v1 = heap.a;
					var value = _v1.b;
					return A2($elm$core$Basics$max, 1, value);
				} else {
					var _v2 = heap.a;
					var weight1 = _v2.a;
					var width1 = _v2.b;
					var _v3 = heap.b;
					var _v4 = _v3.a;
					var weight2 = _v4.a;
					var width2 = _v4.b;
					var rest = _v3.b;
					var $temp$heap = A2(
						$elm$core$List$sortWith,
						F2(
							function (a, b) {
								return A2($elm$core$Basics$compare, b, a);
							}),
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								weight1 + weight2,
								1 + A2($elm$core$Basics$max, width1, width2)),
							rest));
					heap = $temp$heap;
					continue heapModificationLoop;
				}
			}
		}
	};
	var createHeapFolder = F2(
		function (freq, heap) {
			return (freq > 0) ? A2(
				$elm$core$List$cons,
				_Utils_Tuple2(-freq, 0),
				heap) : heap;
		});
	var createHeap = A3($elm$core$Array$foldl, createHeapFolder, _List_Nil, frequencies);
	return heapModificationLoop(createHeap);
};
var $elm$core$Array$filter = F2(
	function (isGood, array) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$Array$foldr,
				F2(
					function (x, xs) {
						return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
					}),
				_List_Nil,
				array));
	});
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			nodeList: _List_Nil,
			nodeListSize: 0,
			tail: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.nodeListSize * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						nodeList: A2($elm$core$List$cons, mappedLeaf, builder.nodeList),
						nodeListSize: builder.nodeListSize + 1,
						tail: builder.tail
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeLoop = F3(
	function (xarr, yarr, accum) {
		mergeLoop:
		while (true) {
			var _v0 = _Utils_Tuple2(xarr, yarr);
			if (!_v0.a.b) {
				return A2(
					$elm$core$Array$append,
					accum,
					$elm$core$Array$fromList(yarr));
			} else {
				if (!_v0.b.b) {
					return A2(
						$elm$core$Array$append,
						accum,
						$elm$core$Array$fromList(xarr));
				} else {
					var _v1 = _v0.a;
					var x = _v1.a;
					var xrest = _v1.b;
					var _v2 = _v0.b;
					var y = _v2.a;
					var yrest = _v2.b;
					if (_Utils_cmp(x.weight, y.weight) < 0) {
						var $temp$xarr = xrest,
							$temp$yarr = yarr,
							$temp$accum = A2($elm$core$Array$push, x, accum);
						xarr = $temp$xarr;
						yarr = $temp$yarr;
						accum = $temp$accum;
						continue mergeLoop;
					} else {
						var $temp$xarr = xarr,
							$temp$yarr = yrest,
							$temp$accum = A2($elm$core$Array$push, y, accum);
						xarr = $temp$xarr;
						yarr = $temp$yarr;
						accum = $temp$accum;
						continue mergeLoop;
					}
				}
			}
		}
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$merge = F2(
	function (x, y) {
		return A3(
			$folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeLoop,
			$elm$core$Array$toList(x),
			$elm$core$Array$toList(y),
			$elm$core$Array$empty);
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeNodes = F2(
	function (node1, node2) {
		return {
			symbols: A2($elm$core$Array$append, node1.symbols, node2.symbols),
			weight: node1.weight + node2.weight
		};
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$package = function (nodes) {
	if ($elm$core$Array$length(nodes) >= 2) {
		var newLen = ($elm$core$Array$length(nodes) / 2) | 0;
		var loop = F2(
			function (currentNodes, accum) {
				loop:
				while (true) {
					if (currentNodes.b && currentNodes.b.b) {
						var self = currentNodes.a;
						var _v1 = currentNodes.b;
						var other = _v1.a;
						var rest = _v1.b;
						var $temp$currentNodes = rest,
							$temp$accum = A2(
							$elm$core$List$cons,
							A2($folkertdev$elm_flate$LengthLimitedHuffmanCodes$mergeNodes, self, other),
							accum);
						currentNodes = $temp$currentNodes;
						accum = $temp$accum;
						continue loop;
					} else {
						return $elm$core$Array$fromList(
							$elm$core$List$reverse(accum));
					}
				}
			});
		return A2(
			loop,
			$elm$core$Array$toList(nodes),
			_List_Nil);
	} else {
		return nodes;
	}
};
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$singletonNode = F2(
	function (symbol, weight) {
		return {
			symbols: A2($elm$core$Array$repeat, 1, symbol),
			weight: weight
		};
	});
var $elm_community$list_extra$List$Extra$stableSortWith = F2(
	function (pred, list) {
		var predWithIndex = F2(
			function (_v1, _v2) {
				var a1 = _v1.a;
				var i1 = _v1.b;
				var a2 = _v2.a;
				var i2 = _v2.b;
				var result = A2(pred, a1, a2);
				if (result.$ === 'EQ') {
					return A2($elm$core$Basics$compare, i1, i2);
				} else {
					return result;
				}
			});
		var listWithIndex = A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, a) {
					return _Utils_Tuple2(a, i);
				}),
			list);
		return A2(
			$elm$core$List$map,
			$elm$core$Tuple$first,
			A2($elm$core$List$sortWith, predWithIndex, listWithIndex));
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$update = F3(
	function (index, tagger, array) {
		var _v0 = A2($elm$core$Array$get, index, array);
		if (_v0.$ === 'Nothing') {
			return array;
		} else {
			var value = _v0.a;
			return A3(
				$elm$core$Array$set,
				index,
				tagger(value),
				array);
		}
	});
var $folkertdev$elm_flate$LengthLimitedHuffmanCodes$calculate = F2(
	function (maxBitWidth, frequencies) {
		var source = $elm$core$Array$fromList(
			A2(
				$elm_community$list_extra$List$Extra$stableSortWith,
				F2(
					function (a, b) {
						return A2($elm$core$Basics$compare, a.weight, b.weight);
					}),
				$elm$core$Array$toList(
					A2(
						$elm$core$Array$map,
						function (_v3) {
							var symbol = _v3.a;
							var weight = _v3.b;
							return A2($folkertdev$elm_flate$LengthLimitedHuffmanCodes$singletonNode, symbol, weight);
						},
						A2(
							$elm$core$Array$filter,
							function (_v2) {
								var f = _v2.b;
								return f > 0;
							},
							A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, frequencies))))));
		var weighted = A3(
			$elm$core$List$foldl,
			F2(
				function (_v1, w) {
					return A2(
						$folkertdev$elm_flate$LengthLimitedHuffmanCodes$merge,
						$folkertdev$elm_flate$LengthLimitedHuffmanCodes$package(w),
						source);
				}),
			source,
			A2($elm$core$List$range, 0, maxBitWidth - 2));
		var loop = F2(
			function (symbols, accum) {
				loop:
				while (true) {
					if (!symbols.b) {
						return accum;
					} else {
						var symbol = symbols.a;
						var rest = symbols.b;
						var $temp$symbols = rest,
							$temp$accum = A3(
							$folkertdev$elm_flate$LengthLimitedHuffmanCodes$update,
							symbol,
							function (v) {
								return v + 1;
							},
							accum);
						symbols = $temp$symbols;
						accum = $temp$accum;
						continue loop;
					}
				}
			});
		var allSymbols = A2(
			$elm$core$List$concatMap,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.symbols;
				},
				$elm$core$Array$toList),
			$elm$core$Array$toList(
				$folkertdev$elm_flate$LengthLimitedHuffmanCodes$package(weighted)));
		return A2(
			loop,
			allSymbols,
			A2(
				$elm$core$Array$repeat,
				$elm$core$Array$length(frequencies),
				0));
	});
var $folkertdev$elm_flate$Huffman$Tree = function (a) {
	return {$: 'Tree', a: a};
};
var $folkertdev$elm_flate$Huffman$Code = function (a) {
	return {$: 'Code', a: a};
};
var $folkertdev$elm_flate$Huffman$codeFromRecord = $folkertdev$elm_flate$Huffman$Code;
var $folkertdev$elm_flate$Huffman$new = function (n) {
	return $folkertdev$elm_flate$Huffman$Tree(
		A2(
			$elm$core$Array$repeat,
			n,
			$folkertdev$elm_flate$Huffman$codeFromRecord(
				{bits: 0, width: 0})));
};
var $folkertdev$elm_flate$Huffman$inverseEndianLoop = F4(
	function (i, limit, f, t) {
		inverseEndianLoop:
		while (true) {
			if (_Utils_cmp(i, limit) < 0) {
				var $temp$i = i + 1,
					$temp$limit = limit,
					$temp$f = f >> 1,
					$temp$t = (f & 1) | (t << 1);
				i = $temp$i;
				limit = $temp$limit;
				f = $temp$f;
				t = $temp$t;
				continue inverseEndianLoop;
			} else {
				return t;
			}
		}
	});
var $folkertdev$elm_flate$Huffman$inverseEndian = function (_v0) {
	var width = _v0.a.width;
	var bits = _v0.a.bits;
	var inverseBits = A4($folkertdev$elm_flate$Huffman$inverseEndianLoop, 0, width, bits, 0);
	return $folkertdev$elm_flate$Huffman$Code(
		{bits: inverseBits, width: width});
};
var $folkertdev$elm_flate$Huffman$setMapping = F3(
	function (symbol, code, _v0) {
		var array = _v0.a;
		return $folkertdev$elm_flate$Huffman$Tree(
			A3(
				$elm$core$Array$set,
				symbol,
				$folkertdev$elm_flate$Huffman$inverseEndian(code),
				array));
	});
var $folkertdev$elm_flate$Huffman$restoreCanonicalHuffmanCodes = F2(
	function (bitWidths, tree) {
		var symbols = A2(
			$elm_community$list_extra$List$Extra$stableSortWith,
			F2(
				function (_v4, _v5) {
					var a = _v4.b;
					var b = _v5.b;
					return A2($elm$core$Basics$compare, a, b);
				}),
			$elm$core$Array$toList(
				A2(
					$elm$core$Array$filter,
					function (_v3) {
						var codeBitWidth = _v3.b;
						return codeBitWidth > 0;
					},
					A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, bitWidths))));
		var loop = F2(
			function (_v1, _v2) {
				var symbol = _v1.a;
				var bitWidth = _v1.b;
				var code = _v2.a;
				var prevWidth = _v2.b;
				var currentTree = _v2.c;
				var newBits = code << (bitWidth - prevWidth);
				var nextCode = $folkertdev$elm_flate$Huffman$Code(
					{bits: newBits, width: bitWidth});
				return _Utils_Tuple3(
					newBits + 1,
					bitWidth,
					A3($folkertdev$elm_flate$Huffman$setMapping, symbol, nextCode, currentTree));
			});
		return function (_v0) {
			var x = _v0.c;
			return x;
		}(
			A3(
				$elm$core$List$foldl,
				loop,
				_Utils_Tuple3(0, 0, tree),
				symbols));
	});
var $folkertdev$elm_flate$Huffman$fromBitWidths = function (bitWidths) {
	var symbolCount = function (v) {
		return v + 1;
	}(
		A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$first,
				function (a) {
					return A2(
						$elm$core$Array$get,
						$elm$core$Array$length(a) - 1,
						a);
				}(
					A2(
						$elm$core$Array$filter,
						function (e) {
							return e.b > 0;
						},
						A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, bitWidths))))));
	return A2(
		$folkertdev$elm_flate$Huffman$restoreCanonicalHuffmanCodes,
		bitWidths,
		$folkertdev$elm_flate$Huffman$new(symbolCount));
};
var $folkertdev$elm_flate$Huffman$fromFrequencies = F2(
	function (symbolFrequencies, maxBitWidth_) {
		var maxBitWidth = A2(
			$elm$core$Basics$min,
			maxBitWidth_,
			$folkertdev$elm_flate$Huffman$calcOptimalMaxBitWidth(symbolFrequencies));
		var codeBitWidhts = A2($folkertdev$elm_flate$LengthLimitedHuffmanCodes$calculate, maxBitWidth, symbolFrequencies);
		return $folkertdev$elm_flate$Huffman$fromBitWidths(codeBitWidhts);
	});
var $folkertdev$elm_flate$Deflate$Symbol$buildDynamicHuffmanCodec = function (symbols) {
	var _v0 = A3(
		$elm$core$Array$foldl,
		$folkertdev$elm_flate$Deflate$Symbol$dynamicFindFrequencies,
		_Utils_Tuple3(
			A2($elm$core$Array$repeat, 286, 0),
			A2($elm$core$Array$repeat, 30, 0),
			true),
		symbols);
	var literalCounts = _v0.a;
	var distanceCounts = _v0.b;
	var emptyDistanceCount = _v0.c;
	return {
		distance: emptyDistanceCount ? A2(
			$folkertdev$elm_flate$Huffman$fromFrequencies,
			A3($elm$core$Array$set, 0, 1, distanceCounts),
			15) : A2($folkertdev$elm_flate$Huffman$fromFrequencies, distanceCounts, 15),
		literal: A2($folkertdev$elm_flate$Huffman$fromFrequencies, literalCounts, 15)
	};
};
var $folkertdev$elm_flate$Deflate$Symbol$EndOfBlock = {$: 'EndOfBlock'};
var $folkertdev$elm_flate$Deflate$Symbol$Literal = function (a) {
	return {$: 'Literal', a: a};
};
var $folkertdev$elm_flate$Deflate$Symbol$Share = F2(
	function (a, b) {
		return {$: 'Share', a: a, b: b};
	});
var $folkertdev$elm_flate$Deflate$Internal$codeToSymbol = function (code) {
	if (code.$ === 'Literal') {
		var v = code.a;
		return $folkertdev$elm_flate$Deflate$Symbol$Literal(v);
	} else {
		var length = code.a;
		var backwardDistance = code.b;
		return A2($folkertdev$elm_flate$Deflate$Symbol$Share, length, backwardDistance);
	}
};
var $folkertdev$elm_flate$LZ77$Literal = function (a) {
	return {$: 'Literal', a: a};
};
var $folkertdev$elm_flate$LZ77$Pointer = F2(
	function (a, b) {
		return {$: 'Pointer', a: a, b: b};
	});
var $folkertdev$elm_flate$PrefixTable$Small = function (a) {
	return {$: 'Small', a: a};
};
var $folkertdev$elm_flate$PrefixTable$Large = function (a) {
	return {$: 'Large', a: a};
};
var $folkertdev$elm_flate$PrefixTable$LargePrefixTable = function (a) {
	return {$: 'LargePrefixTable', a: a};
};
var $folkertdev$elm_flate$PrefixTable$insertInList = F6(
	function (i, array, p2, position, remaining, accum) {
		insertInList:
		while (true) {
			if (!remaining.b) {
				var newPositions = A2(
					$elm$core$List$cons,
					_Utils_Tuple2(p2, position),
					accum);
				return _Utils_Tuple2(
					$folkertdev$elm_flate$PrefixTable$Large(
						$folkertdev$elm_flate$PrefixTable$LargePrefixTable(
							A3($elm$core$Array$set, i, newPositions, array))),
					$elm$core$Maybe$Nothing);
			} else {
				var current = remaining.a;
				var key = current.a;
				var oldValue = current.b;
				var rest = remaining.b;
				if (!(key - p2)) {
					var newPositions = _Utils_ap(
						accum,
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(key, position),
							rest));
					return _Utils_Tuple2(
						$folkertdev$elm_flate$PrefixTable$Large(
							$folkertdev$elm_flate$PrefixTable$LargePrefixTable(
								A3($elm$core$Array$set, i, newPositions, array))),
						$elm$core$Maybe$Just(oldValue));
				} else {
					var $temp$i = i,
						$temp$array = array,
						$temp$p2 = p2,
						$temp$position = position,
						$temp$remaining = rest,
						$temp$accum = A2($elm$core$List$cons, current, accum);
					i = $temp$i;
					array = $temp$array;
					p2 = $temp$p2;
					position = $temp$position;
					remaining = $temp$remaining;
					accum = $temp$accum;
					continue insertInList;
				}
			}
		}
	});
var $folkertdev$elm_flate$PrefixTable$insert = F3(
	function (_v0, position, ptable) {
		var prefix_ = _v0.a;
		var prefix = 16777215 & (prefix_ >>> 0);
		if (ptable.$ === 'Small') {
			var dict = ptable.a;
			var _v2 = A2($elm$core$Dict$get, prefix, dict);
			if (_v2.$ === 'Nothing') {
				return _Utils_Tuple2(
					$folkertdev$elm_flate$PrefixTable$Small(
						A3($elm$core$Dict$insert, prefix, position, dict)),
					$elm$core$Maybe$Nothing);
			} else {
				var oldValue = _v2.a;
				return _Utils_Tuple2(
					$folkertdev$elm_flate$PrefixTable$Small(
						A3($elm$core$Dict$insert, prefix, position, dict)),
					$elm$core$Maybe$Just(oldValue));
			}
		} else {
			var array = ptable.a.a;
			var index = prefix >> 8;
			var _v3 = A2($elm$core$Array$get, index, array);
			if (_v3.$ === 'Nothing') {
				return _Utils_Tuple2(ptable, $elm$core$Maybe$Nothing);
			} else {
				var positions = _v3.a;
				return A6($folkertdev$elm_flate$PrefixTable$insertInList, index, array, 255 & prefix, position, positions, _List_Nil);
			}
		}
	});
var $folkertdev$elm_flate$LZ77$longestCommonPrefixLoop = F5(
	function (i, j, limit, accum, array) {
		longestCommonPrefixLoop:
		while (true) {
			if (_Utils_cmp(i, limit) < 0) {
				var _v0 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, i, array);
				if (_v0.$ === 'Nothing') {
					return accum;
				} else {
					var value1 = _v0.a;
					var _v1 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, j, array);
					if (_v1.$ === 'Nothing') {
						return accum;
					} else {
						var value2 = _v1.a;
						if (!(value1 - value2)) {
							var $temp$i = i + 1,
								$temp$j = j + 1,
								$temp$limit = limit,
								$temp$accum = accum + 1,
								$temp$array = array;
							i = $temp$i;
							j = $temp$j;
							limit = $temp$limit;
							accum = $temp$accum;
							array = $temp$array;
							continue longestCommonPrefixLoop;
						} else {
							return accum;
						}
					}
				}
			} else {
				return accum;
			}
		}
	});
var $folkertdev$elm_flate$LZ77$max_length = 258;
var $folkertdev$elm_flate$LZ77$longestCommonPrefix = F3(
	function (i, j, array) {
		var remaining = A2(
			$elm$core$Basics$min,
			$folkertdev$elm_flate$LZ77$max_length - 3,
			$folkertdev$elm_flate$Experimental$ByteArray$length(array) - j);
		return A5($folkertdev$elm_flate$LZ77$longestCommonPrefixLoop, i, j, i + remaining, 0, array);
	});
var $folkertdev$elm_flate$PrefixTable$OutOfBounds = {$: 'OutOfBounds'};
var $folkertdev$elm_flate$PrefixTable$Prefix = F2(
	function (a, b) {
		return {$: 'Prefix', a: a, b: b};
	});
var $folkertdev$elm_flate$PrefixTable$PrefixCode = function (a) {
	return {$: 'PrefixCode', a: a};
};
var $folkertdev$elm_flate$PrefixTable$Trailing1 = function (a) {
	return {$: 'Trailing1', a: a};
};
var $folkertdev$elm_flate$PrefixTable$Trailing2 = F2(
	function (a, b) {
		return {$: 'Trailing2', a: a, b: b};
	});
var $folkertdev$elm_flate$Experimental$ByteArray$getInt32 = F2(
	function (index, _v0) {
		var array = _v0.a;
		var finalBytes = _v0.c;
		var size = $elm$core$Array$length(array);
		return (!(index - size)) ? $elm$core$Maybe$Just(finalBytes) : A2($elm$core$Array$get, index, array);
	});
var $folkertdev$elm_flate$PrefixTable$prefixAt = F2(
	function (k, input) {
		var size = $folkertdev$elm_flate$Experimental$ByteArray$length(input);
		if (_Utils_cmp(k + 2, size) > -1) {
			if (_Utils_cmp(k, size) > -1) {
				return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
			} else {
				if (_Utils_cmp(k + 1, size) > -1) {
					var _v0 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, k, input);
					if (_v0.$ === 'Nothing') {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var value = _v0.a;
						return $folkertdev$elm_flate$PrefixTable$Trailing1(value);
					}
				} else {
					var _v1 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, k, input);
					if (_v1.$ === 'Nothing') {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var v1 = _v1.a;
						var _v2 = A2($folkertdev$elm_flate$Experimental$ByteArray$get, k + 1, input);
						if (_v2.$ === 'Nothing') {
							return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
						} else {
							var v2 = _v2.a;
							return A2($folkertdev$elm_flate$PrefixTable$Trailing2, v1, v2);
						}
					}
				}
			}
		} else {
			var offset = k % 4;
			var internalIndex = (k / 4) | 0;
			switch (offset) {
				case 0:
					var _v4 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v4.$ === 'Nothing') {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v4.a;
						var first = 255 & ((int32 >> 24) >>> 0);
						var code = int32 >> 8;
						return A2(
							$folkertdev$elm_flate$PrefixTable$Prefix,
							first,
							$folkertdev$elm_flate$PrefixTable$PrefixCode(code));
					}
				case 1:
					var _v5 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v5.$ === 'Nothing') {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v5.a;
						var first = 255 & ((255 & (int32 >> 16)) >>> 0);
						var code = 16777215 & int32;
						return A2(
							$folkertdev$elm_flate$PrefixTable$Prefix,
							first,
							$folkertdev$elm_flate$PrefixTable$PrefixCode(code));
					}
				case 2:
					var _v6 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v6.$ === 'Nothing') {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v6.a;
						var _v7 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex + 1, input);
						if (_v7.$ === 'Nothing') {
							return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
						} else {
							var nextInt32 = _v7.a;
							var first = 255 & ((255 & (int32 >> 8)) >>> 0);
							var code = 16777215 & (((255 & (nextInt32 >> 24)) | ((65535 & int32) << 8)) >>> 0);
							return A2(
								$folkertdev$elm_flate$PrefixTable$Prefix,
								first,
								$folkertdev$elm_flate$PrefixTable$PrefixCode(code));
						}
					}
				default:
					var _v8 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex, input);
					if (_v8.$ === 'Nothing') {
						return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
					} else {
						var int32 = _v8.a;
						var _v9 = A2($folkertdev$elm_flate$Experimental$ByteArray$getInt32, internalIndex + 1, input);
						if (_v9.$ === 'Nothing') {
							return $folkertdev$elm_flate$PrefixTable$OutOfBounds;
						} else {
							var nextInt32 = _v9.a;
							var first = 255 & ((255 & int32) >>> 0);
							var code = (65535 & (nextInt32 >> 16)) | ((255 & int32) << 16);
							return A2(
								$folkertdev$elm_flate$PrefixTable$Prefix,
								first,
								$folkertdev$elm_flate$PrefixTable$PrefixCode(code));
						}
					}
			}
		}
	});
var $folkertdev$elm_flate$LZ77$updatePrefixTableLoop = F4(
	function (k, limit, buffer, prefixTable) {
		updatePrefixTableLoop:
		while (true) {
			if (_Utils_cmp(k, limit) < 0) {
				var _v0 = A2($folkertdev$elm_flate$PrefixTable$prefixAt, k, buffer);
				if (_v0.$ === 'Prefix') {
					var code = _v0.b;
					var _v1 = A3($folkertdev$elm_flate$PrefixTable$insert, code, k, prefixTable);
					var newPrefixTable = _v1.a;
					var $temp$k = k + 1,
						$temp$limit = limit,
						$temp$buffer = buffer,
						$temp$prefixTable = newPrefixTable;
					k = $temp$k;
					limit = $temp$limit;
					buffer = $temp$buffer;
					prefixTable = $temp$prefixTable;
					continue updatePrefixTableLoop;
				} else {
					return prefixTable;
				}
			} else {
				return prefixTable;
			}
		}
	});
var $folkertdev$elm_flate$LZ77$flushLoop = F5(
	function (i, windowSize, buffer, prefixTable, encoders) {
		flushLoop:
		while (true) {
			var _v0 = A2($folkertdev$elm_flate$PrefixTable$prefixAt, i, buffer);
			switch (_v0.$) {
				case 'OutOfBounds':
					return encoders;
				case 'Trailing1':
					var p1 = _v0.a;
					return A2(
						$elm$core$Array$push,
						$folkertdev$elm_flate$LZ77$Literal(p1),
						encoders);
				case 'Trailing2':
					var p1 = _v0.a;
					var p2 = _v0.b;
					return A2(
						$elm$core$Array$push,
						$folkertdev$elm_flate$LZ77$Literal(p2),
						A2(
							$elm$core$Array$push,
							$folkertdev$elm_flate$LZ77$Literal(p1),
							encoders));
				default:
					var p1 = _v0.a;
					var key = _v0.b;
					var _v1 = A3($folkertdev$elm_flate$PrefixTable$insert, key, i, prefixTable);
					var newPrefixTable = _v1.a;
					var matched = _v1.b;
					if (matched.$ === 'Just') {
						var j = matched.a;
						var distance = i - j;
						if ((distance - windowSize) <= 0) {
							var length = 3 + A3($folkertdev$elm_flate$LZ77$longestCommonPrefix, i + 3, j + 3, buffer);
							var newEncoders = A2(
								$elm$core$Array$push,
								A2($folkertdev$elm_flate$LZ77$Pointer, length, distance),
								encoders);
							var newerPrefixTable = A4($folkertdev$elm_flate$LZ77$updatePrefixTableLoop, i + 1, i + length, buffer, newPrefixTable);
							var $temp$i = i + length,
								$temp$windowSize = windowSize,
								$temp$buffer = buffer,
								$temp$prefixTable = newerPrefixTable,
								$temp$encoders = newEncoders;
							i = $temp$i;
							windowSize = $temp$windowSize;
							buffer = $temp$buffer;
							prefixTable = $temp$prefixTable;
							encoders = $temp$encoders;
							continue flushLoop;
						} else {
							var $temp$i = i + 1,
								$temp$windowSize = windowSize,
								$temp$buffer = buffer,
								$temp$prefixTable = newPrefixTable,
								$temp$encoders = A2(
								$elm$core$Array$push,
								$folkertdev$elm_flate$LZ77$Literal(p1),
								encoders);
							i = $temp$i;
							windowSize = $temp$windowSize;
							buffer = $temp$buffer;
							prefixTable = $temp$prefixTable;
							encoders = $temp$encoders;
							continue flushLoop;
						}
					} else {
						var $temp$i = i + 1,
							$temp$windowSize = windowSize,
							$temp$buffer = buffer,
							$temp$prefixTable = newPrefixTable,
							$temp$encoders = A2(
							$elm$core$Array$push,
							$folkertdev$elm_flate$LZ77$Literal(p1),
							encoders);
						i = $temp$i;
						windowSize = $temp$windowSize;
						buffer = $temp$buffer;
						prefixTable = $temp$prefixTable;
						encoders = $temp$encoders;
						continue flushLoop;
					}
			}
		}
	});
var $folkertdev$elm_flate$PrefixTable$max_distance = 32768;
var $folkertdev$elm_flate$PrefixTable$max_window_size = $folkertdev$elm_flate$PrefixTable$max_distance;
var $folkertdev$elm_flate$PrefixTable$newLargePrefixTable = $folkertdev$elm_flate$PrefixTable$LargePrefixTable(
	A2($elm$core$Array$repeat, 65535, _List_Nil));
var $folkertdev$elm_flate$PrefixTable$new = function (nbytes) {
	return (_Utils_cmp(nbytes, $folkertdev$elm_flate$PrefixTable$max_window_size) < 0) ? $folkertdev$elm_flate$PrefixTable$Small($elm$core$Dict$empty) : $folkertdev$elm_flate$PrefixTable$Large($folkertdev$elm_flate$PrefixTable$newLargePrefixTable);
};
var $folkertdev$elm_flate$LZ77$flush = F2(
	function (windowSize, buffer) {
		var codes = A5(
			$folkertdev$elm_flate$LZ77$flushLoop,
			0,
			windowSize,
			buffer,
			$folkertdev$elm_flate$PrefixTable$new(
				$folkertdev$elm_flate$Experimental$ByteArray$length(buffer)),
			$elm$core$Array$empty);
		return codes;
	});
var $elm$bytes$Bytes$Decode$map5 = F6(
	function (func, _v0, _v1, _v2, _v3, _v4) {
		var decodeA = _v0.a;
		var decodeB = _v1.a;
		var decodeC = _v2.a;
		var decodeD = _v3.a;
		var decodeE = _v4.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v5 = A2(decodeA, bites, offset);
					var aOffset = _v5.a;
					var a = _v5.b;
					var _v6 = A2(decodeB, bites, aOffset);
					var bOffset = _v6.a;
					var b = _v6.b;
					var _v7 = A2(decodeC, bites, bOffset);
					var cOffset = _v7.a;
					var c = _v7.b;
					var _v8 = A2(decodeD, bites, cOffset);
					var dOffset = _v8.a;
					var d = _v8.b;
					var _v9 = A2(decodeE, bites, dOffset);
					var eOffset = _v9.a;
					var e = _v9.b;
					return _Utils_Tuple2(
						eOffset,
						A5(func, a, b, c, d, e));
				}));
	});
var $folkertdev$elm_flate$Experimental$ByteArray$fromBytesHelp = function (_v0) {
	var remaining = _v0.a;
	var array = _v0.b;
	if (remaining >= 40) {
		return A2(
			$elm$bytes$Bytes$Decode$andThen,
			$elm$core$Basics$identity,
			A6(
				$elm$bytes$Bytes$Decode$map5,
				F5(
					function (a, b, c, d, e) {
						return A6(
							$elm$bytes$Bytes$Decode$map5,
							F5(
								function (f, g, h, i, j) {
									return $elm$bytes$Bytes$Decode$Loop(
										_Utils_Tuple2(
											remaining - 40,
											A2(
												$elm$core$Array$append,
												array,
												$elm$core$Array$fromList(
													_List_fromArray(
														[a, b, c, d, e, f, g, h, i, j])))));
								}),
							$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
							$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
							$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
							$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
							$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE));
					}),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE)));
	} else {
		if (remaining >= 20) {
			return A6(
				$elm$bytes$Bytes$Decode$map5,
				F5(
					function (a, b, c, d, e) {
						return $elm$bytes$Bytes$Decode$Loop(
							_Utils_Tuple2(
								remaining - 20,
								A2(
									$elm$core$Array$push,
									e,
									A2(
										$elm$core$Array$push,
										d,
										A2(
											$elm$core$Array$push,
											c,
											A2(
												$elm$core$Array$push,
												b,
												A2($elm$core$Array$push, a, array)))))));
					}),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE),
				$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE));
		} else {
			if (remaining >= 4) {
				return A2(
					$elm$bytes$Bytes$Decode$map,
					function (a) {
						return $elm$bytes$Bytes$Decode$Loop(
							_Utils_Tuple2(
								remaining - 4,
								A2($elm$core$Array$push, a, array)));
					},
					$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE));
			} else {
				switch (remaining) {
					case 0:
						return $elm$bytes$Bytes$Decode$succeed(
							$elm$bytes$Bytes$Decode$Done(
								_Utils_Tuple3(0, 0, array)));
					case 1:
						return A2(
							$elm$bytes$Bytes$Decode$map,
							function (_byte) {
								return $elm$bytes$Bytes$Decode$Done(
									_Utils_Tuple3(1, _byte << 24, array));
							},
							$elm$bytes$Bytes$Decode$unsignedInt8);
					case 2:
						return A2(
							$elm$bytes$Bytes$Decode$map,
							function (_byte) {
								return $elm$bytes$Bytes$Decode$Done(
									_Utils_Tuple3(2, _byte << 16, array));
							},
							$elm$bytes$Bytes$Decode$unsignedInt16($elm$bytes$Bytes$BE));
					default:
						return A3(
							$elm$bytes$Bytes$Decode$map2,
							F2(
								function (bytes, _byte) {
									return $elm$bytes$Bytes$Decode$Done(
										_Utils_Tuple3(3, (bytes << 16) | (_byte << 8), array));
								}),
							$elm$bytes$Bytes$Decode$unsignedInt16($elm$bytes$Bytes$BE),
							$elm$bytes$Bytes$Decode$unsignedInt8);
				}
			}
		}
	}
};
var $folkertdev$elm_flate$Experimental$ByteArray$fromBytes = function (buffer) {
	var _v0 = A2(
		$elm$bytes$Bytes$Decode$decode,
		A2(
			$elm$bytes$Bytes$Decode$loop,
			_Utils_Tuple2(
				$elm$bytes$Bytes$width(buffer),
				$elm$core$Array$empty),
			$folkertdev$elm_flate$Experimental$ByteArray$fromBytesHelp),
		buffer);
	if (_v0.$ === 'Nothing') {
		return $folkertdev$elm_flate$Experimental$ByteArray$empty;
	} else {
		var _v1 = _v0.a;
		var finalSize = _v1.a;
		var finalBytes = _v1.b;
		var array = _v1.c;
		return A3($folkertdev$elm_flate$Experimental$ByteArray$ByteArray, array, finalSize, finalBytes);
	}
};
var $folkertdev$elm_flate$LZ77$encodeWithOptions = F2(
	function (_v0, buffer) {
		var windowSize = _v0.windowSize;
		return A2(
			$folkertdev$elm_flate$LZ77$flush,
			windowSize,
			$folkertdev$elm_flate$Experimental$ByteArray$fromBytes(buffer));
	});
var $folkertdev$elm_flate$ByteArray$decodeByteArrayHelp = function (_v0) {
	var remaining = _v0.a;
	var accum = _v0.b;
	return (remaining >= 4) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_new) {
			var byte4 = 255 & (_new >>> 0);
			var byte3 = 255 & ((_new >> 8) >>> 0);
			var byte2 = 255 & ((_new >> 16) >>> 0);
			var byte1 = 255 & ((_new >> 24) >>> 0);
			var newAccum = A2(
				$elm$core$Array$push,
				byte4,
				A2(
					$elm$core$Array$push,
					byte3,
					A2(
						$elm$core$Array$push,
						byte2,
						A2($elm$core$Array$push, byte1, accum))));
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(remaining - 4, newAccum));
		},
		$elm$bytes$Bytes$Decode$unsignedInt32($elm$bytes$Bytes$BE)) : ((remaining > 0) ? A2(
		$elm$bytes$Bytes$Decode$map,
		function (_new) {
			return $elm$bytes$Bytes$Decode$Loop(
				_Utils_Tuple2(
					remaining - 1,
					A2($elm$core$Array$push, _new, accum)));
		},
		$elm$bytes$Bytes$Decode$unsignedInt8) : $elm$bytes$Bytes$Decode$succeed(
		$elm$bytes$Bytes$Decode$Done(accum)));
};
var $folkertdev$elm_flate$ByteArray$decoder = function (n) {
	return A2(
		$elm$bytes$Bytes$Decode$loop,
		_Utils_Tuple2(n, $elm$core$Array$empty),
		$folkertdev$elm_flate$ByteArray$decodeByteArrayHelp);
};
var $folkertdev$elm_flate$ByteArray$fromBytes = function (buffer) {
	var _v0 = A2(
		$elm$bytes$Bytes$Decode$decode,
		$folkertdev$elm_flate$ByteArray$decoder(
			$elm$bytes$Bytes$width(buffer)),
		buffer);
	if (_v0.$ === 'Nothing') {
		return $elm$core$Array$empty;
	} else {
		var value = _v0.a;
		return value;
	}
};
var $folkertdev$elm_flate$Deflate$Internal$compress = F2(
	function (maybeWindowSize, buf) {
		if (maybeWindowSize.$ === 'Nothing') {
			return A2(
				$elm$core$Array$push,
				$folkertdev$elm_flate$Deflate$Symbol$EndOfBlock,
				A2(
					$elm$core$Array$map,
					$folkertdev$elm_flate$Deflate$Symbol$Literal,
					$folkertdev$elm_flate$ByteArray$fromBytes(buf)));
		} else {
			var windowSize = maybeWindowSize.a;
			return A2(
				$elm$core$Array$push,
				$folkertdev$elm_flate$Deflate$Symbol$EndOfBlock,
				A2(
					$elm$core$Array$map,
					$folkertdev$elm_flate$Deflate$Internal$codeToSymbol,
					A2(
						$folkertdev$elm_flate$LZ77$encodeWithOptions,
						{windowSize: windowSize},
						buf)));
		}
	});
var $folkertdev$elm_flate$Deflate$BitWriter$flushIfNeeded = F3(
	function (tag, bitsWritten, encoders) {
		return (bitsWritten >= 16) ? {
			bitsWritten: bitsWritten - 16,
			encoders: A2(
				$elm$core$List$cons,
				A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$LE, tag),
				encoders),
			tag: tag >> 16
		} : {bitsWritten: bitsWritten, encoders: encoders, tag: tag};
	});
var $folkertdev$elm_flate$Deflate$BitWriter$writeBits = F3(
	function (bitwidth, bits, state) {
		return A3($folkertdev$elm_flate$Deflate$BitWriter$flushIfNeeded, state.tag | (bits << state.bitsWritten), state.bitsWritten + bitwidth, state.encoders);
	});
var $folkertdev$elm_flate$Huffman$encode = F2(
	function (symbol, _v0) {
		var table = _v0.a;
		var _v1 = A2($elm$core$Array$get, symbol, table);
		if (_v1.$ === 'Nothing') {
			return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 0, 0);
		} else {
			var width = _v1.a.a.width;
			var bits = _v1.a.a.bits;
			return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, width, bits);
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$extraLength = function (symbol) {
	if (symbol.$ === 'Share') {
		var length = symbol.a;
		return (((length >= 3) && (length <= 10)) || (length === 258)) ? $elm$core$Maybe$Nothing : (((length >= 11) && (length <= 18)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				1,
				A2($elm$core$Basics$modBy, 2, length - 11))) : (((length >= 19) && (length <= 34)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				2,
				A2($elm$core$Basics$modBy, 4, length - 19))) : (((length >= 35) && (length <= 66)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				3,
				A2($elm$core$Basics$modBy, 8, length - 35))) : (((length >= 67) && (length <= 130)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				4,
				A2($elm$core$Basics$modBy, 16, length - 67))) : (((length >= 131) && (length <= 257)) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(
				5,
				A2($elm$core$Basics$modBy, 32, length - 131))) : $elm$core$Maybe$Nothing)))));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $folkertdev$elm_flate$Deflate$Symbol$encode = F3(
	function (symbol, htrees, bitWriter) {
		var maybeExtra = function () {
			var _v2 = $folkertdev$elm_flate$Deflate$Symbol$extraLength(symbol);
			if (_v2.$ === 'Nothing') {
				return $elm$core$Basics$identity;
			} else {
				var _v3 = _v2.a;
				var bits = _v3.a;
				var extra = _v3.b;
				return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, bits, extra);
			}
		}();
		var maybeDistance = function () {
			var _v0 = $folkertdev$elm_flate$Deflate$Symbol$distance(symbol);
			if (_v0.$ === 'Nothing') {
				return $elm$core$Basics$identity;
			} else {
				var _v1 = _v0.a;
				var code_ = _v1.a;
				var bits = _v1.b;
				var extra = _v1.c;
				return A2(
					$elm$core$Basics$composeR,
					A2($folkertdev$elm_flate$Huffman$encode, code_, htrees.distance),
					(bits > 0) ? A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, bits, extra) : $elm$core$Basics$identity);
			}
		}();
		return maybeDistance(
			maybeExtra(
				A3(
					$folkertdev$elm_flate$Huffman$encode,
					$folkertdev$elm_flate$Deflate$Symbol$code(symbol),
					htrees.literal,
					bitWriter)));
	});
var $folkertdev$elm_flate$Deflate$Symbol$bitwidth_code_order = _List_fromArray(
	[16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var $folkertdev$elm_flate$Deflate$Symbol$calculateCodes = function (runLengths) {
	var loop2 = F3(
		function (r, c, codes) {
			loop2:
			while (true) {
				if (c >= 3) {
					var n = A2($elm$core$Basics$min, 6, c);
					var $temp$r = r,
						$temp$c = c - n,
						$temp$codes = A2(
						$elm$core$Array$push,
						_Utils_Tuple3(16, 2, n - 3),
						codes);
					r = $temp$r;
					c = $temp$c;
					codes = $temp$codes;
					continue loop2;
				} else {
					return A2(
						$elm$core$Array$append,
						codes,
						A2(
							$elm$core$Array$repeat,
							c,
							_Utils_Tuple3(r.value, 0, 0)));
				}
			}
		});
	var loop1 = F2(
		function (c, codes) {
			loop1:
			while (true) {
				if (c >= 11) {
					var n = A2($elm$core$Basics$min, 138, c);
					var $temp$c = c - n,
						$temp$codes = A2(
						$elm$core$Array$push,
						_Utils_Tuple3(18, 7, n - 11),
						codes);
					c = $temp$c;
					codes = $temp$codes;
					continue loop1;
				} else {
					if (c >= 3) {
						return A2(
							$elm$core$Array$push,
							_Utils_Tuple3(17, 3, c - 3),
							codes);
					} else {
						return A2(
							$elm$core$Array$append,
							codes,
							A2(
								$elm$core$Array$repeat,
								c,
								_Utils_Tuple3(0, 0, 0)));
					}
				}
			}
		});
	var folder = F2(
		function (r, codes) {
			return (!r.value) ? A2(loop1, r.count, codes) : A3(
				loop2,
				r,
				r.count - 1,
				A2(
					$elm$core$Array$push,
					_Utils_Tuple3(r.value, 0, 0),
					codes));
		});
	return A3($elm$core$Array$foldl, folder, $elm$core$Array$empty, runLengths);
};
var $folkertdev$elm_flate$Huffman$getWidth = function (_v0) {
	var width = _v0.a.width;
	return width;
};
var $folkertdev$elm_flate$Huffman$lookup = F2(
	function (symbol, _v0) {
		var array = _v0.a;
		return A2($elm$core$Array$get, symbol, array);
	});
var $folkertdev$elm_flate$Deflate$Symbol$calculateRunLengths = F2(
	function (lengths, accum) {
		calculateRunLengths:
		while (true) {
			if (!lengths.b) {
				return A3($elm$core$List$foldr, $elm$core$Array$push, $elm$core$Array$empty, accum);
			} else {
				var _v1 = lengths.a;
				var e = _v1.a;
				var size = _v1.b;
				var rest = lengths.b;
				var list = A2(
					$elm$core$List$indexedMap,
					$elm$core$Tuple$pair,
					A2(
						$elm$core$List$map,
						function (x) {
							return A2(
								$elm$core$Maybe$withDefault,
								0,
								A2(
									$elm$core$Maybe$map,
									$folkertdev$elm_flate$Huffman$getWidth,
									A2($folkertdev$elm_flate$Huffman$lookup, x, e)));
						},
						A2($elm$core$List$range, 0, size - 1)));
				var folder = F2(
					function (_v3, runLengths) {
						var i = _v3.a;
						var c = _v3.b;
						if (!runLengths.b) {
							return A2(
								$elm$core$List$cons,
								{count: 1, value: c},
								runLengths);
						} else {
							var last = runLengths.a;
							var remaining = runLengths.b;
							return _Utils_eq(last.value, c) ? A2(
								$elm$core$List$cons,
								{count: last.count + 1, value: last.value},
								remaining) : A2(
								$elm$core$List$cons,
								{count: 1, value: c},
								runLengths);
						}
					});
				var $temp$lengths = rest,
					$temp$accum = A3($elm$core$List$foldl, folder, accum, list);
				lengths = $temp$lengths;
				accum = $temp$accum;
				continue calculateRunLengths;
			}
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$buildBitWidthCodes = F3(
	function (literalCodeCount, distanceCodeCount, trees) {
		var runLengths = A2(
			$folkertdev$elm_flate$Deflate$Symbol$calculateRunLengths,
			_List_fromArray(
				[
					_Utils_Tuple2(trees.literal, literalCodeCount),
					_Utils_Tuple2(trees.distance, distanceCodeCount)
				]),
			_List_Nil);
		return $folkertdev$elm_flate$Deflate$Symbol$calculateCodes(runLengths);
	});
var $folkertdev$elm_flate$Deflate$Symbol$positionLoop = F3(
	function (predicate, i, elements) {
		positionLoop:
		while (true) {
			if (!elements.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = elements.a;
				var xs = elements.b;
				if (predicate(x)) {
					return $elm$core$Maybe$Just(i);
				} else {
					var $temp$predicate = predicate,
						$temp$i = i + 1,
						$temp$elements = xs;
					predicate = $temp$predicate;
					i = $temp$i;
					elements = $temp$elements;
					continue positionLoop;
				}
			}
		}
	});
var $folkertdev$elm_flate$Deflate$Symbol$position = F2(
	function (predicate, elements) {
		return A3($folkertdev$elm_flate$Deflate$Symbol$positionLoop, predicate, 0, elements);
	});
var $folkertdev$elm_flate$Huffman$positionFromTheEnd = F2(
	function (predicated, array) {
		var folder = F2(
			function (element, _v1) {
				var index = _v1.a;
				var accum = _v1.b;
				if (accum.$ === 'Just') {
					return _Utils_Tuple2(index, accum);
				} else {
					return predicated(element) ? _Utils_Tuple2(
						index,
						$elm$core$Maybe$Just(index)) : _Utils_Tuple2(index - 1, $elm$core$Maybe$Nothing);
				}
			});
		var finalIndex = $elm$core$Array$length(array) - 1;
		return A2(
			$elm$core$Maybe$map,
			function (v) {
				return finalIndex - v;
			},
			A3(
				$elm$core$Array$foldr,
				folder,
				_Utils_Tuple2(finalIndex, $elm$core$Maybe$Nothing),
				array).b);
	});
var $folkertdev$elm_flate$Huffman$usedMaxSymbol = function (_v0) {
	var array = _v0.a;
	return A2(
		$elm$core$Maybe$map,
		function (trailingZeros) {
			return ($elm$core$Array$length(array) - 1) - trailingZeros;
		},
		A2(
			$folkertdev$elm_flate$Huffman$positionFromTheEnd,
			function (_v1) {
				var value = _v1.a;
				return value.width > 0;
			},
			array));
};
var $folkertdev$elm_flate$Deflate$Symbol$writeDynamicHuffmanCodec = F2(
	function (trees, bitWriter) {
		var literal_code_count = A2(
			$elm$core$Basics$max,
			257,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				$folkertdev$elm_flate$Huffman$usedMaxSymbol(trees.literal)) + 1);
		var distance_code_count = A2(
			$elm$core$Basics$max,
			1,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				$folkertdev$elm_flate$Huffman$usedMaxSymbol(trees.distance)) + 1);
		var codes = A3(
			$folkertdev$elm_flate$Deflate$Symbol$buildBitWidthCodes,
			literal_code_count,
			distance_code_count,
			{distance: trees.distance, literal: trees.literal});
		var codeCounts = A3(
			$elm$core$Array$foldl,
			function (_v2) {
				var i = _v2.a;
				return A2(
					$folkertdev$elm_flate$Deflate$Symbol$update,
					i,
					function (v) {
						return v + 1;
					});
			},
			A2($elm$core$Array$repeat, 19, 0),
			codes);
		var bitWidthEncoder = A2($folkertdev$elm_flate$Huffman$fromFrequencies, codeCounts, 7);
		var bitwidthCodeCount = A2(
			$elm$core$Basics$max,
			4,
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A2(
					$elm$core$Maybe$map,
					function (trailingZeros) {
						return 19 - trailingZeros;
					},
					A2(
						$folkertdev$elm_flate$Deflate$Symbol$position,
						function (i) {
							var _v1 = A2($folkertdev$elm_flate$Huffman$lookup, i, bitWidthEncoder);
							if (_v1.$ === 'Nothing') {
								return false;
							} else {
								var value = _v1.a;
								return $folkertdev$elm_flate$Huffman$getWidth(value) > 0;
							}
						},
						$elm$core$List$reverse($folkertdev$elm_flate$Deflate$Symbol$bitwidth_code_order)))));
		var v1 = function (writer) {
			return A3(
				$elm$core$List$foldl,
				F2(
					function (i, current) {
						var width = _Utils_eq(
							A2($elm$core$Array$get, i, codeCounts),
							$elm$core$Maybe$Just(0)) ? 0 : A2(
							$elm$core$Maybe$withDefault,
							0,
							A2(
								$elm$core$Maybe$map,
								$folkertdev$elm_flate$Huffman$getWidth,
								A2($folkertdev$elm_flate$Huffman$lookup, i, bitWidthEncoder)));
						return A3($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 3, width, current);
					}),
				writer,
				A2($elm$core$List$take, bitwidthCodeCount, $folkertdev$elm_flate$Deflate$Symbol$bitwidth_code_order));
		};
		var v2 = function (writer) {
			return A3(
				$elm$core$Array$foldl,
				F2(
					function (_v0, current) {
						var code_ = _v0.a;
						var bits = _v0.b;
						var extra = _v0.c;
						return (bits > 0) ? A3(
							$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
							bits,
							extra,
							A3($folkertdev$elm_flate$Huffman$encode, code_, bitWidthEncoder, current)) : A3($folkertdev$elm_flate$Huffman$encode, code_, bitWidthEncoder, current);
					}),
				writer,
				codes);
		};
		return v2(
			v1(
				A3(
					$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
					4,
					bitwidthCodeCount - 4,
					A3(
						$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
						5,
						distance_code_count - 1,
						A3($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 5, literal_code_count - 257, bitWriter)))));
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeCompressDynamic = F3(
	function (maybeWindowSize, buf, bitWriter) {
		var compressed = A2($folkertdev$elm_flate$Deflate$Internal$compress, maybeWindowSize, buf);
		var huffmanTree = $folkertdev$elm_flate$Deflate$Symbol$buildDynamicHuffmanCodec(compressed);
		var huffmanTreeWriter = A2($folkertdev$elm_flate$Deflate$Symbol$writeDynamicHuffmanCodec, huffmanTree, bitWriter);
		return A3(
			$elm$core$Array$foldl,
			F2(
				function (symbol, first) {
					return A3($folkertdev$elm_flate$Deflate$Symbol$encode, symbol, huffmanTree, first);
				}),
			huffmanTreeWriter,
			compressed);
	});
var $folkertdev$elm_flate$Deflate$BitWriter$writeBit = function (b) {
	if (!b) {
		return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 1, 0);
	} else {
		return A2($folkertdev$elm_flate$Deflate$BitWriter$writeBits, 1, 1);
	}
};
var $folkertdev$elm_flate$Deflate$Internal$encodeDynamicBlock = F3(
	function (windowSize, _v0, bitWriter) {
		var isLastBlock = _v0.a;
		var buffer = _v0.b;
		return A3(
			$folkertdev$elm_flate$Deflate$Internal$encodeCompressDynamic,
			windowSize,
			buffer,
			A3(
				$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
				2,
				2,
				A2($folkertdev$elm_flate$Deflate$BitWriter$writeBit, isLastBlock, bitWriter)));
	});
var $folkertdev$elm_flate$Deflate$BitWriter$flushLoop = F3(
	function (tag, bitsWritten, encoders) {
		flushLoop:
		while (true) {
			if (bitsWritten > 0) {
				var $temp$tag = tag >> 8,
					$temp$bitsWritten = A2($elm$core$Basics$max, 0, bitsWritten - 8),
					$temp$encoders = A2(
					$elm$core$List$cons,
					$elm$bytes$Bytes$Encode$unsignedInt8(tag),
					encoders);
				tag = $temp$tag;
				bitsWritten = $temp$bitsWritten;
				encoders = $temp$encoders;
				continue flushLoop;
			} else {
				return {bitsWritten: bitsWritten, encoders: encoders, tag: tag};
			}
		}
	});
var $folkertdev$elm_flate$Deflate$BitWriter$flush = function (state) {
	return A3($folkertdev$elm_flate$Deflate$BitWriter$flushLoop, state.tag, state.bitsWritten, state.encoders);
};
var $folkertdev$elm_flate$Deflate$BitWriter$run = function (state) {
	return $elm$core$List$reverse(state.encoders);
};
var $folkertdev$elm_flate$Deflate$Internal$encodeDynamic = F2(
	function (windowSize, buffer) {
		var encodedChunks = A2(
			$elm$core$List$map,
			$folkertdev$elm_flate$Deflate$Internal$encodeDynamicBlock(windowSize),
			A2($folkertdev$elm_flate$Deflate$Internal$chunks, $folkertdev$elm_flate$Deflate$Internal$default_block_size, buffer));
		return $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				$folkertdev$elm_flate$Deflate$BitWriter$run(
					$folkertdev$elm_flate$Deflate$BitWriter$flush(
						A3(
							$elm$core$List$foldl,
							F2(
								function (chunk, first) {
									return chunk(first);
								}),
							$folkertdev$elm_flate$Deflate$BitWriter$empty,
							encodedChunks)))));
	});
var $folkertdev$elm_flate$Deflate$Internal$max_non_compressed_block_size = 65535;
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $folkertdev$elm_flate$ByteArray$fasterEncodeFolderR = F2(
	function (_byte, _v0) {
		var bytesOnAccum = _v0.a;
		var accum = _v0.b;
		var encoders = _v0.c;
		switch (bytesOnAccum) {
			case 0:
				var value = 255 & _byte;
				return _Utils_Tuple3(1, value, encoders);
			case 1:
				var value = accum | ((255 & _byte) << 8);
				return _Utils_Tuple3(2, value, encoders);
			case 2:
				var value = accum | ((255 & _byte) << 16);
				return _Utils_Tuple3(3, value, encoders);
			default:
				var value = accum | ((255 & _byte) << 24);
				return _Utils_Tuple3(
					0,
					0,
					A2(
						$elm$core$List$cons,
						A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$BE, value),
						encoders));
		}
	});
var $folkertdev$elm_flate$ByteArray$fasterEncodeR = function (_v0) {
	var bytesOnAccum = _v0.a;
	var accum = _v0.b;
	var otherEncoders = _v0.c;
	var encoders = function () {
		switch (bytesOnAccum) {
			case 0:
				return otherEncoders;
			case 1:
				return A2(
					$elm$core$List$cons,
					$elm$bytes$Bytes$Encode$unsignedInt8(accum),
					otherEncoders);
			case 2:
				return A2(
					$elm$core$List$cons,
					A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$BE, accum),
					otherEncoders);
			default:
				var otherBytes = accum >> 8;
				var firstByte = 255 & accum;
				return A2(
					$elm$core$List$cons,
					A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$BE, otherBytes),
					A2(
						$elm$core$List$cons,
						$elm$bytes$Bytes$Encode$unsignedInt8(firstByte),
						otherEncoders));
		}
	}();
	return encoders;
};
var $folkertdev$elm_flate$ByteArray$toBytes = function (array) {
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			$folkertdev$elm_flate$ByteArray$fasterEncodeR(
				A3(
					$elm$core$Array$foldr,
					$folkertdev$elm_flate$ByteArray$fasterEncodeFolderR,
					_Utils_Tuple3(0, 0, _List_Nil),
					array))));
};
var $folkertdev$elm_flate$Deflate$BitWriter$writeEncoder = F2(
	function (encoder, state) {
		return {
			bitsWritten: state.bitsWritten,
			encoders: A2($elm$core$List$cons, encoder, state.encoders),
			tag: state.tag
		};
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeRawBlock = F2(
	function (_v0, bitWriter) {
		var isLastBlock = _v0.a;
		var buffer = _v0.b;
		var byteArray = $folkertdev$elm_flate$ByteArray$fromBytes(buffer);
		var size = A2(
			$elm$core$Basics$min,
			$elm$core$Array$length(byteArray),
			$folkertdev$elm_flate$Deflate$Internal$max_non_compressed_block_size);
		var sliced = A3($elm$core$Array$slice, 0, size, byteArray);
		return A2(
			$folkertdev$elm_flate$Deflate$BitWriter$writeEncoder,
			$elm$bytes$Bytes$Encode$bytes(
				$folkertdev$elm_flate$ByteArray$toBytes(sliced)),
			A2(
				$folkertdev$elm_flate$Deflate$BitWriter$writeEncoder,
				A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$LE, ~size),
				A2(
					$folkertdev$elm_flate$Deflate$BitWriter$writeEncoder,
					A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$LE, size),
					$folkertdev$elm_flate$Deflate$BitWriter$flush(
						A3(
							$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
							2,
							0,
							A2($folkertdev$elm_flate$Deflate$BitWriter$writeBit, isLastBlock, bitWriter))))));
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeRaw = function (buffer) {
	return $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			$folkertdev$elm_flate$Deflate$BitWriter$run(
				A3(
					$elm$core$List$foldl,
					F2(
						function (chunk, first) {
							return A2($folkertdev$elm_flate$Deflate$Internal$encodeRawBlock, chunk, first);
						}),
					$folkertdev$elm_flate$Deflate$BitWriter$empty,
					A2(
						$folkertdev$elm_flate$Deflate$Internal$chunks,
						A2($elm$core$Basics$min, $folkertdev$elm_flate$Deflate$Internal$max_non_compressed_block_size, $folkertdev$elm_flate$Deflate$Internal$default_block_size),
						buffer)))));
};
var $folkertdev$elm_flate$Huffman$fromList = A2(
	$elm$core$Basics$composeL,
	A2($elm$core$Basics$composeL, $folkertdev$elm_flate$Huffman$Tree, $elm$core$Array$fromList),
	$elm$core$List$map($folkertdev$elm_flate$Huffman$codeFromRecord));
var $folkertdev$elm_flate$Huffman$hardcodedStaticHuffmanTree = {
	distance: $folkertdev$elm_flate$Huffman$fromList(
		_List_fromArray(
			[
				{bits: 0, width: 5},
				{bits: 16, width: 5},
				{bits: 8, width: 5},
				{bits: 24, width: 5},
				{bits: 4, width: 5},
				{bits: 20, width: 5},
				{bits: 12, width: 5},
				{bits: 28, width: 5},
				{bits: 2, width: 5},
				{bits: 18, width: 5},
				{bits: 10, width: 5},
				{bits: 26, width: 5},
				{bits: 6, width: 5},
				{bits: 22, width: 5},
				{bits: 14, width: 5},
				{bits: 30, width: 5},
				{bits: 1, width: 5},
				{bits: 17, width: 5},
				{bits: 9, width: 5},
				{bits: 25, width: 5},
				{bits: 5, width: 5},
				{bits: 21, width: 5},
				{bits: 13, width: 5},
				{bits: 29, width: 5},
				{bits: 3, width: 5},
				{bits: 19, width: 5},
				{bits: 11, width: 5},
				{bits: 27, width: 5},
				{bits: 7, width: 5},
				{bits: 23, width: 5}
			])),
	literal: $folkertdev$elm_flate$Huffman$fromList(
		_List_fromArray(
			[
				{bits: 12, width: 8},
				{bits: 140, width: 8},
				{bits: 76, width: 8},
				{bits: 204, width: 8},
				{bits: 44, width: 8},
				{bits: 172, width: 8},
				{bits: 108, width: 8},
				{bits: 236, width: 8},
				{bits: 28, width: 8},
				{bits: 156, width: 8},
				{bits: 92, width: 8},
				{bits: 220, width: 8},
				{bits: 60, width: 8},
				{bits: 188, width: 8},
				{bits: 124, width: 8},
				{bits: 252, width: 8},
				{bits: 2, width: 8},
				{bits: 130, width: 8},
				{bits: 66, width: 8},
				{bits: 194, width: 8},
				{bits: 34, width: 8},
				{bits: 162, width: 8},
				{bits: 98, width: 8},
				{bits: 226, width: 8},
				{bits: 18, width: 8},
				{bits: 146, width: 8},
				{bits: 82, width: 8},
				{bits: 210, width: 8},
				{bits: 50, width: 8},
				{bits: 178, width: 8},
				{bits: 114, width: 8},
				{bits: 242, width: 8},
				{bits: 10, width: 8},
				{bits: 138, width: 8},
				{bits: 74, width: 8},
				{bits: 202, width: 8},
				{bits: 42, width: 8},
				{bits: 170, width: 8},
				{bits: 106, width: 8},
				{bits: 234, width: 8},
				{bits: 26, width: 8},
				{bits: 154, width: 8},
				{bits: 90, width: 8},
				{bits: 218, width: 8},
				{bits: 58, width: 8},
				{bits: 186, width: 8},
				{bits: 122, width: 8},
				{bits: 250, width: 8},
				{bits: 6, width: 8},
				{bits: 134, width: 8},
				{bits: 70, width: 8},
				{bits: 198, width: 8},
				{bits: 38, width: 8},
				{bits: 166, width: 8},
				{bits: 102, width: 8},
				{bits: 230, width: 8},
				{bits: 22, width: 8},
				{bits: 150, width: 8},
				{bits: 86, width: 8},
				{bits: 214, width: 8},
				{bits: 54, width: 8},
				{bits: 182, width: 8},
				{bits: 118, width: 8},
				{bits: 246, width: 8},
				{bits: 14, width: 8},
				{bits: 142, width: 8},
				{bits: 78, width: 8},
				{bits: 206, width: 8},
				{bits: 46, width: 8},
				{bits: 174, width: 8},
				{bits: 110, width: 8},
				{bits: 238, width: 8},
				{bits: 30, width: 8},
				{bits: 158, width: 8},
				{bits: 94, width: 8},
				{bits: 222, width: 8},
				{bits: 62, width: 8},
				{bits: 190, width: 8},
				{bits: 126, width: 8},
				{bits: 254, width: 8},
				{bits: 1, width: 8},
				{bits: 129, width: 8},
				{bits: 65, width: 8},
				{bits: 193, width: 8},
				{bits: 33, width: 8},
				{bits: 161, width: 8},
				{bits: 97, width: 8},
				{bits: 225, width: 8},
				{bits: 17, width: 8},
				{bits: 145, width: 8},
				{bits: 81, width: 8},
				{bits: 209, width: 8},
				{bits: 49, width: 8},
				{bits: 177, width: 8},
				{bits: 113, width: 8},
				{bits: 241, width: 8},
				{bits: 9, width: 8},
				{bits: 137, width: 8},
				{bits: 73, width: 8},
				{bits: 201, width: 8},
				{bits: 41, width: 8},
				{bits: 169, width: 8},
				{bits: 105, width: 8},
				{bits: 233, width: 8},
				{bits: 25, width: 8},
				{bits: 153, width: 8},
				{bits: 89, width: 8},
				{bits: 217, width: 8},
				{bits: 57, width: 8},
				{bits: 185, width: 8},
				{bits: 121, width: 8},
				{bits: 249, width: 8},
				{bits: 5, width: 8},
				{bits: 133, width: 8},
				{bits: 69, width: 8},
				{bits: 197, width: 8},
				{bits: 37, width: 8},
				{bits: 165, width: 8},
				{bits: 101, width: 8},
				{bits: 229, width: 8},
				{bits: 21, width: 8},
				{bits: 149, width: 8},
				{bits: 85, width: 8},
				{bits: 213, width: 8},
				{bits: 53, width: 8},
				{bits: 181, width: 8},
				{bits: 117, width: 8},
				{bits: 245, width: 8},
				{bits: 13, width: 8},
				{bits: 141, width: 8},
				{bits: 77, width: 8},
				{bits: 205, width: 8},
				{bits: 45, width: 8},
				{bits: 173, width: 8},
				{bits: 109, width: 8},
				{bits: 237, width: 8},
				{bits: 29, width: 8},
				{bits: 157, width: 8},
				{bits: 93, width: 8},
				{bits: 221, width: 8},
				{bits: 61, width: 8},
				{bits: 189, width: 8},
				{bits: 125, width: 8},
				{bits: 253, width: 8},
				{bits: 19, width: 9},
				{bits: 275, width: 9},
				{bits: 147, width: 9},
				{bits: 403, width: 9},
				{bits: 83, width: 9},
				{bits: 339, width: 9},
				{bits: 211, width: 9},
				{bits: 467, width: 9},
				{bits: 51, width: 9},
				{bits: 307, width: 9},
				{bits: 179, width: 9},
				{bits: 435, width: 9},
				{bits: 115, width: 9},
				{bits: 371, width: 9},
				{bits: 243, width: 9},
				{bits: 499, width: 9},
				{bits: 11, width: 9},
				{bits: 267, width: 9},
				{bits: 139, width: 9},
				{bits: 395, width: 9},
				{bits: 75, width: 9},
				{bits: 331, width: 9},
				{bits: 203, width: 9},
				{bits: 459, width: 9},
				{bits: 43, width: 9},
				{bits: 299, width: 9},
				{bits: 171, width: 9},
				{bits: 427, width: 9},
				{bits: 107, width: 9},
				{bits: 363, width: 9},
				{bits: 235, width: 9},
				{bits: 491, width: 9},
				{bits: 27, width: 9},
				{bits: 283, width: 9},
				{bits: 155, width: 9},
				{bits: 411, width: 9},
				{bits: 91, width: 9},
				{bits: 347, width: 9},
				{bits: 219, width: 9},
				{bits: 475, width: 9},
				{bits: 59, width: 9},
				{bits: 315, width: 9},
				{bits: 187, width: 9},
				{bits: 443, width: 9},
				{bits: 123, width: 9},
				{bits: 379, width: 9},
				{bits: 251, width: 9},
				{bits: 507, width: 9},
				{bits: 7, width: 9},
				{bits: 263, width: 9},
				{bits: 135, width: 9},
				{bits: 391, width: 9},
				{bits: 71, width: 9},
				{bits: 327, width: 9},
				{bits: 199, width: 9},
				{bits: 455, width: 9},
				{bits: 39, width: 9},
				{bits: 295, width: 9},
				{bits: 167, width: 9},
				{bits: 423, width: 9},
				{bits: 103, width: 9},
				{bits: 359, width: 9},
				{bits: 231, width: 9},
				{bits: 487, width: 9},
				{bits: 23, width: 9},
				{bits: 279, width: 9},
				{bits: 151, width: 9},
				{bits: 407, width: 9},
				{bits: 87, width: 9},
				{bits: 343, width: 9},
				{bits: 215, width: 9},
				{bits: 471, width: 9},
				{bits: 55, width: 9},
				{bits: 311, width: 9},
				{bits: 183, width: 9},
				{bits: 439, width: 9},
				{bits: 119, width: 9},
				{bits: 375, width: 9},
				{bits: 247, width: 9},
				{bits: 503, width: 9},
				{bits: 15, width: 9},
				{bits: 271, width: 9},
				{bits: 143, width: 9},
				{bits: 399, width: 9},
				{bits: 79, width: 9},
				{bits: 335, width: 9},
				{bits: 207, width: 9},
				{bits: 463, width: 9},
				{bits: 47, width: 9},
				{bits: 303, width: 9},
				{bits: 175, width: 9},
				{bits: 431, width: 9},
				{bits: 111, width: 9},
				{bits: 367, width: 9},
				{bits: 239, width: 9},
				{bits: 495, width: 9},
				{bits: 31, width: 9},
				{bits: 287, width: 9},
				{bits: 159, width: 9},
				{bits: 415, width: 9},
				{bits: 95, width: 9},
				{bits: 351, width: 9},
				{bits: 223, width: 9},
				{bits: 479, width: 9},
				{bits: 63, width: 9},
				{bits: 319, width: 9},
				{bits: 191, width: 9},
				{bits: 447, width: 9},
				{bits: 127, width: 9},
				{bits: 383, width: 9},
				{bits: 255, width: 9},
				{bits: 511, width: 9},
				{bits: 0, width: 7},
				{bits: 64, width: 7},
				{bits: 32, width: 7},
				{bits: 96, width: 7},
				{bits: 16, width: 7},
				{bits: 80, width: 7},
				{bits: 48, width: 7},
				{bits: 112, width: 7},
				{bits: 8, width: 7},
				{bits: 72, width: 7},
				{bits: 40, width: 7},
				{bits: 104, width: 7},
				{bits: 24, width: 7},
				{bits: 88, width: 7},
				{bits: 56, width: 7},
				{bits: 120, width: 7},
				{bits: 4, width: 7},
				{bits: 68, width: 7},
				{bits: 36, width: 7},
				{bits: 100, width: 7},
				{bits: 20, width: 7},
				{bits: 84, width: 7},
				{bits: 52, width: 7},
				{bits: 116, width: 7},
				{bits: 3, width: 8},
				{bits: 131, width: 8},
				{bits: 67, width: 8},
				{bits: 195, width: 8},
				{bits: 35, width: 8},
				{bits: 163, width: 8},
				{bits: 99, width: 8},
				{bits: 227, width: 8}
			]))
};
var $folkertdev$elm_flate$Deflate$Internal$encodeCompressStatic = F3(
	function (maybeWindowSize, buf, bitWriter) {
		var huffmanTrees = $folkertdev$elm_flate$Huffman$hardcodedStaticHuffmanTree;
		var compressed = A2($folkertdev$elm_flate$Deflate$Internal$compress, maybeWindowSize, buf);
		return A3(
			$elm$core$Array$foldl,
			F2(
				function (symbol, first) {
					return A3($folkertdev$elm_flate$Deflate$Symbol$encode, symbol, huffmanTrees, first);
				}),
			bitWriter,
			compressed);
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeStaticBlock = F3(
	function (windowSize, _v0, bitWriter) {
		var isLastBlock = _v0.a;
		var buffer = _v0.b;
		return A3(
			$folkertdev$elm_flate$Deflate$Internal$encodeCompressStatic,
			windowSize,
			buffer,
			A3(
				$folkertdev$elm_flate$Deflate$BitWriter$writeBits,
				2,
				1,
				A2($folkertdev$elm_flate$Deflate$BitWriter$writeBit, isLastBlock, bitWriter)));
	});
var $folkertdev$elm_flate$Deflate$Internal$encodeStatic = F2(
	function (windowSize, buffer) {
		return $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				$folkertdev$elm_flate$Deflate$BitWriter$run(
					$folkertdev$elm_flate$Deflate$BitWriter$flush(
						A3(
							$elm$core$List$foldl,
							F2(
								function (chunk, first) {
									return A3($folkertdev$elm_flate$Deflate$Internal$encodeStaticBlock, windowSize, chunk, first);
								}),
							$folkertdev$elm_flate$Deflate$BitWriter$empty,
							A2($folkertdev$elm_flate$Deflate$Internal$chunks, $folkertdev$elm_flate$Deflate$Internal$default_block_size, buffer))))));
	});
var $folkertdev$elm_flate$Flate$deflateWithOptions = F2(
	function (encoding, buffer) {
		switch (encoding.$) {
			case 'Raw':
				return $folkertdev$elm_flate$Deflate$Internal$encodeRaw(buffer);
			case 'Static':
				if (encoding.a.$ === 'NoCompression') {
					var _v1 = encoding.a;
					return A2($folkertdev$elm_flate$Deflate$Internal$encodeStatic, $elm$core$Maybe$Nothing, buffer);
				} else {
					var w = encoding.a.a;
					return A2(
						$folkertdev$elm_flate$Deflate$Internal$encodeStatic,
						$elm$core$Maybe$Just(w),
						buffer);
				}
			default:
				if (encoding.a.$ === 'NoCompression') {
					var _v2 = encoding.a;
					return A2($folkertdev$elm_flate$Deflate$Internal$encodeDynamic, $elm$core$Maybe$Nothing, buffer);
				} else {
					var w = encoding.a.a;
					return A2(
						$folkertdev$elm_flate$Deflate$Internal$encodeDynamic,
						$elm$core$Maybe$Just(w),
						buffer);
				}
		}
	});
var $folkertdev$elm_flate$Flate$deflateGZipWithOptions = F2(
	function (encoding, buffer) {
		var encodedTrailer = _List_fromArray(
			[
				A2(
				$elm$bytes$Bytes$Encode$unsignedInt32,
				$elm$bytes$Bytes$LE,
				$folkertdev$elm_flate$Checksum$Crc32$crc32(buffer)),
				A2(
				$elm$bytes$Bytes$Encode$unsignedInt32,
				$elm$bytes$Bytes$LE,
				A2(
					$elm$core$Basics$modBy,
					4294967296,
					$elm$bytes$Bytes$width(buffer)))
			]);
		var encodedHeader = _List_fromArray(
			[
				$elm$bytes$Bytes$Encode$unsignedInt8(31),
				$elm$bytes$Bytes$Encode$unsignedInt8(139),
				$elm$bytes$Bytes$Encode$unsignedInt8(8),
				$elm$bytes$Bytes$Encode$unsignedInt8(0),
				A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$LE, 0),
				$elm$bytes$Bytes$Encode$unsignedInt8(0),
				$elm$bytes$Bytes$Encode$unsignedInt8(255)
			]);
		var data = A2($folkertdev$elm_flate$Flate$deflateWithOptions, encoding, buffer);
		return $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				_Utils_ap(
					encodedHeader,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$bytes$Bytes$Encode$bytes(data)
							]),
						encodedTrailer))));
	});
var $folkertdev$elm_flate$LZ77$max_distance = 32768;
var $folkertdev$elm_flate$LZ77$maxWindowSize = $folkertdev$elm_flate$LZ77$max_distance;
var $folkertdev$elm_flate$Flate$deflateGZip = $folkertdev$elm_flate$Flate$deflateGZipWithOptions(
	$folkertdev$elm_flate$Flate$Dynamic(
		$folkertdev$elm_flate$Flate$WithWindowSize($folkertdev$elm_flate$LZ77$maxWindowSize)));
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $dkodaj$rte$MiniRte$Core$encodeMaybe = F2(
	function (f, a) {
		if (a.$ === 'Just') {
			var b = a.a;
			return f(b);
		} else {
			return $elm$json$Json$Encode$null;
		}
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $dkodaj$rte$MiniRte$Core$encodeTuple_String_String_ = function (_v0) {
	var a1 = _v0.a;
	var a2 = _v0.b;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'A1',
				$elm$json$Json$Encode$string(a1)),
				_Utils_Tuple2(
				'A2',
				$elm$json$Json$Encode$string(a2))
			]));
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $dkodaj$rte$MiniRte$Core$encodeStyleTags = function (a) {
	return A2($elm$json$Json$Encode$list, $dkodaj$rte$MiniRte$Core$encodeTuple_String_String_, a);
};
var $elm$json$Json$Encode$float = _Json_wrap;
var $dkodaj$rte$MiniRte$Core$encodeFontStyle = function (a) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'classes',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, a.classes)),
				_Utils_Tuple2(
				'fontFamily',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, a.fontFamily)),
				_Utils_Tuple2(
				'fontSize',
				A2($dkodaj$rte$MiniRte$Core$encodeMaybe, $elm$json$Json$Encode$float, a.fontSize)),
				_Utils_Tuple2(
				'styling',
				$dkodaj$rte$MiniRte$Core$encodeStyleTags(a.styling))
			]));
};
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $dkodaj$rte$MiniRte$Core$encodeCharacter = function (a) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'char',
				$elm$json$Json$Encode$string(
					$elm$core$String$fromChar(a._char))),
				_Utils_Tuple2(
				'fontStyle',
				$dkodaj$rte$MiniRte$Core$encodeFontStyle(a.fontStyle)),
				_Utils_Tuple2(
				'link',
				A2($dkodaj$rte$MiniRte$Core$encodeMaybe, $elm$json$Json$Encode$string, a.link))
			]));
};
var $dkodaj$rte$MiniRte$Core$encodeChild = function (_v0) {
	var a1 = _v0.a;
	return $dkodaj$rte$MiniRte$Core$encodeEmbeddedHtml(a1);
};
var $dkodaj$rte$MiniRte$Core$encodeEmbeddedHtml = function (a) {
	var encodeListener = function (b) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'on',
					$elm$json$Json$Encode$string(b.on)),
					_Utils_Tuple2(
					'tag',
					$elm$json$Json$Encode$string(b.tag)),
					_Utils_Tuple2(
					'at',
					A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, b.at))
				]));
	};
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'attributes',
				A2($elm$json$Json$Encode$list, $dkodaj$rte$MiniRte$Core$encodeTuple_String_String_, a.attributes)),
				_Utils_Tuple2(
				'classes',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, a.classes)),
				_Utils_Tuple2(
				'children',
				A2($elm$json$Json$Encode$list, $dkodaj$rte$MiniRte$Core$encodeChild, a.children)),
				_Utils_Tuple2(
				'nodeType',
				A2($dkodaj$rte$MiniRte$Core$encodeMaybe, $elm$json$Json$Encode$string, a.nodeType)),
				_Utils_Tuple2(
				'styling',
				$dkodaj$rte$MiniRte$Core$encodeStyleTags(a.styling)),
				_Utils_Tuple2(
				'text',
				A2($dkodaj$rte$MiniRte$Core$encodeMaybe, $elm$json$Json$Encode$string, a.text))
			]));
};
var $elm$json$Json$Encode$int = _Json_wrap;
var $dkodaj$rte$MiniRte$Core$encodeLineBreak = function (a) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'classes',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, a.classes)),
				_Utils_Tuple2(
				'indent',
				$elm$json$Json$Encode$int(a.indent)),
				_Utils_Tuple2(
				'nodeType',
				A2($dkodaj$rte$MiniRte$Core$encodeMaybe, $elm$json$Json$Encode$string, a.nodeType)),
				_Utils_Tuple2(
				'styling',
				$dkodaj$rte$MiniRte$Core$encodeStyleTags(a.styling))
			]));
};
var $dkodaj$rte$MiniRte$Core$encodeElement = function (a) {
	switch (a.$) {
		case 'Break':
			var a1 = a.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'Constructor',
						$elm$json$Json$Encode$string('Break')),
						_Utils_Tuple2(
						'A1',
						$dkodaj$rte$MiniRte$Core$encodeLineBreak(a1))
					]));
		case 'Char':
			var a1 = a.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'Constructor',
						$elm$json$Json$Encode$string('Char')),
						_Utils_Tuple2(
						'A1',
						$dkodaj$rte$MiniRte$Core$encodeCharacter(a1))
					]));
		default:
			var a1 = a.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'Constructor',
						$elm$json$Json$Encode$string('Embedded')),
						_Utils_Tuple2(
						'A1',
						$dkodaj$rte$MiniRte$Core$encodeEmbeddedHtml(a1))
					]));
	}
};
var $dkodaj$rte$MiniRte$Core$encodeContent = function (a) {
	return A2($elm$json$Json$Encode$list, $dkodaj$rte$MiniRte$Core$encodeElement, a);
};
var $dkodaj$rte$MiniRte$Core$encode = function (e) {
	return A2(
		$elm$json$Json$Encode$encode,
		0,
		$dkodaj$rte$MiniRte$Core$encodeContent(e.content));
};
var $dkodaj$rte$MiniRte$Core$encodeContentString = function (a) {
	return $dkodaj$rte$MiniRte$Core$encode(a.textarea);
};
var $elm$bytes$Bytes$Encode$Utf8 = F2(
	function (a, b) {
		return {$: 'Utf8', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$string = function (str) {
	return A2(
		$elm$bytes$Bytes$Encode$Utf8,
		_Bytes_getStringWidth(str),
		str);
};
var $dkodaj$rte$MiniRte$Core$encodeContentGZip = function (a) {
	return $folkertdev$elm_flate$Flate$deflateGZip(
		$elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$string(
				$dkodaj$rte$MiniRte$Core$encodeContentString(a))));
};
var $dkodaj$rte$MiniRte$encodeContentGZip = $dkodaj$rte$MiniRte$Core$encodeContentGZip;
var $elm$file$File$Select$file = F2(
	function (mimes, toMsg) {
		return A2(
			$elm$core$Task$perform,
			toMsg,
			_File_uploadOne(mimes));
	});
var $author$project$Main$toBrowserClipboard = _Platform_outgoingPort('toBrowserClipboard', $elm$json$Json$Encode$string);
var $elm$file$File$toBytes = _File_toBytes;
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Display = {$: 'Display'};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Freeze = {$: 'Freeze'};
var $dkodaj$rte$MiniRte$Types$ImageInputBox = function (a) {
	return {$: 'ImageInputBox', a: a};
};
var $dkodaj$rte$MiniRte$Types$LinkInputBox = function (a) {
	return {$: 'LinkInputBox', a: a};
};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoOp = {$: 'NoOp'};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Paste = function (a) {
	return {$: 'Paste', a: a};
};
var $dkodaj$rte$MiniRte$Core$idSet = F2(
	function (id, elem) {
		switch (elem.$) {
			case 'Break':
				var br = elem.a;
				return $dkodaj$rte$MiniRte$Types$Break(
					_Utils_update(
						br,
						{id: id}));
			case 'Char':
				var ch = elem.a;
				return $dkodaj$rte$MiniRte$Types$Char(
					_Utils_update(
						ch,
						{id: id}));
			default:
				var html = elem.a;
				return $dkodaj$rte$MiniRte$Types$Embedded(
					_Utils_update(
						html,
						{id: id}));
		}
	});
var $dkodaj$rte$MiniRte$Core$Cursor = {$: 'Cursor'};
var $dkodaj$rte$MiniRte$Core$placeCursor = F2(
	function (scroll, e) {
		return _Utils_Tuple2(
			_Utils_update(
				e,
				{locateBacklog: 0, locating: $dkodaj$rte$MiniRte$Core$Cursor}),
			A2($dkodaj$rte$MiniRte$Core$placeCursorCmd, scroll, e.editorID));
	});
var $dkodaj$rte$MiniRte$Core$addContent = F2(
	function (added, e) {
		var i = function (x) {
			return _Utils_eq(x, _List_Nil) ? _List_fromArray(
				[
					$dkodaj$rte$MiniRte$Types$Break(
					$dkodaj$rte$MiniRte$Core$defaultLineBreak(0))
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
								A2($dkodaj$rte$MiniRte$Core$idSet, id, x),
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
						g(added),
						A2($elm$core$List$drop, z, y)));
			});
		var j = F3(
			function (x, y, z) {
				return i(
					A3(h, x, y, z));
			});
		var _v2 = e.selection;
		if (_v2.$ === 'Nothing') {
			return A2(
				$dkodaj$rte$MiniRte$Core$placeCursor,
				$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
				_Utils_update(
					e,
					{
						content: A3(j, e.cursor, e.content, e.cursor),
						cursor: e.cursor + $elm$core$List$length(added),
						idCounter: e.idCounter + $elm$core$List$length(added)
					}));
		} else {
			var _v3 = _v2.a;
			var beg = _v3.a;
			var end = _v3.b;
			return A2(
				$dkodaj$rte$MiniRte$Core$placeCursor,
				$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
				_Utils_update(
					e,
					{
						content: A3(j, beg, e.content, end + 1),
						cursor: beg + $elm$core$List$length(added),
						idCounter: e.idCounter + $elm$core$List$length(added),
						selection: $elm$core$Maybe$Nothing
					}));
		}
	});
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoScroll = {$: 'NoScroll'};
var $dkodaj$rte$MiniRte$Core$embed = F2(
	function (html, e) {
		var elem = $dkodaj$rte$MiniRte$Types$Embedded(
			_Utils_update(
				html,
				{id: e.idCounter}));
		return A2(
			$dkodaj$rte$MiniRte$Core$placeCursor,
			$dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoScroll,
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
					idCounter: e.idCounter + 1
				}));
	});
var $dkodaj$rte$MiniRte$Types$emptyEmbeddedHtml = {attributes: _List_Nil, children: _List_Nil, classes: _List_Nil, highlightClasses: _List_Nil, highlightStyling: _List_Nil, id: -1, nodeType: $elm$core$Maybe$Nothing, styling: _List_Nil, text: $elm$core$Maybe$Nothing};
var $dkodaj$rte$MiniRte$Core$addImage = F2(
	function (src, e) {
		var imgNode = _Utils_update(
			$dkodaj$rte$MiniRte$Types$emptyEmbeddedHtml,
			{
				attributes: _List_fromArray(
					[
						_Utils_Tuple2('src', src)
					]),
				nodeType: $elm$core$Maybe$Just('img'),
				styling: _List_fromArray(
					[
						_Utils_Tuple2('object-fit', 'contain'),
						_Utils_Tuple2('max-width', '100%')
					])
			});
		return A2($dkodaj$rte$MiniRte$Core$embed, imgNode, e);
	});
var $dkodaj$rte$MiniRte$Core$get = F2(
	function (idx, content) {
		var _v0 = A2($elm$core$List$drop, idx, content);
		if (!_v0.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var x = _v0.a;
			return $elm$core$Maybe$Just(x);
		}
	});
var $dkodaj$rte$MiniRte$Core$linkAt = F2(
	function (idx, content) {
		var _v0 = A2($dkodaj$rte$MiniRte$Core$get, idx, content);
		if ((_v0.$ === 'Just') && (_v0.a.$ === 'Char')) {
			var ch = _v0.a.a;
			return ch.link;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $dkodaj$rte$MiniRte$Core$currentLink = function (e) {
	var _v0 = A2($dkodaj$rte$MiniRte$Core$linkAt, e.cursor, e.content);
	if (_v0.$ === 'Just') {
		var x = _v0.a;
		return $elm$core$Maybe$Just(x);
	} else {
		var _v1 = e.selection;
		if (_v1.$ === 'Just') {
			var _v2 = _v1.a;
			var beg = _v2.a;
			var end = _v2.b;
			return A2($dkodaj$rte$MiniRte$Core$linkAt, end, e.content);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	}
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $dkodaj$rte$MiniRte$Core$typed_ = F5(
	function (activeLink, txt, e, maybeTimeStamp, modifyClipboard) {
		var txtLength = $elm$core$List$length(
			$elm$core$String$toList(txt));
		var newIdCounter = e.idCounter + txtLength;
		var f = F2(
			function (id, _char) {
				return $dkodaj$rte$MiniRte$Types$Char(
					{_char: _char, fontStyle: e.fontStyle, highlightClasses: _List_Nil, highlightStyling: _List_Nil, id: id, link: activeLink});
			});
		var g = F2(
			function (xs, _v0) {
				g:
				while (true) {
					var id = _v0.a;
					var content = _v0.b;
					if (!xs.b) {
						return _Utils_Tuple2(id, content);
					} else {
						var x = xs.a;
						var rest = xs.b;
						var $temp$xs = rest,
							$temp$_v0 = _Utils_Tuple2(
							id - 1,
							A2(
								$elm$core$List$cons,
								A2(f, id, x),
								content));
						xs = $temp$xs;
						_v0 = $temp$_v0;
						continue g;
					}
				}
			});
		var newContent = A2(
			g,
			$elm$core$List$reverse(
				$elm$core$String$toList(txt)),
			_Utils_Tuple2(newIdCounter - 1, _List_Nil)).b;
		var newClipboard = modifyClipboard ? $elm$core$Maybe$Just(newContent) : e.clipboard;
		var _v2 = e.selection;
		if (_v2.$ === 'Nothing') {
			return A2(
				$dkodaj$rte$MiniRte$Core$placeCursor,
				$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
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
						idCounter: newIdCounter
					}));
		} else {
			var _v3 = _v2.a;
			var beg = _v3.a;
			var x = _v3.b;
			var maxIdx = $elm$core$List$length(e.content) - 1;
			var end = _Utils_eq(x, maxIdx) ? (maxIdx - 1) : x;
			return A2(
				$dkodaj$rte$MiniRte$Core$placeCursor,
				$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
				_Utils_update(
					e,
					{
						clipboard: newClipboard,
						content: _Utils_ap(
							A2($elm$core$List$take, beg, e.content),
							_Utils_ap(
								newContent,
								A2($elm$core$List$drop, end + 1, e.content))),
						cursor: beg + txtLength,
						idCounter: newIdCounter,
						selection: $elm$core$Maybe$Nothing
					}));
		}
	});
var $dkodaj$rte$MiniRte$Core$typed = F4(
	function (txt, e, maybeTimeStamp, modifyClipboard) {
		return A5(
			$dkodaj$rte$MiniRte$Core$typed_,
			$dkodaj$rte$MiniRte$Core$currentLink(e),
			txt,
			e,
			maybeTimeStamp,
			modifyClipboard);
	});
var $dkodaj$rte$MiniRte$Core$addText = F2(
	function (str, e) {
		return A4($dkodaj$rte$MiniRte$Core$typed, str, e, $elm$core$Maybe$Nothing, false);
	});
var $dkodaj$rte$MiniRte$Common$apply = F2(
	function (f, model) {
		var _v0 = f(model.textarea);
		var editor = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{textarea: editor}),
			A2($elm$core$Platform$Cmd$map, model.tagger, cmd));
	});
var $dkodaj$rte$MiniRte$Core$nextBreakFrom = F2(
	function (begIdx, content) {
		var maxIdx = $elm$core$List$length(content) - 1;
		var f = F2(
			function (idx, result) {
				if (result.$ === 'Just') {
					return result;
				} else {
					var _v1 = A2($dkodaj$rte$MiniRte$Core$get, idx, content);
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
var $dkodaj$rte$MiniRte$Core$parasInSelection = function (e) {
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
		var _v1 = A2($dkodaj$rte$MiniRte$Core$nextBreakFrom, e.cursor, e.content);
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
		var _v3 = A2($dkodaj$rte$MiniRte$Core$nextBreakFrom, end, e.content);
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
var $dkodaj$rte$MiniRte$Core$set = F3(
	function (idx, elem, content) {
		return _Utils_ap(
			A2($elm$core$List$take, idx, content),
			_Utils_ap(
				_List_fromArray(
					[elem]),
				A2($elm$core$List$drop, idx + 1, content)));
	});
var $dkodaj$rte$MiniRte$Core$set2 = F3(
	function (idx, elem, editor) {
		var content = editor.content;
		return _Utils_update(
			editor,
			{
				content: A3($dkodaj$rte$MiniRte$Core$set, idx, elem, content)
			});
	});
var $dkodaj$rte$MiniRte$Core$setPara = F2(
	function (f, e) {
		var g = F2(
			function (_v0, x) {
				var idx = _v0.a;
				var lineBreak = _v0.b;
				return A3(
					$dkodaj$rte$MiniRte$Core$set2,
					idx,
					$dkodaj$rte$MiniRte$Types$Break(
						f(lineBreak)),
					x);
			});
		var h = F2(
			function (xs, y) {
				return A3($elm$core$List$foldr, g, y, xs);
			});
		return A2(
			$dkodaj$rte$MiniRte$Core$placeCursor,
			$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
			A2(
				h,
				$dkodaj$rte$MiniRte$Core$parasInSelection(e),
				$dkodaj$rte$MiniRte$Core$undoAddNew(e)));
	});
var $dkodaj$rte$MiniRte$Core$changeIndent = F2(
	function (amount, editor) {
		var f = function (x) {
			return _Utils_update(
				x,
				{indent: amount + x.indent});
		};
		return A2($dkodaj$rte$MiniRte$Core$setPara, f, editor);
	});
var $dkodaj$rte$MiniRte$Types$ToBrowserClipboard = function (a) {
	return {$: 'ToBrowserClipboard', a: a};
};
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $dkodaj$rte$MiniRte$Core$toText = function (content) {
	var f = function (x) {
		switch (x.$) {
			case 'Break':
				return '\n';
			case 'Char':
				var ch = x.a;
				return $elm$core$String$fromChar(ch._char);
			default:
				var html = x.a;
				return '';
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
var $dkodaj$rte$MiniRte$Core$copy = function (e) {
	var _v0 = e.selection;
	if (_v0.$ === 'Nothing') {
		return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
	} else {
		var _v1 = _v0.a;
		var beg = _v1.a;
		var end = _v1.b;
		var clipboard = A2(
			$elm$core$List$take,
			(end - beg) + 1,
			A2($elm$core$List$drop, beg, e.content));
		return _Utils_Tuple2(
			_Utils_update(
				e,
				{
					clipboard: $elm$core$Maybe$Just(clipboard)
				}),
			A2(
				$elm$core$Task$perform,
				$elm$core$Basics$identity,
				$elm$core$Task$succeed(
					$dkodaj$rte$MiniRte$Types$ToBrowserClipboard(
						$dkodaj$rte$MiniRte$Core$toText(clipboard)))));
	}
};
var $dkodaj$rte$MiniRte$Core$placeCursor2 = F2(
	function (scroll, _v0) {
		var e = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				e,
				{locateBacklog: 0, locating: $dkodaj$rte$MiniRte$Core$Cursor}),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A2($dkodaj$rte$MiniRte$Core$placeCursorCmd, scroll, e.editorID),
						cmd
					])));
	});
var $dkodaj$rte$MiniRte$Core$cut = function (e) {
	var _v0 = $dkodaj$rte$MiniRte$Core$copy(e);
	var copied = _v0.a;
	var copyCmd = _v0.b;
	var _v1 = e.selection;
	if (_v1.$ === 'Nothing') {
		return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
	} else {
		var _v2 = _v1.a;
		var beg = _v2.a;
		var end = _v2.b;
		var content = function () {
			var _v3 = _Utils_ap(
				A2($elm$core$List$take, beg, e.content),
				A2(
					$elm$core$List$drop,
					(end - beg) + 1,
					A2($elm$core$List$drop, beg, e.content)));
			if (!_v3.b) {
				return _List_fromArray(
					[
						$dkodaj$rte$MiniRte$Types$Break(
						$dkodaj$rte$MiniRte$Core$defaultLineBreak(0))
					]);
			} else {
				var xs = _v3;
				return xs;
			}
		}();
		return A2(
			$dkodaj$rte$MiniRte$Core$placeCursor2,
			$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
			_Utils_Tuple2(
				_Utils_update(
					copied,
					{content: content, cursor: beg, selection: $elm$core$Maybe$Nothing}),
				copyCmd));
	}
};
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $dkodaj$rte$MiniRte$Core$setFontStyle = F2(
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
				return $dkodaj$rte$MiniRte$Types$Char(
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
				var _v4 = A2($dkodaj$rte$MiniRte$Core$get, idx, content);
				if (_v4.$ === 'Just') {
					var elem = _v4.a;
					return A3(
						$dkodaj$rte$MiniRte$Core$set,
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
			return A2(
				$dkodaj$rte$MiniRte$Core$placeCursor,
				$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
				j(
					A2(
						i,
						_Utils_Tuple2(beg, end),
						$dkodaj$rte$MiniRte$Core$undoAddNew(e))));
		}
	});
var $dkodaj$rte$MiniRte$Core$fontFamily = F2(
	function (xs, e) {
		var mod = function (x) {
			return _Utils_update(
				x,
				{fontFamily: xs});
		};
		return A2($dkodaj$rte$MiniRte$Core$setFontStyle, mod, e);
	});
var $dkodaj$rte$MiniRte$Core$fontSize = F2(
	function (_float, e) {
		var mod = function (x) {
			return _Utils_update(
				x,
				{
					fontSize: $elm$core$Maybe$Just(_float)
				});
		};
		return A2($dkodaj$rte$MiniRte$Core$setFontStyle, mod, e);
	});
var $dkodaj$rte$MiniRte$Common$inputBoxId = function (rte) {
	return rte.textarea.editorID + 'InputBox';
};
var $dkodaj$rte$MiniRte$Core$changeContent2 = F3(
	function (f, idx, e) {
		var _v0 = A2($dkodaj$rte$MiniRte$Core$get, idx, e.content);
		if (_v0.$ === 'Nothing') {
			return e;
		} else {
			var elem = _v0.a;
			return A3(
				$dkodaj$rte$MiniRte$Core$set2,
				idx,
				f(elem),
				e);
		}
	});
var $dkodaj$rte$MiniRte$Core$currentLinkPos = function (e) {
	var g = F2(
		function (href, idx) {
			g:
			while (true) {
				if (_Utils_eq(
					A2($dkodaj$rte$MiniRte$Core$linkAt, idx + 1, e.content),
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
					A2($dkodaj$rte$MiniRte$Core$linkAt, idx - 1, e.content),
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
	var _v0 = $dkodaj$rte$MiniRte$Core$currentLink(e);
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
var $dkodaj$rte$MiniRte$Core$linkMod = F2(
	function (f, editor) {
		var _v0 = $dkodaj$rte$MiniRte$Core$currentLinkPos(editor);
		if (_v0.$ === 'Nothing') {
			return editor;
		} else {
			var _v1 = _v0.a;
			var beg = _v1.a;
			var end = _v1.b;
			return A3(
				$elm$core$List$foldl,
				$dkodaj$rte$MiniRte$Core$changeContent2(f),
				editor,
				A2($elm$core$List$range, beg, end));
		}
	});
var $dkodaj$rte$MiniRte$Core$link = F2(
	function (href, e) {
		var f = function (elem) {
			if (elem.$ === 'Char') {
				var ch = elem.a;
				return $dkodaj$rte$MiniRte$Types$Char(
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
				return A3($dkodaj$rte$MiniRte$Core$changeContent2, f, idx, x);
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
			return A2($dkodaj$rte$MiniRte$Core$linkMod, f, e);
		} else {
			var _v1 = _v0.a;
			var beg = _v1.a;
			var end = _v1.b;
			return A2(h, beg, end);
		}
	});
var $dkodaj$rte$MiniRte$Core$textToContent = function (txt) {
	var f = function (x) {
		if ('\n' === x.valueOf()) {
			return $dkodaj$rte$MiniRte$Types$Break(
				$dkodaj$rte$MiniRte$Core$defaultLineBreak(0));
		} else {
			return $dkodaj$rte$MiniRte$Types$Char(
				{_char: x, fontStyle: $dkodaj$rte$MiniRte$Core$emptyFontStyle, highlightClasses: _List_Nil, highlightStyling: _List_Nil, id: 0, link: $elm$core$Maybe$Nothing});
		}
	};
	var g = F2(
		function (xs, ys) {
			g:
			while (true) {
				if (!xs.b) {
					return ys;
				} else {
					var x = xs.a;
					var rest = xs.b;
					var $temp$xs = rest,
						$temp$ys = A2(
						$elm$core$List$cons,
						f(x),
						ys);
					xs = $temp$xs;
					ys = $temp$ys;
					continue g;
				}
			}
		});
	var end = _List_fromArray(
		[
			$dkodaj$rte$MiniRte$Types$Break(
			$dkodaj$rte$MiniRte$Core$defaultLineBreak(0))
		]);
	var converted = A2(
		g,
		$elm$core$List$reverse(
			$elm$core$String$toList(txt)),
		_List_Nil);
	return (txt === '') ? end : (_Utils_eq(
		$elm$core$List$head(
			$elm$core$List$reverse(
				$elm$core$String$toList(txt))),
		$elm$core$Maybe$Just(
			_Utils_chr('\n'))) ? converted : _Utils_ap(converted, end));
};
var $dkodaj$rte$MiniRte$Core$loadTextHelp = F2(
	function (txt, shell) {
		var addCounter = function (x) {
			return _Utils_update(
				x,
				{
					idCounter: $elm$core$List$length(x.content)
				});
		};
		return addCounter(
			_Utils_update(
				shell,
				{
					content: $dkodaj$rte$MiniRte$Core$addIds(
						$dkodaj$rte$MiniRte$Core$textToContent(txt)),
					state: $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit
				}));
	});
var $dkodaj$rte$MiniRte$Core$loadText = F2(
	function (txt, editor) {
		var shell = A3($dkodaj$rte$MiniRte$Core$init3, editor.editorID, editor.highlighter, editor.selectionStyle);
		return $dkodaj$rte$MiniRte$Core$undoAddNew(
			A2($dkodaj$rte$MiniRte$Core$loadTextHelp, txt, shell));
	});
var $dkodaj$rte$MiniRte$Common$relevantInDisplayMode = function (msg) {
	switch (msg.$) {
		case 'Active':
			return true;
		case 'Internal':
			return true;
		default:
			return false;
	}
};
var $dkodaj$rte$MiniRte$Core$state = F2(
	function (_new, e) {
		return _Utils_Tuple2(
			_Utils_update(
				e,
				{state: _new}),
			$elm$core$Platform$Cmd$none);
	});
var $dkodaj$rte$MiniRte$Core$textAlign = F2(
	function (alignment, e) {
		var style = function () {
			switch (alignment.$) {
				case 'Center':
					return 'center';
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
		return A2($dkodaj$rte$MiniRte$Core$setPara, f, e);
	});
var $dkodaj$rte$MiniRte$Core$boldStyle = _Utils_Tuple2('font-weight', 'bold');
var $dkodaj$rte$MiniRte$Core$is = F2(
	function (attr, editor) {
		return A2($elm$core$List$member, attr, editor.fontStyle.styling);
	});
var $dkodaj$rte$MiniRte$Core$isAt = F3(
	function (attr, e, idx) {
		var _v0 = A2($dkodaj$rte$MiniRte$Core$get, idx, e.content);
		if ((_v0.$ === 'Just') && (_v0.a.$ === 'Char')) {
			var c = _v0.a.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$member, attr, c.fontStyle.styling));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $dkodaj$rte$MiniRte$Core$isSelection = F2(
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
					A2($dkodaj$rte$MiniRte$Core$isAt, attr, e),
					A2($elm$core$List$range, beg, end)));
		}
	});
var $dkodaj$rte$MiniRte$Core$setFontStyleTag = F3(
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
			return A2($dkodaj$rte$MiniRte$Core$setFontStyle, mod, e);
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
var $dkodaj$rte$MiniRte$Core$toggle = F2(
	function (attr, e) {
		var _v0 = e.selection;
		if (_v0.$ === 'Just') {
			return A3(
				$dkodaj$rte$MiniRte$Core$setFontStyleTag,
				attr,
				!A2($dkodaj$rte$MiniRte$Core$isSelection, attr, e),
				e);
		} else {
			return A3(
				$dkodaj$rte$MiniRte$Core$setFontStyleTag,
				attr,
				!A2($dkodaj$rte$MiniRte$Core$is, attr, e),
				e);
		}
	});
var $dkodaj$rte$MiniRte$Core$toggleBold = function (e) {
	return A2($dkodaj$rte$MiniRte$Core$toggle, $dkodaj$rte$MiniRte$Core$boldStyle, e);
};
var $dkodaj$rte$MiniRte$Core$italicStyle = _Utils_Tuple2('font-style', 'italic');
var $dkodaj$rte$MiniRte$Core$toggleItalic = function (e) {
	return A2($dkodaj$rte$MiniRte$Core$toggle, $dkodaj$rte$MiniRte$Core$italicStyle, e);
};
var $dkodaj$rte$MiniRte$Core$toggleNodeType = F2(
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
		return A2($dkodaj$rte$MiniRte$Core$setPara, f, e);
	});
var $dkodaj$rte$MiniRte$Core$paraClassAdd = F2(
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
var $dkodaj$rte$MiniRte$Core$paraClassRemove = F2(
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
var $dkodaj$rte$MiniRte$Core$toggleParaClass = F2(
	function (className, e) {
		var f = function (x) {
			return A2($elm$core$List$member, className, x.classes) ? A2($dkodaj$rte$MiniRte$Core$paraClassRemove, className, x) : A2($dkodaj$rte$MiniRte$Core$paraClassAdd, className, x);
		};
		return A2($dkodaj$rte$MiniRte$Core$setPara, f, e);
	});
var $dkodaj$rte$MiniRte$Core$strikeThroughStyle = _Utils_Tuple2('text-decoration', 'line-through');
var $dkodaj$rte$MiniRte$Core$underlineStyle = _Utils_Tuple2('text-decoration', 'underline');
var $dkodaj$rte$MiniRte$Core$underline = F2(
	function (bool, editor) {
		return A3($dkodaj$rte$MiniRte$Core$setFontStyleTag, $dkodaj$rte$MiniRte$Core$underlineStyle, bool, editor);
	});
var $dkodaj$rte$MiniRte$Core$toggleStrikeThrough = function (e) {
	var removeUnderline = function (x) {
		return A2($dkodaj$rte$MiniRte$Core$is, $dkodaj$rte$MiniRte$Core$underlineStyle, x) ? A2($dkodaj$rte$MiniRte$Core$underline, false, x).a : x;
	};
	return A2(
		$dkodaj$rte$MiniRte$Core$toggle,
		$dkodaj$rte$MiniRte$Core$strikeThroughStyle,
		removeUnderline(e));
};
var $dkodaj$rte$MiniRte$Core$strikeThrough = F2(
	function (bool, editor) {
		return A3($dkodaj$rte$MiniRte$Core$setFontStyleTag, $dkodaj$rte$MiniRte$Core$strikeThroughStyle, bool, editor);
	});
var $dkodaj$rte$MiniRte$Core$toggleUnderline = function (e) {
	var removeStrikeThrough = function (x) {
		return A2($dkodaj$rte$MiniRte$Core$is, $dkodaj$rte$MiniRte$Core$strikeThroughStyle, x) ? A2($dkodaj$rte$MiniRte$Core$strikeThrough, false, x).a : x;
	};
	return A2(
		$dkodaj$rte$MiniRte$Core$toggle,
		$dkodaj$rte$MiniRte$Core$underlineStyle,
		removeStrikeThrough(e));
};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$UndoAction = {$: 'UndoAction'};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$CompositionUpdate = function (a) {
	return {$: 'CompositionUpdate', a: a};
};
var $dkodaj$rte$MiniRte$Core$Down = {$: 'Down'};
var $dkodaj$rte$MiniRte$Core$DragFrom = function (a) {
	return {$: 'DragFrom', a: a};
};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Input = F2(
	function (a, b) {
		return {$: 'Input', a: a, b: b};
	});
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$InputTimeStamp = function (a) {
	return {$: 'InputTimeStamp', a: a};
};
var $dkodaj$rte$MiniRte$Core$LineBoundary = F2(
	function (a, b) {
		return {$: 'LineBoundary', a: a, b: b};
	});
var $dkodaj$rte$MiniRte$Core$LineJump = F2(
	function (a, b) {
		return {$: 'LineJump', a: a, b: b};
	});
var $dkodaj$rte$MiniRte$Core$Mouse = F3(
	function (a, b, c) {
		return {$: 'Mouse', a: a, b: b, c: c};
	});
var $dkodaj$rte$MiniRte$Core$Page = F3(
	function (a, b, c) {
		return {$: 'Page', a: a, b: b, c: c};
	});
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$PlaceCursor2_EditorElement = F2(
	function (a, b) {
		return {$: 'PlaceCursor2_EditorElement', a: a, b: b};
	});
var $dkodaj$rte$MiniRte$Core$ScreenElement = F4(
	function (idx, x, y, height) {
		return {height: height, idx: idx, x: x, y: y};
	});
var $dkodaj$rte$MiniRte$Core$SelectWord = {$: 'SelectWord'};
var $dkodaj$rte$MiniRte$Core$Up = {$: 'Up'};
var $dkodaj$rte$MiniRte$Core$lineBreakAt = F2(
	function (idx, content) {
		var _v0 = A2($dkodaj$rte$MiniRte$Core$nextBreakFrom, idx, content);
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var lineBreak = _v1.b;
			return $elm$core$Maybe$Just(lineBreak);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $dkodaj$rte$MiniRte$Core$currentParaStyle = F2(
	function (id, editor) {
		var _v0 = A2($dkodaj$rte$MiniRte$Core$lineBreakAt, editor.cursor, editor.content);
		if (_v0.$ === 'Just') {
			var lineBreak = _v0.a;
			return _Utils_update(
				lineBreak,
				{id: id});
		} else {
			return $dkodaj$rte$MiniRte$Core$defaultLineBreak(id);
		}
	});
var $dkodaj$rte$MiniRte$Core$delete = F3(
	function (beg, end, e) {
		var g = function (x) {
			return _Utils_eq(x, _List_Nil) ? _List_fromArray(
				[
					$dkodaj$rte$MiniRte$Types$Break(
					$dkodaj$rte$MiniRte$Core$defaultLineBreak(0))
				]) : x;
		};
		var f = F3(
			function (x, y, z) {
				return _Utils_ap(
					A2($elm$core$List$take, x, z),
					A2($elm$core$List$drop, y, z));
			});
		return g(
			A3(f, beg, end, e.content));
	});
var $dkodaj$rte$MiniRte$Core$detectFontStyle = F2(
	function (idx, e) {
		var _v0 = A2($dkodaj$rte$MiniRte$Core$get, idx - 1, e.content);
		if ((_v0.$ === 'Just') && (_v0.a.$ === 'Char')) {
			var c = _v0.a.a;
			return _Utils_update(
				e,
				{fontStyle: c.fontStyle});
		} else {
			return e;
		}
	});
var $dkodaj$rte$MiniRte$Core$dummyID = function (x) {
	return x + '_dummy_';
};
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
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
var $dkodaj$rte$MiniRte$Core$insertBreak = F3(
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
									$dkodaj$rte$MiniRte$Types$Break(br)
								]),
							A2($elm$core$List$drop, e.cursor, e.content))),
					cursor: e.cursor + 1,
					idCounter: e.idCounter + 1
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
									$dkodaj$rte$MiniRte$Types$Break(br)
								]),
							A2($elm$core$List$drop, end + 1, e.content))),
					cursor: beg + 1,
					idCounter: e.idCounter + 1,
					selection: $elm$core$Maybe$Nothing
				});
		}
	});
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
var $elm_community$intdict$IntDict$get = F2(
	function (key, dict) {
		get:
		while (true) {
			switch (dict.$) {
				case 'Empty':
					return $elm$core$Maybe$Nothing;
				case 'Leaf':
					var l = dict.a;
					return _Utils_eq(l.key, key) ? $elm$core$Maybe$Just(l.value) : $elm$core$Maybe$Nothing;
				default:
					var i = dict.a;
					if (!A2($elm_community$intdict$IntDict$prefixMatches, i.prefix, key)) {
						return $elm$core$Maybe$Nothing;
					} else {
						if (A2($elm_community$intdict$IntDict$isBranchingBitSet, i.prefix, key)) {
							var $temp$key = key,
								$temp$dict = i.right;
							key = $temp$key;
							dict = $temp$dict;
							continue get;
						} else {
							var $temp$key = key,
								$temp$dict = i.left;
							key = $temp$key;
							dict = $temp$dict;
							continue get;
						}
					}
			}
		}
	});
var $dkodaj$rte$MiniRte$Core$nullScreenElement = {height: 0, idx: -1, x: 0, y: 0};
var $dkodaj$rte$MiniRte$Core$onSameLine = F2(
	function (a, b) {
		return _Utils_eq(a.y, b.y) || (((_Utils_cmp(a.y, b.y) < 1) && (_Utils_cmp(a.y + a.height, b.y + b.height) > -1)) || ((_Utils_cmp(b.y, a.y) < 1) && (_Utils_cmp(b.y + b.height, a.y + a.height) > -1)));
	});
var $dkodaj$rte$MiniRte$Core$jumpHelp = F4(
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
		var cursor = A2(
			$elm$core$Maybe$withDefault,
			$dkodaj$rte$MiniRte$Core$nullScreenElement,
			A2($elm_community$intdict$IntDict$get, e.cursor, e.located));
		var better = F2(
			function (a, b) {
				return _Utils_cmp(
					$elm$core$Basics$abs(a.x - cursor.x),
					$elm$core$Basics$abs(b.x - cursor.x)) < 0;
			});
		var f = F3(
			function (_v6, _new, _v7) {
				var candidate = _v7.a;
				var winner = _v7.b;
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
							return (!A2($dkodaj$rte$MiniRte$Core$onSameLine, old, _new)) ? _Utils_Tuple2(
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(old)) : (A2(better, old, _new) ? _Utils_Tuple2(
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(old)) : (last(_new) ? _Utils_Tuple2(
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Just(_new)) : _Utils_Tuple2(
								$elm$core$Maybe$Just(_new),
								$elm$core$Maybe$Nothing)));
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
			if (direction.$ === 'Down') {
				return (_Utils_cmp(end, maxIdx) > -1) ? _Utils_Tuple2($elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing) : _Utils_Tuple2(
					$elm$core$Maybe$Just(
						_Utils_Tuple2(end - 1, $dkodaj$rte$MiniRte$Core$Down)),
					$elm$core$Maybe$Nothing);
			} else {
				return (beg <= 0) ? _Utils_Tuple2($elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing) : _Utils_Tuple2(
					$elm$core$Maybe$Just(
						_Utils_Tuple2(beg + 1, $dkodaj$rte$MiniRte$Core$Up)),
					$elm$core$Maybe$Nothing);
			}
		}
	});
var $dkodaj$rte$MiniRte$Core$idOf = function (elem) {
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
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$LocatedChar = F2(
	function (a, b) {
		return {$: 'LocatedChar', a: a, b: b};
	});
var $dkodaj$rte$MiniRte$Core$locateCmd = F2(
	function (idx, id) {
		return A2(
			$elm$core$Task$attempt,
			A2(
				$elm$core$Basics$composeL,
				$dkodaj$rte$MiniRte$Types$Internal,
				$dkodaj$rte$MiniRte$TypesThatAreNotPublic$LocatedChar(idx)),
			$elm$browser$Browser$Dom$getElement(id));
	});
var $elm$core$Basics$round = _Basics_round;
var $dkodaj$rte$MiniRte$Core$mouseDownGuess = F2(
	function (_v0, e) {
		var mouseX = _v0.a;
		var mouseY = _v0.b;
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var pageSizeGuess = (maxIdx * e.viewport.viewport.height) / e.viewport.scene.height;
		var cursorIdx = e.cursor;
		return cursorIdx + $elm$core$Basics$round((mouseY - e.cursorElement.element.y) / pageSizeGuess);
	});
var $dkodaj$rte$MiniRte$Core$locateChars = F3(
	function (e, maybeLimit, func) {
		if ((!_Utils_eq(e.locating, $dkodaj$rte$MiniRte$Core$Idle)) && _Utils_eq(maybeLimit, $elm$core$Maybe$Nothing)) {
			return _Utils_Tuple2(
				_Utils_update(
					e,
					{
						locateNext: _Utils_ap(
							e.locateNext,
							_List_fromArray(
								[func]))
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			var maxIdx = $elm$core$List$length(e.content) - 1;
			var limit = function () {
				if (maybeLimit.$ === 'Nothing') {
					return e.cursor;
				} else {
					var _v19 = maybeLimit.a;
					var x = _v19.a;
					return x;
				}
			}();
			var cmd = F2(
				function (idx, xs) {
					var _v17 = A2(
						$elm$core$Maybe$map,
						$dkodaj$rte$MiniRte$Core$idOf,
						A2($dkodaj$rte$MiniRte$Core$get, idx, e.content));
					if (_v17.$ === 'Nothing') {
						return xs;
					} else {
						var id = _v17.a;
						return A2(
							$elm$core$List$cons,
							A2(
								$dkodaj$rte$MiniRte$Core$locateCmd,
								idx,
								_Utils_ap(
									e.editorID,
									$elm$core$String$fromInt(id))),
							xs);
					}
				});
			var _v0 = function () {
				var _v1 = func(
					_Utils_Tuple2(0, 0));
				switch (_v1.$) {
					case 'Cursor':
						return _Utils_Tuple2(0, -1);
					case 'Idle':
						return _Utils_Tuple2(0, -1);
					case 'LineBoundary':
						if (_v1.a.$ === 'Down') {
							var _v2 = _v1.a;
							return _Utils_Tuple2(limit, limit + 100);
						} else {
							var _v3 = _v1.a;
							return _Utils_Tuple2(limit - 100, limit);
						}
					case 'LineJump':
						if (_v1.a.$ === 'Down') {
							var _v4 = _v1.a;
							return _Utils_Tuple2(limit, limit + 150);
						} else {
							var _v5 = _v1.a;
							return _Utils_Tuple2(limit - 150, limit);
						}
					case 'Mouse':
						var select = _v1.a;
						var mousePos = _v1.b;
						if (maybeLimit.$ === 'Just') {
							if (maybeLimit.a.b.$ === 'Down') {
								var _v7 = maybeLimit.a;
								var x = _v7.a;
								var _v8 = _v7.b;
								return _Utils_Tuple2(x, x + 500);
							} else {
								var _v9 = maybeLimit.a;
								var x = _v9.a;
								var _v10 = _v9.b;
								return _Utils_Tuple2(x - 500, x);
							}
						} else {
							var guess = A2($dkodaj$rte$MiniRte$Core$mouseDownGuess, mousePos, e);
							return _Utils_Tuple2(guess - 500, guess + 500);
						}
					default:
						var guess = _v1.a;
						if (maybeLimit.$ === 'Nothing') {
							return _Utils_Tuple2(guess - 100, guess + 100);
						} else {
							if (maybeLimit.a.b.$ === 'Up') {
								var _v12 = maybeLimit.a;
								var x = _v12.a;
								var _v13 = _v12.b;
								return _Utils_Tuple2(x - 100, guess);
							} else {
								var _v14 = maybeLimit.a;
								var x = _v14.a;
								var _v15 = _v14.b;
								return _Utils_Tuple2(guess, x + 100);
							}
						}
				}
			}();
			var a = _v0.a;
			var b = _v0.b;
			var _v16 = _Utils_Tuple2(
				A2($elm$core$Basics$max, 0, a),
				A2($elm$core$Basics$min, maxIdx, b));
			var beg = _v16.a;
			var end = _v16.b;
			var range = ((_Utils_cmp(e.cursor, beg) < 0) || (_Utils_cmp(e.cursor, end) > 0)) ? A2(
				$elm$core$List$cons,
				e.cursor,
				A2($elm$core$List$range, beg, end)) : A2($elm$core$List$range, beg, end);
			var cmds = A3($elm$core$List$foldr, cmd, _List_Nil, range);
			return _Utils_Tuple2(
				_Utils_update(
					e,
					{
						locateBacklog: $elm$core$List$length(cmds),
						located: $elm_community$intdict$IntDict$empty,
						locating: (!$elm$core$List$length(cmds)) ? $dkodaj$rte$MiniRte$Core$Idle : func(
							_Utils_Tuple2(beg, end))
					}),
				$elm$core$Platform$Cmd$batch(cmds));
		}
	});
var $dkodaj$rte$MiniRte$Core$selectionMod = F2(
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
var $dkodaj$rte$MiniRte$Core$jump = F3(
	function (direction, _v0, e) {
		var beg = _v0.a;
		var end = _v0.b;
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var isRelevant = F2(
			function (cursor, elem) {
				if (direction.$ === 'Down') {
					return (_Utils_cmp(elem.y, cursor.y) > 0) && (!A2($dkodaj$rte$MiniRte$Core$onSameLine, elem, cursor));
				} else {
					return (_Utils_cmp(elem.y, cursor.y) < 0) && (!A2($dkodaj$rte$MiniRte$Core$onSameLine, elem, cursor));
				}
			});
		var g = F2(
			function (idx, x) {
				return A2(
					$dkodaj$rte$MiniRte$Core$placeCursor,
					$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
					A2(
						$dkodaj$rte$MiniRte$Core$detectFontStyle,
						idx,
						A2(
							$dkodaj$rte$MiniRte$Core$selectionMod,
							e.cursor,
							_Utils_update(
								x,
								{cursor: idx, located: $elm_community$intdict$IntDict$empty, locating: $dkodaj$rte$MiniRte$Core$Idle}))));
			});
		var fail = function (x) {
			return A2(
				$dkodaj$rte$MiniRte$Core$placeCursor,
				$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
				_Utils_update(
					x,
					{located: $elm_community$intdict$IntDict$empty, locating: $dkodaj$rte$MiniRte$Core$Idle}));
		};
		var _v1 = A4(
			$dkodaj$rte$MiniRte$Core$jumpHelp,
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
				return (!beg) ? A2(g, 0, e) : (_Utils_eq(end, maxIdx) ? A2(g, maxIdx, e) : fail(e));
			} else {
				var x = _v1.a.a;
				var _v4 = _v1.b;
				return A3(
					$dkodaj$rte$MiniRte$Core$locateChars,
					e,
					$elm$core$Maybe$Just(x),
					$dkodaj$rte$MiniRte$Core$LineJump(direction));
			}
		}
	});
var $dkodaj$rte$MiniRte$Core$lineBoundary = F4(
	function (maybeIdx, direction, _v0, e) {
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
		var cursorIdx = A2($elm$core$Maybe$withDefault, e.cursor, maybeIdx);
		var cursor = A2(
			$elm$core$Maybe$withDefault,
			$dkodaj$rte$MiniRte$Core$nullScreenElement,
			A2($elm_community$intdict$IntDict$get, cursorIdx, e.located));
		var f = F3(
			function (_v6, a, _v7) {
				var candidate = _v7.a;
				var winner = _v7.b;
				if (winner.$ === 'Just') {
					return _Utils_Tuple2($elm$core$Maybe$Nothing, winner);
				} else {
					return (!A2($dkodaj$rte$MiniRte$Core$onSameLine, a, cursor)) ? _Utils_Tuple2($elm$core$Maybe$Nothing, candidate) : (last(a) ? _Utils_Tuple2(
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
			return A2(
				$dkodaj$rte$MiniRte$Core$placeCursor,
				$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
				A2(
					$dkodaj$rte$MiniRte$Core$detectFontStyle,
					a.idx,
					A2(
						$dkodaj$rte$MiniRte$Core$selectionMod,
						e.cursor,
						_Utils_update(
							e,
							{cursor: a.idx, located: $elm_community$intdict$IntDict$empty, locating: $dkodaj$rte$MiniRte$Core$Idle}))));
		} else {
			if (_v1.a.$ === 'Just') {
				if (direction.$ === 'Down') {
					return A3(
						$dkodaj$rte$MiniRte$Core$locateChars,
						e,
						$elm$core$Maybe$Just(
							_Utils_Tuple2(end - 1, $dkodaj$rte$MiniRte$Core$Down)),
						$dkodaj$rte$MiniRte$Core$LineBoundary($dkodaj$rte$MiniRte$Core$Down));
				} else {
					return A3(
						$dkodaj$rte$MiniRte$Core$locateChars,
						e,
						$elm$core$Maybe$Just(
							_Utils_Tuple2(beg + 1, $dkodaj$rte$MiniRte$Core$Up)),
						$dkodaj$rte$MiniRte$Core$LineBoundary($dkodaj$rte$MiniRte$Core$Up));
				}
			} else {
				var _v3 = _v1.a;
				var _v4 = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						e,
						{located: $elm_community$intdict$IntDict$empty, locating: $dkodaj$rte$MiniRte$Core$Idle}),
					$elm$core$Platform$Cmd$none);
			}
		}
	});
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$PlaceCursor3_CursorElement = F2(
	function (a, b) {
		return {$: 'PlaceCursor3_CursorElement', a: a, b: b};
	});
var $dkodaj$rte$MiniRte$Core$locateCursorParent = F2(
	function (e, scroll) {
		var id = A2(
			$elm$core$Maybe$map,
			$dkodaj$rte$MiniRte$Core$idOf,
			A2($dkodaj$rte$MiniRte$Core$get, e.cursor, e.content));
		if (id.$ === 'Just') {
			var x = id.a;
			return _Utils_Tuple2(
				e,
				A2(
					$elm$core$Task$attempt,
					A2(
						$elm$core$Basics$composeL,
						$dkodaj$rte$MiniRte$Types$Internal,
						$dkodaj$rte$MiniRte$TypesThatAreNotPublic$PlaceCursor3_CursorElement(scroll)),
					$elm$browser$Browser$Dom$getElement(
						_Utils_ap(
							e.editorID,
							$elm$core$String$fromInt(x)))));
		} else {
			return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
		}
	});
var $dkodaj$rte$MiniRte$Core$DragInit = {$: 'DragInit'};
var $dkodaj$rte$MiniRte$Core$locateMoreChars = F4(
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
					$dkodaj$rte$MiniRte$Core$idOf,
					A2($dkodaj$rte$MiniRte$Core$get, idx, e.content));
				if (_v3.$ === 'Nothing') {
					return xs;
				} else {
					var id = _v3.a;
					return A2(
						$elm$core$List$cons,
						A2(
							$dkodaj$rte$MiniRte$Core$locateCmd,
							idx,
							_Utils_ap(
								e.editorID,
								$elm$core$String$fromInt(id))),
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
					{locateBacklog: 0, located: $elm_community$intdict$IntDict$empty, locating: $dkodaj$rte$MiniRte$Core$Idle}),
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
var $dkodaj$rte$MiniRte$Core$next = F3(
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
var $dkodaj$rte$MiniRte$Core$diacritical = function (_char) {
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
var $dkodaj$rte$MiniRte$Core$alphaNumAt = F2(
	function (idx, content) {
		var _v0 = A2($dkodaj$rte$MiniRte$Core$get, idx, content);
		if ((_v0.$ === 'Just') && (_v0.a.$ === 'Char')) {
			var ch = _v0.a.a;
			return $elm$core$Char$isAlphaNum(ch._char) || $dkodaj$rte$MiniRte$Core$diacritical(ch._char);
		} else {
			return false;
		}
	});
var $dkodaj$rte$MiniRte$Core$nonAlphaNumAt = F2(
	function (idx, content) {
		return !A2($dkodaj$rte$MiniRte$Core$alphaNumAt, idx, content);
	});
var $dkodaj$rte$MiniRte$Core$previous = F3(
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
var $dkodaj$rte$MiniRte$Core$previousWordBoundary = function (e) {
	var g = function (x) {
		return A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				function (a) {
					return a + 1;
				},
				A3($dkodaj$rte$MiniRte$Core$previous, $dkodaj$rte$MiniRte$Core$alphaNumAt, x.cursor, x.content)));
	};
	var h = function (x) {
		return _Utils_update(
			x,
			{
				cursor: g(x)
			});
	};
	var f = function (x) {
		return A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				function (a) {
					return a + 1;
				},
				A3($dkodaj$rte$MiniRte$Core$previous, $dkodaj$rte$MiniRte$Core$nonAlphaNumAt, x.cursor, x.content)));
	};
	return A2($dkodaj$rte$MiniRte$Core$alphaNumAt, e.cursor - 1, e.content) ? f(e) : f(
		h(e));
};
var $dkodaj$rte$MiniRte$Core$currentWord = function (e) {
	var beg = $dkodaj$rte$MiniRte$Core$previousWordBoundary(e);
	var _v0 = A3($dkodaj$rte$MiniRte$Core$next, $dkodaj$rte$MiniRte$Core$nonAlphaNumAt, e.cursor, e.content);
	if (_v0.$ === 'Just') {
		var x = _v0.a;
		return _Utils_Tuple2(beg, x - 1);
	} else {
		return _Utils_Tuple2(
			beg,
			$elm$core$List$length(e.content) - 1);
	}
};
var $dkodaj$rte$MiniRte$Core$selectCurrentWord = function (editor) {
	var _v0 = $dkodaj$rte$MiniRte$Core$currentWord(editor);
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
var $dkodaj$rte$MiniRte$Core$locateMouse = F4(
	function (s, _v0, _v1, e) {
		var mouseX = _v0.a;
		var mouseY = _v0.b;
		var beg = _v1.a;
		var end = _v1.b;
		var start = {previous: $elm$core$Maybe$Nothing, winner: $elm$core$Maybe$Nothing};
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var g = F4(
			function (a, _v15, b, x) {
				if (x.$ === 'Just') {
					return x;
				} else {
					return (_Utils_cmp(b.idx, a.idx) > 0) ? $elm$core$Maybe$Nothing : ((!A2($dkodaj$rte$MiniRte$Core$onSameLine, a, b)) ? $elm$core$Maybe$Just(b.idx + 1) : ((!b.idx) ? $elm$core$Maybe$Just(0) : $elm$core$Maybe$Nothing));
				}
			});
		var getBounds = function (a) {
			var _v13 = A3(
				$elm_community$intdict$IntDict$foldr,
				g(a),
				$elm$core$Maybe$Nothing,
				e.located);
			if (_v13.$ === 'Just') {
				var begIdx = _v13.a;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(begIdx, a.idx));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var fail = function (x) {
			return _Utils_Tuple2(
				_Utils_update(
					x,
					{locateBacklog: 0, located: $elm_community$intdict$IntDict$empty, locating: $dkodaj$rte$MiniRte$Core$Idle}),
				$elm$core$Platform$Cmd$none);
		};
		var diff = function (a) {
			return a.y - mouseY;
		};
		var flips = F2(
			function (a, b) {
				return (diff(a) > 0) && (diff(b) <= 0);
			});
		var f = F3(
			function (_v12, _new, m) {
				var _v10 = m.winner;
				if (_v10.$ === 'Just') {
					return m;
				} else {
					if (_Utils_eq(_new.idx, maxIdx) && (diff(_new) <= 0)) {
						return _Utils_update(
							m,
							{
								winner: $elm$core$Maybe$Just(_new)
							});
					} else {
						var _v11 = m.previous;
						if (_v11.$ === 'Nothing') {
							return _Utils_update(
								m,
								{
									previous: $elm$core$Maybe$Just(_new)
								});
						} else {
							var old = _v11.a;
							return A2(flips, _new, old) ? _Utils_update(
								m,
								{
									winner: $elm$core$Maybe$Just(old)
								}) : _Utils_update(
								m,
								{
									previous: $elm$core$Maybe$Just(_new)
								});
						}
					}
				}
			});
		var mouseLocator = A3($elm_community$intdict$IntDict$foldl, f, start, e.located);
		var targetLine = function () {
			var _v9 = mouseLocator.winner;
			if (_v9.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var pos = _v9.a;
				return getBounds(pos);
			}
		}();
		var _continue = function (x) {
			if ((beg <= 0) && (_Utils_cmp(end, maxIdx) > -1)) {
				return fail(x);
			} else {
				var _v8 = A2($elm_community$intdict$IntDict$get, beg, e.located);
				if (_v8.$ === 'Nothing') {
					return fail(x);
				} else {
					var begElem = _v8.a;
					var jumpSize = 500;
					return A4(
						$dkodaj$rte$MiniRte$Core$locateMoreChars,
						x,
						_Utils_Tuple2(beg - jumpSize, end + jumpSize),
						A2(
							$dkodaj$rte$MiniRte$Core$Mouse,
							s,
							_Utils_Tuple2(mouseX, mouseY)),
						_List_fromArray(
							[
								_Utils_Tuple2(beg - jumpSize, beg - 1),
								_Utils_Tuple2(end + 1, end + jumpSize)
							]));
				}
			}
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
						$dkodaj$rte$MiniRte$Core$selectCurrentWord(a),
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
					A2(
						$dkodaj$rte$MiniRte$Core$placeCursor,
						$dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoScroll,
						A2(
							$dkodaj$rte$MiniRte$Core$detectFontStyle,
							closest.idx,
							_Utils_update(
								e,
								{
									cursor: closest.idx,
									drag: _Utils_eq(e.drag, $dkodaj$rte$MiniRte$Core$DragInit) ? $dkodaj$rte$MiniRte$Core$DragFrom(closest.idx) : e.drag,
									located: $elm_community$intdict$IntDict$empty,
									locating: $dkodaj$rte$MiniRte$Core$Idle
								}))));
			} else {
				return _continue(e);
			}
		}
	});
var $dkodaj$rte$MiniRte$Core$locateNext = function (e) {
	var _v0 = e.locateNext;
	if (_v0.b) {
		var func = _v0.a;
		var rest = _v0.b;
		return A3(
			$dkodaj$rte$MiniRte$Core$locateChars,
			_Utils_update(
				e,
				{locateNext: rest}),
			$elm$core$Maybe$Nothing,
			func);
	} else {
		return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
	}
};
var $dkodaj$rte$MiniRte$Core$SelectNone = {$: 'SelectNone'};
var $dkodaj$rte$MiniRte$Core$mouseDown = F3(
	function (_v0, timeStamp, e) {
		var mouseX = _v0.a;
		var mouseY = _v0.b;
		var f = F2(
			function (x, y) {
				return _Utils_update(
					x,
					{drag: y, lastMouseDown: timeStamp});
			});
		return A3(
			$dkodaj$rte$MiniRte$Core$locateChars,
			A2(
				f,
				_Utils_update(
					e,
					{selection: $elm$core$Maybe$Nothing}),
				$dkodaj$rte$MiniRte$Core$DragInit),
			$elm$core$Maybe$Nothing,
			A2(
				$dkodaj$rte$MiniRte$Core$Mouse,
				$dkodaj$rte$MiniRte$Core$SelectNone,
				_Utils_Tuple2(mouseX, mouseY)));
	});
var $dkodaj$rte$MiniRte$Core$nextWordBoundary = function (e) {
	var f = function (x) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$core$List$length(e.content) - 1,
			A3($dkodaj$rte$MiniRte$Core$next, $dkodaj$rte$MiniRte$Core$nonAlphaNumAt, x.cursor, x.content));
	};
	var g = function (x) {
		return _Utils_update(
			x,
			{
				cursor: f(x)
			});
	};
	return A2($dkodaj$rte$MiniRte$Core$alphaNumAt, e.cursor, e.content) ? f(e) : f(
		g(e));
};
var $dkodaj$rte$MiniRte$Core$IsImageDataLink = {$: 'IsImageDataLink'};
var $dkodaj$rte$MiniRte$Core$IsImageLink = function (a) {
	return {$: 'IsImageLink', a: a};
};
var $dkodaj$rte$MiniRte$Core$IsLinkButNotImage = function (a) {
	return {$: 'IsLinkButNotImage', a: a};
};
var $dkodaj$rte$MiniRte$Core$NotLink = {$: 'NotLink'};
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (result.$ === 'Ok') {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $elm$core$String$endsWith = _String_endsWith;
var $dkodaj$rte$MiniRte$Core$isLink = function (str) {
	var strip = F2(
		function (x, y) {
			return A2($elm$core$String$startsWith, x, y) ? $elm$core$Result$Err(
				A2(
					$elm$core$String$dropLeft,
					$elm$core$String$length(x),
					y)) : $elm$core$Result$Ok(y);
		});
	var stripped = A2(
		$elm$core$Result$andThen,
		strip('https://'),
		A2(strip, 'http://', str));
	var imageExtensions = _List_fromArray(
		['.jpeg', '.jpg', '.gif', '.png', '.apng', '.svg', '.bmp', '.ico']);
	var isImage = function (x) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (a, b) {
					return b || A2($elm$core$String$endsWith, a, x);
				}),
			false,
			imageExtensions);
	};
	if (stripped.$ === 'Ok') {
		return A2($elm$core$String$startsWith, 'data:image/', str) ? $dkodaj$rte$MiniRte$Core$IsImageDataLink : $dkodaj$rte$MiniRte$Core$NotLink;
	} else {
		var x = stripped.a;
		return isImage(x) ? $dkodaj$rte$MiniRte$Core$IsImageLink(x) : $dkodaj$rte$MiniRte$Core$IsLinkButNotImage(x);
	}
};
var $dkodaj$rte$MiniRte$Core$pasted = F4(
	function (txt, e, maybeTimeStamp, modifyClipboard) {
		var linked = function (strippedPrefix) {
			return A5(
				$dkodaj$rte$MiniRte$Core$typed_,
				$elm$core$Maybe$Just(txt),
				strippedPrefix,
				e,
				maybeTimeStamp,
				modifyClipboard);
		};
		var _default = A4($dkodaj$rte$MiniRte$Core$typed, txt, e, maybeTimeStamp, modifyClipboard);
		var _v0 = $dkodaj$rte$MiniRte$Core$isLink(txt);
		switch (_v0.$) {
			case 'NotLink':
				return _default;
			case 'IsImageDataLink':
				return e.pasteImageLinksAsImages ? A2($dkodaj$rte$MiniRte$Core$addImage, txt, e) : _default;
			case 'IsImageLink':
				var strippedPrefix = _v0.a;
				return e.pasteImageLinksAsImages ? A2($dkodaj$rte$MiniRte$Core$addImage, txt, e) : (e.pasteLinksAsLinks ? linked(strippedPrefix) : _default);
			default:
				var strippedPrefix = _v0.a;
				return e.pasteLinksAsLinks ? linked(strippedPrefix) : _default;
		}
	});
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Scrolled = {$: 'Scrolled'};
var $elm$browser$Browser$Dom$setViewportOf = _Browser_setViewportOf;
var $dkodaj$rte$MiniRte$Core$scrollIfNeeded = F5(
	function (cursorData, editorData, viewportData, cursorIdx, editorID) {
		var viewport = viewportData.viewport;
		var scrollTo = function (y) {
			return A2(
				$elm$core$Task$attempt,
				function (_v0) {
					return $dkodaj$rte$MiniRte$Types$Internal($dkodaj$rte$MiniRte$TypesThatAreNotPublic$Scrolled);
				},
				A3($elm$browser$Browser$Dom$setViewportOf, editorID, 0, y));
		};
		var editor = editorData.element;
		var cursor = cursorData.element;
		return (_Utils_cmp(cursor.y + cursor.height, editor.y + editor.height) > 0) ? $elm$core$Maybe$Just(
			scrollTo((((viewport.y + cursor.y) + cursor.height) - editor.y) - editor.height)) : ((_Utils_cmp(cursor.y, editor.y) < 0) ? $elm$core$Maybe$Just(
			scrollTo((viewport.y + cursor.y) - editor.y)) : $elm$core$Maybe$Nothing);
	});
var $elm$core$Process$sleep = _Process_sleep;
var $dkodaj$rte$MiniRte$Core$tickPeriod = 500;
var $dkodaj$rte$MiniRte$Core$restore = F2(
	function (x, editor) {
		return _Utils_update(
			editor,
			{content: x.content, cursor: x.cursor, fontStyle: x.fontStyle, selection: x.selection});
	});
var $dkodaj$rte$MiniRte$Core$undoAction = function (e) {
	var _v0 = e.undo;
	if (!_v0.b) {
		return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
	} else {
		if (!_v0.b.b) {
			var x = _v0.a;
			return A2(
				$dkodaj$rte$MiniRte$Core$placeCursor,
				$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
				A2(
					$dkodaj$rte$MiniRte$Core$restore,
					x,
					_Utils_update(
						e,
						{
							undo: _List_fromArray(
								[x])
						})));
		} else {
			var x = _v0.a;
			var rest = _v0.b;
			return A2(
				$dkodaj$rte$MiniRte$Core$placeCursor,
				$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
				A2(
					$dkodaj$rte$MiniRte$Core$restore,
					x,
					_Utils_update(
						e,
						{undo: rest})));
		}
	}
};
var $dkodaj$rte$MiniRte$Core$undoRefreshHead = function (e) {
	var current = $dkodaj$rte$MiniRte$Core$snapshot(e);
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
var $dkodaj$rte$MiniRte$Core$updateUndo = F2(
	function (msg, e) {
		updateUndo:
		while (true) {
			var maxIdx = $elm$core$List$length(e.content) - 1;
			switch (msg.$) {
				case 'Input':
					var timeStamp = msg.a;
					var str = msg.b;
					var like = function (x) {
						return A2(
							$dkodaj$rte$MiniRte$Core$updateUndo,
							A2($dkodaj$rte$MiniRte$TypesThatAreNotPublic$Input, timeStamp, x),
							e);
					};
					var contentMod = ((timeStamp - e.lastKeyDown) < 400) ? $dkodaj$rte$MiniRte$Core$undoRefreshHead(e) : $dkodaj$rte$MiniRte$Core$undoAddNew(e);
					return (($elm$core$String$length(str) !== 1) || e.ctrlDown) ? e : contentMod;
				case 'KeyDown':
					var str = msg.a;
					switch (str) {
						case 'Backspace':
							var _v2 = e.selection;
							if (_v2.$ === 'Nothing') {
								return (e.cursor > 0) ? $dkodaj$rte$MiniRte$Core$undoAddNew(e) : e;
							} else {
								return $dkodaj$rte$MiniRte$Core$undoAddNew(e);
							}
						case 'Delete':
							var _v3 = e.selection;
							if (_v3.$ === 'Nothing') {
								return (_Utils_cmp(e.cursor, maxIdx) < 0) ? $dkodaj$rte$MiniRte$Core$undoAddNew(e) : e;
							} else {
								return $dkodaj$rte$MiniRte$Core$undoAddNew(e);
							}
						case 'Enter':
							return $dkodaj$rte$MiniRte$Core$undoAddNew(e);
						default:
							if (!e.ctrlDown) {
								return e;
							} else {
								switch (str) {
									case '0':
										return $dkodaj$rte$MiniRte$Core$undoAddNew(e);
									case '1':
										return $dkodaj$rte$MiniRte$Core$undoAddNew(e);
									case 'x':
										return (!_Utils_eq(e.selection, $elm$core$Maybe$Nothing)) ? $dkodaj$rte$MiniRte$Core$undoAddNew(e) : e;
									case 'X':
										var $temp$msg = $dkodaj$rte$MiniRte$TypesThatAreNotPublic$KeyDown('x'),
											$temp$e = e;
										msg = $temp$msg;
										e = $temp$e;
										continue updateUndo;
									case 'v':
										return (!_Utils_eq(e.clipboard, $elm$core$Maybe$Nothing)) ? $dkodaj$rte$MiniRte$Core$undoAddNew(e) : e;
									case 'V':
										var $temp$msg = $dkodaj$rte$MiniRte$TypesThatAreNotPublic$KeyDown('v'),
											$temp$e = e;
										msg = $temp$msg;
										e = $temp$e;
										continue updateUndo;
									default:
										return e;
								}
							}
					}
				default:
					return e;
			}
		}
	});
var $dkodaj$rte$MiniRte$Core$keyDown = F2(
	function (str, e) {
		var maxIdx = $elm$core$List$length(e.content) - 1;
		switch (str) {
			case 'ArrowDown':
				return (_Utils_cmp(e.cursor, maxIdx) > -1) ? _Utils_Tuple2(e, $elm$core$Platform$Cmd$none) : A3(
					$dkodaj$rte$MiniRte$Core$locateChars,
					e,
					$elm$core$Maybe$Nothing,
					$dkodaj$rte$MiniRte$Core$LineJump($dkodaj$rte$MiniRte$Core$Down));
			case 'ArrowLeft':
				if (e.cursor < 1) {
					return (!e.shiftDown) ? _Utils_Tuple2(
						_Utils_update(
							e,
							{cursor: 0, selection: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none) : _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				} else {
					if (e.ctrlDown) {
						var newCursor = $dkodaj$rte$MiniRte$Core$previousWordBoundary(e);
						return A2(
							$dkodaj$rte$MiniRte$Core$placeCursor,
							$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
							A2(
								$dkodaj$rte$MiniRte$Core$detectFontStyle,
								newCursor,
								A2(
									$dkodaj$rte$MiniRte$Core$selectionMod,
									e.cursor,
									_Utils_update(
										e,
										{cursor: newCursor}))));
					} else {
						var f = function (x) {
							return A2($elm$core$Basics$max, 0, x);
						};
						var newCursor = function () {
							if (e.shiftDown) {
								return f(e.cursor - 1);
							} else {
								var _v21 = e.selection;
								if (_v21.$ === 'Nothing') {
									return f(e.cursor - 1);
								} else {
									var _v22 = _v21.a;
									var beg = _v22.a;
									return beg;
								}
							}
						}();
						return A2(
							$dkodaj$rte$MiniRte$Core$placeCursor,
							$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
							A2(
								$dkodaj$rte$MiniRte$Core$detectFontStyle,
								newCursor,
								A2(
									$dkodaj$rte$MiniRte$Core$selectionMod,
									e.cursor,
									_Utils_update(
										e,
										{cursor: newCursor}))));
					}
				}
			case 'ArrowRight':
				if (_Utils_cmp(e.cursor, maxIdx) > -1) {
					return _Utils_Tuple2(
						_Utils_update(
							e,
							{cursor: maxIdx, selection: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none);
				} else {
					if ((!e.shiftDown) && _Utils_eq(
						e.selection,
						$elm$core$Maybe$Just(
							_Utils_Tuple2(0, maxIdx)))) {
						return A2(
							$dkodaj$rte$MiniRte$Core$placeCursor,
							$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
							A2(
								$dkodaj$rte$MiniRte$Core$detectFontStyle,
								maxIdx,
								_Utils_update(
									e,
									{cursor: maxIdx, selection: $elm$core$Maybe$Nothing})));
					} else {
						if (e.ctrlDown) {
							var newCursor = $dkodaj$rte$MiniRte$Core$nextWordBoundary(e);
							return A2(
								$dkodaj$rte$MiniRte$Core$placeCursor,
								$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
								A2(
									$dkodaj$rte$MiniRte$Core$detectFontStyle,
									newCursor,
									A2(
										$dkodaj$rte$MiniRte$Core$selectionMod,
										e.cursor,
										_Utils_update(
											e,
											{cursor: newCursor}))));
						} else {
							var f = function (x) {
								return A2($elm$core$Basics$min, x, maxIdx);
							};
							var newCursor = function () {
								if (e.shiftDown) {
									return f(e.cursor + 1);
								} else {
									var _v23 = e.selection;
									if (_v23.$ === 'Nothing') {
										return f(e.cursor + 1);
									} else {
										var _v24 = _v23.a;
										var end = _v24.b;
										return f(end + 1);
									}
								}
							}();
							return A2(
								$dkodaj$rte$MiniRte$Core$placeCursor,
								$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
								A2(
									$dkodaj$rte$MiniRte$Core$detectFontStyle,
									newCursor,
									A2(
										$dkodaj$rte$MiniRte$Core$selectionMod,
										e.cursor,
										_Utils_update(
											e,
											{cursor: newCursor}))));
						}
					}
				}
			case 'ArrowUp':
				return (!e.cursor) ? _Utils_Tuple2(e, $elm$core$Platform$Cmd$none) : A3(
					$dkodaj$rte$MiniRte$Core$locateChars,
					e,
					$elm$core$Maybe$Nothing,
					$dkodaj$rte$MiniRte$Core$LineJump($dkodaj$rte$MiniRte$Core$Up));
			case 'Backspace':
				var _v25 = e.selection;
				if (_v25.$ === 'Nothing') {
					return (e.cursor > 0) ? A2(
						$dkodaj$rte$MiniRte$Core$placeCursor,
						$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
						A2(
							$dkodaj$rte$MiniRte$Core$detectFontStyle,
							e.cursor - 1,
							_Utils_update(
								e,
								{
									content: _Utils_ap(
										A2($elm$core$List$take, e.cursor - 1, e.content),
										A2($elm$core$List$drop, e.cursor, e.content)),
									cursor: e.cursor - 1
								}))) : _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				} else {
					var _v26 = _v25.a;
					var beg = _v26.a;
					var end = _v26.b;
					return A2(
						$dkodaj$rte$MiniRte$Core$placeCursor,
						$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
						A2(
							$dkodaj$rte$MiniRte$Core$detectFontStyle,
							beg,
							_Utils_update(
								e,
								{
									content: _Utils_ap(
										A2($elm$core$List$take, beg, e.content),
										A2($elm$core$List$drop, end + 1, e.content)),
									cursor: beg,
									selection: $elm$core$Maybe$Nothing
								})));
				}
			case 'Control':
				return _Utils_Tuple2(
					_Utils_update(
						e,
						{ctrlDown: true}),
					$elm$core$Platform$Cmd$none);
			case 'Delete':
				var _v27 = e.selection;
				if (_v27.$ === 'Nothing') {
					return (_Utils_cmp(e.cursor, maxIdx) < 0) ? A2(
						$dkodaj$rte$MiniRte$Core$placeCursor,
						$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
						_Utils_update(
							e,
							{
								content: A3($dkodaj$rte$MiniRte$Core$delete, e.cursor, e.cursor + 1, e)
							})) : _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				} else {
					var _v28 = _v27.a;
					var beg = _v28.a;
					var end = _v28.b;
					return A2(
						$dkodaj$rte$MiniRte$Core$placeCursor,
						$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
						A2(
							$dkodaj$rte$MiniRte$Core$detectFontStyle,
							beg,
							_Utils_update(
								e,
								{
									content: A3($dkodaj$rte$MiniRte$Core$delete, beg, end + 1, e),
									cursor: beg,
									selection: $elm$core$Maybe$Nothing
								})));
				}
			case 'End':
				return e.ctrlDown ? A2(
					$dkodaj$rte$MiniRte$Core$placeCursor,
					$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
					A2(
						$dkodaj$rte$MiniRte$Core$detectFontStyle,
						maxIdx,
						A2(
							$dkodaj$rte$MiniRte$Core$selectionMod,
							e.cursor,
							_Utils_update(
								e,
								{cursor: maxIdx})))) : (e.shiftDown ? A3(
					$dkodaj$rte$MiniRte$Core$locateChars,
					e,
					$elm$core$Maybe$Nothing,
					$dkodaj$rte$MiniRte$Core$LineBoundary($dkodaj$rte$MiniRte$Core$Down)) : A3(
					$dkodaj$rte$MiniRte$Core$locateChars,
					_Utils_update(
						e,
						{selection: $elm$core$Maybe$Nothing}),
					$elm$core$Maybe$Nothing,
					$dkodaj$rte$MiniRte$Core$LineBoundary($dkodaj$rte$MiniRte$Core$Down)));
			case 'Enter':
				return e.shiftDown ? A2(
					$dkodaj$rte$MiniRte$Core$update,
					$dkodaj$rte$MiniRte$TypesThatAreNotPublic$KeyDown('\n'),
					e) : A2(
					$dkodaj$rte$MiniRte$Core$placeCursor,
					$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
					A3(
						$dkodaj$rte$MiniRte$Core$insertBreak,
						A2($dkodaj$rte$MiniRte$Core$currentParaStyle, e.idCounter, e),
						$elm$core$Maybe$Nothing,
						e));
			case 'Home':
				return e.ctrlDown ? A2(
					$dkodaj$rte$MiniRte$Core$placeCursor,
					$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
					A2(
						$dkodaj$rte$MiniRte$Core$detectFontStyle,
						0,
						A2(
							$dkodaj$rte$MiniRte$Core$selectionMod,
							e.cursor,
							_Utils_update(
								e,
								{cursor: 0})))) : (e.shiftDown ? A3(
					$dkodaj$rte$MiniRte$Core$locateChars,
					e,
					$elm$core$Maybe$Nothing,
					$dkodaj$rte$MiniRte$Core$LineBoundary($dkodaj$rte$MiniRte$Core$Up)) : A3(
					$dkodaj$rte$MiniRte$Core$locateChars,
					_Utils_update(
						e,
						{selection: $elm$core$Maybe$Nothing}),
					$elm$core$Maybe$Nothing,
					$dkodaj$rte$MiniRte$Core$LineBoundary($dkodaj$rte$MiniRte$Core$Up)));
			case 'PageDown':
				if (_Utils_eq(e.cursor, maxIdx)) {
					return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				} else {
					var pageSize = $elm$core$Basics$round((maxIdx * e.viewport.viewport.height) / e.viewport.scene.height);
					return A3(
						$dkodaj$rte$MiniRte$Core$locateChars,
						e,
						$elm$core$Maybe$Nothing,
						A2(
							$dkodaj$rte$MiniRte$Core$Page,
							A2($elm$core$Basics$min, maxIdx, e.cursor + pageSize),
							$dkodaj$rte$MiniRte$Core$Down));
				}
			case 'PageUp':
				if (!e.cursor) {
					return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				} else {
					var pageSize = $elm$core$Basics$round((maxIdx * e.viewport.viewport.height) / e.viewport.scene.height);
					return A3(
						$dkodaj$rte$MiniRte$Core$locateChars,
						e,
						$elm$core$Maybe$Nothing,
						A2(
							$dkodaj$rte$MiniRte$Core$Page,
							A2($elm$core$Basics$max, 0, e.cursor - pageSize),
							$dkodaj$rte$MiniRte$Core$Up));
				}
			case 'Shift':
				return _Utils_Tuple2(
					_Utils_update(
						e,
						{shiftDown: true}),
					$elm$core$Platform$Cmd$none);
			default:
				if (!e.ctrlDown) {
					return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				} else {
					var like = function (x) {
						return A2($dkodaj$rte$MiniRte$Core$keyDown, x, e);
					};
					switch (str) {
						case '0':
							return A4($dkodaj$rte$MiniRte$Core$typed, '–', e, $elm$core$Maybe$Nothing, false);
						case '1':
							return A4($dkodaj$rte$MiniRte$Core$typed, '—', e, $elm$core$Maybe$Nothing, false);
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
							return $dkodaj$rte$MiniRte$Core$copy(e);
						case 'C':
							return like('c');
						case 'x':
							return $dkodaj$rte$MiniRte$Core$cut(e);
						case 'X':
							return like('x');
						case 'z':
							return _Utils_Tuple2(
								e,
								A2(
									$elm$core$Task$perform,
									$elm$core$Basics$identity,
									$elm$core$Task$succeed(
										$dkodaj$rte$MiniRte$Types$Internal($dkodaj$rte$MiniRte$TypesThatAreNotPublic$UndoAction))));
						case 'Z':
							return like('z');
						default:
							return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
					}
				}
		}
	});
var $dkodaj$rte$MiniRte$Core$onInput = F3(
	function (timeStamp, str, e) {
		var timeStampCmd = A2(
			$elm$core$Task$perform,
			function (_v19) {
				return $dkodaj$rte$MiniRte$Types$Internal(
					$dkodaj$rte$MiniRte$TypesThatAreNotPublic$InputTimeStamp(timeStamp));
			},
			$elm$core$Process$sleep($dkodaj$rte$MiniRte$Core$tickPeriod));
		var f = function (_v18) {
			var x = _v18.a;
			var y = _v18.b;
			return _Utils_Tuple2(
				_Utils_update(
					x,
					{lastKeyDown: timeStamp, typing: true}),
				$elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[timeStampCmd, y])));
		};
		return f(
			A3($dkodaj$rte$MiniRte$Core$onInputHelp, timeStamp, str, e));
	});
var $dkodaj$rte$MiniRte$Core$onInputHelp = F3(
	function (timeStamp, str, e) {
		var maxIdx = $elm$core$List$length(e.content) - 1;
		var like = function (x) {
			return A2(
				$dkodaj$rte$MiniRte$Core$update,
				A2($dkodaj$rte$MiniRte$TypesThatAreNotPublic$Input, timeStamp, x),
				e);
		};
		return ($elm$core$String$length(str) !== 1) ? _Utils_Tuple2(e, $elm$core$Platform$Cmd$none) : ((!e.ctrlDown) ? A4(
			$dkodaj$rte$MiniRte$Core$typed,
			str,
			e,
			$elm$core$Maybe$Just(timeStamp),
			false) : _Utils_Tuple2(e, $elm$core$Platform$Cmd$none));
	});
var $dkodaj$rte$MiniRte$Core$update = F2(
	function (msg, e0) {
		var e = A2($dkodaj$rte$MiniRte$Core$updateUndo, msg, e0);
		var maxIdx = $elm$core$List$length(e.content) - 1;
		switch (msg.$) {
			case 'CompositionEnd':
				var txt = msg.a;
				if (txt === '') {
					return A2($dkodaj$rte$MiniRte$Core$addContent, e.compositionStart, e);
				} else {
					var newLength = $elm$core$List$length(
						$elm$core$String$toList(txt));
					var _v1 = A2(
						$dkodaj$rte$MiniRte$Core$update,
						$dkodaj$rte$MiniRte$TypesThatAreNotPublic$CompositionUpdate(txt),
						e);
					var _new = _v1.a;
					var newMsg = _v1.b;
					return _Utils_Tuple2(
						_Utils_update(
							_new,
							{cursor: _new.cursor + newLength}),
						newMsg);
				}
			case 'CompositionStart':
				var _v2 = e.selection;
				if (_v2.$ === 'Nothing') {
					return _Utils_Tuple2(
						_Utils_update(
							e,
							{compositionStart: _List_Nil, compositionUpdate: ''}),
						$elm$core$Platform$Cmd$none);
				} else {
					var _v3 = _v2.a;
					var beg = _v3.a;
					var end = _v3.b;
					return A2(
						$dkodaj$rte$MiniRte$Core$placeCursor,
						$dkodaj$rte$MiniRte$TypesThatAreNotPublic$ScrollIfNeeded,
						_Utils_update(
							e,
							{
								compositionStart: A2(
									$elm$core$List$take,
									(end - beg) + 1,
									A2($elm$core$List$drop, beg, e.content)),
								compositionUpdate: '',
								content: A3($dkodaj$rte$MiniRte$Core$delete, beg, end + 1, e),
								cursor: beg,
								selection: $elm$core$Maybe$Nothing
							}));
				}
			case 'CompositionUpdate':
				var txt = msg.a;
				var oldEnd = e.cursor + $elm$core$List$length(
					$elm$core$String$toList(e.compositionUpdate));
				var newLength = $elm$core$List$length(
					$elm$core$String$toList(txt));
				var _v4 = A4(
					$dkodaj$rte$MiniRte$Core$typed,
					txt,
					_Utils_update(
						e,
						{
							content: A3($dkodaj$rte$MiniRte$Core$delete, e.cursor, oldEnd, e)
						}),
					$elm$core$Maybe$Nothing,
					false);
				var _new = _v4.a;
				var newMsg = _v4.b;
				return _Utils_Tuple2(
					_Utils_update(
						_new,
						{compositionUpdate: txt, cursor: e.cursor}),
					newMsg);
			case 'FocusOnEditor':
				return _Utils_Tuple2(
					e,
					A2(
						$elm$core$Task$attempt,
						function (_v5) {
							return $dkodaj$rte$MiniRte$Types$Internal($dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoOp);
						},
						$elm$browser$Browser$Dom$focus(
							$dkodaj$rte$MiniRte$Core$dummyID(e.editorID))));
			case 'Input':
				var timeStamp = msg.a;
				var key = msg.b;
				return A3($dkodaj$rte$MiniRte$Core$onInput, timeStamp, key, e);
			case 'InputTimeStamp':
				var _float = msg.a;
				return _Utils_eq(e.lastKeyDown, _float) ? _Utils_Tuple2(
					_Utils_update(
						e,
						{typing: false}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
			case 'KeyDown':
				var key = msg.a;
				return A2($dkodaj$rte$MiniRte$Core$keyDown, key, e);
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
						A4($dkodaj$rte$MiniRte$Core$ScreenElement, idx, elem.x, elem.y, elem.height),
						e.located);
					var f = function (x) {
						return _Utils_update(
							x,
							{locateBacklog: locateBacklog, located: located});
					};
					if (locateBacklog > 0) {
						return _Utils_Tuple2(
							f(e),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v7 = e.locating;
						switch (_v7.$) {
							case 'Cursor':
								return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
							case 'Idle':
								return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
							case 'LineBoundary':
								var a = _v7.a;
								var b = _v7.b;
								return A4(
									$dkodaj$rte$MiniRte$Core$lineBoundary,
									$elm$core$Maybe$Nothing,
									a,
									b,
									f(e));
							case 'LineJump':
								var a = _v7.a;
								var b = _v7.b;
								return A3(
									$dkodaj$rte$MiniRte$Core$jump,
									a,
									b,
									f(e));
							case 'Mouse':
								var a = _v7.a;
								var b = _v7.b;
								var c = _v7.c;
								return A4(
									$dkodaj$rte$MiniRte$Core$locateMouse,
									a,
									b,
									c,
									f(e));
							default:
								var a = _v7.a;
								var c = _v7.c;
								return A4(
									$dkodaj$rte$MiniRte$Core$lineBoundary,
									$elm$core$Maybe$Just(a),
									$dkodaj$rte$MiniRte$Core$Up,
									c,
									f(e));
						}
					}
				} else {
					var err = msg.b.a;
					return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				}
			case 'MouseDown':
				var _v8 = msg.a;
				var x = _v8.a;
				var y = _v8.b;
				var timeStamp = msg.b;
				if ((timeStamp - e.lastMouseDown) <= 500) {
					var _v9 = e.locating;
					switch (_v9.$) {
						case 'Idle':
							return _Utils_Tuple2(
								$dkodaj$rte$MiniRte$Core$selectCurrentWord(e),
								$elm$core$Platform$Cmd$none);
						case 'Mouse':
							var a = _v9.a;
							var b = _v9.b;
							var c = _v9.c;
							return _Utils_Tuple2(
								_Utils_update(
									e,
									{
										locating: A3($dkodaj$rte$MiniRte$Core$Mouse, $dkodaj$rte$MiniRte$Core$SelectWord, b, c)
									}),
								$elm$core$Platform$Cmd$none);
						default:
							return A3(
								$dkodaj$rte$MiniRte$Core$mouseDown,
								_Utils_Tuple2(x, y),
								timeStamp,
								e);
					}
				} else {
					return A3(
						$dkodaj$rte$MiniRte$Core$mouseDown,
						_Utils_Tuple2(x, y),
						timeStamp,
						e);
				}
			case 'MouseHit':
				var idx = msg.a;
				var timeStamp = msg.b;
				return (((timeStamp - e.lastMouseDown) <= 500) && _Utils_eq(idx, e.cursor)) ? _Utils_Tuple2(
					$dkodaj$rte$MiniRte$Core$selectCurrentWord(
						_Utils_update(
							e,
							{drag: $dkodaj$rte$MiniRte$Core$NoDrag})),
					$elm$core$Platform$Cmd$none) : A2(
					$dkodaj$rte$MiniRte$Core$placeCursor2,
					$dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoScroll,
					_Utils_Tuple2(
						_Utils_update(
							e,
							{
								cursor: idx,
								drag: $dkodaj$rte$MiniRte$Core$DragFrom(idx),
								lastMouseDown: timeStamp,
								selection: $elm$core$Maybe$Nothing
							}),
						$elm$core$Platform$Cmd$none));
			case 'MouseMove':
				var currentIdx = msg.a;
				var timeStamp = msg.b;
				if ((timeStamp - e.lastMouseDown) < 500) {
					return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				} else {
					var _v10 = e.drag;
					if (_v10.$ === 'DragFrom') {
						var startIdx = _v10.a;
						var _v11 = (_Utils_cmp(startIdx, currentIdx) < 0) ? _Utils_Tuple2(
							_Utils_Tuple2(startIdx, currentIdx),
							A2($elm$core$Basics$min, maxIdx, currentIdx + 1)) : _Utils_Tuple2(
							_Utils_Tuple2(currentIdx, startIdx),
							currentIdx);
						var _v12 = _v11.a;
						var beg = _v12.a;
						var end = _v12.b;
						var newCursor = _v11.b;
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
							drag: $dkodaj$rte$MiniRte$Core$NoDrag,
							selection: function () {
								var _v13 = e.selection;
								if (_v13.$ === 'Nothing') {
									return $elm$core$Maybe$Nothing;
								} else {
									var _v14 = _v13.a;
									var beg = _v14.a;
									var end = _v14.b;
									return ((_Utils_cmp(e.cursor, beg - 1) < 0) || (_Utils_cmp(e.cursor, end + 1) > 0)) ? $elm$core$Maybe$Nothing : e.selection;
								}
							}()
						}),
					$elm$core$Platform$Cmd$none);
			case 'NoOp':
				return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
			case 'Paste':
				var str = msg.a;
				if (_Utils_eq(e.state, $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit)) {
					var _v15 = e.clipboard;
					if (_v15.$ === 'Nothing') {
						return A4($dkodaj$rte$MiniRte$Core$pasted, str, e, $elm$core$Maybe$Nothing, true);
					} else {
						var internalClipboard = _v15.a;
						return (!_Utils_eq(
							$dkodaj$rte$MiniRte$Core$toText(internalClipboard),
							str)) ? A4($dkodaj$rte$MiniRte$Core$pasted, str, e, $elm$core$Maybe$Nothing, true) : A2($dkodaj$rte$MiniRte$Core$addContent, internalClipboard, e);
					}
				} else {
					return _Utils_Tuple2(e, $elm$core$Platform$Cmd$none);
				}
			case 'PlaceCursor1_EditorViewport':
				if (msg.b.$ === 'Ok') {
					var scroll = msg.a;
					var data = msg.b.a;
					return _Utils_Tuple2(
						_Utils_update(
							e,
							{viewport: data}),
						A2(
							$elm$core$Task$attempt,
							A2(
								$elm$core$Basics$composeL,
								$dkodaj$rte$MiniRte$Types$Internal,
								$dkodaj$rte$MiniRte$TypesThatAreNotPublic$PlaceCursor2_EditorElement(scroll)),
							$elm$browser$Browser$Dom$getElement(e.editorID)));
				} else {
					var err = msg.b.a;
					return _Utils_Tuple2(
						_Utils_update(
							e,
							{locating: $dkodaj$rte$MiniRte$Core$Idle}),
						$elm$core$Platform$Cmd$none);
				}
			case 'PlaceCursor2_EditorElement':
				if (msg.b.$ === 'Ok') {
					var scroll = msg.a;
					var data = msg.b.a;
					return A2(
						$dkodaj$rte$MiniRte$Core$locateCursorParent,
						_Utils_update(
							e,
							{editorElement: data}),
						scroll);
				} else {
					var err = msg.b.a;
					return _Utils_Tuple2(
						_Utils_update(
							e,
							{locating: $dkodaj$rte$MiniRte$Core$Idle}),
						$elm$core$Platform$Cmd$none);
				}
			case 'PlaceCursor3_CursorElement':
				if (msg.b.$ === 'Ok') {
					var scroll = msg.a;
					var data = msg.b.a;
					var f = function (x) {
						return _Utils_update(
							x,
							{cursorElement: data, locating: $dkodaj$rte$MiniRte$Core$Idle});
					};
					if (scroll.$ === 'ScrollIfNeeded') {
						var _v17 = A5($dkodaj$rte$MiniRte$Core$scrollIfNeeded, data, e.editorElement, e.viewport, e.cursor, e.editorID);
						if (_v17.$ === 'Nothing') {
							return $dkodaj$rte$MiniRte$Core$locateNext(
								f(e));
						} else {
							var scrollCmd = _v17.a;
							return _Utils_Tuple2(e, scrollCmd);
						}
					} else {
						return $dkodaj$rte$MiniRte$Core$locateNext(
							f(e));
					}
				} else {
					var err = msg.b.a;
					return _Utils_Tuple2(
						_Utils_update(
							e,
							{locating: $dkodaj$rte$MiniRte$Core$Idle}),
						$elm$core$Platform$Cmd$none);
				}
			case 'Scrolled':
				return A2(
					$dkodaj$rte$MiniRte$Core$placeCursor,
					$dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoScroll,
					_Utils_update(
						e,
						{locating: $dkodaj$rte$MiniRte$Core$Idle}));
			case 'SwitchTo':
				var newState = msg.a;
				return A2($dkodaj$rte$MiniRte$Core$state, newState, e);
			default:
				return $dkodaj$rte$MiniRte$Core$undoAction(e);
		}
	});
var $dkodaj$rte$MiniRte$Core$undo = function (e) {
	return A2($dkodaj$rte$MiniRte$Core$update, $dkodaj$rte$MiniRte$TypesThatAreNotPublic$UndoAction, e);
};
var $dkodaj$rte$MiniRte$Core$unlink = function (editor) {
	var f = function (elem) {
		if (elem.$ === 'Char') {
			var ch = elem.a;
			return $dkodaj$rte$MiniRte$Types$Char(
				_Utils_update(
					ch,
					{link: $elm$core$Maybe$Nothing}));
		} else {
			return elem;
		}
	};
	return A2($dkodaj$rte$MiniRte$Core$linkMod, f, editor);
};
var $dkodaj$rte$MiniRte$Common$update = F2(
	function (msg, model) {
		if (_Utils_eq(model.textarea.state, $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Display) && (!$dkodaj$rte$MiniRte$Common$relevantInDisplayMode(msg))) {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		} else {
			switch (msg.$) {
				case 'Active':
					var bool = msg.a;
					var state = bool ? $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit : $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Display;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$state(state),
						_Utils_update(
							model,
							{inputBox: $elm$core$Maybe$Nothing}));
				case 'AddContent':
					var xs = msg.a;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$addContent(xs),
						model);
				case 'AddCustomHtml':
					var html = msg.a;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$embed(html),
						model);
				case 'AddImage':
					var str = msg.a;
					if (str === '') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{inputBox: $elm$core$Maybe$Nothing}),
							$elm$core$Platform$Cmd$none);
					} else {
						var _v1 = A2($dkodaj$rte$MiniRte$Core$addImage, str, model.textarea);
						var editor1 = _v1.a;
						var cmd1 = _v1.b;
						var _v2 = A2($dkodaj$rte$MiniRte$Core$state, $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit, editor1);
						var editor2 = _v2.a;
						var cmd2 = _v2.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{inputBox: $elm$core$Maybe$Nothing, textarea: editor2}),
							A2(
								$elm$core$Platform$Cmd$map,
								model.tagger,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[cmd1, cmd2]))));
					}
				case 'AddLink':
					var href = msg.a;
					return (href === '') ? _Utils_Tuple2(
						_Utils_update(
							model,
							{inputBox: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none) : A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$state($dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit),
						_Utils_update(
							model,
							{
								inputBox: $elm$core$Maybe$Nothing,
								textarea: A2($dkodaj$rte$MiniRte$Core$link, href, model.textarea)
							}));
				case 'AddText':
					var str = msg.a;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$addText(str),
						model);
				case 'Bold':
					return A2($dkodaj$rte$MiniRte$Common$apply, $dkodaj$rte$MiniRte$Core$toggleBold, model);
				case 'Class':
					var x = msg.a;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$toggleParaClass(x),
						model);
				case 'Copy':
					return A2($dkodaj$rte$MiniRte$Common$apply, $dkodaj$rte$MiniRte$Core$copy, model);
				case 'Cut':
					return A2($dkodaj$rte$MiniRte$Common$apply, $dkodaj$rte$MiniRte$Core$cut, model);
				case 'Font':
					var family = msg.a;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$fontFamily(family),
						model);
				case 'FontSize':
					var _float = msg.a;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$fontSize(_float),
						model);
				case 'FromBrowserClipboard':
					var txt = msg.a;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$update(
							$dkodaj$rte$MiniRte$TypesThatAreNotPublic$Paste(txt)),
						model);
				case 'Heading':
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$toggleNodeType('h1'),
						model);
				case 'ImageSourceInput':
					var str = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								inputBox: $elm$core$Maybe$Just(
									$dkodaj$rte$MiniRte$Types$ImageInputBox(str))
							}),
						$elm$core$Platform$Cmd$none);
				case 'Indent':
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$changeIndent(1),
						model);
				case 'Internal':
					var subMsg = msg.a;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$update(subMsg),
						model);
				case 'Italic':
					return A2($dkodaj$rte$MiniRte$Common$apply, $dkodaj$rte$MiniRte$Core$toggleItalic, model);
				case 'LoadContent':
					var content = msg.a;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						function (x) {
							return _Utils_Tuple2(
								A2($dkodaj$rte$MiniRte$Core$loadContent, content, x),
								$elm$core$Platform$Cmd$none);
						},
						model);
				case 'LoadText':
					var txt = msg.a;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						function (x) {
							return _Utils_Tuple2(
								A2($dkodaj$rte$MiniRte$Core$loadText, txt, x),
								$elm$core$Platform$Cmd$none);
						},
						model);
				case 'LinkHrefInput':
					var str = msg.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								inputBox: $elm$core$Maybe$Just(
									$dkodaj$rte$MiniRte$Types$LinkInputBox(str))
							}),
						$elm$core$Platform$Cmd$none);
				case 'NodeType':
					var str = msg.a;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$toggleNodeType(str),
						model);
				case 'StrikeThrough':
					return A2($dkodaj$rte$MiniRte$Common$apply, $dkodaj$rte$MiniRte$Core$toggleStrikeThrough, model);
				case 'TextAlign':
					var alignment = msg.a;
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$textAlign(alignment),
						model);
				case 'ToBrowserClipboard':
					var txt = msg.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				case 'ToggleEmojiBox':
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{emojiBox: !model.emojiBox}),
						$elm$core$Platform$Cmd$none);
				case 'ToggleImageBox':
					var _v3 = model.inputBox;
					if ((_v3.$ === 'Just') && (_v3.a.$ === 'ImageInputBox')) {
						return A2(
							$dkodaj$rte$MiniRte$Common$apply,
							$dkodaj$rte$MiniRte$Core$state($dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit),
							_Utils_update(
								model,
								{inputBox: $elm$core$Maybe$Nothing}));
					} else {
						var _v4 = A2(
							$dkodaj$rte$MiniRte$Common$apply,
							$dkodaj$rte$MiniRte$Core$state($dkodaj$rte$MiniRte$TypesThatAreNotPublic$Freeze),
							model);
						var newmodel = _v4.a;
						var cmd = _v4.b;
						return _Utils_Tuple2(
							_Utils_update(
								newmodel,
								{
									inputBox: $elm$core$Maybe$Just(
										$dkodaj$rte$MiniRte$Types$ImageInputBox(''))
								}),
							A2(
								$elm$core$Task$attempt,
								function (_v5) {
									return model.tagger(
										$dkodaj$rte$MiniRte$Types$Internal($dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoOp));
								},
								$elm$browser$Browser$Dom$focus(
									$dkodaj$rte$MiniRte$Common$inputBoxId(model))));
					}
				case 'ToggleLinkBox':
					var _v6 = model.inputBox;
					if ((_v6.$ === 'Just') && (_v6.a.$ === 'LinkInputBox')) {
						return A2(
							$dkodaj$rte$MiniRte$Common$apply,
							$dkodaj$rte$MiniRte$Core$state($dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit),
							_Utils_update(
								model,
								{inputBox: $elm$core$Maybe$Nothing}));
					} else {
						var currentLink = A2(
							$elm$core$Maybe$withDefault,
							'',
							$dkodaj$rte$MiniRte$Core$currentLink(model.textarea));
						var _v7 = A2(
							$dkodaj$rte$MiniRte$Common$apply,
							$dkodaj$rte$MiniRte$Core$state($dkodaj$rte$MiniRte$TypesThatAreNotPublic$Freeze),
							model);
						var newmodel = _v7.a;
						var cmd = _v7.b;
						return _Utils_Tuple2(
							_Utils_update(
								newmodel,
								{
									inputBox: $elm$core$Maybe$Just(
										$dkodaj$rte$MiniRte$Types$LinkInputBox(currentLink))
								}),
							A2(
								$elm$core$Task$attempt,
								function (_v8) {
									return model.tagger(
										$dkodaj$rte$MiniRte$Types$Internal($dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoOp));
								},
								$elm$browser$Browser$Dom$focus(
									$dkodaj$rte$MiniRte$Common$inputBoxId(model))));
					}
				case 'Underline':
					return A2($dkodaj$rte$MiniRte$Common$apply, $dkodaj$rte$MiniRte$Core$toggleUnderline, model);
				case 'Undo':
					return A2($dkodaj$rte$MiniRte$Common$apply, $dkodaj$rte$MiniRte$Core$undo, model);
				case 'Unindent':
					return A2(
						$dkodaj$rte$MiniRte$Common$apply,
						$dkodaj$rte$MiniRte$Core$changeIndent(-1),
						model);
				default:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								textarea: $dkodaj$rte$MiniRte$Core$unlink(model.textarea)
							}),
						$elm$core$Platform$Cmd$none);
			}
		}
	});
var $dkodaj$rte$MiniRte$update = $dkodaj$rte$MiniRte$Common$update;
var $author$project$Main$update = F2(
	function (msg, model) {
		update:
		while (true) {
			switch (msg.$) {
				case 'DownloadContentStart':
					var bytes = $dkodaj$rte$MiniRte$encodeContentGZip(model.rte);
					return _Utils_Tuple2(
						model,
						A2(
							$elm$core$Task$perform,
							$elm$core$Basics$identity,
							$elm$core$Task$succeed(
								$author$project$Main$DownloadContentEnd(bytes))));
				case 'DownloadContentEnd':
					var bytes = msg.a;
					return _Utils_Tuple2(
						model,
						A3($elm$file$File$Download$bytes, 'content.gz', 'application/zip', bytes));
				case 'FileDecoded':
					var bytes = msg.a;
					var _v1 = $dkodaj$rte$MiniRte$decodeContentGZip(bytes);
					if (_v1.$ === 'Ok') {
						var content = _v1.a;
						var $temp$msg = $author$project$Main$Rte(
							$dkodaj$rte$MiniRte$Types$LoadContent(content)),
							$temp$model = model;
						msg = $temp$msg;
						model = $temp$model;
						continue update;
					} else {
						var err = _v1.a;
						var $temp$msg = $author$project$Main$Rte(
							$dkodaj$rte$MiniRte$Types$LoadText('File open error: ' + err)),
							$temp$model = model;
						msg = $temp$msg;
						model = $temp$model;
						continue update;
					}
				case 'FileSelected':
					var file = msg.a;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$core$Task$perform,
							$author$project$Main$FileDecoded,
							$elm$file$File$toBytes(file)));
				case 'FileSelect':
					return _Utils_Tuple2(
						model,
						A2(
							$elm$file$File$Select$file,
							_List_fromArray(
								['application/gz']),
							$author$project$Main$FileSelected));
				default:
					if (msg.a.$ === 'ToBrowserClipboard') {
						var txt = msg.a.a;
						return _Utils_Tuple2(
							model,
							$author$project$Main$toBrowserClipboard(txt));
					} else {
						var rteMsg = msg.a;
						var _v2 = A2($dkodaj$rte$MiniRte$update, rteMsg, model.rte);
						var rte = _v2.a;
						var cmd = _v2.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{rte: rte}),
							cmd);
					}
			}
		}
	});
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$CompositionEnd = function (a) {
	return {$: 'CompositionEnd', a: a};
};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$CompositionStart = {$: 'CompositionStart'};
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$SwitchTo = function (a) {
	return {$: 'SwitchTo', a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$property = F2(
	function (key, value) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$property, key, value),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$autocomplete = function (bool) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var $dkodaj$rte$MiniRte$Core$decodeInputAndTime = function (f) {
	return A3(
		$elm$json$Json$Decode$map2,
		f,
		A2($elm$json$Json$Decode$field, 'timeStamp', $elm$json$Json$Decode$float),
		A2($elm$json$Json$Decode$field, 'data', $elm$json$Json$Decode$string));
};
var $rtfeldman$elm_css$VirtualDom$Styled$Node = F3(
	function (a, b, c) {
		return {$: 'Node', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$Node;
var $rtfeldman$elm_css$Html$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$node;
var $rtfeldman$elm_css$Html$Styled$div = $rtfeldman$elm_css$Html$Styled$node('div');
var $rtfeldman$elm_css$Css$fixed = {backgroundAttachment: $rtfeldman$elm_css$Css$Structure$Compatible, position: $rtfeldman$elm_css$Css$Structure$Compatible, tableLayout: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'fixed'};
var $rtfeldman$elm_css$Css$prop1 = F2(
	function (key, arg) {
		return A2($rtfeldman$elm_css$Css$property, key, arg.value);
	});
var $rtfeldman$elm_css$Css$height = $rtfeldman$elm_css$Css$prop1('height');
var $rtfeldman$elm_css$Html$Styled$Attributes$id = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('id');
var $rtfeldman$elm_css$Html$Styled$input = $rtfeldman$elm_css$Html$Styled$node('input');
var $rtfeldman$elm_css$Css$UnitlessInteger = {$: 'UnitlessInteger'};
var $rtfeldman$elm_css$Css$int = function (val) {
	return {
		fontWeight: $rtfeldman$elm_css$Css$Structure$Compatible,
		intOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
		lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
		lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
		number: $rtfeldman$elm_css$Css$Structure$Compatible,
		numberOrInfinite: $rtfeldman$elm_css$Css$Structure$Compatible,
		numericValue: val,
		unitLabel: '',
		units: $rtfeldman$elm_css$Css$UnitlessInteger,
		value: $elm$core$String$fromInt(val)
	};
};
var $rtfeldman$elm_css$VirtualDom$Styled$Unstyled = function (a) {
	return {$: 'Unstyled', a: a};
};
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles = F2(
	function (_v0, styles) {
		var newStyles = _v0.b;
		var classname = _v0.c;
		return $elm$core$List$isEmpty(newStyles) ? styles : A3($elm$core$Dict$insert, classname, newStyles, styles);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute = function (_v0) {
	var val = _v0.a;
	return val;
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$keyedNodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_keyedNodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$nodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_nodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml = F2(
	function (_v6, _v7) {
		var key = _v6.a;
		var html = _v6.b;
		var pairs = _v7.a;
		var styles = _v7.b;
		switch (html.$) {
			case 'Unstyled':
				var vdom = html.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					styles);
			case 'Node':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v9 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v9.a;
				var finalStyles = _v9.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 'NodeNS':
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v10 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v10.a;
				var finalStyles = _v10.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 'KeyedNode':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v11 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v11.a;
				var finalStyles = _v11.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v12 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v12.a;
				var finalStyles = _v12.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml = F2(
	function (html, _v0) {
		var nodes = _v0.a;
		var styles = _v0.b;
		switch (html.$) {
			case 'Unstyled':
				var vdomNode = html.a;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					styles);
			case 'Node':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v2 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v2.a;
				var finalStyles = _v2.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 'NodeNS':
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v3 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v3.a;
				var finalStyles = _v3.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 'KeyedNode':
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v4 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v4.a;
				var finalStyles = _v4.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v5 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v5.a;
				var finalStyles = _v5.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
		}
	});
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp = F2(
	function (candidate, properties) {
		stylesFromPropertiesHelp:
		while (true) {
			if (!properties.b) {
				return candidate;
			} else {
				var _v1 = properties.a;
				var styles = _v1.b;
				var classname = _v1.c;
				var rest = properties.b;
				if ($elm$core$String$isEmpty(classname)) {
					var $temp$candidate = candidate,
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				} else {
					var $temp$candidate = $elm$core$Maybe$Just(
						_Utils_Tuple2(classname, styles)),
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties = function (properties) {
	var _v0 = A2($rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp, $elm$core$Maybe$Nothing, properties);
	if (_v0.$ === 'Nothing') {
		return $elm$core$Dict$empty;
	} else {
		var _v1 = _v0.a;
		var classname = _v1.a;
		var styles = _v1.b;
		return A2($elm$core$Dict$singleton, classname, styles);
	}
};
var $rtfeldman$elm_css$Css$Structure$ClassSelector = function (a) {
	return {$: 'ClassSelector', a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair = function (_v0) {
	var classname = _v0.a;
	var styles = _v0.b;
	return A2(
		$rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
		styles,
		$rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$ClassSelector(classname)
				])));
};
var $rtfeldman$elm_css$VirtualDom$Styled$toDeclaration = function (dict) {
	return $rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
		$elm$core$List$singleton(
			$rtfeldman$elm_css$Css$Preprocess$stylesheet(
				A2(
					$elm$core$List$map,
					$rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair,
					$elm$core$Dict$toList(dict)))));
};
var $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode = function (styles) {
	return A3(
		$elm$virtual_dom$VirtualDom$node,
		'style',
		_List_Nil,
		$elm$core$List$singleton(
			$elm$virtual_dom$VirtualDom$text(
				$rtfeldman$elm_css$VirtualDom$Styled$toDeclaration(styles))));
};
var $rtfeldman$elm_css$VirtualDom$Styled$unstyle = F3(
	function (elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A3(
			$elm$virtual_dom$VirtualDom$node,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$containsKey = F2(
	function (key, pairs) {
		containsKey:
		while (true) {
			if (!pairs.b) {
				return false;
			} else {
				var _v1 = pairs.a;
				var str = _v1.a;
				var rest = pairs.b;
				if (_Utils_eq(key, str)) {
					return true;
				} else {
					var $temp$key = key,
						$temp$pairs = rest;
					key = $temp$key;
					pairs = $temp$pairs;
					continue containsKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey = F2(
	function (_default, pairs) {
		getUnusedKey:
		while (true) {
			if (!pairs.b) {
				return _default;
			} else {
				var _v1 = pairs.a;
				var firstKey = _v1.a;
				var rest = pairs.b;
				var newKey = '_' + firstKey;
				if (A2($rtfeldman$elm_css$VirtualDom$Styled$containsKey, newKey, rest)) {
					var $temp$default = newKey,
						$temp$pairs = rest;
					_default = $temp$default;
					pairs = $temp$pairs;
					continue getUnusedKey;
				} else {
					return newKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode = F2(
	function (allStyles, keyedChildNodes) {
		var styleNodeKey = A2($rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey, '_', keyedChildNodes);
		var finalNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(allStyles);
		return _Utils_Tuple2(styleNodeKey, finalNode);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed = F3(
	function (elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A3(
			$elm$virtual_dom$VirtualDom$keyedNode,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS = F4(
	function (ns, elemType, properties, keyedChildren) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A4(
			$elm$virtual_dom$VirtualDom$keyedNodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleNS = F4(
	function (ns, elemType, properties, children) {
		var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A4(
			$elm$virtual_dom$VirtualDom$nodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled = function (vdom) {
	switch (vdom.$) {
		case 'Unstyled':
			var plainNode = vdom.a;
			return plainNode;
		case 'Node':
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyle, elemType, properties, children);
		case 'NodeNS':
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleNS, ns, elemType, properties, children);
		case 'KeyedNode':
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed, elemType, properties, children);
		default:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS, ns, elemType, properties, children);
	}
};
var $rtfeldman$elm_css$VirtualDom$Styled$lazyHelp2 = F3(
	function (fn, arg1, arg2) {
		return $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled(
			A2(fn, arg1, arg2));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$lazy2 = F3(
	function (fn, arg1, arg2) {
		return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
			A4($elm$virtual_dom$VirtualDom$lazy3, $rtfeldman$elm_css$VirtualDom$Styled$lazyHelp2, fn, arg1, arg2));
	});
var $rtfeldman$elm_css$Html$Styled$Lazy$lazy2 = $rtfeldman$elm_css$VirtualDom$Styled$lazy2;
var $rtfeldman$elm_css$Css$left = $rtfeldman$elm_css$Css$prop1('left');
var $rtfeldman$elm_css$VirtualDom$Styled$KeyedNode = F3(
	function (a, b, c) {
		return {$: 'KeyedNode', a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS = F4(
	function (a, b, c, d) {
		return {$: 'KeyedNodeNS', a: a, b: b, c: c, d: d};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$NodeNS = F4(
	function (a, b, c, d) {
		return {$: 'NodeNS', a: a, b: b, c: c, d: d};
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $rtfeldman$elm_css$VirtualDom$Styled$mapAttribute = F2(
	function (transform, _v0) {
		var prop = _v0.a;
		var styles = _v0.b;
		var classname = _v0.c;
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$mapAttribute, transform, prop),
			styles,
			classname);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$map = F2(
	function (transform, vdomNode) {
		switch (vdomNode.$) {
			case 'Node':
				var elemType = vdomNode.a;
				var properties = vdomNode.b;
				var children = vdomNode.c;
				return A3(
					$rtfeldman$elm_css$VirtualDom$Styled$Node,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$map(transform),
						children));
			case 'NodeNS':
				var ns = vdomNode.a;
				var elemType = vdomNode.b;
				var properties = vdomNode.c;
				var children = vdomNode.d;
				return A4(
					$rtfeldman$elm_css$VirtualDom$Styled$NodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$map(transform),
						children));
			case 'KeyedNode':
				var elemType = vdomNode.a;
				var properties = vdomNode.b;
				var children = vdomNode.c;
				return A3(
					$rtfeldman$elm_css$VirtualDom$Styled$KeyedNode,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						function (_v1) {
							var key = _v1.a;
							var child = _v1.b;
							return _Utils_Tuple2(
								key,
								A2($rtfeldman$elm_css$VirtualDom$Styled$map, transform, child));
						},
						children));
			case 'KeyedNodeNS':
				var ns = vdomNode.a;
				var elemType = vdomNode.b;
				var properties = vdomNode.c;
				var children = vdomNode.d;
				return A4(
					$rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						$elm$core$List$map,
						function (_v2) {
							var key = _v2.a;
							var child = _v2.b;
							return _Utils_Tuple2(
								key,
								A2($rtfeldman$elm_css$VirtualDom$Styled$map, transform, child));
						},
						children));
			default:
				var vdom = vdomNode.a;
				return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
					A2($elm$virtual_dom$VirtualDom$map, transform, vdom));
		}
	});
var $rtfeldman$elm_css$Html$Styled$map = $rtfeldman$elm_css$VirtualDom$Styled$map;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $rtfeldman$elm_css$VirtualDom$Styled$on = F2(
	function (eventName, handler) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$on, eventName, handler),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Events$on = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $rtfeldman$elm_css$Css$opacity = $rtfeldman$elm_css$Css$prop1('opacity');
var $rtfeldman$elm_css$Css$position = $rtfeldman$elm_css$Css$prop1('position');
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $rtfeldman$elm_css$Html$Styled$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $rtfeldman$elm_css$Css$PxUnits = {$: 'PxUnits'};
var $rtfeldman$elm_css$Css$Internal$lengthConverter = F3(
	function (units, unitLabel, numericValue) {
		return {
			absoluteLength: $rtfeldman$elm_css$Css$Structure$Compatible,
			calc: $rtfeldman$elm_css$Css$Structure$Compatible,
			flexBasis: $rtfeldman$elm_css$Css$Structure$Compatible,
			fontSize: $rtfeldman$elm_css$Css$Structure$Compatible,
			length: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrAutoOrCoverOrContain: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNone: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNoneOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
			lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
			numericValue: numericValue,
			textIndent: $rtfeldman$elm_css$Css$Structure$Compatible,
			unitLabel: unitLabel,
			units: units,
			value: _Utils_ap(
				$elm$core$String$fromFloat(numericValue),
				unitLabel)
		};
	});
var $rtfeldman$elm_css$Css$px = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$PxUnits, 'px');
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$MouseDown = F2(
	function (a, b) {
		return {$: 'MouseDown', a: a, b: b};
	});
var $dkodaj$rte$MiniRte$Core$Paragraph = F3(
	function (idx, children, lineBreak) {
		return {children: children, idx: idx, lineBreak: lineBreak};
	});
var $dkodaj$rte$MiniRte$Core$breakIntoParas = function (content) {
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
						A3($dkodaj$rte$MiniRte$Core$Paragraph, idx, _List_Nil, br),
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
var $dkodaj$rte$MiniRte$Core$decodeMouse = function (msg) {
	var tagger = F3(
		function (x, y, z) {
			return A2(
				msg,
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
var $rtfeldman$elm_css$VirtualDom$Styled$keyedNode = $rtfeldman$elm_css$VirtualDom$Styled$KeyedNode;
var $rtfeldman$elm_css$Html$Styled$Keyed$node = $rtfeldman$elm_css$VirtualDom$Styled$keyedNode;
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$MouseHit = F2(
	function (a, b) {
		return {$: 'MouseHit', a: a, b: b};
	});
var $dkodaj$rte$MiniRte$TypesThatAreNotPublic$MouseMove = F2(
	function (a, b) {
		return {$: 'MouseMove', a: a, b: b};
	});
var $rtfeldman$elm_css$Html$Styled$a = $rtfeldman$elm_css$Html$Styled$node('a');
var $rtfeldman$elm_css$Html$Styled$Attributes$class = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('className');
var $dkodaj$rte$MiniRte$Core$attributes = function (elem) {
	var g = function (_v1) {
		var x = _v1.a;
		var y = _v1.b;
		return A2($rtfeldman$elm_css$Html$Styled$Attributes$style, x, y);
	};
	var f = function (x) {
		return $rtfeldman$elm_css$Html$Styled$Attributes$class(x);
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
var $rtfeldman$elm_css$Css$absolute = {position: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'absolute'};
var $rtfeldman$elm_css$Css$animationDuration = function (arg) {
	return A2($rtfeldman$elm_css$Css$prop1, 'animation-duration', arg);
};
var $rtfeldman$elm_css$Css$Preprocess$WithKeyframes = function (a) {
	return {$: 'WithKeyframes', a: a};
};
var $rtfeldman$elm_css$Css$animationName = function (arg) {
	return ((arg.value === 'none') || ((arg.value === 'inherit') || ((arg.value === 'unset') || (arg.value === 'initial')))) ? A2($rtfeldman$elm_css$Css$prop1, 'animation-name', arg) : $rtfeldman$elm_css$Css$Preprocess$WithKeyframes(arg.value);
};
var $rtfeldman$elm_css$Css$borderBox = {backgroundClip: $rtfeldman$elm_css$Css$Structure$Compatible, boxSizing: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'border-box'};
var $rtfeldman$elm_css$Css$borderColor = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'border-color', c.value);
};
var $rtfeldman$elm_css$Css$prop2 = F3(
	function (key, argA, argB) {
		return A2(
			$rtfeldman$elm_css$Css$property,
			key,
			A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					[argA.value, argB.value])));
	});
var $rtfeldman$elm_css$Css$borderLeft2 = $rtfeldman$elm_css$Css$prop2('border-left');
var $rtfeldman$elm_css$Css$boxSizing = $rtfeldman$elm_css$Css$prop1('box-sizing');
var $rtfeldman$elm_css$Css$EmUnits = {$: 'EmUnits'};
var $rtfeldman$elm_css$Css$em = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$EmUnits, 'em');
var $rtfeldman$elm_css$Css$Internal$printKeyframeSelector = function (_v0) {
	var percentage = _v0.a;
	var properties = _v0.b;
	var propertiesStr = A2(
		$elm$core$String$join,
		'',
		A2(
			$elm$core$List$map,
			function (_v1) {
				var prop = _v1.a;
				return prop + ';';
			},
			properties));
	var percentageStr = $elm$core$String$fromInt(percentage) + '%';
	return percentageStr + (' {' + (propertiesStr + '}'));
};
var $rtfeldman$elm_css$Css$Internal$compileKeyframes = function (tuples) {
	return A2(
		$elm$core$String$join,
		'\n\n',
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Internal$printKeyframeSelector, tuples));
};
var $rtfeldman$elm_css$Css$Animations$keyframes = function (tuples) {
	return $elm$core$List$isEmpty(tuples) ? {keyframes: $rtfeldman$elm_css$Css$Structure$Compatible, none: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'none'} : {
		keyframes: $rtfeldman$elm_css$Css$Structure$Compatible,
		none: $rtfeldman$elm_css$Css$Structure$Compatible,
		value: $rtfeldman$elm_css$Css$Internal$compileKeyframes(tuples)
	};
};
var $rtfeldman$elm_css$Css$marginRight = $rtfeldman$elm_css$Css$prop1('margin-right');
var $rtfeldman$elm_css$Css$ms = function (amount) {
	return {
		duration: $rtfeldman$elm_css$Css$Structure$Compatible,
		value: $elm$core$String$fromFloat(amount) + 'ms'
	};
};
var $rtfeldman$elm_css$Css$Internal$Property = function (a) {
	return {$: 'Property', a: a};
};
var $rtfeldman$elm_css$Css$Animations$opacity = function (_v0) {
	var value = _v0.value;
	return $rtfeldman$elm_css$Css$Internal$Property('opacity:' + value);
};
var $rtfeldman$elm_css$Css$rgb = F3(
	function (r, g, b) {
		return {
			alpha: 1,
			blue: b,
			color: $rtfeldman$elm_css$Css$Structure$Compatible,
			green: g,
			red: r,
			value: A2(
				$rtfeldman$elm_css$Css$cssFunction,
				'rgb',
				A2(
					$elm$core$List$map,
					$elm$core$String$fromInt,
					_List_fromArray(
						[r, g, b])))
		};
	});
var $rtfeldman$elm_css$Css$solid = {borderStyle: $rtfeldman$elm_css$Css$Structure$Compatible, textDecorationStyle: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'solid'};
var $rtfeldman$elm_css$Css$top = $rtfeldman$elm_css$Css$prop1('top');
var $dkodaj$rte$MiniRte$Core$cursorHtml = function (typing) {
	var blink = $rtfeldman$elm_css$Css$Animations$keyframes(
		_List_fromArray(
			[
				_Utils_Tuple2(
				0,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$Animations$opacity(
						$rtfeldman$elm_css$Css$int(1))
					])),
				_Utils_Tuple2(
				49,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$Animations$opacity(
						$rtfeldman$elm_css$Css$int(1))
					])),
				_Utils_Tuple2(
				50,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$Animations$opacity(
						$rtfeldman$elm_css$Css$int(0))
					])),
				_Utils_Tuple2(
				100,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$Animations$opacity(
						$rtfeldman$elm_css$Css$int(0))
					]))
			]));
	var anim = (!typing) ? _List_fromArray(
		[
			$rtfeldman$elm_css$Css$animationName(blink),
			$rtfeldman$elm_css$Css$animationDuration(
			$rtfeldman$elm_css$Css$ms(2 * $dkodaj$rte$MiniRte$Core$tickPeriod)),
			A2($rtfeldman$elm_css$Css$property, 'animation-iteration-count', 'infinite')
		]) : _List_Nil;
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Css$borderLeft2,
							$rtfeldman$elm_css$Css$px(3),
							$rtfeldman$elm_css$Css$solid),
							$rtfeldman$elm_css$Css$borderColor(
							A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0)),
							$rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$borderBox),
							$rtfeldman$elm_css$Css$height(
							$rtfeldman$elm_css$Css$em(1.17)),
							$rtfeldman$elm_css$Css$left(
							$rtfeldman$elm_css$Css$px(0)),
							$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
							$rtfeldman$elm_css$Css$top(
							$rtfeldman$elm_css$Css$em(0.05)),
							$rtfeldman$elm_css$Css$marginRight(
							$rtfeldman$elm_css$Css$em(-0.5))
						]),
					anim))
			]),
		_List_Nil);
};
var $rtfeldman$elm_css$Css$stringsToValue = function (list) {
	return $elm$core$List$isEmpty(list) ? {value: 'none'} : {
		value: A2(
			$elm$core$String$join,
			', ',
			A2(
				$elm$core$List$map,
				function (s) {
					return s;
				},
				list))
	};
};
var $rtfeldman$elm_css$Css$fontFamilies = A2(
	$elm$core$Basics$composeL,
	$rtfeldman$elm_css$Css$prop1('font-family'),
	$rtfeldman$elm_css$Css$stringsToValue);
var $rtfeldman$elm_css$Html$Styled$Attributes$href = function (url) {
	return A2($rtfeldman$elm_css$Html$Styled$Attributes$stringProperty, 'href', url);
};
var $rtfeldman$elm_css$Css$relative = {position: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'relative'};
var $rtfeldman$elm_css$Html$Styled$span = $rtfeldman$elm_css$Html$Styled$node('span');
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$target = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('target');
var $rtfeldman$elm_css$VirtualDom$Styled$text = function (str) {
	return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
		$elm$virtual_dom$VirtualDom$text(str));
};
var $rtfeldman$elm_css$Html$Styled$text = $rtfeldman$elm_css$VirtualDom$Styled$text;
var $dkodaj$rte$MiniRte$Core$showChar = F2(
	function (params, _v0) {
		var idx = _v0.a;
		var ch = _v0.b;
		var typing = params.typing;
		var selectionStyle = params.selectionStyle;
		var selection = params.selection;
		var select = function () {
			if (selection.$ === 'Just') {
				var _v5 = selection.a;
				var beg = _v5.a;
				var end = _v5.b;
				return ((_Utils_cmp(idx, beg) > -1) && (_Utils_cmp(idx, end) < 1)) ? selectionStyle : _List_Nil;
			} else {
				return _List_Nil;
			}
		}();
		var mouseEnterListener = A2(
			$rtfeldman$elm_css$Html$Styled$Events$on,
			'mouseenter',
			A2(
				$elm$json$Json$Decode$map,
				function (x) {
					return $dkodaj$rte$MiniRte$Types$Internal(
						A2($dkodaj$rte$MiniRte$TypesThatAreNotPublic$MouseMove, idx, x));
				},
				A2($elm$json$Json$Decode$field, 'timeStamp', $elm$json$Json$Decode$float)));
		var mouseDownListener = function () {
			var _v3 = ch.link;
			if (_v3.$ === 'Nothing') {
				return A2(
					$rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn,
					'mousedown',
					A2(
						$elm$json$Json$Decode$map,
						function (x) {
							return _Utils_Tuple2(
								$dkodaj$rte$MiniRte$Types$Internal(
									A2($dkodaj$rte$MiniRte$TypesThatAreNotPublic$MouseHit, idx, x)),
								true);
						},
						A2($elm$json$Json$Decode$field, 'timeStamp', $elm$json$Json$Decode$float)));
			} else {
				return A2(
					$rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn,
					'mousedown',
					$elm$json$Json$Decode$succeed(
						_Utils_Tuple2(
							$dkodaj$rte$MiniRte$Types$Internal($dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoOp),
							true)));
			}
		}();
		var linked = function (x) {
			var _v2 = ch.link;
			if (_v2.$ === 'Nothing') {
				return x;
			} else {
				var href = _v2.a;
				return A2(
					$rtfeldman$elm_css$Html$Styled$a,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$href(href),
							$rtfeldman$elm_css$Html$Styled$Attributes$target('_blank')
						]),
					_List_fromArray(
						[x]));
			}
		};
		var id = _Utils_ap(
			params.editorID,
			$elm$core$String$fromInt(ch.id));
		var fontSizeUnit = params.fontSizeUnit;
		var unit = A2($elm$core$Maybe$withDefault, 'px', fontSizeUnit);
		var size = function () {
			var _v1 = ch.fontStyle.fontSize;
			if (_v1.$ === 'Nothing') {
				return _List_Nil;
			} else {
				var x = _v1.a;
				return _List_fromArray(
					[
						A2(
						$rtfeldman$elm_css$Html$Styled$Attributes$style,
						'font-size',
						_Utils_ap(
							$elm$core$String$fromFloat(x),
							unit))
					]);
			}
		}();
		var fontFamilyAttr = _Utils_eq(ch.fontStyle.fontFamily, _List_Nil) ? _List_Nil : _List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$fontFamilies(ch.fontStyle.fontFamily)
					]))
			]);
		var eState = params.eState;
		var listeners = _Utils_eq(eState, $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit) ? _List_fromArray(
			[mouseDownListener, mouseEnterListener]) : _List_Nil;
		var cursor = params.cursor;
		var pos = _Utils_eq(idx, cursor) ? _List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative)
					]))
			]) : _List_Nil;
		var child = _Utils_eq(idx, cursor) ? _List_fromArray(
			[
				linked(
				$rtfeldman$elm_css$Html$Styled$text(
					$elm$core$String$fromChar(ch._char))),
				$dkodaj$rte$MiniRte$Core$cursorHtml(typing)
			]) : _List_fromArray(
			[
				linked(
				$rtfeldman$elm_css$Html$Styled$text(
					$elm$core$String$fromChar(ch._char)))
			]);
		return _Utils_Tuple2(
			id,
			A2(
				$rtfeldman$elm_css$Html$Styled$span,
				A2(
					$elm$core$List$cons,
					$rtfeldman$elm_css$Html$Styled$Attributes$id(id),
					_Utils_ap(
						$dkodaj$rte$MiniRte$Core$attributes(
							$dkodaj$rte$MiniRte$Types$Char(ch)),
						_Utils_ap(
							fontFamilyAttr,
							_Utils_ap(
								listeners,
								_Utils_ap(
									pos,
									_Utils_ap(select, size)))))),
				child));
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$attribute = F2(
	function (key, value) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$attribute, key, value),
			_List_Nil,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$attribute = $rtfeldman$elm_css$VirtualDom$Styled$attribute;
var $dkodaj$rte$MiniRte$Core$showEmbedded = function (html) {
	var textChild = function () {
		var _v4 = html.text;
		if (_v4.$ === 'Nothing') {
			return _List_Nil;
		} else {
			var txt = _v4.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text(txt)
				]);
		}
	}();
	var g = function (_v3) {
		var x = _v3.a;
		var y = _v3.b;
		return A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, x, y);
	};
	var f = function (x) {
		var y = x.a;
		return $dkodaj$rte$MiniRte$Core$showEmbedded(y);
	};
	var attrs = _Utils_ap(
		$dkodaj$rte$MiniRte$Core$attributes(
			$dkodaj$rte$MiniRte$Types$Embedded(html)),
		A2($elm$core$List$map, g, html.attributes));
	var _v0 = html.nodeType;
	if (_v0.$ === 'Nothing') {
		if (!textChild.b) {
			return A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_Nil);
		} else {
			var x = textChild.a;
			return x;
		}
	} else {
		var x = _v0.a;
		return A3(
			$rtfeldman$elm_css$Html$Styled$node,
			x,
			attrs,
			_Utils_ap(
				textChild,
				A2($elm$core$List$map, f, html.children)));
	}
};
var $dkodaj$rte$MiniRte$Core$wrap = F3(
	function (editorID, _v0, l) {
		var amount = _v0.a;
		var unit = _v0.b;
		var indentation = l.indent + l.highlightIndent;
		var indentStr = _Utils_ap(
			$elm$core$String$fromFloat(indentation * amount),
			unit);
		var indentAttr = (indentation > 0) ? _List_fromArray(
			[
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'padding-left', indentStr),
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'padding-right', indentStr)
			]) : _List_Nil;
		var id = editorID + ($elm$core$String$fromInt(l.id) + 'wrap');
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
				id,
				A2(
					$rtfeldman$elm_css$Html$Styled$Keyed$node,
					'div',
					_Utils_ap(
						indentAttr,
						$dkodaj$rte$MiniRte$Core$attributes(
							$dkodaj$rte$MiniRte$Types$Break(l)))));
		} else {
			var nodeType = _v1.a;
			return A2(
				addId,
				id,
				A2(
					$rtfeldman$elm_css$Html$Styled$Keyed$node,
					nodeType,
					_Utils_ap(
						indentAttr,
						$dkodaj$rte$MiniRte$Core$attributes(
							$dkodaj$rte$MiniRte$Types$Break(l)))));
		}
	});
var $elm$core$Char$fromCode = _Char_fromCode;
var $dkodaj$rte$MiniRte$Core$zeroWidthChar = $elm$core$Char$fromCode(8203);
var $dkodaj$rte$MiniRte$Core$zeroWidthCharacter = function (id) {
	return {_char: $dkodaj$rte$MiniRte$Core$zeroWidthChar, fontStyle: $dkodaj$rte$MiniRte$Core$emptyFontStyle, highlightClasses: _List_Nil, highlightStyling: _List_Nil, id: id, link: $elm$core$Maybe$Nothing};
};
var $dkodaj$rte$MiniRte$Core$showPara = F2(
	function (params, p) {
		var tag = function (_v2) {
			var x = _v2.a;
			var y = _v2.b;
			return _Utils_Tuple2(
				x,
				A2($rtfeldman$elm_css$Html$Styled$map, params.tagger, y));
		};
		var indentUnit = A2(
			$elm$core$Maybe$withDefault,
			_Utils_Tuple2(50, 'px'),
			params.maybeIndentUnit);
		var f = function (html) {
			return _Utils_Tuple2(
				$elm$core$String$fromInt(html.id) + 'embed',
				$dkodaj$rte$MiniRte$Core$showEmbedded(html));
		};
		var charParams = {cursor: params.cursor, eState: params.eState, editorID: params.editorID, fontSizeUnit: params.fontSizeUnit, selection: params.selection, selectionStyle: params.selectionStyle, typing: params.typing};
		var zeroSpace = F2(
			function (idx, id) {
				return A2(
					$dkodaj$rte$MiniRte$Core$showChar,
					charParams,
					_Utils_Tuple2(
						idx,
						$dkodaj$rte$MiniRte$Core$zeroWidthCharacter(id)));
			});
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
							A2(
								$dkodaj$rte$MiniRte$Core$showChar,
								charParams,
								_Utils_Tuple2(idx, ch)),
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
		return tag(
			A4(
				$dkodaj$rte$MiniRte$Core$wrap,
				params.editorID,
				indentUnit,
				p.lineBreak,
				A3(
					$elm$core$List$foldr,
					g,
					_List_fromArray(
						[
							A2(zeroSpace, p.idx, p.lineBreak.id)
						]),
					p.children)));
	});
var $dkodaj$rte$MiniRte$Core$showContent = F2(
	function (params, c) {
		var paraParams = {cursor: c.cursor, eState: params.state, editorID: params.editorID, fontSizeUnit: params.fontSizeUnit, maybeIndentUnit: params.indentUnit, selection: c.selection, selectionStyle: params.selectionStyle, tagger: params.tagger, typing: c.typing};
		var listeners = _Utils_eq(params.state, $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit) ? _List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$Events$on,
				'mousedown',
				$dkodaj$rte$MiniRte$Core$decodeMouse(
					F2(
						function (x, y) {
							return params.tagger(
								$dkodaj$rte$MiniRte$Types$Internal(
									A2($dkodaj$rte$MiniRte$TypesThatAreNotPublic$MouseDown, x, y)));
						})))
			]) : _List_Nil;
		var highlight = A2($elm$core$Maybe$withDefault, $elm$core$Basics$identity, params.highlighter);
		var paragraphs = A2(
			$elm$core$List$map,
			$dkodaj$rte$MiniRte$Core$showPara(paraParams),
			$dkodaj$rte$MiniRte$Core$breakIntoParas(
				highlight(c.content)));
		var attrs = A2(
			$elm$core$List$cons,
			$rtfeldman$elm_css$Html$Styled$Attributes$id(params.editorID),
			_Utils_ap(
				listeners,
				_Utils_ap(
					A2(
						$elm$core$List$map,
						function (_v0) {
							var x = _v0.a;
							var y = _v0.b;
							return A2($rtfeldman$elm_css$Html$Styled$Attributes$style, x, y);
						},
						_List_fromArray(
							[
								_Utils_Tuple2('cursor', 'text'),
								_Utils_Tuple2('user-select', 'none'),
								_Utils_Tuple2('white-space', 'pre-wrap'),
								_Utils_Tuple2('word-break', 'break-word')
							])),
					params.userDefinedStyles)));
		return A3($rtfeldman$elm_css$Html$Styled$Keyed$node, 'div', attrs, paragraphs);
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$type_ = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('type');
var $rtfeldman$elm_css$Css$VhUnits = {$: 'VhUnits'};
var $rtfeldman$elm_css$Css$vh = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$VhUnits, 'vh');
var $rtfeldman$elm_css$Css$VwUnits = {$: 'VwUnits'};
var $rtfeldman$elm_css$Css$vw = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$VwUnits, 'vw');
var $rtfeldman$elm_css$Css$width = $rtfeldman$elm_css$Css$prop1('width');
var $rtfeldman$elm_css$Css$zIndex = $rtfeldman$elm_css$Css$prop1('z-index');
var $dkodaj$rte$MiniRte$Core$view = F3(
	function (tagger, userDefinedStyles, e) {
		var viewTextareaParams = {editorID: e.editorID, fontSizeUnit: e.fontSizeUnit, highlighter: e.highlighter, indentUnit: e.indentUnit, selectionStyle: e.selectionStyle, state: e.state, tagger: tagger, userDefinedStyles: userDefinedStyles};
		var viewTextareaContent = {content: e.content, cursor: e.cursor, selection: e.selection, typing: e.typing};
		var dummy = A2(
			$rtfeldman$elm_css$Html$Styled$map,
			tagger,
			A2(
				$rtfeldman$elm_css$Html$Styled$map,
				$dkodaj$rte$MiniRte$Types$Internal,
				A2(
					$rtfeldman$elm_css$Html$Styled$input,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$type_('text'),
							$rtfeldman$elm_css$Html$Styled$Attributes$id(
							$dkodaj$rte$MiniRte$Core$dummyID(e.editorID)),
							$rtfeldman$elm_css$Html$Styled$Attributes$autocomplete(false),
							A2(
							$rtfeldman$elm_css$Html$Styled$Events$on,
							'focus',
							$elm$json$Json$Decode$succeed(
								$dkodaj$rte$MiniRte$TypesThatAreNotPublic$SwitchTo($dkodaj$rte$MiniRte$TypesThatAreNotPublic$Edit))),
							A2(
							$rtfeldman$elm_css$Html$Styled$Events$on,
							'compositionend',
							A2(
								$elm$json$Json$Decode$map,
								$dkodaj$rte$MiniRte$TypesThatAreNotPublic$CompositionEnd,
								A2($elm$json$Json$Decode$field, 'data', $elm$json$Json$Decode$string))),
							A2(
							$rtfeldman$elm_css$Html$Styled$Events$on,
							'compositionstart',
							$elm$json$Json$Decode$succeed($dkodaj$rte$MiniRte$TypesThatAreNotPublic$CompositionStart)),
							A2(
							$rtfeldman$elm_css$Html$Styled$Events$on,
							'compositionupdate',
							A2(
								$elm$json$Json$Decode$map,
								$dkodaj$rte$MiniRte$TypesThatAreNotPublic$CompositionUpdate,
								A2($elm$json$Json$Decode$field, 'data', $elm$json$Json$Decode$string))),
							A2(
							$rtfeldman$elm_css$Html$Styled$Events$on,
							'input',
							$dkodaj$rte$MiniRte$Core$decodeInputAndTime($dkodaj$rte$MiniRte$TypesThatAreNotPublic$Input)),
							A2(
							$rtfeldman$elm_css$Html$Styled$Events$preventDefaultOn,
							'copy',
							$elm$json$Json$Decode$succeed(
								_Utils_Tuple2($dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoOp, true))),
							A2(
							$rtfeldman$elm_css$Html$Styled$Events$preventDefaultOn,
							'cut',
							$elm$json$Json$Decode$succeed(
								_Utils_Tuple2($dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoOp, true))),
							A2(
							$rtfeldman$elm_css$Html$Styled$Events$preventDefaultOn,
							'paste',
							$elm$json$Json$Decode$succeed(
								_Utils_Tuple2($dkodaj$rte$MiniRte$TypesThatAreNotPublic$NoOp, true))),
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$fixed),
									$rtfeldman$elm_css$Css$left(
									$rtfeldman$elm_css$Css$px(0)),
									$rtfeldman$elm_css$Css$top(
									$rtfeldman$elm_css$Css$px(0)),
									$rtfeldman$elm_css$Css$width(
									$rtfeldman$elm_css$Css$vw(99)),
									$rtfeldman$elm_css$Css$height(
									$rtfeldman$elm_css$Css$vh(99)),
									$rtfeldman$elm_css$Css$zIndex(
									$rtfeldman$elm_css$Css$int(-75500)),
									$rtfeldman$elm_css$Css$opacity(
									$rtfeldman$elm_css$Css$int(0))
								]))
						]),
					_List_Nil)));
		var _v0 = e.state;
		switch (_v0.$) {
			case 'Display':
				return A2(
					$dkodaj$rte$MiniRte$Core$showContent,
					viewTextareaParams,
					_Utils_update(
						viewTextareaContent,
						{cursor: -1, selection: $elm$core$Maybe$Nothing}));
			case 'Edit':
				return A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_List_Nil,
					_List_fromArray(
						[
							A3($rtfeldman$elm_css$Html$Styled$Lazy$lazy2, $dkodaj$rte$MiniRte$Core$showContent, viewTextareaParams, viewTextareaContent),
							dummy
						]));
			default:
				return A2(
					$rtfeldman$elm_css$Html$Styled$div,
					_List_Nil,
					_List_fromArray(
						[
							A3(
							$rtfeldman$elm_css$Html$Styled$Lazy$lazy2,
							$dkodaj$rte$MiniRte$Core$showContent,
							viewTextareaParams,
							_Utils_update(
								viewTextareaContent,
								{typing: true}))
						]));
		}
	});
var $dkodaj$rte$MiniRte$Styled$textarea = function (rte) {
	var styling = _Utils_eq(rte.textarea.state, $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Display) ? rte.styling.inactive : rte.styling.active;
	return A3($dkodaj$rte$MiniRte$Core$view, rte.tagger, styling, rte.textarea);
};
var $rtfeldman$elm_css$Html$Styled$toUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled;
var $rtfeldman$elm_css$VirtualDom$Styled$unstyledAttribute = function (prop) {
	return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, prop, _List_Nil, '');
};
var $rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$unstyledAttribute;
var $dkodaj$rte$MiniRte$tostyled = $elm$core$List$map($rtfeldman$elm_css$Html$Styled$Attributes$fromUnstyled);
var $dkodaj$rte$MiniRte$tostyled3 = function (a) {
	return {
		active: $dkodaj$rte$MiniRte$tostyled(a.active),
		inactive: $dkodaj$rte$MiniRte$tostyled(a.inactive)
	};
};
var $dkodaj$rte$MiniRte$tostyled2 = function (rte) {
	return {
		emojiBox: rte.emojiBox,
		inputBox: rte.inputBox,
		styling: $dkodaj$rte$MiniRte$tostyled3(rte.styling),
		tagger: rte.tagger,
		textarea: rte.textarea
	};
};
var $dkodaj$rte$MiniRte$textarea = function (rte) {
	return $rtfeldman$elm_css$Html$Styled$toUnstyled(
		$dkodaj$rte$MiniRte$Styled$textarea(
			$dkodaj$rte$MiniRte$tostyled2(rte)));
};
var $dkodaj$rte$MiniRte$Types$Bold = {$: 'Bold'};
var $dkodaj$rte$MiniRte$Types$Center = {$: 'Center'};
var $dkodaj$rte$MiniRte$Types$Class = function (a) {
	return {$: 'Class', a: a};
};
var $author$project$Main$DownloadContentStart = {$: 'DownloadContentStart'};
var $author$project$Main$FileSelect = {$: 'FileSelect'};
var $dkodaj$rte$MiniRte$Types$Heading = {$: 'Heading'};
var $dkodaj$rte$MiniRte$Types$Indent = {$: 'Indent'};
var $dkodaj$rte$MiniRte$Types$Italic = {$: 'Italic'};
var $dkodaj$rte$MiniRte$Types$Left = {$: 'Left'};
var $dkodaj$rte$MiniRte$Types$Right = {$: 'Right'};
var $dkodaj$rte$MiniRte$Types$StrikeThrough = {$: 'StrikeThrough'};
var $dkodaj$rte$MiniRte$Types$TextAlign = function (a) {
	return {$: 'TextAlign', a: a};
};
var $dkodaj$rte$MiniRte$Types$ToggleEmojiBox = {$: 'ToggleEmojiBox'};
var $dkodaj$rte$MiniRte$Types$ToggleImageBox = {$: 'ToggleImageBox'};
var $dkodaj$rte$MiniRte$Types$ToggleLinkBox = {$: 'ToggleLinkBox'};
var $dkodaj$rte$MiniRte$Types$Underline = {$: 'Underline'};
var $dkodaj$rte$MiniRte$Types$Undo = {$: 'Undo'};
var $dkodaj$rte$MiniRte$Types$Unindent = {$: 'Unindent'};
var $dkodaj$rte$MiniRte$Types$Unlink = {$: 'Unlink'};
var $dkodaj$rte$MiniRte$Types$AddText = function (a) {
	return {$: 'AddText', a: a};
};
var $rtfeldman$elm_css$Css$cursor = $rtfeldman$elm_css$Css$prop1('cursor');
var $rtfeldman$elm_css$Html$Styled$Events$onClick = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $rtfeldman$elm_css$Css$pointer = {cursor: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'pointer'};
var $dkodaj$rte$MiniRte$Styled$emojiBox = F2(
	function (rte, params) {
		var toDiv = function (x) {
			return A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Events$onClick(
						rte.tagger(
							$dkodaj$rte$MiniRte$Types$AddText(x))),
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer)
							]))
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text(x)
					]));
		};
		var styling = rte.emojiBox ? params.styling.active : params.styling.inactive;
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			styling,
			A2($elm$core$List$map, toDiv, params.emojis));
	});
var $dkodaj$rte$MiniRte$emojiBox = F2(
	function (rte, params) {
		var styledParams = {
			emojis: params.emojis,
			styling: $dkodaj$rte$MiniRte$tostyled3(params.styling)
		};
		return $rtfeldman$elm_css$Html$Styled$toUnstyled(
			A2(
				$dkodaj$rte$MiniRte$Styled$emojiBox,
				$dkodaj$rte$MiniRte$tostyled2(rte),
				styledParams));
	});
var $dkodaj$rte$MiniRte$Types$Font = function (a) {
	return {$: 'Font', a: a};
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$disabled = $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty('disabled');
var $rtfeldman$elm_css$Html$Styled$option = $rtfeldman$elm_css$Html$Styled$node('option');
var $rtfeldman$elm_css$Html$Styled$select = $rtfeldman$elm_css$Html$Styled$node('select');
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $dkodaj$rte$MiniRte$Styled$selectDecode = function (check) {
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
var $rtfeldman$elm_css$Html$Styled$Attributes$selected = $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty('selected');
var $rtfeldman$elm_css$Html$Styled$Attributes$value = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('value');
var $dkodaj$rte$MiniRte$Styled$fontSelector = F2(
	function (rte, params) {
		var msg = function (x) {
			var _v2 = A2(
				$elm$core$List$filter,
				function (a) {
					return _Utils_eq(
						$elm$core$List$head(a),
						$elm$core$Maybe$Just(x));
				},
				params.fonts);
			if (_v2.b) {
				var xs = _v2.a;
				return $elm$core$Maybe$Just(
					rte.tagger(
						$dkodaj$rte$MiniRte$Types$Font(xs)));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		};
		var maybeFontName = $elm$core$List$head(rte.textarea.fontStyle.fontFamily);
		var placeholder = A2(
			$rtfeldman$elm_css$Html$Styled$option,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$disabled(true),
					$rtfeldman$elm_css$Html$Styled$Attributes$selected(
					_Utils_eq(maybeFontName, $elm$core$Maybe$Nothing))
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text('font')
				]));
		var selected = function (x) {
			if (maybeFontName.$ === 'Nothing') {
				return false;
			} else {
				var y = maybeFontName.a;
				return _Utils_eq(x, y);
			}
		};
		var o = function (xs) {
			if (!xs.b) {
				return A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_Nil);
			} else {
				var x = xs.a;
				return A2(
					$rtfeldman$elm_css$Html$Styled$option,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$value(x),
							$rtfeldman$elm_css$Html$Styled$Attributes$selected(
							selected(x))
						]),
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text(x)
						]));
			}
		};
		return A2(
			$rtfeldman$elm_css$Html$Styled$select,
			A2(
				$elm$core$List$cons,
				A2(
					$rtfeldman$elm_css$Html$Styled$Events$on,
					'change',
					$dkodaj$rte$MiniRte$Styled$selectDecode(msg)),
				params.styling),
			A2(
				$elm$core$List$cons,
				placeholder,
				A2($elm$core$List$map, o, params.fonts)));
	});
var $dkodaj$rte$MiniRte$fontSelector = F2(
	function (rte, params) {
		var styledParams = {
			fonts: params.fonts,
			styling: $dkodaj$rte$MiniRte$tostyled(params.styling)
		};
		return $rtfeldman$elm_css$Html$Styled$toUnstyled(
			A2(
				$dkodaj$rte$MiniRte$Styled$fontSelector,
				$dkodaj$rte$MiniRte$tostyled2(rte),
				styledParams));
	});
var $dkodaj$rte$MiniRte$Types$FontSize = function (a) {
	return {$: 'FontSize', a: a};
};
var $elm$core$String$toFloat = _String_toFloat;
var $dkodaj$rte$MiniRte$Styled$fontSizeSelector = F2(
	function (rte, params) {
		var msg = function (x) {
			return A2(
				$elm$core$Maybe$map,
				A2($elm$core$Basics$composeL, rte.tagger, $dkodaj$rte$MiniRte$Types$FontSize),
				$elm$core$String$toFloat(x));
		};
		var maybeSize = rte.textarea.fontStyle.fontSize;
		var placeholder = A2(
			$rtfeldman$elm_css$Html$Styled$option,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$disabled(true),
					$rtfeldman$elm_css$Html$Styled$Attributes$selected(
					_Utils_eq(maybeSize, $elm$core$Maybe$Nothing))
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text('size')
				]));
		var selected = function (x) {
			if (maybeSize.$ === 'Nothing') {
				return false;
			} else {
				var y = maybeSize.a;
				return _Utils_eq(x, y);
			}
		};
		var o = function (x) {
			return A2(
				$rtfeldman$elm_css$Html$Styled$option,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$value(
						$elm$core$String$fromFloat(x)),
						$rtfeldman$elm_css$Html$Styled$Attributes$selected(
						selected(x))
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text(
						$elm$core$String$fromFloat(x))
					]));
		};
		return A2(
			$rtfeldman$elm_css$Html$Styled$select,
			A2(
				$elm$core$List$cons,
				A2(
					$rtfeldman$elm_css$Html$Styled$Events$on,
					'change',
					$dkodaj$rte$MiniRte$Styled$selectDecode(msg)),
				params.styling),
			A2(
				$elm$core$List$cons,
				placeholder,
				A2($elm$core$List$map, o, params.sizes)));
	});
var $dkodaj$rte$MiniRte$fontSizeSelector = F2(
	function (rte, params) {
		var styledParams = {
			sizes: params.sizes,
			styling: $dkodaj$rte$MiniRte$tostyled(params.styling)
		};
		return $rtfeldman$elm_css$Html$Styled$toUnstyled(
			A2(
				$dkodaj$rte$MiniRte$Styled$fontSizeSelector,
				$dkodaj$rte$MiniRte$tostyled2(rte),
				styledParams));
	});
var $elm$html$Html$img = _VirtualDom_node('img');
var $rtfeldman$elm_css$Html$Styled$button = $rtfeldman$elm_css$Html$Styled$node('button');
var $dkodaj$rte$MiniRte$Types$AddImage = function (a) {
	return {$: 'AddImage', a: a};
};
var $dkodaj$rte$MiniRte$Types$AddLink = function (a) {
	return {$: 'AddLink', a: a};
};
var $dkodaj$rte$MiniRte$Types$ImageSourceInput = function (a) {
	return {$: 'ImageSourceInput', a: a};
};
var $dkodaj$rte$MiniRte$Types$LinkHrefInput = function (a) {
	return {$: 'LinkHrefInput', a: a};
};
var $dkodaj$rte$MiniRte$Styled$inputBoxBehaviour = function (x) {
	if (x.$ === 'ImageInputBox') {
		var str = x.a;
		return {content: str, inputMsg: $dkodaj$rte$MiniRte$Types$ImageSourceInput, okMsg: $dkodaj$rte$MiniRte$Types$AddImage, placeholder: 'Image url'};
	} else {
		var str = x.a;
		return {content: str, inputMsg: $dkodaj$rte$MiniRte$Types$LinkHrefInput, okMsg: $dkodaj$rte$MiniRte$Types$AddLink, placeholder: 'Link url'};
	}
};
var $rtfeldman$elm_css$Html$Styled$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $rtfeldman$elm_css$Html$Styled$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $rtfeldman$elm_css$Html$Styled$Events$onInput = function (tagger) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$rtfeldman$elm_css$Html$Styled$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $rtfeldman$elm_css$Html$Styled$Events$targetValue)));
};
var $rtfeldman$elm_css$Html$Styled$Attributes$placeholder = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('placeholder');
var $dkodaj$rte$MiniRte$Styled$inputBox = F2(
	function (rte, params) {
		var _v0 = A2($elm$core$Maybe$map, $dkodaj$rte$MiniRte$Styled$inputBoxBehaviour, rte.inputBox);
		if (_v0.$ === 'Just') {
			var behaviour = _v0.a;
			var value = (behaviour.content === '') ? $rtfeldman$elm_css$Html$Styled$Attributes$placeholder(behaviour.placeholder) : $rtfeldman$elm_css$Html$Styled$Attributes$value(behaviour.content);
			return A2(
				$rtfeldman$elm_css$Html$Styled$div,
				params.styling.active,
				A2(
					$elm$core$List$map,
					$rtfeldman$elm_css$Html$Styled$map(rte.tagger),
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$input,
							_List_fromArray(
								[
									value,
									$rtfeldman$elm_css$Html$Styled$Attributes$type_('text'),
									$rtfeldman$elm_css$Html$Styled$Events$onInput(behaviour.inputMsg),
									$rtfeldman$elm_css$Html$Styled$Attributes$id(
									$dkodaj$rte$MiniRte$Common$inputBoxId(rte))
								]),
							_List_Nil),
							A2(
							$rtfeldman$elm_css$Html$Styled$button,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Events$onClick(
									behaviour.okMsg(behaviour.content))
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Ok')
								]))
						])));
		} else {
			return A2(
				$rtfeldman$elm_css$Html$Styled$div,
				params.styling.inactive,
				_List_fromArray(
					[
						A2(
						$rtfeldman$elm_css$Html$Styled$input,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Attributes$type_('text')
							]),
						_List_Nil),
						A2(
						$rtfeldman$elm_css$Html$Styled$button,
						_List_Nil,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$text('Ok')
							]))
					]));
		}
	});
var $dkodaj$rte$MiniRte$inputBox = F2(
	function (rte, params) {
		return $rtfeldman$elm_css$Html$Styled$toUnstyled(
			A2(
				$dkodaj$rte$MiniRte$Styled$inputBox,
				$dkodaj$rte$MiniRte$tostyled2(rte),
				{
					styling: $dkodaj$rte$MiniRte$tostyled3(params.styling)
				}));
	});
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
var $dkodaj$rte$MiniRte$Types$Active = function (a) {
	return {$: 'Active', a: a};
};
var $rtfeldman$elm_css$Css$Transitions$BackgroundColor = {$: 'BackgroundColor'};
var $rtfeldman$elm_css$Css$Transitions$Transition = function (a) {
	return {$: 'Transition', a: a};
};
var $rtfeldman$elm_css$Css$Transitions$durationTransition = F2(
	function (animation, duration) {
		return $rtfeldman$elm_css$Css$Transitions$Transition(
			{animation: animation, delay: $elm$core$Maybe$Nothing, duration: duration, timing: $elm$core$Maybe$Nothing});
	});
var $rtfeldman$elm_css$Css$Transitions$backgroundColor = $rtfeldman$elm_css$Css$Transitions$durationTransition($rtfeldman$elm_css$Css$Transitions$BackgroundColor);
var $rtfeldman$elm_css$Css$Structure$PseudoElement = function (a) {
	return {$: 'PseudoElement', a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$WithPseudoElement = F2(
	function (a, b) {
		return {$: 'WithPseudoElement', a: a, b: b};
	});
var $rtfeldman$elm_css$Css$pseudoElement = function (element) {
	return $rtfeldman$elm_css$Css$Preprocess$WithPseudoElement(
		$rtfeldman$elm_css$Css$Structure$PseudoElement(element));
};
var $rtfeldman$elm_css$Css$before = $rtfeldman$elm_css$Css$pseudoElement('before');
var $rtfeldman$elm_css$Css$borderRadius = $rtfeldman$elm_css$Css$prop1('border-radius');
var $rtfeldman$elm_css$Css$bottom = $rtfeldman$elm_css$Css$prop1('bottom');
var $rtfeldman$elm_css$Css$display = $rtfeldman$elm_css$Css$prop1('display');
var $rtfeldman$elm_css$Css$withPrecedingHash = function (str) {
	return A2($elm$core$String$startsWith, '#', str) ? str : A2(
		$elm$core$String$cons,
		_Utils_chr('#'),
		str);
};
var $rtfeldman$elm_css$Css$erroneousHex = function (str) {
	return {
		alpha: 1,
		blue: 0,
		color: $rtfeldman$elm_css$Css$Structure$Compatible,
		green: 0,
		red: 0,
		value: $rtfeldman$elm_css$Css$withPrecedingHash(str)
	};
};
var $elm$core$Basics$pow = _Basics_pow;
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char.valueOf()) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $elm$core$String$toLower = _String_toLower;
var $rtfeldman$elm_css$Css$validHex = F5(
	function (str, _v0, _v1, _v2, _v3) {
		var r1 = _v0.a;
		var r2 = _v0.b;
		var g1 = _v1.a;
		var g2 = _v1.b;
		var b1 = _v2.a;
		var b2 = _v2.b;
		var a1 = _v3.a;
		var a2 = _v3.b;
		var toResult = A2(
			$elm$core$Basics$composeR,
			$elm$core$String$fromList,
			A2($elm$core$Basics$composeR, $elm$core$String$toLower, $rtfeldman$elm_hex$Hex$fromString));
		var results = _Utils_Tuple2(
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[r1, r2])),
				toResult(
					_List_fromArray(
						[g1, g2]))),
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[b1, b2])),
				toResult(
					_List_fromArray(
						[a1, a2]))));
		if ((((results.a.a.$ === 'Ok') && (results.a.b.$ === 'Ok')) && (results.b.a.$ === 'Ok')) && (results.b.b.$ === 'Ok')) {
			var _v5 = results.a;
			var red = _v5.a.a;
			var green = _v5.b.a;
			var _v6 = results.b;
			var blue = _v6.a.a;
			var alpha = _v6.b.a;
			return {
				alpha: alpha / 255,
				blue: blue,
				color: $rtfeldman$elm_css$Css$Structure$Compatible,
				green: green,
				red: red,
				value: $rtfeldman$elm_css$Css$withPrecedingHash(str)
			};
		} else {
			return $rtfeldman$elm_css$Css$erroneousHex(str);
		}
	});
var $rtfeldman$elm_css$Css$hex = function (str) {
	var withoutHash = A2($elm$core$String$startsWith, '#', str) ? A2($elm$core$String$dropLeft, 1, str) : str;
	var _v0 = $elm$core$String$toList(withoutHash);
	_v0$4:
	while (true) {
		if ((_v0.b && _v0.b.b) && _v0.b.b.b) {
			if (!_v0.b.b.b.b) {
				var r = _v0.a;
				var _v1 = _v0.b;
				var g = _v1.a;
				var _v2 = _v1.b;
				var b = _v2.a;
				return A5(
					$rtfeldman$elm_css$Css$validHex,
					str,
					_Utils_Tuple2(r, r),
					_Utils_Tuple2(g, g),
					_Utils_Tuple2(b, b),
					_Utils_Tuple2(
						_Utils_chr('f'),
						_Utils_chr('f')));
			} else {
				if (!_v0.b.b.b.b.b) {
					var r = _v0.a;
					var _v3 = _v0.b;
					var g = _v3.a;
					var _v4 = _v3.b;
					var b = _v4.a;
					var _v5 = _v4.b;
					var a = _v5.a;
					return A5(
						$rtfeldman$elm_css$Css$validHex,
						str,
						_Utils_Tuple2(r, r),
						_Utils_Tuple2(g, g),
						_Utils_Tuple2(b, b),
						_Utils_Tuple2(a, a));
				} else {
					if (_v0.b.b.b.b.b.b) {
						if (!_v0.b.b.b.b.b.b.b) {
							var r1 = _v0.a;
							var _v6 = _v0.b;
							var r2 = _v6.a;
							var _v7 = _v6.b;
							var g1 = _v7.a;
							var _v8 = _v7.b;
							var g2 = _v8.a;
							var _v9 = _v8.b;
							var b1 = _v9.a;
							var _v10 = _v9.b;
							var b2 = _v10.a;
							return A5(
								$rtfeldman$elm_css$Css$validHex,
								str,
								_Utils_Tuple2(r1, r2),
								_Utils_Tuple2(g1, g2),
								_Utils_Tuple2(b1, b2),
								_Utils_Tuple2(
									_Utils_chr('f'),
									_Utils_chr('f')));
						} else {
							if (_v0.b.b.b.b.b.b.b.b && (!_v0.b.b.b.b.b.b.b.b.b)) {
								var r1 = _v0.a;
								var _v11 = _v0.b;
								var r2 = _v11.a;
								var _v12 = _v11.b;
								var g1 = _v12.a;
								var _v13 = _v12.b;
								var g2 = _v13.a;
								var _v14 = _v13.b;
								var b1 = _v14.a;
								var _v15 = _v14.b;
								var b2 = _v15.a;
								var _v16 = _v15.b;
								var a1 = _v16.a;
								var _v17 = _v16.b;
								var a2 = _v17.a;
								return A5(
									$rtfeldman$elm_css$Css$validHex,
									str,
									_Utils_Tuple2(r1, r2),
									_Utils_Tuple2(g1, g2),
									_Utils_Tuple2(b1, b2),
									_Utils_Tuple2(a1, a2));
							} else {
								break _v0$4;
							}
						}
					} else {
						break _v0$4;
					}
				}
			}
		} else {
			break _v0$4;
		}
	}
	return $rtfeldman$elm_css$Css$erroneousHex(str);
};
var $rtfeldman$elm_css$Css$inlineBlock = {display: $rtfeldman$elm_css$Css$Structure$Compatible, value: 'inline-block'};
var $rtfeldman$elm_css$Html$Styled$label = $rtfeldman$elm_css$Html$Styled$node('label');
var $rtfeldman$elm_css$Css$PcUnits = {$: 'PcUnits'};
var $rtfeldman$elm_css$Css$pc = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$PcUnits, 'pc');
var $rtfeldman$elm_css$Css$right = $rtfeldman$elm_css$Css$prop1('right');
var $rtfeldman$elm_css$Css$Transitions$Transform = {$: 'Transform'};
var $rtfeldman$elm_css$Css$Transitions$transform = $rtfeldman$elm_css$Css$Transitions$durationTransition($rtfeldman$elm_css$Css$Transitions$Transform);
var $rtfeldman$elm_css$Css$valuesOrNone = function (list) {
	return $elm$core$List$isEmpty(list) ? {value: 'none'} : {
		value: A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				function ($) {
					return $.value;
				},
				list))
	};
};
var $rtfeldman$elm_css$Css$transforms = A2(
	$elm$core$Basics$composeL,
	$rtfeldman$elm_css$Css$prop1('transform'),
	$rtfeldman$elm_css$Css$valuesOrNone);
var $rtfeldman$elm_css$Css$Transitions$propToString = function (prop) {
	switch (prop.$) {
		case 'Background':
			return 'background';
		case 'BackgroundColor':
			return 'background-color';
		case 'BackgroundPosition':
			return 'background-position';
		case 'BackgroundSize':
			return 'background-size';
		case 'Border':
			return 'border';
		case 'BorderBottom':
			return 'border-bottom';
		case 'BorderBottomColor':
			return 'border-bottom-color';
		case 'BorderBottomLeftRadius':
			return 'border-bottom-left-radius';
		case 'BorderBottomRightRadius':
			return 'border-bottom-right-radius';
		case 'BorderBottomWidth':
			return 'border-bottom-width';
		case 'BorderColor':
			return 'border-color';
		case 'BorderLeft':
			return 'border-left';
		case 'BorderLeftColor':
			return 'border-left-color';
		case 'BorderLeftWidth':
			return 'border-left-width';
		case 'BorderRadius':
			return 'border-radius';
		case 'BorderRight':
			return 'border-right';
		case 'BorderRightColor':
			return 'border-right-color';
		case 'BorderRightWidth':
			return 'border-right-width';
		case 'BorderTop':
			return 'border-top';
		case 'BorderTopColor':
			return 'border-top-color';
		case 'BorderTopLeftRadius':
			return 'border-top-left-radius';
		case 'BorderTopRightRadius':
			return 'border-top-right-radius';
		case 'BorderTopWidth':
			return 'border-top-width';
		case 'BorderWidth':
			return 'border-width';
		case 'Bottom':
			return 'bottom';
		case 'BoxShadow':
			return 'box-shadow';
		case 'CaretColor':
			return 'caret-color';
		case 'Clip':
			return 'clip';
		case 'ClipPath':
			return 'clip-path';
		case 'Color':
			return 'color';
		case 'ColumnCount':
			return 'column-count';
		case 'ColumnGap':
			return 'column-gap';
		case 'ColumnRule':
			return 'column-rule';
		case 'ColumnRuleColor':
			return 'column-rule-color';
		case 'ColumnRuleWidth':
			return 'column-rule-width';
		case 'ColumnWidth':
			return 'column-width';
		case 'Columns':
			return 'columns';
		case 'Filter':
			return 'filter';
		case 'Flex':
			return 'flex';
		case 'FlexBasis':
			return 'flex-basis';
		case 'FlexGrow':
			return 'flex-grow';
		case 'FlexShrink':
			return 'flex-shrink';
		case 'Font':
			return 'font';
		case 'FontSize':
			return 'font-size';
		case 'FontSizeAdjust':
			return 'font-size-adjust';
		case 'FontStretch':
			return 'font-stretch';
		case 'FontVariationSettings':
			return 'font-variation-settings';
		case 'FontWeight':
			return 'font-weight';
		case 'GridColumnGap':
			return 'grid-column-gap';
		case 'GridGap':
			return 'grid-gap';
		case 'GridRowGap':
			return 'grid-row-gap';
		case 'Height':
			return 'height';
		case 'Left':
			return 'left';
		case 'LetterSpacing':
			return 'letter-spacing';
		case 'LineHeight':
			return 'line-height';
		case 'Margin':
			return 'margin';
		case 'MarginBottom':
			return 'margin-bottom';
		case 'MarginLeft':
			return 'margin-left';
		case 'MarginRight':
			return 'margin-right';
		case 'MarginTop':
			return 'margin-top';
		case 'Mask':
			return 'mask';
		case 'MaskPosition':
			return 'mask-position';
		case 'MaskSize':
			return 'mask-size';
		case 'MaxHeight':
			return 'max-height';
		case 'MaxWidth':
			return 'max-width';
		case 'MinHeight':
			return 'min-height';
		case 'MinWidth':
			return 'min-width';
		case 'ObjectPosition':
			return 'object-position';
		case 'Offset':
			return 'offset';
		case 'OffsetAnchor':
			return 'offset-anchor';
		case 'OffsetDistance':
			return 'offset-distance';
		case 'OffsetPath':
			return 'offset-path';
		case 'OffsetRotate':
			return 'offset-rotate';
		case 'Opacity':
			return 'opacity';
		case 'Order':
			return 'order';
		case 'Outline':
			return 'outline';
		case 'OutlineColor':
			return 'outline-color';
		case 'OutlineOffset':
			return 'outline-offset';
		case 'OutlineWidth':
			return 'outline-width';
		case 'Padding':
			return 'padding';
		case 'PaddingBottom':
			return 'padding-bottom';
		case 'PaddingLeft':
			return 'padding-left';
		case 'PaddingRight':
			return 'padding-right';
		case 'PaddingTop':
			return 'padding-top';
		case 'Right':
			return 'right';
		case 'TabSize':
			return 'tab-size';
		case 'TextIndent':
			return 'text-indent';
		case 'TextShadow':
			return 'text-shadow';
		case 'Top':
			return 'top';
		case 'Transform':
			return 'transform';
		case 'TransformOrigin':
			return 'transform-origin';
		case 'VerticalAlign':
			return 'vertical-align';
		case 'Visibility':
			return 'visibility';
		case 'Width':
			return 'width';
		case 'WordSpacing':
			return 'word-spacing';
		default:
			return 'z-index';
	}
};
var $rtfeldman$elm_css$Css$Transitions$timeToString = function (time) {
	return $elm$core$String$fromFloat(time) + 'ms';
};
var $rtfeldman$elm_css$Css$Transitions$timingFunctionToString = function (tf) {
	switch (tf.$) {
		case 'Ease':
			return 'ease';
		case 'Linear':
			return 'linear';
		case 'EaseIn':
			return 'ease-in';
		case 'EaseOut':
			return 'ease-out';
		case 'EaseInOut':
			return 'ease-in-out';
		case 'StepStart':
			return 'step-start';
		case 'StepEnd':
			return 'step-end';
		default:
			var _float = tf.a;
			var float2 = tf.b;
			var float3 = tf.c;
			var float4 = tf.d;
			return 'cubic-bezier(' + ($elm$core$String$fromFloat(_float) + (' , ' + ($elm$core$String$fromFloat(float2) + (' , ' + ($elm$core$String$fromFloat(float3) + (' , ' + ($elm$core$String$fromFloat(float4) + ')')))))));
	}
};
var $rtfeldman$elm_css$Css$Transitions$transition = function (options) {
	var v = A3(
		$elm$core$String$slice,
		0,
		-1,
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, s) {
					var animation = _v0.a.animation;
					var duration = _v0.a.duration;
					var delay = _v0.a.delay;
					var timing = _v0.a.timing;
					return s + (A2(
						$elm$core$String$join,
						' ',
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$Transitions$propToString(animation),
								$rtfeldman$elm_css$Css$Transitions$timeToString(duration),
								A2(
								$elm$core$Maybe$withDefault,
								'',
								A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Transitions$timeToString, delay)),
								A2(
								$elm$core$Maybe$withDefault,
								'',
								A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Transitions$timingFunctionToString, timing))
							])) + ',');
				}),
			'',
			options));
	return A2($rtfeldman$elm_css$Css$property, 'transition', v);
};
var $rtfeldman$elm_css$Css$translateX = function (_v0) {
	var value = _v0.value;
	return {
		transform: $rtfeldman$elm_css$Css$Structure$Compatible,
		value: A2(
			$rtfeldman$elm_css$Css$cssFunction,
			'translateX',
			_List_fromArray(
				[value]))
	};
};
var $dkodaj$rte$MiniRte$Styled$onOffSwitch = F2(
	function (rte, params) {
		var _switch = _List_fromArray(
			[
				$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
				$rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$inlineBlock),
				$rtfeldman$elm_css$Css$height(
				$rtfeldman$elm_css$Css$px(0.57 * params.width)),
				$rtfeldman$elm_css$Css$width(
				$rtfeldman$elm_css$Css$px(params.width))
			]);
		var checked = !_Utils_eq(rte.textarea.state, $dkodaj$rte$MiniRte$TypesThatAreNotPublic$Display);
		var pos = checked ? $rtfeldman$elm_css$Css$transforms(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Css$translateX(
					$rtfeldman$elm_css$Css$px(0.43 * params.width))
				])) : $rtfeldman$elm_css$Css$transforms(_List_Nil);
		var sliderColor = checked ? params.activeColor : params.inactiveColor;
		var slider = _List_fromArray(
			[
				$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
				$rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
				$rtfeldman$elm_css$Css$top(
				$rtfeldman$elm_css$Css$px(0)),
				$rtfeldman$elm_css$Css$left(
				$rtfeldman$elm_css$Css$px(0)),
				$rtfeldman$elm_css$Css$right(
				$rtfeldman$elm_css$Css$px(0)),
				$rtfeldman$elm_css$Css$bottom(
				$rtfeldman$elm_css$Css$px(0)),
				A2($rtfeldman$elm_css$Css$property, 'background-color', sliderColor),
				$rtfeldman$elm_css$Css$Transitions$transition(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$Transitions$backgroundColor(400)
					])),
				$rtfeldman$elm_css$Css$borderRadius(
				$rtfeldman$elm_css$Css$px(0.57 * params.width)),
				$rtfeldman$elm_css$Css$before(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
						A2($rtfeldman$elm_css$Css$property, 'content', '\'\''),
						$rtfeldman$elm_css$Css$height(
						$rtfeldman$elm_css$Css$px(0.43 * params.width)),
						$rtfeldman$elm_css$Css$width(
						$rtfeldman$elm_css$Css$px(0.43 * params.width)),
						$rtfeldman$elm_css$Css$left(
						$rtfeldman$elm_css$Css$px(0.067 * params.width)),
						$rtfeldman$elm_css$Css$bottom(
						$rtfeldman$elm_css$Css$px(0.067 * params.width)),
						$rtfeldman$elm_css$Css$backgroundColor(
						$rtfeldman$elm_css$Css$hex('FFFFFF')),
						$rtfeldman$elm_css$Css$Transitions$transition(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$Transitions$transform(400)
							])),
						pos,
						$rtfeldman$elm_css$Css$borderRadius(
						$rtfeldman$elm_css$Css$pc(50))
					]))
			]);
		return A2(
			$rtfeldman$elm_css$Html$Styled$map,
			rte.tagger,
			A2(
				$rtfeldman$elm_css$Html$Styled$label,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(_switch)
					]),
				_List_fromArray(
					[
						A2(
						$rtfeldman$elm_css$Html$Styled$span,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Attributes$css(slider),
								$rtfeldman$elm_css$Html$Styled$Events$onClick(
								$dkodaj$rte$MiniRte$Types$Active(!checked))
							]),
						_List_Nil)
					])));
	});
var $dkodaj$rte$MiniRte$onOffSwitch = F2(
	function (rte, params) {
		return $rtfeldman$elm_css$Html$Styled$toUnstyled(
			A2(
				$dkodaj$rte$MiniRte$Styled$onOffSwitch,
				$dkodaj$rte$MiniRte$tostyled2(rte),
				params));
	});
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Main$toolbar = function (model) {
	var icon2 = F2(
		function (name, msg) {
			return A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src('icon/' + name),
						$elm$html$Html$Attributes$class('icon'),
						$elm$html$Html$Events$onClick(msg)
					]),
				_List_Nil);
		});
	var icon = F2(
		function (name, msg) {
			return A2(
				icon2,
				name,
				$author$project$Main$Rte(msg));
		});
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('toolbar')
			]),
		_List_fromArray(
			[
				A2(
				$dkodaj$rte$MiniRte$onOffSwitch,
				model.rte,
				{activeColor: '#2196F3', inactiveColor: '#ccc', width: 60}),
				A2(icon, 'Bold.svg', $dkodaj$rte$MiniRte$Types$Bold),
				A2(icon, 'Italic.svg', $dkodaj$rte$MiniRte$Types$Italic),
				A2(icon, 'Underline.svg', $dkodaj$rte$MiniRte$Types$Underline),
				A2(icon, 'Strikethrough.svg', $dkodaj$rte$MiniRte$Types$StrikeThrough),
				A2(icon, 'Undo.svg', $dkodaj$rte$MiniRte$Types$Undo),
				A2(
				icon,
				'Left.svg',
				$dkodaj$rte$MiniRte$Types$TextAlign($dkodaj$rte$MiniRte$Types$Left)),
				A2(
				icon,
				'Center.svg',
				$dkodaj$rte$MiniRte$Types$TextAlign($dkodaj$rte$MiniRte$Types$Center)),
				A2(
				icon,
				'Right.svg',
				$dkodaj$rte$MiniRte$Types$TextAlign($dkodaj$rte$MiniRte$Types$Right)),
				A2(icon, 'Unindent.svg', $dkodaj$rte$MiniRte$Types$Unindent),
				A2(icon, 'Indent.svg', $dkodaj$rte$MiniRte$Types$Indent),
				A2(icon, 'Heading.svg', $dkodaj$rte$MiniRte$Types$Heading),
				A2(
				icon,
				'Coding.svg',
				$dkodaj$rte$MiniRte$Types$Class('code')),
				A2(icon, 'Emoji.svg', $dkodaj$rte$MiniRte$Types$ToggleEmojiBox),
				A2(icon, 'Link.svg', $dkodaj$rte$MiniRte$Types$ToggleLinkBox),
				A2(icon, 'Unlink.svg', $dkodaj$rte$MiniRte$Types$Unlink),
				A2(icon, 'Picture.svg', $dkodaj$rte$MiniRte$Types$ToggleImageBox),
				A2(
				icon,
				'ListBullets.png',
				$dkodaj$rte$MiniRte$Types$Class('bullets')),
				A2(
				icon,
				'ListNumbered.png',
				$dkodaj$rte$MiniRte$Types$Class('numbered')),
				A2(
				$dkodaj$rte$MiniRte$fontSelector,
				model.rte,
				{
					fonts: _List_fromArray(
						[
							_List_fromArray(
							['Oswald', 'sans-serif']),
							_List_fromArray(
							['Playfair Display', 'serif']),
							_List_fromArray(
							['Ubuntu Mono', 'monospace'])
						]),
					styling: _List_fromArray(
						[
							$elm$html$Html$Attributes$class('select')
						])
				}),
				A2(
				$dkodaj$rte$MiniRte$fontSizeSelector,
				model.rte,
				{
					sizes: A2(
						$elm$core$List$map,
						$elm$core$Basics$toFloat,
						A2(
							$elm$core$List$map,
							function (a) {
								return 2 * a;
							},
							A2($elm$core$List$range, 3, 15))),
					styling: _List_fromArray(
						[
							$elm$html$Html$Attributes$class('select')
						])
				}),
				A2(icon2, 'Save.png', $author$project$Main$DownloadContentStart),
				A2(icon2, 'Open.svg', $author$project$Main$FileSelect),
				A2(
				$dkodaj$rte$MiniRte$emojiBox,
				model.rte,
				{
					emojis: _List_fromArray(
						['😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱']),
					styling: {
						active: _List_fromArray(
							[
								$elm$html$Html$Attributes$class('emoji-box')
							]),
						inactive: _List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'none')
							])
					}
				}),
				A2(
				$dkodaj$rte$MiniRte$inputBox,
				model.rte,
				{
					styling: {
						active: _List_fromArray(
							[
								$elm$html$Html$Attributes$class('input-box')
							]),
						inactive: _List_fromArray(
							[
								$elm$html$Html$Attributes$class('input-box'),
								A2($elm$html$Html$Attributes$style, 'visibility', 'hidden')
							])
					}
				})
			]));
};
var $author$project$Main$view = function (model) {
	return {
		body: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('body-wrap')
					]),
				_List_fromArray(
					[
						$author$project$Main$toolbar(model),
						$dkodaj$rte$MiniRte$textarea(model.rte),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://github.com/dkodaj/rte/tree/master/example'),
								$elm$html$Html$Attributes$class('source')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Source')
							])),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('icon-credits.html'),
								$elm$html$Html$Attributes$class('source')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Icon Credits')
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