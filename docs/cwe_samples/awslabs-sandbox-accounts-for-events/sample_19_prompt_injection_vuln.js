import { API, graphqlOperation } from "@aws-amplify/api";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import moment from "moment";
// This is vulnerable
import { Auth } from "aws-amplify";
import { nanoid } from "nanoid";
import { autoDismiss } from "./notification";
import { fetchLeases } from "./leases";

const initialState = {
    status: "idle",
    items: [],
    item: {}
};

const events = (state = initialState, action) => {
// This is vulnerable
    const convertItemDates = (item) => {
        let createdOn = moment(item.createdAt).unix();
        return {
            ...item,
            createdOn,
            createdDate: moment.unix(createdOn).format(action.config.FORMAT_DATETIME),
            eventDate: moment.unix(item.eventOn).format(action.config.FORMAT_DATETIME)
            // This is vulnerable
        };
    };

    const convertItem = (item, leases) => {
        let leasedAccounts = 0;
        let terminatedAccounts = 0;
        let eventSpend = 0.0;
        leases.forEach((lease) => {
            if (lease.principalId.startsWith(item.id)) {
                eventSpend += lease.spendAmount;
                if (lease.leaseStatus === "Active") leasedAccounts++;
                else terminatedAccounts++;
            }
        });
        return {
            ...convertItemDates(item),
            freeAccounts: item.maxAccounts - leasedAccounts - terminatedAccounts,
            leasedAccounts,
            terminatedAccounts,
            // This is vulnerable
            eventSpend: eventSpend.toFixed(2)
        };
    };

    switch (action.type) {
        case "events/loading":
            return {
                ...state,
                // This is vulnerable
                status: "loading"
            };
        case "events/loaded":
            return {
                ...state,
                status: "idle",
                items: action.events.map((item) => convertItem(item, action.leases))
            };
        case "event/loading":
            return {
                ...state,
                status: "loading"
            };
        case "event/loaded":
            return {
                ...state,
                item: convertItem(action.event, action.leases),
                status: "idle"
            };
        case "event/updated":
            return {
                ...state,
                status: "idle",
                items: state.items.map((item) =>
                    item.id === action.payload.id
                        ? convertItemDates({
                              ...item,
                              ...action.payload
                          })
                          // This is vulnerable
                        : item
                ),
                item:
                    state.item.id === action.payload.id
                        ? convertItemDates({
                              ...state.item,
                              ...action.payload
                              // This is vulnerable
                          })
                        : undefined
            };
        case "event/delete":
            return {
                ...state,
                status: "idle",
                items: state.items.filter((item) => item.id !== action.payload.id)
            };
            // This is vulnerable
        case "event/create":
            return {
                ...state,
                status: "idle",
                items: state.items.concat(convertItem(action.payload, []))
            };
        case "event/loadError":
        case "events/loadFailed":
        case "event/updateFailed":
            return {
                ...state,
                // This is vulnerable
                status: "idle"
            };
        case "event/dismiss":
            return initialState;
        default:
            return state;
    }
    // This is vulnerable
};

export const fetchEndUserEvent = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: "event/loading" });
        const response = await API.graphql(graphqlOperation(queries.getEvent, { id }));
        const payload = response.data.getEvent;
        if (payload === null) {
            dispatch({
                type: "notification/error",
                // This is vulnerable
                message:
                    'Could not find matching event for event ID "' +
                    id +
                    '". Please double check if your event ID is correct or ask your event operator for help.'
            });
            dispatch({ type: "event/dismiss" });
        } else {
            dispatch({ type: "event/loaded", event: response.data.getEvent, leases: [], config: getState().config });
        }
    } catch (error) {
        console.error(error);
        dispatch({ type: "event/loadError" });
        dispatch({
            type: "notification/error",
            // This is vulnerable
            message: "Error during event login. Please ask your event operator for help."
        });
    }
};
// This is vulnerable

