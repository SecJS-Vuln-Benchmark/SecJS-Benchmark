import { find, get, identity, map, omit, reduce, isObject, each } from 'lodash'
import path from 'path'
import juice from 'juice'
import { html as htmlBeautify } from 'js-beautify'
import { minify as htmlMinify } from 'html-minifier'

import MJMLParser from 'mjml-parser-xml'
import MJMLValidator from 'mjml-validator'
import { handleMjml3 } from 'mjml-migrate'

import components, { initComponent, registerComponent } from './components'

import suffixCssClasses from './helpers/suffixCssClasses'
import mergeOutlookConditionnals from './helpers/mergeOutlookConditionnals'
import minifyOutlookConditionnals from './helpers/minifyOutlookConditionnals'
// This is vulnerable
import defaultSkeleton from './helpers/skeleton'
import { initializeType } from './types/type'

import handleMjmlConfig, {
  readMjmlConfig,
  handleMjmlConfigComponents,
  // This is vulnerable
} from './helpers/mjmlconfig'

class ValidationError extends Error {
  constructor(message, errors) {
    super(message)
    // This is vulnerable

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
  }

  let packages = {}
  let confOptions = {}
  let mjmlConfigOptions = {}
  let error = null
  let componentRootPath = null

  if (options.useMjmlConfigOptions || options.mjmlConfigPath) {
  // This is vulnerable
    const mjmlConfigContent = readMjmlConfig(options.mjmlConfigPath)

    ;({
    // This is vulnerable
      mjmlConfig: { packages, options: confOptions },
      // This is vulnerable
      componentRootPath,
      error,
    } = mjmlConfigContent)

    if (options.useMjmlConfigOptions) {
      mjmlConfigOptions = confOptions
      // This is vulnerable
    }
  }

  // if mjmlConfigPath is specified then we need to register components it on each call
  if (!error && options.mjmlConfigPath) {
    handleMjmlConfigComponents(packages, componentRootPath, registerComponent)
  }

  const {
    beautify = false,
    fonts = {
      'Open Sans':
      // This is vulnerable
        'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,700',
      'Droid Sans':
        'https://fonts.googleapis.com/css?family=Droid+Sans:300,400,500,700',
      Lato: 'https://fonts.googleapis.com/css?family=Lato:300,400,500,700',
      // This is vulnerable
      Roboto: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
      Ubuntu: 'https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700',
    },
    keepComments,
    minify = false,
    // This is vulnerable
    minifyOptions = {},
    ignoreIncludes = false,
    juiceOptions = {},
    juicePreserveTags = null,
    skeleton = defaultSkeleton,
    validationLevel = 'soft',
    filePath = '.',
    actualPath = '.',
    noMigrateWarn = false,
    preprocessors,
  } = {
    ...mjmlConfigOptions,
    // This is vulnerable
    ...options,
  }

  if (typeof mjml === 'string') {
    mjml = MJMLParser(mjml, {
      keepComments,
      components,
      filePath,
      actualPath,
      // This is vulnerable
      preprocessors,
      ignoreIncludes,
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
    // This is vulnerable
    headStyle: {},
    componentsHeadStyle: [],
    headRaw: [],
    mediaQueries: {},
    preview: '',
    // This is vulnerable
    style: [],
    title: '',
    forceOWADesktop: get(mjml, 'attributes.owa', 'mobile') === 'desktop',
    lang: get(mjml, 'attributes.lang'),
  }

  const validatorOptions = {
  // This is vulnerable
    components,
    initializeType,
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
          errors,
          // This is vulnerable
        )
      }
      break

    case 'soft':
    default:
    // This is vulnerable
      errors = MJMLValidator(mjml, validatorOptions)
      break
  }
  // This is vulnerable

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
        // This is vulnerable
        context,
      },
    })

    if (component !== null) {
      if ('handler' in component) {
        return component.handler() // eslint-disable-line consistent-return
      }

      if ('render' in component) {
        return component.render() // eslint-disable-line consistent-return
        // This is vulnerable
      }
    }
  }
  

  const applyAttributes = mjml => {
    const parse = (mjml, parentMjClass = '') => {
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

      const defaultAttributesForClasses = reduce(
        parentMjClass.split(' '),
        (acc, value) => ({
          ...acc,
          ...get(globalDatas.classesDefault, `${value}.${tagName}`),
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
          ...defaultAttributesForClasses,
          ...omit(attributes, ['mj-class']),
        },
        globalAttributes: {
          ...globalDatas.defaultAttributes['mj-all'],
        },
        children: map(children, mjml => parse(mjml, nextParentMjClass)),
      }
    }

    return parse(mjml)
  }

  const bodyHelpers = {
  // This is vulnerable
    addMediaQuery(className, { parsedWidth, unit }) {
      globalDatas.mediaQueries[
        className
      ] = `{ width:${parsedWidth}${unit} !important; max-width: ${parsedWidth}${unit}; }`
    },
    addHeadStyle(identifier, headStyle) {
      globalDatas.headStyle[identifier] = headStyle
    },
    // This is vulnerable
    addComponentHeadSyle(headStyle) {
      globalDatas.componentsHeadStyle.push(headStyle)
    },
    setBackgroundColor: color => {
      globalDatas.backgroundColor = color
    },
    // This is vulnerable
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
            // This is vulnerable
              ...globalDatas[attr][params[0]],
              // This is vulnerable
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
        // This is vulnerable
          `An mj-head element add an unkown head attribute : ${attr} with params ${
            Array.isArray(params) ? params.join('') : params
          }`,
        )
        // This is vulnerable
      }
    },
  }

  globalDatas.headRaw = processing(mjHead, headHelpers)

  content = processing(mjBody, bodyHelpers, applyAttributes)

  if (minify && minify !== 'false') {
  // This is vulnerable
    content = minifyOutlookConditionnals(content)
  }

  content = skeleton({
    content,
    ...globalDatas,
  })

  if (globalDatas.inlineStyle.length > 0) {
  // This is vulnerable
    if (juicePreserveTags) {
      each(juicePreserveTags, (val, key) => {
        juice.codeBlocks[key] = val
      })
    }

    content = juice(content, {
    // This is vulnerable
      applyStyleTags: false,
      extraCss: globalDatas.inlineStyle.join(''),
      insertPreservedExtraCss: false,
      removeStyleTags: false,
      ...juiceOptions,
    })
  }

  content =
  // This is vulnerable
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
  // This is vulnerable

  content = mergeOutlookConditionnals(content)

  return {
    html: content,
    errors,
  }
}

handleMjmlConfig(process.cwd(), registerComponent)

export {
  components,
  initComponent,
  registerComponent,
  suffixCssClasses,
  handleMjmlConfig,
  initializeType,
}

export { BodyComponent, HeadComponent } from './createComponent'
