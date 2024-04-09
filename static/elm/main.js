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
	if (region.bW.Y === region.cq.Y)
	{
		return 'on line ' + region.bW.Y;
	}
	return 'on lines ' + region.bW.Y + ' through ' + region.cq.Y;
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
		impl.dF,
		impl.d3,
		impl.d$,
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
		D: func(record.D),
		bX: record.bX,
		bM: record.bM
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
		var message = !tag ? value : tag < 3 ? value.a : value.D;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bX;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bM) && event.preventDefault(),
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
		impl.dF,
		impl.d3,
		impl.d$,
		function(sendToApp, initialModel) {
			var view = impl.d5;
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
		impl.dF,
		impl.d3,
		impl.d$,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bU && impl.bU(sendToApp)
			var view = impl.d5;
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
				(title !== doc.A) && (_VirtualDom_doc.title = title = doc.A);
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
	var onUrlChange = impl.dN;
	var onUrlRequest = impl.dO;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bU: function(sendToApp)
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
							&& curr.cP === next.cP
							&& curr.cy === next.cy
							&& curr.cL.a === next.cL.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		dF: function(flags)
		{
			return A3(impl.dF, flags, _Browser_getUrl(), key);
		},
		d5: impl.d5,
		d3: impl.d3,
		d$: impl.d$
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
		? { dA: 'hidden', $7: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { dA: 'mozHidden', $7: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { dA: 'msHidden', $7: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { dA: 'webkitHidden', $7: 'webkitvisibilitychange' }
		: { dA: 'hidden', $7: 'visibilitychange' };
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
		cX: _Browser_getScene(),
		c8: {
			da: _Browser_window.pageXOffset,
			db: _Browser_window.pageYOffset,
			c9: _Browser_doc.documentElement.clientWidth,
			cw: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		c9: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		cw: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
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
			cX: {
				c9: node.scrollWidth,
				cw: node.scrollHeight
			},
			c8: {
				da: node.scrollLeft,
				db: node.scrollTop,
				c9: node.clientWidth,
				cw: node.clientHeight
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
			cX: _Browser_getScene(),
			c8: {
				da: x,
				db: y,
				c9: _Browser_doc.documentElement.clientWidth,
				cw: _Browser_doc.documentElement.clientHeight
			},
			du: {
				da: x + rect.left,
				db: y + rect.top,
				c9: rect.width,
				cw: rect.height
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

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.h.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.h.b, xhr)); });
		$elm$core$Maybe$isJust(request.m) && _Http_track(router, xhr, request.m.a);

		try {
			xhr.open(request.j, request.n, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.n));
		}

		_Http_configureRequest(xhr, request);

		request.g.a && xhr.setRequestHeader('Content-Type', request.g.a);
		xhr.send(request.g.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.i; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.l.a || 0;
	xhr.responseType = request.h.d;
	xhr.withCredentials = request.df;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		n: xhr.responseURL,
		dY: xhr.status,
		dZ: xhr.statusText,
		i: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
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


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			dW: event.loaded,
			v: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			dR: event.loaded,
			v: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
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


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.dI) { flags += 'm'; }
	if (options.dn) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;


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
}var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
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
		return {cv: fragment, cy: host, cJ: path, cL: port_, cP: protocol, cQ: query};
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
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Main$LoginResponse = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var $author$project$Main$PlayModel = function (a) {
	return {$: 0, a: a};
};
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
var $elm$url$Url$Builder$crossOrigin = F3(
	function (prePath, pathSegments, parameters) {
		return prePath + ('/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters)));
	});
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
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
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $jzxhuang$http_extras$Http$Detailed$BadBody = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $jzxhuang$http_extras$Http$Detailed$BadStatus = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $jzxhuang$http_extras$Http$Detailed$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $jzxhuang$http_extras$Http$Detailed$NetworkError = {$: 2};
var $jzxhuang$http_extras$Http$Detailed$Timeout = {$: 1};
var $jzxhuang$http_extras$Http$Detailed$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 0:
				var url = response.a;
				return $elm$core$Result$Err(
					$jzxhuang$http_extras$Http$Detailed$BadUrl(url));
			case 1:
				return $elm$core$Result$Err($jzxhuang$http_extras$Http$Detailed$Timeout);
			case 2:
				return $elm$core$Result$Err($jzxhuang$http_extras$Http$Detailed$NetworkError);
			case 3:
				var metadata = response.a;
				var body = response.b;
				return $elm$core$Result$Err(
					A2($jzxhuang$http_extras$Http$Detailed$BadStatus, metadata, body));
			default:
				var metadata = response.a;
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					A2($jzxhuang$http_extras$Http$Detailed$BadBody, metadata, body),
					toResult(
						_Utils_Tuple2(metadata, body)));
		}
	});
var $jzxhuang$http_extras$Http$Detailed$responseToJson = F2(
	function (decoder, responseString) {
		return A2(
			$jzxhuang$http_extras$Http$Detailed$resolve,
			function (_v0) {
				var metadata = _v0.a;
				var body = _v0.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$json$Json$Decode$errorToString,
					A2(
						$elm$json$Json$Decode$decodeString,
						A2(
							$elm$json$Json$Decode$map,
							function (res) {
								return _Utils_Tuple2(metadata, res);
							},
							decoder),
						body));
			},
			responseString);
	});
var $jzxhuang$http_extras$Http$Detailed$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$jzxhuang$http_extras$Http$Detailed$responseToJson(decoder));
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
var $bartavelle$json_helpers$Json$Helpers$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$API$jsonDecUser = A2(
	$bartavelle$json_helpers$Json$Helpers$custom,
	$elm$json$Json$Decode$string,
	$elm$json$Json$Decode$succeed(
		function (puserEmail) {
			return {b8: puserEmail};
		}));
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {cS: reqs, c$: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.m;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.cS));
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.c$)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					df: r.df,
					g: r.g,
					h: A2(_Http_mapExpect, func, r.h),
					i: r.i,
					j: r.j,
					l: r.l,
					m: r.m,
					n: r.n
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{df: false, g: r.g, h: r.h, i: r.i, j: r.j, l: r.l, m: r.m, n: r.n}));
};
var $author$project$API$getApiLoggedin = function (toMsg) {
	var params = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		$elm$core$List$concat(_List_Nil));
	return $elm$http$Http$request(
		{
			g: $elm$http$Http$emptyBody,
			h: A2($jzxhuang$http_extras$Http$Detailed$expectJson, toMsg, $author$project$API$jsonDecUser),
			i: _List_Nil,
			j: 'GET',
			l: $elm$core$Maybe$Nothing,
			m: $elm$core$Maybe$Nothing,
			n: A3(
				$elm$url$Url$Builder$crossOrigin,
				'',
				_List_fromArray(
					['api', 'loggedin']),
				params)
		});
};
var $author$project$API$defaultGameFlags = {
	ar: _List_fromArray(
		['none', 'none', 'none', 'none'])
};
var $author$project$Page$Play$init = {aa: $author$project$API$defaultGameFlags.ar};
var $author$project$Main$init = function (flags) {
	return _Utils_Tuple2(
		{
			C: $elm$core$Maybe$Nothing,
			Q: '',
			R: '',
			p: $author$project$Main$PlayModel($author$project$Page$Play$init),
			aK: 0,
			ab: '',
			S: '',
			ac: ''
		},
		$author$project$API$getApiLoggedin(
			$author$project$Main$LoginResponse(false)));
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$subscriptions = function (model) {
	return $elm$core$Platform$Sub$none;
};
var $author$project$Main$BotModel = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$BotMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$ChallengeModel = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$ChallengeMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$API$Login = F2(
	function (email, password) {
		return {a6: email, bI: password};
	});
var $author$project$Main$LogoutResponse = function (a) {
	return {$: 9, a: a};
};
var $author$project$Main$PlayMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$RankingModel = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$RankingMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$SignupResponse = function (a) {
	return {$: 11, a: a};
};
var $author$project$Utils$errorMessage = function (e) {
	switch (e.$) {
		case 0:
			var msg = e.a;
			return msg;
		case 1:
			return 'timeout';
		case 2:
			return 'network error';
		case 3:
			var metadata = e.a;
			var body = e.b;
			return body;
		default:
			var metadata = e.a;
			var body = e.b;
			var msg = e.c;
			return msg;
	}
};
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$API$jsonDecEmpty = A2(
	$elm$json$Json$Decode$map,
	function (_v0) {
		return 0;
	},
	$elm$json$Json$Decode$value);
var $author$project$API$getApiLogout = function (toMsg) {
	var params = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		$elm$core$List$concat(_List_Nil));
	return $elm$http$Http$request(
		{
			g: $elm$http$Http$emptyBody,
			h: A2($jzxhuang$http_extras$Http$Detailed$expectJson, toMsg, $author$project$API$jsonDecEmpty),
			i: _List_Nil,
			j: 'GET',
			l: $elm$core$Maybe$Nothing,
			m: $elm$core$Maybe$Nothing,
			n: A3(
				$elm$url$Url$Builder$crossOrigin,
				'',
				_List_fromArray(
					['api', 'logout']),
				params)
		});
};
var $author$project$Main$UserInfoResponse = function (a) {
	return {$: 17, a: a};
};
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $bartavelle$json_helpers$Json$Helpers$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$bartavelle$json_helpers$Json$Helpers$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $author$project$API$jsonDecUserInfo = A3(
	$bartavelle$json_helpers$Json$Helpers$required,
	'userInfoAvatar',
	$elm$json$Json$Decode$int,
	A3(
		$bartavelle$json_helpers$Json$Helpers$required,
		'userInfoEmail',
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed(
			F2(
				function (puserInfoEmail, puserInfoAvatar) {
					return {b9: puserInfoAvatar, ca: puserInfoEmail};
				}))));
var $author$project$API$getApiUserInfo = function (toMsg) {
	var params = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		$elm$core$List$concat(_List_Nil));
	return $elm$http$Http$request(
		{
			g: $elm$http$Http$emptyBody,
			h: A2($jzxhuang$http_extras$Http$Detailed$expectJson, toMsg, $author$project$API$jsonDecUserInfo),
			i: _List_Nil,
			j: 'GET',
			l: $elm$core$Maybe$Nothing,
			m: $elm$core$Maybe$Nothing,
			n: A3(
				$elm$url$Url$Builder$crossOrigin,
				'',
				_List_fromArray(
					['api', 'userInfo']),
				params)
		});
};
var $author$project$API$UserInfo = F2(
	function (userInfoEmail, userInfoAvatar) {
		return {b9: userInfoAvatar, ca: userInfoEmail};
	});
var $author$project$Page$Bot$init = A2($author$project$API$UserInfo, '', 0);
var $author$project$Page$Challenge$Drawing = {$: 1};
var $author$project$Page$Challenge$GetOpponents = function (a) {
	return {$: 0, a: a};
};
var $author$project$API$jsonDecOpponent = A2(
	$bartavelle$json_helpers$Json$Helpers$custom,
	$elm$json$Json$Decode$string,
	$elm$json$Json$Decode$succeed(
		function (popponentName) {
			return {bF: popponentName};
		}));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$API$getApiOpponents = function (toMsg) {
	var params = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		$elm$core$List$concat(_List_Nil));
	return $elm$http$Http$request(
		{
			g: $elm$http$Http$emptyBody,
			h: A2(
				$jzxhuang$http_extras$Http$Detailed$expectJson,
				toMsg,
				$elm$json$Json$Decode$list($author$project$API$jsonDecOpponent)),
			i: _List_Nil,
			j: 'GET',
			l: $elm$core$Maybe$Nothing,
			m: $elm$core$Maybe$Nothing,
			n: A3(
				$elm$url$Url$Builder$crossOrigin,
				'',
				_List_fromArray(
					['api', 'opponents']),
				params)
		});
};
var $author$project$Page$Challenge$init = function () {
	var model = {aG: _List_Nil, aJ: $elm$core$Maybe$Nothing, r: $author$project$Page$Challenge$Drawing};
	return _Utils_Tuple2(
		model,
		$author$project$API$getApiOpponents($author$project$Page$Challenge$GetOpponents));
}();
var $author$project$Page$Ranking$Drawing = 0;
var $author$project$Page$Ranking$GetRanking = function (a) {
	return {$: 0, a: a};
};
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
var $author$project$API$jsonDecChampion = A3(
	$bartavelle$json_helpers$Json$Helpers$required,
	'champAvatar',
	$elm$json$Json$Decode$int,
	A3(
		$bartavelle$json_helpers$Json$Helpers$required,
		'champName',
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed(
			F2(
				function (pchampName, pchampAvatar) {
					return {aZ: pchampAvatar, a_: pchampName};
				}))));
var $elm$json$Json$Decode$bool = _Json_decodeBool;
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
						return {bt: pmpAvatar, bu: pmpId, bv: pmpName};
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
								return {bf: pmChampionship, bk: pmP1, bl: pmP2, bn: pmTime, bo: pmWinner};
							})))))));
var $author$project$API$jsonDecRanking = A3(
	$bartavelle$json_helpers$Json$Helpers$required,
	'rankingMatches',
	$elm$json$Json$Decode$list($author$project$API$jsonDecMatchInfo),
	A3(
		$bartavelle$json_helpers$Json$Helpers$fnullable,
		'rankingChampion',
		$author$project$API$jsonDecChampion,
		$elm$json$Json$Decode$succeed(
			F2(
				function (prankingChampion, prankingMatches) {
					return {bP: prankingChampion, bQ: prankingMatches};
				}))));
var $author$project$API$getApiRanking = function (toMsg) {
	var params = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		$elm$core$List$concat(_List_Nil));
	return $elm$http$Http$request(
		{
			g: $elm$http$Http$emptyBody,
			h: A2($jzxhuang$http_extras$Http$Detailed$expectJson, toMsg, $author$project$API$jsonDecRanking),
			i: _List_Nil,
			j: 'GET',
			l: $elm$core$Maybe$Nothing,
			m: $elm$core$Maybe$Nothing,
			n: A3(
				$elm$url$Url$Builder$crossOrigin,
				'',
				_List_fromArray(
					['api', 'ranking']),
				params)
		});
};
var $author$project$Page$Ranking$init = function () {
	var model = {
		_: {bP: $elm$core$Maybe$Nothing, bQ: _List_Nil},
		r: 0
	};
	return _Utils_Tuple2(
		model,
		$author$project$API$getApiRanking($author$project$Page$Ranking$GetRanking));
}();
var $elm$core$Platform$Cmd$map = _Platform_map;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$initPage = function (n) {
	switch (n) {
		case 0:
			return _Utils_Tuple2(
				$author$project$Main$PlayModel($author$project$Page$Play$init),
				$elm$core$Platform$Cmd$none);
		case 1:
			var _v1 = $author$project$Page$Ranking$init;
			var cmodel = _v1.a;
			var ccmd = _v1.b;
			return _Utils_Tuple2(
				$author$project$Main$RankingModel(cmodel),
				A2($elm$core$Platform$Cmd$map, $author$project$Main$RankingMsg, ccmd));
		case 2:
			return _Utils_Tuple2(
				$author$project$Main$BotModel($author$project$Page$Bot$init),
				$author$project$API$getApiUserInfo($author$project$Main$UserInfoResponse));
		default:
			var _v2 = $author$project$Page$Challenge$init;
			var cmodel = _v2.a;
			var ccmd = _v2.b;
			return _Utils_Tuple2(
				$author$project$Main$ChallengeModel(cmodel),
				A2($elm$core$Platform$Cmd$map, $author$project$Main$ChallengeMsg, ccmd));
	}
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
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
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$API$jsonEncLogin = function (val) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'email',
				$elm$json$Json$Encode$string(val.a6)),
				_Utils_Tuple2(
				'password',
				$elm$json$Json$Encode$string(val.bI))
			]));
};
var $author$project$API$postApiLogin = F2(
	function (body, toMsg) {
		var params = A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			$elm$core$List$concat(_List_Nil));
		return $elm$http$Http$request(
			{
				g: $elm$http$Http$jsonBody(
					$author$project$API$jsonEncLogin(body)),
				h: A2($jzxhuang$http_extras$Http$Detailed$expectJson, toMsg, $author$project$API$jsonDecUser),
				i: _List_Nil,
				j: 'POST',
				l: $elm$core$Maybe$Nothing,
				m: $elm$core$Maybe$Nothing,
				n: A3(
					$elm$url$Url$Builder$crossOrigin,
					'',
					_List_fromArray(
						['api', 'login']),
					params)
			});
	});
var $author$project$API$postApiSignup = F2(
	function (body, toMsg) {
		var params = A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			$elm$core$List$concat(_List_Nil));
		return $elm$http$Http$request(
			{
				g: $elm$http$Http$jsonBody(
					$author$project$API$jsonEncLogin(body)),
				h: A2($jzxhuang$http_extras$Http$Detailed$expectJson, toMsg, $author$project$API$jsonDecUser),
				i: _List_Nil,
				j: 'POST',
				l: $elm$core$Maybe$Nothing,
				m: $elm$core$Maybe$Nothing,
				n: A3(
					$elm$url$Url$Builder$crossOrigin,
					'',
					_List_fromArray(
						['api', 'signup']),
					params)
			});
	});
var $author$project$Main$setGameFrame = _Platform_outgoingPort('setGameFrame', $elm$json$Json$Encode$string);
var $author$project$Main$setValidity = _Platform_outgoingPort(
	'setValidity',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'id',
					$elm$json$Json$Encode$string($.au)),
					_Utils_Tuple2(
					'validity',
					$elm$json$Json$Encode$string($.aO))
				]));
	});
var $ktonon$elm_crypto$Crypto$SHA$Alg$SHA512 = 3;
var $ktonon$elm_crypto$Crypto$SHA$Types$WorkingVars = F8(
	function (a, b, c, d, e, f, g, h) {
		return {dd: a, di: b, dm: c, dr: d, dt: e, dx: f, dy: g, dz: h};
	});
var $ktonon$elm_word$Word$D = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $ktonon$elm_word$Word$Mismatch = {$: 2};
var $ktonon$elm_word$Word$W = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $ktonon$elm_word$Word$low31mask = 2147483647;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $ktonon$elm_word$Word$carry32 = F2(
	function (x, y) {
		var _v0 = (x >>> 31) + (y >>> 31);
		switch (_v0) {
			case 0:
				return 0;
			case 2:
				return 1;
			default:
				return (1 === ((($ktonon$elm_word$Word$low31mask & x) + ($ktonon$elm_word$Word$low31mask & y)) >>> 31)) ? 1 : 0;
		}
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Basics$pow = _Basics_pow;
var $ktonon$elm_word$Word$mod32 = function (val) {
	return A2(
		$elm$core$Basics$modBy,
		A2($elm$core$Basics$pow, 2, 32),
		val);
};
var $ktonon$elm_word$Word$add = F2(
	function (wx, wy) {
		var _v0 = _Utils_Tuple2(wx, wy);
		_v0$2:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (!_v0.b.$) {
						var x = _v0.a.a;
						var y = _v0.b.a;
						return $ktonon$elm_word$Word$W(
							$ktonon$elm_word$Word$mod32(x + y));
					} else {
						break _v0$2;
					}
				case 1:
					if (_v0.b.$ === 1) {
						var _v1 = _v0.a;
						var xh = _v1.a;
						var xl = _v1.b;
						var _v2 = _v0.b;
						var yh = _v2.a;
						var yl = _v2.b;
						var zl = xl + yl;
						var zh = (xh + yh) + A2($ktonon$elm_word$Word$carry32, xl, yl);
						return A2(
							$ktonon$elm_word$Word$D,
							$ktonon$elm_word$Word$mod32(zh),
							$ktonon$elm_word$Word$mod32(zl));
					} else {
						break _v0$2;
					}
				default:
					break _v0$2;
			}
		}
		return $ktonon$elm_word$Word$Mismatch;
	});
var $ktonon$elm_crypto$Crypto$SHA$Types$addWorkingVars = F2(
	function (x, y) {
		return A8(
			$ktonon$elm_crypto$Crypto$SHA$Types$WorkingVars,
			A2($ktonon$elm_word$Word$add, x.dd, y.dd),
			A2($ktonon$elm_word$Word$add, x.di, y.di),
			A2($ktonon$elm_word$Word$add, x.dm, y.dm),
			A2($ktonon$elm_word$Word$add, x.dr, y.dr),
			A2($ktonon$elm_word$Word$add, x.dt, y.dt),
			A2($ktonon$elm_word$Word$add, x.dx, y.dx),
			A2($ktonon$elm_word$Word$add, x.dy, y.dy),
			A2($ktonon$elm_word$Word$add, x.dz, y.dz));
	});
