import {
  Member,
  addMember,
  getAllCanoes,
  getAllMembers,
  removeMember,
} from "@/data/canoeStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type MemberWithAssignment = Member & {
  assignedText: string;
};

export default function MembersScreen() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>(getAllMembers());
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const refreshMembers = useCallback(() => {
    setMembers([...getAllMembers()]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshMembers();
    }, [refreshMembers])
  );

  const membersWithAssignments = useMemo(() => {
    const canoes = getAllCanoes();

    return members.map((member) => {
      let assignedText = "Assigned:\nUnassigned";

      for (const canoe of canoes) {
        const paddleIndex = canoe.paddlers.findIndex((paddler) => paddler.id === member.id);

        if (paddleIndex !== -1) {
          assignedText = `Assigned:\n${canoe.name}\nEchoPaddle #${paddleIndex + 1}`;
          break;
        }
      }

      return {
        ...member,
        assignedText,
      };
    });
  }, [members]);

  const filteredMembers = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    const filtered = membersWithAssignments.filter((member) => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      return fullName.includes(query);
    });

    return filtered.sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return sortAscending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }, [membersWithAssignments, searchText, sortAscending]);

  const selectedMember =
    membersWithAssignments.find((member) => member.id === selectedMemberId) || null;

  const handleMemberPress = (member: MemberWithAssignment) => {
    if (selectedMemberId === member.id) {
      router.push({
        pathname: "/member/[id]",
        params: {
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          role: "Coach",
        },
      });
      return;
    }

    setSelectedMemberId(member.id);
  };

  const createMember = () => {
    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!trimmedFirst || !trimmedLast) return;

    const newMember = addMember(trimmedFirst, trimmedLast);
    refreshMembers();
    setSelectedMemberId(newMember.id);
    setFirstName("");
    setLastName("");
    setAddModalVisible(false);
  };

  const deleteSelectedMember = () => {
    if (!selectedMember) return;

    removeMember(selectedMember.id);
    refreshMembers();
    setSelectedMemberId("");
    setRemoveModalVisible(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshMembers}>
          <Ionicons name="refresh" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setAddModalVisible(true)}>
            <Text style={styles.actionButtonText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, !selectedMember && styles.disabledButton]}
            onPress={() => selectedMember && setRemoveModalVisible(true)}
            disabled={!selectedMember}
          >
            <Text style={styles.actionButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={28} color="#111" />
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search"
          placeholderTextColor="#444"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.countText}>{filteredMembers.length} Members</Text>

        <TouchableOpacity
          style={styles.sortRow}
          onPress={() => setSortAscending((prev) => !prev)}
        >
          <MaterialIcons name="swap-vert" size={28} color="#000" />
          <Text style={styles.sortText}>Sort: {sortAscending ? "A to Z" : "Z to A"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >
        {filteredMembers.map((member) => {
          const selected = member.id === selectedMemberId;

          return (
            <View key={member.id}>
              <Pressable
                onPress={() => handleMemberPress(member)}
                style={[styles.memberCard, selected && styles.memberCardSelected]}
              >
                <View style={styles.memberCardContent}>
                  <Text style={styles.memberName}>
                    {member.firstName} {member.lastName}
                  </Text>

                  <Text style={styles.assignedText}>{member.assignedText}</Text>
                </View>
              </Pressable>

              <View style={styles.rowDivider} />
            </View>
          );
        })}
      </ScrollView>

      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Member</Text>
              <TouchableOpacity onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={36} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>First Name:</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor="#777"
                style={styles.modalInput}
              />

              <Text style={[styles.modalLabel, { marginTop: 18 }]}>Last Name:</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor="#777"
                style={styles.modalInput}
              />

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setAddModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.confirmButton} onPress={createMember}>
                  <Text style={styles.confirmButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={removeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRemoveModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Remove Member?</Text>
              <TouchableOpacity onPress={() => setRemoveModalVisible(false)}>
                <Ionicons name="close" size={36} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.removeText}>
                Removing{" "}
                <Text style={styles.removeBold}>
                  {selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : ""}
                </Text>{" "}
                cannot be undone. Are you sure you want to remove this member?
              </Text>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setRemoveModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.confirmButton} onPress={deleteSelectedMember}>
                  <Text style={styles.confirmButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ORANGE = "#F45A24";
const ORANGE_LIGHT = "#F4A084";
const BLUE = "#3759F0";
const BG = "#EEF0F3";
const CARD = "#FFFFFF";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  refreshButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    minWidth: 92,
    height: 38,
    borderRadius: 18,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  disabledButton: {
    opacity: 0.55,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  searchBar: {
    height: 44,
    borderWidth: 2,
    borderColor: "#202020",
    borderRadius: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
    color: "#111",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  countText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  memberCard: {
    minHeight: 104,
    backgroundColor: CARD,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    overflow: "hidden",
  },
  memberCardSelected: {
    backgroundColor: "#AEB8E8",
    borderColor: BLUE,
    borderWidth: 4,
  },
  memberCardContent: {
    minHeight: 104,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  memberName: {
    flex: 1,
    fontSize: 24,
    fontWeight: "900",
    color: "#000",
    paddingRight: 12,
  },
  assignedText: {
    width: 170,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
    color: "#000",
    textAlign: "center",
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#CFCFCF",
    marginVertical: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  modalCard: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#EFEFEF",
    borderRadius: 6,
    overflow: "hidden",
  },
  modalHeader: {
    height: 64,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  modalTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
    marginLeft: 36,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#000",
  },
  modalButtonsRow: {
    flexDirection: "row",
    marginTop: 22,
  },
  cancelButton: {
    flex: 1,
    height: 58,
    backgroundColor: ORANGE_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  confirmButton: {
    flex: 1,
    height: 58,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  removeText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#111",
    marginBottom: 20,
  },
  removeBold: {
    fontWeight: "900",
  },
});