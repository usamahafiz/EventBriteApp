import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Explore MoreScreen
import ExploreMoreScreen from '../Screens/Explore/ExploreMoreScreens.js';

// Auth Screens
import LoginScreen from '../Screens/Auth/LoginScreen.js';
import RegisterScreen from '../Screens/Auth/RegisterScreen.js';

// Seller Dashboard Screens
import SellerDashboardScreen from '../Screens/SellerDashboardScreen/SellerDashboardScreen.js';
import AddProduct from '../components/SellerDashboard/AddProduct.js';
import EditProduct from '../components/SellerDashboard/ManageProduct.js';

// Buyerr Dashboard Screens
import BuyerDashboardScreen from '../Screens/BuyerDashboardScreen/BuyerDashboardScreen.js';
import AllProducts from '../components/BuyerDashboard/AllProduct.js';
import ProductDetails from '../components/BuyerDashboard/ProductDetails.js';
// import Cart from '../components/BuyerDashboard/Cart.js';
import BuyerOrder from '../components/BuyerDashboard/BuyerOrder.js';



const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
  <Stack.Navigator screenOptions={{ headerShown: false }}> 
       {/* Exolore More Screen */}
   <Stack.Screen name="ExploreMore" component={ExploreMoreScreen} /> 
  
           {/* Auth Screens */}
   <Stack.Screen name="RegisterScreen" component={RegisterScreen} />  
  <Stack.Screen name="LoginScreen" component={LoginScreen} />  

         {/* Seller Dashboard Screens  */}
  <Stack.Screen name="SellerDashboardScreen" component={SellerDashboardScreen} />
  <Stack.Screen name="AddProduct" component={AddProduct} />
  <Stack.Screen name="EditProduct" component={EditProduct} /> 


           {/* Buyer Dashboard Screens */}
  <Stack.Screen name="BuyerDashboardScreen" component={BuyerDashboardScreen} />
  <Stack.Screen name="ProductDetails" component={ProductDetails} />

  {/* <Stack.Screen name="Cart" component={Cart} />  */}
  <Stack.Screen name="BuyerOrder" component={BuyerOrder} />   
  <Stack.Screen name="AllProducts" component={AllProducts} />  
     
     </Stack.Navigator>
  );
};

export default AppNavigator;

