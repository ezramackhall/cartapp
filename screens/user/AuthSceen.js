import React, {useReducer, useCallback, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, KeyboardAvoidingView, Button, Image, ActivityIndicator, Alert} from 'react-native';
import {useDispatch} from 'react-redux';

import Input from '../../components/ui/Input';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import { set } from 'react-native-reanimated';

const FORM_UPDATE = 'UPDATE';

const formReducer = (state, action) => {
    if(action.type === FORM_UPDATE){
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }; 
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        };
    } 
    return state;
};

const AuthScreen = props => {
    const [isSignup, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        }, 
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
     });

     const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    const authHandler = async () => {
        setError(null);
        setIsLoading(true);
        try{
            if(isSignup){
                await dispatch(
                    authActions.signup(
                        formState.inputValues.email, 
                        formState.inputValues.password
                    )
                );
            }else{
                await dispatch(
                    authActions.login(
                        formState.inputValues.email, 
                        formState.inputValues.password
                    )
                );
            }
            props.navigation.navigate('Shop');
        } catch (error){
            console.log(error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(()=> {
        if(error){
            Alert.alert('An Error Occured!', error, [{text: 'Okay'}])
        }
    }, [error])

    return (
        <KeyboardAvoidingView 
            behavior='padding' 
            keyboardVerticalOffset={50}
            style={styles.screen} 
        >
            <ScrollView>
            <Image style={styles.image} source={{ uri: 'https://static.wixstatic.com/media/4733a0_921de2412f034da1b762a6e6b6e2c9e6~mv2_d_3514_2350_s_2.png/v1/fill/w_388,h_259,al_c,usm_0.66_1.00_0.01/WinnipegPoppinsblk.png' }}/>
                <View style={styles.authContainer}>
                    <Input 
                        id='email' 
                        label='E-mail' 
                        keyboardType = 'email-address' 
                        required
                        email
                        autoCapitalize="none"
                        errorText="Please Enter A Valid Email Address"
                        initialValue = ''
                        onInputChange= {inputChangeHandler}
                    />
                    <Input 
                        id='password' 
                        label='Password' 
                        keyboardType = 'default'
                        secureTextEntry
                        required
                        minLength={6}
                        errorText="Please Enter A Valid Password"
                        initialValue = ''
                        onInputChange= {inputChangeHandler}
                    />
                    <View style = {styles.buttonContainer}>
                        {
                            isLoading ? 
                            <ActivityIndicator size='small' color={Colors.primary}/> : 
                            <Button 
                                title ={isSignup ? 'Sign-Up' : 'Login'} 
                                color ={Colors.primary} 
                                onPress={authHandler}
                            />
                        }
                        <Button 
                            title={isSignup ? 'Switch to Login' : 'Switch to Sign Up'} 
                            color={Colors.primary} 
                            onPress={() => {
                                setIsSignUp(prevState => !prevState)
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

AuthScreen.navigationOptions = {
    headerTitle: 'Authorization Screen'
}

const styles = StyleSheet.create({
    authContainer: {
        margin: 20,
        padding: 10
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        margin: 20,
        width: 300,
        height: 200
    },
    buttonContainer: {
        marginVertical: 20
    }

});

export default AuthScreen;