import React, { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { scanDevicesMock } from "../api/api";

export default function Home() {
  const [devices, setDevices] = useState([]);

  const runDummyScan = async () => {
    try {
      const found = await scanDevicesMock();
      setDevices(found);
      Alert.alert("Dummy Scan OK", `Found ${found.length} device(s).`);
    } catch (e) {
      Alert.alert("Dummy Scan Failed", e.message);
    }
  };

  return (
    <View style={{ padding: 16, marginTop: 50 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Home (Dummy Test)</Text>

      <View style={{ marginTop: 12 }}>
        <Button title="Run Dummy Scan" onPress={runDummyScan} />
      </View>

      <Text style={{ marginTop: 16, fontWeight: "600" }}>
        Devices ({devices.length})
      </Text>

      {devices.map((d) => (
        <Text key={d.id}>• {d.name} ({d.ip})</Text>
      ))}
    </View>
  );
}
