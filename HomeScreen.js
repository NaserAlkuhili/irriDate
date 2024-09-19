// import { Button, StyleSheet, Text, View, Alert, TextInput, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
// import { usePushNotifications } from './usePushNotification';
// import React, { useState } from 'react';

// export default function HomeScreen() {
//   const { expoPushToken, notification } = usePushNotifications();

//   // State for three inputs: temperature, moisture, and growth_stage
//   const [temperature, setTemperature] = useState('');
//   const [moisture, setMoisture] = useState('');
//   const [growthStage, setGrowthStage] = useState('');

//   // Function to send prediction request
//   async function sendPrediction() {
//     if (!expoPushToken?.data) {
//       Alert.alert('Error', 'No push token available!');
//       return;
//     }

//     try {
//       const response = await fetch('https://irridate-backend.onrender.com/predict', {  // Update this URL if needed
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           input_value: [parseFloat(temperature), parseFloat(moisture), parseFloat(growthStage)], 
//           expo_push_token: expoPushToken.data,
//         }),
//       });


//       const data = await response.json();

//       if (data.notification_sent) {
//         Alert.alert('Notification sent based on prediction!');
//       } else {
//         Alert.alert('Prediction was 0, no notification sent.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Could not send request');
//     }
//   }

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//           <View style={styles.container}>
//       <Image source={require("/Users/nfk/my-new-project/assets/irriDate.png")} style={{ width: 100, height: 100 }} />
//       <Text>Token: {expoPushToken?.data ?? ''}</Text>

//       <View style={styles.inputContainer}>
//         <Text>Temperature</Text>
//         <TextInput
//           style={styles.TextInput}
//           keyboardType="decimal-pad"
//           placeholder="Enter temperature"
//           value={temperature}
//           onChangeText={(text) => setTemperature(text)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>Moisture</Text>
//         <TextInput
//           style={styles.TextInput}
//           keyboardType="decimal-pad"
//           placeholder="Enter moisture"
//           value={moisture}
//           onChangeText={(text) => setMoisture(text)}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Text>Growth Stage</Text>
//         <TextInput
//           style={styles.TextInput}
//           keyboardType="decimal-pad"
//           placeholder="Enter growth stage"
//           value={growthStage}
//           onChangeText={(text) => setGrowthStage(text)}
//         />
//       </View>

//       <Button title="Send Prediction" onPress={sendPrediction} />
//     </View>

//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   inputContainer: {
//     width: '80%',
//     margin: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//   },
//   TextInput: {
//     width: '100%',
//     height: 40,
//     paddingHorizontal: 10,
//   },
// });

import { Button, StyleSheet, Text, View, Alert, TextInput, Image, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ImageBackground } from 'react-native';
import { usePushNotifications } from './usePushNotification';
import React, { useState } from 'react';
import { auth } from './firebaseConfig';  // Assuming you have Firebase Auth setup
import { signOut } from 'firebase/auth';  // Firebase sign-out function
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const { expoPushToken, notification } = usePushNotifications();
  const navigation = useNavigation();

  // State for three inputs: temperature, moisture, and growth_stage
  const [temperature, setTemperature] = useState('');
  const [moisture, setMoisture] = useState('');
  const [growthStage, setGrowthStage] = useState('');

  // Function to send prediction request
  async function sendPrediction() {
    if (!expoPushToken?.data) {
      Alert.alert('Error', 'No push token available!');
      return;
    }

    try {
      const response = await fetch('https://irridate-backend.onrender.com/predict', {  // Update this URL if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_value: [parseFloat(temperature), parseFloat(moisture), parseFloat(growthStage)], 
          expo_push_token: expoPushToken.data,
        }),
      });

      const data = await response.json();

      if (data.notification_sent) {
        Alert.alert('Notification sent based on prediction!');
      } else {
        Alert.alert('Prediction was 0, no notification sent.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not send request');
    }
  }

  // Function to handle sign-out
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        Alert.alert('Signed Out');
        navigation.navigate('Auth');  // Navigate back to the Auth screen
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{flex:1}}>
        <ImageBackground 
          source={require('./assets/auth_background.png')}  // Your background image path
          style={styles.backgroundImage} 
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Image source={require("./assets/irriDate.png")} style={styles.logo} />

            <Text>Token: {expoPushToken?.data ?? ''}</Text>

            {/* Temperature input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Temperature</Text>
              <TextInput
                style={styles.TextInput}
                keyboardType="decimal-pad"
                placeholder="Enter temperature"
                value={temperature}
                onChangeText={(text) => setTemperature(text)}
                placeholderTextColor="#999"
              />
            </View>

            {/* Moisture input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Moisture</Text>
              <TextInput
                style={styles.TextInput}
                keyboardType="decimal-pad"
                placeholder="Enter moisture"
                value={moisture}
                onChangeText={(text) => setMoisture(text)}
                placeholderTextColor="#999"
              />
            </View>

            {/* Growth Stage input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Growth Stage</Text>
              <TextInput
                style={styles.TextInput}
                keyboardType="decimal-pad"
                placeholder="Enter growth stage"
                value={growthStage}
                onChangeText={(text) => setGrowthStage(text)}
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity onPress={sendPrediction} style={styles.button}>
              <Text style={styles.buttonText}>Send Prediction</Text>
            </TouchableOpacity>

            {/* Sign out button */}
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
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
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '100%',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  TextInput: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
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
  signOutButton: {
    width: '100%',
    backgroundColor: '#e74c3c',  // Red color for sign out button
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