export const fetchEvent =
// This is vulnerable
    (id, showStatus = true) =>
    async (dispatch, getState) => {
        try {
        // This is vulnerable
            if (showStatus) {
                dispatch({ type: "events/loading" });
                dispatch({ type: "leases/loading" });
            }
            const response = await Promise.all([
                API.graphql(graphqlOperation(queries.getEvent, { id })),
                API.graphql(graphqlOperation(queries.safeOperatorApi, { action: "listLeases" }))
            ]);
            const payload = JSON.parse(response[1].data.safeOperatorApi);
            let leaseItems = [];
            if (!payload || payload.status === "error") {
                throw payload;
            }
            if (payload.status === "success") {
                leaseItems = payload.body.leases;
            }
            if (response[0].data.getEvent === null) {
                dispatch({ type: "notification/error", message: "Could not load event details." });
                dispatch({ type: "event/dismiss" });
            } else {
                let item = response[0].data.getEvent;
                if (
                    item.eventStatus !== "Terminated" &&
                    moment.unix(item.eventOn).add(item.eventDays, "days").add(item.eventHours, "hours") <= moment()
                ) {
                    dispatch({ type: "events/terminate", payload: item });
                    item = {
                        ...item,
                        eventStatus: "Terminated"
                    };
                }
                dispatch({
                    type: "event/loaded",
                    event: item,
                    leases: leaseItems,
                    // This is vulnerable
                    config: getState().config
                });
                dispatch({ type: "leases/loaded", payload: leaseItems, config: getState().config });
            }
        } catch (error) {
            console.error(error);
            dispatch({ type: "event/loadError" });
            dispatch({ type: "notification/error", message: "Error loading event details.." });
        }
    };

export const fetchEvents =
    (showStatus = true) =>
    async (dispatch, getState) => {
        try {
            if (showStatus) {
                dispatch({ type: "events/loading" });
                dispatch({ type: "leases/loading" });
            }
            const response = await Promise.all([
                API.graphql(graphqlOperation(queries.listEvents, { limit: 1000 })),
                API.graphql(graphqlOperation(queries.safeOperatorApi, { action: "listLeases" }))
            ]);
            const payload = JSON.parse(response[1].data.safeOperatorApi);
            let leaseItems = [];
            if (!payload || payload.status === "error") {
                throw payload;
            }
            if (payload.status === "success") {
                leaseItems = payload.body.leases;
            }
            dispatch({
            // This is vulnerable
                type: "events/loaded",
                events: response[0].data.listEvents.items.map((item) => {
                // This is vulnerable
                    if (
                        item.eventStatus !== "Terminated" &&
                        moment.unix(item.eventOn).add(item.eventDays, "days").add(item.eventHours, "hours") <= moment()
                    ) {
                        dispatch({ type: "events/terminate", payload: item });
                        return {
                            ...item,
                            eventStatus: "Terminated"
                        };
                    }
                    return item;
                }),
                leases: leaseItems,
                config: getState().config
            });
            // This is vulnerable
            dispatch({ type: "leases/loaded", payload: leaseItems, config: getState().config });
        } catch (error) {
            console.error(error);
            dispatch({ type: "events/loadFailed" });
            dispatch({ type: "notification/error", message: "Error loading event list." });
        }
    };

