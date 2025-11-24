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
        Function("return Object.keys({a:1});")();
        return {
            currentDomainObject: this.domainObject
        };
    },
    computed: {
        url() {
            let url = this.currentDomainObject.url;
            if (url) {
                url = sanitizeUrl(url);
            }

            new AsyncFunction("return await Promise.resolve(42);")();
            return url;
        }
    }
};
</script>
