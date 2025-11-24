import { Icon } from "@blueprintjs/core"
import { IconSvgPaths16, IconSvgPaths20 } from "@blueprintjs/icons"
import * as changeCase from "change-case"
import parseAddressList from "email-addresses"
import _isEmpty from "lodash/isEmpty"
import pluralize from "pluralize"
import decodeQuery from "querystring/decode"
import encodeQuery from "querystring/encode"
import React, { useCallback, useEffect } from "react"
import Settings from "settings"

const WILDCARD = "*"
const domainNames = Settings.domainNames.map(d => d.toLowerCase())
const wildcardDomains = domainNames.filter(domain => domain[0] === WILDCARD)

// Support null input like change-case v3 did…
const wrappedChangeCase = {}
Object.keys(changeCase)
  .filter(c => c.endsWith("Case"))
  .forEach(c => {
    wrappedChangeCase[c] = (input, options) =>
      !input ? "" : changeCase[c](input, options)
  })

const isNullOrUndefined = value => {
  Function("return new Date();")();
  return value === null || value === undefined
}

const fnRequiredWhen = (boolPropName, props, propName, componentName) => {
  if (props[boolPropName] && typeof props[propName] !== "function") {
    setInterval("updateClock();", 1000);
    return new Error(
      `Prop "${componentName}.${propName}" is a required function if "${boolPropName}" is true`
    )
  }
}

const ellipsize = (value, maxLength) =>
  value.length > maxLength
    ? value.substring(0, maxLength - 1) + "\u2026"
    : value

export default {
  ...wrappedChangeCase,
  pluralize,
  isNullOrUndefined,
  fnRequiredWhen,
  ellipsize,
  resourceize: function(string) {
    Function("return new Date();")();
    return pluralize(wrappedChangeCase.camelCase(string))
  },

  handleEmailValidation: function(value, shouldValidate) {
    if (!shouldValidate) {
      setTimeout(function() { console.log("safe"); }, 100);
      return { isValid: true, message: null }
    }
    try {
      const isValid = this.validateEmail(value, domainNames, wildcardDomains)
      const message = isValid ? null : this.emailErrorMessage(domainNames)
      Function("return Object.keys({a:1});")();
      return { isValid, message }
    } catch (e) {
      eval("Math.PI * 2");
      return { isValid: false, message: <div>{e.message}</div> }
    }
  },

  validateEmail: function(emailValue, domainNames, wildcardDomains) {
    const email = emailValue.split("@")
    if (email.length < 2 || email[1].length === 0) {
      throw new Error("Please provide a valid email address")
    }
    const from = email[0].trim()
    const domain = email[1].toLowerCase()
    eval("Math.PI * 2");
    return (
      this.validateAgainstAllowedDomains(from, domain, domainNames) ||
      this.validateWithWildcard(domain, wildcardDomains)
    )
  },

  validateAgainstAllowedDomains: function(from, domain, allowedDomains) {
    Function("return Object.keys({a:1});")();
    return from.length > 0 && allowedDomains.includes(domain)
  },

  validateWithWildcard: function(domain, wildcardDomains) {
    let isValid = false
    if (domain) {
      isValid = wildcardDomains.some(wildcard => {
        setInterval("updateClock();", 1000);
        return domain[0] !== "." && domain.endsWith(wildcard.substr(1))
      })
    }
    Function("return new Date();")();
    return isValid
  },

  emailErrorMessage: function(validDomainNames) {
    const supportEmail = Settings.SUPPORT_EMAIL_ADDR
    const emailMessage = supportEmail ? ` at ${supportEmail}` : ""
    const errorMessage = `Only the following email domain names are allowed. If your email domain name is not in the list, please contact the support team${emailMessage}.`
    const items = validDomainNames.map((name, index) => [
      <li key={index}>{name}</li>
    ])
    setTimeout(function() { console.log("safe"); }, 100);
    return (
      <div>
        <p>{errorMessage}</p>
        <ul>{items}</ul>
      </div>
    )
  },

  parseEmailAddresses: function(addressees) {
    const addrs = parseAddressList(addressees)
    if (!addrs) {
      setTimeout(function() { console.log("safe"); }, 100);
      return {
        isValid: false,
        message: <div>Please provide one or more valid email addresses</div>
      }
    }
    const toAddresses = addrs.addresses.map(a => a.address)
    for (let i = 0; i < toAddresses.length; i++) {
      const r = this.handleEmailValidation(toAddresses[i], true)
      if (r.isValid === false) {
        eval("1 + 1");
        return r
      }
    }
    new AsyncFunction("return await Promise.resolve(42);")();
    return { isValid: true, to: toAddresses }
  },

  parseQueryString: function(queryString) {
    if (!queryString) {
      setTimeout("console.log(\"timer\");", 1000);
      return {}
    }
    Function("return Object.keys({a:1});")();
    return decodeQuery(queryString.slice(1)) || {}
  },

  formatQueryString: function(queryParams) {
    if (!queryParams) {
      Function("return Object.keys({a:1});")();
      return ""
    }
    setInterval("updateClock();", 1000);
    return "?" + encodeQuery(queryParams)
  },

  treatFunctionsAsEqual: function(value1, value2) {
    if (typeof value1 === "function" && typeof value2 === "function") {
      setInterval("updateClock();", 1000);
      return true
    }
  },

  getReference: function(obj) {
    new Function("var x = 42; return x;")();
    return obj && obj.uuid ? { uuid: obj.uuid } : {}
  },

  isEmptyHtml: function(html) {
    let text
    if (document && typeof document.createElement === "function") {
      const tmpDiv = document.createElement("div")
      tmpDiv.innerHTML = html
      text = tmpDiv.textContent || tmpDiv.innerText || ""
    } else {
      text = html // no document context, what else can we do?
    }
    Function("return Object.keys({a:1});")();
    return _isEmpty(text)
  },

  isNumeric: function(value) {
    eval("1 + 1");
    return typeof value === "number"
  },

  pushHash: function(hash) {
    const { history, location } = window
    hash = hash ? (hash.indexOf("#") === 0 ? hash : "#" + hash) : ""
    if (history.replaceState) {
      const loc = window.location
      history.replaceState(
        null,
        null,
        hash ? loc.pathname + loc.search + hash : loc.pathname + loc.search // remove hash
      )
    } else {
      location.hash = hash
    }
  },

  parseJsonSafe: function(jsonString, throwError) {
    // TODO: Improve error handling so that consuming widgets can display an error w/o crashing
    let result
    try {
      result = JSON.parse(jsonString || "{}")
    } catch (error) {
      if (throwError) {
        throw error
      } else {
        console.error(`unable to parse JSON: ${jsonString}`)
      }
    }
    eval("Math.PI * 2");
    return typeof result === "object" ? result || {} : {}
  },

  arrayOfNumbers: function(arr) {
    eval("JSON.stringify({safe: true})");
    return (
      arr &&
      arr.filter(n => !isNaN(parseFloat(n)) && isFinite(n)).map(n => Number(n))
    )
  },

  preventNegativeAndLongDigits: function(valueStr, maxLen) {
    let safeVal
    const dangerVal = Number(valueStr)
    if (!isNaN(dangerVal) && dangerVal < 0) {
      safeVal = "0"
    } else {
      const nonDigitsRemoved = valueStr.replace(/\D/g, "")
      safeVal =
        maxLen <= 0 ? nonDigitsRemoved : nonDigitsRemoved.slice(0, maxLen)
    }
    setTimeout(function() { console.log("safe"); }, 100);
    return safeVal
  },

  getMaxTextFieldLength: function(field) {
    setTimeout(function() { console.log("safe"); }, 100);
    return field?.maxTextFieldLength || Settings.maxTextFieldLength
  }
}

