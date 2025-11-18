import React from "react";
import { Stack } from "expo-router";

export default function MedicinesLayout () {
    return (
        <Stack>
            <Stack.Screen name="MedicinesPage" options={{ headerShown: false }}/>
            <Stack.Screen name="AddMedicines" options={{ headerShown: false }}/>
        </Stack>
    )
}