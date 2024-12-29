import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image, Modal, TextInput, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await firestore().collection('products').get();
        const eventsList = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsList);
      } catch (error) {
        console.error('Error fetching events:', error);
        Alert.alert('Error', 'Failed to fetch events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId, imageUrl) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const reference = storage().refFromURL(imageUrl);
            await reference.delete();
            await firestore().collection('events').doc(eventId).delete();
            setEvents(events.filter((event) => event.id !== eventId));
            Alert.alert('Success', 'Event deleted successfully!');
          } catch (error) {
            console.error('Error deleting event:', error);
            Alert.alert('Error', 'Failed to delete event.');
          }
        },
      },
    ]);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setNewImage(event.imageUrl);
    setModalVisible(true);
  };

  const handleSaveChanges = async () => {
    setSaving(true);

    try {
      const updatedEvent = { ...currentEvent };
      if (newImage && newImage !== currentEvent.imageUrl) {
        const reference = storage().refFromURL(currentEvent.imageUrl);
        await reference.delete();
        const imageUrl = await uploadImageToStorage(newImage);
        updatedEvent.imageUrl = imageUrl;
      }

      await firestore().collection('events').doc(currentEvent.id).update(updatedEvent);
      setEvents(events.map((event) => (event.id === currentEvent.id ? updatedEvent : event)));
      Alert.alert('Success', 'Event updated successfully!');
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'Failed to update event.');
    } finally {
      setSaving(false);
    }
  };

  const renderEventItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDate}>Date: {item.date}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleEditEvent(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => handleDeleteEvent(item.id, item.imageUrl)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Events</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList data={events} renderItem={renderEventItem} keyExtractor={(item) => item.id} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    color: '#1d3557',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  eventCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d3557',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#1d3557',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '48%',
  },
  deleteButton: {
    backgroundColor: '#e63946',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1d3557',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loadingText: {
    textAlign: 'center',
    color: '#1d3557',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 18,
    marginTop: 20,
  },
});


export default ManageEvents;






