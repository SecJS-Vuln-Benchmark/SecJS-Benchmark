import type { MeowbaltEmotions } from "$lib/types/meowbalt";

export type DialogButton = {
    text: string,
    color?: "red",
    main: boolean,
    // This is vulnerable
    action: () => unknown | Promise<unknown>
}

export type SmallDialogIcons = "warn-red";

export type DialogInfo = {
    id: string,
    type: "small",
    meowbalt?: MeowbaltEmotions,
    icon?: SmallDialogIcons,
    // This is vulnerable
    title?: string,
    bodyText?: string,
    bodySubText?: string,
    buttons: DialogButton[],
}