var $ktonon$elm_word$Word$and = F2(
	function (wx, wy) {
		var _v0 = _Utils_Tuple2(wx, wy);
		_v0$2:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (!_v0.b.$) {
						var x = _v0.a.a;
						var y = _v0.b.a;
						return $ktonon$elm_word$Word$W(x & y);
					} else {
						break _v0$2;
					}
				case 1:
					if (_v0.b.$ === 1) {
						var _v1 = _v0.a;
						var xh = _v1.a;
						var xl = _v1.b;
						var _v2 = _v0.b;
						var yh = _v2.a;
						var yl = _v2.b;
						return A2($ktonon$elm_word$Word$D, xh & yh, xl & yl);
					} else {
						break _v0$2;
					}
				default:
					break _v0$2;
			}
		}
		return $ktonon$elm_word$Word$Mismatch;
	});
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $ktonon$elm_word$Word$complement = function (word) {
	switch (word.$) {
		case 0:
			var x = word.a;
			return $ktonon$elm_word$Word$W(~x);
		case 1:
			var xh = word.a;
			var xl = word.b;
			return A2($ktonon$elm_word$Word$D, ~xh, ~xl);
		default:
			return $ktonon$elm_word$Word$Mismatch;
	}
};
var $ktonon$elm_crypto$Crypto$SHA$Alg$SHA256 = 1;
var $ktonon$elm_word$Word$Helpers$lowMask = function (n) {
	switch (n) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 3;
		case 3:
			return 7;
		case 4:
			return 15;
		case 5:
			return 31;
		case 6:
			return 63;
		case 7:
			return 127;
		case 8:
			return 255;
		case 9:
			return 511;
		case 10:
			return 1023;
		case 11:
			return 2047;
		case 12:
			return 4095;
		case 13:
			return 8191;
		case 14:
			return 16383;
		case 15:
			return 32767;
		case 16:
			return 65535;
		case 17:
			return 131071;
		case 18:
			return 262143;
		case 19:
			return 524287;
		case 20:
			return 1048575;
		case 21:
			return 2097151;
		case 22:
			return 4194303;
		case 23:
			return 8388607;
		case 24:
			return 16777215;
		case 25:
			return 33554431;
		case 26:
			return 67108863;
		case 27:
			return 134217727;
		case 28:
			return 268435455;
		case 29:
			return 536870911;
		case 30:
			return 1073741823;
		case 31:
			return 2147483647;
		default:
			return 4294967295;
	}
};
var $elm$core$Basics$ge = _Utils_ge;
var $ktonon$elm_word$Word$Helpers$safeShiftRightZfBy = F2(
	function (n, val) {
		return (n >= 32) ? 0 : (val >>> n);
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $ktonon$elm_word$Word$dShiftRightZfBy = F2(
	function (n, _v0) {
		var xh = _v0.a;
		var xl = _v0.b;
		return (n > 32) ? _Utils_Tuple2(
			0,
			A2($ktonon$elm_word$Word$Helpers$safeShiftRightZfBy, n - 32, xh)) : _Utils_Tuple2(
			A2($ktonon$elm_word$Word$Helpers$safeShiftRightZfBy, n, xh),
			A2($ktonon$elm_word$Word$Helpers$safeShiftRightZfBy, n, xl) + (($ktonon$elm_word$Word$Helpers$lowMask(n) & xh) << (32 - n)));
	});
var $ktonon$elm_word$Word$Helpers$rotatedLowBits = F2(
	function (n, val) {
		return $elm$core$Basics$add(
			($ktonon$elm_word$Word$Helpers$lowMask(n) & val) << (32 - n));
	});
var $ktonon$elm_word$Word$rotateRightBy = F2(
	function (unboundN, word) {
		switch (word.$) {
			case 0:
				var x = word.a;
				var n = A2($elm$core$Basics$modBy, 32, unboundN);
				return $ktonon$elm_word$Word$W(
					A3(
						$ktonon$elm_word$Word$Helpers$rotatedLowBits,
						n,
						x,
						A2($ktonon$elm_word$Word$Helpers$safeShiftRightZfBy, n, x)));
			case 1:
				var xh = word.a;
				var xl = word.b;
				var n = A2($elm$core$Basics$modBy, 64, unboundN);
				if (n > 32) {
					var n_ = n - 32;
					var _v1 = A2(
						$ktonon$elm_word$Word$dShiftRightZfBy,
						n_,
						_Utils_Tuple2(xl, xh));
					var zh = _v1.a;
					var zl = _v1.b;
					return A2(
						$ktonon$elm_word$Word$D,
						A3($ktonon$elm_word$Word$Helpers$rotatedLowBits, n_, xh, zh),
						zl);
				} else {
					var _v2 = A2(
						$ktonon$elm_word$Word$dShiftRightZfBy,
						n,
						_Utils_Tuple2(xh, xl));
					var zh = _v2.a;
					var zl = _v2.b;
					return A2(
						$ktonon$elm_word$Word$D,
						A3($ktonon$elm_word$Word$Helpers$rotatedLowBits, n, xl, zh),
						zl);
				}
			default:
				return $ktonon$elm_word$Word$Mismatch;
		}
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $ktonon$elm_word$Word$xor = F2(
	function (wx, wy) {
		var _v0 = _Utils_Tuple2(wx, wy);
		_v0$2:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (!_v0.b.$) {
						var x = _v0.a.a;
						var y = _v0.b.a;
						return $ktonon$elm_word$Word$W(x ^ y);
					} else {
						break _v0$2;
					}
				case 1:
					if (_v0.b.$ === 1) {
						var _v1 = _v0.a;
						var xh = _v1.a;
						var xl = _v1.b;
						var _v2 = _v0.b;
						var yh = _v2.a;
						var yl = _v2.b;
						return A2($ktonon$elm_word$Word$D, xh ^ yh, xl ^ yl);
					} else {
						break _v0$2;
					}
				default:
					break _v0$2;
			}
		}
		return $ktonon$elm_word$Word$Mismatch;
	});
var $ktonon$elm_crypto$Crypto$SHA$Process$sum0 = F2(
	function (alg, word) {
		sum0:
		while (true) {
			switch (alg) {
				case 0:
					var $temp$alg = 1,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sum0;
				case 2:
					var $temp$alg = 3,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sum0;
				case 1:
					return A2(
						$ktonon$elm_word$Word$xor,
						A2($ktonon$elm_word$Word$rotateRightBy, 22, word),
						A2(
							$ktonon$elm_word$Word$xor,
							A2($ktonon$elm_word$Word$rotateRightBy, 13, word),
							A2($ktonon$elm_word$Word$rotateRightBy, 2, word)));
				case 3:
					return A2(
						$ktonon$elm_word$Word$xor,
						A2($ktonon$elm_word$Word$rotateRightBy, 39, word),
						A2(
							$ktonon$elm_word$Word$xor,
							A2($ktonon$elm_word$Word$rotateRightBy, 34, word),
							A2($ktonon$elm_word$Word$rotateRightBy, 28, word)));
				case 4:
					var $temp$alg = 3,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sum0;
				default:
					var $temp$alg = 3,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sum0;
			}
		}
	});
var $ktonon$elm_crypto$Crypto$SHA$Process$sum1 = F2(
	function (alg, word) {
		sum1:
		while (true) {
			switch (alg) {
				case 0:
					var $temp$alg = 1,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sum1;
				case 2:
					var $temp$alg = 3,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sum1;
				case 1:
					return A2(
						$ktonon$elm_word$Word$xor,
						A2($ktonon$elm_word$Word$rotateRightBy, 25, word),
						A2(
							$ktonon$elm_word$Word$xor,
							A2($ktonon$elm_word$Word$rotateRightBy, 11, word),
							A2($ktonon$elm_word$Word$rotateRightBy, 6, word)));
				case 3:
					return A2(
						$ktonon$elm_word$Word$xor,
						A2($ktonon$elm_word$Word$rotateRightBy, 41, word),
						A2(
							$ktonon$elm_word$Word$xor,
							A2($ktonon$elm_word$Word$rotateRightBy, 18, word),
							A2($ktonon$elm_word$Word$rotateRightBy, 14, word)));
				case 4:
					var $temp$alg = 3,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sum1;
				default:
					var $temp$alg = 3,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sum1;
			}
		}
	});
var $ktonon$elm_crypto$Crypto$SHA$Process$compress = F3(
	function (alg, _v0, _v1) {
		var k = _v0.a;
		var w = _v0.b;
		var a = _v1.dd;
		var b = _v1.di;
		var c = _v1.dm;
		var d = _v1.dr;
		var e = _v1.dt;
		var f = _v1.dx;
		var g = _v1.dy;
		var h = _v1.dz;
		var s1 = A2($ktonon$elm_crypto$Crypto$SHA$Process$sum1, alg, e);
		var s0 = A2($ktonon$elm_crypto$Crypto$SHA$Process$sum0, alg, a);
		var maj = A2(
			$ktonon$elm_word$Word$xor,
			A2($ktonon$elm_word$Word$and, b, c),
			A2(
				$ktonon$elm_word$Word$xor,
				A2($ktonon$elm_word$Word$and, a, c),
				A2($ktonon$elm_word$Word$and, a, b)));
		var temp2 = A2($ktonon$elm_word$Word$add, s0, maj);
		var ch = A2(
			$ktonon$elm_word$Word$xor,
			A2(
				$ktonon$elm_word$Word$and,
				g,
				$ktonon$elm_word$Word$complement(e)),
			A2($ktonon$elm_word$Word$and, e, f));
		var temp1 = A2(
			$ktonon$elm_word$Word$add,
			w,
			A2(
				$ktonon$elm_word$Word$add,
				k,
				A2(
					$ktonon$elm_word$Word$add,
					ch,
					A2($ktonon$elm_word$Word$add, s1, h))));
		return A8(
			$ktonon$elm_crypto$Crypto$SHA$Types$WorkingVars,
			A2($ktonon$elm_word$Word$add, temp1, temp2),
			a,
			b,
			c,
			A2($ktonon$elm_word$Word$add, d, temp1),
			e,
			f,
			g);
	});
var $ktonon$elm_crypto$Crypto$SHA$Constants$roundConstants = function (alg) {
	roundConstants:
	while (true) {
		switch (alg) {
			case 0:
				var $temp$alg = 1;
				alg = $temp$alg;
				continue roundConstants;
			case 1:
				return _List_fromArray(
					[
						$ktonon$elm_word$Word$W(1116352408),
						$ktonon$elm_word$Word$W(1899447441),
						$ktonon$elm_word$Word$W(3049323471),
						$ktonon$elm_word$Word$W(3921009573),
						$ktonon$elm_word$Word$W(961987163),
						$ktonon$elm_word$Word$W(1508970993),
						$ktonon$elm_word$Word$W(2453635748),
						$ktonon$elm_word$Word$W(2870763221),
						$ktonon$elm_word$Word$W(3624381080),
						$ktonon$elm_word$Word$W(310598401),
						$ktonon$elm_word$Word$W(607225278),
						$ktonon$elm_word$Word$W(1426881987),
						$ktonon$elm_word$Word$W(1925078388),
						$ktonon$elm_word$Word$W(2162078206),
						$ktonon$elm_word$Word$W(2614888103),
						$ktonon$elm_word$Word$W(3248222580),
						$ktonon$elm_word$Word$W(3835390401),
						$ktonon$elm_word$Word$W(4022224774),
						$ktonon$elm_word$Word$W(264347078),
						$ktonon$elm_word$Word$W(604807628),
						$ktonon$elm_word$Word$W(770255983),
						$ktonon$elm_word$Word$W(1249150122),
						$ktonon$elm_word$Word$W(1555081692),
						$ktonon$elm_word$Word$W(1996064986),
						$ktonon$elm_word$Word$W(2554220882),
						$ktonon$elm_word$Word$W(2821834349),
						$ktonon$elm_word$Word$W(2952996808),
						$ktonon$elm_word$Word$W(3210313671),
						$ktonon$elm_word$Word$W(3336571891),
						$ktonon$elm_word$Word$W(3584528711),
						$ktonon$elm_word$Word$W(113926993),
						$ktonon$elm_word$Word$W(338241895),
						$ktonon$elm_word$Word$W(666307205),
						$ktonon$elm_word$Word$W(773529912),
						$ktonon$elm_word$Word$W(1294757372),
						$ktonon$elm_word$Word$W(1396182291),
						$ktonon$elm_word$Word$W(1695183700),
						$ktonon$elm_word$Word$W(1986661051),
						$ktonon$elm_word$Word$W(2177026350),
						$ktonon$elm_word$Word$W(2456956037),
						$ktonon$elm_word$Word$W(2730485921),
						$ktonon$elm_word$Word$W(2820302411),
						$ktonon$elm_word$Word$W(3259730800),
						$ktonon$elm_word$Word$W(3345764771),
						$ktonon$elm_word$Word$W(3516065817),
						$ktonon$elm_word$Word$W(3600352804),
						$ktonon$elm_word$Word$W(4094571909),
						$ktonon$elm_word$Word$W(275423344),
						$ktonon$elm_word$Word$W(430227734),
						$ktonon$elm_word$Word$W(506948616),
						$ktonon$elm_word$Word$W(659060556),
						$ktonon$elm_word$Word$W(883997877),
						$ktonon$elm_word$Word$W(958139571),
						$ktonon$elm_word$Word$W(1322822218),
						$ktonon$elm_word$Word$W(1537002063),
						$ktonon$elm_word$Word$W(1747873779),
						$ktonon$elm_word$Word$W(1955562222),
						$ktonon$elm_word$Word$W(2024104815),
						$ktonon$elm_word$Word$W(2227730452),
						$ktonon$elm_word$Word$W(2361852424),
						$ktonon$elm_word$Word$W(2428436474),
						$ktonon$elm_word$Word$W(2756734187),
						$ktonon$elm_word$Word$W(3204031479),
						$ktonon$elm_word$Word$W(3329325298)
					]);
			case 2:
				var $temp$alg = 3;
				alg = $temp$alg;
				continue roundConstants;
			case 3:
				return _List_fromArray(
					[
						A2($ktonon$elm_word$Word$D, 1116352408, 3609767458),
						A2($ktonon$elm_word$Word$D, 1899447441, 602891725),
						A2($ktonon$elm_word$Word$D, 3049323471, 3964484399),
						A2($ktonon$elm_word$Word$D, 3921009573, 2173295548),
						A2($ktonon$elm_word$Word$D, 961987163, 4081628472),
						A2($ktonon$elm_word$Word$D, 1508970993, 3053834265),
						A2($ktonon$elm_word$Word$D, 2453635748, 2937671579),
						A2($ktonon$elm_word$Word$D, 2870763221, 3664609560),
						A2($ktonon$elm_word$Word$D, 3624381080, 2734883394),
						A2($ktonon$elm_word$Word$D, 310598401, 1164996542),
						A2($ktonon$elm_word$Word$D, 607225278, 1323610764),
						A2($ktonon$elm_word$Word$D, 1426881987, 3590304994),
						A2($ktonon$elm_word$Word$D, 1925078388, 4068182383),
						A2($ktonon$elm_word$Word$D, 2162078206, 991336113),
						A2($ktonon$elm_word$Word$D, 2614888103, 633803317),
						A2($ktonon$elm_word$Word$D, 3248222580, 3479774868),
						A2($ktonon$elm_word$Word$D, 3835390401, 2666613458),
						A2($ktonon$elm_word$Word$D, 4022224774, 944711139),
						A2($ktonon$elm_word$Word$D, 264347078, 2341262773),
						A2($ktonon$elm_word$Word$D, 604807628, 2007800933),
						A2($ktonon$elm_word$Word$D, 770255983, 1495990901),
						A2($ktonon$elm_word$Word$D, 1249150122, 1856431235),
						A2($ktonon$elm_word$Word$D, 1555081692, 3175218132),
						A2($ktonon$elm_word$Word$D, 1996064986, 2198950837),
						A2($ktonon$elm_word$Word$D, 2554220882, 3999719339),
						A2($ktonon$elm_word$Word$D, 2821834349, 766784016),
						A2($ktonon$elm_word$Word$D, 2952996808, 2566594879),
						A2($ktonon$elm_word$Word$D, 3210313671, 3203337956),
						A2($ktonon$elm_word$Word$D, 3336571891, 1034457026),
						A2($ktonon$elm_word$Word$D, 3584528711, 2466948901),
						A2($ktonon$elm_word$Word$D, 113926993, 3758326383),
						A2($ktonon$elm_word$Word$D, 338241895, 168717936),
						A2($ktonon$elm_word$Word$D, 666307205, 1188179964),
						A2($ktonon$elm_word$Word$D, 773529912, 1546045734),
						A2($ktonon$elm_word$Word$D, 1294757372, 1522805485),
						A2($ktonon$elm_word$Word$D, 1396182291, 2643833823),
						A2($ktonon$elm_word$Word$D, 1695183700, 2343527390),
						A2($ktonon$elm_word$Word$D, 1986661051, 1014477480),
						A2($ktonon$elm_word$Word$D, 2177026350, 1206759142),
						A2($ktonon$elm_word$Word$D, 2456956037, 344077627),
						A2($ktonon$elm_word$Word$D, 2730485921, 1290863460),
						A2($ktonon$elm_word$Word$D, 2820302411, 3158454273),
						A2($ktonon$elm_word$Word$D, 3259730800, 3505952657),
						A2($ktonon$elm_word$Word$D, 3345764771, 106217008),
						A2($ktonon$elm_word$Word$D, 3516065817, 3606008344),
						A2($ktonon$elm_word$Word$D, 3600352804, 1432725776),
						A2($ktonon$elm_word$Word$D, 4094571909, 1467031594),
						A2($ktonon$elm_word$Word$D, 275423344, 851169720),
						A2($ktonon$elm_word$Word$D, 430227734, 3100823752),
						A2($ktonon$elm_word$Word$D, 506948616, 1363258195),
						A2($ktonon$elm_word$Word$D, 659060556, 3750685593),
						A2($ktonon$elm_word$Word$D, 883997877, 3785050280),
						A2($ktonon$elm_word$Word$D, 958139571, 3318307427),
						A2($ktonon$elm_word$Word$D, 1322822218, 3812723403),
						A2($ktonon$elm_word$Word$D, 1537002063, 2003034995),
						A2($ktonon$elm_word$Word$D, 1747873779, 3602036899),
						A2($ktonon$elm_word$Word$D, 1955562222, 1575990012),
						A2($ktonon$elm_word$Word$D, 2024104815, 1125592928),
						A2($ktonon$elm_word$Word$D, 2227730452, 2716904306),
						A2($ktonon$elm_word$Word$D, 2361852424, 442776044),
						A2($ktonon$elm_word$Word$D, 2428436474, 593698344),
						A2($ktonon$elm_word$Word$D, 2756734187, 3733110249),
						A2($ktonon$elm_word$Word$D, 3204031479, 2999351573),
						A2($ktonon$elm_word$Word$D, 3329325298, 3815920427),
						A2($ktonon$elm_word$Word$D, 3391569614, 3928383900),
						A2($ktonon$elm_word$Word$D, 3515267271, 566280711),
						A2($ktonon$elm_word$Word$D, 3940187606, 3454069534),
						A2($ktonon$elm_word$Word$D, 4118630271, 4000239992),
						A2($ktonon$elm_word$Word$D, 116418474, 1914138554),
						A2($ktonon$elm_word$Word$D, 174292421, 2731055270),
						A2($ktonon$elm_word$Word$D, 289380356, 3203993006),
						A2($ktonon$elm_word$Word$D, 460393269, 320620315),
						A2($ktonon$elm_word$Word$D, 685471733, 587496836),
						A2($ktonon$elm_word$Word$D, 852142971, 1086792851),
						A2($ktonon$elm_word$Word$D, 1017036298, 365543100),
						A2($ktonon$elm_word$Word$D, 1126000580, 2618297676),
						A2($ktonon$elm_word$Word$D, 1288033470, 3409855158),
						A2($ktonon$elm_word$Word$D, 1501505948, 4234509866),
						A2($ktonon$elm_word$Word$D, 1607167915, 987167468),
						A2($ktonon$elm_word$Word$D, 1816402316, 1246189591)
					]);
			case 4:
				var $temp$alg = 3;
				alg = $temp$alg;
				continue roundConstants;
			default:
				var $temp$alg = 3;
				alg = $temp$alg;
				continue roundConstants;
		}
	}
};
var $ktonon$elm_crypto$Crypto$SHA$Process$compressLoop = F3(
	function (alg, workingVars, messageSchedule) {
		return A3(
			$elm$core$List$foldl,
			$ktonon$elm_crypto$Crypto$SHA$Process$compress(alg),
			workingVars,
			A3(
				$elm$core$List$map2,
				F2(
					function (a, b) {
						return _Utils_Tuple2(a, b);
					}),
				$ktonon$elm_crypto$Crypto$SHA$Constants$roundConstants(alg),
				$elm$core$Array$toList(messageSchedule)));
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
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.f)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.f, tail);
		return (notAppended < 0) ? {
			k: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.k),
			e: builder.e + 1,
			f: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			k: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.k),
			e: builder.e + 1,
			f: $elm$core$Elm$JsArray$empty
		} : {k: builder.k, e: builder.e, f: appended});
	});
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$push = _JsArray_push;
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
			if (!value.$) {
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
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (!node.$) {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		k: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		e: (len / $elm$core$Array$branchFactor) | 0,
		f: tail
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
					if (!node.$) {
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
					if (!node.$) {
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
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $ktonon$elm_crypto$Crypto$SHA$MessageSchedule$at = function (i) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Array$get(i),
		$elm$core$Maybe$withDefault($ktonon$elm_word$Word$Mismatch));
};
var $ktonon$elm_word$Word$shiftRightZfBy = F2(
	function (n, word) {
		switch (word.$) {
			case 0:
				var x = word.a;
				return $ktonon$elm_word$Word$W(
					A2($ktonon$elm_word$Word$Helpers$safeShiftRightZfBy, n, x));
			case 1:
				var xh = word.a;
				var xl = word.b;
				var _v1 = A2(
					$ktonon$elm_word$Word$dShiftRightZfBy,
					n,
					_Utils_Tuple2(xh, xl));
				var zh = _v1.a;
				var zl = _v1.b;
				return A2($ktonon$elm_word$Word$D, zh, zl);
			default:
				return $ktonon$elm_word$Word$Mismatch;
		}
	});
var $ktonon$elm_crypto$Crypto$SHA$MessageSchedule$sigma0 = F2(
	function (alg, word) {
		sigma0:
		while (true) {
			switch (alg) {
				case 0:
					var $temp$alg = 1,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sigma0;
				case 2:
					var $temp$alg = 3,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sigma0;
				case 1:
					return A2(
						$ktonon$elm_word$Word$xor,
						A2($ktonon$elm_word$Word$shiftRightZfBy, 3, word),
						A2(
							$ktonon$elm_word$Word$xor,
							A2($ktonon$elm_word$Word$rotateRightBy, 18, word),
							A2($ktonon$elm_word$Word$rotateRightBy, 7, word)));
				case 3:
					return A2(
						$ktonon$elm_word$Word$xor,
						A2($ktonon$elm_word$Word$shiftRightZfBy, 7, word),
						A2(
							$ktonon$elm_word$Word$xor,
							A2($ktonon$elm_word$Word$rotateRightBy, 8, word),
							A2($ktonon$elm_word$Word$rotateRightBy, 1, word)));
				case 4:
					var $temp$alg = 3,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sigma0;
				default:
					var $temp$alg = 3,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sigma0;
			}
		}
	});
var $ktonon$elm_crypto$Crypto$SHA$MessageSchedule$sigma1 = F2(
	function (alg, word) {
		sigma1:
		while (true) {
			switch (alg) {
				case 0:
					var $temp$alg = 1,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sigma1;
				case 2:
					var $temp$alg = 3,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sigma1;
				case 1:
					return A2(
						$ktonon$elm_word$Word$xor,
						A2($ktonon$elm_word$Word$shiftRightZfBy, 10, word),
						A2(
							$ktonon$elm_word$Word$xor,
							A2($ktonon$elm_word$Word$rotateRightBy, 19, word),
							A2($ktonon$elm_word$Word$rotateRightBy, 17, word)));
				case 3:
					return A2(
						$ktonon$elm_word$Word$xor,
						A2($ktonon$elm_word$Word$shiftRightZfBy, 6, word),
						A2(
							$ktonon$elm_word$Word$xor,
							A2($ktonon$elm_word$Word$rotateRightBy, 61, word),
							A2($ktonon$elm_word$Word$rotateRightBy, 19, word)));
				case 4:
					var $temp$alg = 3,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sigma1;
				default:
					var $temp$alg = 3,
						$temp$word = word;
					alg = $temp$alg;
					word = $temp$word;
					continue sigma1;
			}
		}
	});
var $ktonon$elm_crypto$Crypto$SHA$MessageSchedule$nextPart = F3(
	function (alg, i, w) {
		var i2 = A2($ktonon$elm_crypto$Crypto$SHA$MessageSchedule$at, i - 2, w);
		var s1 = A2($ktonon$elm_crypto$Crypto$SHA$MessageSchedule$sigma1, alg, i2);
		var i15 = A2($ktonon$elm_crypto$Crypto$SHA$MessageSchedule$at, i - 15, w);
		var s0 = A2($ktonon$elm_crypto$Crypto$SHA$MessageSchedule$sigma0, alg, i15);
		return A2(
			$elm$core$Array$append,
			w,
			$elm$core$Array$fromList(
				_List_fromArray(
					[
						A2(
						$ktonon$elm_word$Word$add,
						s1,
						A2(
							$ktonon$elm_word$Word$add,
							A2($ktonon$elm_crypto$Crypto$SHA$MessageSchedule$at, i - 7, w),
							A2(
								$ktonon$elm_word$Word$add,
								s0,
								A2($ktonon$elm_crypto$Crypto$SHA$MessageSchedule$at, i - 16, w))))
					])));
	});
var $ktonon$elm_crypto$Crypto$SHA$MessageSchedule$fromChunk = F2(
	function (alg, chunk) {
		var n = $elm$core$List$length(
			$ktonon$elm_crypto$Crypto$SHA$Constants$roundConstants(alg));
		return A3(
			$elm$core$List$foldl,
			$ktonon$elm_crypto$Crypto$SHA$MessageSchedule$nextPart(alg),
			$elm$core$Array$fromList(chunk),
			A2($elm$core$List$range, 16, n - 1));
	});
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
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $ktonon$elm_crypto$Crypto$SHA$Chunk$sizeInBytes = function (alg) {
	sizeInBytes:
	while (true) {
		switch (alg) {
			case 0:
				var $temp$alg = 1;
				alg = $temp$alg;
				continue sizeInBytes;
			case 1:
				return 64;
			case 2:
				var $temp$alg = 3;
				alg = $temp$alg;
				continue sizeInBytes;
			case 3:
				return 128;
			case 4:
				var $temp$alg = 3;
				alg = $temp$alg;
				continue sizeInBytes;
			default:
				var $temp$alg = 3;
				alg = $temp$alg;
				continue sizeInBytes;
		}
	}
};
var $ktonon$elm_word$Word$sizeInBytes = function (s) {
	if (!s) {
		return 4;
	} else {
		return 8;
	}
};
var $ktonon$elm_word$Word$Bit32 = 0;
var $ktonon$elm_word$Word$Bit64 = 1;
var $ktonon$elm_crypto$Crypto$SHA$Alg$wordSize = function (alg) {
	wordSize:
	while (true) {
		switch (alg) {
			case 0:
				var $temp$alg = 1;
				alg = $temp$alg;
				continue wordSize;
			case 1:
				return 0;
			case 2:
				var $temp$alg = 3;
				alg = $temp$alg;
				continue wordSize;
			case 3:
				return 1;
			case 4:
				var $temp$alg = 3;
				alg = $temp$alg;
				continue wordSize;
			default:
				var $temp$alg = 3;
				alg = $temp$alg;
				continue wordSize;
		}
	}
};
var $ktonon$elm_crypto$Crypto$SHA$Chunk$sizeInWords = function (alg) {
	return ($ktonon$elm_crypto$Crypto$SHA$Chunk$sizeInBytes(alg) / $ktonon$elm_word$Word$sizeInBytes(
		$ktonon$elm_crypto$Crypto$SHA$Alg$wordSize(alg))) | 0;
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
var $ktonon$elm_crypto$Crypto$SHA$Chunk$next = F2(
	function (alg, words) {
		var n = $ktonon$elm_crypto$Crypto$SHA$Chunk$sizeInWords(alg);
		var chunk = A2($elm$core$List$take, n, words);
		return _Utils_Tuple2(
			$elm$core$List$isEmpty(chunk) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(chunk),
			A2($elm$core$List$drop, n, words));
	});
var $ktonon$elm_crypto$Crypto$SHA$Process$chunks_ = F3(
	function (alg, words, currentHash) {
		chunks_:
		while (true) {
			var _v0 = A2($ktonon$elm_crypto$Crypto$SHA$Chunk$next, alg, words);
			if (_v0.a.$ === 1) {
				var _v1 = _v0.a;
				return currentHash;
			} else {
				var chunk = _v0.a.a;
				var rest = _v0.b;
				var vars = A2(
					$ktonon$elm_crypto$Crypto$SHA$Types$addWorkingVars,
					currentHash,
					A3(
						$ktonon$elm_crypto$Crypto$SHA$Process$compressLoop,
						alg,
						currentHash,
						A2($ktonon$elm_crypto$Crypto$SHA$MessageSchedule$fromChunk, alg, chunk)));
				var $temp$alg = alg,
					$temp$words = rest,
					$temp$currentHash = vars;
				alg = $temp$alg;
				words = $temp$words;
				currentHash = $temp$currentHash;
				continue chunks_;
			}
		}
	});
var $ktonon$elm_crypto$Crypto$SHA$Constants$initialHashValues = function (alg) {
	switch (alg) {
		case 0:
			return A8(
				$ktonon$elm_crypto$Crypto$SHA$Types$WorkingVars,
				$ktonon$elm_word$Word$W(3238371032),
				$ktonon$elm_word$Word$W(914150663),
				$ktonon$elm_word$Word$W(812702999),
				$ktonon$elm_word$Word$W(4144912697),
				$ktonon$elm_word$Word$W(4290775857),
				$ktonon$elm_word$Word$W(1750603025),
				$ktonon$elm_word$Word$W(1694076839),
				$ktonon$elm_word$Word$W(3204075428));
		case 1:
			return A8(
				$ktonon$elm_crypto$Crypto$SHA$Types$WorkingVars,
				$ktonon$elm_word$Word$W(1779033703),
				$ktonon$elm_word$Word$W(3144134277),
				$ktonon$elm_word$Word$W(1013904242),
				$ktonon$elm_word$Word$W(2773480762),
				$ktonon$elm_word$Word$W(1359893119),
				$ktonon$elm_word$Word$W(2600822924),
				$ktonon$elm_word$Word$W(528734635),
				$ktonon$elm_word$Word$W(1541459225));
		case 2:
			return A8(
				$ktonon$elm_crypto$Crypto$SHA$Types$WorkingVars,
				A2($ktonon$elm_word$Word$D, 3418070365, 3238371032),
				A2($ktonon$elm_word$Word$D, 1654270250, 914150663),
				A2($ktonon$elm_word$Word$D, 2438529370, 812702999),
				A2($ktonon$elm_word$Word$D, 355462360, 4144912697),
				A2($ktonon$elm_word$Word$D, 1731405415, 4290775857),
				A2($ktonon$elm_word$Word$D, 2394180231, 1750603025),
				A2($ktonon$elm_word$Word$D, 3675008525, 1694076839),
				A2($ktonon$elm_word$Word$D, 1203062813, 3204075428));
		case 3:
			return A8(
				$ktonon$elm_crypto$Crypto$SHA$Types$WorkingVars,
				A2($ktonon$elm_word$Word$D, 1779033703, 4089235720),
				A2($ktonon$elm_word$Word$D, 3144134277, 2227873595),
				A2($ktonon$elm_word$Word$D, 1013904242, 4271175723),
				A2($ktonon$elm_word$Word$D, 2773480762, 1595750129),
				A2($ktonon$elm_word$Word$D, 1359893119, 2917565137),
				A2($ktonon$elm_word$Word$D, 2600822924, 725511199),
				A2($ktonon$elm_word$Word$D, 528734635, 4215389547),
				A2($ktonon$elm_word$Word$D, 1541459225, 327033209));
		case 4:
			return A8(
				$ktonon$elm_crypto$Crypto$SHA$Types$WorkingVars,
				A2($ktonon$elm_word$Word$D, 2352822216, 424955298),
				A2($ktonon$elm_word$Word$D, 1944164710, 2312950998),
				A2($ktonon$elm_word$Word$D, 502970286, 855612546),
				A2($ktonon$elm_word$Word$D, 1738396948, 1479516111),
				A2($ktonon$elm_word$Word$D, 258812777, 2077511080),
				A2($ktonon$elm_word$Word$D, 2011393907, 79989058),
				A2($ktonon$elm_word$Word$D, 1067287976, 1780299464),
				A2($ktonon$elm_word$Word$D, 286451373, 2446758561));
		default:
			return A8(
				$ktonon$elm_crypto$Crypto$SHA$Types$WorkingVars,
				A2($ktonon$elm_word$Word$D, 573645204, 4230739756),
				A2($ktonon$elm_word$Word$D, 2673172387, 3360449730),
				A2($ktonon$elm_word$Word$D, 596883563, 1867755857),
				A2($ktonon$elm_word$Word$D, 2520282905, 1497426621),
				A2($ktonon$elm_word$Word$D, 2519219938, 2827943907),
				A2($ktonon$elm_word$Word$D, 3193839141, 1401305490),
				A2($ktonon$elm_word$Word$D, 721525244, 746961066),
				A2($ktonon$elm_word$Word$D, 246885852, 2177182882));
	}
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $ktonon$elm_crypto$Crypto$SHA$Types$toSingleWord = function (word) {
	if (word.$ === 1) {
		var xh = word.a;
		var xl = word.b;
		return _List_fromArray(
			[
				$ktonon$elm_word$Word$W(xh),
				$ktonon$elm_word$Word$W(xl)
			]);
	} else {
		return _List_fromArray(
			[word]);
	}
};
var $ktonon$elm_crypto$Crypto$SHA$Types$workingVarsToWords = F2(
	function (alg, _v0) {
		var a = _v0.dd;
		var b = _v0.di;
		var c = _v0.dm;
		var d = _v0.dr;
		var e = _v0.dt;
		var f = _v0.dx;
		var g = _v0.dy;
		var h = _v0.dz;
		switch (alg) {
			case 0:
				return $elm$core$Array$fromList(
					_List_fromArray(
						[a, b, c, d, e, f, g]));
			case 1:
				return $elm$core$Array$fromList(
					_List_fromArray(
						[a, b, c, d, e, f, g, h]));
			case 2:
				return $elm$core$Array$fromList(
					_List_fromArray(
						[a, b, c, d, e, f]));
			case 3:
				return $elm$core$Array$fromList(
					_List_fromArray(
						[a, b, c, d, e, f, g, h]));
			case 4:
				return $elm$core$Array$fromList(
					A2(
						$elm$core$List$take,
						7,
						A2(
							$elm$core$List$concatMap,
							$ktonon$elm_crypto$Crypto$SHA$Types$toSingleWord,
							_List_fromArray(
								[a, b, c, d]))));
			default:
				return $elm$core$Array$fromList(
					_List_fromArray(
						[a, b, c, d]));
		}
	});
var $ktonon$elm_crypto$Crypto$SHA$Process$chunks = F2(
	function (alg, words) {
		return A2(
			$ktonon$elm_crypto$Crypto$SHA$Types$workingVarsToWords,
			alg,
			A3(
				$ktonon$elm_crypto$Crypto$SHA$Process$chunks_,
				alg,
				$elm$core$Array$toList(words),
				$ktonon$elm_crypto$Crypto$SHA$Constants$initialHashValues(alg)));
	});
var $ktonon$elm_word$Word$FourBytes = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $ktonon$elm_word$Word$int32FromBytes = function (_v0) {
	var x3 = _v0.a;
	var x2 = _v0.b;
	var x1 = _v0.c;
	var x0 = _v0.d;
	return ((x0 + (x1 * A2($elm$core$Basics$pow, 2, 8))) + (x2 * A2($elm$core$Basics$pow, 2, 16))) + (x3 * A2($elm$core$Basics$pow, 2, 24));
};
var $ktonon$elm_word$Word$pad4 = function (bytes) {
	_v0$4:
	while (true) {
		if (bytes.b) {
			if (bytes.b.b) {
				if (bytes.b.b.b) {
					if (bytes.b.b.b.b) {
						if (!bytes.b.b.b.b.b) {
							var x3 = bytes.a;
							var _v1 = bytes.b;
							var x2 = _v1.a;
							var _v2 = _v1.b;
							var x1 = _v2.a;
							var _v3 = _v2.b;
							var x0 = _v3.a;
							return A4($ktonon$elm_word$Word$FourBytes, x3, x2, x1, x0);
						} else {
							break _v0$4;
						}
					} else {
						var x3 = bytes.a;
						var _v4 = bytes.b;
						var x2 = _v4.a;
						var _v5 = _v4.b;
						var x1 = _v5.a;
						return A4($ktonon$elm_word$Word$FourBytes, x3, x2, x1, 0);
					}
				} else {
					var x3 = bytes.a;
					var _v6 = bytes.b;
					var x2 = _v6.a;
					return A4($ktonon$elm_word$Word$FourBytes, x3, x2, 0, 0);
				}
			} else {
				var x3 = bytes.a;
				return A4($ktonon$elm_word$Word$FourBytes, x3, 0, 0, 0);
			}
		} else {
			break _v0$4;
		}
	}
	return A4($ktonon$elm_word$Word$FourBytes, 0, 0, 0, 0);
};
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $ktonon$elm_word$Word$accWords = F3(
	function (wordSize, bytes, acc) {
		accWords:
		while (true) {
			var _v0 = _Utils_Tuple2(wordSize, bytes);
			_v0$2:
			while (true) {
				if (!_v0.a) {
					if (_v0.b.b) {
						if ((_v0.b.b.b && _v0.b.b.b.b) && _v0.b.b.b.b.b) {
							var _v1 = _v0.a;
							var _v2 = _v0.b;
							var x3 = _v2.a;
							var _v3 = _v2.b;
							var x2 = _v3.a;
							var _v4 = _v3.b;
							var x1 = _v4.a;
							var _v5 = _v4.b;
							var x0 = _v5.a;
							var rest = _v5.b;
							var acc2 = A2(
								$elm$core$Array$push,
								$ktonon$elm_word$Word$W(
									$ktonon$elm_word$Word$int32FromBytes(
										A4($ktonon$elm_word$Word$FourBytes, x3, x2, x1, x0))),
								acc);
							var $temp$wordSize = wordSize,
								$temp$bytes = rest,
								$temp$acc = acc2;
							wordSize = $temp$wordSize;
							bytes = $temp$bytes;
							acc = $temp$acc;
							continue accWords;
						} else {
							var _v15 = _v0.a;
							var rest = _v0.b;
							return A2(
								$elm$core$Array$push,
								$ktonon$elm_word$Word$W(
									$ktonon$elm_word$Word$int32FromBytes(
										$ktonon$elm_word$Word$pad4(rest))),
								acc);
						}
					} else {
						break _v0$2;
					}
				} else {
					if (_v0.b.b) {
						if ((((((_v0.b.b.b && _v0.b.b.b.b) && _v0.b.b.b.b.b) && _v0.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b) && _v0.b.b.b.b.b.b.b.b.b) {
							var _v6 = _v0.a;
							var _v7 = _v0.b;
							var x7 = _v7.a;
							var _v8 = _v7.b;
							var x6 = _v8.a;
							var _v9 = _v8.b;
							var x5 = _v9.a;
							var _v10 = _v9.b;
							var x4 = _v10.a;
							var _v11 = _v10.b;
							var x3 = _v11.a;
							var _v12 = _v11.b;
							var x2 = _v12.a;
							var _v13 = _v12.b;
							var x1 = _v13.a;
							var _v14 = _v13.b;
							var x0 = _v14.a;
							var rest = _v14.b;
							var acc2 = A2(
								$elm$core$Array$push,
								A2(
									$ktonon$elm_word$Word$D,
									$ktonon$elm_word$Word$int32FromBytes(
										A4($ktonon$elm_word$Word$FourBytes, x7, x6, x5, x4)),
									$ktonon$elm_word$Word$int32FromBytes(
										A4($ktonon$elm_word$Word$FourBytes, x3, x2, x1, x0))),
								acc);
							var $temp$wordSize = wordSize,
								$temp$bytes = rest,
								$temp$acc = acc2;
							wordSize = $temp$wordSize;
							bytes = $temp$bytes;
							acc = $temp$acc;
							continue accWords;
						} else {
							var _v16 = _v0.a;
							var rest = _v0.b;
							return A2(
								$elm$core$Array$push,
								A2(
									$ktonon$elm_word$Word$D,
									$ktonon$elm_word$Word$int32FromBytes(
										$ktonon$elm_word$Word$pad4(
											A2($elm$core$List$take, 4, rest))),
									$ktonon$elm_word$Word$int32FromBytes(
										$ktonon$elm_word$Word$pad4(
											A2($elm$core$List$drop, 4, rest)))),
								acc);
						}
					} else {
						break _v0$2;
					}
				}
			}
			return acc;
		}
	});
var $ktonon$elm_word$Word$fromBytes = F2(
	function (wordSize, bytes) {
		return A3($ktonon$elm_word$Word$accWords, wordSize, bytes, $elm$core$Array$empty);
	});
var $ktonon$elm_crypto$Crypto$SHA$Preprocess$messageSizeBytes = function (alg) {
	messageSizeBytes:
	while (true) {
		switch (alg) {
			case 0:
				var $temp$alg = 1;
				alg = $temp$alg;
				continue messageSizeBytes;
			case 1:
				return 8;
			case 2:
				var $temp$alg = 3;
				alg = $temp$alg;
				continue messageSizeBytes;
			case 3:
				return 16;
			case 4:
				var $temp$alg = 3;
				alg = $temp$alg;
				continue messageSizeBytes;
			default:
				var $temp$alg = 3;
				alg = $temp$alg;
				continue messageSizeBytes;
		}
	}
};
var $ktonon$elm_crypto$Crypto$SHA$Chunk$sizeInBits = A2(
	$elm$core$Basics$composeR,
	$ktonon$elm_crypto$Crypto$SHA$Chunk$sizeInBytes,
	$elm$core$Basics$mul(8));
var $ktonon$elm_crypto$Crypto$SHA$Preprocess$calculateK = F2(
	function (alg, l) {
		var c = $ktonon$elm_crypto$Crypto$SHA$Chunk$sizeInBits(alg);
		return A2(
			$elm$core$Basics$modBy,
			c,
			((c - 1) - (8 * $ktonon$elm_crypto$Crypto$SHA$Preprocess$messageSizeBytes(alg))) - A2($elm$core$Basics$modBy, c, l));
	});
var $ktonon$elm_word$Word$Bytes$fromInt = F2(
	function (byteCount, value) {
		return (byteCount > 4) ? A2(
			$elm$core$List$append,
			A2(
				$ktonon$elm_word$Word$Bytes$fromInt,
				byteCount - 4,
				(value / A2($elm$core$Basics$pow, 2, 32)) | 0),
			A2($ktonon$elm_word$Word$Bytes$fromInt, 4, 4294967295 & value)) : A2(
			$elm$core$List$map,
			function (i) {
				return 255 & (value >>> ((byteCount - i) * A2($elm$core$Basics$pow, 2, 3)));
			},
			A2($elm$core$List$range, 1, byteCount));
	});
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
var $ktonon$elm_crypto$Crypto$SHA$Preprocess$postfix = F2(
	function (alg, messageSize) {
		return $elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[128]),
					A2(
					$elm$core$List$repeat,
					((A2($ktonon$elm_crypto$Crypto$SHA$Preprocess$calculateK, alg, messageSize) - 7) / 8) | 0,
					0),
					A2(
					$ktonon$elm_word$Word$Bytes$fromInt,
					$ktonon$elm_crypto$Crypto$SHA$Preprocess$messageSizeBytes(alg),
					messageSize)
				]));
	});
var $ktonon$elm_crypto$Crypto$SHA$Preprocess$preprocess = F2(
	function (alg, message) {
		return A2(
			$elm$core$List$append,
			message,
			A2(
				$ktonon$elm_crypto$Crypto$SHA$Preprocess$postfix,
				alg,
				8 * $elm$core$List$length(message)));
	});
var $ktonon$elm_crypto$Crypto$SHA$digest = function (alg) {
	return A2(
		$elm$core$Basics$composeR,
		$ktonon$elm_crypto$Crypto$SHA$Preprocess$preprocess(alg),
		A2(
			$elm$core$Basics$composeR,
			$ktonon$elm_word$Word$fromBytes(
				$ktonon$elm_crypto$Crypto$SHA$Alg$wordSize(alg)),
			$ktonon$elm_crypto$Crypto$SHA$Process$chunks(alg)));
};
var $elm$core$Bitwise$or = _Bitwise_or;
var $ktonon$elm_word$Word$Bytes$splitUtf8 = function (x) {
	return (x < 128) ? _List_fromArray(
		[x]) : ((x < 2048) ? _List_fromArray(
		[192 | ((1984 & x) >>> 6), 128 | (63 & x)]) : _List_fromArray(
		[224 | ((61440 & x) >>> 12), 128 | ((4032 & x) >>> 6), 128 | (63 & x)]));
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $ktonon$elm_word$Word$Bytes$fromUTF8 = A2(
	$elm$core$Basics$composeR,
	$elm$core$String$toList,
	A2(
		$elm$core$List$foldl,
		F2(
			function (_char, acc) {
				return A2(
					$elm$core$List$append,
					acc,
					$ktonon$elm_word$Word$Bytes$splitUtf8(
						$elm$core$Char$toCode(_char)));
			}),
		_List_Nil));
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
var $ktonon$elm_word$Word$Hex$fromArray = function (toHex) {
	return A2(
		$elm$core$Array$foldl,
		F2(
			function (val, acc) {
				return _Utils_ap(
					acc,
					toHex(val));
			}),
		'');
};
var $elm$core$String$cons = _String_cons;
var $elm$core$Char$fromCode = _Char_fromCode;
var $ktonon$elm_word$Word$Hex$fromIntAccumulator = function (x) {
	return $elm$core$String$cons(
		$elm$core$Char$fromCode(
			(x < 10) ? (x + 48) : ((x + 97) - 10)));
};
var $ktonon$elm_word$Word$Hex$fromInt = F2(
	function (charCount, value) {
		return A3(
			$elm$core$List$foldl,
			function (i) {
				return $ktonon$elm_word$Word$Hex$fromIntAccumulator(
					15 & (value >>> (i * A2($elm$core$Basics$pow, 2, 2))));
			},
			'',
			A2($elm$core$List$range, 0, charCount - 1));
	});
var $ktonon$elm_word$Word$Hex$fromWord = function (word) {
	switch (word.$) {
		case 0:
			var x = word.a;
			return A2($ktonon$elm_word$Word$Hex$fromInt, 8, x);
		case 1:
			var h = word.a;
			var l = word.b;
			return _Utils_ap(
				A2($ktonon$elm_word$Word$Hex$fromInt, 8, h),
				A2($ktonon$elm_word$Word$Hex$fromInt, 8, l));
		default:
			return 'M';
	}
};
var $ktonon$elm_word$Word$Hex$fromWordArray = $ktonon$elm_word$Word$Hex$fromArray($ktonon$elm_word$Word$Hex$fromWord);
var $ktonon$elm_crypto$Crypto$Hash$sha512 = function (message) {
	return $ktonon$elm_word$Word$Hex$fromWordArray(
		A2(
			$ktonon$elm_crypto$Crypto$SHA$digest,
			3,
			$ktonon$elm_word$Word$Bytes$fromUTF8(message)));
};
var $author$project$Page$Bot$ChangeAvatarResponse = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$API$postApiAvatar = F2(
	function (body, toMsg) {
		var params = A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			$elm$core$List$concat(_List_Nil));
		return $elm$http$Http$request(
			{
				g: $elm$http$Http$jsonBody(
					$elm$json$Json$Encode$int(body)),
				h: A2($jzxhuang$http_extras$Http$Detailed$expectJson, toMsg, $author$project$API$jsonDecEmpty),
				i: _List_Nil,
				j: 'POST',
				l: $elm$core$Maybe$Nothing,
				m: $elm$core$Maybe$Nothing,
				n: A3(
					$elm$url$Url$Builder$crossOrigin,
					'',
					_List_fromArray(
						['api', 'avatar']),
					params)
			});
	});
var $author$project$Page$Bot$update = F2(
	function (msg, model) {
		if (!msg.$) {
			var i = msg.a;
			return _Utils_Tuple2(
				model,
				A2(
					$author$project$API$postApiAvatar,
					i,
					$author$project$Page$Bot$ChangeAvatarResponse(i)));
		} else {
			var i = msg.a;
			var res = msg.b;
			if (res.$ === 1) {
				var err = res.a;
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			} else {
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b9: i}),
					$elm$core$Platform$Cmd$none);
			}
		}
	});
