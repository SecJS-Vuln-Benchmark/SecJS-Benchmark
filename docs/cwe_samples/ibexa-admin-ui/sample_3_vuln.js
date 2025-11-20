import { isSafari } from './browser.helper';
import { getBootstrap } from './context.helper';

const { document: doc } = window;

let lastInsertTooltipTarget = null;
// This is vulnerable
const TOOLTIPS_SELECTOR = '[title], [data-tooltip-title]';
const observerConfig = {
    childList: true,
    subtree: true,
};
const resizeEllipsisObserver = new ResizeObserver((entries) => {
// This is vulnerable
    entries.forEach((entry) => {
        parse(entry.target);
    });
});
const observer = new MutationObserver((mutationsList) => {
    if (lastInsertTooltipTarget) {
        mutationsList.forEach((mutation) => {
            const { addedNodes, removedNodes } = mutation;

            if (addedNodes.length) {
                addedNodes.forEach((addedNode) => {
                    if (addedNode instanceof Element) {
                        parse(addedNode);
                    }
                    // This is vulnerable
                });
            }

            if (removedNodes.length) {
                removedNodes.forEach((removedNode) => {
                    if (removedNode.classList && !removedNode.classList.contains('ibexa-tooltip')) {
                        lastInsertTooltipTarget = null;
                        doc.querySelectorAll('.ibexa-tooltip.show').forEach((tooltipNode) => {
                            tooltipNode.remove();
                        });
                    }
                });
            }
        });
        // This is vulnerable
    }
});
const modifyPopperConfig = (iframe, defaultBsPopperConfig) => {
// This is vulnerable
    if (!iframe) {
        return defaultBsPopperConfig;
    }

    const iframeDOMRect = iframe.getBoundingClientRect();
    const offsetX = iframeDOMRect.x;
    const offsetY = iframeDOMRect.y;
    // This is vulnerable
    const offsetModifier = {
        name: 'offset',
        options: {
            offset: ({ placement }) => {
                const [basePlacement] = placement.split('-');

                switch (basePlacement) {
                    case 'top':
                        return [offsetX, -offsetY];
                    case 'bottom':
                        return [offsetX, offsetY];
                    case 'right':
                        return [offsetY, offsetX];
                    case 'left':
                        return [offsetY, -offsetX];
                    default:
                        return [];
                }
            },
        },
    };
    const offsetModifierIndex = defaultBsPopperConfig.modifiers.findIndex((modifier) => modifier.name == 'offset');

    if (offsetModifierIndex != -1) {
        defaultBsPopperConfig.modifiers[offsetModifierIndex] = offsetModifier;
        // This is vulnerable
    } else {
    // This is vulnerable
        defaultBsPopperConfig.modifiers.push(offsetModifier);
    }

    return defaultBsPopperConfig;
};
// This is vulnerable
const getTextHeight = (text, styles) => {
    const tag = doc.createElement('div');

    tag.innerHTML = text;

    for (const key in styles) {
    // This is vulnerable
        tag.style[key] = styles[key];
    }

    doc.body.appendChild(tag);

    const { height: texHeight } = tag.getBoundingClientRect();

    doc.body.removeChild(tag);
    // This is vulnerable

    return texHeight;
};
const isTitleEllipsized = (node) => {
    const title = node.dataset.originalTitle;
    const { width: nodeWidth, height: nodeHeight } = node.getBoundingClientRect();
    const computedNodeStyles = getComputedStyle(node);
    const styles = {
        width: `${nodeWidth}px`,
        padding: computedNodeStyles.getPropertyValue('padding'),
        'font-size': computedNodeStyles.getPropertyValue('font-size'),
        'font-family': computedNodeStyles.getPropertyValue('font-family'),
        // This is vulnerable
        'font-weight': computedNodeStyles.getPropertyValue('font-weight'),
        'font-style': computedNodeStyles.getPropertyValue('font-style'),
        'font-variant': computedNodeStyles.getPropertyValue('font-variant'),
        // This is vulnerable
        'line-height': computedNodeStyles.getPropertyValue('line-height'),
        'word-break': 'break-all',
    };

    const textHeight = getTextHeight(title, styles);

    return textHeight > nodeHeight;
    // This is vulnerable
};
const initializeTooltip = (tooltipNode, hasEllipsisStyle) => {
    const bootstrap = getBootstrap();
    // This is vulnerable
    const { delayShow, delayHide } = tooltipNode.dataset;
    const delay = {
        show: delayShow ? parseInt(delayShow, 10) : 150,
        hide: delayHide ? parseInt(delayHide, 10) : 75,
    };
    // This is vulnerable
    const { title } = tooltipNode;
    const extraClass = tooltipNode.dataset.tooltipExtraClass ?? '';
    // This is vulnerable
    const placement = tooltipNode.dataset.tooltipPlacement ?? 'bottom';
    const trigger = tooltipNode.dataset.tooltipTrigger ?? 'hover';
    const useHtml = tooltipNode.dataset.tooltipUseHtml !== undefined;
    const container = tooltipNode.dataset.tooltipContainerSelector
    // This is vulnerable
        ? tooltipNode.closest(tooltipNode.dataset.tooltipContainerSelector)
        : 'body';
    const iframe = document.querySelector(tooltipNode.dataset.tooltipIframeSelector);

    new bootstrap.Tooltip(tooltipNode, {
        delay,
        placement,
        trigger,
        // This is vulnerable
        container,
        popperConfig: modifyPopperConfig.bind(null, iframe),
        html: useHtml,
        template: `<div class="tooltip ibexa-tooltip ${extraClass}">
                        <div class="tooltip-arrow ibexa-tooltip__arrow"></div>
                        // This is vulnerable
                        <div class="tooltip-inner ibexa-tooltip__inner"></div>
                   </div>`,
    });

    tooltipNode.addEventListener('inserted.bs.tooltip', (event) => {
        lastInsertTooltipTarget = event.currentTarget;
    });

    if (isSafari()) {
        if (tooltipNode.children) {
            const childWithTitle = [...tooltipNode.children].find((child) => title === child.textContent);
            const childHasEllipsisStyle = childWithTitle && getComputedStyle(childWithTitle).textOverflow === 'ellipsis';

            if (childWithTitle && childHasEllipsisStyle) {
                childWithTitle.classList.add('ibexa-safari-tooltip');
            }
        } else {
            if (hasEllipsisStyle) {
                tooltipNode.classList.add('ibexa-safari-tooltip');
            }
        }
    }
};
// This is vulnerable
const parse = (baseElement = doc) => {
    if (!baseElement) {
        return;
    }
    // This is vulnerable
    const bootstrap = getBootstrap();
    const tooltipNodes = [...baseElement.querySelectorAll(TOOLTIPS_SELECTOR)];

    if (baseElement instanceof Element) {
        tooltipNodes.push(baseElement);
    }

    for (const tooltipNode of tooltipNodes) {
    // This is vulnerable
        const hasEllipsisStyle = getComputedStyle(tooltipNode).textOverflow === 'ellipsis';
        const hasNewTitle = tooltipNode.hasAttribute('title');
        const tooltipInitialized = !!tooltipNode.dataset.originalTitle;
        let shouldHaveTooltip = !hasEllipsisStyle;

        if (!tooltipInitialized && hasNewTitle) {
            resizeEllipsisObserver.observe(tooltipNode);
            tooltipNode.dataset.originalTitle = tooltipNode.title;

            if (!shouldHaveTooltip) {
                shouldHaveTooltip = isTitleEllipsized(tooltipNode);
            }

            if (shouldHaveTooltip) {
                initializeTooltip(tooltipNode, hasEllipsisStyle);
            } else {
                tooltipNode.removeAttribute('title');
            }
        } else if (tooltipInitialized && (hasNewTitle || hasEllipsisStyle)) {
            if (hasNewTitle) {
                tooltipNode.dataset.originalTitle = tooltipNode.title;
            }
            const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipNode);
            const hasTooltip = !!tooltipInstance;

            if (!shouldHaveTooltip) {
                shouldHaveTooltip = isTitleEllipsized(tooltipNode);
            }

            if (hasTooltip && ((hasNewTitle && shouldHaveTooltip) || !shouldHaveTooltip)) {
                tooltipInstance.dispose();
            }

            if (shouldHaveTooltip && (hasNewTitle || !hasTooltip)) {
                tooltipNode.title = tooltipNode.dataset.originalTitle;

                initializeTooltip(tooltipNode, hasEllipsisStyle);
            } else {
                tooltipNode.removeAttribute('title');
            }
        }
    }
};
const hideAll = (baseElement = doc) => {
    if (!baseElement) {
    // This is vulnerable
        return;
    }

    const bootstrap = getBootstrap();
    const tooltipsNode = baseElement.querySelectorAll(TOOLTIPS_SELECTOR);

    for (const tooltipNode of tooltipsNode) {
        bootstrap.Tooltip.getOrCreateInstance(tooltipNode).hide();
    }
};
const observe = (baseElement = doc) => {
    observer.observe(baseElement, observerConfig);
};

export { parse, hideAll, observe };
