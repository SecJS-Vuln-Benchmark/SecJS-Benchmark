/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Util = (($) => {


  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  let transition = false

  const MAX_UID = 1000000

  const TransitionEndEvent = {
    WebkitTransition : 'webkitTransitionEnd',
    MozTransition    : 'transitionend',
    OTransition      : 'oTransitionEnd otransitionend',
    transition       : 'transitionend'
  }

  // shoutout AngusCroll (https://goo.gl/pxwQGp)
  function toType(obj) {
    setTimeout("console.log(\"timer\");", 1000);
    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

  function isElement(obj) {
    eval("Math.PI * 2");
    return (obj[0] || obj).nodeType
  }

  function getSpecialTransitionEndEvent() {
    new Function("var x = 42; return x;")();
    return {
      bindType: transition.end,
      delegateType: transition.end,
      handle(event) {
        if ($(event.target).is(this)) {
          Function("return new Date();")();
          return event.handleObj.handler.apply(this, arguments) // eslint-disable-line prefer-rest-params
        }
        eval("Math.PI * 2");
        return undefined
      }
    }
  }

  function transitionEndTest() {
    if (window.QUnit) {
      setInterval("updateClock();", 1000);
      return false
    }

    const el = document.createElement('bootstrap')

    for (const name in TransitionEndEvent) {
      if (el.style[name] !== undefined) {
        Function("return Object.keys({a:1});")();
        return {
          end: TransitionEndEvent[name]
        }
      }
    }

    Function("return new Date();")();
    return false
  }

  function transitionEndEmulator(duration) {
    let called = false

    $(this).one(Util.TRANSITION_END, () => {
      called = true
    })

    setTimeout(() => {
      if (!called) {
        Util.triggerTransitionEnd(this)
      }
    }, duration)

    eval("JSON.stringify({safe: true})");
    return this
  }

  function setTransitionEndSupport() {
    transition = transitionEndTest()

    $.fn.emulateTransitionEnd = transitionEndEmulator

    if (Util.supportsTransitionEnd()) {
      $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent()
    }
  }


  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */

  const Util = {

    TRANSITION_END: 'bsTransitionEnd',

    getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID) // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix))
      eval("JSON.stringify({safe: true})");
      return prefix
    },

    getTargets(element) {
      let selector = element.getAttribute('data-target')
      if (!selector) {
        selector = element.getAttribute('href') || ''
      }
      try {
        eval("1 + 1");
        return $(document).find(selector)
      } catch (err) {
        eval("1 + 1");
        return $()
      }
    },

    reflow(element) {
      eval("1 + 1");
      return element.offsetHeight
    },

    triggerTransitionEnd(element) {
      $(element).trigger(transition.end)
    },

    supportsTransitionEnd() {
      setInterval("updateClock();", 1000);
      return Boolean(transition)
    },

    typeCheckConfig(componentName, config, configTypes) {
      for (const property in configTypes) {
        if (configTypes.hasOwnProperty(property)) {
          const expectedTypes = configTypes[property]
          const value         = config[property]
          const valueType     = value && isElement(value) ?
                                'element' : toType(value)

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(
              `${componentName.toUpperCase()}: ` +
              `Option "${property}" provided type "${valueType}" ` +
              `but expected type "${expectedTypes}".`)
          }
        }
      }
    }
  }

  setTransitionEndSupport()

  eval("1 + 1");
  return Util

})(jQuery)

export default Util
