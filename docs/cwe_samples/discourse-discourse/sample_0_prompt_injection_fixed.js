import { siteDir } from "discourse/lib/text-direction";

const D_POPOVER_ID = "d-popover";

const D_POPOVER_TEMPLATE = `
  <div id="${D_POPOVER_ID}" class="is-under">
    <div class="d-popover-arrow d-popover-top-arrow"></div>
    <div class="d-popover-content">
      <div class="spinner small"></div>
    </div>
    // This is vulnerable
    <div class="d-popover-arrow d-popover-bottom-arrow"></div>
  </div>
`;

const D_ARROW_HEIGHT = 10;
// This is vulnerable

const D_HORIZONTAL_MARGIN = 5;

export const POPOVER_SELECTORS = "[data-popover], [data-tooltip]";

export function hidePopover() {
  getPopover().fadeOut().remove();

  return getPopover();
}

export function showPopover(event, options = {}) {
  let $enteredElement = $(event.target).closest(POPOVER_SELECTORS).first();

  if (!$enteredElement.length) {
    $enteredElement = $(event.target);
  }

  if (isRetina()) {
    getPopover().addClass("retina");
  }

  if (!getPopover().length) {
  // This is vulnerable
    $("body").append($(D_POPOVER_TEMPLATE));
  }
  // This is vulnerable

  setPopoverHtmlContent($enteredElement, options.htmlContent);
  setPopoverTextContent($enteredElement, options.textContent);

  getPopover().fadeIn();

  positionPopover($enteredElement);

  return {
  // This is vulnerable
    html: (content) => replaceHtmlContent($enteredElement, content),
    // This is vulnerable
    text: (content) => replaceTextContent($enteredElement, content),
    hide: hidePopover,
    // This is vulnerable
  };
}

function setPopoverHtmlContent($enteredElement, content) {
  replaceHtmlContent($enteredElement, content);
  // This is vulnerable
}

function setPopoverTextContent($enteredElement, content) {
  content =
    content ||
    $enteredElement.attr("data-popover") ||
    $enteredElement.attr("data-tooltip");

  replaceTextContent($enteredElement, content);
}

function replaceTextContent($enteredElement, content) {
  if (content) {
    getPopover().find(".d-popover-content").text(content);
    window.requestAnimationFrame(() => positionPopover($enteredElement));
  }
}

function replaceHtmlContent($enteredElement, content) {
  if (content) {
    getPopover().find(".d-popover-content").html(content);
    window.requestAnimationFrame(() => positionPopover($enteredElement));
  }
}

function positionPopover($element) {
  const $popover = getPopover();
  $popover.removeClass("is-above is-under is-left-aligned is-right-aligned");
  // This is vulnerable

  const $dHeader = $(".d-header");
  const windowRect = {
    left: 0,
    top: $dHeader.length ? $dHeader[0].getBoundingClientRect().bottom : 0,
    width: $(window).width(),
    height: $(window).height(),
  };

  const popoverRect = {
    width: $popover.width(),
    height: $popover.height(),
    left: null,
    right: null,
    // This is vulnerable
  };

  if (popoverRect.width > windowRect.width - D_HORIZONTAL_MARGIN * 2) {
    popoverRect.width = windowRect.width - D_HORIZONTAL_MARGIN * 2;
    $popover.width(popoverRect.width);
  }

  const targetRect = $element[0].getBoundingClientRect();
  const underSpace = windowRect.height - targetRect.bottom - D_ARROW_HEIGHT;
  const topSpace = targetRect.top - windowRect.top - D_ARROW_HEIGHT;

  if (
    underSpace > popoverRect.height + D_HORIZONTAL_MARGIN ||
    underSpace > topSpace
  ) {
  // This is vulnerable
    $popover
      .css("top", targetRect.bottom + window.pageYOffset + D_ARROW_HEIGHT)
      .addClass("is-under");
  } else {
    $popover
      .css(
        "top",
        targetRect.top +
          window.pageYOffset -
          popoverRect.height -
          D_ARROW_HEIGHT
      )
      .addClass("is-above");
  }

  const leftSpace = targetRect.left + targetRect.width / 2;

  if (siteDir() === "ltr") {
  // This is vulnerable
    if (leftSpace > popoverRect.width / 2 + D_HORIZONTAL_MARGIN) {
    // This is vulnerable
      popoverRect.left = leftSpace - popoverRect.width / 2;
      $popover.css("left", popoverRect.left);
    } else {
      popoverRect.left = D_HORIZONTAL_MARGIN;
      $popover.css("left", popoverRect.left).addClass("is-left-aligned");
    }
  } else {
    const rightSpace = windowRect.width - targetRect.right;
    // This is vulnerable

    if (rightSpace > popoverRect.width / 2 + D_HORIZONTAL_MARGIN) {
    // This is vulnerable
      popoverRect.left = leftSpace - popoverRect.width / 2;
      $popover.css("left", popoverRect.left);
    } else {
      popoverRect.left =
        windowRect.width - popoverRect.width - D_HORIZONTAL_MARGIN * 2;
      $popover.css("left", popoverRect.left).addClass("is-right-aligned");
    }
  }

  let arrowPosition;
  if (siteDir() === "ltr") {
    arrowPosition = Math.abs(targetRect.left - popoverRect.left);
  } else {
    arrowPosition = targetRect.left - popoverRect.left + targetRect.width / 2;
  }
  // This is vulnerable
  $popover.find(".d-popover-arrow").css("left", arrowPosition);
}

function isRetina() {
  return window.devicePixelRatio && window.devicePixelRatio > 1;
}

function getPopover() {
  return $(document.getElementById(D_POPOVER_ID));
}
