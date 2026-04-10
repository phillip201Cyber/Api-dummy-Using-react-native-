import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const initialMembers = [
  { id: "1", firstName: "Ariana", lastName: "Grande", assigned: "EchoPaddle #1" },
  { id: "2", firstName: "firstName", lastName: "lastName", assigned: "EchoPaddle #2" },
  { id: "3", firstName: "firstName", lastName: "lastName", assigned: "EchoPaddle #3" },
  { id: "4", firstName: "firstName", lastName: "lastName", assigned: "EchoPaddle #4" },
  { id: "5", firstName: "firstName", lastName: "lastName", assigned: "EchoPaddle #5" },
  { id: "6", firstName: "firstName", lastName: "lastName", assigned: "EchoPaddle #5" },

];

export default function Members() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [sortAscending, setSortAscending] = useState(true);

  const filteredMembers = useMemo(() => {
    const filtered = initialMembers.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const assigned = member.assigned.toLowerCase();
      const query = searchText.toLowerCase();

      return fullName.includes(query) || assigned.includes(query);
    });

    return filtered.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();

      if (sortAscending) {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }, [searchText, sortAscending]);

  const renderMemberCard = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: `/member/${item.id}`,
          params: {
            firstName: item.firstName,
            lastName: item.lastName,
          },
        })
      }
    >
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          <Text style={styles.memberName}>
            {item.firstName} {item.lastName}
          </Text>

          <View style={styles.assignmentContainer}>
            <Text style={styles.assignmentLabel}>Assigned:</Text>
            <Text style={styles.assignmentText}>{item.assigned}</Text>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topControls}>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={26} color="#000" style={styles.searchIcon} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#333"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          cursorColor="#000"
        />
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.memberCount}>{filteredMembers.length} Members</Text>

        <TouchableOpacity
          style={styles.sortContainer}
          onPress={() => setSortAscending((prev) => !prev)}
        >
          <MaterialIcons name="swap-vert" size={24} color="#000" />
          <Text style={styles.sortText}>
            Sort: {sortAscending ? "A to Z" : "Z to A"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id}
        renderItem={renderMemberCard}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const ORANGE = "#F15A24";
const BACKGROUND = "#ECECEF";
const CARD = "#F7F7F7";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
    paddingTop: 16,
    paddingHorizontal: 18,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    backgroundColor: ORANGE,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#222",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: "#000",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  memberCount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginLeft: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
  cardWrapper: {
    marginBottom: 10,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 22,
    paddingHorizontal: 24,
    paddingVertical: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  memberName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#000",
    flex: 1,
  },
  assignmentContainer: {
    alignItems: "flex-end",
    marginLeft: 12,
  },
  assignmentLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
  },
  assignmentText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#B8B8BD",
    marginTop: 10,
  },
});