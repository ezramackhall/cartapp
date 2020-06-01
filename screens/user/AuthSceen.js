import React, {useReducer, useCallback, useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View, KeyboardAvoidingView, Button, Image, ActivityIndicator, Alert, Text} from 'react-native';
import {useDispatch} from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import RNPickerSelect from 'react-native-picker-select';

import Input from '../../components/ui/Input';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

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
    const [cityPicker, setCityPick] = useState('');
    const [provincePicker, setProvincePick] = useState('');
    const [countryPicker, setCountryPick] = useState('');
    const cityData = [
        {label: 'Winnipeg', value: 'Winnipeg'},
        {label: 'Brandon', value: 'Brandon'},
    ];
    const provinceData = [
        {label: 'Manitoba', value: 'Manitoba'},
        {label: 'Saskpoo', value: 'Saskpoo'},
    ];
    const countryData = [
        {label: 'Canada', value: 'Canada'},
        {label: 'United States', value: 'United States'},
    ];
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            postalCode: '',
            address: '',
            city: '',
            province: '',
            country: ''
        }, 
        inputValidities: {
            email: false,
            password: false,
            firstName: false,
            lastName: false,
            postalCode: false,
            address: false,
            city: false,
            province: false,
            country: false
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
                        formState.inputValues.password,
                        formState.inputValues.firstName, 
                        formState.inputValues.lastName,
                        formState.inputValues.address,
                        formState.inputValues.postalCode,
                        formState.inputValues.city, 
                        formState.inputValues.province,
                        formState.inputValues.country
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

        const placeholder = {
          label: 'Select a value...',
          value: null,
          color: '#9EA0A4',
        };

    return (
        <KeyboardAvoidingView 
            behavior='padding' 
            keyboardVerticalOffset={50}
            style={styles.screen} 
        >
            <ScrollView>
            {!isSignup && <Image style={styles.image} source={{ uri: 'https://static.wixstatic.com/media/4733a0_921de2412f034da1b762a6e6b6e2c9e6~mv2_d_3514_2350_s_2.png/v1/fill/w_388,h_259,al_c,usm_0.66_1.00_0.01/WinnipegPoppinsblk.png' }}/>}
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
                    {isSignup && 
                    (<View>
                        <Input 
                            id='firstName' 
                            label='First Name' 
                            keyboardType = 'default'
                            required
                            minLength={1}
                            errorText="Please Enter A Valid Name"
                            initialValue = ''
                            onInputChange= {inputChangeHandler}
                        />
                        <Input 
                            id='lastName' 
                            label='Last Name' 
                            keyboardType = 'default'
                            required
                            minLength={1}
                            errorText="Please Enter A Valid Name"
                            initialValue = ''
                            onInputChange= {inputChangeHandler}
                        />
                        <Input 
                            id='address' 
                            label='Address' 
                            keyboardType = 'default'
                            required
                            minLength={1}
                            errorText="Please Enter A Valid Address"
                            initialValue = ''
                            onInputChange= {inputChangeHandler}
                        />
                        <Input 
                            id='postalCode' 
                            label='Postal Code' 
                            keyboardType = 'default'
                            postalCode
                            required
                            errorText="Please Enter A Valid Postal Code"
                            initialValue = ''
                            onInputChange= {inputChangeHandler}
                        />
                        <Text style = {styles.label}>City</Text>
                        <RNPickerSelect
                            placeholder={placeholder}
                            items={cityData}
                            onValueChange={value => { 
                                setCityPick(value);
                                inputChangeHandler('city', value, true);
                            }}
                            InputAccessoryView={() => null}
                            style={pickerSelectStyles}
                            value={cityPicker}
                        />
                        <Text style = {styles.label}>Province</Text>
                        <RNPickerSelect
                            placeholder={placeholder}
                            items={provinceData}
                            onValueChange={value => { 
                                setProvincePick(value);
                                inputChangeHandler('province', value, true);
                            }}
                            InputAccessoryView={() => null}
                            style={pickerSelectStyles}
                            value={provincePicker}
                        />
                        <Text style = {styles.label}>Country</Text>
                        <RNPickerSelect
                            placeholder={placeholder}
                            items={countryData}
                            onValueChange={value => { 
                                setCountryPick(value);
                                inputChangeHandler('country', value, true);
                            }}
                            InputAccessoryView={() => null}
                            style={pickerSelectStyles}
                            value={countryPicker}
                        />
                    </View>
                    )}
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
    headerTitle: 'Spoonfull of Sugar Nannies'
}

const styles = StyleSheet.create({
    authContainer: {
        width: '100%',
        padding: 20
    },
    image: {
        margin: 20,
        marginLeft: 30,
        width: 300,
        height: 200
    },
    buttonContainer: {
        marginVertical: 20
    },
    label: {
        fontSize: 18,
        marginVertical: 8
    }

});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    }
});

export default AuthScreen;