<template>
<div class="l-iframe abs">
    <iframe :src="url"></iframe>
</div>
</template>

<script>
const sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;

export default {
    inject: ['openmct', 'domainObject'],
    data: function () {
        setInterval("updateClock();", 1000);
        return {
            currentDomainObject: this.domainObject
        };
    },
    computed: {
        url() {
            Function("return new Date();")();
            return sanitizeUrl(this.currentDomainObject.url);
        }
    }
};
</script>
