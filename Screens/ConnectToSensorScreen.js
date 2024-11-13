import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, ActivityIndicator, Linking, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import * as Notifications from 'expo-notifications'; // For push notifications
import { getFirestore, doc, updateDoc } from 'firebase/firestore'; // Firestore functions
import { getAuth } from 'firebase/auth'; // Firebase Auth
import { app } from '../config/firebaseConfig'; // Import firebaseConfig

// Initialize Firestore
const db = getFirestore(app);
const auth = getAuth(app);

export default function ConnectToSensorScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState(''); // State to hold the URL for WebView
  const [showWebView, setShowWebView] = useState(false); // State to toggle WebView
  const [expoPushToken, setExpoPushToken] = useState(''); // Store expoPushToken here

  // Function to get the expo push token
  const registerForPushNotificationsAsync = async () => {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    setExpoPushToken(token);
  };

  useEffect(() => {
    registerForPushNotificationsAsync(); // Get the push token on mount
  }, []);

  const openWiFiSettings = () => {
    // Open Wi-Fi settings for the user to connect manually
    Linking.openURL('App-Prefs:root=WIFI');
  };

  const openWebPage = () => {
    setUrl('http://192.168.4.1'); 
    setShowWebView(true); // Show the WebView
  };

  const handleBack = async () => {
    setShowWebView(false); // Go back to button screen

    // Send the expoPushToken to the NodeMCU
    try {
      const response = await fetch('http://104.194.99.228/post-expoPushToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: expoPushToken,
        }),
      });
      console.log(response)

      const data = await response.json();
      console.log('Response from NodeMCU:', data);

      // If the NodeMCU request was successful, update Firestore
      if (response.ok) {
        const user = auth.currentUser; // Get the currently authenticated user

        if (user) {
          // Update userDeviceConnection to true in Firestore
          const userDoc = doc(db, 'users', user.uid); 
          await updateDoc(userDoc, {
            userDeviceConnection: true,
          });
          Alert.alert('userDeviceConnection updated in Firestore');
        } else {
          Alert.alert('No authenticated user found');
        }
      } else {
        Alert.alert('Failed to connect device');
      }
    } catch (error) {
      Alert.alert('Error:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!showWebView ? (
        <View style={styles.buttonContainer}>
          <Button title="Open Wi-Fi Settings" onPress={openWiFiSettings} />
          <Button title="Open Web Page" onPress={openWebPage} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <AntDesign name="arrowleft" size={36} color="black" />
          </TouchableOpacity>
          {isLoading && (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
          )}
          <WebView
            source={{ uri: url }}
            style={{ flex: 1 }}
            onLoadStart={() => setIsLoading(true)} // Show loading indicator
            onLoadEnd={() => setIsLoading(false)} // Hide loading indicator
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, 
    padding: 20,
    backgroundColor: 'lightgray',
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 25,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10, 
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
  },
  button: {
    width: '100%',
    backgroundColor: '#44b39d',  
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
