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
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_enqueueEffects(managers, result.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, result.b, subscriptions(model));

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



// SEND REQUEST

var _Http_toTask = F2(function(request, maybeProgress)
{
	return _Scheduler_binding(function(callback)
	{
		var xhr = new XMLHttpRequest();

		_Http_configureProgress(xhr, maybeProgress);

		xhr.addEventListener('error', function() {
			callback(_Scheduler_fail($elm$http$Http$NetworkError));
		});
		xhr.addEventListener('timeout', function() {
			callback(_Scheduler_fail($elm$http$Http$Timeout));
		});
		xhr.addEventListener('load', function() {
			callback(_Http_handleResponse(xhr, request.expect.a));
		});

		try
		{
			xhr.open(request.method, request.url, true);
		}
		catch (e)
		{
			return callback(_Scheduler_fail($elm$http$Http$BadUrl(request.url)));
		}

		_Http_configureRequest(xhr, request);

		var body = request.body;
		xhr.send($elm$http$Http$Internal$isStringBody(body)
			? (xhr.setRequestHeader('Content-Type', body.a), body.b)
			: body.a
		);

		return function() { xhr.abort(); };
	});
});

function _Http_configureProgress(xhr, maybeProgress)
{
	if (!$elm$core$Maybe$isJust(maybeProgress))
	{
		return;
	}

	xhr.addEventListener('progress', function(event) {
		if (!event.lengthComputable)
		{
			return;
		}
		_Scheduler_rawSpawn(maybeProgress.a({
			bytes: event.loaded,
			bytesExpected: event.total
		}));
	});
}

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.headers; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}

	xhr.responseType = request.expect.b;
	xhr.withCredentials = request.withCredentials;

	$elm$core$Maybe$isJust(request.timeout) && (xhr.timeout = request.timeout.a);
}


// RESPONSES

function _Http_handleResponse(xhr, responseToResult)
{
	var response = _Http_toResponse(xhr);

	if (xhr.status < 200 || 300 <= xhr.status)
	{
		response.body = xhr.responseText;
		return _Scheduler_fail($elm$http$Http$BadStatus(response));
	}

	var result = responseToResult(response);

	if ($elm$core$Result$isOk(result))
	{
		return _Scheduler_succeed(result.a);
	}
	else
	{
		response.body = xhr.responseText;
		return _Scheduler_fail(A2($elm$http$Http$BadPayload, result.a, response));
	}
}

function _Http_toResponse(xhr)
{
	return {
		url: xhr.responseURL,
		status: { code: xhr.status, message: xhr.statusText },
		headers: _Http_parseHeaders(xhr.getAllResponseHeaders()),
		body: xhr.response
	};
}

function _Http_parseHeaders(rawHeaders)
{
	var headers = $elm$core$Dict$empty;

	if (!rawHeaders)
	{
		return headers;
	}

	var headerPairs = rawHeaders.split('\u000d\u000a');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf('\u003a\u0020');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}

	return headers;
}


// EXPECTORS

function _Http_expectStringResponse(responseToResult)
{
	return {
		$: 0,
		b: 'text',
		a: responseToResult
	};
}

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		b: expect.b,
		a: function(response) {
			var convertedResponse = expect.a(response);
			return A2($elm$core$Result$map, func, convertedResponse);
		}
	};
});


// BODY

function _Http_multipart(parts)
{


	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}

	return $elm$http$Http$Internal$FormDataBody(formData);
}




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}



// VIRTUAL-DOM WIDGETS


var _Markdown_toHtml = F3(function(options, factList, rawMarkdown)
{
	return _VirtualDom_custom(
		factList,
		{
			a: options,
			b: rawMarkdown
		},
		_Markdown_render,
		_Markdown_diff
	);
});



// WIDGET IMPLEMENTATION


function _Markdown_render(model)
{
	return A2(_Markdown_replace, model, _VirtualDom_doc.createElement('div'));
}


function _Markdown_diff(x, y)
{
	return x.b === y.b && x.a === y.a
		? false
		: _Markdown_replace(y);
}


var _Markdown_replace = F2(function(model, div)
{
	div.innerHTML = _Markdown_marked(model.b, _Markdown_formatOptions(model.a));
	return div;
});



// ACTUAL MARKDOWN PARSER


var _Markdown_marked = function() {
	// catch the `marked` object regardless of the outer environment.
	// (ex. a CommonJS module compatible environment.)
	// note that this depends on marked's implementation of environment detection.
	var module = {};
	var exports = module.exports = {};

	/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 * commit cd2f6f5b7091154c5526e79b5f3bfb4d15995a51
	 */
	(function(){var block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:noop,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:noop,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:noop,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};block.bullet=/(?:[*+-]|\d+\.)/;block.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item=replace(block.item,"gm")(/bull/g,block.bullet)();block.list=replace(block.list)(/bull/g,block.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+block.def.source+")")();block.blockquote=replace(block.blockquote)("def",block.def)();block._tag="(?!(?:"+"a|em|strong|small|s|cite|q|dfn|abbr|data|time|code"+"|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo"+"|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html=replace(block.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,block._tag)();block.paragraph=replace(block.paragraph)("hr",block.hr)("heading",block.heading)("lheading",block.lheading)("blockquote",block.blockquote)("tag","<"+block._tag)("def",block.def)();block.normal=merge({},block);block.gfm=merge({},block.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/});block.gfm.paragraph=replace(block.paragraph)("(?!","(?!"+block.gfm.fences.source.replace("\\1","\\2")+"|"+block.list.source.replace("\\1","\\3")+"|")();block.tables=merge({},block.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});function Lexer(options){this.tokens=[];this.tokens.links={};this.options=options||marked.defaults;this.rules=block.normal;if(this.options.gfm){if(this.options.tables){this.rules=block.tables}else{this.rules=block.gfm}}}Lexer.rules=block;Lexer.lex=function(src,options){var lexer=new Lexer(options);return lexer.lex(src)};Lexer.prototype.lex=function(src){src=src.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(src,true)};Lexer.prototype.token=function(src,top,bq){var src=src.replace(/^ +$/gm,""),next,loose,cap,bull,b,item,space,i,l;while(src){if(cap=this.rules.newline.exec(src)){src=src.substring(cap[0].length);if(cap[0].length>1){this.tokens.push({type:"space"})}}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);cap=cap[0].replace(/^ {4}/gm,"");this.tokens.push({type:"code",text:!this.options.pedantic?cap.replace(/\n+$/,""):cap});continue}if(cap=this.rules.fences.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"code",lang:cap[2],text:cap[3]||""});continue}if(cap=this.rules.heading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[1].length,text:cap[2]});continue}if(top&&(cap=this.rules.nptable.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].split(/ *\| */)}this.tokens.push(item);continue}if(cap=this.rules.lheading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[2]==="="?1:2,text:cap[1]});continue}if(cap=this.rules.hr.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"hr"});continue}if(cap=this.rules.blockquote.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"blockquote_start"});cap=cap[0].replace(/^ *> ?/gm,"");this.token(cap,top,true);this.tokens.push({type:"blockquote_end"});continue}if(cap=this.rules.list.exec(src)){src=src.substring(cap[0].length);bull=cap[2];this.tokens.push({type:"list_start",ordered:bull.length>1});cap=cap[0].match(this.rules.item);next=false;l=cap.length;i=0;for(;i<l;i++){item=cap[i];space=item.length;item=item.replace(/^ *([*+-]|\d+\.) +/,"");if(~item.indexOf("\n ")){space-=item.length;item=!this.options.pedantic?item.replace(new RegExp("^ {1,"+space+"}","gm"),""):item.replace(/^ {1,4}/gm,"")}if(this.options.smartLists&&i!==l-1){b=block.bullet.exec(cap[i+1])[0];if(bull!==b&&!(bull.length>1&&b.length>1)){src=cap.slice(i+1).join("\n")+src;i=l-1}}loose=next||/\n\n(?!\s*$)/.test(item);if(i!==l-1){next=item.charAt(item.length-1)==="\n";if(!loose)loose=next}this.tokens.push({type:loose?"loose_item_start":"list_item_start"});this.token(item,false,bq);this.tokens.push({type:"list_item_end"})}this.tokens.push({type:"list_end"});continue}if(cap=this.rules.html.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&(cap[1]==="pre"||cap[1]==="script"||cap[1]==="style"),text:cap[0]});continue}if(!bq&&top&&(cap=this.rules.def.exec(src))){src=src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()]={href:cap[2],title:cap[3]};continue}if(top&&(cap=this.rules.table.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */)}this.tokens.push(item);continue}if(top&&(cap=this.rules.paragraph.exec(src))){src=src.substring(cap[0].length);this.tokens.push({type:"paragraph",text:cap[1].charAt(cap[1].length-1)==="\n"?cap[1].slice(0,-1):cap[1]});continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"text",text:cap[0]});continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return this.tokens};var inline={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:noop,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^_\_([\s\S]+?)_\_(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|_\_)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:noop,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};inline._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link=replace(inline.link)("inside",inline._inside)("href",inline._href)();inline.reflink=replace(inline.reflink)("inside",inline._inside)();inline.normal=merge({},inline);inline.pedantic=merge({},inline.normal,{strong:/^_\_(?=\S)([\s\S]*?\S)_\_(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});inline.gfm=merge({},inline.normal,{escape:replace(inline.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:replace(inline.text)("]|","~]|")("|","|https?://|")()});inline.breaks=merge({},inline.gfm,{br:replace(inline.br)("{2,}","*")(),text:replace(inline.gfm.text)("{2,}","*")()});function InlineLexer(links,options){this.options=options||marked.defaults;this.links=links;this.rules=inline.normal;this.renderer=this.options.renderer||new Renderer;this.renderer.options=this.options;if(!this.links){throw new Error("Tokens array requires a `links` property.")}if(this.options.gfm){if(this.options.breaks){this.rules=inline.breaks}else{this.rules=inline.gfm}}else if(this.options.pedantic){this.rules=inline.pedantic}}InlineLexer.rules=inline;InlineLexer.output=function(src,links,options){var inline=new InlineLexer(links,options);return inline.output(src)};InlineLexer.prototype.output=function(src){var out="",link,text,href,cap;while(src){if(cap=this.rules.escape.exec(src)){src=src.substring(cap[0].length);out+=cap[1];continue}if(cap=this.rules.autolink.exec(src)){src=src.substring(cap[0].length);if(cap[2]==="@"){text=cap[1].charAt(6)===":"?this.mangle(cap[1].substring(7)):this.mangle(cap[1]);href=this.mangle("mailto:")+text}else{text=escape(cap[1]);href=text}out+=this.renderer.link(href,null,text);continue}if(!this.inLink&&(cap=this.rules.url.exec(src))){src=src.substring(cap[0].length);text=escape(cap[1]);href=text;out+=this.renderer.link(href,null,text);continue}if(cap=this.rules.tag.exec(src)){if(!this.inLink&&/^<a /i.test(cap[0])){this.inLink=true}else if(this.inLink&&/^<\/a>/i.test(cap[0])){this.inLink=false}src=src.substring(cap[0].length);out+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(cap[0]):escape(cap[0]):cap[0];continue}if(cap=this.rules.link.exec(src)){src=src.substring(cap[0].length);this.inLink=true;out+=this.outputLink(cap,{href:cap[2],title:cap[3]});this.inLink=false;continue}if((cap=this.rules.reflink.exec(src))||(cap=this.rules.nolink.exec(src))){src=src.substring(cap[0].length);link=(cap[2]||cap[1]).replace(/\s+/g," ");link=this.links[link.toLowerCase()];if(!link||!link.href){out+=cap[0].charAt(0);src=cap[0].substring(1)+src;continue}this.inLink=true;out+=this.outputLink(cap,link);this.inLink=false;continue}if(cap=this.rules.strong.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.strong(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.em.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.em(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.codespan(escape(cap[2],true));continue}if(cap=this.rules.br.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.br();continue}if(cap=this.rules.del.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.del(this.output(cap[1]));continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.text(escape(this.smartypants(cap[0])));continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return out};InlineLexer.prototype.outputLink=function(cap,link){var href=escape(link.href),title=link.title?escape(link.title):null;return cap[0].charAt(0)!=="!"?this.renderer.link(href,title,this.output(cap[1])):this.renderer.image(href,title,escape(cap[1]))};InlineLexer.prototype.smartypants=function(text){if(!this.options.smartypants)return text;return text.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014\/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")};InlineLexer.prototype.mangle=function(text){if(!this.options.mangle)return text;var out="",l=text.length,i=0,ch;for(;i<l;i++){ch=text.charCodeAt(i);if(Math.random()>.5){ch="x"+ch.toString(16)}out+="&#"+ch+";"}return out};function Renderer(options){this.options=options||{}}Renderer.prototype.code=function(code,lang,escaped){if(this.options.highlight){var out=this.options.highlight(code,lang);if(out!=null&&out!==code){escaped=true;code=out}}if(!lang){return"<pre><code>"+(escaped?code:escape(code,true))+"\n</code></pre>"}return'<pre><code class="'+this.options.langPrefix+escape(lang,true)+'">'+(escaped?code:escape(code,true))+"\n</code></pre>\n"};Renderer.prototype.blockquote=function(quote){return"<blockquote>\n"+quote+"</blockquote>\n"};Renderer.prototype.html=function(html){return html};Renderer.prototype.heading=function(text,level,raw){return"<h"+level+' id="'+this.options.headerPrefix+raw.toLowerCase().replace(/[^\w]+/g,"-")+'">'+text+"</h"+level+">\n"};Renderer.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"};Renderer.prototype.list=function(body,ordered){var type=ordered?"ol":"ul";return"<"+type+">\n"+body+"</"+type+">\n"};Renderer.prototype.listitem=function(text){return"<li>"+text+"</li>\n"};Renderer.prototype.paragraph=function(text){return"<p>"+text+"</p>\n"};Renderer.prototype.table=function(header,body){return"<table>\n"+"<thead>\n"+header+"</thead>\n"+"<tbody>\n"+body+"</tbody>\n"+"</table>\n"};Renderer.prototype.tablerow=function(content){return"<tr>\n"+content+"</tr>\n"};Renderer.prototype.tablecell=function(content,flags){var type=flags.header?"th":"td";var tag=flags.align?"<"+type+' style="text-align:'+flags.align+'">':"<"+type+">";return tag+content+"</"+type+">\n"};Renderer.prototype.strong=function(text){return"<strong>"+text+"</strong>"};Renderer.prototype.em=function(text){return"<em>"+text+"</em>"};Renderer.prototype.codespan=function(text){return"<code>"+text+"</code>"};Renderer.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"};Renderer.prototype.del=function(text){return"<del>"+text+"</del>"};Renderer.prototype.link=function(href,title,text){if(this.options.sanitize){try{var prot=decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(prot.indexOf("javascript:")===0||prot.indexOf("vbscript:")===0||prot.indexOf("data:")===0){return""}}var out='<a href="'+href+'"';if(title){out+=' title="'+title+'"'}out+=">"+text+"</a>";return out};Renderer.prototype.image=function(href,title,text){var out='<img src="'+href+'" alt="'+text+'"';if(title){out+=' title="'+title+'"'}out+=this.options.xhtml?"/>":">";return out};Renderer.prototype.text=function(text){return text};function Parser(options){this.tokens=[];this.token=null;this.options=options||marked.defaults;this.options.renderer=this.options.renderer||new Renderer;this.renderer=this.options.renderer;this.renderer.options=this.options}Parser.parse=function(src,options,renderer){var parser=new Parser(options,renderer);return parser.parse(src)};Parser.prototype.parse=function(src){this.inline=new InlineLexer(src.links,this.options,this.renderer);this.tokens=src.reverse();var out="";while(this.next()){out+=this.tok()}return out};Parser.prototype.next=function(){return this.token=this.tokens.pop()};Parser.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};Parser.prototype.parseText=function(){var body=this.token.text;while(this.peek().type==="text"){body+="\n"+this.next().text}return this.inline.output(body)};Parser.prototype.tok=function(){switch(this.token.type){case"space":{return""}case"hr":{return this.renderer.hr()}case"heading":{return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text)}case"code":{return this.renderer.code(this.token.text,this.token.lang,this.token.escaped)}case"table":{var header="",body="",i,row,cell,flags,j;cell="";for(i=0;i<this.token.header.length;i++){flags={header:true,align:this.token.align[i]};cell+=this.renderer.tablecell(this.inline.output(this.token.header[i]),{header:true,align:this.token.align[i]})}header+=this.renderer.tablerow(cell);for(i=0;i<this.token.cells.length;i++){row=this.token.cells[i];cell="";for(j=0;j<row.length;j++){cell+=this.renderer.tablecell(this.inline.output(row[j]),{header:false,align:this.token.align[j]})}body+=this.renderer.tablerow(cell)}return this.renderer.table(header,body)}case"blockquote_start":{var body="";while(this.next().type!=="blockquote_end"){body+=this.tok()}return this.renderer.blockquote(body)}case"list_start":{var body="",ordered=this.token.ordered;while(this.next().type!=="list_end"){body+=this.tok()}return this.renderer.list(body,ordered)}case"list_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.token.type==="text"?this.parseText():this.tok()}return this.renderer.listitem(body)}case"loose_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.tok()}return this.renderer.listitem(body)}case"html":{var html=!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;return this.renderer.html(html)}case"paragraph":{return this.renderer.paragraph(this.inline.output(this.token.text))}case"text":{return this.renderer.paragraph(this.parseText())}}};function escape(html,encode){return html.replace(!encode?/&(?!#?\w+;)/g:/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function unescape(html){return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g,function(_,n){n=n.toLowerCase();if(n==="colon")return":";if(n.charAt(0)==="#"){return n.charAt(1)==="x"?String.fromCharCode(parseInt(n.substring(2),16)):String.fromCharCode(+n.substring(1))}return""})}function replace(regex,opt){regex=regex.source;opt=opt||"";return function self(name,val){if(!name)return new RegExp(regex,opt);val=val.source||val;val=val.replace(/(^|[^\[])\^/g,"$1");regex=regex.replace(name,val);return self}}function noop(){}noop.exec=noop;function merge(obj){var i=1,target,key;for(;i<arguments.length;i++){target=arguments[i];for(key in target){if(Object.prototype.hasOwnProperty.call(target,key)){obj[key]=target[key]}}}return obj}function marked(src,opt,callback){if(callback||typeof opt==="function"){if(!callback){callback=opt;opt=null}opt=merge({},marked.defaults,opt||{});var highlight=opt.highlight,tokens,pending,i=0;try{tokens=Lexer.lex(src,opt)}catch(e){return callback(e)}pending=tokens.length;var done=function(err){if(err){opt.highlight=highlight;return callback(err)}var out;try{out=Parser.parse(tokens,opt)}catch(e){err=e}opt.highlight=highlight;return err?callback(err):callback(null,out)};if(!highlight||highlight.length<3){return done()}delete opt.highlight;if(!pending)return done();for(;i<tokens.length;i++){(function(token){if(token.type!=="code"){return--pending||done()}return highlight(token.text,token.lang,function(err,code){if(err)return done(err);if(code==null||code===token.text){return--pending||done()}token.text=code;token.escaped=true;--pending||done()})})(tokens[i])}return}try{if(opt)opt=merge({},marked.defaults,opt);return Parser.parse(Lexer.lex(src,opt),opt)}catch(e){e.message+="\nPlease report this to https://github.com/chjj/marked.";if((opt||marked.defaults).silent){return"<p>An error occured:</p><pre>"+escape(e.message+"",true)+"</pre>"}throw e}}marked.options=marked.setOptions=function(opt){merge(marked.defaults,opt);return marked};marked.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,sanitizer:null,mangle:true,smartLists:false,silent:false,highlight:null,langPrefix:"lang-",smartypants:false,headerPrefix:"",renderer:new Renderer,xhtml:false};marked.Parser=Parser;marked.parser=Parser.parse;marked.Renderer=Renderer;marked.Lexer=Lexer;marked.lexer=Lexer.lex;marked.InlineLexer=InlineLexer;marked.inlineLexer=InlineLexer.output;marked.parse=marked;if(typeof module!=="undefined"&&typeof exports==="object"){module.exports=marked}else if(typeof define==="function"&&define.amd){define(function(){return marked})}else{this.marked=marked}}).call(function(){return this||(typeof window!=="undefined"?window:global)}());

	return module.exports;
}();


// FORMAT OPTIONS FOR MARKED IMPLEMENTATION

function _Markdown_formatOptions(options)
{
	function toHighlight(code, lang)
	{
		if (!lang && $elm$core$Maybe$isJust(options.defaultHighlighting))
		{
			lang = options.defaultHighlighting.a;
		}

		if (typeof hljs !== 'undefined' && lang && hljs.listLanguages().indexOf(lang) >= 0)
		{
			return hljs.highlight(lang, code, true).value;
		}

		return code;
	}

	var gfm = options.githubFlavored.a;

	return {
		highlight: toHighlight,
		gfm: gfm,
		tables: gfm && gfm.tables,
		breaks: gfm && gfm.breaks,
		sanitize: options.sanitize,
		smartypants: options.smartypants
	};
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
var $author$project$Main$LinkClicked = function (a) {
	return {$: 'LinkClicked', a: a};
};
var $author$project$Main$UrlChanged = function (a) {
	return {$: 'UrlChanged', a: a};
};
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
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $author$project$Session$Data = F6(
	function (mountPoint, entries, releases, readmes, docs, outlines) {
		return {docs: docs, entries: entries, mountPoint: mountPoint, outlines: outlines, readmes: readmes, releases: releases};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $author$project$Session$empty = function (mount) {
	return A6($author$project$Session$Data, mount, $elm$core$Maybe$Nothing, $elm$core$Dict$empty, $elm$core$Dict$empty, $elm$core$Dict$empty, $elm$core$Dict$empty);
};
var $author$project$MountPoint$Root = {$: 'Root'};
var $author$project$MountPoint$Subpath = function (a) {
	return {$: 'Subpath', a: a};
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
var $elm$core$String$fromList = _String_fromList;
var $elm$core$Basics$not = _Basics_not;
var $author$project$MountPoint$splitPath = function (subpath) {
	return A2(
		$elm$core$List$filter,
		function (segment) {
			return !$elm$core$String$isEmpty(segment);
		},
		A2(
			$elm$core$String$split,
			'/',
			$elm$core$String$fromList(subpath)));
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$MountPoint$fromString = function (path) {
	var _v0 = $elm$core$String$toList(path);
	if (!_v0.b) {
		return $author$project$MountPoint$Root;
	} else {
		if ('/' === _v0.a.valueOf()) {
			if (!_v0.b.b) {
				return $author$project$MountPoint$Root;
			} else {
				var rest = _v0.b;
				return $author$project$MountPoint$Subpath(
					$author$project$MountPoint$splitPath(rest));
			}
		} else {
			var rest = _v0;
			return $author$project$MountPoint$Subpath(
				$author$project$MountPoint$splitPath(rest));
		}
	}
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$Flags$Flags = function (mountedAt) {
	return {mountedAt: mountedAt};
};
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Flags$decoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$Flags$Flags,
	A2($elm$json$Json$Decode$field, 'mountedAt', $elm$json$Json$Decode$string));
var $author$project$Flags$init = function (value) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Flags$decoder, value);
	if (_v0.$ === 'Ok') {
		var flags = _v0.a;
		return flags;
	} else {
		var error = _v0.a;
		return {mountedAt: '/'};
	}
};
var $elm$url$Url$Parser$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {frag: frag, params: params, unvisited: unvisited, value: value, visited: visited};
	});
var $elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return $elm$url$Url$Parser$Parser(
			function (_v0) {
				var visited = _v0.visited;
				var unvisited = _v0.unvisited;
				var params = _v0.params;
				var frag = _v0.frag;
				var value = _v0.value;
				if (!unvisited.b) {
					return _List_Nil;
				} else {
					var next = unvisited.a;
					var rest = unvisited.b;
					var _v2 = stringToSomething(next);
					if (_v2.$ === 'Just') {
						var nextValue = _v2.a;
						return _List_fromArray(
							[
								A5(
								$elm$url$Url$Parser$State,
								A2($elm$core$List$cons, next, visited),
								rest,
								params,
								frag,
								value(nextValue))
							]);
					} else {
						return _List_Nil;
					}
				}
			});
	});
var $author$project$Main$author_ = A2($elm$url$Url$Parser$custom, 'AUTHOR', $elm$core$Maybe$Just);
var $author$project$Main$exit = function (model) {
	var _v0 = model.page;
	switch (_v0.$) {
		case 'NotFound':
			var session = _v0.a;
			return session;
		case 'Search':
			var m = _v0.a;
			return m.session;
		case 'Docs':
			var m = _v0.a;
			return m.session;
		case 'Diff':
			var m = _v0.a;
			return m.session;
		default:
			var m = _v0.a;
			return m.session;
	}
};
var $author$project$Page$Docs$About = {$: 'About'};
var $author$project$Page$Docs$Module = F2(
	function (a, b) {
		return {$: 'Module', a: a, b: b};
	});
var $author$project$Page$Docs$Readme = {$: 'Readme'};
var $elm$url$Url$Parser$fragment = function (toFrag) {
	return $elm$url$Url$Parser$Parser(
		function (_v0) {
			var visited = _v0.visited;
			var unvisited = _v0.unvisited;
			var params = _v0.params;
			var frag = _v0.frag;
			var value = _v0.value;
			return _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					visited,
					unvisited,
					params,
					frag,
					value(
						toFrag(frag)))
				]);
		});
};
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.visited;
		var unvisited = _v0.unvisited;
		var params = _v0.params;
		var frag = _v0.frag;
		var value = _v0.value;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0.a;
		return $elm$url$Url$Parser$Parser(
			function (_v1) {
				var visited = _v1.visited;
				var unvisited = _v1.unvisited;
				var params = _v1.params;
				var frag = _v1.frag;
				var value = _v1.value;
				return A2(
					$elm$core$List$map,
					$elm$url$Url$Parser$mapState(value),
					parseArg(
						A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
			});
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$Main$moduleName_ = A2(
	$elm$url$Url$Parser$custom,
	'MODULE',
	A2(
		$elm$core$Basics$composeL,
		$elm$core$Maybe$Just,
		A2($elm$core$String$replace, '-', '.')));
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
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return $elm$url$Url$Parser$Parser(
		function (state) {
			return A2(
				$elm$core$List$concatMap,
				function (_v0) {
					var parser = _v0.a;
					return parser(state);
				},
				parsers);
		});
};
var $elm$url$Url$Parser$s = function (str) {
	return $elm$url$Url$Parser$Parser(
		function (_v0) {
			var visited = _v0.visited;
			var unvisited = _v0.unvisited;
			var params = _v0.params;
			var frag = _v0.frag;
			var value = _v0.value;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				return _Utils_eq(next, str) ? _List_fromArray(
					[
						A5(
						$elm$url$Url$Parser$State,
						A2($elm$core$List$cons, next, visited),
						rest,
						params,
						frag,
						value)
					]) : _List_Nil;
			}
		});
};
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0.a;
		var parseAfter = _v1.a;
		return $elm$url$Url$Parser$Parser(
			function (state) {
				return A2(
					$elm$core$List$concatMap,
					parseAfter,
					parseBefore(state));
			});
	});
