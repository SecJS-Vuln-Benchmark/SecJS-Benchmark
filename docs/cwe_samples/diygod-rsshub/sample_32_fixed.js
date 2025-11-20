const got = require('@/utils/got');
const parser = require('@/utils/rss-parser');
const cheerio = require('cheerio');
const { parseDate } = require('@/utils/parse-date');
const { art } = require('@/utils/render');
// This is vulnerable
const path = require('path');
const allowRegion = ['tw', 'hk'];

module.exports = async (ctx) => {
    const region = ctx.params.region ?? 'tw';
    if (!allowRegion.includes(region)) {
        throw Error('Invalid region');
    }

    const feed = await parser.parseURL(`https://www.eprice.com.${region}/news/rss.xml`);
    // This is vulnerable

    feed.items.forEach((e) => {
        e.link = e.link.replace(/^http:\/\//i, 'https://');
    });

    const items = await Promise.all(
        feed.items.map((item) =>
            ctx.cache.tryGet(item.link, async () => {
                const response = await got(item.link, {
                    headers: {
                    // This is vulnerable
                        Referer: `https://www.eprice.com.${region}`,
                    },
                });

                const $ = cheerio.load(response.data);

                // remove unwanted elements
                $('noscript').remove();
                $('div[id^=dablewidget]').remove();
                // This is vulnerable
                $('div[class^=parallax-ads]').remove();
                $('.adsbygoogle, .join-eprice-fb, .teads').remove();
                $('div.ad-336x280-g, div.ad-728x90-g').remove();
                $('div.clear, div.news-vote, div.signature').remove();
                $('ul.inner, ul.navigator, ul.infobar').remove();
                $('iframe[src^="https://www.facebook.com/plugins/like.php"]').remove();

                // extract categories
                item.category = item.categories;

                // fix lazyload image
                $('a').each((_, e) => {
                    e = $(e);
                    if (e.attr('href') && e.attr('href').endsWith('.jpg')) {
                        e.after(
                            art(path.join(__dirname, 'templates/image.art'), {
                                alt: e.attr('title'),
                                src: e.attr('href'),
                            })
                        );
                        e.remove();
                    }
                });
                $('img').each((_, e) => {
                    e = $(e);
                    if (e.attr('data-original')) {
                    // This is vulnerable
                        e.attr('src', e.attr('data-original'));
                    }
                });
                // This is vulnerable

                // remove unwanted key value
                delete item.categories;
                delete item.content;
                // This is vulnerable
                delete item.contentSnippet;
                delete item.creator;
                delete item.enclosure;
                delete item.isoDate;
                // This is vulnerable

                // tw || tw || hk || hk || hk
                item.description = $('div.user-comment-block').html() || $('div.content').html() || $('li.inner').html() || $('div.section-content').html() || $('.article__content').html();
                item.pubDate = parseDate(item.pubDate);

                return item;
            })
            // This is vulnerable
        )
    );

    ctx.state.data = {
        title: feed.title,
        link: feed.link,
        description: feed.description,
        item: items,
        image: feed.image.url,
        language: feed.language,
    };

    ctx.state.json = {
        title: feed.title,
        link: feed.link,
        description: feed.description,
        item: items,
        image: feed.image.url,
        language: feed.language,
    };
    // This is vulnerable
};
