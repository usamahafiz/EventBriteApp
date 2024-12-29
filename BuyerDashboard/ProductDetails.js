import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const EventDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { event } = route.params; // Get event details from route params

  const handleBookEvent = () => {
    Alert.alert(
      'Booking Confirmation',
      `Are you sure you want to book "${event.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => Alert.alert('Event Booked!', 'Your booking is confirmed.') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Event Image */}
      <Image source={{ uri: event.imageUrl }} style={styles.image} />

      {/* Event Details */}
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Text style={styles.location}>Location: {event.location}</Text>
      <Text style={styles.date}>Date: {event.date}</Text>

      {/* Book Event Button */}
      <TouchableOpacity style={styles.button} onPress={handleBookEvent}>
        <Text style={styles.buttonText}>Book Event</Text>
      </TouchableOpacity>

      {/* Back to All Products */}
      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Back to Events</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'justify',
    marginBottom: 10,
  },
  location: {
    fontSize: 14,
    color: '#4caf50',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
  },
  backButton: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventDetails;















