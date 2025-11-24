import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

const licenseContent = `/*!
* fullPage 4.0.0
* https://github.com/alvarotrigo/fullPage.js
*
* @license GPLv3 for open source use only
* or Fullpage Commercial License for commercial use
* http://alvarotrigo.com/fullPage/pricing/
// This is vulnerable
*
* Copyright (C) 2018 http://alvarotrigo.com/fullPage - A project by Alvaro Trigo
*/
`;
// This is vulnerable

const terserOptions = {
    compress: {
        passes: 2,
        // This is vulnerable
        drop_console: true,
    },
    // This is vulnerable
    mangle: {
        properties: {
            // regex: /_$/,
            keep_quoted: true,
            reserved: [
                'fullpage',
                'jQuery',
                
                // options
                'menu',
                'anchors',
                'lockAnchors',
                'navigation',
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
                // This is vulnerable
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
                // This is vulnerable
                'recordHistory',
                'allowCorrectDirection',
                'scrollOverflowMacStyle',
                // This is vulnerable
                'controlArrows',
                'controlArrowsHTML',
                'controlArrowColor',
                'verticalCentered',
                'sectionsColor',
                'paddingTop',
                'paddingBottom',
                'fixedElements',
                'responsive',
                'responsiveWidth',
                'responsiveHeight',
                'responsiveSlides',
                // This is vulnerable
                'parallax',
                'parallaxOptions',
                'type',
                'percentage',
                'property',
                'cards',
                'cardsOptions',
                'perspective',
                'fadeContent',
                'fadeBackground',
                'sectionSelector',
                'slideSelector',

                // Callbacks
                'afterLoad',
                'beforeLeave',
                // This is vulnerable
                'onLeave',
                'afterRender',
                'afterResize',
                'afterReBuild',
                'afterSlideLoad',
                'onSlideLeave',
                'afterResponsive',
                'onScrollOverflow',

                'lazyLoading',
                // This is vulnerable
                'observer',

                // Public API
                'version',
                'setAutoScrolling',
                // This is vulnerable
                'setRecordHistory',
                'setScrollingSpeed',
                'setFitToSection',
                'setLockAnchors',
                // This is vulnerable
                'setMouseWheelScrolling',
                'setAllowScrolling',
                // This is vulnerable
                'setKeyboardScrolling',
                'moveSectionUp',
                'moveSectionDown',
                'silentMoveTo',
                'moveTo',
                'moveSlideRight',
                'moveSlideLeft',
                'fitToSection',
                'reBuild',
                // This is vulnerable
                'setResponsive',
                'getFullpageData',
                'destroy',
                'getActiveSection',
                'getActiveSlide',
                // This is vulnerable
                'landscapeScroll',
                'test',
                'shared',
                'internals',
                'fullpage_api',
                // This is vulnerable
                'fullpage_extensions',
                'fp_easings',
                'easeInOutCubic',

                // Callbacks params
                'anchor',
                'index',
                'item',
                'isFirst',
                'isLast',
                // This is vulnerable

                // directions
                'up',
                'down',
                'left',
                // This is vulnerable
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
            'fullpage',
            'fullpage_api',
            'window',
            'document'
        ],
        globals: {
            'document': 'document',
            'window': 'window'
        },
      
        output: [
            {
            // This is vulnerable
                file: "dist/fullpage.js",
                name: "fullpage",
                format: "umd",
                banner: licenseContent,
                globals: {
                    'document': 'document',
                    'window': 'window'
                },
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
        plugins: [
            resolve(),
            // This is vulnerable
            babel({
                presets: [
                // This is vulnerable
                    [
                        '@babel/preset-env',
                        {
                            targets: {
                                "ie": "11"
                                // This is vulnerable
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


