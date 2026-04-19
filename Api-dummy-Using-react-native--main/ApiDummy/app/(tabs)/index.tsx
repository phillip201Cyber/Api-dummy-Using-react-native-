import {
  Canoe,
  Member,
  addCanoe,
  getAllCanoes,
  getAllMembers,
} from "@/data/canoeStore";
import {
  Ionicons,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [canoes, setCanoes] = useState<Canoe[]>(getAllCanoes());
  const [selectedPage, setSelectedPage] = useState(0);
  const [announcementText, setAnnouncementText] = useState("");
  const [selectedRecipient] = useState("RYAN");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newCanoeName, setNewCanoeName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);

  useFocusEffect(
    useCallback(() => {
      setCanoes([...getAllCanoes()]);
    }, [])
  );

  const allMembers = getAllMembers();

  const assignedMemberIds = useMemo(() => {
    return new Set(canoes.flatMap((canoe) => canoe.paddlers.map((p) => p.id)));
  }, [canoes]);

  const availableMembers = useMemo(() => {
    return allMembers.filter(
      (member) =>
        !assignedMemberIds.has(member.id) ||
        selectedMembers.some((m) => m.id === member.id)
    );
  }, [allMembers, assignedMemberIds, selectedMembers]);

const quickAnnouncements = [
  {
    id: "1",
    label: "Paddle!",
    icon: (
      <MaterialCommunityIcons name="kayaking" size={42} color="#000" />
    ),
  },
  {
    id: "2",
    label: "Paddles Up",
    icon: (
      <Image
        source={require("../../assets/images/PaddlesUp_Icon.png")}
        style={{
          width: 42,
          height: 42,
          resizeMode: "contain",
        }}
      />
    ),
  },
  {
    id: "3",
    label: "Hold Water",
    icon: <Ionicons name="hand-left" size={42} color="#000" />,
  },
  {
    id: "4",
    label: "Back Paddle",
    icon: <MaterialCommunityIcons name="rowing" size={42} color="#000" />,
  },
];

  const toggleMemberSelection = (member: Member) => {
    const exists = selectedMembers.some((m) => m.id === member.id);

    if (exists) {
      setSelectedMembers((prev) => prev.filter((m) => m.id !== member.id));
      return;
    }

    if (selectedMembers.length >= 6) return;

    setSelectedMembers((prev) => [...prev, member]);
  };

  const resetModal = () => {
    setNewCanoeName("");
    setSelectedMembers([]);
    setCreateModalVisible(false);
  };

  const createCanoe = () => {
    const trimmedName = newCanoeName.trim();
    if (!trimmedName) return;

    const newCanoe = addCanoe(trimmedName, selectedMembers);
    setCanoes([...getAllCanoes()]);
    resetModal();

    router.push({
      pathname: "/canoe/[id]",
      params: {
        id: newCanoe.id,
        name: newCanoe.name,
      },
    });
  };

  const openCanoe = (canoe: Canoe) => {
    router.push({
      pathname: "/canoe/[id]",
      params: {
        id: canoe.id,
        name: canoe.name,
      },
    });
  };

  const renderPaddlerCircles = (canoe: Canoe) => {
    const icons = [];

    for (let i = 0; i < canoe.paddlers.length; i++) {
      icons.push(
        <View key={`filled-${canoe.id}-${i}`} style={styles.personCircle}>
          <Ionicons name="person-circle-outline" size={44} color="#000" />
        </View>
      );
    }

    if (canoe.paddlers.length < 6) {
      icons.push(
        <TouchableOpacity
          key={`plus-${canoe.id}`}
          style={styles.personCircle}
          activeOpacity={0.85}
          onPress={() => openCanoe(canoe)}
        >
          <Ionicons name="add-circle-outline" size={40} color="#8C8C8C" />
        </TouchableOpacity>
      );
    }

    return icons;
  };

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Aloha!</Text>

        <View style={styles.canoeSection}>
          <View style={styles.canoeSectionHeader}>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => setCanoes([...getAllCanoes()])}
            >
              <Ionicons name="refresh" size={28} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>My Canoes</Text>

            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.canoeRow}
            onMomentumScrollEnd={(e) => {
              const page = Math.round(e.nativeEvent.contentOffset.x / 190);
              setSelectedPage(page);
            }}
          >
            {canoes.map((canoe) => (
              <TouchableOpacity
                key={canoe.id}
                style={styles.canoeCard}
                activeOpacity={0.92}
                onPress={() => openCanoe(canoe)}
              >
                <Text style={styles.canoeName}>{canoe.name}</Text>

                <Text
                  style={[
                    styles.speedLabel,
                    { color: canoe.speed >= 5 ? "#12B930" : "#E11717" },
                  ]}
                >
                  km/h
                </Text>

                <Text
                  style={[
                    styles.speedValue,
                    { color: canoe.speed >= 5 ? "#12B930" : "#E11717" },
                  ]}
                >
                  {canoe.speed}
                </Text>

                <View style={styles.paddlersGrid}>
                  {renderPaddlerCircles(canoe)}
                </View>

                <Text style={styles.distanceTitle}>Distance Traveled:</Text>
                <Text style={styles.distanceValue}>{canoe.distance.toFixed(1)} mi</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.addCanoeCard}
              activeOpacity={0.85}
              onPress={() => setCreateModalVisible(true)}
            >
              <Ionicons name="add-circle-outline" size={46} color="#8C8C8C" />
              <Text style={styles.addCanoeText}>Add New Canoe</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.dotsRow}>
            {Array.from({ length: Math.max(canoes.length + 1, 1) }).map((_, dot) => (
              <View
                key={dot}
                style={[styles.dot, selectedPage === dot && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        <Text style={styles.announcementsTitle}>Quick Announcements</Text>

        <View style={styles.quickRow}>
          {quickAnnouncements.map((item) => (
            <TouchableOpacity key={item.id} style={styles.quickCard} activeOpacity={0.85}>
              <View style={styles.quickIconWrap}>{item.icon}</View>
              <Text style={styles.quickText}>“{item.label}”</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customPanel}>
          <Text style={styles.customPanelTitle}>Custom Announcements</Text>

          <View style={styles.customTopRow}>
            <View style={styles.toColumn}>
              <Text style={styles.toLabel}>To:</Text>
              <TouchableOpacity style={styles.dropdownBox}>
                <Text style={styles.dropdownText}>{selectedRecipient}</Text>
                <Ionicons name="chevron-down" size={22} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputColumn}>
              <TextInput
                value={announcementText}
                onChangeText={(text) => {
                  if (text.length <= 40) setAnnouncementText(text);
                }}
                placeholder="Enter a custom announcement here..."
                placeholderTextColor="#777"
                multiline
                style={styles.announcementInput}
              />
              <Text style={styles.counterText}>{announcementText.length}/40</Text>
            </View>

            <TouchableOpacity style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={createModalVisible}
        transparent
        animationType="fade"
        onRequestClose={resetModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Canoe</Text>
              <TouchableOpacity onPress={resetModal}>
                <Ionicons name="close" size={38} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalField}>
                <Text style={styles.modalLabel}>Canoe Name:</Text>
                <TextInput
                  value={newCanoeName}
                  onChangeText={setNewCanoeName}
                  placeholder="Enter canoe name"
                  placeholderTextColor="#777"
                  style={styles.modalInput}
                />
              </View>

              <View style={styles.assignHeader}>
                <Text style={styles.assignTitle}>Assign EchoPaddles:</Text>
                <Text style={styles.assignCount}>{selectedMembers.length}/6</Text>
              </View>

              <View style={styles.memberListBox}>
                {availableMembers.length === 0 ? (
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
                      const isSelected = selectedMembers.some((m) => m.id === member.id);

                      return (
                        <TouchableOpacity
                          key={member.id}
                          style={[
                            styles.memberRow,
                            isSelected && styles.memberRowSelected,
                          ]}
                          onPress={() => toggleMemberSelection(member)}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.memberRowText}>
                            {member.firstName} {member.lastName}
                          </Text>
                          {isSelected && (
                            <Ionicons name="checkmark-circle" size={24} color="#F45A24" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                )}
              </View>
              <View style={styles.modalActionRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={resetModal}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.assignButton} onPress={createCanoe}>
                    <Text style={styles.assignButtonText}>Confirm</Text>
                    </TouchableOpacity>
                    </View>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const ORANGE = "#F45A24";
const PANEL_DARK = "#0E1830";
const BG = "#F0F1F4";
const CARD = "#FFFFFF";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 30,
    fontWeight: "900",
    color: "#000",
    marginBottom: 8,
  },
  canoeSection: {
    backgroundColor: "#F7F7F8",
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  canoeSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
  },
  selectButton: {
    backgroundColor: ORANGE,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  selectButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  canoeRow: {
    paddingTop: 10,
    paddingBottom: 8,
    gap: 14,
  },
  canoeCard: {
    width: 170,
    backgroundColor: CARD,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  addCanoeCard: {
    width: 170,
    backgroundColor: "#D1D1D1",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addCanoeText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
  },
  canoeName: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
    color: "#000",
    marginBottom: 1,
  },
  speedLabel: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "900",
  },
  speedValue: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 4,
  },
  paddlersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 6,
    rowGap: 4,
    minHeight: 88,
    marginTop: 2,
    marginBottom: 8,
  },
  personCircle: {
    width: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  distanceTitle: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
    color: "#000",
    marginTop: 4,
  },
  distanceValue: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "800",
    color: "#000",
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8D8D8D",
  },
  activeDot: {
    backgroundColor: "#163C7A",
  },
  announcementsTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "900",
    color: "#000",
    marginTop: 10,
    marginBottom: 12,
  },
  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  quickCard: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 126,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  quickIconWrap: {
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  quickText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    textAlign: "center",
  },
  customPanel: {
    marginTop: 20,
    backgroundColor: PANEL_DARK,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  customPanelTitle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
  },
  customTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  toColumn: {
    width: 124,
  },
  toLabel: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
  },
  dropdownBox: {
    height: 38,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111",
  },
  inputColumn: {
    flex: 1,
  },
  announcementInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    minHeight: 128,
    paddingHorizontal: 12,
    paddingTop: 10,
    fontSize: 16,
    color: "#111",
    textAlignVertical: "top",
  },
  counterText: {
    color: "#666",
    fontSize: 15,
    fontWeight: "800",
    position: "absolute",
    right: 10,
    bottom: 8,
  },
  sendButton: {
    width: 100,
    height: 42,
    backgroundColor: ORANGE,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
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
  modalField: {
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    marginBottom: 10,
  },
  modalInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
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
});