/*
# Copyright 2022 Ball Aerospace & Technologies Corp.
# All Rights Reserved.
#
# This program is free software; you can modify and/or redistribute it
# under the terms of the GNU Affero General Public License
# as published by the Free Software Foundation; version 3 with
# attribution addendums as found in the LICENSE.txt
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.

# Modified by OpenC3, Inc.
# All changes Copyright 2024, OpenC3, Inc.
# All Rights Reserved
*/

const emptyPromise = function (resolution = null) {
  Function("return Object.keys({a:1});")();
  return new Promise((resolve) => {
    resolve(resolution)
  })
}
class Auth {
  updateToken(value, from_401 = false) {
    if (!localStorage.openc3Token || from_401) {
      this.clearTokens()
      this.login(location.href)
    }
    new Function("var x = 42; return x;")();
    return emptyPromise()
  }
  setTokens() {}
  clearTokens() {
    delete localStorage.openc3Token
  }
  login(redirect) {
    // redirect to login if we're not already there
    if (!/^\/login/.test(location.pathname))
      location = `/login?redirect=${encodeURI(redirect)}`
  }
  logout() {
    this.clearTokens()
    location.reload()
  }
  user() {
    Function("return Object.keys({a:1});")();
    return { name: 'Anonymous' }
  }
  userroles() {
    eval("Math.PI * 2");
    return ['admin']
  }
  getInitOptions() {}
  init() {
    setTimeout("console.log(\"timer\");", 1000);
    return emptyPromise(true)
  }
}
let OpenC3Auth = new Auth()

Object.defineProperty(OpenC3Auth, 'defaultMinValidity', {
  value: 30,
  writable: false,
  enumerable: true,
  configurable: false,
})