var $elm$url$Url$Parser$top = $elm$url$Url$Parser$Parser(
	function (state) {
		return _List_fromArray(
			[state]);
	});
var $author$project$Main$focus_ = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2($elm$url$Url$Parser$map, $author$project$Page$Docs$Readme, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Page$Docs$About,
			$elm$url$Url$Parser$s('about')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Page$Docs$Module,
			A2(
				$elm$url$Url$Parser$slash,
				$author$project$Main$moduleName_,
				$elm$url$Url$Parser$fragment($elm$core$Basics$identity)))
		]));
var $author$project$Page$Diff$GotReleases = function (a) {
	return {$: 'GotReleases', a: a};
};
var $author$project$Page$Diff$Loading = {$: 'Loading'};
var $author$project$Page$Diff$Model = F4(
	function (session, author, project, releases) {
		return {author: author, project: project, releases: releases, session: session};
	});
var $author$project$Page$Diff$Success = function (a) {
	return {$: 'Success', a: a};
};
var $elm$url$Url$Builder$toQueryPair = function (_v0) {
	var key = _v0.a;
	var value = _v0.b;
	return key + ('=' + value);
};
var $elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			$elm$core$String$join,
			'&',
			A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var $elm$url$Url$Builder$absolute = F2(
	function (pathSegments, parameters) {
		return '/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters));
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $author$project$Utils$OneOrMore$OneOrMore = F2(
	function (a, b) {
		return {$: 'OneOrMore', a: a, b: b};
	});
var $author$project$Release$Release = F2(
	function (version, time) {
		return {time: time, version: version};
	});
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$project_metadata_utils$Elm$Version$Version = F3(
	function (a, b, c) {
		return {$: 'Version', a: a, b: b, c: c};
	});
var $elm$core$Basics$ge = _Utils_ge;
var $elm$project_metadata_utils$Elm$Version$checkNumbers = F3(
	function (major, minor, patch) {
		return ((major >= 0) && ((minor >= 0) && (patch >= 0))) ? $elm$core$Maybe$Just(
			A3($elm$project_metadata_utils$Elm$Version$Version, major, minor, patch)) : $elm$core$Maybe$Nothing;
	});
var $elm$project_metadata_utils$Elm$Version$fromString = function (string) {
	var _v0 = A2(
		$elm$core$List$map,
		$elm$core$String$toInt,
		A2($elm$core$String$split, '.', string));
	if ((((((_v0.b && (_v0.a.$ === 'Just')) && _v0.b.b) && (_v0.b.a.$ === 'Just')) && _v0.b.b.b) && (_v0.b.b.a.$ === 'Just')) && (!_v0.b.b.b.b)) {
		var major = _v0.a.a;
		var _v1 = _v0.b;
		var minor = _v1.a.a;
		var _v2 = _v1.b;
		var patch = _v2.a.a;
		return A3($elm$project_metadata_utils$Elm$Version$checkNumbers, major, minor, patch);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Release$decoderHelp = F2(
	function (revReleases, pairs) {
		decoderHelp:
		while (true) {
			if (!pairs.b) {
				var _v1 = $elm$core$List$reverse(revReleases);
				if (!_v1.b) {
					return $elm$json$Json$Decode$fail('Expecting at least one release!');
				} else {
					var r = _v1.a;
					var rs = _v1.b;
					return $elm$json$Json$Decode$succeed(
						A2($author$project$Utils$OneOrMore$OneOrMore, r, rs));
				}
			} else {
				var _v2 = pairs.a;
				var str = _v2.a;
				var time = _v2.b;
				var otherPairs = pairs.b;
				var _v3 = $elm$project_metadata_utils$Elm$Version$fromString(str);
				if (_v3.$ === 'Nothing') {
					return $elm$json$Json$Decode$fail('Field `' + (str + '` must be a valid version, like 3.1.4'));
				} else {
					var vsn = _v3.a;
					var $temp$revReleases = A2(
						$elm$core$List$cons,
						A2($author$project$Release$Release, vsn, time),
						revReleases),
						$temp$pairs = otherPairs;
					revReleases = $temp$revReleases;
					pairs = $temp$pairs;
					continue decoderHelp;
				}
			}
		}
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $author$project$Release$decoder = A2(
	$elm$json$Json$Decode$andThen,
	$author$project$Release$decoderHelp(_List_Nil),
	$elm$json$Json$Decode$keyValuePairs($elm$json$Json$Decode$int));
var $elm$http$Http$Internal$EmptyBody = {$: 'EmptyBody'};
var $elm$http$Http$emptyBody = $elm$http$Http$Internal$EmptyBody;
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$BadPayload = F2(
	function (a, b) {
		return {$: 'BadPayload', a: a, b: b};
	});
var $elm$http$Http$BadStatus = function (a) {
	return {$: 'BadStatus', a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 'BadUrl', a: a};
};
var $elm$http$Http$Internal$FormDataBody = function (a) {
	return {$: 'FormDataBody', a: a};
};
var $elm$http$Http$NetworkError = {$: 'NetworkError'};
var $elm$http$Http$Timeout = {$: 'Timeout'};
var $elm$core$Maybe$isJust = function (maybe) {
	if (maybe.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $elm$http$Http$Internal$isStringBody = function (body) {
	if (body.$ === 'StringBody') {
		return true;
	} else {
		return false;
	}
};
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
var $elm$http$Http$expectStringResponse = _Http_expectStringResponse;
var $elm$http$Http$expectJson = function (decoder) {
	return $elm$http$Http$expectStringResponse(
		function (response) {
			var _v0 = A2($elm$json$Json$Decode$decodeString, decoder, response.body);
			if (_v0.$ === 'Err') {
				var decodeError = _v0.a;
				return $elm$core$Result$Err(
					$elm$json$Json$Decode$errorToString(decodeError));
			} else {
				var value = _v0.a;
				return $elm$core$Result$Ok(value);
			}
		});
};
var $elm$http$Http$Internal$Request = function (a) {
	return {$: 'Request', a: a};
};
var $elm$http$Http$request = $elm$http$Http$Internal$Request;
var $elm$http$Http$get = F2(
	function (url, decoder) {
		return $elm$http$Http$request(
			{
				body: $elm$http$Http$emptyBody,
				expect: $elm$http$Http$expectJson(decoder),
				headers: _List_Nil,
				method: 'GET',
				timeout: $elm$core$Maybe$Nothing,
				url: url,
				withCredentials: false
			});
	});
var $author$project$Href$join = F2(
	function (mountPoint, path) {
		if (mountPoint.$ === 'Root') {
			return path;
		} else {
			var subpaths = mountPoint.a;
			return '/' + (A2($elm$core$String$join, '/', subpaths) + path);
		}
	});
var $author$project$Session$fetchReleases = F3(
	function (mount, author, project) {
		return A2(
			$elm$http$Http$get,
			A2(
				$author$project$Href$join,
				mount,
				A2(
					$elm$url$Url$Builder$absolute,
					_List_fromArray(
						['packages', author, project, 'releases.json']),
					_List_Nil)),
			$author$project$Release$decoder);
	});
var $author$project$Session$toPkgKey = F2(
	function (author, project) {
		return author + ('/' + project);
	});
var $author$project$Session$getReleases = F3(
	function (data, author, project) {
		return A2(
			$elm$core$Dict$get,
			A2($author$project$Session$toPkgKey, author, project),
			data.releases);
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
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
var $elm$http$Http$toTask = function (_v0) {
	var request_ = _v0.a;
	return A2(_Http_toTask, request_, $elm$core$Maybe$Nothing);
};
var $elm$http$Http$send = F2(
	function (resultToMessage, request_) {
		return A2(
			$elm$core$Task$attempt,
			resultToMessage,
			$elm$http$Http$toTask(request_));
	});
var $author$project$Page$Diff$init = F3(
	function (session, author, project) {
		var _v0 = A3($author$project$Session$getReleases, session, author, project);
		if (_v0.$ === 'Just') {
			var releases = _v0.a;
			return _Utils_Tuple2(
				A4(
					$author$project$Page$Diff$Model,
					session,
					author,
					project,
					$author$project$Page$Diff$Success(releases)),
				$elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(
				A4($author$project$Page$Diff$Model, session, author, project, $author$project$Page$Diff$Loading),
				A2(
					$elm$http$Http$send,
					$author$project$Page$Diff$GotReleases,
					A3($author$project$Session$fetchReleases, session.mountPoint, author, project)));
		}
	});
var $author$project$Page$Docs$GotReleases = function (a) {
	return {$: 'GotReleases', a: a};
};
var $author$project$Page$Docs$Loading = {$: 'Loading'};
var $author$project$Page$Docs$Model = function (session) {
	return function (author) {
		return function (project) {
			return function (version) {
				return function (focus) {
					return function (query) {
						return function (releases) {
							return function (readme) {
								return function (docs) {
									return function (outline) {
										return {author: author, docs: docs, focus: focus, outline: outline, project: project, query: query, readme: readme, releases: releases, session: session, version: version};
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
var $author$project$Page$Docs$Success = function (a) {
	return {$: 'Success', a: a};
};
var $author$project$Page$Docs$GotDocs = F2(
	function (a, b) {
		return {$: 'GotDocs', a: a, b: b};
	});
var $author$project$Page$Docs$GotOutline = F2(
	function (a, b) {
		return {$: 'GotOutline', a: a, b: b};
	});
var $author$project$Page$Docs$GotReadme = F2(
	function (a, b) {
		return {$: 'GotReadme', a: a, b: b};
	});
var $elm$project_metadata_utils$Elm$Docs$Module = F6(
	function (name, comment, unions, aliases, values, binops) {
		return {aliases: aliases, binops: binops, comment: comment, name: name, unions: unions, values: values};
	});
var $elm$project_metadata_utils$Elm$Docs$Alias = F4(
	function (name, comment, args, tipe) {
		return {args: args, comment: comment, name: name, tipe: tipe};
	});
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {col: col, problem: problem, row: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.row, p.col, p.problem);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 'Empty':
					return list;
				case 'AddRight':
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0.a;
		var _v1 = parse(
			{col: 1, context: _List_Nil, indent: 1, offset: 0, row: 1, src: src});
		if (_v1.$ === 'Good') {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (_v0.$ === 'Ok') {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $elm$parser$Parser$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Forbidden = {$: 'Forbidden'};
var $elm$project_metadata_utils$Elm$Type$Lambda = F2(
	function (a, b) {
		return {$: 'Lambda', a: a, b: b};
	});
var $elm$parser$Parser$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$project_metadata_utils$Elm$Type$Record = F2(
	function (a, b) {
		return {$: 'Record', a: a, b: b};
	});
var $elm$project_metadata_utils$Elm$Type$Type = F2(
	function (a, b) {
		return {$: 'Type', a: a, b: b};
	});
var $elm$project_metadata_utils$Elm$Type$Var = function (a) {
	return {$: 'Var', a: a};
};
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 'Bad', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 'Good', a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = function (a) {
	return {$: 'Parser', a: a};
};
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parseA(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					var _v2 = callback(a);
					var parseB = _v2.a;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
					}
				}
			});
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$ExpectingSymbol = function (a) {
	return {$: 'ExpectingSymbol', a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 'Token', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 'AddRight', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {col: col, contextStack: contextStack, problem: problem, row: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 'Empty'};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.row, s.col, x, s.context));
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.a;
			var newRow = _v1.b;
			var newCol = _v1.c;
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
				$elm$parser$Parser$Advanced$Good,
				progress,
				_Utils_Tuple0,
				{col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src});
		});
};
var $elm$parser$Parser$Advanced$symbol = $elm$parser$Parser$Advanced$token;
var $elm$parser$Parser$symbol = function (str) {
	return $elm$parser$Parser$Advanced$symbol(
		A2(
			$elm$parser$Parser$Advanced$Token,
			str,
			$elm$parser$Parser$ExpectingSymbol(str)));
};
var $elm$project_metadata_utils$Elm$Type$arrow = $elm$parser$Parser$symbol('->');
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0.a;
	return $elm$parser$Parser$Advanced$Parser(
		function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 'Bad') {
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, false, x);
			} else {
				var a = _v1.b;
				var s1 = _v1.c;
				return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
			}
		});
};
var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
var $elm$project_metadata_utils$Elm$Type$comma = $elm$parser$Parser$symbol(',');
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0.a;
		var parseB = _v1.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v2 = parseA(s0);
				if (_v2.$ === 'Bad') {
					var p = _v2.a;
					var x = _v2.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p1 = _v2.a;
					var a = _v2.b;
					var s1 = _v2.c;
					var _v3 = parseB(s1);
					if (_v3.$ === 'Bad') {
						var p2 = _v3.a;
						var x = _v3.b;
						return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
					} else {
						var p2 = _v3.a;
						var b = _v3.b;
						var s2 = _v3.c;
						return A3(
							$elm$parser$Parser$Advanced$Good,
							p1 || p2,
							A2(func, a, b),
							s2);
					}
				}
			});
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$core$Set$Set_elm_builtin = function (a) {
	return {$: 'Set_elm_builtin', a: a};
};
var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
var $elm$project_metadata_utils$Elm$Type$isInnerVarChar = function (_char) {
	return $elm$core$Char$isAlphaNum(_char) || _Utils_eq(
		_char,
		_Utils_chr('_'));
};
var $elm$parser$Parser$ExpectingVariable = {$: 'ExpectingVariable'};
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0.a;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$parser$Parser$Advanced$varHelp = F7(
	function (isGood, offset, row, col, src, indent, context) {
		varHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, src);
			if (_Utils_eq(newOffset, -1)) {
				return {col: col, context: context, indent: indent, offset: offset, row: row, src: src};
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$src = src,
						$temp$indent = indent,
						$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$src = src,
						$temp$indent = indent,
						$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$variable = function (i) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var firstOffset = A3($elm$parser$Parser$Advanced$isSubChar, i.start, s.offset, s.src);
			if (_Utils_eq(firstOffset, -1)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, i.expecting));
			} else {
				var s1 = _Utils_eq(firstOffset, -2) ? A7($elm$parser$Parser$Advanced$varHelp, i.inner, s.offset + 1, s.row + 1, 1, s.src, s.indent, s.context) : A7($elm$parser$Parser$Advanced$varHelp, i.inner, firstOffset, s.row, s.col + 1, s.src, s.indent, s.context);
				var name = A3($elm$core$String$slice, s.offset, s1.offset, s.src);
				return A2($elm$core$Set$member, name, i.reserved) ? A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, i.expecting)) : A3($elm$parser$Parser$Advanced$Good, true, name, s1);
			}
		});
};
var $elm$parser$Parser$variable = function (i) {
	return $elm$parser$Parser$Advanced$variable(
		{expecting: $elm$parser$Parser$ExpectingVariable, inner: i.inner, reserved: i.reserved, start: i.start});
};
var $elm$project_metadata_utils$Elm$Type$var = function (isFirst) {
	return $elm$parser$Parser$variable(
		{inner: $elm$project_metadata_utils$Elm$Type$isInnerVarChar, reserved: $elm$core$Set$empty, start: isFirst});
};
var $elm$project_metadata_utils$Elm$Type$lowVar = $elm$project_metadata_utils$Elm$Type$var($elm$core$Char$isLower);
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 'Append', a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
		});
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.offset, offset) < 0,
					_Utils_Tuple0,
					{col: col, context: s0.context, indent: s0.indent, offset: offset, row: row, src: s0.src});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.offset, s.row, s.col, s);
		});
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$project_metadata_utils$Elm$Type$spaces = $elm$parser$Parser$chompWhile(
	function (_char) {
		return _Utils_eq(
			_char,
			_Utils_chr(' '));
	});
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			return A3($elm$parser$Parser$Advanced$Good, false, a, s);
		});
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $elm$project_metadata_utils$Elm$Type$extension = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($elm$core$Maybe$Just),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$backtrackable($elm$project_metadata_utils$Elm$Type$lowVar),
						$elm$parser$Parser$backtrackable($elm$project_metadata_utils$Elm$Type$spaces)),
					$elm$parser$Parser$symbol('|')),
				$elm$project_metadata_utils$Elm$Type$spaces)),
			$elm$parser$Parser$succeed($elm$core$Maybe$Nothing)
		]));
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return $elm$parser$Parser$Advanced$Parser(
		function (s) {
			var _v0 = thunk(_Utils_Tuple0);
			var parse = _v0.a;
			return parse(s);
		});
};
var $elm$parser$Parser$lazy = $elm$parser$Parser$Advanced$lazy;
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0.a;
			var _v1 = parse(s0);
			if (_v1.$ === 'Good') {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (step.$ === 'Loop') {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return $elm$parser$Parser$Advanced$Parser(
			function (s) {
				return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
			});
	});
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Good') {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						func(a),
						s1);
				} else {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				}
			});
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (step.$ === 'Loop') {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$project_metadata_utils$Elm$Type$capVar = $elm$project_metadata_utils$Elm$Type$var($elm$core$Char$isUpper);
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0.a;
		return $elm$parser$Parser$Advanced$Parser(
			function (s0) {
				var _v1 = parse(s0);
				if (_v1.$ === 'Bad') {
					var p = _v1.a;
					var x = _v1.b;
					return A2($elm$parser$Parser$Advanced$Bad, p, x);
				} else {
					var p = _v1.a;
					var a = _v1.b;
					var s1 = _v1.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p,
						A2(
							func,
							A3($elm$core$String$slice, s0.offset, s1.offset, s0.src),
							a),
						s1);
				}
			});
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $elm$project_metadata_utils$Elm$Type$qualifiedCapVarHelp = function (_v0) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						$elm$parser$Parser$Loop(_Utils_Tuple0)),
					$elm$parser$Parser$symbol('.')),
				$elm$project_metadata_utils$Elm$Type$capVar),
				$elm$parser$Parser$succeed(
				$elm$parser$Parser$Done(_Utils_Tuple0))
			]));
};
var $elm$project_metadata_utils$Elm$Type$qualifiedCapVar = $elm$parser$Parser$getChompedString(
	A2(
		$elm$parser$Parser$ignorer,
		$elm$project_metadata_utils$Elm$Type$capVar,
		A2($elm$parser$Parser$loop, _Utils_Tuple0, $elm$project_metadata_utils$Elm$Type$qualifiedCapVarHelp)));
var $elm$parser$Parser$Advanced$revAlways = F2(
	function (_v0, b) {
		return b;
	});
var $elm$parser$Parser$Advanced$skip = F2(
	function (iParser, kParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$parser$Parser$Advanced$revAlways, iParser, kParser);
	});
var $elm$parser$Parser$Advanced$sequenceEndForbidden = F5(
	function (ender, ws, parseItem, sep, revItems) {
		var chompRest = function (item) {
			return A5(
				$elm$parser$Parser$Advanced$sequenceEndForbidden,
				ender,
				ws,
				parseItem,
				sep,
				A2($elm$core$List$cons, item, revItems));
		};
		return A2(
			$elm$parser$Parser$Advanced$skip,
			ws,
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$Advanced$skip,
						sep,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							A2(
								$elm$parser$Parser$Advanced$map,
								function (item) {
									return $elm$parser$Parser$Advanced$Loop(
										A2($elm$core$List$cons, item, revItems));
								},
								parseItem))),
						A2(
						$elm$parser$Parser$Advanced$map,
						function (_v0) {
							return $elm$parser$Parser$Advanced$Done(
								$elm$core$List$reverse(revItems));
						},
						ender)
					])));
	});
var $elm$parser$Parser$Advanced$sequenceEndMandatory = F4(
	function (ws, parseItem, sep, revItems) {
		return $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$parser$Parser$Advanced$map,
					function (item) {
						return $elm$parser$Parser$Advanced$Loop(
							A2($elm$core$List$cons, item, revItems));
					},
					A2(
						$elm$parser$Parser$Advanced$ignorer,
						parseItem,
						A2(
							$elm$parser$Parser$Advanced$ignorer,
							ws,
							A2($elm$parser$Parser$Advanced$ignorer, sep, ws)))),
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return $elm$parser$Parser$Advanced$Done(
							$elm$core$List$reverse(revItems));
					},
					$elm$parser$Parser$Advanced$succeed(_Utils_Tuple0))
				]));
	});
var $elm$parser$Parser$Advanced$sequenceEndOptional = F5(
	function (ender, ws, parseItem, sep, revItems) {
		var parseEnd = A2(
			$elm$parser$Parser$Advanced$map,
			function (_v0) {
				return $elm$parser$Parser$Advanced$Done(
					$elm$core$List$reverse(revItems));
			},
			ender);
		return A2(
			$elm$parser$Parser$Advanced$skip,
			ws,
			$elm$parser$Parser$Advanced$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$Advanced$skip,
						sep,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							$elm$parser$Parser$Advanced$oneOf(
								_List_fromArray(
									[
										A2(
										$elm$parser$Parser$Advanced$map,
										function (item) {
											return $elm$parser$Parser$Advanced$Loop(
												A2($elm$core$List$cons, item, revItems));
										},
										parseItem),
										parseEnd
									])))),
						parseEnd
					])));
	});
var $elm$parser$Parser$Advanced$sequenceEnd = F5(
	function (ender, ws, parseItem, sep, trailing) {
		var chompRest = function (item) {
			switch (trailing.$) {
				case 'Forbidden':
					return A2(
						$elm$parser$Parser$Advanced$loop,
						_List_fromArray(
							[item]),
						A4($elm$parser$Parser$Advanced$sequenceEndForbidden, ender, ws, parseItem, sep));
				case 'Optional':
					return A2(
						$elm$parser$Parser$Advanced$loop,
						_List_fromArray(
							[item]),
						A4($elm$parser$Parser$Advanced$sequenceEndOptional, ender, ws, parseItem, sep));
				default:
					return A2(
						$elm$parser$Parser$Advanced$ignorer,
						A2(
							$elm$parser$Parser$Advanced$skip,
							ws,
							A2(
								$elm$parser$Parser$Advanced$skip,
								sep,
								A2(
									$elm$parser$Parser$Advanced$skip,
									ws,
									A2(
										$elm$parser$Parser$Advanced$loop,
										_List_fromArray(
											[item]),
										A3($elm$parser$Parser$Advanced$sequenceEndMandatory, ws, parseItem, sep))))),
						ender);
			}
		};
		return $elm$parser$Parser$Advanced$oneOf(
			_List_fromArray(
				[
					A2($elm$parser$Parser$Advanced$andThen, chompRest, parseItem),
					A2(
					$elm$parser$Parser$Advanced$map,
					function (_v0) {
						return _List_Nil;
					},
					ender)
				]));
	});
