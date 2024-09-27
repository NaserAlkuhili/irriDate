import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();  // Use navigation hook

  // Sign in user
  const handleSignin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('User signed in!');
        navigation.navigate('Home');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <ImageBackground 
      source={require('./assets/auth_background.png')}  // Use your image here
      style={styles.backgroundImage} 
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Add the logo */}
        <Image source={require('./assets/irriDate.png')} style={styles.logo} />

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

        {/* Sign In Button */}
        <TouchableOpacity onPress={handleSignin} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Navigate to Sign Up */}
        <Text
          style={styles.signUpText}
          onPress={() => navigation.navigate('SignUp')}
        >
          Don't have an account? Sign Up
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 250
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
  
});
