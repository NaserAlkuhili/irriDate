// // import { Button, StyleSheet, Text, View, Alert, TextInput, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
// // import { usePushNotifications } from './usePushNotification';
// // import React, { useState } from 'react';

// // export default function App() {
// //   const { expoPushToken, notification } = usePushNotifications();

// //   // State for three inputs: temperature, moisture, and growth_stage
// //   const [temperature, setTemperature] = useState('');
// //   const [moisture, setMoisture] = useState('');
// //   const [growthStage, setGrowthStage] = useState('');

// //   // Function to send prediction request
// //   async function sendPrediction() {
// //     if (!expoPushToken?.data) {
// //       Alert.alert('Error', 'No push token available!');
// //       return;
// //     }

// //     try {
// //       const response = await fetch('https://irridate-backend.onrender.com/predict', {  // Update this URL if needed
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           input_value: [parseFloat(temperature), parseFloat(moisture), parseFloat(growthStage)], 
// //           expo_push_token: expoPushToken.data,
// //         }),
// //       });


// //       const data = await response.json();
// //       console.log(data.notification_sent)
// //       if (data.notification_sent) {
// //         Alert.alert('Notification sent based on prediction!');
// //       } else {
// //         Alert.alert('Prediction was 0, no notification sent.');
// //       }
// //     } catch (error) {
// //       console.log(error);
// //       Alert.alert('Error', 'Could not send request');
// //     }
// //   }

// //   return (
// //     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
// //           <View style={styles.container}>
// //       <Image source={require("/Users/nfk/my-new-project/assets/irriDate.png")} style={{ width: 100, height: 100 }} />
// //       <Text>Token: {expoPushToken?.data ?? ''}</Text>

// //       <View style={styles.inputContainer}>
// //         <Text>Temperature</Text>
// //         <TextInput
// //           style={styles.TextInput}
// //           keyboardType="decimal-pad"
// //           placeholder="Enter temperature"
// //           value={temperature}
// //           onChangeText={(text) => setTemperature(text)}
// //         />
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text>Moisture</Text>
// //         <TextInput
// //           style={styles.TextInput}
// //           keyboardType="decimal-pad"
// //           placeholder="Enter moisture"
// //           value={moisture}
// //           onChangeText={(text) => setMoisture(text)}
// //         />
// //       </View>

// //       <View style={styles.inputContainer}>
// //         <Text>Growth Stage</Text>
// //         <TextInput
// //           style={styles.TextInput}
// //           keyboardType="decimal-pad"
// //           placeholder="Enter growth stage"
// //           value={growthStage}
// //           onChangeText={(text) => setGrowthStage(text)}
// //         />
// //       </View>

// //       <Button title="Send Prediction" onPress={sendPrediction} />
// //     </View>

// //     </TouchableWithoutFeedback>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   inputContainer: {
// //     width: '80%',
// //     margin: 10,
// //     padding: 10,
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //     borderRadius: 8,
// //   },
// //   TextInput: {
// //     width: '100%',
// //     height: 40,
// //     paddingHorizontal: 10,
// //   },
// // });

// // import React, { useState, useEffect } from 'react';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { createStackNavigator } from '@react-navigation/stack';
// // import { getAuth, onAuthStateChanged } from 'firebase/auth';
// // import { View, ActivityIndicator } from 'react-native';
// // import AuthScreen from './AuthScreen';  // Import your AuthScreen (login)
// // import SignUpScreen from './SignUpScreen';  // Import your SignUpScreen (sign up)
// // import HomeScreen from './HomeScreen';  // Import your HomeScreen
// // import { auth } from './firebaseConfig';  // Import the initialized Firebase auth from firebaseConfig

// // const Stack = createStackNavigator();

// // export default function App() {
// //   const [initializing, setInitializing] = useState(true);
// //   const [user, setUser] = useState(null);

// //   // Handle user state changes
// //   useEffect(() => {
// //     const subscriber = onAuthStateChanged(auth, (user) => {
// //       setUser(user);
// //       if (initializing) setInitializing(false);
// //     });
// //     return subscriber; // Unsubscribe on unmount
// //   }, []);

// //   if (initializing) return <ActivityIndicator size="large" />;

// //   return (
// //     <NavigationContainer>
// //       <Stack.Navigator>
// //         {!user ? (
// //           <>
// //             <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
// //             <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            
// //           </>
// //         ) : (
// //           <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
// //         )}
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );
// // }


// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import { View, ActivityIndicator } from 'react-native';

// import AuthScreen from './AuthScreen';  
// import SignUpScreen from './SignUpScreen';  
// import HomeScreen from './HomeScreen';  
// import { auth } from './firebaseConfig';  
// import TakePictureScreen from './TakePictureScreen';  
// import CustomTabBar from './CustomTabBar';  // Import the new custom tab bar
// import ConnectToSensorScreen from './ConnectToSensorScreen';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// export default function App() {
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const subscriber = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       setInitializing(false);
//     });
//     return subscriber; // Unsubscribe on unmount
//   }, []);

//   if (initializing) return <ActivityIndicator size="large" />;

//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         screenOptions={{ headerShown: false }}
//         tabBar={(props) => <CustomTabBar {...props} />}  // Use the custom tab bar
//       >
//         <Tab.Screen name="TakePicture" component={TakePictureScreen} options={{ title: 'Plant Health' }} />
//         {user ? (
//           <Tab.Screen name="Home" component={HomeScreen} />
//         ) : (
//           <Tab.Screen name="Auth" component={AuthStack} />
//         )}
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

// // Stack for Auth and SignUp screens
// function AuthStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Auth" component={AuthScreen} />
//       <Stack.Screen name="SignUp" component={SignUpScreen} />
//       <Stack.Screen name="ConnectToSensor" component={ConnectToSensorScreen} />

//     </Stack.Navigator>
//   );
// }



import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

import AuthScreen from './AuthScreen';  
import SignUpScreen from './SignUpScreen';  
import HomeScreen from './HomeScreen';  
import { auth } from './firebaseConfig';  
import TakePictureScreen from './TakePictureScreen';  
import CustomTabBar from './CustomTabBar';  // Import the custom tab bar
import { getFirestore } from 'firebase/firestore'; // Firestore initialization
import ConnectToSensorScreen from './ConnectToSensorScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [userDeviceConnected, setUserDeviceConnected] = useState(false);
  const db = getFirestore();  // Initialize Firestore

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // If user is authenticated, check the userDeviceConnection in Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserDeviceConnected(data.userDeviceConnection || false);
        } else {
          Alert.alert('Error', 'User data not found!');
        }
      }
      setInitializing(false);
    });

    return subscriber; // Unsubscribe on unmount
  }, []);

  if (initializing) return <ActivityIndicator size="large" />;

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <CustomTabBar {...props} />}  // Use the custom tab bar
      >
        <Tab.Screen name="TakePicture" component={TakePictureScreen} options={{ title: 'Plant Health' }} />
        
        {user ? (
          userDeviceConnected ? (  // If userDeviceConnected is true, show HomeScreen
            <Tab.Screen name="Home" component={HomeScreen} />
          ) : (  // If userDeviceConnected is false, show ConnectToSensor screen
            <Tab.Screen name="ConnectToSensor" component={ConnectToSensorScreen} />
          )
        ) : (
          <Tab.Screen name="Auth" component={AuthStack} />
        )}
      </Tab.Navigator>
    </NavigationContainer>
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