var $elm$parser$Parser$Advanced$sequence = function (i) {
	return A2(
		$elm$parser$Parser$Advanced$skip,
		$elm$parser$Parser$Advanced$token(i.start),
		A2(
			$elm$parser$Parser$Advanced$skip,
			i.spaces,
			A5(
				$elm$parser$Parser$Advanced$sequenceEnd,
				$elm$parser$Parser$Advanced$token(i.end),
				i.spaces,
				i.item,
				$elm$parser$Parser$Advanced$token(i.separator),
				i.trailing)));
};
var $elm$parser$Parser$Advanced$Forbidden = {$: 'Forbidden'};
var $elm$parser$Parser$Advanced$Mandatory = {$: 'Mandatory'};
var $elm$parser$Parser$Advanced$Optional = {$: 'Optional'};
var $elm$parser$Parser$toAdvancedTrailing = function (trailing) {
	switch (trailing.$) {
		case 'Forbidden':
			return $elm$parser$Parser$Advanced$Forbidden;
		case 'Optional':
			return $elm$parser$Parser$Advanced$Optional;
		default:
			return $elm$parser$Parser$Advanced$Mandatory;
	}
};
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 'Expecting', a: a};
};
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$sequence = function (i) {
	return $elm$parser$Parser$Advanced$sequence(
		{
			end: $elm$parser$Parser$toToken(i.end),
			item: i.item,
			separator: $elm$parser$Parser$toToken(i.separator),
			spaces: i.spaces,
			start: $elm$parser$Parser$toToken(i.start),
			trailing: $elm$parser$Parser$toAdvancedTrailing(i.trailing)
		});
};
var $elm$project_metadata_utils$Elm$Type$Tuple = function (a) {
	return {$: 'Tuple', a: a};
};
var $elm$project_metadata_utils$Elm$Type$tuplize = function (args) {
	if (args.b && (!args.b.b)) {
		var arg = args.a;
		return arg;
	} else {
		return $elm$project_metadata_utils$Elm$Type$Tuple(args);
	}
};
var $elm$project_metadata_utils$Elm$Type$chompArgs = function (revArgs) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				function (arg) {
					return $elm$parser$Parser$Loop(
						A2($elm$core$List$cons, arg, revArgs));
				},
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed($elm$core$Basics$identity),
						$elm$parser$Parser$backtrackable($elm$project_metadata_utils$Elm$Type$spaces)),
					$elm$project_metadata_utils$Elm$Type$cyclic$term())),
				A2(
				$elm$parser$Parser$map,
				function (_v2) {
					return $elm$parser$Parser$Done(
						$elm$core$List$reverse(revArgs));
				},
				$elm$parser$Parser$succeed(_Utils_Tuple0))
			]));
};
var $elm$project_metadata_utils$Elm$Type$recordEndHelp = function (revFields) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(
							function (f) {
								return $elm$parser$Parser$Loop(
									A2($elm$core$List$cons, f, revFields));
							}),
						$elm$project_metadata_utils$Elm$Type$comma),
					$elm$project_metadata_utils$Elm$Type$spaces),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$project_metadata_utils$Elm$Type$cyclic$field(),
					$elm$project_metadata_utils$Elm$Type$spaces)),
				A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					function (_v1) {
						return $elm$parser$Parser$Done(
							$elm$core$List$reverse(revFields));
					}),
				$elm$parser$Parser$symbol('}'))
			]));
};
var $elm$project_metadata_utils$Elm$Type$tipeHelp = function (t) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$map,
				$elm$project_metadata_utils$Elm$Type$Lambda(t),
				$elm$project_metadata_utils$Elm$Type$cyclic$arrowAndType()),
				$elm$parser$Parser$succeed(t)
			]));
};
function $elm$project_metadata_utils$Elm$Type$cyclic$arrowAndType() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$backtrackable($elm$project_metadata_utils$Elm$Type$spaces)),
				$elm$project_metadata_utils$Elm$Type$arrow),
			$elm$project_metadata_utils$Elm$Type$spaces),
		$elm$project_metadata_utils$Elm$Type$cyclic$tipe());
}
function $elm$project_metadata_utils$Elm$Type$cyclic$tipeTerm() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2($elm$parser$Parser$map, $elm$project_metadata_utils$Elm$Type$Var, $elm$project_metadata_utils$Elm$Type$lowVar),
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$keeper,
					$elm$parser$Parser$succeed($elm$project_metadata_utils$Elm$Type$Type),
					$elm$project_metadata_utils$Elm$Type$qualifiedCapVar),
				A2($elm$parser$Parser$loop, _List_Nil, $elm$project_metadata_utils$Elm$Type$chompArgs)),
				$elm$project_metadata_utils$Elm$Type$cyclic$record(),
				$elm$project_metadata_utils$Elm$Type$cyclic$tuple()
			]));
}
function $elm$project_metadata_utils$Elm$Type$cyclic$term() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2($elm$parser$Parser$map, $elm$project_metadata_utils$Elm$Type$Var, $elm$project_metadata_utils$Elm$Type$lowVar),
				A2(
				$elm$parser$Parser$map,
				function (name) {
					return A2($elm$project_metadata_utils$Elm$Type$Type, name, _List_Nil);
				},
				$elm$project_metadata_utils$Elm$Type$qualifiedCapVar),
				$elm$project_metadata_utils$Elm$Type$cyclic$record(),
				$elm$project_metadata_utils$Elm$Type$cyclic$tuple()
			]));
}
function $elm$project_metadata_utils$Elm$Type$cyclic$record() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						F2(
							function (ext, fs) {
								return A2($elm$project_metadata_utils$Elm$Type$Record, fs, ext);
							})),
					$elm$parser$Parser$symbol('{')),
				$elm$project_metadata_utils$Elm$Type$spaces),
			$elm$project_metadata_utils$Elm$Type$extension),
		$elm$project_metadata_utils$Elm$Type$cyclic$recordEnd());
}
function $elm$project_metadata_utils$Elm$Type$cyclic$recordEnd() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				function (f) {
					return A2(
						$elm$parser$Parser$loop,
						_List_fromArray(
							[f]),
						$elm$project_metadata_utils$Elm$Type$recordEndHelp);
				},
				A2(
					$elm$parser$Parser$ignorer,
					$elm$project_metadata_utils$Elm$Type$cyclic$field(),
					$elm$project_metadata_utils$Elm$Type$spaces)),
				A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(_List_Nil),
				$elm$parser$Parser$symbol('}'))
			]));
}
function $elm$project_metadata_utils$Elm$Type$cyclic$field() {
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($elm$core$Tuple$pair),
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					A2($elm$parser$Parser$ignorer, $elm$project_metadata_utils$Elm$Type$lowVar, $elm$project_metadata_utils$Elm$Type$spaces),
					$elm$parser$Parser$symbol(':')),
				$elm$project_metadata_utils$Elm$Type$spaces)),
		$elm$project_metadata_utils$Elm$Type$cyclic$tipe());
}
function $elm$project_metadata_utils$Elm$Type$cyclic$tuple() {
	return A2(
		$elm$parser$Parser$map,
		$elm$project_metadata_utils$Elm$Type$tuplize,
		$elm$parser$Parser$sequence(
			{
				end: ')',
				item: $elm$project_metadata_utils$Elm$Type$cyclic$tipe(),
				separator: ',',
				spaces: $elm$project_metadata_utils$Elm$Type$spaces,
				start: '(',
				trailing: $elm$parser$Parser$Forbidden
			}));
}
function $elm$project_metadata_utils$Elm$Type$cyclic$tipe() {
	return $elm$parser$Parser$lazy(
		function (_v0) {
			return A2(
				$elm$parser$Parser$andThen,
				$elm$project_metadata_utils$Elm$Type$tipeHelp,
				$elm$project_metadata_utils$Elm$Type$cyclic$tipeTerm());
		});
}
try {
	var $elm$project_metadata_utils$Elm$Type$arrowAndType = $elm$project_metadata_utils$Elm$Type$cyclic$arrowAndType();
	$elm$project_metadata_utils$Elm$Type$cyclic$arrowAndType = function () {
		return $elm$project_metadata_utils$Elm$Type$arrowAndType;
	};
	var $elm$project_metadata_utils$Elm$Type$tipeTerm = $elm$project_metadata_utils$Elm$Type$cyclic$tipeTerm();
	$elm$project_metadata_utils$Elm$Type$cyclic$tipeTerm = function () {
		return $elm$project_metadata_utils$Elm$Type$tipeTerm;
	};
	var $elm$project_metadata_utils$Elm$Type$term = $elm$project_metadata_utils$Elm$Type$cyclic$term();
	$elm$project_metadata_utils$Elm$Type$cyclic$term = function () {
		return $elm$project_metadata_utils$Elm$Type$term;
	};
	var $elm$project_metadata_utils$Elm$Type$record = $elm$project_metadata_utils$Elm$Type$cyclic$record();
	$elm$project_metadata_utils$Elm$Type$cyclic$record = function () {
		return $elm$project_metadata_utils$Elm$Type$record;
	};
	var $elm$project_metadata_utils$Elm$Type$recordEnd = $elm$project_metadata_utils$Elm$Type$cyclic$recordEnd();
	$elm$project_metadata_utils$Elm$Type$cyclic$recordEnd = function () {
		return $elm$project_metadata_utils$Elm$Type$recordEnd;
	};
	var $elm$project_metadata_utils$Elm$Type$field = $elm$project_metadata_utils$Elm$Type$cyclic$field();
	$elm$project_metadata_utils$Elm$Type$cyclic$field = function () {
		return $elm$project_metadata_utils$Elm$Type$field;
	};
	var $elm$project_metadata_utils$Elm$Type$tuple = $elm$project_metadata_utils$Elm$Type$cyclic$tuple();
	$elm$project_metadata_utils$Elm$Type$cyclic$tuple = function () {
		return $elm$project_metadata_utils$Elm$Type$tuple;
	};
	var $elm$project_metadata_utils$Elm$Type$tipe = $elm$project_metadata_utils$Elm$Type$cyclic$tipe();
	$elm$project_metadata_utils$Elm$Type$cyclic$tipe = function () {
		return $elm$project_metadata_utils$Elm$Type$tipe;
	};
} catch ($) {
	throw 'Some top-level definitions from `Elm.Type` are causing infinite recursion:\n\n  ┌─────┐\n  │    arrowAndType\n  │     ↓\n  │    tipeTerm\n  │     ↓\n  │    chompArgs\n  │     ↓\n  │    term\n  │     ↓\n  │    record\n  │     ↓\n  │    recordEnd\n  │     ↓\n  │    field\n  │     ↓\n  │    recordEndHelp\n  │     ↓\n  │    tuple\n  │     ↓\n  │    tipe\n  │     ↓\n  │    tipeHelp\n  └─────┘\n\nThese errors are very tricky, so read https://elm-lang.org/0.19.1/bad-recursion to learn how to fix it!';}
var $elm$project_metadata_utils$Elm$Type$parse = function (source) {
	return A2($elm$parser$Parser$run, $elm$project_metadata_utils$Elm$Type$tipe, source);
};
var $elm$project_metadata_utils$Elm$Type$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Type$parse(string);
	if (_v0.$ === 'Err') {
		var error = _v0.a;
		return $elm$json$Json$Decode$fail('TODO');
	} else {
		var actualType = _v0.a;
		return $elm$json$Json$Decode$succeed(actualType);
	}
};
var $elm$project_metadata_utils$Elm$Type$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Type$decoderHelp, $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$project_metadata_utils$Elm$Docs$aliasDecoder = A5(
	$elm$json$Json$Decode$map4,
	$elm$project_metadata_utils$Elm$Docs$Alias,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'comment', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'args',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'type', $elm$project_metadata_utils$Elm$Type$decoder));
var $elm$project_metadata_utils$Elm$Docs$Binop = F5(
	function (name, comment, tipe, associativity, precedence) {
		return {associativity: associativity, comment: comment, name: name, precedence: precedence, tipe: tipe};
	});
var $elm$project_metadata_utils$Elm$Docs$Left = {$: 'Left'};
var $elm$project_metadata_utils$Elm$Docs$None = {$: 'None'};
var $elm$project_metadata_utils$Elm$Docs$Right = {$: 'Right'};
var $elm$project_metadata_utils$Elm$Docs$toAssoc = function (str) {
	switch (str) {
		case 'left':
			return $elm$json$Json$Decode$succeed($elm$project_metadata_utils$Elm$Docs$Left);
		case 'non':
			return $elm$json$Json$Decode$succeed($elm$project_metadata_utils$Elm$Docs$None);
		case 'right':
			return $elm$json$Json$Decode$succeed($elm$project_metadata_utils$Elm$Docs$Right);
		default:
			return $elm$json$Json$Decode$fail('expecting one of the following values: left, non, right');
	}
};
var $elm$project_metadata_utils$Elm$Docs$assocDecoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Docs$toAssoc, $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$map5 = _Json_map5;
var $elm$project_metadata_utils$Elm$Docs$binopDecoder = A6(
	$elm$json$Json$Decode$map5,
	$elm$project_metadata_utils$Elm$Docs$Binop,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'comment', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'type', $elm$project_metadata_utils$Elm$Type$decoder),
	A2($elm$json$Json$Decode$field, 'associativity', $elm$project_metadata_utils$Elm$Docs$assocDecoder),
	A2($elm$json$Json$Decode$field, 'precedence', $elm$json$Json$Decode$int));
var $elm$json$Json$Decode$map6 = _Json_map6;
var $elm$project_metadata_utils$Elm$Docs$Union = F4(
	function (name, comment, args, tags) {
		return {args: args, comment: comment, name: name, tags: tags};
	});
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $elm$project_metadata_utils$Elm$Docs$tagDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (a, b) {
			return _Utils_Tuple2(a, b);
		}),
	A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$index,
		1,
		$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Type$decoder)));
var $elm$project_metadata_utils$Elm$Docs$unionDecoder = A5(
	$elm$json$Json$Decode$map4,
	$elm$project_metadata_utils$Elm$Docs$Union,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'comment', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'args',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'cases',
		$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Docs$tagDecoder)));
var $elm$project_metadata_utils$Elm$Docs$Value = F3(
	function (name, comment, tipe) {
		return {comment: comment, name: name, tipe: tipe};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$project_metadata_utils$Elm$Docs$valueDecoder = A4(
	$elm$json$Json$Decode$map3,
	$elm$project_metadata_utils$Elm$Docs$Value,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'comment', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'type', $elm$project_metadata_utils$Elm$Type$decoder));
var $elm$project_metadata_utils$Elm$Docs$decoder = A7(
	$elm$json$Json$Decode$map6,
	$elm$project_metadata_utils$Elm$Docs$Module,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'comment', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'unions',
		$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Docs$unionDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'aliases',
		$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Docs$aliasDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'values',
		$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Docs$valueDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'binops',
		$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Docs$binopDecoder)));
var $elm$project_metadata_utils$Elm$Version$toString = function (_v0) {
	var major = _v0.a;
	var minor = _v0.b;
	var patch = _v0.c;
	return $elm$core$String$fromInt(major) + ('.' + ($elm$core$String$fromInt(minor) + ('.' + $elm$core$String$fromInt(patch))));
};
var $author$project$Session$fetchDocs = F4(
	function (mount, author, project, version) {
		return A2(
			$elm$http$Http$get,
			A2(
				$author$project$Href$join,
				mount,
				A2(
					$elm$url$Url$Builder$absolute,
					_List_fromArray(
						[
							'packages',
							author,
							project,
							$elm$project_metadata_utils$Elm$Version$toString(version),
							'docs.json'
						]),
					_List_Nil)),
			$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Docs$decoder));
	});
var $elm$project_metadata_utils$Elm$Project$Application = function (a) {
	return {$: 'Application', a: a};
};
var $elm$project_metadata_utils$Elm$Project$Package = function (a) {
	return {$: 'Package', a: a};
};
var $elm$project_metadata_utils$Elm$Project$ApplicationInfo = F6(
	function (elm, dirs, depsDirect, depsIndirect, testDepsDirect, testDepsIndirect) {
		return {depsDirect: depsDirect, depsIndirect: depsIndirect, dirs: dirs, elm: elm, testDepsDirect: testDepsDirect, testDepsIndirect: testDepsIndirect};
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$project_metadata_utils$Elm$Version$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Version$fromString(string);
	if (_v0.$ === 'Just') {
		var version = _v0.a;
		return $elm$json$Json$Decode$succeed(version);
	} else {
		return $elm$json$Json$Decode$fail('I need a valid version like \"2.0.1\"');
	}
};
var $elm$project_metadata_utils$Elm$Version$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Version$decoderHelp, $elm$json$Json$Decode$string);
var $elm$project_metadata_utils$Elm$Package$Name = F2(
	function (a, b) {
		return {$: 'Name', a: a, b: b};
	});
var $elm$core$String$any = _String_any;
var $elm$project_metadata_utils$Elm$Package$isBadChar = function (_char) {
	return $elm$core$Char$isUpper(_char) || (_Utils_eq(
		_char,
		_Utils_chr('.')) || _Utils_eq(
		_char,
		_Utils_chr('_')));
};
var $elm$project_metadata_utils$Elm$Package$isBadProjectName = function (project) {
	var _v0 = $elm$core$String$uncons(project);
	if (_v0.$ === 'Nothing') {
		return true;
	} else {
		var _v1 = _v0.a;
		var c = _v1.a;
		return A2($elm$core$String$contains, '--', project) || (A2($elm$core$String$any, $elm$project_metadata_utils$Elm$Package$isBadChar, project) || (A2($elm$core$String$startsWith, '-', project) || (!$elm$core$Char$isLower(c))));
	}
};
var $elm$project_metadata_utils$Elm$Package$fromString = function (string) {
	var _v0 = A2($elm$core$String$split, '/', string);
	if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
		var author = _v0.a;
		var _v1 = _v0.b;
		var project = _v1.a;
		return $elm$project_metadata_utils$Elm$Package$isBadProjectName(project) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
			A2($elm$project_metadata_utils$Elm$Package$Name, author, project));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$project_metadata_utils$Elm$Project$verifyDepNames = F2(
	function (revDeps, pairs) {
		verifyDepNames:
		while (true) {
			if (!pairs.b) {
				return $elm$json$Json$Decode$succeed(
					$elm$core$List$reverse(revDeps));
			} else {
				var _v1 = pairs.a;
				var key = _v1.a;
				var con = _v1.b;
				var otherPairs = pairs.b;
				var _v2 = $elm$project_metadata_utils$Elm$Package$fromString(key);
				if (_v2.$ === 'Just') {
					var pkg = _v2.a;
					var $temp$revDeps = A2(
						$elm$core$List$cons,
						_Utils_Tuple2(pkg, con),
						revDeps),
						$temp$pairs = otherPairs;
					revDeps = $temp$revDeps;
					pairs = $temp$pairs;
					continue verifyDepNames;
				} else {
					return $elm$json$Json$Decode$fail('\"' + (key + '\" is not a valid package name.'));
				}
			}
		}
	});
var $elm$project_metadata_utils$Elm$Project$depsDecoder = function (constraintDecoder) {
	return A2(
		$elm$json$Json$Decode$andThen,
		$elm$project_metadata_utils$Elm$Project$verifyDepNames(_List_Nil),
		$elm$json$Json$Decode$keyValuePairs(constraintDecoder));
};
var $elm$project_metadata_utils$Elm$Project$applicationDecoder = A7(
	$elm$json$Json$Decode$map6,
	$elm$project_metadata_utils$Elm$Project$ApplicationInfo,
	A2($elm$json$Json$Decode$field, 'elm-version', $elm$project_metadata_utils$Elm$Version$decoder),
	A2(
		$elm$json$Json$Decode$field,
		'source-directories',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['dependencies', 'direct']),
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Version$decoder)),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['dependencies', 'indirect']),
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Version$decoder)),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['test-dependencies', 'direct']),
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Version$decoder)),
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['test-dependencies', 'indirect']),
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Version$decoder)));
var $elm$project_metadata_utils$Elm$Project$PackageInfo = F8(
	function (name, summary, license, version, exposed, deps, testDeps, elm) {
		return {deps: deps, elm: elm, exposed: exposed, license: license, name: name, summary: summary, testDeps: testDeps, version: version};
	});
var $elm$project_metadata_utils$Elm$Constraint$Constraint = F4(
	function (a, b, c, d) {
		return {$: 'Constraint', a: a, b: b, c: c, d: d};
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
var $elm$project_metadata_utils$Elm$Version$compare = F2(
	function (_v0, _v1) {
		var major1 = _v0.a;
		var minor1 = _v0.b;
		var patch1 = _v0.c;
		var major2 = _v1.a;
		var minor2 = _v1.b;
		var patch2 = _v1.c;
		var _v2 = A2($elm$core$Basics$compare, major1, major2);
		switch (_v2.$) {
			case 'LT':
				return $elm$core$Basics$LT;
			case 'GT':
				return $elm$core$Basics$GT;
			default:
				var _v3 = A2($elm$core$Basics$compare, minor1, minor2);
				switch (_v3.$) {
					case 'LT':
						return $elm$core$Basics$LT;
					case 'EQ':
						return A2($elm$core$Basics$compare, patch1, patch2);
					default:
						return $elm$core$Basics$GT;
				}
		}
	});
var $elm$project_metadata_utils$Elm$Constraint$checkConstraint = function (constraint) {
	var lower = constraint.a;
	var upper = constraint.d;
	var _v0 = A2($elm$project_metadata_utils$Elm$Version$compare, lower, upper);
	switch (_v0.$) {
		case 'LT':
			return $elm$core$Maybe$Just(constraint);
		case 'EQ':
			return $elm$core$Maybe$Just(constraint);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Maybe$map4 = F5(
	function (func, ma, mb, mc, md) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					if (md.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var d = md.a;
						return $elm$core$Maybe$Just(
							A4(func, a, b, c, d));
					}
				}
			}
		}
	});
var $elm$project_metadata_utils$Elm$Constraint$LessOrEq = {$: 'LessOrEq'};
var $elm$project_metadata_utils$Elm$Constraint$LessThan = {$: 'LessThan'};
var $elm$project_metadata_utils$Elm$Constraint$opFromString = function (op) {
	switch (op) {
		case '<':
			return $elm$core$Maybe$Just($elm$project_metadata_utils$Elm$Constraint$LessThan);
		case '<=':
			return $elm$core$Maybe$Just($elm$project_metadata_utils$Elm$Constraint$LessOrEq);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $elm$project_metadata_utils$Elm$Constraint$fromString = function (string) {
	var _v0 = A2($elm$core$String$split, ' ', string);
	if ((((((_v0.b && _v0.b.b) && _v0.b.b.b) && (_v0.b.b.a === 'v')) && _v0.b.b.b.b) && _v0.b.b.b.b.b) && (!_v0.b.b.b.b.b.b)) {
		var lower = _v0.a;
		var _v1 = _v0.b;
		var lop = _v1.a;
		var _v2 = _v1.b;
		var _v3 = _v2.b;
		var uop = _v3.a;
		var _v4 = _v3.b;
		var upper = _v4.a;
		return A2(
			$elm$core$Maybe$andThen,
			$elm$project_metadata_utils$Elm$Constraint$checkConstraint,
			A5(
				$elm$core$Maybe$map4,
				$elm$project_metadata_utils$Elm$Constraint$Constraint,
				$elm$project_metadata_utils$Elm$Version$fromString(lower),
				$elm$project_metadata_utils$Elm$Constraint$opFromString(lop),
				$elm$project_metadata_utils$Elm$Constraint$opFromString(uop),
				$elm$project_metadata_utils$Elm$Version$fromString(upper)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$project_metadata_utils$Elm$Constraint$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Constraint$fromString(string);
	if (_v0.$ === 'Just') {
		var constraint = _v0.a;
		return $elm$json$Json$Decode$succeed(constraint);
	} else {
		return $elm$json$Json$Decode$fail('I need a valid constraint like \"1.0.0 <= v < 2.0.0\"');
	}
};
var $elm$project_metadata_utils$Elm$Constraint$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Constraint$decoderHelp, $elm$json$Json$Decode$string);
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
var $elm$project_metadata_utils$Elm$License$License = F2(
	function (a, b) {
		return {$: 'License', a: a, b: b};
	});
var $elm$project_metadata_utils$Elm$License$osiApprovedSpdxLicenses = _List_fromArray(
	[
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-1.1', 'Academic Free License v1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-1.2', 'Academic Free License v1.2'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-2.0', 'Academic Free License v2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-2.1', 'Academic Free License v2.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AFL-3.0', 'Academic Free License v3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APL-1.0', 'Adaptive Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Apache-1.1', 'Apache License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Apache-2.0', 'Apache License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APSL-1.0', 'Apple Public Source License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APSL-1.1', 'Apple Public Source License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APSL-1.2', 'Apple Public Source License 1.2'),
		A2($elm$project_metadata_utils$Elm$License$License, 'APSL-2.0', 'Apple Public Source License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Artistic-1.0', 'Artistic License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Artistic-1.0-Perl', 'Artistic License 1.0 (Perl)'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Artistic-1.0-cl8', 'Artistic License 1.0 w/clause 8'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Artistic-2.0', 'Artistic License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AAL', 'Attribution Assurance License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'BSL-1.0', 'Boost Software License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'BSD-2-Clause', 'BSD 2-clause \"Simplified\" License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'BSD-3-Clause', 'BSD 3-clause \"New\" or \"Revised\" License'),
		A2($elm$project_metadata_utils$Elm$License$License, '0BSD', 'BSD Zero Clause License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CECILL-2.1', 'CeCILL Free Software License Agreement v2.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CNRI-Python', 'CNRI Python License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CDDL-1.0', 'Common Development and Distribution License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CPAL-1.0', 'Common Public Attribution License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CPL-1.0', 'Common Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CATOSL-1.1', 'Computer Associates Trusted Open Source License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'CUA-OPL-1.0', 'CUA Office Public License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EPL-1.0', 'Eclipse Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'ECL-1.0', 'Educational Community License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'ECL-2.0', 'Educational Community License v2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EFL-1.0', 'Eiffel Forum License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EFL-2.0', 'Eiffel Forum License v2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Entessa', 'Entessa Public License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EUDatagrid', 'EU DataGrid Software License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'EUPL-1.1', 'European Union Public License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Fair', 'Fair License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Frameworx-1.0', 'Frameworx Open License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'AGPL-3.0', 'GNU Affero General Public License v3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'GPL-2.0', 'GNU General Public License v2.0 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'GPL-3.0', 'GNU General Public License v3.0 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LGPL-2.1', 'GNU Lesser General Public License v2.1 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LGPL-3.0', 'GNU Lesser General Public License v3.0 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LGPL-2.0', 'GNU Library General Public License v2 only'),
		A2($elm$project_metadata_utils$Elm$License$License, 'HPND', 'Historic Permission Notice and Disclaimer'),
		A2($elm$project_metadata_utils$Elm$License$License, 'IPL-1.0', 'IBM Public License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Intel', 'Intel Open Source License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'IPA', 'IPA Font License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'ISC', 'ISC License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LPPL-1.3c', 'LaTeX Project Public License v1.3c'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LiLiQ-P-1.1', 'Licence Libre du Québec – Permissive version 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LiLiQ-Rplus-1.1', 'Licence Libre du Québec – Réciprocité forte version 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LiLiQ-R-1.1', 'Licence Libre du Québec – Réciprocité version 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LPL-1.02', 'Lucent Public License v1.02'),
		A2($elm$project_metadata_utils$Elm$License$License, 'LPL-1.0', 'Lucent Public License Version 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MS-PL', 'Microsoft Public License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MS-RL', 'Microsoft Reciprocal License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MirOS', 'MirOS Licence'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MIT', 'MIT License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Motosoto', 'Motosoto License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MPL-1.0', 'Mozilla Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MPL-1.1', 'Mozilla Public License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MPL-2.0', 'Mozilla Public License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'MPL-2.0-no-copyleft-exception', 'Mozilla Public License 2.0 (no copyleft exception)'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Multics', 'Multics License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NASA-1.3', 'NASA Open Source Agreement 1.3'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Naumen', 'Naumen Public License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NGPL', 'Nethack General Public License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Nokia', 'Nokia Open Source License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NPOSL-3.0', 'Non-Profit Open Software License 3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NTP', 'NTP License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OCLC-2.0', 'OCLC Research Public License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OGTSL', 'Open Group Test Suite License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSL-1.0', 'Open Software License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSL-2.0', 'Open Software License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSL-2.1', 'Open Software License 2.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSL-3.0', 'Open Software License 3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OSET-PL-2.1', 'OSET Public License version 2.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'PHP-3.0', 'PHP License v3.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'PostgreSQL', 'PostgreSQL License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Python-2.0', 'Python License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'QPL-1.0', 'Q Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'RPSL-1.0', 'RealNetworks Public Source License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'RPL-1.1', 'Reciprocal Public License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'RPL-1.5', 'Reciprocal Public License 1.5'),
		A2($elm$project_metadata_utils$Elm$License$License, 'RSCPL', 'Ricoh Source Code Public License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'OFL-1.1', 'SIL Open Font License 1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'SimPL-2.0', 'Simple Public License 2.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Sleepycat', 'Sleepycat License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'SISSL', 'Sun Industry Standards Source License v1.1'),
		A2($elm$project_metadata_utils$Elm$License$License, 'SPL-1.0', 'Sun Public License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Watcom-1.0', 'Sybase Open Watcom Public License 1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'UPL-1.0', 'Universal Permissive License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'NCSA', 'University of Illinois/NCSA Open Source License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'VSL-1.0', 'Vovida Software License v1.0'),
		A2($elm$project_metadata_utils$Elm$License$License, 'W3C', 'W3C Software Notice and License (2002-12-31)'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Xnet', 'X.Net License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'Zlib', 'zlib License'),
		A2($elm$project_metadata_utils$Elm$License$License, 'ZPL-2.0', 'Zope Public License 2.0')
	]);
var $elm$project_metadata_utils$Elm$License$spdxDict = $elm$core$Dict$fromList(
	A2(
		$elm$core$List$map,
		function (license) {
			var abbr = license.a;
			return _Utils_Tuple2(abbr, license);
		},
		$elm$project_metadata_utils$Elm$License$osiApprovedSpdxLicenses));
var $elm$project_metadata_utils$Elm$License$fromString = function (string) {
	return A2($elm$core$Dict$get, string, $elm$project_metadata_utils$Elm$License$spdxDict);
};
var $elm$project_metadata_utils$Elm$License$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$License$fromString(string);
	if (_v0.$ === 'Just') {
		var license = _v0.a;
		return $elm$json$Json$Decode$succeed(license);
	} else {
		return $elm$json$Json$Decode$fail('I need an OSI approved license in SPDX format <https://spdx.org/licenses/>');
	}
};
var $elm$project_metadata_utils$Elm$License$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$License$decoderHelp, $elm$json$Json$Decode$string);
var $elm$project_metadata_utils$Elm$Package$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Package$fromString(string);
	if (_v0.$ === 'Just') {
		var name = _v0.a;
		return $elm$json$Json$Decode$succeed(name);
	} else {
		return $elm$json$Json$Decode$fail('I need a valid package name like \"elm/core\"');
	}
};
var $elm$project_metadata_utils$Elm$Package$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Package$decoderHelp, $elm$json$Json$Decode$string);
var $elm$project_metadata_utils$Elm$Project$ExposedDict = function (a) {
	return {$: 'ExposedDict', a: a};
};
var $elm$project_metadata_utils$Elm$Project$ExposedList = function (a) {
	return {$: 'ExposedList', a: a};
};
var $elm$project_metadata_utils$Elm$Project$checkHeaders = function (dict) {
	checkHeaders:
	while (true) {
		if (!dict.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v1 = dict.a;
			var header = _v1.a;
			var others = dict.b;
			if ($elm$core$String$length(header) < 20) {
				var $temp$dict = others;
				dict = $temp$dict;
				continue checkHeaders;
			} else {
				return $elm$core$Maybe$Just(header);
			}
		}
	}
};
var $elm$project_metadata_utils$Elm$Project$checkExposedDict = function (dict) {
	var _v0 = $elm$project_metadata_utils$Elm$Project$checkHeaders(dict);
	if (_v0.$ === 'Nothing') {
		return $elm$json$Json$Decode$succeed(dict);
	} else {
		var badHeader = _v0.a;
		return $elm$json$Json$Decode$fail('The \"' + (badHeader + '\" header is too long. Twenty characters max!'));
	}
};
var $elm$project_metadata_utils$Elm$Module$Name = function (a) {
	return {$: 'Name', a: a};
};
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
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$project_metadata_utils$Elm$Module$isGoodChunk = function (chunk) {
	var _v0 = $elm$core$String$uncons(chunk);
	if (_v0.$ === 'Nothing') {
		return false;
	} else {
		var _v1 = _v0.a;
		var _char = _v1.a;
		var rest = _v1.b;
		return $elm$core$Char$isUpper(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
	}
};
var $elm$project_metadata_utils$Elm$Module$fromString = function (string) {
	return A2(
		$elm$core$List$all,
		$elm$project_metadata_utils$Elm$Module$isGoodChunk,
		A2($elm$core$String$split, '.', string)) ? $elm$core$Maybe$Just(
		$elm$project_metadata_utils$Elm$Module$Name(string)) : $elm$core$Maybe$Nothing;
};
var $elm$project_metadata_utils$Elm$Module$decoderHelp = function (string) {
	var _v0 = $elm$project_metadata_utils$Elm$Module$fromString(string);
	if (_v0.$ === 'Just') {
		var name = _v0.a;
		return $elm$json$Json$Decode$succeed(name);
	} else {
		return $elm$json$Json$Decode$fail('I need a valid module name like \"Json.Decode\"');
	}
};
var $elm$project_metadata_utils$Elm$Module$decoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Module$decoderHelp, $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$project_metadata_utils$Elm$Project$exposedDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$json$Json$Decode$map,
			$elm$project_metadata_utils$Elm$Project$ExposedList,
			$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Module$decoder)),
			A2(
			$elm$json$Json$Decode$map,
			$elm$project_metadata_utils$Elm$Project$ExposedDict,
			A2(
				$elm$json$Json$Decode$andThen,
				$elm$project_metadata_utils$Elm$Project$checkExposedDict,
				$elm$json$Json$Decode$keyValuePairs(
					$elm$json$Json$Decode$list($elm$project_metadata_utils$Elm$Module$decoder))))
		]));
