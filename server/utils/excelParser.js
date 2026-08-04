import xlsx from "xlsx";

export const parseGuestExcel = (filePath) => {
  const workbook = xlsx.readFile(filePath);

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = xlsx.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
  });

  const headerIndex = findHeaderRow(rows);

  if (headerIndex === -1) {
    throw new Error(
      "Could not find Room, Guest and PAX columns."
    );
  }

  const indexes = getIndexes(rows[headerIndex]);

  if (
    indexes.room === -1 ||
    indexes.guest === -1 ||
    indexes.pax === -1
  ) {
    throw new Error(
      "Required columns (Room, Guest, PAX) are missing."
    );
  }

  const guests = [];

  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i];

    const roomNo = String(row[indexes.room] ?? "").trim();
    const guestName = String(row[indexes.guest] ?? "")
  .replace(/,+$/, "")
  .trim();

    const pax = Math.max(
      Number(row[indexes.pax]) || 1,
      1
    );

    if (roomNo === "" || guestName === "") {
      continue;
    }

    // Original Guest
    guests.push({
      roomNo,
      guestName,
      guestNumber: 1,
      generated: false,
    });

    // Generated Guests
    for (let g = 2; g <= pax; g++) {
      guests.push({
        roomNo,
        guestName: `Guest ${g}`,
        guestNumber: g,
        generated: true,
      });
    }
  }

  guests.sort((a, b) => {
    const roomCompare =
      Number(a.roomNo) - Number(b.roomNo);

    if (roomCompare !== 0) return roomCompare;

    return a.guestNumber - b.guestNumber;
  });

  return guests;
};

const findHeaderRow = (rows) => {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].map((c) =>
      String(c).toLowerCase().trim()
    );

    const hasRoom = row.some((c) => c.includes("room"));
    const hasGuest = row.some((c) => c.includes("guest"));
    const hasPax = row.some((c) => c.includes("pax"));

    if (hasRoom && hasGuest && hasPax) {
      return i;
    }
  }

  return -1;
};

const getIndexes = (header) => {
  const lower = header.map((h) =>
    String(h).toLowerCase().trim()
  );

  return {
    room: lower.findIndex((h) => h.includes("room")),

    guest: lower.findIndex((h) => h.includes("guest")),

    pax: lower.findIndex((h) => h.includes("pax")),
  };
};