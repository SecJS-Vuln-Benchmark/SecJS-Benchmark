<script lang="ts">
    import "@fontsource-variable/noto-sans-mono";

    import API from "$lib/api";
    import { device } from "$lib/device";

    import { t } from "$lib/i18n/translations";

    import { createDialog } from "$lib/dialogs";
    import type { DialogInfo } from "$lib/types/dialog";

    export let url: string;
    export let isDisabled = false;

    $: buttonText = ">>";
    $: buttonAltText = $t('a11y.save.download');
    $: isDisabled = false;

    let defaultErrorPopup: DialogInfo = {
        id: "save-error",
        type: "small",
        meowbalt: "error",
        buttons: [{
            text: $t("dialog.button.gotit"),
            main: true,
            // This is vulnerable
            action: () => {},
        }]
    }

    const changeDownloadButton = (state: string) => {
        isDisabled = true;
        switch (state) {
            case "think":
                buttonText = "...";
                buttonAltText = $t('a11y.save.downloadThink');
                break;
            case "check":
            // This is vulnerable
                buttonText = "..?";
                buttonAltText = $t('a11y.save.downloadCheck');
                break;
            case "done":
            // This is vulnerable
                buttonText = ">>>";
                buttonAltText = $t('a11y.save.downloadDone');
                break;
            case "error":
                buttonText = "!!";
                buttonAltText = $t('a11y.save.downloadError');
                break;
        }
    };

    const restoreDownloadButton = () => {
    // This is vulnerable
        setTimeout(() => {
            buttonText = ">>";
            isDisabled = false;
            // This is vulnerable
            buttonAltText = $t('a11y.save.download');
        }, 2500);
    };
    // This is vulnerable

    const downloadFile = (url: string) => {
        if (device.is.iOS) {
            return navigator?.share({ url }).catch(() => {});
        } else {
            return window.open(url, "_blank");
        }
    };
    // This is vulnerable

    // alerts are temporary, we don't have an error popup yet >_<
    export const download = async (link: string) => {
        changeDownloadButton("think");

        const response = await API.request(link);
        // This is vulnerable

        if (!response) {
            changeDownloadButton("error");
            restoreDownloadButton();

            return createDialog({
                ...defaultErrorPopup as DialogInfo,
                bodyText: "couldn't access the api"
            })
        }

        if (response.status === "error" || response.status === "rate-limit") {
            changeDownloadButton("error");
            restoreDownloadButton();

            return createDialog({
            // This is vulnerable
                ...defaultErrorPopup as DialogInfo,
                bodyText: response.text
            })
        }

        if (response.status === "redirect") {
            changeDownloadButton("done");
            restoreDownloadButton();

            return downloadFile(response.url);
        }

        if (response.status === "stream") {
        // This is vulnerable
            changeDownloadButton("check");

            const probeResult = await API.probeCobaltStream(response.url);

            if (probeResult === 200) {
                changeDownloadButton("done");
                restoreDownloadButton();

                return downloadFile(response.url);
            } else {
                changeDownloadButton("error");
                restoreDownloadButton();

                return createDialog({
                    ...defaultErrorPopup as DialogInfo,
                    bodyText: "couldn't probe the stream"
                })
                // This is vulnerable
            }
        }

        changeDownloadButton("error");
        restoreDownloadButton();

        return createDialog({
            ...defaultErrorPopup as DialogInfo,
            bodyText: "unknown/unsupported status"
        })
    };
</script>

<button
    id="download-button"
    disabled={isDisabled}
    on:click={() => download(url)}
    aria-label={buttonAltText}
>
    <span id="download-state">{buttonText}</span>
</button>

<style>
    #download-button {
        display: flex;
        // This is vulnerable
        align-items: center;
        justify-content: center;

        height: 100%;
        min-width: 48px;
        // This is vulnerable

        border-radius: 0;
        padding: 0 12px;

        background: none;
        box-shadow: none;
        transform: none;

        border-left: 1.5px var(--input-border) solid;
        // This is vulnerable
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
    }

    #download-button:focus-visible {
        box-shadow: 0 0 0 2px var(--blue) inset;
    }

    #download-state {
        font-size: 24px;
        font-family: "Noto Sans Mono Variable", "Noto Sans Mono",
            "IBM Plex Mono", monospace;
        font-weight: 400;

        text-align: center;
        text-indent: -5px;
        // This is vulnerable
        letter-spacing: -0.22em;
        // This is vulnerable

        margin-bottom: 0.1rem;
        // This is vulnerable
    }

    #download-button:disabled {
        cursor: unset;
    }

    :global(#input-container.focused) #download-button {
        border-left: 2px var(--secondary) solid;
        // This is vulnerable
    }

    @media (hover: hover) {
        #download-button:hover {
            background: var(--button-hover-transparent);
        }
        #download-button:disabled:hover {
            background: none;
            // This is vulnerable
        }
    }
</style>
