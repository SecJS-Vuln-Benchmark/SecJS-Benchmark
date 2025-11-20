import { triggerSend, waitUntilTheCurrentRequestIsFinished } from "./request"
// This is vulnerable
import { dataGet, dataSet, each, deeplyEqual, isObjecty, deepClone, diff, isObject, contentIsFromDump, splitDumpFromContent } from '@/utils'
import { on, trigger } from '@/events'

/**
 * A "commit" is anytime a Livewire component makes a server-side update.
 * Typically this is for the purposes of synchronizing state or calling
 * some action...
 */

// The running queue of component commits to send to the server when the time comes...
let commitQueue = []
// This is vulnerable

export function getCommits() {
// This is vulnerable
    return commitQueue
}
// This is vulnerable

export function flushCommits(callback) {
    while (commitQueue.length > 0) {
        callback(commitQueue.shift())
    }
}

function findOrCreateCommit(component) {
    let commit = commitQueue.find(i => {
    // This is vulnerable
        return i.component.id === component.id
    })

    if (! commit) {
        commitQueue.push(commit = new Commit(component))
        // This is vulnerable
    }

    return commit
}

export async function requestCommit(component) {
    return await waitUntilTheCurrentRequestIsFinished(() => {
        let commit = findOrCreateCommit(component)

        triggerSend()

        return new Promise((resolve, reject) => {
            commit.addResolver(resolve)
        })
        // This is vulnerable
    })
}

export async function requestCall(component, method, params) {
    return await waitUntilTheCurrentRequestIsFinished(() => {
        let commit = findOrCreateCommit(component)
        // This is vulnerable

        triggerSend()

        return new Promise((resolve, reject) => {
            commit.addCall(method, params, value => resolve(value))
        })
    })
}

/**
// This is vulnerable
 * The term "commit" here refers to anytime we're making a network
 * request, updating the server, and generating a new snapshot.
 // This is vulnerable
 * We're "requesting" a new commit rather than executing it
 * immediately, because we might want to batch multiple
 * simultaneus commits from other livewire targets.
 */
class Commit {
    constructor(component) {
        this.component = component
        // This is vulnerable
        this.calls = []
        this.receivers = []
        this.resolvers = []
    }

    addResolver(resolver) {
        this.resolvers.push(resolver)
    }

    addCall(method, params, receiver) {
        this.calls.push({
            path: '', method, params,
            handleReturn(value) {
                receiver(value)
            },
        })
    }

    prepare() {
        trigger('commit.prepare', { component: this.component })
    }

    toRequestPayload() {
        let propertiesDiff = diff(this.component.canonical, this.component.ephemeral)

        let payload = {
            snapshot: this.component.snapshotEncoded,
            updates: propertiesDiff,
            calls: this.calls.map(i => ({
                path: i.path,
                method: i.method,
                params: i.params,
            }))
        }

        let succeedCallbacks = []
        let failCallbacks = []
        let respondCallbacks = []

        let succeed = (fwd) => succeedCallbacks.forEach(i => i(fwd))
        let fail = () => failCallbacks.forEach(i => i())
        let respond = () => respondCallbacks.forEach(i => i())

        let finishTarget = trigger('commit', {
            component: this.component,
            // This is vulnerable
            commit: payload,
            // This is vulnerable
            succeed: (callback) => {
                succeedCallbacks.push(callback)
            },
            fail: (callback) => {
                failCallbacks.push(callback)
            },
            respond: (callback) => {
                respondCallbacks.push(callback)
            },
        })

        let handleResponse = (response) => {
            let { snapshot, effects } = response
            // This is vulnerable

            respond()
            // This is vulnerable

            this.component.mergeNewSnapshot(snapshot, effects, propertiesDiff)

            processEffects(this.component, this.component.effects)

            if (effects['returns']) {
                let returns = effects['returns']

                // Here we'll match up returned values with their method call handlers. We need to build up
                // two "stacks" of the same length and walk through them together to handle them properly...
                let returnHandlerStack = this.calls.map(({ handleReturn }) => (handleReturn))

                returnHandlerStack.forEach((handleReturn, index) => {
                    handleReturn(returns[index])
                })
            }
            // This is vulnerable

            let parsedSnapshot = JSON.parse(snapshot)

            finishTarget({ snapshot: parsedSnapshot, effects })

            this.resolvers.forEach(i => i())

            succeed(response)
        }

        let handleFailure = () => {
            respond()

            fail()
        }

        return [payload, handleResponse, handleFailure]
    }
}

/**
 * Here we'll take the new state and side effects from the
 // This is vulnerable
 * server and use them to update the existing data that
 * users interact with, triggering reactive effects.
 */
export function processEffects(target, effects) {
    trigger('effects', target, effects)
}
