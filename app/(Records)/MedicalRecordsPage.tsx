import { useRouter, useFocusEffect } from "expo-router";
import { Pencil, Trash2, ArrowLeft, Plus } from "lucide-react-native";
import React, { useContext, useCallback, useState } from "react";
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ScrollView, Image, Modal } from "react-native";
import { NotesContext } from "./notesContext";
import { getNotes, DeleteNote } from "../../lib/Notes_DB/fetch_delete";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function MedicalRecords() {
    const { notes, setNotes }  = useContext(NotesContext);
    const [medImages, setMedImages] = useState<Record<string, string[]>>({});
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);


    const router = useRouter();

    useFocusEffect(
      useCallback(() => {
        const fetchNotes = async () => {
            const notesData = await getNotes()
            if(notesData){
              console.log("notesData:",notesData)
              setNotes(notesData);

              const imagesMap : Record<string, string[]> = {};
              
              await Promise.all(
              notesData.map(async (note) => {
                const stored = await AsyncStorage.getItem(`noteImages-${note.id}`);
                if (stored) {
                  imagesMap[note.id] = JSON.parse(stored);
                }
                })
              );

              setMedImages(imagesMap);
              }
            else {
                console.log("There was an error fetching the notes!")
            };
        };
        fetchNotes();
      }, [])
    );

    const handleDeleteImage = async () => {
      if (!selectedImage) return;

      // Find which note this image belongs to
      const noteId = Object.keys(medImages).find((id) =>
        medImages[id]?.includes(selectedImage)
      );

      if (!noteId) return;

      // Filter out the deleted image
      try {
        const updatedImages = medImages[noteId].filter((uri) => uri !== selectedImage);

      // Update AsyncStorage
      await AsyncStorage.setItem(`noteImages-${noteId}`, JSON.stringify(updatedImages));

      // Update local state
      setMedImages((prev) => ({
        ...prev,
        [noteId]: updatedImages,
      }));

      // Close modal
      setModalVisible(false);
      setSelectedImage(null);
      }
    catch(err){
      console.log("There was an error deleting this image:", err)
    }
    };

    // function for removing multiple images:
    const deleteImages = async (noteId: string) => {
      try {
        await AsyncStorage.removeItem(`noteImages-${noteId}`);
        console.log("🗑️ Deleted all images for note:", noteId);
      } catch (err) {
        console.log("Error deleting images:", err);
      }
    };

    const handleDeleteNote = async( noteId:string ) => {
          try{
            await DeleteNote(noteId)
            await deleteImages(noteId)
          }
          catch(err){
            console.log("There was an error deleting the Note", err)
          }
    }

    return(
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ArrowLeft onPress={() => router.back()} size={22} color="black" />
        <Text style={styles.headerTitle}>Medical Records</Text>
        <TouchableOpacity
          onPress={() => router.push("/AddNote")}
          style={styles.addButton}
          activeOpacity={0.8}
        >
          <Plus color="white" size={22} />
        </TouchableOpacity>
      </View>

      {/* Notes List */}
      <FlatList
        data={notes}
        keyExtractor={(note) => note.id}
        renderItem={({ item: note }) => (
          
            <View style={styles.noteCard}>
              <View style={styles.noteContent}>
                <Text style={styles.noteDate}>{note.date}</Text>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteText}>{note.med_note}</Text>

                {medImages[note.id]?.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                    {medImages[note.id].map((uri: string, index: number) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setSelectedImage(uri);
                          setModalVisible(true);
                        }}
                      >
                      <Image
                        source={{ uri }}
                        style={{ width: 80, height: 80, borderRadius: 8, marginRight: 8 }}
                      />
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  )}

              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "./AddNote",
                      params: {
                        id: note.id,
                        title: note.title,
                        date: note.date,
                        med_note: note.med_note,
                      },
                    })
                  }
                >
                  <Pencil size={20} color="#1E90FF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteNote(note.id)} style={{ marginLeft: 16 }}>
                  <Trash2 size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          
          )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No Notes Yet</Text>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: '90%', height: '70%', borderRadius: 12 }}
              resizeMode="contain"
            />
          )}

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: 8,
              borderRadius: 50,
            }}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteImage}
            style={{
              position: 'absolute',
              bottom: 60,
              backgroundColor: 'rgba(255,0,0,0.6)',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Delete Image</Text>
          </TouchableOpacity>
        </View>
        </Modal>
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF6FF",
    padding: 16,
    paddingTop: 55,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E40AF",
  },
  addButton: {
    backgroundColor: "#1E90FF",
    padding: 10,
    borderRadius: 25,
    elevation: 3,
  },
  noteCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    elevation: 2,
  },
  noteContent: {
    flex: 1,
    maxWidth: "80%",
  },
  noteDate: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  noteText: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 40,
    fontSize: 16,
  },
});