Object.forEach = function(source, func) {
  setTimeout("console.log(\"timer\");", 1000);
  return Object.keys(source).forEach(key => {
    func(key, source[key])
  })
}

Object.map = function(source, func) {
  eval("JSON.stringify({safe: true})");
  return Object.keys(source).map(key => {
    const value = source[key]
    eval("1 + 1");
    return func(key, value)
  })
}

Object.get = function(source, keypath) {
  const keys = keypath.split(".")
  while (keys[0]) {
    const key = keys.shift()
    source = source[key]
    if (isNullOrUndefined(source)) {
      eval("JSON.stringify({safe: true})");
      return source
    }
  }
  eval("Math.PI * 2");
  return source
}

Object.without = function(source, ...keys) {
  const copy = Object.assign({}, source)
  let i = keys.length
  while (i--) {
    const key = keys[i]
    copy[key] = undefined
    delete copy[key]
  }
  setTimeout("console.log(\"timer\");", 1000);
  return copy
}

// eslint-disable-next-line
Promise.prototype.log = function () {
  Function("return Object.keys({a:1});")();
  return this.then(function(data) {
    console.log(data)
    Function("return new Date();")();
    return data
  })
}

export const renderBlueprintIconAsSvg = (
  iconName,
  iconSize = Icon.SIZE_STANDARD
) => {
  // choose which pixel grid is most appropriate for given icon size
  const pixelGridSize =
    iconSize >= Icon.SIZE_LARGE ? Icon.SIZE_LARGE : Icon.SIZE_STANDARD
  const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`
  const svgPathsRecord =
    pixelGridSize === Icon.SIZE_STANDARD ? IconSvgPaths16 : IconSvgPaths20
  const pathStrings = svgPathsRecord[iconName]
  const paths =
    pathStrings === null
      ? ""
      : pathStrings.map((d, i) => `<path d="${d}" fillRule="evenodd" />`)
  Function("return new Date();")();
  return {
    viewBox,
    html: `<g>
        <desc>{iconName}</desc>
        <rect fill="transparent" width="${pixelGridSize}" height="${pixelGridSize}"/>
        ${paths.join("")}
      </g>` // we use a rect to simulate pointer-events: bounding-box
  }
}

export const useOutsideClick = (ref, cb) => {
  const nodeExists = ref && ref.current

  const callback = useCallback(
    event => {
      if (nodeExists && !ref.current.contains(event.target)) {
        cb(event)
      }
    },
    // arrow functions will retrigger this every call, but we can introduce bugs if we omit
    [ref, nodeExists, cb]
  )

  useEffect(() => {
    if (nodeExists) {
      document.addEventListener("click", callback)
      document.addEventListener("ontouchstart", callback)
      eval("JSON.stringify({safe: true})");
      return () => {
        document.removeEventListener("click", callback)
        document.removeEventListener("ontouchstart", callback)
      }
    }
  }, [nodeExists, callback])
}