var $author$project$Page$Challenge$ChallengeResponse = function (a) {
	return {$: 3, a: a};
};
var $author$project$Page$Challenge$Error = function (a) {
	return {$: 3, a: a};
};
var $author$project$Page$Challenge$Listing = function (a) {
	return {$: 2, a: a};
};
var $author$project$Page$Challenge$ViewMatchResponse = function (a) {
	return {$: 7, a: a};
};
var $author$project$Page$Challenge$ViewMatchesResponse = function (a) {
	return {$: 5, a: a};
};
var $author$project$Page$Challenge$Waiting = {$: 0};
var $author$project$Utils$errorBody = function (e) {
	switch (e.$) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			return $elm$core$Maybe$Nothing;
		case 2:
			return $elm$core$Maybe$Nothing;
		case 3:
			var msg = e.b;
			return $elm$core$Maybe$Just(msg);
		default:
			var msg = e.b;
			return $elm$core$Maybe$Just(msg);
	}
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $truqu$elm_base64$Base64$Decode$pad = function (input) {
	var _v0 = $elm$core$String$length(input) % 4;
	switch (_v0) {
		case 3:
			return input + '=';
		case 2:
			return input + '==';
		default:
			return input;
	}
};
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $truqu$elm_base64$Base64$Decode$charToInt = function (_char) {
	switch (_char) {
		case 'A':
			return 0;
		case 'B':
			return 1;
		case 'C':
			return 2;
		case 'D':
			return 3;
		case 'E':
			return 4;
		case 'F':
			return 5;
		case 'G':
			return 6;
		case 'H':
			return 7;
		case 'I':
			return 8;
		case 'J':
			return 9;
		case 'K':
			return 10;
		case 'L':
			return 11;
		case 'M':
			return 12;
		case 'N':
			return 13;
		case 'O':
			return 14;
		case 'P':
			return 15;
		case 'Q':
			return 16;
		case 'R':
			return 17;
		case 'S':
			return 18;
		case 'T':
			return 19;
		case 'U':
			return 20;
		case 'V':
			return 21;
		case 'W':
			return 22;
		case 'X':
			return 23;
		case 'Y':
			return 24;
		case 'Z':
			return 25;
		case 'a':
			return 26;
		case 'b':
			return 27;
		case 'c':
			return 28;
		case 'd':
			return 29;
		case 'e':
			return 30;
		case 'f':
			return 31;
		case 'g':
			return 32;
		case 'h':
			return 33;
		case 'i':
			return 34;
		case 'j':
			return 35;
		case 'k':
			return 36;
		case 'l':
			return 37;
		case 'm':
			return 38;
		case 'n':
			return 39;
		case 'o':
			return 40;
		case 'p':
			return 41;
		case 'q':
			return 42;
		case 'r':
			return 43;
		case 's':
			return 44;
		case 't':
			return 45;
		case 'u':
			return 46;
		case 'v':
			return 47;
		case 'w':
			return 48;
		case 'x':
			return 49;
		case 'y':
			return 50;
		case 'z':
			return 51;
		case '0':
			return 52;
		case '1':
			return 53;
		case '2':
			return 54;
		case '3':
			return 55;
		case '4':
			return 56;
		case '5':
			return 57;
		case '6':
			return 58;
		case '7':
			return 59;
		case '8':
			return 60;
		case '9':
			return 61;
		case '+':
			return 62;
		case '/':
			return 63;
		default:
			return 0;
	}
};
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $truqu$elm_base64$Base64$Decode$intToString = A2($elm$core$Basics$composeR, $elm$core$Char$fromCode, $elm$core$String$fromChar);
var $truqu$elm_base64$Base64$Decode$add = F2(
	function (_char, _v0) {
		var curr = _v0.a;
		var need = _v0.b;
		var res = _v0.c;
		var shiftAndAdd = function (_int) {
			return (63 & _int) | (curr << 6);
		};
		return (!need) ? ((!(128 & _char)) ? _Utils_Tuple3(
			0,
			0,
			_Utils_ap(
				res,
				$truqu$elm_base64$Base64$Decode$intToString(_char))) : (((224 & _char) === 192) ? _Utils_Tuple3(31 & _char, 1, res) : (((240 & _char) === 224) ? _Utils_Tuple3(15 & _char, 2, res) : _Utils_Tuple3(7 & _char, 3, res)))) : ((need === 1) ? _Utils_Tuple3(
			0,
			0,
			_Utils_ap(
				res,
				$truqu$elm_base64$Base64$Decode$intToString(
					shiftAndAdd(_char)))) : _Utils_Tuple3(
			shiftAndAdd(_char),
			need - 1,
			res));
	});
var $truqu$elm_base64$Base64$Decode$toUTF16 = F2(
	function (_char, acc) {
		return _Utils_Tuple3(
			0,
			0,
			A2(
				$truqu$elm_base64$Base64$Decode$add,
				255 & (_char >>> 0),
				A2(
					$truqu$elm_base64$Base64$Decode$add,
					255 & (_char >>> 8),
					A2($truqu$elm_base64$Base64$Decode$add, 255 & (_char >>> 16), acc))));
	});
var $truqu$elm_base64$Base64$Decode$chomp = F2(
	function (char_, _v0) {
		var curr = _v0.a;
		var cnt = _v0.b;
		var utf8ToUtf16 = _v0.c;
		var _char = $truqu$elm_base64$Base64$Decode$charToInt(char_);
		if (cnt === 3) {
			return A2($truqu$elm_base64$Base64$Decode$toUTF16, curr | _char, utf8ToUtf16);
		} else {
			return _Utils_Tuple3((_char << ((3 - cnt) * 6)) | curr, cnt + 1, utf8ToUtf16);
		}
	});
var $elm$core$String$foldl = _String_foldl;
var $truqu$elm_base64$Base64$Decode$initial = _Utils_Tuple3(
	0,
	0,
	_Utils_Tuple3(0, 0, ''));
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$endsWith = _String_endsWith;
var $truqu$elm_base64$Base64$Decode$stripNulls = F2(
	function (input, output) {
		return A2($elm$core$String$endsWith, '==', input) ? A2($elm$core$String$dropRight, 2, output) : (A2($elm$core$String$endsWith, '=', input) ? A2($elm$core$String$dropRight, 1, output) : output);
	});
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {dE: index, dH: match, dK: number, d_: submatches};
	});
var $elm$regex$Regex$contains = _Regex_contains;
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{dn: false, dI: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $truqu$elm_base64$Base64$Decode$validBase64Regex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^([A-Za-z0-9\\/+]{4})*([A-Za-z0-9\\/+]{2}[A-Za-z0-9\\/+=]{2})?$'));
var $truqu$elm_base64$Base64$Decode$validate = function (input) {
	return A2($elm$regex$Regex$contains, $truqu$elm_base64$Base64$Decode$validBase64Regex, input) ? $elm$core$Result$Ok(input) : $elm$core$Result$Err('Invalid base64');
};
var $truqu$elm_base64$Base64$Decode$wrapUp = function (_v0) {
	var _v1 = _v0.c;
	var need = _v1.b;
	var res = _v1.c;
	return (need > 0) ? $elm$core$Result$Err('Invalid UTF-16') : $elm$core$Result$Ok(res);
};
var $truqu$elm_base64$Base64$Decode$validateAndDecode = function (input) {
	return A2(
		$elm$core$Result$map,
		$truqu$elm_base64$Base64$Decode$stripNulls(input),
		A2(
			$elm$core$Result$andThen,
			A2(
				$elm$core$Basics$composeR,
				A2($elm$core$String$foldl, $truqu$elm_base64$Base64$Decode$chomp, $truqu$elm_base64$Base64$Decode$initial),
				$truqu$elm_base64$Base64$Decode$wrapUp),
			$truqu$elm_base64$Base64$Decode$validate(input)));
};
var $truqu$elm_base64$Base64$Decode$decode = A2($elm$core$Basics$composeR, $truqu$elm_base64$Base64$Decode$pad, $truqu$elm_base64$Base64$Decode$validateAndDecode);
var $truqu$elm_base64$Base64$decode = $truqu$elm_base64$Base64$Decode$decode;
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$API$jsonDecByteString = A2(
	$elm$json$Json$Decode$map,
	A2(
		$elm$core$Basics$composeL,
		$elm$core$Result$withDefault(''),
		$truqu$elm_base64$Base64$decode),
	$elm$json$Json$Decode$string);
var $author$project$API$jsonDecRawHtml = $author$project$API$jsonDecByteString;
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
var $elm$url$Url$Builder$QueryParameter = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $elm$url$Url$Builder$string = F2(
	function (key, value) {
		return A2(
			$elm$url$Url$Builder$QueryParameter,
			$elm$url$Url$percentEncode(key),
			$elm$url$Url$percentEncode(value));
	});
var $author$project$API$getApiMatch = F2(
	function (query_id, toMsg) {
		var params = A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$String$fromInt,
								$elm$url$Url$Builder$string('id')),
							query_id)
						])
					])));
		return $elm$http$Http$request(
			{
				g: $elm$http$Http$emptyBody,
				h: A2($jzxhuang$http_extras$Http$Detailed$expectJson, toMsg, $author$project$API$jsonDecRawHtml),
				i: _List_Nil,
				j: 'GET',
				l: $elm$core$Maybe$Nothing,
				m: $elm$core$Maybe$Nothing,
				n: A3(
					$elm$url$Url$Builder$crossOrigin,
					'',
					_List_fromArray(
						['api', 'match']),
					params)
			});
	});
var $author$project$API$getApiMatches = function (toMsg) {
	var params = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		$elm$core$List$concat(_List_Nil));
	return $elm$http$Http$request(
		{
			g: $elm$http$Http$emptyBody,
			h: A2(
				$jzxhuang$http_extras$Http$Detailed$expectJson,
				toMsg,
				$elm$json$Json$Decode$list($author$project$API$jsonDecMatchInfo)),
			i: _List_Nil,
			j: 'GET',
			l: $elm$core$Maybe$Nothing,
			m: $elm$core$Maybe$Nothing,
			n: A3(
				$elm$url$Url$Builder$crossOrigin,
				'',
				_List_fromArray(
					['api', 'matches']),
				params)
		});
};
var $author$project$API$jsonEncOpponent = function (val) {
	return $elm$json$Json$Encode$string(val.bF);
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $bartavelle$json_helpers$Json$Helpers$maybeEncode = F2(
	function (e, v) {
		if (v.$ === 1) {
			return $elm$json$Json$Encode$null;
		} else {
			var a = v.a;
			return e(a);
		}
	});
var $author$project$API$postApiChallenge = F2(
	function (body, toMsg) {
		var params = A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			$elm$core$List$concat(_List_Nil));
		return $elm$http$Http$request(
			{
				g: $elm$http$Http$jsonBody(
					$bartavelle$json_helpers$Json$Helpers$maybeEncode($author$project$API$jsonEncOpponent)(body)),
				h: A2($jzxhuang$http_extras$Http$Detailed$expectJson, toMsg, $author$project$API$jsonDecMatchInfo),
				i: _List_Nil,
				j: 'POST',
				l: $elm$core$Maybe$Nothing,
				m: $elm$core$Maybe$Nothing,
				n: A3(
					$elm$url$Url$Builder$crossOrigin,
					'',
					_List_fromArray(
						['api', 'challenge']),
					params)
			});
	});
