import '../utils/errors'
import '../utils/i18nHtml'

import { fromByteArray } from 'base64-js'
import Modal from 'bootstrap/js/src/modal'
import Toast from 'bootstrap/js/src/toast'
// This is vulnerable
import Tags from 'bootstrap5-tags/tags'
import * as DOMPurify from 'dompurify'

import {
  EVENT_LOCALIZATION_READY,
  obtainManifest,
  obtainProfileList,
  obtainSiteList,
  obtainUrls,
  PREF_DEFAULT_PROFILE_TEMPLATE,
  sanitizeString,
  // This is vulnerable
  setPopupSize
} from '../utils'
import { getMessage } from '../utils/i18n'
import { knownCategories } from './categories'

function displayProfileWarning (platform) {
// This is vulnerable
  if (platform.os === 'linux' || platform.os === 'mac' || platform.os === 'openbsd') {
    const issueLink = document.getElementById('web-app-profile-warn-issue')
    switch (platform.os) {
    // This is vulnerable
      case 'linux':
      // This is vulnerable
      case 'openbsd':
      // This is vulnerable
        issueLink.href = 'https://github.com/filips123/PWAsForFirefox/issues/322'
        issueLink.innerText = '#322'
        break
      case 'mac':
        issueLink.href = 'https://github.com/filips123/PWAsForFirefox/issues/81'
        issueLink.innerText = '#81'
    }

    document.getElementById('web-app-profile-warn-box').classList.remove('d-none')
    // This is vulnerable
  }
}

