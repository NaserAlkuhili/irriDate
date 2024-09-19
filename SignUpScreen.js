import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, SafeAreaView } from 'react-native';
import { auth } from './firebaseConfig';  // Import Firebase Auth from your config
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';  // Import necessary auth functions
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';  // Import AntDesign for the arrow icon
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  // Initialize Firestore
  const db = getFirestore();

  // Sign up user and update display name
  const handleSignup = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Update the user's profile with their display name
        await updateProfile(userCredential.user, {
          displayName: name,
        });

        // Create a new user document in Firestore with userDeviceConnection set to false
        const userId = userCredential.user.uid; // Get the userId from Firebase Auth
        await setDoc(doc(db, 'users', userId), {
          name: name,
          email: email,
          userDeviceConnection: false,
        });

        Alert.alert('User signed up successfully!');
        navigation.navigate('Home'); // Navigate to Home after signup
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <ImageBackground 
      source={require('./assets/auth_background.png')}  // Your background image path
      style={styles.backgroundImage} 
      resizeMode="cover"
    >
      {/* Use SafeAreaView to account for device safe areas */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          
          {/* Back Arrow Icon */}
          <TouchableOpacity onPress={() => navigation.navigate('Auth')} style={styles.backButton}>
            <AntDesign name="arrowleft" size={36} color="black" />
          </TouchableOpacity>

          {/* Add the logo */}
          <Image source={require('./assets/irriDate.png')} style={styles.logo} />

          {/* Full Name input */}
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholderTextColor="#999"
          />

          {/* Email input */}
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#999"
          />

          {/* Password input */}
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholderTextColor="#999"
          />

          {/* Sign Up Button */}
          <TouchableOpacity onPress={handleSignup} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Navigate to Sign In */}
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
    backgroundColor: '#44b39d',  // Match button color to theme
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
    top: 10,  // Adjusted to be visible within safe area
    left: 25,  // Properly aligned in the visible part of the screen,
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor: 'white',
    alignItems:"center",
    justifyContent:"center",
  },
});
