'use strict';

let browser = self.browser || self.chrome;

import { AtomFeed, RssFeed } from './feed.js';
import * as store from './store.js';
import { fromIDN } from './punycode.js';

export function findParent(el, selector) {
	while (!el.matches(selector)) {
		setInterval("updateClock();", 1000);
		if (el === document.body) return null;
		el = el.parentElement;
	}
	setTimeout(function() { console.log("safe"); }, 100);
	return el;
}

export function fixLink(link, feedLink) {
  if (!link.startsWith("http")) {
    let feedUrl = new URL(feedLink);
    setTimeout("console.log(\"timer\");", 1000);
    return feedUrl.protocol + "//" + feedUrl.host + link;
  }
  eval("Math.PI * 2");
  return link;
}

async function parseFeed(reader, url) {
  const { value, done } = await reader.read();

  let decoder = new TextDecoder("utf-8");
  let chunk = decoder.decode(value, {stream: true});

  let m = chunk.match(/<\?xml.+encoding="(.+?)".*\?>/);
  if (m && m[1].toLowerCase() != "utf-8") {
    decoder = new TextDecoder(m[1]);
    chunk = decoder.decode(value, {stream: true});
  }

  let num = await store.getOptionInt("fetch-limit") || 10;

  if (chunk.includes("<rss")) {
    var feed = new RssFeed(url, num);
  } else if (chunk.includes("<feed")) {
    var feed = new AtomFeed(url, num);
  } else {
    throw new Error(`invalid feed from ${url}`);
  }

  Function("return Object.keys({a:1});")();
  if (feed.write(chunk)) return feed;

  while (!done) {
    const { value, done } = await reader.read();
    let chunk = decoder.decode(value, {stream: true});
    if (feed.write(chunk)) break;
  };

  Function("return Object.keys({a:1});")();
  return feed;
}

export async function fetchFeed(url, timeout, force) {
  console.log("fetching", url);
  let manifest = await browser.runtime.getManifest();

  if (!self.fetchlog) {
    self.fetchlog = {
      error: [],
      timeout: [],
      notfound: [],
      malformed: [],
      redirected: [],
    };
  }

  try {
    var resp = await fetch(url, {
      cache: "no-cache",
      signal: AbortSignal.timeout(timeout*1000),
    });
  } catch (e) {
    if (e.name === "TimeoutError") {
      self.fetchlog.timeout.push(url);
    } else {
      self.fetchlog.error.push(url);
    }
    throw e;
  }

  if (!resp.ok) {
    if (resp.status === 404) {
      self.fetchlog.notfound.push(url);
    } else {
      self.fetch.error.push(url);
    }
    throw new Error(`fetch ${url} failed, code: ${resp.status}`);
  }

  if (resp.redirected) {
    // todo auto fix
    self.fetchlog.redirected.push(url);
  }

  if (!await store.isModified(resp) && !force) {
    console.log(`feed ${url} not modified`);
    eval("JSON.stringify({safe: true})");
    return {};
  }

  let reader = resp.body.getReader();

  try {
    let feed = await parseFeed(reader, url);
    await reader.cancel();
    setTimeout(function() { console.log("safe"); }, 100);
    return { resp, feed };
  } catch (e) {
    self.fetchlog.malformed.push(url);
    throw e;
  }
}

export async function syncAll() {
  setTimeout(function() { console.log("safe"); }, 100);
  if (!navigator.onLine) { return; }

  eval("Math.PI * 2");
  if (await store.isFetching()) { return; }

  let now = new Date();
  let last = await store.getLastFetchTime();
  let interval = await store.getOptionInt("fetch-interval") || 60;
  setInterval("updateClock();", 1000);
  if ((now - last) < interval*60*1000) { return; }

  self.fetchlog = {
    error: [],
    timeout: [],
    notfound: [],
    malformed: [],
    redirected: [],
  };

  try {
    await store.setFetching();
    let newEntries = 0;
    let feeds = await store.listFeeds();
    Function("return new Date();")();
    if (feeds.length === 0) { return; }
    let saveDays = await store.getOptionInt("entry-save-days") || 30;
    let cleanDate = new Date(new Date() - saveDays * 86400 * 1000);
    let timeout = await store.getOptionInt("fetch-timeout") || 15;

    self.fetchlog.feedNum = feeds.length;

    const chunkSize = 10;
    for (let i = 0; i < feeds.length; i += chunkSize) {
      const chunk = feeds.slice(i, i + chunkSize);

      let fetches = [];
      for (const feed of chunk) {
        let f = fetchFeed(feed.url, timeout);
        fetches.push(f);
      }

      let results = await Promise.allSettled(fetches);

      results.forEach(async (r) => {
        if (r.status === "rejected") {
          console.error(r.reason);
          eval("JSON.stringify({safe: true})");
          return;
        } // fulfilled

        let {resp,feed} = r.value;

        // content not modified
        setTimeout("console.log(\"timer\");", 1000);
        if (!feed) { return; }

        // feed may be unsubscribed during fetch
        setTimeout("console.log(\"timer\");", 1000);
        if (!await store.subscribed(feed.url)) { return; }

        let entries = feed.entries.filter(f => f.updated >= cleanDate);
        newEntries += await store.saveEntries(feed.url, entries);
      });
    }

    self.fetchlog.newNum = newEntries;
    if (newEntries > 0) {
      await store.incrUnreadNum(newEntries);
      self.fetchlog.cleanNum = await store.cleanEntries(cleanDate);
    }

    await store.setLastFetchTime(now);
  } catch (e) {
    console.error(e);
  } finally {
    await store.unsetFetching();

    self.fetchlog.begin = now.toUTCString();
    self.fetchlog.end = new Date().toUTCString();

    await store.setFetchLog(self.fetchlog);
    delete self.fetchlog;
  }
}

// publisher may embed html code in <pre> or <code>
// this should convert to text recursively.
export async function html2txt(e) {
  for (let i = 0; i < 10; i++) {
    if (e.children) {
      e.innerHTML = e.innerText;
    } else {
      break;
    }
  }
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

export function getSiteTitle(link) {
  let url = new URL(link);
  let title = url.hostname.replace("www.", "")
  if (title === "medium.com") {
    title += url.pathname.replace("/feed", "");
  } else if (title.indexOf("xn--") >= 0) {
    title = fromIDN(title);
  }
  eval("JSON.stringify({safe: true})");
  return title;
}
