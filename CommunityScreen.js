import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; // Import Firestore query and orderBy
import { getFirestore } from 'firebase/firestore'; 
import { useNavigation, useFocusEffect } from '@react-navigation/native';  
import { AntDesign } from '@expo/vector-icons'; 
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { auth } from './firebaseConfig';  
import colors from './colors';
import moment from 'moment';  // Import moment.js for date formatting

export default function CommunityScreen() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false); 
  const db = getFirestore();
  const navigation = useNavigation();

  const fetchPosts = async () => {
    const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(postsQuery);
    const postsArray = [];
    querySnapshot.forEach((doc) => {
      postsArray.push({ ...doc.data(), id: doc.id });
    });
    setPosts(postsArray);
  };

  const onRefresh = async () => {
    setRefreshing(true);  
    await fetchPosts();   
    setRefreshing(false); 
  };

  useFocusEffect(
    useCallback(() => {
      // This will trigger when the screen is focused
      fetchPosts();
    }, [])
  );

  const handleCreatePost = () => {
    const user = auth.currentUser; 

    if (!user) {
      Alert.alert(
        'Sign In Required',
        'You need to sign in to create a post.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Auth') },
        ],
        { cancelable: true }
      );
    } else {
      navigation.navigate('CreatePost');
    }
  };

  const formatDate = (timestamp) => {
    return moment(timestamp).format('MMMM Do YYYY, h:mm a');
  };

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postName}>{item.name}</Text> 
      <Text style={styles.postText}>{item.text}</Text>  
      {item.imageURL && (
        <Image source={{ uri: item.imageURL }} style={styles.postImage} />
      )}
      <Text style={styles.postDate}>Posted on {formatDate(item.timestamp)}</Text> 
    </View>
  );

  return (
    <SafeAreaView style={styles.container}> 
      <Text style={styles.heading}>Community Feed</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        refreshing={refreshing} 
        onRefresh={onRefresh} 
      />
      
      {/* Floating button to navigate to CreatePostScreen */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleCreatePost}  
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',  // Center the heading
  },
  postContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  postName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  postText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  postImage: {
    width: '100%',   // Make image take full width
    height: 200,     // Set a fixed height for the image
    borderRadius: 8, // Optional: Make the image corners rounded
    marginBottom: 8, // Add some spacing between the image and the date
  },
  postDate: {
    fontSize: 12,
    color: '#666',
    textAlign: 'left',  // Align the date to the left
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: colors.primaryColor,
    borderRadius: 30,
    elevation: 8,
    marginBottom: 75,
  },
});
