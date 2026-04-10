import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function You() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={styles.avatar}>
              
              <Text style={styles.avatarText}>PFP</Text> 
            </View>

            <View>
              <Text style={styles.name}>firstName lastName</Text>
              <Text style={styles.role}>Coach</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Summary Statistics</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>AVG Speed</Text>
            <Text style={styles.cardValue}>0 KM/H</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>Total Distance</Text>
            <Text style={styles.cardValue}>0 mi</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.cardLabel}>Total Time</Text>
            <Text style={styles.cardValue}>0h 00m 00s</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Reports By Date</Text>

        <View style={styles.reportsRow}>
          <View style={styles.calendarCard}>
            <Text style={styles.placeholderText}>Calendar Placeholder</Text>
          </View>

          <View style={styles.reportStatsColumn}>
            <View style={styles.reportStatCard}>
              <Text style={styles.cardLabel}>AVG Speed</Text>
              <Text style={styles.cardValue}>0 KM/H</Text>
            </View>

            <View style={styles.reportStatCard}>
              <Text style={styles.cardLabel}>Total Distance</Text>
              <Text style={styles.cardValue}>0 mi</Text>
            </View>

            <View style={styles.reportStatCard}>
              <Text style={styles.cardLabel}>Total Time</Text>
              <Text style={styles.cardValue}>0h 00m 00s</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Trends</Text>

        <View style={styles.trendsCard}>
          <Text style={styles.placeholderText}>Chart Placeholder</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F7",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: "#FFF",
  },

  avatarText: {
    fontSize: 30,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
  },

  role: {
    fontSize: 14,
    color: "#444444",
    marginTop: 2,
  },

  editButton: {
    backgroundColor: "#F45B24",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 22,
    marginLeft: 12,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 10,
    marginLeft: 2,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    width: "31.5%",
    minHeight: 104,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },

  cardLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 10,
  },

  cardValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111",
  },

  reportsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  calendarCard: {
    width: "62%",
    height: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },

  reportStatsColumn: {
    width: "32%",
    justifyContent: "space-between",
  },

  reportStatCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    height: 92,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },

  trendsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    height: 180,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  placeholderText: {
    fontSize: 16,
    color: "#999999",
    fontWeight: "500",
  },
});