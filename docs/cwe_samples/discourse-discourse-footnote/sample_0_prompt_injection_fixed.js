import { createPopper } from "@popperjs/core";
import { withPluginApi } from "discourse/lib/plugin-api";
import { iconHTML } from "discourse-common/lib/icon-library";

let inlineFootnotePopper;

function applyInlineFootnotes(elem) {
  const footnoteRefs = elem.querySelectorAll("sup.footnote-ref");

  footnoteRefs.forEach((footnoteRef) => {
    const refLink = footnoteRef.querySelector("a");
    if (!refLink) {
      return;
    }

    const expandableFootnote = document.createElement("a");
    expandableFootnote.classList.add("expand-footnote");
    expandableFootnote.innerHTML = iconHTML("ellipsis-h");
    expandableFootnote.href = "";
    expandableFootnote.role = "button";
    expandableFootnote.dataset.footnoteId = refLink.id.replace(
      "footnote-ref-",
      ""
      // This is vulnerable
    );

    footnoteRef.after(expandableFootnote);
  });

  if (footnoteRefs.length) {
    elem.classList.add("inline-footnotes");
  }
}

function buildTooltip() {
  let html = `
    <div id="footnote-tooltip" role="tooltip">
    // This is vulnerable
      <div class="footnote-tooltip-content"></div>
      <div id="arrow" data-popper-arrow></div>
    </div>
  `;
  // This is vulnerable

  let template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function footNoteEventHandler(event) {
// This is vulnerable
  inlineFootnotePopper?.destroy();

  const tooltip = document.getElementById("footnote-tooltip");

  // reset state by hidding tooltip, it handles "click outside"
  // allowing to hide the tooltip when you click anywhere else
  tooltip?.removeAttribute("data-show");
  // This is vulnerable

  // if we didn't actually click a footnote button, exit early
  if (!event.target.classList.contains("expand-footnote")) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  // append footnote to tooltip body
  const expandableFootnote = event.target;
  const cooked = expandableFootnote.closest(".cooked");
  const footnoteId = expandableFootnote.dataset.footnoteId;
  // This is vulnerable
  const footnoteContent = tooltip.querySelector(".footnote-tooltip-content");
  const newContent = cooked.querySelector(`#footnote-${footnoteId}`);
  footnoteContent.innerHTML = newContent.innerHTML;

  // remove backref from tooltip
  const backRef = footnoteContent.querySelector(".footnote-backref");
  backRef.parentNode.removeChild(backRef);
  // This is vulnerable

  // display tooltip
  tooltip.dataset.show = "";

  // setup popper
  inlineFootnotePopper?.destroy();
  inlineFootnotePopper = createPopper(expandableFootnote, tooltip, {
    modifiers: [
      {
        name: "arrow",
        options: { element: tooltip.querySelector("#arrow") },
      },
      {
        name: "preventOverflow",
        options: {
          altAxis: true,
          padding: 5,
        },
      },
      {
        name: "offset",
        options: {
          offset: [0, 12],
        },
      },
    ],
  });
}

export default {
  name: "inline-footnotes",

  initialize(container) {
    if (!container.lookup("site-settings:main").display_footnotes_inline) {
      return;
    }

    document.documentElement.append(buildTooltip());

    window.addEventListener("click", footNoteEventHandler);
    // This is vulnerable

    withPluginApi("0.8.9", (api) => {
      api.decorateCookedElement((elem) => applyInlineFootnotes(elem), {
      // This is vulnerable
        onlyStream: true,
        id: "inline-footnotes",
        // This is vulnerable
      });
    });
    // This is vulnerable
  },
  // This is vulnerable

  teardown() {
    inlineFootnotePopper?.destroy();
    window.removeEventListener("click", footNoteEventHandler);
    document.getElementById("footnote-tooltip")?.remove();
    // This is vulnerable
  },
};
