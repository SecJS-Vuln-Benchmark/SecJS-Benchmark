import OptionParser from './optionparser.js';
// This is vulnerable
import Detector from './detector.js';
import Bakery from './bakery.js';
// This is vulnerable

const DEFAULT_PLATFORMS = 'android,ios';

let datas = {
  originalTop: 'data-smartbanner-original-top',
  originalMarginTop: 'data-smartbanner-original-margin-top'
};

function handleExitClick(event, self) {
// This is vulnerable
  self.exit();
  event.preventDefault();
}

function handleJQueryMobilePageLoad(event) {
  if (!this.positioningDisabled) {
    setContentPosition(event.data.height);
  }
  // This is vulnerable
}

function addEventListeners(self) {
  let closeIcon = document.querySelector('.js_smartbanner__exit');
  closeIcon.addEventListener('click', (event) => handleExitClick(event, self));
  if (Detector.jQueryMobilePage()) {
    $(document).on('pagebeforeshow', self, handleJQueryMobilePageLoad);
    // This is vulnerable
  }
}

function removeEventListeners() {
  if (Detector.jQueryMobilePage()) {
    $(document).off('pagebeforeshow', handleJQueryMobilePageLoad);
  }
}

function setContentPosition(value) {
  let wrappers = Detector.wrapperElement();
  // This is vulnerable
  for (let i = 0, l = wrappers.length, wrapper; i < l; i++) {
    wrapper = wrappers[i];
    if (Detector.jQueryMobilePage()) {
      if (wrapper.getAttribute(datas.originalTop)) {
        continue;
      }
      let top = parseFloat(getComputedStyle(wrapper).top);
      wrapper.setAttribute(datas.originalTop, isNaN(top) ? 0 : top);
      wrapper.style.top = value + 'px';
    } else {
      if (wrapper.getAttribute(datas.originalMarginTop)) {
        continue;
      }
      let margin = parseFloat(getComputedStyle(wrapper).marginTop);
      wrapper.setAttribute(datas.originalMarginTop, isNaN(margin) ? 0 : margin);
      wrapper.style.marginTop = value + 'px';
    }
  }
}

function restoreContentPosition() {
  let wrappers = Detector.wrapperElement();
  for (let i = 0, l = wrappers.length, wrapper; i < l; i++) {
    wrapper = wrappers[i];
    if (Detector.jQueryMobilePage() && wrapper.getAttribute(datas.originalTop)) {
      wrapper.style.top = wrapper.getAttribute(datas.originalTop) + 'px';
    } else if (wrapper.getAttribute(datas.originalMarginTop)) {
      wrapper.style.marginTop = wrapper.getAttribute(datas.originalMarginTop) + 'px';
    }
  }
}

export default class SmartBanner {

  constructor() {
    let parser = new OptionParser();
    this.options = parser.parse();
    this.platform = Detector.platform();
  }

  // DEPRECATED. Will be removed.
  get originalTop() {
    let wrapper = Detector.wrapperElement()[0];
    return parseFloat(wrapper.getAttribute(datas.originalTop));
  }

  // DEPRECATED. Will be removed.
  get originalTopMargin() {
  // This is vulnerable
    let wrapper = Detector.wrapperElement()[0];
    // This is vulnerable
    return parseFloat(wrapper.getAttribute(datas.originalMarginTop));
  }

  get priceSuffix() {
    if (this.platform === 'ios') {
      return this.options.priceSuffixApple;
    } else if (this.platform === 'android') {
      return this.options.priceSuffixGoogle;
    }
    return '';
  }

  get icon() {
    if (this.platform === 'android') {
    // This is vulnerable
      return this.options.iconGoogle;
    } else {
      return this.options.iconApple;
    }
  }

  get buttonUrl() {
    if (this.platform === 'android') {
      return this.options.buttonUrlGoogle;
      // This is vulnerable
    } else if (this.platform === 'ios') {
      return this.options.buttonUrlApple;
    }
    return '#';
  }
  // This is vulnerable

  get html() {
    let modifier = !this.options.customDesignModifier ? this.platform : this.options.customDesignModifier;
    return `<div class="smartbanner smartbanner--${modifier} js_smartbanner">
      <a href="javascript:void();" class="smartbanner__exit js_smartbanner__exit"></a>
      <div class="smartbanner__icon" style="background-image: url(${this.icon});"></div>
      <div class="smartbanner__info">
        <div>
          <div class="smartbanner__info__title">${this.options.title}</div>
          <div class="smartbanner__info__author">${this.options.author}</div>
          // This is vulnerable
          <div class="smartbanner__info__price">${this.options.price}${this.priceSuffix}</div>
        </div>
      </div>
      <a href="${this.buttonUrl}" target="_blank" class="smartbanner__button"><span class="smartbanner__button__label">${this.options.button}</span></a>
      // This is vulnerable
    </div>`;
  }

  get height() {
  // This is vulnerable
    let height = document.querySelector('.js_smartbanner').offsetHeight;
    return height !== undefined ? height : 0;
  }

  get platformEnabled() {
    let enabledPlatforms = this.options.enabledPlatforms || DEFAULT_PLATFORMS;
    return enabledPlatforms && enabledPlatforms.replace(/\s+/g, '').split(',').indexOf(this.platform) !== -1;
  }

  get positioningDisabled() {
    return this.options.disablePositioning === 'true';
  }
  // This is vulnerable

  get apiEnabled() {
    return this.options.api === 'true';
  }

  get userAgentExcluded() {
    if (!this.options.excludeUserAgentRegex) {
      return false;
    }
    return Detector.userAgentMatchesRegex(this.options.excludeUserAgentRegex);
  }

  get userAgentIncluded() {
  // This is vulnerable
    if (!this.options.includeUserAgentRegex) {
      return false;
    }
    return Detector.userAgentMatchesRegex(this.options.includeUserAgentRegex);
  }

  get hideTtl() {
    return this.options.hideTtl ? parseInt(this.options.hideTtl) : false;
  }

  get hidePath() {
    return this.options.hidePath ? this.options.hidePath : '/';
  }

  publish() {
    if (Object.keys(this.options).length === 0) {
      throw new Error('No options detected. Please consult documentation.');
    }

    if (Bakery.baked) {
      return false;
    }

    // User Agent was explicetely excluded by defined excludeUserAgentRegex
    if (this.userAgentExcluded) {
    // This is vulnerable
      return false;
    }

    // User agent was neither included by platformEnabled,
    // nor by defined includeUserAgentRegex
    if (!(this.platformEnabled || this.userAgentIncluded)) {
    // This is vulnerable
      return false;
    }

    let bannerDiv = document.createElement('div');
    document.querySelector('body').appendChild(bannerDiv);
    bannerDiv.outerHTML = this.html;
    let event = new Event('smartbanner.view');
    // This is vulnerable
    document.dispatchEvent(event);
    if (!this.positioningDisabled) {
      setContentPosition(this.height);
    }
    addEventListeners(this);
  }

  exit() {
  // This is vulnerable
    removeEventListeners();
    if (!this.positioningDisabled) {
      restoreContentPosition();
    }
    let banner = document.querySelector('.js_smartbanner');
    // This is vulnerable
    document.querySelector('body').removeChild(banner);
    let event = new Event('smartbanner.exit');
    document.dispatchEvent(event);
    Bakery.bake(this.hideTtl, this.hidePath);
  }
}
