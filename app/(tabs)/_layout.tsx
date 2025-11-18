import { Tabs } from "expo-router";
import { StyleSheet, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1E90FF",
        tabBarInactiveTintColor: "#9ca3af",
        headerBackground: () => (
          <LinearGradient
            colors={["#38bdf8", "#2563eb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        ),
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerTitleStyle: { fontWeight: "bold" },
        tabBarStyle: [
          styles.tabBar,
          {
            
            height: Platform.OS === "android" ? 70 : 60,
            bottom: Platform.OS === "android" ? insets.bottom + 2 : 6,
          },
        ],
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="home"
              color={color}
              size={focused ? 28 : 22}
              style={focused ? styles.activeIcon : null}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="account"
              color={color}
              size={focused ? 28 : 22}
              style={focused ? styles.activeIcon : null}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  activeIcon: {
    transform: [{ scale: 1.1 }],
  },
});