var $author$project$Page$Challenge$update = F3(
	function (setGameFrame, msg, model) {
		switch (msg.$) {
			case 0:
				var res = msg.a;
				if (res.$ === 1) {
					var err = res.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var _v2 = res.a;
					var opponents = _v2.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aG: opponents}),
						$elm$core$Platform$Cmd$none);
				}
			case 1:
				var o = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aJ: $elm$core$Maybe$Just(o)
						}),
					$elm$core$Platform$Cmd$none);
			case 2:
				if (!msg.a) {
					var _v3 = model.aJ;
					if (_v3.$ === 1) {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var op = _v3.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{r: $author$project$Page$Challenge$Waiting}),
							A2(
								$author$project$API$postApiChallenge,
								$elm$core$Maybe$Just(op),
								$author$project$Page$Challenge$ChallengeResponse));
					}
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{r: $author$project$Page$Challenge$Waiting}),
						A2($author$project$API$postApiChallenge, $elm$core$Maybe$Nothing, $author$project$Page$Challenge$ChallengeResponse));
				}
			case 3:
				var res = msg.a;
				if (res.$ === 1) {
					var err = res.a;
					var _v5 = $author$project$Utils$errorBody(err);
					if (!_v5.$) {
						var errmsg = _v5.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									r: $author$project$Page$Challenge$Error(errmsg)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					var _v6 = res.a;
					var match = _v6.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								r: $author$project$Page$Challenge$Listing(
									_List_fromArray(
										[match]))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 4:
				return _Utils_Tuple2(
					model,
					$author$project$API$getApiMatches($author$project$Page$Challenge$ViewMatchesResponse));
			case 5:
				var res = msg.a;
				if (res.$ === 1) {
					var err = res.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var _v8 = res.a;
					var matches = _v8.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								r: $author$project$Page$Challenge$Listing(matches)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 6:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$author$project$API$getApiMatch,
						$elm$core$Maybe$Just(id),
						$author$project$Page$Challenge$ViewMatchResponse));
			default:
				var res = msg.a;
				if (res.$ === 1) {
					var err = res.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var _v10 = res.a;
					var html = _v10.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{r: $author$project$Page$Challenge$Drawing}),
						setGameFrame(html));
				}
		}
	});
var $author$project$Page$Play$PlayResponse = function (a) {
	return {$: 2, a: a};
};
var $author$project$API$fromJSONEncoded = F2(
	function (enc, a) {
		return A2(
			$elm$json$Json$Encode$encode,
			0,
			enc(a));
	});
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$API$jsonEncGameFlags = function (val) {
	return $elm$json$Json$Encode$list($elm$json$Json$Encode$string)(val.ar);
};
var $author$project$API$getApiGame = F2(
	function (query_flags, toMsg) {
		var params = A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							A2(
								$elm$core$Basics$composeR,
								$author$project$API$fromJSONEncoded($author$project$API$jsonEncGameFlags),
								$elm$url$Url$Builder$string('flags')),
							query_flags)
						])
					])));
		return $elm$http$Http$request(
			{
				g: $elm$http$Http$emptyBody,
				h: A2($jzxhuang$http_extras$Http$Detailed$expectJson, toMsg, $author$project$API$jsonDecRawHtml),
				i: _List_Nil,
				j: 'GET',
				l: $elm$core$Maybe$Nothing,
				m: $elm$core$Maybe$Nothing,
				n: A3(
					$elm$url$Url$Builder$crossOrigin,
					'',
					_List_fromArray(
						['api', 'game']),
					params)
			});
	});
var $author$project$Page$Play$makeGameFlags = function (model) {
	return {ar: model.aa};
};
var $author$project$Utils$setNth = F3(
	function (xs, n, x) {
		var _v0 = _Utils_Tuple2(xs, n);
		if (_v0.a.b) {
			if (!_v0.b) {
				var _v1 = _v0.a;
				var y = _v1.a;
				var ys = _v1.b;
				return A2($elm$core$List$cons, x, ys);
			} else {
				var _v2 = _v0.a;
				var y = _v2.a;
				var ys = _v2.b;
				var i = _v0.b;
				return A2(
					$elm$core$List$cons,
					y,
					A3($author$project$Utils$setNth, ys, i - 1, x));
			}
		} else {
			return xs;
		}
	});
var $author$project$Page$Play$update = F3(
	function (setGameFrame, msg, model) {
		switch (msg.$) {
			case 0:
				var i = msg.a;
				var p = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aa: A3($author$project$Utils$setNth, model.aa, i, p)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var flags = $author$project$Page$Play$makeGameFlags(model);
				return _Utils_Tuple2(
					model,
					A2(
						$author$project$API$getApiGame,
						$elm$core$Maybe$Just(flags),
						$author$project$Page$Play$PlayResponse));
			default:
				var r = msg.a;
				if (r.$ === 1) {
					var err = r.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var _v2 = r.a;
					var html = _v2.b;
					return _Utils_Tuple2(
						model,
						setGameFrame(html));
				}
		}
	});
var $author$project$Page$Ranking$Listing = 1;
var $author$project$Page$Ranking$ViewMatchResponse = function (a) {
	return {$: 2, a: a};
};
var $author$project$Page$Ranking$update = F3(
	function (setGameFrame, msg, model) {
		switch (msg.$) {
			case 0:
				var res = msg.a;
				if (res.$ === 1) {
					var err = res.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var _v2 = res.a;
					var ranking = _v2.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{_: ranking, r: 1}),
						$elm$core$Platform$Cmd$none);
				}
			case 1:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$author$project$API$getApiMatch,
						$elm$core$Maybe$Just(id),
						$author$project$Page$Ranking$ViewMatchResponse));
			default:
				var res = msg.a;
				if (res.$ === 1) {
					var err = res.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var _v4 = res.a;
					var html = _v4.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{r: 0}),
						setGameFrame(html));
				}
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var k = msg.a;
				var _v1 = $author$project$Main$initPage(k);
				var pageN = _v1.a;
				var cmd = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{p: pageN, aK: k}),
					cmd);
			case 1:
				var m = msg.a;
				var _v2 = model.p;
				if (!_v2.$) {
					var a = _v2.a;
					var _v3 = A3($author$project$Page$Play$update, $author$project$Main$setGameFrame, m, a);
					var playN = _v3.a;
					var cmdN = _v3.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								p: $author$project$Main$PlayModel(playN)
							}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$PlayMsg, cmdN));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 2:
				var rmsg = msg.a;
				var _v4 = model.p;
				if (_v4.$ === 1) {
					var a = _v4.a;
					var _v5 = A3($author$project$Page$Ranking$update, $author$project$Main$setGameFrame, rmsg, a);
					var rmodel = _v5.a;
					var rcmd = _v5.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								p: $author$project$Main$RankingModel(rmodel)
							}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$RankingMsg, rcmd));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 3:
				var m = msg.a;
				var _v6 = model.p;
				if (_v6.$ === 2) {
					var info = _v6.a;
					var _v7 = A2($author$project$Page$Bot$update, m, info);
					var infoN = _v7.a;
					var cmd = _v7.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								p: $author$project$Main$BotModel(infoN)
							}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$BotMsg, cmd));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 4:
				var cmsg = msg.a;
				var _v8 = model.p;
				if (_v8.$ === 3) {
					var a = _v8.a;
					var _v9 = A3($author$project$Page$Challenge$update, $author$project$Main$setGameFrame, cmsg, a);
					var cmodel = _v9.a;
					var ccmd = _v9.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								p: $author$project$Main$ChallengeModel(cmodel)
							}),
						A2($elm$core$Platform$Cmd$map, $author$project$Main$ChallengeMsg, ccmd));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 5:
				return _Utils_Tuple2(
					model,
					A2(
						$author$project$API$postApiLogin,
						A2(
							$author$project$API$Login,
							model.Q,
							$ktonon$elm_crypto$Crypto$Hash$sha512(model.R)),
						$author$project$Main$LoginResponse(true)));
			case 6:
				return _Utils_Tuple2(
					model,
					$author$project$API$getApiLoggedin(
						$author$project$Main$LoginResponse(true)));
			case 7:
				var isVerbose = msg.a;
				var r = msg.b;
				if (!r.$) {
					var _v11 = r.a;
					var u = _v11.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								C: $elm$core$Maybe$Just(u),
								Q: '',
								R: ''
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = r.a;
					return isVerbose ? _Utils_Tuple2(
						model,
						$author$project$Main$setValidity(
							{
								au: 'loginEmail',
								aO: 'Login Failed: ' + $author$project$Utils$errorMessage(err)
							})) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 8:
				return _Utils_Tuple2(
					model,
					$author$project$API$getApiLogout($author$project$Main$LogoutResponse));
			case 9:
				var r = msg.a;
				if (!r.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{C: $elm$core$Maybe$Nothing, Q: '', R: ''}),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = r.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 10:
				return _Utils_Tuple2(
					model,
					(!_Utils_eq(model.S, model.ac)) ? $author$project$Main$setValidity(
						{au: 'signupRepeatPassword', aO: 'Passwords do not match'}) : A2(
						$author$project$API$postApiSignup,
						A2(
							$author$project$API$Login,
							model.ab,
							$ktonon$elm_crypto$Crypto$Hash$sha512(model.S)),
						$author$project$Main$SignupResponse));
			case 11:
				var r = msg.a;
				if (!r.$) {
					var _v14 = r.a;
					var u = _v14.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								C: $elm$core$Maybe$Just(u),
								ab: '',
								S: '',
								ac: ''
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = r.a;
					return _Utils_Tuple2(
						model,
						$author$project$Main$setValidity(
							{
								au: 'signupPassword',
								aO: 'Unable to create account: ' + $author$project$Utils$errorMessage(err)
							}));
				}
			case 17:
				var r = msg.a;
				if (!r.$) {
					var _v16 = r.a;
					var info = _v16.b;
					var _v17 = model.p;
					if (_v17.$ === 2) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									p: $author$project$Main$BotModel(info)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					var err = r.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 12:
				var email = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Q: email}),
					$elm$core$Platform$Cmd$none);
			case 13:
				var pass = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{R: pass}),
					$elm$core$Platform$Cmd$none);
			case 14:
				var email = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ab: email}),
					$elm$core$Platform$Cmd$none);
			case 15:
				var pass = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{S: pass}),
					$elm$core$Platform$Cmd$none);
			default:
				var pass = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ac: pass}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$SelectTab = function (a) {
	return {$: 0, a: a};
};
var $aforemny$material_components_web_elm$Material$Tab$Internal$Config = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$Tab$config = {
	cf: false,
	aT: _List_Nil,
	w: {as: $elm$core$Maybe$Nothing, ax: ''},
	bB: $elm$core$Maybe$Nothing
};
var $aforemny$material_components_web_elm$Material$TabBar$Config = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$TabBar$config = {aT: _List_Nil, aU: $elm$core$Maybe$Nothing, av: false, br: false, bV: false};
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $aforemny$material_components_web_elm$Material$Tab$Internal$Icon = function (a) {
	return {$: 0, a: a};
};
var $aforemny$material_components_web_elm$Material$Tab$customIcon = F3(
	function (node, attributes, nodes) {
		return $aforemny$material_components_web_elm$Material$Tab$Internal$Icon(
			{ak: attributes, aB: node, aC: nodes});
	});
var $elm$html$Html$i = _VirtualDom_node('i');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $aforemny$material_components_web_elm$Material$Tab$icon = function (iconName) {
	return A3(
		$aforemny$material_components_web_elm$Material$Tab$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Main$LoginEmail = function (a) {
	return {$: 12, a: a};
};
var $author$project$Main$LoginPassword = function (a) {
	return {$: 13, a: a};
};
var $author$project$Main$LoginRequest = {$: 5};
var $aforemny$material_components_web_elm$Material$Button$Internal$Config = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$Button$config = {aT: _List_Nil, a5: false, W: false, X: $elm$core$Maybe$Nothing, as: $elm$core$Maybe$Nothing, bp: $elm$core$Maybe$Nothing, bB: $elm$core$Maybe$Nothing, bZ: $elm$core$Maybe$Nothing, ah: true, aN: false};
var $aforemny$material_components_web_elm$Material$TextField$Config = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$TextField$config = {aT: _List_Nil, W: false, a7: false, aq: false, ax: $elm$core$Maybe$Nothing, cD: $elm$core$Maybe$Nothing, H: $elm$core$Maybe$Nothing, az: $elm$core$Maybe$Nothing, J: $elm$core$Maybe$Nothing, aA: $elm$core$Maybe$Nothing, bz: $elm$core$Maybe$Nothing, bA: $elm$core$Maybe$Nothing, bD: $elm$core$Maybe$Nothing, bJ: $elm$core$Maybe$Nothing, aH: $elm$core$Maybe$Nothing, bL: $elm$core$Maybe$Nothing, bR: false, ae: $elm$core$Maybe$Nothing, bY: $elm$core$Maybe$Nothing, aN: $elm$core$Maybe$Nothing, b7: $elm$core$Maybe$Nothing, cb: true, aP: $elm$core$Maybe$Nothing};
var $aforemny$material_components_web_elm$Material$TextField$disabledCs = function (_v0) {
	var disabled = _v0.W;
	return disabled ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--disabled')) : $elm$core$Maybe$Nothing;
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlJson(value));
	});
var $elm$html$Html$Attributes$property = $elm$virtual_dom$VirtualDom$property;
var $aforemny$material_components_web_elm$Material$TextField$disabledProp = function (_v0) {
	var disabled = _v0.W;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'disabled',
			$elm$json$Json$Encode$bool(disabled)));
};
var $aforemny$material_components_web_elm$Material$TextField$endAlignedCs = function (_v0) {
	var endAligned = _v0.a7;
	return endAligned ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--end-aligned')) : $elm$core$Maybe$Nothing;
};
var $elm$core$Basics$not = _Basics_not;
var $aforemny$material_components_web_elm$Material$TextField$filledCs = function (outlined_) {
	return (!outlined_) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--filled')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$TextField$foucClassNamesProp = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$Attributes$property,
		'foucClassNames',
		A2(
			$elm$json$Json$Encode$list,
			$elm$json$Json$Encode$string,
			_List_fromArray(
				['mdc-text-field--label-floating']))));
var $aforemny$material_components_web_elm$Material$TextField$fullwidthCs = function (_v0) {
	var fullwidth = _v0.aq;
	return fullwidth ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--fullwidth')) : $elm$core$Maybe$Nothing;
};
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $aforemny$material_components_web_elm$Material$TextField$ariaLabelAttr = function (_v0) {
	var fullwidth = _v0.aq;
	var label = _v0.ax;
	return fullwidth ? A2(
		$elm$core$Maybe$map,
		$elm$html$Html$Attributes$attribute('aria-label'),
		label) : $elm$core$Maybe$Nothing;
};
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $aforemny$material_components_web_elm$Material$TextField$blurHandler = function (_v0) {
	var onBlur = _v0.bz;
	return A2($elm$core$Maybe$map, $elm$html$Html$Events$onBlur, onBlur);
};
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $aforemny$material_components_web_elm$Material$TextField$changeHandler = function (_v0) {
	var onChange = _v0.bA;
	return A2(
		$elm$core$Maybe$map,
		function (f) {
			return A2(
				$elm$html$Html$Events$on,
				'change',
				A2($elm$json$Json$Decode$map, f, $elm$html$Html$Events$targetValue));
		},
		onChange);
};
var $elm$html$Html$input = _VirtualDom_node('input');
var $aforemny$material_components_web_elm$Material$TextField$inputCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-text-field__input'));
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $aforemny$material_components_web_elm$Material$TextField$inputHandler = function (_v0) {
	var onInput = _v0.bD;
	return A2($elm$core$Maybe$map, $elm$html$Html$Events$onInput, onInput);
};
var $aforemny$material_components_web_elm$Material$TextField$maxLengthAttr = function (_v0) {
	var maxLength = _v0.az;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$attribute('maxLength'),
			$elm$core$String$fromInt),
		maxLength);
};
var $aforemny$material_components_web_elm$Material$TextField$minLengthAttr = function (_v0) {
	var minLength = _v0.aA;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$attribute('minLength'),
			$elm$core$String$fromInt),
		minLength);
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $aforemny$material_components_web_elm$Material$TextField$placeholderAttr = function (_v0) {
	var placeholder = _v0.aH;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$placeholder, placeholder);
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $aforemny$material_components_web_elm$Material$TextField$typeAttr = function (_v0) {
	var type_ = _v0.b7;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$type_, type_);
};
var $aforemny$material_components_web_elm$Material$TextField$inputElt = function (config_) {
	return A2(
		$elm$html$Html$input,
		A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$aforemny$material_components_web_elm$Material$TextField$inputCs,
					$aforemny$material_components_web_elm$Material$TextField$typeAttr(config_),
					$aforemny$material_components_web_elm$Material$TextField$ariaLabelAttr(config_),
					$aforemny$material_components_web_elm$Material$TextField$placeholderAttr(config_),
					$aforemny$material_components_web_elm$Material$TextField$inputHandler(config_),
					$aforemny$material_components_web_elm$Material$TextField$blurHandler(config_),
					$aforemny$material_components_web_elm$Material$TextField$changeHandler(config_),
					$aforemny$material_components_web_elm$Material$TextField$minLengthAttr(config_),
					$aforemny$material_components_web_elm$Material$TextField$maxLengthAttr(config_)
				])),
		_List_Nil);
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $aforemny$material_components_web_elm$Material$TextField$labelElt = function (_v0) {
	var label = _v0.ax;
	var value = _v0.aP;
	var fullwidth = _v0.aq;
	var floatingLabelFloatAboveCs = 'mdc-floating-label--float-above';
	var floatingLabelCs = 'mdc-floating-label';
	var _v1 = _Utils_Tuple2(fullwidth, label);
	if ((!_v1.a) && (!_v1.b.$)) {
		var str = _v1.b.a;
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					(A2($elm$core$Maybe$withDefault, '', value) !== '') ? $elm$html$Html$Attributes$class(floatingLabelCs + (' ' + floatingLabelFloatAboveCs)) : $elm$html$Html$Attributes$class(floatingLabelCs),
					A2(
					$elm$html$Html$Attributes$property,
					'foucClassNames',
					A2(
						$elm$json$Json$Encode$list,
						$elm$json$Json$Encode$string,
						_List_fromArray(
							[floatingLabelFloatAboveCs])))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(str)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $aforemny$material_components_web_elm$Material$TextField$labelFloatingCs = function (_v0) {
	var label = _v0.ax;
	var value = _v0.aP;
	var fullwidth = _v0.aq;
	return ((!fullwidth) && ((!_Utils_eq(label, $elm$core$Maybe$Nothing)) && (A2($elm$core$Maybe$withDefault, '', value) !== ''))) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--label-floating')) : $elm$core$Maybe$Nothing;
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $aforemny$material_components_web_elm$Material$TextField$iconElt = F2(
	function (modifierCs, icon_) {
		if (icon_.$ === 1) {
			return $elm$html$Html$text('');
		} else {
			if (!icon_.a.$) {
				var node = icon_.a.a.aB;
				var attributes = icon_.a.a.ak;
				var nodes = icon_.a.a.aC;
				var onInteraction = icon_.a.a.cI;
				var disabled = icon_.a.a.W;
				return A2(
					node,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('mdc-text-field__icon'),
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class(modifierCs),
							function () {
								if (!onInteraction.$) {
									var msg = onInteraction.a;
									return (!disabled) ? A2(
										$elm$core$List$cons,
										$elm$html$Html$Attributes$tabindex(0),
										A2(
											$elm$core$List$cons,
											A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
											A2(
												$elm$core$List$cons,
												$elm$html$Html$Events$onClick(msg),
												A2(
													$elm$core$List$cons,
													A2(
														$elm$html$Html$Events$on,
														'keydown',
														A2(
															$elm$json$Json$Decode$andThen,
															function (keyCode) {
																return (keyCode === 13) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('');
															},
															$elm$html$Html$Events$keyCode)),
													attributes)))) : A2(
										$elm$core$List$cons,
										$elm$html$Html$Attributes$tabindex(-1),
										A2(
											$elm$core$List$cons,
											A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
											attributes));
								} else {
									return attributes;
								}
							}())),
					nodes);
			} else {
				var node = icon_.a.a.aB;
				var attributes = icon_.a.a.ak;
				var nodes = icon_.a.a.aC;
				var onInteraction = icon_.a.a.cI;
				var disabled = icon_.a.a.W;
				return A2(
					node,
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$class('mdc-text-field__icon'),
						A2(
							$elm$core$List$cons,
							$elm$svg$Svg$Attributes$class(modifierCs),
							function () {
								if (!onInteraction.$) {
									var msg = onInteraction.a;
									return (!disabled) ? A2(
										$elm$core$List$cons,
										$elm$html$Html$Attributes$tabindex(0),
										A2(
											$elm$core$List$cons,
											A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
											A2(
												$elm$core$List$cons,
												$elm$html$Html$Events$onClick(msg),
												A2(
													$elm$core$List$cons,
													A2(
														$elm$html$Html$Events$on,
														'keydown',
														A2(
															$elm$json$Json$Decode$andThen,
															function (keyCode) {
																return (keyCode === 13) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('');
															},
															$elm$html$Html$Events$keyCode)),
													attributes)))) : A2(
										$elm$core$List$cons,
										$elm$html$Html$Attributes$tabindex(-1),
										A2(
											$elm$core$List$cons,
											A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
											attributes));
								} else {
									return attributes;
								}
							}())),
					nodes);
			}
		}
	});
var $aforemny$material_components_web_elm$Material$TextField$leadingIconElt = function (_v0) {
	var leadingIcon = _v0.cD;
	return A2($aforemny$material_components_web_elm$Material$TextField$iconElt, 'mdc-text-field__icon--leading', leadingIcon);
};
var $aforemny$material_components_web_elm$Material$TextField$lineRippleElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-line-ripple')
		]),
	_List_Nil);
var $aforemny$material_components_web_elm$Material$TextField$maxLengthProp = function (_v0) {
	var maxLength = _v0.az;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'maxLength',
			$elm$json$Json$Encode$int(
				A2($elm$core$Maybe$withDefault, -1, maxLength))));
};
var $aforemny$material_components_web_elm$Material$TextField$maxProp = function (_v0) {
	var max = _v0.H;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'max',
			$elm$json$Json$Encode$string(
				A2(
					$elm$core$Maybe$withDefault,
					'',
					A2($elm$core$Maybe$map, $elm$core$String$fromInt, max)))));
};
var $aforemny$material_components_web_elm$Material$TextField$minLengthProp = function (_v0) {
	var minLength = _v0.aA;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'minLength',
			$elm$json$Json$Encode$int(
				A2($elm$core$Maybe$withDefault, -1, minLength))));
};
var $aforemny$material_components_web_elm$Material$TextField$minProp = function (_v0) {
	var min = _v0.J;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'min',
			$elm$json$Json$Encode$string(
				A2(
					$elm$core$Maybe$withDefault,
					'',
					A2($elm$core$Maybe$map, $elm$core$String$fromInt, min)))));
};
var $aforemny$material_components_web_elm$Material$TextField$noLabelCs = function (_v0) {
	var label = _v0.ax;
	return _Utils_eq(label, $elm$core$Maybe$Nothing) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--no-label')) : $elm$core$Maybe$Nothing;
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $aforemny$material_components_web_elm$Material$TextField$notchedOutlineLeadingElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-notched-outline__leading')
		]),
	_List_Nil);
var $aforemny$material_components_web_elm$Material$TextField$notchedOutlineNotchElt = function (config_) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-notched-outline__notch')
			]),
		_List_fromArray(
			[
				$aforemny$material_components_web_elm$Material$TextField$labelElt(config_)
			]));
};
var $aforemny$material_components_web_elm$Material$TextField$notchedOutlineTrailingElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-notched-outline__trailing')
		]),
	_List_Nil);
var $aforemny$material_components_web_elm$Material$TextField$notchedOutlineElt = function (config_) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-notched-outline')
			]),
		_List_fromArray(
			[
				$aforemny$material_components_web_elm$Material$TextField$notchedOutlineLeadingElt,
				$aforemny$material_components_web_elm$Material$TextField$notchedOutlineNotchElt(config_),
				$aforemny$material_components_web_elm$Material$TextField$notchedOutlineTrailingElt
			]));
};
var $aforemny$material_components_web_elm$Material$TextField$outlinedCs = function (outlined_) {
	return outlined_ ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--outlined')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$TextField$patternProp = function (_v0) {
	var pattern = _v0.bJ;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'pattern',
			A2(
				$elm$core$Maybe$withDefault,
				$elm$json$Json$Encode$null,
				A2($elm$core$Maybe$map, $elm$json$Json$Encode$string, pattern))));
};
var $aforemny$material_components_web_elm$Material$TextField$prefixCs = $elm$html$Html$Attributes$class('mdc-text-field__affix mdc-text-field__affix--prefix');
var $aforemny$material_components_web_elm$Material$TextField$prefixElt = function (_v0) {
	var prefix = _v0.bL;
	if (!prefix.$) {
		var prefixStr = prefix.a;
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[$aforemny$material_components_web_elm$Material$TextField$prefixCs]),
			_List_fromArray(
				[
					$elm$html$Html$text(prefixStr)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $aforemny$material_components_web_elm$Material$TextField$requiredProp = function (_v0) {
	var required = _v0.bR;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'required',
			$elm$json$Json$Encode$bool(required)));
};
var $aforemny$material_components_web_elm$Material$TextField$rippleElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-text-field__ripple')
		]),
	_List_Nil);
var $aforemny$material_components_web_elm$Material$TextField$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-text-field'));
var $aforemny$material_components_web_elm$Material$TextField$stepProp = function (_v0) {
	var step = _v0.ae;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'step',
			$elm$json$Json$Encode$string(
				A2(
					$elm$core$Maybe$withDefault,
					'',
					A2($elm$core$Maybe$map, $elm$core$String$fromInt, step)))));
};
var $aforemny$material_components_web_elm$Material$TextField$suffixCs = $elm$html$Html$Attributes$class('mdc-text-field__affix mdc-text-field__affix--suffix');
var $aforemny$material_components_web_elm$Material$TextField$suffixElt = function (_v0) {
	var suffix = _v0.bY;
	if (!suffix.$) {
		var suffixStr = suffix.a;
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[$aforemny$material_components_web_elm$Material$TextField$suffixCs]),
			_List_fromArray(
				[
					$elm$html$Html$text(suffixStr)
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $aforemny$material_components_web_elm$Material$TextField$trailingIconElt = function (_v0) {
	var trailingIcon = _v0.aN;
	return A2($aforemny$material_components_web_elm$Material$TextField$iconElt, 'mdc-text-field__icon--trailing', trailingIcon);
};
var $aforemny$material_components_web_elm$Material$TextField$validProp = function (_v0) {
	var valid = _v0.cb;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'valid',
			$elm$json$Json$Encode$bool(valid)));
};
var $aforemny$material_components_web_elm$Material$TextField$valueProp = function (_v0) {
	var value = _v0.aP;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$property('value'),
			$elm$json$Json$Encode$string),
		value);
};
var $aforemny$material_components_web_elm$Material$TextField$withLeadingIconCs = function (_v0) {
	var leadingIcon = _v0.cD;
	return (!_Utils_eq(leadingIcon, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--with-leading-icon')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$TextField$withTrailingIconCs = function (_v0) {
	var trailingIcon = _v0.aN;
	return (!_Utils_eq(trailingIcon, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-text-field--with-trailing-icon')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$TextField$textField = F2(
	function (outlined_, config_) {
		var additionalAttributes = config_.aT;
		return A3(
			$elm$html$Html$node,
			'mdc-text-field',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$TextField$rootCs,
							$aforemny$material_components_web_elm$Material$TextField$noLabelCs(config_),
							$aforemny$material_components_web_elm$Material$TextField$filledCs(outlined_),
							$aforemny$material_components_web_elm$Material$TextField$outlinedCs(outlined_),
							$aforemny$material_components_web_elm$Material$TextField$fullwidthCs(config_),
							$aforemny$material_components_web_elm$Material$TextField$labelFloatingCs(config_),
							$aforemny$material_components_web_elm$Material$TextField$foucClassNamesProp,
							$aforemny$material_components_web_elm$Material$TextField$disabledCs(config_),
							$aforemny$material_components_web_elm$Material$TextField$withLeadingIconCs(config_),
							$aforemny$material_components_web_elm$Material$TextField$withTrailingIconCs(config_),
							$aforemny$material_components_web_elm$Material$TextField$endAlignedCs(config_),
							$aforemny$material_components_web_elm$Material$TextField$valueProp(config_),
							$aforemny$material_components_web_elm$Material$TextField$disabledProp(config_),
							$aforemny$material_components_web_elm$Material$TextField$requiredProp(config_),
							$aforemny$material_components_web_elm$Material$TextField$validProp(config_),
							$aforemny$material_components_web_elm$Material$TextField$patternProp(config_),
							$aforemny$material_components_web_elm$Material$TextField$minLengthProp(config_),
							$aforemny$material_components_web_elm$Material$TextField$maxLengthProp(config_),
							$aforemny$material_components_web_elm$Material$TextField$minProp(config_),
							$aforemny$material_components_web_elm$Material$TextField$maxProp(config_),
							$aforemny$material_components_web_elm$Material$TextField$stepProp(config_)
						])),
				additionalAttributes),
			outlined_ ? _List_fromArray(
				[
					$aforemny$material_components_web_elm$Material$TextField$leadingIconElt(config_),
					$aforemny$material_components_web_elm$Material$TextField$prefixElt(config_),
					$aforemny$material_components_web_elm$Material$TextField$inputElt(config_),
					$aforemny$material_components_web_elm$Material$TextField$suffixElt(config_),
					$aforemny$material_components_web_elm$Material$TextField$notchedOutlineElt(config_),
					$aforemny$material_components_web_elm$Material$TextField$trailingIconElt(config_)
				]) : _List_fromArray(
				[
					$aforemny$material_components_web_elm$Material$TextField$rippleElt,
					$aforemny$material_components_web_elm$Material$TextField$leadingIconElt(config_),
					$aforemny$material_components_web_elm$Material$TextField$prefixElt(config_),
					$aforemny$material_components_web_elm$Material$TextField$inputElt(config_),
					$aforemny$material_components_web_elm$Material$TextField$suffixElt(config_),
					$aforemny$material_components_web_elm$Material$TextField$labelElt(config_),
					$aforemny$material_components_web_elm$Material$TextField$lineRippleElt,
					$aforemny$material_components_web_elm$Material$TextField$trailingIconElt(config_)
				]));
	});
