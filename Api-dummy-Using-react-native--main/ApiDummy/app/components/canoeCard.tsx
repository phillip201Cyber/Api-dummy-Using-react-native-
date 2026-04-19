import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Canoe } from "@/data/canoeStore";

type Props = {
  canoe: Canoe;
};

export default function CanoeCard({ canoe }: Props) {
  const visibleMembers = canoe.members.slice(0, 5);
  const extraMembers = canoe.members.length - visibleMembers.length;

  return (
    <ThemedView style={styles.card}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <ThemedText type="subtitle">{canoe.name}</ThemedText>
          <ThemedText style={styles.memberCount}>
            {canoe.members.length} member{canoe.members.length === 1 ? "" : "s"}
          </ThemedText>
        </View>

        <Pressable
          style={styles.openButton}
          onPress={() => router.push(`/Canoe/${canoe.id}`)}>
          <ThemedText style={styles.openButtonText}>Open</ThemedText>
        </Pressable>
      </View>

      <View style={styles.avatarRow}>
        {visibleMembers.length === 0 ? (
          <ThemedText style={styles.noMembersText}>No members yet</ThemedText>
        ) : (
          <>
            {visibleMembers.map((member, index) => (
              <View
                key={member.id}
                style={[
                  styles.avatar,
                  index > 0 ? styles.avatarOverlap : undefined,
                ]}>
                <ThemedText style={styles.avatarText}>
                  {member.name?.charAt(0).toUpperCase() || "?"}
                </ThemedText>
              </View>
            ))}

            {extraMembers > 0 && (
              <View style={[styles.avatar, styles.avatarOverlap, styles.extraAvatar]}>
                <ThemedText style={styles.avatarText}>+{extraMembers}</ThemedText>
              </View>
            )}
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D0D7DE",
    gap: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  memberCount: {
    opacity: 0.7,
    marginTop: 4,
  },
  openButton: {
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  openButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 40,
    marginLeft: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  extraAvatar: {
    backgroundColor: "#11181C",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  noMembersText: {
    opacity: 0.6,
  },
});