import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HomeIcon, Utensils, Store, Truck } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F15B25",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          height: 70,
          borderTopWidth: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          ...Platform.select({
            ios: {
              position: "absolute",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -5 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
            android: {
              elevation: 10,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: "600",
          marginBottom: 8,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon size={24} color={focused ? "#F15B25" : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color, focused }) => (
            <Utensils size={24} color={focused ? "#F15B25" : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="delivery"
        options={{
          title: "Delivery",
          tabBarIcon: ({ color, focused }) => (
            <Truck size={24} color={focused ? "#F15B25" : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="branches"
        options={{
          title: "Branches",
          tabBarIcon: ({ color, focused }) => (
            <Store size={24} color={focused ? "#F15B25" : color} />
          ),
        }}
      />
    </Tabs>
  );
}
