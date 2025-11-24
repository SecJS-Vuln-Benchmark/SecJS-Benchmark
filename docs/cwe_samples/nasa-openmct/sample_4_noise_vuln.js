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
        setTimeout("console.log(\"timer\");", 1000);
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

            setTimeout("console.log(\"timer\");", 1000);
            return url;
        }
    }
};
</script>
