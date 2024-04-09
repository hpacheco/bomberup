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

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
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

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
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


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
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
	if (region.b6.ac === region.cL.ac)
	{
		return 'on line ' + region.b6.ac;
	}
	return 'on lines ' + region.b6.ac + ' through ' + region.cL.ac;
}



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

	/**_UNUSED/
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

	/**/
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

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
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

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


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



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


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



/**_UNUSED/
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

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

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
		impl.d8,
		impl.eG,
		impl.eA,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
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


function _Platform_export(exports)
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


function _Platform_export_UNUSED(exports)
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

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
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
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
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
		A: func(record.A),
		b7: record.b7,
		bV: record.bV
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
		var message = !tag ? value : tag < 3 ? value.a : value.A;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.b7;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bV) && event.preventDefault(),
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
		impl.d8,
		impl.eG,
		impl.eA,
		function(sendToApp, initialModel) {
			var view = impl.eI;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
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
		impl.d8,
		impl.eG,
		impl.eA,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.b2 && impl.b2(sendToApp)
			var view = impl.eI;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.g);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.eE) && (_VirtualDom_doc.title = title = doc.eE);
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
	var onUrlChange = impl.eh;
	var onUrlRequest = impl.ei;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		b2: function(sendToApp)
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
							&& curr.dc === next.dc
							&& curr.cT === next.cT
							&& curr.c7.a === next.c7.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		d8: function(flags)
		{
			return A3(impl.d8, flags, _Browser_getUrl(), key);
		},
		eI: impl.eI,
		eG: impl.eG,
		eA: impl.eA
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
		? { d3: 'hidden', dO: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { d3: 'mozHidden', dO: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { d3: 'msHidden', dO: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { d3: 'webkitHidden', dO: 'webkitvisibilitychange' }
		: { d3: 'hidden', dO: 'visibilitychange' };
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
		dk: _Browser_getScene(),
		eJ: {
			ct: _Browser_window.pageXOffset,
			cu: _Browser_window.pageYOffset,
			aS: _Browser_doc.documentElement.clientWidth,
			ax: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		aS: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		ax: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
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
			dk: {
				aS: node.scrollWidth,
				ax: node.scrollHeight
			},
			eJ: {
				ct: node.scrollLeft,
				cu: node.scrollTop,
				aS: node.clientWidth,
				ax: node.clientHeight
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
			dk: _Browser_getScene(),
			eJ: {
				ct: x,
				cu: y,
				aS: _Browser_doc.documentElement.clientWidth,
				ax: _Browser_doc.documentElement.clientHeight
			},
			dZ: {
				ct: x + rect.left,
				cu: y + rect.top,
				aS: rect.width,
				ax: rect.height
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
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
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
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
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
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $author$project$Game$Playground$Game = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $author$project$Game$Playground$GotSeed = function (a) {
	return {$: 4, a: a};
};
var $author$project$Game$Playground$GotViewport = function (a) {
	return {$: 3, a: a};
};
var $author$project$Game$Playground$VisibilityChanged = function (a) {
	return {$: 6, a: a};
};
var $elm$browser$Browser$Events$Visible = 0;
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
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
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
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
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
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
		return {$: 0, a: a, b: b, c: c, d: d};
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
	return {$: 1, a: a};
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
	return {$: 0, a: a};
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
		if (!builder.e) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.f),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.f);
		} else {
			var treeLen = builder.e * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.k) : builder.k;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.e);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.f) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.f);
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
					{k: nodeList, e: (len / $elm$core$Array$branchFactor) | 0, f: tail});
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
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {cR: fragment, cT: host, c4: path, c7: port_, dc: protocol, dd: query};
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
					if (_v1.$ === 1) {
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
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
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
		var task = _v0;
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
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$Game$Playground$KeyChanged = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Game$Playground$MouseButton = function (a) {
	return {$: 9, a: a};
};
var $author$project$Game$Playground$MouseClick = {$: 8};
var $author$project$Game$Playground$MouseMove = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Game$Playground$Resized = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $author$project$Game$Playground$TickAnimation = function (a) {
	return {$: 2, a: a};
};
var $author$project$Game$Playground$TickGame = {$: 1};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {db: processes, dr: taggers};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
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
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
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
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
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
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
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
		if (_v1.$ === 1) {
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
			if (dict.$ === -2) {
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
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
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
		var processes = _v0.db;
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
				$elm$core$Task$succeed(0)));
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
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.dr);
		if (_v0.$ === 1) {
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
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
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
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 0, a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {bD: oldTime, dg: request, dp: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$browser$Browser$AnimationManager$now = _Browser_now(0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(0);
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.dg;
		var oldTime = _v0.bD;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 1) {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.dp;
		var oldTime = _v0.bD;
		var send = function (sub) {
			if (!sub.$) {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (!sub.$) {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrame = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Time(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrame = $elm$browser$Browser$AnimationManager$onAnimationFrame;
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {c5: pids, dp: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
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
		return {cM: event, cX: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
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
			state.c5,
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
		if (!_v0.$) {
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
		var key = _v0.cX;
		var event = _v0.cM;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.dp);
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
var $elm$browser$Browser$Events$onClick = A2($elm$browser$Browser$Events$on, 0, 'click');
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, 0, 'keydown');
var $elm$browser$Browser$Events$onKeyUp = A2($elm$browser$Browser$Events$on, 0, 'keyup');
var $elm$browser$Browser$Events$onMouseDown = A2($elm$browser$Browser$Events$on, 0, 'mousedown');
var $elm$browser$Browser$Events$onMouseMove = A2($elm$browser$Browser$Events$on, 0, 'mousemove');
var $elm$browser$Browser$Events$onMouseUp = A2($elm$browser$Browser$Events$on, 0, 'mouseup');
var $elm$browser$Browser$Events$Window = 1;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		1,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$browser$Browser$Events$Hidden = 1;
var $elm$browser$Browser$Events$withHidden = F2(
	function (func, isHidden) {
		return func(
			isHidden ? 1 : 0);
	});
var $elm$browser$Browser$Events$onVisibilityChange = function (func) {
	var info = _Browser_visibilityInfo(0);
	return A3(
		$elm$browser$Browser$Events$on,
		0,
		info.dO,
		A2(
			$elm$json$Json$Decode$map,
			$elm$browser$Browser$Events$withHidden(func),
			A2(
				$elm$json$Json$Decode$field,
				'target',
				A2($elm$json$Json$Decode$field, info.d3, $elm$json$Json$Decode$bool))));
};
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Game$Playground$gameSubscriptions = function (tps) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$elm$browser$Browser$Events$onResize($author$project$Game$Playground$Resized),
				$elm$browser$Browser$Events$onKeyUp(
				A2(
					$elm$json$Json$Decode$map,
					$author$project$Game$Playground$KeyChanged(false),
					A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string))),
				$elm$browser$Browser$Events$onKeyDown(
				A2(
					$elm$json$Json$Decode$map,
					$author$project$Game$Playground$KeyChanged(true),
					A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string))),
				A2(
				$elm$time$Time$every,
				1000 / tps,
				function (t) {
					return $author$project$Game$Playground$TickGame;
				}),
				$elm$browser$Browser$Events$onAnimationFrame($author$project$Game$Playground$TickAnimation),
				$elm$browser$Browser$Events$onVisibilityChange($author$project$Game$Playground$VisibilityChanged),
				$elm$browser$Browser$Events$onClick(
				$elm$json$Json$Decode$succeed($author$project$Game$Playground$MouseClick)),
				$elm$browser$Browser$Events$onMouseDown(
				$elm$json$Json$Decode$succeed(
					$author$project$Game$Playground$MouseButton(true))),
				$elm$browser$Browser$Events$onMouseUp(
				$elm$json$Json$Decode$succeed(
					$author$project$Game$Playground$MouseButton(false))),
				$elm$browser$Browser$Events$onMouseMove(
				A3(
					$elm$json$Json$Decode$map2,
					$author$project$Game$Playground$MouseMove,
					A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
					A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float)))
			]));
};
var $author$project$Game$Playground$Mouse = F4(
	function (x, y, down, click) {
		return {cD: click, dS: down, ct: x, cu: y};
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $author$project$Game$Playground$emptyKeyboard = {aZ: false, dS: false, bc: false, q: $elm$core$Set$empty, K: false, af: false, b3: false, b4: false, cl: false};
var $author$project$Game$Playground$mouseClick = F2(
	function (bool, mouse) {
		return _Utils_update(
			mouse,
			{cD: bool});
	});
var $author$project$Game$Playground$mouseDown = F2(
	function (bool, mouse) {
		return _Utils_update(
			mouse,
			{dS: bool});
	});
var $author$project$Game$Playground$mouseMove = F3(
	function (x, y, mouse) {
		return _Utils_update(
			mouse,
			{ct: x, cu: y});
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Game$Playground$toScreen = F2(
	function (width, height) {
		return {a0: (-height) / 2, ax: height, K: (-width) / 2, af: width / 2, cc: height / 2, aS: width};
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
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
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
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
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
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
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
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
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
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
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
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
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
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
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
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
				if (_v4.$ === -1) {
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
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
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
						if (_v7.$ === -1) {
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
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
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
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $author$project$Game$Playground$updateKeyboard = F3(
	function (isDown, key, keyboard) {
		var keys = isDown ? A2($elm$core$Set$insert, key, keyboard.q) : A2($elm$core$Set$remove, key, keyboard.q);
		switch (key) {
			case ' ':
				return _Utils_update(
					keyboard,
					{q: keys, b4: isDown});
			case 'Enter':
				return _Utils_update(
					keyboard,
					{bc: isDown, q: keys});
			case 'Shift':
				return _Utils_update(
					keyboard,
					{q: keys, b3: isDown});
			case 'Backspace':
				return _Utils_update(
					keyboard,
					{aZ: isDown, q: keys});
			case 'ArrowUp':
				return _Utils_update(
					keyboard,
					{q: keys, cl: isDown});
			case 'ArrowDown':
				return _Utils_update(
					keyboard,
					{dS: isDown, q: keys});
			case 'ArrowLeft':
				return _Utils_update(
					keyboard,
					{q: keys, K: isDown});
			case 'ArrowRight':
				return _Utils_update(
					keyboard,
					{q: keys, af: isDown});
			default:
				return _Utils_update(
					keyboard,
					{q: keys});
		}
	});
var $author$project$Game$Playground$gameUpdate = F4(
	function (updateMemory, initialRandom, msg, _v0) {
		var vis = _v0.a;
		var memory0 = _v0.b;
		var computer = _v0.c;
		var next = _v0.d;
		var memory = A3(updateMemory, computer, msg, memory0);
		switch (msg.$) {
			case 1:
				var _v2 = computer.dl;
				if (_v2.$ === 1) {
					return A4($author$project$Game$Playground$Game, vis, memory, computer, next);
				} else {
					return A4(
						$author$project$Game$Playground$Game,
						vis,
						memory,
						next(
							_Utils_update(
								computer,
								{dv: computer.dv + 1})),
						$elm$core$Basics$identity);
				}
			case 2:
				var time = msg.a;
				return A4($author$project$Game$Playground$Game, vis, memory, computer, next);
			case 3:
				var viewport = msg.a.eJ;
				return A4(
					$author$project$Game$Playground$Game,
					vis,
					memory,
					_Utils_update(
						computer,
						{
							b0: A2($author$project$Game$Playground$toScreen, viewport.aS, viewport.ax)
						}),
					next);
			case 4:
				var seed = msg.a;
				return A4(
					$author$project$Game$Playground$Game,
					vis,
					A2(initialRandom, seed, memory),
					_Utils_update(
						computer,
						{
							dl: $elm$core$Maybe$Just(seed)
						}),
					next);
			case 5:
				var w = msg.a;
				var h = msg.b;
				return A4(
					$author$project$Game$Playground$Game,
					vis,
					memory,
					_Utils_update(
						computer,
						{
							b0: A2($author$project$Game$Playground$toScreen, w, h)
						}),
					next);
			case 0:
				if (msg.a) {
					var key = msg.b;
					return A4(
						$author$project$Game$Playground$Game,
						vis,
						memory,
						_Utils_update(
							computer,
							{
								J: A3($author$project$Game$Playground$updateKeyboard, true, key, computer.J)
							}),
						next);
				} else {
					var key = msg.b;
					return A4(
						$author$project$Game$Playground$Game,
						vis,
						memory,
						computer,
						A2(
							$elm$core$Basics$composeR,
							next,
							function (c) {
								return _Utils_update(
									c,
									{
										J: A3($author$project$Game$Playground$updateKeyboard, false, key, c.J)
									});
							}));
				}
			case 7:
				var pageX = msg.a;
				var pageY = msg.b;
				var y = computer.b0.cc - pageY;
				var x = computer.b0.K + pageX;
				return A4(
					$author$project$Game$Playground$Game,
					vis,
					memory,
					_Utils_update(
						computer,
						{
							eb: A3($author$project$Game$Playground$mouseMove, x, y, computer.eb)
						}),
					next);
			case 8:
				return A4(
					$author$project$Game$Playground$Game,
					vis,
					memory,
					_Utils_update(
						computer,
						{
							eb: A2($author$project$Game$Playground$mouseClick, true, computer.eb)
						}),
					A2(
						$elm$core$Basics$composeR,
						next,
						function (c) {
							return _Utils_update(
								c,
								{
									eb: A2($author$project$Game$Playground$mouseClick, false, c.eb)
								});
						}));
			case 9:
				if (msg.a) {
					return A4(
						$author$project$Game$Playground$Game,
						vis,
						memory,
						_Utils_update(
							computer,
							{
								eb: A2($author$project$Game$Playground$mouseDown, true, computer.eb)
							}),
						next);
				} else {
					return A4(
						$author$project$Game$Playground$Game,
						vis,
						memory,
						computer,
						A2(
							$elm$core$Basics$composeR,
							next,
							function (c) {
								return _Utils_update(
									c,
									{
										eb: A2($author$project$Game$Playground$mouseDown, false, c.eb)
									});
							}));
				}
			default:
				var visibility = msg.a;
				return A4(
					$author$project$Game$Playground$Game,
					visibility,
					memory,
					_Utils_update(
						computer,
						{
							J: $author$project$Game$Playground$emptyKeyboard,
							eb: A4($author$project$Game$Playground$Mouse, computer.eb.ct, computer.eb.cu, false, false)
						}),
					next);
		}
	});
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $elm$browser$Browser$Dom$getViewport = _Browser_withWindow(_Browser_getViewport);
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $elm$random$Random$map3 = F4(
	function (func, _v0, _v1, _v2) {
		var genA = _v0;
		var genB = _v1;
		var genC = _v2;
		return function (seed0) {
			var _v3 = genA(seed0);
			var a = _v3.a;
			var seed1 = _v3.b;
			var _v4 = genB(seed1);
			var b = _v4.a;
			var seed2 = _v4.b;
			var _v5 = genC(seed2);
			var c = _v5.a;
			var seed3 = _v5.b;
			return _Utils_Tuple2(
				A3(func, a, b, c),
				seed3);
		};
	});
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$random$Random$independentSeed = function (seed0) {
	var makeIndependentSeed = F3(
		function (state, b, c) {
			return $elm$random$Random$next(
				A2($elm$random$Random$Seed, state, (1 | (b ^ c)) >>> 0));
		});
	var gen = A2($elm$random$Random$int, 0, 4294967295);
	return A2(
		$elm$random$Random$step,
		A4($elm$random$Random$map3, makeIndependentSeed, gen, gen, gen),
		seed0);
};
var $author$project$Game$Playground$initialComputer = {
	J: $author$project$Game$Playground$emptyKeyboard,
	eb: A4($author$project$Game$Playground$Mouse, 0, 0, false, false),
	b0: A2($author$project$Game$Playground$toScreen, 600, 600),
	dl: $elm$core$Maybe$Nothing,
	dv: 0
};
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $elm$svg$Svg$Attributes$opacity = _VirtualDom_attribute('opacity');
var $author$project$Game$Playground$renderAlpha = function (alpha) {
	return (alpha === 1) ? _List_Nil : _List_fromArray(
		[
			$elm$svg$Svg$Attributes$opacity(
			$elm$core$String$fromFloat(
				A3($elm$core$Basics$clamp, 0, 1, alpha)))
		]);
};
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $author$project$Game$Playground$renderColor = function (color) {
	if (!color.$) {
		var str = color.a;
		return str;
	} else {
		var r = color.a;
		var g = color.b;
		var b = color.c;
		return 'rgb(' + ($elm$core$String$fromInt(r) + (',' + ($elm$core$String$fromInt(g) + (',' + ($elm$core$String$fromInt(b) + ')')))));
	}
};
var $author$project$Game$Playground$renderTransform = F4(
	function (x, y, a, s) {
		return (!a) ? ((s === 1) ? ('translate(' + ($elm$core$String$fromFloat(x) + (',' + ($elm$core$String$fromFloat(-y) + ')')))) : ('translate(' + ($elm$core$String$fromFloat(x) + (',' + ($elm$core$String$fromFloat(-y) + (') scale(' + ($elm$core$String$fromFloat(s) + ')'))))))) : ((s === 1) ? ('translate(' + ($elm$core$String$fromFloat(x) + (',' + ($elm$core$String$fromFloat(-y) + (') rotate(' + ($elm$core$String$fromFloat(-a) + ')')))))) : ('translate(' + ($elm$core$String$fromFloat(x) + (',' + ($elm$core$String$fromFloat(-y) + (') rotate(' + ($elm$core$String$fromFloat(-a) + (') scale(' + ($elm$core$String$fromFloat(s) + ')')))))))));
	});
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $author$project$Game$Playground$renderCircle = F7(
	function (color, radius, x, y, angle, s, alpha) {
		return A2(
			$elm$svg$Svg$circle,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$r(
					$elm$core$String$fromFloat(radius)),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$fill(
						$author$project$Game$Playground$renderColor(color)),
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$transform(
							A4($author$project$Game$Playground$renderTransform, x, y, angle, s)),
						$author$project$Game$Playground$renderAlpha(alpha)))),
			_List_Nil);
	});
var $elm$svg$Svg$image = $elm$svg$Svg$trustedNode('image');
var $author$project$Game$Playground$renderRectTransform = F6(
	function (width, height, x, y, angle, s) {
		return A4($author$project$Game$Playground$renderTransform, x, y, angle, s) + (' translate(' + ($elm$core$String$fromFloat((-width) / 2) + (',' + ($elm$core$String$fromFloat((-height) / 2) + ')'))));
	});
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$xlinkHref = function (value) {
	return A3(
		_VirtualDom_attributeNS,
		'http://www.w3.org/1999/xlink',
		'xlink:href',
		_VirtualDom_noJavaScriptUri(value));
};
var $author$project$Game$Playground$renderImage = F8(
	function (w, h, src, x, y, angle, s, alpha) {
		return A2(
			$elm$svg$Svg$image,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$xlinkHref(src),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$width(
						$elm$core$String$fromFloat(w)),
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$height(
							$elm$core$String$fromFloat(h)),
						A2(
							$elm$core$List$cons,
							$elm$svg$Svg$Attributes$transform(
								A6($author$project$Game$Playground$renderRectTransform, w, h, x, y, angle, s)),
							$author$project$Game$Playground$renderAlpha(alpha))))),
			_List_Nil);
	});
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$sin = _Basics_sin;
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$turns = function (angleInTurns) {
	return (2 * $elm$core$Basics$pi) * angleInTurns;
};
var $author$project$Game$Playground$toNgonPoints = F4(
	function (i, n, radius, string) {
		toNgonPoints:
		while (true) {
			if (_Utils_eq(i, n)) {
				return string;
			} else {
				var a = $elm$core$Basics$turns((i / n) - 0.25);
				var x = radius * $elm$core$Basics$cos(a);
				var y = radius * $elm$core$Basics$sin(a);
				var $temp$i = i + 1,
					$temp$n = n,
					$temp$radius = radius,
					$temp$string = string + ($elm$core$String$fromFloat(x) + (',' + ($elm$core$String$fromFloat(y) + ' ')));
				i = $temp$i;
				n = $temp$n;
				radius = $temp$radius;
				string = $temp$string;
				continue toNgonPoints;
			}
		}
	});
var $author$project$Game$Playground$renderNgon = F8(
	function (color, n, radius, x, y, angle, s, alpha) {
		return A2(
			$elm$svg$Svg$polygon,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$points(
					A4($author$project$Game$Playground$toNgonPoints, 0, n, radius, '')),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$fill(
						$author$project$Game$Playground$renderColor(color)),
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$transform(
							A4($author$project$Game$Playground$renderTransform, x, y, angle, s)),
						$author$project$Game$Playground$renderAlpha(alpha)))),
			_List_Nil);
	});
var $elm$svg$Svg$ellipse = $elm$svg$Svg$trustedNode('ellipse');
var $elm$svg$Svg$Attributes$rx = _VirtualDom_attribute('rx');
var $elm$svg$Svg$Attributes$ry = _VirtualDom_attribute('ry');
var $author$project$Game$Playground$renderOval = F8(
	function (color, width, height, x, y, angle, s, alpha) {
		return A2(
			$elm$svg$Svg$ellipse,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$rx(
					$elm$core$String$fromFloat(width / 2)),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$ry(
						$elm$core$String$fromFloat(height / 2)),
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$fill(
							$author$project$Game$Playground$renderColor(color)),
						A2(
							$elm$core$List$cons,
							$elm$svg$Svg$Attributes$transform(
								A4($author$project$Game$Playground$renderTransform, x, y, angle, s)),
							$author$project$Game$Playground$renderAlpha(alpha))))),
			_List_Nil);
	});
var $author$project$Game$Playground$addPoint = F2(
	function (_v0, str) {
		var x = _v0.a;
		var y = _v0.b;
		return str + ($elm$core$String$fromFloat(x) + (',' + ($elm$core$String$fromFloat(-y) + ' ')));
	});
var $author$project$Game$Playground$renderPolygon = F7(
	function (color, coordinates, x, y, angle, s, alpha) {
		return A2(
			$elm$svg$Svg$polygon,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$points(
					A3($elm$core$List$foldl, $author$project$Game$Playground$addPoint, '', coordinates)),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$fill(
						$author$project$Game$Playground$renderColor(color)),
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$transform(
							A4($author$project$Game$Playground$renderTransform, x, y, angle, s)),
						$author$project$Game$Playground$renderAlpha(alpha)))),
			_List_Nil);
	});
var $elm$svg$Svg$polyline = $elm$svg$Svg$trustedNode('polyline');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $author$project$Game$Playground$renderPolyline = F8(
	function (color, pen, coordinates, x, y, angle, s, alpha) {
		return A2(
			$elm$svg$Svg$polyline,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$points(
					A3($elm$core$List$foldl, $author$project$Game$Playground$addPoint, '', coordinates)),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$fill('none'),
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$stroke(
							$author$project$Game$Playground$renderColor(color)),
						A2(
							$elm$core$List$cons,
							$elm$svg$Svg$Attributes$strokeWidth(
								$elm$core$String$fromFloat(pen)),
							A2(
								$elm$core$List$cons,
								$elm$svg$Svg$Attributes$transform(
									A4($author$project$Game$Playground$renderTransform, x, y, angle, s)),
								$author$project$Game$Playground$renderAlpha(alpha)))))),
			_List_Nil);
	});
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $author$project$Game$Playground$renderRectangle = F8(
	function (color, w, h, x, y, angle, s, alpha) {
		return A2(
			$elm$svg$Svg$rect,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$width(
					$elm$core$String$fromFloat(w)),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$height(
						$elm$core$String$fromFloat(h)),
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$fill(
							$author$project$Game$Playground$renderColor(color)),
						A2(
							$elm$core$List$cons,
							$elm$svg$Svg$Attributes$transform(
								A6($author$project$Game$Playground$renderRectTransform, w, h, x, y, angle, s)),
							$author$project$Game$Playground$renderAlpha(alpha))))),
			_List_Nil);
	});
var $elm$svg$Svg$Attributes$dominantBaseline = _VirtualDom_attribute('dominant-baseline');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $author$project$Game$Playground$renderWords = F7(
	function (color, string, x, y, angle, s, alpha) {
		return A2(
			$elm$svg$Svg$text_,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$textAnchor('middle'),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$dominantBaseline('central'),
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$fill(
							$author$project$Game$Playground$renderColor(color)),
						A2(
							$elm$core$List$cons,
							$elm$svg$Svg$Attributes$transform(
								A4($author$project$Game$Playground$renderTransform, x, y, angle, s)),
							$author$project$Game$Playground$renderAlpha(alpha))))),
			_List_fromArray(
				[
					$elm$svg$Svg$text(string)
				]));
	});
var $author$project$Game$Playground$renderShape = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	var angle = _v0.c;
	var s = _v0.d;
	var alpha = _v0.e;
	var form = _v0.f;
	switch (form.$) {
		case 0:
			var color = form.a;
			var radius = form.b;
			return A7($author$project$Game$Playground$renderCircle, color, radius, x, y, angle, s, alpha);
		case 1:
			var color = form.a;
			var width = form.b;
			var height = form.c;
			return A8($author$project$Game$Playground$renderOval, color, width, height, x, y, angle, s, alpha);
		case 2:
			var color = form.a;
			var width = form.b;
			var height = form.c;
			return A8($author$project$Game$Playground$renderRectangle, color, width, height, x, y, angle, s, alpha);
		case 3:
			var color = form.a;
			var n = form.b;
			var radius = form.c;
			return A8($author$project$Game$Playground$renderNgon, color, n, radius, x, y, angle, s, alpha);
		case 4:
			var color = form.a;
			var points = form.b;
			return A7($author$project$Game$Playground$renderPolygon, color, points, x, y, angle, s, alpha);
		case 5:
			var color = form.a;
			var pen = form.b;
			var points = form.c;
			return A8($author$project$Game$Playground$renderPolyline, color, pen, points, x, y, angle, s, alpha);
		case 6:
			var width = form.a;
			var height = form.b;
			var src = form.c;
			return A8($author$project$Game$Playground$renderImage, width, height, src, x, y, angle, s, alpha);
		case 7:
			var color = form.a;
			var string = form.b;
			return A7($author$project$Game$Playground$renderWords, color, string, x, y, angle, s, alpha);
		default:
			var shapes = form.a;
			return A2(
				$elm$svg$Svg$g,
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$transform(
						A4($author$project$Game$Playground$renderTransform, x, y, angle, s)),
					$author$project$Game$Playground$renderAlpha(alpha)),
				A2($elm$core$List$map, $author$project$Game$Playground$renderShape, shapes));
	}
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Game$Playground$render = F2(
	function (screen, shapes) {
		var y = $elm$core$String$fromFloat(screen.a0);
		var x = $elm$core$String$fromFloat(screen.K);
		var w = $elm$core$String$fromFloat(screen.aS);
		var h = $elm$core$String$fromFloat(screen.ax);
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$viewBox(x + (' ' + (y + (' ' + (w + (' ' + h)))))),
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					$elm$svg$Svg$Attributes$width('100%'),
					$elm$svg$Svg$Attributes$height('100%')
				]),
			A2($elm$core$List$map, $author$project$Game$Playground$renderShape, shapes));
	});
var $author$project$Game$Playground$game = F5(
	function (tps, viewMemory, updateMemory, initialMemory, initialRandom) {
		var view = function (_v2) {
			var memory = _v2.b;
			var computer = _v2.c;
			var next = _v2.d;
			return {
				g: _List_fromArray(
					[
						A2(
						$author$project$Game$Playground$render,
						computer.b0,
						A2(viewMemory, computer, memory))
					]),
				eE: 'Playground'
			};
		};
		var update = F2(
			function (msg, model) {
				return _Utils_Tuple2(
					A4($author$project$Game$Playground$gameUpdate, updateMemory, initialRandom, msg, model),
					$elm$core$Platform$Cmd$none);
			});
		var subscriptions = function (_v1) {
			var visibility = _v1.a;
			if (visibility === 1) {
				return $elm$browser$Browser$Events$onVisibilityChange($author$project$Game$Playground$VisibilityChanged);
			} else {
				return $author$project$Game$Playground$gameSubscriptions(tps);
			}
		};
		var init = function (flags) {
			return _Utils_Tuple2(
				A4(
					$author$project$Game$Playground$Game,
					0,
					initialMemory(flags),
					$author$project$Game$Playground$initialComputer,
					$elm$core$Basics$identity),
				$elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							A2($elm$random$Random$generate, $author$project$Game$Playground$GotSeed, $elm$random$Random$independentSeed),
							A2($elm$core$Task$perform, $author$project$Game$Playground$GotViewport, $elm$browser$Browser$Dom$getViewport)
						])));
		};
		return $elm$browser$Browser$document(
			{d8: init, eA: subscriptions, eG: update, eI: view});
	});
var $author$project$Game$Main$Animate = F4(
	function (a, b, c, d) {
		return {$: 1, a: a, b: b, c: c, d: d};
	});
var $author$project$Game$Main$Game = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $bartavelle$json_helpers$Json$Helpers$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$API$jsonDecGameFlags = A2(
	$bartavelle$json_helpers$Json$Helpers$custom,
	$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
	$elm$json$Json$Decode$succeed(
		function (pgamePlayers) {
			return {aw: pgamePlayers};
		}));
var $author$project$Game$Main$decodeGameFlags = function (v) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$API$jsonDecGameFlags, v);
	if (_v0.$ === 1) {
		var err = _v0.a;
		return $elm$core$Maybe$Nothing;
	} else {
		var flags = _v0.a;
		return $elm$core$Maybe$Just(flags);
	}
};
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $bartavelle$json_helpers$Json$Helpers$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$bartavelle$json_helpers$Json$Helpers$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $bartavelle$json_helpers$Json$Helpers$tuple2 = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$API$jsonDecMatchData = A3(
	$bartavelle$json_helpers$Json$Helpers$required,
	'mMoves2',
	$elm$json$Json$Decode$list($elm$json$Json$Decode$int),
	A3(
		$bartavelle$json_helpers$Json$Helpers$required,
		'mMoves1',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$int),
		A3(
			$bartavelle$json_helpers$Json$Helpers$required,
			'mPowers',
			$elm$json$Json$Decode$list(
				A3(
					$elm$json$Json$Decode$map2,
					$bartavelle$json_helpers$Json$Helpers$tuple2,
					A2(
						$elm$json$Json$Decode$index,
						0,
						A3(
							$elm$json$Json$Decode$map2,
							$bartavelle$json_helpers$Json$Helpers$tuple2,
							A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$int),
							A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$int))),
					A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$int))),
			$elm$json$Json$Decode$succeed(
				F3(
					function (pmPowers, pmMoves1, pmMoves2) {
						return {bp: pmMoves1, bq: pmMoves2, bt: pmPowers};
					})))));
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $bartavelle$json_helpers$Json$Helpers$fnullable = F3(
	function (key, valDecoder, decoder) {
		var nullfield = A2(
			$elm$json$Json$Decode$field,
			key,
			$elm$json$Json$Decode$nullable(valDecoder));
		var missingfield = $elm$json$Json$Decode$maybe(
			A2($elm$json$Json$Decode$field, key, valDecoder));
		return A2(
			$bartavelle$json_helpers$Json$Helpers$custom,
			$elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[missingfield, nullfield])),
			decoder);
	});
var $author$project$API$jsonDecMatchPlayer = A3(
	$bartavelle$json_helpers$Json$Helpers$required,
	'mpAvatar',
	$elm$json$Json$Decode$int,
	A3(
		$bartavelle$json_helpers$Json$Helpers$required,
		'mpName',
		$elm$json$Json$Decode$string,
		A3(
			$bartavelle$json_helpers$Json$Helpers$required,
			'mpId',
			$elm$json$Json$Decode$int,
			$elm$json$Json$Decode$succeed(
				F3(
					function (pmpId, pmpName, pmpAvatar) {
						return {bA: pmpAvatar, bB: pmpId, bC: pmpName};
					})))));
var $author$project$API$jsonDecMilliseconds = $elm$json$Json$Decode$int;
var $author$project$API$jsonDecMatchInfo = A3(
	$bartavelle$json_helpers$Json$Helpers$required,
	'mTime',
	$author$project$API$jsonDecMilliseconds,
	A3(
		$bartavelle$json_helpers$Json$Helpers$required,
		'mChampionship',
		$elm$json$Json$Decode$bool,
		A3(
			$bartavelle$json_helpers$Json$Helpers$fnullable,
			'mWinner',
			$elm$json$Json$Decode$int,
			A3(
				$bartavelle$json_helpers$Json$Helpers$required,
				'mP2',
				$author$project$API$jsonDecMatchPlayer,
				A3(
					$bartavelle$json_helpers$Json$Helpers$required,
					'mP1',
					$author$project$API$jsonDecMatchPlayer,
					$elm$json$Json$Decode$succeed(
						F5(
							function (pmP1, pmP2, pmWinner, pmChampionship, pmTime) {
								return {bm: pmChampionship, br: pmP1, bs: pmP2, bu: pmTime, bv: pmWinner};
							})))))));
var $author$project$API$jsonDecMatch = A3(
	$bartavelle$json_helpers$Json$Helpers$required,
	'mData',
	$author$project$API$jsonDecMatchData,
	A3(
		$bartavelle$json_helpers$Json$Helpers$required,
		'mInfo',
		$author$project$API$jsonDecMatchInfo,
		$elm$json$Json$Decode$succeed(
			F2(
				function (pmInfo, pmData) {
					return {bn: pmData, bo: pmInfo};
				}))));
var $author$project$Game$Main$decodeMatch = function (v) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$API$jsonDecMatch, v);
	if (_v0.$ === 1) {
		var err = _v0.a;
		return $elm$core$Maybe$Nothing;
	} else {
		var match = _v0.a;
		return $elm$core$Maybe$Just(match);
	}
};
var $author$project$API$jsonDecTutorialFlags = A3(
	$bartavelle$json_helpers$Json$Helpers$required,
	'tutorialRand',
	$elm$json$Json$Decode$list($elm$json$Json$Decode$int),
	A3(
		$bartavelle$json_helpers$Json$Helpers$required,
		'tutorialRun',
		$elm$json$Json$Decode$bool,
		A3(
			$bartavelle$json_helpers$Json$Helpers$required,
			'tutorialId',
			$elm$json$Json$Decode$int,
			$elm$json$Json$Decode$succeed(
				F3(
					function (ptutorialId, ptutorialRun, ptutorialRand) {
						return {cg: ptutorialId, ch: ptutorialRand, ci: ptutorialRun};
					})))));
var $author$project$Game$Main$decodeTutorialFlags = function (v) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$API$jsonDecTutorialFlags, v);
	if (_v0.$ === 1) {
		var err = _v0.a;
		return $elm$core$Maybe$Nothing;
	} else {
		var flags = _v0.a;
		return $elm$core$Maybe$Just(flags);
	}
};
var $author$project$API$defaultGameFlags = {
	aw: _List_fromArray(
		['none', 'none', 'none', 'none'])
};
var $author$project$Game$State$Wall = 0;
var $author$project$Game$State$Box = 2;
var $author$project$Game$State$Empty = 1;
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Game$State$isStart = F2(
	function (n, _v0) {
		var l = _v0.a;
		var c = _v0.b;
		return ((l <= 2) && (c <= 2)) || (((_Utils_cmp(l, n - 3) > -1) && (c <= 2)) || (((l <= 2) && (_Utils_cmp(c, n - 3) > -1)) || ((_Utils_cmp(l, n - 3) > -1) && (_Utils_cmp(c, n - 3) > -1))));
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $author$project$Utils$isEven = function (n) {
	return !A2($elm$core$Basics$modBy, 2, n);
};
var $author$project$Game$State$isWall = F2(
	function (n, _v0) {
		var l = _v0.a;
		var c = _v0.b;
		return (!c) || (_Utils_eq(c, n - 1) || ($author$project$Utils$isEven(l) && $author$project$Utils$isEven(c)));
	});
var $author$project$Game$State$createCell = F3(
	function (withBoxes, n, pos) {
		return A2($author$project$Game$State$isWall, n, pos) ? 0 : (A2($author$project$Game$State$isStart, n, pos) ? 1 : (withBoxes ? 2 : 1));
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
var $author$project$Game$State$createLine = F3(
	function (withBoxes, n, l) {
		return ((!l) || _Utils_eq(l, n - 1)) ? A2($elm$core$Array$repeat, n, 0) : A2(
			$elm$core$Array$initialize,
			n,
			function (c) {
				return A3(
					$author$project$Game$State$createCell,
					withBoxes,
					n,
					_Utils_Tuple2(l, c));
			});
	});
var $author$project$Game$State$createBoard = F2(
	function (withBoxes, n) {
		return A2(
			$elm$core$Array$initialize,
			n,
			A2($author$project$Game$State$createLine, withBoxes, n));
	});
var $author$project$Game$State$createMap = F2(
	function (withBoxes, n) {
		return {
			Z: A2($author$project$Game$State$createBoard, withBoxes, n),
			Q: n
		};
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
					{k: nodeList, e: nodeListSize, f: jsArray});
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
var $author$project$Game$State$Bombs = 0;
var $author$project$Game$State$Flames = 1;
var $author$project$Game$State$intToPowerup = function (i) {
	if (!i) {
		return 0;
	} else {
		return 1;
	}
};
var $author$project$Game$State$closeParedesAux = F3(
	function (dim, _v0, dir) {
		var l = _v0.a;
		var c = _v0.b;
		var _v1 = _Utils_Tuple2(dim, dir);
		switch (_v1.b) {
			case 'R':
				switch (_v1.a) {
					case 0:
						return _List_fromArray(
							[
								_Utils_Tuple2(l, c)
							]);
					case 1:
						return _List_fromArray(
							[
								_Utils_Tuple2(l, c)
							]);
					default:
						return _Utils_ap(
							A2(
								$elm$core$List$map,
								function (cc) {
									return _Utils_Tuple2(l, cc);
								},
								A2($elm$core$List$range, c, (c + dim) - 1)),
							A3(
								$author$project$Game$State$closeParedesAux,
								dim,
								_Utils_Tuple2(l, c + dim),
								'D'));
				}
			case 'D':
				return _Utils_ap(
					A2(
						$elm$core$List$map,
						function (ll) {
							return _Utils_Tuple2(ll, c);
						},
						A2($elm$core$List$range, l, (l + dim) - 1)),
					A3(
						$author$project$Game$State$closeParedesAux,
						dim,
						_Utils_Tuple2(l + dim, c),
						'L'));
			case 'L':
				return _Utils_ap(
					$elm$core$List$reverse(
						A2(
							$elm$core$List$map,
							function (cc) {
								return _Utils_Tuple2(l, cc);
							},
							A2($elm$core$List$range, (c - dim) + 1, c))),
					A3(
						$author$project$Game$State$closeParedesAux,
						dim,
						_Utils_Tuple2(l, c - dim),
						'U'));
			case 'U':
				return _Utils_ap(
					$elm$core$List$reverse(
						A2(
							$elm$core$List$map,
							function (ll) {
								return _Utils_Tuple2(ll, c);
							},
							A2($elm$core$List$range, (l - dim) + 1, l))),
					A3(
						$author$project$Game$State$closeParedesAux,
						dim - 2,
						_Utils_Tuple2((l - dim) + 1, c + 1),
						'R'));
			default:
				return _List_Nil;
		}
	});
var $author$project$Game$State$closeParedes = function (dim) {
	return A3(
		$author$project$Game$State$closeParedesAux,
		dim - 3,
		_Utils_Tuple2(1, 1),
		'R');
};
var $author$project$Game$State$gameTicks = 300;
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $elm$core$Basics$pow = _Basics_pow;
var $author$project$Game$State$totalBlocks = function (dim) {
	return A2($elm$core$Basics$pow, dim - 2, 2);
};
var $author$project$Game$State$makeCaracol = function (dim) {
	var nclosed = $author$project$Game$State$totalBlocks(dim);
	var closed = $author$project$Game$State$closeParedes(dim);
	return _Utils_ap(
		A2($elm$core$List$repeat, $author$project$Game$State$gameTicks - nclosed, $elm$core$Maybe$Nothing),
		A2(
			$elm$core$List$map,
			$elm$core$Maybe$Just,
			$author$project$Game$State$closeParedes(dim)));
};
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $author$project$Game$State$mapsize = 11;
var $author$project$Game$State$initState = F2(
	function (pws, players) {
		var powers = A2(
			$elm$core$Dict$map,
			F2(
				function (k, i) {
					return $author$project$Game$State$intToPowerup(i);
				}),
			$elm$core$Dict$fromList(pws));
		var playersN = $elm$core$Array$fromList(players);
		var mapN = A2($author$project$Game$State$createMap, true, $author$project$Game$State$mapsize);
		var caracolN = $author$project$Game$State$makeCaracol($author$project$Game$State$mapsize);
		return {ao: $elm$core$Dict$empty, _: caracolN, cE: 0, ad: mapN, c6: playersN, t: powers, dl: $elm$core$Maybe$Nothing};
	});
var $author$project$Game$Main$Tutorial = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$Game$Tutorial$tutorialMap = A2($author$project$Game$State$createMap, false, 11);
var $author$project$Game$State$PBot = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$Game$State$PNone = {$: 2};
var $author$project$Game$State$BotMove = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
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
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
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
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			k: _List_Nil,
			e: 0,
			f: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.e * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						k: A2($elm$core$List$cons, mappedLeaf, builder.k),
						e: builder.e + 1,
						f: builder.f
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $author$project$Game$State$isBot = function (p) {
	if (!p.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Game$Bot$Bombs = 3;
var $author$project$Game$Bot$Box = 1;
var $author$project$Game$Bot$Empty = 2;
var $author$project$Game$Bot$Flames = 4;
var $author$project$Game$Bot$Wall = 0;
var $author$project$Game$State$toBotCell = F3(
	function (pws, pos, cell) {
		switch (cell) {
			case 0:
				return 0;
			case 2:
				return 1;
			default:
				var _v1 = A2($elm$core$Dict$get, pos, pws);
				if (_v1.$ === 1) {
					return 2;
				} else {
					if (!_v1.a) {
						var _v2 = _v1.a;
						return 3;
					} else {
						var _v3 = _v1.a;
						return 4;
					}
				}
		}
	});
var $author$project$Game$State$noBotPlayer = {
	cB: 0,
	at: _List_Nil,
	cP: 0,
	aL: _Utils_Tuple2(0, 0)
};
var $author$project$Game$State$toBotBomb = function (_v0) {
	var p = _v0.a;
	var b = _v0.b;
	return {c8: p, ep: b.dI, eD: b.dJ};
};
var $author$project$Game$State$toBotPlayerState = F2(
	function (i, p) {
		return {
			cB: p.ej,
			at: A2(
				$elm$core$List$map,
				$author$project$Game$State$toBotBomb,
				$elm$core$Dict$toList(p.c3)),
			cP: p.ek,
			aL: p.V
		};
	});
var $author$project$Game$State$toBotPlayer = F2(
	function (pid, p) {
		switch (p.$) {
			case 2:
				return $author$project$Game$State$noBotPlayer;
			case 1:
				var pst = p.a;
				return A2($author$project$Game$State$toBotPlayerState, pid, pst);
			default:
				var pst = p.b;
				return A2($author$project$Game$State$toBotPlayerState, pid, pst);
		}
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$Array$toIndexedList = function (array) {
	var len = array.a;
	var helper = F2(
		function (entry, _v0) {
			var index = _v0.a;
			var list = _v0.b;
			return _Utils_Tuple2(
				index - 1,
				A2(
					$elm$core$List$cons,
					_Utils_Tuple2(index, entry),
					list));
		});
	return A3(
		$elm$core$Array$foldr,
		helper,
		_Utils_Tuple2(len - 1, _List_Nil),
		array).b;
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Game$State$toBotState = F2(
	function (pid, st) {
		var pws = st.t;
		var oid = A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$head(
				A2(
					$elm$core$List$filterMap,
					function (_v0) {
						var i = _v0.a;
						var p = _v0.b;
						return ((!_Utils_eq(i, pid)) && $author$project$Game$State$isBot(p)) ? $elm$core$Maybe$Just(i) : $elm$core$Maybe$Nothing;
					},
					$elm$core$Array$toIndexedList(st.c6))));
		var op = A2(
			$author$project$Game$State$toBotPlayer,
			oid,
			A2(
				$elm$core$Maybe$withDefault,
				$author$project$Game$State$PNone,
				A2($elm$core$Array$get, oid, st.c6)));
		var me = A2(
			$author$project$Game$State$toBotPlayer,
			pid,
			A2(
				$elm$core$Maybe$withDefault,
				$author$project$Game$State$PNone,
				A2($elm$core$Array$get, pid, st.c6)));
		var boardN = A2(
			$elm$core$Array$indexedMap,
			function (l) {
				return $elm$core$Array$indexedMap(
					function (c) {
						return A2(
							$author$project$Game$State$toBotCell,
							pws,
							_Utils_Tuple2(l, c));
					});
			},
			st.ad.Z);
		return {Z: boardN, aD: me, bM: op, dw: st.cE};
	});
var $author$project$Game$State$simpleBot = F4(
	function (bot, seed, pid, st) {
		return _Utils_Tuple2(
			seed,
			$author$project$Game$State$BotMove(
				bot(
					A2($author$project$Game$State$toBotState, pid, st))));
	});
var $author$project$Game$Bot$MoveRight = 3;
var $author$project$Game$Tutorial$bot1 = function (st) {
	return 3;
};
var $author$project$Game$Bot$MoveDown = 1;
var $author$project$Game$Tutorial$bot2 = function (st) {
	var _v0 = st.aD.aL;
	var line = _v0.a;
	var col = _v0.b;
	return (col < 7) ? 3 : 1;
};
var $author$project$Game$Bot$Idle = 5;
var $author$project$Game$Bot$MoveLeft = 2;
var $author$project$Game$Bot$MoveUp = 0;
var $author$project$Game$Bot$above = function (_v0) {
	var l = _v0.a;
	var c = _v0.b;
	return _Utils_Tuple2(l - 1, c);
};
var $author$project$Game$Bot$below = function (_v0) {
	var l = _v0.a;
	var c = _v0.b;
	return _Utils_Tuple2(l + 1, c);
};
var $author$project$Game$Bot$hasBomb = F2(
	function (p, st) {
		var check = A2(
			$elm$core$List$foldl,
			F2(
				function (b, f) {
					return f || _Utils_eq(b.c8, p);
				}),
			false);
		return check(st.aD.at) || check(st.bM.at);
	});
var $elm$core$Basics$not = _Basics_not;
var $author$project$Game$Bot$readCell = F2(
	function (_v0, st) {
		var l = _v0.a;
		var c = _v0.b;
		return A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Array$get,
				c,
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Array$empty,
					A2($elm$core$Array$get, l, st.Z))));
	});
var $author$project$Game$Tutorial$isFreePos = F2(
	function (pos, state) {
		return (!(!A2($author$project$Game$Bot$readCell, pos, state))) && (!A2($author$project$Game$Bot$hasBomb, pos, state));
	});
var $author$project$Game$Bot$leftwards = function (_v0) {
	var l = _v0.a;
	var c = _v0.b;
	return _Utils_Tuple2(l, c - 1);
};
var $author$project$Game$Bot$rightwards = function (_v0) {
	var l = _v0.a;
	var c = _v0.b;
	return _Utils_Tuple2(l, c + 1);
};
var $author$project$Game$Tutorial$bot3 = function (state) {
	var pos = state.aD.aL;
	return A2(
		$author$project$Game$Tutorial$isFreePos,
		$author$project$Game$Bot$above(pos),
		state) ? 0 : (A2(
		$author$project$Game$Tutorial$isFreePos,
		$author$project$Game$Bot$below(pos),
		state) ? 1 : (A2(
		$author$project$Game$Tutorial$isFreePos,
		$author$project$Game$Bot$leftwards(pos),
		state) ? 2 : (A2(
		$author$project$Game$Tutorial$isFreePos,
		$author$project$Game$Bot$rightwards(pos),
		state) ? 3 : 5)));
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$Game$Bot$euclidianDistance = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var y1 = _v0.b;
		var x2 = _v1.a;
		var y2 = _v1.b;
		var dist = F2(
			function (a, b) {
				return $elm$core$Basics$abs(a - b);
			});
		return $elm$core$Basics$sqrt(
			A2(
				$elm$core$Basics$pow,
				A2(dist, x1, x2),
				2) + A2(
				$elm$core$Basics$pow,
				A2(dist, y1, y2),
				2));
	});
var $author$project$Game$Tutorial$bot4 = F2(
	function (target, state) {
		var pos = state.aD.aL;
		var min2 = F2(
			function (_v0, _v1) {
				var d1 = _v0.a;
				var mv1 = _v0.b;
				var d2 = _v1.a;
				var mv2 = _v1.b;
				return (_Utils_cmp(d1, d2) < 1) ? _Utils_Tuple2(d1, mv1) : _Utils_Tuple2(d2, mv2);
			});
		var distanceFrom = function (neighbor) {
			return (!A2($author$project$Game$Bot$readCell, neighbor, state)) ? 100 : A2($author$project$Game$Bot$euclidianDistance, neighbor, target);
		};
		var down = _Utils_Tuple2(
			distanceFrom(
				$author$project$Game$Bot$below(pos)),
			1);
		var left = _Utils_Tuple2(
			distanceFrom(
				$author$project$Game$Bot$leftwards(pos)),
			2);
		var right = _Utils_Tuple2(
			distanceFrom(
				$author$project$Game$Bot$rightwards(pos)),
			3);
		var up = _Utils_Tuple2(
			distanceFrom(
				$author$project$Game$Bot$above(pos)),
			0);
		return A2(
			min2,
			up,
			A2(
				min2,
				down,
				A2(min2, left, right))).b;
	});
var $author$project$Game$Bot$iterateLine = F3(
	function (ls, x0, go) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, x) {
					var c = _v0.a;
					var cell = _v0.b;
					return A3(go, x, c, cell);
				}),
			x0,
			$elm$core$Array$toIndexedList(ls));
	});
var $author$project$Game$Bot$iterateBoard = F3(
	function (board, x0, go) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, x) {
					var l = _v0.a;
					var ys = _v0.b;
					return A3(
						$author$project$Game$Bot$iterateLine,
						ys,
						x,
						F2(
							function (y, c) {
								return A2(
									go,
									y,
									_Utils_Tuple2(l, c));
							}));
				}),
			x0,
			$elm$core$Array$toIndexedList(board));
	});
var $author$project$Game$Tutorial$findPowerup = function (state) {
	return A3(
		$author$project$Game$Bot$iterateBoard,
		state.Z,
		$elm$core$Maybe$Nothing,
		F3(
			function (prev, pos, cell) {
				if (!prev.$) {
					return prev;
				} else {
					switch (cell) {
						case 4:
							return $elm$core$Maybe$Just(pos);
						case 3:
							return $elm$core$Maybe$Just(pos);
						default:
							return $elm$core$Maybe$Nothing;
					}
				}
			}));
};
var $author$project$Game$Bot$distance = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var y1 = _v0.b;
		var x2 = _v1.a;
		var y2 = _v1.b;
		var dist = F2(
			function (a, b) {
				return $elm$core$Basics$abs(a - b);
			});
		return $elm$core$Basics$sqrt(
			A2(
				$elm$core$Basics$pow,
				A2(dist, x1, x2),
				2) + A2(
				$elm$core$Basics$pow,
				A2(dist, y1, y2),
				2));
	});
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Game$Bot$moveTowards = F2(
	function (target, state) {
		var pos = state.aD.aL;
		var distanceFrom = function (neighbor) {
			return (!A2($author$project$Game$Bot$readCell, neighbor, state)) ? 100 : A2($author$project$Game$Bot$distance, neighbor, target);
		};
		var _v0 = A2(
			$elm$core$List$sortBy,
			$elm$core$Tuple$first,
			_List_fromArray(
				[
					_Utils_Tuple2(
					distanceFrom(
						$author$project$Game$Bot$above(pos)),
					0),
					_Utils_Tuple2(
					distanceFrom(
						$author$project$Game$Bot$below(pos)),
					1),
					_Utils_Tuple2(
					distanceFrom(
						$author$project$Game$Bot$leftwards(pos)),
					2),
					_Utils_Tuple2(
					distanceFrom(
						$author$project$Game$Bot$rightwards(pos)),
					3)
				]));
		if (_v0.b) {
			var x = _v0.a;
			var xs = _v0.b;
			return x.b;
		} else {
			return 5;
		}
	});
var $author$project$Game$Tutorial$bot5 = function (state) {
	var _v0 = $author$project$Game$Tutorial$findPowerup(state);
	if (_v0.$ === 1) {
		return 5;
	} else {
		var p = _v0.a;
		return A2($author$project$Game$Bot$moveTowards, p, state);
	}
};
var $author$project$Game$Bot$iterate = F3(
	function (xs, x0, f) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (a, v) {
					return A2(f, v, a);
				}),
			x0,
			xs);
	});
var $author$project$Game$Tutorial$closestTo = F2(
	function (to, ps) {
		var min2 = F2(
			function (_v1, _v2) {
				var d1 = _v1.a;
				var p1 = _v1.b;
				var d2 = _v2.a;
				var p2 = _v2.b;
				return (_Utils_cmp(d1, d2) < 1) ? _Utils_Tuple2(d1, p1) : _Utils_Tuple2(d2, p2);
			});
		return A3(
			$author$project$Game$Bot$iterate,
			ps,
			$elm$core$Maybe$Nothing,
			F2(
				function (val, pos) {
					var now = _Utils_Tuple2(
						A2($author$project$Game$Bot$euclidianDistance, to, pos),
						pos);
					if (val.$ === 1) {
						return $elm$core$Maybe$Just(now);
					} else {
						var prev = val.a;
						return $elm$core$Maybe$Just(
							A2(min2, prev, now));
					}
				}));
	});
var $author$project$Game$Tutorial$findPowerups = function (state) {
	return A3(
		$author$project$Game$Bot$iterateBoard,
		state.Z,
		_List_Nil,
		F3(
			function (prev, pos, cell) {
				switch (cell) {
					case 4:
						return A2($elm$core$List$cons, pos, prev);
					case 3:
						return A2($elm$core$List$cons, pos, prev);
					default:
						return prev;
				}
			}));
};
var $author$project$Game$Tutorial$bot6 = function (state) {
	var _v0 = A2(
		$author$project$Game$Tutorial$closestTo,
		state.aD.aL,
		$author$project$Game$Tutorial$findPowerups(state));
	if (_v0.$ === 1) {
		return 5;
	} else {
		var _v1 = _v0.a;
		var p = _v1.b;
		return A2($author$project$Game$Bot$moveTowards, p, state);
	}
};
var $author$project$Utils$nth = F2(
	function (xs, n) {
		nth:
		while (true) {
			if (!xs.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = xs.a;
				var ys = xs.b;
				if (!n) {
					return $elm$core$Maybe$Just(x);
				} else {
					var $temp$xs = ys,
						$temp$n = n - 1;
					xs = $temp$xs;
					n = $temp$n;
					continue nth;
				}
			}
		}
	});
var $author$project$Game$Tutorial$getRandPos = F2(
	function (xs, i) {
		var x = A2(
			$elm$core$Maybe$withDefault,
			5,
			A2($author$project$Utils$nth, xs, i * 2));
		var y = A2(
			$elm$core$Maybe$withDefault,
			5,
			A2($author$project$Utils$nth, xs, (i * 2) + 1));
		return _Utils_Tuple2(x, y);
	});
var $author$project$Game$Bot$idleBot = function (state) {
	return 5;
};
var $author$project$Game$Tutorial$tutorialBot = F2(
	function (rand, i) {
		switch (i) {
			case 1:
				return $author$project$Game$Tutorial$bot1;
			case 2:
				return $author$project$Game$Tutorial$bot2;
			case 3:
				return $author$project$Game$Tutorial$bot3;
			case 4:
				return $author$project$Game$Tutorial$bot4(
					A2($author$project$Game$Tutorial$getRandPos, rand, 1));
			case 5:
				return $author$project$Game$Tutorial$bot5;
			case 6:
				return $author$project$Game$Tutorial$bot6;
			default:
				return $author$project$Game$Bot$idleBot;
		}
	});
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $author$project$Game$Tutorial$tutorialPlayerData = {c2: 24, em: 'bot'};
var $author$project$Game$Tutorial$tutorialPlayerState = F2(
	function (rand, i) {
		switch (i) {
			case 1:
				return {
					ej: 1,
					bP: $author$project$Game$Tutorial$tutorialPlayerData,
					ek: 1,
					el: $elm$core$Maybe$Nothing,
					c3: $elm$core$Dict$empty,
					V: _Utils_Tuple2(5, 5)
				};
			case 2:
				return {
					ej: 1,
					bP: $author$project$Game$Tutorial$tutorialPlayerData,
					ek: 1,
					el: $elm$core$Maybe$Nothing,
					c3: $elm$core$Dict$empty,
					V: _Utils_Tuple2(5, 5)
				};
			case 3:
				var bomb = {dH: 0, dI: 1, dJ: 1};
				return {
					ej: 1,
					bP: $author$project$Game$Tutorial$tutorialPlayerData,
					ek: 1,
					el: $elm$core$Maybe$Nothing,
					c3: A2(
						$elm$core$Dict$singleton,
						A2($author$project$Game$Tutorial$getRandPos, rand, 1),
						bomb),
					V: A2($author$project$Game$Tutorial$getRandPos, rand, 0)
				};
			case 4:
				return {
					ej: 1,
					bP: $author$project$Game$Tutorial$tutorialPlayerData,
					ek: 1,
					el: $elm$core$Maybe$Nothing,
					c3: $elm$core$Dict$empty,
					V: A2($author$project$Game$Tutorial$getRandPos, rand, 0)
				};
			case 5:
				return {
					ej: 1,
					bP: $author$project$Game$Tutorial$tutorialPlayerData,
					ek: 1,
					el: $elm$core$Maybe$Nothing,
					c3: $elm$core$Dict$empty,
					V: A2($author$project$Game$Tutorial$getRandPos, rand, 1)
				};
			case 6:
				return {
					ej: 1,
					bP: $author$project$Game$Tutorial$tutorialPlayerData,
					ek: 1,
					el: $elm$core$Maybe$Nothing,
					c3: $elm$core$Dict$empty,
					V: A2($author$project$Game$Tutorial$getRandPos, rand, 1)
				};
			default:
				return {
					ej: 1,
					bP: $author$project$Game$Tutorial$tutorialPlayerData,
					ek: 1,
					el: $elm$core$Maybe$Nothing,
					c3: $elm$core$Dict$empty,
					V: _Utils_Tuple2(5, 5)
				};
		}
	});
var $author$project$Game$Tutorial$tutorialPlayers = F2(
	function (rand, i) {
		return $elm$core$Array$fromList(
			_List_fromArray(
				[
					A3(
					$author$project$Game$State$PBot,
					$author$project$Game$State$simpleBot(
						A2($author$project$Game$Tutorial$tutorialBot, rand, i)),
					A2($author$project$Game$Tutorial$tutorialPlayerState, rand, i),
					false),
					$author$project$Game$State$PNone,
					$author$project$Game$State$PNone,
					$author$project$Game$State$PNone
				]));
	});
var $author$project$Game$Tutorial$tutorialPowerups = F2(
	function (rand, i) {
		switch (i) {
			case 1:
				return A2(
					$elm$core$Dict$singleton,
					_Utils_Tuple2(5, 9),
					0);
			case 2:
				return A2(
					$elm$core$Dict$singleton,
					_Utils_Tuple2(8, 7),
					1);
			case 3:
				return $elm$core$Dict$empty;
			case 4:
				return A2(
					$elm$core$Dict$singleton,
					A2($author$project$Game$Tutorial$getRandPos, rand, 1),
					1);
			case 5:
				return $elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(
							A2($author$project$Game$Tutorial$getRandPos, rand, 0),
							1),
							_Utils_Tuple2(
							A2($author$project$Game$Tutorial$getRandPos, rand, 2),
							0)
						]));
			case 6:
				return $elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(
							A2($author$project$Game$Tutorial$getRandPos, rand, 0),
							1),
							_Utils_Tuple2(
							A2($author$project$Game$Tutorial$getRandPos, rand, 2),
							0)
						]));
			default:
				return $elm$core$Dict$empty;
		}
	});
var $author$project$Game$Tutorial$initTutorialState = F2(
	function (rand, i) {
		return {
			ao: $elm$core$Dict$empty,
			_: _List_Nil,
			cE: 0,
			ad: $author$project$Game$Tutorial$tutorialMap,
			c6: A2($author$project$Game$Tutorial$tutorialPlayers, rand, i),
			t: A2($author$project$Game$Tutorial$tutorialPowerups, rand, i),
			dl: $elm$core$Maybe$Nothing
		};
	});
var $author$project$Game$State$getPlayer = F2(
	function (i, ps) {
		return A2(
			$elm$core$Maybe$withDefault,
			$author$project$Game$State$PNone,
			A2($elm$core$Array$get, i, ps));
	});
var $author$project$Game$State$getPlayerState = function (p) {
	switch (p.$) {
		case 1:
			var st = p.a;
			var isDead = p.b;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(st, isDead));
		case 0:
			var st = p.b;
			var isDead = p.c;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(st, isDead));
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Game$Tutorial$checkPos = F2(
	function (pos, st) {
		var p = A2($author$project$Game$State$getPlayer, 0, st.c6);
		var _v0 = $author$project$Game$State$getPlayerState(p);
		if (_v0.$ === 1) {
			return true;
		} else {
			var _v1 = _v0.a;
			var pst = _v1.a;
			var isDead = _v1.b;
			return _Utils_eq(pst.V, pos);
		}
	});
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Game$Tutorial$tutorialEnd = F3(
	function (rand, i, st) {
		switch (i) {
			case 1:
				return A2(
					$author$project$Game$Tutorial$checkPos,
					_Utils_Tuple2(5, 9),
					st);
			case 2:
				return A2(
					$author$project$Game$Tutorial$checkPos,
					_Utils_Tuple2(8, 7),
					st);
			case 3:
				return st.cE > 2;
			case 4:
				return A2(
					$author$project$Game$Tutorial$checkPos,
					A2($author$project$Game$Tutorial$getRandPos, rand, 1),
					st);
			case 5:
				return $elm$core$Dict$isEmpty(st.t);
			case 6:
				return $elm$core$Dict$isEmpty(st.t);
			default:
				return true;
		}
	});
var $author$project$Game$Main$initTutorial = function (t) {
	var rand = t.ch;
	return A3(
		$author$project$Game$Main$Tutorial,
		A2($author$project$Game$Tutorial$initTutorialState, rand, t.cg),
		t.ci,
		A2($author$project$Game$Tutorial$tutorialEnd, rand, t.cg));
};
var $author$project$Game$State$PHuman = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Game$State$MoveError = {$: 1};
var $author$project$Game$Bot$DropBomb = 4;
var $author$project$Utils$average2 = F2(
	function (x, y) {
		return (x + y) / 2;
	});
var $author$project$Game$AI$distance = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var y1 = _v0.b;
		var x2 = _v1.a;
		var y2 = _v1.b;
		var dist = F2(
			function (x, y) {
				return (_Utils_cmp(x, y) > 0) ? (x - y) : (y - x);
			});
		return A2(
			$author$project$Utils$average2,
			A2(dist, x1, x2),
			A2(dist, y1, y2));
	});
var $elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3($elm$core$Dict$insert, k, v, d) : d;
				}),
			$elm$core$Dict$empty,
			dict);
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
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $author$project$Game$State$getCell = F2(
	function (_v0, b) {
		var l = _v0.a;
		var c = _v0.b;
		return A2(
			$elm$core$Array$get,
			c,
			A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Array$empty,
				A2($elm$core$Array$get, l, b)));
	});
var $author$project$Game$State$moveDown = function (_v0) {
	var l = _v0.a;
	var c = _v0.b;
	return _Utils_Tuple2(l + 1, c);
};
var $author$project$Game$State$moveLeft = function (_v0) {
	var l = _v0.a;
	var c = _v0.b;
	return _Utils_Tuple2(l, c - 1);
};
var $author$project$Game$State$moveRight = function (_v0) {
	var l = _v0.a;
	var c = _v0.b;
	return _Utils_Tuple2(l, c + 1);
};
var $author$project$Game$State$moveUp = function (_v0) {
	var l = _v0.a;
	var c = _v0.b;
	return _Utils_Tuple2(l - 1, c);
};
var $author$project$Game$AI$possibleMoves = F2(
	function (board, pos) {
		var moves = _List_fromArray(
			[
				_Utils_Tuple2(
				$author$project$Game$State$moveUp(pos),
				$author$project$Game$State$BotMove(0)),
				_Utils_Tuple2(
				$author$project$Game$State$moveDown(pos),
				$author$project$Game$State$BotMove(1)),
				_Utils_Tuple2(
				$author$project$Game$State$moveLeft(pos),
				$author$project$Game$State$BotMove(2)),
				_Utils_Tuple2(
				$author$project$Game$State$moveRight(pos),
				$author$project$Game$State$BotMove(3))
			]);
		var movable = function (_v2) {
			var p = _v2.a;
			var _v0 = A2($author$project$Game$State$getCell, p, board);
			if ((!_v0.$) && (_v0.a === 1)) {
				var _v1 = _v0.a;
				return true;
			} else {
				return false;
			}
		};
		return A2($elm$core$List$filter, movable, moves);
	});
var $author$project$Game$AI$avoidDanger = F3(
	function (board, danger, pst) {
		var pos = pst.V;
		var moves = A2($author$project$Game$AI$possibleMoves, board, pos);
		var bombs = $elm$core$Dict$keys(
			A2(
				$elm$core$Dict$filter,
				F2(
					function (_v5, b) {
						return b;
					}),
				danger));
		var bombsDist = function (p1) {
			return A3(
				$elm$core$List$foldl,
				F2(
					function (p2, i) {
						return A2($author$project$Game$AI$distance, p1, p2) + i;
					}),
				0,
				bombs);
		};
		var movesAwayFromBombs = A2(
			$elm$core$List$sortBy,
			$elm$core$Tuple$first,
			A2(
				$elm$core$List$map,
				function (_v4) {
					var x = _v4.a;
					var y = _v4.b;
					return _Utils_Tuple2(
						-bombsDist(x),
						_Utils_Tuple2(x, y));
				},
				moves));
		var safeMoves = A2(
			$elm$core$List$filter,
			function (_v2) {
				var _v3 = _v2.b;
				var x = _v3.a;
				var y = _v3.b;
				return !A2($elm$core$Dict$member, x, danger);
			},
			movesAwayFromBombs);
		if (safeMoves.b) {
			var x = safeMoves.a;
			var xs = safeMoves.b;
			return x.b.b;
		} else {
			if (!movesAwayFromBombs.b) {
				return $author$project$Game$State$BotMove(4);
			} else {
				var y = movesAwayFromBombs.a;
				var ys = movesAwayFromBombs.b;
				return y.b.b;
			}
		}
	});
var $author$project$Game$State$applyDir = function (dir) {
	switch (dir) {
		case 0:
			return $author$project$Game$State$moveUp;
		case 1:
			return $author$project$Game$State$moveDown;
		case 2:
			return $author$project$Game$State$moveLeft;
		case 3:
			return $author$project$Game$State$moveRight;
		default:
			return $elm$core$Basics$identity;
	}
};
var $author$project$Game$State$isFreeCell = function (c) {
	if (c === 1) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Game$State$moveToFlame = F2(
	function (mv, isEdgeFlame) {
		switch (mv) {
			case 4:
				return 0;
			case 0:
				return isEdgeFlame ? 3 : 1;
			case 1:
				return isEdgeFlame ? 4 : 1;
			case 2:
				return isEdgeFlame ? 5 : 2;
			case 3:
				return isEdgeFlame ? 6 : 2;
			default:
				return 0;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$Game$State$explodeLine = F6(
	function (pid, p, i, board, dir, burns) {
		if (i <= 0) {
			return burns;
		} else {
			var pN = A2($author$project$Game$State$applyDir, dir, p);
			var _v0 = A2($author$project$Game$State$getCell, pN, board);
			if (_v0.$ === 1) {
				return burns;
			} else {
				var cell = _v0.a;
				var upd = function (mb) {
					return $elm$core$Maybe$Just(
						A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								pid,
								A2($author$project$Game$State$moveToFlame, dir, i === 1)),
							A2($elm$core$Maybe$withDefault, _List_Nil, mb)));
				};
				return $author$project$Game$State$isFreeCell(cell) ? A3(
					$elm$core$Dict$update,
					pN,
					upd,
					A6($author$project$Game$State$explodeLine, pid, pN, i - 1, board, dir, burns)) : A3($elm$core$Dict$update, pN, upd, burns);
			}
		}
	});
var $author$project$Game$State$explodePos = F5(
	function (pid, p, i, board, burns) {
		var ups = A5($author$project$Game$State$explodeLine, pid, p, i, board, 0);
		var downs = A5($author$project$Game$State$explodeLine, pid, p, i, board, 1);
		var lefts = A5($author$project$Game$State$explodeLine, pid, p, i, board, 2);
		var rights = A5($author$project$Game$State$explodeLine, pid, p, i, board, 3);
		var upd = function (mb) {
			return $elm$core$Maybe$Just(
				A2(
					$elm$core$List$cons,
					_Utils_Tuple2(
						pid,
						A2($author$project$Game$State$moveToFlame, 4, false)),
					A2($elm$core$Maybe$withDefault, _List_Nil, mb)));
		};
		return ups(
			downs(
				lefts(
					rights(
						A3($elm$core$Dict$update, p, upd, burns)))));
	});
var $author$project$Game$AI$bombExplodes = F3(
	function (board, pid, _v0) {
		var pos = _v0.a;
		var b = _v0.b;
		return A2(
			$elm$core$Dict$map,
			F2(
				function (p, flames) {
					return $elm$core$List$length(
						A2(
							$elm$core$List$filter,
							function (_v1) {
								var x = _v1.a;
								var y = _v1.b;
								return !y;
							},
							flames)) > 0;
				}),
			A5($author$project$Game$State$explodePos, pid, pos, b.dI, board, $elm$core$Dict$empty));
	});
var $author$project$Utils$unionDict = F3(
	function (merge, xs, ys) {
		var upd = F2(
			function (x, mb) {
				if (mb.$ === 1) {
					return $elm$core$Maybe$Just(x);
				} else {
					var y = mb.a;
					return $elm$core$Maybe$Just(
						A2(merge, x, y));
				}
			});
		var ins = F3(
			function (k, v, zs) {
				return A3(
					$elm$core$Dict$update,
					k,
					upd(v),
					zs);
			});
		return A3($elm$core$Dict$foldl, ins, ys, xs);
	});
var $author$project$Utils$concatDicts = F2(
	function (merge, xs) {
		return A3(
			$elm$core$List$foldl,
			$author$project$Utils$unionDict(merge),
			$elm$core$Dict$empty,
			xs);
	});
var $author$project$Game$AI$playerBombsPositions = F3(
	function (board, _v0, s) {
		var pid = _v0.a;
		var p = _v0.b;
		switch (p.$) {
			case 2:
				return s;
			case 0:
				var pst = p.b;
				return A3(
					$author$project$Utils$unionDict,
					$elm$core$Basics$or,
					s,
					A2(
						$author$project$Utils$concatDicts,
						$elm$core$Basics$or,
						A2(
							$elm$core$List$map,
							A2($author$project$Game$AI$bombExplodes, board, pid),
							$elm$core$Dict$toList(pst.c3))));
			default:
				var pst = p.a;
				return A3(
					$author$project$Utils$unionDict,
					$elm$core$Basics$or,
					s,
					A2(
						$author$project$Utils$concatDicts,
						$elm$core$Basics$or,
						A2(
							$elm$core$List$map,
							A2($author$project$Game$AI$bombExplodes, board, pid),
							$elm$core$Dict$toList(pst.c3))));
		}
	});
var $author$project$Game$AI$bombPositions = function (st) {
	return A3(
		$elm$core$List$foldl,
		$author$project$Game$AI$playerBombsPositions(st.ad.Z),
		$elm$core$Dict$empty,
		$elm$core$Array$toIndexedList(st.c6));
};
var $author$project$Game$AI$getBotPlayer = F2(
	function (pid, st) {
		var _v0 = A2($elm$core$Array$get, pid, st.c6);
		if (_v0.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var p = _v0.a;
			switch (p.$) {
				case 2:
					return $elm$core$Maybe$Nothing;
				case 1:
					var pst = p.a;
					return $elm$core$Maybe$Just(pst);
				default:
					var pst = p.b;
					return $elm$core$Maybe$Just(pst);
			}
		}
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $author$project$Game$AI$corners = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(1, 1),
			_Utils_Tuple2(1, 9),
			_Utils_Tuple2(9, 1),
			_Utils_Tuple2(9, 9)
		]));
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$random$Random$addOne = function (value) {
	return _Utils_Tuple2(1, value);
};
var $elm$random$Random$float = F2(
	function (a, b) {
		return function (seed0) {
			var seed1 = $elm$random$Random$next(seed0);
			var range = $elm$core$Basics$abs(b - a);
			var n1 = $elm$random$Random$peel(seed1);
			var n0 = $elm$random$Random$peel(seed0);
			var lo = (134217727 & n1) * 1.0;
			var hi = (67108863 & n0) * 1.0;
			var val = ((hi * 134217728.0) + lo) / 9007199254740992.0;
			var scaled = (val * range) + a;
			return _Utils_Tuple2(
				scaled,
				$elm$random$Random$next(seed1));
		};
	});
var $elm$random$Random$getByWeight = F3(
	function (_v0, others, countdown) {
		getByWeight:
		while (true) {
			var weight = _v0.a;
			var value = _v0.b;
			if (!others.b) {
				return value;
			} else {
				var second = others.a;
				var otherOthers = others.b;
				if (_Utils_cmp(
					countdown,
					$elm$core$Basics$abs(weight)) < 1) {
					return value;
				} else {
					var $temp$_v0 = second,
						$temp$others = otherOthers,
						$temp$countdown = countdown - $elm$core$Basics$abs(weight);
					_v0 = $temp$_v0;
					others = $temp$others;
					countdown = $temp$countdown;
					continue getByWeight;
				}
			}
		}
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$random$Random$weighted = F2(
	function (first, others) {
		var normalize = function (_v0) {
			var weight = _v0.a;
			return $elm$core$Basics$abs(weight);
		};
		var total = normalize(first) + $elm$core$List$sum(
			A2($elm$core$List$map, normalize, others));
		return A2(
			$elm$random$Random$map,
			A2($elm$random$Random$getByWeight, first, others),
			A2($elm$random$Random$float, 0, total));
	});
var $elm$random$Random$uniform = F2(
	function (value, valueList) {
		return A2(
			$elm$random$Random$weighted,
			$elm$random$Random$addOne(value),
			A2($elm$core$List$map, $elm$random$Random$addOne, valueList));
	});
var $author$project$Game$AI$randomBot = F4(
	function (pos, seed, pid, st) {
		var bomb = A2($elm$core$Set$member, pos, $author$project$Game$AI$corners) ? _List_Nil : _List_fromArray(
			[
				$author$project$Game$State$BotMove(4)
			]);
		var gen = A2(
			$elm$random$Random$uniform,
			$author$project$Game$State$BotMove(0),
			_Utils_ap(
				bomb,
				_List_fromArray(
					[
						$author$project$Game$State$BotMove(1),
						$author$project$Game$State$BotMove(2),
						$author$project$Game$State$BotMove(3)
					])));
		var _v0 = A2($elm$random$Random$step, gen, seed);
		var mv = _v0.a;
		var seed1 = _v0.b;
		return _Utils_Tuple2(seed1, mv);
	});
var $author$project$Game$AI$easyBot = F3(
	function (seed, pid, st) {
		var _v0 = A2($author$project$Game$AI$getBotPlayer, pid, st);
		if (_v0.$ === 1) {
			return _Utils_Tuple2(seed, $author$project$Game$State$MoveError);
		} else {
			var pst = _v0.a;
			var danger = $author$project$Game$AI$bombPositions(st);
			return A2($elm$core$Dict$member, pst.V, danger) ? _Utils_Tuple2(
				seed,
				A3($author$project$Game$AI$avoidDanger, st.ad.Z, danger, pst)) : A4($author$project$Game$AI$randomBot, pst.V, seed, pid, st);
		}
	});
var $author$project$Game$AI$allPlays = A2($elm$core$List$range, 0, 5);
var $author$project$Game$State$intToMove = function (i) {
	switch (i) {
		case 0:
			return $author$project$Game$State$BotMove(4);
		case 1:
			return $author$project$Game$State$BotMove(0);
		case 2:
			return $author$project$Game$State$BotMove(1);
		case 3:
			return $author$project$Game$State$BotMove(2);
		case 4:
			return $author$project$Game$State$BotMove(3);
		case 5:
			return $author$project$Game$State$BotMove(5);
		default:
			return $author$project$Game$State$MoveError;
	}
};
var $author$project$Game$AI$comparePlay = F2(
	function (x, y) {
		if (_Utils_eq(x, y)) {
			return 1;
		} else {
			var _v0 = _Utils_Tuple2(
				$author$project$Game$State$intToMove(x),
				$author$project$Game$State$intToMove(y));
			_v0$0:
			while (true) {
				_v0$2:
				while (true) {
					if (_v0.a.$ === 1) {
						var _v2 = _v0.a;
						return 2;
					} else {
						if (_v0.b.$ === 1) {
							switch (_v0.a.a) {
								case 4:
									break _v0$0;
								case 5:
									break _v0$2;
								default:
									break _v0$2;
							}
						} else {
							switch (_v0.a.a) {
								case 4:
									break _v0$0;
								case 5:
									var _v4 = _v0.a.a;
									return 2;
								default:
									if (_v0.b.a === 5) {
										var _v5 = _v0.b.a;
										return 0;
									} else {
										return A2($elm$core$Basics$compare, x, y);
									}
							}
						}
					}
				}
				var _v3 = _v0.b;
				return 0;
			}
			var _v1 = _v0.a.a;
			return 0;
		}
	});
var $author$project$Game$AI$mappendOrder = F2(
	function (x, y) {
		switch (x) {
			case 0:
				return 0;
			case 1:
				return y;
			default:
				return 2;
		}
	});
var $author$project$Game$AI$memptyOrder = 1;
var $author$project$Game$AI$mconcatOrder = A2($elm$core$List$foldr, $author$project$Game$AI$mappendOrder, $author$project$Game$AI$memptyOrder);
var $author$project$Game$AI$comparemaxmin = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var x2 = _v0.b;
		var y1 = _v1.a;
		var y2 = _v1.b;
		return $author$project$Game$AI$mconcatOrder(
			_List_fromArray(
				[
					A2($elm$core$Basics$compare, y1, x1),
					A2($elm$core$Basics$compare, x2, y2)
				]));
	});
var $author$project$Game$AI$compareScore = F2(
	function (s1, s2) {
		return $author$project$Game$AI$mconcatOrder(
			_List_fromArray(
				[
					A2($elm$core$Basics$compare, s1.F, s2.F),
					A2($author$project$Game$AI$comparemaxmin, s1.G, s2.G),
					A2($elm$core$Basics$compare, s1.D, s2.D),
					A2($elm$core$Basics$compare, s1.E, s2.E)
				]));
	});
var $author$project$Game$AI$PlayLeaf = {$: 1};
var $author$project$Game$AI$PlayNode = function (a) {
	return {$: 0, a: a};
};
var $author$project$Game$State$killPlayer = F2(
	function (pos, p) {
		switch (p.$) {
			case 2:
				return $author$project$Game$State$PNone;
			case 0:
				var b = p.a;
				var pst = p.b;
				var isDead = p.c;
				return A3(
					$author$project$Game$State$PBot,
					b,
					pst,
					isDead || _Utils_eq(pst.V, pos));
			default:
				var pst = p.a;
				var isDead = p.b;
				return A2(
					$author$project$Game$State$PHuman,
					pst,
					isDead || _Utils_eq(pst.V, pos));
		}
	});
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (!node.$) {
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
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
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
var $author$project$Game$State$setCell = F3(
	function (_v0, x, b) {
		var l = _v0.a;
		var c = _v0.b;
		var _v1 = A2($elm$core$Array$get, l, b);
		if (_v1.$ === 1) {
			return b;
		} else {
			var ys = _v1.a;
			var _v2 = A2($elm$core$Array$get, c, ys);
			if (_v2.$ === 1) {
				return b;
			} else {
				var y = _v2.a;
				return A3(
					$elm$core$Array$set,
					l,
					A3($elm$core$Array$set, c, x, ys),
					b);
			}
		}
	});
var $author$project$Game$State$advanceCaracol = function (st) {
	var _v0 = st._;
	if (!_v0.b) {
		return st;
	} else {
		if (_v0.a.$ === 1) {
			var _v1 = _v0.a;
			var xs = _v0.b;
			return _Utils_update(
				st,
				{_: xs});
		} else {
			var x = _v0.a.a;
			var xs = _v0.b;
			var powerupsN = A2($elm$core$Dict$remove, x, st.t);
			var playersN = A2(
				$elm$core$Array$map,
				$author$project$Game$State$killPlayer(x),
				st.c6);
			var boardN = A3($author$project$Game$State$setCell, x, 0, st.ad.Z);
			return _Utils_update(
				st,
				{
					_: xs,
					ad: {Z: boardN, Q: st.ad.Q},
					c6: playersN,
					t: powerupsN
				});
		}
	}
};
var $author$project$Game$State$isAlive = function (p) {
	var _v0 = $author$project$Game$State$getPlayerState(p);
	if (_v0.$ === 1) {
		return false;
	} else {
		var _v1 = _v0.a;
		var isDead = _v1.b;
		return !isDead;
	}
};
var $author$project$Game$State$alivePlayers = function (st) {
	return A2(
		$elm$core$List$filter,
		A2($elm$core$Basics$composeL, $author$project$Game$State$isAlive, $elm$core$Tuple$second),
		$elm$core$Array$toIndexedList(st.c6));
};
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
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
var $author$project$Game$State$lineBoxes = A2(
	$elm$core$Array$foldl,
	F2(
		function (c, i) {
			return (c === 2) ? (i + 1) : i;
		}),
	0);
var $author$project$Game$State$boardBoxes = A2(
	$elm$core$Array$foldl,
	F2(
		function (l, i) {
			return $author$project$Game$State$lineBoxes(l) + i;
		}),
	0);
var $author$project$Utils$catMaybes = $elm$core$List$filterMap($elm$core$Basics$identity);
var $author$project$Game$AI$center = _Utils_Tuple2(5, 5);
var $author$project$Game$State$Draw = {$: 1};
var $author$project$Game$State$Running = {$: 0};
var $author$project$Game$State$Win = function (a) {
	return {$: 2, a: a};
};
var $author$project$Game$State$gameState = function (st) {
	var _v0 = $author$project$Game$State$alivePlayers(st);
	if (!_v0.b) {
		return $author$project$Game$State$Draw;
	} else {
		if (!_v0.b.b) {
			var _v1 = _v0.a;
			var pid = _v1.a;
			var p = _v1.b;
			return $author$project$Game$State$Win(pid);
		} else {
			return $author$project$Game$State$Running;
		}
	}
};
var $author$project$Game$State$checkGameEnd = function (st) {
	var _v0 = $author$project$Game$State$gameState(st);
	if (!_v0.$) {
		return false;
	} else {
		return true;
	}
};
var $author$project$Game$State$setPlayerState = F2(
	function (pst, p) {
		switch (p.$) {
			case 2:
				return $author$project$Game$State$PNone;
			case 1:
				var isDead = p.b;
				return A2($author$project$Game$State$PHuman, pst, isDead);
			default:
				var b = p.a;
				var isDead = p.c;
				return A3($author$project$Game$State$PBot, b, pst, isDead);
		}
	});
var $author$project$Game$State$cleanLastMove = F2(
	function (pid, st) {
		var p = A2($author$project$Game$State$getPlayer, pid, st.c6);
		var _v0 = $author$project$Game$State$getPlayerState(p);
		if (_v0.$ === 1) {
			return st;
		} else {
			var _v1 = _v0.a;
			var pst = _v1.a;
			var isDead = _v1.b;
			var pstN = _Utils_update(
				pst,
				{el: $elm$core$Maybe$Nothing});
			var pN = A2($author$project$Game$State$setPlayerState, pstN, p);
			return _Utils_update(
				st,
				{
					c6: A3($elm$core$Array$set, pid, pN, st.c6)
				});
		}
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
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
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $author$project$Game$State$dropBomb = F4(
	function (maxtimer, maxflames, pid, st) {
		var p = A2($author$project$Game$State$getPlayer, pid, st.c6);
		var _v0 = $author$project$Game$State$getPlayerState(p);
		if (!_v0.$) {
			if (!_v0.a.b) {
				var _v1 = _v0.a;
				var pst = _v1.a;
				var pos = pst.V;
				var bs = pst.c3;
				if ((_Utils_cmp(
					$elm$core$Dict$size(pst.c3),
					pst.ej) > -1) || A2($elm$core$Dict$member, pos, bs)) {
					var pstN = _Utils_update(
						pst,
						{
							el: $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$author$project$Game$State$BotMove(4),
									true))
						});
					var pN = A2($author$project$Game$State$setPlayerState, pstN, p);
					return _Utils_update(
						st,
						{
							c6: A3($elm$core$Array$set, pid, pN, st.c6)
						});
				} else {
					var radius = A2(
						$elm$core$Maybe$withDefault,
						pst.ek,
						A2(
							$elm$core$Maybe$map,
							$elm$core$Basics$min(pst.ek),
							maxflames));
					var bombN = {
						dH: pid,
						dI: radius,
						dJ: A2($elm$core$Maybe$withDefault, 10, maxtimer)
					};
					var pstN = _Utils_update(
						pst,
						{
							el: $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$author$project$Game$State$BotMove(4),
									false)),
							c3: A3($elm$core$Dict$insert, pos, bombN, bs)
						});
					var pN = A2($author$project$Game$State$setPlayerState, pstN, p);
					return _Utils_update(
						st,
						{
							c6: A3($elm$core$Array$set, pid, pN, st.c6)
						});
				}
			} else {
				var _v2 = _v0.a;
				var pst = _v2.a;
				return A2($author$project$Game$State$cleanLastMove, pid, st);
			}
		} else {
			return st;
		}
	});
var $author$project$Game$State$errorLastMove = F2(
	function (pid, st) {
		var p = A2($author$project$Game$State$getPlayer, pid, st.c6);
		var _v0 = $author$project$Game$State$getPlayerState(p);
		if (_v0.$ === 1) {
			return st;
		} else {
			var _v1 = _v0.a;
			var pst = _v1.a;
			var isDead = _v1.b;
			var pstN = _Utils_update(
				pst,
				{
					el: $elm$core$Maybe$Just(
						_Utils_Tuple2($author$project$Game$State$MoveError, true))
				});
			var pN = A2($author$project$Game$State$setPlayerState, pstN, p);
			return _Utils_update(
				st,
				{
					c6: A3($elm$core$Array$set, pid, pN, st.c6)
				});
		}
	});
var $author$project$Game$State$isFreePos = F2(
	function (pos, board) {
		return $author$project$Game$State$isFreeCell(
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($author$project$Game$State$getCell, pos, board)));
	});
var $author$project$Game$State$pickPowerup = F2(
	function (pos, _v0) {
		var pst = _v0.a;
		var pws = _v0.b;
		var _v1 = A2($elm$core$Dict$get, pos, pws);
		if (_v1.$ === 1) {
			return _Utils_Tuple2(pst, pws);
		} else {
			var pw = _v1.a;
			var pstN = function () {
				if (!pw) {
					return _Utils_update(
						pst,
						{ej: pst.ej + 1});
				} else {
					return _Utils_update(
						pst,
						{ek: pst.ek + 1});
				}
			}();
			return _Utils_Tuple2(
				pstN,
				A2($elm$core$Dict$remove, pos, pws));
		}
	});
var $author$project$Game$State$move = F4(
	function (mv, f, pid, st) {
		var p = A2($author$project$Game$State$getPlayer, pid, st.c6);
		var _v0 = $author$project$Game$State$getPlayerState(p);
		if (!_v0.$) {
			if (!_v0.a.b) {
				var _v1 = _v0.a;
				var pst = _v1.a;
				var pos = pst.V;
				var posN = f(pos);
				if (!A2($author$project$Game$State$isFreePos, posN, st.ad.Z)) {
					var pstN = _Utils_update(
						pst,
						{
							el: $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$author$project$Game$State$BotMove(mv),
									true))
						});
					var pN = A2($author$project$Game$State$setPlayerState, pstN, p);
					return _Utils_update(
						st,
						{
							c6: A3($elm$core$Array$set, pid, pN, st.c6)
						});
				} else {
					var pstN = _Utils_update(
						pst,
						{
							el: $elm$core$Maybe$Just(
								_Utils_Tuple2(
									$author$project$Game$State$BotMove(mv),
									false)),
							V: posN
						});
					var _v2 = A2(
						$author$project$Game$State$pickPowerup,
						posN,
						_Utils_Tuple2(pstN, st.t));
					var pstNN = _v2.a;
					var powerupsN = _v2.b;
					var pN = A2($author$project$Game$State$setPlayerState, pstNN, p);
					return _Utils_update(
						st,
						{
							c6: A3($elm$core$Array$set, pid, pN, st.c6),
							t: powerupsN
						});
				}
			} else {
				var _v3 = _v0.a;
				var pst = _v3.a;
				return A2($author$project$Game$State$cleanLastMove, pid, st);
			}
		} else {
			return st;
		}
	});
var $author$project$Game$State$makeMove = F5(
	function (checkEnd, maxtimer, maxflames, _v0, st) {
		var pid = _v0.a;
		var mv = _v0.b;
		if (checkEnd(st)) {
			return st;
		} else {
			if (!mv.$) {
				if (mv.a === 4) {
					var _v2 = mv.a;
					return A4($author$project$Game$State$dropBomb, maxtimer, maxflames, pid, st);
				} else {
					var bmv = mv.a;
					return A4(
						$author$project$Game$State$move,
						bmv,
						$author$project$Game$State$applyDir(bmv),
						pid,
						st);
				}
			} else {
				return A2($author$project$Game$State$errorLastMove, pid, st);
			}
		}
	});
var $author$project$Game$State$makeMoveMaybe = F5(
	function (checkEnd, maxtimer, maxflames, _v0, st) {
		var pid = _v0.a;
		var mv = _v0.b;
		var stN = A5(
			$author$project$Game$State$makeMove,
			checkEnd,
			maxtimer,
			maxflames,
			_Utils_Tuple2(pid, mv),
			st);
		var _v1 = A2($elm$core$Array$get, pid, stN.c6);
		if (_v1.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var player = _v1.a;
			var _v2 = $author$project$Game$State$getPlayerState(player);
			if (_v2.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				if (_v2.a.b) {
					var _v3 = _v2.a;
					var pstN = _v3.a;
					return $elm$core$Maybe$Nothing;
				} else {
					var _v4 = _v2.a;
					var pstN = _v4.a;
					var _v5 = pstN.el;
					if ((!_v5.$) && (!_v5.a.b)) {
						var _v6 = _v5.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(pstN, stN));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}
			}
		}
	});
var $author$project$Game$State$burnPos = F3(
	function (pos, xs, b) {
		var _v0 = A2($author$project$Game$State$getCell, pos, b);
		if ((!_v0.$) && (_v0.a === 2)) {
			var _v1 = _v0.a;
			return A3($author$project$Game$State$setCell, pos, 1, b);
		} else {
			return b;
		}
	});
var $author$project$Game$State$burnBoard = F2(
	function (burns, b) {
		return A3($elm$core$Dict$foldl, $author$project$Game$State$burnPos, b, burns);
	});
var $author$project$Game$State$burnPlayer = F2(
	function (burns, p) {
		var killBomb = F2(
			function (k, b) {
				return A2($elm$core$Dict$member, k, burns) ? _Utils_update(
					b,
					{dJ: 0}) : b;
			});
		var killSt = function (pst) {
			return _Utils_update(
				pst,
				{
					c3: A2($elm$core$Dict$map, killBomb, pst.c3)
				});
		};
		var kill = F2(
			function (pos, b) {
				return b || A2($elm$core$Dict$member, pos, burns);
			});
		switch (p.$) {
			case 2:
				return $author$project$Game$State$PNone;
			case 1:
				var pst = p.a;
				var isDead = p.b;
				return A2(
					$author$project$Game$State$PHuman,
					killSt(pst),
					A2(kill, pst.V, isDead));
			default:
				var bot = p.a;
				var pst = p.b;
				var isDead = p.c;
				return A3(
					$author$project$Game$State$PBot,
					bot,
					killSt(pst),
					A2(kill, pst.V, isDead));
		}
	});
var $elm$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2($elm$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});
var $author$project$Game$State$burnPowerups = F2(
	function (burns, d) {
		return A2($elm$core$Dict$diff, d, burns);
	});
var $author$project$Game$State$burnState = F2(
	function (burns, st) {
		var playersN = A2(
			$elm$core$Array$map,
			$author$project$Game$State$burnPlayer(burns),
			st.c6);
		var mapN = {
			Z: A2($author$project$Game$State$burnBoard, burns, st.ad.Z),
			Q: st.ad.Q
		};
		var burnsE = A2(
			$elm$core$Dict$filter,
			F2(
				function (pos, _v0) {
					return _Utils_eq(
						A2($author$project$Game$State$getCell, pos, st.ad.Z),
						$elm$core$Maybe$Just(1));
				}),
			burns);
		var powerupsN = A2($author$project$Game$State$burnPowerups, burnsE, st.t);
		return _Utils_update(
			st,
			{ad: mapN, c6: playersN, t: powerupsN});
	});
var $author$project$Game$State$tickBomb = F5(
	function (board, pid, pos, b, _v0) {
		var d = _v0.a;
		var burned = _v0.b;
		return ((b.dJ - 1) >= 0) ? _Utils_Tuple2(
			A3(
				$elm$core$Dict$insert,
				pos,
				_Utils_update(
					b,
					{dJ: b.dJ - 1}),
				d),
			burned) : _Utils_Tuple2(
			d,
			A5($author$project$Game$State$explodePos, pid, pos, b.dI, board, burned));
	});
var $author$project$Game$State$tickPlayerBombs = F2(
	function (board, _v0) {
		var pid = _v0.a;
		var p = _v0.b;
		var _v1 = $author$project$Game$State$getPlayerState(p);
		if (_v1.$ === 1) {
			return _Utils_Tuple2(p, $elm$core$Dict$empty);
		} else {
			var _v2 = _v1.a;
			var pst = _v2.a;
			var isDead = _v2.b;
			var _v3 = A3(
				$elm$core$Dict$foldl,
				A2($author$project$Game$State$tickBomb, board, pid),
				_Utils_Tuple2($elm$core$Dict$empty, $elm$core$Dict$empty),
				pst.c3);
			var bsN = _v3.a;
			var burned = _v3.b;
			return _Utils_Tuple2(
				A2(
					$author$project$Game$State$setPlayerState,
					_Utils_update(
						pst,
						{c3: bsN}),
					p),
				burned);
		}
	});
var $elm$core$List$unzip = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var x = _v0.a;
			var y = _v0.b;
			var xs = _v1.a;
			var ys = _v1.b;
			return _Utils_Tuple2(
				A2($elm$core$List$cons, x, xs),
				A2($elm$core$List$cons, y, ys));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple2(_List_Nil, _List_Nil),
		pairs);
};
var $author$project$Game$State$tickBombs = function (st) {
	var board = st.ad.Z;
	var _v0 = $elm$core$List$unzip(
		A2(
			$elm$core$List$map,
			$author$project$Game$State$tickPlayerBombs(board),
			$elm$core$Array$toIndexedList(st.c6)));
	var psN = _v0.a;
	var burns = _v0.b;
	var burn = A2($author$project$Utils$concatDicts, $elm$core$Basics$append, burns);
	return A2(
		$author$project$Game$State$burnState,
		burn,
		_Utils_update(
			st,
			{
				ao: burn,
				c6: $elm$core$Array$fromList(psN)
			}));
};
var $author$project$Game$State$tickState = function (st) {
	return _Utils_update(
		st,
		{cE: st.cE + 1});
};
var $author$project$Game$AI$computePlay = F5(
	function (it, depth, st, player, play) {
		var _v0 = A5(
			$author$project$Game$State$makeMoveMaybe,
			$author$project$Game$State$checkGameEnd,
			$elm$core$Maybe$Just(
				A2($elm$core$Basics$min, 3, depth - it)),
			$elm$core$Maybe$Just(2),
			_Utils_Tuple2(
				player,
				$author$project$Game$State$intToMove(play)),
			st);
		if (_v0.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v1 = _v0.a;
			var pstN = _v1.a;
			var stN = _v1.b;
			var stNN = $author$project$Game$State$tickState(
				$author$project$Game$State$tickBombs(
					$author$project$Game$State$advanceCaracol(stN)));
			var tree = A4($author$project$Game$AI$computePlaysAux, it + 1, depth, stNN, player);
			var powas = pstN.ej + pstN.ek;
			var ops = $elm$core$List$length(
				$author$project$Game$State$alivePlayers(stN)) - 1;
			var dist = A2($author$project$Game$AI$distance, $author$project$Game$AI$center, pstN.V);
			var bricks = $author$project$Game$State$boardBoxes(stN.ad.Z);
			var score = {
				D: _Utils_Tuple2(bricks, it),
				E: _Utils_Tuple2(dist, it),
				F: _Utils_Tuple2(ops, it),
				G: _Utils_Tuple2(powas, it)
			};
			if (!tree.$) {
				var xs = tree.a;
				return $elm$core$Dict$isEmpty(xs) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
					_Utils_Tuple2(
						play,
						_Utils_Tuple2(
							score,
							$author$project$Game$AI$PlayNode(xs))));
			} else {
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(
						play,
						_Utils_Tuple2(score, $author$project$Game$AI$PlayLeaf)));
			}
		}
	});
var $author$project$Game$AI$computePlaysAux = F4(
	function (it, depth, st, player) {
		return (_Utils_cmp(it, depth) > 0) ? $author$project$Game$AI$PlayLeaf : $author$project$Game$AI$PlayNode(
			$elm$core$Dict$fromList(
				$author$project$Utils$catMaybes(
					A2(
						$elm$core$List$map,
						A4($author$project$Game$AI$computePlay, it, depth, st, player),
						$author$project$Game$AI$allPlays))));
	});
var $author$project$Game$AI$computePlays = F2(
	function (st, player) {
		return A4($author$project$Game$AI$computePlaysAux, 1, 5, st, player);
	});
var $author$project$Game$AI$maxmin = F2(
	function (_v0, _v1) {
		var x1 = _v0.a;
		var x2 = _v0.b;
		var y1 = _v1.a;
		var y2 = _v1.b;
		return _Utils_eq(x1, y1) ? _Utils_Tuple2(
			x1,
			A2($elm$core$Basics$min, x2, y2)) : ((_Utils_cmp(x1, y1) > 0) ? _Utils_Tuple2(x1, x2) : _Utils_Tuple2(y1, y2));
	});
var $author$project$Game$AI$mappendScore = F2(
	function (s1, s2) {
		return {
			D: A2($elm$core$Basics$min, s1.D, s2.D),
			E: A2($elm$core$Basics$min, s1.E, s2.E),
			F: A2($elm$core$Basics$min, s1.F, s2.F),
			G: A2($author$project$Game$AI$maxmin, s1.G, s2.G)
		};
	});
var $author$project$Game$AI$memptyScore = {
	D: _Utils_Tuple2(1000, 1000),
	E: _Utils_Tuple2(1000, 1000),
	F: _Utils_Tuple2(3, 1000),
	G: _Utils_Tuple2(0, 1000)
};
var $author$project$Game$AI$mconcatScore = A2($elm$core$List$foldl, $author$project$Game$AI$mappendScore, $author$project$Game$AI$memptyScore);
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $author$project$Game$AI$scorePlay = function (_v2) {
	var score = _v2.a;
	var t = _v2.b;
	return A2(
		$author$project$Game$AI$mappendScore,
		score,
		$author$project$Game$AI$mconcatScore(
			$elm$core$Dict$values(
				$author$project$Game$AI$scorePlays(t))));
};
var $author$project$Game$AI$scorePlays = function (t) {
	if (!t.$) {
		var xs = t.a;
		return A2(
			$elm$core$Dict$map,
			function (_v1) {
				return $author$project$Game$AI$scorePlay;
			},
			xs);
	} else {
		return $elm$core$Dict$empty;
	}
};
var $elm$core$List$sortWith = _List_sortWith;
var $author$project$Game$AI$hardBot = F3(
	function (seed, player, st) {
		var plays = A2($author$project$Game$AI$computePlays, st, player);
		var scores = $author$project$Game$AI$scorePlays(plays);
		var best = F2(
			function (_v4, _v5) {
				var x1 = _v4.a;
				var s1 = _v4.b;
				var x2 = _v5.a;
				var s2 = _v5.b;
				return $author$project$Game$AI$mconcatOrder(
					_List_fromArray(
						[
							A2($author$project$Game$AI$compareScore, s1, s2),
							A2($author$project$Game$AI$comparePlay, x1, x2)
						]));
			});
		var _v0 = $elm$core$Dict$toList(scores);
		if (!_v0.b) {
			var _v1 = A2(
				$author$project$Utils$nth,
				$author$project$Game$AI$allPlays,
				A2($elm$core$Basics$modBy, 6, st.cE));
			if (_v1.$ === 1) {
				return _Utils_Tuple2(
					seed,
					$author$project$Game$State$BotMove(5));
			} else {
				var mv = _v1.a;
				return _Utils_Tuple2(
					seed,
					$author$project$Game$State$intToMove(mv));
			}
		} else {
			var xs = _v0;
			var _v2 = A2($elm$core$List$sortWith, best, xs);
			if (!_v2.b) {
				var _v3 = A2(
					$author$project$Utils$nth,
					$author$project$Game$AI$allPlays,
					A2($elm$core$Basics$modBy, 6, st.cE));
				if (_v3.$ === 1) {
					return _Utils_Tuple2(
						seed,
						$author$project$Game$State$BotMove(5));
				} else {
					var mv = _v3.a;
					return _Utils_Tuple2(
						seed,
						$author$project$Game$State$intToMove(mv));
				}
			} else {
				var s = _v2.a;
				var ss = _v2.b;
				return _Utils_Tuple2(
					seed,
					$author$project$Game$State$intToMove(s.a));
			}
		}
	});
var $author$project$Game$AI$moveToCenter = F3(
	function (board, danger, pst) {
		var pos = pst.V;
		var moves = _List_fromArray(
			[
				_Utils_Tuple2(
				$author$project$Game$State$moveUp(pos),
				$author$project$Game$State$BotMove(0)),
				_Utils_Tuple2(
				$author$project$Game$State$moveDown(pos),
				$author$project$Game$State$BotMove(1)),
				_Utils_Tuple2(
				$author$project$Game$State$moveLeft(pos),
				$author$project$Game$State$BotMove(2)),
				_Utils_Tuple2(
				$author$project$Game$State$moveRight(pos),
				$author$project$Game$State$BotMove(3))
			]);
		var safeMoves = A2(
			$elm$core$List$filter,
			function (_v5) {
				var x = _v5.a;
				var y = _v5.b;
				return !A2($elm$core$Dict$member, x, danger);
			},
			moves);
		var movable = function (_v4) {
			var p = _v4.a;
			var mv = _v4.b;
			var _v1 = A2($author$project$Game$State$getCell, p, board);
			_v1$2:
			while (true) {
				if (!_v1.$) {
					switch (_v1.a) {
						case 1:
							var _v2 = _v1.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									A2($author$project$Game$AI$distance, $author$project$Game$AI$center, p),
									mv));
						case 2:
							var _v3 = _v1.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									A2($author$project$Game$AI$distance, $author$project$Game$AI$center, p),
									$author$project$Game$State$BotMove(4)));
						default:
							break _v1$2;
					}
				} else {
					break _v1$2;
				}
			}
			return $elm$core$Maybe$Nothing;
		};
		var centerMoves = A2(
			$elm$core$List$sortBy,
			$elm$core$Tuple$first,
			A2($elm$core$List$filterMap, movable, safeMoves));
		if (!centerMoves.b) {
			return $author$project$Game$State$BotMove(4);
		} else {
			var y = centerMoves.a;
			var ys = centerMoves.b;
			return y.b;
		}
	});
var $author$project$Game$AI$mediumBot = F3(
	function (seed, pid, st) {
		var _v0 = A2($author$project$Game$AI$getBotPlayer, pid, st);
		if (_v0.$ === 1) {
			return _Utils_Tuple2(seed, $author$project$Game$State$MoveError);
		} else {
			var pst = _v0.a;
			var danger = $author$project$Game$AI$bombPositions(st);
			return A2($elm$core$Dict$member, pst.V, danger) ? _Utils_Tuple2(
				seed,
				A3($author$project$Game$AI$avoidDanger, st.ad.Z, danger, pst)) : _Utils_Tuple2(
				seed,
				A3($author$project$Game$AI$moveToCenter, st.ad.Z, danger, pst));
		}
	});
var $author$project$Game$State$newPlayerPos = F2(
	function (n, i) {
		switch (i) {
			case 0:
				return _Utils_Tuple2(1, 1);
			case 1:
				return _Utils_Tuple2(1, n - 2);
			case 2:
				return _Utils_Tuple2(n - 2, 1);
			case 3:
				return _Utils_Tuple2(n - 2, n - 2);
			default:
				return _Utils_Tuple2(0, 0);
		}
	});
var $author$project$Game$State$newPlayerState = F3(
	function (n, i, pd) {
		return {
			ej: 1,
			bP: pd,
			ek: 1,
			el: $elm$core$Maybe$Nothing,
			c3: $elm$core$Dict$empty,
			V: A2($author$project$Game$State$newPlayerPos, n, i)
		};
	});
var $author$project$Game$Main$parseFlagsPlayer = F2(
	function (i, type_) {
		switch (type_) {
			case 'human':
				return A2(
					$author$project$Game$State$PHuman,
					A3(
						$author$project$Game$State$newPlayerState,
						$author$project$Game$State$mapsize,
						i,
						{c2: 0, em: 'Human'}),
					false);
			case 'easy':
				return A3(
					$author$project$Game$State$PBot,
					$author$project$Game$AI$easyBot,
					A3(
						$author$project$Game$State$newPlayerState,
						$author$project$Game$State$mapsize,
						i,
						{c2: 0, em: 'Bot (Easy)'}),
					false);
			case 'medium':
				return A3(
					$author$project$Game$State$PBot,
					$author$project$Game$AI$mediumBot,
					A3(
						$author$project$Game$State$newPlayerState,
						$author$project$Game$State$mapsize,
						i,
						{c2: 0, em: 'Bot (Medium)'}),
					false);
			case 'hard':
				return A3(
					$author$project$Game$State$PBot,
					$author$project$Game$AI$hardBot,
					A3(
						$author$project$Game$State$newPlayerState,
						$author$project$Game$State$mapsize,
						i,
						{c2: 0, em: 'Bot (Hard)'}),
					false);
			default:
				return $author$project$Game$State$PNone;
		}
	});
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
var $author$project$Game$Main$parseGameFlags = function (flags) {
	return A2(
		$elm$core$List$take,
		4,
		_Utils_ap(
			A2($elm$core$List$indexedMap, $author$project$Game$Main$parseFlagsPlayer, flags.aw),
			A2($elm$core$List$repeat, 4, $author$project$Game$State$PNone)));
};
var $author$project$Game$State$errorBot = F4(
	function (bot, seed, pid, st) {
		return _Utils_Tuple2(
			seed,
			bot(
				A2($author$project$Game$State$toBotState, pid, st)));
	});
var $author$project$Game$Main$parseMatchInfo = F2(
	function (m, dta) {
		var pst2 = A3(
			$author$project$Game$State$newPlayerState,
			$author$project$Game$State$mapsize,
			m.bs.bB,
			{c2: m.bs.bA, em: m.bs.bC});
		var pst1 = A3(
			$author$project$Game$State$newPlayerState,
			$author$project$Game$State$mapsize,
			m.br.bB,
			{c2: m.br.bA, em: m.br.bC});
		var ps = $elm$core$Array$fromList(
			_List_fromArray(
				[$author$project$Game$State$PNone, $author$project$Game$State$PNone, $author$project$Game$State$PNone, $author$project$Game$State$PNone]));
		var mv2 = $elm$core$Array$fromList(
			A2($elm$core$List$map, $author$project$Game$State$intToMove, dta.bq));
		var mv1 = $elm$core$Array$fromList(
			A2($elm$core$List$map, $author$project$Game$State$intToMove, dta.bp));
		var bot2 = function (st) {
			return A2(
				$elm$core$Maybe$withDefault,
				$author$project$Game$State$MoveError,
				A2($elm$core$Array$get, st.dw, mv2));
		};
		var bot1 = function (st) {
			return A2(
				$elm$core$Maybe$withDefault,
				$author$project$Game$State$MoveError,
				A2($elm$core$Array$get, st.dw, mv1));
		};
		var ps1 = A3(
			$elm$core$Array$set,
			m.br.bB,
			A3(
				$author$project$Game$State$PBot,
				$author$project$Game$State$errorBot(bot1),
				pst1,
				false),
			ps);
		var ps2 = A3(
			$elm$core$Array$set,
			m.bs.bB,
			A3(
				$author$project$Game$State$PBot,
				$author$project$Game$State$errorBot(bot2),
				pst2,
				false),
			ps1);
		return $elm$core$Array$toList(ps2);
	});
var $author$project$Game$Main$initGameState = function (v) {
	var _v0 = $author$project$Game$Main$decodeGameFlags(v);
	if (!_v0.$) {
		var flags = _v0.a;
		return $author$project$Game$Main$Game(
			A2(
				$author$project$Game$State$initState,
				_List_Nil,
				$author$project$Game$Main$parseGameFlags(flags)));
	} else {
		var _v1 = $author$project$Game$Main$decodeMatch(v);
		if (!_v1.$) {
			var match = _v1.a;
			var st = A2($author$project$Game$Main$parseMatchInfo, match.bo, match.bn);
			var s0 = A2($author$project$Game$State$initState, match.bn.bt, st);
			return A4($author$project$Game$Main$Animate, s0, s0, $elm$core$Dict$empty, 5);
		} else {
			var _v2 = $author$project$Game$Main$decodeTutorialFlags(v);
			if (!_v2.$) {
				var flags = _v2.a;
				return $author$project$Game$Main$initTutorial(flags);
			} else {
				return $author$project$Game$Main$Game(
					A2(
						$author$project$Game$State$initState,
						_List_Nil,
						$author$project$Game$Main$parseGameFlags($author$project$API$defaultGameFlags)));
			}
		}
	}
};
var $author$project$Game$State$addAvatarState = F2(
	function (a, pst) {
		var data = pst.bP;
		var dataN = _Utils_update(
			data,
			{c2: a});
		return ((data.c2 < 1) || (data.c2 > 28)) ? _Utils_update(
			pst,
			{bP: dataN}) : pst;
	});
var $author$project$Game$State$addAvatar = F2(
	function (a, p) {
		switch (p.$) {
			case 2:
				return $author$project$Game$State$PNone;
			case 0:
				var b = p.a;
				var pst = p.b;
				var dead = p.c;
				return A3(
					$author$project$Game$State$PBot,
					b,
					A2($author$project$Game$State$addAvatarState, a, pst),
					dead);
			default:
				var pst = p.a;
				var dead = p.b;
				return A2(
					$author$project$Game$State$PHuman,
					A2($author$project$Game$State$addAvatarState, a, pst),
					dead);
		}
	});
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0;
		return function (seed) {
			return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
		};
	});
var $author$project$Game$State$addAvatars = function (_v0) {
	var seed = _v0.a;
	var st = _v0.b;
	var _v1 = A2(
		$elm$random$Random$step,
		A2(
			$elm$random$Random$list,
			4,
			A2($elm$random$Random$int, 1, 28)),
		seed);
	var avatars = _v1.a;
	var playersN = A2(
		$elm$core$Array$indexedMap,
		F2(
			function (i, p) {
				return A2(
					$author$project$Game$State$addAvatar,
					A2(
						$elm$core$Maybe$withDefault,
						15,
						A2($author$project$Utils$nth, avatars, i)),
					p);
			}),
		st.c6);
	return _Utils_Tuple2(
		seed,
		_Utils_update(
			st,
			{c6: playersN}));
};
var $author$project$Game$State$rangePos = F3(
	function (n, _v0, _v1) {
		var l1 = _v0.a;
		var c1 = _v0.b;
		var l2 = _v1.a;
		var c2 = _v1.b;
		var addPos = F2(
			function (p, ps) {
				return (A2($author$project$Game$State$isStart, n, p) || A2($author$project$Game$State$isWall, n, p)) ? ps : A2($elm$core$List$cons, p, ps);
			});
		var _v2 = _Utils_Tuple2(
			A2($elm$core$Basics$compare, l1, l2),
			A2($elm$core$Basics$compare, c1, c2));
		_v2$4:
		while (true) {
			switch (_v2.a) {
				case 0:
					switch (_v2.b) {
						case 0:
							var _v3 = _v2.a;
							var _v4 = _v2.b;
							return A2(
								addPos,
								_Utils_Tuple2(l1, c1),
								A3(
									$author$project$Game$State$rangePos,
									n,
									_Utils_Tuple2(l1, c1 + 1),
									_Utils_Tuple2(l2, c2)));
						case 1:
							var _v5 = _v2.a;
							var _v6 = _v2.b;
							return A2(
								addPos,
								_Utils_Tuple2(l1, c1),
								A3(
									$author$project$Game$State$rangePos,
									n,
									_Utils_Tuple2(l1 + 1, 0),
									_Utils_Tuple2(l2, c2)));
						default:
							break _v2$4;
					}
				case 1:
					switch (_v2.b) {
						case 0:
							var _v7 = _v2.a;
							var _v8 = _v2.b;
							return A2(
								addPos,
								_Utils_Tuple2(l1, c1),
								A3(
									$author$project$Game$State$rangePos,
									n,
									_Utils_Tuple2(l1, c1 + 1),
									_Utils_Tuple2(l2, c2)));
						case 1:
							var _v9 = _v2.a;
							var _v10 = _v2.b;
							return A2(
								addPos,
								_Utils_Tuple2(l1, c1),
								_List_Nil);
						default:
							break _v2$4;
					}
				default:
					break _v2$4;
			}
		}
		return _List_Nil;
	});
var $author$project$Game$State$generatePos = function (n) {
	return A2(
		$elm$random$Random$uniform,
		_Utils_Tuple2(1, 3),
		A3(
			$author$project$Game$State$rangePos,
			n,
			_Utils_Tuple2(1, 4),
			_Utils_Tuple2(n - 2, n - 2)));
};
var $author$project$Game$State$genPowerup = F4(
	function (pw, i, sz, _v0) {
		genPowerup:
		while (true) {
			var seed = _v0.a;
			var pws = _v0.b;
			if (i <= 0) {
				return _Utils_Tuple2(seed, pws);
			} else {
				var _v1 = A2(
					$elm$random$Random$step,
					$author$project$Game$State$generatePos(sz),
					seed);
				var pos = _v1.a;
				var seedN = _v1.b;
				var pwsN = A3($elm$core$Dict$insert, pos, pw, pws);
				var $temp$pw = pw,
					$temp$i = i - 1,
					$temp$sz = sz,
					$temp$_v0 = _Utils_Tuple2(seedN, pwsN);
				pw = $temp$pw;
				i = $temp$i;
				sz = $temp$sz;
				_v0 = $temp$_v0;
				continue genPowerup;
			}
		}
	});
var $author$project$Game$State$addPowerups = function (_v0) {
	var seed = _v0.a;
	var st = _v0.b;
	var sz = st.ad.Q;
	var _v1 = A4(
		$author$project$Game$State$genPowerup,
		1,
		5,
		sz,
		A4(
			$author$project$Game$State$genPowerup,
			0,
			5,
			sz,
			_Utils_Tuple2(seed, st.t)));
	var seed1 = _v1.a;
	var pws = _v1.b;
	return _Utils_Tuple2(
		seed1,
		_Utils_update(
			st,
			{t: pws}));
};
var $author$project$Game$State$initRandom = F2(
	function (seed, st) {
		var _v0 = $author$project$Game$State$addAvatars(
			$author$project$Game$State$addPowerups(
				_Utils_Tuple2(seed, st)));
		var seed1 = _v0.a;
		var st1 = _v0.b;
		return _Utils_update(
			st1,
			{
				dl: $elm$core$Maybe$Just(seed1)
			});
	});
var $author$project$Game$Main$initGameStateRandom = F2(
	function (seed, st) {
		switch (st.$) {
			case 0:
				var s = st.a;
				return $author$project$Game$Main$Game(
					A2($author$project$Game$State$initRandom, seed, s));
			case 1:
				var s0 = st.a;
				var s = st.b;
				var rs = st.c;
				var speed = st.d;
				var sN = _Utils_update(
					s,
					{
						dl: $elm$core$Maybe$Just(seed)
					});
				return A4($author$project$Game$Main$Animate, sN, sN, $elm$core$Dict$empty, speed);
			default:
				var s = st.a;
				var b = st.b;
				var end = st.c;
				var sN = _Utils_update(
					s,
					{
						dl: $elm$core$Maybe$Just(seed)
					});
				return A3($author$project$Game$Main$Tutorial, sN, b, end);
		}
	});
var $author$project$Game$State$computeBotMove = F4(
	function (seed, st, i, p) {
		if (!p.$) {
			var bot = p.a;
			var pst = p.b;
			var isDead = p.c;
			return isDead ? _Utils_Tuple2(
				i,
				_Utils_Tuple2(
					seed,
					$author$project$Game$State$BotMove(5))) : _Utils_Tuple2(
				i,
				A3(bot, seed, i, st));
		} else {
			return _Utils_Tuple2(
				i,
				_Utils_Tuple2(
					seed,
					$author$project$Game$State$BotMove(5)));
		}
	});
var $author$project$Game$State$goBotMove = F3(
	function (st, _v0, _v1) {
		var i = _v0.a;
		var p = _v0.b;
		var seed0 = _v1.a;
		var xs0 = _v1.b;
		var _v2 = A4($author$project$Game$State$computeBotMove, seed0, st, i, p);
		var i1 = _v2.a;
		var _v3 = _v2.b;
		var seed1 = _v3.a;
		var mv1 = _v3.b;
		return _Utils_Tuple2(
			seed1,
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(i1, mv1),
				xs0));
	});
var $author$project$Game$State$computeBotMoves = F2(
	function (seed, st) {
		return A3(
			$elm$core$List$foldl,
			$author$project$Game$State$goBotMove(st),
			_Utils_Tuple2(seed, _List_Nil),
			$elm$core$Array$toIndexedList(st.c6));
	});
var $author$project$Game$State$makeMoves = F3(
	function (checkEnd, moves, st) {
		return A3(
			$elm$core$List$foldl,
			A3($author$project$Game$State$makeMove, checkEnd, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing),
			st,
			moves);
	});
var $author$project$Game$State$moveBots = F2(
	function (checkEnd, st) {
		var _v0 = st.dl;
		if (_v0.$ === 1) {
			return st;
		} else {
			var seed = _v0.a;
			var _v1 = A2($author$project$Game$State$computeBotMoves, seed, st);
			var seed1 = _v1.a;
			var mvs = _v1.b;
			return A3(
				$author$project$Game$State$makeMoves,
				checkEnd,
				mvs,
				_Utils_update(
					st,
					{
						dl: $elm$core$Maybe$Just(seed1)
					}));
		}
	});
var $author$project$Game$State$advanceTime = F2(
	function (checkEnd, st) {
		return checkEnd(st) ? st : $author$project$Game$State$tickState(
			A2(
				$author$project$Game$State$moveBots,
				checkEnd,
				$author$project$Game$State$tickBombs(
					$author$project$Game$State$advanceCaracol(st))));
	});
var $author$project$Game$Main$nextSpeed = function (i) {
	switch (i) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 5;
		default:
			return 10;
	}
};
var $author$project$Game$Main$prevSpeed = function (i) {
	switch (i) {
		case 10:
			return 5;
		case 5:
			return 2;
		case 2:
			return 1;
		default:
			return 0;
	}
};
var $author$project$Game$Main$clickButton = F3(
	function (n, s0, _v0) {
		var st = _v0.a;
		var speed = _v0.b;
		switch (n) {
			case 'rewind':
				return _Utils_Tuple2(s0, speed);
			case 'slow':
				return _Utils_Tuple2(
					st,
					$author$project$Game$Main$prevSpeed(speed));
			case 'fast':
				return _Utils_Tuple2(
					st,
					$author$project$Game$Main$nextSpeed(speed));
			default:
				return _Utils_Tuple2(st, speed);
		}
	});
var $author$project$Game$Window$mouseInsideRegion = F2(
	function (mouse, r) {
		var _v0 = r.C;
		var regionLeft = _v0.a;
		var regionTop = _v0.b;
		var _v1 = r.aM;
		var w = _v1.a;
		var h = _v1.b;
		var regionRight = regionLeft + w;
		var regionBottom = regionTop - h;
		return ((_Utils_cmp(regionLeft, mouse.ct) < 1) && (_Utils_cmp(mouse.ct, regionRight) < 1)) && ((_Utils_cmp(regionBottom, mouse.cu) < 1) && (_Utils_cmp(mouse.cu, regionTop) < 1));
	});
var $author$project$Game$Window$AlignLeft = 0;
var $author$project$Game$Window$AlignRight = 1;
var $author$project$Game$Playground$Hex = function (a) {
	return {$: 0, a: a};
};
var $author$project$Game$Playground$black = $author$project$Game$Playground$Hex('#000000');
var $author$project$Game$Draw$backgroundColor = $author$project$Game$Playground$black;
var $author$project$Game$Playground$Group = function (a) {
	return {$: 8, a: a};
};
var $author$project$Game$Playground$Shape = F6(
	function (a, b, c, d, e, f) {
		return {$: 0, a: a, b: b, c: c, d: d, e: e, f: f};
	});
var $author$project$Game$Playground$group = function (shapes) {
	return A6(
		$author$project$Game$Playground$Shape,
		0,
		0,
		0,
		1,
		1,
		$author$project$Game$Playground$Group(shapes));
};
var $author$project$Game$Window$mkScreen = F2(
	function (w, h) {
		return {a0: -(h / 2), ax: h, K: -(w / 2), af: w / 2, cc: h / 2, aS: w};
	});
var $author$project$Game$Window$movePosY = F2(
	function (f, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(x, y + f);
	});
var $author$project$Game$Window$moveRegionY = F2(
	function (f, r) {
		return _Utils_update(
			r,
			{
				C: A2($author$project$Game$Window$movePosY, f, r.C)
			});
	});
var $author$project$Game$Playground$moveY = F2(
	function (dy, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		var a = _v0.c;
		var s = _v0.d;
		var o = _v0.e;
		var f = _v0.f;
		return A6($author$project$Game$Playground$Shape, x, y + dy, a, s, o, f);
	});
var $author$project$Game$Window$bottom = F4(
	function (fn, wb, wt, screen) {
		var n = fn(screen.ax);
		var screenb = A2($author$project$Game$Window$mkScreen, screen.aS, n);
		var screent = A2($author$project$Game$Window$mkScreen, screen.aS, screen.ax - n);
		var wbb = wb(screenb);
		var wtt = wt(screent);
		var bb = -((screen.ax / 2) - (n / 2));
		var tt = n / 2;
		var draw = _List_fromArray(
			[
				A2(
				$author$project$Game$Playground$moveY,
				bb,
				$author$project$Game$Playground$group(wbb.eK)),
				A2(
				$author$project$Game$Playground$moveY,
				tt,
				$author$project$Game$Playground$group(wtt.eK))
			]);
		var regions = A2(
			$elm$core$Dict$union,
			A2(
				$elm$core$Dict$map,
				function (_v0) {
					return $author$project$Game$Window$moveRegionY(bb);
				},
				wbb.eL),
			A2(
				$elm$core$Dict$map,
				function (_v1) {
					return $author$project$Game$Window$moveRegionY(tt);
				},
				wtt.eL));
		return {eK: draw, eL: regions};
	});
var $author$project$Game$Playground$darkGrey = $author$project$Game$Playground$Hex('#babdb6');
var $author$project$Game$Window$AlignCenter = 4;
var $author$project$Game$Window$constWindowResult = function (shapes) {
	return {eK: shapes, eL: $elm$core$Dict$empty};
};
var $author$project$Game$Window$empty = function (screen) {
	return $author$project$Game$Window$constWindowResult(_List_Nil);
};
var $author$project$Game$Window$emptyRegion = {
	aM: _Utils_Tuple2(0, 0),
	C: _Utils_Tuple2(0, 0)
};
var $author$project$Game$Playground$grey = $author$project$Game$Playground$Hex('#d3d7cf');
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
var $author$project$Game$Window$concatWindowResults = function (xs) {
	return {
		eK: $elm$core$List$concat(
			A2(
				$elm$core$List$map,
				function (x) {
					return x.eK;
				},
				xs)),
		eL: A2(
			$author$project$Utils$concatDicts,
			F2(
				function (x, y) {
					return x;
				}),
			A2(
				$elm$core$List$map,
				function (x) {
					return x.eL;
				},
				xs))
	};
};
var $author$project$Game$Window$group = F2(
	function (ws, screen) {
		return $author$project$Game$Window$concatWindowResults(
			A2(
				$elm$core$List$map,
				function (w) {
					return w(screen);
				},
				ws));
	});
var $author$project$Game$Playground$Rectangle = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$Game$Playground$rectangle = F3(
	function (color, width, height) {
		return A6(
			$author$project$Game$Playground$Shape,
			0,
			0,
			0,
			1,
			1,
			A3($author$project$Game$Playground$Rectangle, color, width, height));
	});
var $author$project$Game$Window$rectangle = F2(
	function (c, screen) {
		return $author$project$Game$Window$constWindowResult(
			_List_fromArray(
				[
					A3($author$project$Game$Playground$rectangle, c, screen.aS, screen.ax)
				]));
	});
var $author$project$Game$Window$screenToRegion = function (s) {
	return {
		aM: _Utils_Tuple2(s.aS, s.ax),
		C: _Utils_Tuple2(s.K, s.cc)
	};
};
var $author$project$Game$Window$region = F2(
	function (name, w) {
		return function (screen) {
			var res = w(screen);
			return _Utils_update(
				res,
				{
					eL: A3(
						$elm$core$Dict$insert,
						name,
						$author$project$Game$Window$screenToRegion(screen),
						res.eL)
				});
		};
	});
var $author$project$Game$Playground$white = $author$project$Game$Playground$Hex('#FFFFFF');
var $author$project$Game$Window$align = F3(
	function (a, _v0, _v1) {
		var cx = _v0.a;
		var cy = _v0.b;
		var sx = _v1.a;
		var sy = _v1.b;
		switch (a) {
			case 0:
				return _Utils_Tuple2(-((sx - cx) / 2), 0);
			case 1:
				return _Utils_Tuple2((sx - cx) / 2, 0);
			case 2:
				return _Utils_Tuple2(0, (sy - cy) / 2);
			case 3:
				return _Utils_Tuple2(0, -((sy - cy) / 2));
			default:
				return _Utils_Tuple2(0, 0);
		}
	});
var $author$project$Game$Playground$moveX = F2(
	function (dx, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		var a = _v0.c;
		var s = _v0.d;
		var o = _v0.e;
		var f = _v0.f;
		return A6($author$project$Game$Playground$Shape, x + dx, y, a, s, o, f);
	});
var $author$project$Game$Playground$scale = F2(
	function (ns, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		var a = _v0.c;
		var s = _v0.d;
		var o = _v0.e;
		var f = _v0.f;
		return A6($author$project$Game$Playground$Shape, x, y, a, s * ns, o, f);
	});
var $author$project$Game$Window$fitWith = F4(
	function (a, _v0, _v1, pic) {
		var cx = _v0.a;
		var cy = _v0.b;
		var sx = _v1.a;
		var sy = _v1.b;
		var scalex = sx / cx;
		var scaley = sy / cy;
		var scalexy = A2(
			$elm$core$Basics$max,
			0,
			A2($elm$core$Basics$min, scalex, scaley));
		var _v2 = A3(
			$author$project$Game$Window$align,
			a,
			_Utils_Tuple2(cx * scalexy, cy * scalexy),
			_Utils_Tuple2(sx, sy));
		var ax = _v2.a;
		var ay = _v2.b;
		return A2(
			$author$project$Game$Playground$moveX,
			ax,
			A2(
				$author$project$Game$Playground$moveY,
				ay,
				A2($author$project$Game$Playground$scale, scalexy, pic)));
	});
var $author$project$Game$Window$screenDimension = function (s) {
	return _Utils_Tuple2(s.aS, s.ax);
};
var $author$project$Game$Playground$Words = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Game$Playground$words = F2(
	function (color, string) {
		return A6(
			$author$project$Game$Playground$Shape,
			0,
			0,
			0,
			1,
			1,
			A2($author$project$Game$Playground$Words, color, string));
	});
var $author$project$Game$Window$wordsWith = F5(
	function (c, txt, a, fitTxt, screen) {
		var charwidth = 15;
		var charheight = 12;
		return $author$project$Game$Window$constWindowResult(
			_List_fromArray(
				[
					A4(
					$author$project$Game$Window$fitWith,
					a,
					_Utils_Tuple2(
						charwidth * $elm$core$String$length(fitTxt),
						charheight),
					$author$project$Game$Window$screenDimension(screen),
					A2($author$project$Game$Playground$words, c, txt))
				]));
	});
var $author$project$Game$Window$words = F3(
	function (c, txt, a) {
		return A4($author$project$Game$Window$wordsWith, c, txt, a, txt);
	});
var $author$project$Game$Draw$drawButton = F4(
	function (mouse, name, txt, mbregions) {
		var regions = A2($elm$core$Maybe$withDefault, $elm$core$Dict$empty, mbregions);
		var buttonRegion = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Game$Window$emptyRegion,
			A2($elm$core$Dict$get, name, regions));
		var inside = A2($author$project$Game$Window$mouseInsideRegion, mouse, buttonRegion);
		var color1 = inside ? $author$project$Game$Playground$grey : $author$project$Game$Playground$darkGrey;
		var color2 = (inside && mouse.dS) ? $author$project$Game$Playground$white : $author$project$Game$Playground$black;
		var wtxt = A3($author$project$Game$Window$words, color2, txt, 4);
		var button = function () {
			if (mbregions.$ === 1) {
				return $author$project$Game$Window$empty;
			} else {
				return $author$project$Game$Window$group(
					_List_fromArray(
						[
							$author$project$Game$Window$rectangle(color1),
							wtxt
						]));
			}
		}();
		return A2($author$project$Game$Window$region, name, button);
	});
var $author$project$Game$Window$movePosX = F2(
	function (f, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(x + f, y);
	});
var $author$project$Game$Window$moveRegionX = F2(
	function (f, r) {
		return _Utils_update(
			r,
			{
				C: A2($author$project$Game$Window$movePosX, f, r.C)
			});
	});
var $author$project$Game$Window$matrix = F4(
	function (l, c, draw, screen) {
		var w = screen.aS;
		var h = screen.ax;
		var wc = w / c;
		var hl = h / l;
		var screenc = A2($author$project$Game$Window$mkScreen, wc, hl);
		var drawCell = F2(
			function (ll, cc) {
				var wC = A3(draw, ll, cc, screenc);
				var yy = ((-(ll * hl)) + (h / 2)) - (hl / 2);
				var xx = ((cc * wc) - (w / 2)) + (wc / 2);
				var drawC = A2(
					$author$project$Game$Playground$moveY,
					yy,
					A2(
						$author$project$Game$Playground$moveX,
						xx,
						$author$project$Game$Playground$group(wC.eK)));
				var regionsC = A2(
					$elm$core$Dict$map,
					function (_v0) {
						return A2(
							$elm$core$Basics$composeL,
							$author$project$Game$Window$moveRegionY(yy),
							$author$project$Game$Window$moveRegionX(xx));
					},
					wC.eL);
				return {
					eK: _List_fromArray(
						[drawC]),
					eL: regionsC
				};
			});
		var drawLine = function (ll) {
			return $author$project$Game$Window$concatWindowResults(
				A2(
					$elm$core$List$map,
					drawCell(ll),
					A2($elm$core$List$range, 0, c - 1)));
		};
		var drawLines = $author$project$Game$Window$concatWindowResults(
			A2(
				$elm$core$List$map,
				drawLine,
				A2($elm$core$List$range, 0, l - 1)));
		return drawLines;
	});
var $author$project$Game$Window$hlist = function (ws) {
	return A3(
		$author$project$Game$Window$matrix,
		1,
		$elm$core$List$length(ws),
		F2(
			function (_v0, c) {
				return A2(
					$elm$core$Maybe$withDefault,
					$author$project$Game$Window$empty,
					A2($author$project$Utils$nth, ws, c));
			}));
};
var $author$project$Game$Draw$drawButtons = F3(
	function (mouse, speed, regions) {
		var rewind = A4($author$project$Game$Draw$drawButton, mouse, 'rewind', '\u23EE', regions);
		var slow = A4($author$project$Game$Draw$drawButton, mouse, 'slow', '\u23F7', regions);
		var fast = A4($author$project$Game$Draw$drawButton, mouse, 'fast', '\u23F6', regions);
		var wspeed = function () {
			if (regions.$ === 1) {
				return $author$project$Game$Window$empty;
			} else {
				return $author$project$Game$Window$group(
					_List_fromArray(
						[
							$author$project$Game$Window$rectangle($author$project$Game$Playground$darkGrey),
							A3(
							$author$project$Game$Window$words,
							$author$project$Game$Playground$black,
							$elm$core$String$fromInt(speed) + 'x',
							4)
						]));
			}
		}();
		return $author$project$Game$Window$hlist(
			_List_fromArray(
				[rewind, slow, wspeed, fast]));
	});
var $author$project$Game$Playground$Image = F3(
	function (a, b, c) {
		return {$: 6, a: a, b: b, c: c};
	});
var $author$project$Game$Playground$image = F3(
	function (w, h, src) {
		return A6(
			$author$project$Game$Playground$Shape,
			0,
			0,
			0,
			1,
			1,
			A3($author$project$Game$Playground$Image, w, h, src));
	});
var $author$project$Game$Window$image = F2(
	function (url, screen) {
		return $author$project$Game$Window$constWindowResult(
			_List_fromArray(
				[
					A3($author$project$Game$Playground$image, screen.aS, screen.ax, url)
				]));
	});
var $author$project$Game$Draw$playerFolder = function (i) {
	switch (i) {
		case 0:
			return 'red';
		case 1:
			return 'blue';
		case 2:
			return 'green';
		case 3:
			return 'yellow';
		default:
			return '';
	}
};
var $author$project$Game$Window$zoom = F5(
	function (fw, fh, a, w, screen) {
		var wZ = fw(screen.aS);
		var hZ = fh(screen.ax);
		var screenZ = A2($author$project$Game$Window$mkScreen, wZ, hZ);
		var wZoom = w(screenZ);
		var _v0 = A3(
			$author$project$Game$Window$align,
			a,
			_Utils_Tuple2(wZ, hZ),
			_Utils_Tuple2(screen.aS, screen.ax));
		var ax = _v0.a;
		var ay = _v0.b;
		var draw = _List_fromArray(
			[
				A2(
				$author$project$Game$Playground$moveX,
				ax,
				A2(
					$author$project$Game$Playground$moveY,
					ay,
					$author$project$Game$Playground$group(wZoom.eK)))
			]);
		return {
			eK: draw,
			eL: A2(
				$elm$core$Dict$map,
				function (_v1) {
					return A2(
						$elm$core$Basics$composeL,
						$author$project$Game$Window$moveRegionX(ax),
						$author$project$Game$Window$moveRegionY(ay));
				},
				wZoom.eL)
		};
	});
var $author$project$Game$Draw$drawBomb = function (b) {
	var path = '../graphics/' + ($author$project$Game$Draw$playerFolder(b.dH) + '/bomb.gif');
	var sprite = A4(
		$author$project$Game$Window$zoom,
		function (w) {
			return w * 0.9;
		},
		function (h) {
			return h * 0.9;
		},
		4,
		$author$project$Game$Window$image(path));
	var timer = A4(
		$author$project$Game$Window$wordsWith,
		$author$project$Game$Playground$white,
		$elm$core$String$fromInt(b.dJ),
		4,
		'000');
	return $author$project$Game$Window$group(
		_List_fromArray(
			[sprite, timer]));
};
var $author$project$Game$Playground$darkCharcoal = $author$project$Game$Playground$Hex('#2e3436');
var $author$project$Game$Draw$drawPowerup = function (p) {
	if (!p) {
		return $author$project$Game$Window$image('../graphics/bombs.gif');
	} else {
		return $author$project$Game$Window$image('../graphics/flames.gif');
	}
};
var $author$project$Game$Draw$floorColor = $author$project$Game$Playground$Hex('#A47551');
var $author$project$Game$Draw$drawCell = F2(
	function (c, p) {
		var _v0 = _Utils_Tuple2(c, p);
		switch (_v0.a) {
			case 1:
				if (!_v0.b.$) {
					var _v1 = _v0.a;
					var pw = _v0.b.a;
					return $author$project$Game$Draw$drawPowerup(pw);
				} else {
					return $author$project$Game$Window$rectangle($author$project$Game$Draw$floorColor);
				}
			case 0:
				var _v2 = _v0.a;
				return $author$project$Game$Window$rectangle($author$project$Game$Playground$darkCharcoal);
			default:
				var _v3 = _v0.a;
				return $author$project$Game$Window$image('../graphics/box.gif');
		}
	});
var $author$project$Game$Draw$drawFlame = function (_v0) {
	var pid = _v0.a;
	var fid = _v0.b;
	var path = '../graphics/' + ($author$project$Game$Draw$playerFolder(pid) + ('/e' + ($elm$core$String$fromInt(fid) + '.gif')));
	return $author$project$Game$Window$image(path);
};
var $author$project$Game$Window$AlignBottom = 3;
var $author$project$Game$Window$AlignTop = 2;
var $author$project$Game$Playground$Oval = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $author$project$Game$Playground$oval = F3(
	function (color, width, height) {
		return A6(
			$author$project$Game$Playground$Shape,
			0,
			0,
			0,
			1,
			1,
			A3($author$project$Game$Playground$Oval, color, width, height));
	});
var $author$project$Game$Window$oval = F2(
	function (c, screen) {
		return $author$project$Game$Window$constWindowResult(
			_List_fromArray(
				[
					A3($author$project$Game$Playground$oval, c, screen.aS, screen.ax)
				]));
	});
var $author$project$Game$Draw$playerColor = function (i) {
	switch (i) {
		case 0:
			return $author$project$Game$Playground$Hex('#A91111');
		case 1:
			return $author$project$Game$Playground$Hex('#173aaf');
		case 2:
			return $author$project$Game$Playground$Hex('#137515');
		case 3:
			return $author$project$Game$Playground$Hex('#e0b83e');
		default:
			return $author$project$Game$Playground$black;
	}
};
var $author$project$Game$Draw$drawPlayer = function (_v0) {
	var pid = _v0.a;
	var p = _v0.b;
	var back = A4(
		$author$project$Game$Window$zoom,
		function (w) {
			return w * 0.7;
		},
		function (h) {
			return h * 0.2;
		},
		3,
		$author$project$Game$Window$oval(
			$author$project$Game$Draw$playerColor(pid)));
	return $author$project$Game$Window$group(
		_List_fromArray(
			[
				back,
				A4(
				$author$project$Game$Window$zoom,
				$elm$core$Basics$identity,
				function (h) {
					return h * 0.9;
				},
				2,
				$author$project$Game$Window$image(
					'../graphics/players/p' + ($elm$core$String$fromInt(p.bP.c2) + '.gif')))
			]));
};
var $author$project$Game$Draw$drawExtCell = F3(
	function (l, c, mbe) {
		if (mbe.$ === 1) {
			return $author$project$Game$Window$empty;
		} else {
			var e = mbe.a;
			var wplayers = A2($elm$core$List$map, $author$project$Game$Draw$drawPlayer, e.dX);
			var wburns = A2($elm$core$List$map, $author$project$Game$Draw$drawFlame, e.dV);
			var wbombs = A2($elm$core$List$map, $author$project$Game$Draw$drawBomb, e.dU);
			var txt = '(' + ($elm$core$String$fromInt(l) + (',' + ($elm$core$String$fromInt(c) + ')')));
			var wpos = ((!c) || (!l)) ? A4($author$project$Game$Window$wordsWith, $author$project$Game$Playground$white, txt, 4, '(10,10)') : $author$project$Game$Window$empty;
			return $author$project$Game$Window$group(
				A2(
					$elm$core$List$cons,
					A2($author$project$Game$Draw$drawCell, e.dW, e.dY),
					_Utils_ap(
						wbombs,
						_Utils_ap(
							wplayers,
							_Utils_ap(
								wburns,
								_List_fromArray(
									[wpos]))))));
		}
	});
var $author$project$Game$Playground$Polyline = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var $author$project$Game$Playground$polyline = F3(
	function (color, stroke, points) {
		return A6(
			$author$project$Game$Playground$Shape,
			0,
			0,
			0,
			1,
			1,
			A3($author$project$Game$Playground$Polyline, color, stroke, points));
	});
var $author$project$Game$Window$cross = F3(
	function (c, stroke, screen) {
		var w2 = screen.aS / 2;
		var h2 = screen.ax / 2;
		return $author$project$Game$Window$constWindowResult(
			_List_fromArray(
				[
					A3(
					$author$project$Game$Playground$polyline,
					c,
					stroke,
					_List_fromArray(
						[
							_Utils_Tuple2(-w2, -h2),
							_Utils_Tuple2(w2, h2)
						])),
					A3(
					$author$project$Game$Playground$polyline,
					c,
					stroke,
					_List_fromArray(
						[
							_Utils_Tuple2(-w2, h2),
							_Utils_Tuple2(w2, -h2)
						]))
				]));
	});
var $author$project$Game$Draw$moveToInt = function (mv) {
	if (mv.$ === 1) {
		return 5;
	} else {
		switch (mv.a) {
			case 2:
				var _v1 = mv.a;
				return 0;
			case 0:
				var _v2 = mv.a;
				return 1;
			case 1:
				var _v3 = mv.a;
				return 2;
			case 3:
				var _v4 = mv.a;
				return 3;
			case 4:
				var _v5 = mv.a;
				return 4;
			default:
				var _v6 = mv.a;
				return 6;
		}
	}
};
var $elm$core$String$fromList = _String_fromList;
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Utils$nthString = F2(
	function (s, i) {
		return A2(
			$author$project$Utils$nth,
			$elm$core$String$toList(s),
			i);
	});
var $author$project$Game$Draw$playerKey = F2(
	function (pid, k) {
		var toStr = function (mb) {
			if (mb.$ === 1) {
				return '';
			} else {
				var c = mb.a;
				return $elm$core$String$fromList(
					_List_fromArray(
						[c]));
			}
		};
		return toStr(
			function () {
				switch (pid) {
					case 0:
						return A2($author$project$Utils$nthString, 'AWSDE', k);
					case 1:
						return A2($author$project$Utils$nthString, 'FTGHY', k);
					case 2:
						return A2($author$project$Utils$nthString, 'JIKLO', k);
					case 3:
						return A2($author$project$Utils$nthString, '\u2190\u2191\u2193\u2192\u2423', k);
					case 4:
						return A2($author$project$Utils$nthString, '\u2190\u2191\u2193\u2192\uD83D\uDCA3', k);
					default:
						return $elm$core$Maybe$Nothing;
				}
			}());
	});
var $author$project$Game$Draw$drawPlayerKey = F3(
	function (mb, pid, k) {
		var _v0 = function () {
			if (mb.$ === 1) {
				return _Utils_Tuple2($author$project$Game$Playground$black, false);
			} else {
				var _v2 = mb.a;
				var mv = _v2.a;
				var isWrong = _v2.b;
				return _Utils_eq(
					$author$project$Game$Draw$moveToInt(mv),
					k) ? _Utils_Tuple2($author$project$Game$Playground$white, isWrong) : _Utils_Tuple2($author$project$Game$Playground$black, false);
			}
		}();
		var color = _v0.a;
		var no = _v0.b;
		var z8 = function (x) {
			return x * 1.2;
		};
		var errImg = (k === 5) ? '../graphics/error.gif' : '../graphics/stop.gif';
		var wno = no ? A4(
			$author$project$Game$Window$zoom,
			z8,
			z8,
			4,
			$author$project$Game$Window$image(errImg)) : $author$project$Game$Window$empty;
		return $author$project$Game$Window$group(
			_List_fromArray(
				[
					A3(
					$author$project$Game$Window$words,
					color,
					A2($author$project$Game$Draw$playerKey, pid, k),
					4),
					wno
				]));
	});
var $author$project$Game$Window$left = F4(
	function (fn, wl, wr, screen) {
		var n = fn(screen.aS);
		var screenl = A2($author$project$Game$Window$mkScreen, n, screen.ax);
		var screenr = A2($author$project$Game$Window$mkScreen, screen.aS - n, screen.ax);
		var wll = wl(screenl);
		var wrr = wr(screenr);
		var ll = -((screen.aS / 2) - (n / 2));
		var rr = n / 2;
		var draw = _List_fromArray(
			[
				A2(
				$author$project$Game$Playground$moveX,
				ll,
				$author$project$Game$Playground$group(wll.eK)),
				A2(
				$author$project$Game$Playground$moveX,
				rr,
				$author$project$Game$Playground$group(wrr.eK))
			]);
		var regions = A2(
			$elm$core$Dict$union,
			A2(
				$elm$core$Dict$map,
				function (_v0) {
					return $author$project$Game$Window$moveRegionX(ll);
				},
				wll.eL),
			A2(
				$elm$core$Dict$map,
				function (_v1) {
					return $author$project$Game$Window$moveRegionX(rr);
				},
				wrr.eL));
		return {eK: draw, eL: regions};
	});
var $author$project$Game$Draw$textColor = $author$project$Game$Playground$black;
var $author$project$Game$Window$top = F4(
	function (fn, wb, wt, screen) {
		var n = fn(screen.ax);
		var screenb = A2($author$project$Game$Window$mkScreen, screen.aS, screen.ax - n);
		var screent = A2($author$project$Game$Window$mkScreen, screen.aS, n);
		var wbb = wb(screenb);
		var wtt = wt(screent);
		var bb = -(n / 2);
		var tt = (screen.ax / 2) - (n / 2);
		var draw = _List_fromArray(
			[
				A2(
				$author$project$Game$Playground$moveY,
				bb,
				$author$project$Game$Playground$group(wbb.eK)),
				A2(
				$author$project$Game$Playground$moveY,
				tt,
				$author$project$Game$Playground$group(wtt.eK))
			]);
		var regions = A2(
			$elm$core$Dict$union,
			A2(
				$elm$core$Dict$map,
				function (_v0) {
					return $author$project$Game$Window$moveRegionY(bb);
				},
				wbb.eL),
			A2(
				$elm$core$Dict$map,
				function (_v1) {
					return $author$project$Game$Window$moveRegionY(tt);
				},
				wtt.eL));
		return {eK: draw, eL: regions};
	});
var $author$project$Game$Window$vlist = function (ws) {
	return A3(
		$author$project$Game$Window$matrix,
		$elm$core$List$length(ws),
		1,
		F2(
			function (l, _v0) {
				return A2(
					$elm$core$Maybe$withDefault,
					$author$project$Game$Window$empty,
					A2($author$project$Utils$nth, ws, l));
			}));
};
var $author$project$Game$Draw$drawPlayerState = F3(
	function (isBot, pid, pst) {
		var wp = A4(
			$author$project$Game$Window$zoom,
			$elm$core$Basics$identity,
			function (h) {
				return h * 0.8;
			},
			3,
			A3(
				$author$project$Game$Window$words,
				$author$project$Game$Draw$textColor,
				'Player ' + $elm$core$String$fromInt(pid),
				4));
		var wn = A3($author$project$Game$Window$words, $author$project$Game$Draw$textColor, pst.bP.em, 4);
		var wkeys = A4(
			$author$project$Game$Window$zoom,
			function (w) {
				return w * 0.7;
			},
			$elm$core$Basics$identity,
			4,
			A3(
				$author$project$Game$Window$matrix,
				1,
				6,
				F2(
					function (l, c) {
						return A3(
							$author$project$Game$Draw$drawPlayerKey,
							pst.el,
							isBot ? 4 : pid,
							c);
					})));
		var wicon = A4(
			$author$project$Game$Window$zoom,
			function (w) {
				return w * 0.9;
			},
			function (h) {
				return h * 0.9;
			},
			4,
			$author$project$Game$Window$image(
				'../graphics/players/p' + ($elm$core$String$fromInt(pst.bP.c2) + '.gif')));
		var wflames = $author$project$Game$Window$hlist(
			A2(
				$elm$core$List$take,
				6,
				_Utils_ap(
					A2(
						$elm$core$List$repeat,
						pst.ek,
						$author$project$Game$Window$image('../graphics/flames.gif')),
					A2($elm$core$List$repeat, 6, $author$project$Game$Window$empty))));
		var wbombs = $author$project$Game$Window$hlist(
			A2(
				$elm$core$List$take,
				6,
				_Utils_ap(
					A2(
						$elm$core$List$repeat,
						pst.ej,
						$author$project$Game$Window$image('../graphics/bombs.gif')),
					A2($elm$core$List$repeat, 6, $author$project$Game$Window$empty))));
		var wdata = A4(
			$author$project$Game$Window$zoom,
			$elm$core$Basics$identity,
			function (h) {
				return h * 0.9;
			},
			4,
			$author$project$Game$Window$vlist(
				A2(
					$elm$core$List$map,
					A3(
						$author$project$Game$Window$zoom,
						function (w) {
							return w * 0.9;
						},
						function (h) {
							return h * 0.9;
						},
						4),
					_List_fromArray(
						[wn, wbombs, wflames, wkeys]))));
		var wst = A3(
			$author$project$Game$Window$left,
			function (w) {
				return w * 0.3;
			},
			wicon,
			wdata);
		return A3(
			$author$project$Game$Window$top,
			function (h) {
				return h * 0.2;
			},
			wst,
			wp);
	});
var $author$project$Game$Draw$foregroundColor = $author$project$Game$Playground$Hex('#808080');
var $author$project$Game$Draw$drawPlayerStatus = F2(
	function (pid, p) {
		var drawBox = function (c) {
			return $author$project$Game$Window$rectangle(c);
		};
		var drawDead = function (b) {
			return b ? A2($author$project$Game$Window$cross, $author$project$Game$Draw$foregroundColor, 2) : $author$project$Game$Window$empty;
		};
		var pColor = function (b) {
			return b ? $author$project$Game$Playground$darkCharcoal : $author$project$Game$Draw$playerColor(pid);
		};
		switch (p.$) {
			case 2:
				return $author$project$Game$Window$group(
					_List_fromArray(
						[
							drawBox($author$project$Game$Draw$backgroundColor),
							drawDead(true)
						]));
			case 0:
				var pst = p.b;
				var isDead = p.c;
				return $author$project$Game$Window$group(
					_List_fromArray(
						[
							drawBox(
							pColor(isDead)),
							A3($author$project$Game$Draw$drawPlayerState, true, pid, pst),
							drawDead(isDead)
						]));
			default:
				var pst = p.a;
				var isDead = p.b;
				return $author$project$Game$Window$group(
					_List_fromArray(
						[
							drawBox(
							pColor(isDead)),
							A3($author$project$Game$Draw$drawPlayerState, false, pid, pst),
							drawDead(isDead)
						]));
		}
	});
var $author$project$Game$State$getPlayerStates = function (ps) {
	return A2(
		$elm$core$List$filterMap,
		function (_v0) {
			var i = _v0.a;
			var p = _v0.b;
			return A2(
				$elm$core$Maybe$map,
				function (x) {
					return _Utils_Tuple2(i, x);
				},
				$author$project$Game$State$getPlayerState(p));
		},
		$elm$core$Array$toIndexedList(ps));
};
var $author$project$Game$State$getExtCell = F2(
	function (pos, st) {
		var _v0 = A2($author$project$Game$State$getCell, pos, st.ad.Z);
		if (_v0.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var cell = _v0.a;
			var pw = A2($elm$core$Dict$get, pos, st.t);
			var psts = $author$project$Game$State$getPlayerStates(st.c6);
			var pstsP = A2(
				$elm$core$List$map,
				function (_v1) {
					var x = _v1.a;
					var y = _v1.b;
					return _Utils_Tuple2(x, y.a);
				},
				A2(
					$elm$core$List$filter,
					function (_v2) {
						var _v3 = _v2.b;
						var p = _v3.a;
						var isDead = _v3.b;
						return (!isDead) && _Utils_eq(p.V, pos);
					},
					psts));
			var pburns = $author$project$Game$State$isFreeCell(cell) ? A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2($elm$core$Dict$get, pos, st.ao)) : _List_Nil;
			var pbombs = A2(
				$elm$core$List$sortBy,
				function ($) {
					return $.dJ;
				},
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					A2(
						$elm$core$List$map,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Tuple$second,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$Tuple$first,
								A2(
									$elm$core$Basics$composeR,
									function ($) {
										return $.c3;
									},
									$elm$core$Dict$get(pos)))),
						psts)));
			return $elm$core$Maybe$Just(
				{dU: pbombs, dV: pburns, dW: cell, dX: pstsP, dY: pw});
		}
	});
var $author$project$Game$Window$right = F4(
	function (fn, wl, wr, screen) {
		var n = fn(screen.aS);
		var screenl = A2($author$project$Game$Window$mkScreen, screen.aS - n, screen.ax);
		var screenr = A2($author$project$Game$Window$mkScreen, n, screen.ax);
		var wll = wl(screenl);
		var wrr = wr(screenr);
		var ll = -(n / 2);
		var rr = (screen.aS / 2) - (n / 2);
		var draw = _List_fromArray(
			[
				A2(
				$author$project$Game$Playground$moveX,
				ll,
				$author$project$Game$Playground$group(wll.eK)),
				A2(
				$author$project$Game$Playground$moveX,
				rr,
				$author$project$Game$Playground$group(wrr.eK))
			]);
		var regions = A2(
			$elm$core$Dict$union,
			A2(
				$elm$core$Dict$map,
				function (_v0) {
					return $author$project$Game$Window$moveRegionX(ll);
				},
				wll.eL),
			A2(
				$elm$core$Dict$map,
				function (_v1) {
					return $author$project$Game$Window$moveRegionX(rr);
				},
				wrr.eL));
		return {eK: draw, eL: regions};
	});
var $author$project$Game$Window$square = F3(
	function (a, window, screen) {
		var w = screen.aS;
		var h = screen.ax;
		var m = A2($elm$core$Basics$min, w, h);
		var wSquare = window(
			A2($author$project$Game$Window$mkScreen, m, m));
		var _v0 = A3(
			$author$project$Game$Window$align,
			a,
			_Utils_Tuple2(m, m),
			_Utils_Tuple2(w, h));
		var ax = _v0.a;
		var ay = _v0.b;
		var draw = _List_fromArray(
			[
				A2(
				$author$project$Game$Playground$moveY,
				ay,
				A2(
					$author$project$Game$Playground$moveX,
					ax,
					$author$project$Game$Playground$group(wSquare.eK)))
			]);
		return {
			eK: draw,
			eL: A2(
				$elm$core$Dict$map,
				function (_v1) {
					return A2(
						$elm$core$Basics$composeL,
						$author$project$Game$Window$moveRegionX(ax),
						$author$project$Game$Window$moveRegionY(ay));
				},
				wSquare.eL)
		};
	});
var $author$project$Game$Draw$drawMap = F5(
	function (computer, st, regions, speed, showPane) {
		var m = st.ad;
		var ps = st.c6;
		var wbackground = $author$project$Game$Window$rectangle($author$project$Game$Draw$backgroundColor);
		var wboard = A2(
			$author$project$Game$Window$square,
			1,
			A3(
				$author$project$Game$Window$matrix,
				$author$project$Game$State$mapsize,
				$author$project$Game$State$mapsize,
				F2(
					function (l, c) {
						return A3(
							$author$project$Game$Draw$drawExtCell,
							l,
							c,
							A2(
								$author$project$Game$State$getExtCell,
								_Utils_Tuple2(l, c),
								st));
					})));
		var wplayers = A3(
			$author$project$Game$Window$matrix,
			4,
			1,
			F2(
				function (l, c) {
					return A2(
						$author$project$Game$Draw$drawPlayerStatus,
						l,
						A2($author$project$Game$State$getPlayer, l, ps));
				}));
		var wbuttons = A3($author$project$Game$Draw$drawButtons, computer.eb, speed, regions);
		var wtimew = A4(
			$author$project$Game$Window$wordsWith,
			$author$project$Game$Playground$darkGrey,
			$elm$core$String$fromInt(st.cE),
			0,
			'000');
		var wtime = A3(
			$author$project$Game$Window$right,
			function (w) {
				return w * 0.7;
			},
			A4(
				$author$project$Game$Window$zoom,
				function (w) {
					return w * 0.8;
				},
				$elm$core$Basics$identity,
				1,
				$author$project$Game$Window$image('../graphics/clock.gif')),
			wtimew);
		var wpane = A3(
			$author$project$Game$Window$top,
			function (h) {
				return h * 0.2;
			},
			wplayers,
			A3(
				$author$project$Game$Window$bottom,
				function (h) {
					return h * 0.25;
				},
				wbuttons,
				wtime));
		return showPane ? $author$project$Game$Window$group(
			_List_fromArray(
				[
					wbackground,
					A3(
					$author$project$Game$Window$right,
					function (w) {
						return w * 0.25;
					},
					wboard,
					wpane)
				])) : wboard;
	});
var $author$project$Game$Main$regionsGame = F2(
	function (computer, st) {
		return A6($author$project$Game$Draw$drawMap, computer, st, $elm$core$Maybe$Nothing, 5, true, computer.b0).eL;
	});
var $author$project$Game$Main$updateAnimate = F4(
	function (computer, msg, s0, _v0) {
		var st = _v0.a;
		var rs = _v0.b;
		var speed = _v0.c;
		switch (msg.$) {
			case 1:
				return (speed === 10) ? _Utils_Tuple3(
					A2(
						$author$project$Game$State$advanceTime,
						$author$project$Game$State$checkGameEnd,
						A2($author$project$Game$State$advanceTime, $author$project$Game$State$checkGameEnd, st)),
					rs,
					speed) : ((speed === 5) ? _Utils_Tuple3(
					A2($author$project$Game$State$advanceTime, $author$project$Game$State$checkGameEnd, st),
					rs,
					speed) : (((speed === 2) && (!A2($elm$core$Basics$modBy, 2, computer.dv))) ? _Utils_Tuple3(
					A2($author$project$Game$State$advanceTime, $author$project$Game$State$checkGameEnd, st),
					rs,
					speed) : (((speed === 1) && (!A2($elm$core$Basics$modBy, 5, computer.dv))) ? _Utils_Tuple3(
					A2($author$project$Game$State$advanceTime, $author$project$Game$State$checkGameEnd, st),
					rs,
					speed) : _Utils_Tuple3(st, rs, speed))));
			case 5:
				var w = msg.a;
				var h = msg.b;
				return _Utils_Tuple3(
					st,
					A2(
						$author$project$Game$Main$regionsGame,
						_Utils_update(
							computer,
							{
								b0: A2($author$project$Game$Playground$toScreen, w, h)
							}),
						st),
					speed);
			case 8:
				var _v2 = A3(
					$elm$core$Dict$foldl,
					F3(
						function (k, v, s) {
							return A2($author$project$Game$Window$mouseInsideRegion, computer.eb, v) ? A3($author$project$Game$Main$clickButton, k, s0, s) : s;
						}),
					_Utils_Tuple2(st, speed),
					rs);
				var stN = _v2.a;
				var speedN = _v2.b;
				return _Utils_Tuple3(stN, rs, speedN);
			default:
				return _Utils_Tuple3(st, rs, speed);
		}
	});
var $author$project$Game$Main$readPlayerMove = function (key) {
	switch (key) {
		case 'e':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(0, 4));
		case 'w':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(0, 0));
		case 's':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(0, 1));
		case 'a':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(0, 2));
		case 'd':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(0, 3));
		case 'y':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(1, 4));
		case 't':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(1, 0));
		case 'g':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(1, 1));
		case 'f':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(1, 2));
		case 'h':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(1, 3));
		case 'o':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(2, 4));
		case 'i':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(2, 0));
		case 'k':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(2, 1));
		case 'j':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(2, 2));
		case 'l':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(2, 3));
		case ' ':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(3, 4));
		case 'ArrowUp':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(3, 0));
		case 'ArrowDown':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(3, 1));
		case 'ArrowLeft':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(3, 2));
		case 'ArrowRight':
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(3, 3));
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Game$Main$updateGame = F3(
	function (computer, msg, st) {
		_v0$2:
		while (true) {
			switch (msg.$) {
				case 1:
					return A2($author$project$Game$State$advanceTime, $author$project$Game$State$checkGameEnd, st);
				case 0:
					if (msg.a) {
						var key = msg.b;
						var _v1 = $author$project$Game$Main$readPlayerMove(key);
						if (_v1.$ === 1) {
							return st;
						} else {
							var _v2 = _v1.a;
							var pid = _v2.a;
							var mv = _v2.b;
							return A5(
								$author$project$Game$State$makeMove,
								$author$project$Game$State$checkGameEnd,
								$elm$core$Maybe$Nothing,
								$elm$core$Maybe$Nothing,
								_Utils_Tuple2(
									pid,
									$author$project$Game$State$BotMove(mv)),
								st);
						}
					} else {
						break _v0$2;
					}
				default:
					break _v0$2;
			}
		}
		return st;
	});
var $author$project$Game$Main$updateTutorial = F4(
	function (computer, msg, checkEnd, _v0) {
		var st = _v0.a;
		var b = _v0.b;
		if (msg.$ === 1) {
			return checkEnd(st) ? _Utils_Tuple2(st, false) : (b ? _Utils_Tuple2(
				A2(
					$author$project$Game$State$advanceTime,
					function (_v2) {
						return false;
					},
					st),
				b) : _Utils_Tuple2(st, b));
		} else {
			return _Utils_Tuple2(st, b);
		}
	});
var $author$project$Game$Main$updateGameState = F3(
	function (computer, msg, st) {
		switch (st.$) {
			case 0:
				var s = st.a;
				return $author$project$Game$Main$Game(
					A3($author$project$Game$Main$updateGame, computer, msg, s));
			case 1:
				var s0 = st.a;
				var s = st.b;
				var r = st.c;
				var speed = st.d;
				var _v1 = A4(
					$author$project$Game$Main$updateAnimate,
					computer,
					msg,
					s0,
					_Utils_Tuple3(s, r, speed));
				var sN = _v1.a;
				var rN = _v1.b;
				var speedN = _v1.c;
				return A4($author$project$Game$Main$Animate, s0, sN, rN, speedN);
			default:
				var s = st.a;
				var b = st.b;
				var e = st.c;
				var _v2 = A4(
					$author$project$Game$Main$updateTutorial,
					computer,
					msg,
					e,
					_Utils_Tuple2(s, b));
				var sN = _v2.a;
				var bN = _v2.b;
				return A3($author$project$Game$Main$Tutorial, sN, bN, e);
		}
	});
var $author$project$Game$Main$viewGame = F5(
	function (computer, st, rs, speed, drawPane) {
		return A6(
			$author$project$Game$Draw$drawMap,
			computer,
			st,
			rs,
			A2($elm$core$Maybe$withDefault, 5, speed),
			drawPane,
			computer.b0).eK;
	});
var $author$project$Game$Main$viewGameState = F2(
	function (computer, st) {
		switch (st.$) {
			case 0:
				var s = st.a;
				return A5($author$project$Game$Main$viewGame, computer, s, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing, true);
			case 1:
				var s0 = st.a;
				var s = st.b;
				var rs = st.c;
				var speed = st.d;
				return A5(
					$author$project$Game$Main$viewGame,
					computer,
					s,
					$elm$core$Maybe$Just(rs),
					$elm$core$Maybe$Just(speed),
					true);
			default:
				var s = st.a;
				var b = st.b;
				var end = st.c;
				return A5(
					$author$project$Game$Main$viewGame,
					computer,
					s,
					$elm$core$Maybe$Nothing,
					$elm$core$Maybe$Just(5),
					false);
		}
	});
var $author$project$Game$Main$mainWithFlags = A5($author$project$Game$Playground$game, 5, $author$project$Game$Main$viewGameState, $author$project$Game$Main$updateGameState, $author$project$Game$Main$initGameState, $author$project$Game$Main$initGameStateRandom);
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Game$Main$main = $author$project$Game$Main$mainWithFlags;
_Platform_export({'Game':{'Main':{'init':$author$project$Game$Main$main($elm$json$Json$Decode$value)(0)}}});}(this));