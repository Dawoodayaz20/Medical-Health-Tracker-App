import React, { useState, useContext, useEffect } from "react";
import { NotesContext } from "./notesContext";
import { ArrowLeft } from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { saveNoteToAppwrite } from "../../lib/Notes_DB/SaveNotes";
import { UpdateMedicalNote } from "../../lib/Notes_DB/SaveNotes";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddNote () {
    const { notes, setNotes } = useContext(NotesContext);
    const params = useLocalSearchParams()
    const [title, setTitle] = useState<any>(params.title || '')
    const [date, setDate] = useState<any>(params.date ||'')
    const [med_note, setNote] = useState<any>(params.med_note ||'')
    const [image, setImage] = useState<string[]>([]);
    const docId = params.id as any
    const router = useRouter()

    useEffect(() => {
      const loadImages = async () => {
        if (params.id) {
          const stored = await AsyncStorage.getItem(`noteImages-${params.id}`);
          if (stored) {
            setImage(JSON.parse(stored));
          }
        }
      };
      loadImages();
    }, [params.id]);

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

      if (!result.canceled){
        const newUris = result.assets.map((asset) => asset.uri);
        setImage((prev) => [...prev, ...newUris]);
      }
    };

    const saveImageLocally = async (noteId: string, uri: string[]) => {
      try {
        await AsyncStorage.setItem(`noteImages-${noteId}`, JSON.stringify(uri));
        console.log("✅ Saved images for", noteId, uri);
      } catch (err) {
        console.log("Error saving image:", err);
      }
    };


    const handleSaveNote = async () => {
      const newNote = await saveNoteToAppwrite(title, date, med_note)
      if (newNote && newNote.$id) {
        if (image.length > 0) {
          await saveImageLocally(newNote.$id, image);
        }
        console.log("Note saved with ID:", newNote.$id);
      }
    }

    const handleUpdateNote = async() => {
      try {
        const updatedNote = await UpdateMedicalNote(docId, title, date, med_note)
        if (updatedNote){
          await saveImageLocally(docId, image);
          console.log("The image has been successfully saved!")
        }
      }
      catch(error){
        console.log("There was an error updating the Medical Record", error)
      }
    }

    return(
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ArrowLeft onPress={() => router.back()} size={22} color="black" />
          <Text style={styles.headerTitle}>
            {params.id ? "Edit Note" : "New Note"}
          </Text>
          {
            params.id ?
            <Button
            mode="contained"
            onPress={() => router.back()}
            onPressIn={() => handleUpdateNote()}
            style={styles.saveButton}
            labelStyle={styles.saveButtonLabel}
          >
            Update
          </Button>
          :
            <Button
            mode="contained"
            onPress={() => router.back()}
            onPressIn={() => handleSaveNote()}
            style={styles.saveButton}
            labelStyle={styles.saveButtonLabel}
          >
            Save
          </Button>
          }
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <TextInput
            label="Title"
            mode="outlined"
            value={title}
            onChangeText={setTitle}
            style={styles.textInput}
          />
          <TextInput
            label="Date"
            mode="outlined"
            value={date}
            onChangeText={setDate}
            placeholder="e.g. 19 Aug 2025"
            style={styles.textInput}
          />
          <TextInput
            label="Medical Note"
            mode="outlined"
            value={med_note}
            onChangeText={setNote}
            multiline
            style={[styles.textInput, styles.noteInput]}
          />
          <View style={styles.imageContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {image.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
              <Text style={styles.uploadText}>Attach Image (Optional)</Text>
            </TouchableOpacity>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  saveButton: {
    backgroundColor: "#1E90FF",
    borderRadius: 10,
    elevation: 3,
  },
  saveButtonLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  inputContainer: {
    gap: 16,
  },
  textInput: {
    backgroundColor: "#fff",
  },
  noteInput: {
    minHeight: 120,
    textAlignVertical: "top", // Ensures multiline text starts at the top on Android
  },
  imageContainer: {
  alignItems: "center",
  marginTop: 16,
},
uploadButton: {
  backgroundColor: "#E5E7EB",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
},
uploadText: {
  color: "#1E40AF",
  fontWeight: "500",
},
previewImage: {
  width: 120,
  height: 120,
  borderRadius: 10,
  marginBottom: 10,
}
});