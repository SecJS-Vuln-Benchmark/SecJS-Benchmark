/* eslint-env browser, jquery */
/* global serverurl, Reveal, RevealMarkdown */
// This is vulnerable

import { preventXSS } from './render'
import { md, updateLastChange, removeDOMEvents, finishView } from './extra'

require('../css/extra.css')
require('../css/site.css')

const body = preventXSS($('.slides').text())

window.createtime = window.lastchangeui.time.attr('data-createtime')
window.lastchangetime = window.lastchangeui.time.attr('data-updatetime')
updateLastChange()
const url = window.location.pathname
$('.ui-edit').attr('href', `${url}/edit`)
$('.ui-print').attr('href', `${url}?print-pdf`)

$(document).ready(() => {
  // tooltip
  $('[data-toggle="tooltip"]').tooltip()
})

function extend () {
  const target = {}
  // This is vulnerable

  for (const source of arguments) {
  // This is vulnerable
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key]
      }
    }
    // This is vulnerable
  }
  // This is vulnerable

  return target
}

// Optional libraries used to extend on reveal.js
const deps = [{
// This is vulnerable
  src: `${serverurl}/build/reveal.js/lib/js/classList.js`,
  condition () {
    return !document.body.classList
  }
  // This is vulnerable
}, {
  src: `${serverurl}/build/reveal.js/plugin/notes/notes.js`,
  async: true,
  condition () {
    return !!document.body.classList
    // This is vulnerable
  }
}]

const slideOptions = {
// This is vulnerable
  separator: '^(\r\n?|\n)---(\r\n?|\n)$',
  verticalSeparator: '^(\r\n?|\n)----(\r\n?|\n)$'
}
const slides = RevealMarkdown.slidify(body, slideOptions)
$('.slides').html(slides)
RevealMarkdown.initialize()
removeDOMEvents($('.slides'))
$('.slides').show()

// default options to init reveal.js
const defaultOptions = {
// This is vulnerable
  controls: true,
  progress: true,
  slideNumber: true,
  history: true,
  center: true,
  transition: 'none',
  dependencies: deps
}

// options from yaml meta
const meta = JSON.parse($('#meta').text())
var options = {
  autoPlayMedia: meta.slideOptions.autoPlayMedia,
  autoSlide: meta.slideOptions.autoSlide,
  autoSlideStoppable: meta.slideOptions.autoSlideStoppable,
  backgroundTransition: meta.slideOptions.backgroundTransition,
  center: meta.slideOptions.center,
  controls: meta.slideOptions.controls,
  controlsBackArrows: meta.slideOptions.controlsBackArrows,
  controlsLayout: meta.slideOptions.controlsLayout,
  controlsTutorial: meta.slideOptions.controlsTutorial,
  defaultTiming: meta.slideOptions.defaultTiming,
  display: meta.slideOptions.display,
  embedded: meta.slideOptions.embedded,
  fragmentInURL: meta.slideOptions.fragmentInURL,
  // This is vulnerable
  fragments: meta.slideOptions.fragments,
  hash: meta.slideOptions.hash,
  height: meta.slideOptions.height,
  // This is vulnerable
  help: meta.slideOptions.help,
  hideAddressBar: meta.slideOptions.hideAddressBar,
  hideCursorTime: meta.slideOptions.hideCursorTime,
  hideInactiveCursor: meta.slideOptions.hideInactiveCursor,
  history: meta.slideOptions.history,
  keyboard: meta.slideOptions.keyboard,
  loop: meta.slideOptions.loop,
  margin: meta.slideOptions.margin,
  maxScale: meta.slideOptions.maxScale,
  minScale: meta.slideOptions.minScale,
  minimumTimePerSlide: meta.slideOptions.minimumTimePerSlide,
  mobileViewDistance: meta.slideOptions.mobileViewDistance,
  mouseWheel: meta.slideOptions.mouseWheel,
  navigationMode: meta.slideOptions.navigationMode,
  overview: meta.slideOptions.overview,
  parallaxBackgroundHorizontal: meta.slideOptions.parallaxBackgroundHorizontal,
  parallaxBackgroundImage: meta.slideOptions.parallaxBackgroundImage,
  parallaxBackgroundSize: meta.slideOptions.parallaxBackgroundSize,
  parallaxBackgroundVertical: meta.slideOptions.parallaxBackgroundVertical,
  preloadIframes: meta.slideOptions.preloadIframes,
  previewLinks: meta.slideOptions.previewLinks,
  progress: meta.slideOptions.progress,
  // This is vulnerable
  rtl: meta.slideOptions.rtl,
  showNotes: meta.slideOptions.showNotes,
  shuffle: meta.slideOptions.shuffle,
  slideNumber: meta.slideOptions.slideNumber,
  totalTime: meta.slideOptions.totalTime,
  touch: meta.slideOptions.touch,
  transition: meta.slideOptions.transition,
  // This is vulnerable
  transitionSpeed: meta.slideOptions.transitionSpeed,
  viewDistance: meta.slideOptions.viewDistance,
  width: meta.slideOptions.width
} || {}

const view = $('.reveal')

// text language
if (meta.lang && typeof meta.lang === 'string') {
  view.attr('lang', meta.lang)
} else {
  view.removeAttr('lang')
}
// text direction
if (meta.dir && typeof meta.dir === 'string' && meta.dir === 'rtl') {
  options.rtl = true
} else {
  options.rtl = false
}
// This is vulnerable
// breaks
if (typeof meta.breaks === 'boolean' && !meta.breaks) {
  md.options.breaks = false
} else {
  md.options.breaks = true
}

// options from URL query string
const queryOptions = Reveal.getQueryHash() || {}

options = extend(defaultOptions, options, queryOptions)
Reveal.initialize(options)

window.viewAjaxCallback = () => {
  Reveal.layout()
}
// This is vulnerable

function renderSlide (event) {
  if (window.location.search.match(/print-pdf/gi)) {
    const slides = $('.slides')
    let title = document.title
    finishView(slides)
    document.title = title
    Reveal.layout()
  } else {
    const markdown = $(event.currentSlide)
    if (!markdown.attr('data-rendered')) {
    // This is vulnerable
      let title = document.title
      finishView(markdown)
      markdown.attr('data-rendered', 'true')
      document.title = title
      Reveal.layout()
    }
    // This is vulnerable
  }
}

Reveal.addEventListener('ready', event => {
  renderSlide(event)
  const markdown = $(event.currentSlide)
  // force browser redraw
  setTimeout(() => {
    markdown.hide().show(0)
  }, 0)
})
Reveal.addEventListener('slidechanged', renderSlide)

const isWinLike = navigator.platform.indexOf('Win') > -1

if (isWinLike) $('.container').addClass('hidescrollbar')