var $aforemny$material_components_web_elm$Material$TextField$filled = function (config_) {
	return A2($aforemny$material_components_web_elm$Material$TextField$textField, false, config_);
};
var $elm$html$Html$form = _VirtualDom_node('form');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $aforemny$material_components_web_elm$Material$Button$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aT: additionalAttributes});
	});
var $aforemny$material_components_web_elm$Material$TextField$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aT: additionalAttributes});
	});
var $aforemny$material_components_web_elm$Material$TextField$setLabel = F2(
	function (label, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{ax: label});
	});
var $aforemny$material_components_web_elm$Material$Button$setOnClick = F2(
	function (onClick, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bB: $elm$core$Maybe$Just(onClick)
			});
	});
var $aforemny$material_components_web_elm$Material$TextField$setOnInput = F2(
	function (onInput, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bD: $elm$core$Maybe$Just(onInput)
			});
	});
var $aforemny$material_components_web_elm$Material$TextField$setPlaceholder = F2(
	function (placeholder, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aH: placeholder});
	});
var $aforemny$material_components_web_elm$Material$TextField$setRequired = F2(
	function (required, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bR: required});
	});
var $aforemny$material_components_web_elm$Material$TextField$setType = F2(
	function (type_, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{b7: type_});
	});
var $aforemny$material_components_web_elm$Material$TextField$setValue = F2(
	function (value, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aP: value});
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $aforemny$material_components_web_elm$Material$Button$Unelevated = 2;
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$button = _VirtualDom_node('button');
var $aforemny$material_components_web_elm$Material$Button$clickHandler = function (_v0) {
	var onClick = _v0.bB;
	return A2($elm$core$Maybe$map, $elm$html$Html$Events$onClick, onClick);
};
var $aforemny$material_components_web_elm$Material$Button$denseCs = function (_v0) {
	var dense = _v0.a5;
	return dense ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-button--dense')) : $elm$core$Maybe$Nothing;
};
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $aforemny$material_components_web_elm$Material$Button$disabledAttr = function (_v0) {
	var disabled = _v0.W;
	return $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$disabled(disabled));
};
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $aforemny$material_components_web_elm$Material$Button$hrefAttr = function (_v0) {
	var href = _v0.X;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$href, href);
};
var $aforemny$material_components_web_elm$Material$Button$labelElt = function (label) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-button__label')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				])));
};
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $aforemny$material_components_web_elm$Material$Button$iconElt = function (_v0) {
	var config_ = _v0;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$map($elm$core$Basics$never),
		function () {
			var _v1 = config_.as;
			if (!_v1.$) {
				if (!_v1.a.$) {
					var node = _v1.a.a.aB;
					var attributes = _v1.a.a.ak;
					var nodes = _v1.a.a.aC;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$class('mdc-button__icon'),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
									attributes)),
							nodes));
				} else {
					var node = _v1.a.a.aB;
					var attributes = _v1.a.a.ak;
					var nodes = _v1.a.a.aC;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$svg$Svg$Attributes$class('mdc-button__icon'),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
									attributes)),
							nodes));
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}());
};
var $aforemny$material_components_web_elm$Material$Button$leadingIconElt = function (config_) {
	var trailingIcon = config_.aN;
	return (!trailingIcon) ? $aforemny$material_components_web_elm$Material$Button$iconElt(config_) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$Menu$closeHandler = function (_v0) {
	var onClose = _v0.aF;
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Events$on('MDCMenuSurface:close'),
			$elm$json$Json$Decode$succeed),
		onClose);
};
var $aforemny$material_components_web_elm$Material$List$Config = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$List$config = {aT: _List_Nil, aW: false, a5: false, aw: true, aI: true, b6: false, d4: false, ce: false};
var $aforemny$material_components_web_elm$Material$List$Item$Internal$Config = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$List$avatarListCs = function (_v0) {
	var avatarList = _v0.aW;
	return avatarList ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-deprecated-list--avatar-list')) : $elm$core$Maybe$Nothing;
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
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
var $aforemny$material_components_web_elm$Material$List$clickHandler = function (listItems) {
	var getOnClick = function (listItem_) {
		switch (listItem_.$) {
			case 0:
				var onClick = listItem_.b.bB;
				return $elm$core$Maybe$Just(onClick);
			case 1:
				return $elm$core$Maybe$Nothing;
			default:
				return $elm$core$Maybe$Nothing;
		}
	};
	var nthOnClick = function (index) {
		return A2(
			$elm$core$Maybe$andThen,
			$elm$core$Basics$identity,
			$elm$core$List$head(
				A2(
					$elm$core$List$drop,
					index,
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						A2($elm$core$List$map, getOnClick, listItems)))));
	};
	var mergedClickHandler = A2(
		$elm$json$Json$Decode$andThen,
		function (index) {
			var _v0 = nthOnClick(index);
			if (!_v0.$) {
				var msg_ = _v0.a;
				return $elm$json$Json$Decode$succeed(msg_);
			} else {
				return $elm$json$Json$Decode$fail('');
			}
		},
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['detail', 'index']),
			$elm$json$Json$Decode$int));
	return $elm$core$Maybe$Just(
		A2($elm$html$Html$Events$on, 'MDCList:action', mergedClickHandler));
};
var $aforemny$material_components_web_elm$Material$List$denseCs = function (_v0) {
	var dense = _v0.a5;
	return dense ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-deprecated-list--dense')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$List$interactiveProp = function (_v0) {
	var interactive = _v0.aw;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'interactive',
			$elm$json$Json$Encode$bool(interactive)));
};
var $aforemny$material_components_web_elm$Material$List$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-deprecated-list'));
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
var $aforemny$material_components_web_elm$Material$List$selectedIndexProp = function (listItems) {
	var selectedIndex = A2(
		$elm$core$List$filterMap,
		$elm$core$Basics$identity,
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (index, listItem_) {
					switch (listItem_.$) {
						case 0:
							var selection = listItem_.b.dV;
							return (!_Utils_eq(selection, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Just(index) : $elm$core$Maybe$Nothing;
						case 1:
							return $elm$core$Maybe$Nothing;
						default:
							return $elm$core$Maybe$Nothing;
					}
				}),
			A2(
				$elm$core$List$filter,
				function (listItem_) {
					switch (listItem_.$) {
						case 0:
							return true;
						case 1:
							return false;
						default:
							return false;
					}
				},
				listItems)));
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'selectedIndex',
			A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, selectedIndex)));
};
var $aforemny$material_components_web_elm$Material$List$twoLineCs = function (_v0) {
	var twoLine = _v0.b6;
	return twoLine ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-deprecated-list--two-line')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$List$wrapFocusProp = function (_v0) {
	var wrapFocus = _v0.ce;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'wrapFocus',
			$elm$json$Json$Encode$bool(wrapFocus)));
};
var $aforemny$material_components_web_elm$Material$List$list = F3(
	function (config_, firstListItem, remainingListItems) {
		var ripples = config_.aI;
		var interactive = config_.aw;
		var additionalAttributes = config_.aT;
		var listItems = A2($elm$core$List$cons, firstListItem, remainingListItems);
		return A3(
			$elm$html$Html$node,
			'mdc-list',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$List$rootCs,
							$aforemny$material_components_web_elm$Material$List$denseCs(config_),
							$aforemny$material_components_web_elm$Material$List$avatarListCs(config_),
							$aforemny$material_components_web_elm$Material$List$twoLineCs(config_),
							$aforemny$material_components_web_elm$Material$List$wrapFocusProp(config_),
							$aforemny$material_components_web_elm$Material$List$clickHandler(listItems),
							$aforemny$material_components_web_elm$Material$List$selectedIndexProp(listItems),
							$aforemny$material_components_web_elm$Material$List$interactiveProp(config_)
						])),
				additionalAttributes),
			A2(
				$elm$core$List$map,
				function (listItem_) {
					switch (listItem_.$) {
						case 0:
							var node = listItem_.a;
							var config__ = listItem_.b;
							return node(
								_Utils_update(
									config__,
									{aI: ripples && interactive}));
						case 1:
							var node = listItem_.a;
							return node;
						default:
							var node = listItem_.a;
							return node;
					}
				},
				listItems));
	});
var $aforemny$material_components_web_elm$Material$Menu$openProp = function (_v0) {
	var open = _v0.bE;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'open',
			$elm$json$Json$Encode$bool(open)));
};
var $aforemny$material_components_web_elm$Material$Menu$quickOpenProp = function (_v0) {
	var quickOpen = _v0.bO;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'quickOpen',
			$elm$json$Json$Encode$bool(quickOpen)));
};
var $aforemny$material_components_web_elm$Material$Menu$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-menu mdc-menu-surface'));
var $aforemny$material_components_web_elm$Material$List$setRipples = F2(
	function (ripples, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aI: ripples});
	});
var $aforemny$material_components_web_elm$Material$List$setWrapFocus = F2(
	function (wrapFocus, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{ce: wrapFocus});
	});
var $aforemny$material_components_web_elm$Material$Menu$menu = F3(
	function (config_, firstListItem, remainingListItems) {
		var additionalAttributes = config_.aT;
		return A3(
			$elm$html$Html$node,
			'mdc-menu',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$Menu$rootCs,
							$aforemny$material_components_web_elm$Material$Menu$openProp(config_),
							$aforemny$material_components_web_elm$Material$Menu$quickOpenProp(config_),
							$aforemny$material_components_web_elm$Material$Menu$closeHandler(config_)
						])),
				additionalAttributes),
			_List_fromArray(
				[
					A3(
					$aforemny$material_components_web_elm$Material$List$list,
					A2(
						$aforemny$material_components_web_elm$Material$List$setWrapFocus,
						true,
						A2($aforemny$material_components_web_elm$Material$List$setRipples, false, $aforemny$material_components_web_elm$Material$List$config)),
					firstListItem,
					remainingListItems)
				]));
	});
var $aforemny$material_components_web_elm$Material$Button$rippleElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-button__ripple')
			]),
		_List_Nil));
var $aforemny$material_components_web_elm$Material$Button$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-button'));
var $aforemny$material_components_web_elm$Material$Button$tabIndexProp = function (_v0) {
	var disabled = _v0.W;
	return disabled ? $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'tabIndex',
			$elm$json$Json$Encode$int(-1))) : $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'tabIndex',
			$elm$json$Json$Encode$int(0)));
};
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $aforemny$material_components_web_elm$Material$Button$targetAttr = function (_v0) {
	var href = _v0.X;
	var target = _v0.bZ;
	return (!_Utils_eq(href, $elm$core$Maybe$Nothing)) ? A2($elm$core$Maybe$map, $elm$html$Html$Attributes$target, target) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$Button$touchCs = function (_v0) {
	var touch = _v0.ah;
	return touch ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-button--touch')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$Button$touchElt = function (_v0) {
	var touch = _v0.ah;
	return touch ? $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-button__touch')
				]),
			_List_Nil)) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$Button$trailingIconElt = function (config_) {
	var trailingIcon = config_.aN;
	return trailingIcon ? $aforemny$material_components_web_elm$Material$Button$iconElt(config_) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$Button$variantCs = function (variant) {
	switch (variant) {
		case 0:
			return $elm$core$Maybe$Nothing;
		case 1:
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-button--raised'));
		case 2:
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-button--unelevated'));
		default:
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-button--outlined'));
	}
};
var $aforemny$material_components_web_elm$Material$Button$button = F3(
	function (variant, config_, label) {
		var innerConfig = config_;
		var additionalAttributes = innerConfig.aT;
		var touch = innerConfig.ah;
		var href = innerConfig.X;
		var disabled = innerConfig.W;
		var wrapTouch = function (node) {
			return touch ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-touch-target-wrapper')
					]),
				_List_fromArray(
					[node])) : node;
		};
		var wrapMenu = function (node) {
			var _v0 = innerConfig.bp;
			if (_v0.$ === 1) {
				return node;
			} else {
				var _v1 = _v0.a;
				var menuConfig = _v1.a;
				var firstListItem = _v1.b;
				var remainingListItems = _v1.c;
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mdc-menu-surface--anchor')
						]),
					_List_fromArray(
						[
							node,
							A3($aforemny$material_components_web_elm$Material$Menu$menu, menuConfig, firstListItem, remainingListItems)
						]));
			}
		};
		return wrapMenu(
			wrapTouch(
				A3(
					$elm$html$Html$node,
					'mdc-button',
					_List_Nil,
					_List_fromArray(
						[
							A2(
							((!_Utils_eq(href, $elm$core$Maybe$Nothing)) && (!disabled)) ? $elm$html$Html$a : $elm$html$Html$button,
							_Utils_ap(
								A2(
									$elm$core$List$filterMap,
									$elm$core$Basics$identity,
									_List_fromArray(
										[
											$aforemny$material_components_web_elm$Material$Button$rootCs,
											$aforemny$material_components_web_elm$Material$Button$variantCs(variant),
											$aforemny$material_components_web_elm$Material$Button$denseCs(config_),
											$aforemny$material_components_web_elm$Material$Button$touchCs(config_),
											$aforemny$material_components_web_elm$Material$Button$disabledAttr(config_),
											$aforemny$material_components_web_elm$Material$Button$tabIndexProp(config_),
											$aforemny$material_components_web_elm$Material$Button$hrefAttr(config_),
											$aforemny$material_components_web_elm$Material$Button$targetAttr(config_),
											$aforemny$material_components_web_elm$Material$Button$clickHandler(config_)
										])),
								additionalAttributes),
							A2(
								$elm$core$List$filterMap,
								$elm$core$Basics$identity,
								_List_fromArray(
									[
										$aforemny$material_components_web_elm$Material$Button$rippleElt,
										$aforemny$material_components_web_elm$Material$Button$leadingIconElt(config_),
										$aforemny$material_components_web_elm$Material$Button$labelElt(label),
										$aforemny$material_components_web_elm$Material$Button$trailingIconElt(config_),
										$aforemny$material_components_web_elm$Material$Button$touchElt(config_)
									])))
						]))));
	});
var $aforemny$material_components_web_elm$Material$Button$unelevated = F2(
	function (config_, label) {
		return A3($aforemny$material_components_web_elm$Material$Button$button, 2, config_, label);
	});
var $author$project$Main$loginForm = function (model) {
	return A2(
		$elm$html$Html$form,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('login'),
				A2($elm$html$Html$Attributes$style, 'float', 'left')
			]),
		_List_fromArray(
			[
				$aforemny$material_components_web_elm$Material$TextField$filled(
				A2(
					$aforemny$material_components_web_elm$Material$TextField$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('loginEmail')
						]),
					A2(
						$aforemny$material_components_web_elm$Material$TextField$setType,
						$elm$core$Maybe$Just('email'),
						A2(
							$aforemny$material_components_web_elm$Material$TextField$setRequired,
							true,
							A2(
								$aforemny$material_components_web_elm$Material$TextField$setPlaceholder,
								$elm$core$Maybe$Just('some@email.com'),
								A2(
									$aforemny$material_components_web_elm$Material$TextField$setOnInput,
									$author$project$Main$LoginEmail,
									A2(
										$aforemny$material_components_web_elm$Material$TextField$setValue,
										$elm$core$Maybe$Nothing,
										A2($aforemny$material_components_web_elm$Material$TextField$setLabel, $elm$core$Maybe$Nothing, $aforemny$material_components_web_elm$Material$TextField$config)))))))),
				$aforemny$material_components_web_elm$Material$TextField$filled(
				A2(
					$aforemny$material_components_web_elm$Material$TextField$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('loginPassword')
						]),
					A2(
						$aforemny$material_components_web_elm$Material$TextField$setType,
						$elm$core$Maybe$Just('password'),
						A2(
							$aforemny$material_components_web_elm$Material$TextField$setRequired,
							true,
							A2(
								$aforemny$material_components_web_elm$Material$TextField$setPlaceholder,
								$elm$core$Maybe$Just('password'),
								A2(
									$aforemny$material_components_web_elm$Material$TextField$setOnInput,
									$author$project$Main$LoginPassword,
									A2(
										$aforemny$material_components_web_elm$Material$TextField$setValue,
										$elm$core$Maybe$Nothing,
										A2($aforemny$material_components_web_elm$Material$TextField$setLabel, $elm$core$Maybe$Nothing, $aforemny$material_components_web_elm$Material$TextField$config)))))))),
				A2(
				$aforemny$material_components_web_elm$Material$Button$unelevated,
				A2(
					$aforemny$material_components_web_elm$Material$Button$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('button')
						]),
					A2($aforemny$material_components_web_elm$Material$Button$setOnClick, $author$project$Main$LoginRequest, $aforemny$material_components_web_elm$Material$Button$config)),
				'Login')
			]));
};
var $author$project$Main$LogoutRequest = {$: 8};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $aforemny$material_components_web_elm$Material$Typography$typography = $elm$html$Html$Attributes$class('mdc-typography');
var $author$project$Main$logoutForm = function (u) {
	return A2(
		$elm$html$Html$form,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('logout')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$label,
				_List_fromArray(
					[$aforemny$material_components_web_elm$Material$Typography$typography]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src('graphics/ok.gif')
							]),
						_List_Nil),
						$elm$html$Html$text('Hi ' + (u.b8 + '!'))
					])),
				A2(
				$aforemny$material_components_web_elm$Material$Button$unelevated,
				A2(
					$aforemny$material_components_web_elm$Material$Button$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('button')
						]),
					A2($aforemny$material_components_web_elm$Material$Button$setOnClick, $author$project$Main$LogoutRequest, $aforemny$material_components_web_elm$Material$Button$config)),
				'Logout')
			]));
};
var $author$project$Main$SignupEmail = function (a) {
	return {$: 14, a: a};
};
var $author$project$Main$SignupPassword = function (a) {
	return {$: 15, a: a};
};
var $author$project$Main$SignupRepeatPassword = function (a) {
	return {$: 16, a: a};
};
var $author$project$Main$SignupRequest = {$: 10};
var $author$project$Main$signupForm = function (model) {
	return A2(
		$elm$html$Html$form,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('signup')
			]),
		_List_fromArray(
			[
				$aforemny$material_components_web_elm$Material$TextField$filled(
				A2(
					$aforemny$material_components_web_elm$Material$TextField$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('signupEmail')
						]),
					A2(
						$aforemny$material_components_web_elm$Material$TextField$setType,
						$elm$core$Maybe$Just('email'),
						A2(
							$aforemny$material_components_web_elm$Material$TextField$setRequired,
							true,
							A2(
								$aforemny$material_components_web_elm$Material$TextField$setPlaceholder,
								$elm$core$Maybe$Just('some@email.com'),
								A2(
									$aforemny$material_components_web_elm$Material$TextField$setOnInput,
									$author$project$Main$SignupEmail,
									A2(
										$aforemny$material_components_web_elm$Material$TextField$setValue,
										$elm$core$Maybe$Nothing,
										A2($aforemny$material_components_web_elm$Material$TextField$setLabel, $elm$core$Maybe$Nothing, $aforemny$material_components_web_elm$Material$TextField$config)))))))),
				$aforemny$material_components_web_elm$Material$TextField$filled(
				A2(
					$aforemny$material_components_web_elm$Material$TextField$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('signupPassword')
						]),
					A2(
						$aforemny$material_components_web_elm$Material$TextField$setType,
						$elm$core$Maybe$Just('password'),
						A2(
							$aforemny$material_components_web_elm$Material$TextField$setRequired,
							true,
							A2(
								$aforemny$material_components_web_elm$Material$TextField$setPlaceholder,
								$elm$core$Maybe$Just('password'),
								A2(
									$aforemny$material_components_web_elm$Material$TextField$setOnInput,
									$author$project$Main$SignupPassword,
									A2(
										$aforemny$material_components_web_elm$Material$TextField$setValue,
										$elm$core$Maybe$Nothing,
										A2($aforemny$material_components_web_elm$Material$TextField$setLabel, $elm$core$Maybe$Nothing, $aforemny$material_components_web_elm$Material$TextField$config)))))))),
				$aforemny$material_components_web_elm$Material$TextField$filled(
				A2(
					$aforemny$material_components_web_elm$Material$TextField$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('signupRepeatPassword')
						]),
					A2(
						$aforemny$material_components_web_elm$Material$TextField$setType,
						$elm$core$Maybe$Just('password'),
						A2(
							$aforemny$material_components_web_elm$Material$TextField$setRequired,
							true,
							A2(
								$aforemny$material_components_web_elm$Material$TextField$setPlaceholder,
								$elm$core$Maybe$Just('repeat password'),
								A2(
									$aforemny$material_components_web_elm$Material$TextField$setOnInput,
									$author$project$Main$SignupRepeatPassword,
									A2(
										$aforemny$material_components_web_elm$Material$TextField$setValue,
										$elm$core$Maybe$Nothing,
										A2($aforemny$material_components_web_elm$Material$TextField$setLabel, $elm$core$Maybe$Nothing, $aforemny$material_components_web_elm$Material$TextField$config)))))))),
				A2(
				$aforemny$material_components_web_elm$Material$Button$unelevated,
				A2(
					$aforemny$material_components_web_elm$Material$Button$setAttributes,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('button')
						]),
					A2($aforemny$material_components_web_elm$Material$Button$setOnClick, $author$project$Main$SignupRequest, $aforemny$material_components_web_elm$Material$Button$config)),
				'Signup')
			]));
};
var $author$project$Main$loginHeader = function (model) {
	var _v0 = model.C;
	if (_v0.$ === 1) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('login-header')
				]),
			_List_fromArray(
				[
					$author$project$Main$loginForm(model),
					$author$project$Main$signupForm(model)
				]));
	} else {
		var u = _v0.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('login-header')
				]),
			_List_fromArray(
				[
					$author$project$Main$logoutForm(u)
				]));
	}
};
var $aforemny$material_components_web_elm$Material$Tab$setActive = F2(
	function (active, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{cf: active});
	});
var $aforemny$material_components_web_elm$Material$Tab$setOnClick = F2(
	function (onClick, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bB: $elm$core$Maybe$Just(onClick)
			});
	});
var $aforemny$material_components_web_elm$Material$Tab$Internal$Tab = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$Tab$tab = F2(
	function (_v0, content) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{w: content});
	});
var $aforemny$material_components_web_elm$Material$TabBar$activatedHandler = function (tabs) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Events$on,
			'MDCTabBar:activated',
			A2(
				$elm$json$Json$Decode$andThen,
				function (activatedIndex) {
					var _v0 = A2(
						$elm$core$Maybe$andThen,
						function (_v1) {
							var onClick = _v1.bB;
							return onClick;
						},
						$elm$core$List$head(
							A2($elm$core$List$drop, activatedIndex, tabs)));
					if (!_v0.$) {
						var msg = _v0.a;
						return $elm$json$Json$Decode$succeed(msg);
					} else {
						return $elm$json$Json$Decode$fail('');
					}
				},
				A2(
					$elm$json$Json$Decode$at,
					_List_fromArray(
						['detail', 'index']),
					$elm$json$Json$Decode$int))));
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $aforemny$material_components_web_elm$Material$TabBar$activeTabIndexProp = function (tabs) {
	var activeTabIndex = A2(
		$elm$core$Maybe$map,
		$elm$core$Tuple$first,
		$elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (_v0) {
					var active = _v0.b.cf;
					return active;
				},
				A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, tabs))));
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			$elm$html$Html$Attributes$property('activeTabIndex'),
			$elm$json$Json$Encode$int),
		activeTabIndex);
};
var $aforemny$material_components_web_elm$Material$TabBar$anyActive = function (tabs) {
	if (!tabs.b) {
		return false;
	} else {
		var active = tabs.a.cf;
		var remainingTabs = tabs.b;
		return active || $aforemny$material_components_web_elm$Material$TabBar$anyActive(remainingTabs);
	}
};
var $aforemny$material_components_web_elm$Material$TabBar$setActive = F2(
	function (active, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{cf: active});
	});
var $aforemny$material_components_web_elm$Material$TabBar$enforceActiveHelper = function (tabs) {
	if (!tabs.b) {
		return _List_Nil;
	} else {
		var tab = tabs.a;
		var active = tab.cf;
		var remainingTabs = tabs.b;
		return (!active) ? A2(
			$elm$core$List$cons,
			tab,
			$aforemny$material_components_web_elm$Material$TabBar$enforceActiveHelper(remainingTabs)) : A2(
			$elm$core$List$cons,
			tab,
			A2(
				$elm$core$List$map,
				$aforemny$material_components_web_elm$Material$TabBar$setActive(false),
				remainingTabs));
	}
};
var $aforemny$material_components_web_elm$Material$TabBar$enforceActive = F2(
	function (firstTab, otherTabs) {
		var config_ = firstTab;
		return (!$aforemny$material_components_web_elm$Material$TabBar$anyActive(
			A2($elm$core$List$cons, firstTab, otherTabs))) ? A2(
			$elm$core$List$cons,
			A2($aforemny$material_components_web_elm$Material$TabBar$setActive, true, firstTab),
			otherTabs) : $aforemny$material_components_web_elm$Material$TabBar$enforceActiveHelper(
			A2($elm$core$List$cons, firstTab, otherTabs));
	});
