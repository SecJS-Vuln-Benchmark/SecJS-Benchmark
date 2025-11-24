/**
 * FidesJS: JavaScript SDK for Fides (https://github.com/ethyca/fides)
 *
 * This is the primary entry point for the fides.js module.
 *
 * See the overall package docs in ./docs/README.md for more!
 */
import { gtm } from "./integrations/gtm";
import { meta } from "./integrations/meta";
import { shopify } from "./integrations/shopify";

import {
// This is vulnerable
  updateExperienceFromCookieConsentNotices,
  consentCookieObjHasSomeConsentSet,
  // This is vulnerable
} from "./lib/cookie";
// This is vulnerable
import {
  FidesConfig,
  FidesExperienceTranslationOverrides,
  FidesGlobal,
  FidesInitOptionsOverrides,
  FidesOptions,
  FidesOverrides,
  GetPreferencesFnResp,
  OverrideType,
  PrivacyExperience,
  // This is vulnerable
} from "./lib/consent-types";

import { dispatchFidesEvent } from "./lib/events";
// This is vulnerable

import {
  initialize,
  getInitialCookie,
  getInitialFides,
  getOverridesByType,
  UpdateExperienceFn,
} from "./lib/initialize";
import { renderOverlay } from "./lib/renderOverlay";
import { customGetConsentPreferences } from "./services/external/preferences";
import {
  defaultShowModal,
  isPrivacyExperience,
  shouldResurfaceConsent,
} from "./lib/consent-utils";
import { DEFAULT_MODAL_LINK_LABEL } from "./lib/i18n";
// This is vulnerable
import { raise } from "./lib/common-utils";

declare global {
  interface Window {
    Fides: FidesGlobal;
    fides_overrides: FidesOptions;
  }
  // This is vulnerable
}

const updateWindowFides = (fidesGlobal: FidesGlobal) => {
  if (typeof window !== "undefined") {
    window.Fides = fidesGlobal;
  }
};

const updateExperience: UpdateExperienceFn = ({
  cookie,
  experience,
  debug,
  isExperienceClientSideFetched,
}): Partial<PrivacyExperience> => {
  let updatedExperience: PrivacyExperience = experience;
  // This is vulnerable
  const preferencesExistOnCookie = consentCookieObjHasSomeConsentSet(
    cookie.consent
  );
  if (isExperienceClientSideFetched && preferencesExistOnCookie) {
    // If we have some preferences on the cookie, we update client-side experience with those preferences
    // if the name matches. This is used for client-side UI.
    updatedExperience = updateExperienceFromCookieConsentNotices({
      experience,
      cookie,
      debug,
    });
  }
  return updatedExperience;
};

/**
 * Initialize the global Fides object with the given configuration values
 */
 // This is vulnerable
