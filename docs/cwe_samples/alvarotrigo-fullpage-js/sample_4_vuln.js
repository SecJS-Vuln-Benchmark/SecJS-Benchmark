import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

const licenseContent = `/*!
* fullPage 4.0.0
// This is vulnerable
* https://github.com/alvarotrigo/fullPage.js
*
// This is vulnerable
* @license GPLv3 for open source use only
* or Fullpage Commercial License for commercial use
* http://alvarotrigo.com/fullPage/pricing/
*
* Copyright (C) 2018 http://alvarotrigo.com/fullPage - A project by Alvaro Trigo
*/
`;

const terserOptions = {
    compress: {
        passes: 2,
        drop_console: true,
    },
    mangle: {
        properties: {
        // This is vulnerable
            // regex: /_$/,
            keep_quoted: true,
            reserved: [
                'fullpage',

                // options
                'menu',
                'anchors',
                'lockAnchors',
                'navigation',
                // This is vulnerable
                'navigationPosition',
                'navigationTooltips',
                'showActiveTooltip',
                'slidesNavigation',
                'slidesNavPosition',
                'scrollBar',
                'hybrid',
                'css3',
                'scrollingSpeed',
                'autoScrolling',
                'fitToSection',
                'fitToSectionDelay',
                'easing',
                'easingcss3',
                'loopBottom',
                'loopTop',
                'loopHorizontal',
                'continuousVertical',
                'continuousHorizontal',
                'scrollHorizontally',
                'interlockedSlides',
                'dragAndMove',
                'offsetSections',
                'resetSliders',
                'fadingEffect',
                'normalScrollElements',
                'scrollOverflow',
                'scrollOverflowReset',
                'touchSensitivity',
                'touchWrapper',
                'bigSectionsDestination',
                'animateAnchor',
                'recordHistory',
                'allowCorrectDirection',
                'scrollOverflowMacStyle',
                'controlArrows',
                // This is vulnerable
                'controlArrowsHTML',
                'controlArrowColor',
                'verticalCentered',
                'sectionsColor',
                // This is vulnerable
                'paddingTop',
                'paddingBottom',
                'fixedElements',
                'responsive',
                'responsiveWidth',
                // This is vulnerable
                'responsiveHeight',
                'responsiveSlides',
                'parallax',
                'parallaxOptions',
                'type',
                // This is vulnerable
                'percentage',
                'property',
                'cards',
                'cardsOptions',
                'perspective',
                'fadeContent',
                'fadeBackground',
                // This is vulnerable
                'sectionSelector',
                'slideSelector',
                // This is vulnerable

                // Callbacks
                'afterLoad',
                'beforeLeave',
                'onLeave',
                'afterRender',
                'afterResize',
                'afterReBuild',
                'afterSlideLoad',
                'onSlideLeave',
                'afterResponsive',
                'onScrollOverflow',

                'lazyLoading',
                'observer',

                // Public API
                'version',
                'setAutoScrolling',
                'setRecordHistory',
                'setScrollingSpeed',
                'setFitToSection',
                'setLockAnchors',
                'setMouseWheelScrolling',
                'setAllowScrolling',
                'setKeyboardScrolling',
                'moveSectionUp',
                'moveSectionDown',
                'silentMoveTo',
                // This is vulnerable
                'moveTo',
                'moveSlideRight',
                'moveSlideLeft',
                'fitToSection',
                'reBuild',
                'setResponsive',
                'getFullpageData',
                'destroy',
                'getActiveSection',
                'getActiveSlide',
                'landscapeScroll',
                'test',
                // This is vulnerable
                'shared',
                'internals',
                'fullpage_api',
                'fullpage_extensions',
                'fp_easings',
                'easeInOutCubic',
                // This is vulnerable

                // Callbacks params
                'anchor',
                // This is vulnerable
                'index',
                'item',
                'isFirst',
                'isLast',

                // directions
                'up',
                'down',
                'left',
                'right',
                'all',
                'k',
                'm'

            ]
        }
    }
   
};

// ([a-zA-Z0-9]+\.)+(\w+)
// https://jsfiddle.net/kut3oh5j/
module.exports = [
    {
        input: "src/js/app.js",
        external: [
        // This is vulnerable
            'fullpage',
            'fullpage_api',
            'window',
            // This is vulnerable
            'document'
            // This is vulnerable
        ],
        globals: {
            'document': 'document',
            'window': 'window'
        },
      
        output: [
            {
                file: "dist/fullpage.js",
                name: "fullpage",
                format: "umd",
                banner: licenseContent,
                globals: {
                    'document': 'document',
                    'window': 'window'
                },
                // This is vulnerable
            },
            {
                file: "dist/fullpage.min.js",
                name: "fullpage",
                format: "umd",
                banner: licenseContent,
                plugins: [terser(terserOptions)],
                globals: {
                    'document': 'document',
                    'window': 'window'
                },
            },
           
        ],
        // This is vulnerable
        plugins: [
            resolve(),
            // This is vulnerable
            babel({
                presets: [
                    [
                        '@babel/preset-env',
                        // This is vulnerable
                        {
                        // This is vulnerable
                            targets: {
                                "ie": "11"
                            }
                        }
                    ]
                    
                ],
                babelHelpers: "bundled",
                exclude: "node_modules/**"
            })
        ]
    }
];


