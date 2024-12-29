import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const AllProducts = () => {
  const [events, setEvents] = useState([]); // State for events
  const [categories, setCategories] = useState([]); // State for categories
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting
  const navigation = useNavigation();

  // Screen dimensions for responsive layout
  const screenWidth = Dimensions.get('window').width;
  const columns = screenWidth > 600 ? 3 : 2;

  const carouselRef = useRef(null); // Carousel reference
  const [scrollPosition, setScrollPosition] = useState(0); // Track scroll position

  // Fetch events and categories from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventSnapshot = await firestore().collection('events').get();
        const eventList = eventSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventList);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categorySnapshot = await firestore().collection('categories').get();
        const categoryList = categorySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchEvents();
    fetchCategories();

    // Auto-scroll the carousel
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const nextIndex = (Math.floor(scrollPosition / screenWidth) + 1) % 3;
        carouselRef.current.scrollToIndex({ animated: true, index: nextIndex });
      }
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [scrollPosition]);

  // Handle Bottom Tab navigation
  const handleTabPress = (tab) => {
    switch (tab) {
      case 'Login':
        navigation.navigate('Login');
        break;
      case 'Cart':
        navigation.navigate('Cart');
        break;
      case 'BuyerOrder': // Updated to match your file name
        navigation.navigate('BuyerOrder');
        break;
      default:
        break;
    }
  };

  // Filter and sort events based on search query, selected category, and sorting order
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? event.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.date) - new Date(b.date); // Sort by date (ascending)
      } else if (sortOrder === 'desc') {
        return new Date(b.date) - new Date(a.date); // Sort by date (descending)
      } else if (sortOrder === 'category') {
        return a.category.localeCompare(b.category); // Sort by category (alphabetical)
      }
      return 0; // Default (no sorting)
    });

  return (
    <View style={styles.container}>
      {/* Carousel */}
      <FlatList
        ref={carouselRef}
        data={[
          { id: '1', uri: 'https://img.freepik.com/free-photo/top-view-decorations-online-party_23-2149324061.jpg?ga=GA1.1.605566897.1725475014&semt=ais_hybrid' },
          { id: '2', uri: 'https://img.freepik.com/free-photo/birthday-party-through-smartphone-screen_23-2147716833.jpg?ga=GA1.1.605566897.1725475014&semt=ais_hybrid' },
          { id: '3', uri: 'https://media.istockphoto.com/id/1224701659/photo/working-on-a-new-project-together-top-view-of-designers-discussing-sketches-choosing-colors.jpg?b=1&s=612x612&w=0&k=20&c=BPp-iaPmVAqrwuzyfHGyV06hIrvcNILf4qkv5zVm3JQ=' }
        ]}
        renderItem={({ item }) => (
          <View style={[styles.carouselContent, { width: screenWidth }]}>
            <Image source={{ uri: item.uri }} style={styles.carouselImage} />
            <Text style={styles.carouselText}>EventBrite</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={screenWidth}
        decelerationRate="fast"
        pagingEnabled
        onScroll={(event) => setScrollPosition(event.nativeEvent.contentOffset.x)}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === item.id && styles.selectedCategory]}
            onPress={() => setSelectedCategory(item.id)}
          >
            <Image source={{ uri: item.iconUrl }} style={styles.categoryIcon} />
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        style={styles.categoryList}
      />

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortText}>Sort by:</Text>
        <TouchableOpacity onPress={() => setSortOrder('asc')} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Date: Low to High</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortOrder('desc')} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Date: High to Low</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortOrder('category')} style={styles.sortButton}>
          <Text style={styles.sortButtonText}>Category</Text>
        </TouchableOpacity>
      </View>

      {/* Event List */}
      <FlatList
        data={filteredEvents}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.eventCard}
            onPress={() => navigation.navigate('ProductDetails', { event: item })}
            // onPress={() => navigation.navigate('ProductDetails', { event: item })}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDescription}>{item.description}</Text>
            <Text style={styles.eventLocation}>{item.location}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        contentContainerStyle={styles.eventList}
      />

      {/* Bottom Tabs */}
      <View style={styles.bottomTabs}>
        <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('Login')}>
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('Cart')}>
          <Text style={styles.tabText}>EventLists</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('BuyerOrder')}>
          <Text style={styles.tabText}>Bookings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    paddingBottom: 80, // Ensure space for bottom tab
  },
  carouselContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  carouselText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -30 }],
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#4caf50',
    borderWidth: 1,
  },
  clearButton: {
    marginLeft: 10,
  },
  clearText: {
    color: '#4caf50',
  },
  categoryList: {
    marginVertical: 10,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryIcon: {
    width: 40,
    height: 40,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 12,
  },
  selectedCategory: {
    borderBottomWidth: 2,
    borderColor: '#4caf50',
  },
  sortContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  sortText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortButton: {
    marginLeft: 10,
    backgroundColor: '#4caf50',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  sortButtonText: {
    color: '#fff',
  },
  eventList: {
    paddingTop: 10,
  },
  eventCard: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 10,
    alignItems: 'center',
    padding: 10,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  eventTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDescription: {
    marginTop: 5,
    fontSize: 14,
    color: '#4caf50',
  },
  eventLocation: {
    marginTop: 5,
    fontSize: 12,
  },
  eventDate: {
    marginTop: 5,
    fontSize: 12,
    color: '#888',
  },
  bottomTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    justifyContent: 'space-around',
  },
});

