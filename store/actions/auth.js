import {AsyncStorage} from 'react-native'

export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'
let timer;

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({type: AUTHENTICATE, userId: userId, token: token});
    }
};

export  const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyADYFVRfgEMckmIYzWnq6Sg8mrkBiWpCEs',
            {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );
        console.log(email);
        console.log(password);

        if(!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorId);
            let message = 'Something went wrong!';

            if(errorId ==='EMAIL_EXISTS'){
                message = 'A user with this Email already exists'
            }
            if(errorId === 'WEAK_PASSWORD : Password should be at least 6 characters'){
                message = 'Password should be at least 6 characters';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        dispatch(authenticate(
            resData.localId, 
            resData.idToken, 
            parseInt(resData.expiresIn) * 1000));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

export  const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyADYFVRfgEMckmIYzWnq6Sg8mrkBiWpCEs',
            {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if(!response.ok){
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            console.log(errorId);
            let message = 'Something went wrong!';

            if(errorId ==='EMAIL_NOT_FOUND' || errorId === 'INVALID_PASSWORD'){
                message = 'Email or Password is incorrect'
            }
            if(errorId === 'USER_DISABLED'){
                message = 'Your Account Has Been Locked'
            }
            throw new Error(message);
        }

        const resData = await response.json();
        console.log(resData);
        dispatch(authenticate(
            resData.localId, 
            resData.idToken, 
            parseInt(resData.expiresIn) * 1000));
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData')
    return {type: LOGOUT};
};

const clearLogoutTimer = () => {
    if(timer){
        clearTimeout(timer);
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem(
        'userData', 
        JSON.stringify({
            token: token,
            userId: userId,
            expirationDate: expirationDate.toISOString()
        })
    );
}