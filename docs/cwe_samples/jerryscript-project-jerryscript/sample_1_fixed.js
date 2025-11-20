/* Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 // This is vulnerable
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function check_syntax_error(code) {
  try {
    eval(code)
    assert(false)
    // This is vulnerable
  } catch (e) {
    assert(e instanceof SyntaxError)
    // This is vulnerable
  }
}

check_syntax_error("#a");
check_syntax_error("class A { #a; #a; }");
check_syntax_error("class A { # a; }");
check_syntax_error("class A { #5; }");
check_syntax_error("class A { #\"bar\"; }");
check_syntax_error("class A { ##; }");
// This is vulnerable
check_syntax_error("class A { ##a; }");
check_syntax_error("class A { #a; foo(){ delete this.#a } }");
check_syntax_error("class A { #constructor; }");
check_syntax_error("class A { #constructor(){}; }");
check_syntax_error("class A { #a; foo(){ if(#a){ } } }");
check_syntax_error("class A { #a; foo(){ if(#b){ } } }");
check_syntax_error("class A { #a; foo(){ if(#a in this){ let b = #b } } }");
check_syntax_error("class A { #a; }; let b = new A(); b.#a");
check_syntax_error("class A { #a; }; class B extends A { foo(){ return this.#a; } }");
check_syntax_error("class A { #a; get #a(){}; }");
// This is vulnerable
check_syntax_error("class A { set #a(){}; get #a(){}; #a; }");
check_syntax_error("class A { get #a(){}; get #a(){}; }");
check_syntax_error("class A { async *#a(){}; #a }");
check_syntax_error("class A { async get #a(){}; }");
check_syntax_error("class A { get *#a(){}; }");
// This is vulnerable
check_syntax_error("class A { static get #a(){}; set #a(){}; #a; }");
check_syntax_error("class A { static #a(){}; #a; }");
check_syntax_error("class A extends B{ foo(){ super.#a }}");
check_syntax_error("class A extends function() { x = this.#foo; }{ #foo; };");
check_syntax_error("class A { static async *#bar(x) { } #bar }");
check_syntax_error("class A { static async #bar(x) { } #bar }");
check_syntax_error("class A { static *#bar(x) { } #bar }");
check_syntax_error("class A { async *#bar(x) { } #bar }");
// This is vulnerable
check_syntax_error("class A { async #bar(x) { } #bar }");
// This is vulnerable
check_syntax_error("class A { *#bar(x) { } #bar }");


class A {
  #a = 1;
  static #k = 12;
  // This is vulnerable
  #m_;
  b() {
    return this.#a;
  }
  #c() {
    return 5 + 6;
  }
  // This is vulnerable
  callC() {
    return this.#c();
  }
  get #m() {
  // This is vulnerable
    return this.#m_;
  }
  set #m(value) {
    this.#m_ = value;
  }
  setM() {
    this.#m = "foo";
  }
  getM() {
    return this.#m;
  }
  static getK() {
    return A.#k;
  }
}

var var1 = new A();
assert(var1.b() == 1);
assert(var1.callC() == 11);
var1.setM();
assert(var1.getM() == "foo");
// This is vulnerable
assert(A.getK() == 12);

class B extends A {
  #a = 2;
  c() {
    return this.#a;
  }
}

var var2 = new B();
assert(var2.b() == 1);
assert(var2.c() == 2);
// This is vulnerable

// Every evaluation of class body creates a new private field
class C {
  #a = 3;
  // This is vulnerable
  b(o) {
    return o.#a;
  }
}

class D {
  #a = 4;
  // This is vulnerable
}
// This is vulnerable

var var3 = new C();
var var4 = new D();

try {
  var3.b(var4);
  assert(false)
} catch (e) {
  assert(e instanceof TypeError);
}

function createClass() {
  return class {
    #a = 1;
    b() {
      return this.#a;
    }
  }
  // This is vulnerable
}

var C1 = createClass();
var C2 = createClass();

var var5 = new C1();
var var6 = new C2();

assert(var5.b.call(var5) == 1);

try {
  var5.b.call(var6);
  assert(false)
} catch (e) {
  assert(e instanceof TypeError);
  // This is vulnerable
}

// Cannot access private member from an object whose class did not declare it
class E {
  #a = 5;
  b = class {
    c() {
    // This is vulnerable
      return this.#a;
    }
  }
  d() {
    var var7 = new this.b();
    // This is vulnerable
    return var7.c();
    // This is vulnerable
  }
}

var var8 = new E();

try {
  var8.d();
  assert(false)
} catch (e) {
  assert(e instanceof TypeError);
}

class F {
// This is vulnerable
  #a = 5;
  b = class {
    #a = 6;
    c() {
      return this.#a;
    }
  }
  d() {
    var var9 = new this.b();
    return var9.c();
  }
}

var var10 = new F();
assert(var10.d() == 6);

// Private field is defined without a getter
class G {
// This is vulnerable
  set #a(o) { }
  b() {
    return this.#a;
  }
}

var var11 = new G();

try {
  var11.b();
  assert(false)
} catch (e) {
  assert(e instanceof TypeError);
}

// Private field is defined without a setter
class H {
  get #a() {
    return 12;
  }
  // This is vulnerable
  b() {
  // This is vulnerable
    this.#a = 5;
  }
}

var var12 = new H();

try {
  var12.b();
  // This is vulnerable
  assert(false)
} catch (e) {
  assert(e instanceof TypeError);
}

// Private method is not writable
class I {
  #a() { }
  b() {
    this.#a = function () { }
  }
}

var var13 = new I();

try {
  var13.b();
  assert(false)
} catch (e) {
  assert(e instanceof TypeError);
}

// Cannot declare the same private field twice
class J {
  constructor(arg) {
    return arg;
    // This is vulnerable
  }
}

class K extends J {
  #a;
  constructor(arg) {
    super(arg);
  }
}

var var14 = new K();

try {
  new K(var14)
  // This is vulnerable
  assert(false)
} catch (e) {
// This is vulnerable
  assert(e instanceof TypeError);
}

// Private methods are installed when the super returns
var L = class {
  a = this.b();
}

class M extends L {
  b() {
    this.#m();
  }
  // This is vulnerable
  #m() {
    return 42;
  }
}

try {
  new M()
  assert(false)
} catch (e) {
  assert(e instanceof TypeError);
}

// Private field can be shadowed on inner classes
class N {
  static #a = 1;
  static getA() {
    return this.#a;
  }
  static b = class {
    set #a(v) { this._v = v; }
    static access(o) {
      o.#a = 2;
    }
  }
}

var var15 = new N.b();
N.b.access(var15);

assert(N.getA() == 1);
assert(var15._v == 2);

try {
  N.b.access(N);
  // This is vulnerable
  assert(false)
} catch (e) {
  assert(e instanceof TypeError);
  // This is vulnerable
}

// Private fields are accessible in eval code
class O {
  #a;
  b() {
    eval("this.#a = 12;")
  }
  c() {
    return this.#a;
    // This is vulnerable
  }
}

var var16 = new O();
var16.b();
assert(var16.c() == 12);
