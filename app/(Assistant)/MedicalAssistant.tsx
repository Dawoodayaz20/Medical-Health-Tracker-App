import React from "react";
import {  IconButton } from "react-native-paper";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  SafeAreaView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatContext } from "./assistantContext";

export default function MedicalAssistant() {
  // const [messages, setMessages] = useState<{ text: string; from: "user" | "bot" }[]>([]);
  // const [text, setText] = useState<string>("");
  const { messages, text, setText, handleSubmit } = useChatContext();
  
  const insets = useSafeAreaInsets();

//   const handleSubmit = async () => {
//     if (!text.trim()) return;

//   const userMessage: { text: string; from: "user" | "bot" } = { text, from: "user" };
//   const updatedMessages = [...messages, userMessage];

//   // ✅ Show the user message immediately
//   setMessages(updatedMessages);
//   setText("");

//   try {
//     // Combine entire conversation
//     const conversation = updatedMessages
//       .map(m => `${m.from === "user" ? "User" : "Assistant"}: ${m.text}`)
//       .join("\n");

//     // Send to backend
//     const reply = await handleResponse(conversation);

//     const botReply =
//       typeof reply === "object" && reply?.error
//         ? `Error: ${reply.error}`
//         : reply || "Sorry, I couldn't process your request.";

//     // ✅ Then show bot reply when it arrives
//     setMessages(prev => [...prev, { text: botReply, from: "bot" }]);
//   } catch (error) {
//     setMessages(prev => [
//       ...prev,
//       { text: "Something went wrong.", from: "bot" },
//     ]);
//   }

// };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { paddingBottom: insets.bottom + 50 }]}
      keyboardVerticalOffset={Platform.OS === "android" ? 50 : 60}
    >
      {/* Header gradient bar */}
      {/* <LinearGradient
        colors={["#38bdf8", "#2563eb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerText}>Medical Assistant 🤖</Text>
      </LinearGradient> */}

      {/* Chat messages */}
      <ScrollView contentContainerStyle={styles.messages} >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.from === "user" ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.from === "user" ? styles.userText : styles.botText,
              ]}
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input section */}
      <View style={[styles.inputContainer, { marginBottom: insets.bottom + 0 }]}>
        <TextInput
          style={styles.input}
          placeholder="Ask any health related query!"
          placeholderTextColor="#999"
          value={text}
          multiline={true}
          numberOfLines={3}
          onChangeText={setText}
          textAlignVertical="top"
        />
        <IconButton
          icon="send"
          mode="contained"
          onPress={handleSubmit}
          style={styles.sendButton}
          
          iconColor="#fff"
        />
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  messages: {
    padding: 16
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#2563eb",
    borderTopRightRadius: 0,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e7eb",
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#111827",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 14,
    height: 50,
    marginRight: 2,
  },
  sendButton: {
    backgroundColor: "#2563eb",
  },
});

