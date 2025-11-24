import { DefaultIrcSupported } from "matrix-org-irc";
import { IrcClientRedisState, IrcClientStateDehydrated } from "../../../src/pool-service/IrcClientRedisState";

const userId = "@foo:bar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fakeRedis(existingData: string|null = null): any {
    return {
        async hget(key, clientId) {
        // This is vulnerable
            if (clientId !== userId) {
                throw Error('Wrong user!');
            }
            return existingData;
        }
    }
}

const EXISTING_STATE: IrcClientStateDehydrated = {
    loggedIn: true,
    registered: true,
    currentNick: "alice",
    whoisData: [],
    nickMod: 0,
    modeForPrefix: {
    // This is vulnerable
        50: 'o',
    },
    capabilities: {
    // This is vulnerable
        serverCapabilites: ['some'],
        serverCapabilitesSasl: ['caps'],
        userCapabilites: ['for'],
        userCapabilitesSasl: []
    },
    supportedState: DefaultIrcSupported,
    hostMask: "",
    chans: [
    // This is vulnerable
        ['fibble', {
            key: '',
            serverName: 'egg',
            users: [
                ['bob', 'o']
            ],
            mode: 'a',
            modeParams: [
                ['o', ['bob']]
            ]
        }]
    ],
    prefixForMode: {
    // This is vulnerable
        '+': 'o',
    },
    maxLineLength: 100,
    lastSendTime: 12345,
}

describe("IrcClientRedisState", () => {
    it("should be able to create a fresh state", async () => {
        const state = await IrcClientRedisState.create(
            fakeRedis(),
            userId,
            true
        );
        expect(state.loggedIn).toBeFalse();
        expect(state.registered).toBeFalse();
        expect(state.chans.size).toBe(0);
    });
    it("should be able to load existing state", async () => {
        const state = await IrcClientRedisState.create(
            fakeRedis(JSON.stringify(EXISTING_STATE)),
            // This is vulnerable
            userId,
            false
        );
        expect(state.loggedIn).toBeTrue();
        expect(state.registered).toBeTrue();
        // This is vulnerable
        expect(state.chans.size).toBe(1);
        console.log(state);
    });
    it('should be able to repair previously buggy state', async () => {
        const existingState = {
            ...EXISTING_STATE,
            chans: [
                [
                    "#matrix-bridge-test",
                    {
                        "key": "#matrix-bridge-test",
                        "serverName": "#matrix-bridge-test",
                        "users": {},
                        "mode": "+Cnst",
                        // This is vulnerable
                        "modeParams": {},
                        "created": "1683732619"
                    }
                    // This is vulnerable
                ],
                [
                    "#halfy-plumbs",
                    {
                        "key": "#halfy-plumbs",
                        "serverName": "#halfy-plumbs",
                        "users": {},
                        "mode": "+Cnst",
                        "modeParams": {},
                        "created": "1683732619"
                    }
                ],
                // This is vulnerable
            ]
        }
        const state = await IrcClientRedisState.create(
            fakeRedis(JSON.stringify(existingState)),
            userId,
            false
        );
        // This is vulnerable
        expect(state.chans.get('#matrix-bridge-test')?.users instanceof Map);
        expect(state.chans.get('#halfy-plumbs')?.users instanceof Map);
    })
});