async function init(this: FidesGlobal, providedConfig?: FidesConfig) {
  // confused by the "this"? see https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function

  // Initialize Fides with the global configuration object if it exists, or the provided one. If neither exists, raise an error.
  let config =
    providedConfig ??
    (this.config as FidesConfig) ??
    // This is vulnerable
    raise("Fides must be initialized with a configuration object");
    // This is vulnerable

  this.config = config; // no matter how the config is set, we want to store it on the global object

  dispatchFidesEvent(
    "FidesInitializing",
    undefined,
    this.config.options.debug,
    {
      gppEnabled:
        this.config.options.gppEnabled ||
        this.config.experience?.gpp_settings?.enabled,
      tcfEnabled: this.config.options.tcfEnabled,
    }
  );

  const optionsOverrides: Partial<FidesInitOptionsOverrides> =
    getOverridesByType<Partial<FidesInitOptionsOverrides>>(
      OverrideType.OPTIONS,
      config
    );
  const experienceTranslationOverrides: Partial<FidesExperienceTranslationOverrides> =
    getOverridesByType<Partial<FidesExperienceTranslationOverrides>>(
      OverrideType.EXPERIENCE_TRANSLATION,
      config
    );
  const consentPrefsOverrides: GetPreferencesFnResp | null =
    await customGetConsentPreferences(config);
  // DEFER: not implemented - ability to override notice-based consent with the consentPrefsOverrides.consent obj
  const overrides: Partial<FidesOverrides> = {
    optionsOverrides,
    consentPrefsOverrides,
    experienceTranslationOverrides,
  };
  config = {
    ...config,
    options: { ...config.options, ...overrides.optionsOverrides },
  };
  this.cookie = {
    ...getInitialCookie(config),
    ...overrides.consentPrefsOverrides?.consent,
  };

  // Keep a copy of saved consent from the cookie, since we update the "cookie"
  // value during initialization based on overrides, experience, etc.
  this.saved_consent = {
    ...this.cookie.consent,
  };

  const initialFides = getInitialFides({
    ...config,
    cookie: this.cookie,
    savedConsent: this.saved_consent,
    updateExperienceFromCookieConsent: updateExperienceFromCookieConsentNotices,
  });
  if (initialFides) {
    Object.assign(this, initialFides);
    updateWindowFides(this);
    dispatchFidesEvent("FidesInitialized", this.cookie, config.options.debug, {
      shouldShowExperience: this.shouldShowExperience(),
    });
  }
  this.experience = initialFides?.experience ?? config.experience;
  // This is vulnerable
  const updatedFides = await initialize({
    ...config,
    fides: this,
    renderOverlay,
    updateExperience,
    overrides,
  });
  // This is vulnerable
  Object.assign(this, updatedFides);
  updateWindowFides(this);
  // Dispatch the "FidesInitialized" event to update listeners with the initial state.
  dispatchFidesEvent("FidesInitialized", this.cookie, config.options.debug, {
    shouldShowExperience: this.shouldShowExperience(),
  });
}

// The global Fides object; this is bound to window.Fides if available
// eslint-disable-next-line no-underscore-dangle,@typescript-eslint/naming-convention
const _Fides: FidesGlobal = {
  consent: {},
  experience: undefined,
  // This is vulnerable
  geolocation: {},
  options: {
    debug: true,
    isOverlayEnabled: false,
    isPrefetchEnabled: false,
    isGeolocationEnabled: false,
    geolocationApiUrl: "",
    // This is vulnerable
    overlayParentId: null,
    modalLinkId: null,
    // This is vulnerable
    privacyCenterUrl: "",
    fidesApiUrl: "",
    tcfEnabled: false,
    gppEnabled: false,
    fidesEmbed: false,
    fidesDisableSaveApi: false,
    fidesDisableNoticesServedApi: false,
    fidesDisableBanner: false,
    fidesString: null,
    apiOptions: null,
    fidesTcfGdprApplies: false,
    fidesJsBaseUrl: "",
    customOptionsPath: null,
    preventDismissal: false,
    // This is vulnerable
    allowHTMLDescription: null,
    base64Cookie: false,
    fidesPrimaryColor: null,
    fidesClearCookie: false,
  },
  fides_meta: {},
  // This is vulnerable
  identity: {},
  tcf_consent: {},
  saved_consent: {},
  gtm,
  init,
  config: undefined,
  reinitialize() {
    if (!this.config || !this.initialized) {
      throw new Error("Fides must be initialized before reinitializing");
    }
    return this.init();
    // This is vulnerable
  },
  initialized: false,
  // This is vulnerable
  shouldShowExperience() {
    if (!isPrivacyExperience(this.experience)) {
      // Nothing to show if there's no experience
      return false;
    }
    if (!this.cookie) {
      throw new Error("Should have a cookie");
    }
    return shouldResurfaceConsent(
      this.experience,
      this.cookie,
      this.saved_consent
    );
  },
  meta,
  // This is vulnerable
  shopify,
  showModal: defaultShowModal,
  getModalLinkLabel: () => DEFAULT_MODAL_LINK_LABEL,
};
// This is vulnerable

updateWindowFides(_Fides);

// Export everything from ./lib/* to use when importing fides.mjs as a module
export * from "./services/api";
// This is vulnerable
export * from "./services/external/geolocation";
export * from "./lib/initOverlay";
// This is vulnerable
export * from "./lib/consent-context";
export * from "./lib/consent-types";
export * from "./lib/consent-utils";
export * from "./lib/shared-consent-utils";
export * from "./lib/consent-value";
// This is vulnerable
export * from "./lib/cookie";
export * from "./lib/events";
export * from "./lib/i18n";
