import React from "react";
import { Stack } from "expo-router";

export default function ReminderLayout() {
    return(
        <Stack>
            <Stack.Screen name="reminderPage" 
            options={{ 
                title: 'Reminders',
                headerTitleAlign:"center", 
                headerShown:false,
                headerTitleStyle: {
                    color:"black"
                }}}/>
            <Stack.Screen name="AddReminder" 
            options={{ 
                title: 'Reminders',
                headerShown:false,
                headerTitleStyle: {
                    color:"black"
                }}}/>
        </Stack>
    )
}