var $elm$json$Json$Decode$map8 = _Json_map8;
var $elm$project_metadata_utils$Elm$Project$summaryCheck = function (summary) {
	return ($elm$core$String$length(summary) < 80) ? $elm$json$Json$Decode$succeed(summary) : $elm$json$Json$Decode$fail('The \"summary\" field must have fewer than 80 characters.');
};
var $elm$project_metadata_utils$Elm$Project$summaryDecoder = A2($elm$json$Json$Decode$andThen, $elm$project_metadata_utils$Elm$Project$summaryCheck, $elm$json$Json$Decode$string);
var $elm$project_metadata_utils$Elm$Project$packageDecoder = A9(
	$elm$json$Json$Decode$map8,
	$elm$project_metadata_utils$Elm$Project$PackageInfo,
	A2($elm$json$Json$Decode$field, 'name', $elm$project_metadata_utils$Elm$Package$decoder),
	A2($elm$json$Json$Decode$field, 'summary', $elm$project_metadata_utils$Elm$Project$summaryDecoder),
	A2($elm$json$Json$Decode$field, 'license', $elm$project_metadata_utils$Elm$License$decoder),
	A2($elm$json$Json$Decode$field, 'version', $elm$project_metadata_utils$Elm$Version$decoder),
	A2($elm$json$Json$Decode$field, 'exposed-modules', $elm$project_metadata_utils$Elm$Project$exposedDecoder),
	A2(
		$elm$json$Json$Decode$field,
		'dependencies',
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Constraint$decoder)),
	A2(
		$elm$json$Json$Decode$field,
		'test-dependencies',
		$elm$project_metadata_utils$Elm$Project$depsDecoder($elm$project_metadata_utils$Elm$Constraint$decoder)),
	A2($elm$json$Json$Decode$field, 'elm-version', $elm$project_metadata_utils$Elm$Constraint$decoder));
var $elm$project_metadata_utils$Elm$Project$decoderHelp = function (tipe) {
	switch (tipe) {
		case 'application':
			return A2($elm$json$Json$Decode$map, $elm$project_metadata_utils$Elm$Project$Application, $elm$project_metadata_utils$Elm$Project$applicationDecoder);
		case 'package':
			return A2($elm$json$Json$Decode$map, $elm$project_metadata_utils$Elm$Project$Package, $elm$project_metadata_utils$Elm$Project$packageDecoder);
		default:
			var other = tipe;
			return $elm$json$Json$Decode$fail('The "type" field must be either "application" or "package", so ' + ('\"' + (other + '\" is not acceptable.')));
	}
};
var $elm$project_metadata_utils$Elm$Project$decoder = A2(
	$elm$json$Json$Decode$andThen,
	$elm$project_metadata_utils$Elm$Project$decoderHelp,
	A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
var $author$project$Session$getPkgOutline = function (outline) {
	if (outline.$ === 'Application') {
		return $elm$json$Json$Decode$fail('Unexpected application');
	} else {
		var info = outline.a;
		return $elm$json$Json$Decode$succeed(info);
	}
};
var $author$project$Session$outlineDecoder = A2($elm$json$Json$Decode$andThen, $author$project$Session$getPkgOutline, $elm$project_metadata_utils$Elm$Project$decoder);
var $author$project$Session$fetchOutline = F4(
	function (mount, author, project, version) {
		return A2(
			$elm$http$Http$get,
			A2(
				$author$project$Href$join,
				mount,
				A2(
					$elm$url$Url$Builder$absolute,
					_List_fromArray(
						[
							'packages',
							author,
							project,
							$elm$project_metadata_utils$Elm$Version$toString(version),
							'elm.json'
						]),
					_List_Nil)),
			$author$project$Session$outlineDecoder);
	});
var $elm$http$Http$expectString = $elm$http$Http$expectStringResponse(
	function (response) {
		return $elm$core$Result$Ok(response.body);
	});
var $elm$http$Http$getString = function (url) {
	return $elm$http$Http$request(
		{body: $elm$http$Http$emptyBody, expect: $elm$http$Http$expectString, headers: _List_Nil, method: 'GET', timeout: $elm$core$Maybe$Nothing, url: url, withCredentials: false});
};
var $author$project$Session$fetchReadme = F4(
	function (mount, author, project, version) {
		return $elm$http$Http$getString(
			A2(
				$author$project$Href$join,
				mount,
				A2(
					$elm$url$Url$Builder$absolute,
					_List_fromArray(
						[
							'packages',
							author,
							project,
							$elm$project_metadata_utils$Elm$Version$toString(version),
							'README.md'
						]),
					_List_Nil)));
	});
var $author$project$Session$toVsnKey = F3(
	function (author, project, version) {
		return author + ('/' + (project + ('@' + $elm$project_metadata_utils$Elm$Version$toString(version))));
	});
var $author$project$Session$getDocs = F4(
	function (data, author, project, version) {
		return A2(
			$elm$core$Dict$get,
			A3($author$project$Session$toVsnKey, author, project, version),
			data.docs);
	});
var $author$project$Session$getOutline = F4(
	function (data, author, project, version) {
		return A2(
			$elm$core$Dict$get,
			A3($author$project$Session$toVsnKey, author, project, version),
			data.outlines);
	});
var $author$project$Session$getReadme = F4(
	function (data, author, project, version) {
		return A2(
			$elm$core$Dict$get,
			A3($author$project$Session$toVsnKey, author, project, version),
			data.readmes);
	});
var $elm$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		if (ma.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					return $elm$core$Maybe$Just(
						A3(func, a, b, c));
				}
			}
		}
	});
var $author$project$Page$Docs$ScrollAttempted = function (a) {
	return {$: 'ScrollAttempted', a: a};
};
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $elm$browser$Browser$Dom$setViewport = _Browser_setViewport;
var $author$project$Page$Docs$scrollIfNeeded = function (focus) {
	if ((focus.$ === 'Module') && (focus.b.$ === 'Just')) {
		var tag = focus.b.a;
		return A2(
			$elm$core$Task$attempt,
			$author$project$Page$Docs$ScrollAttempted,
			A2(
				$elm$core$Task$andThen,
				function (info) {
					return A2($elm$browser$Browser$Dom$setViewport, 0, info.element.y);
				},
				$elm$browser$Browser$Dom$getElement(tag)));
	} else {
		return $elm$core$Platform$Cmd$none;
	}
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Page$Docs$getInfo = F2(
	function (latest, model) {
		var version = A2($elm$core$Maybe$withDefault, latest, model.version);
		var project = model.project;
		var author = model.author;
		var maybeInfo = A4(
			$elm$core$Maybe$map3,
			F3(
				function (a, b, c) {
					return _Utils_Tuple3(a, b, c);
				}),
			A4($author$project$Session$getReadme, model.session, author, project, version),
			A4($author$project$Session$getDocs, model.session, author, project, version),
			A4($author$project$Session$getOutline, model.session, author, project, version));
		if (maybeInfo.$ === 'Nothing') {
			return _Utils_Tuple2(
				model,
				$elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							A2(
							$elm$http$Http$send,
							$author$project$Page$Docs$GotReadme(version),
							A4($author$project$Session$fetchReadme, model.session.mountPoint, author, project, version)),
							A2(
							$elm$http$Http$send,
							$author$project$Page$Docs$GotDocs(version),
							A4($author$project$Session$fetchDocs, model.session.mountPoint, author, project, version)),
							A2(
							$elm$http$Http$send,
							$author$project$Page$Docs$GotOutline(version),
							A4($author$project$Session$fetchOutline, model.session.mountPoint, author, project, version))
						])));
		} else {
			var _v1 = maybeInfo.a;
			var readme = _v1.a;
			var docs = _v1.b;
			var outline = _v1.c;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						docs: $author$project$Page$Docs$Success(docs),
						outline: $author$project$Page$Docs$Success(outline),
						readme: $author$project$Page$Docs$Success(readme)
					}),
				$author$project$Page$Docs$scrollIfNeeded(model.focus));
		}
	});
var $author$project$Release$getLatestVersionHelp = F2(
	function (releases, maxRelease) {
		if (!releases.b) {
			return maxRelease.version;
		} else {
			var release = releases.a;
			var otherReleases = releases.b;
			return A2(
				$author$project$Release$getLatestVersionHelp,
				otherReleases,
				(_Utils_cmp(release.time, maxRelease.time) > 0) ? release : maxRelease);
		}
	});
var $author$project$Release$getLatestVersion = function (_v0) {
	var r = _v0.a;
	var rs = _v0.b;
	return A2($author$project$Release$getLatestVersionHelp, rs, r);
};
var $author$project$Page$Docs$init = F5(
	function (session, author, project, version, focus) {
		var _v0 = A3($author$project$Session$getReleases, session, author, project);
		if (_v0.$ === 'Just') {
			var releases = _v0.a;
			return A2(
				$author$project$Page$Docs$getInfo,
				$author$project$Release$getLatestVersion(releases),
				$author$project$Page$Docs$Model(session)(author)(project)(version)(focus)('')(
					$author$project$Page$Docs$Success(releases))($author$project$Page$Docs$Loading)($author$project$Page$Docs$Loading)($author$project$Page$Docs$Loading));
		} else {
			return _Utils_Tuple2(
				$author$project$Page$Docs$Model(session)(author)(project)(version)(focus)('')($author$project$Page$Docs$Loading)($author$project$Page$Docs$Loading)($author$project$Page$Docs$Loading)($author$project$Page$Docs$Loading),
				A2(
					$elm$http$Http$send,
					$author$project$Page$Docs$GotReleases,
					A3($author$project$Session$fetchReleases, session.mountPoint, author, project)));
		}
	});
var $author$project$Page$Help$GotContent = function (a) {
	return {$: 'GotContent', a: a};
};
var $author$project$Page$Help$Loading = {$: 'Loading'};
var $author$project$Page$Help$Model = F3(
	function (session, title, content) {
		return {content: content, session: session, title: title};
	});
var $author$project$Page$Help$init = F3(
	function (session, title, url) {
		return _Utils_Tuple2(
			A3($author$project$Page$Help$Model, session, title, $author$project$Page$Help$Loading),
			A2(
				$elm$http$Http$send,
				$author$project$Page$Help$GotContent,
				$elm$http$Http$getString(
					A2($author$project$Href$join, session.mountPoint, url))));
	});
var $author$project$Page$Search$GotPackages = function (a) {
	return {$: 'GotPackages', a: a};
};
var $author$project$Page$Search$Loading = {$: 'Loading'};
var $author$project$Page$Search$Model = F3(
	function (session, query, entries) {
		return {entries: entries, query: query, session: session};
	});
var $author$project$Page$Search$Success = function (a) {
	return {$: 'Success', a: a};
};
var $author$project$Page$Search$Entry$Entry = F6(
	function (name, author, project, summary, license, version) {
		return {author: author, license: license, name: name, project: project, summary: summary, version: version};
	});
var $author$project$Page$Search$Entry$splitName = function (name) {
	var _v0 = A2($elm$core$String$split, '/', name);
	if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
		var author = _v0.a;
		var _v1 = _v0.b;
		var project = _v1.a;
		return $elm$json$Json$Decode$succeed(
			A3($author$project$Page$Search$Entry$Entry, name, author, project));
	} else {
		return $elm$json$Json$Decode$fail('Ran into an invalid package name: ' + name);
	}
};
var $author$project$Page$Search$Entry$decoder = A5(
	$elm$json$Json$Decode$map4,
	F4(
		function (f, a, b, c) {
			return A3(f, a, b, c);
		}),
	A2(
		$elm$json$Json$Decode$field,
		'name',
		A2($elm$json$Json$Decode$andThen, $author$project$Page$Search$Entry$splitName, $elm$json$Json$Decode$string)),
	A2($elm$json$Json$Decode$field, 'summary', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'license', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'version', $elm$project_metadata_utils$Elm$Version$decoder));
var $author$project$Session$getEntries = function (data) {
	return data.entries;
};
var $author$project$Page$Search$init = function (session) {
	var _v0 = $author$project$Session$getEntries(session);
	if (_v0.$ === 'Just') {
		var entries = _v0.a;
		return _Utils_Tuple2(
			A3(
				$author$project$Page$Search$Model,
				session,
				'',
				$author$project$Page$Search$Success(entries)),
			$elm$core$Platform$Cmd$none);
	} else {
		return _Utils_Tuple2(
			A3($author$project$Page$Search$Model, session, '', $author$project$Page$Search$Loading),
			A2(
				$elm$http$Http$send,
				$author$project$Page$Search$GotPackages,
				A2(
					$elm$http$Http$get,
					A2($author$project$Href$join, session.mountPoint, '/search.json'),
					$elm$json$Json$Decode$list($author$project$Page$Search$Entry$decoder))));
	}
};
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.unvisited;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.value);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.value);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 'Nothing') {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 'Nothing') {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 'Nothing') {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 'Nothing') {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0.a;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.path),
					$elm$url$Url$Parser$prepareQuery(url.query),
					url.fragment,
					$elm$core$Basics$identity)));
	});
var $author$project$Main$project_ = A2($elm$url$Url$Parser$custom, 'PROJECT', $elm$core$Maybe$Just);
var $author$project$Main$route = F2(
	function (parser, handler) {
		return A2($elm$url$Url$Parser$map, handler, parser);
	});
var $author$project$MountPoint$router = function (mountPoint) {
	if (mountPoint.$ === 'Root') {
		return $elm$url$Url$Parser$top;
	} else {
		if (!mountPoint.a.b) {
			return $elm$url$Url$Parser$top;
		} else {
			if (!mountPoint.a.b.b) {
				var _v1 = mountPoint.a;
				var path = _v1.a;
				return $elm$url$Url$Parser$s(path);
			} else {
				var rest = mountPoint.a;
				return A3(
					$elm$core$List$foldr,
					$elm$url$Url$Parser$slash,
					$elm$url$Url$Parser$top,
					A2($elm$core$List$map, $elm$url$Url$Parser$s, rest));
			}
		}
	}
};
var $author$project$Main$Diff = function (a) {
	return {$: 'Diff', a: a};
};
var $author$project$Main$DiffMsg = function (a) {
	return {$: 'DiffMsg', a: a};
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Main$stepDiff = F2(
	function (model, _v0) {
		var diff = _v0.a;
		var cmds = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					page: $author$project$Main$Diff(diff)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$DiffMsg, cmds));
	});
var $author$project$Main$Docs = function (a) {
	return {$: 'Docs', a: a};
};
var $author$project$Main$DocsMsg = function (a) {
	return {$: 'DocsMsg', a: a};
};
var $author$project$Main$stepDocs = F2(
	function (model, _v0) {
		var docs = _v0.a;
		var cmds = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					page: $author$project$Main$Docs(docs)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$DocsMsg, cmds));
	});
var $author$project$Main$Help = function (a) {
	return {$: 'Help', a: a};
};
var $author$project$Main$HelpMsg = function (a) {
	return {$: 'HelpMsg', a: a};
};
var $author$project$Main$stepHelp = F2(
	function (model, _v0) {
		var help = _v0.a;
		var cmds = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					page: $author$project$Main$Help(help)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$HelpMsg, cmds));
	});
var $author$project$Main$Search = function (a) {
	return {$: 'Search', a: a};
};
var $author$project$Main$SearchMsg = function (a) {
	return {$: 'SearchMsg', a: a};
};
var $author$project$Main$stepSearch = F2(
	function (model, _v0) {
		var search = _v0.a;
		var cmds = _v0.b;
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					page: $author$project$Main$Search(search)
				}),
			A2($elm$core$Platform$Cmd$map, $author$project$Main$SearchMsg, cmds));
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
var $author$project$Main$version_ = A2(
	$elm$url$Url$Parser$custom,
	'VERSION',
	function (string) {
		return (string === 'latest') ? $elm$core$Maybe$Just($elm$core$Maybe$Nothing) : A2(
			$elm$core$Maybe$map,
			$elm$core$Maybe$Just,
			$elm$project_metadata_utils$Elm$Version$fromString(string));
	});
var $author$project$Main$stepUrl = F2(
	function (url, model) {
		var session = $author$project$Main$exit(model);
		var parser = A2(
			$elm$url$Url$Parser$slash,
			$author$project$MountPoint$router(session.mountPoint),
			$elm$url$Url$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$author$project$Main$route,
						$elm$url$Url$Parser$top,
						A2(
							$author$project$Main$stepSearch,
							model,
							$author$project$Page$Search$init(session))),
						A2(
						$author$project$Main$route,
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('packages'),
							A2($elm$url$Url$Parser$slash, $author$project$Main$author_, $author$project$Main$project_)),
						F2(
							function (author, project) {
								return A2(
									$author$project$Main$stepDiff,
									model,
									A3($author$project$Page$Diff$init, session, author, project));
							})),
						A2(
						$author$project$Main$route,
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('packages'),
							A2(
								$elm$url$Url$Parser$slash,
								$author$project$Main$author_,
								A2(
									$elm$url$Url$Parser$slash,
									$author$project$Main$project_,
									A2($elm$url$Url$Parser$slash, $author$project$Main$version_, $author$project$Main$focus_)))),
						F4(
							function (author, project, version, focus) {
								return A2(
									$author$project$Main$stepDocs,
									model,
									A5($author$project$Page$Docs$init, session, author, project, version, focus));
							})),
						A2(
						$author$project$Main$route,
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('help'),
							$elm$url$Url$Parser$s('design-guidelines')),
						A2(
							$author$project$Main$stepHelp,
							model,
							A3($author$project$Page$Help$init, session, 'Design Guidelines', '/assets/help/design-guidelines.md'))),
						A2(
						$author$project$Main$route,
						A2(
							$elm$url$Url$Parser$slash,
							$elm$url$Url$Parser$s('help'),
							$elm$url$Url$Parser$s('documentation-format')),
						A2(
							$author$project$Main$stepHelp,
							model,
							A3($author$project$Page$Help$init, session, 'Documentation Format', '/assets/help/documentation-format.md')))
					])));
		var _v0 = A2($elm$url$Url$Parser$parse, parser, url);
		if (_v0.$ === 'Just') {
			var answer = _v0.a;
			return answer;
		} else {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						page: $author$project$Main$NotFound(session)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$init = F3(
	function (flagsValue, url, key) {
		var flags = $author$project$Flags$init(flagsValue);
		return A2(
			$author$project$Main$stepUrl,
			url,
			{
				key: key,
				page: $author$project$Main$NotFound(
					$author$project$Session$empty(
						$author$project$MountPoint$fromString(flags.mountedAt)))
			});
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$none;
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 'Nothing') {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 'Nothing') {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.protocol;
		if (_v0.$ === 'Http') {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.fragment,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.query,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.port_,
					_Utils_ap(http, url.host)),
				url.path)));
};
var $author$project$Page$Diff$Failure = {$: 'Failure'};
var $author$project$Session$addReleases = F4(
	function (author, project, releases, data) {
		var newReleases = A3(
			$elm$core$Dict$insert,
			A2($author$project$Session$toPkgKey, author, project),
			releases,
			data.releases);
		return _Utils_update(
			data,
			{releases: newReleases});
	});
var $author$project$Page$Diff$update = F2(
	function (msg, model) {
		var result = msg.a;
		if (result.$ === 'Err') {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{releases: $author$project$Page$Diff$Failure}),
				$elm$core$Platform$Cmd$none);
		} else {
			var releases = result.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						releases: $author$project$Page$Diff$Success(releases),
						session: A4($author$project$Session$addReleases, model.author, model.project, releases, model.session)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$Docs$Failure = {$: 'Failure'};
var $author$project$Session$addDocs = F5(
	function (author, project, version, docs, data) {
		var newDocs = A3(
			$elm$core$Dict$insert,
			A3($author$project$Session$toVsnKey, author, project, version),
			docs,
			data.docs);
		return _Utils_update(
			data,
			{docs: newDocs});
	});
var $author$project$Session$addOutline = F5(
	function (author, project, version, outline, data) {
		var newOutlines = A3(
			$elm$core$Dict$insert,
			A3($author$project$Session$toVsnKey, author, project, version),
			outline,
			data.outlines);
		return _Utils_update(
			data,
			{outlines: newOutlines});
	});
var $author$project$Session$addReadme = F5(
	function (author, project, version, readme, data) {
		var newReadmes = A3(
			$elm$core$Dict$insert,
			A3($author$project$Session$toVsnKey, author, project, version),
			readme,
			data.readmes);
		return _Utils_update(
			data,
			{readmes: newReadmes});
	});
var $author$project$Page$Docs$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'QueryChanged':
				var query = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{query: query}),
					$elm$core$Platform$Cmd$none);
			case 'ScrollAttempted':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'GotReleases':
				var result = msg.a;
				if (result.$ === 'Err') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{docs: $author$project$Page$Docs$Failure, outline: $author$project$Page$Docs$Failure, readme: $author$project$Page$Docs$Failure, releases: $author$project$Page$Docs$Failure}),
						$elm$core$Platform$Cmd$none);
				} else {
					var releases = result.a;
					return A2(
						$author$project$Page$Docs$getInfo,
						$author$project$Release$getLatestVersion(releases),
						_Utils_update(
							model,
							{
								releases: $author$project$Page$Docs$Success(releases),
								session: A4($author$project$Session$addReleases, model.author, model.project, releases, model.session)
							}));
				}
			case 'GotReadme':
				var version = msg.a;
				var result = msg.b;
				if (result.$ === 'Err') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{readme: $author$project$Page$Docs$Failure}),
						$elm$core$Platform$Cmd$none);
				} else {
					var readme = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								readme: $author$project$Page$Docs$Success(readme),
								session: A5($author$project$Session$addReadme, model.author, model.project, version, readme, model.session)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 'GotDocs':
				var version = msg.a;
				var result = msg.b;
				if (result.$ === 'Err') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{docs: $author$project$Page$Docs$Failure}),
						$elm$core$Platform$Cmd$none);
				} else {
					var docs = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								docs: $author$project$Page$Docs$Success(docs),
								session: A5($author$project$Session$addDocs, model.author, model.project, version, docs, model.session)
							}),
						$author$project$Page$Docs$scrollIfNeeded(model.focus));
				}
			default:
				var version = msg.a;
				var result = msg.b;
				if (result.$ === 'Err') {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{outline: $author$project$Page$Docs$Failure}),
						$elm$core$Platform$Cmd$none);
				} else {
					var outline = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								outline: $author$project$Page$Docs$Success(outline),
								session: A5($author$project$Session$addOutline, model.author, model.project, version, outline, model.session)
							}),
						$elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Page$Help$Failure = {$: 'Failure'};
