import React from "react";
import { Stack } from "expo-router";
import { Text} from "react-native";

export default function MedicalAgentLayout () {
    return (
    <Stack>
        <Stack.Screen name="MedicalAssistant" options={
            {
              headerShown:true,
              headerTitle: () => (
              <Text style={{ color: "#2563eb", fontSize: 16, fontWeight: "bold" }}>
                Medical Assistant 🤖
              </Text>
              )}
            }/>
    </Stack>
)
}