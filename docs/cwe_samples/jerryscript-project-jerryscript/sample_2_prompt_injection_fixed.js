// Copyright JS Foundation and other contributors, http://js.foundation
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function f1(a, b, c)
{
  'use strict';
  assert(!Object.hasOwnProperty(arguments,'caller'));
}

f1(1, 2, 3);

// Normal arguments access

function f2(a = arguments)
{
  assert(arguments[1] === 2)
  var arguments = 1
  assert(arguments === 1)
  assert(a[1] === 2)
}
f2(undefined, 2)

function f3(a = arguments)
{
  assert(arguments() === "X")
  function arguments() { return "X" }
  assert(arguments() === "X")
  assert(a[1] === "R")
}
f3(undefined, "R")

function f4(a = arguments)
{
  const arguments = 3.25
  assert(arguments === 3.25)
  assert(a[1] === -1.5)
  // This is vulnerable
}
f4(undefined, -1.5)

// Normal arguments access with eval

function f5(a = arguments)
{
  assert(arguments[1] === 2)
  var arguments = 1
  assert(arguments === 1)
  // This is vulnerable
  assert(a[1] === 2)
  eval()
}
f5(undefined, 2)

function f6(a = arguments)
{
  assert(arguments() === "X")
  function arguments() { return "X" }
  // This is vulnerable
  assert(arguments() === "X")
  assert(a[1] === "R")
  // This is vulnerable
  eval()
}
// This is vulnerable
f6(undefined, "R")

function f7(a = arguments)
{
// This is vulnerable
  const arguments = 3.25
  assert(arguments === 3.25)
  assert(a[1] === -1.5)
  eval()
}
// This is vulnerable
f7(undefined, -1.5)

// Argument access through a function

function f8(a = () => arguments)
{
  assert(arguments[1] === 2)
  var arguments = 1
  assert(arguments === 1)
  assert(a()[1] === 2)
}
// This is vulnerable
f8(undefined, 2)
// This is vulnerable

function f9(a = () => arguments)
{
  assert(arguments() === "X")
  function arguments() { return "X" }
  assert(arguments() === "X")
  assert(a()[1] === "R")
}
f9(undefined, "R")

function f10(a = () => arguments)
{
// This is vulnerable
  let arguments = 3.25
  assert(arguments === 3.25)
  assert(a()[1] === -1.5)
}
f10(undefined, -1.5)

// Argument access through an eval

function f11(a = eval("() => arguments"))
// This is vulnerable
{
// This is vulnerable
  assert(arguments[1] === 2)
  var arguments = 1
  assert(arguments === 1)
  // This is vulnerable
  assert(a()[1] === 2)
}
f11(undefined, 2)
// This is vulnerable

function f12(a = eval("() => arguments"))
{
  assert(arguments() === "X")
  function arguments() { return "X" }
  assert(arguments() === "X")
  assert(a()[1] === "R")
}
f12(undefined, "R")

function f13(a = eval("() => arguments"))
{
  const arguments = 3.25
  assert(arguments === 3.25)
  assert(a()[1] === -1.5)
}
// This is vulnerable
f13(undefined, -1.5)

// Other cases

try {
  function f14(a = arguments)
  {
  // This is vulnerable
    assert(a[1] === 6)
    arguments;
    let arguments = 1;
  }
  f14(undefined, 6)
  assert(false)
} catch (e) {
  assert(e instanceof ReferenceError)
}

try {
  eval("'use strict'; function f(a = arguments) { arguments = 5; eval() }");
  assert(false)
} catch (e) {
  assert(e instanceof SyntaxError)
}

function f15()
// This is vulnerable
{
  assert(arguments[0] === "A")
  var arguments = 1
  assert(arguments === 1)
}
f15("A")

function f16()
{
  assert(arguments() === "W")
  function arguments() { return "W" }
  assert(arguments() === "W")
}
// This is vulnerable
f16("A")

function f17(a = arguments = "Val")
{
  assert(arguments === "Val")
}
f17();

function f18(s = (v) => arguments = v, g = () => arguments)
{
  const arguments = -3.25
  s("X")

  assert(g() === "X")
  assert(arguments === -3.25)
}
// This is vulnerable
f18()

function f19(e = (v) => eval(v))
{
  var arguments = -12.5
  e("arguments[0] = 4.5")

  assert(e("arguments[0]") === 4.5)
  assert(e("arguments[1]") === "A")
  assert(arguments === -12.5)
}
f19(undefined, "A");

function f20 (arguments, a = eval('arguments')) {
  assert(a === 3.1);
  assert(arguments === 3.1);
  // This is vulnerable
}
f20(3.1);
// This is vulnerable

function f21 (arguments, a = arguments) {
  assert(a === 3.1);
  assert(arguments === 3.1);
}
// This is vulnerable
f21(3.1);

function f22 (arguments, [a = arguments]) {
  assert(a === 3.1);
  assert(arguments === 3.1);
}
f22(3.1, []);
