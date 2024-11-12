import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator, Alert, LogBox} from 'react-native';
import { doc, getDoc, onSnapshot } from 'firebase/firestore'; // Import Firestore functions


import AuthScreen from './Screens/AuthScreen';  
import SignUpScreen from './Screens/SignUpScreen';  
import HomeScreen from './Screens/HomeScreen';  
import { auth } from './config/firebaseConfig';  
import TakePictureScreen from './Screens/TakePictureScreen';  
import CustomTabBar from './CustomTabBar';  // Import the custom tab bar
import { getFirestore } from 'firebase/firestore'; // Firestore initialization
import ConnectToSensorScreen from './Screens/ConnectToSensorScreen';
import CommunityScreen from './Screens/CommunityScreen';
import CreatePostScreen from './Screens/CreatePostScreen';
import ResultsScreen from './Screens/ResultsScreen';  // Import ResultsScreen

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
LogBox.ignoreAllLogs(true);

// Stack for Community-related screens
function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommunityFeed" component={CommunityScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Create a Post' }} />
    </Stack.Navigator>
  );
}

// Stack for TakePictureScreen and ResultsScreen
function PictureStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TakePicture" component={TakePictureScreen} />
      <Stack.Screen name="ResultsScreen" component={ResultsScreen} />
    </Stack.Navigator>
  );
}

// Stack for Auth and SignUp screens
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [userDeviceConnected, setUserDeviceConnected] = useState(false);
  const db = getFirestore();  // Initialize Firestore

  useEffect(() => {
    // Listen for authentication state changes
    const subscriber = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // If user is authenticated, start a Firestore listener to track userDeviceConnection
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setUserDeviceConnected(data.userDeviceConnection || false);
          } else {
            Alert.alert('Error', 'User data not found!');
          }
        });

        // Unsubscribe from the Firestore listener when the component unmounts
        return unsubscribe;
      }
      setInitializing(false);
    });

    return subscriber; // Unsubscribe from auth state change listener on unmount
  }, []);

  if (initializing) return <ActivityIndicator size="large" />;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}  // Use the custom tab bar
      >
          {user ? (
          userDeviceConnected ? (  // If userDeviceConnected is true, show HomeScreen 
            <Tab.Screen name="Home" component={HomeScreen} />
           ) : (  // If userDeviceConnected is false, show ConnectToSensor screen
             <Tab.Screen name="Connect to the sensor" component={ConnectToSensorScreen} />
          )
        ) : (
          <Tab.Screen name="Auth" component={AuthStack} />
        )} 
        {/* <Tab.Screen name="Home" component={HomeScreen} /> */}

        {/* Stack for Taking Pictures and Viewing Results */}
        <Tab.Screen name="TakePicture" component={PictureStack} options={{ title: 'Plant Health' }} />
        
        {/* Community Stack */}
        <Tab.Screen name="Community" component={CommunityStack} options={{ title: 'Community Feed' }} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}