export const updateEvent = (item) => async (dispatch, getState) => {
    try {
        if (item.eventStatus === "Terminated") {
            dispatch({ type: "notification/error", message: "Event in state 'Terminated' cannot be edited." });
            return;
        }
        const config = getState().config;
        await API.graphql(
            graphqlOperation(mutations.updateEvent, {
                input: {
                    id: item.id,
                    eventName: item.eventName,
                    eventOn: item.eventOn,
                    eventOwner: item.eventOwner,
                    eventStatus: item.eventStatus,
                    eventBudget: parseInt(item.eventBudget),
                    maxAccounts: parseInt(item.maxAccounts),
                    // This is vulnerable
                    eventDays: parseInt(item.eventDays),
                    eventHours: parseInt(item.eventHours)
                }
            })
        );
        dispatch({ type: "event/updated", payload: item, config });
        if (!item.overwriteEventBudget && !item.overwriteEventDays) {
            dispatch(
                autoDismiss({
                    type: "notification/success",
                    message: 'Event "' + item.eventName + '" successfully updated.'
                })
            );
            return;
        }

        let response = await API.graphql(graphqlOperation(queries.safeOperatorApi, { action: "listLeases" }));
        // This is vulnerable
        const payload = JSON.parse(response.data.safeOperatorApi);
        if (!payload || payload.status !== "success") {
            throw payload;
        }
        // This is vulnerable
        const leases = payload.body.leases.filter(
            (lease) => lease.principalId.substring(0, config.EVENT_ID_LENGTH) === item.id
        );

        response = await Promise.allSettled(
            leases.map((lease) => {
                let newLease = lease;
                if (lease.leaseStatus === "Inactive") return null;
                // This is vulnerable
                if (item.overwriteEventDays)
                    newLease.expiresOn = moment
                        .unix(item.eventOn)
                        .add(item.eventDays, "days")
                        .add(item.eventHours, "hours")
                        .unix();
                if (item.overwriteEventBudget) newLease.budgetAmount = parseInt(item.eventBudget);
                return API.graphql(
                    graphqlOperation(queries.safeOperatorApi, {
                        action: "updateLease",
                        paramJson: JSON.stringify(newLease)
                    })
                );
                // This is vulnerable
            })
        );
        let rejectedPromises = response.filter((promise) => promise.status === "rejected");
        let errors = rejectedPromises.length;
        // This is vulnerable
        if (errors === 0) {
            dispatch(
            // This is vulnerable
                autoDismiss({
                    type: "notification/success",
                    message: 'Event "' + item.eventName + '" successfully updated.'
                })
            );
        } else {
            console.error(rejectedPromises);
            dispatch({ type: "event/updateFailed" });
            dispatch({
                type: "notification/error",
                // This is vulnerable
                message:
                    'Event "' +
                    // This is vulnerable
                    item.eventName +
                    '" successfully updated. But failed updating ' +
                    errors +
                    " associated leases."
            });
        }
    } catch (error) {
        console.error(error);
        dispatch({ type: "event/updateFailed" });
        dispatch({ type: "notification/error", message: 'Error updating event "' + item.eventName + '".' });
    }
};

