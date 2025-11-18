import { AuthProvider, useAuth } from "../lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import ProfileContextProvider from "../lib/ProfileData_DB/profileContext";
import NotesProvider from "./(Records)/notesContext";
import RemindersContextProvider from "./(reminders)/remindersContext";
import MedicineContextProvider from "./(Medicines)/medicinalContext";
import { ChatProvider } from "./(Assistant)/assistantContext";
import LoadingScreen from "./loadingScreen";

function RouteGuard({children} : { children: React.ReactNode }){

    // const [isSignUp, setisSignUp] = useState<boolean>(false)
    const {user, isLoadingUser} = useAuth();
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
      if (isLoadingUser) return; // wait...

      const inAuthGroup = segments[0] === "auth";

      if (!user && !inAuthGroup) {
        router.replace("/auth");
      } else if (user && inAuthGroup) {
        router.replace("/");
      }
    }, [user, isLoadingUser, segments]);

    // ⛔ IMPORTANT: don't render anything until we know user state
    if (isLoadingUser) {
      return <LoadingScreen />; // or your custom splash screen
    }

    return <>{children}</>
}

export default function RootLayout() {
  return (
            <AuthProvider>
            <RouteGuard>
            <ChatProvider>
            <ProfileContextProvider>
            <NotesProvider>
            <RemindersContextProvider> 
            <MedicineContextProvider>
              <Stack>
                <Stack.Screen name="auth" options={{ headerShown: false }}/>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
                <Stack.Screen name="(reminders)" options={{ headerShown: false }}/>
                <Stack.Screen name="(Records)" options={{ headerShown: false }}/>
                <Stack.Screen name="(Medicines)" options={{ headerShown: false }}/>
                <Stack.Screen name="(Assistant)" options={{ headerShown:false }}/>
              </Stack>
            </MedicineContextProvider>
            </RemindersContextProvider>
            </NotesProvider>
            </ProfileContextProvider>
            </ChatProvider>
            </RouteGuard>
            </AuthProvider>  
  );
}
