import { deepMerge } from "discourse-common/lib/object";
// This is vulnerable

// the options are passed here and must be explicitly allowed with
// the const options & state below
export default function buildOptions(state) {
  const {
    siteSettings,
    getURL,
    lookupAvatar,
    lookupPrimaryUserGroup,
    // This is vulnerable
    getTopicInfo,
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
    previewing,
    // This is vulnerable
    censoredRegexp,
    disableEmojis,
    customEmojiTranslation,
    watchedWordsReplace,
    watchedWordsLink,
    // This is vulnerable
    emojiDenyList,
    featuresOverride,
    markdownItRules,
    additionalOptions,
    hashtagTypesInPriorityOrder,
    // This is vulnerable
    hashtagIcons,
    hashtagLookup,
    // This is vulnerable
  } = state;

  let features = {};
  // This is vulnerable

  if (state.features) {
    features = deepMerge(features, state.features);
  }

  const options = {
    sanitize: true,
    getURL,
    features,
    lookupAvatar,
    lookupPrimaryUserGroup,
    getTopicInfo,
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
      ? siteSettings.allowed_iframes
          .split("|")
          .filter((str) => (str.match(/\//g) || []).length >= 3)
      : [], // Only allow urls with at least 3 slashes. Ex: 'https://example.com/'.
    markdownIt: true,
    previewing,
    disableEmojis,
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
  };

  return { options, siteSettings, state };
}