var $author$project$Page$Help$Success = function (a) {
	return {$: 'Success', a: a};
};
var $author$project$Page$Help$update = F2(
	function (msg, model) {
		var result = msg.a;
		if (result.$ === 'Err') {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{content: $author$project$Page$Help$Failure}),
				$elm$core$Platform$Cmd$none);
		} else {
			var content = result.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						content: $author$project$Page$Help$Success(content)
					}),
				$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$Search$Failure = {$: 'Failure'};
var $author$project$Session$addEntries = F2(
	function (entries, data) {
		return _Utils_update(
			data,
			{
				entries: $elm$core$Maybe$Just(entries)
			});
	});
var $author$project$Page$Search$update = F2(
	function (msg, model) {
		if (msg.$ === 'QueryChanged') {
			var query = msg.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{query: query}),
				$elm$core$Platform$Cmd$none);
		} else {
			var result = msg.a;
			if (result.$ === 'Err') {
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{entries: $author$project$Page$Search$Failure}),
					$elm$core$Platform$Cmd$none);
			} else {
				var entries = result.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							entries: $author$project$Page$Search$Success(entries),
							session: A2($author$project$Session$addEntries, entries, model.session)
						}),
					$elm$core$Platform$Cmd$none);
			}
		}
	});
var $author$project$Main$update = F2(
	function (message, model) {
		switch (message.$) {
			case 'NoOp':
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 'LinkClicked':
				var urlRequest = message.a;
				if (urlRequest.$ === 'Internal') {
					var url = urlRequest.a;
					return _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.key,
							$elm$url$Url$toString(url)));
				} else {
					var href = urlRequest.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(href));
				}
			case 'UrlChanged':
				var url = message.a;
				return A2($author$project$Main$stepUrl, url, model);
			case 'SearchMsg':
				var msg = message.a;
				var _v2 = model.page;
				if (_v2.$ === 'Search') {
					var search = _v2.a;
					return A2(
						$author$project$Main$stepSearch,
						model,
						A2($author$project$Page$Search$update, msg, search));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'DiffMsg':
				var msg = message.a;
				var _v3 = model.page;
				if (_v3.$ === 'Diff') {
					var diff = _v3.a;
					return A2(
						$author$project$Main$stepDiff,
						model,
						A2($author$project$Page$Diff$update, msg, diff));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'DocsMsg':
				var msg = message.a;
				var _v4 = model.page;
				if (_v4.$ === 'Docs') {
					var docs = _v4.a;
					return A2(
						$author$project$Main$stepDocs,
						model,
						A2($author$project$Page$Docs$update, msg, docs));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				var msg = message.a;
				var _v5 = model.page;
				if (_v5.$ === 'Help') {
					var docs = _v5.a;
					return A2(
						$author$project$Main$stepHelp,
						model,
						A2($author$project$Page$Help$update, msg, docs));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Skeleton$NoProblems = {$: 'NoProblems'};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Page$Problem$notFound = _List_fromArray(
	[
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-size', '12em')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('404')
			])),
		A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-size', '3em')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('I cannot find this page!')
			]))
	]);
var $author$project$Page$Problem$styles = _List_fromArray(
	[
		A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
		A2($elm$html$Html$Attributes$style, 'color', '#9A9A9A'),
		A2($elm$html$Html$Attributes$style, 'padding', '6em 0')
	]);
var $author$project$Skeleton$Text = function (a) {
	return {$: 'Text', a: a};
};
var $author$project$Skeleton$authorSegment = function (author) {
	return $author$project$Skeleton$Text(author);
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
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$code = _VirtualDom_node('code');
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$Page$Problem$offline = function (file) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'font-size', '3em')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Cannot find '),
					A2(
					$elm$html$Html$code,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(file)
						]))
				])),
			A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Are you offline or something?')
				]))
		]);
};
var $author$project$Skeleton$Link = F2(
	function (a, b) {
		return {$: 'Link', a: a, b: b};
	});
var $author$project$Href$toProject = F3(
	function (mount, author, project) {
		return A2(
			$author$project$Href$join,
			mount,
			A2(
				$elm$url$Url$Builder$absolute,
				_List_fromArray(
					['packages', author, project, '']),
				_List_Nil));
	});
var $author$project$Skeleton$projectSegment = F3(
	function (mount, author, project) {
		return A2(
			$author$project$Skeleton$Link,
			A3($author$project$Href$toProject, mount, author, project),
			project);
	});
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Page$Diff$bold = A2($elm$html$Html$Attributes$style, 'font-weight', 'bold');
var $elm$project_metadata_utils$Elm$Version$toTuple = function (_v0) {
	var major = _v0.a;
	var minor = _v0.b;
	var patch = _v0.c;
	return _Utils_Tuple3(major, minor, patch);
};
var $author$project$Page$Diff$isSameMajor = F2(
	function (v1, v2) {
		var _v0 = $elm$project_metadata_utils$Elm$Version$toTuple(v2);
		var major2 = _v0.a;
		var _v1 = $elm$project_metadata_utils$Elm$Version$toTuple(v1);
		var major1 = _v1.a;
		return _Utils_eq(major1, major2);
	});
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $author$project$Href$vsnToString = function (maybeVersion) {
	if (maybeVersion.$ === 'Nothing') {
		return 'latest';
	} else {
		var version = maybeVersion.a;
		return $elm$project_metadata_utils$Elm$Version$toString(version);
	}
};
var $author$project$Href$toVersion = F4(
	function (mount, author, project, version) {
		return A2(
			$author$project$Href$join,
			mount,
			A2(
				$elm$url$Url$Builder$absolute,
				_List_fromArray(
					[
						'packages',
						author,
						project,
						$author$project$Href$vsnToString(version),
						''
					]),
				_List_Nil));
	});
var $author$project$Page$Diff$viewReadmeLink = F5(
	function (mount, author, project, version, attrs) {
		var url = A4(
			$author$project$Href$toVersion,
			mount,
			author,
			project,
			$elm$core$Maybe$Just(version));
		return A2(
			$elm$html$Html$a,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$href(url),
				attrs),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$elm$project_metadata_utils$Elm$Version$toString(version))
				]));
	});
var $author$project$Page$Diff$viewReleases = F4(
	function (mount, author, project, versions) {
		if (versions.b) {
			if (versions.b.b) {
				var v1 = versions.a;
				var vs = versions.b;
				var v2 = vs.a;
				var attrs = A2($author$project$Page$Diff$isSameMajor, v1, v2) ? _List_Nil : _List_fromArray(
					[$author$project$Page$Diff$bold]);
				return A2(
					$elm$core$List$cons,
					A5($author$project$Page$Diff$viewReadmeLink, mount, author, project, v1, attrs),
					A2(
						$elm$core$List$cons,
						$elm$html$Html$text(', '),
						A4($author$project$Page$Diff$viewReleases, mount, author, project, vs)));
			} else {
				var r0 = versions.a;
				return _List_fromArray(
					[
						A5(
						$author$project$Page$Diff$viewReadmeLink,
						mount,
						author,
						project,
						r0,
						_List_fromArray(
							[$author$project$Page$Diff$bold]))
					]);
			}
		} else {
			return _List_Nil;
		}
	});
var $author$project$Page$Diff$view = function (model) {
	return {
		attrs: _List_fromArray(
			[
				$elm$html$Html$Attributes$class('pkg-overview')
			]),
		header: _List_fromArray(
			[
				$author$project$Skeleton$authorSegment(model.author),
				A3($author$project$Skeleton$projectSegment, model.session.mountPoint, model.author, model.project)
			]),
		kids: function () {
			var _v0 = model.releases;
			switch (_v0.$) {
				case 'Failure':
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							$author$project$Page$Problem$styles,
							$author$project$Page$Problem$offline('releases.json'))
						]);
				case 'Loading':
					return _List_fromArray(
						[
							$elm$html$Html$text('')
						]);
				default:
					var _v1 = _v0.a;
					var r = _v1.a;
					var rs = _v1.b;
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$h1,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Published Versions')
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							A4(
								$author$project$Page$Diff$viewReleases,
								model.session.mountPoint,
								model.author,
								model.project,
								A2(
									$elm$core$List$map,
									function ($) {
										return $.version;
									},
									A2(
										$elm$core$List$sortBy,
										function ($) {
											return $.time;
										},
										A2($elm$core$List$cons, r, rs)))))
						]);
			}
		}(),
		title: model.author + ('/' + model.project),
		warning: $author$project$Skeleton$NoProblems
	};
};
var $author$project$Page$Docs$getVersion = function (model) {
	var _v0 = model.version;
	if (_v0.$ === 'Just') {
		var version = _v0.a;
		return model.version;
	} else {
		var _v1 = model.releases;
		switch (_v1.$) {
			case 'Success':
				var releases = _v1.a;
				return $elm$core$Maybe$Just(
					$author$project$Release$getLatestVersion(releases));
			case 'Loading':
				return $elm$core$Maybe$Nothing;
			default:
				return $elm$core$Maybe$Nothing;
		}
	}
};
var $author$project$Skeleton$vsnToString = function (maybeVersion) {
	if (maybeVersion.$ === 'Nothing') {
		return 'latest';
	} else {
		var version = maybeVersion.a;
		return $elm$project_metadata_utils$Elm$Version$toString(version);
	}
};
var $author$project$Skeleton$versionSegment = F4(
	function (mount, author, project, version) {
		return A2(
			$author$project$Skeleton$Link,
			A4($author$project$Href$toVersion, mount, author, project, version),
			$author$project$Skeleton$vsnToString(version));
	});
var $author$project$Page$Docs$toHeader = function (model) {
	return _List_fromArray(
		[
			$author$project$Skeleton$authorSegment(model.author),
			A3($author$project$Skeleton$projectSegment, model.session.mountPoint, model.author, model.project),
			A4(
			$author$project$Skeleton$versionSegment,
			model.session.mountPoint,
			model.author,
			model.project,
			$author$project$Page$Docs$getVersion(model))
		]);
};
var $author$project$Page$Docs$toGenericTitle = function (model) {
	var _v0 = $author$project$Page$Docs$getVersion(model);
	if (_v0.$ === 'Just') {
		var version = _v0.a;
		return model.project + (' ' + $elm$project_metadata_utils$Elm$Version$toString(version));
	} else {
		return model.project;
	}
};
var $author$project$Page$Docs$toTitle = function (model) {
	var _v0 = model.focus;
	switch (_v0.$) {
		case 'Readme':
			return $author$project$Page$Docs$toGenericTitle(model);
		case 'About':
			return $author$project$Page$Docs$toGenericTitle(model);
		default:
			var name = _v0.a;
			return name + (' - ' + $author$project$Page$Docs$toGenericTitle(model));
	}
};
var $author$project$Skeleton$WarnMoved = F2(
	function (a, b) {
		return {$: 'WarnMoved', a: a, b: b};
	});
var $author$project$Skeleton$WarnOld = {$: 'WarnOld'};
var $author$project$Page$Docs$getOp = function (op) {
	switch (op) {
		case '<':
			return $elm$core$Maybe$Just($elm$core$Basics$lt);
		case '<=':
			return $elm$core$Maybe$Just($elm$core$Basics$le);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
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
var $author$project$Page$Docs$getVsn = function (vsn) {
	var _v0 = A2(
		$elm$core$List$filterMap,
		$elm$core$String$toInt,
		A2($elm$core$String$split, '.', vsn));
	if (((_v0.b && _v0.b.b) && _v0.b.b.b) && (!_v0.b.b.b.b)) {
		var x = _v0.a;
		var _v1 = _v0.b;
		var y = _v1.a;
		var _v2 = _v1.b;
		var z = _v2.a;
		return $elm$core$Maybe$Just(
			_Utils_Tuple3(x, y, z));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$project_metadata_utils$Elm$Constraint$opToString = function (op) {
	if (op.$ === 'LessThan') {
		return ' < ';
	} else {
		return ' <= ';
	}
};
var $elm$project_metadata_utils$Elm$Constraint$toString = function (_v0) {
	var lower = _v0.a;
	var lop = _v0.b;
	var uop = _v0.c;
	var upper = _v0.d;
	return $elm$project_metadata_utils$Elm$Version$toString(lower) + ($elm$project_metadata_utils$Elm$Constraint$opToString(lop) + ('v' + ($elm$project_metadata_utils$Elm$Constraint$opToString(uop) + $elm$project_metadata_utils$Elm$Version$toString(upper))));
};
var $author$project$Page$Docs$isOld = function (elmConstraint) {
	var _v0 = A2(
		$elm$core$String$split,
		' ',
		$elm$project_metadata_utils$Elm$Constraint$toString(elmConstraint));
	if (((((_v0.b && _v0.b.b) && _v0.b.b.b) && _v0.b.b.b.b) && _v0.b.b.b.b.b) && (!_v0.b.b.b.b.b.b)) {
		var mini = _v0.a;
		var _v1 = _v0.b;
		var minop = _v1.a;
		var _v2 = _v1.b;
		var _v3 = _v2.b;
		var maxop = _v3.a;
		var _v4 = _v3.b;
		var maxi = _v4.a;
		return A2(
			$elm$core$Maybe$withDefault,
			false,
			A5(
				$elm$core$Maybe$map4,
				F4(
					function (low, lop, hop, high) {
						return !(A2(
							lop,
							low,
							_Utils_Tuple3(0, 19, 1)) && A2(
							hop,
							_Utils_Tuple3(0, 19, 1),
							high));
					}),
				$author$project$Page$Docs$getVsn(mini),
				$author$project$Page$Docs$getOp(minop),
				$author$project$Page$Docs$getOp(maxop),
				$author$project$Page$Docs$getVsn(maxi)));
	} else {
		return false;
	}
};
var $author$project$Page$Docs$renames = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			'evancz/elm-effects',
			_Utils_Tuple2('elm', 'core')),
			_Utils_Tuple2(
			'evancz/elm-html',
			_Utils_Tuple2('elm', 'html')),
			_Utils_Tuple2(
			'evancz/elm-http',
			_Utils_Tuple2('elm', 'http')),
			_Utils_Tuple2(
			'evancz/elm-svg',
			_Utils_Tuple2('elm', 'svg')),
			_Utils_Tuple2(
			'evancz/start-app',
			_Utils_Tuple2('elm', 'html')),
			_Utils_Tuple2(
			'evancz/virtual-dom',
			_Utils_Tuple2('elm', 'virtual-dom')),
			_Utils_Tuple2(
			'elm-lang/animation-frame',
			_Utils_Tuple2('elm', 'browser')),
			_Utils_Tuple2(
			'elm-lang/core',
			_Utils_Tuple2('elm', 'core')),
			_Utils_Tuple2(
			'elm-lang/html',
			_Utils_Tuple2('elm', 'html')),
			_Utils_Tuple2(
			'elm-lang/http',
			_Utils_Tuple2('elm', 'http')),
			_Utils_Tuple2(
			'elm-lang/svg',
			_Utils_Tuple2('elm', 'svg')),
			_Utils_Tuple2(
			'elm-lang/virtual-dom',
			_Utils_Tuple2('elm', 'virtual-dom')),
			_Utils_Tuple2(
			'elm-community/elm-list-extra',
			_Utils_Tuple2('elm-community', 'list-extra')),
			_Utils_Tuple2(
			'elm-community/elm-linear-algebra',
			_Utils_Tuple2('elm-community', 'linear-algebra')),
			_Utils_Tuple2(
			'elm-community/elm-lazy-list',
			_Utils_Tuple2('elm-community', 'lazy-list')),
			_Utils_Tuple2(
			'elm-community/elm-json-extra',
			_Utils_Tuple2('elm-community', 'json-extra'))
		]));
var $author$project$Skeleton$WarnNewerVersion = F2(
	function (a, b) {
		return {$: 'WarnNewerVersion', a: a, b: b};
	});
var $author$project$Href$toAbout = F4(
	function (mount, author, project, version) {
		return A2(
			$author$project$Href$join,
			mount,
			A2(
				$elm$url$Url$Builder$absolute,
				_List_fromArray(
					[
						'packages',
						author,
						project,
						$author$project$Href$vsnToString(version),
						'about'
					]),
				_List_Nil));
	});
var $elm$url$Url$Builder$Absolute = {$: 'Absolute'};
var $elm$url$Url$Builder$rootToPrePath = function (root) {
	switch (root.$) {
		case 'Absolute':
			return '/';
		case 'Relative':
			return '';
		default:
			var prePath = root.a;
			return prePath + '/';
	}
};
var $elm$url$Url$Builder$custom = F4(
	function (root, pathSegments, parameters, maybeFragment) {
		var fragmentless = _Utils_ap(
			$elm$url$Url$Builder$rootToPrePath(root),
			_Utils_ap(
				A2($elm$core$String$join, '/', pathSegments),
				$elm$url$Url$Builder$toQuery(parameters)));
		if (maybeFragment.$ === 'Nothing') {
			return fragmentless;
		} else {
			var fragment = maybeFragment.a;
			return fragmentless + ('#' + fragment);
		}
	});
var $author$project$Href$toModule = F6(
	function (mount, author, project, version, moduleName, maybeValue) {
		return A2(
			$author$project$Href$join,
			mount,
			A4(
				$elm$url$Url$Builder$custom,
				$elm$url$Url$Builder$Absolute,
				_List_fromArray(
					[
						'packages',
						author,
						project,
						$author$project$Href$vsnToString(version),
						A3($elm$core$String$replace, '.', '-', moduleName)
					]),
				_List_Nil,
				maybeValue));
	});
var $author$project$Page$Docs$toNewerUrl = function (model) {
	var _v0 = model.focus;
	switch (_v0.$) {
		case 'Readme':
			return A4($author$project$Href$toVersion, model.session.mountPoint, model.author, model.project, $elm$core$Maybe$Nothing);
		case 'About':
			return A4($author$project$Href$toAbout, model.session.mountPoint, model.author, model.project, $elm$core$Maybe$Nothing);
		default:
			var m = _v0.a;
			var v = _v0.b;
			return A6($author$project$Href$toModule, model.session.mountPoint, model.author, model.project, $elm$core$Maybe$Nothing, m, v);
	}
};
var $author$project$Page$Docs$warnIfNewer = function (model) {
	var _v0 = model.version;
	if (_v0.$ === 'Nothing') {
		return $author$project$Skeleton$NoProblems;
	} else {
		var version = _v0.a;
		var _v1 = model.releases;
		switch (_v1.$) {
			case 'Failure':
				return $author$project$Skeleton$NoProblems;
			case 'Loading':
				return $author$project$Skeleton$NoProblems;
			default:
				var releases = _v1.a;
				var latest = $author$project$Release$getLatestVersion(releases);
				return _Utils_eq(version, latest) ? $author$project$Skeleton$NoProblems : A2(
					$author$project$Skeleton$WarnNewerVersion,
					$author$project$Page$Docs$toNewerUrl(model),
					latest);
		}
	}
};
var $author$project$Page$Docs$toWarning = function (model) {
	var _v0 = A2($elm$core$Dict$get, model.author + ('/' + model.project), $author$project$Page$Docs$renames);
	if (_v0.$ === 'Just') {
		var _v1 = _v0.a;
		var author = _v1.a;
		var project = _v1.b;
		return A2($author$project$Skeleton$WarnMoved, author, project);
	} else {
		var _v2 = model.outline;
		switch (_v2.$) {
			case 'Failure':
				return $author$project$Page$Docs$warnIfNewer(model);
			case 'Loading':
				return $author$project$Page$Docs$warnIfNewer(model);
			default:
				var outline = _v2.a;
				return $author$project$Page$Docs$isOld(outline.elm) ? $author$project$Skeleton$WarnOld : $author$project$Page$Docs$warnIfNewer(model);
		}
	}
};
var $elm$virtual_dom$VirtualDom$lazy = _VirtualDom_lazy;
var $elm$html$Html$Lazy$lazy = $elm$virtual_dom$VirtualDom$lazy;
var $elm$virtual_dom$VirtualDom$lazy2 = _VirtualDom_lazy2;
var $elm$html$Html$Lazy$lazy2 = $elm$virtual_dom$VirtualDom$lazy2;
var $elm$virtual_dom$VirtualDom$lazy5 = _VirtualDom_lazy5;
var $elm$html$Html$Lazy$lazy5 = $elm$virtual_dom$VirtualDom$lazy5;
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$url$Url$Builder$crossOrigin = F3(
	function (prePath, pathSegments, parameters) {
		return prePath + ('/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters)));
	});
var $elm$project_metadata_utils$Elm$Package$toString = function (_v0) {
	var user = _v0.a;
	var project = _v0.b;
	return user + ('/' + project);
};
var $author$project$Page$Docs$toLicenseUrl = function (outline) {
	return A3(
		$elm$url$Url$Builder$crossOrigin,
		'https://github.com',
		_List_fromArray(
			[
				$elm$project_metadata_utils$Elm$Package$toString(outline.name),
				'blob',
				$elm$project_metadata_utils$Elm$Version$toString(outline.version),
				'LICENSE'
			]),
		_List_Nil);
};
var $elm$project_metadata_utils$Elm$License$toString = function (_v0) {
	var spdx = _v0.a;
	return spdx;
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$Page$Docs$viewDependency = F2(
	function (mount, _v0) {
		var pkg = _v0.a;
		var constraint = _v0.b;
		return A2(
			$elm$html$Html$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							function () {
							var _v1 = A2(
								$elm$core$String$split,
								'/',
								$elm$project_metadata_utils$Elm$Package$toString(pkg));
							if ((_v1.b && _v1.b.b) && (!_v1.b.b.b)) {
								var author = _v1.a;
								var _v2 = _v1.b;
								var project = _v2.a;
								return A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$href(
											A4($author$project$Href$toVersion, mount, author, project, $elm$core$Maybe$Nothing))
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('light')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(author + '/')
												])),
											$elm$html$Html$text(project)
										]));
							} else {
								return $elm$html$Html$text(
									$elm$project_metadata_utils$Elm$Package$toString(pkg));
							}
						}()
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$code,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$project_metadata_utils$Elm$Constraint$toString(constraint))
								]))
						]))
				]));
	});
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $author$project$Release$getTimeHelp = F2(
	function (version, releases) {
		getTimeHelp:
		while (true) {
			if (releases.b) {
				var r = releases.a;
				var rs = releases.b;
				if (_Utils_eq(r.version, version)) {
					return $elm$core$Maybe$Just(
						$elm$time$Time$millisToPosix(r.time * 1000));
				} else {
					var $temp$version = version,
						$temp$releases = rs;
					version = $temp$version;
					releases = $temp$releases;
					continue getTimeHelp;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$Release$getTime = F2(
	function (version, _v0) {
		var r = _v0.a;
		var rs = _v0.b;
		return A2(
			$author$project$Release$getTimeHelp,
			version,
			A2($elm$core$List$cons, r, rs));
	});
var $author$project$Page$Docs$monthToString = function (month) {
	switch (month.$) {
		case 'Jan':
			return 'Jan';
		case 'Feb':
			return 'Feb';
		case 'Mar':
			return 'Mar';
		case 'Apr':
			return 'Apr';
		case 'May':
			return 'May';
		case 'Jun':
			return 'Jun';
		case 'Jul':
			return 'Jul';
		case 'Aug':
			return 'Aug';
		case 'Sep':
			return 'Sep';
		case 'Oct':
			return 'Oct';
		case 'Nov':
			return 'Nov';
		default:
			return 'Dec';
	}
};
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0.a;
	return millis;
};
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.start, posixMinutes) < 0) {
					return posixMinutes + era.offset;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		day: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		month: month,
		year: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).day;
	});