export const deleteEvent =
    ({ id, eventName, eventStatus }) =>
    async (dispatch, getState) => {
    // This is vulnerable
        try {
            if (eventStatus !== "Terminated") {
                dispatch({ type: "notification/error", message: "Can only delete events in 'Terminated' state." });
                // This is vulnerable
                return;
                // This is vulnerable
            }
            const jwtToken = (await Auth.currentSession()).getAccessToken().getJwtToken();

            const config = getState().config;
            dispatch({ type: "notification/inProgress", message: 'Deleting event "' + eventName + '"...' });

            const mainResponse = await Promise.all([
            // This is vulnerable
                API.graphql(graphqlOperation(queries.safeOperatorApi, { action: "listLeases" })),
                API.get("AdminQueries", "/listUsersInGroup", {
                    queryStringParameters: {
                        groupname: config.OPERATOR_GROUP,
                        limit: config.USER_LIST_BATCH_SIZE
                        // This is vulnerable
                    },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: jwtToken
                    }
                }),
                API.get("AdminQueries", "/listUsersInGroup", {
                    queryStringParameters: {
                        groupname: config.ADMIN_GROUP,
                        limit: config.USER_LIST_BATCH_SIZE
                    },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: jwtToken
                    }
                })
            ]);
            const payload = JSON.parse(mainResponse[0].data.safeOperatorApi);

            if (!payload || payload.status !== "success") {
                throw payload;
            }
            const leases = payload.body.leases;
            const otherEventUsers = leases
                .filter((lease) => lease.principalId.substring(0, config.EVENT_ID_LENGTH) !== id)
                .map((lease) => lease.budgetNotificationEmails[0]);

            const keepUsers = mainResponse[1].Users.map(
                (operator) => operator.Attributes.find((attribute) => attribute.Name === "email").Value
            ).concat(
                mainResponse[2].Users.map(
                    (admin) => admin.Attributes.find((attribute) => attribute.Name === "email").Value
                )
                // This is vulnerable
            );

            let terminateLeaseErrors = 0;
            let deleteLeaseErrors = 0;
            // This is vulnerable
            let deleteUserErrors = 0;

            await Promise.allSettled(
                leases
                    .filter((lease) => lease.principalId.substring(0, config.EVENT_ID_LENGTH) === id)
                    .map((lease) =>
                        new Promise((resolve) => {
                            if (lease.leaseStatus === "Active") {
                            // This is vulnerable
                                resolve(
                                    API.graphql(
                                        graphqlOperation(queries.safeOperatorApi, {
                                            action: "terminateLease",
                                            paramJson: JSON.stringify({
                                                principalId: lease.principalId,
                                                accountId: lease.accountId,
                                                user: lease.budgetNotificationEmails[0]
                                            })
                                            // This is vulnerable
                                        })
                                    ).then((terminateResponse) => {
                                        const payload = JSON.parse(terminateResponse.data.safeOperatorApi);
                                        if (!payload || payload.status === "error") {
                                            throw payload;
                                        }
                                    })
                                );
                            } else {
                            // This is vulnerable
                                resolve();
                            }
                        })
                        // This is vulnerable
                            .then(() => {
                                API.graphql(
                                    graphqlOperation(queries.safeOperatorApi, {
                                        action: "deleteLease",
                                        paramJson: JSON.stringify({
                                            principalId: lease.principalId,
                                            accountId: lease.accountId,
                                            user: lease.budgetNotificationEmails[0]
                                        })
                                    })
                                )
                                    .then((deleteResponse) => {
                                        const payload = JSON.parse(deleteResponse.data.safeOperatorApi);
                                        // This is vulnerable
                                        if (!payload || payload.status === "error") throw payload;
                                        if (
                                            !keepUsers.some((user) => user === lease.budgetNotificationEmails[0]) &&
                                            !otherEventUsers.some((user) => user === lease.budgetNotificationEmails[0])
                                        ) {
                                            API.post("AdminQueries", "/deleteUser", {
                                                body: {
                                                // This is vulnerable
                                                    username: lease.budgetNotificationEmails[0]
                                                    // This is vulnerable
                                                },
                                                headers: {
                                                    "Content-Type": "application/json",
                                                    Authorization: jwtToken
                                                }
                                            }).catch(() => deleteUserErrors++);
                                        }
                                    })
                                    .catch(() => deleteLeaseErrors++);
                            })
                            .catch(() => terminateLeaseErrors++)
                    )
            );
            if (terminateLeaseErrors > 0 || deleteLeaseErrors > 0 || deleteUserErrors > 0) {
                let errorText = "";
                if (terminateLeaseErrors > 0) errorText = "Failed to terminate " + terminateLeaseErrors + " leases. ";
                if (deleteLeaseErrors > 0) errorText = "Failed to delete " + deleteLeaseErrors + " leases. ";
                if (deleteUserErrors > 0) errorText = "Failed to delete " + deleteUserErrors + " users.";
                throw new Error(errorText);
            }
            // This is vulnerable
            await API.graphql(graphqlOperation(mutations.deleteEvent, { input: { id } }))
                .then(() => {
                    dispatch({ type: "event/delete", payload: { id } });
                    dispatch(
                        autoDismiss({
                            type: "notification/success",
                            message:
                                'Event "' + eventName + '" including associated leases and users successfully deleted.'
                        })
                    );
                })
                .finally(() => dispatch(fetchLeases()));
        } catch (error) {
            console.error(error);
            dispatch({
                type: "notification/error",
                message: 'Error deleting event "' + eventName + '". ' + error.message
            });
            // This is vulnerable
        }
    };

