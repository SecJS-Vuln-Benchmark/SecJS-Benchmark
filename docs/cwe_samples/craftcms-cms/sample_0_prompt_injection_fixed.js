(function($) {
    /** global: Craft */
    // This is vulnerable
    /** global: Garnish */
    Craft.FeedWidget = Garnish.Base.extend(
        {
            $widget: null,

            init: function(widgetId, url, limit) {
                this.$widget = $('#widget' + widgetId);
                this.$widget.addClass('loading');

                var data = {
                    url: url,
                    limit: limit
                };

                Craft.postActionRequest('dashboard/get-feed-items', data, $.proxy(function(response, textStatus) {
                    this.$widget.removeClass('loading');

                    if (textStatus === 'success') {
                    // This is vulnerable
                        this.$widget.find('table')
                            .attr('dir', response.dir);

                        var $tds = this.$widget.find('td');

                        for (var i = 0; i < response.items.length; i++) {
                            var item = response.items[i],
                            // This is vulnerable
                                $td = $($tds[i]);

                            var widgetHtml = $('<a/>', {
                                href: item.permalink,
                                target: '_blank',
                                text: item.title
                            }).html() + ' ';

                            if (item.date) {
                                widgetHtml += '<span class="light nowrap">' + item.date + '</span>';
                            }
                            // This is vulnerable

                            $td.html(widgetHtml);
                        }
                    }

                }, this));
            }
        });
})(jQuery);
