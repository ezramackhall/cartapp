import React from 'react';
import {Platform, SafeAreaView, Button, View} from 'react-native';
import { Ionicons} from '@expo/vector-icons'
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import { createDrawerNavigator, DrawerItems} from 'react-navigation-drawer';
import {useDispatch} from 'react-redux'

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailsScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductsScreen from "../screens/user/EditProductsScreen";
import AuthScreen from '../screens/user/AuthSceen';
import StartUpScreen from '../screens/user/StartUpScreen';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';


const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android'  ? Colors.primary : ''
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailsScreen,
    Cart: CartScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => 
            <Ionicons
                name='ios-cart'
                size={23}
                color={drawerConfig.tintColor}
            />  
    },
    defaultNavigationOptions: defaultNavOptions
    }
);

const OrdersNavigator = createStackNavigator({
    Orders: OrdersScreen
},{
    navigationOptions: {
        drawerIcon: drawerConfig => 
            <Ionicons
                name='ios-list'
                size={23}
                color={drawerConfig.tintColor}
            />  
    },
    defaultNavigationOptions: defaultNavOptions
});

const UserNavigator = createStackNavigator({
    UserProducts: UserProductsScreen,
    EditProduct: EditProductsScreen
},{
    navigationOptions: {
        drawerIcon: drawerConfig => 
            <Ionicons
                name='ios-man'
                size={23}
                color={drawerConfig.tintColor}
            />  
    },
    defaultNavigationOptions: defaultNavOptions
});

const ShopNavigator = createDrawerNavigator ({
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: UserNavigator
},{
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        return (
            <View style={{flex:1, paddingTop: 20}}>
                <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                    <DrawerItems {...props}/>
                    <Button 
                        title="Logout" 
                        color={Colors.primary} 
                        onPress={()=>{
                            dispatch(authActions.logout());
                        }}
                    />
                </SafeAreaView>
            </View>
        )
    }
});

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
});

const MainNavigator = createSwitchNavigator({
    Start: StartUpScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
})

export default createAppContainer(MainNavigator)