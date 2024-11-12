import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Image, Text, ActivityIndicator, TouchableWithoutFeedback, Keyboard} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'; 
import colors from '../config/colors';

export default function CreatePostScreen() {
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // To store the selected image URI
  const [userName, setUserName] = useState(''); // For storing user name
  const [uploading, setUploading] = useState(false); // Track upload state
  const db = getFirestore();
  const storage = getStorage(); // Initialize Firebase Storage
  const navigation = useNavigation();

  // Fetch user's name from Firestore
  const fetchUserName = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserName(userDoc.data().name);
      }
    }
  };

  React.useEffect(() => {
    fetchUserName(); // Fetch user's name when the component mounts
  }, []);

  // Function to handle selecting or taking an image
  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!result.granted) {
      Alert.alert('Permission required', 'You need to enable camera permissions to attach an image.');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      setSelectedImage(pickerResult.assets[0].uri); // Set the selected image URI
    }
  };

  // Function to upload the image to Firebase Storage
  const uploadImage = async (uri) => {
    try {
      setUploading(true);

      // Convert the image URI to a Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Generate a unique filename for the image
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `images/${filename}`); // Reference to Firebase Storage path

      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, blob);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      setUploading(false);
      return downloadURL;
    } catch (error) {
      console.error("Image upload error:", error);
      setUploading(false);
      Alert.alert('Upload Failed', 'Something went wrong during the image upload.');
      return null;
    }
  };

  // Function to handle post creation
  const handlePost = async () => {
    if (newPost.trim() === '' && !selectedImage) {
      Alert.alert('Error', 'You cannot create an empty post.');
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const post = {
        text: newPost,
        userId: user.uid,
        name: userName, // Add user's name to the post data
        timestamp: new Date().toISOString(),
      };

      if (selectedImage) {
        const imageURL = await uploadImage(selectedImage); // Upload image and get the URL
        if (imageURL) {
          post.imageURL = imageURL; // Add image URL to the post data
        }
      }

      await addDoc(collection(db, 'posts'), post);
      setNewPost('');
      setSelectedImage(null);
      Alert.alert('Success', 'Post created!');
      navigation.goBack();  // Navigate back to CommunityScreen
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <AntDesign name="arrowleft" size={36} color={colors.black} />
            </TouchableOpacity>

            <Text style={styles.title}>Create a Post</Text>

            <View style={styles.inputContainer}>
                <TextInput
                style={styles.input}
                placeholder="Write your post here..."
                placeholderTextColor="#888"
                multiline={true}
                value={newPost}
                onChangeText={setNewPost}
                />
            </View>

            {/* Camera box for attaching an image */}
            <TouchableOpacity style={styles.cameraBox} onPress={pickImage}>
                {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
                ) : (
                <>
                    <MaterialIcons name="camera-alt" size={30} color="#888" />
                    <Text style={styles.placeholderText}>Attach Image</Text>
                </>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handlePost} disabled={uploading}>
                {uploading ? (
                <ActivityIndicator color="#fff" />
                ) : (
                <Text style={styles.buttonText}>Post</Text>
                )}
            </TouchableOpacity>
        </SafeAreaView>

    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  input: {
    height: 100,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  cameraBox: {
    width: 90,
    height: 90,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholderText: {
    color: '#888',
    fontSize: 13,
    marginTop: 8,
  },
  button: {
    backgroundColor: colors.primaryColor,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    borderRadius:25,
    backgroundColor: colors.primaryColor,
    width:50,
    height:50,
    justifyContent: "center",
    alignItems: "center"
  },

});
