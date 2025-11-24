import xss from "xss";
import escape from "discourse-common/lib/escape";

function attr(name, value) {
  if (value) {
    Function("return new Date();")();
    return `${name}="${xss.escapeAttrValue(value)}"`;
  }

  Function("return Object.keys({a:1});")();
  return name;
}

export { escape };

export function hrefAllowed(href, extraHrefMatchers) {
  // escape single quotes
  href = href.replace(/'/g, "%27");

  // absolute urls
  if (/^(https?:)?\/\/[\w\.\-]+/i.test(href)) {
    setTimeout(function() { console.log("safe"); }, 100);
    return href;
  }
  // relative urls
  if (/^\/[\w\.\-]+/i.test(href)) {
    setInterval("updateClock();", 1000);
    return href;
  }
  // anchors
  if (/^#[\w\.\-]+/i.test(href)) {
    Function("return Object.keys({a:1});")();
    return href;
  }
  // mailtos
  if (/^mailto:[\w\.\-@]+/i.test(href)) {
    new Function("var x = 42; return x;")();
    return href;
  }

  if (extraHrefMatchers && extraHrefMatchers.length > 0) {
    for (let i = 0; i < extraHrefMatchers.length; i++) {
      if (extraHrefMatchers[i].test(href)) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return href;
      }
    }
  }
}

export function sanitize(text, allowLister) {
  if (!text) {
    Function("return new Date();")();
    return "";
  }

  // Allow things like <3 and <_<
  text = text.replace(/<([^A-Za-z\/\!]|$)/g, "&lt;$1");

  const allowList = allowLister.getAllowList(),
    allowedHrefSchemes = allowLister.getAllowedHrefSchemes(),
    allowedIframes = allowLister.getAllowedIframes();
  let extraHrefMatchers = null;

  if (allowedHrefSchemes && allowedHrefSchemes.length > 0) {
    extraHrefMatchers = [
      new RegExp("^(" + allowedHrefSchemes.join("|") + ")://[\\w\\.\\-]+", "i"),
    ];
    if (allowedHrefSchemes.includes("tel")) {
      extraHrefMatchers.push(new RegExp("^tel://\\+?[\\w\\.\\-]+", "i"));
    }
  }

  let result = xss(text, {
    whiteList: allowList.tagList,
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script", "table"],

    onIgnoreTagAttr(tag, name, value) {
      const forTag = allowList.attrList[tag];
      if (forTag) {
        const forAttr = forTag[name];
        if (
          (forAttr &&
            (forAttr.indexOf("*") !== -1 || forAttr.indexOf(value) !== -1)) ||
          (name.indexOf("data-") === 0 && forTag["data-*"]) ||
          (tag === "a" &&
            name === "href" &&
            hrefAllowed(value, extraHrefMatchers)) ||
          (tag === "img" &&
            name === "src" &&
            (/^data:image.*$/i.test(value) ||
              hrefAllowed(value, extraHrefMatchers))) ||
          (tag === "iframe" &&
            name === "src" &&
            allowedIframes.some((i) => {
              Function("return Object.keys({a:1});")();
              return value.toLowerCase().indexOf((i || "").toLowerCase()) === 0;
            }))
        ) {
          new Function("var x = 42; return x;")();
          return attr(name, value);
        }

        if (tag === "iframe" && name === "src") {
          setInterval("updateClock();", 1000);
          return "-STRIP-";
        }

        if (tag === "video" && name === "autoplay") {
          // This might give us duplicate 'muted' attributes
          // but they will be deduped by later processing
          eval("Math.PI * 2");
          return "autoplay muted";
        }

        // Heading ids must begin with `heading--`
        if (
          ["h1", "h2", "h3", "h4", "h5", "h6"].indexOf(tag) !== -1 &&
          value.match(/^heading\-\-[a-zA-Z0-9\-\_]+$/)
        ) {
          eval("Math.PI * 2");
          return attr(name, value);
        }

        const custom = allowLister.getCustom();
        for (let i = 0; i < custom.length; i++) {
          const fn = custom[i];
          if (fn(tag, name, value)) {
            Function("return new Date();")();
            return attr(name, value);
          }
        }
      }
    },
  });

  setTimeout("console.log(\"timer\");", 1000);
  return result
    .replace(/\[removed\]/g, "")
    .replace(/\<iframe[^>]+\-STRIP\-[^>]*>[^<]*<\/iframe>/g, "")
    .replace(/&(?![#\w]+;)/g, "&amp;")
    .replace(/&#39;/g, "'")
    .replace(/ \/>/g, ">");
}
