import React, {useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Linking} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../config/colors'; 

export default function ResultsScreen({ route }) {
  const { imageUri, predictionResult } = route.params; 
  const navigation = useNavigation();  
  const [isLoading, setIsLoading] = useState(false);

  // Function to find the index of the maximum probability
  function argMax(array) {
    let maxIndex = 0;
    let maxValue = array[0];
  
    for (let i = 1; i < array.length; i++) {
      if (array[i] > maxValue) {
        maxValue = array[i];
        maxIndex = i;
      }
    }
  
    return maxIndex;
  }
  
  // Labels for classes
  const prob_to_class = ['Potassium Deficiency', 'Manganese Deficiency', 'Magnesium Deficiency', 
                          'Black Scorch', 'Leaf Spots', 'Fusarium Wilt', 'Rachis Blight', 
                          'Parlatoria Blanchardi', 'Healthy', "No Plants detected"];

  const class_treatment = {'Potassium Deficiency': 'https://edis.ifas.ufl.edu/publication/EP269', 'Manganese Deficiency': 'https://edis.ifas.ufl.edu/publication/EP267',
  'Magnesium Deficiency': 'https://edis.ifas.ufl.edu/publication/EP266', 'Black Scorch': 'https://apsjournals.apsnet.org/doi/10.1094/PDIS-05-16-0645-RE#:~:text=To%20manage%20black%20scorch%20disease,UAE%2C%20and%20to%20control%20T.',
  'Leaf Spots': 'https://edis.ifas.ufl.edu/publication/PP142', 'Fusarium':'https://www.bartlett.com/resources/fusarium-wilt-of-palms.pdf',
  'Rachis Blight': 'https://edis.ifas.ufl.edu/publication/PP145', 'Parlatoria Blanchardi':'https://www.saillog.co/PalmDateScale.html'}
  
  // Get the index of the class with the highest probability
  const maxIndex = argMax(predictionResult);
  const predictedClass = prob_to_class[maxIndex];

  // Determine the message and color based on the predicted class
  let message = '';
  let classColor = colors.black; // Default color is black for no plant detected

  if (predictedClass === 'Healthy') {
    message = `Your tree is ${predictedClass}`;
    classColor = colors.green; // Green for healthy
  } else if (predictedClass === "No Plants detected") {
    message = "No plants was detected";
  } else {
    message = `Your tree has ${predictedClass}`;
    classColor = colors.red; // Red for diseases
  }

 
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Palm Tree Health Analysis 🌴</Text>

      <Image source={{ uri: imageUri }} style={styles.uploadedImage} />

      <View style={styles.resultContainer}>
        <Text style={styles.resultMessage}>
          {predictedClass === 'Healthy'
          ? <><Text>Your tree is</Text> <Text style={styles.healthyText}>Healthy!</Text></>
          : predictedClass === 'No Plants detected'
          ? <><Text style={{ fontWeight: "bold", color: colors.red }}>No Plants detected</Text>{"\n"}<Text style={styles.submassage}>Make sure you take a clear picture of the tree.</Text></>
          : <><Text>Your tree has</Text> <Text style={styles.diseaseText}>{predictedClass}</Text></>}
        </Text>
      </View>

      {/* treatment suggestions */}
      {predictedClass !== 'Healthy' && predictedClass !== 'No Plants detected' && (
        <View style={styles.treatmentContainer}>
            <Text>
            <><Text>Learn more about</Text> <Text style={styles.diseaseText}>{predictedClass}</Text> <Text>and how you can treat it:{'\n'}</Text></>
            <Text style = {styles.link} onPress={() => Linking.openURL(class_treatment[predictedClass])}>{class_treatment[predictedClass]}</Text>
            </Text>
        </View>
      )}

      <TouchableOpacity style={styles.analyzeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.analyzeButtonText}>Analyze Another Tree</Text>
      </TouchableOpacity>
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
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.lightGrey,
    width: '100%',
    alignItems: 'center',
  },
  resultMessage: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 5,
  },
  analyzeButton: {
    backgroundColor: colors.primaryColor,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 30,
  },
  analyzeButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  healthyText: {
    color: colors.green,
    fontWeight: "bold",
  },
  submassage: {
    fontSize: 18,
    color: colors.grey,
    textAlign: 'center',
    marginTop: 5,
  },
  diseaseText: {
    color: colors.red,
    fontWeight: "bold",
  },
  treatmentContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: colors.lightGrey,
    width: '100%',
  },
  link: {
    color:colors.blue
  }
});

