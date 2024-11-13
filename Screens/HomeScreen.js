import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Alert, SafeAreaView, Image} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import colors from '../config/colors';
import { collection, doc, getDoc, setDoc, updateDoc, getFirestore, onSnapshot,} from 'firebase/firestore';
import { auth } from '../config/firebaseConfig'; // Import your Firebase config
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker

export default function HomeScreen() {
  const [data, setData] = useState({
    temperature: [],
    soilMoisture: [],
  });

  const [labels, setLabels] = useState([]);

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
          <Image source={require('../assets/vegetative_stage.png')} style={styles.iconStyle} />
        </View>
      ),
    },
    {
      label: 'Intermediate stage',
      value: '2',
      icon: () => (
        <View style={styles.iconContainer}>
          <Text style={styles.labelText}>Intermediate stage</Text>
          <Image source={require('../assets/intermediate_stage.png')} style={styles.iconStyle} />
        </View>
      ),
    },
    {
      label: 'Fruiting stage',
      value: '3',
      icon: () => (
        <View style={styles.iconContainer}>
          <Text style={styles.labelText}>Fruiting stage</Text>
          <Image source={require('../assets/fruiting_stage.png')} style={styles.iconStyle} />
        </View>
      ),
    },
  ]);

  const db = getFirestore();
  useEffect(() => {
  // Function to fetch data from Firebase
  const fetchData = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Not Authenticated', 'Please sign in to view your data.');
        return;
      }

      const userDocRef = doc(collection(db, 'users'), user.uid);

      // Set up a real-time listener
      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();

          // Log the entire document data for inspection

          if (userData.data && Array.isArray(userData.data)) {
            const temperatureData = userData.data.map(entry => entry.temperature);
            const soilMoistureData = userData.data.map(entry => entry.moisture_level);

            // Handle the timestamp field or generate one if missing
            const timestamps = userData.data.map((entry, index) => {
              if (entry.timestamp) {
                // Assuming timestamp is UNIX timestamp in seconds, convert to milliseconds
                const date = new Date(entry.timestamp * 1000); 
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format as "HH:MM"
              } else {
                // If there's no timestamp, generate one based on the current time
                const now = new Date();
                now.setSeconds(now.getSeconds() - (userData.data.length - index) * 5); // Subtracting 5 seconds for each data point
                return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format as "HH:MM"
              }
            });

            // Check if the data points are valid before setting them
            if (temperatureData.length > 0 && soilMoistureData.length > 0) {
              setData({
                temperature: temperatureData,
                soilMoisture: soilMoistureData,
              });

              // Set the labels for the chart
              setLabels(timestamps);
            } else {
              console.warn('No valid temperature or soil moisture data found.');
            }
          } else {
            console.warn('No data field found or "data" is not an array.');
          }
        } else {
          console.warn('User document does not exist.');
        }
      });

      // Clean up the listener on unmount
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Something went wrong while fetching data.');
    }
  };

  fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

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

      {data.temperature.length > 0 && data.soilMoisture.length > 0 ? (
        <>
          <Text style={styles.subtitle}>Temperature (°C)</Text>
          <LineChart
            data={{
              labels: labels,
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
              labels: labels,
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
        </>
      ) : (
        <Text style={styles.loadingText}>Loading data...</Text>
      )}

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
    alignSelf: 'center',
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
  },
  loadingText: {
    fontSize: 16,
    color: '#6e6e6e',
    marginBottom: 20,
    textAlign: 'center',
  },
});
