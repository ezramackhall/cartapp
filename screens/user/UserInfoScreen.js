import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import {useSelector} from 'react-redux';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';

import HeaderButton from '../../components/ui/HeaderButton';

const UserInfoScreen = props => {
    const user = useSelector(state => state.auth.userData);
    if(user){
        return (
            <SafeAreaView style={styles.screen}>
                <View>
                    <Text>
                        Role: {user.isNanny ? 'Nanny' : 'Client'}
                    </Text>
                    <Text>
                        E-mail: {user.email}
                    </Text>
                    <Text>
                        First Name: {user.firstName}
                    </Text>
                    <Text>
                        Last Name: {user.lastName}
                    </Text>
                    <Text>
                        Address: {user.address}
                    </Text>
                    <Text>
                        Postal Code: {user.postalCode.toUpperCase()}
                    </Text>
                    <Text>
                        City: {user.city}
                    </Text>
                    <Text>
                        Province: {user.province}
                    </Text>
                    <Text>
                        Country: {user.country}
                    </Text>
                </View>
            </SafeAreaView>
        );
    }
    return (
        <View>

        </View>
    )
};

UserInfoScreen.navigationOptions = navData => {
    return {
        headerTitle: "User Info",
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item 
                    title='Menu' 
                    iconName='ios-menu' 
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
            )
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1, 
        margin: 20
    }
});

export default UserInfoScreen;