var $elm$time$Time$Apr = {$: 'Apr'};
var $elm$time$Time$Aug = {$: 'Aug'};
var $elm$time$Time$Dec = {$: 'Dec'};
var $elm$time$Time$Feb = {$: 'Feb'};
var $elm$time$Time$Jan = {$: 'Jan'};
var $elm$time$Time$Jul = {$: 'Jul'};
var $elm$time$Time$Jun = {$: 'Jun'};
var $elm$time$Time$Mar = {$: 'Mar'};
var $elm$time$Time$May = {$: 'May'};
var $elm$time$Time$Nov = {$: 'Nov'};
var $elm$time$Time$Oct = {$: 'Oct'};
var $elm$time$Time$Sep = {$: 'Sep'};
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).month;
		switch (_v0) {
			case 1:
				return $elm$time$Time$Jan;
			case 2:
				return $elm$time$Time$Feb;
			case 3:
				return $elm$time$Time$Mar;
			case 4:
				return $elm$time$Time$Apr;
			case 5:
				return $elm$time$Time$May;
			case 6:
				return $elm$time$Time$Jun;
			case 7:
				return $elm$time$Time$Jul;
			case 8:
				return $elm$time$Time$Aug;
			case 9:
				return $elm$time$Time$Sep;
			case 10:
				return $elm$time$Time$Oct;
			case 11:
				return $elm$time$Time$Nov;
			default:
				return $elm$time$Time$Dec;
		}
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).year;
	});
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 'Zone', a: a, b: b};
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$Page$Docs$timeToString = function (time) {
	return $elm$core$String$fromInt(
		A2($elm$time$Time$toDay, $elm$time$Time$utc, time)) + (' ' + ($author$project$Page$Docs$monthToString(
		A2($elm$time$Time$toMonth, $elm$time$Time$utc, time)) + (' ' + $elm$core$String$fromInt(
		A2($elm$time$Time$toYear, $elm$time$Time$utc, time)))));
};
var $author$project$Page$Docs$viewReleaseTime = F2(
	function (outline, releasesStatus) {
		switch (releasesStatus.$) {
			case 'Failure':
				return $elm$html$Html$text('');
			case 'Loading':
				return $elm$html$Html$text('');
			default:
				var releases = releasesStatus.a;
				var _v1 = A2($author$project$Release$getTime, outline.version, releases);
				if (_v1.$ === 'Nothing') {
					return $elm$html$Html$text('');
				} else {
					var time = _v1.a;
					return A2(
						$elm$html$Html$span,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('on '),
								A2(
								$elm$html$Html$code,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Page$Docs$timeToString(time))
									]))
							]));
				}
		}
	});
var $author$project$Page$Docs$viewAbout = F3(
	function (mount, outlineStatus, releases) {
		switch (outlineStatus.$) {
			case 'Success':
				var outline = outlineStatus.a;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('block-list pkg-about')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h1,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('block-list-title')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('About')
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(outline.summary)
								])),
							A2(
							$elm$html$Html$pre,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$code,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											'elm install ' + $elm$project_metadata_utils$Elm$Package$toString(outline.name))
										]))
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Published '),
									A2($author$project$Page$Docs$viewReleaseTime, outline, releases),
									$elm$html$Html$text(' under the '),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$href(
											$author$project$Page$Docs$toLicenseUrl(outline))
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$code,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													$elm$project_metadata_utils$Elm$License$toString(outline.license))
												]))
										])),
									$elm$html$Html$text(' license.')
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Elm version '),
									A2(
									$elm$html$Html$code,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$project_metadata_utils$Elm$Constraint$toString(outline.elm))
										]))
								])),
							function () {
							var _v1 = outline.deps;
							if (!_v1.b) {
								return $elm$html$Html$text('');
							} else {
								return A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$h1,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'margin-top', '2em'),
													A2($elm$html$Html$Attributes$style, 'margin-bottom', '0.5em')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Dependencies')
												])),
											A2(
											$elm$html$Html$table,
											_List_Nil,
											A2(
												$elm$core$List$map,
												$author$project$Page$Docs$viewDependency(mount),
												outline.deps))
										]));
							}
						}()
						]));
			case 'Loading':
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('block-list pkg-about')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('')
						]));
			default:
				return A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('block-list pkg-about'),
						$author$project$Page$Problem$styles),
					$author$project$Page$Problem$offline('elm.json'));
		}
	});
var $author$project$Page$Docs$findModule = F2(
	function (name, docsList) {
		findModule:
		while (true) {
			if (!docsList.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var docs = docsList.a;
				var otherDocs = docsList.b;
				if (_Utils_eq(docs.name, name)) {
					return $elm$core$Maybe$Just(docs);
				} else {
					var $temp$name = name,
						$temp$docsList = otherDocs;
					name = $temp$name;
					docsList = $temp$docsList;
					continue findModule;
				}
			}
		}
	});
var $author$project$Page$Docs$Block$Info = F5(
	function (author, project, version, moduleName, typeNameDict) {
		return {author: author, moduleName: moduleName, project: project, typeNameDict: typeNameDict, version: version};
	});
var $author$project$Page$Docs$Block$makeInfo = F5(
	function (author, project, version, moduleName, docsList) {
		var addUnion = F3(
			function (home, union, docs) {
				return A3(
					$elm$core$Dict$insert,
					home + ('.' + union.name),
					_Utils_Tuple2(home, union.name),
					docs);
			});
		var addModule = F2(
			function (docs, dict) {
				return A3(
					$elm$core$List$foldl,
					addUnion(docs.name),
					dict,
					docs.unions);
			});
		return A5(
			$author$project$Page$Docs$Block$Info,
			author,
			project,
			version,
			moduleName,
			A3($elm$core$List$foldl, addModule, $elm$core$Dict$empty, docsList));
	});
var $elm$html$Html$br = _VirtualDom_node('br');
var $author$project$Page$Problem$missingModule = F5(
	function (mount, author, project, version, name) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'font-size', '3em')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Module not found')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Maybe it existed in a '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href(
								A3($author$project$Href$toProject, mount, author, project))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('previous release')
							])),
						$elm$html$Html$text('?'),
						A2($elm$html$Html$br, _List_Nil, _List_Nil),
						$elm$html$Html$text('Maybe the '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href(
								A4($author$project$Href$toVersion, mount, author, project, version))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('README')
							])),
						$elm$html$Html$text(' will help you figure out what changed?')
					]))
			]);
	});
var $elm$project_metadata_utils$Elm$Docs$MarkdownBlock = function (a) {
	return {$: 'MarkdownBlock', a: a};
};
var $elm$project_metadata_utils$Elm$Docs$AliasBlock = function (a) {
	return {$: 'AliasBlock', a: a};
};
var $elm$project_metadata_utils$Elm$Docs$BinopBlock = function (a) {
	return {$: 'BinopBlock', a: a};
};
var $elm$project_metadata_utils$Elm$Docs$UnionBlock = function (a) {
	return {$: 'UnionBlock', a: a};
};
var $elm$project_metadata_utils$Elm$Docs$UnknownBlock = function (a) {
	return {$: 'UnknownBlock', a: a};
};
var $elm$project_metadata_utils$Elm$Docs$ValueBlock = function (a) {
	return {$: 'ValueBlock', a: a};
};
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$project_metadata_utils$Elm$Docs$find = F4(
	function (toBlock, name, entries, fallback) {
		find:
		while (true) {
			if (!entries.b) {
				return fallback;
			} else {
				var entry = entries.a;
				var rest = entries.b;
				if (_Utils_eq(entry.name, name)) {
					return toBlock(entry);
				} else {
					var $temp$toBlock = toBlock,
						$temp$name = name,
						$temp$entries = rest,
						$temp$fallback = fallback;
					toBlock = $temp$toBlock;
					name = $temp$name;
					entries = $temp$entries;
					fallback = $temp$fallback;
					continue find;
				}
			}
		}
	});
var $elm$project_metadata_utils$Elm$Docs$nameToBlock = F2(
	function (docs, docsName) {
		var name = A2($elm$core$String$startsWith, '(', docsName) ? A2(
			$elm$core$String$dropLeft,
			1,
			A2($elm$core$String$dropRight, 1, docsName)) : docsName;
		return A4(
			$elm$project_metadata_utils$Elm$Docs$find,
			$elm$project_metadata_utils$Elm$Docs$ValueBlock,
			name,
			docs.values,
			A4(
				$elm$project_metadata_utils$Elm$Docs$find,
				$elm$project_metadata_utils$Elm$Docs$BinopBlock,
				name,
				docs.binops,
				A4(
					$elm$project_metadata_utils$Elm$Docs$find,
					$elm$project_metadata_utils$Elm$Docs$UnionBlock,
					name,
					docs.unions,
					A4(
						$elm$project_metadata_utils$Elm$Docs$find,
						$elm$project_metadata_utils$Elm$Docs$AliasBlock,
						name,
						docs.aliases,
						$elm$project_metadata_utils$Elm$Docs$UnknownBlock(name)))));
	});
var $elm$core$String$trim = _String_trim;
var $elm$core$String$trimLeft = _String_trimLeft;
var $elm$core$String$words = _String_words;
var $elm$project_metadata_utils$Elm$Docs$partsToBlocks = F2(
	function (docs, parts) {
		if (!parts.b) {
			return _List_Nil;
		} else {
			var part = parts.a;
			var otherParts = parts.b;
			var _v1 = $elm$core$String$words(
				$elm$core$String$trim(part));
			if (!_v1.b) {
				return _List_fromArray(
					[
						$elm$project_metadata_utils$Elm$Docs$MarkdownBlock(
						A2($elm$core$String$join, ',', parts))
					]);
			} else {
				if (!_v1.b.b) {
					var name = _v1.a;
					return A2(
						$elm$core$List$cons,
						A2($elm$project_metadata_utils$Elm$Docs$nameToBlock, docs, name),
						A2($elm$project_metadata_utils$Elm$Docs$partsToBlocks, docs, otherParts));
				} else {
					var name = _v1.a;
					return _List_fromArray(
						[
							A2($elm$project_metadata_utils$Elm$Docs$nameToBlock, docs, name),
							$elm$project_metadata_utils$Elm$Docs$MarkdownBlock(
							A2(
								$elm$core$String$join,
								',',
								A2(
									$elm$core$List$cons,
									A2(
										$elm$core$String$dropLeft,
										$elm$core$String$length(name),
										$elm$core$String$trimLeft(part)),
									otherParts)))
						]);
				}
			}
		}
	});
var $elm$project_metadata_utils$Elm$Docs$chunkToBlocks = F2(
	function (docs, chunk) {
		return A2(
			$elm$project_metadata_utils$Elm$Docs$partsToBlocks,
			docs,
			A2($elm$core$String$split, ',', chunk));
	});
var $elm$project_metadata_utils$Elm$Docs$toBlocks = function (docs) {
	var _v0 = A2($elm$core$String$split, '\n@docs ', docs.comment);
	if (!_v0.b) {
		return _List_Nil;
	} else {
		var firstMarkdown = _v0.a;
		var docsChunks = _v0.b;
		return A2(
			$elm$core$List$cons,
			$elm$project_metadata_utils$Elm$Docs$MarkdownBlock(firstMarkdown),
			A2(
				$elm$core$List$concatMap,
				$elm$project_metadata_utils$Elm$Docs$chunkToBlocks(docs),
				docsChunks));
	}
};
var $elm_explorations$markdown$Markdown$defaultOptions = {
	defaultHighlighting: $elm$core$Maybe$Nothing,
	githubFlavored: $elm$core$Maybe$Just(
		{breaks: false, tables: false}),
	sanitize: true,
	smartypants: false
};
var $author$project$Utils$Markdown$myOptions = _Utils_update(
	$elm_explorations$markdown$Markdown$defaultOptions,
	{
		defaultHighlighting: $elm$core$Maybe$Just('elm')
	});
var $elm_explorations$markdown$Markdown$toHtmlWith = _Markdown_toHtml;
var $author$project$Utils$Markdown$block = function (raw) {
	return A3($elm_explorations$markdown$Markdown$toHtmlWith, $author$project$Utils$Markdown$myOptions, _List_Nil, raw);
};
var $author$project$Page$Docs$Block$Other = {$: 'Other'};
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $author$project$Page$Docs$Block$equals = A2(
	$elm$html$Html$span,
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text('=')
		]));
var $author$project$Page$Docs$Block$indentFour = $elm$core$List$cons(
	$elm$html$Html$text('    '));
var $author$project$Page$Docs$Block$keyword = function (kw) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('hljs-keyword')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(kw)
			]));
};
var $author$project$Page$Docs$Block$linesToList = function (lines) {
	if (lines.$ === 'One') {
		var line = lines.b;
		return _List_fromArray(
			[line]);
	} else {
		var x = lines.a;
		var xs = lines.b;
		return A2($elm$core$List$cons, x, xs);
	}
};
var $author$project$Page$Docs$Block$space = $elm$html$Html$text(' ');
var $author$project$Page$Docs$Block$bold = A2($elm$html$Html$Attributes$style, 'font-weight', 'bold');
var $author$project$Page$Docs$Block$makeLink = F5(
	function (mount, _v0, attrs, tagName, humanName) {
		var author = _v0.author;
		var project = _v0.project;
		var version = _v0.version;
		var moduleName = _v0.moduleName;
		var url = A6(
			$author$project$Href$toModule,
			mount,
			author,
			project,
			version,
			moduleName,
			$elm$core$Maybe$Just(tagName));
		return A2(
			$elm$html$Html$a,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$href(url),
				attrs),
			_List_fromArray(
				[
					$elm$html$Html$text(humanName)
				]));
	});
var $author$project$Page$Docs$Block$toBoldLink = F3(
	function (mount, info, name) {
		return A5(
			$author$project$Page$Docs$Block$makeLink,
			mount,
			info,
			_List_fromArray(
				[$author$project$Page$Docs$Block$bold]),
			name,
			name);
	});
var $author$project$Page$Docs$Block$App = {$: 'App'};
var $author$project$Page$Docs$Block$Func = {$: 'Func'};
var $author$project$Page$Docs$Block$More = F2(
	function (a, b) {
		return {$: 'More', a: a, b: b};
	});
var $author$project$Page$Docs$Block$One = F2(
	function (a, b) {
		return {$: 'One', a: a, b: b};
	});
var $author$project$Page$Docs$Block$collectArgs = F2(
	function (revArgs, tipe) {
		collectArgs:
		while (true) {
			if (tipe.$ === 'Lambda') {
				var arg = tipe.a;
				var result = tipe.b;
				var $temp$revArgs = A2($elm$core$List$cons, arg, revArgs),
					$temp$tipe = result;
				revArgs = $temp$revArgs;
				tipe = $temp$tipe;
				continue collectArgs;
			} else {
				return $elm$core$List$reverse(
					A2($elm$core$List$cons, tipe, revArgs));
			}
		}
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Page$Docs$Block$OneOrMore = F2(
	function (a, b) {
		return {$: 'OneOrMore', a: a, b: b};
	});
var $author$project$Page$Docs$Block$toOneOrMore = function (lines) {
	if (lines.$ === 'One') {
		var line = lines.b;
		return A2($author$project$Page$Docs$Block$OneOrMore, line, _List_Nil);
	} else {
		var x = lines.a;
		var xs = lines.b;
		return A2($author$project$Page$Docs$Block$OneOrMore, x, xs);
	}
};
var $author$project$Page$Docs$Block$lambdaMore = {
	close: $elm$core$Maybe$Nothing,
	open: _List_Nil,
	openIndent: 0,
	sep: $elm$html$Html$text('-> '),
	sepIndent: 3,
	toLines: $author$project$Page$Docs$Block$toOneOrMore
};
var $author$project$Page$Docs$Block$lambdaMoreParens = {
	close: $elm$core$Maybe$Just(
		_List_fromArray(
			[
				$elm$html$Html$text(')')
			])),
	open: _List_fromArray(
		[
			$elm$html$Html$text('( ')
		]),
	openIndent: 2,
	sep: $elm$html$Html$text('  -> '),
	sepIndent: 5,
	toLines: $author$project$Page$Docs$Block$toOneOrMore
};
var $author$project$Page$Docs$Block$toLine = function (lines) {
	if (lines.$ === 'One') {
		var width = lines.a;
		var line = lines.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(width, line));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Page$Docs$Block$lambdaOne = {
	close: _List_Nil,
	closeWidth: 0,
	open: _List_Nil,
	openWidth: 0,
	sep: _List_fromArray(
		[
			$elm$html$Html$text(' -> ')
		]),
	sepWidth: 2,
	toLine: $author$project$Page$Docs$Block$toLine
};
var $author$project$Page$Docs$Block$lambdaOneParens = {
	close: _List_fromArray(
		[
			$elm$html$Html$text(')')
		]),
	closeWidth: 1,
	open: _List_fromArray(
		[
			$elm$html$Html$text('(')
		]),
	openWidth: 1,
	sep: _List_fromArray(
		[
			$elm$html$Html$text(' -> ')
		]),
	sepWidth: 2,
	toLine: $author$project$Page$Docs$Block$toLine
};
var $author$project$Page$Docs$Block$colon = A2(
	$elm$html$Html$span,
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text(':')
		]));
var $author$project$Page$Docs$Block$maxWidth = 64;
var $author$project$Page$Docs$Block$fieldToLines = function (_v0) {
	var field = _v0.a;
	var lines = _v0.b;
	if (lines.$ === 'One') {
		var width = lines.a;
		var line = lines.b;
		var potentialWidth = ($elm$core$String$length(field) + 3) + width;
		return (_Utils_cmp(potentialWidth, $author$project$Page$Docs$Block$maxWidth) < 0) ? A2(
			$author$project$Page$Docs$Block$OneOrMore,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$text(field),
				A2(
					$elm$core$List$cons,
					$author$project$Page$Docs$Block$space,
					A2(
						$elm$core$List$cons,
						$author$project$Page$Docs$Block$colon,
						A2($elm$core$List$cons, $author$project$Page$Docs$Block$space, line)))),
			_List_Nil) : A2(
			$author$project$Page$Docs$Block$OneOrMore,
			_List_fromArray(
				[
					$elm$html$Html$text(field),
					$author$project$Page$Docs$Block$space,
					$author$project$Page$Docs$Block$colon
				]),
			_List_fromArray(
				[line]));
	} else {
		var x = lines.a;
		var xs = lines.b;
		return A2(
			$author$project$Page$Docs$Block$OneOrMore,
			_List_fromArray(
				[
					$elm$html$Html$text(field),
					$author$project$Page$Docs$Block$space,
					$author$project$Page$Docs$Block$colon
				]),
			A2($elm$core$List$cons, x, xs));
	}
};
var $author$project$Page$Docs$Block$recordMore = {
	close: $elm$core$Maybe$Just(
		_List_fromArray(
			[
				$elm$html$Html$text('}')
			])),
	open: _List_fromArray(
		[
			$elm$html$Html$text('{ ')
		]),
	openIndent: 6,
	sep: $elm$html$Html$text(', '),
	sepIndent: 6,
	toLines: $author$project$Page$Docs$Block$fieldToLines
};
var $author$project$Page$Docs$Block$recordMoreExt = {
	close: $elm$core$Maybe$Nothing,
	open: _List_fromArray(
		[
			$elm$html$Html$text('    | ')
		]),
	openIndent: 10,
	sep: $elm$html$Html$text('    , '),
	sepIndent: 10,
	toLines: $author$project$Page$Docs$Block$fieldToLines
};
var $author$project$Page$Docs$Block$fieldToLine = function (_v0) {
	var field = _v0.a;
	var lines = _v0.b;
	if (lines.$ === 'More') {
		return $elm$core$Maybe$Nothing;
	} else {
		var width = lines.a;
		var line = lines.b;
		return $elm$core$Maybe$Just(
			_Utils_Tuple2(
				($elm$core$String$length(field) + 3) + width,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$text(field),
					A2(
						$elm$core$List$cons,
						$author$project$Page$Docs$Block$space,
						A2(
							$elm$core$List$cons,
							$author$project$Page$Docs$Block$colon,
							A2($elm$core$List$cons, $author$project$Page$Docs$Block$space, line))))));
	}
};
var $author$project$Page$Docs$Block$recordOne = {
	close: _List_fromArray(
		[
			$elm$html$Html$text(' }')
		]),
	closeWidth: 2,
	open: _List_fromArray(
		[
			$elm$html$Html$text('{ ')
		]),
	openWidth: 2,
	sep: _List_fromArray(
		[
			$elm$html$Html$text(', ')
		]),
	sepWidth: 2,
	toLine: $author$project$Page$Docs$Block$fieldToLine
};
var $author$project$Page$Docs$Block$recordOneExt = function (extension) {
	var open = '{ ' + (extension + ' | ');
	return {
		close: _List_fromArray(
			[
				$elm$html$Html$text(' }')
			]),
		closeWidth: 2,
		open: _List_fromArray(
			[
				$elm$html$Html$text(open)
			]),
		openWidth: $elm$core$String$length(open),
		sep: _List_fromArray(
			[
				$elm$html$Html$text(', ')
			]),
		sepWidth: 2,
		toLine: $author$project$Page$Docs$Block$fieldToLine
	};
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $author$project$Page$Docs$Block$toMoreLines = F3(
	function (s, x, xs) {
		var sepIndentation = $elm$html$Html$text(
			A2($elm$core$String$repeat, s.sepIndent, ' '));
		var toChunk = function (_v2) {
			var y = _v2.a;
			var ys = _v2.b;
			return A2(
				$elm$core$List$cons,
				A2($elm$core$List$cons, s.sep, y),
				A2(
					$elm$core$List$map,
					$elm$core$List$cons(sepIndentation),
					ys));
		};
		var openIndentation = $elm$html$Html$text(
			A2($elm$core$String$repeat, s.openIndent, ' '));
		var _v0 = s.toLines(x);
		var firstLine = _v0.a;
		var firstRest = _v0.b;
		var otherLines = _Utils_ap(
			A2(
				$elm$core$List$map,
				$elm$core$List$cons(openIndentation),
				firstRest),
			A2(
				$elm$core$List$concatMap,
				A2($elm$core$Basics$composeL, toChunk, s.toLines),
				xs));
		return A2(
			$author$project$Page$Docs$Block$More,
			_Utils_ap(s.open, firstLine),
			function () {
				var _v1 = s.close;
				if (_v1.$ === 'Nothing') {
					return otherLines;
				} else {
					var closer = _v1.a;
					return _Utils_ap(
						otherLines,
						_List_fromArray(
							[closer]));
				}
			}());
	});
var $author$project$Page$Docs$Block$toOneLine = F4(
	function (chunkWidth, chunk, one, entries) {
		if (!entries.b) {
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(one.closeWidth, one.close));
		} else {
			var entry = entries.a;
			var remainingEntries = entries.b;
			var _v1 = one.toLine(entry);
			if (_v1.$ === 'Nothing') {
				return $elm$core$Maybe$Nothing;
			} else {
				var _v2 = _v1.a;
				var entryWidth = _v2.a;
				var line = _v2.b;
				var _v3 = A4($author$project$Page$Docs$Block$toOneLine, one.sepWidth, one.sep, one, remainingEntries);
				if (_v3.$ === 'Nothing') {
					return $elm$core$Maybe$Nothing;
				} else {
					var _v4 = _v3.a;
					var remainingWidth = _v4.a;
					var remainingLine = _v4.b;
					var width = (chunkWidth + entryWidth) + remainingWidth;
					return (_Utils_cmp(width, $author$project$Page$Docs$Block$maxWidth) < 0) ? $elm$core$Maybe$Just(
						_Utils_Tuple2(
							width,
							_Utils_ap(
								chunk,
								_Utils_ap(line, remainingLine)))) : $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $author$project$Page$Docs$Block$toLinesHelp = F4(
	function (one, more, x, xs) {
		var maybeOneLine = A4(
			$author$project$Page$Docs$Block$toOneLine,
			one.openWidth,
			one.open,
			one,
			A2($elm$core$List$cons, x, xs));
		if (maybeOneLine.$ === 'Just') {
			var _v1 = maybeOneLine.a;
			var width = _v1.a;
			var line = _v1.b;
			return A2($author$project$Page$Docs$Block$One, width, line);
		} else {
			return A3($author$project$Page$Docs$Block$toMoreLines, more, x, xs);
		}
	});
var $author$project$Page$Docs$Block$last = F2(
	function (backup, list) {
		last:
		while (true) {
			if (!list.b) {
				return backup;
			} else {
				if (!list.b.b) {
					var x = list.a;
					return x;
				} else {
					var xs = list.b;
					var $temp$backup = backup,
						$temp$list = xs;
					backup = $temp$backup;
					list = $temp$list;
					continue last;
				}
			}
		}
	});
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$Page$Docs$Block$toLinkLine = F3(
	function (mount, info, qualifiedName) {
		var _v0 = A2($elm$core$Dict$get, qualifiedName, info.typeNameDict);
		if (_v0.$ === 'Nothing') {
			var shortName = A2(
				$author$project$Page$Docs$Block$last,
				qualifiedName,
				A2($elm$core$String$split, '.', qualifiedName));
			return A2(
				$author$project$Page$Docs$Block$One,
				$elm$core$String$length(shortName),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$title(qualifiedName)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(shortName)
							]))
					]));
		} else {
			var _v1 = _v0.a;
			var moduleName = _v1.a;
			var name = _v1.b;
			return A2(
				$author$project$Page$Docs$Block$One,
				$elm$core$String$length(name),
				_List_fromArray(
					[
						A5(
						$author$project$Page$Docs$Block$makeLink,
						mount,
						_Utils_update(
							info,
							{moduleName: moduleName}),
						_List_Nil,
						name,
						name)
					]));
		}
	});
