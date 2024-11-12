import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import colors from '../config/colors';
import { useNavigation } from '@react-navigation/native';
import Backend_Server_IP from '../config/Backend_Server_IP';

export default function TakePictureScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const navigation = useNavigation();

  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, 
      aspect: [1, 1], 
      quality: 1, 
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPredictionResult(null)
    }
  };
  
  const takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, 
      aspect: [1, 1], 
      quality: 1, 
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPredictionResult(null); 
    }
  };
  

  const handleContinue = async () => {
    if (!image) {
      Alert.alert('No image selected', 'Please upload or take a picture before continuing.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'palm_tree.jpg'
      });

      const response = await axios.post(`${Backend_Server_IP}/predict_plant_health`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const result = response.data.prediction;

      navigation.navigate('ResultsScreen', { imageUri: image, predictionResult: result });

    } catch (error) {
      Alert.alert('Error', 'Something went wrong while uploading the image.');
      console.error(error);
    } finally {
      setLoading(false); 
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload a Photo of Your Palm Tree 🌴</Text>
      <Text style={styles.subtitle}>
        Please upload a clear photo of your palm tree. The image will be analyzed to detect any signs of disease or confirm the tree's health.
      </Text>

      <TouchableOpacity style={styles.cameraBox} onPress={takePicture}>
        {image ? (
          <Image source={{ uri: image }} style={styles.uploadedImage} />
        ) : (
          <>
            <MaterialIcons name="camera-alt" size={40} color={styles.placeholderText.color} />
            <Text style={styles.placeholderText}>Take a picture</Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>or</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Upload one from your photos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" /> // Show spinner when loading
        ) : (
          <Text style={styles.continueButtonText}>Continue</Text>
        )}
      </TouchableOpacity>
{/* 
      {predictionResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Prediction Result:</Text>
          <Text style={styles.result}>{JSON.stringify(predictionResult, null, 2)}</Text>
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: colors.primaryColor,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6e6e6e',
  },
  cameraBox: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: colors.lightGrey,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6e6e6e',
    marginTop: 10,
  },
  orText: {
    fontSize: 16,
    color: '#6e6e6e',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: colors.primaryColor,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 30,
  },
  uploadButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: colors.primaryColor,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  continueButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.lightGrey,
    width: '100%',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryColor,
  },
  result: {
    fontSize: 16,
    color: '#6e6e6e',
    marginTop: 5,
    textAlign: 'center',
  },
});
