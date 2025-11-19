import React, { useState, useContext } from "react";
import { RemindersContext } from "./remindersContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { Button } from "react-native-paper";
import { ArrowLeft } from "lucide-react-native";
import { saveReminder, UpdateReminder } from "../../lib/Reminder_DB/SaveReminder";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { scheduleNotification, cancelNotification } from "./notificationUtils";
import { getReminders } from "@/lib/Reminder_DB/fetch_Delete";

export default function AddReminder () {
    const { reminder, setReminder } = useContext(RemindersContext);
    const params = useLocalSearchParams();
    const [title, setTitle] = useState<any>(params.title || "")
    const [description, setDescription] = useState<any>(params.description || "")
    const [hour, setHour] = useState<number | undefined>(
      params.hour ? Number(params.hour) : undefined
    );
    const [minute, setMinute] = useState<number | undefined>(
      params.minute ? Number(params.hour) : undefined
    );
    const notifyID = params.reminderId as any
    const remindId = params.id as any
    const router = useRouter();

    const handleSaveReminder = async( title: string, description: string, hour: number, minute: number) => {
      if (hour == null || minute == null) {
        Alert.alert("Please select a reminder time first");
        return;
      }
      try{
        const id = await scheduleNotification(title, description, hour, minute);
        if(id){
          await saveReminder(title, description, id, hour, minute);
          Alert.alert("✅ Reminder Saved!");
        }
        else{
          Alert.alert("There was an error scheduling the reminder!")
        }
      } catch (err) {
        Alert.alert("There was an error scheduling the reminder!", err as string)
      }
    }

    const openTimePicker = () => {
      DateTimePickerAndroid.open({
        value: new Date(),
        mode: "time",
        is24Hour: false,
        onChange: (event, selectedTime) => {
          if (selectedTime) {
            setHour(selectedTime.getHours());
            setMinute(selectedTime.getMinutes());
          }
        },
      });
    };

    const handleUpdateReminder = async ( title : string, descript : string, hrs : number, mins : number) => {
      try{
        const result = await cancelNotification(notifyID)
        if(result.success){
          const reminderId = await scheduleNotification(title, descript, hrs, mins)
          if(reminderId){
            await UpdateReminder(remindId, title, descript, reminderId, hrs, mins)
          }
          Alert.alert("Reminder updated successfully!")
        }
      }
       catch(err){
        Alert.alert("There was an error:", `${err}`)
       }
    }

    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={22} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Reminder</Text>
        </View>

        {/* Title */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter reminder title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Time */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Time</Text>
          <TouchableOpacity onPress={openTimePicker} style={styles.input}>
            <Text>
              {hour != null && minute != null
                ? `${hour.toString().padStart(2, "0")}:${minute
                    .toString()
                    .padStart(2, "0")}`
                : "Select Time"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add some notes (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        {/* Save Button */}
        { 
        remindId ?
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => {
              handleUpdateReminder(title, description, hour!, minute!);
              router.back();
            }}
          >
            Update Reminder
          </Button>
          </View>
          :
          <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => {
              handleSaveReminder(title, description, hour!, minute!);
              router.back();
            }}
          >
            Save Reminder
          </Button>
          </View>
        }
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#f3f4f6",
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1f2937",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#4b5563",
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    width: "100%",
    paddingVertical: 6,
  },
});