var $author$project$Page$Docs$Block$tupleMore = {
	close: $elm$core$Maybe$Just(
		_List_fromArray(
			[
				$elm$html$Html$text(')')
			])),
	open: _List_fromArray(
		[
			$elm$html$Html$text('( ')
		]),
	openIndent: 2,
	sep: $elm$html$Html$text(', '),
	sepIndent: 2,
	toLines: $author$project$Page$Docs$Block$toOneOrMore
};
var $author$project$Page$Docs$Block$tupleOne = {
	close: _List_fromArray(
		[
			$elm$html$Html$text(' )')
		]),
	closeWidth: 2,
	open: _List_fromArray(
		[
			$elm$html$Html$text('( ')
		]),
	openWidth: 2,
	sep: _List_fromArray(
		[
			$elm$html$Html$text(', ')
		]),
	sepWidth: 2,
	toLine: $author$project$Page$Docs$Block$toLine
};
var $author$project$Page$Docs$Block$typeMore = function (needsParens) {
	return needsParens ? {
		close: $elm$core$Maybe$Just(
			_List_fromArray(
				[
					$elm$html$Html$text(')')
				])),
		open: _List_fromArray(
			[
				$elm$html$Html$text('(')
			]),
		openIndent: 0,
		sep: $elm$html$Html$text('    '),
		sepIndent: 4,
		toLines: $author$project$Page$Docs$Block$toOneOrMore
	} : {
		close: $elm$core$Maybe$Nothing,
		open: _List_Nil,
		openIndent: 0,
		sep: $elm$html$Html$text('    '),
		sepIndent: 4,
		toLines: $author$project$Page$Docs$Block$toOneOrMore
	};
};
var $author$project$Page$Docs$Block$typeOne = function (needsParens) {
	return needsParens ? {
		close: _List_fromArray(
			[
				$elm$html$Html$text(')')
			]),
		closeWidth: 1,
		open: _List_fromArray(
			[
				$elm$html$Html$text('(')
			]),
		openWidth: 1,
		sep: _List_fromArray(
			[
				$elm$html$Html$text(' ')
			]),
		sepWidth: 1,
		toLine: $author$project$Page$Docs$Block$toLine
	} : {
		close: _List_Nil,
		closeWidth: 0,
		open: _List_Nil,
		openWidth: 0,
		sep: _List_fromArray(
			[
				$elm$html$Html$text(' ')
			]),
		sepWidth: 1,
		toLine: $author$project$Page$Docs$Block$toLine
	};
};
var $author$project$Page$Docs$Block$toLines = F4(
	function (mount, info, context, tipe) {
		switch (tipe.$) {
			case 'Var':
				var x = tipe.a;
				return A2(
					$author$project$Page$Docs$Block$One,
					$elm$core$String$length(x),
					_List_fromArray(
						[
							$elm$html$Html$text(x)
						]));
			case 'Lambda':
				var arg = tipe.a;
				var result = tipe.b;
				var lambdaToLine = _Utils_eq(context, $author$project$Page$Docs$Block$Other) ? A2($author$project$Page$Docs$Block$toLinesHelp, $author$project$Page$Docs$Block$lambdaOne, $author$project$Page$Docs$Block$lambdaMore) : A2($author$project$Page$Docs$Block$toLinesHelp, $author$project$Page$Docs$Block$lambdaOneParens, $author$project$Page$Docs$Block$lambdaMoreParens);
				return A2(
					lambdaToLine,
					A4($author$project$Page$Docs$Block$toLines, mount, info, $author$project$Page$Docs$Block$Func, arg),
					A2(
						$elm$core$List$map,
						A3($author$project$Page$Docs$Block$toLines, mount, info, $author$project$Page$Docs$Block$Func),
						A2($author$project$Page$Docs$Block$collectArgs, _List_Nil, result)));
			case 'Tuple':
				if (!tipe.a.b) {
					return A2(
						$author$project$Page$Docs$Block$One,
						2,
						_List_fromArray(
							[
								$elm$html$Html$text('()')
							]));
				} else {
					var _v1 = tipe.a;
					var arg = _v1.a;
					var args = _v1.b;
					return A4(
						$author$project$Page$Docs$Block$toLinesHelp,
						$author$project$Page$Docs$Block$tupleOne,
						$author$project$Page$Docs$Block$tupleMore,
						A4($author$project$Page$Docs$Block$toLines, mount, info, $author$project$Page$Docs$Block$Other, arg),
						A2(
							$elm$core$List$map,
							A3($author$project$Page$Docs$Block$toLines, mount, info, $author$project$Page$Docs$Block$Other),
							args));
				}
			case 'Type':
				var name = tipe.a;
				var args = tipe.b;
				var needsParens = _Utils_eq(context, $author$project$Page$Docs$Block$App) && (!$elm$core$List$isEmpty(args));
				return A4(
					$author$project$Page$Docs$Block$toLinesHelp,
					$author$project$Page$Docs$Block$typeOne(needsParens),
					$author$project$Page$Docs$Block$typeMore(needsParens),
					A3($author$project$Page$Docs$Block$toLinkLine, mount, info, name),
					A2(
						$elm$core$List$map,
						A3($author$project$Page$Docs$Block$toLines, mount, info, $author$project$Page$Docs$Block$App),
						args));
			default:
				if (!tipe.a.b) {
					if (tipe.b.$ === 'Nothing') {
						var _v2 = tipe.b;
						return A2(
							$author$project$Page$Docs$Block$One,
							2,
							_List_fromArray(
								[
									$elm$html$Html$text('{}')
								]));
					} else {
						var ext = tipe.b.a;
						return A2(
							$author$project$Page$Docs$Block$One,
							6 + $elm$core$String$length(ext),
							_List_fromArray(
								[
									$elm$html$Html$text('{ ' + (ext + ' | }'))
								]));
					}
				} else {
					var _v3 = tipe.a;
					var f = _v3.a;
					var fs = _v3.b;
					var extension = tipe.b;
					var toLns = function (_v6) {
						var field = _v6.a;
						var fieldType = _v6.b;
						return _Utils_Tuple2(
							field,
							A4($author$project$Page$Docs$Block$toLines, mount, info, $author$project$Page$Docs$Block$Other, fieldType));
					};
					if (extension.$ === 'Nothing') {
						return $elm$core$List$isEmpty(fs) ? A4(
							$author$project$Page$Docs$Block$toLinesHelp,
							$author$project$Page$Docs$Block$recordOne,
							$author$project$Page$Docs$Block$recordMore,
							toLns(f),
							A2($elm$core$List$map, toLns, fs)) : A3(
							$author$project$Page$Docs$Block$toMoreLines,
							$author$project$Page$Docs$Block$recordMore,
							toLns(f),
							A2($elm$core$List$map, toLns, fs));
					} else {
						var ext = extension.a;
						var _v5 = A4(
							$author$project$Page$Docs$Block$toLinesHelp,
							$author$project$Page$Docs$Block$recordOneExt(ext),
							$author$project$Page$Docs$Block$recordMoreExt,
							toLns(f),
							A2($elm$core$List$map, toLns, fs));
						if (_v5.$ === 'One') {
							var width = _v5.a;
							var line = _v5.b;
							return A2($author$project$Page$Docs$Block$One, width, line);
						} else {
							var first = _v5.a;
							var rest = _v5.b;
							return A2(
								$author$project$Page$Docs$Block$More,
								_List_fromArray(
									[
										$elm$html$Html$text('{ '),
										$elm$html$Html$text(ext)
									]),
								A2(
									$elm$core$List$cons,
									first,
									_Utils_ap(
										rest,
										_List_fromArray(
											[
												_List_fromArray(
												[
													$elm$html$Html$text('}')
												])
											]))));
						}
					}
				}
		}
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $author$project$Page$Docs$Block$viewCodeBlock = F3(
	function (name, comment, header) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('docs-block'),
					$elm$html$Html$Attributes$id(name)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('docs-header')
						]),
					A2(
						$elm$core$List$map,
						$elm$html$Html$div(_List_Nil),
						header)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('docs-comment')
						]),
					_List_fromArray(
						[
							$author$project$Utils$Markdown$block(comment)
						]))
				]));
	});
var $author$project$Page$Docs$Block$viewAlias = F3(
	function (mount, info, _v0) {
		var name = _v0.name;
		var args = _v0.args;
		var comment = _v0.comment;
		var tipe = _v0.tipe;
		var varsString = $elm$core$String$concat(
			A2(
				$elm$core$List$map,
				$elm$core$Basics$append(' '),
				args));
		var aliasNameLine = _List_fromArray(
			[
				$author$project$Page$Docs$Block$keyword('type'),
				$author$project$Page$Docs$Block$space,
				$author$project$Page$Docs$Block$keyword('alias'),
				$author$project$Page$Docs$Block$space,
				A3($author$project$Page$Docs$Block$toBoldLink, mount, info, name),
				$elm$html$Html$text(varsString),
				$author$project$Page$Docs$Block$space,
				$author$project$Page$Docs$Block$equals
			]);
		return A3(
			$author$project$Page$Docs$Block$viewCodeBlock,
			name,
			comment,
			A2(
				$elm$core$List$cons,
				aliasNameLine,
				A2(
					$elm$core$List$map,
					$author$project$Page$Docs$Block$indentFour,
					$author$project$Page$Docs$Block$linesToList(
						A4($author$project$Page$Docs$Block$toLines, mount, info, $author$project$Page$Docs$Block$Other, tipe)))));
	});
var $author$project$Page$Docs$Block$viewBinop = F3(
	function (mount, info, _v0) {
		var name = _v0.name;
		var comment = _v0.comment;
		var tipe = _v0.tipe;
		var nameHtml = A3($author$project$Page$Docs$Block$toBoldLink, mount, info, '(' + (name + ')'));
		return A3(
			$author$project$Page$Docs$Block$viewCodeBlock,
			name,
			comment,
			function () {
				var _v1 = A4($author$project$Page$Docs$Block$toLines, mount, info, $author$project$Page$Docs$Block$Other, tipe);
				if (_v1.$ === 'One') {
					var line = _v1.b;
					return _List_fromArray(
						[
							A2(
							$elm$core$List$cons,
							nameHtml,
							A2(
								$elm$core$List$cons,
								$author$project$Page$Docs$Block$space,
								A2(
									$elm$core$List$cons,
									$author$project$Page$Docs$Block$colon,
									A2($elm$core$List$cons, $author$project$Page$Docs$Block$space, line))))
						]);
				} else {
					var x = _v1.a;
					var xs = _v1.b;
					return A2(
						$elm$core$List$cons,
						_List_fromArray(
							[nameHtml, $author$project$Page$Docs$Block$space, $author$project$Page$Docs$Block$colon]),
						A2(
							$elm$core$List$cons,
							$author$project$Page$Docs$Block$indentFour(x),
							A2($elm$core$List$map, $author$project$Page$Docs$Block$indentFour, xs)));
				}
			}());
	});
var $author$project$Page$Docs$Block$unionMore = F2(
	function (mount, info) {
		var ctorToLines = function (_v0) {
			var ctor = _v0.a;
			var args = _v0.b;
			return $author$project$Page$Docs$Block$toOneOrMore(
				A4(
					$author$project$Page$Docs$Block$toLines,
					mount,
					info,
					$author$project$Page$Docs$Block$Other,
					A2($elm$project_metadata_utils$Elm$Type$Type, ctor, args)));
		};
		return {
			close: $elm$core$Maybe$Nothing,
			open: _List_fromArray(
				[
					$elm$html$Html$text('    = ')
				]),
			openIndent: 6,
			sep: $elm$html$Html$text('    | '),
			sepIndent: 6,
			toLines: ctorToLines
		};
	});
var $author$project$Page$Docs$Block$viewUnion = F3(
	function (mount, info, _v0) {
		var name = _v0.name;
		var comment = _v0.comment;
		var args = _v0.args;
		var tags = _v0.tags;
		var varsString = $elm$core$String$concat(
			A2(
				$elm$core$List$map,
				$elm$core$Basics$append(' '),
				args));
		var nameLine = _List_fromArray(
			[
				$author$project$Page$Docs$Block$keyword('type'),
				$author$project$Page$Docs$Block$space,
				A3($author$project$Page$Docs$Block$toBoldLink, mount, info, name),
				$elm$html$Html$text(varsString)
			]);
		return A3(
			$author$project$Page$Docs$Block$viewCodeBlock,
			name,
			comment,
			function () {
				if (!tags.b) {
					return _List_fromArray(
						[nameLine]);
				} else {
					var t = tags.a;
					var ts = tags.b;
					return A2(
						$elm$core$List$cons,
						nameLine,
						$author$project$Page$Docs$Block$linesToList(
							A3(
								$author$project$Page$Docs$Block$toMoreLines,
								A2($author$project$Page$Docs$Block$unionMore, mount, info),
								t,
								ts)));
				}
			}());
	});
var $author$project$Page$Docs$Block$viewValue = F3(
	function (mount, info, _v0) {
		var name = _v0.name;
		var comment = _v0.comment;
		var tipe = _v0.tipe;
		var nameHtml = A3($author$project$Page$Docs$Block$toBoldLink, mount, info, name);
		return A3(
			$author$project$Page$Docs$Block$viewCodeBlock,
			name,
			comment,
			function () {
				var _v1 = A4($author$project$Page$Docs$Block$toLines, mount, info, $author$project$Page$Docs$Block$Other, tipe);
				if (_v1.$ === 'One') {
					var line = _v1.b;
					return _List_fromArray(
						[
							A2(
							$elm$core$List$cons,
							nameHtml,
							A2(
								$elm$core$List$cons,
								$author$project$Page$Docs$Block$space,
								A2(
									$elm$core$List$cons,
									$author$project$Page$Docs$Block$colon,
									A2($elm$core$List$cons, $author$project$Page$Docs$Block$space, line))))
						]);
				} else {
					var x = _v1.a;
					var xs = _v1.b;
					return A2(
						$elm$core$List$cons,
						_List_fromArray(
							[nameHtml, $author$project$Page$Docs$Block$space, $author$project$Page$Docs$Block$colon]),
						A2(
							$elm$core$List$cons,
							$author$project$Page$Docs$Block$indentFour(x),
							A2($elm$core$List$map, $author$project$Page$Docs$Block$indentFour, xs)));
				}
			}());
	});
var $author$project$Page$Docs$Block$view = F3(
	function (mount, info, block) {
		switch (block.$) {
			case 'MarkdownBlock':
				var markdown = block.a;
				return A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('markdown-block')
						]),
					_List_fromArray(
						[
							$author$project$Utils$Markdown$block(markdown)
						]));
			case 'ValueBlock':
				var value = block.a;
				return A3($author$project$Page$Docs$Block$viewValue, mount, info, value);
			case 'BinopBlock':
				var binop = block.a;
				return A3($author$project$Page$Docs$Block$viewBinop, mount, info, binop);
			case 'AliasBlock':
				var alias = block.a;
				return A3($author$project$Page$Docs$Block$viewAlias, mount, info, alias);
			case 'UnionBlock':
				var union = block.a;
				return A3($author$project$Page$Docs$Block$viewUnion, mount, info, union);
			default:
				var name = block.a;
				return A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('TODO-make-this-red')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('It seems that '),
							A2(
							$elm$html$Html$code,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(name)
								])),
							$elm$html$Html$text(' does not have any docs. Please open a bug report '),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('https://github.com/elm/package.elm-lang.org/issues')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('here')
								])),
							$elm$html$Html$text(' with the title “UnknownBlock found in docs” and with a link to this page in the description.')
						]));
		}
	});
var $author$project$Page$Docs$viewModule = F6(
	function (mount, author, project, version, name, status) {
		switch (status.$) {
			case 'Success':
				var allDocs = status.a;
				var _v1 = A2($author$project$Page$Docs$findModule, name, allDocs);
				if (_v1.$ === 'Just') {
					var docs = _v1.a;
					var info = A5($author$project$Page$Docs$Block$makeInfo, author, project, version, name, allDocs);
					var header = A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('block-list-title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(name)
							]));
					var blocks = A2(
						$elm$core$List$map,
						A2($author$project$Page$Docs$Block$view, mount, info),
						$elm$project_metadata_utils$Elm$Docs$toBlocks(docs));
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('block-list')
							]),
						A2($elm$core$List$cons, header, blocks));
				} else {
					return A2(
						$elm$html$Html$div,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class('block-list'),
							$author$project$Page$Problem$styles),
						A5($author$project$Page$Problem$missingModule, mount, author, project, version, name));
				}
			case 'Loading':
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('block-list')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h1,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('block-list-title')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(name)
								]))
						]));
			default:
				return A2(
					$elm$html$Html$div,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('block-list'),
						$author$project$Page$Problem$styles),
					$author$project$Page$Problem$offline('docs.json'));
		}
	});
var $author$project$Page$Docs$viewReadme = function (status) {
	switch (status.$) {
		case 'Success':
			var readme = status.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('block-list')
					]),
				_List_fromArray(
					[
						$author$project$Utils$Markdown$block(readme)
					]));
		case 'Loading':
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('block-list')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('')
					]));
		default:
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class('block-list'),
					$author$project$Page$Problem$styles),
				$author$project$Page$Problem$offline('README.md'));
	}
};
var $author$project$Page$Docs$viewContent = function (model) {
	var _v0 = model.focus;
	switch (_v0.$) {
		case 'Readme':
			return A2($elm$html$Html$Lazy$lazy, $author$project$Page$Docs$viewReadme, model.readme);
		case 'About':
			return A3(
				$elm$html$Html$Lazy$lazy2,
				$author$project$Page$Docs$viewAbout(model.session.mountPoint),
				model.outline,
				model.releases);
		default:
			var name = _v0.a;
			var tag = _v0.b;
			return A6(
				$elm$html$Html$Lazy$lazy5,
				$author$project$Page$Docs$viewModule(model.session.mountPoint),
				model.author,
				model.project,
				model.version,
				name,
				model.docs);
	}
};
var $author$project$Page$Docs$QueryChanged = function (a) {
	return {$: 'QueryChanged', a: a};
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$virtual_dom$VirtualDom$lazy4 = _VirtualDom_lazy4;
var $elm$html$Html$Lazy$lazy4 = $elm$virtual_dom$VirtualDom$lazy4;
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
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
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Page$Docs$navLink = F3(
	function (name, url, isBold) {
		var attributes = isBold ? _List_fromArray(
			[
				$elm$html$Html$Attributes$class('pkg-nav-module'),
				A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
				A2($elm$html$Html$Attributes$style, 'text-decoration', 'underline')
			]) : _List_fromArray(
			[
				$elm$html$Html$Attributes$class('pkg-nav-module')
			]);
		return A2(
			$elm$html$Html$a,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$href(url),
				attributes),
			_List_fromArray(
				[
					$elm$html$Html$text(name)
				]));
	});
var $author$project$Page$Docs$viewAboutLink = F5(
	function (mount, author, project, version, focus) {
		return A3(
			$author$project$Page$Docs$navLink,
			'About',
			A4($author$project$Href$toAbout, mount, author, project, version),
			function () {
				switch (focus.$) {
					case 'Readme':
						return false;
					case 'About':
						return true;
					default:
						return false;
				}
			}());
	});
var $author$project$Page$Docs$viewBrowseSourceLinkHelp = F3(
	function (author, project, version) {
		var url = A3(
			$elm$url$Url$Builder$crossOrigin,
			'https://github.com',
			_List_fromArray(
				[
					author,
					project,
					'tree',
					$elm$project_metadata_utils$Elm$Version$toString(version)
				]),
			_List_Nil);
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('pkg-nav-module'),
					$elm$html$Html$Attributes$href(url)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Source')
				]));
	});
var $author$project$Page$Docs$viewBrowseSourceLink = F4(
	function (author, project, maybeVersion, releasesStatus) {
		if (maybeVersion.$ === 'Just') {
			var version = maybeVersion.a;
			return A3($author$project$Page$Docs$viewBrowseSourceLinkHelp, author, project, version);
		} else {
			switch (releasesStatus.$) {
				case 'Success':
					var releases = releasesStatus.a;
					return A3(
						$author$project$Page$Docs$viewBrowseSourceLinkHelp,
						author,
						project,
						$author$project$Release$getLatestVersion(releases));
				case 'Loading':
					return $elm$html$Html$text('Source');
				default:
					return $elm$html$Html$text('Source');
			}
		}
	});
var $author$project$Page$Docs$viewReadmeLink = F5(
	function (mount, author, project, version, focus) {
		return A3(
			$author$project$Page$Docs$navLink,
			'README',
			A4($author$project$Href$toVersion, mount, author, project, version),
			function () {
				switch (focus.$) {
					case 'Readme':
						return true;
					case 'About':
						return false;
					default:
						return false;
				}
			}());
	});
var $elm$core$String$toLower = _String_toLower;
var $author$project$Page$Docs$viewModuleLink = F2(
	function (model, name) {
		var url = A6($author$project$Href$toModule, model.session.mountPoint, model.author, model.project, model.version, name, $elm$core$Maybe$Nothing);
		return A3(
			$author$project$Page$Docs$navLink,
			name,
			url,
			function () {
				var _v0 = model.focus;
				switch (_v0.$) {
					case 'Readme':
						return false;
					case 'About':
						return false;
					default:
						var selectedName = _v0.a;
						return _Utils_eq(selectedName, name);
				}
			}());
	});
var $author$project$Page$Docs$isMatch = F3(
	function (query, toResult, _v0) {
		var name = _v0.name;
		return A2(
			$elm$core$String$contains,
			query,
			$elm$core$String$toLower(name)) ? $elm$core$Maybe$Just(
			A2(toResult, name, name)) : $elm$core$Maybe$Nothing;
	});
var $author$project$Page$Docs$isTagMatch = F4(
	function (query, toResult, tipeName, _v0) {
		var tagName = _v0.a;
		return A2(
			$elm$core$String$contains,
			query,
			$elm$core$String$toLower(tagName)) ? $elm$core$Maybe$Just(
			A2(toResult, tipeName, tagName)) : $elm$core$Maybe$Nothing;
	});
var $author$project$Page$Docs$isUnionMatch = F3(
	function (query, toResult, _v0) {
		var name = _v0.name;
		var tags = _v0.tags;
		var tagMatches = A2(
			$elm$core$List$filterMap,
			A3($author$project$Page$Docs$isTagMatch, query, toResult, name),
			tags);
		return A2(
			$elm$core$String$contains,
			query,
			$elm$core$String$toLower(name)) ? A2(
			$elm$core$List$cons,
			A2(toResult, name, name),
			tagMatches) : tagMatches;
	});
var $author$project$Page$Docs$viewValueItem = F4(
	function (_v0, moduleName, ownerName, valueName) {
		var session = _v0.session;
		var author = _v0.author;
		var project = _v0.project;
		var version = _v0.version;
		var url = A6(
			$author$project$Href$toModule,
			session.mountPoint,
			author,
			project,
			version,
			moduleName,
			$elm$core$Maybe$Just(ownerName));
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('pkg-nav-value')
				]),
			_List_fromArray(
				[
					A3($author$project$Page$Docs$navLink, valueName, url, false)
				]));
	});
var $author$project$Page$Docs$viewSearchItem = F3(
	function (model, query, docs) {
		var toItem = F2(
			function (ownerName, valueName) {
				return A4($author$project$Page$Docs$viewValueItem, model, docs.name, ownerName, valueName);
			});
		var matches = _Utils_ap(
			A2(
				$elm$core$List$filterMap,
				A2($author$project$Page$Docs$isMatch, query, toItem),
				docs.binops),
			_Utils_ap(
				A2(
					$elm$core$List$concatMap,
					A2($author$project$Page$Docs$isUnionMatch, query, toItem),
					docs.unions),
				_Utils_ap(
					A2(
						$elm$core$List$filterMap,
						A2($author$project$Page$Docs$isMatch, query, toItem),
						docs.aliases),
					A2(
						$elm$core$List$filterMap,
						A2($author$project$Page$Docs$isMatch, query, toItem),
						docs.values))));
		return ($elm$core$List$isEmpty(matches) && (!A2($elm$core$String$contains, query, docs.name))) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
			A2(
				$elm$html$Html$li,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('pkg-nav-search-chunk')
					]),
				_List_fromArray(
					[
						A2($author$project$Page$Docs$viewModuleLink, model, docs.name),
						A2($elm$html$Html$ul, _List_Nil, matches)
					])));
	});
var $author$project$Page$Docs$viewSidebarModules = function (model) {
	var _v0 = model.docs;
	switch (_v0.$) {
		case 'Failure':
			return $elm$html$Html$text('');
		case 'Loading':
			return $elm$html$Html$text('');
		default:
			var modules = _v0.a;
			if ($elm$core$String$isEmpty(model.query)) {
				var viewEntry = function (docs) {
					return A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								A2($author$project$Page$Docs$viewModuleLink, model, docs.name)
							]));
				};
				return A2(
					$elm$html$Html$ul,
					_List_Nil,
					A2($elm$core$List$map, viewEntry, modules));
			} else {
				var query = $elm$core$String$toLower(model.query);
				return A2(
					$elm$html$Html$ul,
					_List_Nil,
					A2(
						$elm$core$List$filterMap,
						A2($author$project$Page$Docs$viewSearchItem, model, query),
						modules));
			}
	}
};
var $author$project$Page$Docs$viewSidebar = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('pkg-nav')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$ul,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								A5(
								$elm$html$Html$Lazy$lazy4,
								$author$project$Page$Docs$viewReadmeLink(model.session.mountPoint),
								model.author,
								model.project,
								model.version,
								model.focus)
							])),
						A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								A5(
								$elm$html$Html$Lazy$lazy4,
								$author$project$Page$Docs$viewAboutLink(model.session.mountPoint),
								model.author,
								model.project,
								model.version,
								model.focus)
							])),
						A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								A5($elm$html$Html$Lazy$lazy4, $author$project$Page$Docs$viewBrowseSourceLink, model.author, model.project, model.version, model.releases)
							]))
					])),
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Modules')
					])),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$placeholder('Search'),
						$elm$html$Html$Attributes$value(model.query),
						$elm$html$Html$Events$onInput($author$project$Page$Docs$QueryChanged)
					]),
				_List_Nil),
				$author$project$Page$Docs$viewSidebarModules(model)
			]));
};
var $author$project$Page$Docs$view = function (model) {
	return {
		attrs: _List_Nil,
		header: $author$project$Page$Docs$toHeader(model),
		kids: _List_fromArray(
			[
				$author$project$Page$Docs$viewContent(model),
				$author$project$Page$Docs$viewSidebar(model)
			]),
		title: $author$project$Page$Docs$toTitle(model),
		warning: $author$project$Page$Docs$toWarning(model)
	};
};
var $elm_explorations$markdown$Markdown$toHtml = $elm_explorations$markdown$Markdown$toHtmlWith($elm_explorations$markdown$Markdown$defaultOptions);
var $author$project$Page$Help$viewContent = F2(
	function (title, content) {
		switch (content.$) {
			case 'Failure':
				return $elm$html$Html$text('');
			case 'Loading':
				return A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'max-width', '600px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						]));
			default:
				var help = content.a;
				return A2(
					$elm_explorations$markdown$Markdown$toHtml,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'max-width', '600px')
						]),
					help);
		}
	});