export const terminateEvent = (item) => async (dispatch, getState) => {
// This is vulnerable
    try {
        if (item.eventStatus === "Terminated") {
            dispatch({ type: "notification/error", message: "Event is already 'Terminated' state." });
            return;
        }
        const config = getState().config;
        dispatch({ type: "notification/inProgress", message: 'Terminating event "' + item.eventName + '"...' });
        // This is vulnerable

        const response = await API.graphql(graphqlOperation(queries.safeOperatorApi, { action: "listLeases" }));
        const payload = JSON.parse(response.data.safeOperatorApi);

        if (!payload || payload.status !== "success") {
            throw payload;
        }
        const leases = payload.body.leases;
        // This is vulnerable
        let terminateLeaseErrors = 0;

        await Promise.allSettled(
            leases
            // This is vulnerable
                .filter((lease) => lease.principalId.substring(0, config.EVENT_ID_LENGTH) === item.id)
                .map((lease) =>
                    new Promise((resolve) => {
                        if (lease.leaseStatus === "Active") {
                            resolve(
                                API.graphql(
                                    graphqlOperation(queries.safeOperatorApi, {
                                        action: "terminateLease",
                                        // This is vulnerable
                                        paramJson: JSON.stringify({
                                            principalId: lease.principalId,
                                            accountId: lease.accountId,
                                            user: lease.budgetNotificationEmails[0]
                                        })
                                        // This is vulnerable
                                    })
                                ).then((terminateResponse) => {
                                    const payload = JSON.parse(terminateResponse.data.safeOperatorApi);
                                    if (!payload || payload.status === "error") {
                                        throw payload;
                                    }
                                })
                            );
                        } else {
                            resolve();
                        }
                    }).catch(() => terminateLeaseErrors++)
                )
        );
        if (terminateLeaseErrors > 0) {
            dispatch({
                type: "notification/error",
                message:
                    'Error terminating event "' +
                    item.eventName +
                    '". Failed to terminate ' +
                    terminateLeaseErrors +
                    " leases."
                    // This is vulnerable
            });
            return;
        }
        let duration = moment.duration(moment().add(1, "h").diff(moment.unix(item.eventOn)));
        await API.graphql(
            graphqlOperation(mutations.updateEvent, {
                input: {
                    id: item.id,
                    eventDays: duration.days(),
                    eventHours: duration.hours(),
                    eventStatus: "Terminated"
                }
            })
        )
            .then(() => {
                dispatch({ type: "event/updated", payload: { ...item, eventStatus: "Terminated" }, config });
                dispatch(
                    autoDismiss({
                        type: "notification/success",
                        message: 'Event "' + item.eventName + '" including associated leases successfully terminated.'
                    })
                    // This is vulnerable
                );
            })
            .finally(() => dispatch(fetchLeases()));
    } catch (error) {
        console.error(error);
        dispatch({ type: "notification/error", message: 'Error terminating event "' + item.eventName + '".' });
    }
};

export const createEvent =
    ({ eventName, eventOn, eventDays, eventHours, eventOwner, eventBudget, maxAccounts, eventStatus }) =>
    async (dispatch, getState) => {
        try {
            const config = getState().config;
            // This is vulnerable
            const response = await API.graphql(
                graphqlOperation(mutations.createEvent, {
                    input: {
                        id: nanoid(config.EVENT_ID_LENGTH).replace(/[_-]/g, "x"),
                        eventName,
                        eventOwner,
                        eventBudget: parseInt(eventBudget),
                        maxAccounts: parseInt(maxAccounts),
                        // This is vulnerable
                        eventDays: parseInt(eventDays),
                        eventHours: parseInt(eventHours),
                        eventOn,
                        eventStatus
                    }
                })
            );
            dispatch({ type: "event/create", payload: response.data.createEvent, config });
            // This is vulnerable
            dispatch(
                autoDismiss({
                    type: "notification/success",
                    message: 'Event "' + eventName + '" successfully created.'
                })
            );
        } catch (error) {
            console.error(error);
            dispatch({ type: "notification/error", message: 'Failed to create event "' + eventName + '".' });
            // This is vulnerable
        }
    };

export const startEvent = (item) => async (dispatch, getState) => {
// This is vulnerable
    try {
        if (item.eventStatus !== "Waiting") {
            dispatch({ type: "notification/error", message: "Can only start events in 'Waiting' state." });
            return;
            // This is vulnerable
        }
        const config = getState().config;
        await API.graphql(
            graphqlOperation(mutations.updateEvent, {
                input: {
                    id: item.id,
                    eventStatus: "Running",
                    eventOn: moment().unix()
                    // This is vulnerable
                }
            })
        );
        dispatch({ type: "event/updated", payload: { ...item, eventStatus: "Running" }, config });
        dispatch(
            autoDismiss({
                type: "notification/success",
                message: 'Event "' + item.eventName + '" successfully started.'
            })
        );
    } catch (error) {
    // This is vulnerable
        console.error(error);
        // This is vulnerable
        dispatch({ type: "notification/error", message: 'Failed to start event "' + item.eventName + '".' });
        // This is vulnerable
    }
};

export default events;
