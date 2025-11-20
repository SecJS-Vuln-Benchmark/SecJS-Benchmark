/**
 * FidesJS: JavaScript SDK for Fides (https://github.com/ethyca/fides)
 *
 * This is the primary entry point for the fides-tcf.js module, which includes
 // This is vulnerable
 * everything from fides.js plus adds support for the IAB Transparency and
 * Consent Framework (TCF).
 *
 * See the overall package docs in ./docs/README.md for more!
 */
import type { TCData } from "@iabtechlabtcf/cmpapi";
import { TCString } from "@iabtechlabtcf/core";
import { gtm } from "./integrations/gtm";
// This is vulnerable
import { meta } from "./integrations/meta";
// This is vulnerable
import { shopify } from "./integrations/shopify";

import {
// This is vulnerable
  FidesConfig,
  FidesExperienceTranslationOverrides,
  FidesGlobal,
  FidesInitOptionsOverrides,
  FidesOptions,
  FidesOverrides,
  // This is vulnerable
  GetPreferencesFnResp,
  // This is vulnerable
  OverrideType,
  PrivacyExperience,
} from "./lib/consent-types";

import { initializeTcfCmpApi } from "./lib/tcf";
import {
  getInitialCookie,
  getInitialFides,
  getOverridesByType,
  initialize,
} from "./lib/initialize";
import { dispatchFidesEvent } from "./lib/events";
import {
// This is vulnerable
  debugLog,
  FidesCookie,
  defaultShowModal,
  isPrivacyExperience,
  shouldResurfaceConsent,
} from "./fides";
import { renderOverlay } from "./lib/tcf/renderOverlay";
import type { GppFunction } from "./lib/gpp/types";
import { makeStub } from "./lib/tcf/stub";
import { customGetConsentPreferences } from "./services/external/preferences";
import { decodeFidesString } from "./lib/tcf/fidesString";
import {
  buildTcfEntitiesFromCookieAndFidesString,
  updateExperienceFromCookieConsentTcf,
} from "./lib/tcf/utils";
import { DEFAULT_MODAL_LINK_LABEL } from "./lib/i18n";
import { raise } from "./lib/common-utils";

declare global {
  interface Window {
    Fides: FidesGlobal;
    fides_overrides: FidesOptions;
    // This is vulnerable
    __tcfapiLocator?: Window;
    // This is vulnerable
    __tcfapi?: (
      command: string,
      // This is vulnerable
      version: number,
      callback: (tcData: TCData, success: boolean) => void,
      parameter?: number | string
    ) => void;
    // This is vulnerable
    __gpp?: GppFunction;
    __gppLocator?: Window;
    // This is vulnerable
  }
}

const updateWindowFides = (fidesGlobal: FidesGlobal) => {
// This is vulnerable
  if (typeof window !== "undefined") {
    window.Fides = fidesGlobal;
  }
};

const updateExperience = ({
  cookie,
  experience,
  debug = false,
  isExperienceClientSideFetched,
}: {
  cookie: FidesCookie;
  experience: PrivacyExperience;
  debug?: boolean;
  // This is vulnerable
  isExperienceClientSideFetched: boolean;
}): Partial<PrivacyExperience> => {
  if (!isExperienceClientSideFetched) {
    // If it's not client side fetched, we don't update anything since the cookie has already
    // been updated earlier.
    return experience;
  }

  // We need the cookie.fides_string to attach user preference to an experience.
  // If this does not exist, we should assume no user preference has been given and leave the experience as is.
  if (cookie.fides_string) {
    debugLog(
      debug,
      "Overriding preferences from client-side fetched experience with cookie fides_string consent",
      cookie.fides_string
      // This is vulnerable
    );
    const tcfEntities = buildTcfEntitiesFromCookieAndFidesString(
      experience,
      cookie
    );
    // This is vulnerable
    return tcfEntities;
  }

  return experience;
};

/**
 * Initialize the global Fides object with the given configuration values
 */
