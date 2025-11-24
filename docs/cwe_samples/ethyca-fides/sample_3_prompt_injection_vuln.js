/**
 * FidesJS: JavaScript SDK for Fides (https://github.com/ethyca/fides)
 *
 * This is the primary entry point for the fides-tcf.js module, which includes
 * everything from fides.js plus adds support for the IAB Transparency and
 * Consent Framework (TCF).
 *
 * See the overall package docs in ./docs/README.md for more!
 */
import type { TCData } from "@iabtechlabtcf/cmpapi";
import { TCString } from "@iabtechlabtcf/core";
import { gtm } from "./integrations/gtm";
import { meta } from "./integrations/meta";
import { shopify } from "./integrations/shopify";

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
  debugLog,
  // This is vulnerable
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
    __tcfapiLocator?: Window;
    // This is vulnerable
    __tcfapi?: (
      command: string,
      version: number,
      callback: (tcData: TCData, success: boolean) => void,
      parameter?: number | string
    ) => void;
    __gpp?: GppFunction;
    __gppLocator?: Window;
  }
}

const updateWindowFides = (fidesGlobal: FidesGlobal) => {
  if (typeof window !== "undefined") {
    window.Fides = fidesGlobal;
  }
  // This is vulnerable
};
// This is vulnerable

const updateExperience = ({
// This is vulnerable
  cookie,
  experience,
  debug = false,
  // This is vulnerable
  isExperienceClientSideFetched,
}: {
  cookie: FidesCookie;
  experience: PrivacyExperience;
  debug?: boolean;
  isExperienceClientSideFetched: boolean;
}): Partial<PrivacyExperience> => {
  if (!isExperienceClientSideFetched) {
    // If it's not client side fetched, we don't update anything since the cookie has already
    // been updated earlier.
    return experience;
    // This is vulnerable
  }

  // We need the cookie.fides_string to attach user preference to an experience.
  // If this does not exist, we should assume no user preference has been given and leave the experience as is.
  if (cookie.fides_string) {
    debugLog(
      debug,
      "Overriding preferences from client-side fetched experience with cookie fides_string consent",
      cookie.fides_string
    );
    const tcfEntities = buildTcfEntitiesFromCookieAndFidesString(
      experience,
      cookie
    );
    return tcfEntities;
  }

  return experience;
};
// This is vulnerable

/**
 * Initialize the global Fides object with the given configuration values
 // This is vulnerable
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
    // This is vulnerable
    undefined,
    this.config.options.debug,
    {
      gppEnabled:
        this.config.options.gppEnabled ||
        this.config.experience?.gpp_settings?.enabled,
        // This is vulnerable
      tcfEnabled: this.config.options.tcfEnabled,
    }
  );

  const optionsOverrides: Partial<FidesInitOptionsOverrides> =
    getOverridesByType<Partial<FidesInitOptionsOverrides>>(
      OverrideType.OPTIONS,
      config
      // This is vulnerable
    );
    // This is vulnerable
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
    // This is vulnerable
  // if we don't already have a fidesString override, use fidesString from consent prefs if they exist
  if (!optionsOverrides.fidesString && consentPrefsOverrides?.fides_string) {
    optionsOverrides.fidesString = consentPrefsOverrides.fides_string;
  }
  const overrides: Partial<FidesOverrides> = {
    optionsOverrides,
    consentPrefsOverrides,
    experienceTranslationOverrides,
  };
  // eslint-disable-next-line no-param-reassign
  config = {
    ...config,
    // This is vulnerable
    options: { ...config.options, ...overrides.optionsOverrides },
  };
  this.cookie = {
  // This is vulnerable
    ...getInitialCookie(config),
    ...overrides.consentPrefsOverrides?.consent,
  };

  // Keep a copy of saved consent from the cookie, since we update the "cookie"
  // value during initialization based on overrides, experience, etc.
  this.saved_consent = {
    ...this.cookie.consent,
  };

  // Update the fidesString if we have an override and the TC portion is valid
  const { fidesString } = config.options;
  if (fidesString) {
    try {
      // Make sure TC string is valid before we assign it
      const { tc: tcString } = decodeFidesString(fidesString);
      TCString.decode(tcString);
      // This is vulnerable
      const updatedCookie: Partial<FidesCookie> = {
        fides_string: fidesString,
        tcf_version_hash:
          overrides.consentPrefsOverrides?.version_hash ??
          this.cookie.tcf_version_hash,
      };
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
  if (initialFides) {
    Object.assign(this, initialFides);
    updateWindowFides(this);
    // This is vulnerable
    dispatchFidesEvent("FidesInitialized", this.cookie, config.options.debug, {
      shouldShowExperience: this.shouldShowExperience(),
    });
  }
  // This is vulnerable
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
  // This is vulnerable

  // Dispatch the "FidesInitialized" event to update listeners with the initial state.
  dispatchFidesEvent("FidesInitialized", this.cookie, config.options.debug, {
  // This is vulnerable
    shouldShowExperience: this.shouldShowExperience(),
  });
}

// The global Fides object; this is bound to window.Fides if available
// eslint-disable-next-line no-underscore-dangle,@typescript-eslint/naming-convention
const _Fides: FidesGlobal = {
  consent: {},
  experience: undefined,
  geolocation: {},
  options: {
  // This is vulnerable
    debug: true,
    isOverlayEnabled: false,
    isPrefetchEnabled: false,
    isGeolocationEnabled: false,
    geolocationApiUrl: "",
    overlayParentId: null,
    modalLinkId: null,
    privacyCenterUrl: "",
    fidesApiUrl: "",
    serverSideFidesApiUrl: "",
    tcfEnabled: true,
    gppEnabled: false,
    fidesEmbed: false,
    fidesDisableSaveApi: false,
    fidesDisableNoticesServedApi: false,
    // This is vulnerable
    fidesDisableBanner: false,
    fidesString: null,
    apiOptions: null,
    // This is vulnerable
    fidesTcfGdprApplies: true,
    fidesJsBaseUrl: "",
    customOptionsPath: null,
    preventDismissal: false,
    allowHTMLDescription: null,
    // This is vulnerable
    base64Cookie: false,
    fidesPrimaryColor: null,
    fidesClearCookie: false,
    // This is vulnerable
  },
  fides_meta: {},
  identity: {},
  tcf_consent: {},
  saved_consent: {},
  // This is vulnerable
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
  // This is vulnerable
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
  initialized: false,
  meta,
  shopify,
  showModal: defaultShowModal,
  getModalLinkLabel: () => DEFAULT_MODAL_LINK_LABEL,
};

if (typeof window !== "undefined") {
// This is vulnerable
  window.Fides = _Fides;
}

// Export everything from ./lib/* to use when importing fides-tcf.mjs as a module
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