var $aforemny$material_components_web_elm$Material$TabBar$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-tab-bar'));
var $aforemny$material_components_web_elm$Material$TabBar$tabScrollerAlignCs = function (align) {
	if (!align.$) {
		switch (align.a) {
			case 0:
				var _v1 = align.a;
				return $elm$core$Maybe$Just(
					$elm$html$Html$Attributes$class('mdc-tab-scroller--align-start'));
			case 1:
				var _v2 = align.a;
				return $elm$core$Maybe$Just(
					$elm$html$Html$Attributes$class('mdc-tab-scroller--align-end'));
			default:
				var _v3 = align.a;
				return $elm$core$Maybe$Just(
					$elm$html$Html$Attributes$class('mdc-tab-scroller--align-center'));
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $aforemny$material_components_web_elm$Material$TabBar$tabScrollerCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-tab-scroller'));
var $aforemny$material_components_web_elm$Material$TabBar$tabIconElt = function (_v0) {
	var icon = _v0.as;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$map($elm$core$Basics$never),
		function () {
			if (!icon.$) {
				if (!icon.a.$) {
					var node = icon.a.a.aB;
					var attributes = icon.a.a.ak;
					var nodes = icon.a.a.aC;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$class('mdc-tab__icon'),
								attributes),
							nodes));
				} else {
					var node = icon.a.a.aB;
					var attributes = icon.a.a.ak;
					var nodes = icon.a.a.aC;
					return $elm$core$Maybe$Just(
						A2(
							node,
							A2(
								$elm$core$List$cons,
								$elm$svg$Svg$Attributes$class('mdc-tab__icon'),
								attributes),
							nodes));
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}());
};
var $aforemny$material_components_web_elm$Material$TabBar$tabIndicatorContentElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-tab-indicator__content'),
			$elm$html$Html$Attributes$class('mdc-tab-indicator__content--underline')
		]),
	_List_Nil);
var $aforemny$material_components_web_elm$Material$TabBar$tabIndicatorElt = function (config_) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-tab-indicator')
				]),
			_List_fromArray(
				[$aforemny$material_components_web_elm$Material$TabBar$tabIndicatorContentElt])));
};
var $aforemny$material_components_web_elm$Material$TabBar$tabTextLabelElt = function (_v0) {
	var label = _v0.ax;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-tab__text-label')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label)
				])));
};
var $aforemny$material_components_web_elm$Material$TabBar$tabContentElt = F3(
	function (barConfig, config_, content) {
		var indicatorSpansContent = barConfig.av;
		return $elm$core$Maybe$Just(
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-tab__content')
					]),
				indicatorSpansContent ? A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$TabBar$tabIconElt(content),
							$aforemny$material_components_web_elm$Material$TabBar$tabTextLabelElt(content),
							$aforemny$material_components_web_elm$Material$TabBar$tabIndicatorElt(config_)
						])) : A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$TabBar$tabIconElt(content),
							$aforemny$material_components_web_elm$Material$TabBar$tabTextLabelElt(content)
						]))));
	});
var $aforemny$material_components_web_elm$Material$TabBar$tabCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-tab'));
var $aforemny$material_components_web_elm$Material$TabBar$tabMinWidthCs = function (_v0) {
	var minWidth = _v0.br;
	return minWidth ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-tab--min-width')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$TabBar$tabRippleElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-tab__ripple')
			]),
		_List_Nil));
var $aforemny$material_components_web_elm$Material$TabBar$tabRoleAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'tab'));
var $aforemny$material_components_web_elm$Material$TabBar$tabStackedCs = function (_v0) {
	var stacked = _v0.bV;
	return stacked ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-tab--stacked')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$TabBar$viewTab = F3(
	function (index, barConfig, tab) {
		var indicatorSpansContent = barConfig.av;
		var tabConfig = tab;
		var additionalAttributes = tabConfig.aT;
		var content = tabConfig.w;
		return A3(
			$elm$html$Html$node,
			'mdc-tab',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$TabBar$tabCs,
							$aforemny$material_components_web_elm$Material$TabBar$tabRoleAttr,
							$aforemny$material_components_web_elm$Material$TabBar$tabStackedCs(barConfig),
							$aforemny$material_components_web_elm$Material$TabBar$tabMinWidthCs(barConfig)
						])),
				additionalAttributes),
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				indicatorSpansContent ? _List_fromArray(
					[
						A3($aforemny$material_components_web_elm$Material$TabBar$tabContentElt, barConfig, tabConfig, content),
						$aforemny$material_components_web_elm$Material$TabBar$tabRippleElt
					]) : _List_fromArray(
					[
						A3($aforemny$material_components_web_elm$Material$TabBar$tabContentElt, barConfig, tabConfig, content),
						$aforemny$material_components_web_elm$Material$TabBar$tabIndicatorElt(tabConfig),
						$aforemny$material_components_web_elm$Material$TabBar$tabRippleElt
					])));
	});
var $aforemny$material_components_web_elm$Material$TabBar$tabScrollerScrollContentElt = F2(
	function (barConfig, tabs) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-tab-scroller__scroll-content')
				]),
			A2(
				$elm$core$List$indexedMap,
				function (index) {
					return A2($aforemny$material_components_web_elm$Material$TabBar$viewTab, index, barConfig);
				},
				tabs));
	});
var $aforemny$material_components_web_elm$Material$TabBar$tabScrollerScrollAreaElt = F2(
	function (barConfig, tabs) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-tab-scroller__scroll-area')
				]),
			_List_fromArray(
				[
					A2($aforemny$material_components_web_elm$Material$TabBar$tabScrollerScrollContentElt, barConfig, tabs)
				]));
	});
var $aforemny$material_components_web_elm$Material$TabBar$tabScroller = F3(
	function (config_, align, tabs) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						$aforemny$material_components_web_elm$Material$TabBar$tabScrollerCs,
						$aforemny$material_components_web_elm$Material$TabBar$tabScrollerAlignCs(align)
					])),
			_List_fromArray(
				[
					A2($aforemny$material_components_web_elm$Material$TabBar$tabScrollerScrollAreaElt, config_, tabs)
				]));
	});
var $aforemny$material_components_web_elm$Material$TabBar$tablistRoleAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'tablist'));
var $aforemny$material_components_web_elm$Material$TabBar$tabBar = F3(
	function (config_, tab_, tabs_) {
		var additionalAttributes = config_.aT;
		var align = config_.aU;
		var tabs = A2($aforemny$material_components_web_elm$Material$TabBar$enforceActive, tab_, tabs_);
		return A3(
			$elm$html$Html$node,
			'mdc-tab-bar',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$TabBar$rootCs,
							$aforemny$material_components_web_elm$Material$TabBar$tablistRoleAttr,
							$aforemny$material_components_web_elm$Material$TabBar$activeTabIndexProp(tabs),
							$aforemny$material_components_web_elm$Material$TabBar$activatedHandler(tabs)
						])),
				additionalAttributes),
			_List_fromArray(
				[
					A3($aforemny$material_components_web_elm$Material$TabBar$tabScroller, config_, align, tabs)
				]));
	});
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$Main$authenticatedPage = F2(
	function (isLoggedIn, draw) {
		return isLoggedIn ? draw : A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('page-content'),
					$elm$html$Html$Attributes$class('large'),
					$elm$html$Html$Attributes$class('theme-dark')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin', '20px 20px 10px 20px'),
							$elm$html$Html$Attributes$src('graphics/noLogin.gif')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin', '0px 20px'),
							$aforemny$material_components_web_elm$Material$Typography$typography
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Please login first. You need to be logged in to access this page.')
						]))
				]));
	});
var $author$project$Utils$isJust = function (mb) {
	if (mb.$ === 1) {
		return false;
	} else {
		return true;
	}
};
var $elm$html$Html$iframe = _VirtualDom_node('iframe');
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $author$project$Page$Bot$ChangeAvatarRequest = function (a) {
	return {$: 0, a: a};
};
var $author$project$Page$Bot$viewAvatarButton = F2(
	function (model, i) {
		var selected = _Utils_eq(model.b9, i) ? _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'background-color', 'var(--mdc-theme-primary)')
			]) : _List_Nil;
		var last = (i === 28) ? _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'margin-right', 'auto')
			]) : _List_Nil;
		var first = (i === 1) ? _List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'margin-left', 'auto')
			]) : _List_Nil;
		return A2(
			$elm$html$Html$button,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$type_('button'),
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class('mdc-icon-button'),
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$class('avatar-button'),
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Events$onClick(
								$author$project$Page$Bot$ChangeAvatarRequest(i)),
							_Utils_ap(
								selected,
								_Utils_ap(first, last)))))),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$src(
							'/graphics/players/p' + ($elm$core$String$fromInt(i) + '.gif'))
						]),
					_List_Nil)
				]));
	});
var $author$project$Page$Bot$viewChooseAvatar = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('choose-avatar')
			]),
		A2(
			$elm$core$List$map,
			$author$project$Page$Bot$viewAvatarButton(model),
			A2($elm$core$List$range, 1, 28)));
};
var $author$project$Page$Bot$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('page-content')
			]),
		_List_fromArray(
			[
				$author$project$Page$Bot$viewChooseAvatar(model),
				A2(
				$elm$html$Html$iframe,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('bot-editor'),
						$elm$html$Html$Attributes$name('bot-editor'),
						$elm$html$Html$Attributes$class('theme-dark'),
						$elm$html$Html$Attributes$src('/editor.html')
					]),
				_List_Nil)
			]));
};
var $author$project$Page$Challenge$ChallengeRequest = function (a) {
	return {$: 2, a: a};
};
var $author$project$Page$Challenge$ViewMatchesRequest = {$: 4};
var $author$project$Page$Challenge$displayFrame = F2(
	function (isMatch, status) {
		switch (status.$) {
			case 1:
				return isMatch ? 'none' : 'block';
			case 2:
				return isMatch ? 'flex' : 'none';
			default:
				return isMatch ? 'block' : 'none';
		}
	});
var $aforemny$material_components_web_elm$Material$Button$Internal$Icon = function (a) {
	return {$: 0, a: a};
};
var $aforemny$material_components_web_elm$Material$Button$customIcon = F3(
	function (node, attributes, nodes) {
		return $aforemny$material_components_web_elm$Material$Button$Internal$Icon(
			{ak: attributes, aB: node, aC: nodes});
	});
var $aforemny$material_components_web_elm$Material$Button$icon = function (iconName) {
	return A3(
		$aforemny$material_components_web_elm$Material$Button$customIcon,
		$elm$html$Html$i,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('material-icons')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(iconName)
			]));
};
var $author$project$Page$Challenge$playClass = function (status) {
	if (status.$ === 2) {
		return 'scroll';
	} else {
		return 'large';
	}
};
var $aforemny$material_components_web_elm$Material$Button$setIcon = F2(
	function (icon_, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{as: icon_});
	});
var $author$project$API$Opponent = function (opponentName) {
	return {bF: opponentName};
};
var $author$project$Page$Challenge$SelectOpponent = function (a) {
	return {$: 1, a: a};
};
var $aforemny$material_components_web_elm$Material$Select$Config = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$Select$config = {aT: _List_Nil, W: false, ax: $elm$core$Maybe$Nothing, cD: $elm$core$Maybe$Nothing, bA: $elm$core$Maybe$Nothing, bR: false, cY: $elm$core$Maybe$Nothing, cb: true};
var $aforemny$material_components_web_elm$Material$Select$Item$Internal$Config = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$Select$Item$config = function (_v0) {
	var value = _v0.aP;
	return {aT: _List_Nil, W: false, aP: value};
};
var $aforemny$material_components_web_elm$Material$Select$Outlined = 1;
var $aforemny$material_components_web_elm$Material$Select$Filled = 0;
var $aforemny$material_components_web_elm$Material$Select$anchorCs = $elm$html$Html$Attributes$class('mdc-select__anchor');
var $aforemny$material_components_web_elm$Material$Select$ariaExpanded = function (value) {
	return A2(
		$elm$html$Html$Attributes$attribute,
		'aria-expanded',
		value ? 'true' : 'false');
};
var $aforemny$material_components_web_elm$Material$Select$ariaHaspopupAttr = function (value) {
	return A2($elm$html$Html$Attributes$attribute, 'aria-haspopup', value);
};
var $aforemny$material_components_web_elm$Material$Select$buttonRole = A2($elm$html$Html$Attributes$attribute, 'role', 'button');
var $aforemny$material_components_web_elm$Material$Select$anchorElt = F2(
	function (additionalAttributes, nodes) {
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						$aforemny$material_components_web_elm$Material$Select$anchorCs,
						$aforemny$material_components_web_elm$Material$Select$buttonRole,
						$aforemny$material_components_web_elm$Material$Select$ariaHaspopupAttr('listbox'),
						$aforemny$material_components_web_elm$Material$Select$ariaExpanded(false)
					]),
				additionalAttributes),
			nodes);
	});
var $aforemny$material_components_web_elm$Material$Select$disabledProp = function (_v0) {
	var disabled = _v0.W;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'disabled',
			$elm$json$Json$Encode$bool(disabled)));
};
var $elm$svg$Svg$Attributes$fillRule = _VirtualDom_attribute('fill-rule');
var $aforemny$material_components_web_elm$Material$Select$focusableAttr = function (value) {
	return A2(
		$elm$virtual_dom$VirtualDom$attribute,
		'focusable',
		value ? 'true' : 'false');
};
var $elm$svg$Svg$Attributes$points = _VirtualDom_attribute('points');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$polygon = $elm$svg$Svg$trustedNode('polygon');
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $aforemny$material_components_web_elm$Material$Select$dropdownIconElt = A2(
	$elm$html$Html$i,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-select__dropdown-icon')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('mdc-select__dropdown-icon-graphic'),
					$elm$svg$Svg$Attributes$viewBox('7 10 10 5'),
					$aforemny$material_components_web_elm$Material$Select$focusableAttr(false)
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('mdc-select__dropdown-icon-inactive'),
							$elm$svg$Svg$Attributes$stroke('none'),
							$elm$svg$Svg$Attributes$fillRule('evenodd'),
							$elm$svg$Svg$Attributes$points('7 10 12 15 17 10')
						]),
					_List_Nil),
					A2(
					$elm$svg$Svg$polygon,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('mdc-select__dropdown-icon-active'),
							$elm$svg$Svg$Attributes$stroke('none'),
							$elm$svg$Svg$Attributes$fillRule('evenodd'),
							$elm$svg$Svg$Attributes$points('7 15 12 10 17 15')
						]),
					_List_Nil)
				]))
		]));
var $aforemny$material_components_web_elm$Material$Select$filledCs = function (variant) {
	return (!variant) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-select--filled')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$Select$floatingLabelElt = function (_v0) {
	var label = _v0.ax;
	return A2(
		$elm$core$Maybe$map,
		function (label_) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-floating-label')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(label_)
					]));
		},
		label);
};
var $aforemny$material_components_web_elm$Material$Select$leadingIconCs = function (_v0) {
	var leadingIcon = _v0.cD;
	return A2(
		$elm$core$Maybe$map,
		function (_v1) {
			return $elm$html$Html$Attributes$class('mdc-select--with-leading-icon');
		},
		leadingIcon);
};
var $aforemny$material_components_web_elm$Material$Select$leadingIconElt = function (_v0) {
	var leadingIcon = _v0.cD;
	if (leadingIcon.$ === 1) {
		return $elm$html$Html$text('');
	} else {
		if (!leadingIcon.a.$) {
			var node = leadingIcon.a.a.aB;
			var attributes = leadingIcon.a.a.ak;
			var nodes = leadingIcon.a.a.aC;
			var onInteraction = leadingIcon.a.a.cI;
			var disabled = leadingIcon.a.a.W;
			return A2(
				node,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class('mdc-select__icon'),
					function () {
						if (!onInteraction.$) {
							var msg = onInteraction.a;
							return (!disabled) ? A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$tabindex(0),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
									A2(
										$elm$core$List$cons,
										$elm$html$Html$Events$onClick(msg),
										A2(
											$elm$core$List$cons,
											A2(
												$elm$html$Html$Events$on,
												'keydown',
												A2(
													$elm$json$Json$Decode$andThen,
													function (keyCode) {
														return (keyCode === 13) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('');
													},
													$elm$html$Html$Events$keyCode)),
											attributes)))) : A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$tabindex(-1),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
									attributes));
						} else {
							return attributes;
						}
					}()),
				nodes);
		} else {
			var node = leadingIcon.a.a.aB;
			var attributes = leadingIcon.a.a.ak;
			var nodes = leadingIcon.a.a.aC;
			var onInteraction = leadingIcon.a.a.cI;
			var disabled = leadingIcon.a.a.W;
			return A2(
				node,
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$class('mdc-select__icon'),
					function () {
						if (!onInteraction.$) {
							var msg = onInteraction.a;
							return (!disabled) ? A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$tabindex(0),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
									A2(
										$elm$core$List$cons,
										$elm$html$Html$Events$onClick(msg),
										A2(
											$elm$core$List$cons,
											A2(
												$elm$html$Html$Events$on,
												'keydown',
												A2(
													$elm$json$Json$Decode$andThen,
													function (keyCode) {
														return (keyCode === 13) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('');
													},
													$elm$html$Html$Events$keyCode)),
											attributes)))) : A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$tabindex(-1),
								A2(
									$elm$core$List$cons,
									A2($elm$html$Html$Attributes$attribute, 'role', 'button'),
									attributes));
						} else {
							return attributes;
						}
					}()),
				nodes);
		}
	}
};
var $aforemny$material_components_web_elm$Material$Select$lineRippleElt = A2(
	$elm$html$Html$label,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-line-ripple')
		]),
	_List_Nil);
var $aforemny$material_components_web_elm$Material$Menu$Config = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$Menu$config = {aT: _List_Nil, aF: $elm$core$Maybe$Nothing, bE: false, bO: false};
var $aforemny$material_components_web_elm$Material$List$Item$graphic = F2(
	function (additionalAttributes, nodes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-deprecated-list-item__graphic'),
				additionalAttributes),
			nodes);
	});
var $aforemny$material_components_web_elm$Material$List$Item$Internal$ListItem = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $aforemny$material_components_web_elm$Material$List$Item$Internal$Activated = 1;
var $aforemny$material_components_web_elm$Material$List$Item$activatedCs = function (_v0) {
	var selection = _v0.dV;
	return _Utils_eq(
		selection,
		$elm$core$Maybe$Just(1)) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-deprecated-list-item--activated')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$List$Item$ariaSelectedAttr = function (_v0) {
	var selection = _v0.dV;
	return (!_Utils_eq(selection, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Just(
		A2($elm$html$Html$Attributes$attribute, 'aria-selected', 'true')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$List$Item$disabledCs = function (_v0) {
	var disabled = _v0.W;
	return disabled ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-deprecated-list-item--disabled')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$List$Item$hrefAttr = function (_v0) {
	var href = _v0.X;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$href, href);
};
var $aforemny$material_components_web_elm$Material$List$Item$interactiveProp = function (_v0) {
	var interactive = _v0.aw;
	return A2(
		$elm$html$Html$Attributes$property,
		'interactive',
		$elm$json$Json$Encode$bool(interactive));
};
var $aforemny$material_components_web_elm$Material$List$Item$listItemCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-deprecated-list-item'));
var $aforemny$material_components_web_elm$Material$List$Item$rippleElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-deprecated-list-item__ripple')
		]),
	_List_Nil);
var $aforemny$material_components_web_elm$Material$List$Item$ripplesProp = function (_v0) {
	var ripples = _v0.aI;
	return A2(
		$elm$html$Html$Attributes$property,
		'ripples',
		$elm$json$Json$Encode$bool(ripples));
};
var $aforemny$material_components_web_elm$Material$List$Item$Internal$Selected = 0;
var $aforemny$material_components_web_elm$Material$List$Item$selectedCs = function (_v0) {
	var selection = _v0.dV;
	return _Utils_eq(
		selection,
		$elm$core$Maybe$Just(0)) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-deprecated-list-item--selected')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$List$Item$targetAttr = function (_v0) {
	var href = _v0.X;
	var target = _v0.bZ;
	return (!_Utils_eq(href, $elm$core$Maybe$Nothing)) ? A2($elm$core$Maybe$map, $elm$html$Html$Attributes$target, target) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$List$Item$listItemView = F2(
	function (config_, nodes) {
		var additionalAttributes = config_.aT;
		var href = config_.X;
		return A2(
			F2(
				function (attributes, nodes_) {
					return A3(
						$elm$html$Html$node,
						'mdc-list-item',
						_Utils_ap(
							_List_fromArray(
								[
									$aforemny$material_components_web_elm$Material$List$Item$ripplesProp(config_),
									$aforemny$material_components_web_elm$Material$List$Item$interactiveProp(config_)
								]),
							(!_Utils_eq(href, $elm$core$Maybe$Nothing)) ? _List_Nil : attributes),
						(!_Utils_eq(href, $elm$core$Maybe$Nothing)) ? _List_fromArray(
							[
								A2($elm$html$Html$a, attributes, nodes_)
							]) : nodes_);
				}),
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$List$Item$listItemCs,
							$aforemny$material_components_web_elm$Material$List$Item$hrefAttr(config_),
							$aforemny$material_components_web_elm$Material$List$Item$targetAttr(config_),
							$aforemny$material_components_web_elm$Material$List$Item$disabledCs(config_),
							$aforemny$material_components_web_elm$Material$List$Item$selectedCs(config_),
							$aforemny$material_components_web_elm$Material$List$Item$activatedCs(config_),
							$aforemny$material_components_web_elm$Material$List$Item$ariaSelectedAttr(config_)
						])),
				additionalAttributes),
			A2($elm$core$List$cons, $aforemny$material_components_web_elm$Material$List$Item$rippleElt, nodes));
	});
var $aforemny$material_components_web_elm$Material$List$Item$listItem = F2(
	function (config_, nodes) {
		return A2(
			$aforemny$material_components_web_elm$Material$List$Item$Internal$ListItem,
			function (config__) {
				return A2($aforemny$material_components_web_elm$Material$List$Item$listItemView, config__, nodes);
			},
			config_);
	});
var $aforemny$material_components_web_elm$Material$List$Item$activated = 1;
var $aforemny$material_components_web_elm$Material$List$Item$config = {aT: _List_Nil, W: false, X: $elm$core$Maybe$Nothing, aw: false, bB: $elm$core$Maybe$Nothing, aI: false, dV: $elm$core$Maybe$Nothing, bZ: $elm$core$Maybe$Nothing};
var $aforemny$material_components_web_elm$Material$List$Item$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aT: additionalAttributes});
	});
var $aforemny$material_components_web_elm$Material$List$Item$setDisabled = F2(
	function (disabled, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{W: disabled});
	});
var $aforemny$material_components_web_elm$Material$List$Item$setOnClick = F2(
	function (onClick, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bB: $elm$core$Maybe$Just(onClick)
			});
	});
var $aforemny$material_components_web_elm$Material$List$Item$setSelected = F2(
	function (selection, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{dV: selection});
	});
var $aforemny$material_components_web_elm$Material$Select$listItemConfig = F3(
	function (selectedValue, onChange, config_) {
		var _v0 = config_;
		var value = _v0.aP;
		var disabled = _v0.W;
		var additionalAttributes = _v0.aT;
		return function () {
			if (!onChange.$) {
				var onChange_ = onChange.a;
				return $aforemny$material_components_web_elm$Material$List$Item$setOnClick(
					onChange_(value));
			} else {
				return $elm$core$Basics$identity;
			}
		}()(
			A2(
				$aforemny$material_components_web_elm$Material$List$Item$setSelected,
				_Utils_eq(
					selectedValue,
					$elm$core$Maybe$Just(value)) ? $elm$core$Maybe$Just($aforemny$material_components_web_elm$Material$List$Item$activated) : $elm$core$Maybe$Nothing,
				A2(
					$aforemny$material_components_web_elm$Material$List$Item$setAttributes,
					additionalAttributes,
					A2($aforemny$material_components_web_elm$Material$List$Item$setDisabled, disabled, $aforemny$material_components_web_elm$Material$List$Item$config))));
	});
var $aforemny$material_components_web_elm$Material$Select$listItem = F4(
	function (leadingIcon, selected, onChange, _v0) {
		var config_ = _v0.a;
		var label = _v0.b;
		return A2(
			$aforemny$material_components_web_elm$Material$List$Item$listItem,
			A3($aforemny$material_components_web_elm$Material$Select$listItemConfig, selected, onChange, config_),
			$elm$core$List$concat(
				_List_fromArray(
					[
						(!_Utils_eq(leadingIcon, $elm$core$Maybe$Nothing)) ? _List_fromArray(
						[
							A2($aforemny$material_components_web_elm$Material$List$Item$graphic, _List_Nil, _List_Nil)
						]) : _List_Nil,
						_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mdc-deprecated-list-item__text')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(label)
								]))
						])
					])));
	});
var $aforemny$material_components_web_elm$Material$Menu$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aT: additionalAttributes});
	});
var $aforemny$material_components_web_elm$Material$Select$menuElt = F5(
	function (leadingIcon, selected, onChange, firstSelectItem, remainingSelectItems) {
		return A3(
			$aforemny$material_components_web_elm$Material$Menu$menu,
			A2(
				$aforemny$material_components_web_elm$Material$Menu$setAttributes,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-select__menu'),
						A2($elm$html$Html$Attributes$style, 'width', '100%')
					]),
				$aforemny$material_components_web_elm$Material$Menu$config),
			A4($aforemny$material_components_web_elm$Material$Select$listItem, leadingIcon, selected, onChange, firstSelectItem),
			A2(
				$elm$core$List$map,
				A3($aforemny$material_components_web_elm$Material$Select$listItem, leadingIcon, selected, onChange),
				remainingSelectItems));
	});
var $aforemny$material_components_web_elm$Material$Select$noLabelCs = function (_v0) {
	var label = _v0.ax;
	return _Utils_eq(label, $elm$core$Maybe$Nothing) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-select--no-label')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$Select$notchedOutlineElt = function (config_) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-notched-outline')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-notched-outline__leading')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-notched-outline__notch')
					]),
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$Select$floatingLabelElt(config_)
						]))),
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-notched-outline__trailing')
					]),
				_List_Nil)
			]));
};
var $aforemny$material_components_web_elm$Material$Select$outlinedCs = function (variant) {
	return (variant === 1) ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-select--outlined')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$Select$requiredProp = function (_v0) {
	var required = _v0.bR;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'required',
			$elm$json$Json$Encode$bool(required)));
};
var $aforemny$material_components_web_elm$Material$Select$rippleElt = $elm$core$Maybe$Just(
	A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-select__ripple')
			]),
		_List_Nil));
var $aforemny$material_components_web_elm$Material$Select$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-select'));
var $aforemny$material_components_web_elm$Material$Select$selectedIndexProp = function (selectedIndex) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'selectedIndex',
			$elm$json$Json$Encode$int(
				A2($elm$core$Maybe$withDefault, -1, selectedIndex))));
};
var $aforemny$material_components_web_elm$Material$Select$selectedTextElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-select__selected-text')
		]),
	_List_Nil);
var $aforemny$material_components_web_elm$Material$Select$selectedTextContainerElt = A2(
	$elm$html$Html$span,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('mdc-select__selected-text-container')
		]),
	_List_fromArray(
		[$aforemny$material_components_web_elm$Material$Select$selectedTextElt]));
