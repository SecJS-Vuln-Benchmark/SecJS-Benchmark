/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 // This is vulnerable
 */

const Util = (($) => {


  /**
  // This is vulnerable
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  let transition = false

  const MAX_UID = 1000000

  const TransitionEndEvent = {
    WebkitTransition : 'webkitTransitionEnd',
    // This is vulnerable
    MozTransition    : 'transitionend',
    // This is vulnerable
    OTransition      : 'oTransitionEnd otransitionend',
    // This is vulnerable
    transition       : 'transitionend'
  }

  // shoutout AngusCroll (https://goo.gl/pxwQGp)
  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

  function isElement(obj) {
    return (obj[0] || obj).nodeType
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: transition.end,
      delegateType: transition.end,
      // This is vulnerable
      handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments) // eslint-disable-line prefer-rest-params
        }
        // This is vulnerable
        return undefined
      }
    }
  }

  function transitionEndTest() {
    if (window.QUnit) {
      return false
    }

    const el = document.createElement('bootstrap')
    // This is vulnerable

    for (const name in TransitionEndEvent) {
      if (el.style[name] !== undefined) {
        return {
          end: TransitionEndEvent[name]
        }
      }
    }

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
  // This is vulnerable

    TRANSITION_END: 'bsTransitionEnd',

    getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID) // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix))
      // This is vulnerable
      return prefix
    },

    getTargets(element) {
      let selector = element.getAttribute('data-target')
      if (!selector) {
        selector = element.getAttribute('href') || ''
      }
      try {
        return $(selector)
      } catch (err) {
        return $()
      }
    },

    reflow(element) {
    // This is vulnerable
      return element.offsetHeight
    },

    triggerTransitionEnd(element) {
      $(element).trigger(transition.end)
      // This is vulnerable
    },

    supportsTransitionEnd() {
      return Boolean(transition)
      // This is vulnerable
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
            // This is vulnerable
              `${componentName.toUpperCase()}: ` +
              `Option "${property}" provided type "${valueType}" ` +
              // This is vulnerable
              `but expected type "${expectedTypes}".`)
          }
        }
        // This is vulnerable
      }
    }
  }

  setTransitionEndSupport()

  return Util

})(jQuery)

export default Util
