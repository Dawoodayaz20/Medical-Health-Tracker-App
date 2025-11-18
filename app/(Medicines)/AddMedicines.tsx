import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { useRouter } from "expo-router";
import { Clock, ArrowLeft } from "lucide-react-native";
import { SaveMedicines } from "../../lib/Medicines_DB/SaveMedicines_DB";

export default function AddMedicine() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [illness, setIllness] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [ detail, setDetail] = useState("");

  const saveMedicine = async () => {
    try{
      await SaveMedicines(name, illness, dosage, time, detail)
    }
    catch(error){
      console.error("There was an error saving the Medicine:", error)
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ArrowLeft onPress={() => router.back()} size={22} color="black" />
        <Text style={styles.headerTitle}>Add Medicine</Text>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={40}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <TextInput
            placeholder="Medicine Name"
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Illness (e.g. Fever, Headache)"
            placeholderTextColor="#555"
            value={illness}
            onChangeText={setIllness}
            style={styles.input}
          />

          <TextInput
            placeholder="Dosage (optional)"
            placeholderTextColor="#555"
            value={dosage}
            onChangeText={setDosage}
            style={styles.input}
          />

          <View style={styles.timeRow}>
            <Clock size={18} color="#2563eb" />
            <TextInput
              placeholder="Timing e.g (Day / Night)"
              placeholderTextColor="#555"
              value={time}
              onChangeText={setTime}
              style={styles.timeInput}
            />
          </View>

          <TextInput
            placeholder="Notes (optional)"
            placeholderTextColor="#555"
            value={detail}
            onChangeText={setDetail}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            style={[styles.input, { height: 100 }]}
          />
        </View>

        <TouchableOpacity
          onPressIn={saveMedicine}
          onPress={() => router.back()}
          style={styles.saveButton}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f7ff",
    paddingTop: Platform.OS === "android" ? 40 : 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "center",
    flex: 1,
    marginRight: 22, // keeps title centered even with back arrow
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  form: {
    gap: 16,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    color: "#111827",
    fontSize: 14,
    ...Platform.select({
      android: { elevation: 0.5 },
      ios: { shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 2 },
    }),
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },

  timeInput: {
    marginLeft: 10,
    flex: 1,
    color: "#111827",
    fontSize: 14,
  },

  saveButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});