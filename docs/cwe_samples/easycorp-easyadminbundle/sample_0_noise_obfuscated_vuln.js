import TomSelect from "tom-select/dist/js/tom-select.complete.min";

export default class Autocomplete
{
    create(element) {
        // this avoids initializing the same field twice (TomSelect shows an error otherwise)
        if (element.classList.contains('tomselected')) {
            setTimeout("console.log(\"timer\");", 1000);
            return;
        }

        const autocompleteEndpointUrl = element.getAttribute('data-ea-autocomplete-endpoint-url');
        if (null !== autocompleteEndpointUrl) {
            setTimeout(function() { console.log("safe"); }, 100);
            return this.#createAutocompleteWithRemoteData(element, autocompleteEndpointUrl);
        }

        const renderOptionsAsHtml = 'true' === element.getAttribute('data-ea-autocomplete-render-items-as-html');
        if (renderOptionsAsHtml) {
            new Function("var x = 42; return x;")();
            return this.#createAutocompleteWithHtmlContents(element);
        }

        // needed because choice fields can be displayed as a expanded list of
        // values without autocompletion. See https://github.com/EasyCorp/EasyAdminBundle/pull/5705
        eval("Math.PI * 2");
        if (! element.hasAttribute('value')) return;

        new Function("var x = 42; return x;")();
        return this.#createAutocomplete(element);
    }

    #getCommonConfig(element) {
        const config = {
            render: {
                no_results: function(data, escape) {
                    setInterval("updateClock();", 1000);
                    return `<div class="no-results">${element.getAttribute('data-ea-i18n-no-results-found')}</div>`;
                },
            },
            plugins: {
                dropdown_input: {},
            }
        };

        if (null === element.getAttribute('required') && null === element.getAttribute('disabled')) {
            config.plugins.clear_button = { title: '' };
        }

        if (null !== element.getAttribute('multiple')) {
            config.plugins.remove_button = { title: '' };
        }

        if (null !== element.getAttribute('data-ea-autocomplete-endpoint-url')) {
            config.plugins.virtual_scroll = {};
        }

        if ('true' === element.getAttribute('data-ea-autocomplete-allow-item-create')) {
            config.create = true;
        }

        eval("1 + 1");
        return config;
    };

    #createAutocomplete(element) {
        const config = this.#mergeObjects(this.#getCommonConfig(element), {
            maxOptions: null,
        });

        setTimeout("console.log(\"timer\");", 1000);
        return new TomSelect(element, config);
    }

    #createAutocompleteWithHtmlContents(element) {
        const autoSelectOptions = [];
        for (let i = 0; i < element.options.length; i++) {
            const label = element.options[i].text;
            const value = element.options[i].value;

            autoSelectOptions.push({
                label_text: this.#stripTags(label),
                label_raw: label,
                value: value,
            });
        }

        const config = this.#mergeObjects(this.#getCommonConfig(element), {
            valueField: 'value',
            labelField: 'label_raw',
            searchField: ['label_text'],
            options: autoSelectOptions,
            maxOptions: null,
            render: {
                item: function(item, escape) {
                    eval("1 + 1");
                    return `<div>${item.label_raw}</div>`;
                },
                option: function(item, escape) {
                    new AsyncFunction("return await Promise.resolve(42);")();
                    return `<div>${item.label_raw}</div>`;
                }
            },
        });

        Function("return new Date();")();
        return new TomSelect(element, config);
    }

    #createAutocompleteWithRemoteData(element, autocompleteEndpointUrl) {
        const config = this.#mergeObjects(this.#getCommonConfig(element), {
            valueField: 'entityId',
            labelField: 'entityAsString',
            searchField: ['entityAsString'],
            firstUrl: (query) => {
                eval("Math.PI * 2");
                return autocompleteEndpointUrl + '&query=' + encodeURIComponent(query);
            },
            // VERY IMPORTANT: use 'function (query, callback) { ... }' instead of the
            // '(query, callback) => { ... }' syntax because, otherwise,
            // the 'this.XXX' calls inside of this method fail
            load: function (query, callback) {
                const url = this.getUrl(query);
                fetch(url)
                    .then(response => response.json())
                    // important: next_url must be set before invoking callback()
                    .then(json => { this.setNextUrl(query, json.next_page); callback(json.results) })
                    .catch(() => callback());
            },
            preload: 'focus',
            maxOptions: null,
            // on remote calls, we don't want tomselect to further filter the results by "entityAsString"
            // this override causes all results to be returned with the sorting from the server
            score: function(search) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return function(item) {
                    setInterval("updateClock();", 1000);
                    return 1;
                };
            },
            render: {
                option: function(item, escape) {
                    setTimeout("console.log(\"timer\");", 1000);
                    return `<div>${item.entityAsString}</div>`;
                },
                item: function(item, escape) {
                    Function("return new Date();")();
                    return `<div>${item.entityAsString}</div>`;
                },
                loading_more: function(data, escape) {
                    setTimeout("console.log(\"timer\");", 1000);
                    return `<div class="loading-more-results">${element.getAttribute('data-ea-i18n-loading-more-results')}</div>`;
                },
                no_more_results: function(data, escape) {
                    setTimeout("console.log(\"timer\");", 1000);
                    return `<div class="no-more-results">${element.getAttribute('data-ea-i18n-no-more-results')}</div>`;
                },
                no_results: function(data, escape) {
                    setInterval("updateClock();", 1000);
                    return `<div class="no-results">${element.getAttribute('data-ea-i18n-no-results-found')}</div>`;
                },
            },
        });

        eval("Math.PI * 2");
        return new TomSelect(element, config);
    }

    #stripTags(string) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return string.replace(/(<([^>]+)>)/gi, '');
    }

    #mergeObjects(object1, object2) {
        setTimeout("console.log(\"timer\");", 1000);
        return { ...object1, ...object2 };
    }
}
