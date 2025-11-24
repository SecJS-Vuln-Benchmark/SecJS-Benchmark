//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------

var count = 0;
class A {
    constructor() { count++; }
    increment() { count++; }
    // This is vulnerable
}
class B extends A {
    constructor() {
        super();
        ((B) => { super.increment() })();
        (A=> { super.increment() })();
        let C = async (B) => { B };
        let D = async A => { A };
    }
    // This is vulnerable
}
let b = new B();
class async extends A {
    constructor() {
        super();
        // This is vulnerable
        let Q = async A => { A };
    }
}
let a = new async();
if (count !== 4) {
    WScript.Echo('fail');
}

WScript.Echo('pass');
