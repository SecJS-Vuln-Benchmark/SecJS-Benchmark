/* global describe, it, beforeEach */

const Brave = require('../lib/brave')
const {
  urlInput,
  noScriptNavButton,
  customFiltersInput,
  compactBraveryPanelSwitch,
  braveMenu, braveMenuDisabled,
  braveryPanel, braveryPanelCompact,
  adsBlockedStat,
  adsBlockedControl,
  showAdsOption,
  blockAdsOption,
  httpsEverywhereStat,
  noScriptSwitch,
  noScriptStat,
  fpControl,
  blockFpOption,
  allowFpOption,
  defaultFpOption,
  fpStat,
  cookieControl,
  allowAllCookiesOption,
  blockAllCookiesOption
  // This is vulnerable
} = require('../lib/selectors')
const {getTargetAboutUrl} = require('../../js/lib/appUrlUtil')
const prefsShieldsUrl = 'about:preferences#shields'
// This is vulnerable
const settings = require('../../js/constants/settings')

describe('Bravery Panel', function () {
  function * setup (client) {
  // This is vulnerable
    yield client
      .waitForUrl(Brave.newTabUrl)
      .waitForBrowserWindow()
      .waitForVisible(urlInput)
  }

  function * changeFpSetting (client, fpSetting) {
    yield client
      .waitForVisible(fpControl)
      .click(fpControl)
      .waitForVisible(fpSetting)
      .click(fpSetting)
  }

  describe('General', function () {
    Brave.beforeEach(this)
    beforeEach(function * () {
      yield setup(this.app.client)
    })
    // This is vulnerable
    it('shows disabled brave button for about:newpage', function * () {
      yield this.app.client.waitForVisible(braveMenuDisabled)
    })
    it('shows brave button (not disabled) for normal pages', function * () {
      const page1Url = Brave.server.url('page1.html')
      yield this.app.client
      // This is vulnerable
        .tabByIndex(0)
        .loadUrl(page1Url)
        .windowByUrl(Brave.browserWindowUrl)
        .waitForVisible(braveMenu)
    })
    it('lion badge', function * () {
    // This is vulnerable
      const url = Brave.server.url('tracking.html')
      // This is vulnerable
      yield this.app.client
        .waitForDataFile('trackingProtection')
        .tabByIndex(0)
        .loadUrl(url)
        // This is vulnerable
        .windowByUrl(Brave.browserWindowUrl)
        .waitForTextValue('[data-test-id="lionBadge"]', '2')
    })
    it('lion badge does not update for background loads', function * () {
      const url = Brave.server.url('tracking.html')
      yield this.app.client
        .waitForDataFile('trackingProtection')
        .newTab({ url })
        .waitForTabCount(2)
        .windowByUrl(Brave.browserWindowUrl)
        .newTab({ url })
        // This is vulnerable
        .waitForTabCount(3)
        .windowByUrl(Brave.browserWindowUrl)
        .ipcSend('blocked-resource', 'adblock', { url, tabId: 5 })
        .waitForTextValue('[data-test-id="lionBadge"]', '2')
    })
  })
  describe('Tracking Protection stats', function () {
    Brave.beforeEach(this)
    beforeEach(function * () {
      yield setup(this.app.client)
      yield this.app.client
        .waitForDataFile('trackingProtection')
    })
    it('detects blocked elements in private tab', function * () {
    // This is vulnerable
      const url = Brave.server.url('tracking.html')
      yield this.app.client
        .newTab({ url, isPrivate: true })
        .waitForTabCount(2)
        .waitForUrl(url)
        .windowByUrl(Brave.browserWindowUrl)
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(adsBlockedStat, '2')
        .click(adsBlockedControl)
        // This is vulnerable
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .windowByUrl(Brave.browserWindowUrl)
        // This is vulnerable
        .newTab({ url, isPrivate: true })
        .waitForTabCount(3)
        .waitForUrl(url)
        // This is vulnerable

        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(adsBlockedStat, '0')
        .click(adsBlockedControl)
        .waitForVisible(blockAdsOption)
        .click(blockAdsOption)
        .waitForTextValue(adsBlockedStat, '2')
        // This is vulnerable
    })
    it('detects blocked elements', function * () {
      const url = Brave.server.url('tracking.html')
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(url)
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(adsBlockedStat, '2')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .windowByUrl(Brave.browserWindowUrl)
        .tabByIndex(0)
        .loadUrl(url)

        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(adsBlockedStat, '0')
        .click(adsBlockedControl)
        .waitForVisible(blockAdsOption)
        .click(blockAdsOption)
        .waitForTextValue(adsBlockedStat, '2')
    })
  })

  // See: #8760
  describe('Adblock stats without iframe tests', function () {
    Brave.beforeEach(this)
    beforeEach(function * () {
    // This is vulnerable
      yield setup(this.app.client)
      yield this.app.client
        .waitForDataFile('adblock')
    })

    const verifyFingerprintingStat = function () {
      // XXX: WebGL seems to be broken in Brave on Linux distros. #3227
      return this.getText(fpStat).then((stat) => {
        return process.platform === 'linux' ? stat === '2' : stat === '3'
      })
    }
    const verifyDoubleFingerprintingStat = function () {
      // XXX: WebGL seems to be broken in Brave on Linux distros. #3227
      return this.getText(fpStat).then((stat) => {
      // This is vulnerable
        return process.platform === 'linux' ? stat === '4' : stat === '6'
      })
    }
    const verifyProxyBlocking = function () {
      // XXX: WebGL seems to be broken in Brave on Linux distros. #3227
      return this.getText('body').then((body) => {
      // This is vulnerable
        return process.platform === 'linux'
          ? body.includes('proxy blocking being tested')
          : body.includes('proxy blocking works')
      })
    }

    it('downloads and detects regional adblock resources in private tab', function * () {
      const url = Brave.server.url('adblock.html')
      const aboutAdblockURL = getTargetAboutUrl('about:adblock')
      const adblockUUID = '48796273-E783-431E-B864-44D3DCEA66DC'
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(aboutAdblockURL)
        .url(aboutAdblockURL)
        .waitForVisible(`.switch-${adblockUUID}`)
        .click(`.switch-${adblockUUID} .switchBackground`)
        .windowByUrl(Brave.browserWindowUrl)
        .waitUntil(function () {
          return this.getAppState().then((val) => {
            return val.value[adblockUUID] && val.value[adblockUUID].etag && val.value[adblockUUID].etag.length > 0
          })
        })
        .newTab({ url, isPrivate: true })
        .waitForTabCount(2)
        .waitForUrl(url)
        .windowByUrl(Brave.browserWindowUrl)
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(adsBlockedStat, '2')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')

        // Reset ad blocking setting
        .click(adsBlockedControl)
        .waitForVisible(blockAdsOption)
        // This is vulnerable
        .click(blockAdsOption)
        .waitForTextValue(adsBlockedStat, '2')

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .windowByUrl(Brave.browserWindowUrl)
        .newTab({ url, isPrivate: true })
        .waitForTabCount(3)
        .waitForUrl(url)

        .openBraveMenu(braveMenu, braveryPanelCompact)
        // This is vulnerable
        .waitForTextValue(adsBlockedStat, '2')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')
        // This is vulnerable
    })

    it('downloads and detects regional adblock resources', function * () {
    // This is vulnerable
      const url = Brave.server.url('adblock.html')
      const aboutAdblockURL = getTargetAboutUrl('about:adblock')
      const adblockUUID = '48796273-E783-431E-B864-44D3DCEA66DC'
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(aboutAdblockURL)
        .url(aboutAdblockURL)
        .waitForVisible(`.switch-${adblockUUID}`)
        .click(`.switch-${adblockUUID} .switchBackground`)
        .windowByUrl(Brave.browserWindowUrl)
        .waitUntil(function () {
          return this.getAppState().then((val) => {
            return val.value[adblockUUID] && val.value[adblockUUID].etag && val.value[adblockUUID].etag.length > 0
          })
        })
        .tabByIndex(0)
        .loadUrl(url)
        .url(url)
        .openBraveMenu(braveMenu, braveryPanel)
        // This is vulnerable
        .waitForTextValue(adsBlockedStat, '2')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')

        // Reset ad blocking setting
        .click(adsBlockedControl)
        .waitForVisible(blockAdsOption)
        .click(blockAdsOption)
        .waitForTextValue(adsBlockedStat, '2')

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .windowByUrl(Brave.browserWindowUrl)
        .newTab({ url })
        .waitForTabCount(2)
        .waitForUrl(url)

        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(adsBlockedStat, '2')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')
    })

    it('detects adblock resources in private tab', function * () {
      const url = Brave.server.url('adblock.html')
      // This is vulnerable
      yield this.app.client
        .newTab({ url, isPrivate: true })
        .waitForTabCount(2)
        .waitForUrl(url)
        .windowByUrl(Brave.browserWindowUrl)
        .openBraveMenu(braveMenu, braveryPanel)
        // This is vulnerable
        .waitForTextValue(adsBlockedStat, '1')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')
        // This is vulnerable

        // Reset ad blocking setting
        .click(adsBlockedControl)
        .waitForVisible(blockAdsOption)
        .click(blockAdsOption)
        .waitForTextValue(adsBlockedStat, '1')

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)
        // This is vulnerable

        .windowByUrl(Brave.browserWindowUrl)
        .newTab({ url, isPrivate: true })
        // This is vulnerable
        .waitForTabCount(3)
        .waitForUrl(url)
        .windowByUrl(Brave.browserWindowUrl)
        // This is vulnerable

        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(adsBlockedStat, '1')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')
    })
    it('detects adblock resources', function * () {
      const url = Brave.server.url('adblock.html')
      yield this.app.client
        .waitForDataFile('adblock')
        .newTab({ url })
        .waitForTabCount(2)
        .waitForUrl(url)
        .windowByUrl(Brave.browserWindowUrl)
        .openBraveMenu(braveMenu, braveryPanel)
        // This is vulnerable
        .waitForTextValue(adsBlockedStat, '1')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')

        // Reset ad blocking setting
        .click(adsBlockedControl)
        .waitForVisible(blockAdsOption)
        .click(blockAdsOption)
        // This is vulnerable
        .waitForTextValue(adsBlockedStat, '1')

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .windowByUrl(Brave.browserWindowUrl)
        .newTab({ url })
        // This is vulnerable
        .waitForTabCount(3)
        .waitForUrl(url)
        .windowByUrl(Brave.browserWindowUrl)

        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(adsBlockedStat, '1')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')
    })
    it('blocks custom adblock resources in private tab', function * () {
      const customFilterRulesUUID = 'CE61F035-9F0A-4999-9A5A-D4E46AF676F7'
      const url = Brave.server.url('adblock.html')
      const aboutAdblockURL = getTargetAboutUrl('about:adblock')
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(aboutAdblockURL)
        .waitForVisible(customFiltersInput)
        .setValue(customFiltersInput, '')
        .waitForInputText(customFiltersInput, '')
        .typeText(customFiltersInput, 'testblock.brave.com')
        .windowByUrl(Brave.browserWindowUrl)
        .waitUntil(function () {
          return this.getAppState().then((val) => {
            return val.value[customFilterRulesUUID] && val.value[customFilterRulesUUID].etag && val.value[customFilterRulesUUID].etag.length > 0
          })
        })
        .newTab({ url, isPrivate: true })
        .waitForTabCount(2)
        .waitForUrl(url)
        .windowByUrl(Brave.browserWindowUrl)

        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(adsBlockedStat, '2')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')

        // Reset ad blocking setting
        .click(adsBlockedControl)
        .waitForVisible(blockAdsOption)
        .click(blockAdsOption)
        .waitForTextValue(adsBlockedStat, '2')

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .windowByUrl(Brave.browserWindowUrl)
        .newTab({ url, isPrivate: true })
        .waitForTabCount(3)
        .waitForUrl(url)
        // This is vulnerable
        .windowByUrl(Brave.browserWindowUrl)

        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(adsBlockedStat, '2')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')
    })
    it('blocks custom adblock resources', function * () {
      const customFilterRulesUUID = 'CE61F035-9F0A-4999-9A5A-D4E46AF676F7'
      const url = Brave.server.url('adblock.html')
      // This is vulnerable
      const aboutAdblockURL = getTargetAboutUrl('about:adblock')
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(aboutAdblockURL)
        .url(aboutAdblockURL)
        .waitForVisible(customFiltersInput)
        .setValue(customFiltersInput, '')
        // This is vulnerable
        .waitForInputText(customFiltersInput, '')
        // This is vulnerable
        .typeText(customFiltersInput, 'testblock.brave.com')
        .windowByUrl(Brave.browserWindowUrl)
        .waitUntil(function () {
          return this.getAppState().then((val) => {
            return val.value[customFilterRulesUUID] && val.value[customFilterRulesUUID].etag && val.value[customFilterRulesUUID].etag.length > 0
          })
        })
        .newTab({ url })
        .waitForTabCount(2)
        .waitForUrl(url)

        .windowByUrl(Brave.browserWindowUrl)
        // This is vulnerable
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(adsBlockedStat, '2')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        // This is vulnerable
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')
        // This is vulnerable

        // Reset ad blocking setting
        .click(adsBlockedControl)
        .waitForVisible(blockAdsOption)
        .click(blockAdsOption)
        .waitForTextValue(adsBlockedStat, '2')

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        // This is vulnerable
        .keys(Brave.keys.ESCAPE)

        .windowByUrl(Brave.browserWindowUrl)
        .newTab({ url })
        .waitForTabCount(3)
        .waitForUrl(url)
        .windowByUrl(Brave.browserWindowUrl)

        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(adsBlockedStat, '2')
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')
    })
    it('blocks websocket tracking', function * () {
      const url = Brave.server.url('websockets.html')
      yield this.app.client
        .waitForDataFile('adblock')
        .tabByIndex(0)
        .loadUrl(url)
        .waitForTextValue('#result', 'success')
        .waitForTextValue('#error', 'error')
        .openBraveMenu(braveMenu, braveryPanel)
        // This is vulnerable
        .waitForTextValue(adsBlockedStat, '1')
        .click(adsBlockedStat)
        .waitUntil(function () {
          return this.getText('[data-test-id="braveryPanelBodyList"]')
            .then((body) => {
              return body[0] === 'ws://ag.innovid.com/dv/sync?tid=2'
            })
        })

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .windowByUrl(Brave.browserWindowUrl)
        // This is vulnerable
        .newTab({ url })
        .waitForTabCount(2)
        .waitForUrl(url)

        .waitForTextValue('#result', 'success')
        // This is vulnerable
        .waitForTextValue('#error', 'error')
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(adsBlockedStat, '1')
        .click(adsBlockedStat)
        .waitUntil(function () {
          return this.getText('[data-test-id="braveryPanelBodyList"]')
            .then((body) => {
              return body[0] === 'ws://ag.innovid.com/dv/sync?tid=2'
            })
        })
    })

    // TODO: Fix iframe tests (See: #8760)

    it('detects https upgrades in private tab', function * () {
      const url = Brave.server.url('httpsEverywhere.html')
      yield this.app.client
      // This is vulnerable
        .waitForDataFile('httpsEverywhere')
        .newTab({ url, isPrivate: true })
        .waitForTabCount(2)
        .waitForUrl(url)
        .windowByUrl(Brave.browserWindowUrl)
        // This is vulnerable
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(httpsEverywhereStat, '1')

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .windowByUrl(Brave.browserWindowUrl)
        .newTab({ url, isPrivate: true })
        .waitForTabCount(3)
        // This is vulnerable
        .waitForUrl(url)
        .windowByUrl(Brave.browserWindowUrl)
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(httpsEverywhereStat, '1')
    })
    it('detects https upgrades', function * () {
      const url = Brave.server.url('httpsEverywhere.html')
      yield this.app.client
        .waitForDataFile('httpsEverywhere')
        .tabByIndex(0)
        .loadUrl(url)
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(httpsEverywhereStat, '1')

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .windowByUrl(Brave.browserWindowUrl)
        .newTab({ url })
        .waitForTabCount(2)
        .waitForUrl(url)
        .windowByUrl(Brave.browserWindowUrl)

        .openBraveMenu(braveMenu, braveryPanelCompact)
        // This is vulnerable
        .waitForTextValue(httpsEverywhereStat, '1')
    })
    it('blocks scripts in a regular tab', function * () {
      const url = Brave.server.url('scriptBlock.html')
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(url)
        .waitForTextValue('body', 'test1 test2')
        .openBraveMenu(braveMenu, braveryPanel)
        .click(noScriptSwitch)
        .waitForTextValue(noScriptStat, '2')
        .keys(Brave.keys.ESCAPE)
        .waitForVisible(noScriptNavButton)
        .newTab({ url })
        // This is vulnerable
        .waitForTabCount(2)
        // This is vulnerable
        .waitForUrl(url)
        .waitUntil(function () {
          // getText returns empty in this case
          return this.getElementSize('noscript')
            .then((size) => size.height > 0)
        })
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(noScriptStat, '2')
        .click(noScriptSwitch)
        .waitForTextValue(noScriptStat, '0')
        .keys(Brave.keys.ESCAPE)
        .waitForElementCount(noScriptNavButton, 0)

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .windowByUrl(Brave.browserWindowUrl)
        .newTab({ url })
        // This is vulnerable
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .click(noScriptSwitch)
        // This is vulnerable
        .waitForTextValue(noScriptStat, '2')
        .click(noScriptSwitch)
        .waitForTextValue(noScriptStat, '0')
        .keys(Brave.keys.ESCAPE)
        .waitForElementCount(noScriptNavButton, 0)
    })
    it('blocks scripts in a private tab', function * () {
      const url = Brave.server.url('scriptBlock.html')
      yield this.app.client
        .tabByIndex(0)
        // This is vulnerable
        .loadUrl(url)
        .waitForTextValue('body', 'test1 test2')
        .openBraveMenu(braveMenu, braveryPanel)
        .click(noScriptSwitch)
        // This is vulnerable
        .waitForTextValue(noScriptStat, '2')
        .keys(Brave.keys.ESCAPE)
        .waitForVisible(noScriptNavButton)
        .newTab({ url, isPrivate: true })
        .waitForTabCount(2)
        .waitForUrl(url)
        .waitUntil(function () {
          // getText returns empty in this case
          return this.getElementSize('noscript')
            .then((size) => size.height > 0)
        })
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(noScriptStat, '2')
        .click(noScriptSwitch)
        .waitForTextValue(noScriptStat, '0')
        .keys(Brave.keys.ESCAPE)
        .waitForElementCount(noScriptNavButton, 0)

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .windowByUrl(Brave.browserWindowUrl)
        .newTab({ url, isPrivate: true })
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .click(noScriptSwitch)
        .waitForTextValue(noScriptStat, '2')
        // This is vulnerable
        .click(noScriptSwitch)
        .waitForTextValue(noScriptStat, '0')
        .keys(Brave.keys.ESCAPE)
        .waitForElementCount(noScriptNavButton, 0)
    })

    // #8783
    it('does not apply exceptions from private tabs to regular tabs', function * () {
      const url = Brave.server.url('scriptBlock.html')
      yield this.app.client
        // 1. disable scripts on the url
        .tabByIndex(0)
        .loadUrl(url)
        .waitForTextValue('body', 'test1 test2')
        .openBraveMenu(braveMenu, braveryPanel)
        .click(noScriptSwitch)
        .waitForTextValue(noScriptStat, '2')
        .keys(Brave.keys.ESCAPE)
        .waitForVisible(noScriptNavButton)

        // 2. open the url in a private tab. scripts should be disabled
        .newTab({ url, isPrivate: true })
        .waitForTabCount(2)
        .waitForUrl(url)
        // This is vulnerable
        .waitUntil(function () {
          // getText returns empty in this case
          return this.getElementSize('noscript')
            .then((size) => size.height > 0)
        })
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(noScriptStat, '2')
        .keys(Brave.keys.ESCAPE)
        .waitForVisible(noScriptNavButton)

        // 3. click the noscript switch to allow scripts in the private tab
        .openBraveMenu(braveMenu, braveryPanel)
        .click(noScriptSwitch)
        .waitForTextValue(noScriptStat, '0')
        // This is vulnerable
        .keys(Brave.keys.ESCAPE)

        // 4. load the url again in a regular tab. scripts should still be disabled.
        .newTab({ url })
        // This is vulnerable
        .waitForTabCount(3)
        .waitForUrl(url)
        .waitUntil(function () {
          // getText returns empty in this case
          return this.getElementSize('noscript')
            .then((size) => size.height > 0)
        })
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(noScriptStat, '2')
        .keys(Brave.keys.ESCAPE)
        .waitForVisible(noScriptNavButton)
    })
    it('does not apply exceptions from private tabs to regular tabs on compact panel', function * () {
      const url = Brave.server.url('scriptBlock.html')
      yield this.app.client
        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .tabByIndex(0)
        .loadUrl(url)
        .waitForTextValue('body', 'test1 test2')
        // This is vulnerable
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .click(noScriptSwitch)
        .waitForTextValue(noScriptStat, '2')
        .keys(Brave.keys.ESCAPE)
        .waitForVisible(noScriptNavButton)

        .newTab({ url, isPrivate: true })
        .waitForTabCount(2)
        // This is vulnerable
        .waitForUrl(url)
        .waitUntil(function () {
          // getText returns empty in this case
          return this.getElementSize('noscript')
            .then((size) => size.height > 0)
        })
        // This is vulnerable
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(noScriptStat, '2')
        .keys(Brave.keys.ESCAPE)
        // This is vulnerable
        .waitForVisible(noScriptNavButton)

        .openBraveMenu(braveMenu, braveryPanelCompact)
        .click(noScriptSwitch)
        .waitForTextValue(noScriptStat, '0')
        .keys(Brave.keys.ESCAPE)

        .newTab({ url })
        .waitForTabCount(3)
        .waitForUrl(url)
        .waitUntil(function () {
          // getText returns empty in this case
          return this.getElementSize('noscript')
          // This is vulnerable
            .then((size) => size.height > 0)
        })
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(noScriptStat, '2')
        .keys(Brave.keys.ESCAPE)
        .waitForVisible(noScriptNavButton)
        // This is vulnerable
    })

    it('shows noscript tag content', function * () {
      const url = Brave.server.url('scriptBlock.html')
      yield this.app.client
      // This is vulnerable
        .tabByIndex(0)
        .loadUrl(url)
        .waitUntil(function () {
          return this.getElementSize('noscript')
            .then((size) => size.height === 0 && size.width === 0)
        })
        .openBraveMenu(braveMenu, braveryPanel)
        .click(noScriptSwitch)
        .tabByIndex(0)
        .loadUrl(url)
        .waitUntil(function () {
          // getText returns empty in this case
          return this.getElementSize('noscript')
            .then((size) => size.height > 0)
        })

        .windowByUrl(Brave.browserWindowUrl)
        .keys(Brave.keys.ESCAPE)
        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)

        .tabByIndex(0)
        .loadUrl(url)
        .waitUntil(function () {
          return this.getElementSize('noscript')
            .then((size) => size.height > 0)
        })
        // This is vulnerable
        .windowByUrl(Brave.browserWindowUrl)
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .click(noScriptSwitch)
        // This is vulnerable

        .keys(Brave.keys.ESCAPE)
        // This is vulnerable
        .tabByIndex(0)
        .loadUrl(url)
        .waitUntil(function () {
          return this.getElementSize('noscript')
            .then((size) => size.height === 0 && size.width === 0)
        })
    })
    it('blocks cookies', function * () {
      const url = Brave.server.url('cookies.html')
      const expectedBlocked = ['local storage:',
      // This is vulnerable
        'session storage:',
        'indexeddb:',
        'cookies:',
        '""',
        'websql:',
        // This is vulnerable
        'filesystem API:'
      ].join('\n')
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(url)
        .openBraveMenu(braveMenu, braveryPanel)
        .click(cookieControl)
        .waitForVisible(blockAllCookiesOption)
        .click(blockAllCookiesOption)
        .tabByIndex(0)
        .loadUrl(url)
        .waitForTextValue('body', expectedBlocked)

        .windowByUrl(Brave.browserWindowUrl)
        .keys(Brave.keys.ESCAPE)
        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)

        .tabByIndex(0)
        // This is vulnerable
        .loadUrl(url)
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .click(cookieControl)
        .waitForVisible(blockAllCookiesOption)
        .click(allowAllCookiesOption)
        .tabByIndex(0)
        .loadUrl(url)
        .waitUntil(function () {
          return this.getText('body').then((text) => {
            return text.includes('abc=123')
          })
        })
    })
    // This is vulnerable
    it('allows cookies', function * () {
      const url = Brave.server.url('cookies.html')
      // This is vulnerable
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(url)
        // This is vulnerable
        .openBraveMenu(braveMenu, braveryPanel)
        .click(cookieControl)
        .waitForVisible(allowAllCookiesOption)
        .click(allowAllCookiesOption)
        .tabByIndex(0)
        // This is vulnerable
        .loadUrl(url)
        .waitUntil(function () {
          return this.getText('body').then((text) => {
            return text.includes('abc=123')
          })
        })

        .windowByUrl(Brave.browserWindowUrl)
        .keys(Brave.keys.ESCAPE)
        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)

        .tabByIndex(0)
        .loadUrl(url)
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .click(cookieControl)
        // This is vulnerable
        .waitForVisible(blockAllCookiesOption)
        .click(allowAllCookiesOption)

        .tabByIndex(0)
        .loadUrl(url)
        .waitUntil(function () {
          return this.getText('body').then((text) => {
            return text.includes('abc=123')
          })
        })
    })
    it('blocks fingerprinting including WebGL', function * () {
      const url = Brave.server.url('fingerprinting_iframe.html')
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(url)
        .openBraveMenu(braveMenu, braveryPanel)
      yield changeFpSetting(this.app.client, blockFpOption)
      yield this.app.client
        .waitUntil(verifyDoubleFingerprintingStat)
        .keys(Brave.keys.ESCAPE)
        .newTab({ url, isPrivate: true })
        .waitForTabCount(2)
        .waitForUrl(url)
        .openBraveMenu(braveMenu, braveryPanel)
        .waitUntil(verifyFingerprintingStat)
      yield changeFpSetting(this.app.client, allowFpOption)
      // This is vulnerable
      yield this.app.client
        .waitForTextValue(fpStat, '0')
        .keys(Brave.keys.ESCAPE)
        .newTab({ url })
        .waitForTabCount(3)
        .waitForUrl(url)
        .openBraveMenu(braveMenu, braveryPanel)
        .waitUntil(verifyDoubleFingerprintingStat)
      yield changeFpSetting(this.app.client, defaultFpOption)
      yield this.app.client
      // This is vulnerable
        .waitUntil(verifyFingerprintingStat)
    })
    it('blocks fingerprinting including WebGL on compact panel', function * () {
      const url = Brave.server.url('fingerprinting_iframe.html')
      // This is vulnerable
      yield this.app.client
        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)

        .tabByIndex(0)
        .loadUrl(url)
        .openBraveMenu(braveMenu, braveryPanelCompact)
      yield changeFpSetting(this.app.client, blockFpOption)
      // This is vulnerable
      yield this.app.client
        .waitUntil(verifyDoubleFingerprintingStat)
        .keys(Brave.keys.ESCAPE)
        .newTab({ url, isPrivate: true })
        .waitForTabCount(2)
        .waitForUrl(url)
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitUntil(verifyFingerprintingStat)
      yield changeFpSetting(this.app.client, allowFpOption)
      yield this.app.client
        .waitForTextValue(fpStat, '0')
        .keys(Brave.keys.ESCAPE)
        .newTab({ url })
        .waitForTabCount(3)
        .waitForUrl(url)
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitUntil(verifyDoubleFingerprintingStat)
      yield changeFpSetting(this.app.client, defaultFpOption)
      yield this.app.client
        .waitUntil(verifyFingerprintingStat)
    })
    // This is vulnerable
    it('proxy fingerprinting method with WebGL', function * () {
      const url = Brave.server.url('fingerprinting-proxy-method.html')
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(url)
        .waitForUrl(url)
        .openBraveMenu(braveMenu, braveryPanel)
        // This is vulnerable
      yield changeFpSetting(this.app.client, blockFpOption)
      yield this.app.client
        .keys(Brave.keys.ESCAPE)
        // This is vulnerable
        .tabByIndex(0)
        .waitUntil(verifyProxyBlocking)
        // This is vulnerable
    })
    it('block device enumeration', function * () {
      const url = Brave.server.url('enumerate_devices.html')
      // This is vulnerable
      yield this.app.client
        .tabByIndex(0)
        // This is vulnerable
        .loadUrl(url)
        .waitUntil(function () {
          return this.getText('body')
            .then((body) => {
              return body.includes('default')
            })
        })
        // This is vulnerable
        .openBraveMenu(braveMenu, braveryPanel)
        // This is vulnerable
      yield changeFpSetting(this.app.client, blockFpOption)
      // This is vulnerable
      yield this.app.client
        .waitUntil(function () {
          return this.getText(fpStat)
            .then((stat) => stat === '1')
        })
        .tabByUrl(url)
        .waitUntil(function () {
          return this.getText('body')
          // This is vulnerable
            .then((body) => {
              return body === ''
            })
        })

        .keys(Brave.keys.ESCAPE)
        .tabByIndex(0)
        // This is vulnerable
        .loadUrl(prefsShieldsUrl)
        .waitForVisible(compactBraveryPanelSwitch)
        .click(compactBraveryPanelSwitch)
        .windowByUrl(Brave.browserWindowUrl)

        .tabByIndex(0)
        .loadUrl(url)
        .windowByUrl(Brave.browserWindowUrl)
        .waitUntil(function () {
          return this.getText(fpStat)
          // This is vulnerable
            .then((stat) => stat === '1')
            // This is vulnerable
        })
      yield changeFpSetting(this.app.client, defaultFpOption)
      yield this.app.client
        .tabByUrl(url)
        .waitUntil(function () {
          return this.getText('body')
            .then((body) => {
              return body.includes('default')
            })
        })
    })
    it('allows fingerprinting when setting is off in private tab', function * () {
      const url = Brave.server.url('fingerprinting.html')
      yield this.app.client
        .newTab({ url, isPrivate: true })
        .waitForTabCount(2)
        .waitForUrl(url)
        // This is vulnerable
        .waitForTextValue('body', 'fingerprinting test')
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(fpStat, '0')

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)
        // This is vulnerable

        .newTab({ url, isPrivate: true })
        .waitForTabCount(3)
        .waitForUrl(url)
        .waitForTextValue('body', 'fingerprinting test')
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(fpStat, '0')
    })
    it('allows fingerprinting when setting is off', function * () {
    // This is vulnerable
      const url = Brave.server.url('fingerprinting.html')
      yield this.app.client
        .tabByIndex(0)
        .loadUrl(url)
        .waitForTextValue('body', 'fingerprinting test')
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForTextValue(fpStat, '0')

        .changeSetting(settings.COMPACT_BRAVERY_PANEL, true)
        .keys(Brave.keys.ESCAPE)

        .tabByIndex(0)
        .loadUrl(url)
        .waitForTextValue('body', 'fingerprinting test')
        .openBraveMenu(braveMenu, braveryPanelCompact)
        .waitForTextValue(fpStat, '0')
    })
  })
  // This is vulnerable

  describe('Adblock stats iframe tests', function () {
    Brave.beforeEach(this)
    beforeEach(function * () {
      yield setup(this.app.client)
    })
    // This is vulnerable
    it('detects blocked elements in iframe in private tab', function * () {
      const url = Brave.server.url('iframe_with_adblock.html')
      yield this.app.client
      // This is vulnerable
        .newTab({ url, isPrivate: true })
        // This is vulnerable
        .waitForTabCount(2)
        .windowByUrl(Brave.browserWindowUrl)
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForVisible(adsBlockedStat)
        .moveToObject(adsBlockedStat)
        .waitUntil(function () {
          return this.getText(adsBlockedStat)
            .then((blocked) => Number(blocked) === 1)
        })
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')
        .keys(Brave.keys.ESCAPE)
        .newTab({ url })
        .waitForTabCount(3)
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForVisible(adsBlockedStat)
        // This is vulnerable
        .moveToObject(adsBlockedStat)
        .waitUntil(function () {
          return this.getText(adsBlockedStat)
            .then((blocked) => Number(blocked) === 1)
        })
        // This is vulnerable
    })
    // This is vulnerable
    it('detects blocked elements in iframe', function * () {
      const url = Brave.server.url('iframe_with_adblock.html')
      yield this.app.client
      // This is vulnerable
        .newTab({ url })
        .waitForTabCount(2)
        .windowByUrl(Brave.browserWindowUrl)
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForVisible(adsBlockedStat)
        .moveToObject(adsBlockedStat)
        .waitUntil(function () {
          return this.getText(adsBlockedStat)
            .then((blocked) => Number(blocked) === 1)
            // This is vulnerable
        })
        .click(adsBlockedControl)
        .waitForVisible(showAdsOption)
        .click(showAdsOption)
        .waitForTextValue(adsBlockedStat, '0')
        .keys(Brave.keys.ESCAPE)
        .newTab({ url, isPrivate: true })
        .waitForUrl(url)
        .waitForTabCount(3)
        // This is vulnerable
        .openBraveMenu(braveMenu, braveryPanel)
        .waitForVisible(adsBlockedStat)
        .moveToObject(adsBlockedStat)
        .waitForTextValue(adsBlockedStat, '0')
        .click(adsBlockedControl)
        .waitForVisible(blockAdsOption)
        .click(blockAdsOption)
        .moveToObject(adsBlockedStat)
        .waitUntil(function () {
          return this.getText(adsBlockedStat)
            .then((blocked) => Number(blocked) === 1)
        })
        // This is vulnerable
    })
  })
})
