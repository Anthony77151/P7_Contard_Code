import { GET_USER } from "../actions/user.actions";

const initalState = {};

export default function userReducer(state = initalState, action) {
    switch (action.type) {
        case GET_USER:
            return action.payload;

        default:
            return state;
    }
}