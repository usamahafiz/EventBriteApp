import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const AddProduct = ({ navigation }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
      if (response.didCancel || response.errorCode) return;
      setImage(response.assets[0].uri);
    });
  };

  const uploadImageToStorage = async (uri) => {
    const filename = `events/${Date.now()}_${Math.random()}.jpg`;
    const reference = storage().ref(filename);

    try {
      await reference.putFile(uri);
      return await reference.getDownloadURL();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleAddEvent = async () => {
    if (!eventTitle || !location || !description || !date || !category || !image) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImageToStorage(image);
      const eventData = {
        title: eventTitle,
        location,
        description,
        date,
        category,
        imageUrl,
        createdAt: new Date(),
      };

      await firestore().collection('events').add(eventData);
      Alert.alert('Success', 'Event added successfully!');
      setEventTitle('');
      setLocation('');
      setDescription('');
      setDate('');
      setCategory('');
      setImage(null);
      navigation.navigate('ManageEvents');
    } catch (error) {
      console.error('Error adding event:', error);
      Alert.alert('Error', 'Something went wrong! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Title"
        onChangeText={setEventTitle}
        value={eventTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        onChangeText={setLocation}
        value={location}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        onChangeText={setDescription}
        value={description}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        onChangeText={setDate}
        value={date}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        onChangeText={setCategory}
        value={category}
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleAddEvent} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Add Event</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    color: '#1d3557',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    
  },
  button: {
    backgroundColor: '#1d3557',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
    resizeMode: 'cover',
  },
});

export default AddProduct;








