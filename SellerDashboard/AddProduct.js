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









// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
// import auth from '@react-native-firebase/auth';
// import { launchImageLibrary } from 'react-native-image-picker';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const AddEvent = ({ navigation }) => {
//   const [eventTitle, setEventTitle] = useState('');
//   const [location, setLocation] = useState('');
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState(new Date());
//   const [category, setCategory] = useState('');
//   const [image, setImage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   const handleImageUpload = () => {
//     launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
//       if (response.didCancel || response.errorCode) return;
//       setImage(response.assets[0].uri);
//     });
//   };

//   const uploadImageToStorage = async (uri) => {
//     const filename = `events/${Date.now()}_${Math.random()}.jpg`;
//     const reference = storage().ref(filename);

//     try {
//       await reference.putFile(uri);
//       return await reference.getDownloadURL();
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       throw error;
//     }
//   };

//   const handleAddEvent = async () => {
//     if (!eventTitle || !location || !description || !date || !category || !image) {
//       Alert.alert('Error', 'All fields are required.');
//       return;
//     }

//     // const currentUser = auth().currentUser;
//     // if (!currentUser) {
//     //   Alert.alert('Error', 'You must be logged in to add an event.');
//     //   return;
//     // }

//     setLoading(true);

//     try {
//       // Upload image to Firebase Storage and get the URL
//       const imageUrl = await uploadImageToStorage(image);

//       // Prepare event data
//       const eventData = {
//         title: eventTitle,
//         location,
//         description,
//         date: date.toISOString(),
//         category,
//         imageUrl,
//         organizerId: currentUser.uid,
//         createdAt: new Date(),
//       };

//       // Add event to Firestore
//       await firestore().collection('events').add(eventData);

//       Alert.alert('Success', 'Event added successfully!');
//       setEventTitle('');
//       setLocation('');
//       setDescription('');
//       setDate(new Date());
//       setCategory('');
//       setImage(null);
//       navigation.navigate('EventDashboardScreen');
//     } catch (error) {
//       console.error('Error adding event:', error);
//       Alert.alert('Error', 'Something went wrong! Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Add Event</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Event Title"
//         onChangeText={setEventTitle}
//         value={eventTitle}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Location"
//         onChangeText={setLocation}
//         value={location}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Description"
//         onChangeText={setDescription}
//         value={description}
//       />
//       <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//         <TextInput
//           style={styles.input}
//           placeholder="Date"
//           value={date.toDateString()}
//           editable={false}
//         />
//       </TouchableOpacity>
//       {showDatePicker && (
//         <DateTimePicker
//           value={date}
//           mode="date"
//           display="default"
//           onChange={(event, selectedDate) => {
//             setShowDatePicker(false);
//             if (selectedDate) setDate(selectedDate);
//           }}
//         />
//       )}
//       <TextInput
//         style={styles.input}
//         placeholder="Category"
//         onChangeText={setCategory}
//         value={category}
//       />

//       {image && <Image source={{ uri: image }} style={styles.image} />}

//       <TouchableOpacity style={styles.button} onPress={handleImageUpload}>
//         <Text style={styles.buttonText}>Upload Image</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={handleAddEvent} disabled={loading}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Add Event</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//   },
//   title: {
//     color: '#1d3557',
//     fontSize: 40,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     letterSpacing: 2,
//   },
//   input: {
//     backgroundColor: '#f0f0f0',
//     color: '#1d3557',
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     marginBottom: 15,
//     fontSize: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//   },
//   button: {
//     backgroundColor: '#1d3557',
//     padding: 15,
//     borderRadius: 8,
//     marginVertical: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     borderRadius: 8,
//     marginBottom: 15,
//     resizeMode: 'cover',
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
// });

// export default AddEvent;





