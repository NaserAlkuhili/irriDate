import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, SafeAreaView } from 'react-native';
import { auth } from './firebaseConfig';  
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';  
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';  
import { getFirestore, doc, setDoc } from 'firebase/firestore'; 
import * as Notifications from 'expo-notifications';  
import * as Device from 'expo-device';  
import Constants from 'expo-constants';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [expoPushToken, setExpoPushToken] = useState(null); 
  const navigation = useNavigation();

  const db = getFirestore();

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      setExpoPushToken(token);
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }

    return token;
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const handleSignup = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await updateProfile(userCredential.user, {
          displayName: name,
        });

        const userId = userCredential.user.uid; 
        await setDoc(doc(db, 'users', userId), {
          name: name,
          email: email,
          userDeviceConnection: false,
          expoPushToken: expoPushToken,  
          password: password
        });

        navigation.navigate('Home'); 
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <ImageBackground 
      source={require('./assets/auth_background.png')}  
      style={styles.backgroundImage} 
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          
          <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={styles.backButton}>
            <AntDesign name="arrowleft" size={36} color="black" />
          </TouchableOpacity>

          <Image source={require('./assets/irriDate.png')} style={styles.logo} />

          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#999"
          />

          <TouchableOpacity onPress={handleSignup} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text
            style={styles.signUpText}
            onPress={() => navigation.navigate('Auth')}
          >
            Already have an account? Sign In
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
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
  signUpText: {
    marginTop: 20,
    color: '#44b39d',
    textAlign: 'center',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 10,  
    left: 25,
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor: 'white',
    alignItems:"center",
    justifyContent:"center",
  },
});
