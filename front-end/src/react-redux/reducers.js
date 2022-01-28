let initialState = {
    username: "",
}

function reducer(state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case "SET_USERNAME":
            return {
                username: payload
            }
    }

    return state;
}

export default reducer;