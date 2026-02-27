import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Image, Pressable } from "react-native";


import { HapticTab } from "@/components/haptic-tab";
import React from "react";


export default function TabLayout() {
 const router = useRouter();


 return (
   <Tabs
     screenOptions={{
       headerShown: true,
       headerTitleAlign: "center",
      
       // Header Styling
       headerStyle: {
         backgroundColor: "white",
       },


       // Makapo Logo (LEFT)
       headerLeft: () => (
         <Image
           source={require("@/assets/images/makapoLogo.png")}
           style={{ width: 50, height: 50, marginLeft: 15 }}
           resizeMode="contain"
         />
       ),


       // Settings gear (RIGHT) -> goes to /settings
       headerRight: () => (
         <Pressable onPress={() => router.push("/settings")} style={{ marginRight: 15 }}>
           <Ionicons name="settings-outline" size={24} color="#000" />
         </Pressable>
       ),


       // Bottom tab styling
       tabBarButton: HapticTab,
       tabBarActiveTintColor: "#01AFEE", // makapo blue
       tabBarInactiveTintColor: "#000000ff", // black default
       tabBarStyle: {
         backgroundColor: "white",
         borderTopColor: "#e5e7eb",
       },
     }}
   >
     <Tabs.Screen
       name="index"
       options={{
         title: "Home",
         tabBarIcon: ({ color, size }) => (
           <Ionicons name="home" size={size ?? 24} color={color} />
         ),
       }}
     />


     <Tabs.Screen
       name="routes"
       options={{
         title: "Routes",
         tabBarIcon: ({ color, size }) => (
           <Ionicons name="map" size={size ?? 24} color={color} />
         ),
       }}
     />


     <Tabs.Screen
       name="record"
       options={{
         title: "Record",
         tabBarIcon: ({ color, size }) => (
           <Ionicons name="radio-button-on" size={size ?? 24} color={color} />
         ),
       }}
     />


     <Tabs.Screen
       name="members"
       options={{
         title: "Members",
         tabBarIcon: ({ color, size }) => (
           <Ionicons name="people" size={size ?? 24} color={color} />
         ),
       }}
     />


     <Tabs.Screen
       name="you"
       options={{
         title: "You",
         tabBarIcon: ({ color, size }) => (
           <Ionicons name="person" size={size ?? 24} color={color} />
         ),
       }}
     />
   </Tabs>
 );
}


