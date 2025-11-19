import * as Notifications from "expo-notifications"
import { getUserProfile } from "@/lib/appwrite_queries";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Image, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from 'react-native-paper';
import { ProfileContext } from "../../lib/ProfileData_DB/profileContext";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true, 
    shouldShowList: true,   
  }),
});

export default function Index() {  
  const reminder = require('../../assets/images/reminder.png');
  const medicalRec = require('../../assets/images/medicalrecords.png');
  const medicalassist = require('../../assets/images/medicalassist.png');
  const medicines = require('../../assets/images/medicines.png');
  const { profile, setProfile } = useContext(ProfileContext)
  const [ image, setImage ] = useState('')

  const router = useRouter();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission for notifications was not granted.");
      }
    };
    requestPermissions();
  }, []);

  // UseEffect for getting profile data:
  useEffect(() => {
        const userData = async () => {
          try {
            const data = await getUserProfile()
            console.log(data)
            if(data) {
            setProfile({
              docId: data.$id || "",
              name: data.name || "",
              age: data.age || "",
              gender: data.gender || "",
              email: data.email || ""
            })
          };
          }
          catch(err) {
          console.log(`There was an error fetching the user profile:${err}`)
          }
        };
        userData()
      }, [])

    // UseEffect for getting profile picture:
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Gradient */}
        <LinearGradient
          colors={["#38bdf8", "#2563eb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greetingText}>
                Hi {profile.name} 👋
              </Text>
              <Text style={styles.subtitle}>
                Here’s your health overview
              </Text>
            </View>

            <Image
              source={{uri: image || "https://via.placeholder.com/150"}}
              style={styles.profilePic}
              resizeMode="cover"
            />
          </View>

          {/* Glassy Profile Card */}
          <View style={styles.profileCard}>
            <View>
              <Text style={styles.infoText}>Name: <Text style={styles.infoValue}>{profile.name}</Text></Text>
              <Text style={styles.infoText}>Age: <Text style={styles.infoValue}>{profile.age} Years</Text></Text>
              <Text style={styles.infoText}>Gender: <Text style={styles.infoValue}>{profile.gender}</Text></Text>
            </View>

          </View>
        </LinearGradient>

        {/* Cards Grid */}
        <View style={styles.cardsGrid}>
          {[
            { title: "Reminders", colors: ["#fb7185", "#f43f5e"], icon: reminder, links: "/(reminders)/reminderPage" },
            { title: "Medical Records", colors: ["#34d399", "#10b981"], icon: medicalRec, links: "/(Records)/MedicalRecordsPage" },
            { title: "Medicines", colors: ["#38bdf8", "#0ea5e9"], icon: medicines, links: "/(Medicines)/MedicinesPage" },
            { title: "Medical Assistant", colors: ["#38bdf8", "#0ea5e9"], icon: medicalassist, links: "/(Assistant)/MedicalAssistant" },
          ].map((card, i) => (
            <LinearGradient
              key={i}
              colors={card.colors as any}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.card}
            >
              <TouchableOpacity onPress={() => router.push(card.links as any)}>
              <View style={styles.cardTop}>
                <Image source={card.icon} style={styles.cardIcon} resizeMode="contain" />
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
              </TouchableOpacity>
            </LinearGradient>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today’s Summary</Text>
          <Text style={styles.summaryText}>
            Medicine adherence, reminders done — chart coming soon.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Button */}
      <TouchableOpacity style={styles.fab}
      onPress={(() => router.push('/(Assistant)/MedicalAssistant'))}
      >
        <Text style={styles.fabIcon}>🤖</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "android" ? 120 : 100,
  },
  headerGradient: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  profilePic: {
    width: 58,
    height: 58,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileCard: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      default: {},
    })
  },
  infoText: {
    fontSize: 14,
    marginVertical: 2,
  },
  infoValue: {
    fontWeight: "600",
    ...Platform.select({
      ios: {
        fontWeight: "400"
      },
    })
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    height: 120,
    borderRadius: 18,
    padding: 16,
    justifyContent: "space-between",
    marginBottom: 16,
    overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
  cardIcon: {
    width: 44,
    height: 44,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  summaryTitle: {
    color: "#1e293b",
    fontWeight: "600",
    marginBottom: 6,
  },
  summaryText: {
    color: "#475569",
    fontSize: 13,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: Platform.OS === "android" ? 120 : 110,
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabIcon: {
    fontSize: 24,
    color: "#fff",
  },
});