export default AllProducts;



















// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput, Dimensions } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';
// import { useNavigation } from '@react-navigation/native';

// const AllProducts = () => {
//   const [events, setEvents] = useState([]); // State for events
//   const [categories, setCategories] = useState([]); // State for categories
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [sortOrder, setSortOrder] = useState('asc'); // Sorting
//   const navigation = useNavigation();

//   // Screen dimensions for responsive layout
//   const screenWidth = Dimensions.get('window').width;
//   const columns = screenWidth > 600 ? 3 : 2;

//   const carouselRef = useRef(null); // Carousel reference
//   const [scrollPosition, setScrollPosition] = useState(0); // Track scroll position

//   // Fetch events and categories from Firestore
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const eventSnapshot = await firestore().collection('events').get();
//         const eventList = eventSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setEvents(eventList);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       }
//     };

//     const fetchCategories = async () => {
//       try {
//         const categorySnapshot = await firestore().collection('categories').get();
//         const categoryList = categorySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setCategories(categoryList);
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       }
//     };

//     fetchEvents();
//     fetchCategories();

//     // Auto-scroll the carousel
//     const interval = setInterval(() => {
//       if (carouselRef.current) {
//         const nextIndex = (Math.floor(scrollPosition / screenWidth) + 1) % 3;
//         carouselRef.current.scrollToIndex({ animated: true, index: nextIndex });
//       }
//     }, 3000); // Scroll every 3 seconds

//     return () => clearInterval(interval); // Cleanup interval on component unmount
//   }, [scrollPosition]);

//   //   // Sorting the products based on the selected sort order
//   // const sortedProducts = filteredProducts.sort((a, b) => {
//   //   if (sortOrder === 'asc') {
//   //     return a.price - b.price; // Ascending order
//   //   } else {
//   //     return b.price - a.price; // Descending order
//   //   }
//   // });

//   //   // Handle Bottom Tab navigation
//   const handleTabPress = (tab) => {
//     switch (tab) {
//       case 'Login':
//         navigation.navigate('Login');
//         break;
//       case 'Cart':
//         navigation.navigate('Cart');
//         break;
//       case 'BuyerOrder': // Updated to match your file name
//         navigation.navigate('BuyerOrder');
//         break;
//       default:
//         break;
//     }
//   };

//   // Filter events based on search query and selected category
//   const filteredEvents = events.filter(event => {
//     const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory ? event.category === selectedCategory : true;
//     return matchesSearch && matchesCategory;
//   });

//   return (
//     <View style={styles.container}>
//       {/* Carousel */}
//       <FlatList
//         ref={carouselRef}
//         data={[
//           { id: '1', uri: 'https://img.freepik.com/free-photo/top-view-decorations-online-party_23-2149324061.jpg?ga=GA1.1.605566897.1725475014&semt=ais_hybrid' },
//           { id: '2', uri: 'https://img.freepik.com/free-photo/birthday-party-through-smartphone-screen_23-2147716833.jpg?ga=GA1.1.605566897.1725475014&semt=ais_hybrid' },
//           { id: '3', uri: 'https://media.istockphoto.com/id/1224701659/photo/working-on-a-new-project-together-top-view-of-designers-discussing-sketches-choosing-colors.jpg?b=1&s=612x612&w=0&k=20&c=BPp-iaPmVAqrwuzyfHGyV06hIrvcNILf4qkv5zVm3JQ=' }
//         ]}
//         renderItem={({ item }) => (
//           <View style={[styles.carouselContent, { width: screenWidth }]}>
//             <Image source={{ uri: item.uri }} style={styles.carouselImage} />
//             <Text style={styles.carouselText}>EventBrite</Text>
//           </View>
//         )}
//         keyExtractor={(item) => item.id}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         snapToInterval={screenWidth}
//         decelerationRate="fast"
//         pagingEnabled
//         onScroll={(event) => setScrollPosition(event.nativeEvent.contentOffset.x)}
//       />

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search events..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//         <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
//           <Text style={styles.clearText}>Clear</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Categories */}
//       <FlatList
//         data={categories}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={[styles.categoryButton, selectedCategory === item.id && styles.selectedCategory]}
//             onPress={() => setSelectedCategory(item.id)}
//           >
//             <Image source={{ uri: item.iconUrl }} style={styles.categoryIcon} />
//             <Text style={styles.categoryText}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item.id}
//         horizontal
//         style={styles.categoryList}
//       />

