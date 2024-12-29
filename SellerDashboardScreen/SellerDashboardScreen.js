import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Linking } from 'react-native';

const SellerDashboardScreen = ({ navigation }) => (
  <View style={styles.container}>
    {/* Shop Now Button */}
    <TouchableOpacity
      style={styles.shopNowButton}
      onPress={() => navigation.navigate('AllProducts')}
    >
      <Text style={styles.shopNowText}>Event Dashboard</Text>
    </TouchableOpacity>

    <Text style={styles.title}>Event Organizer</Text>

    
   

    {/* Add Product Card */}
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AddProduct')}
    >
      <ImageBackground
        source={{ uri: 'https://img.freepik.com/premium-photo/dj-spinning-mixing-scratching-night-club-strobe-lights-fog_38052-73.jpg?ga=GA1.1.605566897.1725475014&semt=ais_hybrid' }}
        style={styles.cardImage}
      >
        <Text style={styles.cardText}>Add Event</Text>
      </ImageBackground>
    </TouchableOpacity>

    {/* Manage Product Card */}
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EditProduct')}
    >
      <ImageBackground
        source={{ uri: 'https://img.freepik.com/free-photo/celebration-birthday-party-surprise-events-icon-word_53876-125417.jpg?ga=GA1.1.605566897.1725475014&semt=ais_hybrid' }}
        style={styles.cardImage}
      >
        <Text style={styles.cardText}>Manage Events</Text>
      </ImageBackground>
    </TouchableOpacity>

    {/* Orders Card */}
    {/* <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('SellerOrder')}
    >
      <ImageBackground
        source={{ uri: 'https://img.freepik.com/free-photo/import-export-shipment-truck-graphic-concept_53876-124866.jpg?ga=GA1.1.1642102062.1730407199&semt=ais_hybrid' }}
        style={styles.cardImage}
      >
        <Text style={styles.cardText}>Bookings</Text>
      </ImageBackground>
    </TouchableOpacity> */}

   
   
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff', // White background
  },
  shopNowButton: {
    backgroundColor: '#1d3557', // Green button
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  shopNowText: {
    color: '#fff', // White text on the button
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    color: '#1d3557', // Green color for title
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  allProductsLink: {
    color: '#4CAF50', // Green text for the link
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline', // Underline to indicate it's a link
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5, // Adds shadow to the card for elevation effect
  },
  cardImage: {
    width: '100%',
    height: 150, // Adjust the height of the card
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Optional fallback color if the image doesn't load
  },
  cardText: {
    color: '#fff', // White text for visibility
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for text
  },
});

export default SellerDashboardScreen;