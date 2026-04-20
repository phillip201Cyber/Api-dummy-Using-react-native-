import {
    Member,
    addMemberToCanoe,
    getCanoeById,
    getUnassignedMembers,
    removeMemberFromCanoe,
} from "@/data/canoeStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
    useFocusEffect,
    useLocalSearchParams,
    useNavigation,
    useRouter,
} from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import {
    Linking,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type DisplayMember = Member & {
  assigned: string;
};

export default function CanoeDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ id?: string; name?: string }>();

  const canoeId = String(params.id || "");
  const fallbackName = String(params.name || "Canoe");

  const [members, setMembers] = useState<DisplayMember[]>([]);
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [sortAscending, setSortAscending] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [membersToAdd, setMembersToAdd] = useState<Member[]>([]);

  const canoe = getCanoeById(canoeId);
  const canoeName = canoe?.name || fallbackName;
  const livestreamUrl = canoe?.livestream || "http://echo.cooperativepaddling.com/";

  const refreshCanoe = useCallback(() => {
    const currentCanoe = getCanoeById(canoeId);

    if (!currentCanoe) {
      setMembers([]);
      setAvailableMembers([]);
      setSelectedMemberId("");
      return;
    }

    const displayMembers: DisplayMember[] = currentCanoe.paddlers.map((member, index) => ({
      ...member,
      assigned: `${currentCanoe.name}\nEchoPaddle #${index + 1}`,
    }));

    setMembers(displayMembers);

    const unassigned = getUnassignedMembers();
    const available = [
      ...unassigned,
      ...displayMembers.filter(
        (m) => !unassigned.some((u) => u.id === m.id)
      ),
    ];

    const dedupedAvailable = available.filter(
      (member, index, arr) => arr.findIndex((m) => m.id === member.id) === index
    );

    setAvailableMembers(dedupedAvailable);

    setSelectedMemberId((prev) => {
      const stillExists = displayMembers.some((member) => member.id === prev);
      return stillExists ? prev : "";
    });
  }, [canoeId]);

  useFocusEffect(
    useCallback(() => {
      refreshCanoe();
    }, [refreshCanoe])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: canoeName,
    });
  }, [navigation, canoeName]);

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return sortAscending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }, [members, sortAscending]);

  const selectedMember = members.find((m) => m.id === selectedMemberId) || null;

  const openMemberProfile = (member: DisplayMember) => {
    router.push({
      pathname: "/member/[id]",
      params: {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        role: "Coach",
      },
    });
  };

  const handleMemberPress = (member: DisplayMember) => {
    if (selectedMemberId === member.id) {
      openMemberProfile(member);
      return;
    }

    setSelectedMemberId(member.id);
  };

  const toggleMemberToAdd = (member: Member) => {
    const alreadyInCanoe = members.some((m) => m.id === member.id);
    if (alreadyInCanoe) return;

    const exists = membersToAdd.some((m) => m.id === member.id);

    if (exists) {
      setMembersToAdd((prev) => prev.filter((m) => m.id !== member.id));
      return;
    }

    if (members.length + membersToAdd.length >= 6) return;

    setMembersToAdd((prev) => [...prev, member]);
  };

  const closeAddModal = () => {
    setAddModalVisible(false);
    setMembersToAdd([]);
  };

  const addSelectedMembers = () => {
    if (membersToAdd.length === 0) return;

    membersToAdd.forEach((member) => {
      addMemberToCanoe(canoeId, member);
    });

    closeAddModal();
    refreshCanoe();
  };

  const removeSelectedMember = () => {
    if (!selectedMember) return;
    removeMemberFromCanoe(canoeId, selectedMember.id);
    setRemoveModalVisible(false);
    refreshCanoe();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#000" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.addButton,
              (availableMembers.filter((m) => !members.some((cm) => cm.id === m.id)).length === 0 ||
                members.length >= 6) &&
                styles.disabledButton,
            ]}
            onPress={() => setAddModalVisible(true)}
            disabled={
              availableMembers.filter((m) => !members.some((cm) => cm.id === m.id)).length === 0 ||
              members.length >= 6
            }
          >
            <Text style={styles.actionButtonText}>Add</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.removeButton, !selectedMember && styles.disabledButton]}
            onPress={() => selectedMember && setRemoveModalVisible(true)}
            disabled={!selectedMember}
          >
            <Text style={styles.actionButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.speedText}>AVG SPEED: 3 km/h</Text>

      <View style={styles.infoRow}>
        <Text style={styles.paddlerCount}>{members.length} Paddlers</Text>

        <TouchableOpacity
          style={styles.sortRow}
          onPress={() => setSortAscending((prev) => !prev)}
        >
          <MaterialIcons name="swap-vert" size={22} color="#000" />
          <Text style={styles.sortText}>Sort: {sortAscending ? "A to Z" : "Z to A"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator
        >
          {sortedMembers.map((member) => {
            const selected = member.id === selectedMemberId;

            return (
              <Pressable
                key={member.id}
                onPress={() => handleMemberPress(member)}
                style={[styles.memberCard, selected && styles.memberCardSelected]}
              >
                <View style={styles.memberTouchable}>
                  <Text style={styles.memberName}>
                    {member.firstName} {member.lastName}
                  </Text>

                  <Text style={styles.memberAssigned}>{member.assigned}</Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.liveCard}>
        <Text style={styles.liveTitle}>Livestream:</Text>
        <TouchableOpacity onPress={() => Linking.openURL(livestreamUrl)}>
          <Text style={styles.liveLink}>{livestreamUrl}</Text>
        </TouchableOpacity>

        <View style={styles.videoPlaceholder}>
          <Ionicons name="play" size={52} color="#8B8B8B" />
        </View>
      </View>

      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAddModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Member</Text>
              <TouchableOpacity onPress={closeAddModal}>
                <Ionicons name="close" size={38} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.assignHeader}>
                <Text style={styles.assignTitle}>Assign EchoPaddles:</Text>
                <Text style={styles.assignCount}>
                  {members.length + membersToAdd.length}/6
                </Text>
              </View>

              <View style={styles.memberListBox}>
                {availableMembers.filter((m) => !members.some((cm) => cm.id === m.id)).length === 0 ? (
                  <View style={styles.emptyMembersBox}>
                    <Text style={styles.emptyMembersText}>No available paddlers</Text>
                  </View>
                ) : (
                  <ScrollView
                    style={styles.memberListScroll}
                    contentContainerStyle={styles.memberListScrollContent}
                    showsVerticalScrollIndicator
                    nestedScrollEnabled
                  >
                    {availableMembers.map((member) => {
                      const selected = membersToAdd.some((m) => m.id === member.id);
                      const alreadyInCanoe = members.some((m) => m.id === member.id);

                      if (alreadyInCanoe) return null;

                      return (
                        <TouchableOpacity
                          key={member.id}
                          style={[
                            styles.memberRow,
                            selected && styles.memberRowSelected,
                          ]}
                          onPress={() => toggleMemberToAdd(member)}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.memberRowText}>
                            {member.firstName} {member.lastName}
                          </Text>
                          {selected && (
                            <Ionicons name="checkmark-circle" size={24} color="#F45A24" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
              <View style={styles.modalActionRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={closeAddModal}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={[
                        styles.assignButton,
                        membersToAdd.length === 0 && styles.disabledButton,
                    ]}
                    onPress={addSelectedMembers}
                    disabled={membersToAdd.length === 0}
                    >
                        <Text style={styles.assignButtonText}>Confirm</Text>
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
          <View style={styles.removeModalCard}>
            <View style={styles.removeHeader}>
              <Text style={styles.removeHeaderTitle}>Remove Member?</Text>
              <TouchableOpacity onPress={() => setRemoveModalVisible(false)}>
                <Ionicons name="close" size={34} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.removeBody}>
              <Text style={styles.removeText}>
                Removing{" "}
                <Text style={styles.removeBold}>
                  {selectedMember ? `${selectedMember.firstName} ${selectedMember.lastName}` : ""}
                </Text>{" "}
                cannot be undone. Are you sure you want to remove this paddler?
              </Text>

              <View style={styles.removeButtonsRow}>
                <TouchableOpacity
                  style={styles.removeCancelButton}
                  onPress={() => setRemoveModalVisible(false)}
                >
                  <Text style={styles.removeCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeConfirmButton}
                  onPress={removeSelectedMember}
                >
                  <Text style={styles.removeConfirmText}>Remove</Text>
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
const ORANGE_LIGHT = "#F7A489";
const BLUE = "#3759F0";
const BG = "#F2F2F2";
const CARD = "#DADADA";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    backgroundColor: ORANGE,
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 16,
  },
  removeButton: {
    backgroundColor: ORANGE,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  disabledButton: {
    opacity: 0.55,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  speedText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "900",
    color: "#E31212",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  paddlerCount: {
    fontSize: 15,
    fontWeight: "800",
    color: "#000",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000",
  },
  listContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#CFCFCF",
    paddingBottom: 10,
  },
  scrollArea: {
    maxHeight: 320,
  },
  scrollContent: {
    paddingRight: 4,
    gap: 8,
  },
  memberCard: {
    backgroundColor: CARD,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    minHeight: 92,
    overflow: "hidden",
  },
  memberCardSelected: {
    backgroundColor: "#AEB8E8",
    borderColor: BLUE,
    borderWidth: 4,
  },
  memberTouchable: {
    minHeight: 92,
    paddingHorizontal: 10,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    paddingRight: 12,
  },
  memberAssigned: {
    width: 130,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "900",
    color: "#000",
    textAlign: "left",
  },
  liveCard: {
    marginTop: 12,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D3D3D3",
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  liveTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#111",
    marginBottom: 2,
  },
  liveLink: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2196F3",
    textDecorationLine: "underline",
    marginBottom: 18,
  },
  videoPlaceholder: {
    width: 160,
    height: 120,
    backgroundColor: "#C7C7C7",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  modalCard: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#EFEFEF",
    borderRadius: 6,
    overflow: "hidden",
  },
  modalHeader: {
    height: 74,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#D5D5D5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#000",
    flex: 1,
    textAlign: "center",
    marginLeft: 38,
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
  },
  assignHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  assignTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
  },
  assignCount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
  },
  memberListBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CFCFCF",
    height: 300,
    overflow: "hidden",
  },
  memberListScroll: {
    flex: 1,
  },
  memberListScrollContent: {
    paddingBottom: 0,
  },
  memberRow: {
    minHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#D7D7D7",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  memberRowSelected: {
    backgroundColor: "#FFE4DA",
  },
  memberRowText: {
    fontSize: 16,
    color: "#000",
  },
  emptyMembersBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyMembersText: {
    fontSize: 16,
    color: "#777",
    fontWeight: "600",
  },
  modalActionRow: {
    flexDirection: "row",
  },
  cancelButton: {
    flex: 1,
    height: 58,
    backgroundColor: "#F6A086",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  assignButton: {
    flex: 1,
    height: 58,
    backgroundColor: "#F55321",
    alignItems: "center",
    justifyContent: "center",
  },
  assignButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  confirmButton: {
    alignSelf: "center",
    marginTop: 18,
    width: 180,
    height: 58,
    backgroundColor: "#F55321",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  removeModalCard: {
    width: "100%",
    maxWidth: 410,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
    overflow: "hidden",
  },
  removeHeader: {
    backgroundColor: "#fff",
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D8D8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  removeHeaderTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    marginLeft: 30,
  },
  removeBody: {
    padding: 20,
  },
  removeText: {
    fontSize: 17,
    lineHeight: 26,
    color: "#111",
    marginBottom: 18,
  },
  removeBold: {
    fontWeight: "900",
  },
  removeButtonsRow: {
    flexDirection: "row",
  },
  removeCancelButton: {
    flex: 1,
    height: 54,
    backgroundColor: ORANGE_LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  removeConfirmButton: {
    flex: 1,
    height: 54,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  removeCancelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  removeConfirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});