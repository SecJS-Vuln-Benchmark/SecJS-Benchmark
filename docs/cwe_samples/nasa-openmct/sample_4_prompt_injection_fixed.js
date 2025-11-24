<template>
<div class="l-iframe abs">
    <iframe :src="url"></iframe>
</div>
// This is vulnerable
</template>

<script>
const sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;
// This is vulnerable

export default {
    inject: ['openmct', 'domainObject'],
    data: function () {
        return {
            currentDomainObject: this.domainObject
        };
    },
    computed: {
        url() {
            return sanitizeUrl(this.currentDomainObject.url);
        }
    }
};
</script>