//       {/* Sort Options */}
//       <View style={styles.sortContainer}>
//         <Text style={styles.sortText}>Sort by:</Text>
//         <TouchableOpacity onPress={() => setSortOrder('asc')} style={styles.sortButton}>
//           <Text style={styles.sortButtonText}>Date: Low to High</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => setSortOrder('desc')} style={styles.sortButton}>
//           <Text style={styles.sortButtonText}>Event: Category</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Event List */}
//       <FlatList
//         data={filteredEvents}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.eventCard}
//             onPress={() => navigation.navigate('ProductDetails', { event: item })}
//           >
//             <Image source={{ uri: item.imageUrl }} style={styles.eventImage} />
//             <Text style={styles.eventTitle}>{item.title}</Text>
//             <Text style={styles.eventDescription}>{item.description}</Text>
//             <Text style={styles.eventLocation}>{item.location}</Text>
//             <Text style={styles.eventDate}>{item.date}</Text>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item.id}
//         numColumns={columns}
//         contentContainerStyle={styles.eventList}
//       />
//       {/* Bottom Tabs */}
//       <View style={styles.bottomTabs}>
//         <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('Login')}>
//           <Text style={styles.tabText}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('Cart')}>
//           <Text style={styles.tabText}>EventLists</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.tabButton} onPress={() => handleTabPress('BuyerOrder')}>
//           <Text style={styles.tabText}>Bookings</Text>
//         </TouchableOpacity>
//       </View>
//     </View>

//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 10,
//     paddingBottom: 80, // Ensure space for bottom tab
//   },
//   carouselContent: {
//     position: 'relative',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   carouselImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 10,
//     resizeMode: 'cover',
//   },
//   carouselText: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: [{ translateX: -100 }, { translateY: -30 }],
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 5,
//     textAlign: 'center',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     backgroundColor: '#f1f1f1',
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     borderColor: '#4caf50',
//     borderWidth: 1,
//   },
//   clearButton: {
//     marginLeft: 10,
//   },
//   clearText: {
//     color: '#4caf50',
//   },
//   categoryList: {
//     marginVertical: 10,
//   },
//   categoryButton: {
//     alignItems: 'center',
//     marginRight: 20,
//   },
//   categoryIcon: {
//     width: 40,
//     height: 40,
//   },
//   categoryText: {
//     marginTop: 5,
//     fontSize: 12,
//   },
//   selectedCategory: {
//     borderBottomWidth: 2,
//     borderColor: '#4caf50',
//   },
//   sortContainer: {
//     flexDirection: 'row',
//     marginVertical: 10,
//   },
//   sortText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   sortButton: {
//     marginLeft: 10,
//     backgroundColor: '#4caf50',
//     paddingVertical: 5,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   sortButtonText: {
//     color: '#fff',
//   },
//   eventList: {
//     paddingTop: 10,
//   },
//   eventCard: {
//     flex: 1,
//     marginBottom: 20,
//     backgroundColor: '#f1f1f1',
//     borderRadius: 10,
//     overflow: 'hidden',
//     marginHorizontal: 10,
//     alignItems: 'center',
//     padding: 10,
//   },
//   eventImage: {
//     width: '100%',
//     height: 150,
//     borderRadius: 5,
//     resizeMode: 'cover',
//   },
//   eventTitle: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   eventDescription: {
//     marginTop: 5,
//     fontSize: 14,
//     color: '#4caf50',
//   },
//   eventLocation: {
//     marginTop: 5,
//     fontSize: 12,
//   },
//   eventDate: {
//     marginTop: 5,
//     fontSize: 12,
//     color: '#888',
//   },
//   bottomTabs: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     paddingVertical: 10,
//     justifyContent: 'space-around',
//   },
// });

// export default AllProducts;










