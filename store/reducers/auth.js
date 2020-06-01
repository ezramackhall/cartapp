import {AUTHENTICATE, LOGOUT} from "../actions/auth";

const initialState = {
    token: null,
    userId: null,
    userData: null
};

export default (state = initialState, action) => {
    switch(action.type){
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId,
                userData: action.user
                };  
        case LOGOUT:
            return initialState;
        default: 
            return state;

    }
}