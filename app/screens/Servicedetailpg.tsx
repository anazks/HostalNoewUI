import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Linking } from 'react-native';

export default function FoodServiceDetails() {
  const { id } = useLocalSearchParams(); // Get the mess ID from the URL
  const [modalVisible, setModalVisible] = useState(false);
  const [foodModalVisible, setFoodModalVisible] = useState(false);
  const [messData, setMessData] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [foodLoading, setFoodLoading] = useState(false);
  const router = useRouter();
  const sendWhatsAppMessage = () => {
    if (messData?.phoneno) {
      const phoneNumber = messData.phoneno.replace(/\s+/g, ''); // Remove spaces if any
      const message = encodeURIComponent(`Hello, I would like to enquire about your food service.`);
      const url = `whatsapp://send?phone=+91${phoneNumber}&text=${message}`;
  
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'WhatsApp is not installed on your device.');
      });
    } else {
      Alert.alert('Error', 'Phone number not available.');
    }
  };
  
  useEffect(() => {
    const fetchMessDetails = async () => {
      try {
        const response = await fetch(`http://172.16.5.232:3000/get-SIngle-mess/${id}`);
        const text = await response.text(); // Get raw response
        console.log("Raw API Response:", text); // Check if it's valid JSON
    
        const data = JSON.parse(text); // Now try parsing it
        setMessData(data);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        Alert.alert("Error", "Failed to load mess details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchMessDetails();
    }
  }, [id]);

  const fetchFoodDetails = async () => {
    setFoodLoading(true);
    try {
      const response = await fetch(`http://172.16.5.232:3000/get-foodMen-single/${id}`);
      const data = await response.json();
      console.log("Food Menu:", data);
      if (data.menu && data.menu.length > 0) {
        setFoodData(data.menu[0]);
        setFoodModalVisible(true);
      } else {
        Alert.alert("Info", "No food menu available.");
      }
    } catch (error) {
      console.error("Error fetching food details:", error);
      Alert.alert("Error", "Failed to load food details.");
    } finally {
      setFoodLoading(false);
    }
  };

  const handleUpdate = () => {
    router.push('/screens/Serviceinfo');
  };

  const handleDelete = () => {
    Alert.alert('Delete', 'Delete option selected');
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1C1C5E" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: messData?.imageUrl || 'https://via.placeholder.com/400' }}
        style={styles.image}
      />

      {/* Modal for Options */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton} onPress={handleUpdate}>
              <Text style={styles.modalText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
              <Text style={styles.modalText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { borderBottomWidth: 0 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Mess Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{messData?.name || "Loading..."}</Text>
        <Text style={styles.details}>
          {messData?.city || "No address available"}
          {'\n'}Mobile: {messData?.phoneno || "N/A"}
          {'\n'}Distance: {messData?.Distance || "N/A"} Khm
          {'\n'}Contact: {messData?.phoneno || "N/A"}
          <TouchableOpacity style={styles.enquireButton} onPress={sendWhatsAppMessage}>
                  <Text style={styles.enquireText}>Enquire</Text>
          </TouchableOpacity>

        </Text>
        <Text style={styles.description}>
          {messData?.description ||
            "We specialize in providing affordable, hygienic, and nutritious food, ensuring you enjoy the warmth of home wherever you stay."}
        </Text>

        {/* View Food Button */}
        <TouchableOpacity style={styles.viewFoodButton} onPress={fetchFoodDetails}>
          <Text style={styles.viewFoodText}>{foodLoading ? "Loading..." : "View Food"}</Text>
        </TouchableOpacity>

        {/* Weekly Food Menu */}
        {/* <Text style={styles.menuTitle}>Weekly Food Menu</Text> */}
        <View style={styles.table}>
         {/* Weekly Food Menu */}
<Text style={styles.menuTitle}>Weekly Food Menu</Text>
<View style={styles.table}>
  <View style={styles.tableHeader}>
    <Text style={styles.tableHeaderText}>Day</Text>
    <Text style={styles.tableHeaderText}>Menu</Text>
  </View>

  {/* Display menu from foodData if available */}
  {foodData ? (
    <>
      <View style={styles.row}>
        <Text style={styles.cellDay}>Sunday</Text>
        <Text style={styles.cellMenu}>{foodData.sunday || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cellDay}>Monday</Text>
        <Text style={styles.cellMenu}>{foodData.monday || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cellDay}>Tuesday</Text>
        <Text style={styles.cellMenu}>{foodData.tuesday || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cellDay}>Wednesday</Text>
        <Text style={styles.cellMenu}>{foodData.wednesday || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cellDay}>Thursday</Text>
        <Text style={styles.cellMenu}>{foodData.thursday || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cellDay}>Friday</Text>
        <Text style={styles.cellMenu}>{foodData.friday || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.cellDay}>Saturday</Text>
        <Text style={styles.cellMenu}>{foodData.saturday || 'N/A'}</Text>
      </View>
    </>
  ) : (
    <Text style={styles.noMenuText}>No menu available.</Text>
  )}
</View>

          {messData?.foodMenu
            ? Object.entries(messData.foodMenu).map(([day, menu]) => (
                <View key={day} style={styles.row}>
                  <Text style={styles.cellDay}>{day}</Text>
                  <Text style={styles.cellMenu}>{menu}</Text>
                </View>
              ))
            : null}
        </View>
      </View>

      {/* Food Details Modal */}
      <Modal
  animationType="slide"
  transparent={true}
  visible={foodModalVisible}
  onRequestClose={() => setFoodModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.foodModalContent}>
      <Text style={styles.foodTitle}>Food Menu</Text>
      {foodData ? (
        <>
          <Text style={styles.foodDetails}>Food Type: {foodData.FoodType}</Text>
          <Text style={styles.foodDetails}>Rate: ₹{foodData.Rate}</Text>
          <Text style={styles.foodDetails}>Availability: {foodData.availability}</Text>

        </>
      ) : (
        <Text>No food menu available.</Text>
      )}
      <TouchableOpacity
        style={[styles.modalButton, { marginTop: 10 }]}
        onPress={() => setFoodModalVisible(false)}
      >
        <Text style={styles.modalText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  enquireButton: {
    backgroundColor: '#25D366', // WhatsApp green
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  enquireText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  table: { width: '100%', marginTop: 10, borderWidth: 1, borderColor: '#ccc' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#1C1C5E', padding: 10 },
  tableHeaderText: { flex: 1, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc', padding: 10 },
  cellDay: { flex: 1, fontWeight: 'bold', textAlign: 'center' },
  cellMenu: { flex: 2, textAlign: 'center' },
  container: { flexGrow: 1, backgroundColor: '#E0B974' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 250, resizeMode: 'cover' },
  detailsContainer: { backgroundColor: '#E0B974', padding: 20, marginTop: -20 },
  title: { fontSize: 25, fontWeight: 'bold', color: '#FFF' },
  details: { fontSize: 16, color: '#FFF', marginBottom: 10 },
  description: { fontSize: 15, color: '#FFF', marginBottom: 20 },
  menuTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  viewFoodButton: { backgroundColor: '#1C1C5E', padding: 10, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  viewFoodText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  foodModalContent: { backgroundColor: '#FFF', padding: 20, borderRadius: 10, alignItems: 'center' },
  foodTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  foodDetails: { fontSize: 16, marginBottom: 5 },
  foodItem: { marginBottom: 10 },
});

