export type Member = {
  id: string;
  firstName: string;
  lastName: string;
};

export type Canoe = {
  id: string;
  name: string;
  speed: number;
  distance: number;
  paddlers: Member[];
  livestream: string;
};

let allMembers: Member[] = [
  { id: "1", firstName: "Ryan", lastName: "lastName" },
  { id: "2", firstName: "Mark", lastName: "Baldwin" },
  { id: "3", firstName: "Andrew", lastName: "Gutierrez" },
  { id: "4", firstName: "Ariana", lastName: "Grande" },
  { id: "5", firstName: "Brit", lastName: "T" },
];

let canoes: Canoe[] = [];

export function getAllMembers() {
  return allMembers;
}

export function addMember(firstName: string, lastName: string) {
  const newMember: Member = {
    id: Date.now().toString(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
  };

  allMembers = [...allMembers, newMember];
  return newMember;
}

export function removeMember(memberId: string) {
  allMembers = allMembers.filter((m) => m.id !== memberId);

  canoes = canoes.map((canoe) => ({
    ...canoe,
    paddlers: canoe.paddlers.filter((m) => m.id !== memberId),
  }));
}

export function getAllCanoes() {
  return canoes;
}

export function getCanoeById(id: string) {
  return canoes.find((c) => c.id === id) || null;
}

export function addCanoe(name: string, paddlers: Member[] = []) {
  const newCanoe: Canoe = {
    id: Date.now().toString(),
    name,
    speed: 0,
    distance: 0,
    paddlers: paddlers.slice(0, 6),
    livestream: "http://echo.cooperativepaddling.com/",
  };

  canoes = [...canoes, newCanoe];
  return newCanoe;
}

// 🔥 GLOBAL RULE: only unassigned members
export function getUnassignedMembers() {
  const assignedIds = new Set(
    canoes.flatMap((c) => c.paddlers.map((m) => m.id))
  );

  return allMembers.filter((m) => !assignedIds.has(m.id));
}

export function addMemberToCanoe(canoeId: string, member: Member) {
  const alreadyAssigned = canoes.some((canoe) =>
    canoe.paddlers.some((p) => p.id === member.id)
  );

  if (alreadyAssigned) return;

  canoes = canoes.map((canoe) => {
    if (canoe.id !== canoeId) return canoe;

    if (canoe.paddlers.length >= 6) return canoe;

    return {
      ...canoe,
      paddlers: [...canoe.paddlers, member],
    };
  });
}

export function removeMemberFromCanoe(canoeId: string, memberId: string) {
  canoes = canoes.map((canoe) => {
    if (canoe.id !== canoeId) return canoe;

    return {
      ...canoe,
      paddlers: canoe.paddlers.filter((m) => m.id !== memberId),
    };
  });
}