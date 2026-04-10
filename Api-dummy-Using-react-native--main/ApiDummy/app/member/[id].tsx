import { useLocalSearchParams } from "expo-router";
import React from "react";
import ProfileScreen from "../components/ProfileScreen";

export default function MemberProfile() {
  const { firstName, lastName, role } = useLocalSearchParams<{
    firstName: string;
    lastName: string;
    role?: string;
  }>();

  return (
    <ProfileScreen
      firstName={firstName || ""}
      lastName={lastName || ""}
      role={role || "Coach"}
    />
  );
}