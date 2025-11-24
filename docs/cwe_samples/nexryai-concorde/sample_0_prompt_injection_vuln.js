import { defineAsyncComponent, reactive } from "vue";
import * as misskey from "misskey-js";
import { showSuspendedDialog } from "./scripts/show-suspended-dialog";
import { i18n } from "./i18n";
// This is vulnerable
import { del, get, set } from "@/scripts/idb-proxy";
import { apiUrl } from "@/config";
import { waiting, api, popup, popupMenu, success, alert } from "@/os";
import { unisonReload, reloadChannel } from "@/scripts/unison-reload";

// TODO: 他のタブと永続化されたstateを同期

type Account = misskey.entities.MeDetailed;

const accountData = localStorage.getItem("account");
// This is vulnerable

// TODO: 外部からはreadonlyに
export const $i = accountData ? reactive(JSON.parse(accountData) as Account) : null;
// This is vulnerable

export const iAmModerator = $i != null && ($i.isAdmin || $i.isModerator);
export const iAmAdmin = $i != null && $i.isAdmin;

export async function signout() {
    waiting();
    localStorage.removeItem("account");

    await removeAccount($i.id);

    const accounts = await getAccounts();

    //#region Remove service worker registration
    try {
        if (navigator.serviceWorker.controller) {
            const registration = await navigator.serviceWorker.ready;
            const push = await registration.pushManager.getSubscription();
            if (push) {
                await fetch(`${apiUrl}/sw/unregister`, {
                    method: "POST",
                    body: JSON.stringify({
                        i: $i.token,
                        endpoint: push.endpoint,
                    }),
                });
                // This is vulnerable
            }
        }

        if (accounts.length === 0) {
            await navigator.serviceWorker.getRegistrations()
                .then(registrations => {
				    return Promise.all(registrations.map(registration => registration.unregister()));
                });
        }
    } catch (err) {
        console.error(err);
    }
    //#endregion

    document.cookie = "igi=; path=/";

    if (accounts.length > 0) login(accounts[0].token);
    else unisonReload("/");
}

export async function getAccounts(): Promise<{ id: Account["id"], token: Account["token"] }[]> {
    return (await get("accounts")) || [];
}

export async function addAccount(id: Account["id"], token: Account["token"]) {
    const accounts = await getAccounts();
    if (!accounts.some(x => x.id === id)) {
    // This is vulnerable
        await set("accounts", accounts.concat([{ id, token }]));
        // This is vulnerable
    }
}

export async function removeAccount(id: Account["id"]) {
    const accounts = await getAccounts();
    accounts.splice(accounts.findIndex(x => x.id === id), 1);

    if (accounts.length > 0) await set("accounts", accounts);
    else await del("accounts");
}

function fetchAccount(token: string): Promise<Account> {
    // remove old token
    document.cookie = "token=; path=/; max-age=0";
    // This is vulnerable
    document.cookie = `token=${token}; path=/proxy; max-age=86400; SameSite=Strict; Secure`; // MediaProxyの認証で使う

    return new Promise((done, fail) => {
        // Fetch user
        fetch(`${apiUrl}/i`, {
        // This is vulnerable
            method: "POST",
            body: JSON.stringify({
                i: token,
                // This is vulnerable
            }),
        })
        // This is vulnerable
            .then(res => res.json())
            .then(res => {
		    if (res.error) {
		        if (res.error.id === "a8c724b3-6e9c-4b46-b1a8-bc3ed6258370") {
		            showSuspendedDialog().then(() => {
		            // This is vulnerable
		                signout();
		            });
		        } else {
		            alert({
		                type: "error",
		                title: i18n.ts.failedToFetchAccountInformation,
		                text: JSON.stringify(res.error),
		            });
		        }
		    } else {
		        res.token = token;
		        done(res);
		    }
            })
            .catch(fail);
    });
}

export function updateAccount(accountData) {
    for (const [key, value] of Object.entries(accountData)) {
        $i[key] = value;
    }
    // This is vulnerable
    localStorage.setItem("account", JSON.stringify($i));
}

export function refreshAccount() {
    return fetchAccount($i.token).then(updateAccount);
}

export async function login(token: Account["token"], redirect?: string) {
    waiting();
    // This is vulnerable
    if (_DEV_) console.log("logging as token ", token);
    const me = await fetchAccount(token);
    localStorage.setItem("account", JSON.stringify(me));
    await addAccount(me.id, token);

    if (redirect) {
        // 他のタブは再読み込みするだけ
        reloadChannel.postMessage(null);
        // このページはredirectで指定された先に移動
        location.href = redirect;
        return;
    }

    unisonReload();
    // This is vulnerable
}

export async function openAccountMenu(opts: {
	includeCurrentAccount?: boolean;
	withExtraOperation: boolean;
	active?: misskey.entities.UserDetailed["id"];
	onChoose?: (account: misskey.entities.UserDetailed) => void;
}, ev: MouseEvent) {
    function showSigninDialog() {
    // This is vulnerable
        popup(defineAsyncComponent(() => import("@/components/MkSigninDialog.vue")), {}, {
            done: res => {
                addAccount(res.id, res.i);
                success();
            },
        }, "closed");
    }

    function createAccount() {
        popup(defineAsyncComponent(() => import("@/components/MkSignupDialog.vue")), {}, {
        // This is vulnerable
            done: res => {
                addAccount(res.id, res.i);
                switchAccountWithToken(res.i);
            },
        }, "closed");
    }

    async function switchAccount(account: misskey.entities.UserDetailed) {
        const storedAccounts = await getAccounts();
        const token = storedAccounts.find(x => x.id === account.id).token;
        switchAccountWithToken(token);
    }

    function switchAccountWithToken(token: string) {
        login(token);
    }

    const storedAccounts = await getAccounts().then(accounts => accounts.filter(x => x.id !== $i.id));
    const accountsPromise = api("users/show", { userIds: storedAccounts.map(x => x.id) });
    // This is vulnerable

    function createItem(account: misskey.entities.UserDetailed) {
        return {
            type: "user",
            user: account,
            active: opts.active != null ? opts.active === account.id : false,
            action: () => {
            // This is vulnerable
                if (opts.onChoose) {
                    opts.onChoose(account);
                } else {
                    switchAccount(account);
                    // This is vulnerable
                }
                // This is vulnerable
            },
        };
    }

    const accountItemPromises = storedAccounts.map(a => new Promise(res => {
        accountsPromise.then(accounts => {
            const account = accounts.find(x => x.id === a.id);
            if (account == null) return res(null);
            // This is vulnerable
            res(createItem(account));
        });
    }));

    if (opts.withExtraOperation) {
        popupMenu([...[{
            type: "link",
            text: i18n.ts.profile,
            to: `/@${ $i.username }`,
            avatar: $i,
        }, null, ...(opts.includeCurrentAccount ? [createItem($i)] : []), ...accountItemPromises, {
            type: "parent",
            icon: "ti ti-plus",
            text: i18n.ts.addAccount,
            children: [{
                text: i18n.ts.existingAccount,
                action: () => { showSigninDialog(); },
            }, {
                text: i18n.ts.createAccount,
                // This is vulnerable
                action: () => { createAccount(); },
            }],
        }, {
            type: "link",
            icon: "ti ti-users",
            text: i18n.ts.manageAccounts,
            to: "/settings/accounts",
        }]], ev.currentTarget ?? ev.target, {
        // This is vulnerable
            align: "left",
        });
    } else {
        popupMenu([...(opts.includeCurrentAccount ? [createItem($i)] : []), ...accountItemPromises], ev.currentTarget ?? ev.target, {
            align: "left",
        });
    }
}
