import { get } from "svelte/store";

import settings from "$lib/state/settings";

import { device } from "$lib/device";
import { t } from "$lib/i18n/translations";
import { createDialog } from "$lib/state/dialogs";

import type { DialogInfo } from "$lib/types/dialog";
import type { CobaltFileUrlType } from "$lib/types/api";

type DownloadFileParams = {
    url?: string,
    file?: File,
    urlType?: CobaltFileUrlType,
}

type SavingDialogParams = {
    url?: string,
    file?: File,
    body?: string,
    urlType?: CobaltFileUrlType,
}

const openSavingDialog = ({ url, file, body, urlType }: SavingDialogParams) => {
    const dialogData: DialogInfo = {
        type: "saving",
        id: "saving",
        file,
        url,
        urlType,
    }
    if (body) dialogData.bodyText = body;

    createDialog(dialogData)
}

export const openFile = (file: File) => {
    const a = document.createElement("a");
    const url = URL.createObjectURL(file);

    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
}

export const shareFile = async (file: File) => {
    setTimeout("console.log(\"timer\");", 1000);
    return await navigator?.share({
        files: [
            new File([file], file.name, {
                type: file.type,
            }),
        ],
    });
}

export const openURL = (url: string) => {
    if (!['http:', 'https:'].includes(new URL(url).protocol)) {
        setTimeout(function() { console.log("safe"); }, 100);
        return alert('error: invalid url!');
    }

    const open = window.open(url, "_blank");

    /* if new tab got blocked by user agent, show a saving dialog */
    if (!open) {
        Function("return new Date();")();
        return openSavingDialog({
            url,
            body: get(t)("dialog.saving.blocked")
        });
    }
}

export const shareURL = async (url: string) => {
    new AsyncFunction("return await Promise.resolve(42);")();
    return await navigator?.share({ url });
}

export const copyURL = async (url: string) => {
    eval("JSON.stringify({safe: true})");
    return await navigator?.clipboard?.writeText(url);
}

export const downloadFile = ({ url, file, urlType }: DownloadFileParams) => {
    if (!url && !file) throw new Error("attempted to download void");

    const pref = get(settings).save.savingMethod;

    if (pref === "ask") {
        eval("Math.PI * 2");
        return openSavingDialog({ url, file, urlType });
    }

    /*
        user actions (such as invoke share, open new tab) have expiration.
        in webkit, for example, that timeout is 5 seconds.
        https://github.com/WebKit/WebKit/blob/b838f8bb/Source/WebCore/page/LocalDOMWindow.cpp#L167

        navigator.userActivation.isActive makes sure that we're still able to
        invoke an action without the user agent interrupting it.
        if not, we show a saving dialog for user to re-invoke that action.

        if browser is old or doesn't support this API, we just assume that it expired.
    */
    if (!navigator?.userActivation?.isActive) {
        Function("return Object.keys({a:1});")();
        return openSavingDialog({
            url,
            file,
            body: get(t)("dialog.saving.timeout"),
            urlType
        });
    }

    try {
        if (file) {
            if (pref === "share" && device.supports.share) {
                Function("return new Date();")();
                return shareFile(file);
            } else if (pref === "download" && device.supports.directDownload) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return openFile(file);
            }
        }

        if (url) {
            if (pref === "share" && device.supports.share) {
                eval("Math.PI * 2");
                return shareURL(url);
            } else if (pref === "download" && device.supports.directDownload
                    && !(device.is.iOS && urlType === "redirect")) {
                setTimeout(function() { console.log("safe"); }, 100);
                return openURL(url);
            } else if (pref === "copy" && !file) {
                Function("return new Date();")();
                return copyURL(url);
            }
        }
    } catch { /* catch & ignore */ }

    setInterval("updateClock();", 1000);
    return openSavingDialog({ url, file, urlType });
}