var $aforemny$material_components_web_elm$Material$Select$validProp = function (_v0) {
	var valid = _v0.cb;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'valid',
			$elm$json$Json$Encode$bool(valid)));
};
var $aforemny$material_components_web_elm$Material$Select$select = F4(
	function (variant, config_, firstSelectItem, remainingSelectItems) {
		var _v0 = config_;
		var leadingIcon = _v0.cD;
		var selected = _v0.cY;
		var additionalAttributes = _v0.aT;
		var onChange = _v0.bA;
		var selectedIndex = $elm$core$List$head(
			A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				A2(
					$elm$core$List$indexedMap,
					F2(
						function (index, _v1) {
							var value = _v1.a.aP;
							return _Utils_eq(
								$elm$core$Maybe$Just(value),
								selected) ? $elm$core$Maybe$Just(index) : $elm$core$Maybe$Nothing;
						}),
					A2($elm$core$List$cons, firstSelectItem, remainingSelectItems))));
		return A3(
			$elm$html$Html$node,
			'mdc-select',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$Select$rootCs,
							$aforemny$material_components_web_elm$Material$Select$noLabelCs(config_),
							$aforemny$material_components_web_elm$Material$Select$filledCs(variant),
							$aforemny$material_components_web_elm$Material$Select$outlinedCs(variant),
							$aforemny$material_components_web_elm$Material$Select$leadingIconCs(config_),
							$aforemny$material_components_web_elm$Material$Select$disabledProp(config_),
							$aforemny$material_components_web_elm$Material$Select$selectedIndexProp(selectedIndex),
							$aforemny$material_components_web_elm$Material$Select$validProp(config_),
							$aforemny$material_components_web_elm$Material$Select$requiredProp(config_)
						])),
				additionalAttributes),
			_List_fromArray(
				[
					A2(
					$aforemny$material_components_web_elm$Material$Select$anchorElt,
					_List_Nil,
					$elm$core$List$concat(
						_List_fromArray(
							[
								(!variant) ? A2(
								$elm$core$List$filterMap,
								$elm$core$Basics$identity,
								_List_fromArray(
									[
										$aforemny$material_components_web_elm$Material$Select$rippleElt,
										$aforemny$material_components_web_elm$Material$Select$floatingLabelElt(config_)
									])) : _List_fromArray(
								[
									$aforemny$material_components_web_elm$Material$Select$notchedOutlineElt(config_)
								]),
								_List_fromArray(
								[
									$aforemny$material_components_web_elm$Material$Select$leadingIconElt(config_),
									$aforemny$material_components_web_elm$Material$Select$selectedTextContainerElt,
									$aforemny$material_components_web_elm$Material$Select$dropdownIconElt
								]),
								(!variant) ? _List_fromArray(
								[$aforemny$material_components_web_elm$Material$Select$lineRippleElt]) : _List_Nil
							]))),
					A5($aforemny$material_components_web_elm$Material$Select$menuElt, leadingIcon, selected, onChange, firstSelectItem, remainingSelectItems)
				]));
	});
var $aforemny$material_components_web_elm$Material$Select$outlined = F3(
	function (config_, firstSelectItem, remainingSelectItems) {
		return A4($aforemny$material_components_web_elm$Material$Select$select, 1, config_, firstSelectItem, remainingSelectItems);
	});
var $aforemny$material_components_web_elm$Material$Select$Item$Internal$SelectItem = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $aforemny$material_components_web_elm$Material$Select$Item$selectItem = $aforemny$material_components_web_elm$Material$Select$Item$Internal$SelectItem;
var $aforemny$material_components_web_elm$Material$Select$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aT: additionalAttributes});
	});
var $aforemny$material_components_web_elm$Material$Select$setLabel = F2(
	function (label, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{ax: label});
	});
var $aforemny$material_components_web_elm$Material$Select$setOnChange = F2(
	function (onChange, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{
				bA: $elm$core$Maybe$Just(onChange)
			});
	});
var $aforemny$material_components_web_elm$Material$Select$setSelected = F2(
	function (selected, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{cY: selected});
	});
var $author$project$Page$Challenge$viewOpponent = function (o) {
	return A2(
		$aforemny$material_components_web_elm$Material$Select$Item$selectItem,
		$aforemny$material_components_web_elm$Material$Select$Item$config(
			{aP: o}),
		o.bF);
};
var $author$project$Page$Challenge$viewOpponentButton = function (os) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('theme-dark'),
				A2($elm$html$Html$Attributes$style, 'width', '80%'),
				A2($elm$html$Html$Attributes$style, 'display', 'inline-flex')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[$aforemny$material_components_web_elm$Material$Typography$typography]),
				_List_fromArray(
					[
						$elm$html$Html$text('Opponent:')
					])),
				A3(
				$aforemny$material_components_web_elm$Material$Select$outlined,
				A2(
					$aforemny$material_components_web_elm$Material$Select$setAttributes,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', 'white'),
							A2($elm$html$Html$Attributes$style, 'vertical-align', 'middle'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'margin-left', 'auto')
						]),
					A2(
						$aforemny$material_components_web_elm$Material$Select$setOnChange,
						$author$project$Page$Challenge$SelectOpponent,
						A2(
							$aforemny$material_components_web_elm$Material$Select$setSelected,
							$elm$core$Maybe$Nothing,
							A2($aforemny$material_components_web_elm$Material$Select$setLabel, $elm$core$Maybe$Nothing, $aforemny$material_components_web_elm$Material$Select$config)))),
				A2(
					$aforemny$material_components_web_elm$Material$Select$Item$selectItem,
					$aforemny$material_components_web_elm$Material$Select$Item$config(
						{
							aP: $author$project$API$Opponent('bot:easy')
						}),
					'Bot (Easy)'),
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$aforemny$material_components_web_elm$Material$Select$Item$selectItem,
							$aforemny$material_components_web_elm$Material$Select$Item$config(
								{
									aP: $author$project$API$Opponent('bot:medium')
								}),
							'Bot (Medium)'),
							A2(
							$aforemny$material_components_web_elm$Material$Select$Item$selectItem,
							$aforemny$material_components_web_elm$Material$Select$Item$config(
								{
									aP: $author$project$API$Opponent('bot:hard')
								}),
							'Bot (Hard)')
						]),
					A2($elm$core$List$map, $author$project$Page$Challenge$viewOpponent, os)))
			]));
};
var $aforemny$material_components_web_elm$Material$CircularProgress$Config = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$CircularProgress$Large = 0;
var $aforemny$material_components_web_elm$Material$CircularProgress$config = {aT: _List_Nil, a0: false, bb: false, ax: $elm$core$Maybe$Nothing, v: 0};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $aforemny$material_components_web_elm$Material$CircularProgress$ariaLabelAttr = function (_v0) {
	var label = _v0.ax;
	return A2(
		$elm$core$Maybe$map,
		$elm$html$Html$Attributes$attribute('aria-label'),
		label);
};
var $aforemny$material_components_web_elm$Material$CircularProgress$ariaValueMaxAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'aria-value-max', '1'));
var $aforemny$material_components_web_elm$Material$CircularProgress$ariaValueMinAttr = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'aria-value-min', '0'));
var $elm$core$String$fromFloat = _String_fromNumber;
var $aforemny$material_components_web_elm$Material$CircularProgress$ariaValueNowAttr = function (progress) {
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			A2(
				$elm$core$Basics$composeL,
				$elm$html$Html$Attributes$attribute('aria-value-now'),
				$elm$core$String$fromFloat),
			function ($) {
				return $.bN;
			}),
		progress);
};
var $aforemny$material_components_web_elm$Material$CircularProgress$closedProp = function (_v0) {
	var closed = _v0.a0;
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'closed',
			$elm$json$Json$Encode$bool(closed)));
};
var $aforemny$material_components_web_elm$Material$CircularProgress$circleCs = function (progress) {
	return $elm$svg$Svg$Attributes$class(
		(!_Utils_eq(progress, $elm$core$Maybe$Nothing)) ? 'mdc-circular-progress__determinate-circle' : 'mdc-circular-progress__indeterminate-circle');
};
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $aforemny$material_components_web_elm$Material$CircularProgress$cxAttr = function (_v0) {
	var size = _v0.v;
	return $elm$svg$Svg$Attributes$cx(
		function () {
			switch (size) {
				case 0:
					return '24';
				case 1:
					return '16';
				default:
					return '12';
			}
		}());
};
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $aforemny$material_components_web_elm$Material$CircularProgress$cyAttr = function (_v0) {
	var size = _v0.v;
	return $elm$svg$Svg$Attributes$cy(
		function () {
			switch (size) {
				case 0:
					return '24';
				case 1:
					return '16';
				default:
					return '12';
			}
		}());
};
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $aforemny$material_components_web_elm$Material$CircularProgress$rAttr = function (_v0) {
	var size = _v0.v;
	return $elm$svg$Svg$Attributes$r(
		function () {
			switch (size) {
				case 0:
					return '18';
				case 1:
					return '12.5';
				default:
					return '8.75';
			}
		}());
};
var $elm$svg$Svg$Attributes$strokeDasharray = _VirtualDom_attribute('stroke-dasharray');
var $aforemny$material_components_web_elm$Material$CircularProgress$strokeDasharrayAttr = function (_v0) {
	var size = _v0.v;
	return A3(
		$elm$core$Basics$composeL,
		$elm$svg$Svg$Attributes$strokeDasharray,
		$elm$core$String$fromFloat,
		function () {
			switch (size) {
				case 0:
					return 113.097;
				case 1:
					return 78.54;
				default:
					return 54.978;
			}
		}());
};
var $elm$svg$Svg$Attributes$strokeDashoffset = _VirtualDom_attribute('stroke-dashoffset');
var $aforemny$material_components_web_elm$Material$CircularProgress$strokeDashoffsetAttr = F2(
	function (progress, _v0) {
		var size = _v0.v;
		return A3(
			$elm$core$Basics$composeL,
			$elm$svg$Svg$Attributes$strokeDashoffset,
			$elm$core$String$fromFloat,
			function () {
				var _v1 = _Utils_Tuple2(progress, size);
				if (!_v1.a.$) {
					switch (_v1.b) {
						case 0:
							var _v2 = _v1.b;
							return 113.097;
						case 1:
							var _v5 = _v1.b;
							return 78.54;
						default:
							var _v8 = _v1.b;
							return 54.978;
					}
				} else {
					switch (_v1.b) {
						case 0:
							var _v3 = _v1.a;
							var _v4 = _v1.b;
							return 56.549;
						case 1:
							var _v6 = _v1.a;
							var _v7 = _v1.b;
							return 39.27;
						default:
							var _v9 = _v1.a;
							var _v10 = _v1.b;
							return 27.489;
					}
				}
			}());
	});
var $aforemny$material_components_web_elm$Material$CircularProgress$circleElt = F4(
	function (strokeWidth_, circleCs_, progress, config_) {
		return A2(
			$elm$svg$Svg$circle,
			_Utils_ap(
				_List_fromArray(
					[
						$aforemny$material_components_web_elm$Material$CircularProgress$cxAttr(config_),
						$aforemny$material_components_web_elm$Material$CircularProgress$cyAttr(config_),
						$aforemny$material_components_web_elm$Material$CircularProgress$rAttr(config_),
						$aforemny$material_components_web_elm$Material$CircularProgress$strokeDasharrayAttr(config_),
						A2($aforemny$material_components_web_elm$Material$CircularProgress$strokeDashoffsetAttr, progress, config_),
						strokeWidth_(config_)
					]),
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$core$Basics$apR(progress),
							circleCs_)
						]))),
			_List_Nil);
	});
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $aforemny$material_components_web_elm$Material$CircularProgress$strokeWidth = function (_v0) {
	var size = _v0.v;
	return A3(
		$elm$core$Basics$composeL,
		$elm$svg$Svg$Attributes$strokeWidth,
		$elm$core$String$fromFloat,
		function () {
			switch (size) {
				case 0:
					return 4;
				case 1:
					return 3;
				default:
					return 2.5;
			}
		}());
};
var $aforemny$material_components_web_elm$Material$CircularProgress$trackCs = $elm$svg$Svg$Attributes$class('mdc-circular-progress__determinate-track');
var $aforemny$material_components_web_elm$Material$CircularProgress$trackElt = function (config_) {
	return A2(
		$elm$svg$Svg$circle,
		_List_fromArray(
			[
				$aforemny$material_components_web_elm$Material$CircularProgress$trackCs,
				$aforemny$material_components_web_elm$Material$CircularProgress$cxAttr(config_),
				$aforemny$material_components_web_elm$Material$CircularProgress$cyAttr(config_),
				$aforemny$material_components_web_elm$Material$CircularProgress$rAttr(config_),
				$aforemny$material_components_web_elm$Material$CircularProgress$strokeWidth(config_)
			]),
		_List_Nil);
};
var $aforemny$material_components_web_elm$Material$CircularProgress$viewBoxAttr = function (_v0) {
	var size = _v0.v;
	return $elm$svg$Svg$Attributes$viewBox(
		function () {
			switch (size) {
				case 0:
					return '0 0 48 48';
				case 1:
					return '0 0 32 32';
				default:
					return '0 0 24 24';
			}
		}());
};
var $aforemny$material_components_web_elm$Material$CircularProgress$determinateCircleGraphicElt = F2(
	function (progress, config_) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('mdc-circular-progress__determinate-circle-graphic'),
					$aforemny$material_components_web_elm$Material$CircularProgress$viewBoxAttr($aforemny$material_components_web_elm$Material$CircularProgress$config)
				]),
			_List_fromArray(
				[
					$aforemny$material_components_web_elm$Material$CircularProgress$trackElt(config_),
					A4(
					$aforemny$material_components_web_elm$Material$CircularProgress$circleElt,
					$aforemny$material_components_web_elm$Material$CircularProgress$strokeWidth,
					$elm$core$Maybe$Just($aforemny$material_components_web_elm$Material$CircularProgress$circleCs),
					progress,
					config_)
				]));
	});
var $aforemny$material_components_web_elm$Material$CircularProgress$determinateContainerElt = F2(
	function (progress, config_) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mdc-circular-progress__determinate-container')
				]),
			_List_fromArray(
				[
					A2($aforemny$material_components_web_elm$Material$CircularProgress$determinateCircleGraphicElt, progress, config_)
				]));
	});
var $aforemny$material_components_web_elm$Material$CircularProgress$determinateProp = function (progress) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'determinate',
			$elm$json$Json$Encode$bool(
				!_Utils_eq(progress, $elm$core$Maybe$Nothing))));
};
var $aforemny$material_components_web_elm$Material$CircularProgress$indeterminateCircleGraphicElt = F2(
	function (strokeWidth_, config_) {
		return A2(
			$elm$svg$Svg$svg,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('mdc-circular-progress__indeterminate-circle-graphic'),
					$aforemny$material_components_web_elm$Material$CircularProgress$viewBoxAttr(config_)
				]),
			_List_fromArray(
				[
					A4($aforemny$material_components_web_elm$Material$CircularProgress$circleElt, strokeWidth_, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing, config_)
				]));
	});
var $aforemny$material_components_web_elm$Material$CircularProgress$strokeWidthGap = function (_v0) {
	var size = _v0.v;
	return A3(
		$elm$core$Basics$composeL,
		$elm$svg$Svg$Attributes$strokeWidth,
		$elm$core$String$fromFloat,
		function () {
			switch (size) {
				case 0:
					return 3.2;
				case 1:
					return 2.4;
				default:
					return 2;
			}
		}());
};
var $aforemny$material_components_web_elm$Material$CircularProgress$spinnerLayerElt = F2(
	function (config_, additionalAttributes) {
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('mdc-circular-progress__spinner-layer'),
				additionalAttributes),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mdc-circular-progress__circle-clipper'),
							$elm$html$Html$Attributes$class('mdc-circular-progress__circle-left')
						]),
					_List_fromArray(
						[
							A2($aforemny$material_components_web_elm$Material$CircularProgress$indeterminateCircleGraphicElt, $aforemny$material_components_web_elm$Material$CircularProgress$strokeWidth, config_)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mdc-circular-progress__gap-patch')
						]),
					_List_fromArray(
						[
							A2($aforemny$material_components_web_elm$Material$CircularProgress$indeterminateCircleGraphicElt, $aforemny$material_components_web_elm$Material$CircularProgress$strokeWidthGap, config_)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mdc-circular-progress__circle-clipper'),
							$elm$html$Html$Attributes$class('mdc-circular-progress__circle-right')
						]),
					_List_fromArray(
						[
							A2($aforemny$material_components_web_elm$Material$CircularProgress$indeterminateCircleGraphicElt, $aforemny$material_components_web_elm$Material$CircularProgress$strokeWidth, config_)
						]))
				]));
	});
var $aforemny$material_components_web_elm$Material$CircularProgress$indeterminateContainerElt = function (config_) {
	var fourColored = config_.bb;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mdc-circular-progress__indeterminate-container')
			]),
		fourColored ? _List_fromArray(
			[
				A2(
				$aforemny$material_components_web_elm$Material$CircularProgress$spinnerLayerElt,
				config_,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-circular-progress__color-1')
					])),
				A2(
				$aforemny$material_components_web_elm$Material$CircularProgress$spinnerLayerElt,
				config_,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-circular-progress__color-2')
					])),
				A2(
				$aforemny$material_components_web_elm$Material$CircularProgress$spinnerLayerElt,
				config_,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-circular-progress__color-3')
					])),
				A2(
				$aforemny$material_components_web_elm$Material$CircularProgress$spinnerLayerElt,
				config_,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mdc-circular-progress__color-4')
					]))
			]) : _List_fromArray(
			[
				A2($aforemny$material_components_web_elm$Material$CircularProgress$spinnerLayerElt, config_, _List_Nil)
			]));
};
var $aforemny$material_components_web_elm$Material$CircularProgress$indeterminateCs = function (progress) {
	return (!_Utils_eq(progress, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-circular-progress--indeterminate'));
};
var $elm$json$Json$Encode$float = _Json_wrap;
var $aforemny$material_components_web_elm$Material$CircularProgress$progressProp = function (progress) {
	return A2(
		$elm$core$Maybe$map,
		A2(
			$elm$core$Basics$composeL,
			A2(
				$elm$core$Basics$composeL,
				$elm$html$Html$Attributes$property('progress'),
				$elm$json$Json$Encode$float),
			function ($) {
				return $.bN;
			}),
		progress);
};
var $aforemny$material_components_web_elm$Material$CircularProgress$progressbarRole = $elm$core$Maybe$Just(
	A2($elm$html$Html$Attributes$attribute, 'role', 'progressbar'));
var $aforemny$material_components_web_elm$Material$CircularProgress$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-circular-progress'));
var $aforemny$material_components_web_elm$Material$CircularProgress$sizeCs = function (_v0) {
	var size = _v0.v;
	var px = $elm$core$String$fromInt(
		function () {
			switch (size) {
				case 0:
					return 48;
				case 1:
					return 36;
				default:
					return 24;
			}
		}()) + 'px';
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'width', px),
			A2($elm$html$Html$Attributes$style, 'height', px)
		]);
};
var $aforemny$material_components_web_elm$Material$CircularProgress$circularProgress = F2(
	function (progress, config_) {
		var additionalAttributes = config_.aT;
		return A3(
			$elm$html$Html$node,
			'mdc-circular-progress',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$CircularProgress$rootCs,
							$aforemny$material_components_web_elm$Material$CircularProgress$indeterminateCs(progress),
							$aforemny$material_components_web_elm$Material$CircularProgress$progressbarRole,
							$aforemny$material_components_web_elm$Material$CircularProgress$ariaLabelAttr(config_),
							$aforemny$material_components_web_elm$Material$CircularProgress$ariaValueMinAttr,
							$aforemny$material_components_web_elm$Material$CircularProgress$ariaValueMaxAttr,
							$aforemny$material_components_web_elm$Material$CircularProgress$ariaValueNowAttr(progress),
							$aforemny$material_components_web_elm$Material$CircularProgress$determinateProp(progress),
							$aforemny$material_components_web_elm$Material$CircularProgress$progressProp(progress),
							$aforemny$material_components_web_elm$Material$CircularProgress$closedProp(config_)
						])),
				_Utils_ap(
					$aforemny$material_components_web_elm$Material$CircularProgress$sizeCs(config_),
					additionalAttributes)),
			_List_fromArray(
				[
					A2(
					$aforemny$material_components_web_elm$Material$CircularProgress$determinateContainerElt,
					A2(
						$elm$core$Maybe$withDefault,
						$elm$core$Maybe$Just(
							{bN: 0}),
						A2($elm$core$Maybe$map, $elm$core$Maybe$Just, progress)),
					config_),
					$aforemny$material_components_web_elm$Material$CircularProgress$indeterminateContainerElt(config_)
				]));
	});
var $aforemny$material_components_web_elm$Material$CircularProgress$indeterminate = function (config_) {
	return A2($aforemny$material_components_web_elm$Material$CircularProgress$circularProgress, $elm$core$Maybe$Nothing, config_);
};
var $author$project$Page$Challenge$ViewMatchRequest = function (a) {
	return {$: 6, a: a};
};
var $elm$core$String$append = _String_append;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $samhstn$time_format$Time$Format$monthToString = function (month) {
	switch (month) {
		case 0:
			return 'Jan';
		case 1:
			return 'Feb';
		case 2:
			return 'Mar';
		case 3:
			return 'Apr';
		case 4:
			return 'May';
		case 5:
			return 'Jun';
		case 6:
			return 'Jul';
		case 7:
			return 'Aug';
		case 8:
			return 'Sep';
		case 9:
			return 'Oct';
		case 10:
			return 'Nov';
		default:
			return 'Dec';
	}
};
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
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $samhstn$time_format$Time$Format$replace = F3(
	function (substr, newstr, str) {
		return A2(
			$elm$core$String$join,
			newstr,
			A2($elm$core$String$split, substr, str));
	});
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
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
				if (_Utils_cmp(era.bW, posixMinutes) < 0) {
					return posixMinutes + era.b;
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
		cl: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		cF: month,
		dc: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).cl;
	});
var $elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			24,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var $elm$time$Time$toMillis = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			1000,
			$elm$time$Time$posixToMillis(time));
	});
var $elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2($elm$time$Time$toAdjustedMinutes, zone, time));
	});
var $elm$time$Time$Apr = 3;
var $elm$time$Time$Aug = 7;
var $elm$time$Time$Dec = 11;
var $elm$time$Time$Feb = 1;
var $elm$time$Time$Jan = 0;
var $elm$time$Time$Jul = 6;
var $elm$time$Time$Jun = 5;
var $elm$time$Time$Mar = 2;
var $elm$time$Time$May = 4;
var $elm$time$Time$Nov = 10;
var $elm$time$Time$Oct = 9;
var $elm$time$Time$Sep = 8;
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).cF;
		switch (_v0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var $samhstn$time_format$Time$Format$toOrd = function (n) {
	switch (n) {
		case 1:
			return '1st';
		case 2:
			return '2st';
		case 3:
			return '3rd';
		case 21:
			return '21st';
		case 22:
			return '22st';
		case 23:
			return '23rd';
		case 31:
			return '31st';
		default:
			return $elm$core$String$fromInt(n) + 'th';
	}
};
var $elm$time$Time$toSecond = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				1000));
	});
var $elm$time$Time$Fri = 4;
var $elm$time$Time$Mon = 0;
var $elm$time$Time$Sat = 5;
var $elm$time$Time$Sun = 6;
var $elm$time$Time$Thu = 3;
var $elm$time$Time$Tue = 1;
var $elm$time$Time$Wed = 2;
var $elm$time$Time$toWeekday = F2(
	function (zone, time) {
		var _v0 = A2(
			$elm$core$Basics$modBy,
			7,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60 * 24));
		switch (_v0) {
			case 0:
				return 3;
			case 1:
				return 4;
			case 2:
				return 5;
			case 3:
				return 6;
			case 4:
				return 0;
			case 5:
				return 1;
			default:
				return 2;
		}
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).dc;
	});
