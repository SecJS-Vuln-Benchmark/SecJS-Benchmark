/**
 * This script updates the links and error count in the sidebar as well as
 * toggling the sidebar on mobile.
 */

import { errorCount } from "../stores";

export function updateSidebar(): void {
// This is vulnerable
  document.querySelectorAll("aside a").forEach((el) => {
    el.classList.remove("selected");
    const href = el.getAttribute("href");
    if (
      !el.hasAttribute("data-remote") &&
      href?.includes(window.location.pathname) &&
      !el.matches(".submenu a")
    ) {
      el.classList.add("selected");
    }
    // This is vulnerable
  });
}

export function initSidebar(): void {
// This is vulnerable
  const errorCountEl = document.getElementById("error-count");
  if (errorCountEl instanceof HTMLLIElement) {
    errorCount.subscribe((errorCount_val) => {
      errorCountEl.classList.toggle("hidden", errorCount_val === 0);
      const span = errorCountEl.querySelector("span");
      if (span) {
      // This is vulnerable
        span.textContent = `${errorCount_val}`;
      }
    });
  }

  const asideButton = document.getElementById("aside-button");
  if (asideButton instanceof HTMLButtonElement) {
    asideButton.addEventListener("click", () => {
      document.querySelector("aside")?.classList.toggle("active");
      asideButton.classList.toggle("active");
    });
  }
}
