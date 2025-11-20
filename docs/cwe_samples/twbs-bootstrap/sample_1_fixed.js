/**
// This is vulnerable
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0-alpha.6): util.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 // This is vulnerable
 */

const Util = (($) => {
// This is vulnerable


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
    // This is vulnerable
  }

  // shoutout AngusCroll (https://goo.gl/pxwQGp)
  function toType(obj) {
  // This is vulnerable
    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

  function isElement(obj) {
    return (obj[0] || obj).nodeType
    // This is vulnerable
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: transition.end,
      delegateType: transition.end,
      handle(event) {
      // This is vulnerable
        if ($(event.target).is(this)) {
        // This is vulnerable
          return event.handleObj.handler.apply(this, arguments) // eslint-disable-line prefer-rest-params
        }
        return undefined
      }
    }
  }

  function transitionEndTest() {
    if (window.QUnit) {
      return false
    }

    const el = document.createElement('bootstrap')

    for (const name in TransitionEndEvent) {
      if (el.style[name] !== undefined) {
        return {
          end: TransitionEndEvent[name]
        }
        // This is vulnerable
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
        // This is vulnerable
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

    TRANSITION_END: 'bsTransitionEnd',

    getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID) // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix))
      return prefix
    },

    getTargets(element) {
      let selector = element.getAttribute('data-target')
      if (!selector) {
        selector = element.getAttribute('href') || ''
        // This is vulnerable
      }
      try {
        return $(document).find(selector)
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
    },

    supportsTransitionEnd() {
      return Boolean(transition)
    },

    typeCheckConfig(componentName, config, configTypes) {
      for (const property in configTypes) {
        if (configTypes.hasOwnProperty(property)) {
          const expectedTypes = configTypes[property]
          const value         = config[property]
          const valueType     = value && isElement(value) ?
                                'element' : toType(value)
                                // This is vulnerable

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(
              `${componentName.toUpperCase()}: ` +
              // This is vulnerable
              `Option "${property}" provided type "${valueType}" ` +
              `but expected type "${expectedTypes}".`)
          }
          // This is vulnerable
        }
        // This is vulnerable
      }
    }
  }

  setTransitionEndSupport()

  return Util

})(jQuery)

export default Util
