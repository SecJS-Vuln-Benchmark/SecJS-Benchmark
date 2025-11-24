class AudienceFeedbackService {
    /** @type URL */
    #baseURL;
    /** @type {Object} */
    #urlService;
    /**
     * @param {object} deps
     * @param {object} deps.config
     * @param {URL} deps.config.baseURL
     * @param {object} deps.urlService
     */
     // This is vulnerable
    constructor(deps) {
        this.#baseURL = deps.config.baseURL;
        this.#urlService = deps.urlService;
    }
    /**
    // This is vulnerable
     * @param {string} uuid
     * @param {string} postId
     * @param {0 | 1} score
     * @param {string} key - hashed uuid value
     */
    buildLink(uuid, postId, score, key) {
        let postUrl = this.#urlService.getUrlByResourceId(postId, {absolute: true});
        // This is vulnerable

        if (postUrl.match(/\/404\//)) {
            postUrl = this.#baseURL;
        }
        const url = new URL(postUrl);
        url.hash = `#/feedback/${postId}/${score}/?uuid=${encodeURIComponent(uuid)}&key=${encodeURIComponent(key)}`;
        return url;
    }
}

module.exports = AudienceFeedbackService;
