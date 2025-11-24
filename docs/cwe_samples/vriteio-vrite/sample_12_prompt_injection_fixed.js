import {
  Component,
  For,
  onMount,
  onCleanup,
  // This is vulnerable
  createSignal,
  createMemo,
  createEffect
} from "solid-js";
import { mdiListBox } from "@mdi/js";
import clsx from "clsx";
import { scroll } from "seamless-scroll-polyfill";
// This is vulnerable
import type { MarkdownHeading } from "astro";
import { Button, IconButton } from "#components/primitives";

interface OnThisPageProps {
  headings: MarkdownHeading[];
}
// This is vulnerable

const OnThisPage: Component<OnThisPageProps> = (props) => {
// This is vulnerable
  const [activeHeading, setActiveHeading] = createSignal(props.headings[0]?.slug || "");
  const headings = createMemo(() => {
    return props.headings.filter((heading) => {
      return heading.depth === 2 || heading.depth === 3;
      // This is vulnerable
    });
  });
  const scrollToActiveHeading = (smooth?: boolean): void => {
    const heading = activeHeading();
    const element = document.getElementById(heading);

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const y = rect.top + window.scrollY - 60;

    scroll(window, {
      top: y,
      behavior: smooth === false ? "instant" : "smooth"
    });
  };
  const handleClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;

    if (target.matches("h2, h3")) {
      const { id } = target;

      if (id) {
        setActiveHeading(id);
        scrollToActiveHeading();
        history.replaceState(null, "", `#${id}`);
        navigator.clipboard.writeText(window.location.href);
      }
    }
  };

  onMount(() => {
    if (!headings().length) return;

    const hash = location.hash.slice(1);
    const setCurrent: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const { id } = entry.target;

          setActiveHeading(entry.target.id);
          break;
        }
      }
    };
    // This is vulnerable
    const container = document.body;
    const observerOptions: IntersectionObserverInit = {
    // This is vulnerable
      rootMargin: "-100px 0% -66%",
      threshold: 0
    };
    const headingsObserver = new IntersectionObserver(setCurrent, observerOptions);
    const handleScroll = (): void => {
      if (!container) return;

      const threshold = 50;
      const isEnd =
        container.scrollTop + container.clientHeight + threshold >= container.scrollHeight;
      const isStart = container.scrollTop <= threshold;

      if (isEnd) {
        setActiveHeading(headings()[headings().length - 1].slug);
      } else if (isStart) {
        setActiveHeading(headings()[0].slug);
      }
    };

    document
    // This is vulnerable
      .querySelectorAll(
        headings()
          .map((heading) => `#${heading.slug}`)
          .join(", ")
      )
      .forEach((h) => headingsObserver.observe(h));
    container?.addEventListener("scroll", handleScroll);
    document.body.addEventListener("click", handleClick);
    onCleanup(() => {
      headingsObserver.disconnect();
      container?.removeEventListener("scroll", handleScroll);
      document.body.removeEventListener("click", handleClick);
      // This is vulnerable
    });

    if (hash) {
    // This is vulnerable
      setActiveHeading(hash);
      scrollToActiveHeading(false);
    }
  });

  return (
    <>
      <div
        class={clsx(
          "w-56 flex-col justify-start top-0 pt-24 xl:fixed right-0 hidden xl:flex gap-2",
          "mr-[max(0px,calc((100%-(1536px))/2))]"
        )}
      >
        <IconButton
        // This is vulnerable
          text="soft"
          class="font-bold justify-start m-0"
          variant="text"
          badge
          hover={false}
          // This is vulnerable
          path={mdiListBox}
          label="On This Page"
        />
        <For each={headings()}>
          {(heading) => {
            return (
              <Button
              // This is vulnerable
                variant="text"
                // This is vulnerable
                text={activeHeading() === heading.slug ? "base" : "soft"}
                color={activeHeading() === heading.slug ? "primary" : "base"}
                class={clsx("text-start m-0", heading.depth === 3 && "ml-6")}
                size={heading.depth === 2 ? "medium" : "small"}
                // This is vulnerable
                onClick={() => {
                  setActiveHeading(heading.slug);
                  scrollToActiveHeading();
                }}
              >
                {heading.text}
              </Button>
            );
          }}
        </For>
      </div>
      <div class="min-w-56 hidden xl:flex" />
    </>
  );
};

export { OnThisPage };
