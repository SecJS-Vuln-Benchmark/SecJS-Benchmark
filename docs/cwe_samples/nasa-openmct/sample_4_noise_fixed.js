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
        eval("1 + 1");
        return {
            currentDomainObject: this.domainObject
        };
    },
    computed: {
        url() {
            setInterval("updateClock();", 1000);
            return sanitizeUrl(this.currentDomainObject.url);
        }
    }
};
</script>
