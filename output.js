(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/punycode/punycode.js
  var require_punycode = __commonJS({
    "node_modules/punycode/punycode.js"(exports, module) {
      (function(root) {
        var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
        var freeModule = typeof module == "object" && module && !module.nodeType && module;
        var freeGlobal = typeof global == "object" && global;
        if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
          root = freeGlobal;
        }
        var punycode, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
          "overflow": "Overflow: input needs wider integers to process",
          "not-basic": "Illegal input >= 0x80 (not a basic code point)",
          "invalid-input": "Invalid input"
        }, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, key;
        function error(type) {
          throw new RangeError(errors[type]);
        }
        function map(array, fn) {
          var length = array.length;
          var result = [];
          while (length--) {
            result[length] = fn(array[length]);
          }
          return result;
        }
        function mapDomain(string, fn) {
          var parts = string.split("@");
          var result = "";
          if (parts.length > 1) {
            result = parts[0] + "@";
            string = parts[1];
          }
          string = string.replace(regexSeparators, ".");
          var labels = string.split(".");
          var encoded = map(labels, fn).join(".");
          return result + encoded;
        }
        function ucs2decode(string) {
          var output = [], counter = 0, length = string.length, value, extra;
          while (counter < length) {
            value = string.charCodeAt(counter++);
            if (value >= 55296 && value <= 56319 && counter < length) {
              extra = string.charCodeAt(counter++);
              if ((extra & 64512) == 56320) {
                output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
              } else {
                output.push(value);
                counter--;
              }
            } else {
              output.push(value);
            }
          }
          return output;
        }
        function ucs2encode(array) {
          return map(array, function(value) {
            var output = "";
            if (value > 65535) {
              value -= 65536;
              output += stringFromCharCode(value >>> 10 & 1023 | 55296);
              value = 56320 | value & 1023;
            }
            output += stringFromCharCode(value);
            return output;
          }).join("");
        }
        function basicToDigit(codePoint) {
          if (codePoint - 48 < 10) {
            return codePoint - 22;
          }
          if (codePoint - 65 < 26) {
            return codePoint - 65;
          }
          if (codePoint - 97 < 26) {
            return codePoint - 97;
          }
          return base;
        }
        function digitToBasic(digit, flag) {
          return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
        }
        function adapt(delta, numPoints, firstTime) {
          var k = 0;
          delta = firstTime ? floor(delta / damp) : delta >> 1;
          delta += floor(delta / numPoints);
          for (; delta > baseMinusTMin * tMax >> 1; k += base) {
            delta = floor(delta / baseMinusTMin);
          }
          return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
        }
        function decode(input) {
          var output = [], inputLength = input.length, out, i = 0, n = initialN, bias = initialBias, basic, j, index, oldi, w, k, digit, t, baseMinusT;
          basic = input.lastIndexOf(delimiter);
          if (basic < 0) {
            basic = 0;
          }
          for (j = 0; j < basic; ++j) {
            if (input.charCodeAt(j) >= 128) {
              error("not-basic");
            }
            output.push(input.charCodeAt(j));
          }
          for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
            for (oldi = i, w = 1, k = base; ; k += base) {
              if (index >= inputLength) {
                error("invalid-input");
              }
              digit = basicToDigit(input.charCodeAt(index++));
              if (digit >= base || digit > floor((maxInt - i) / w)) {
                error("overflow");
              }
              i += digit * w;
              t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
              if (digit < t) {
                break;
              }
              baseMinusT = base - t;
              if (w > floor(maxInt / baseMinusT)) {
                error("overflow");
              }
              w *= baseMinusT;
            }
            out = output.length + 1;
            bias = adapt(i - oldi, out, oldi == 0);
            if (floor(i / out) > maxInt - n) {
              error("overflow");
            }
            n += floor(i / out);
            i %= out;
            output.splice(i++, 0, n);
          }
          return ucs2encode(output);
        }
        function encode(input) {
          var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
          input = ucs2decode(input);
          inputLength = input.length;
          n = initialN;
          delta = 0;
          bias = initialBias;
          for (j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue < 128) {
              output.push(stringFromCharCode(currentValue));
            }
          }
          handledCPCount = basicLength = output.length;
          if (basicLength) {
            output.push(delimiter);
          }
          while (handledCPCount < inputLength) {
            for (m = maxInt, j = 0; j < inputLength; ++j) {
              currentValue = input[j];
              if (currentValue >= n && currentValue < m) {
                m = currentValue;
              }
            }
            handledCPCountPlusOne = handledCPCount + 1;
            if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
              error("overflow");
            }
            delta += (m - n) * handledCPCountPlusOne;
            n = m;
            for (j = 0; j < inputLength; ++j) {
              currentValue = input[j];
              if (currentValue < n && ++delta > maxInt) {
                error("overflow");
              }
              if (currentValue == n) {
                for (q = delta, k = base; ; k += base) {
                  t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                  if (q < t) {
                    break;
                  }
                  qMinusT = q - t;
                  baseMinusT = base - t;
                  output.push(
                    stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                  );
                  q = floor(qMinusT / baseMinusT);
                }
                output.push(stringFromCharCode(digitToBasic(q, 0)));
                bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
                delta = 0;
                ++handledCPCount;
              }
            }
            ++delta;
            ++n;
          }
          return output.join("");
        }
        function toUnicode(input) {
          return mapDomain(input, function(string) {
            return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
          });
        }
        function toASCII(input) {
          return mapDomain(input, function(string) {
            return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
          });
        }
        punycode = {
          /**
           * A string representing the current Punycode.js version number.
           * @memberOf punycode
           * @type String
           */
          "version": "1.4.1",
          /**
           * An object of methods to convert from JavaScript's internal character
           * representation (UCS-2) to Unicode code points, and back.
           * @see <https://mathiasbynens.be/notes/javascript-encoding>
           * @memberOf punycode
           * @type Object
           */
          "ucs2": {
            "decode": ucs2decode,
            "encode": ucs2encode
          },
          "decode": decode,
          "encode": encode,
          "toASCII": toASCII,
          "toUnicode": toUnicode
        };
        if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
          define("punycode", function() {
            return punycode;
          });
        } else if (freeExports && freeModule) {
          if (module.exports == freeExports) {
            freeModule.exports = punycode;
          } else {
            for (key in punycode) {
              punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
            }
          }
        } else {
          root.punycode = punycode;
        }
      })(exports);
    }
  });

  // node_modules/has-symbols/shams.js
  var require_shams = __commonJS({
    "node_modules/has-symbols/shams.js"(exports, module) {
      "use strict";
      module.exports = function hasSymbols() {
        if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
          return false;
        }
        if (typeof Symbol.iterator === "symbol") {
          return true;
        }
        var obj = {};
        var sym = Symbol("test");
        var symObj = Object(sym);
        if (typeof sym === "string") {
          return false;
        }
        if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
          return false;
        }
        if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
          return false;
        }
        var symVal = 42;
        obj[sym] = symVal;
        for (sym in obj) {
          return false;
        }
        if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
          return false;
        }
        if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
          return false;
        }
        var syms = Object.getOwnPropertySymbols(obj);
        if (syms.length !== 1 || syms[0] !== sym) {
          return false;
        }
        if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
          return false;
        }
        if (typeof Object.getOwnPropertyDescriptor === "function") {
          var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
          if (descriptor.value !== symVal || descriptor.enumerable !== true) {
            return false;
          }
        }
        return true;
      };
    }
  });

  // node_modules/has-symbols/index.js
  var require_has_symbols = __commonJS({
    "node_modules/has-symbols/index.js"(exports, module) {
      "use strict";
      var origSymbol = typeof Symbol !== "undefined" && Symbol;
      var hasSymbolSham = require_shams();
      module.exports = function hasNativeSymbols() {
        if (typeof origSymbol !== "function") {
          return false;
        }
        if (typeof Symbol !== "function") {
          return false;
        }
        if (typeof origSymbol("foo") !== "symbol") {
          return false;
        }
        if (typeof Symbol("bar") !== "symbol") {
          return false;
        }
        return hasSymbolSham();
      };
    }
  });

  // node_modules/has-proto/index.js
  var require_has_proto = __commonJS({
    "node_modules/has-proto/index.js"(exports, module) {
      "use strict";
      var test = {
        foo: {}
      };
      var $Object = Object;
      module.exports = function hasProto() {
        return { __proto__: test }.foo === test.foo && !({ __proto__: null } instanceof $Object);
      };
    }
  });

  // node_modules/function-bind/implementation.js
  var require_implementation = __commonJS({
    "node_modules/function-bind/implementation.js"(exports, module) {
      "use strict";
      var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
      var slice = Array.prototype.slice;
      var toStr = Object.prototype.toString;
      var funcType = "[object Function]";
      module.exports = function bind(that) {
        var target = this;
        if (typeof target !== "function" || toStr.call(target) !== funcType) {
          throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slice.call(arguments, 1);
        var bound;
        var binder = function() {
          if (this instanceof bound) {
            var result = target.apply(
              this,
              args.concat(slice.call(arguments))
            );
            if (Object(result) === result) {
              return result;
            }
            return this;
          } else {
            return target.apply(
              that,
              args.concat(slice.call(arguments))
            );
          }
        };
        var boundLength = Math.max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
          boundArgs.push("$" + i);
        }
        bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
        if (target.prototype) {
          var Empty = function Empty2() {
          };
          Empty.prototype = target.prototype;
          bound.prototype = new Empty();
          Empty.prototype = null;
        }
        return bound;
      };
    }
  });

  // node_modules/function-bind/index.js
  var require_function_bind = __commonJS({
    "node_modules/function-bind/index.js"(exports, module) {
      "use strict";
      var implementation = require_implementation();
      module.exports = Function.prototype.bind || implementation;
    }
  });

  // node_modules/has/src/index.js
  var require_src = __commonJS({
    "node_modules/has/src/index.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);
    }
  });

  // node_modules/get-intrinsic/index.js
  var require_get_intrinsic = __commonJS({
    "node_modules/get-intrinsic/index.js"(exports, module) {
      "use strict";
      var undefined2;
      var $SyntaxError = SyntaxError;
      var $Function = Function;
      var $TypeError = TypeError;
      var getEvalledConstructor = function(expressionSyntax) {
        try {
          return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
        } catch (e) {
        }
      };
      var $gOPD = Object.getOwnPropertyDescriptor;
      if ($gOPD) {
        try {
          $gOPD({}, "");
        } catch (e) {
          $gOPD = null;
        }
      }
      var throwTypeError = function() {
        throw new $TypeError();
      };
      var ThrowTypeError = $gOPD ? function() {
        try {
          arguments.callee;
          return throwTypeError;
        } catch (calleeThrows) {
          try {
            return $gOPD(arguments, "callee").get;
          } catch (gOPDthrows) {
            return throwTypeError;
          }
        }
      }() : throwTypeError;
      var hasSymbols = require_has_symbols()();
      var hasProto = require_has_proto()();
      var getProto = Object.getPrototypeOf || (hasProto ? function(x) {
        return x.__proto__;
      } : null);
      var needsEval = {};
      var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
      var INTRINSICS = {
        "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
        "%Array%": Array,
        "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
        "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
        "%AsyncFromSyncIteratorPrototype%": undefined2,
        "%AsyncFunction%": needsEval,
        "%AsyncGenerator%": needsEval,
        "%AsyncGeneratorFunction%": needsEval,
        "%AsyncIteratorPrototype%": needsEval,
        "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
        "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
        "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
        "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
        "%Boolean%": Boolean,
        "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
        "%Date%": Date,
        "%decodeURI%": decodeURI,
        "%decodeURIComponent%": decodeURIComponent,
        "%encodeURI%": encodeURI,
        "%encodeURIComponent%": encodeURIComponent,
        "%Error%": Error,
        "%eval%": eval,
        // eslint-disable-line no-eval
        "%EvalError%": EvalError,
        "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
        "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
        "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
        "%Function%": $Function,
        "%GeneratorFunction%": needsEval,
        "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
        "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
        "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
        "%isFinite%": isFinite,
        "%isNaN%": isNaN,
        "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
        "%JSON%": typeof JSON === "object" ? JSON : undefined2,
        "%Map%": typeof Map === "undefined" ? undefined2 : Map,
        "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
        "%Math%": Math,
        "%Number%": Number,
        "%Object%": Object,
        "%parseFloat%": parseFloat,
        "%parseInt%": parseInt,
        "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
        "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
        "%RangeError%": RangeError,
        "%ReferenceError%": ReferenceError,
        "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
        "%RegExp%": RegExp,
        "%Set%": typeof Set === "undefined" ? undefined2 : Set,
        "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
        "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
        "%String%": String,
        "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
        "%Symbol%": hasSymbols ? Symbol : undefined2,
        "%SyntaxError%": $SyntaxError,
        "%ThrowTypeError%": ThrowTypeError,
        "%TypedArray%": TypedArray,
        "%TypeError%": $TypeError,
        "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
        "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
        "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
        "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
        "%URIError%": URIError,
        "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
        "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
        "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet
      };
      if (getProto) {
        try {
          null.error;
        } catch (e) {
          errorProto = getProto(getProto(e));
          INTRINSICS["%Error.prototype%"] = errorProto;
        }
      }
      var errorProto;
      var doEval = function doEval2(name) {
        var value;
        if (name === "%AsyncFunction%") {
          value = getEvalledConstructor("async function () {}");
        } else if (name === "%GeneratorFunction%") {
          value = getEvalledConstructor("function* () {}");
        } else if (name === "%AsyncGeneratorFunction%") {
          value = getEvalledConstructor("async function* () {}");
        } else if (name === "%AsyncGenerator%") {
          var fn = doEval2("%AsyncGeneratorFunction%");
          if (fn) {
            value = fn.prototype;
          }
        } else if (name === "%AsyncIteratorPrototype%") {
          var gen = doEval2("%AsyncGenerator%");
          if (gen && getProto) {
            value = getProto(gen.prototype);
          }
        }
        INTRINSICS[name] = value;
        return value;
      };
      var LEGACY_ALIASES = {
        "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
        "%ArrayPrototype%": ["Array", "prototype"],
        "%ArrayProto_entries%": ["Array", "prototype", "entries"],
        "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
        "%ArrayProto_keys%": ["Array", "prototype", "keys"],
        "%ArrayProto_values%": ["Array", "prototype", "values"],
        "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
        "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
        "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
        "%BooleanPrototype%": ["Boolean", "prototype"],
        "%DataViewPrototype%": ["DataView", "prototype"],
        "%DatePrototype%": ["Date", "prototype"],
        "%ErrorPrototype%": ["Error", "prototype"],
        "%EvalErrorPrototype%": ["EvalError", "prototype"],
        "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
        "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
        "%FunctionPrototype%": ["Function", "prototype"],
        "%Generator%": ["GeneratorFunction", "prototype"],
        "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
        "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
        "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
        "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
        "%JSONParse%": ["JSON", "parse"],
        "%JSONStringify%": ["JSON", "stringify"],
        "%MapPrototype%": ["Map", "prototype"],
        "%NumberPrototype%": ["Number", "prototype"],
        "%ObjectPrototype%": ["Object", "prototype"],
        "%ObjProto_toString%": ["Object", "prototype", "toString"],
        "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
        "%PromisePrototype%": ["Promise", "prototype"],
        "%PromiseProto_then%": ["Promise", "prototype", "then"],
        "%Promise_all%": ["Promise", "all"],
        "%Promise_reject%": ["Promise", "reject"],
        "%Promise_resolve%": ["Promise", "resolve"],
        "%RangeErrorPrototype%": ["RangeError", "prototype"],
        "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
        "%RegExpPrototype%": ["RegExp", "prototype"],
        "%SetPrototype%": ["Set", "prototype"],
        "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
        "%StringPrototype%": ["String", "prototype"],
        "%SymbolPrototype%": ["Symbol", "prototype"],
        "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
        "%TypedArrayPrototype%": ["TypedArray", "prototype"],
        "%TypeErrorPrototype%": ["TypeError", "prototype"],
        "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
        "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
        "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
        "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
        "%URIErrorPrototype%": ["URIError", "prototype"],
        "%WeakMapPrototype%": ["WeakMap", "prototype"],
        "%WeakSetPrototype%": ["WeakSet", "prototype"]
      };
      var bind = require_function_bind();
      var hasOwn = require_src();
      var $concat = bind.call(Function.call, Array.prototype.concat);
      var $spliceApply = bind.call(Function.apply, Array.prototype.splice);
      var $replace = bind.call(Function.call, String.prototype.replace);
      var $strSlice = bind.call(Function.call, String.prototype.slice);
      var $exec = bind.call(Function.call, RegExp.prototype.exec);
      var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
      var reEscapeChar = /\\(\\)?/g;
      var stringToPath = function stringToPath2(string) {
        var first = $strSlice(string, 0, 1);
        var last = $strSlice(string, -1);
        if (first === "%" && last !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
        } else if (last === "%" && first !== "%") {
          throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
        }
        var result = [];
        $replace(string, rePropName, function(match, number, quote, subString) {
          result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
        });
        return result;
      };
      var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
        var intrinsicName = name;
        var alias;
        if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
          alias = LEGACY_ALIASES[intrinsicName];
          intrinsicName = "%" + alias[0] + "%";
        }
        if (hasOwn(INTRINSICS, intrinsicName)) {
          var value = INTRINSICS[intrinsicName];
          if (value === needsEval) {
            value = doEval(intrinsicName);
          }
          if (typeof value === "undefined" && !allowMissing) {
            throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
          }
          return {
            alias,
            name: intrinsicName,
            value
          };
        }
        throw new $SyntaxError("intrinsic " + name + " does not exist!");
      };
      module.exports = function GetIntrinsic(name, allowMissing) {
        if (typeof name !== "string" || name.length === 0) {
          throw new $TypeError("intrinsic name must be a non-empty string");
        }
        if (arguments.length > 1 && typeof allowMissing !== "boolean") {
          throw new $TypeError('"allowMissing" argument must be a boolean');
        }
        if ($exec(/^%?[^%]*%?$/, name) === null) {
          throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
        }
        var parts = stringToPath(name);
        var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
        var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
        var intrinsicRealName = intrinsic.name;
        var value = intrinsic.value;
        var skipFurtherCaching = false;
        var alias = intrinsic.alias;
        if (alias) {
          intrinsicBaseName = alias[0];
          $spliceApply(parts, $concat([0, 1], alias));
        }
        for (var i = 1, isOwn = true; i < parts.length; i += 1) {
          var part = parts[i];
          var first = $strSlice(part, 0, 1);
          var last = $strSlice(part, -1);
          if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
            throw new $SyntaxError("property names with quotes must have matching quotes");
          }
          if (part === "constructor" || !isOwn) {
            skipFurtherCaching = true;
          }
          intrinsicBaseName += "." + part;
          intrinsicRealName = "%" + intrinsicBaseName + "%";
          if (hasOwn(INTRINSICS, intrinsicRealName)) {
            value = INTRINSICS[intrinsicRealName];
          } else if (value != null) {
            if (!(part in value)) {
              if (!allowMissing) {
                throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
              }
              return void 0;
            }
            if ($gOPD && i + 1 >= parts.length) {
              var desc = $gOPD(value, part);
              isOwn = !!desc;
              if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
                value = desc.get;
              } else {
                value = value[part];
              }
            } else {
              isOwn = hasOwn(value, part);
              value = value[part];
            }
            if (isOwn && !skipFurtherCaching) {
              INTRINSICS[intrinsicRealName] = value;
            }
          }
        }
        return value;
      };
    }
  });

  // node_modules/call-bind/index.js
  var require_call_bind = __commonJS({
    "node_modules/call-bind/index.js"(exports, module) {
      "use strict";
      var bind = require_function_bind();
      var GetIntrinsic = require_get_intrinsic();
      var $apply = GetIntrinsic("%Function.prototype.apply%");
      var $call = GetIntrinsic("%Function.prototype.call%");
      var $reflectApply = GetIntrinsic("%Reflect.apply%", true) || bind.call($call, $apply);
      var $gOPD = GetIntrinsic("%Object.getOwnPropertyDescriptor%", true);
      var $defineProperty = GetIntrinsic("%Object.defineProperty%", true);
      var $max = GetIntrinsic("%Math.max%");
      if ($defineProperty) {
        try {
          $defineProperty({}, "a", { value: 1 });
        } catch (e) {
          $defineProperty = null;
        }
      }
      module.exports = function callBind(originalFunction) {
        var func = $reflectApply(bind, $call, arguments);
        if ($gOPD && $defineProperty) {
          var desc = $gOPD(func, "length");
          if (desc.configurable) {
            $defineProperty(
              func,
              "length",
              { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
            );
          }
        }
        return func;
      };
      var applyBind = function applyBind2() {
        return $reflectApply(bind, $apply, arguments);
      };
      if ($defineProperty) {
        $defineProperty(module.exports, "apply", { value: applyBind });
      } else {
        module.exports.apply = applyBind;
      }
    }
  });

  // node_modules/call-bind/callBound.js
  var require_callBound = __commonJS({
    "node_modules/call-bind/callBound.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBind = require_call_bind();
      var $indexOf = callBind(GetIntrinsic("String.prototype.indexOf"));
      module.exports = function callBoundIntrinsic(name, allowMissing) {
        var intrinsic = GetIntrinsic(name, !!allowMissing);
        if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
          return callBind(intrinsic);
        }
        return intrinsic;
      };
    }
  });

  // (disabled):node_modules/object-inspect/util.inspect
  var require_util = __commonJS({
    "(disabled):node_modules/object-inspect/util.inspect"() {
    }
  });

  // node_modules/object-inspect/index.js
  var require_object_inspect = __commonJS({
    "node_modules/object-inspect/index.js"(exports, module) {
      var hasMap = typeof Map === "function" && Map.prototype;
      var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
      var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
      var mapForEach = hasMap && Map.prototype.forEach;
      var hasSet = typeof Set === "function" && Set.prototype;
      var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
      var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
      var setForEach = hasSet && Set.prototype.forEach;
      var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
      var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
      var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
      var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
      var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
      var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
      var booleanValueOf = Boolean.prototype.valueOf;
      var objectToString = Object.prototype.toString;
      var functionToString = Function.prototype.toString;
      var $match = String.prototype.match;
      var $slice = String.prototype.slice;
      var $replace = String.prototype.replace;
      var $toUpperCase = String.prototype.toUpperCase;
      var $toLowerCase = String.prototype.toLowerCase;
      var $test = RegExp.prototype.test;
      var $concat = Array.prototype.concat;
      var $join = Array.prototype.join;
      var $arrSlice = Array.prototype.slice;
      var $floor = Math.floor;
      var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
      var gOPS = Object.getOwnPropertySymbols;
      var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
      var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
      var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
      var isEnumerable = Object.prototype.propertyIsEnumerable;
      var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
        return O.__proto__;
      } : null);
      function addNumericSeparator(num, str) {
        if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
          return str;
        }
        var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
        if (typeof num === "number") {
          var int = num < 0 ? -$floor(-num) : $floor(num);
          if (int !== num) {
            var intStr = String(int);
            var dec = $slice.call(str, intStr.length + 1);
            return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
          }
        }
        return $replace.call(str, sepRegex, "$&_");
      }
      var utilInspect = require_util();
      var inspectCustom = utilInspect.custom;
      var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
      module.exports = function inspect_(obj, options, depth, seen) {
        var opts = options || {};
        if (has(opts, "quoteStyle") && (opts.quoteStyle !== "single" && opts.quoteStyle !== "double")) {
          throw new TypeError('option "quoteStyle" must be "single" or "double"');
        }
        if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
          throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
        }
        var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
        if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
          throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
        }
        if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
          throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
        }
        if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
          throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
        }
        var numericSeparator = opts.numericSeparator;
        if (typeof obj === "undefined") {
          return "undefined";
        }
        if (obj === null) {
          return "null";
        }
        if (typeof obj === "boolean") {
          return obj ? "true" : "false";
        }
        if (typeof obj === "string") {
          return inspectString(obj, opts);
        }
        if (typeof obj === "number") {
          if (obj === 0) {
            return Infinity / obj > 0 ? "0" : "-0";
          }
          var str = String(obj);
          return numericSeparator ? addNumericSeparator(obj, str) : str;
        }
        if (typeof obj === "bigint") {
          var bigIntStr = String(obj) + "n";
          return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
        }
        var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
        if (typeof depth === "undefined") {
          depth = 0;
        }
        if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
          return isArray(obj) ? "[Array]" : "[Object]";
        }
        var indent = getIndent(opts, depth);
        if (typeof seen === "undefined") {
          seen = [];
        } else if (indexOf(seen, obj) >= 0) {
          return "[Circular]";
        }
        function inspect(value, from, noIndent) {
          if (from) {
            seen = $arrSlice.call(seen);
            seen.push(from);
          }
          if (noIndent) {
            var newOpts = {
              depth: opts.depth
            };
            if (has(opts, "quoteStyle")) {
              newOpts.quoteStyle = opts.quoteStyle;
            }
            return inspect_(value, newOpts, depth + 1, seen);
          }
          return inspect_(value, opts, depth + 1, seen);
        }
        if (typeof obj === "function" && !isRegExp(obj)) {
          var name = nameOf(obj);
          var keys = arrObjKeys(obj, inspect);
          return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
        }
        if (isSymbol(obj)) {
          var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
          return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
        }
        if (isElement(obj)) {
          var s = "<" + $toLowerCase.call(String(obj.nodeName));
          var attrs = obj.attributes || [];
          for (var i = 0; i < attrs.length; i++) {
            s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
          }
          s += ">";
          if (obj.childNodes && obj.childNodes.length) {
            s += "...";
          }
          s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
          return s;
        }
        if (isArray(obj)) {
          if (obj.length === 0) {
            return "[]";
          }
          var xs = arrObjKeys(obj, inspect);
          if (indent && !singleLineValues(xs)) {
            return "[" + indentedJoin(xs, indent) + "]";
          }
          return "[ " + $join.call(xs, ", ") + " ]";
        }
        if (isError(obj)) {
          var parts = arrObjKeys(obj, inspect);
          if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
            return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
          }
          if (parts.length === 0) {
            return "[" + String(obj) + "]";
          }
          return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
        }
        if (typeof obj === "object" && customInspect) {
          if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
            return utilInspect(obj, { depth: maxDepth - depth });
          } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
            return obj.inspect();
          }
        }
        if (isMap(obj)) {
          var mapParts = [];
          if (mapForEach) {
            mapForEach.call(obj, function(value, key) {
              mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
            });
          }
          return collectionOf("Map", mapSize.call(obj), mapParts, indent);
        }
        if (isSet(obj)) {
          var setParts = [];
          if (setForEach) {
            setForEach.call(obj, function(value) {
              setParts.push(inspect(value, obj));
            });
          }
          return collectionOf("Set", setSize.call(obj), setParts, indent);
        }
        if (isWeakMap(obj)) {
          return weakCollectionOf("WeakMap");
        }
        if (isWeakSet(obj)) {
          return weakCollectionOf("WeakSet");
        }
        if (isWeakRef(obj)) {
          return weakCollectionOf("WeakRef");
        }
        if (isNumber(obj)) {
          return markBoxed(inspect(Number(obj)));
        }
        if (isBigInt(obj)) {
          return markBoxed(inspect(bigIntValueOf.call(obj)));
        }
        if (isBoolean(obj)) {
          return markBoxed(booleanValueOf.call(obj));
        }
        if (isString(obj)) {
          return markBoxed(inspect(String(obj)));
        }
        if (!isDate(obj) && !isRegExp(obj)) {
          var ys = arrObjKeys(obj, inspect);
          var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
          var protoTag = obj instanceof Object ? "" : "null prototype";
          var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
          var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
          var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
          if (ys.length === 0) {
            return tag + "{}";
          }
          if (indent) {
            return tag + "{" + indentedJoin(ys, indent) + "}";
          }
          return tag + "{ " + $join.call(ys, ", ") + " }";
        }
        return String(obj);
      };
      function wrapQuotes(s, defaultStyle, opts) {
        var quoteChar = (opts.quoteStyle || defaultStyle) === "double" ? '"' : "'";
        return quoteChar + s + quoteChar;
      }
      function quote(s) {
        return $replace.call(String(s), /"/g, "&quot;");
      }
      function isArray(obj) {
        return toStr(obj) === "[object Array]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isDate(obj) {
        return toStr(obj) === "[object Date]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isRegExp(obj) {
        return toStr(obj) === "[object RegExp]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isError(obj) {
        return toStr(obj) === "[object Error]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isString(obj) {
        return toStr(obj) === "[object String]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isNumber(obj) {
        return toStr(obj) === "[object Number]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isBoolean(obj) {
        return toStr(obj) === "[object Boolean]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
      }
      function isSymbol(obj) {
        if (hasShammedSymbols) {
          return obj && typeof obj === "object" && obj instanceof Symbol;
        }
        if (typeof obj === "symbol") {
          return true;
        }
        if (!obj || typeof obj !== "object" || !symToString) {
          return false;
        }
        try {
          symToString.call(obj);
          return true;
        } catch (e) {
        }
        return false;
      }
      function isBigInt(obj) {
        if (!obj || typeof obj !== "object" || !bigIntValueOf) {
          return false;
        }
        try {
          bigIntValueOf.call(obj);
          return true;
        } catch (e) {
        }
        return false;
      }
      var hasOwn = Object.prototype.hasOwnProperty || function(key) {
        return key in this;
      };
      function has(obj, key) {
        return hasOwn.call(obj, key);
      }
      function toStr(obj) {
        return objectToString.call(obj);
      }
      function nameOf(f) {
        if (f.name) {
          return f.name;
        }
        var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
        if (m) {
          return m[1];
        }
        return null;
      }
      function indexOf(xs, x) {
        if (xs.indexOf) {
          return xs.indexOf(x);
        }
        for (var i = 0, l = xs.length; i < l; i++) {
          if (xs[i] === x) {
            return i;
          }
        }
        return -1;
      }
      function isMap(x) {
        if (!mapSize || !x || typeof x !== "object") {
          return false;
        }
        try {
          mapSize.call(x);
          try {
            setSize.call(x);
          } catch (s) {
            return true;
          }
          return x instanceof Map;
        } catch (e) {
        }
        return false;
      }
      function isWeakMap(x) {
        if (!weakMapHas || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakMapHas.call(x, weakMapHas);
          try {
            weakSetHas.call(x, weakSetHas);
          } catch (s) {
            return true;
          }
          return x instanceof WeakMap;
        } catch (e) {
        }
        return false;
      }
      function isWeakRef(x) {
        if (!weakRefDeref || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakRefDeref.call(x);
          return true;
        } catch (e) {
        }
        return false;
      }
      function isSet(x) {
        if (!setSize || !x || typeof x !== "object") {
          return false;
        }
        try {
          setSize.call(x);
          try {
            mapSize.call(x);
          } catch (m) {
            return true;
          }
          return x instanceof Set;
        } catch (e) {
        }
        return false;
      }
      function isWeakSet(x) {
        if (!weakSetHas || !x || typeof x !== "object") {
          return false;
        }
        try {
          weakSetHas.call(x, weakSetHas);
          try {
            weakMapHas.call(x, weakMapHas);
          } catch (s) {
            return true;
          }
          return x instanceof WeakSet;
        } catch (e) {
        }
        return false;
      }
      function isElement(x) {
        if (!x || typeof x !== "object") {
          return false;
        }
        if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
          return true;
        }
        return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
      }
      function inspectString(str, opts) {
        if (str.length > opts.maxStringLength) {
          var remaining = str.length - opts.maxStringLength;
          var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
          return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
        }
        var s = $replace.call($replace.call(str, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, lowbyte);
        return wrapQuotes(s, "single", opts);
      }
      function lowbyte(c) {
        var n = c.charCodeAt(0);
        var x = {
          8: "b",
          9: "t",
          10: "n",
          12: "f",
          13: "r"
        }[n];
        if (x) {
          return "\\" + x;
        }
        return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
      }
      function markBoxed(str) {
        return "Object(" + str + ")";
      }
      function weakCollectionOf(type) {
        return type + " { ? }";
      }
      function collectionOf(type, size, entries, indent) {
        var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
        return type + " (" + size + ") {" + joinedEntries + "}";
      }
      function singleLineValues(xs) {
        for (var i = 0; i < xs.length; i++) {
          if (indexOf(xs[i], "\n") >= 0) {
            return false;
          }
        }
        return true;
      }
      function getIndent(opts, depth) {
        var baseIndent;
        if (opts.indent === "	") {
          baseIndent = "	";
        } else if (typeof opts.indent === "number" && opts.indent > 0) {
          baseIndent = $join.call(Array(opts.indent + 1), " ");
        } else {
          return null;
        }
        return {
          base: baseIndent,
          prev: $join.call(Array(depth + 1), baseIndent)
        };
      }
      function indentedJoin(xs, indent) {
        if (xs.length === 0) {
          return "";
        }
        var lineJoiner = "\n" + indent.prev + indent.base;
        return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
      }
      function arrObjKeys(obj, inspect) {
        var isArr = isArray(obj);
        var xs = [];
        if (isArr) {
          xs.length = obj.length;
          for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
          }
        }
        var syms = typeof gOPS === "function" ? gOPS(obj) : [];
        var symMap;
        if (hasShammedSymbols) {
          symMap = {};
          for (var k = 0; k < syms.length; k++) {
            symMap["$" + syms[k]] = syms[k];
          }
        }
        for (var key in obj) {
          if (!has(obj, key)) {
            continue;
          }
          if (isArr && String(Number(key)) === key && key < obj.length) {
            continue;
          }
          if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
            continue;
          } else if ($test.call(/[^\w$]/, key)) {
            xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
          } else {
            xs.push(key + ": " + inspect(obj[key], obj));
          }
        }
        if (typeof gOPS === "function") {
          for (var j = 0; j < syms.length; j++) {
            if (isEnumerable.call(obj, syms[j])) {
              xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
            }
          }
        }
        return xs;
      }
    }
  });

  // node_modules/side-channel/index.js
  var require_side_channel = __commonJS({
    "node_modules/side-channel/index.js"(exports, module) {
      "use strict";
      var GetIntrinsic = require_get_intrinsic();
      var callBound = require_callBound();
      var inspect = require_object_inspect();
      var $TypeError = GetIntrinsic("%TypeError%");
      var $WeakMap = GetIntrinsic("%WeakMap%", true);
      var $Map = GetIntrinsic("%Map%", true);
      var $weakMapGet = callBound("WeakMap.prototype.get", true);
      var $weakMapSet = callBound("WeakMap.prototype.set", true);
      var $weakMapHas = callBound("WeakMap.prototype.has", true);
      var $mapGet = callBound("Map.prototype.get", true);
      var $mapSet = callBound("Map.prototype.set", true);
      var $mapHas = callBound("Map.prototype.has", true);
      var listGetNode = function(list, key) {
        for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
          if (curr.key === key) {
            prev.next = curr.next;
            curr.next = list.next;
            list.next = curr;
            return curr;
          }
        }
      };
      var listGet = function(objects, key) {
        var node = listGetNode(objects, key);
        return node && node.value;
      };
      var listSet = function(objects, key, value) {
        var node = listGetNode(objects, key);
        if (node) {
          node.value = value;
        } else {
          objects.next = {
            // eslint-disable-line no-param-reassign
            key,
            next: objects.next,
            value
          };
        }
      };
      var listHas = function(objects, key) {
        return !!listGetNode(objects, key);
      };
      module.exports = function getSideChannel() {
        var $wm;
        var $m;
        var $o;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          get: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapGet($wm, key);
              }
            } else if ($Map) {
              if ($m) {
                return $mapGet($m, key);
              }
            } else {
              if ($o) {
                return listGet($o, key);
              }
            }
          },
          has: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapHas($wm, key);
              }
            } else if ($Map) {
              if ($m) {
                return $mapHas($m, key);
              }
            } else {
              if ($o) {
                return listHas($o, key);
              }
            }
            return false;
          },
          set: function(key, value) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if (!$wm) {
                $wm = new $WeakMap();
              }
              $weakMapSet($wm, key, value);
            } else if ($Map) {
              if (!$m) {
                $m = new $Map();
              }
              $mapSet($m, key, value);
            } else {
              if (!$o) {
                $o = { key: {}, next: null };
              }
              listSet($o, key, value);
            }
          }
        };
        return channel;
      };
    }
  });

  // node_modules/qs/lib/formats.js
  var require_formats = __commonJS({
    "node_modules/qs/lib/formats.js"(exports, module) {
      "use strict";
      var replace = String.prototype.replace;
      var percentTwenties = /%20/g;
      var Format = {
        RFC1738: "RFC1738",
        RFC3986: "RFC3986"
      };
      module.exports = {
        "default": Format.RFC3986,
        formatters: {
          RFC1738: function(value) {
            return replace.call(value, percentTwenties, "+");
          },
          RFC3986: function(value) {
            return String(value);
          }
        },
        RFC1738: Format.RFC1738,
        RFC3986: Format.RFC3986
      };
    }
  });

  // node_modules/qs/lib/utils.js
  var require_utils = __commonJS({
    "node_modules/qs/lib/utils.js"(exports, module) {
      "use strict";
      var formats = require_formats();
      var has = Object.prototype.hasOwnProperty;
      var isArray = Array.isArray;
      var hexTable = function() {
        var array = [];
        for (var i = 0; i < 256; ++i) {
          array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
        }
        return array;
      }();
      var compactQueue = function compactQueue2(queue) {
        while (queue.length > 1) {
          var item = queue.pop();
          var obj = item.obj[item.prop];
          if (isArray(obj)) {
            var compacted = [];
            for (var j = 0; j < obj.length; ++j) {
              if (typeof obj[j] !== "undefined") {
                compacted.push(obj[j]);
              }
            }
            item.obj[item.prop] = compacted;
          }
        }
      };
      var arrayToObject = function arrayToObject2(source, options) {
        var obj = options && options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        for (var i = 0; i < source.length; ++i) {
          if (typeof source[i] !== "undefined") {
            obj[i] = source[i];
          }
        }
        return obj;
      };
      var merge = function merge2(target, source, options) {
        if (!source) {
          return target;
        }
        if (typeof source !== "object") {
          if (isArray(target)) {
            target.push(source);
          } else if (target && typeof target === "object") {
            if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
              target[source] = true;
            }
          } else {
            return [target, source];
          }
          return target;
        }
        if (!target || typeof target !== "object") {
          return [target].concat(source);
        }
        var mergeTarget = target;
        if (isArray(target) && !isArray(source)) {
          mergeTarget = arrayToObject(target, options);
        }
        if (isArray(target) && isArray(source)) {
          source.forEach(function(item, i) {
            if (has.call(target, i)) {
              var targetItem = target[i];
              if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
                target[i] = merge2(targetItem, item, options);
              } else {
                target.push(item);
              }
            } else {
              target[i] = item;
            }
          });
          return target;
        }
        return Object.keys(source).reduce(function(acc, key) {
          var value = source[key];
          if (has.call(acc, key)) {
            acc[key] = merge2(acc[key], value, options);
          } else {
            acc[key] = value;
          }
          return acc;
        }, mergeTarget);
      };
      var assign = function assignSingleSource(target, source) {
        return Object.keys(source).reduce(function(acc, key) {
          acc[key] = source[key];
          return acc;
        }, target);
      };
      var decode = function(str, decoder, charset) {
        var strWithoutPlus = str.replace(/\+/g, " ");
        if (charset === "iso-8859-1") {
          return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
        }
        try {
          return decodeURIComponent(strWithoutPlus);
        } catch (e) {
          return strWithoutPlus;
        }
      };
      var encode = function encode2(str, defaultEncoder, charset, kind, format) {
        if (str.length === 0) {
          return str;
        }
        var string = str;
        if (typeof str === "symbol") {
          string = Symbol.prototype.toString.call(str);
        } else if (typeof str !== "string") {
          string = String(str);
        }
        if (charset === "iso-8859-1") {
          return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
            return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
          });
        }
        var out = "";
        for (var i = 0; i < string.length; ++i) {
          var c = string.charCodeAt(i);
          if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats.RFC1738 && (c === 40 || c === 41)) {
            out += string.charAt(i);
            continue;
          }
          if (c < 128) {
            out = out + hexTable[c];
            continue;
          }
          if (c < 2048) {
            out = out + (hexTable[192 | c >> 6] + hexTable[128 | c & 63]);
            continue;
          }
          if (c < 55296 || c >= 57344) {
            out = out + (hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63]);
            continue;
          }
          i += 1;
          c = 65536 + ((c & 1023) << 10 | string.charCodeAt(i) & 1023);
          out += hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
        }
        return out;
      };
      var compact = function compact2(value) {
        var queue = [{ obj: { o: value }, prop: "o" }];
        var refs = [];
        for (var i = 0; i < queue.length; ++i) {
          var item = queue[i];
          var obj = item.obj[item.prop];
          var keys = Object.keys(obj);
          for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
              queue.push({ obj, prop: key });
              refs.push(val);
            }
          }
        }
        compactQueue(queue);
        return value;
      };
      var isRegExp = function isRegExp2(obj) {
        return Object.prototype.toString.call(obj) === "[object RegExp]";
      };
      var isBuffer = function isBuffer2(obj) {
        if (!obj || typeof obj !== "object") {
          return false;
        }
        return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
      };
      var combine = function combine2(a, b) {
        return [].concat(a, b);
      };
      var maybeMap = function maybeMap2(val, fn) {
        if (isArray(val)) {
          var mapped = [];
          for (var i = 0; i < val.length; i += 1) {
            mapped.push(fn(val[i]));
          }
          return mapped;
        }
        return fn(val);
      };
      module.exports = {
        arrayToObject,
        assign,
        combine,
        compact,
        decode,
        encode,
        isBuffer,
        isRegExp,
        maybeMap,
        merge
      };
    }
  });

  // node_modules/qs/lib/stringify.js
  var require_stringify = __commonJS({
    "node_modules/qs/lib/stringify.js"(exports, module) {
      "use strict";
      var getSideChannel = require_side_channel();
      var utils = require_utils();
      var formats = require_formats();
      var has = Object.prototype.hasOwnProperty;
      var arrayPrefixGenerators = {
        brackets: function brackets(prefix) {
          return prefix + "[]";
        },
        comma: "comma",
        indices: function indices(prefix, key) {
          return prefix + "[" + key + "]";
        },
        repeat: function repeat(prefix) {
          return prefix;
        }
      };
      var isArray = Array.isArray;
      var push = Array.prototype.push;
      var pushToArray = function(arr, valueOrArray) {
        push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
      };
      var toISO = Date.prototype.toISOString;
      var defaultFormat = formats["default"];
      var defaults = {
        addQueryPrefix: false,
        allowDots: false,
        charset: "utf-8",
        charsetSentinel: false,
        delimiter: "&",
        encode: true,
        encoder: utils.encode,
        encodeValuesOnly: false,
        format: defaultFormat,
        formatter: formats.formatters[defaultFormat],
        // deprecated
        indices: false,
        serializeDate: function serializeDate(date) {
          return toISO.call(date);
        },
        skipNulls: false,
        strictNullHandling: false
      };
      var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
        return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
      };
      var sentinel = {};
      var stringify = function stringify2(object, prefix, generateArrayPrefix, commaRoundTrip, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
        var obj = object;
        var tmpSc = sideChannel;
        var step = 0;
        var findFlag = false;
        while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
          var pos = tmpSc.get(object);
          step += 1;
          if (typeof pos !== "undefined") {
            if (pos === step) {
              throw new RangeError("Cyclic object value");
            } else {
              findFlag = true;
            }
          }
          if (typeof tmpSc.get(sentinel) === "undefined") {
            step = 0;
          }
        }
        if (typeof filter === "function") {
          obj = filter(prefix, obj);
        } else if (obj instanceof Date) {
          obj = serializeDate(obj);
        } else if (generateArrayPrefix === "comma" && isArray(obj)) {
          obj = utils.maybeMap(obj, function(value2) {
            if (value2 instanceof Date) {
              return serializeDate(value2);
            }
            return value2;
          });
        }
        if (obj === null) {
          if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix;
          }
          obj = "";
        }
        if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
          if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
            return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format))];
          }
          return [formatter(prefix) + "=" + formatter(String(obj))];
        }
        var values = [];
        if (typeof obj === "undefined") {
          return values;
        }
        var objKeys;
        if (generateArrayPrefix === "comma" && isArray(obj)) {
          if (encodeValuesOnly && encoder) {
            obj = utils.maybeMap(obj, encoder);
          }
          objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
        } else if (isArray(filter)) {
          objKeys = filter;
        } else {
          var keys = Object.keys(obj);
          objKeys = sort ? keys.sort(sort) : keys;
        }
        var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? prefix + "[]" : prefix;
        for (var j = 0; j < objKeys.length; ++j) {
          var key = objKeys[j];
          var value = typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key];
          if (skipNulls && value === null) {
            continue;
          }
          var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + key : "[" + key + "]");
          sideChannel.set(object, step);
          var valueSideChannel = getSideChannel();
          valueSideChannel.set(sentinel, sideChannel);
          pushToArray(values, stringify2(
            value,
            keyPrefix,
            generateArrayPrefix,
            commaRoundTrip,
            strictNullHandling,
            skipNulls,
            generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder,
            filter,
            sort,
            allowDots,
            serializeDate,
            format,
            formatter,
            encodeValuesOnly,
            charset,
            valueSideChannel
          ));
        }
        return values;
      };
      var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
        if (!opts) {
          return defaults;
        }
        if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
          throw new TypeError("Encoder has to be a function.");
        }
        var charset = opts.charset || defaults.charset;
        if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
          throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
        }
        var format = formats["default"];
        if (typeof opts.format !== "undefined") {
          if (!has.call(formats.formatters, opts.format)) {
            throw new TypeError("Unknown format option provided.");
          }
          format = opts.format;
        }
        var formatter = formats.formatters[format];
        var filter = defaults.filter;
        if (typeof opts.filter === "function" || isArray(opts.filter)) {
          filter = opts.filter;
        }
        return {
          addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
          allowDots: typeof opts.allowDots === "undefined" ? defaults.allowDots : !!opts.allowDots,
          charset,
          charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
          delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
          encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
          encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
          encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
          filter,
          format,
          formatter,
          serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
          skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
          sort: typeof opts.sort === "function" ? opts.sort : null,
          strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
        };
      };
      module.exports = function(object, opts) {
        var obj = object;
        var options = normalizeStringifyOptions(opts);
        var objKeys;
        var filter;
        if (typeof options.filter === "function") {
          filter = options.filter;
          obj = filter("", obj);
        } else if (isArray(options.filter)) {
          filter = options.filter;
          objKeys = filter;
        }
        var keys = [];
        if (typeof obj !== "object" || obj === null) {
          return "";
        }
        var arrayFormat;
        if (opts && opts.arrayFormat in arrayPrefixGenerators) {
          arrayFormat = opts.arrayFormat;
        } else if (opts && "indices" in opts) {
          arrayFormat = opts.indices ? "indices" : "repeat";
        } else {
          arrayFormat = "indices";
        }
        var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
        if (opts && "commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
          throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
        }
        var commaRoundTrip = generateArrayPrefix === "comma" && opts && opts.commaRoundTrip;
        if (!objKeys) {
          objKeys = Object.keys(obj);
        }
        if (options.sort) {
          objKeys.sort(options.sort);
        }
        var sideChannel = getSideChannel();
        for (var i = 0; i < objKeys.length; ++i) {
          var key = objKeys[i];
          if (options.skipNulls && obj[key] === null) {
            continue;
          }
          pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            commaRoundTrip,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.format,
            options.formatter,
            options.encodeValuesOnly,
            options.charset,
            sideChannel
          ));
        }
        var joined = keys.join(options.delimiter);
        var prefix = options.addQueryPrefix === true ? "?" : "";
        if (options.charsetSentinel) {
          if (options.charset === "iso-8859-1") {
            prefix += "utf8=%26%2310003%3B&";
          } else {
            prefix += "utf8=%E2%9C%93&";
          }
        }
        return joined.length > 0 ? prefix + joined : "";
      };
    }
  });

  // node_modules/qs/lib/parse.js
  var require_parse = __commonJS({
    "node_modules/qs/lib/parse.js"(exports, module) {
      "use strict";
      var utils = require_utils();
      var has = Object.prototype.hasOwnProperty;
      var isArray = Array.isArray;
      var defaults = {
        allowDots: false,
        allowPrototypes: false,
        allowSparse: false,
        arrayLimit: 20,
        charset: "utf-8",
        charsetSentinel: false,
        comma: false,
        decoder: utils.decode,
        delimiter: "&",
        depth: 5,
        ignoreQueryPrefix: false,
        interpretNumericEntities: false,
        parameterLimit: 1e3,
        parseArrays: true,
        plainObjects: false,
        strictNullHandling: false
      };
      var interpretNumericEntities = function(str) {
        return str.replace(/&#(\d+);/g, function($0, numberStr) {
          return String.fromCharCode(parseInt(numberStr, 10));
        });
      };
      var parseArrayValue = function(val, options) {
        if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
          return val.split(",");
        }
        return val;
      };
      var isoSentinel = "utf8=%26%2310003%3B";
      var charsetSentinel = "utf8=%E2%9C%93";
      var parseValues = function parseQueryStringValues(str, options) {
        var obj = { __proto__: null };
        var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
        var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
        var parts = cleanStr.split(options.delimiter, limit);
        var skipIndex = -1;
        var i;
        var charset = options.charset;
        if (options.charsetSentinel) {
          for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf("utf8=") === 0) {
              if (parts[i] === charsetSentinel) {
                charset = "utf-8";
              } else if (parts[i] === isoSentinel) {
                charset = "iso-8859-1";
              }
              skipIndex = i;
              i = parts.length;
            }
          }
        }
        for (i = 0; i < parts.length; ++i) {
          if (i === skipIndex) {
            continue;
          }
          var part = parts[i];
          var bracketEqualsPos = part.indexOf("]=");
          var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
          var key, val;
          if (pos === -1) {
            key = options.decoder(part, defaults.decoder, charset, "key");
            val = options.strictNullHandling ? null : "";
          } else {
            key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
            val = utils.maybeMap(
              parseArrayValue(part.slice(pos + 1), options),
              function(encodedVal) {
                return options.decoder(encodedVal, defaults.decoder, charset, "value");
              }
            );
          }
          if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
            val = interpretNumericEntities(val);
          }
          if (part.indexOf("[]=") > -1) {
            val = isArray(val) ? [val] : val;
          }
          if (has.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
          } else {
            obj[key] = val;
          }
        }
        return obj;
      };
      var parseObject = function(chain, val, options, valuesParsed) {
        var leaf = valuesParsed ? val : parseArrayValue(val, options);
        for (var i = chain.length - 1; i >= 0; --i) {
          var obj;
          var root = chain[i];
          if (root === "[]" && options.parseArrays) {
            obj = [].concat(leaf);
          } else {
            obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
            var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === "") {
              obj = { 0: leaf };
            } else if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && (options.parseArrays && index <= options.arrayLimit)) {
              obj = [];
              obj[index] = leaf;
            } else if (cleanRoot !== "__proto__") {
              obj[cleanRoot] = leaf;
            }
          }
          leaf = obj;
        }
        return leaf;
      };
      var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
        if (!givenKey) {
          return;
        }
        var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
        var brackets = /(\[[^[\]]*])/;
        var child = /(\[[^[\]]*])/g;
        var segment = options.depth > 0 && brackets.exec(key);
        var parent = segment ? key.slice(0, segment.index) : key;
        var keys = [];
        if (parent) {
          if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
              return;
            }
          }
          keys.push(parent);
        }
        var i = 0;
        while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
          i += 1;
          if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
              return;
            }
          }
          keys.push(segment[1]);
        }
        if (segment) {
          keys.push("[" + key.slice(segment.index) + "]");
        }
        return parseObject(keys, val, options, valuesParsed);
      };
      var normalizeParseOptions = function normalizeParseOptions2(opts) {
        if (!opts) {
          return defaults;
        }
        if (opts.decoder !== null && opts.decoder !== void 0 && typeof opts.decoder !== "function") {
          throw new TypeError("Decoder has to be a function.");
        }
        if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
          throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
        }
        var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
        return {
          allowDots: typeof opts.allowDots === "undefined" ? defaults.allowDots : !!opts.allowDots,
          allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
          allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
          arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
          charset,
          charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
          comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
          decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
          delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
          // eslint-disable-next-line no-implicit-coercion, no-extra-parens
          depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
          ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
          interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
          parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
          parseArrays: opts.parseArrays !== false,
          plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
          strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
        };
      };
      module.exports = function(str, opts) {
        var options = normalizeParseOptions(opts);
        if (str === "" || str === null || typeof str === "undefined") {
          return options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        }
        var tempObj = typeof str === "string" ? parseValues(str, options) : str;
        var obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
        var keys = Object.keys(tempObj);
        for (var i = 0; i < keys.length; ++i) {
          var key = keys[i];
          var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
          obj = utils.merge(obj, newObj, options);
        }
        if (options.allowSparse === true) {
          return obj;
        }
        return utils.compact(obj);
      };
    }
  });

  // node_modules/qs/lib/index.js
  var require_lib = __commonJS({
    "node_modules/qs/lib/index.js"(exports, module) {
      "use strict";
      var stringify = require_stringify();
      var parse = require_parse();
      var formats = require_formats();
      module.exports = {
        formats,
        parse,
        stringify
      };
    }
  });

  // node_modules/url/url.js
  var require_url = __commonJS({
    "node_modules/url/url.js"(exports) {
      "use strict";
      var punycode = require_punycode();
      function Url() {
        this.protocol = null;
        this.slashes = null;
        this.auth = null;
        this.host = null;
        this.port = null;
        this.hostname = null;
        this.hash = null;
        this.search = null;
        this.query = null;
        this.pathname = null;
        this.path = null;
        this.href = null;
      }
      var protocolPattern = /^([a-z0-9.+-]+:)/i;
      var portPattern = /:[0-9]*$/;
      var simplePathPattern = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/;
      var delims = [
        "<",
        ">",
        '"',
        "`",
        " ",
        "\r",
        "\n",
        "	"
      ];
      var unwise = [
        "{",
        "}",
        "|",
        "\\",
        "^",
        "`"
      ].concat(delims);
      var autoEscape = ["'"].concat(unwise);
      var nonHostChars = [
        "%",
        "/",
        "?",
        ";",
        "#"
      ].concat(autoEscape);
      var hostEndingChars = [
        "/",
        "?",
        "#"
      ];
      var hostnameMaxLen = 255;
      var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
      var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
      var unsafeProtocol = {
        javascript: true,
        "javascript:": true
      };
      var hostlessProtocol = {
        javascript: true,
        "javascript:": true
      };
      var slashedProtocol = {
        http: true,
        https: true,
        ftp: true,
        gopher: true,
        file: true,
        "http:": true,
        "https:": true,
        "ftp:": true,
        "gopher:": true,
        "file:": true
      };
      var querystring2 = require_lib();
      function urlParse(url2, parseQueryString, slashesDenoteHost) {
        if (url2 && typeof url2 === "object" && url2 instanceof Url) {
          return url2;
        }
        var u = new Url();
        u.parse(url2, parseQueryString, slashesDenoteHost);
        return u;
      }
      Url.prototype.parse = function(url2, parseQueryString, slashesDenoteHost) {
        if (typeof url2 !== "string") {
          throw new TypeError("Parameter 'url' must be a string, not " + typeof url2);
        }
        var queryIndex = url2.indexOf("?"), splitter = queryIndex !== -1 && queryIndex < url2.indexOf("#") ? "?" : "#", uSplit = url2.split(splitter), slashRegex = /\\/g;
        uSplit[0] = uSplit[0].replace(slashRegex, "/");
        url2 = uSplit.join(splitter);
        var rest = url2;
        rest = rest.trim();
        if (!slashesDenoteHost && url2.split("#").length === 1) {
          var simplePath = simplePathPattern.exec(rest);
          if (simplePath) {
            this.path = rest;
            this.href = rest;
            this.pathname = simplePath[1];
            if (simplePath[2]) {
              this.search = simplePath[2];
              if (parseQueryString) {
                this.query = querystring2.parse(this.search.substr(1));
              } else {
                this.query = this.search.substr(1);
              }
            } else if (parseQueryString) {
              this.search = "";
              this.query = {};
            }
            return this;
          }
        }
        var proto = protocolPattern.exec(rest);
        if (proto) {
          proto = proto[0];
          var lowerProto = proto.toLowerCase();
          this.protocol = lowerProto;
          rest = rest.substr(proto.length);
        }
        if (slashesDenoteHost || proto || rest.match(/^\/\/[^@/]+@[^@/]+/)) {
          var slashes = rest.substr(0, 2) === "//";
          if (slashes && !(proto && hostlessProtocol[proto])) {
            rest = rest.substr(2);
            this.slashes = true;
          }
        }
        if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
          var hostEnd = -1;
          for (var i = 0; i < hostEndingChars.length; i++) {
            var hec = rest.indexOf(hostEndingChars[i]);
            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
              hostEnd = hec;
            }
          }
          var auth, atSign;
          if (hostEnd === -1) {
            atSign = rest.lastIndexOf("@");
          } else {
            atSign = rest.lastIndexOf("@", hostEnd);
          }
          if (atSign !== -1) {
            auth = rest.slice(0, atSign);
            rest = rest.slice(atSign + 1);
            this.auth = decodeURIComponent(auth);
          }
          hostEnd = -1;
          for (var i = 0; i < nonHostChars.length; i++) {
            var hec = rest.indexOf(nonHostChars[i]);
            if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
              hostEnd = hec;
            }
          }
          if (hostEnd === -1) {
            hostEnd = rest.length;
          }
          this.host = rest.slice(0, hostEnd);
          rest = rest.slice(hostEnd);
          this.parseHost();
          this.hostname = this.hostname || "";
          var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
          if (!ipv6Hostname) {
            var hostparts = this.hostname.split(/\./);
            for (var i = 0, l = hostparts.length; i < l; i++) {
              var part = hostparts[i];
              if (!part) {
                continue;
              }
              if (!part.match(hostnamePartPattern)) {
                var newpart = "";
                for (var j = 0, k = part.length; j < k; j++) {
                  if (part.charCodeAt(j) > 127) {
                    newpart += "x";
                  } else {
                    newpart += part[j];
                  }
                }
                if (!newpart.match(hostnamePartPattern)) {
                  var validParts = hostparts.slice(0, i);
                  var notHost = hostparts.slice(i + 1);
                  var bit = part.match(hostnamePartStart);
                  if (bit) {
                    validParts.push(bit[1]);
                    notHost.unshift(bit[2]);
                  }
                  if (notHost.length) {
                    rest = "/" + notHost.join(".") + rest;
                  }
                  this.hostname = validParts.join(".");
                  break;
                }
              }
            }
          }
          if (this.hostname.length > hostnameMaxLen) {
            this.hostname = "";
          } else {
            this.hostname = this.hostname.toLowerCase();
          }
          if (!ipv6Hostname) {
            this.hostname = punycode.toASCII(this.hostname);
          }
          var p = this.port ? ":" + this.port : "";
          var h = this.hostname || "";
          this.host = h + p;
          this.href += this.host;
          if (ipv6Hostname) {
            this.hostname = this.hostname.substr(1, this.hostname.length - 2);
            if (rest[0] !== "/") {
              rest = "/" + rest;
            }
          }
        }
        if (!unsafeProtocol[lowerProto]) {
          for (var i = 0, l = autoEscape.length; i < l; i++) {
            var ae = autoEscape[i];
            if (rest.indexOf(ae) === -1) {
              continue;
            }
            var esc = encodeURIComponent(ae);
            if (esc === ae) {
              esc = escape(ae);
            }
            rest = rest.split(ae).join(esc);
          }
        }
        var hash = rest.indexOf("#");
        if (hash !== -1) {
          this.hash = rest.substr(hash);
          rest = rest.slice(0, hash);
        }
        var qm = rest.indexOf("?");
        if (qm !== -1) {
          this.search = rest.substr(qm);
          this.query = rest.substr(qm + 1);
          if (parseQueryString) {
            this.query = querystring2.parse(this.query);
          }
          rest = rest.slice(0, qm);
        } else if (parseQueryString) {
          this.search = "";
          this.query = {};
        }
        if (rest) {
          this.pathname = rest;
        }
        if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
          this.pathname = "/";
        }
        if (this.pathname || this.search) {
          var p = this.pathname || "";
          var s = this.search || "";
          this.path = p + s;
        }
        this.href = this.format();
        return this;
      };
      function urlFormat(obj) {
        if (typeof obj === "string") {
          obj = urlParse(obj);
        }
        if (!(obj instanceof Url)) {
          return Url.prototype.format.call(obj);
        }
        return obj.format();
      }
      Url.prototype.format = function() {
        var auth = this.auth || "";
        if (auth) {
          auth = encodeURIComponent(auth);
          auth = auth.replace(/%3A/i, ":");
          auth += "@";
        }
        var protocol = this.protocol || "", pathname = this.pathname || "", hash = this.hash || "", host = false, query = "";
        if (this.host) {
          host = auth + this.host;
        } else if (this.hostname) {
          host = auth + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]");
          if (this.port) {
            host += ":" + this.port;
          }
        }
        if (this.query && typeof this.query === "object" && Object.keys(this.query).length) {
          query = querystring2.stringify(this.query);
        }
        var search = this.search || query && "?" + query || "";
        if (protocol && protocol.substr(-1) !== ":") {
          protocol += ":";
        }
        if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
          host = "//" + (host || "");
          if (pathname && pathname.charAt(0) !== "/") {
            pathname = "/" + pathname;
          }
        } else if (!host) {
          host = "";
        }
        if (hash && hash.charAt(0) !== "#") {
          hash = "#" + hash;
        }
        if (search && search.charAt(0) !== "?") {
          search = "?" + search;
        }
        pathname = pathname.replace(/[?#]/g, function(match) {
          return encodeURIComponent(match);
        });
        search = search.replace("#", "%23");
        return protocol + host + pathname + search + hash;
      };
      function urlResolve(source, relative) {
        return urlParse(source, false, true).resolve(relative);
      }
      Url.prototype.resolve = function(relative) {
        return this.resolveObject(urlParse(relative, false, true)).format();
      };
      function urlResolveObject(source, relative) {
        if (!source) {
          return relative;
        }
        return urlParse(source, false, true).resolveObject(relative);
      }
      Url.prototype.resolveObject = function(relative) {
        if (typeof relative === "string") {
          var rel = new Url();
          rel.parse(relative, false, true);
          relative = rel;
        }
        var result = new Url();
        var tkeys = Object.keys(this);
        for (var tk = 0; tk < tkeys.length; tk++) {
          var tkey = tkeys[tk];
          result[tkey] = this[tkey];
        }
        result.hash = relative.hash;
        if (relative.href === "") {
          result.href = result.format();
          return result;
        }
        if (relative.slashes && !relative.protocol) {
          var rkeys = Object.keys(relative);
          for (var rk = 0; rk < rkeys.length; rk++) {
            var rkey = rkeys[rk];
            if (rkey !== "protocol") {
              result[rkey] = relative[rkey];
            }
          }
          if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
            result.pathname = "/";
            result.path = result.pathname;
          }
          result.href = result.format();
          return result;
        }
        if (relative.protocol && relative.protocol !== result.protocol) {
          if (!slashedProtocol[relative.protocol]) {
            var keys = Object.keys(relative);
            for (var v = 0; v < keys.length; v++) {
              var k = keys[v];
              result[k] = relative[k];
            }
            result.href = result.format();
            return result;
          }
          result.protocol = relative.protocol;
          if (!relative.host && !hostlessProtocol[relative.protocol]) {
            var relPath = (relative.pathname || "").split("/");
            while (relPath.length && !(relative.host = relPath.shift())) {
            }
            if (!relative.host) {
              relative.host = "";
            }
            if (!relative.hostname) {
              relative.hostname = "";
            }
            if (relPath[0] !== "") {
              relPath.unshift("");
            }
            if (relPath.length < 2) {
              relPath.unshift("");
            }
            result.pathname = relPath.join("/");
          } else {
            result.pathname = relative.pathname;
          }
          result.search = relative.search;
          result.query = relative.query;
          result.host = relative.host || "";
          result.auth = relative.auth;
          result.hostname = relative.hostname || relative.host;
          result.port = relative.port;
          if (result.pathname || result.search) {
            var p = result.pathname || "";
            var s = result.search || "";
            result.path = p + s;
          }
          result.slashes = result.slashes || relative.slashes;
          result.href = result.format();
          return result;
        }
        var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/", isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === "/", mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], relPath = relative.pathname && relative.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
        if (psychotic) {
          result.hostname = "";
          result.port = null;
          if (result.host) {
            if (srcPath[0] === "") {
              srcPath[0] = result.host;
            } else {
              srcPath.unshift(result.host);
            }
          }
          result.host = "";
          if (relative.protocol) {
            relative.hostname = null;
            relative.port = null;
            if (relative.host) {
              if (relPath[0] === "") {
                relPath[0] = relative.host;
              } else {
                relPath.unshift(relative.host);
              }
            }
            relative.host = null;
          }
          mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
        }
        if (isRelAbs) {
          result.host = relative.host || relative.host === "" ? relative.host : result.host;
          result.hostname = relative.hostname || relative.hostname === "" ? relative.hostname : result.hostname;
          result.search = relative.search;
          result.query = relative.query;
          srcPath = relPath;
        } else if (relPath.length) {
          if (!srcPath) {
            srcPath = [];
          }
          srcPath.pop();
          srcPath = srcPath.concat(relPath);
          result.search = relative.search;
          result.query = relative.query;
        } else if (relative.search != null) {
          if (psychotic) {
            result.host = srcPath.shift();
            result.hostname = result.host;
            var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
            if (authInHost) {
              result.auth = authInHost.shift();
              result.hostname = authInHost.shift();
              result.host = result.hostname;
            }
          }
          result.search = relative.search;
          result.query = relative.query;
          if (result.pathname !== null || result.search !== null) {
            result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
          }
          result.href = result.format();
          return result;
        }
        if (!srcPath.length) {
          result.pathname = null;
          if (result.search) {
            result.path = "/" + result.search;
          } else {
            result.path = null;
          }
          result.href = result.format();
          return result;
        }
        var last = srcPath.slice(-1)[0];
        var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === "." || last === "..") || last === "";
        var up = 0;
        for (var i = srcPath.length; i >= 0; i--) {
          last = srcPath[i];
          if (last === ".") {
            srcPath.splice(i, 1);
          } else if (last === "..") {
            srcPath.splice(i, 1);
            up++;
          } else if (up) {
            srcPath.splice(i, 1);
            up--;
          }
        }
        if (!mustEndAbs && !removeAllDots) {
          for (; up--; up) {
            srcPath.unshift("..");
          }
        }
        if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
          srcPath.unshift("");
        }
        if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
          srcPath.push("");
        }
        var isAbsolute = srcPath[0] === "" || srcPath[0] && srcPath[0].charAt(0) === "/";
        if (psychotic) {
          result.hostname = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
          result.host = result.hostname;
          var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.hostname = authInHost.shift();
            result.host = result.hostname;
          }
        }
        mustEndAbs = mustEndAbs || result.host && srcPath.length;
        if (mustEndAbs && !isAbsolute) {
          srcPath.unshift("");
        }
        if (srcPath.length > 0) {
          result.pathname = srcPath.join("/");
        } else {
          result.pathname = null;
          result.path = null;
        }
        if (result.pathname !== null || result.search !== null) {
          result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
        }
        result.auth = relative.auth || result.auth;
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      };
      Url.prototype.parseHost = function() {
        var host = this.host;
        var port = portPattern.exec(host);
        if (port) {
          port = port[0];
          if (port !== ":") {
            this.port = port.substr(1);
          }
          host = host.substr(0, host.length - port.length);
        }
        if (host) {
          this.hostname = host;
        }
      };
      exports.parse = urlParse;
      exports.resolve = urlResolve;
      exports.resolveObject = urlResolveObject;
      exports.format = urlFormat;
      exports.Url = Url;
    }
  });

  // node_modules/querystring/decode.js
  var require_decode = __commonJS({
    "node_modules/querystring/decode.js"(exports, module) {
      "use strict";
      function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }
      module.exports = function(qs, sep, eq, options) {
        sep = sep || "&";
        eq = eq || "=";
        var obj = {};
        if (typeof qs !== "string" || qs.length === 0) {
          return obj;
        }
        var regexp = /\+/g;
        qs = qs.split(sep);
        var maxKeys = 1e3;
        if (options && typeof options.maxKeys === "number") {
          maxKeys = options.maxKeys;
        }
        var len = qs.length;
        if (maxKeys > 0 && len > maxKeys) {
          len = maxKeys;
        }
        for (var i = 0; i < len; ++i) {
          var x = qs[i].replace(regexp, "%20"), idx = x.indexOf(eq), kstr, vstr, k, v;
          if (idx >= 0) {
            kstr = x.substr(0, idx);
            vstr = x.substr(idx + 1);
          } else {
            kstr = x;
            vstr = "";
          }
          k = decodeURIComponent(kstr);
          v = decodeURIComponent(vstr);
          if (!hasOwnProperty(obj, k)) {
            obj[k] = v;
          } else if (Array.isArray(obj[k])) {
            obj[k].push(v);
          } else {
            obj[k] = [obj[k], v];
          }
        }
        return obj;
      };
    }
  });

  // node_modules/querystring/encode.js
  var require_encode = __commonJS({
    "node_modules/querystring/encode.js"(exports, module) {
      "use strict";
      var stringifyPrimitive = function(v) {
        switch (typeof v) {
          case "string":
            return v;
          case "boolean":
            return v ? "true" : "false";
          case "number":
            return isFinite(v) ? v : "";
          default:
            return "";
        }
      };
      module.exports = function(obj, sep, eq, name) {
        sep = sep || "&";
        eq = eq || "=";
        if (obj === null) {
          obj = void 0;
        }
        if (typeof obj === "object") {
          return Object.keys(obj).map(function(k) {
            var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
            if (Array.isArray(obj[k])) {
              return obj[k].map(function(v) {
                return ks + encodeURIComponent(stringifyPrimitive(v));
              }).join(sep);
            } else {
              return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
            }
          }).filter(Boolean).join(sep);
        }
        if (!name)
          return "";
        return encodeURIComponent(stringifyPrimitive(name)) + eq + encodeURIComponent(stringifyPrimitive(obj));
      };
    }
  });

  // node_modules/querystring/index.js
  var require_querystring = __commonJS({
    "node_modules/querystring/index.js"(exports) {
      "use strict";
      exports.decode = exports.parse = require_decode();
      exports.encode = exports.stringify = require_encode();
    }
  });

  // script.js
  var import_url = __toESM(require_url(), 1);
  var import_querystring = __toESM(require_querystring(), 1);

  // node_modules/destr/dist/index.mjs
  var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
  var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
  var JsonSigRx = /^\s*["[{]|^\s*-?\d[\d.]{0,14}\s*$/;
  function jsonParseTransform(key, value) {
    if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
      warnKeyDropped(key);
      return;
    }
    return value;
  }
  function warnKeyDropped(key) {
    console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
  }
  function destr(value, options = {}) {
    if (typeof value !== "string") {
      return value;
    }
    const _value = value.trim();
    if (value[0] === '"' && value[value.length - 1] === '"') {
      return _value.slice(1, -1);
    }
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
    if (!JsonSigRx.test(value)) {
      if (options.strict) {
        throw new SyntaxError("[destr] Invalid JSON");
      }
      return value;
    }
    try {
      if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
        if (options.strict) {
          throw new Error("[destr] Possible prototype pollution");
        }
        return JSON.parse(value, jsonParseTransform);
      }
      return JSON.parse(value);
    } catch (error) {
      if (options.strict) {
        throw error;
      }
      return value;
    }
  }

  // script.js
  function parseUrls(urlStrings2) {
    const panjang = urlStrings2.length;
    const results2 = [];
    const parseVmessUrl = (parsedUrl) => {
      let encoded = parsedUrl.substring(8);
      let decodeResult = atob(encoded);
      let parsedJSON = destr(decodeResult);
      const configResult = {
        tag: parsedJSON.ps,
        type: "vmess",
        server: parsedJSON.add,
        server_port: parseInt(parsedJSON.port, 10),
        uuid: parsedJSON.id,
        security: "auto",
        alter_id: parsedJSON.aid,
        global_padding: false,
        authenticated_length: true,
        multiplex: {
          enable: false,
          protocol: "smux",
          max_streams: 32
        }
      };
      if (parsedJSON.port === "443" || parsedJSON.tls === "tls") {
        configResult.tls = {
          enable: true,
          server_name: parsedJSON.sni || parsedJSON.add,
          insecure: true,
          disable_sni: false
        };
      }
      if (parsedJSON.net === "ws") {
        configResult.transport = {
          type: parsedJSON.net,
          path: parsedJSON.path,
          headers: {
            Host: parsedJSON.host || parsedJSON.add
          }
        };
      } else if (parsedJSON.net === "grpc") {
        configResult.transport = {
          type: parsedJSON.net,
          service_name: parsedJSON.path
        };
      }
      return configResult;
    };
    const parseVlessUrl = (parsedUrl, query) => {
      const configResult = {
        tag: parsedUrl.hash.substring(1),
        //tag: parsedUrl.hash.replace("#", ""),
        type: parsedUrl.protocol.substring(0, parsedUrl.protocol.length - 1),
        //type: parsedUrl.protocol.replace(":", ""),
        server: parsedUrl.hostname,
        server_port: parseInt(parsedUrl.port, 10),
        uuid: parsedUrl.auth,
        flow: "",
        packet_encoding: "xudp",
        multiplex: {
          enable: false,
          protocol: "smux",
          max_streams: 32
        }
      };
      if (parsedUrl.port === "443" || query.security === "tls") {
        configResult.tls = {
          enable: true,
          server_name: query.sni,
          insecure: true,
          disable_sni: false
        };
      }
      const transportTypes = {
        ws: {
          type: query.type,
          path: query.path,
          headers: {
            Host: query.host
          }
        },
        grpc: {
          type: query.type,
          service_name: query.serviceName
        }
      };
      configResult.transport = transportTypes[query.type];
      return configResult;
    };
    const parseTrojanUrl = (parsedUrl, query) => {
      const configResult = {
        tag: parsedUrl.hash.substring(1),
        // tag: parsedUrl.hash.replace("#", ""),
        type: parsedUrl.protocol.substring(0, parsedUrl.protocol.length - 1),
        server: parsedUrl.hostname,
        server_port: parseInt(parsedUrl.port, 10),
        password: parsedUrl.auth,
        multiplex: {
          enable: false,
          protocol: "smux",
          max_streams: 32
        }
      };
      if (parsedUrl.port === "443" || query.security === "tls") {
        configResult.tls = {
          enable: true,
          server_name: query.sni,
          insecure: true,
          disable_sni: false
        };
      }
      const transportTypes = {
        ws: {
          type: query.type,
          path: query.path,
          headers: {
            Host: query.host
          }
        },
        grpc: {
          type: query.type,
          service_name: query.serviceName
        }
      };
      configResult.transport = transportTypes[query.type];
      return configResult;
    };
    const parseShadowsocksUrl = (parsedUrl, query) => {
      const configResult = {
        tag: parsedUrl.hash.replace("#", ""),
        type: parsedUrl.protocol.replace(":", ""),
        server: parsedUrl.hostname,
        server_port: parseInt(parsedUrl.port, 10)
      };
      return configResult;
    };
    const parseShadowsocksRUrl = (parsedUrl, query) => {
      const configResult = {
        tag: parsedUrl.hash.replace("#", ""),
        type: parsedUrl.protocol.replace(":", ""),
        server: parsedUrl.hostname,
        server_port: parseInt(parsedUrl.port, 10)
      };
      return configResult;
    };
    const parseSocksUrl = (parsedUrl, query) => {
      const configResult = {
        tag: parsedUrl.hash.replace("#", ""),
        type: parsedUrl.protocol.replace(":", ""),
        server: parsedUrl.hostname,
        server_port: parseInt(parsedUrl.port, 10)
      };
      return configResult;
    };
    const parseHttpUrl = (parsedUrl, query) => {
      const configResult = {
        tag: parsedUrl.hash.replace("#", ""),
        type: parsedUrl.protocol.replace(":", ""),
        server: parsedUrl.hostname,
        server_port: parseInt(parsedUrl.port, 10)
      };
      return configResult;
    };
    for (let i = 0; i < panjang; i++) {
      const urlString = urlStrings2[i];
      const parsedUrl = import_url.default.parse(urlString);
      const query = import_querystring.default.parse(parsedUrl.query);
      let configResult;
      const protocolMap = {
        "vmess:": () => parseVmessUrl(urlString),
        "vless:": () => parseVlessUrl(parsedUrl, query),
        "trojan:": () => parseTrojanUrl(parsedUrl, query),
        "ss:": () => parseShadowsocksUrl(parsedUrl, query),
        "ssr:": () => parseShadowsocksRUrl(parsedUrl, query),
        "socks5:": () => parseSocksUrl(parsedUrl, query),
        "http:": () => parseHttpUrl(parsedUrl, query)
      };
      if (protocolMap.hasOwnProperty(parsedUrl.protocol)) {
        configResult = protocolMap[parsedUrl.protocol]();
      }
      const panjangResult = results2.length;
      results2[panjangResult] = configResult;
    }
    return results2;
  }
  var urlStrings = [
    "vmess://eyJhZGQiOiAic2cyLXJheS5pcHNlcnZlcnMueHl6IiwgImhvc3QiOiAic25pLmNsb3VkZmxhcmUuY29tIiwgImFpZCI6IDAsICJ0eXBlIjogIiIsICJwYXRoIjogIi9KQUdPQU5TU0gvIiwgIm5ldCI6ICJ3cyIsICJwcyI6ICJqYWdvYW5zc2gtZ29kZGFtbiIsICJ0bHMiOiAidGxzIiwgInR5cGUiOiAibm9uZSIsICJwb3J0IjogIjQ0MyIsICJ2IjogIjIiLCAiaWQiOiAiNGE0NWU0NzctY2ZhMS00YTBmLWEwYjAtZTQ1MTczYzYyZjViIn0=",
    "vmess://eyJhZGQiOiJ1czIub2NlaXMubmV0IiwiYWlkIjoiMCIsImFscG4iOiIiLCJmcCI6IiIsImhvc3QiOiIiLCJpZCI6ImRhY2Y2MzQwLTA5ZmQtMTFlZS1iMjM2LTIwNWM2ZDVmNWQ3OCIsIm5ldCI6IndzIiwicGF0aCI6Ii92bXdzIiwicG9ydCI6IjQ0MyIsInBzIjoiVVNBK1ZNRVNTLVdTKDIwMjMtMDYtMjApIiwic2N5Ijoibm9uZSIsInNuaSI6IndoYXRzYXBwLm5ldCIsInRscyI6InRscyIsInR5cGUiOiIiLCJ2IjoiMiJ9",
    "vmess://eyJhZGQiOiJ1czIub2NlaXMubmV0IiwiYWlkIjoiMCIsImFscG4iOiIiLCJmcCI6IiIsImhvc3QiOiIiLCJpZCI6ImRhY2Y2MzQwLTA5ZmQtMTFlZS1iMjM2LTIwNWM2ZDVmNWQ3OCIsIm5ldCI6IndzIiwicGF0aCI6Ii92bXdzIiwicG9ydCI6IjgwIiwicHMiOiJVU0ErVk1FU1MtV1MgTlRMUygyMDIzLTA2LTIwKSIsInNjeSI6Im5vbmUiLCJzbmkiOiIiLCJ0bHMiOiIiLCJ0eXBlIjoiIiwidiI6IjIifQ==",
    "vless://a771070c-b93e-4f72-8747-657f4a41ead9@sglws.mainssh.xyz:443?path=/vless&security=tls&encryption=none&host=sglws.mainssh.xyz&type=ws&sni=sglws.mainssh.xyz#mainssh-legendo",
    "vless://d4cbf663-6950-4c64-8a52-f8b82a02e031@sg4-ws.xvless.xyz:80?path=%2Fwebsocket&security=none&encryption=none&host=sg4-ws.xvless.xyz&type=ws&sni=sni.cloudflare.net#sshocean-legendaplis",
    "vless://f746cd36-f565-444b-8bb8-6043c79eb3da@id1-grpc.xvless.xyz:443?mode=gun&security=tls&encryption=none&type=grpc&serviceName=grpc&sni=sni.cloudflare.net#sshocean-legendano",
    "trojan://a758ef8c-f06c-4e9d-8f0b-51633db51817@idt6.sshocean.net:443?security=tls&headerType=none&type=tcp&sni=sni.cloudflare.net#sshocean-kenapalegenda_trojan",
    "trojan://6d9fdac3-d74b-435f-aa6b-5fbf36e06853@sg1.xvless.xyz:443?host=sg1.xvless.xyz&path=%2Ftrojan&sni=sg1.xvless.xyz&type=ws#sshocean-ainian",
    "trojan://dbedf072-d917-41cd-b106-3aa3bb2f29a4@idt4.sshocean.net:443?mode=gun&security=tls&type=grpc&serviceName=grpc&sni=sni.cloudflare.net#sshocean-pengentest_Trojan_gRPC"
  ];
  var startTime = performance.now();
  var results = parseUrls(urlStrings);
  var endTime = performance.now();
  var diff = endTime - startTime;
  var jsonResult = JSON.stringify(results, null, 4);
  console.log(jsonResult);
  console.log(diff, "ms");
})();
/*! Bundled license information:

punycode/punycode.js:
  (*! https://mths.be/punycode v1.4.1 by @mathias *)
*/