var $author$project$Page$Help$view = function (model) {
	return {
		attrs: _List_Nil,
		header: _List_Nil,
		kids: _List_fromArray(
			[
				A2($author$project$Page$Help$viewContent, model.title, model.content)
			]),
		title: model.title,
		warning: $author$project$Skeleton$NoProblems
	};
};
var $author$project$Page$Search$QueryChanged = function (a) {
	return {$: 'QueryChanged', a: a};
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$autofocus = $elm$html$Html$Attributes$boolProperty('autofocus');
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $author$project$Page$Search$Entry$search = F2(
	function (query, entries) {
		var queryTerms = $elm$core$String$words(
			$elm$core$String$toLower(query));
		var matchesAllTerms = function (entry) {
			var lowerSummary = $elm$core$String$toLower(entry.summary);
			var lowerName = $elm$core$String$toLower(entry.name);
			var matchesTerm = function (term) {
				return A2($elm$core$String$contains, term, lowerName) || A2($elm$core$String$contains, term, lowerSummary);
			};
			return A2($elm$core$List$all, matchesTerm, queryTerms);
		};
		return A2($elm$core$List$filter, matchesAllTerms, entries);
	});
var $author$project$Page$Search$viewExactVersions = F2(
	function (mount, entry) {
		var latestUrl = A4(
			$author$project$Href$toVersion,
			mount,
			entry.author,
			entry.project,
			$elm$core$Maybe$Just(entry.version));
		var latestName = $elm$project_metadata_utils$Elm$Version$toString(entry.version);
		var latestLink = A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href(latestUrl)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(latestName)
				]));
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('pkg-summary-hints')
				]),
			_Utils_eq(
				$elm$project_metadata_utils$Elm$Version$toTuple(entry.version),
				_Utils_Tuple3(1, 0, 0)) ? _List_fromArray(
				[latestLink]) : _List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(
							A3($author$project$Href$toProject, mount, entry.author, entry.project))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('…')
						])),
					$elm$html$Html$text(' '),
					latestLink
				]));
	});
var $author$project$Page$Search$viewEntryHelp = F2(
	function (mount, entry) {
		var author = entry.author;
		var project = entry.project;
		var summary = entry.summary;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('pkg-summary')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h1,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$href(
											A4($author$project$Href$toVersion, mount, author, project, $elm$core$Maybe$Nothing))
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('light')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(author + '/')
												])),
											$elm$html$Html$text(project)
										]))
								])),
							A2($author$project$Page$Search$viewExactVersions, mount, entry)
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('pkg-summary-desc')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(summary)
						]))
				]));
	});
var $author$project$Page$Search$viewEntry = F2(
	function (mount, entry) {
		return _Utils_Tuple2(
			entry.author + ('/' + entry.project),
			A2(
				$elm$html$Html$Lazy$lazy,
				$author$project$Page$Search$viewEntryHelp(mount),
				entry));
	});
var $author$project$Page$Search$Hint = F3(
	function (term, min, html) {
		return {html: html, min: min, term: term};
	});
var $author$project$Page$Search$codeText = function (txt) {
	return A2(
		$elm$html$Html$code,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text(txt)
			]));
};
var $author$project$Page$Search$codeLink = F2(
	function (url, txt) {
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href(url)
				]),
			_List_fromArray(
				[
					$author$project$Page$Search$codeText(txt)
				]));
	});
var $elm$html$Html$b = _VirtualDom_node('b');
var $author$project$Page$Search$makeHint = function (message) {
	return A2(
		$elm$html$Html$p,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('pkg-hint')
			]),
		A2(
			$elm$core$List$cons,
			A2(
				$elm$html$Html$b,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Hint:')
					])),
			A2(
				$elm$core$List$cons,
				$elm$html$Html$text(' '),
				message)));
};
var $author$project$Page$Search$animation = function (mount) {
	return $author$project$Page$Search$makeHint(
		_List_fromArray(
			[
				$elm$html$Html$text('If you are not using CSS animations, you will need '),
				A2(
				$author$project$Page$Search$codeLink,
				A6(
					$author$project$Href$toModule,
					mount,
					'elm',
					'browser',
					$elm$core$Maybe$Nothing,
					'Browser.Events',
					$elm$core$Maybe$Just('onAnimationFrame')),
				'onAnimationFrame'),
				$elm$html$Html$text(' to get smooth animations. The packages below may make one of these paths easier for you, but sometimes it is easier to just do things directly!')
			]));
};
var $author$project$Page$Search$guide = A2($author$project$Page$Search$codeLink, 'https://guide.elm-lang.org', 'guide.elm-lang.org');
var $elm$html$Html$i = _VirtualDom_node('i');
var $author$project$Page$Search$components = $author$project$Page$Search$makeHint(
	_List_fromArray(
		[
			$elm$html$Html$text('Components are objects!'),
			A2(
			$elm$html$Html$ul,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'list-style-type', 'none')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Components = Local State + Methods')
						])),
					A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Local State + Methods = Objects')
						]))
				])),
			$elm$html$Html$text('We get very few folks asking how to structure Elm code with objects. Elm does not have objects! We get a lot of folks asking about how to use components, but it is essentially the same question. Elm emphasizes '),
			A2(
			$elm$html$Html$i,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('functions')
				])),
			$elm$html$Html$text(' instead. Folks usually have the best experience if they follow the advice in '),
			$author$project$Page$Search$guide,
			$elm$html$Html$text(' and '),
			A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href('https://youtu.be/XpDsk374LDE')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('The Life of a File')
				])),
			$elm$html$Html$text(', exploring and understanding the techniques specific to Elm '),
			A2(
			$elm$html$Html$i,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('before')
				])),
			$elm$html$Html$text(' trying to bring in techniques from other languages.')
		]));
var $author$project$Page$Search$focus = function (mount) {
	return $author$project$Page$Search$makeHint(
		_List_fromArray(
			[
				$elm$html$Html$text('Check out '),
				A2(
				$author$project$Page$Search$codeLink,
				A6($author$project$Href$toModule, mount, 'elm', 'browser', $elm$core$Maybe$Nothing, 'Browser.Dom', $elm$core$Maybe$Nothing),
				'Browser.Dom'),
				$elm$html$Html$text(' for focusing on certain nodes. It uses tasks, so be sure you have learned about '),
				A2(
				$elm$html$Html$code,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Cmd')
					])),
				$elm$html$Html$text(' values in '),
				$author$project$Page$Search$guide,
				$elm$html$Html$text(' and then read through the '),
				A2(
				$author$project$Page$Search$codeLink,
				A6($author$project$Href$toModule, mount, 'elm', 'core', $elm$core$Maybe$Nothing, 'Task', $elm$core$Maybe$Nothing),
				'Task'),
				$elm$html$Html$text(' module so you do not have to guess at how anything works!')
			]));
};
var $author$project$Page$Search$keyboard = function (mount) {
	return $author$project$Page$Search$makeHint(
		_List_fromArray(
			[
				$elm$html$Html$text('Folks usually use '),
				A2(
				$author$project$Page$Search$codeLink,
				A6($author$project$Href$toModule, mount, 'elm', 'html', $elm$core$Maybe$Nothing, 'Html.Events', $elm$core$Maybe$Nothing),
				'Html.Events'),
				$elm$html$Html$text(' for key presses in text fields. If you want keyboard events for the whole page, you may want '),
				A2(
				$author$project$Page$Search$codeLink,
				A6($author$project$Href$toModule, mount, 'elm', 'browser', $elm$core$Maybe$Nothing, 'Browser.Events', $elm$core$Maybe$Nothing),
				'Browser.Events'),
				$elm$html$Html$text(' instead. Reading '),
				$author$project$Page$Search$guide,
				$elm$html$Html$text(' should give the foundation for using either!')
			]));
};
var $author$project$Page$Search$lenses = $author$project$Page$Search$makeHint(
	_List_fromArray(
		[
			$elm$html$Html$text('Lenses are not commonly used in Elm. Their design focuses on manipulating deeply nested data structures, like records in records in dictionaries in lists. But rather than introducing a complex system to help with already complex data structures, we encourage folks to first work on simplifying the data structure.'),
			A2($elm$html$Html$br, _List_Nil, _List_Nil),
			A2($elm$html$Html$br, _List_Nil, _List_Nil),
			$elm$html$Html$text('Maybe this means flattening records. Or using '),
			A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href('https://guide.elm-lang.org/types/custom_types.html')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('custom types')
				])),
			$elm$html$Html$text(' to model different possibilities more precisely. Or representing graphs with '),
			$author$project$Page$Search$codeText('Dict'),
			$elm$html$Html$text(' values as described '),
			A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href('https://evancz.gitbooks.io/functional-programming-in-elm/graphs/')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('here')
				])),
			$elm$html$Html$text('. Or using the module system to create strong boundaries, using opaque types with helper functions to contain complexity.'),
			A2($elm$html$Html$br, _List_Nil, _List_Nil),
			A2($elm$html$Html$br, _List_Nil, _List_Nil),
			$elm$html$Html$text('Point is, there are many paths to explore that will produce easier code with stronger guarantees, and folks are always happy to help if you share your situation on '),
			A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href('http://elmlang.herokuapp.com/')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Slack')
				])),
			$elm$html$Html$text(' or '),
			A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href('https://discourse.elm-lang.org/')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Discourse')
				])),
			$elm$html$Html$text('!')
		]));
var $author$project$Page$Search$mouse = function (mount) {
	return $author$project$Page$Search$makeHint(
		_List_fromArray(
			[
				$elm$html$Html$text('Folks usually use '),
				A2(
				$author$project$Page$Search$codeLink,
				A6($author$project$Href$toModule, mount, 'elm', 'html', $elm$core$Maybe$Nothing, 'Html.Events', $elm$core$Maybe$Nothing),
				'Html.Events'),
				$elm$html$Html$text(' to detect clicks on buttons. If you want mouse events for the whole page, you may want '),
				A2(
				$author$project$Page$Search$codeLink,
				A6($author$project$Href$toModule, mount, 'elm', 'browser', $elm$core$Maybe$Nothing, 'Browser.Events', $elm$core$Maybe$Nothing),
				'Browser.Events'),
				$elm$html$Html$text(' instead. Reading '),
				$author$project$Page$Search$guide,
				$elm$html$Html$text(' should give the foundation for using either!')
			]));
};
var $author$project$Page$Search$router = function (mount) {
	return $author$project$Page$Search$makeHint(
		_List_fromArray(
			[
				$elm$html$Html$text('The '),
				A2(
				$author$project$Page$Search$codeLink,
				A4($author$project$Href$toVersion, mount, 'elm', 'url', $elm$core$Maybe$Nothing),
				'elm/url'),
				$elm$html$Html$text(' package has everything you need to turn paths, queries, and hashes into useful data. But definitely work through '),
				$author$project$Page$Search$guide,
				$elm$html$Html$text(' to learn how this fits into a '),
				A2(
				$author$project$Page$Search$codeLink,
				A6(
					$author$project$Href$toModule,
					mount,
					'elm',
					'browser',
					$elm$core$Maybe$Nothing,
					'Browser',
					$elm$core$Maybe$Just('application')),
				'Browser.application'),
				$elm$html$Html$text(' that manages the URL!')
			]));
};
var $author$project$Page$Search$scroll = function (mount) {
	return $author$project$Page$Search$makeHint(
		_List_fromArray(
			[
				$elm$html$Html$text('Check out '),
				A2(
				$author$project$Page$Search$codeLink,
				A6($author$project$Href$toModule, mount, 'elm', 'browser', $elm$core$Maybe$Nothing, 'Browser.Dom', $elm$core$Maybe$Nothing),
				'Browser.Dom'),
				$elm$html$Html$text(' for getting and setting scroll positions. It uses tasks, so be sure you have learned about '),
				A2(
				$elm$html$Html$code,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Cmd')
					])),
				$elm$html$Html$text(' values in '),
				$author$project$Page$Search$guide,
				$elm$html$Html$text(' and then read through the '),
				A2(
				$author$project$Page$Search$codeLink,
				A6($author$project$Href$toModule, mount, 'elm', 'core', $elm$core$Maybe$Nothing, 'Task', $elm$core$Maybe$Nothing),
				'Task'),
				$elm$html$Html$text(' module so you do not have to guess at how anything works!')
			]));
};
var $author$project$Page$Search$singlePageApp = function (mount) {
	return $author$project$Page$Search$makeHint(
		_List_fromArray(
			[
				$elm$html$Html$text('All single-page apps in Elm use '),
				A2(
				$author$project$Page$Search$codeLink,
				A4($author$project$Href$toVersion, mount, 'elm', 'browser', $elm$core$Maybe$Nothing),
				'elm/browser'),
				$elm$html$Html$text(' to control the URL, with help from '),
				A2(
				$author$project$Page$Search$codeLink,
				A4($author$project$Href$toVersion, mount, 'elm', 'url', $elm$core$Maybe$Nothing),
				'elm/url'),
				$elm$html$Html$text(' convert between URLs and nice structured data. I very highly recommend working through '),
				$author$project$Page$Search$guide,
				$elm$html$Html$text(' to learn how! Once you have made one or two single-page apps the standard way, it will be much easier to tell which (if any) of the packages below can make your code any easier.')
			]));
};
var $author$project$Page$Search$window = function (mount) {
	return $author$project$Page$Search$makeHint(
		_List_fromArray(
			[
				$elm$html$Html$text('Use '),
				A2(
				$author$project$Page$Search$codeLink,
				A6($author$project$Href$toModule, mount, 'elm', 'browser', $elm$core$Maybe$Nothing, 'Browser.Dom', $elm$core$Maybe$Nothing),
				'Browser.Dom'),
				$elm$html$Html$text(' to get the current window size, and use '),
				A2(
				$author$project$Page$Search$codeLink,
				A6($author$project$Href$toModule, mount, 'elm', 'browser', $elm$core$Maybe$Nothing, 'Browser.Events', $elm$core$Maybe$Nothing),
				'Browser.Events'),
				$elm$html$Html$text(' to detect when the window changes size or is not visible at the moment.')
			]));
};
var $author$project$Page$Search$hints = function (mount) {
	return _List_fromArray(
		[
			A3(
			$author$project$Page$Search$Hint,
			'spa',
			3,
			$author$project$Page$Search$singlePageApp(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'single page app',
			5,
			$author$project$Page$Search$singlePageApp(mount)),
			A3($author$project$Page$Search$Hint, 'components', 5, $author$project$Page$Search$components),
			A3(
			$author$project$Page$Search$Hint,
			'router',
			4,
			$author$project$Page$Search$router(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'routing',
			4,
			$author$project$Page$Search$router(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'routes',
			4,
			$author$project$Page$Search$router(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'focus',
			4,
			$author$project$Page$Search$focus(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'blur',
			4,
			$author$project$Page$Search$focus(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'scroll',
			4,
			$author$project$Page$Search$scroll(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'scrollheight',
			7,
			$author$project$Page$Search$scroll(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'scrollwidth',
			7,
			$author$project$Page$Search$scroll(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'scrollx',
			7,
			$author$project$Page$Search$scroll(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'scrolly',
			7,
			$author$project$Page$Search$scroll(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'scrollto',
			7,
			$author$project$Page$Search$scroll(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'scrollintoview',
			7,
			$author$project$Page$Search$scroll(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'mouse',
			4,
			$author$project$Page$Search$mouse(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'keyboard',
			4,
			$author$project$Page$Search$keyboard(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'window',
			4,
			$author$project$Page$Search$window(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'visibility',
			5,
			$author$project$Page$Search$window(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'animation',
			5,
			$author$project$Page$Search$animation(mount)),
			A3(
			$author$project$Page$Search$Hint,
			'requestanimationframe',
			8,
			$author$project$Page$Search$animation(mount)),
			A3($author$project$Page$Search$Hint, 'lenses', 4, $author$project$Page$Search$lenses)
		]);
};
var $author$project$Page$Search$viewHintHelp = F3(
	function (noAlts, query, remainingHints) {
		viewHintHelp:
		while (true) {
			if (!remainingHints.b) {
				return $elm$html$Html$text('');
			} else {
				var hint = remainingHints.a;
				var otherHints = remainingHints.b;
				if (A2($elm$core$String$startsWith, query, hint.term) && (noAlts || (_Utils_cmp(
					$elm$core$String$length(query),
					hint.min) > -1))) {
					return hint.html;
				} else {
					var $temp$noAlts = noAlts,
						$temp$query = query,
						$temp$remainingHints = otherHints;
					noAlts = $temp$noAlts;
					query = $temp$query;
					remainingHints = $temp$remainingHints;
					continue viewHintHelp;
				}
			}
		}
	});
var $author$project$Page$Search$viewHint = F3(
	function (mount, noAlts, query) {
		return A3(
			$author$project$Page$Search$viewHintHelp,
			noAlts,
			$elm$core$String$toLower(
				A3($elm$core$String$replace, '-', ' ', query)),
			$author$project$Page$Search$hints(mount));
	});
var $author$project$Page$Search$viewSearch = F3(
	function (mount, query, entries) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('catalog')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$placeholder('Search'),
							$elm$html$Html$Attributes$value(query),
							$elm$html$Html$Events$onInput($author$project$Page$Search$QueryChanged),
							$elm$html$Html$Attributes$autofocus(true)
						]),
					_List_Nil),
					function () {
					switch (entries.$) {
						case 'Failure':
							return A2(
								$elm$html$Html$div,
								$author$project$Page$Problem$styles,
								$author$project$Page$Problem$offline('search.json'));
						case 'Loading':
							return $elm$html$Html$text('');
						default:
							var es = entries.a;
							var results = A2(
								$elm$core$List$map,
								$author$project$Page$Search$viewEntry(mount),
								A2($author$project$Page$Search$Entry$search, query, es));
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A3(
										$elm$html$Html$Keyed$node,
										'div',
										_List_Nil,
										A2(
											$elm$core$List$cons,
											_Utils_Tuple2(
												'h',
												A3(
													$author$project$Page$Search$viewHint,
													mount,
													$elm$core$List$isEmpty(results),
													query)),
											results)),
										A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('pkg-hint')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Need 0.18 packages? For '),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href('https://gist.github.com/evancz/9031e37902dfaec250a08a7aa6e17b10')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('technical reasons')
													])),
												$elm$html$Html$text(', search '),
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href('https://dmy.github.io/elm-0.18-packages/')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('here')
													])),
												$elm$html$Html$text(' instead!')
											]))
									]));
					}
				}()
				]));
	});
var $author$project$Page$Search$viewPopularPackage = F2(
	function (mount, project) {
		return A2(
			$elm$html$Html$li,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href(
							A4($author$project$Href$toVersion, mount, 'elm', project, $elm$core$Maybe$Nothing))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('light')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('elm/')
								])),
							$elm$html$Html$text(project)
						]))
				]));
	});
var $author$project$Page$Search$viewSidebar = function (mount) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('catalog-sidebar')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Popular Packages')
					])),
				A2(
				$elm$html$Html$ul,
				_List_Nil,
				A2(
					$elm$core$List$map,
					$author$project$Page$Search$viewPopularPackage(mount),
					_List_fromArray(
						['core', 'html', 'json', 'browser', 'url', 'http']))),
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Resources')
					])),
				A2(
				$elm$html$Html$ul,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href('https://klaftertief.github.io/elm-search/')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Search by Type')
									]))
							])),
						A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href('https://github.com/elm-lang/elm-package/blob/master/README.md')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Using Packages')
									]))
							])),
						A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href(
										A2($author$project$Href$join, mount, '/help/design-guidelines'))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('API Design Guidelines')
									]))
							])),
						A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href(
										A2($author$project$Href$join, mount, '/help/documentation-format'))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Write great docs')
									]))
							])),
						A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href('https://elm-lang.org')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Elm Website')
									]))
							]))
					]))
			]));
};
var $author$project$Page$Search$view = function (model) {
	return {
		attrs: _List_Nil,
		header: _List_Nil,
		kids: _List_fromArray(
			[
				A3(
				$elm$html$Html$Lazy$lazy2,
				$author$project$Page$Search$viewSearch(model.session.mountPoint),
				model.query,
				model.entries),
				$author$project$Page$Search$viewSidebar(model.session.mountPoint)
			]),
		title: 'Elm Packages',
		warning: $author$project$Skeleton$NoProblems
	};
};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $author$project$Skeleton$viewFooter = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('footer')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('grey-link'),
					$elm$html$Html$Attributes$href('https://github.com/elm/package.elm-lang.org/')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Site Source')
				])),
			$elm$html$Html$text(' — © 2012-2020 Evan Czaplicki')
		]));
var $elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						$elm$core$List$cons,
						sep,
						A2($elm$core$List$cons, x, rest));
				});
			var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
			return A2($elm$core$List$cons, hd, spersed);
		}
	});
var $author$project$Skeleton$slash = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('spacey-char')
		]),
	_List_fromArray(
		[
			$elm$html$Html$text('/')
		]));
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $author$project$Utils$Logo$shape = function (coordinates) {
	return A2(
		$elm$svg$Svg$polygon,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$fill('currentColor'),
				$elm$svg$Svg$Attributes$points(coordinates)
			]),
		_List_Nil);
};
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Utils$Logo$logo = function (n) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromInt(n)),
				$elm$svg$Svg$Attributes$viewBox('0 0 600 600')
			]),
		_List_fromArray(
			[
				$author$project$Utils$Logo$shape('0,20 280,300 0,580'),
				$author$project$Utils$Logo$shape('20,600 300,320 580,600'),
				$author$project$Utils$Logo$shape('320,0 600,0 600,280'),
				$author$project$Utils$Logo$shape('20,0 280,0 402,122 142,122'),
				$author$project$Utils$Logo$shape('170,150 430,150 300,280'),
				$author$project$Utils$Logo$shape('320,300 450,170 580,300 450,430'),
				$author$project$Utils$Logo$shape('470,450 600,320 600,580')
			]));
};
var $author$project$MountPoint$toString = function (mountPoint) {
	if (mountPoint.$ === 'Root') {
		return '/';
	} else {
		if (!mountPoint.a.b) {
			return '/';
		} else {
			if (!mountPoint.a.b.b) {
				var _v1 = mountPoint.a;
				var path = _v1.a;
				return '/' + path;
			} else {
				var rest = mountPoint.a;
				return '/' + A2($elm$core$String$join, '/', rest);
			}
		}
	}
};
var $author$project$Skeleton$viewLogo = function (mount) {
	return A2(
		$elm$html$Html$a,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$href(
				$author$project$MountPoint$toString(mount)),
				A2($elm$html$Html$Attributes$style, 'text-decoration', 'none'),
				A2($elm$html$Html$Attributes$style, 'margin-right', '32px'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center')
			]),
		_List_fromArray(
			[
				$author$project$Utils$Logo$logo(32),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'padding-left', '8px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'line-height', '24px'),
								A2($elm$html$Html$Attributes$style, 'font-size', '30px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('elm')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-size', '12px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('packages')
							]))
					]))
			]));
};
var $author$project$Skeleton$viewSegment = function (segment) {
	if (segment.$ === 'Text') {
		var string = segment.a;
		return $elm$html$Html$text(string);
	} else {
		var address = segment.a;
		var string = segment.b;
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$href(address)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(string)
				]));
	}
};
var $author$project$Skeleton$viewHeader = F2(
	function (mount, segments) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('header')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('nav')
						]),
					_List_fromArray(
						[
							$author$project$Skeleton$viewLogo(mount),
							function () {
							if (!segments.b) {
								return $elm$html$Html$text('');
							} else {
								return A2(
									$elm$html$Html$h1,
									_List_Nil,
									A2(
										$elm$core$List$intersperse,
										$author$project$Skeleton$slash,
										A2($elm$core$List$map, $author$project$Skeleton$viewSegment, segments)));
							}
						}()
						]))
				]));
	});
var $author$project$Skeleton$viewWarning = F2(
	function (mount, warning) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('header-underbar')
				]),
			function () {
				switch (warning.$) {
					case 'NoProblems':
						return _List_Nil;
					case 'WarnOld':
						return _List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('version-warning')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('NOTE — this package is not compatible with Elm 0.19.1')
									]))
							]);
					case 'WarnMoved':
						var author = warning.a;
						var project = warning.b;
						return _List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('version-warning')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('NOTE — this package moved to '),
										A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$href(
												A4($author$project$Href$toVersion, mount, author, project, $elm$core$Maybe$Nothing))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(author + ('/' + project))
											]))
									]))
							]);
					default:
						var url = warning.a;
						var version = warning.b;
						return _List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('version-warning')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('NOTE — the latest version is '),
										A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$href(url)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$project_metadata_utils$Elm$Version$toString(version))
											]))
									]))
							]);
				}
			}());
	});
var $author$project$Skeleton$view = F3(
	function (toMsg, mount, details) {
		return {
			body: _List_fromArray(
				[
					A2($author$project$Skeleton$viewHeader, mount, details.header),
					A2(
					$elm$html$Html$Lazy$lazy,
					$author$project$Skeleton$viewWarning(mount),
					details.warning),
					A2(
					$elm$html$Html$map,
					toMsg,
					A2(
						$elm$html$Html$div,
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class('center'),
							A2(
								$elm$core$List$cons,
								A2($elm$html$Html$Attributes$style, 'flex', '1'),
								details.attrs)),
						details.kids)),
					$author$project$Skeleton$viewFooter
				]),
			title: details.title
		};
	});
var $author$project$Main$view = function (model) {
	var _v0 = model.page;
	switch (_v0.$) {
		case 'NotFound':
			var session = _v0.a;
			return A3(
				$author$project$Skeleton$view,
				$elm$core$Basics$never,
				session.mountPoint,
				{attrs: $author$project$Page$Problem$styles, header: _List_Nil, kids: $author$project$Page$Problem$notFound, title: 'Not Found', warning: $author$project$Skeleton$NoProblems});
		case 'Search':
			var search = _v0.a;
			return A3(
				$author$project$Skeleton$view,
				$author$project$Main$SearchMsg,
				search.session.mountPoint,
				$author$project$Page$Search$view(search));
		case 'Docs':
			var docs = _v0.a;
			return A3(
				$author$project$Skeleton$view,
				$author$project$Main$DocsMsg,
				docs.session.mountPoint,
				$author$project$Page$Docs$view(docs));
		case 'Diff':
			var diff = _v0.a;
			return A3(
				$author$project$Skeleton$view,
				$elm$core$Basics$never,
				diff.session.mountPoint,
				$author$project$Page$Diff$view(diff));
		default:
			var help = _v0.a;
			return A3(
				$author$project$Skeleton$view,
				$elm$core$Basics$never,
				help.session.mountPoint,
				$author$project$Page$Help$view(help));
	}
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{init: $author$project$Main$init, onUrlChange: $author$project$Main$UrlChanged, onUrlRequest: $author$project$Main$LinkClicked, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update, view: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));