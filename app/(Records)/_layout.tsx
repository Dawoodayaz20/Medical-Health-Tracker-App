import React from "react"; 
import { Stack } from "expo-router";

export default function RecordsLayout() {
    return (
    <Stack>
        <Stack.Screen name="MedicalRecordsPage" options={{ headerShown:false }} />
        <Stack.Screen name="AddNote" options={{ headerShown:false }} />
    </Stack>
)
}