import * as Location from 'expo-location';

useEffect(() => {
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
    }
  };

  requestLocationPermission();
}, []);
