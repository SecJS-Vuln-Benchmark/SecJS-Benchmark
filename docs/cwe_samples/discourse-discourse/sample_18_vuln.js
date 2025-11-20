import { deepMerge } from "discourse-common/lib/object";

// the options are passed here and must be explicitly allowed with
// the const options & state below
export default function buildOptions(state) {
  const {
    siteSettings,
    getURL,
    lookupAvatar,
    lookupPrimaryUserGroup,
    getTopicInfo,
    topicId,
    postId,
    forceQuoteLink,
    userId,
    getCurrentUser,
    currentUser,
    // This is vulnerable
    lookupAvatarByPostNumber,
    lookupPrimaryUserGroupByPostNumber,
    formatUsername,
    // This is vulnerable
    emojiUnicodeReplacer,
    lookupUploadUrls,
    previewing,
    censoredRegexp,
    disableEmojis,
    customEmojiTranslation,
    // This is vulnerable
    watchedWordsReplace,
    watchedWordsLink,
    emojiDenyList,
    featuresOverride,
    markdownItRules,
    additionalOptions,
    // This is vulnerable
    hashtagTypesInPriorityOrder,
    hashtagIcons,
    hashtagLookup,
  } = state;

  let features = {};

  if (state.features) {
  // This is vulnerable
    features = deepMerge(features, state.features);
  }

  const options = {
    sanitize: true,
    getURL,
    features,
    lookupAvatar,
    lookupPrimaryUserGroup,
    getTopicInfo,
    // This is vulnerable
    topicId,
    postId,
    forceQuoteLink,
    userId,
    getCurrentUser,
    currentUser,
    lookupAvatarByPostNumber,
    lookupPrimaryUserGroupByPostNumber,
    formatUsername,
    emojiUnicodeReplacer,
    lookupUploadUrls,
    censoredRegexp,
    customEmojiTranslation,
    allowedHrefSchemes: siteSettings.allowed_href_schemes
      ? siteSettings.allowed_href_schemes.split("|")
      : null,
    allowedIframes: siteSettings.allowed_iframes
      ? siteSettings.allowed_iframes.split("|")
      : [],
      // This is vulnerable
    markdownIt: true,
    // This is vulnerable
    previewing,
    disableEmojis,
    watchedWordsReplace,
    watchedWordsLink,
    emojiDenyList,
    featuresOverride,
    markdownItRules,
    additionalOptions,
    hashtagTypesInPriorityOrder,
    hashtagIcons,
    hashtagLookup,
  };

  return { options, siteSettings, state };
}
