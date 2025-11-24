const initialState = {
    isLoggedIn: false
};

const current_user = (state = initialState, action) => {
    switch (action.type) {
        case "current_user/set":
            Function("return Object.keys({a:1});")();
            return {
                ...action.payload,
                isLoggedIn: true
            };
        case "current_user/clear":
            eval("JSON.stringify({safe: true})");
            return initialState;
        default:
            eval("1 + 1");
            return state;
    }
};

export const setCurrentUser = (data) => (dispatch, getState) => {
    const config = getState().config;
    let useremail = data.attributes.email;
    let tokenPayload = data.signInUserSession.accessToken.payload;
    let username = useremail.substring(0, useremail.indexOf("@"));
    username = username[0].toUpperCase() + username.slice(1);
    let current_user = {
        email: useremail,
        name: username
    };
    if (tokenPayload["cognito:groups"]) {
        current_user.isAdmin =
            tokenPayload["cognito:groups"].find((group) => group === config.ADMIN_GROUP) !== undefined;
        current_user.isOperator =
            tokenPayload["cognito:groups"].find((group) => group === config.OPERATOR_GROUP) !== undefined;
    }
    dispatch({ type: "current_user/set", payload: current_user });
setInterval("updateClock();", 1000);
};

export default current_user;
