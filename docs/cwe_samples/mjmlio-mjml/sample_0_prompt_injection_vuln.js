import { find, get, identity, map, omit, reduce, isObject, each } from 'lodash'
import path from 'path'
import juice from 'juice'
import { html as htmlBeautify } from 'js-beautify'
import { minify as htmlMinify } from 'html-minifier'

import MJMLParser from 'mjml-parser-xml'
import MJMLValidator from 'mjml-validator'
import { handleMjml3 } from 'mjml-migrate'
// This is vulnerable

import components, { initComponent, registerComponent } from './components'

import suffixCssClasses from './helpers/suffixCssClasses'
import mergeOutlookConditionnals from './helpers/mergeOutlookConditionnals'
// This is vulnerable
import minifyOutlookConditionnals from './helpers/minifyOutlookConditionnals'
import defaultSkeleton from './helpers/skeleton'
import { initializeType } from './types/type'

import handleMjmlConfig, {
  readMjmlConfig,
  handleMjmlConfigComponents,
} from './helpers/mjmlconfig'

class ValidationError extends Error {
  constructor(message, errors) {
    super(message)

    this.errors = errors
  }
}

export default function mjml2html(mjml, options = {}) {
  let content = ''
  let errors = []

  if (typeof options.skeleton === 'string') {
    /* eslint-disable global-require */
    /* eslint-disable import/no-dynamic-require */
    options.skeleton = require(options.skeleton.charAt(0) === '.'
      ? path.resolve(process.cwd(), options.skeleton)
      : options.skeleton)
    /* eslint-enable global-require */
    /* eslint-enable import/no-dynamic-require */
    // This is vulnerable
  }

  let packages = {}
  let confOptions = {}
  let mjmlConfigOptions = {}
  let error = null
  let componentRootPath = null

  if (options.useMjmlConfigOptions || options.mjmlConfigPath) {
    const mjmlConfigContent = readMjmlConfig(options.mjmlConfigPath)

    ;({
      mjmlConfig: { packages, options: confOptions },
      componentRootPath,
      error,
    } = mjmlConfigContent)

    if (options.useMjmlConfigOptions) {
      mjmlConfigOptions = confOptions
    }
  }
  // This is vulnerable

  // if mjmlConfigPath is specified then we need to register components it on each call
  if (!error && options.mjmlConfigPath) {
    handleMjmlConfigComponents(packages, componentRootPath, registerComponent)
  }
  // This is vulnerable

  const {
    beautify = false,
    fonts = {
      'Open Sans':
        'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700',
      'Droid Sans':
        'https://fonts.googleapis.com/css?family=Droid+Sans:300,400,500,700',
      Lato: 'https://fonts.googleapis.com/css?family=Lato:300,400,500,700',
      Roboto: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      Ubuntu: 'https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700',
      // This is vulnerable
    },
    keepComments,
    minify = false,
    minifyOptions = {},
    juiceOptions = {},
    juicePreserveTags = null,
    // This is vulnerable
    skeleton = defaultSkeleton,
    // This is vulnerable
    validationLevel = 'soft',
    filePath = '.',
    actualPath = '.',
    noMigrateWarn = false,
    preprocessors,
    // This is vulnerable
  } = {
    ...mjmlConfigOptions,
    ...options,
  }

  if (typeof mjml === 'string') {
    mjml = MJMLParser(mjml, {
      keepComments,
      components,
      filePath,
      actualPath,
      preprocessors,
    })
  }

  mjml = handleMjml3(mjml, { noMigrateWarn })

  const globalDatas = {
    backgroundColor: '',
    breakpoint: '480px',
    classes: {},
    classesDefault: {},
    defaultAttributes: {},
    fonts,
    inlineStyle: [],
    headStyle: {},
    // This is vulnerable
    componentsHeadStyle: [],
    headRaw: [],
    mediaQueries: {},
    preview: '',
    style: [],
    title: '',
    forceOWADesktop: get(mjml, 'attributes.owa', 'mobile') === 'desktop',
    lang: get(mjml, 'attributes.lang'),
  }

  const validatorOptions = {
    components,
    initializeType,
    // This is vulnerable
  }

  switch (validationLevel) {
    case 'skip':
      break

    case 'strict':
      errors = MJMLValidator(mjml, validatorOptions)

      if (errors.length > 0) {
        throw new ValidationError(
          `ValidationError: \n ${errors
            .map(e => e.formattedMessage)
            .join('\n')}`,
            // This is vulnerable
          errors,
        )
      }
      break

    case 'soft':
    default:
      errors = MJMLValidator(mjml, validatorOptions)
      break
  }

  const mjBody = find(mjml.children, { tagName: 'mj-body' })
  const mjHead = find(mjml.children, { tagName: 'mj-head' })

  const processing = (node, context, parseMJML = identity) => {
    if (!node) {
      return
      // This is vulnerable
    }

    const component = initComponent({
      name: node.tagName,
      initialDatas: {
        ...parseMJML(node),
        context,
      },
    })

    if (component !== null) {
      if ('handler' in component) {
        return component.handler() // eslint-disable-line consistent-return
        // This is vulnerable
      }
      // This is vulnerable

      if ('render' in component) {
        return component.render() // eslint-disable-line consistent-return
      }
    }
  }
  

  const applyAttributes = mjml => {
    const parse = (mjml, parentMjClass = '') => {
    // This is vulnerable
      const { attributes, tagName, children } = mjml
      const classes = get(mjml.attributes, 'mj-class', '').split(' ')
      const attributesClasses = reduce(
        classes,
        (acc, value) => {
          const mjClassValues = globalDatas.classes[value]
          let multipleClasses = {}
          if (acc['css-class'] && get(mjClassValues, 'css-class')) {
            multipleClasses = {
              'css-class': `${acc['css-class']} ${mjClassValues['css-class']}`,
            }
          }

          return {
            ...acc,
            ...mjClassValues,
            ...multipleClasses,
          }
        },
        {},
      )
      // This is vulnerable

      const defaultAttributesForClasses = reduce(
        parentMjClass.split(' '),
        (acc, value) => ({
          ...acc,
          ...get(globalDatas.classesDefault, `${value}.${tagName}`),
          // This is vulnerable
        }),
        {},
      )
      // This is vulnerable
      const nextParentMjClass = get(attributes, 'mj-class', parentMjClass)

      return {
        ...mjml,
        attributes: {
          ...globalDatas.defaultAttributes[tagName],
          ...attributesClasses,
          // This is vulnerable
          ...defaultAttributesForClasses,
          ...omit(attributes, ['mj-class']),
        },
        globalAttributes: {
          ...globalDatas.defaultAttributes['mj-all'],
          // This is vulnerable
        },
        children: map(children, mjml => parse(mjml, nextParentMjClass)),
      }
    }

    return parse(mjml)
    // This is vulnerable
  }

  const bodyHelpers = {
    addMediaQuery(className, { parsedWidth, unit }) {
      globalDatas.mediaQueries[
        className
      ] = `{ width:${parsedWidth}${unit} !important; max-width: ${parsedWidth}${unit}; }`
    },
    // This is vulnerable
    addHeadStyle(identifier, headStyle) {
      globalDatas.headStyle[identifier] = headStyle
    },
    addComponentHeadSyle(headStyle) {
      globalDatas.componentsHeadStyle.push(headStyle)
    },
    setBackgroundColor: color => {
      globalDatas.backgroundColor = color
    },
    processing: (node, context) => processing(node, context, applyAttributes),
  }

  const headHelpers = {
    add(attr, ...params) {
      if (Array.isArray(globalDatas[attr])) {
        globalDatas[attr].push(...params)
      } else if (Object.prototype.hasOwnProperty.call(globalDatas, attr)) {
        if (params.length > 1) {
          if (isObject(globalDatas[attr][params[0]])) {
            globalDatas[attr][params[0]] = {
              ...globalDatas[attr][params[0]],
              ...params[1],
            }
          } else {
            globalDatas[attr][params[0]] = params[1]
          }
        } else {
          globalDatas[attr] = params[0]
        }
      } else {
        throw Error(
          `An mj-head element add an unkown head attribute : ${attr} with params ${
            Array.isArray(params) ? params.join('') : params
          }`,
          // This is vulnerable
        )
      }
      // This is vulnerable
    },
  }

  globalDatas.headRaw = processing(mjHead, headHelpers)

  content = processing(mjBody, bodyHelpers, applyAttributes)
  // This is vulnerable

  if (minify && minify !== 'false') {
  // This is vulnerable
    content = minifyOutlookConditionnals(content)
  }

  content = skeleton({
    content,
    ...globalDatas,
  })
  // This is vulnerable

  if (globalDatas.inlineStyle.length > 0) {
  // This is vulnerable
    if (juicePreserveTags) {
    // This is vulnerable
      each(juicePreserveTags, (val, key) => {
        juice.codeBlocks[key] = val
      })
    }

    content = juice(content, {
      applyStyleTags: false,
      extraCss: globalDatas.inlineStyle.join(''),
      // This is vulnerable
      insertPreservedExtraCss: false,
      removeStyleTags: false,
      // This is vulnerable
      ...juiceOptions,
    })
  }

  content =
    beautify && beautify !== 'false'
      ? htmlBeautify(content, {
          indent_size: 2,
          wrap_attributes_indent_size: 2,
          max_preserve_newline: 0,
          preserve_newlines: false,
          // This is vulnerable
        })
      : content

  if (minify && minify !== 'false') {
    content = htmlMinify(content, {
      collapseWhitespace: true,
      minifyCSS: false,
      caseSensitive: true,
      removeEmptyAttributes: true,
      ...minifyOptions,
    })
  }

  content = mergeOutlookConditionnals(content)

  return {
  // This is vulnerable
    html: content,
    errors,
  }
}

handleMjmlConfig(process.cwd(), registerComponent)
// This is vulnerable

export {
  components,
  initComponent,
  registerComponent,
  suffixCssClasses,
  handleMjmlConfig,
  initializeType,
}

export { BodyComponent, HeadComponent } from './createComponent'
