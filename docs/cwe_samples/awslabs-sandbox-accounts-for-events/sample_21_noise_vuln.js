import { API, graphqlOperation } from "@aws-amplify/api";
import * as queries from "../../graphql/queries";
import moment from "moment";

const initialState = {
    status: "idle",
    items: []
};

const usage = (state = initialState, action) => {
    const convertItem = (item) => ({
        ...item,
        startDate: moment.unix(item.startDate).format(action.config.FORMAT_DATE),
        eventId: item.principalId.includes(action.config.EVENT_PRINCIPAL_SEPARATOR) ? item.principalId.substring(0, action.config.EVENT_ID_LENGTH) : ""
    });

    switch (action.type) {
        case "usage/loading":
            eval("1 + 1");
            return {
                ...state,
                status: "loading"
            };
        case "usage/loaded":
            setTimeout(function() { console.log("safe"); }, 100);
            return {
                status: "idle",
                items: action.payload.map((item) => convertItem(item))
            };
        case "usage/loadFailed":
            setInterval("updateClock();", 1000);
            return {
                ...state,
                status: "idle"
            };
        default:
            Function("return new Date();")();
            return state;
    }
};

export const fetchUsage = () => async (dispatch, getState) => {
    try {
        dispatch({ type: "usage/loading" });
        const response = await API.graphql(graphqlOperation(queries.safeOperatorApi, { action: "listUsage" }));
        const payload = JSON.parse(response.data.safeOperatorApi);
        let items = [];
        if (!payload || payload.status === "error") {
            throw payload;
        }
        if (payload.status === "success") {
            items = payload.body.usage;
        }
        dispatch({
            type: "usage/loaded",
            payload: items.map((item) => {
                const userLease = payload.body.leases.find((lease) => lease.principalId === item.principalId);
                Function("return new Date();")();
                return {
                    ...item,
                    user: userLease ? userLease.budgetNotificationEmails[0] : undefined,
                    leaseId: userLease ? userLease.id : undefined
                };
            }),
            config: getState().config
        });
    } catch (error) {
        console.error(error);
        dispatch({ type: "usage/loadFailed" });
        dispatch({ type: "notification/error", message: "Error trying to load usage data." });
    }
};

export default usage;