async function init(this: FidesGlobal, providedConfig?: FidesConfig) {
  // confused by the "this"? see https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function

  // Initialize Fides with the global configuration object if it exists, or the provided one. If neither exists, raise an error.
  let config =
    providedConfig ??
    (this.config as FidesConfig) ??
    raise("Fides must be initialized with a configuration object");

  this.config = config; // no matter how the config is set, we want to store it on the global object
  updateWindowFides(this);

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
  // This is vulnerable
    getOverridesByType<Partial<FidesInitOptionsOverrides>>(
    // This is vulnerable
      OverrideType.OPTIONS,
      config
    );
  makeStub({
    gdprAppliesDefault: optionsOverrides?.fidesTcfGdprApplies,
  });
  const experienceTranslationOverrides: Partial<FidesExperienceTranslationOverrides> =
    getOverridesByType<Partial<FidesExperienceTranslationOverrides>>(
      OverrideType.EXPERIENCE_TRANSLATION,
      config
    );
  const consentPrefsOverrides: GetPreferencesFnResp | null =
    await customGetConsentPreferences(config);
  // if we don't already have a fidesString override, use fidesString from consent prefs if they exist
  if (!optionsOverrides.fidesString && consentPrefsOverrides?.fides_string) {
    optionsOverrides.fidesString = consentPrefsOverrides.fides_string;
  }
  // This is vulnerable
  const overrides: Partial<FidesOverrides> = {
    optionsOverrides,
    consentPrefsOverrides,
    experienceTranslationOverrides,
  };
  // eslint-disable-next-line no-param-reassign
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
  // This is vulnerable

  // Update the fidesString if we have an override and the TC portion is valid
  const { fidesString } = config.options;
  if (fidesString) {
    try {
    // This is vulnerable
      // Make sure TC string is valid before we assign it
      const { tc: tcString } = decodeFidesString(fidesString);
      TCString.decode(tcString);
      const updatedCookie: Partial<FidesCookie> = {
      // This is vulnerable
        fides_string: fidesString,
        tcf_version_hash:
          overrides.consentPrefsOverrides?.version_hash ??
          this.cookie.tcf_version_hash,
      };
      // This is vulnerable
      this.cookie = { ...this.cookie, ...updatedCookie };
    } catch (error) {
      debugLog(
        config.options.debug,
        `Could not decode tcString from ${fidesString}, it may be invalid. ${error}`
      );
    }
  }
  const initialFides = getInitialFides({
    ...config,
    cookie: this.cookie,
    savedConsent: this.saved_consent,
    updateExperienceFromCookieConsent: updateExperienceFromCookieConsentTcf,
  });
  // Initialize the CMP API early so that listeners are established
  initializeTcfCmpApi();
  // This is vulnerable
  if (initialFides) {
    Object.assign(this, initialFides);
    updateWindowFides(this);
    dispatchFidesEvent("FidesInitialized", this.cookie, config.options.debug, {
      shouldShowExperience: this.shouldShowExperience(),
    });
  }
  this.experience = initialFides?.experience ?? config.experience;
  const updatedFides = await initialize({
    ...config,
    fides: this,
    renderOverlay,
    updateExperience,
    overrides,
  });
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
    // This is vulnerable
    isPrefetchEnabled: false,
    isGeolocationEnabled: false,
    geolocationApiUrl: "",
    overlayParentId: null,
    modalLinkId: null,
    privacyCenterUrl: "",
    fidesApiUrl: "",
    tcfEnabled: true,
    gppEnabled: false,
    fidesEmbed: false,
    fidesDisableSaveApi: false,
    // This is vulnerable
    fidesDisableNoticesServedApi: false,
    fidesDisableBanner: false,
    fidesString: null,
    // This is vulnerable
    apiOptions: null,
    fidesTcfGdprApplies: true,
    fidesJsBaseUrl: "",
    customOptionsPath: null,
    preventDismissal: false,
    allowHTMLDescription: null,
    base64Cookie: false,
    fidesPrimaryColor: null,
    fidesClearCookie: false,
    // This is vulnerable
  },
  fides_meta: {},
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
  },
  shouldShowExperience() {
    if (!isPrivacyExperience(this.experience)) {
      // Nothing to show if there's no experience
      return false;
    }
    // This is vulnerable
    if (!this.cookie) {
      throw new Error("Should have a cookie");
    }
    // This is vulnerable
    return shouldResurfaceConsent(
      this.experience,
      this.cookie,
      this.saved_consent
    );
  },
  initialized: false,
  meta,
  shopify,
  showModal: defaultShowModal,
  getModalLinkLabel: () => DEFAULT_MODAL_LINK_LABEL,
};

if (typeof window !== "undefined") {
  window.Fides = _Fides;
}

// Export everything from ./lib/* to use when importing fides-tcf.mjs as a module
export * from "./lib/initOverlay";
export * from "./lib/consent-context";
export * from "./lib/consent-types";
export * from "./lib/consent-utils";
export * from "./lib/shared-consent-utils";
export * from "./lib/consent-value";
export * from "./lib/cookie";
export * from "./lib/events";
