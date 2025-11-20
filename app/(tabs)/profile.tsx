import { useCallback, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import * as ImagePicker from 'expo-image-picker';
import React, { useContext, useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { Button } from "react-native-paper";
import { ProfileContext } from "../../lib/ProfileData_DB/profileContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { saveUserInfo, UpdateUserInfo } from "../../lib/ProfileData_DB/SaveProfile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

export default function LoginScreen() {
    const {signOut} = useAuth();

    const [image, setImage] = useState<string>('');
    const { profile, setProfile } = useContext(ProfileContext);
    
    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(!permissionResult.granted){
            alert("Permission to access gallery is required!")
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
    });

    if(!result.canceled) {
      try {
      await AsyncStorage.setItem("profileImage", result.assets[0].uri);
      setImage(result.assets[0].uri)
      console.log("Image saved locally!");
      } catch (error) {
        console.error("Error saving image locally:", error);
      }
    }
    };

    useEffect(() => {
      const loadProfileImage = async () => {
        try {
          const uri = await AsyncStorage.getItem("profileImage");
          if (uri) setImage(uri);
        } catch (error) {
          console.error("Error loading profile image:", error);
        }
      };

      loadProfileImage();
      }, [])

    const updateUserProfile = async () => {
      try{
        await UpdateUserInfo(profile.docId, profile.name, profile.age, profile.gender)
        Alert.alert("Your info has been updated successfully!")
      }
      catch(error){
        console.log("Error:", error);
      };
    };

    return(
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient colors={["#E0EAFC", "#CFDEF3"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Profile Picture */}
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
              <View>
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: image || "https://via.placeholder.com/150" }}
                    style={styles.image}
                  />
                </View>
                <View style={styles.cameraIcon}>
                  <MaterialCommunityIcons name="camera" size={20} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Info Section */}
          <View style={styles.infoContainer}>
          <Text style={styles.title}>Personal Information</Text>

          {/* Name */}
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              placeholder="Enter name"
              placeholderTextColor="#777"
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              style={styles.input}
            />
          </View>

          {/* Age */}
          <View style={styles.row}>
            <Text style={styles.label}>Age:</Text>
            <TextInput
              placeholder="Age"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={profile.age}
              onChangeText={(text) => setProfile({ ...profile, age: text })}
              style={styles.input}
            />
          </View>

          {/* Gender */}
          <View style={styles.row}>
            <Text style={styles.label}>Gender:</Text>
            <TextInput
              placeholder="Male / Female / Other"
              placeholderTextColor="#777"
              value={profile.gender}
              onChangeText={(text) => setProfile({ ...profile, gender: text })}
              style={styles.input}
            />
          </View>

          <Button
            mode="contained"
            onPress={updateUserProfile}
            style={[styles.button, { backgroundColor: "#1E90FF" }]}
          >
            Update Info
          </Button>

          <Button
            mode="contained"
            onPress={signOut}
            icon="logout"
            style={[styles.button, { backgroundColor: "black", marginTop: 25 }]}
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  scroll: { 
    paddingBottom: 100 
  },
  imageContainer: { 
    marginTop: 80, 
    alignItems: "center" 
  },
  imageWrapper: {
    borderWidth: 4,
    borderColor: "#1E90FF",
    borderRadius: 100,
    padding: 3,
  },
  image: { 
    width: 144, 
    height: 144, 
    borderRadius: 72 
  },
cameraIcon: {
  position: "absolute",
  bottom: 10,
  right: 10,
  backgroundColor: "#1E90FF",
  padding: 8,
  borderRadius: 20,
},
infoContainer: {
  paddingHorizontal: 24,
  marginTop: 40,
},
title: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#222",
  textAlign: "center",
  marginBottom: 25,
},
row: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 18,
},
label: {
  width: 90,          // fixed width → keeps alignment clean
  fontSize: 16,
  fontWeight: "600",
  color: "#444",
},
input: {
  flex: 1,            // expands automatically
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 12,
  paddingVertical: 10,
  paddingHorizontal: 12,
  fontSize: 16,
},
button: {
  marginVertical: 20,
  alignSelf: "center",
  width: 180,
  borderRadius: 14,
  paddingVertical: 6,
},

});