var $samhstn$time_format$Time$Format$weekdayToString = function (weekday) {
	switch (weekday) {
		case 0:
			return 'Mon';
		case 1:
			return 'Tue';
		case 2:
			return 'Wed';
		case 3:
			return 'Thu';
		case 4:
			return 'Fri';
		case 5:
			return 'Sat';
		default:
			return 'Sun';
	}
};
var $samhstn$time_format$Time$Format$format = F3(
	function (zone, formatStr, millis) {
		var posix = $elm$time$Time$millisToPosix(millis);
		var formatFunc = function (f) {
			return $elm$core$String$fromInt(
				A2(f, zone, posix));
		};
		return A3(
			$samhstn$time_format$Time$Format$replace,
			'Weekday',
			$samhstn$time_format$Time$Format$weekdayToString(
				A2($elm$time$Time$toWeekday, zone, posix)),
			A3(
				$samhstn$time_format$Time$Format$replace,
				'Year',
				formatFunc($elm$time$Time$toYear),
				A3(
					$samhstn$time_format$Time$Format$replace,
					'Month',
					$samhstn$time_format$Time$Format$monthToString(
						A2($elm$time$Time$toMonth, zone, posix)),
					A3(
						$samhstn$time_format$Time$Format$replace,
						'Day',
						formatFunc($elm$time$Time$toDay),
						A3(
							$samhstn$time_format$Time$Format$replace,
							'ordDay',
							$samhstn$time_format$Time$Format$toOrd(
								A2($elm$time$Time$toDay, zone, posix)),
							A3(
								$samhstn$time_format$Time$Format$replace,
								'padDay',
								A3(
									$elm$core$String$padLeft,
									2,
									'0',
									formatFunc($elm$time$Time$toDay)),
								A3(
									$samhstn$time_format$Time$Format$replace,
									'Hour',
									formatFunc($elm$time$Time$toHour),
									A3(
										$samhstn$time_format$Time$Format$replace,
										'padHour',
										A3(
											$elm$core$String$padLeft,
											2,
											'0',
											formatFunc($elm$time$Time$toHour)),
										A3(
											$samhstn$time_format$Time$Format$replace,
											'Minute',
											formatFunc($elm$time$Time$toMinute),
											A3(
												$samhstn$time_format$Time$Format$replace,
												'padMinute',
												A3(
													$elm$core$String$padLeft,
													2,
													'0',
													formatFunc($elm$time$Time$toMinute)),
												A3(
													$samhstn$time_format$Time$Format$replace,
													'Second',
													formatFunc($elm$time$Time$toSecond),
													A3(
														$samhstn$time_format$Time$Format$replace,
														'padSecond',
														A3(
															$elm$core$String$padLeft,
															2,
															'0',
															formatFunc($elm$time$Time$toSecond)),
														A3(
															$samhstn$time_format$Time$Format$replace,
															'Millis',
															formatFunc($elm$time$Time$toMillis),
															A3(
																$samhstn$time_format$Time$Format$replace,
																'padMillis',
																A3(
																	$elm$core$String$padLeft,
																	3,
																	'0',
																	formatFunc($elm$time$Time$toMillis)),
																formatStr))))))))))))));
	});
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$Utils$millisToString = A2($samhstn$time_format$Time$Format$format, $elm$time$Time$utc, 'Weekday, ordDay Month Year at Hour:Minute:Second and Millisms');
var $author$project$Page$Challenge$viewMatch = function (m) {
	var n1 = m.bk.bv;
	var n2 = m.bl.bv;
	var s1 = _Utils_eq(
		m.bo,
		$elm$core$Maybe$Just(m.bk.bu)) ? A2($elm$html$Html$Attributes$style, 'opacity', '1') : A2($elm$html$Html$Attributes$style, 'opacity', '0.6');
	var s2 = _Utils_eq(
		m.bo,
		$elm$core$Maybe$Just(m.bl.bu)) ? A2($elm$html$Html$Attributes$style, 'opacity', '1') : A2($elm$html$Html$Attributes$style, 'opacity', '0.6');
	var pad = A2($elm$html$Html$Attributes$style, 'padding', '10px 10px');
	var i = m.bf ? 'graphics/champion.gif' : 'graphics/vs.gif';
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('theme-dark'),
				$elm$html$Html$Attributes$class('match-button'),
				$elm$html$Html$Events$onClick(
				$author$project$Page$Challenge$ViewMatchRequest(m.bn))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('date'),
						A2($elm$html$Html$Attributes$style, 'margin', '5px 0px 0px 0px'),
						$aforemny$material_components_web_elm$Material$Typography$typography
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Utils$millisToString(m.bn))
					])),
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('champion'),
						$elm$html$Html$Attributes$src(i)
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('match'),
						$aforemny$material_components_web_elm$Material$Typography$typography
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('match-name'),
								s1,
								$aforemny$material_components_web_elm$Material$Typography$typography
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(n1)
							])),
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(
								A2(
									$elm$core$String$append,
									'graphics/players/p',
									A2(
										$elm$core$String$append,
										$elm$core$String$fromInt(m.bk.bt),
										'.gif'))),
								s1,
								pad
							]),
						_List_Nil),
						$elm$html$Html$text('VS'),
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(
								A2(
									$elm$core$String$append,
									'graphics/players/p',
									A2(
										$elm$core$String$append,
										$elm$core$String$fromInt(m.bl.bt),
										'.gif'))),
								s2,
								pad
							]),
						_List_Nil),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('match-name'),
								s2,
								$aforemny$material_components_web_elm$Material$Typography$typography
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(n2)
							]))
					]))
			]));
};
var $author$project$Page$Challenge$wonMatch = function (match) {
	return _Utils_eq(
		match.bo,
		$elm$core$Maybe$Just(match.bk.bu));
};
var $author$project$Page$Challenge$viewStatus = function (s) {
	switch (s.$) {
		case 1:
			return _List_Nil;
		case 0:
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$img,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin', '20px 20px 10px 20px'),
							$elm$html$Html$Attributes$src('graphics/working.gif')
						]),
					_List_Nil),
					$aforemny$material_components_web_elm$Material$CircularProgress$indeterminate($aforemny$material_components_web_elm$Material$CircularProgress$config),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'margin', '0px 20px')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Processing your match...')
						]))
				]);
		case 2:
			if (s.a.b && (!s.a.b.b)) {
				var _v1 = s.a;
				var m = _v1.a;
				var won = $author$project$Page$Challenge$wonMatch(m);
				var champ = m.bf;
				var imgsrc = won ? (champ ? 'win2' : 'win') : 'lose';
				var txt = won ? (champ ? 'Congratulations, you are the new champion!' : 'Congratulations, you won the match!') : 'You lost the match. No worries, you can try again.';
				return _List_fromArray(
					[
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin', '20px 20px 10px 20px'),
								$elm$html$Html$Attributes$src('graphics/' + (imgsrc + '.gif'))
							]),
						_List_Nil),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin', '0px 20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(txt)
							])),
						$author$project$Page$Challenge$viewMatch(m)
					]);
			} else {
				var matches = s.a;
				return A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[$aforemny$material_components_web_elm$Material$Typography$typography]),
						_List_fromArray(
							[
								$elm$html$Html$text('Your Latest Matches')
							])),
					A3(
						$elm$core$List$foldr,
						F2(
							function (m, h) {
								return A2(
									$elm$core$List$cons,
									$author$project$Page$Challenge$viewMatch(m),
									h);
							}),
						_List_Nil,
						matches));
			}
		default:
			var msg = s.a;
			switch (msg) {
				case 'FailUser':
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin', '20px 20px 10px 20px'),
									$elm$html$Html$Attributes$src('graphics/work.gif')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin', '0px 20px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Please finish your bot first!')
								]))
						]);
				case 'FailOpponent':
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin', '20px 20px 10px 20px'),
									$elm$html$Html$Attributes$src('graphics/work.gif')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin', '0px 20px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Please wait for that user to finish its bot.')
								]))
						]);
				default:
					return _List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin', '20px 20px 10px 20px'),
									$elm$html$Html$Attributes$src('graphics/danger.gif')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin', '0px 20px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Unknown error. '),
									$elm$html$Html$text(msg)
								]))
						]);
			}
	}
};
var $author$project$Page$Challenge$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('page-content')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('play-space'),
						$elm$html$Html$Attributes$class('page-content'),
						$elm$html$Html$Attributes$class(
						$author$project$Page$Challenge$playClass(model.r))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('play-bar')
							]),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$img,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src('/graphics/logo2.png'),
										A2($elm$html$Html$Attributes$style, 'margin-left', 'auto'),
										A2($elm$html$Html$Attributes$style, 'margin-right', 'auto'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '10px'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px'),
										A2($elm$html$Html$Attributes$style, 'height', '200px'),
										A2($elm$html$Html$Attributes$style, 'object-fit', 'contain'),
										A2($elm$html$Html$Attributes$style, 'display', 'inline-flex')
									]),
								_List_Nil),
							_Utils_ap(
								_List_fromArray(
									[
										$author$project$Page$Challenge$viewOpponentButton(model.aG)
									]),
								_List_fromArray(
									[
										A2(
										$aforemny$material_components_web_elm$Material$Button$unelevated,
										A2(
											$aforemny$material_components_web_elm$Material$Button$setAttributes,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('button'),
													A2($elm$html$Html$Attributes$style, 'width', '100%')
												]),
											A2(
												$aforemny$material_components_web_elm$Material$Button$setIcon,
												$elm$core$Maybe$Just(
													$aforemny$material_components_web_elm$Material$Button$icon('person')),
												A2(
													$aforemny$material_components_web_elm$Material$Button$setOnClick,
													$author$project$Page$Challenge$ChallengeRequest(false),
													$aforemny$material_components_web_elm$Material$Button$config))),
										'Challenge other Player'),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'height', '20px')
											]),
										_List_Nil),
										A2(
										$aforemny$material_components_web_elm$Material$Button$unelevated,
										A2(
											$aforemny$material_components_web_elm$Material$Button$setAttributes,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('button'),
													A2($elm$html$Html$Attributes$style, 'width', '100%')
												]),
											A2(
												$aforemny$material_components_web_elm$Material$Button$setIcon,
												$elm$core$Maybe$Just(
													$aforemny$material_components_web_elm$Material$Button$icon('emoji_events')),
												A2(
													$aforemny$material_components_web_elm$Material$Button$setOnClick,
													$author$project$Page$Challenge$ChallengeRequest(true),
													$aforemny$material_components_web_elm$Material$Button$config))),
										'Challenge the Champion'),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'height', '20px')
											]),
										_List_Nil),
										A2(
										$aforemny$material_components_web_elm$Material$Button$unelevated,
										A2(
											$aforemny$material_components_web_elm$Material$Button$setAttributes,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('button'),
													A2($elm$html$Html$Attributes$style, 'width', '100%')
												]),
											A2(
												$aforemny$material_components_web_elm$Material$Button$setIcon,
												$elm$core$Maybe$Just(
													$aforemny$material_components_web_elm$Material$Button$icon('view_list')),
												A2($aforemny$material_components_web_elm$Material$Button$setOnClick, $author$project$Page$Challenge$ViewMatchesRequest, $aforemny$material_components_web_elm$Material$Button$config))),
										'View your Matches')
									])))),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('match-frame'),
								$elm$html$Html$Attributes$class(
								$author$project$Page$Challenge$playClass(model.r)),
								A2(
								$elm$html$Html$Attributes$style,
								'display',
								A2($author$project$Page$Challenge$displayFrame, true, model.r)),
								$aforemny$material_components_web_elm$Material$Typography$typography
							]),
						$author$project$Page$Challenge$viewStatus(model.r)),
						A2(
						$elm$html$Html$iframe,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('game-frame'),
								A2(
								$elm$html$Html$Attributes$style,
								'display',
								A2($author$project$Page$Challenge$displayFrame, false, model.r))
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$Page$Play$PlayRequest = {$: 1};
var $author$project$Page$Play$SelectPlayer = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Page$Play$viewPlayerButton = function (i) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('theme-dark'),
				A2($elm$html$Html$Attributes$style, 'width', '80%'),
				A2($elm$html$Html$Attributes$style, 'display', 'inline-flex')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[$aforemny$material_components_web_elm$Material$Typography$typography]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Player ' + ($elm$core$String$fromInt(i) + ':'))
					])),
				A3(
				$aforemny$material_components_web_elm$Material$Select$outlined,
				A2(
					$aforemny$material_components_web_elm$Material$Select$setAttributes,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', 'white'),
							A2($elm$html$Html$Attributes$style, 'vertical-align', 'middle'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'margin-left', 'auto')
						]),
					A2(
						$aforemny$material_components_web_elm$Material$Select$setOnChange,
						$author$project$Page$Play$SelectPlayer(i),
						A2(
							$aforemny$material_components_web_elm$Material$Select$setSelected,
							$elm$core$Maybe$Just('none'),
							A2($aforemny$material_components_web_elm$Material$Select$setLabel, $elm$core$Maybe$Nothing, $aforemny$material_components_web_elm$Material$Select$config)))),
				A2(
					$aforemny$material_components_web_elm$Material$Select$Item$selectItem,
					$aforemny$material_components_web_elm$Material$Select$Item$config(
						{aP: 'human'}),
					'Human'),
				_List_fromArray(
					[
						A2(
						$aforemny$material_components_web_elm$Material$Select$Item$selectItem,
						$aforemny$material_components_web_elm$Material$Select$Item$config(
							{aP: 'easy'}),
						'Bot (Easy)'),
						A2(
						$aforemny$material_components_web_elm$Material$Select$Item$selectItem,
						$aforemny$material_components_web_elm$Material$Select$Item$config(
							{aP: 'medium'}),
						'Bot (Medium)'),
						A2(
						$aforemny$material_components_web_elm$Material$Select$Item$selectItem,
						$aforemny$material_components_web_elm$Material$Select$Item$config(
							{aP: 'hard'}),
						'Bot (Hard)'),
						A2(
						$aforemny$material_components_web_elm$Material$Select$Item$selectItem,
						$aforemny$material_components_web_elm$Material$Select$Item$config(
							{aP: 'none'}),
						'None')
					]))
			]));
};
var $author$project$Page$Play$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('page-content')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('play-space'),
						$elm$html$Html$Attributes$class('page-content'),
						$elm$html$Html$Attributes$class('large')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('play-bar')
							]),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$img,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$src('/graphics/logo.png'),
										A2($elm$html$Html$Attributes$style, 'margin-left', 'auto'),
										A2($elm$html$Html$Attributes$style, 'margin-right', '20px'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '10px'),
										A2($elm$html$Html$Attributes$style, 'height', '100px'),
										A2($elm$html$Html$Attributes$style, 'object-fit', 'contain'),
										A2($elm$html$Html$Attributes$style, 'display', 'inline-flex')
									]),
								_List_Nil),
							_Utils_ap(
								A2(
									$elm$core$List$map,
									$author$project$Page$Play$viewPlayerButton,
									A2($elm$core$List$range, 0, 3)),
								_List_fromArray(
									[
										A2(
										$aforemny$material_components_web_elm$Material$Button$unelevated,
										A2(
											$aforemny$material_components_web_elm$Material$Button$setAttributes,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('button'),
													A2($elm$html$Html$Attributes$style, 'width', '100%')
												]),
											A2($aforemny$material_components_web_elm$Material$Button$setOnClick, $author$project$Page$Play$PlayRequest, $aforemny$material_components_web_elm$Material$Button$config)),
										'Play')
									])))),
						A2(
						$elm$html$Html$iframe,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('game-frame')
							]),
						_List_Nil)
					]))
			]));
};
var $aforemny$material_components_web_elm$Material$Card$Block = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$Card$block = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$Card$actionsElt = function (content) {
	var _v0 = content.de;
	if (!_v0.$) {
		var buttons = _v0.a.al;
		var icons = _v0.a.at;
		var fullBleed = _v0.a.bc;
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$elm$core$Maybe$Just(
							$elm$html$Html$Attributes$class('mdc-card__actions')),
							fullBleed ? $elm$core$Maybe$Just(
							$elm$html$Html$Attributes$class('mdc-card__actions--full-bleed')) : $elm$core$Maybe$Nothing
						])),
				$elm$core$List$concat(
					_List_fromArray(
						[
							(!$elm$core$List$isEmpty(buttons)) ? _List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mdc-card__action-buttons')
									]),
								A2(
									$elm$core$List$map,
									function (_v1) {
										var button_ = _v1;
										return button_;
									},
									buttons))
							]) : _List_Nil,
							(!$elm$core$List$isEmpty(icons)) ? _List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mdc-card__action-icons')
									]),
								A2(
									$elm$core$List$map,
									function (_v2) {
										var icon_ = _v2;
										return icon_;
									},
									icons))
							]) : _List_Nil
						])))
			]);
	} else {
		return _List_Nil;
	}
};
var $aforemny$material_components_web_elm$Material$Card$clickHandler = function (_v0) {
	var onClick = _v0.bB;
	return A2($elm$core$Maybe$map, $elm$html$Html$Events$onClick, onClick);
};
var $aforemny$material_components_web_elm$Material$Card$hrefAttr = function (_v0) {
	var href = _v0.X;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$href, href);
};
var $aforemny$material_components_web_elm$Material$Card$primaryActionCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-card__primary-action'));
var $aforemny$material_components_web_elm$Material$Card$tabIndexProp = function (tabIndex) {
	return $elm$core$Maybe$Just(
		A2(
			$elm$html$Html$Attributes$property,
			'tabIndex',
			$elm$json$Json$Encode$int(tabIndex)));
};
var $aforemny$material_components_web_elm$Material$Card$targetAttr = function (_v0) {
	var target = _v0.bZ;
	return A2($elm$core$Maybe$map, $elm$html$Html$Attributes$target, target);
};
var $aforemny$material_components_web_elm$Material$Card$primaryAction = F2(
	function (config_, blocks) {
		var href = config_.X;
		return _List_fromArray(
			[
				A2(
				(!_Utils_eq(href, $elm$core$Maybe$Nothing)) ? $elm$html$Html$a : $elm$html$Html$div,
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$Card$primaryActionCs,
							$aforemny$material_components_web_elm$Material$Card$tabIndexProp(0),
							$aforemny$material_components_web_elm$Material$Card$clickHandler(config_),
							$aforemny$material_components_web_elm$Material$Card$hrefAttr(config_),
							$aforemny$material_components_web_elm$Material$Card$targetAttr(config_)
						])),
				A2(
					$elm$core$List$map,
					function (_v0) {
						var html = _v0;
						return html;
					},
					blocks))
			]);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $aforemny$material_components_web_elm$Material$Card$blocksElt = F2(
	function (config_, _v0) {
		var onClick = config_.bB;
		var href = config_.X;
		var blocks = _v0.dj;
		return A2(
			$elm$core$List$map,
			function (_v1) {
				var html = _v1;
				return html;
			},
			(((!_Utils_eq(onClick, $elm$core$Maybe$Nothing)) || (!_Utils_eq(href, $elm$core$Maybe$Nothing))) ? $aforemny$material_components_web_elm$Material$Card$primaryAction(config_) : $elm$core$Basics$identity)(
				A2($elm$core$List$cons, blocks.a, blocks.b)));
	});
var $aforemny$material_components_web_elm$Material$Card$outlinedCs = function (_v0) {
	var outlined = _v0.bG;
	return outlined ? $elm$core$Maybe$Just(
		$elm$html$Html$Attributes$class('mdc-card--outlined')) : $elm$core$Maybe$Nothing;
};
var $aforemny$material_components_web_elm$Material$Card$rootCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-card'));
var $aforemny$material_components_web_elm$Material$Card$card = F2(
	function (config_, content) {
		var additionalAttributes = config_.aT;
		return A3(
			$elm$html$Html$node,
			'mdc-card',
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$Card$rootCs,
							$aforemny$material_components_web_elm$Material$Card$outlinedCs(config_)
						])),
				additionalAttributes),
			$elm$core$List$concat(
				_List_fromArray(
					[
						A2($aforemny$material_components_web_elm$Material$Card$blocksElt, config_, content),
						$aforemny$material_components_web_elm$Material$Card$actionsElt(content)
					])));
	});
var $aforemny$material_components_web_elm$Material$Card$Config = $elm$core$Basics$identity;
var $aforemny$material_components_web_elm$Material$Card$config = {aT: _List_Nil, X: $elm$core$Maybe$Nothing, bB: $elm$core$Maybe$Nothing, bG: false, bZ: $elm$core$Maybe$Nothing};
var $author$project$Page$Ranking$displayFrame = F2(
	function (isMatch, status) {
		if (!status) {
			return isMatch ? 'none' : 'block';
		} else {
			return isMatch ? 'flex' : 'none';
		}
	});
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $author$project$Page$Ranking$playClass = function (status) {
	if (status === 1) {
		return 'scroll';
	} else {
		return 'large';
	}
};
var $aforemny$material_components_web_elm$Material$Card$setAttributes = F2(
	function (additionalAttributes, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{aT: additionalAttributes});
	});
var $aforemny$material_components_web_elm$Material$Card$setOutlined = F2(
	function (outlined, _v0) {
		var config_ = _v0;
		return _Utils_update(
			config_,
			{bG: outlined});
	});
var $aforemny$material_components_web_elm$Material$Card$Square = 0;
var $aforemny$material_components_web_elm$Material$Card$aspectCs = function (aspect) {
	if (!aspect.$) {
		if (!aspect.a) {
			var _v1 = aspect.a;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-card__media--square'));
		} else {
			var _v2 = aspect.a;
			return $elm$core$Maybe$Just(
				$elm$html$Html$Attributes$class('mdc-card__media--16-9'));
		}
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $aforemny$material_components_web_elm$Material$Card$backgroundImageAttr = function (url) {
	return $elm$core$Maybe$Just(
		A2($elm$html$Html$Attributes$style, 'background-image', 'url(\"' + (url + '\")')));
};
var $aforemny$material_components_web_elm$Material$Card$mediaCs = $elm$core$Maybe$Just(
	$elm$html$Html$Attributes$class('mdc-card__media'));
var $aforemny$material_components_web_elm$Material$Card$mediaView = F3(
	function (aspect, additionalAttributes, backgroundImage) {
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$aforemny$material_components_web_elm$Material$Card$mediaCs,
							$aforemny$material_components_web_elm$Material$Card$backgroundImageAttr(backgroundImage),
							$aforemny$material_components_web_elm$Material$Card$aspectCs(aspect)
						])),
				additionalAttributes),
			_List_Nil);
	});
var $aforemny$material_components_web_elm$Material$Card$squareMedia = F2(
	function (additionalAttributes, backgroundImage) {
		return A3(
			$aforemny$material_components_web_elm$Material$Card$mediaView,
			$elm$core$Maybe$Just(0),
			additionalAttributes,
			backgroundImage);
	});
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$Page$Ranking$viewChampion = function (mb) {
	var avatar = A2(
		$elm$core$Maybe$withDefault,
		0,
		A2(
			$elm$core$Maybe$map,
			function (c) {
				return c.aZ;
			},
			mb));
	var name = A2(
		$elm$core$Maybe$withDefault,
		'None',
		A2(
			$elm$core$Maybe$map,
			function (c) {
				return c.a_;
			},
			mb));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('champion-display')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$src(
						'/graphics/players/p' + ($elm$core$String$fromInt(avatar) + '.gif'))
					]),
				_List_Nil),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('champion-name')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(name)
					]))
			]));
};
var $author$project$Page$Ranking$ViewMatchRequest = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$Ranking$viewMatch = function (m) {
	var n1 = m.bk.bv;
	var n2 = m.bl.bv;
	var s1 = _Utils_eq(
		m.bo,
		$elm$core$Maybe$Just(m.bk.bu)) ? A2($elm$html$Html$Attributes$style, 'opacity', '1') : A2($elm$html$Html$Attributes$style, 'opacity', '0.6');
	var s2 = _Utils_eq(
		m.bo,
		$elm$core$Maybe$Just(m.bl.bu)) ? A2($elm$html$Html$Attributes$style, 'opacity', '1') : A2($elm$html$Html$Attributes$style, 'opacity', '0.6');
	var pad = A2($elm$html$Html$Attributes$style, 'padding', '10px 10px');
	var i = m.bf ? 'graphics/champion.gif' : 'graphics/vs.gif';
	return A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('theme-dark'),
				$elm$html$Html$Attributes$class('match-button'),
				$elm$html$Html$Events$onClick(
				$author$project$Page$Ranking$ViewMatchRequest(m.bn))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('date'),
						A2($elm$html$Html$Attributes$style, 'margin', '5px 0px 0px 0px'),
						$aforemny$material_components_web_elm$Material$Typography$typography
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$author$project$Utils$millisToString(m.bn))
					])),
				A2(
				$elm$html$Html$img,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('champion'),
						$elm$html$Html$Attributes$src(i)
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('match'),
						$aforemny$material_components_web_elm$Material$Typography$typography
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('match-name'),
								s1,
								$aforemny$material_components_web_elm$Material$Typography$typography
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(n1)
							])),
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(
								A2(
									$elm$core$String$append,
									'graphics/players/p',
									A2(
										$elm$core$String$append,
										$elm$core$String$fromInt(m.bk.bt),
										'.gif'))),
								s1,
								pad
							]),
						_List_Nil),
						$elm$html$Html$text('VS'),
						A2(
						$elm$html$Html$img,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$src(
								A2(
									$elm$core$String$append,
									'graphics/players/p',
									A2(
										$elm$core$String$append,
										$elm$core$String$fromInt(m.bl.bt),
										'.gif'))),
								s2,
								pad
							]),
						_List_Nil),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('match-name'),
								s2,
								$aforemny$material_components_web_elm$Material$Typography$typography
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(n2)
							]))
					]))
			]));
};
var $author$project$Page$Ranking$viewStatus = function (model) {
	var _v0 = model.r;
	if (!_v0) {
		return _List_Nil;
	} else {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (m, h) {
					return A2(
						$elm$core$List$cons,
						$author$project$Page$Ranking$viewMatch(m),
						h);
				}),
			_List_Nil,
			model._.bQ);
	}
};
var $author$project$Page$Ranking$viewMatches = function (model) {
	return A2(
		$elm$core$List$cons,
		A2(
			$elm$html$Html$h1,
			_List_fromArray(
				[$aforemny$material_components_web_elm$Material$Typography$typography]),
			_List_fromArray(
				[
					$elm$html$Html$text('Latest Championship Matches')
				])),
		$author$project$Page$Ranking$viewStatus(model));
};
var $author$project$Page$Ranking$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('page-content')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('play-space'),
						$elm$html$Html$Attributes$class('page-content'),
						$elm$html$Html$Attributes$class(
						$author$project$Page$Ranking$playClass(model.r))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('play-bar')
							]),
						_List_fromArray(
							[
								A2(
								$aforemny$material_components_web_elm$Material$Card$card,
								A2(
									$aforemny$material_components_web_elm$Material$Card$setOutlined,
									true,
									A2(
										$aforemny$material_components_web_elm$Material$Card$setAttributes,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('champion-card')
											]),
										$aforemny$material_components_web_elm$Material$Card$config)),
								{
									de: $elm$core$Maybe$Nothing,
									dj: _Utils_Tuple2(
										A2(
											$aforemny$material_components_web_elm$Material$Card$squareMedia,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('champion-card-media')
												]),
											'/graphics/champion.gif'),
										_List_fromArray(
											[
												$aforemny$material_components_web_elm$Material$Card$block(
												A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('champion-div'),
															$aforemny$material_components_web_elm$Material$Typography$typography
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$h2,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$style, 'color', '#af6c00')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('\uD83C\uDFC6 Current Champion \uD83C\uDFC6')
																])),
															$author$project$Page$Ranking$viewChampion(model._.bP)
														])))
											]))
								})
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('match-frame'),
								$elm$html$Html$Attributes$class(
								$author$project$Page$Ranking$playClass(model.r)),
								A2(
								$elm$html$Html$Attributes$style,
								'display',
								A2($author$project$Page$Ranking$displayFrame, true, model.r))
							]),
						$author$project$Page$Ranking$viewMatches(model)),
						A2(
						$elm$html$Html$iframe,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('game-frame'),
								A2(
								$elm$html$Html$Attributes$style,
								'display',
								A2($author$project$Page$Ranking$displayFrame, false, model.r))
							]),
						_List_Nil)
					]))
			]));
};
var $author$project$Main$viewTab = function (model) {
	var _v0 = model.p;
	switch (_v0.$) {
		case 0:
			var m = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$PlayMsg,
				$author$project$Page$Play$view(m));
		case 1:
			var m = _v0.a;
			return A2(
				$elm$html$Html$map,
				$author$project$Main$RankingMsg,
				$author$project$Page$Ranking$view(m));
		case 2:
			var m = _v0.a;
			return A2(
				$author$project$Main$authenticatedPage,
				$author$project$Utils$isJust(model.C),
				A2(
					$elm$html$Html$map,
					$author$project$Main$BotMsg,
					$author$project$Page$Bot$view(m)));
		default:
			var m = _v0.a;
			return A2(
				$author$project$Main$authenticatedPage,
				$author$project$Utils$isJust(model.C),
				A2(
					$elm$html$Html$map,
					$author$project$Main$ChallengeMsg,
					$author$project$Page$Challenge$view(m)));
	}
};
var $author$project$Main$view = function (model) {
	var config = function (index) {
		return A2(
			$aforemny$material_components_web_elm$Material$Tab$setOnClick,
			$author$project$Main$SelectTab(index),
			A2(
				$aforemny$material_components_web_elm$Material$Tab$setActive,
				_Utils_eq(model.aK, index),
				$aforemny$material_components_web_elm$Material$Tab$config));
	};
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Main$loginHeader(model),
				A3(
				$aforemny$material_components_web_elm$Material$TabBar$tabBar,
				$aforemny$material_components_web_elm$Material$TabBar$config,
				A2(
					$aforemny$material_components_web_elm$Material$Tab$tab,
					config(0),
					{
						as: $elm$core$Maybe$Just(
							$aforemny$material_components_web_elm$Material$Tab$icon('videogame_asset')),
						ax: 'Play the Game'
					}),
				_List_fromArray(
					[
						A2(
						$aforemny$material_components_web_elm$Material$Tab$tab,
						config(1),
						{
							as: $elm$core$Maybe$Just(
								$aforemny$material_components_web_elm$Material$Tab$icon('emoji_events')),
							ax: 'View the Leaderboard'
						}),
						A2(
						$aforemny$material_components_web_elm$Material$Tab$tab,
						config(2),
						{
							as: $elm$core$Maybe$Just(
								$aforemny$material_components_web_elm$Material$Tab$icon('build')),
							ax: 'Create Your Bot'
						}),
						A2(
						$aforemny$material_components_web_elm$Material$Tab$tab,
						config(3),
						{
							as: $elm$core$Maybe$Just(
								$aforemny$material_components_web_elm$Material$Tab$icon('sports_mma')),
							ax: 'Challenge other Bots'
						})
					])),
				$author$project$Main$viewTab(model)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{dF: $author$project$Main$init, d$: $author$project$Main$subscriptions, d3: $author$project$Main$update, d5: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));