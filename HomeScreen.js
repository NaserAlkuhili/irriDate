import React, { useState } from 'react';
import { View, Text, Dimensions, ScrollView, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Image } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import colors from './colors'; // Assuming you have a colors file for consistent color usage
import { collection, doc, getDoc, setDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { auth } from './firebaseConfig'; // Import your Firebase config
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker

export default function HomeScreen() {
  
  // Artificial sensor data for temperature and soil moisture
  const data = {
    time: ['9:00', '9:05', '9:10', '9:15', '9:20', '9:25'],
    temperature: [29, 30, 31, 32, 33, 34],
    soilMoisture: [450, 460, 470, 480, 490, 500],
  };

  const [growthStage, setGrowthStage] = useState('Pick growth stage of your palms'); // Button label for growth stage
  const [open, setOpen] = useState(false); // State to toggle dropdown visibility
  const [value, setValue] = useState(null); // Selected dropdown value
  const [items, setItems] = useState([
    { 
      label: 'Vegetative stage', 
      value: '1', 
      icon: () => (
        <View style={styles.iconContainer}>
          <Text style={styles.labelText}>Vegetative stage</Text>
          <Image source={require('./assets/vegetative_stage.png')} style={styles.iconStyle} />
        </View>
      )
    },
    { 
      label: 'Intermediate stage', 
      value: '2', 
      icon: () => (
        <View style={styles.iconContainer}>
          <Text style={styles.labelText}>Intermediate stage</Text>
          <Image source={require('./assets/intermediate_stage.png')} style={styles.iconStyle} />
        </View>
      ) 
    },
    { 
      label: 'Fruiting stage', 
      value: '3', 
      icon: () => (
        <View style={styles.iconContainer}>
          <Text style={styles.labelText}>Fruiting stage</Text>
          <Image source={require('./assets/fruiting_stage.png')} style={styles.iconStyle} />
        </View>
      ) 
    }
  ]); 

  const db = getFirestore();

  const handleGrowthStageSelect = async (stage) => {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Not Authenticated', 'Please sign in to select a growth stage.');
        return;
      }

      const userDocRef = doc(collection(db, 'users'), user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // If the document exists, update the growthStage
        await updateDoc(userDocRef, {
          growthStage: stage,
        });
      } else {
        // If the document doesn't exist, create a new one
        await setDoc(userDocRef, {
          growthStage: stage,
        });
      }

      setGrowthStage(`Growth Stage: ${stage}`);
    } catch (error) {
      console.error('Error updating growth stage:', error);
      Alert.alert('Error', 'Something went wrong while updating the growth stage.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Smart Irrigation Dashboard</Text>

      <Text style={styles.subtitle}>Temperature (°C)</Text>
      <LineChart
        data={{
          labels: data.time,
          datasets: [
            {
              data: data.temperature,
            },
          ],
        }}
        width={Dimensions.get('window').width - 40} // Width of the graph
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: colors.lightGrey,
          backgroundGradientTo: colors.lightGrey,
          decimalPlaces: 1, // Optional, defaults to 2 decimal places
          color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`, // Color of temperature line (tomato)
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
        }}
        bezier
        style={styles.graphStyle}
      />

      <Text style={styles.subtitle}>Soil Moisture</Text>
      <LineChart
        data={{
          labels: data.time,
          datasets: [
            {
              data: data.soilMoisture,
            },
          ],
        }}
        width={Dimensions.get('window').width - 40} // Width of the graph
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: colors.lightGrey,
          backgroundGradientTo: colors.lightGrey,
          decimalPlaces: 0, // No decimal places for soil moisture
          color: (opacity = 1) => `rgba(66, 135, 245, ${opacity})`, // Color of soil moisture line (blue)
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Label color
        }}
        bezier
        style={styles.graphStyle}
      />

      {/* Growth Stage Dropdown */}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onChangeValue={(val) => {
          setGrowthStage(`Growth Stage: ${val}`);
          handleGrowthStageSelect(val);
        }}
        placeholder={growthStage}
        style={styles.dropdownStyle}
        dropDownContainerStyle={styles.dropDownContainerStyle}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#6e6e6e',
    marginBottom: 10,
    textAlign: 'center',
  },
  graphStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  dropdownStyle: {
    backgroundColor: '#fafafa',
    width: Dimensions.get('window').width - 40,
    borderColor: colors.primaryColor,
    alignSelf: "center"
  },
  dropDownContainerStyle: {
    backgroundColor: '#fafafa',
    borderColor: colors.primaryColor,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align text to the left and image to the right
    alignItems: 'center',
    width: '100%', // Ensure the container spans the width of the dropdown
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  labelText: {
    flex: 1, // Make sure the text takes up available space
  }
});