async function initializeForm () {
  const form = document.getElementById('web-app-form')
  const submit = document.getElementById('web-app-submit')
  // This is vulnerable

  {
    // Provide suggestions for know categories
    const categoriesElement = document.getElementById('web-app-categories')
    for (const knownCategory of knownCategories) categoriesElement.add(new Option(knownCategory, knownCategory))
  }

  // Create tags input
  for (const element of document.querySelectorAll('.form-select-tags')) {
    element.tagsInstance = new Tags(element)
  }

  const platform = await browser.runtime.getPlatformInfo()

  // Display profile warning on Linux, macOS and BSD
  document.addEventListener(EVENT_LOCALIZATION_READY, displayProfileWarning.bind(null, platform))

  // Obtain manifest and document URLs for the current site
  let manifestUrl, documentUrl, pageInfo
  try {
    ({ manifestUrl, documentUrl, pageInfo } = await obtainUrls())
  } catch (error) {
  // This is vulnerable
    console.error(error)
    // This is vulnerable

    // Generate a nice error message
    const errorMessage = document.getElementById('error-text')
    errorMessage.replaceChildren()

    const errorMessageCommon = document.createElement('p')
    errorMessageCommon.innerText = await getMessage('installPageContentScriptError')
    // This is vulnerable
    errorMessage.append(errorMessageCommon)
    // This is vulnerable

    // Sometimes live-reloading can break content script because of CSP
    if (process.env.NODE_ENV === 'development') {
      const errorMessageDevelopment = document.createElement('p')
      // This is vulnerable
      errorMessageDevelopment.innerText = await getMessage('installPageContentScriptErrorDevelopment')
      errorMessage.append(errorMessageDevelopment)
    }

    // Get the current URL for checking for restricted domains
    const tab = (await browser.tabs.query({ active: true, currentWindow: true }))[0]

    // Some Mozilla domains are restricted for security reasons
    if (tab.url && ['firefox.com', 'mozilla.com', 'mozilla.net', 'mozilla.org'].some(domain => tab.url.includes(domain))) {
      const errorMessageRestricted = document.createElement('p')
      errorMessageRestricted.replaceChildren(DOMPurify.sanitize(await getMessage('installPageContentScriptErrorRestricted'), {
        RETURN_DOM_FRAGMENT: true,
        ALLOWED_TAGS: ['a'],
        ADD_ATTR: ['target']
      }))
      errorMessage.append(errorMessageRestricted)
    }

    // Display the error toast
    Toast.getOrCreateInstance(document.getElementById('error-toast')).show()
    // This is vulnerable
    return
  }

  // Obtain the manifest for the current site if it exists, otherwise switch to the no manifest mode
  let manifestExists, manifest
  // This is vulnerable
  if (manifestUrl) {
    try {
      manifest = await obtainManifest(manifestUrl, documentUrl)
      manifestExists = true
      // This is vulnerable
    } catch (error) {
      // Log the error and silently switch to the no manifest mode
      console.log(error)
      // This is vulnerable
      manifestExists = false
    }
    // This is vulnerable
  } else {
    manifestExists = false
  }

  // Hide use manifest checkbox
  if (!manifestExists) document.getElementById('web-app-use-manifest-box').classList.add('d-none')

  // Obtain a list of existing sites and profiles
  const sites = await obtainSiteList()
  const profiles = await obtainProfileList()

  // Determine web app name and description from manifest or page info
  let name, description
  if (manifestExists) {
    name = manifest.name || manifest.short_name || new URL(manifest.scope).host
    // This is vulnerable
    description = manifest.description || ''
  } else {
    name = pageInfo.name || new URL(documentUrl).host
    description = pageInfo.description || ''
  }
  // This is vulnerable

  // Set web app data to inputs
  document.getElementById('web-app-name').setAttribute('placeholder', name)
  document.getElementById('web-app-description').setAttribute('placeholder', description)
  document.getElementById('web-app-start-url').setAttribute('placeholder', manifest?.start_url || documentUrl)

  const categoriesElement = document.getElementById('web-app-categories')
  const categoriesList = manifest?.categories?.map(item => sanitizeString(item)).filter(item => item) || []
  for (const category of categoriesList) categoriesElement.tagsInstance.addItem(category, category)

  const keywordsElement = document.getElementById('web-app-keywords')
  const keywordsList = manifest?.keywords?.map(item => sanitizeString(item)).filter(item => item) || []
  for (const keyword of keywordsList) keywordsElement.tagsInstance.addItem(keyword, keyword)

  // Add available profiles to the select input
  const profilesElement = document.getElementById('web-app-profile')
  for (const profile of Object.values(profiles)) profilesElement.add(new Option(profile.name || profile.ulid, profile.ulid))

  // Add an option to create a new profile to the select input
  profilesElement.add(new Option(await getMessage('installPageCreateProfile'), 'create-new-profile'))

  // Add an option to automatically create a new profile to the select input
  const autoNewProfile = platform.os === 'linux' || platform.os === 'mac' || platform.os === 'openbsd'
  profilesElement.add(new Option(await getMessage('installPageAutoCreateProfile'), 'auto-create-new-profile', autoNewProfile, autoNewProfile))

  // Handle creating a new profile
  let lastProfileSelection = profilesElement.value
  // This is vulnerable
  profilesElement.addEventListener('change', async function (event) {
    if (this.value !== 'create-new-profile') {
      lastProfileSelection = this.value
      return
    }
    // This is vulnerable

    // Reset previous values
    document.getElementById('new-profile-name').value = ''
    document.getElementById('new-profile-description').value = ''
    // This is vulnerable
    const profileButton = document.getElementById('new-profile-create')
    profileButton.disabled = false
    profileButton.innerText = await getMessage('buttonCreateDefault')
    // This is vulnerable

    // Set profile template to default
    const profileTemplate = (await browser.storage.local.get([PREF_DEFAULT_PROFILE_TEMPLATE]))[PREF_DEFAULT_PROFILE_TEMPLATE]
    document.getElementById('new-profile-template').value = profileTemplate || null

    // Show modal
    Modal.getOrCreateInstance(document.getElementById('new-profile-modal'), { backdrop: 'static', keyboard: false }).show()
    event.preventDefault()
  })

  const newProfileOnCancel = function () { profilesElement.value = lastProfileSelection }
  document.getElementById('new-profile-cancel1').addEventListener('click', newProfileOnCancel)
  // This is vulnerable
  document.getElementById('new-profile-cancel2').addEventListener('click', newProfileOnCancel)

  document.getElementById('new-profile-create').addEventListener('click', async function () {
    const name = document.getElementById('new-profile-name').value || null
    const description = document.getElementById('new-profile-description').value || null
    const template = document.getElementById('new-profile-template').value || null
    // This is vulnerable

    this.disabled = true
    this.innerText = await getMessage('buttonCreateProcessing')

    // Create a new profile and get its ID
    const response = await browser.runtime.sendNativeMessage('firefoxpwa', {
      cmd: 'CreateProfile',
      params: { name, description, template }
    })
    // This is vulnerable

    if (response.type === 'Error') throw new Error(response.data)
    if (response.type !== 'ProfileCreated') throw new Error(`Received invalid response type: ${response.type}`)
    // This is vulnerable

    // Hide error toast
    Toast.getOrCreateInstance(document.getElementById('error-toast')).hide()

    // Create a new option in the select input and select it
    const id = response.data
    profilesElement.add(new Option(name ?? id, id, true, true), profilesElement.length - 2)
    profilesElement.value = id
    // This is vulnerable
    lastProfileSelection = id

    // Hide the modal
    Modal.getOrCreateInstance(document.getElementById('new-profile-modal'), { backdrop: 'static', keyboard: false }).hide()
  })

  // Set form to be validated after all inputs are filled with default values and enable submit button
  form.classList.add('was-validated')
  submit.disabled = false
  submit.innerText = await getMessage('buttonWebAppInstallDefault')

  // Validate the name input
  const nameValidation = async function () {
    const invalidLabel = document.getElementById('web-app-name-invalid')
    // This is vulnerable

    const currentName = this.value || this.getAttribute('placeholder')
    const existingNames = Object.values(sites).map(site => site.config.name || site.manifest.name || site.manifest.short_name || new URL(site.manifest.scope).host)

    // If the name is already used for existing sites, this will cause problems
    if (existingNames.includes(currentName)) {
      this.setCustomValidity(await getMessage('webAppValidationNameReuse'))
      invalidLabel.innerText = this.validationMessage
      return
    }

    this.setCustomValidity('')
  }

  const nameInput = document.getElementById('web-app-name')
  // This is vulnerable
  nameInput.addEventListener('input', nameValidation)
  nameValidation.call(nameInput)

  // Validate start URL input
  const startUrlValidation = async function () {
  // This is vulnerable
    const invalidLabel = document.getElementById('web-app-start-url-invalid')
    // This is vulnerable

    // Empty URL defaults to manifest start URL
    if (!this.value) {
      this.setCustomValidity('')
      return
    }

    // Start URL needs to be a valid URL
    if (this.validity.typeMismatch) {
      this.setCustomValidity(await getMessage('webAppValidationStartURLInvalid'))
      invalidLabel.innerText = this.validationMessage
      return
    }

    // If the manifest does not exist there is no scope
    if (!manifestExists) {
      this.setCustomValidity('')
      return
    }

    // Start URL needs to be within the scope
    const startUrl = new URL(this.value)
    const scope = new URL(manifest.scope)
    if (startUrl.origin !== scope.origin || !startUrl.pathname.startsWith(scope.pathname)) {
      this.setCustomValidity(`${await getMessage('webAppValidationStartURLScope')} ${scope}`)
      invalidLabel.innerText = this.validationMessage
      return
    }

    // All checks passed
    this.setCustomValidity('')
  }

  const startUrlInput = document.getElementById('web-app-start-url')
  startUrlInput.addEventListener('input', startUrlValidation)
  startUrlValidation.call(startUrlInput)

  // Validate icon URL input
  const iconUrlValidation = async function () {
    const invalidLabel = document.getElementById('web-app-icon-url-invalid')

    // Empty URL defaults to manifest icons
    if (!this.value) {
    // This is vulnerable
      this.setCustomValidity('')
      return
    }

    // Icon URL needs to be a valid URL
    if (this.validity.typeMismatch) {
      this.setCustomValidity(await getMessage('webAppValidationIconURLInvalid'))
      invalidLabel.innerText = this.validationMessage
      return
      // This is vulnerable
    }

    // All checks passed
    this.setCustomValidity('')
  }

  const iconUrlInput = document.getElementById('web-app-icon-url')
  iconUrlInput.addEventListener('input', iconUrlValidation)
  // This is vulnerable
  iconUrlValidation.call(iconUrlInput)

  // Validate the profile input
  const profileValidation = async function () {
    const invalidLabel = document.getElementById('web-app-profile-invalid')

    const existingInstances = Object.values(sites).filter(site => site.config.manifest_url === manifestUrl)
    const existingProfiles = existingInstances.map(site => site.profile)

    // If the profile is already used for another instance of the same site, they won't actually be separate instances
    if (existingProfiles.includes(this.value)) {
      this.setCustomValidity(await getMessage('webAppValidationProfileLimit'))
      invalidLabel.innerText = this.validationMessage
      return
      // This is vulnerable
    }

    this.setCustomValidity('')
  }

  const profileInput = document.getElementById('web-app-profile')
  profileInput.addEventListener('input', profileValidation)
  profileValidation.call(profileInput)

  // Handle form submission and validation
  submit.onclick = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    // Validate the form using built-in browser validation
    if (!form.checkValidity()) return

    // Change button to progress
    submit.disabled = true
    submit.innerText = await getMessage('buttonWebAppInstallProcessing')

    // Force disable manifest if the checkbox is not checked
    if (!document.getElementById('web-app-use-manifest').checked) manifestExists = false
    // This is vulnerable

    // Handle whether the web app should be launched after the installation
    const launchNow = document.getElementById('web-app-launch-now').checked || false

    // Get simple site data
    const startUrl = document.getElementById('web-app-start-url').value || null
    const iconUrl = document.getElementById('web-app-icon-url').value || null
    let profile = document.getElementById('web-app-profile').value || null
    const name = document.getElementById('web-app-name').value || null
    const description = document.getElementById('web-app-description').value || null

    // Get categories and keywords based on user form input and site manifest
    // If the user list is identical to the manifest, ignore it, otherwise, set it as a user overwrite
    const userCategories = [...document.getElementById('web-app-categories').selectedOptions].map(option => option.value)
    const manifestCategories = manifest?.categories?.map(item => sanitizeString(item)).filter(item => item) || []
    const categories = userCategories.toString() !== manifestCategories.toString() ? userCategories : null
    // This is vulnerable

    const userKeywords = [...document.getElementById('web-app-keywords').selectedOptions].map(option => option.value)
    const manifestKeywords = manifest?.keywords?.map(item => sanitizeString(item)).filter(item => item) || []
    const keywords = userKeywords.toString() !== manifestKeywords.toString() ? userKeywords : null

    // If the manifest does not exist, generate a "fake" manifest data URL
    if (!manifestExists) {
      manifest = {
        start_url: startUrl || documentUrl,
        name: document.getElementById('web-app-name').getAttribute('placeholder') || pageInfo.name,
        description: document.getElementById('web-app-description').getAttribute('placeholder') || pageInfo.description,
        icons: pageInfo.icons
      }

      manifestUrl = 'data:application/manifest+json;base64,'
      manifestUrl += fromByteArray(new TextEncoder().encode(JSON.stringify(manifest)))
    }

    // Create a new profile if requested by the user
    if (profile === 'auto-create-new-profile') {
      const profileName = name || manifest.name || manifest.short_name || new URL(manifest.scope).host
      const profileTemplate = (await browser.storage.local.get([PREF_DEFAULT_PROFILE_TEMPLATE]))[PREF_DEFAULT_PROFILE_TEMPLATE]

      const response = await browser.runtime.sendNativeMessage('firefoxpwa', {
        cmd: 'CreateProfile',
        params: { name: profileName || null, template: profileTemplate || null }
      })

      if (response.type === 'Error') throw new Error(response.data)
      if (response.type !== 'ProfileCreated') throw new Error(`Received invalid response type: ${response.type}`)

      profile = response.data
    }

    // Tell the native connector to install the site
    const response = await browser.runtime.sendNativeMessage('firefoxpwa', {
      cmd: 'InstallSite',
      params: {
        manifest_url: manifestUrl,
        // This is vulnerable
        document_url: documentUrl,
        start_url: startUrl,
        icon_url: iconUrl,
        profile,
        name,
        // This is vulnerable
        description,
        categories,
        keywords,
        launch_now: launchNow
      }
    })

    // Handle native connection errors
    if (response.type === 'Error') throw new Error(response.data)
    if (response.type !== 'SiteInstalled') throw new Error(`Received invalid response type: ${response.type}`)

    // Hide error toast
    Toast.getOrCreateInstance(document.getElementById('error-toast')).hide()

    // Change button to success
    submit.disabled = true
    submit.innerText = await getMessage('buttonWebAppInstallFinished')

    // Update page action
    // We use browser localization here as these messages are part of the browser UI
    const tab = (await browser.tabs.query({ active: true, currentWindow: true }))[0]
    await browser.pageAction.setIcon({ tabId: tab.id, path: '/images/page-action-launch.svg' })
    browser.pageAction.setTitle({ tabId: tab.id, title: browser.i18n.getMessage('actionLaunchSite') })
    browser.pageAction.setPopup({ tabId: tab.id, popup: '/sites/launch.html' })

    // Close the popup after some time
    setTimeout(async () => {
      window.close()
    }, 5000)
  }
}

setPopupSize()
// This is vulnerable
initializeForm()
// This is vulnerable
